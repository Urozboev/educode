/**
 * EduCode AI Agent — amaliy kod topshirig'i.
 *
 * POST { action: "start",  moduleId }                → topshiriq
 * POST { action: "run",    taskId, code, stdin }     → bir marta ishga tushirish
 * POST { action: "submit", assessmentId, code }      → testlarda tekshirish
 *
 * TRACKER'GA TEGMAYDI. Modul holatini test (quiz) hal qiladi, bu
 * esa amaliyot: natija `agent_mastery` ga tushadi, lekin rejani
 * o'zgartirmaydi.
 *
 * Sabab: ikkala bosqich ham rejani o'zgartirsa, bitta modul uchun
 * ikki marta "keyingisini och" yoki ikkita qo'shimcha modul paydo
 * bo'lishi mumkin edi.
 */

import { NextRequest } from 'next/server';
import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase/server';
import { getAgentAccess, paywallMessage } from '@/lib/agent/access';
import {
  getOrCreateTask, gradeSubmission, toPublicTask, type TaskPayload,
} from '@/lib/agent/task';
import { AGENT_PROMPT_VERSIONS } from '@/lib/agent/prompts';
import { runCode } from '@/lib/execute';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** 5 ta test ketma-ket bajariladi — bunga vaqt kerak */
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Tizimga kiring' }, { status: 401 });

  const access = await getAgentAccess(supabase, user.id);
  if (!access.allowed) {
    return Response.json({ error: paywallMessage(access), code: access.reason }, { status: 402 });
  }

  const body = await req.json().catch(() => ({} as any));
  const admin = createAdminClient();

  /* ---------------- Topshiriqni ochish ---------------- */
  if (body.action === 'start') {
    if (!body.moduleId) return Response.json({ error: 'Modul tanlanmagan' }, { status: 400 });

    const { data: mod } = await supabase
      .from('agent_modules')
      .select('id, track_id, title, topic_key, level, status')
      .eq('id', body.moduleId)
      .maybeSingle();

    if (!mod) return Response.json({ error: 'Modul topilmadi' }, { status: 404 });
    if (mod.status === 'locked') {
      return Response.json({ error: 'Bu modul hali ochilmagan' }, { status: 403 });
    }

    const { data: track } = await supabase
      .from('agent_tracks').select('lang').eq('id', mod.track_id).maybeSingle();

    const { taskId, task, cached, error, tokensIn, tokensOut } = await getOrCreateTask(admin, {
      topicKey: mod.topic_key,
      topicTitle: mod.title,
      level: mod.level,
      lang: track?.lang || 'uz',
    });

    if (!cached) {
      await supabase.rpc('agent_track_usage', {
        p_user_id: user.id, p_tokens_in: tokensIn, p_tokens_out: tokensOut,
      });
    }

    if (!taskId || !task) {
      return Response.json({ error: error || 'Topshiriq tayyorlanmadi' }, { status: 502 });
    }

    const { data: row, error: insErr } = await supabase
      .from('agent_assessments')
      .insert({
        user_id: user.id,
        module_id: mod.id,
        kind: 'task',
        payload: { task_id: taskId, prompt_version: AGENT_PROMPT_VERSIONS.task },
      })
      .select('id')
      .single();

    if (insErr || !row) {
      return Response.json({ error: insErr?.message || 'Saqlanmadi' }, { status: 500 });
    }

    return Response.json({
      assessmentId: row.id,
      task: toPublicTask(taskId, task),
      cached,
    });
  }

  /* ---------------- Kodni sinab ko'rish ---------------- */
  if (body.action === 'run') {
    const { taskId, code, stdin } = body;
    if (!taskId || typeof code !== 'string') {
      return Response.json({ error: "Kod yuborilmadi" }, { status: 400 });
    }

    const { data: task } = await admin
      .from('agent_tasks').select('language').eq('id', taskId).maybeSingle();

    if (!task) return Response.json({ error: 'Topshiriq topilmadi' }, { status: 404 });

    const result = await runCode(task.language, code, typeof stdin === 'string' ? stdin : '');
    return Response.json({ result });
  }

  /* ---------------- Topshirish ---------------- */
  if (body.action === 'submit') {
    const { assessmentId, code } = body;
    if (!assessmentId || typeof code !== 'string' || !code.trim()) {
      return Response.json({ error: 'Kod yuborilmadi' }, { status: 400 });
    }

    const { data: row } = await supabase
      .from('agent_assessments')
      .select('id, module_id, payload, score')
      .eq('id', assessmentId)
      .eq('user_id', user.id)
      .eq('kind', 'task')
      .maybeSingle();

    if (!row) return Response.json({ error: 'Topshiriq topilmadi' }, { status: 404 });

    const { data: taskRow } = await admin
      .from('agent_tasks').select('payload').eq('id', row.payload?.task_id).maybeSingle();

    if (!taskRow) return Response.json({ error: 'Topshiriq matni topilmadi' }, { status: 500 });

    const result = await gradeSubmission(taskRow.payload as TaskPayload, code);

    // Bu yerda 409 yo'q: topshiriqni qayta-qayta yuborish MUMKIN.
    // Kod yozishda urinib ko'rish jarayonning bir qismi — testdan
    // farqli o'laroq, bu yerda "bir marta" cheklovi o'rganishga
    // to'sqinlik qilardi. Oxirgi natija saqlanadi.
    await supabase
      .from('agent_assessments')
      .update({
        answer: { code },
        score: result.score,
        feedback: `${result.passedCount}/${result.total} test o'tdi`,
        graded_by: 'judge0',
        graded_at: new Date().toISOString(),
      })
      .eq('id', row.id);

    // Mastery yangilanadi, lekin reja o'zgarmaydi
    const { data: mod } = await supabase
      .from('agent_modules').select('topic_key').eq('id', row.module_id).maybeSingle();

    let masteryScore: number | null = null;
    if (mod?.topic_key) {
      const { data } = await supabase.rpc('agent_update_mastery', {
        p_user_id: user.id,
        p_topic_key: mod.topic_key,
        p_score: result.score,
      });
      masteryScore = typeof data === 'number' ? data : null;
    }

    return Response.json({ result, masteryScore });
  }

  return Response.json({ error: "Noma'lum amal" }, { status: 400 });
}
