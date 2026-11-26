/**
 * MirAcademy AI Agent — Tracker.
 *
 * Agentning "o'zi progressni kuzatadi va rejani o'zgartiradi" degan
 * qismi shu yerda. Test natijasiga qarab uch yo'ldan biri tanlanadi:
 *
 *   >= 70  → o'zlashtirildi, keyingi modul ochiladi
 *   40-69  → yarim tushundi: modul ochiq qoladi, darsni qayta o'qish taklif qilinadi
 *   < 40   → o'zlashtira olmadi: rejaga qo'shimcha amaliyot moduli QO'SHILADI
 *
 * Uchinchi holat muhim: bu yerda reja o'zgarmas ro'yxatdan
 * talabaga javob beradigan narsaga aylanadi.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import { geminiJson } from './gemini';
import { AGENT_REMEDIAL_PROMPT } from './prompts';
import { normalizeTopicKey } from './planner';
import { saveMemoryItems } from './memory';

export const MASTERY_PASS = 70;
export const MASTERY_PARTIAL = 40;

export type TrackerOutcome = 'passed' | 'retry' | 'remedial';

export interface TrackerDecision {
  outcome: TrackerOutcome;
  masteryScore: number;
  /** Ochilgan keyingi modul */
  unlockedId: string | null;
  /** Rejaga qo'shilgan qo'shimcha modul */
  remedialId: string | null;
  remedialTitle: string | null;
  message: string;
  trackCompleted: boolean;
}

interface ModuleRef {
  id: string;
  track_id: string;
  order_index: number;
  title: string;
  topic_key: string;
  level: string;
}

export async function applyAssessmentResult(
  supabase: SupabaseClient,
  params: { userId: string; module: ModuleRef; score: number; lang: string },
): Promise<TrackerDecision> {
  const { userId, module: mod, score, lang } = params;

  // 1. O'zlashtirish darajasi. RPC eski ball bilan aralashtiradi —
  // bitta omadli test mastery'ni 100 ga ko'tarib yubormaydi.
  const { data: mastery } = await supabase.rpc('agent_update_mastery', {
    p_user_id: userId,
    p_topic_key: mod.topic_key,
    p_score: score,
  });

  const masteryScore = typeof mastery === 'number' ? mastery : score;

  /* ---------- 70+ : o'tdi ---------- */
  if (score >= MASTERY_PASS) {
    await supabase.from('agent_modules').update({ status: 'done' }).eq('id', mod.id);

    const { data: next } = await supabase
      .from('agent_modules')
      .select('id, status')
      .eq('track_id', mod.track_id)
      .eq('order_index', mod.order_index + 1)
      .maybeSingle();

    let unlockedId: string | null = null;
    if (next?.status === 'locked') {
      await supabase.from('agent_modules').update({ status: 'active' }).eq('id', next.id);
      unlockedId = next.id;
    }

    if (!next) {
      await supabase.from('agent_tracks').update({ status: 'completed' }).eq('id', mod.track_id);
    }

    return {
      outcome: 'passed',
      masteryScore,
      unlockedId,
      remedialId: null,
      remedialTitle: null,
      trackCompleted: !next,
      message: next
        ? "Ajoyib! Mavzuni özlaştirdingiz, keyingi modul oçildi."
        : "Tabriklaymiz! Butun yönalişni tugatdingiz.",
    };
  }

  /* ---------- 40-69 : yarim ---------- */
  if (score >= MASTERY_PARTIAL) {
    // Modul ochiq qoladi — talaba darsni qayta o'qib, testni
    // qayta topshira oladi. Rejaga aralashmaymiz: bir marta
    // o'rtacha natija ko'rsatish hali qo'shimcha modul talab qilmaydi.
    return {
      outcome: 'retry',
      masteryScore,
      unlockedId: null,
      remedialId: null,
      remedialTitle: null,
      trackCompleted: false,
      message: "Asosini tuşundingiz, lekin baʼzi joylari mustahkam emas. Darsni qayta körib, testni yana bir bor topşiring.",
    };
  }

  /* ---------- <40 : rejaga qo'shimcha modul ---------- */
  const remedial = await generateRemedialModule(mod, lang);

  // Modul "done" bo'ladi — dars o'qilgan, endi navbat amaliyotga.
  // Aks holda ikkita "active" modul paydo bo'lib, talaba qaysi
  // biridan davom etishni bilmay qolardi.
  await supabase.from('agent_modules').update({ status: 'done' }).eq('id', mod.id);

  const { data: remedialId, error } = await supabase.rpc('agent_insert_remedial_module', {
    p_track_id: mod.track_id,
    p_after_index: mod.order_index,
    p_title: remedial.title,
    p_summary: remedial.summary,
    p_topic_key: remedial.topicKey,
    p_level: mod.level,
    p_minutes: remedial.minutes,
  });

  if (error) {
    console.error('[agent/tracker] qo\'shimcha modul qo\'shilmadi:', error.message);
    // Reja o'zgarmadi, lekin baho yozildi — talaba baribir
    // qayta urinishi mumkin
    return {
      outcome: 'retry',
      masteryScore,
      unlockedId: null,
      remedialId: null,
      remedialTitle: null,
      trackCompleted: false,
      message: "Bu mavzu qiyin keldi. Darsni qayta öqib, testni yana topşiring.",
    };
  }

  // Agent suhbatda ham bilib tursin
  await saveMemoryItems(supabase, userId, [
    { kind: 'weakness', content: `"${mod.title}" mavzusi qiyin keldi (${score}%)`, weight: 2 },
  ]);

  return {
    outcome: 'remedial',
    masteryScore,
    unlockedId: null,
    remedialId: (remedialId as string) ?? null,
    remedialTitle: remedial.title,
    trackCompleted: false,
    message: `Bu mavzu qiyin keldi — bu normal holat. Rejangizga qöşimça amaliyot moduli qöşdim: "${remedial.title}".`,
  };
}

/**
 * Qo'shimcha modul tavsifi. LLM ishlamasa ham jarayon to'xtamasin —
 * shuning uchun oddiy zaxira varianti bor.
 */
async function generateRemedialModule(
  mod: ModuleRef,
  lang: string,
): Promise<{ title: string; summary: string; topicKey: string; minutes: number }> {
  const fallback = {
    title: `${mod.title} — amaliyot`,
    summary: "Mavzuni mustahkamlaş uçun qöşimça maşqlar va soddaroq misollar.",
    topicKey: normalizeTopicKey(`${mod.topic_key}.practice`),
    minutes: 25,
  };

  const { data } = await geminiJson<{
    title: string; summary: string; topic_key: string; estimated_minutes: number;
  }>(
    AGENT_REMEDIAL_PROMPT,
    `Mavzu: ${mod.title}\nMavzu kaliti: ${mod.topic_key}\nDaraja: ${mod.level}\nTil: ${
      lang === 'ru' ? 'rus' : lang === 'en' ? 'ingliz' : "o'zbek"
    }\n\nTalaba bu mavzuni özlaştira olmadi. Qöşimça modul tavsifini yoz.`,
    { temperature: 0.7, maxOutputTokens: 1024 },
  );

  if (!data?.title) return fallback;

  return {
    title: String(data.title).slice(0, 200),
    summary: String(data.summary || fallback.summary).slice(0, 500),
    topicKey: normalizeTopicKey(data.topic_key || fallback.topicKey),
    minutes: Math.min(40, Math.max(15, Number(data.estimated_minutes) || 25)),
  };
}
