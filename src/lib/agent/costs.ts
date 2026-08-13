/**
 * EduCode AI Agent — tannarx hisobi.
 *
 * Savol oddiy: obuna puli xarajatni qoplayaptimi? Javob esa faqat
 * o'lchov bilan beriladi — shuning uchun har LLM va TTS chaqiruvi
 * `agent_usage_daily` ga yoziladi, bu yerda esa u pulga aylantiriladi.
 *
 * NARXLAR O'ZGARADI. Shuning uchun ular env orqali sozlanadi:
 * provayder tarifini yangilaganda kodga tegish shart emas. Standart
 * qiymatlar — taxminiy mo'ljal, aniq raqamni provayder kabinetidan
 * olib `.env.local` ga yozing.
 */

/** 1 million token uchun narx (USD) */
export const COST_INPUT_PER_M = Number(process.env.AGENT_COST_INPUT_PER_M ?? 0.3);
export const COST_OUTPUT_PER_M = Number(process.env.AGENT_COST_OUTPUT_PER_M ?? 2.5);

/** 1000 belgi TTS uchun narx (USD) */
export const COST_TTS_PER_1K = Number(process.env.AGENT_COST_TTS_PER_1K ?? 0.015);

/** So'mni USD ga o'girish kursi */
export const USD_UZS = Number(process.env.USD_UZS_RATE ?? 12800);

/**
 * Kesh tejagan pulni hisoblash uchun o'rtacha qiymatlar.
 *
 * Bular real o'lchovdan olingan (Gemini Flash, o'zbekcha kontent):
 * dars ~650 in / ~1500 out, test ~400 in / ~1200 out,
 * topshiriq ~600 in / ~650 out. Ular taxmin — shuning uchun
 * hisobotda "taxminiy" deb ko'rsatiladi.
 */
export const AVG_TOKENS = {
  lesson: { in: 650, out: 1500 },
  quiz: { in: 400, out: 1200 },
  task: { in: 600, out: 650 },
} as const;

export type CachedKind = keyof typeof AVG_TOKENS;

export function tokenCostUsd(tokensIn: number, tokensOut: number): number {
  return (tokensIn / 1_000_000) * COST_INPUT_PER_M
       + (tokensOut / 1_000_000) * COST_OUTPUT_PER_M;
}

export function ttsCostUsd(chars: number): number {
  return (chars / 1000) * COST_TTS_PER_1K;
}

export function uzsToUsd(uzs: number): number {
  return USD_UZS > 0 ? uzs / USD_UZS : 0;
}

/**
 * Kesh tufayli tejalgan pul.
 *
 * `hit_count` — keshdan necha marta berilgani. Har bir "hit" bitta
 * generatsiya qilinmagan chaqiruv degani.
 */
export function cacheSavingsUsd(hits: Record<CachedKind, number>): number {
  return (Object.keys(AVG_TOKENS) as CachedKind[]).reduce((sum, kind) => {
    const avg = AVG_TOKENS[kind];
    return sum + (hits[kind] || 0) * tokenCostUsd(avg.in, avg.out);
  }, 0);
}

/** UI da ko'rsatish uchun sozlamalar ro'yxati */
export function pricingSnapshot() {
  return {
    inputPerM: COST_INPUT_PER_M,
    outputPerM: COST_OUTPUT_PER_M,
    ttsPer1k: COST_TTS_PER_1K,
    usdUzs: USD_UZS,
  };
}
