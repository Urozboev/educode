import type {
  LessonGameType, LessonGameContent,
  QuizRaceContent, JeopardyContent, MatchPairsContent, CrosswordContent,
} from "@/types";

/**
 * Dars o'yinlari uchun umumiy ma'lumotnoma — o'yin sahifasi, ro'yxat va
 * admin formasi shu yerdan foydalanadi.
 */

export const GAME_TYPES: {
  value: LessonGameType;
  label: string;
  hint: string;
  /** Nimaga o'xshashini tanish uchun */
  akin: string;
}[] = [
  {
    value: "quiz_race",
    label: "Tezlik viktorinasi",
    hint: "Vaqtga qarshi savol-javob, ball tezlikka bog'liq",
    akin: "Kahoot uslubi",
  },
  {
    value: "jeopardy",
    label: "Jeopardy taxtasi",
    hint: "Kategoriya × ball kataklari, sinf bilan o'ynash uchun",
    akin: "JeopardyLabs uslubi",
  },
  {
    value: "match_pairs",
    label: "Juftliklarni topish",
    hint: "Termin va ta'rifni moslashtirish",
    akin: "Wordwall uslubi",
  },
  {
    value: "crossword",
    label: "Krossvord",
    hint: "So'z va ta'rif kiritasiz, to'r avtomatik quriladi",
    akin: "Klassik krossvord",
  },
];

export const gameTypeLabel = (t: LessonGameType) =>
  GAME_TYPES.find(g => g.value === t)?.label ?? t;

/** Yangi o'yin uchun bo'sh, lekin ishlaydigan kontent */
export function emptyContent(type: LessonGameType): LessonGameContent {
  switch (type) {
    case "quiz_race":
      return {
        questions: [
          { text: "", seconds: 20, options: [
            { text: "", correct: true },
            { text: "", correct: false },
            { text: "", correct: false },
            { text: "", correct: false },
          ] },
        ],
      } satisfies QuizRaceContent;
    case "jeopardy":
      return {
        categories: [
          { name: "", cells: [100, 200, 300].map(v => ({ value: v, question: "", answer: "" })) },
        ],
      } satisfies JeopardyContent;
    case "match_pairs":
      return { pairs: [{ left: "", right: "" }, { left: "", right: "" }] } satisfies MatchPairsContent;
    case "crossword":
      // To'r saqlashdan oldin `buildCrossword` bilan quriladi
      return { rows: 0, cols: 0, words: [] } satisfies CrosswordContent;
  }
}

/**
 * Nashr qilishdan oldingi tekshiruv. Bo'sh savol yoki to'g'ri javobsiz
 * variant to'plami o'yinni darsda ishlamaydigan holga keltiradi, shuning
 * uchun buni saqlashdan oldin ushlaymiz.
 */
export function validateContent(type: LessonGameType, content: LessonGameContent): string | null {
  if (type === "quiz_race") {
    const c = content as QuizRaceContent;
    if (!c.questions?.length) return "Kamida bitta savol qo'shing";
    for (let i = 0; i < c.questions.length; i++) {
      const q = c.questions[i];
      if (!q.text?.trim()) return `${i + 1}-savol matni bo'sh`;
      const filled = q.options?.filter(o => o.text?.trim()) ?? [];
      if (filled.length < 2) return `${i + 1}-savolda kamida 2 ta variant kerak`;
      if (!filled.some(o => o.correct)) return `${i + 1}-savolda to'g'ri javob belgilanmagan`;
    }
    return null;
  }

  if (type === "jeopardy") {
    const c = content as JeopardyContent;
    if (!c.categories?.length) return "Kamida bitta kategoriya qo'shing";
    for (const cat of c.categories) {
      if (!cat.name?.trim()) return "Kategoriya nomi bo'sh";
      if (!cat.cells?.length) return `"${cat.name}" kategoriyasida katak yo'q`;
      for (const cell of cat.cells) {
        if (!cell.question?.trim() || !cell.answer?.trim()) {
          return `"${cat.name}" kategoriyasida savol yoki javob bo'sh`;
        }
      }
    }
    return null;
  }

  if (type === "crossword") {
    const c = content as CrosswordContent;
    if (!c.words?.length) return "So'zlarni kiriting va to'rni yarating";
    if (c.words.length < 2) return "Krossvord uchun kamida 2 ta so'z kerak";
    return null;
  }

  const c = content as MatchPairsContent;
  const pairs = c.pairs?.filter(p => p.left?.trim() && p.right?.trim()) ?? [];
  if (pairs.length < 2) return "Kamida 2 ta to'liq juftlik kerak";
  return null;
}

/** Saqlashdan oldin bo'sh qatorlarni tashlab yuborish */
export function cleanContent(type: LessonGameType, content: LessonGameContent): LessonGameContent {
  if (type === "quiz_race") {
    const c = content as QuizRaceContent;
    return {
      questions: c.questions
        .filter(q => q.text?.trim())
        .map(q => ({
          text: q.text.trim(),
          seconds: q.seconds || 20,
          options: q.options.filter(o => o.text?.trim()).map(o => ({ text: o.text.trim(), correct: !!o.correct })),
        })),
    };
  }
  if (type === "jeopardy") {
    const c = content as JeopardyContent;
    return {
      categories: c.categories
        .filter(cat => cat.name?.trim())
        .map(cat => ({
          name: cat.name.trim(),
          cells: cat.cells
            .filter(cell => cell.question?.trim() && cell.answer?.trim())
            .map(cell => ({ value: cell.value || 100, question: cell.question.trim(), answer: cell.answer.trim() })),
        })),
    };
  }
  // Krossvord `buildCrossword` natijasi — allaqachon tozalangan
  if (type === "crossword") return content;

  const c = content as MatchPairsContent;
  return {
    pairs: c.pairs
      .filter(p => p.left?.trim() && p.right?.trim())
      .map(p => ({ left: p.left.trim(), right: p.right.trim() })),
  };
}
