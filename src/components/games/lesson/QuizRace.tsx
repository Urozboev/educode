"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { QuizRaceContent } from "@/types";
import { Check, X, Zap, Clock } from "lucide-react";

/**
 * Tezlik viktorinasi (Kahoot uslubi).
 *
 * Ball tezlikka bog'liq: to'g'ri javob 500 ball + qolgan vaqtdan 500 gacha bonus.
 * Shu sababli hamma to'g'ri javob bergan sinfda ham reyting hosil bo'ladi.
 * Javob variantlari doim to'rtta rang-shakl bilan — proyektorda uzoqdan ham
 * ajratib bo'ladi va o'quvchi "ko'k uchburchak" deb aytishi mumkin.
 */

/**
 * Ranglar oq matn bilan WCAG AA (4.5:1) dan o'tadigan qilib to'yintirilgan.
 * Yorqinroq "o'yin" ranglari chiroyliroq ko'rinsa-da, proyektorda rang yuvilib
 * ketadi va orqa qatordagi o'quvchi matnni o'qiy olmaydi.
 */
const SHAPES = [
  { cls: "bg-[#CE2E4B]", label: "▲" }, // 5.1:1
  { cls: "bg-[#1668C4]", label: "◆" }, // 5.5:1
  { cls: "bg-[#9A6100]", label: "●" }, // 5.1:1
  { cls: "bg-[#0B7A45]", label: "■" }, // 5.4:1
];

const BASE_POINTS = 500;
const SPEED_BONUS = 500;

export type QuizRaceResult = {
  score: number;
  maxScore: number;
  correct: number;
  total: number;
};

export function QuizRace({
  content,
  onFinish,
}: {
  content: QuizRaceContent;
  onFinish: (r: QuizRaceResult) => void;
}) {
  const questions = content.questions || [];
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [left, setLeft] = useState(questions[0]?.seconds ?? 20);
  const [phase, setPhase] = useState<"play" | "reveal">("play");

  const q = questions[idx];
  const total = questions.length;
  const maxScore = total * (BASE_POINTS + SPEED_BONUS);

  // Javob berilgach yoki vaqt tugagach javoblar ochiladi
  const reveal = useCallback((choice: number | null, remaining: number) => {
    setPhase("reveal");
    setPicked(choice);
    if (choice !== null && q?.options[choice]?.correct) {
      const bonus = Math.round((remaining / (q.seconds || 1)) * SPEED_BONUS);
      setScore(s => s + BASE_POINTS + bonus);
      setCorrect(c => c + 1);
    }
  }, [q]);

  // Taymer
  const revealRef = useRef(reveal);
  revealRef.current = reveal;
  useEffect(() => {
    if (phase !== "play") return;
    if (left <= 0) { revealRef.current(null, 0); return; }
    const t = setTimeout(() => setLeft(v => v - 1), 1000);
    return () => clearTimeout(t);
  }, [left, phase]);

  const next = useCallback(() => {
    if (idx + 1 >= total) {
      onFinish({ score, maxScore, correct, total });
      return;
    }
    const n = idx + 1;
    setIdx(n);
    setPicked(null);
    setPhase("play");
    setLeft(questions[n]?.seconds ?? 20);
  }, [idx, total, onFinish, score, maxScore, correct, questions]);

  /**
   * Klaviatura: 1-4 variant tanlaydi, Enter keyingi savolga o'tadi.
   * Proyektor oldida sichqonchani qidirib o'tirmaslik uchun — o'yin
   * tezlikka asoslangan, har soniya ballga ta'sir qiladi.
   */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (phase === "play") {
        const n = Number(e.key);
        if (n >= 1 && n <= (q?.options.length ?? 0)) {
          e.preventDefault();
          reveal(n - 1, left);
        }
        return;
      }
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        next();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, q, left, reveal, next]);

  if (!q) return null;

  const timePct = (left / (q.seconds || 1)) * 100;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Yuqori panel */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <span className="eyebrow">
          Savol <span className="numeric">{idx + 1}</span>/<span className="numeric">{total}</span>
        </span>
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-neon-yellow">
            <Zap className="w-4 h-4" /> <span className="numeric">{score}</span>
          </span>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 text-sm font-semibold tabular-nums",
              left <= 5 && phase === "play" ? "text-neon-red" : "text-muted-foreground"
            )}
          >
            <Clock className="w-4 h-4" /> <span className="numeric">{Math.max(0, left)}</span>
          </span>
        </div>
      </div>

      {/* Vaqt chizig'i */}
      <div className="h-2 rounded-full bg-surface overflow-hidden mb-8">
        <motion.div
          className={cn("h-full", left <= 5 ? "bg-neon-red" : "progress-gradient")}
          animate={{ width: `${phase === "play" ? Math.max(0, timePct) : 0}%` }}
          transition={{ duration: 0.9, ease: "linear" }}
        />
      </div>

      {/*
        Savol.

        Ilgari bu AnimatePresence mode="wait" ichida edi va keyingi savolga
        o'tilganda h2 `initial` holatida (opacity 0) qotib qolardi: matn
        umuman ko'rinmasdi, faqat variantlar almashardi. Kalit o'zgarganda
        React komponentni qaytadan yaratadi va `initial → animate` o'zi
        ishlaydi — chiqish animatsiyasini muvofiqlashtirish shart emas.
      */}
      <motion.h2
        key={idx}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display font-extrabold text-2xl sm:text-3xl md:text-4xl text-center text-balance mb-10 min-h-[3em] flex items-center justify-center whitespace-pre-line"
      >
        {q.text}
      </motion.h2>

      {/* Variantlar */}
      <div className="grid sm:grid-cols-2 gap-3">
        {q.options.map((o, i) => {
          const shape = SHAPES[i % 4];
          const isPicked = picked === i;
          const showCorrect = phase === "reveal" && o.correct;
          const showWrong = phase === "reveal" && isPicked && !o.correct;

          return (
            <button
              key={i}
              disabled={phase !== "play"}
              onClick={() => reveal(i, left)}
              className={cn(
                "relative flex items-center gap-3 p-5 rounded-xl text-white font-semibold text-left transition-all",
                shape.cls,
                phase === "play" && "hover:brightness-110 active:scale-[0.99]",
                phase === "reveal" && !showCorrect && "opacity-35",
                showCorrect && "ring-4 ring-white/70",
                showWrong && "ring-4 ring-white/40"
              )}
            >
              <span className="text-xl leading-none opacity-90">{shape.label}</span>
              <span className="flex-1">{o.text}</span>
              {/* Klaviatura raqami — faqat kattaroq ekranda foydali */}
              {phase === "play" && (
                <kbd className="hidden sm:inline-flex w-6 h-6 items-center justify-center rounded border border-white/30 bg-white/10 text-xs font-mono flex-shrink-0">
                  {i + 1}
                </kbd>
              )}
              {showCorrect && <Check className="w-6 h-6 flex-shrink-0" />}
              {showWrong && <X className="w-6 h-6 flex-shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* Javobdan keyingi holat */}
      <AnimatePresence>
        {phase === "reveal" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <p className="text-sm font-semibold">
              {picked === null ? (
                <span className="text-muted-foreground">Vaqt tugadi</span>
              ) : q.options[picked]?.correct ? (
                <span className="text-neon-green">To&apos;g&apos;ri! +{BASE_POINTS + Math.round((left / (q.seconds || 1)) * SPEED_BONUS)} ball</span>
              ) : (
                <span className="text-neon-red">Noto&apos;g&apos;ri</span>
              )}
            </p>
            <button onClick={next} className="btn-primary py-2.5 px-6 text-sm inline-flex items-center gap-2">
              {idx + 1 >= total ? "Yakunlash" : "Keyingi savol"}
              <kbd className="hidden sm:inline px-1.5 py-0.5 rounded border border-white/25 bg-white/10 text-[10px] font-mono">
                Enter
              </kbd>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
