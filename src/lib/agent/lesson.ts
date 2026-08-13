/**
 * EduCode AI Agent — dars generatsiyasi va keshi.
 *
 * Bu modulning butun mohiyati keshda. Dars kontenti foydalanuvchiga
 * bog'liq emas: "Python sikllari, boshlang'ich daraja, o'zbekcha"
 * darsi hamma uchun bir xil. Shuning uchun u bir marta yoziladi va
 * `agent_lessons` da hammaga xizmat qiladi.
 *
 * 1000 o'quvchi uchun keshsiz 1000 marta to'lardik. Kesh bilan —
 * 1 marta. Agentni foyda keltiradigan mahsulotga aylantiradigan
 * asosiy narsa shu.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import { geminiJson } from './gemini';
import { AGENT_PROMPT_VERSIONS, AGENT_LESSON_PROMPT, buildLessonPrompt } from './prompts';
import { normalizeTopicKey } from './planner';

export interface LessonExample {
  title: string;
  language: string;
  code: string;
  explanation: string;
}

export interface LessonContent {
  title: string;
  content_html: string;
  narration: string;
  examples: LessonExample[];
}

export interface LessonRow extends LessonContent {
  id: string;
  cache_key: string;
  topic_key: string;
  level: string;
  lang: string;
}

/**
 * Kesh kaliti. `prompt_version` shu yerga ataylab kiritilgan:
 * prompt yaxshilanganda eski darslar avtomatik chetlab o'tiladi va
 * yangi versiya yoziladi — qo'lda keshni tozalash kerak bo'lmaydi.
 */
export function buildCacheKey(topicKey: string, level: string, lang: string): string {
  // Kalit shu yerda ham normallashtiriladi, garchi planner uni saqlashda
  // allaqachon tozalagan bo'lsa ham. Sabab: "Python.Loops.FOR" va
  // "python.loops.for" ikki xil kesh yozuvi bo'lib qolsa, kesh
  // jimgina ishlamay qo'yadi — bunday xatoni sezish qiyin, chunki
  // hamma narsa "ishlayapti", faqat hisob ikki barobar oshadi.
  return [
    normalizeTopicKey(topicKey),
    String(level).toLowerCase().trim(),
    String(lang).toLowerCase().trim(),
    AGENT_PROMPT_VERSIONS.lesson,
  ].join('|');
}

/* ---------------- HTML tozalash ---------------- */

const ALLOWED_TAGS = new Set([
  'h3', 'h4', 'p', 'ul', 'ol', 'li', 'strong', 'em', 'b', 'i',
  'code', 'pre', 'br', 'table', 'thead', 'tbody', 'tr', 'td', 'th', 'blockquote',
]);

/**
 * Model kontenti sahifaga `dangerouslySetInnerHTML` bilan qo'yiladi,
 * shuning uchun ruxsat etilgan teglar ro'yxati bo'yicha tozalanadi.
 *
 * Model o'zi zararli kod yozmasa ham, promptga tashqaridan matn
 * tushishi mumkin (mavzu nomi foydalanuvchidan keladi) — ya'ni bu
 * nazariy emas, real yo'l. Barcha atributlar olib tashlanadi:
 * darsda `class` ham, `style` ham kerak emas.
 */
export function sanitizeLessonHtml(html: string): string {
  return String(html)
    // Butun bloklar bilan olib tashlanadigan teglar
    .replace(/<(script|style|iframe|object|embed|svg|form)[\s\S]*?<\/\1>/gi, '')
    .replace(/<\/?(script|style|iframe|object|embed|svg|form)[^>]*>/gi, '')
    // Qolganlari: faqat oq ro'yxatdagi teg, atributsiz
    .replace(/<\/?([a-zA-Z0-9-]+)[^>]*>/g, (match, tag: string) => {
      const name = tag.toLowerCase();
      if (!ALLOWED_TAGS.has(name)) return '';
      return match.startsWith('</') ? `</${name}>` : `<${name}>`;
    })
    .trim();
}

/* ---------------- Generatsiya ---------------- */

export async function generateLesson(
  input: { topicTitle: string; topicKey: string; level: string; lang: string; previousTopic?: string | null },
): Promise<{ lesson: LessonContent | null; error?: string; tokensIn: number; tokensOut: number }> {
  const { data, error, tokensIn, tokensOut } = await geminiJson<LessonContent>(
    AGENT_LESSON_PROMPT,
    buildLessonPrompt(input),
    { temperature: 0.7, maxOutputTokens: 8192 },
  );

  if (!data?.content_html) {
    return { lesson: null, error: error || 'Dars yozilmadi', tokensIn, tokensOut };
  }

  const examples = Array.isArray(data.examples)
    ? data.examples
        .filter((e) => e?.code)
        .slice(0, 5)
        .map((e) => ({
          title: String(e.title || 'Misol').slice(0, 200),
          language: String(e.language || 'text').toLowerCase().slice(0, 30),
          code: String(e.code).slice(0, 4000),
          explanation: String(e.explanation || '').slice(0, 1000),
        }))
    : [];

  return {
    lesson: {
      title: String(data.title || input.topicTitle).slice(0, 200),
      content_html: sanitizeLessonHtml(data.content_html),
      // Ovoz matnida HTML bo'lsa TTS teglarni o'qib beradi
      narration: sanitizeLessonHtml(String(data.narration || ''))
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s{2,}/g, ' ')
        .trim()
        .slice(0, 4000),
      examples,
    },
    tokensIn,
    tokensOut,
  };
}

/**
 * Keshdan oladi, bo'lmasa yozadi.
 *
 * `admin` klienti kerak: `agent_lessons` ga INSERT policy yo'q —
 * dars keshi umumiy resurs, foydalanuvchi unga o'z matnini
 * yozib qo'ya olmasligi kerak.
 */
export async function getOrCreateLesson(
  admin: SupabaseClient,
  params: {
    topicKey: string;
    topicTitle: string;
    level: string;
    lang: string;
    previousTopic?: string | null;
  },
): Promise<{ lesson: LessonRow | null; cached: boolean; error?: string; tokensIn: number; tokensOut: number }> {
  const cacheKey = buildCacheKey(params.topicKey, params.level, params.lang);

  const { data: hit } = await admin
    .from('agent_lessons')
    .select('id, cache_key, topic_key, level, lang, title, content_html, narration, examples, hit_count')
    .eq('cache_key', cacheKey)
    .eq('is_active', true)
    .maybeSingle();

  if (hit) {
    void admin
      .from('agent_lessons')
      .update({ hit_count: (hit.hit_count ?? 0) + 1 })
      .eq('id', hit.id);

    return { lesson: hit as unknown as LessonRow, cached: true, tokensIn: 0, tokensOut: 0 };
  }

  const { lesson, error, tokensIn, tokensOut } = await generateLesson({
    topicTitle: params.topicTitle,
    topicKey: params.topicKey,
    level: params.level,
    lang: params.lang,
    previousTopic: params.previousTopic,
  });

  if (!lesson) return { lesson: null, cached: false, error, tokensIn, tokensOut };

  const { error: insErr } = await admin.from('agent_lessons').insert({
    cache_key: cacheKey,
    topic_key: params.topicKey,
    level: params.level,
    lang: params.lang,
    title: lesson.title,
    content_html: lesson.content_html,
    narration: lesson.narration,
    examples: lesson.examples,
    prompt_version: AGENT_PROMPT_VERSIONS.lesson,
    model: process.env.AGENT_LESSON_MODEL || process.env.AGENT_MODEL || 'gemini-flash-latest',
  });

  // Ikki foydalanuvchi bir vaqtda so'rasa, ikkinchisi UNIQUE'ga
  // uriladi. Bu xato emas: birinchisi yozib bo'lgan, o'shani o'qiymiz.
  if (insErr) {
    const { data: raced } = await admin
      .from('agent_lessons')
      .select('id, cache_key, topic_key, level, lang, title, content_html, narration, examples')
      .eq('cache_key', cacheKey)
      .maybeSingle();

    if (raced) return { lesson: raced as unknown as LessonRow, cached: true, tokensIn, tokensOut };
    return { lesson: null, cached: false, error: insErr.message, tokensIn, tokensOut };
  }

  const { data: saved } = await admin
    .from('agent_lessons')
    .select('id, cache_key, topic_key, level, lang, title, content_html, narration, examples')
    .eq('cache_key', cacheKey)
    .maybeSingle();

  return { lesson: (saved as unknown as LessonRow) ?? null, cached: false, tokensIn, tokensOut };
}
