/**
 * EduCode AI Agent — dars.
 *
 * POST  { moduleId }                        → dars matni (keshdan yoki yangi)
 * PATCH { lessonId, status, secondsSpent }  → o'qish progressi
 *
 * Dars kontenti umumiy keshda yashaydi, progress esa shaxsiy —
 * ikkisi alohida jadval. Shu bo'linish tufayli bitta dars matni
 * mingta o'quvchiga xizmat qila oladi.
 */

import { NextRequest } from 'next/server';
import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase/server';
import { getAgentAccess, paywallMessage } from '@/lib/agent/access';
import { getOrCreateLesson } from '@/lib/agent/lesson';

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

  const { moduleId } = await req.json().catch(() => ({} as any));
  if (!moduleId) return Response.json({ error: 'Modul tanlanmagan' }, { status: 400 });

  // RLS moduli faqat track egasiga ko'rinadi — egalik shu bilan tekshiriladi
  const { data: mod } = await supabase
    .from('agent_modules')
    .select('id, track_id, order_index, title, topic_key, level, status')
    .eq('id', moduleId)
    .maybeSingle();

  if (!mod) return Response.json({ error: 'Modul topilmadi' }, { status: 404 });

  if (mod.status === 'locked') {
    return Response.json(
      { error: "Bu modul hali ochilmagan. Avvalgilarini tugating.", code: 'locked' },
      { status: 403 },
    );
  }

  const { data: track } = await supabase
    .from('agent_tracks')
    .select('lang')
    .eq('id', mod.track_id)
    .maybeSingle();

  // Oldingi mavzu — dars uni qayta tushuntirmasligi uchun
  const { data: prev } = mod.order_index > 1
    ? await supabase
        .from('agent_modules')
        .select('title')
        .eq('track_id', mod.track_id)
        .eq('order_index', mod.order_index - 1)
        .maybeSingle()
    : { data: null };

  const admin = createAdminClient();

  const { lesson, cached, error, tokensIn, tokensOut } = await getOrCreateLesson(admin, {
    topicKey: mod.topic_key,
    topicTitle: mod.title,
    level: mod.level,
    lang: track?.lang || 'uz',
    previousTopic: prev?.title ?? null,
  });

  // Keshdan kelgan darsga token sarflanmagan — hisobga qo'shmaymiz.
  // Aks holda tannarx hisoboti haqiqatdan ancha yuqori ko'rinardi.
  if (!cached) {
    await supabase.rpc('agent_track_usage', {
      p_user_id: user.id,
      p_tokens_in: tokensIn,
      p_tokens_out: tokensOut,
      p_lessons: 1,
    });
  }

  if (!lesson) return Response.json({ error: error || 'Dars tayyorlanmadi' }, { status: 502 });

  const { data: progress } = await supabase
    .from('agent_lesson_progress')
    .upsert(
      { user_id: user.id, lesson_id: lesson.id, module_id: mod.id, status: 'started' },
      { onConflict: 'user_id,lesson_id', ignoreDuplicates: true },
    )
    .select('status, score, seconds_spent')
    .maybeSingle();

  return Response.json({
    lesson,
    cached,
    module: { id: mod.id, title: mod.title, order_index: mod.order_index, status: mod.status },
    progress: progress ?? null,
  });
}

export async function PATCH(req: NextRequest) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Tizimga kiring' }, { status: 401 });

  const { lessonId, status, secondsSpent } = await req.json().catch(() => ({} as any));
  const allowed = ['started', 'read', 'assessed', 'done'];

  if (!lessonId || !allowed.includes(status)) {
    return Response.json({ error: "Noto'g'ri parametr" }, { status: 400 });
  }

  const patch: Record<string, unknown> = { status };
  if (status === 'done') patch.completed_at = new Date().toISOString();

  if (typeof secondsSpent === 'number' && secondsSpent > 0) {
    const { data: existing } = await supabase
      .from('agent_lesson_progress')
      .select('seconds_spent')
      .eq('user_id', user.id)
      .eq('lesson_id', lessonId)
      .maybeSingle();

    // Qo'shib boramiz: o'quvchi darsni bir necha marta ochishi mumkin
    patch.seconds_spent = (existing?.seconds_spent ?? 0) + Math.min(secondsSpent, 3600);
  }

  const { error } = await supabase
    .from('agent_lesson_progress')
    .update(patch)
    .eq('user_id', user.id)
    .eq('lesson_id', lessonId);

  if (error) return Response.json({ error: error.message }, { status: 500 });

  return Response.json({ ok: true });
}
