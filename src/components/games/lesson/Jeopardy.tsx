"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { JeopardyContent } from "@/types";
import { Check, X, Eye, Trophy } from "lucide-react";

/**
 * Jeopardy taxtasi.
 *
 * Sinfda proyektorda o'ynash uchun mo'ljallangan: savol ochiladi, o'quvchilar
 * javob beradi, o'qituvchi javobni ochib to'g'ri/noto'g'ri deb belgilaydi.
 * Shu sababli avtomatik tekshiruv yo'q — javob erkin shaklda bo'ladi va uni
 * baholash o'qituvchi zimmasida. Yopilgan kataklar taxtada o'chib qoladi.
 */

type OpenCell = { c: number; r: number } | null;

export type JeopardyResult = {
  score: number;
  maxScore: number;
  correct: number;
  total: number;
};

export function Jeopardy({
  content,
  onFinish,
}: {
  content: JeopardyContent;
  onFinish: (r: JeopardyResult) => void;
}) {
  const categories = content.categories || [];
  const [open, setOpen] = useState<OpenCell>(null);
  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState<Record<string, "correct" | "wrong">>({});
  const [score, setScore] = useState(0);

  const { total, maxScore } = useMemo(() => {
    let t = 0, m = 0;
    categories.forEach(cat => cat.cells?.forEach(cell => { t += 1; m += cell.value || 0; }));
    return { total: t, maxScore: m };
  }, [categories]);

  const answered = Object.keys(done).length;
  const correct = Object.values(done).filter(v => v === "correct").length;
  const cell = open ? categories[open.c]?.cells?.[open.r] : null;

  function mark(result: "correct" | "wrong") {
    if (!open || !cell) return;
    const key = `${open.c}-${open.r}`;
    setDone(d => ({ ...d, [key]: result }));
    if (result === "correct") setScore(s => s + (cell.value || 0));
    setOpen(null);
    setRevealed(false);
  }

  const allDone = answered >= total && total > 0;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Hisob */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <span className="eyebrow">
          Ochilgan <span className="numeric">{answered}</span>/<span className="numeric">{total}</span>
        </span>
        <span className="inline-flex items-center gap-2 text-lg font-semibold text-neon-yellow">
          <Trophy className="w-5 h-5" /> <span className="numeric">{score}</span>
        </span>
      </div>

      {/* Taxta */}
      <div
        className="grid gap-2 sm:gap-3"
        style={{ gridTemplateColumns: `repeat(${Math.max(1, categories.length)}, minmax(0, 1fr))` }}
      >
        {categories.map((cat, c) => (
          <div key={c} className="rounded-lg bg-neon-purple/[0.10] border border-neon-purple/25 px-2 py-3 text-center">
            <p className="font-display font-bold text-xs sm:text-sm uppercase tracking-wide text-neon-purple leading-tight">
              {cat.name}
            </p>
          </div>
        ))}

        {/* Kataklar qator-qator joylashadi: grid ustunlar bo'yicha to'ldiriladi */}
        {Array.from({ length: Math.max(0, ...categories.map(c => c.cells?.length || 0)) }).map((_, r) =>
          categories.map((cat, c) => {
            const cl = cat.cells?.[r];
            const key = `${c}-${r}`;
            const state = done[key];
            if (!cl) return <div key={key} />;
            return (
              <button
                key={key}
                disabled={!!state}
                onClick={() => { setOpen({ c, r }); setRevealed(false); }}
                className={cn(
                  "aspect-[5/3] rounded-lg border flex items-center justify-center transition-all",
                  state === "correct" && "bg-neon-green/[0.10] border-neon-green/30 text-neon-green",
                  state === "wrong" && "bg-neon-red/[0.08] border-neon-red/25 text-neon-red",
                  !state && "bg-card border-border hover:border-neon-purple/50 hover:bg-neon-purple/[0.06] hover:-translate-y-0.5"
                )}
              >
                {state === "correct" ? <Check className="w-5 h-5" />
                  : state === "wrong" ? <X className="w-5 h-5" />
                  : <span className="numeric text-xl sm:text-2xl">{cl.value}</span>}
              </button>
            );
          })
        )}
      </div>

      {/* Yakunlash */}
      <div className="mt-8 flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {allDone ? "Barcha savollar ochildi" : "Katakni tanlang"}
        </p>
        <button
          onClick={() => onFinish({ score, maxScore, correct, total })}
          disabled={answered === 0}
          className="btn-primary py-2.5 px-6 text-sm disabled:opacity-40"
        >
          Yakunlash
        </button>
      </div>

      {/* Savol oynasi */}
      <AnimatePresence>
        {cell && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { setOpen(null); setRevealed(false); }}
          >
            <motion.div
              className="w-full max-w-2xl rounded-2xl border border-border bg-card p-8 sm:p-10 shadow-terminal"
              initial={{ scale: 0.94, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 16 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <span className="eyebrow">{categories[open!.c]?.name}</span>
                <span className="numeric text-2xl text-neon-yellow">{cell.value}</span>
              </div>

              <p className="font-display font-bold text-xl sm:text-2xl text-balance leading-snug mb-8">
                {cell.question}
              </p>

              <AnimatePresence mode="wait">
                {revealed ? (
                  <motion.div key="a" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="p-4 rounded-xl bg-neon-green/[0.07] border border-neon-green/25 mb-6">
                      <p className="eyebrow mb-1">Javob</p>
                      <p className="text-lg leading-relaxed">{cell.answer}</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => mark("correct")}
                        className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border border-neon-green/30 text-neon-green bg-neon-green/[0.06] hover:bg-neon-green/[0.12] transition-colors"
                      >
                        <Check className="w-4 h-4" /> To&apos;g&apos;ri javob berildi
                      </button>
                      <button
                        onClick={() => mark("wrong")}
                        className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border border-neon-red/30 text-neon-red bg-neon-red/[0.06] hover:bg-neon-red/[0.12] transition-colors"
                      >
                        <X className="w-4 h-4" /> Javob berilmadi
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.button
                    key="r"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => setRevealed(true)}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" /> Javobni ko&apos;rsatish
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
