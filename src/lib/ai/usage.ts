/**
 * EduCode — AI usage helpers (server-side)
 * Kunlik limit, cooldown, va `ai_interactions` log.
 */

import type { SupabaseClient } from '@supabase/supabase-js';

export const DEFAULT_DAILY_LIMIT = 10;
export const COOLDOWN_MINUTES = 30;
export const COOLDOWN_WINDOW_HOURS = 3;
export const COOLDOWN_TRIGGER_THRESHOLD = 8;          // 3 soatda 8+ savol → cooldown

export interface QuotaCheck {
  allowed: boolean;
  reason?: 'limit_reached' | 'cooldown' | 'no_user';
  message?: string;
  remaining: number;
  limit: number;
  used: number;
  cooldownUntil?: string | null;
  warning?: string;
}

/**
 * Kunlik limitni va cooldown holatini tekshiradi (DEKREMENT QILMAYDI).
 */
export async function checkAIQuota(
  supabase: SupabaseClient,
  userId: string,
): Promise<QuotaCheck> {
  // 1. profiles dan limit
  const { data: profile } = await supabase
    .from('profiles')
    .select('ai_daily_limit, role')
    .eq('id', userId)
    .single();

  // O'qituvchi/admin uchun cheksiz
  if (profile?.role && ['teacher', 'admin'].includes(profile.role)) {
    return { allowed: true, remaining: 9999, limit: 9999, used: 0 };
  }

  const limit = profile?.ai_daily_limit ?? DEFAULT_DAILY_LIMIT;
  const today = new Date().toISOString().slice(0, 10);

  // 2. bugungi usage
  const { data: usage } = await supabase
    .from('ai_usage_daily')
    .select('total_queries, cooldown_active, cooldown_until')
    .eq('user_id', userId)
    .eq('date', today)
    .maybeSingle();

  const used = usage?.total_queries ?? 0;
  const remaining = Math.max(0, limit - used);

  // 3. cooldown faol bo'lsa
  if (usage?.cooldown_active && usage.cooldown_until) {
    const until = new Date(usage.cooldown_until);
    if (until > new Date()) {
      return {
        allowed: false,
        reason: 'cooldown',
        message: `Bir oz dam oling. AI yordami ${until.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })} dan keyin yana ochiladi. Shu vaqt ichida mustaqil urinib ko'ring.`,
        remaining,
        limit,
        used,
        cooldownUntil: usage.cooldown_until,
      };
    }
  }

  // 4. limit tugagan
  if (used >= limit) {
    return {
      allowed: false,
      reason: 'limit_reached',
      message: `Bugun AI yordami chegarasiga yetdingiz (${used}/${limit}). Ertaga davom etamiz. Ayni paytda mustaqil urinib ko'ring!`,
      remaining: 0,
      limit,
      used,
    };
  }

  // 5. limit yaqin
  let warning: string | undefined;
  if (remaining > 0 && remaining <= 2) {
    warning = `Yana ${remaining} ta savol qoldi. Mustaqil ishlashga harakat qilmoqchimisiz?`;
  }

  return { allowed: true, remaining, limit, used, warning };
}

/**
 * AI muloqotini log qiladi va counter'ni oshiradi.
 * Cooldown trigger logikasini ham o'z ichiga oladi.
 */
export async function logAIInteraction(
  supabase: SupabaseClient,
  payload: {
    user_id: string;
    interaction_type: 'chat' | 'feedback' | 'mentor' | 'hint' | 'plan_review';
    model_used?: string;
    prompt_template?: string;
    user_query?: string;
    ai_response?: string;
    tokens_input?: number;
    tokens_output?: number;
    code_snapshot?: string;
    error_snapshot?: string;
    topic_id?: string;
    task_id?: string;
    task_type?: 'topic_task' | 'challenge' | 'free_chat' | 'plan_first' | 'hint';
  },
): Promise<{ ok: boolean; cooldownTriggered: boolean }> {
  // Insert ai_interactions
  await supabase.from('ai_interactions').insert(payload);

  // Counter oshirish (RPC)
  await supabase.rpc('increment_ai_usage', { p_user_id: payload.user_id });

  // Cooldown tekshiruv: oxirgi 3 soat ichida 8+ savol bo'lsa
  const since = new Date(Date.now() - COOLDOWN_WINDOW_HOURS * 60 * 60 * 1000).toISOString();
  const { count } = await supabase
    .from('ai_interactions')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', payload.user_id)
    .gte('created_at', since);

  let cooldownTriggered = false;
  if ((count ?? 0) >= COOLDOWN_TRIGGER_THRESHOLD) {
    const cooldownUntil = new Date(Date.now() + COOLDOWN_MINUTES * 60 * 1000).toISOString();
    const today = new Date().toISOString().slice(0, 10);
    await supabase
      .from('ai_usage_daily')
      .update({ cooldown_active: true, cooldown_until: cooldownUntil })
      .eq('user_id', payload.user_id)
      .eq('date', today);
    cooldownTriggered = true;
  }

  return { ok: true, cooldownTriggered };
}

/**
 * Bugun bo'yicha foydalanuvchi statistikasi (UI uchun).
 */
export async function getDailyAIStats(
  supabase: SupabaseClient,
  userId: string,
): Promise<{
  used: number;
  limit: number;
  remaining: number;
  cooldownUntil: string | null;
}> {
  const { data: profile } = await supabase
    .from('profiles')
    .select('ai_daily_limit')
    .eq('id', userId)
    .single();
  const limit = profile?.ai_daily_limit ?? DEFAULT_DAILY_LIMIT;

  const today = new Date().toISOString().slice(0, 10);
  const { data: usage } = await supabase
    .from('ai_usage_daily')
    .select('total_queries, cooldown_until, cooldown_active')
    .eq('user_id', userId)
    .eq('date', today)
    .maybeSingle();

  const used = usage?.total_queries ?? 0;
  const cooldownUntil =
    usage?.cooldown_active && usage.cooldown_until && new Date(usage.cooldown_until) > new Date()
      ? usage.cooldown_until
      : null;

  return { used, limit, remaining: Math.max(0, limit - used), cooldownUntil };
}
