/**
 * EduCode AI Agent — darsdan keyingi test va Tracker.
 *
 * POST { action: "start", moduleId }               → savollar
 * POST { action: "submit", assessmentId, answers } → baho + rejaning o'zgarishi
 *
 * XAVFSIZLIK: savollar `agent_quizzes` da yashaydi — u jadvalda RLS
 * yoqilgan, lekin birorta ham policy yo'q, ya'ni faqat service role
 * o'qiy oladi. `agent_assessments` (shaxsiy, egasiga o'qishga ochiq)
 * da esa faqat `quiz_id` turadi.
 *
 * Agar savollarni javoblari bilan `agent_assessments.payload` ga
 * yozganimizda, foydalanuvchi o'z qatorini Supabase klienti orqali
 * o'qib, to'g'ri javoblarni testdan oldin ko'ra olardi.
 */

import { NextRequest } from 'next/server';
import { createServerSupabaseClient, createAdminClient, hasServiceRole } from '@/lib/supabase/server';
import { getAgentAccess, paywallMessage } from '@/lib/agent/access';
import { getOrCreateQuiz, gradeQuiz, toPublicQuestions, type QuizQuestion } from '@/lib/agent/assessment';
import { applyAssessmentResult } from '@/lib/agent/tracker';
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

  // Savollar server-only jadvalda — service role kalitisiz o'qib ham,
  // yozib ham bo'lmaydi
  if (!hasServiceRole()) {
    return Response.json({
      error: "Server sozlamasi to'liq emas: SUPABASE_SERVICE_ROLE_KEY qo'shilmagan.",
    }, { status: 500 });
  }

  const body = await req.json().catch(() => ({} as any));
  const admin = createAdminClient();

  /* ---------------- Testni boshlash ---------------- */
  if (body.action === 'start') {
    if (!body.moduleId) return Response.json({ error: 'Modul tanlanmagan' }, { status: 400 });

    // RLS: modul faqat track egasiga ko'rinadi
    const { data: mod } = await supabase
      .from('agent_modules')
      .select('id, track_id, order_index, title, topic_key, level, status')
      .eq('id', body.moduleId)
      .maybeSingle();

    if (!mod) return Response.json({ error: 'Modul topilmadi' }, { status: 404 });
    if (mod.status === 'locked') {
      return Response.json({ error: 'Bu modul hali ochilmagan' }, { status: 403 });
    }

    const { data: track } = await supabase
      .from('agent_tracks')
      .select('lang')
      .eq('id', mod.track_id)
      .maybeSingle();

    const { quizId, questions, cached, error, tokensIn, tokensOut } = await getOrCreateQuiz(admin, {
      topicKey: mod.topic_key,
      topicTitle: mod.title,
      level: mod.level,
      lang: track?.lang || 'uz',
    });

    if (!cached) {
      await supabase.rpc('agent_track_usage', {
        p_user_id: user.id,
        p_tokens_in: tokensIn,
        p_tokens_out: tokensOut,
      });
    }

    if (!quizId || !questions.length) {
      return Response.json({ error: error || 'Test tayyorlanmadi' }, { status: 502 });
    }

    const { data: row, error: insErr } = await supabase
      .from('agent_assessments')
      .insert({
        user_id: user.id,
        module_id: mod.id,
        kind: 'quiz',
        // Savollar bu yerda EMAS — faqat havola
        payload: { quiz_id: quizId, prompt_version: AGENT_PROMPT_VERSIONS.quiz },
      })
      .select('id')
      .single();

    if (insErr || !row) {
      return Response.json({ error: insErr?.message || 'Saqlanmadi' }, { status: 500 });
    }

    return Response.json({
      assessmentId: row.id,
      moduleTitle: mod.title,
      questions: toPublicQuestions(questions),
      cached,
    });
  }

  /* ---------------- Javoblarni baholash ---------------- */
  if (body.action === 'submit') {
    const { assessmentId, answers } = body;
    if (!assessmentId || !answers || typeof answers !== 'object') {
      return Response.json({ error: 'Javoblar yuborilmadi' }, { status: 400 });
    }

    const { data: row } = await supabase
      .from('agent_assessments')
      .select('id, module_id, payload, score')
      .eq('id', assessmentId)
      .eq('user_id', user.id)
      .eq('kind', 'quiz')
      .maybeSingle();

    if (!row) return Response.json({ error: 'Test topilmadi' }, { status: 404 });
    if (row.score !== null) {
      return Response.json({ error: 'Bu test allaqachon topshirilgan' }, { status: 409 });
    }

    const { data: quiz } = await admin
      .from('agent_quizzes')
      .select('questions')
      .eq('id', row.payload?.quiz_id)
      .maybeSingle();

    if (!quiz) return Response.json({ error: 'Test savollari topilmadi' }, { status: 500 });

    const result = gradeQuiz(quiz.questions as QuizQuestion[], answers);

    await supabase
      .from('agent_assessments')
      .update({
        answer: answers,
        score: result.score,
        feedback: `${result.correctCount}/${result.total} to'g'ri javob`,
        graded_by: 'auto',
        graded_at: new Date().toISOString(),
      })
      .eq('id', row.id);

    // Tracker: mastery va rejaning o'zgarishi
    const { data: mod } = await supabase
      .from('agent_modules')
      .select('id, track_id, order_index, title, topic_key, level')
      .eq('id', row.module_id)
      .maybeSingle();

    if (!mod) {
      return Response.json({ result, decision: null });
    }

    const { data: track } = await supabase
      .from('agent_tracks')
      .select('lang')
      .eq('id', mod.track_id)
      .maybeSingle();

    const decision = await applyAssessmentResult(supabase, {
      userId: user.id,
      module: mod,
      score: result.score,
      lang: track?.lang || 'uz',
    });

    return Response.json({ result, decision });
  }

  return Response.json({ error: "Noma'lum amal" }, { status: 400 });
}
