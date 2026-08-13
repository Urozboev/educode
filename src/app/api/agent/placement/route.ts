/**
 * EduCode AI Agent — kirish testi.
 *
 * POST { action: "generate", direction }  → savollar
 * POST { action: "submit", assessmentId, answers } → daraja va zaif mavzular
 *
 * To'g'ri javoblar mijozga HECH QACHON yuborilmaydi va
 * `agent_assessments` ga ham yozilmaydi — ular `agent_quizzes` da
 * saqlanadi, u jadvalda RLS yoqilgan lekin policy yo'q, ya'ni faqat
 * service role o'qiy oladi.
 *
 * `agent_assessments` egasiga o'qishga ochiq: savollarni javoblari
 * bilan o'sha yerga yozganimizda, foydalanuvchi o'z qatorini Supabase
 * klienti orqali o'qib, javoblarni testdan oldin ko'ra olardi.
 */

import { randomUUID } from 'crypto';
import { NextRequest } from 'next/server';
import { createServerSupabaseClient, createAdminClient, hasServiceRole } from '@/lib/supabase/server';
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

  if (!hasServiceRole()) {
    return Response.json({
      error: "Server sozlamasi to'liq emas: SUPABASE_SERVICE_ROLE_KEY qo'shilmagan.",
    }, { status: 500 });
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

    // Savollar server-only jadvalga. Kirish testi keshlanmaydi —
    // har foydalanuvchiga yangi savol tuziladi, shuning uchun
    // kalit tasodifiy. Jadval bu yerda kesh emas, "sandiq" vazifasida.
    const admin = createAdminClient();
    const { data: quizRow, error: quizErr } = await admin
      .from('agent_quizzes')
      .insert({
        cache_key: `placement|${randomUUID()}`,
        topic_key: 'placement',
        level: 'mixed',
        lang,
        questions,
        prompt_version: AGENT_PROMPT_VERSIONS.placement,
        model: process.env.AGENT_PLANNER_MODEL || process.env.AGENT_MODEL || 'gemini-flash-latest',
      })
      .select('id')
      .single();

    if (quizErr || !quizRow) {
      return Response.json({ error: quizErr?.message || 'Saqlanmadi' }, { status: 500 });
    }

    const { data: row, error: insErr } = await supabase
      .from('agent_assessments')
      .insert({
        user_id: user.id,
        kind: 'placement',
        payload: { direction, lang, quiz_id: quizRow.id, prompt_version: AGENT_PROMPT_VERSIONS.placement },
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

    const admin = createAdminClient();
    const { data: quiz } = await admin
      .from('agent_quizzes')
      .select('questions')
      .eq('id', row.payload?.quiz_id)
      .maybeSingle();

    if (!quiz) return Response.json({ error: 'Test savollari topilmadi' }, { status: 500 });

    const questions = (quiz.questions || []) as PlacementQuestion[];
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
