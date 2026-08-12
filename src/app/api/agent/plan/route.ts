/**
 * EduCode AI Agent — o'quv reja.
 *
 * GET                       → faol reja va modullar
 * POST  { direction, ... }  → yangi reja tuzish
 * PATCH { moduleId, status} → modul holatini o'zgartirish
 *
 * Reja bir marta tuziladi va DB da yashaydi — agent uni har suhbatda
 * qaytadan o'ylab topmaydi. Bu ham xarajat, ham izchillik masalasi:
 * har safar boshqacha reja aytadigan o'qituvchiga ishonib bo'lmaydi.
 */

import { NextRequest } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getAgentAccess, paywallMessage } from '@/lib/agent/access';
import { generatePlan, savePlan, levelFromScore } from '@/lib/agent/planner';
import { saveMemoryItems } from '@/lib/agent/memory';
import type { AgentLevel } from '@/lib/agent/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const LEVELS: AgentLevel[] = ['zero', 'beginner', 'intermediate', 'advanced'];

export async function GET() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Tizimga kiring' }, { status: 401 });

  const { data: track } = await supabase
    .from('agent_tracks')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .maybeSingle();

  if (!track) return Response.json({ track: null, modules: [] });

  const { data: modules } = await supabase
    .from('agent_modules')
    .select('*')
    .eq('track_id', track.id)
    .order('order_index');

  return Response.json({ track, modules: modules || [] });
}

export async function POST(req: NextRequest) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Tizimga kiring' }, { status: 401 });

  const access = await getAgentAccess(supabase, user.id);
  if (!access.allowed) {
    return Response.json({ error: paywallMessage(access), code: access.reason }, { status: 402 });
  }

  const body = await req.json().catch(() => ({} as any));
  const direction = String(body.direction || '').trim();
  const goal = String(body.goal || direction).slice(0, 500);
  const lang = body.lang || 'uz';
  const weeklyHours = Math.min(40, Math.max(1, Number(body.weeklyHours) || 5));
  const targetLevel = LEVELS.includes(body.targetLevel) && body.targetLevel !== 'zero'
    ? body.targetLevel : 'advanced';

  if (!direction) return Response.json({ error: "Yo'nalish tanlanmagan" }, { status: 400 });

  // Daraja: kirish testi natijasi ustuvor, aks holda foydalanuvchi
  // o'zi aytgani. Test bo'lmasa ham reja tuzilaveradi — testni
  // majburiy qilish odamlarni birinchi qadamdayoq to'xtatib qo'yadi.
  let startLevel: AgentLevel = LEVELS.includes(body.startLevel) ? body.startLevel : 'zero';
  let weakTopics: string[] = [];

  if (body.placementId) {
    const { data: placement } = await supabase
      .from('agent_assessments')
      .select('score, payload, answer')
      .eq('id', body.placementId)
      .eq('user_id', user.id)
      .eq('kind', 'placement')
      .maybeSingle();

    if (placement?.score !== null && placement?.score !== undefined) {
      startLevel = levelFromScore(placement.score);
    }
  }

  // Zaif mavzular mastery jadvalidan olinadi: kirish testi ham,
  // keyingi baholashlar ham o'sha yerga tushadi.
  const { data: weak } = await supabase
    .from('agent_mastery')
    .select('topic_key')
    .eq('user_id', user.id)
    .lt('score', 40)
    .limit(8);

  weakTopics = (weak || []).map((w) => w.topic_key);

  const { plan, error, tokensIn, tokensOut } = await generatePlan({
    direction, startLevel, targetLevel, weeklyHours, weakTopics, lang,
  });

  await supabase.rpc('agent_track_usage', {
    p_user_id: user.id,
    p_tokens_in: tokensIn,
    p_tokens_out: tokensOut,
  });

  if (!plan) return Response.json({ error: error || 'Reja tuzilmadi' }, { status: 502 });

  const { trackId, error: saveErr } = await savePlan(supabase, user.id, plan, {
    goal, startLevel, targetLevel, weeklyHours, lang,
  });

  if (!trackId) return Response.json({ error: saveErr || 'Saqlanmadi' }, { status: 500 });

  // Agent suhbatda rejani bilib tursin
  await saveMemoryItems(supabase, user.id, [
    { kind: 'goal', content: `Maqsad: ${goal}`, weight: 3 },
    { kind: 'fact', content: `Boshlang'ich daraja: ${startLevel}`, weight: 2 },
  ]);

  const { data: modules } = await supabase
    .from('agent_modules')
    .select('*')
    .eq('track_id', trackId)
    .order('order_index');

  return Response.json({ trackId, plan: { ...plan, modules: modules || [] } });
}

/**
 * Modul holatini o'zgartiradi. `done` bo'lganda keyingi modul
 * avtomatik ochiladi — o'quvchi qo'lda "keyingisini och" tugmasini
 * qidirmasin.
 */
export async function PATCH(req: NextRequest) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Tizimga kiring' }, { status: 401 });

  const { moduleId, status } = await req.json().catch(() => ({} as any));
  const allowed = ['active', 'done', 'skipped'];
  if (!moduleId || !allowed.includes(status)) {
    return Response.json({ error: "Noto'g'ri parametr" }, { status: 400 });
  }

  // RLS modulni track egasi bo'yicha tekshiradi, lekin keyingi modulni
  // topish uchun track_id baribir kerak
  const { data: mod } = await supabase
    .from('agent_modules')
    .select('id, track_id, order_index')
    .eq('id', moduleId)
    .maybeSingle();

  if (!mod) return Response.json({ error: 'Modul topilmadi' }, { status: 404 });

  const { error } = await supabase
    .from('agent_modules')
    .update({ status })
    .eq('id', moduleId);

  if (error) return Response.json({ error: error.message }, { status: 500 });

  let unlockedId: string | null = null;

  if (status === 'done' || status === 'skipped') {
    const { data: next } = await supabase
      .from('agent_modules')
      .select('id, status')
      .eq('track_id', mod.track_id)
      .eq('order_index', mod.order_index + 1)
      .maybeSingle();

    if (next?.status === 'locked') {
      await supabase.from('agent_modules').update({ status: 'active' }).eq('id', next.id);
      unlockedId = next.id;
    }

    // Oxirgi modul tugadi — butun yo'nalish tugadi
    if (!next) {
      await supabase.from('agent_tracks').update({ status: 'completed' }).eq('id', mod.track_id);
    }
  }

  return Response.json({ ok: true, unlockedId });
}
