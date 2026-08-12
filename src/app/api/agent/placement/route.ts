/**
 * EduCode AI Agent — kirish testi.
 *
 * POST { action: "generate", direction }  → savollar
 * POST { action: "submit", assessmentId, answers } → daraja va zaif mavzular
 *
 * To'g'ri javoblar mijozga HECH QACHON yuborilmaydi: ular
 * `agent_assessments.payload` da serverda qoladi. Aks holda testni
 * DevTools'da ochib ko'rish yetarli bo'lardi va daraja aniqlash
 * ma'nosini yo'qotardi.
 */

import { NextRequest } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getAgentAccess, paywallMessage } from '@/lib/agent/access';
import {
  generatePlacement,
  gradePlacement,
  savePlacementMastery,
  type PlacementQuestion,
} from '@/lib/agent/planner';
import { AGENT_PROMPT_VERSIONS } from '@/lib/agent/prompts';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Tizimga kiring' }, { status: 401 });

  const access = await getAgentAccess(supabase, user.id);
  if (!access.allowed) {
    return Response.json({ error: paywallMessage(access), code: access.reason }, { status: 402 });
  }

  const body = await req.json().catch(() => ({} as any));
  const action = body.action;

  /* ---------------- Savollarni tuzish ---------------- */
  if (action === 'generate') {
    const direction = String(body.direction || '').trim();
    const lang = body.lang || 'uz';

    if (!direction) return Response.json({ error: "Yo'nalish tanlanmagan" }, { status: 400 });

    const { questions, error, tokensIn, tokensOut } = await generatePlacement(direction, lang);
    if (error || !questions.length) {
      return Response.json({ error: error || 'Test tuzilmadi' }, { status: 502 });
    }

    const { data: row, error: insErr } = await supabase
      .from('agent_assessments')
      .insert({
        user_id: user.id,
        kind: 'placement',
        payload: { direction, lang, questions, prompt_version: AGENT_PROMPT_VERSIONS.placement },
      })
      .select('id')
      .single();

    if (insErr || !row) {
      return Response.json({ error: insErr?.message || 'Saqlanmadi' }, { status: 500 });
    }

    await supabase.rpc('agent_track_usage', {
      p_user_id: user.id,
      p_tokens_in: tokensIn,
      p_tokens_out: tokensOut,
    });

    return Response.json({
      assessmentId: row.id,
      direction,
      // `correct` maydoni olib tashlanadi
      questions: questions.map(({ correct, ...q }) => q),
    });
  }

  /* ---------------- Javoblarni baholash ---------------- */
  if (action === 'submit') {
    const assessmentId = body.assessmentId;
    const answers = body.answers as Record<string, string>;

    if (!assessmentId || !answers || typeof answers !== 'object') {
      return Response.json({ error: "Javoblar yuborilmadi" }, { status: 400 });
    }

    const { data: row } = await supabase
      .from('agent_assessments')
      .select('id, payload, score')
      .eq('id', assessmentId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (!row) return Response.json({ error: 'Test topilmadi' }, { status: 404 });
    if (row.score !== null) {
      return Response.json({ error: 'Bu test allaqachon topshirilgan' }, { status: 409 });
    }

    const questions = (row.payload?.questions || []) as PlacementQuestion[];
    const result = gradePlacement(questions, answers);

    await supabase
      .from('agent_assessments')
      .update({
        answer: answers,
        score: result.score,
        feedback: `Daraja: ${result.level}. To'g'ri javoblar: ${result.correctCount}/${result.total}.`,
        graded_by: 'auto',
        graded_at: new Date().toISOString(),
      })
      .eq('id', row.id);

    await savePlacementMastery(supabase, user.id, result);

    return Response.json({ result, direction: row.payload?.direction ?? null });
  }

  return Response.json({ error: "Noma'lum amal" }, { status: 400 });
}
