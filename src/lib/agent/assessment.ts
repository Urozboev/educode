/**
 * EduCode AI Agent — darsdan keyingi test.
 *
 * Savollar dars kabi keshlanadi (`agent_quizzes`), javoblar esa
 * shaxsiy (`agent_assessments`). Ikki narsa alohida turishi kerak:
 * savollar hammaga bir xil, javoblar har kimniki o'ziniki.
 *
 * To'g'ri javoblar mijozga hech qachon yuborilmaydi — `agent_quizzes`
 * da SELECT policy yo'q, faqat server o'qiydi.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import { geminiJson } from './gemini';
import { AGENT_PROMPT_VERSIONS, AGENT_QUIZ_PROMPT } from './prompts';
import { normalizeTopicKey } from './planner';

export interface QuizOption { id: string; text: string }

export interface QuizQuestion {
  id: number;
  question: string;
  difficulty: 'easy' | 'medium' | 'hard';
  options: QuizOption[];
  correct: string;
  explanation: string;
}

/** Mijozga ketadigan ko'rinish — to'g'ri javobsiz */
export type PublicQuizQuestion = Omit<QuizQuestion, 'correct' | 'explanation'>;

const DIFFICULTY_WEIGHT: Record<QuizQuestion['difficulty'], number> = {
  easy: 1, medium: 2, hard: 3,
};

export function buildQuizCacheKey(topicKey: string, level: string, lang: string): string {
  return [
    normalizeTopicKey(topicKey),
    String(level).toLowerCase().trim(),
    String(lang).toLowerCase().trim(),
    AGENT_PROMPT_VERSIONS.quiz,
  ].join('|');
}

export function toPublicQuestions(questions: QuizQuestion[]): PublicQuizQuestion[] {
  return questions.map(({ correct, explanation, ...q }) => q);
}

/* ---------------- Generatsiya va kesh ---------------- */

async function generateQuiz(
  topicTitle: string,
  topicKey: string,
  level: string,
  lang: string,
): Promise<{ questions: QuizQuestion[]; error?: string; tokensIn: number; tokensOut: number }> {
  const { data, error, tokensIn, tokensOut } = await geminiJson<{ questions: QuizQuestion[] }>(
    AGENT_QUIZ_PROMPT,
    `Mavzu: ${topicTitle}\nMavzu kaliti: ${topicKey}\nDaraja: ${level}\nTil: savollar ${
      lang === 'ru' ? 'rus' : lang === 'en' ? 'ingliz' : "o'zbek"
    } tilida.\n\nShu dars bo'yicha test tuz.`,
    { temperature: 0.6, maxOutputTokens: 8192 },
  );

  const questions = (data?.questions || []).filter(
    (q) => q?.question && Array.isArray(q.options) && q.options.length >= 2 && q.correct,
  );

  if (!questions.length) return { questions: [], error: error || 'Test tuzilmadi', tokensIn, tokensOut };

  return { questions, tokensIn, tokensOut };
}

export async function getOrCreateQuiz(
  admin: SupabaseClient,
  params: { topicKey: string; topicTitle: string; level: string; lang: string },
): Promise<{
  quizId: string | null;
  questions: QuizQuestion[];
  cached: boolean;
  error?: string;
  tokensIn: number;
  tokensOut: number;
}> {
  const cacheKey = buildQuizCacheKey(params.topicKey, params.level, params.lang);

  const { data: hit } = await admin
    .from('agent_quizzes')
    .select('id, questions, hit_count')
    .eq('cache_key', cacheKey)
    .eq('is_active', true)
    .maybeSingle();

  if (hit) {
    void admin
      .from('agent_quizzes')
      .update({ hit_count: (hit.hit_count ?? 0) + 1 })
      .eq('id', hit.id);

    return {
      quizId: hit.id,
      questions: hit.questions as QuizQuestion[],
      cached: true,
      tokensIn: 0,
      tokensOut: 0,
    };
  }

  const { questions, error, tokensIn, tokensOut } = await generateQuiz(
    params.topicTitle, params.topicKey, params.level, params.lang,
  );

  if (!questions.length) {
    return { quizId: null, questions: [], cached: false, error, tokensIn, tokensOut };
  }

  const { data: inserted, error: insErr } = await admin
    .from('agent_quizzes')
    .insert({
      cache_key: cacheKey,
      topic_key: normalizeTopicKey(params.topicKey),
      level: params.level,
      lang: params.lang,
      questions,
      prompt_version: AGENT_PROMPT_VERSIONS.quiz,
      model: process.env.AGENT_MODEL || 'gemini-flash-latest',
    })
    .select('id')
    .maybeSingle();

  // Poyga: ikkinchi so'rov UNIQUE'ga uriladi — birinchisi yozganini olamiz
  if (insErr) {
    const { data: raced } = await admin
      .from('agent_quizzes')
      .select('id, questions')
      .eq('cache_key', cacheKey)
      .maybeSingle();

    if (raced) {
      return {
        quizId: raced.id,
        questions: raced.questions as QuizQuestion[],
        cached: true,
        tokensIn, tokensOut,
      };
    }
    return { quizId: null, questions: [], cached: false, error: insErr.message, tokensIn, tokensOut };
  }

  return { quizId: inserted?.id ?? null, questions, cached: false, tokensIn, tokensOut };
}

/* ---------------- Baholash ---------------- */

export interface QuizFeedbackItem {
  id: number;
  given: string | null;
  correct: string;
  isCorrect: boolean;
  explanation: string;
}

export interface QuizResult {
  score: number;
  correctCount: number;
  total: number;
  feedback: QuizFeedbackItem[];
}

/**
 * Kirish testidagi kabi og'irlikka asoslangan: qiyin savolga to'g'ri
 * javob ko'proq ma'no beradi. Shu bilan birga bu ball to'g'ridan-to'g'ri
 * `agent_mastery` ga tushadi, ya'ni keyingi qarorlar asosi bo'ladi.
 */
export function gradeQuiz(
  questions: QuizQuestion[],
  answers: Record<string, string>,
): QuizResult {
  let earned = 0;
  let max = 0;
  let correctCount = 0;
  const feedback: QuizFeedbackItem[] = [];

  for (const q of questions) {
    const weight = DIFFICULTY_WEIGHT[q.difficulty] ?? 1;
    max += weight;

    const given = answers[String(q.id)] ?? null;
    const isCorrect = !!given && given === q.correct;

    if (isCorrect) {
      earned += weight;
      correctCount++;
    }

    feedback.push({
      id: q.id,
      given,
      correct: q.correct,
      isCorrect,
      explanation: q.explanation || '',
    });
  }

  return {
    score: max > 0 ? Math.round((earned / max) * 100) : 0,
    correctCount,
    total: questions.length,
    feedback,
  };
}
