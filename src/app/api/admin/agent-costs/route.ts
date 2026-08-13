/**
 * EduCode AI Agent — tannarx hisoboti (faqat admin).
 *
 * GET ?days=30 → davr bo'yicha xarajat, daromad va kesh tejami
 *
 * NEGA API, TO'G'RIDAN-TO'G'RI SUPABASE EMAS: kesh jadvallari
 * (`agent_quizzes`, `agent_tasks`) server-only — ularda RLS policy
 * yo'q. Mijozdan o'qib bo'lmaydi, shuning uchun yig'ish shu yerda
 * service role bilan bajariladi.
 */

import { NextRequest } from 'next/server';
import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase/server';
import {
  tokenCostUsd, ttsCostUsd, uzsToUsd, cacheSavingsUsd, pricingSnapshot,
} from '@/lib/agent/costs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Tizimga kiring' }, { status: 401 });

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).maybeSingle();

  if (profile?.role !== 'admin') {
    return Response.json({ error: 'Faqat admin uchun' }, { status: 403 });
  }

  const days = Math.min(365, Math.max(1, Number(req.nextUrl.searchParams.get('days')) || 30));
  const since = new Date(Date.now() - days * 86400_000).toISOString().slice(0, 10);

  const admin = createAdminClient();

  const [usageRes, eventsRes, subsRes, lessonsRes, quizzesRes, tasksRes, voiceRes] =
    await Promise.all([
      admin
        .from('agent_usage_daily')
        .select('user_id, date, messages, tokens_in, tokens_out, tts_chars, lessons_generated')
        .gte('date', since),
      admin
        .from('agent_subscription_events')
        .select('amount_uzs, plan, months, status, created_at')
        .eq('status', 'paid')
        .gte('created_at', since),
      admin
        .from('agent_subscriptions')
        .select('plan, status, expires_at'),
      admin.from('agent_lessons').select('hit_count'),
      admin.from('agent_quizzes').select('hit_count'),
      admin.from('agent_tasks').select('hit_count'),
      admin.from('agent_voice_cache').select('hit_count, char_count'),
    ]);

  const usage = usageRes.data || [];

  /* ---------------- Kunlik qator ---------------- */
  const byDate = new Map<string, {
    date: string; messages: number; tokensIn: number; tokensOut: number;
    ttsChars: number; lessons: number; costUsd: number;
  }>();

  for (const row of usage) {
    const key = row.date as string;
    const cur = byDate.get(key) ?? {
      date: key, messages: 0, tokensIn: 0, tokensOut: 0, ttsChars: 0, lessons: 0, costUsd: 0,
    };

    cur.messages += row.messages ?? 0;
    cur.tokensIn += row.tokens_in ?? 0;
    cur.tokensOut += row.tokens_out ?? 0;
    cur.ttsChars += row.tts_chars ?? 0;
    cur.lessons += row.lessons_generated ?? 0;
    cur.costUsd = tokenCostUsd(cur.tokensIn, cur.tokensOut) + ttsCostUsd(cur.ttsChars);

    byDate.set(key, cur);
  }

  const daily = Array.from(byDate.values()).sort((a, b) => a.date.localeCompare(b.date));

  /* ---------------- Foydalanuvchi kesimi ---------------- */
  const byUser = new Map<string, {
    userId: string; messages: number; tokensIn: number; tokensOut: number;
    ttsChars: number; costUsd: number;
  }>();

  for (const row of usage) {
    const key = row.user_id as string;
    const cur = byUser.get(key) ?? {
      userId: key, messages: 0, tokensIn: 0, tokensOut: 0, ttsChars: 0, costUsd: 0,
    };

    cur.messages += row.messages ?? 0;
    cur.tokensIn += row.tokens_in ?? 0;
    cur.tokensOut += row.tokens_out ?? 0;
    cur.ttsChars += row.tts_chars ?? 0;
    cur.costUsd = tokenCostUsd(cur.tokensIn, cur.tokensOut) + ttsCostUsd(cur.ttsChars);

    byUser.set(key, cur);
  }

  // Eng qimmat 20 ta foydalanuvchi — zarar shulardan boshlanadi
  const topUsers = Array.from(byUser.values())
    .sort((a, b) => b.costUsd - a.costUsd)
    .slice(0, 20);

  // Ismlarni alohida so'raymiz: usage jadvalida ular yo'q
  const names = new Map<string, string>();
  if (topUsers.length) {
    const { data: profiles } = await admin
      .from('profiles')
      .select('id, full_name')
      .in('id', topUsers.map((u) => u.userId));

    for (const p of profiles || []) names.set(p.id, p.full_name);
  }

  /* ---------------- Umumiy ---------------- */
  const totals = usage.reduce(
    (acc, r) => ({
      messages: acc.messages + (r.messages ?? 0),
      tokensIn: acc.tokensIn + (r.tokens_in ?? 0),
      tokensOut: acc.tokensOut + (r.tokens_out ?? 0),
      ttsChars: acc.ttsChars + (r.tts_chars ?? 0),
      lessons: acc.lessons + (r.lessons_generated ?? 0),
    }),
    { messages: 0, tokensIn: 0, tokensOut: 0, ttsChars: 0, lessons: 0 },
  );

  const llmCostUsd = tokenCostUsd(totals.tokensIn, totals.tokensOut);
  const ttsCostUsdTotal = ttsCostUsd(totals.ttsChars);
  const costUsd = llmCostUsd + ttsCostUsdTotal;

  const revenueUzs = (eventsRes.data || []).reduce((s, e) => s + (e.amount_uzs ?? 0), 0);
  const revenueUsd = uzsToUsd(revenueUzs);

  /* ---------------- Kesh ---------------- */
  const sumHits = (rows: any[] | null) =>
    (rows || []).reduce((s, r) => s + (r.hit_count ?? 0), 0);

  const cacheHits = {
    lesson: sumHits(lessonsRes.data),
    quiz: sumHits(quizzesRes.data),
    task: sumHits(tasksRes.data),
  };

  // Ovoz keshi alohida: tejam belgilar soni bo'yicha hisoblanadi
  const voiceSavedChars = (voiceRes.data || [])
    .reduce((s, r) => s + (r.hit_count ?? 0) * (r.char_count ?? 0), 0);

  const savingsUsd = cacheSavingsUsd(cacheHits) + ttsCostUsd(voiceSavedChars);

  /* ---------------- Obunalar ---------------- */
  const subs = subsRes.data || [];
  const now = Date.now();
  const activePaid = subs.filter(
    (s) => s.plan !== 'free' && s.status === 'active'
      && (!s.expires_at || new Date(s.expires_at).getTime() > now),
  );

  const activeUserCount = byUser.size;

  return Response.json({
    days,
    since,
    pricing: pricingSnapshot(),
    totals: {
      ...totals,
      llmCostUsd,
      ttsCostUsd: ttsCostUsdTotal,
      costUsd,
      revenueUzs,
      revenueUsd,
      marginUsd: revenueUsd - costUsd,
      // Bitta faol foydalanuvchi qancha turadi — obuna narxi shundan
      // yuqori bo'lishi kerak
      costPerActiveUserUsd: activeUserCount ? costUsd / activeUserCount : 0,
      activeUserCount,
    },
    subscriptions: {
      activePaid: activePaid.length,
      pro: activePaid.filter((s) => s.plan === 'pro').length,
      proPlus: activePaid.filter((s) => s.plan === 'pro_plus').length,
      total: subs.length,
    },
    cache: {
      ...cacheHits,
      voiceHits: (voiceRes.data || []).reduce((s, r) => s + (r.hit_count ?? 0), 0),
      voiceSavedChars,
      savingsUsd,
      cachedEntries: {
        lesson: (lessonsRes.data || []).length,
        quiz: (quizzesRes.data || []).length,
        task: (tasksRes.data || []).length,
        voice: (voiceRes.data || []).length,
      },
    },
    daily,
    topUsers: topUsers.map((u) => ({ ...u, name: names.get(u.userId) || '—' })),
  });
}
