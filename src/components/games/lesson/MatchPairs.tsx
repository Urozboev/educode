"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { MatchPairsContent } from "@/types";
import { Check, RotateCcw, Zap } from "lucide-react";
import { useI18n } from "@/lib/i18n";

/**
 * Juftliklarni moslashtirish (Wordwall uslubi).
 *
 * Chapda termin, o'ngda ta'rif — o'quvchi bittadan tanlab juftlashtiradi.
 * Sudrab tashlash (drag & drop) o'rniga "bosib tanlash" ishlatilgan: bu
 * telefonda ham, proyektor oldida ham ishonchli ishlaydi va klaviatura bilan
 * boshqarish mumkin.
 *
 * Ball: har to'g'ri juftlik 100, xato urinish uchun 20 ball ayiriladi
 * (0 dan pastga tushmaydi) — shoshib bosaverish foyda bermaydi.
 */

const POINTS_PER_PAIR = 100;
const WRONG_PENALTY = 20;

export type MatchPairsResult = {
  score: number;
  maxScore: number;
  correct: number;
  total: number;
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function MatchPairs({
  content,
  onFinish,
}: {
  content: MatchPairsContent;
  onFinish: (r: MatchPairsResult) => void;
}) {
  const { t } = useI18n();
  const pairs = useMemo(() => content.pairs || [], [content]);
  const total = pairs.length;
  const maxScore = total * POINTS_PER_PAIR;

  // O'ng ustun aralashtiriladi, chap ustun tartibda qoladi
  const [rightOrder, setRightOrder] = useState<number[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [wrongFlash, setWrongFlash] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    setRightOrder(shuffle(pairs.map((_, i) => i)));
    setMatched(new Set());
    setSelectedLeft(null);
    setScore(0);
    setAttempts(0);
  }, [pairs]);

  function pickRight(pairIndex: number) {
    if (selectedLeft === null || matched.has(pairIndex)) return;
    setAttempts(a => a + 1);

    if (pairIndex === selectedLeft) {
      setMatched(m => new Set(m).add(pairIndex));
      setScore(s => s + POINTS_PER_PAIR);
      setSelectedLeft(null);
    } else {
      setScore(s => Math.max(0, s - WRONG_PENALTY));
      setWrongFlash(pairIndex);
      setTimeout(() => setWrongFlash(null), 500);
    }
  }

  function restart() {
    setRightOrder(shuffle(pairs.map((_, i) => i)));
    setMatched(new Set());
    setSelectedLeft(null);
    setScore(0);
    setAttempts(0);
  }

  const allMatched = total > 0 && matched.size === total;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hisob */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <span className="eyebrow">
          Juftlangan <span className="numeric">{matched.size}</span>/<span className="numeric">{total}</span>
        </span>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            Urinish: <span className="numeric">{attempts}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-neon-yellow">
            <Zap className="w-4 h-4" /> <span className="numeric">{score}</span>
          </span>
        </div>
      </div>

      <div className="h-1.5 rounded-full bg-surface overflow-hidden mb-8">
        <motion.div
          className="h-full progress-gradient"
          animate={{ width: `${total ? (matched.size / total) * 100 : 0}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Ikki ustun */}
      <div className="grid grid-cols-2 gap-3 sm:gap-5">
        {/* Chap — terminlar */}
        <div className="space-y-2.5">
          <p className="eyebrow mb-3">Termin</p>
          {pairs.map((p, i) => {
            const isMatched = matched.has(i);
            const isSelected = selectedLeft === i;
            return (
              <button
                key={i}
                disabled={isMatched}
                onClick={() => setSelectedLeft(isSelected ? null : i)}
                className={cn(
                  "w-full text-left p-3.5 rounded-xl border text-sm font-medium transition-all",
                  isMatched && "bg-neon-green/[0.08] border-neon-green/30 text-neon-green",
                  !isMatched && isSelected && "bg-neon-purple/[0.10] border-neon-purple ring-2 ring-neon-purple/30",
                  !isMatched && !isSelected && "bg-card border-border hover:border-neon-purple/40"
                )}
              >
                <span className="flex items-center gap-2">
                  {isMatched && <Check className="w-4 h-4 flex-shrink-0" />}
                  <span>{p.left}</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* O'ng — ta'riflar (aralash) */}
        <div className="space-y-2.5">
          <p className="eyebrow mb-3">Ta&apos;rif</p>
          {rightOrder.map(pairIndex => {
            const p = pairs[pairIndex];
            if (!p) return null;
            const isMatched = matched.has(pairIndex);
            const isWrong = wrongFlash === pairIndex;
            return (
              <button
                key={pairIndex}
                disabled={isMatched || selectedLeft === null}
                onClick={() => pickRight(pairIndex)}
                className={cn(
                  "w-full text-left p-3.5 rounded-xl border text-sm transition-all",
                  isMatched && "bg-neon-green/[0.08] border-neon-green/30 text-neon-green",
                  isWrong && "bg-neon-red/[0.10] border-neon-red animate-pulse",
                  !isMatched && !isWrong && selectedLeft !== null && "bg-card border-border hover:border-neon-purple/40 cursor-pointer",
                  !isMatched && !isWrong && selectedLeft === null && "bg-card/50 border-border/50 text-muted-foreground"
                )}
              >
                <span className="flex items-center gap-2">
                  {isMatched && <Check className="w-4 h-4 flex-shrink-0" />}
                  <span>{p.right}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Doim ko'rinadigan bitta yo'riqnoma — keyingi qadam nima ekani aniq bo'lsin */}
      {!allMatched && (
        <p className="text-center text-sm text-muted-foreground mt-6">
          {selectedLeft === null
            ? t.lg.pickTermLeft
            : `"${pairs[selectedLeft]?.left}" uchun o'ngdan mos ta'rifni bosing`}
        </p>
      )}

      {/* Yakun */}
      <AnimatePresence>
        {allMatched && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-xl bg-neon-green/[0.06] border border-neon-green/25"
          >
            <p className="font-semibold text-neon-green">
              {t.lg.allPairsFound} <span className="numeric">{score}</span> ball
            </p>
            <div className="flex gap-2">
              <button onClick={restart} className="btn-ghost py-2.5 px-5 text-sm inline-flex items-center gap-2">
                <RotateCcw className="w-4 h-4" /> Qaytadan
              </button>
              <button
                onClick={() => onFinish({ score, maxScore, correct: matched.size, total })}
                className="btn-primary py-2.5 px-6 text-sm"
              >
                Yakunlash
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/*
        Yarim yo'lda to'xtash imkoniyati qoladi, lekin u ko'zga tashlanmaydi.
        Ilgari bu "Yakunlash" tugmasi asosiy tugma ko'rinishida turardi va
        o'quvchilar o'yinni tugatmasdan bosib yuborishardi.
      */}
      {!allMatched && matched.size > 0 && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => onFinish({ score, maxScore, correct: matched.size, total })}
            className="text-xs text-muted-foreground hover:text-foreground transition"
          >
            Tugatmasdan chiqish ({matched.size}/{total})
          </button>
        </div>
      )}
    </div>
  );
}
