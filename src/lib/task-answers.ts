import type { AnswerField } from "@/types";

/**
 * `answer` turidagi topshiriq javoblarini tekshirish.
 *
 * Qoidalar ataylab yumshoq: talaba to'g'ri javobni boshqacha
 * yozgani uchun yiqilmasligi kerak — "255.255.255.0 " oxiridagi
 * bo'shliq, "Star" va "star", "1,5" va "1.5" bir xil hisoblanadi.
 *
 * Migratsiya generatori (scripts/kontent/kompyuter-tarmoqlari) shu
 * qoidalarni Python'da takrorlaydi va har bir `accept` qiymati o'z
 * maydonidan o'tishini tekshiradi. Bu yerdagi qoida o'zgarsa, u yerda ham
 * o'zgartiring.
 */

/** Apostrof shakllari o'zbekchada turlicha yoziladi: ' ’ ‘ ` ʼ ʻ */
const APOSTROPHES = /[’‘`ʼʻ]/g;

export function normalizeText(s: string): string {
  return s
    .replace(APOSTROPHES, "'")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeIp(s: string): string {
  return s.replace(/\s+/g, "").toLowerCase();
}

export function parseNumber(s: string): number | null {
  const cleaned = s.replace(/\s+/g, "").replace(",", ".");
  if (cleaned === "" || !/^[-+]?\d*\.?\d+(e[-+]?\d+)?$/i.test(cleaned)) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

export function checkField(field: AnswerField, value: string): boolean {
  if (value.trim() === "") return false;
  switch (field.type) {
    case "number": {
      const got = parseNumber(value);
      if (got === null) return false;
      const tol = field.tol ?? 0;
      return field.accept.some((a) => {
        const want = parseNumber(a);
        return want !== null && Math.abs(got - want) <= tol + 1e-9;
      });
    }
    case "ip":
      return field.accept.some((a) => normalizeIp(a) === normalizeIp(value));
    case "choice":
    case "text":
    default:
      return field.accept.some((a) => normalizeText(a) === normalizeText(value));
  }
}

export function checkAnswers(fields: AnswerField[], values: string[]): boolean[] {
  return fields.map((f, i) => checkField(f, values[i] ?? ""));
}
