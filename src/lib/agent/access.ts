/**
 * EduCode AI Agent — obuna va paywall.
 *
 * Paywall FAQAT shu yerda hal qilinadi va faqat API route ichida
 * chaqiriladi. UI da yashirish yetarli emas: `/api/agent/*` ni
 * to'g'ridan-to'g'ri chaqirib ko'rish juda oson.
 *
 * Mavjud `checkAIQuota` (src/lib/ai/usage.ts) dan alohida: u kunlik
 * kognitiv chegara uchun (talaba AI'ga suyanib qolmasin), bu esa
 * to'lov uchun. Ikkalasi turli maqsad, birlashtirilsa ikkisi ham
 * chalkashadi.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { AgentAccess, AgentPlan } from './types';

/** Obunasiz foydalanuvchi agentni sinab ko'rishi mumkin bo'lgan xabarlar soni */
export const FREE_TRIAL_MESSAGES = 15;

/** Obuna ichidagi kunlik xabar chegarasi — xarajat portlab ketmasligi uchun */
export const DAILY_MESSAGE_CAP: Record<AgentPlan, number> = {
  free: FREE_TRIAL_MESSAGES,
  pro: 120,
  pro_plus: 400,
};

export const PLAN_PRICES_UZS: Record<Exclude<AgentPlan, 'free'>, number> = {
  pro: 49000,
  pro_plus: 99000,
};

/** Uzoqroq muddatga chegirma — obunani uzaytirish arzonroq bo'lsin */
export const MONTH_OPTIONS = [1, 3, 12] as const;
export const MONTH_DISCOUNT: Record<number, number> = { 1: 0, 3: 0.1, 12: 0.2 };

/**
 * To'lov summasi. Narx FAQAT shu yerda hisoblanadi — mijoz yuborgan
 * summaga ishonmaymiz, aks holda 1 so'mga obuna sotib olish mumkin
 * bo'lardi.
 */
export function subscriptionAmount(
  plan: Exclude<AgentPlan, 'free'>,
  months: number,
): number {
  const base = PLAN_PRICES_UZS[plan] * months;
  const discounted = base * (1 - (MONTH_DISCOUNT[months] ?? 0));
  // Provayderlar butun so'm bilan ishlaydi
  return Math.round(discounted / 1000) * 1000;
}

export async function getAgentAccess(
  supabase: SupabaseClient,
  userId: string | null,
): Promise<AgentAccess> {
  if (!userId) {
    return {
      allowed: false, plan: 'free', reason: 'no_user',
      freeRemaining: 0, expiresAt: null, daysLeft: null, isTrial: false,
    };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .maybeSingle();

  // O'qituvchi/admin kontentni tekshirishi kerak — ular uchun to'lov mantiqsiz
  if (profile?.role === 'teacher' || profile?.role === 'admin') {
    return {
      allowed: true, plan: 'pro_plus',
      freeRemaining: null, expiresAt: null, daysLeft: null, isTrial: false,
    };
  }

  const { data: sub } = await supabase
    .from('agent_subscriptions')
    .select('plan, status, free_messages_used, expires_at')
    .eq('user_id', userId)
    .maybeSingle();

  const plan: AgentPlan = (sub?.plan as AgentPlan) ?? 'free';
  const expiresAt = sub?.expires_at ?? null;
  const notExpired = !expiresAt || new Date(expiresAt) > new Date();

  if (plan !== 'free' && sub?.status === 'active' && notExpired) {
    return {
      allowed: true, plan, freeRemaining: null, expiresAt,
      daysLeft: daysUntil(expiresAt), isTrial: false,
    };
  }

  // Obuna muddati tugagan — demo qaytarilmaydi
  if (plan !== 'free' && !notExpired) {
    return {
      allowed: false, plan, reason: 'expired',
      freeRemaining: 0, expiresAt, daysLeft: 0, isTrial: false,
    };
  }

  const used = sub?.free_messages_used ?? 0;
  const remaining = Math.max(0, FREE_TRIAL_MESSAGES - used);

  return {
    allowed: remaining > 0,
    plan: 'free',
    reason: remaining > 0 ? undefined : 'free_limit_reached',
    freeRemaining: remaining,
    expiresAt: null,
    daysLeft: null,
    isTrial: true,
  };
}

/** Obuna tugashiga qolgan to'liq kunlar. Bugun tugasa — 0. */
function daysUntil(iso: string | null): number | null {
  if (!iso) return null;
  const diff = new Date(iso).getTime() - Date.now();
  return Math.max(0, Math.floor(diff / 86400_000));
}

/** Necha kun qolganda ogohlantirish ko'rsatiladi */
export const EXPIRY_WARNING_DAYS = 7;

/**
 * Demo hisoblagichini oshiradi. Faqat obunasiz foydalanuvchi uchun
 * chaqiriladi — pro foydalanuvchida bu qator umuman tegilmaydi.
 */
export async function consumeFreeMessage(
  supabase: SupabaseClient,
  userId: string,
): Promise<void> {
  const { data: existing } = await supabase
    .from('agent_subscriptions')
    .select('free_messages_used')
    .eq('user_id', userId)
    .maybeSingle();

  if (existing) {
    await supabase
      .from('agent_subscriptions')
      .update({ free_messages_used: (existing.free_messages_used ?? 0) + 1 })
      .eq('user_id', userId);
  } else {
    await supabase
      .from('agent_subscriptions')
      .insert({ user_id: userId, plan: 'free', status: 'active', free_messages_used: 1 });
  }
}

/** Kunlik chegara — obunachi ham cheksiz emas */
export async function isOverDailyCap(
  supabase: SupabaseClient,
  userId: string,
  plan: AgentPlan,
): Promise<boolean> {
  const today = new Date().toISOString().slice(0, 10);
  const { data } = await supabase
    .from('agent_usage_daily')
    .select('messages')
    .eq('user_id', userId)
    .eq('date', today)
    .maybeSingle();

  return (data?.messages ?? 0) >= DAILY_MESSAGE_CAP[plan];
}

export function paywallMessage(access: AgentAccess): string {
  switch (access.reason) {
    case 'no_user':
      return 'Agent bilan ishlash uchun tizimga kiring.';
    case 'expired':
      return 'Obunangiz muddati tugadi. Davom etish uchun obunani yangilang.';
    case 'free_limit_reached':
      return `Bepul sinov tugadi (${FREE_TRIAL_MESSAGES} xabar). Agent bilan cheksiz ishlash uchun Pro obunani rasmiylashtiring.`;
    default:
      return 'Agent hozircha mavjud emas.';
  }
}
