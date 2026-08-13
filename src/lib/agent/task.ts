/**
 * EduCode AI Agent — kod topshiriqlari.
 *
 * Dars va test kabi keshlanadi. Farqi: topshiriq javobini model
 * emas, KOD IJROSI baholaydi — o'quvchi kodi test kirishlari bilan
 * ishga tushiriladi va chiqish kutilgan natija bilan solishtiriladi.
 * Shu sababli bu yerda "model xato baholadi" degan muammo yo'q.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import { geminiJson } from './gemini';
import { AGENT_PROMPT_VERSIONS, AGENT_TASK_PROMPT, buildTaskPrompt } from './prompts';
import { normalizeTopicKey } from './planner';
import { runCode, normalizeOutput, JUDGE0_LANG } from '@/lib/execute';

export interface TaskTestCase {
  input: string;
  expected_output: string;
  is_hidden: boolean;
}

export interface TaskPayload {
  title: string;
  description: string;
  language: string;
  starter_code: string;
  solution_code: string;
  test_cases: TaskTestCase[];
  hints: string[];
}

/** Mijozga ketadigan qism — yechim va yashirin testlarsiz */
export interface PublicTask {
  id: string;
  title: string;
  description: string;
  language: string;
  starter_code: string;
  /** Faqat ochiq testlar — ular misol vazifasini bajaradi */
  examples: Array<{ input: string; expected_output: string }>;
  hiddenCount: number;
  hints: string[];
}

/**
 * Mavzuga qarab dasturlash tilini aniqlaydi.
 *
 * `topic_key` planner tomonidan "python.loops.for" ko'rinishida
 * beriladi, shuning uchun birinchi bo'lak odatda tilni bildiradi.
 * Topilmasa python — u eng keng qo'llanadigan boshlang'ich til.
 */
export function inferLanguage(topicKey: string, fallback = 'python'): string {
  const head = normalizeTopicKey(topicKey).split('.')[0];

  const map: Record<string, string> = {
    python: 'python', py: 'python',
    js: 'javascript', javascript: 'javascript', node: 'javascript',
    ts: 'typescript', typescript: 'typescript',
    web: 'javascript', css: 'javascript', html: 'javascript', react: 'javascript',
    cpp: 'cpp', 'c++': 'cpp',
    java: 'java',
    csharp: 'csharp', dotnet: 'csharp',
  };

  const picked = map[head] || fallback;
  // Ijrochi qo'llab-quvvatlamaydigan til tanlanib qolmasin
  return JUDGE0_LANG[picked] ? picked : fallback;
}

export function buildTaskCacheKey(topicKey: string, level: string, lang: string): string {
  return [
    normalizeTopicKey(topicKey),
    String(level).toLowerCase().trim(),
    String(lang).toLowerCase().trim(),
    AGENT_PROMPT_VERSIONS.task,
  ].join('|');
}

export function toPublicTask(id: string, payload: TaskPayload): PublicTask {
  const visible = (payload.test_cases || []).filter((t) => !t.is_hidden);

  return {
    id,
    title: payload.title,
    description: payload.description,
    language: payload.language,
    starter_code: payload.starter_code,
    examples: visible.map((t) => ({ input: t.input, expected_output: t.expected_output })),
    hiddenCount: (payload.test_cases || []).length - visible.length,
    hints: payload.hints || [],
  };
}

/* ---------------- Generatsiya ---------------- */

async function generateTask(
  params: { topicTitle: string; topicKey: string; level: string; language: string; lang: string },
): Promise<{ task: TaskPayload | null; error?: string; tokensIn: number; tokensOut: number }> {
  const { data, error, tokensIn, tokensOut } = await geminiJson<TaskPayload>(
    AGENT_TASK_PROMPT,
    buildTaskPrompt(params),
    { temperature: 0.7, maxOutputTokens: 8192 },
  );

  if (!data?.description || !Array.isArray(data.test_cases) || !data.test_cases.length) {
    return { task: null, error: error || 'Topshiriq tuzilmadi', tokensIn, tokensOut };
  }

  const testCases = data.test_cases
    .filter((t) => t && typeof t.expected_output === 'string')
    .slice(0, 8)
    .map((t) => ({
      input: String(t.input ?? ''),
      expected_output: String(t.expected_output),
      is_hidden: !!t.is_hidden,
    }));

  // Kamida bitta ochiq test kerak — aks holda o'quvchida misol bo'lmaydi
  if (!testCases.some((t) => !t.is_hidden)) {
    testCases[0].is_hidden = false;
  }

  return {
    task: {
      title: String(data.title || params.topicTitle).slice(0, 200),
      description: String(data.description).slice(0, 3000),
      language: params.language,
      starter_code: String(data.starter_code || '').slice(0, 2000),
      solution_code: String(data.solution_code || '').slice(0, 4000),
      test_cases: testCases,
      hints: Array.isArray(data.hints)
        ? data.hints.slice(0, 3).map((h) => String(h).slice(0, 500))
        : [],
    },
    tokensIn,
    tokensOut,
  };
}

/**
 * Namunaviy yechimni testlardan o'tkazib ko'radi.
 *
 * NEGA KERAK: model ba'zan o'zi tuzgan testga mos kelmaydigan
 * yechim yozadi yoki `expected_output` da ortiqcha bo'shliq
 * qoldiradi. Bunday topshiriq keshga tushsa, o'quvchi to'g'ri
 * yechim yozsa ham "test o'tmadi" degan javob oladi va sababini
 * hech qachon topa olmaydi. Shuning uchun keshga faqat o'z
 * yechimidan o'tgan topshiriq yoziladi.
 */
async function validateTask(task: TaskPayload): Promise<{ ok: boolean; reason?: string }> {
  if (!task.solution_code.trim()) return { ok: false, reason: "namunaviy yechim yo'q" };

  for (const test of task.test_cases) {
    const result = await runCode(task.language, task.solution_code, test.input);

    if (result.status !== 'ok') {
      return { ok: false, reason: `yechim ishlamadi: ${result.stderr.slice(0, 120)}` };
    }
    if (normalizeOutput(result.stdout) !== normalizeOutput(test.expected_output)) {
      return {
        ok: false,
        reason: `test mos kelmadi (kirish "${test.input.slice(0, 20)}"): kutilgan "${test.expected_output.slice(0, 30)}", chiqdi "${result.stdout.trim().slice(0, 30)}"`,
      };
    }
  }

  return { ok: true };
}

export async function getOrCreateTask(
  admin: SupabaseClient,
  params: { topicKey: string; topicTitle: string; level: string; lang: string },
): Promise<{
  taskId: string | null;
  task: TaskPayload | null;
  cached: boolean;
  error?: string;
  tokensIn: number;
  tokensOut: number;
}> {
  const cacheKey = buildTaskCacheKey(params.topicKey, params.level, params.lang);

  const { data: hit } = await admin
    .from('agent_tasks')
    .select('id, payload, hit_count')
    .eq('cache_key', cacheKey)
    .eq('is_active', true)
    .maybeSingle();

  if (hit) {
    void admin.from('agent_tasks').update({ hit_count: (hit.hit_count ?? 0) + 1 }).eq('id', hit.id);
    return {
      taskId: hit.id,
      task: hit.payload as TaskPayload,
      cached: true,
      tokensIn: 0,
      tokensOut: 0,
    };
  }

  const language = inferLanguage(params.topicKey);

  const { task, error, tokensIn, tokensOut } = await generateTask({
    topicTitle: params.topicTitle,
    topicKey: params.topicKey,
    level: params.level,
    language,
    lang: params.lang,
  });

  if (!task) return { taskId: null, task: null, cached: false, error, tokensIn, tokensOut };

  const check = await validateTask(task);
  if (!check.ok) {
    console.error('[agent/task] tekshiruvdan o\'tmadi:', check.reason);
    return {
      taskId: null, task: null, cached: false,
      error: `Topshiriq tekshiruvdan o'tmadi (${check.reason})`,
      tokensIn, tokensOut,
    };
  }

  const { data: inserted, error: insErr } = await admin
    .from('agent_tasks')
    .insert({
      cache_key: cacheKey,
      topic_key: normalizeTopicKey(params.topicKey),
      level: params.level,
      lang: params.lang,
      language,
      payload: task,
      prompt_version: AGENT_PROMPT_VERSIONS.task,
      model: process.env.AGENT_MODEL || 'gemini-flash-latest',
    })
    .select('id')
    .maybeSingle();

  if (insErr) {
    const { data: raced } = await admin
      .from('agent_tasks')
      .select('id, payload')
      .eq('cache_key', cacheKey)
      .maybeSingle();

    if (raced) {
      return {
        taskId: raced.id, task: raced.payload as TaskPayload,
        cached: true, tokensIn, tokensOut,
      };
    }
    return { taskId: null, task: null, cached: false, error: insErr.message, tokensIn, tokensOut };
  }

  return { taskId: inserted?.id ?? null, task, cached: false, tokensIn, tokensOut };
}

/* ---------------- Baholash ---------------- */

export interface TestOutcome {
  index: number;
  isHidden: boolean;
  passed: boolean;
  /** Yashirin testda kirish va kutilgan natija ko'rsatilmaydi */
  input?: string;
  expected?: string;
  actual?: string;
  stderr?: string;
}

export interface SubmissionResult {
  score: number;
  passedCount: number;
  total: number;
  outcomes: TestOutcome[];
}

/**
 * O'quvchi kodini barcha testlarda ishga tushiradi.
 *
 * Ketma-ket bajariladi: Judge0 bepul tarifi parallel so'rovlarni
 * cheklaydi va bir vaqtda 5 ta yuborilsa rate-limit'ga uriladi.
 */
export async function gradeSubmission(
  task: TaskPayload,
  code: string,
): Promise<SubmissionResult> {
  const outcomes: TestOutcome[] = [];
  let passedCount = 0;

  for (let i = 0; i < task.test_cases.length; i++) {
    const test = task.test_cases[i];
    const result = await runCode(task.language, code, test.input);

    const actual = normalizeOutput(result.stdout);
    const expected = normalizeOutput(test.expected_output);
    const passed = result.status === 'ok' && actual === expected;

    if (passed) passedCount++;

    outcomes.push({
      index: i + 1,
      isHidden: test.is_hidden,
      passed,
      // Yashirin test tafsilotlari berilmaydi — aks holda ularni
      // birma-bir "ochib", yechim o'rniga javoblarni yozib chiqish mumkin
      ...(test.is_hidden
        ? {}
        : { input: test.input, expected: test.expected_output, actual: result.stdout }),
      ...(result.stderr ? { stderr: result.stderr.slice(0, 500) } : {}),
    });
  }

  const total = task.test_cases.length;

  return {
    score: total > 0 ? Math.round((passedCount / total) * 100) : 0,
    passedCount,
    total,
    outcomes,
  };
}
