"use client";

import { motion } from "framer-motion";
import { Play, Keyboard } from "lucide-react";
import type { LessonGameType } from "@/types";
import { useI18n } from "@/lib/i18n";
import type { Dictionary } from "@/lib/i18n/dictionaries/uz";

/**
 * O'yin oldidan chiqadigan qoidalar ekrani.
 *
 * Ilgari o'yin darhol boshlanardi: o'quvchi nima qilishni tushunmasdan
 * taymer ishlab ketardi, birinchi savol esa deyarli har doim yo'qotilardi.
 * Endi qoidalar ko'rsatiladi va o'yinni foydalanuvchi o'zi boshlaydi.
 *
 * Matn qisqa: uch qatordan oshsa hech kim o'qimaydi.
 */

export interface GameRules {
  /** Bir jumlada: o'yin nima haqida */
  summary: string;
  /** 2-4 ta qisqa qoida */
  steps: string[];
  /** Klaviatura yorliqlari (bo'lsa) */
  keys?: { key: string; action: string }[];
}

export const GAME_RULES = (t: Dictionary): Record<LessonGameType, GameRules> => ({
  quiz_race: {
    summary: t.lg.quizDesc,
    steps: [
      t.lg.quizRule1,
      t.lg.quizRule2,
      t.lg.quizRule3,
    ],
    keys: [
      { key: "1 – 4", action: "variant tanlash" },
      { key: "Enter", action: "keyingi savol" },
    ],
  },
  match_pairs: {
    summary: t.lg.matchDesc,
    steps: [
      t.lg.matchRule1,
      "Har to'g'ri juftlik 100 ball",
      "Xato urinish 20 ball ayiradi — shoshilmang",
    ],
  },
  jeopardy: {
    summary: t.lg.jeopardyDesc,
    steps: [
      t.lg.jeopardyRule1,
      t.lg.jeopardyRule2,
      t.lg.jeopardyRule3,
    ],
  },
  crossword: {
    summary: t.lg.crosswordDesc,
    steps: [
      t.lg.crosswordRule1,
      t.lg.crosswordRule2,
      "Har to'liq so'z 100 ball; yordam ishlatilgan so'z 50 ball",
    ],
    keys: [
      { key: "← ↑ → ↓", action: "kataklar bo'ylab yurish" },
      { key: "Backspace", action: "o'chirib orqaga qaytish" },
    ],
  },
});

export function GameIntro({
  type,
  title,
  onStart,
}: {
  type: LessonGameType;
  title: string;
  onStart: () => void;
}) {
  const { t } = useI18n();
  const rules = GAME_RULES(t)[type];
  if (!rules) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-lg mx-auto text-center py-6"
    >
      <p className="text-lg text-balance leading-relaxed mb-7">{rules.summary}</p>

      <ol className="text-left space-y-2.5 mb-7">
        {rules.steps.map((s, i) => (
          <li key={i} className="flex gap-3 text-sm">
            <span className="numeric flex-shrink-0 w-6 h-6 rounded-lg bg-neon-purple/10 text-neon-purple flex items-center justify-center text-xs font-bold">
              {i + 1}
            </span>
            <span className="text-muted-foreground leading-relaxed pt-0.5">{s}</span>
          </li>
        ))}
      </ol>

      {rules.keys && (
        <div className="hidden sm:flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mb-7 pb-7 border-b border-border/50">
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Keyboard className="w-3.5 h-3.5" /> Klaviatura:
          </span>
          {rules.keys.map(k => (
            <span key={k.key} className="text-xs text-muted-foreground">
              <kbd className="px-1.5 py-0.5 rounded border border-border bg-surface font-mono text-[11px] mr-1.5">
                {k.key}
              </kbd>
              {k.action}
            </span>
          ))}
        </div>
      )}

      <button
        onClick={onStart}
        className="btn-primary py-3 px-8 text-sm inline-flex items-center gap-2"
        autoFocus
      >
        <Play className="w-4 h-4" /> Boshlash
      </button>

      <p className="sr-only">{title} o&apos;yini</p>
    </motion.div>
  );
}
