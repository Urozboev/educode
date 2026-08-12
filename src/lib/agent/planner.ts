/**
 * EduCode AI Agent — Planner.
 *
 * Ikki qadam:
 *   1. Kirish testi → hozirgi daraja va zaif mavzular
 *   2. Reja → `agent_tracks` + `agent_modules`
 *
 * Reja BIR MARTA generatsiya qilinadi va DB da yashaydi. Har suhbatda
 * qayta so'ralmaydi: aks holda agent har safar boshqacha reja aytib,
 * o'quvchini adashtirardi. Reja o'zgarishi faqat baholash natijasiga
 * ko'ra bo'ladi (Tracker bosqichi).
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { AgentLevel } from './types';
import { geminiJson } from './gemini';
import {
  AGENT_PLACEMENT_PROMPT,
  AGENT_PLANNER_PROMPT,
  buildPlannerPrompt,
  type PlannerInput,
} from './prompts';

/* ---------------- Kirish testi ---------------- */

export interface PlacementOption { id: string; text: string }

export interface PlacementQuestion {
  id: number;
  question: string;
  topic_key: string;
  difficulty: 'easy' | 'medium' | 'hard';
  options: PlacementOption[];
  correct: string;
}

/** Savol qiyinligiga qarab ball. Qiyin savolga to'g'ri javob ko'proq ma'no beradi. */
const DIFFICULTY_WEIGHT: Record<PlacementQuestion['difficulty'], number> = {
  easy: 1, medium: 2, hard: 3,
};

export async function generatePlacement(
  direction: string,
  lang = 'uz',
): Promise<{ questions: PlacementQuestion[]; error?: string; tokensIn: number; tokensOut: number }> {
  const { data, error, tokensIn, tokensOut } = await geminiJson<{ questions: PlacementQuestion[] }>(
    AGENT_PLACEMENT_PROMPT,
    `Yo'nalish: ${direction}\nTil: savollar ${lang === 'ru' ? 'rus' : lang === 'en' ? 'ingliz' : "o'zbek"} tilida.\n\nDaraja aniqlash testini tuz.`,
    // 8 ta savol + variantlar + kod parchalari — 3072 token yetmadi
    // va javob yarim JSON bo'lib keldi. Zaxira bilan olamiz.
    { temperature: 0.6, maxOutputTokens: 8192 },
  );

  const questions = (data?.questions || []).filter(
    (q) => q?.question && Array.isArray(q.options) && q.options.length >= 2 && q.correct,
  );

  if (!questions.length) {
    return { questions: [], error: error || 'Test tuzilmadi', tokensIn, tokensOut };
  }

  return { questions, tokensIn, tokensOut };
}

export interface PlacementResult {
  score: number;              // 0-100
  level: AgentLevel;
  correctCount: number;
  total: number;
  weakTopics: string[];
  strongTopics: string[];
}

/**
 * Testni baholaydi.
 *
 * Ball foizi emas, og'irlikka asoslangan: 8 ta oson savolga to'g'ri
 * javob bergan odam bilan 2 ta qiyin savolni yechgan odam bir xil
 * darajaga tushmasligi kerak.
 */
export function gradePlacement(
  questions: PlacementQuestion[],
  answers: Record<string, string>,
): PlacementResult {
  let earned = 0;
  let max = 0;
  let correctCount = 0;
  const weakTopics: string[] = [];
  const strongTopics: string[] = [];

  for (const q of questions) {
    const weight = DIFFICULTY_WEIGHT[q.difficulty] ?? 1;
    max += weight;

    const given = answers[String(q.id)];
    if (given && given === q.correct) {
      earned += weight;
      correctCount++;
      strongTopics.push(q.topic_key);
    } else {
      weakTopics.push(q.topic_key);
    }
  }

  const score = max > 0 ? Math.round((earned / max) * 100) : 0;

  return {
    score,
    level: levelFromScore(score),
    correctCount,
    total: questions.length,
    // Bir xil topic_key takrorlanmasin
    weakTopics: Array.from(new Set(weakTopics)),
    strongTopics: Array.from(new Set(strongTopics)),
  };
}

/**
 * Chegaralar ataylab past qo'yilgan: o'quvchini haqiqiy darajasidan
 * yuqoriga chiqarib yuborgandan ko'ra, biroz pastdan boshlagan
 * ma'qul — birinchi darslar oson kelsa, u davom etadi; juda qiyin
 * kelsa, tashlab ketadi.
 */
export function levelFromScore(score: number): AgentLevel {
  if (score < 15) return 'zero';
  if (score < 40) return 'beginner';
  if (score < 70) return 'intermediate';
  return 'advanced';
}

/** Test javoblarini mastery jadvaliga yozadi — Tracker keyin shundan foydalanadi */
export async function savePlacementMastery(
  supabase: SupabaseClient,
  userId: string,
  result: PlacementResult,
): Promise<void> {
  const rows = [
    ...result.strongTopics.map((t) => ({ topic: t, score: 70 })),
    ...result.weakTopics.map((t) => ({ topic: t, score: 20 })),
  ];

  // Ketma-ket: 8 ta qator, parallel qilishga arzimaydi
  for (const row of rows) {
    await supabase.rpc('agent_update_mastery', {
      p_user_id: userId,
      p_topic_key: row.topic,
      p_score: row.score,
    });
  }
}

/* ---------------- Reja ---------------- */

export interface PlannedModule {
  order_index: number;
  title: string;
  summary: string;
  topic_key: string;
  level: AgentLevel;
  estimated_minutes: number;
}

export interface GeneratedPlan {
  title: string;
  summary: string;
  modules: PlannedModule[];
}

const MIN_MODULES = 6;
const MAX_MODULES = 24;

export async function generatePlan(
  input: PlannerInput,
): Promise<{ plan: GeneratedPlan | null; error?: string; tokensIn: number; tokensOut: number }> {
  const { data, error, tokensIn, tokensOut } = await geminiJson<GeneratedPlan>(
    AGENT_PLANNER_PROMPT,
    buildPlannerPrompt(input),
    { temperature: 0.7, maxOutputTokens: 4096 },
  );

  if (!data?.modules?.length) {
    return { plan: null, error: error || 'Reja tuzilmadi', tokensIn, tokensOut };
  }

  // Model tartibni buzsa yoki maydonni tashlab ketsa — o'zimiz to'g'rilaymiz.
  // Reja DB ga yozilgandan keyin tuzatish qiyinroq bo'ladi.
  const modules = data.modules
    .filter((m) => m?.title && m?.topic_key)
    .slice(0, MAX_MODULES)
    .map((m, i) => ({
      order_index: i + 1,
      title: String(m.title).slice(0, 200),
      summary: String(m.summary || '').slice(0, 500),
      topic_key: normalizeTopicKey(m.topic_key),
      level: (['zero', 'beginner', 'intermediate', 'advanced'] as const).includes(m.level as any)
        ? (m.level as AgentLevel)
        : 'beginner',
      estimated_minutes: clamp(Number(m.estimated_minutes) || 30, 10, 180),
    }));

  if (modules.length < MIN_MODULES) {
    return { plan: null, error: `Reja juda qisqa chiqdi (${modules.length} modul)`, tokensIn, tokensOut };
  }

  return {
    plan: {
      title: String(data.title || input.direction).slice(0, 200),
      summary: String(data.summary || '').slice(0, 1000),
      modules,
    },
    tokensIn,
    tokensOut,
  };
}

/**
 * topic_key dars keshining kaliti — shuning uchun u barqaror va
 * bashorat qilinadigan bo'lishi kerak. Model ba'zan bosh harf yoki
 * bo'shliq bilan qaytaradi; shu holatda bir xil mavzu ikki xil
 * kalit oladi va kesh ishlamay qoladi.
 */
export function normalizeTopicKey(raw: string): string {
  return String(raw)
    .toLowerCase()
    .trim()
    .replace(/[\s_/]+/g, '.')
    .replace(/[^a-z0-9.]/g, '')
    .replace(/\.{2,}/g, '.')
    .replace(/^\.|\.$/g, '')
    .split('.')
    .slice(0, 3)
    .join('.') || 'general';
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

/**
 * Rejani DB ga yozadi. Bitta faol track qoidasi: yangi reja tuzilganda
 * eskisi `paused` bo'ladi, o'chirilmaydi — o'quvchi keyin qaytib
 * kelishi mumkin va progressi yo'qolmasin.
 */
export async function savePlan(
  supabase: SupabaseClient,
  userId: string,
  plan: GeneratedPlan,
  meta: { goal: string; startLevel: AgentLevel; targetLevel: string; weeklyHours: number; lang: string },
): Promise<{ trackId: string | null; error?: string }> {
  await supabase
    .from('agent_tracks')
    .update({ status: 'paused' })
    .eq('user_id', userId)
    .eq('status', 'active');

  const { data: track, error: trackErr } = await supabase
    .from('agent_tracks')
    .insert({
      user_id: userId,
      title: plan.title,
      goal: meta.goal,
      start_level: meta.startLevel,
      target_level: meta.targetLevel,
      weekly_hours: meta.weeklyHours,
      status: 'active',
      lang: meta.lang,
    })
    .select('id')
    .single();

  if (trackErr || !track) return { trackId: null, error: trackErr?.message || 'Track yaratilmadi' };

  const { error: modErr } = await supabase.from('agent_modules').insert(
    plan.modules.map((m) => ({
      track_id: track.id,
      order_index: m.order_index,
      title: m.title,
      summary: m.summary,
      topic_key: m.topic_key,
      level: m.level,
      estimated_minutes: m.estimated_minutes,
      // Birinchi modul darrov ochiladi — o'quvchi rejani ko'rgan
      // zahoti boshlay olsin, qo'shimcha tugma bosmasin
      status: m.order_index === 1 ? 'active' : 'locked',
    })),
  );

  if (modErr) {
    // Modullarsiz track ma'nosiz — orqaga qaytaramiz, aks holda
    // foydalanuvchida bo'sh reja qolib ketadi
    await supabase.from('agent_tracks').delete().eq('id', track.id);
    return { trackId: null, error: modErr.message };
  }

  return { trackId: track.id };
}
