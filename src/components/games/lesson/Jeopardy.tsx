"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { JeopardyContent } from "@/types";
import { Check, X, Eye, Trophy, Users, Undo2, Plus, Minus } from "lucide-react";
import { useI18n } from "@/lib/i18n";

/**
 * Jeopardy taxtasi.
 *
 * Sinfda proyektorda o'ynash uchun: savol ochiladi, jamoalar javob beradi,
 * o'qituvchi javobni ochib kim topganini belgilaydi. Avtomatik tekshiruv yo'q —
 * javob erkin shaklda, uni baholash o'qituvchi zimmasida.
 *
 * Jamoalar: o'yinning butun ma'nosi shunda, lekin ilgari bitta umumiy hisob
 * yuritilardi va o'qituvchi ballarni qog'ozda sanashga majbur edi.
 * Endi 1-4 jamoa bo'ladi va ball to'g'ridan-to'g'ri jamoaga yoziladi.
 * Bitta jamoa tanlansa — yakka tartibdagi o'yin, interfeys soddalashadi.
 *
 * "{t.lg.cancel}" — o'qituvchi noto'g'ri tugmani bosib yuborsa, oxirgi
 * harakatni qaytaradi. Darsda bu tez-tez kerak bo'ladi.
 */

type OpenCell = { c: number; r: number } | null;

/** {t.lg.cancel} uchun oxirgi harakat */
type LastMove = {
  key: string;
  teamIdx: number | null;
  value: number;
} | null;

export type JeopardyResult = {
  score: number;
  maxScore: number;
  correct: number;
  total: number;
};

const TEAM_COLORS = [
  "text-neon-purple bg-neon-purple/10 border-neon-purple/30",
  "text-neon-blue bg-neon-blue/10 border-neon-blue/30",
  "text-neon-green bg-neon-green/10 border-neon-green/30",
  "text-neon-yellow bg-neon-yellow/10 border-neon-yellow/30",
];

export function Jeopardy({
  content,
  onFinish,
}: {
  content: JeopardyContent;
  onFinish: (r: JeopardyResult) => void;
}) {
  const { t } = useI18n();
  const categories = content.categories || [];
  const [open, setOpen] = useState<OpenCell>(null);
  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState<Record<string, number | null>>({});
  const [teamCount, setTeamCount] = useState(2);
  const [scores, setScores] = useState<number[]>([0, 0, 0, 0]);
  const [lastMove, setLastMove] = useState<LastMove>(null);
  const [started, setStarted] = useState(false);

  const { total, maxScore } = useMemo(() => {
    let t = 0, m = 0;
    categories.forEach(cat => cat.cells?.forEach(cell => { t += 1; m += cell.value || 0; }));
    return { total: t, maxScore: m };
  }, [categories]);

  const answered = Object.keys(done).length;
  const correct = Object.values(done).filter(v => v !== null).length;
  const cell = open ? categories[open.c]?.cells?.[open.r] : null;
  const totalScore = scores.slice(0, teamCount).reduce((a, b) => a + b, 0);
  const solo = teamCount === 1;

  function mark(teamIdx: number | null) {
    if (!open || !cell) return;
    const key = `${open.c}-${open.r}`;
    setDone(d => ({ ...d, [key]: teamIdx }));
    if (teamIdx !== null) {
      setScores(s => s.map((v, i) => (i === teamIdx ? v + (cell.value || 0) : v)));
    }
    setLastMove({ key, teamIdx, value: cell.value || 0 });
    setOpen(null);
    setRevealed(false);
  }

  function undo() {
    if (!lastMove) return;
    const move = lastMove;
    setDone(d => {
      const n = { ...d };
      delete n[move.key];
      return n;
    });
    if (move.teamIdx !== null) {
      setScores(s => s.map((v, i) => (i === move.teamIdx ? Math.max(0, v - move.value) : v)));
    }
    setLastMove(null);
  }

  const allDone = answered >= total && total > 0;

  /* ===== Jamoalarni sozlash ===== */
  if (!started) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-sm mx-auto text-center py-6"
      >
        <Users className="w-10 h-10 text-neon-purple mx-auto mb-4" />
        <h2 className="font-display font-bold text-xl mb-2">Nechta jamoa o&apos;ynaydi?</h2>
        <p className="text-sm text-muted-foreground mb-7">
          {t.lg.teamHint}
        </p>

        <div className="flex items-center justify-center gap-4 mb-8">
          <button
            onClick={() => setTeamCount(t => Math.max(1, t - 1))}
            disabled={teamCount <= 1}
            className="w-11 h-11 rounded-xl border border-border bg-surface flex items-center justify-center hover:border-neon-purple/40 transition disabled:opacity-30"
            aria-label="Kamaytirish"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="numeric text-4xl font-bold w-16">{teamCount}</span>
          <button
            onClick={() => setTeamCount(t => Math.min(4, t + 1))}
            disabled={teamCount >= 4}
            className="w-11 h-11 rounded-xl border border-border bg-surface flex items-center justify-center hover:border-neon-purple/40 transition disabled:opacity-30"
            aria-label="Ko'paytirish"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <button onClick={() => setStarted(true)} className="btn-primary py-3 px-8 text-sm">
          Taxtani ochish
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Jamoalar hisobi */}
      {!solo && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
          {Array.from({ length: teamCount }).map((_, i) => (
            <div key={i} className={cn("rounded-xl border px-3 py-2.5 text-center", TEAM_COLORS[i])}>
              <p className="text-[11px] font-semibold uppercase tracking-wide opacity-80">Jamoa {i + 1}</p>
              <p className="numeric text-2xl font-bold">{scores[i]}</p>
            </div>
          ))}
        </div>
      )}

      {/* Hisob */}
      <div className="flex items-center justify-between gap-4 mb-5">
        <span className="eyebrow">
          Ochilgan <span className="numeric">{answered}</span>/<span className="numeric">{total}</span>
        </span>
        <div className="flex items-center gap-3">
          {lastMove && (
            <button
              onClick={undo}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition"
            >
              <Undo2 className="w-3.5 h-3.5" /> {t.lg.cancel}
            </button>
          )}
          {solo && (
            <span className="inline-flex items-center gap-2 text-lg font-semibold text-neon-yellow">
              <Trophy className="w-5 h-5" /> <span className="numeric">{totalScore}</span>
            </span>
          )}
        </div>
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

        {/* Kataklar qator-qator joylashadi */}
        {Array.from({ length: Math.max(0, ...categories.map(c => c.cells?.length || 0)) }).map((_, r) =>
          categories.map((cat, c) => {
            const cl = cat.cells?.[r];
            const key = `${c}-${r}`;
            const isDone = key in done;
            const winner = done[key];
            if (!cl) return <div key={key} />;
            return (
              <button
                key={key}
                disabled={isDone}
                onClick={() => { setOpen({ c, r }); setRevealed(false); }}
                className={cn(
                  "aspect-[5/3] rounded-lg border flex flex-col items-center justify-center gap-0.5 transition-all",
                  isDone && winner !== null && "bg-neon-green/[0.10] border-neon-green/30 text-neon-green",
                  isDone && winner === null && "bg-neon-red/[0.08] border-neon-red/25 text-neon-red",
                  !isDone && "bg-card border-border hover:border-neon-purple/50 hover:bg-neon-purple/[0.06] hover:-translate-y-0.5"
                )}
              >
                {isDone ? (
                  <>
                    {winner !== null ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                    {!solo && winner !== null && (
                      <span className="text-[10px] font-semibold opacity-80">Jamoa {winner + 1}</span>
                    )}
                  </>
                ) : (
                  <span className="numeric text-xl sm:text-2xl">{cl.value}</span>
                )}
              </button>
            );
          })
        )}
      </div>

      {/* Yakunlash */}
      <div className="mt-8 flex items-center justify-between gap-4 flex-wrap">
        <p className="text-sm text-muted-foreground">
          {allDone ? t.lg.allOpened : t.lg.pickCell}
        </p>
        <button
          onClick={() => onFinish({ score: totalScore, maxScore, correct, total })}
          disabled={answered === 0}
          className="btn-primary py-2.5 px-6 text-sm disabled:opacity-40"
        >
          Yakunlash
        </button>
      </div>

      {/* G'olib jamoa */}
      {allDone && !solo && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-center font-display font-bold text-lg text-neon-green"
        >
          G&apos;olib: Jamoa {scores.slice(0, teamCount).indexOf(Math.max(...scores.slice(0, teamCount))) + 1}
        </motion.p>
      )}

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
                      <p className="eyebrow mb-1">{t.lg.answer}</p>
                      <p className="text-lg leading-relaxed">{cell.answer}</p>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3">
                      {solo ? t.lg.wasCorrect : t.lg.whoAnswered}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {solo ? (
                        <button
                          onClick={() => mark(0)}
                          className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border border-neon-green/30 text-neon-green bg-neon-green/[0.06] hover:bg-neon-green/[0.12] transition-colors"
                        >
                          <Check className="w-4 h-4" /> To&apos;g&apos;ri
                        </button>
                      ) : (
                        Array.from({ length: teamCount }).map((_, i) => (
                          <button
                            key={i}
                            onClick={() => mark(i)}
                            className={cn(
                              "flex-1 min-w-[110px] inline-flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border transition-colors hover:brightness-125",
                              TEAM_COLORS[i]
                            )}
                          >
                            Jamoa {i + 1}
                          </button>
                        ))
                      )}
                      <button
                        onClick={() => mark(null)}
                        className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border border-neon-red/30 text-neon-red bg-neon-red/[0.06] hover:bg-neon-red/[0.12] transition-colors"
                      >
                        <X className="w-4 h-4" /> {solo ? "Noto'g'ri" : t.lg.nobody}
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
                    <Eye className="w-4 h-4" /> {t.lg.answer}ni ko&apos;rsatish
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
