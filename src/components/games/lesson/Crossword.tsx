"use client";

import { useState, useMemo, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { CrosswordContent, CrosswordDir } from "@/types";
import { buildGrid, cellKey } from "@/lib/crossword";
import { Check, Eye, RotateCcw, Zap, Lightbulb } from "lucide-react";

/**
 * Krossvord.
 *
 * Har katak alohida <input> — bu mobil klaviatura bilan ishonchli ishlaydi
 * va ekran o'quvchisi uchun ham tushunarli. Harf kiritilgach kursor tanlangan
 * so'z bo'ylab avtomatik siljiydi.
 *
 * Ball: har to'liq to'g'ri so'z 100. Yordam ("harfni ochish") ishlatilgan
 * so'z 50 ball beradi — yordam tekin bo'lsa, o'yin ma'nosini yo'qotadi.
 */

const FULL_POINTS = 100;
const HINTED_POINTS = 50;

export type CrosswordResult = {
  score: number;
  maxScore: number;
  correct: number;
  total: number;
};

export function Crossword({
  content,
  onFinish,
}: {
  content: CrosswordContent;
  onFinish: (r: CrosswordResult) => void;
}) {
  const words = content.words || [];
  const grid = useMemo(() => buildGrid(content), [content]);

  const [entries, setEntries] = useState<Record<string, string>>({});
  const [activeWord, setActiveWord] = useState<number>(0);
  const [checked, setChecked] = useState(false);
  const [hinted, setHinted] = useState<Set<number>>(new Set());
  const inputs = useRef<Record<string, HTMLInputElement | null>>({});

  const total = words.length;
  const maxScore = total * FULL_POINTS;

  const cellsOf = useCallback((wi: number) => {
    const w = words[wi];
    if (!w) return [];
    const dr = w.dir === "down" ? 1 : 0;
    const dc = w.dir === "across" ? 1 : 0;
    return Array.from({ length: w.answer.length }, (_, i) => ({
      r: w.row + dr * i,
      c: w.col + dc * i,
      expected: w.answer[i],
    }));
  }, [words]);

  const isWordCorrect = useCallback((wi: number) =>
    cellsOf(wi).every(({ r, c, expected }) => (entries[cellKey(r, c)] || "") === expected),
    [cellsOf, entries]
  );

  const solved = useMemo(
    () => words.map((_, i) => isWordCorrect(i)),
    [words, isWordCorrect]
  );
  const solvedCount = solved.filter(Boolean).length;

  const score = useMemo(() =>
    solved.reduce((sum, ok, i) => sum + (ok ? (hinted.has(i) ? HINTED_POINTS : FULL_POINTS) : 0), 0),
    [solved, hinted]
  );

  function setCell(r: number, c: number, val: string) {
    const ch = val.slice(-1).toUpperCase();
    setEntries(e => ({ ...e, [cellKey(r, c)]: ch }));
    setChecked(false);

    // Tanlangan so'z bo'ylab keyingi katakka o'tamiz
    if (ch) {
      const cells = cellsOf(activeWord);
      const pos = cells.findIndex(x => x.r === r && x.c === c);
      const nxt = cells[pos + 1];
      if (nxt) inputs.current[cellKey(nxt.r, nxt.c)]?.focus();
    }
  }

  function onKeyDown(e: React.KeyboardEvent, r: number, c: number) {
    if (e.key !== "Backspace") return;
    if (entries[cellKey(r, c)]) return;
    // Bo'sh katakda backspace — oldingisiga qaytamiz
    const cells = cellsOf(activeWord);
    const pos = cells.findIndex(x => x.r === r && x.c === c);
    const prev = cells[pos - 1];
    if (prev) {
      e.preventDefault();
      setEntries(en => ({ ...en, [cellKey(prev.r, prev.c)]: "" }));
      inputs.current[cellKey(prev.r, prev.c)]?.focus();
    }
  }

  /** Tanlangan so'zning birinchi bo'sh katagini ochib beradi */
  function hint() {
    const cells = cellsOf(activeWord);
    const empty = cells.find(({ r, c, expected }) => (entries[cellKey(r, c)] || "") !== expected);
    if (!empty) return;
    setHinted(h => new Set(h).add(activeWord));
    setEntries(e => ({ ...e, [cellKey(empty.r, empty.c)]: empty.expected }));
    inputs.current[cellKey(empty.r, empty.c)]?.focus();
  }

  function reset() {
    setEntries({});
    setHinted(new Set());
    setChecked(false);
    setActiveWord(0);
  }

  const activeCells = new Set(cellsOf(activeWord).map(x => cellKey(x.r, x.c)));
  const across = words.map((w, i) => ({ w, i })).filter(x => x.w.dir === "across");
  const down = words.map((w, i) => ({ w, i })).filter(x => x.w.dir === "down");
  const allSolved = total > 0 && solvedCount === total;

  if (!total) return null;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Hisob */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <span className="eyebrow">
          Topilgan <span className="numeric">{solvedCount}</span>/<span className="numeric">{total}</span>
        </span>
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-neon-yellow">
          <Zap className="w-4 h-4" /> <span className="numeric">{score}</span>
        </span>
      </div>

      <div className="grid lg:grid-cols-[auto_1fr] gap-8 items-start">
        {/* To'r */}
        <div className="overflow-x-auto -mx-4 px-4 lg:mx-0 lg:px-0">
          <div
            className="inline-grid gap-[2px] mx-auto"
            style={{ gridTemplateColumns: `repeat(${content.cols}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: content.rows }).map((_, r) =>
              Array.from({ length: content.cols }).map((_, c) => {
                const k = cellKey(r, c);
                const cell = grid.get(k);
                if (!cell) return <div key={k} className="w-9 h-9 sm:w-10 sm:h-10" />;

                const val = entries[k] || "";
                const inActive = activeCells.has(k);
                const wrong = checked && val && val !== cell.ch;

                return (
                  <div key={k} className="relative w-9 h-9 sm:w-10 sm:h-10">
                    {cell.num != null && (
                      <span className="absolute top-0 left-0.5 numeric text-[9px] leading-none text-muted-foreground z-10 pointer-events-none">
                        {cell.num}
                      </span>
                    )}
                    <input
                      ref={el => { inputs.current[k] = el; }}
                      value={val}
                      onChange={e => setCell(r, c, e.target.value)}
                      onKeyDown={e => onKeyDown(e, r, c)}
                      onFocus={() => {
                        // Shu katakdan o'tadigan so'zlardan birini tanlaymiz;
                        // allaqachon tanlangani shu katakni qamrasa, o'zgartirmaymiz
                        if (activeCells.has(k)) return;
                        const wi = words.findIndex((_, i) =>
                          cellsOf(i).some(x => x.r === r && x.c === c)
                        );
                        if (wi >= 0) setActiveWord(wi);
                      }}
                      maxLength={1}
                      inputMode="text"
                      autoComplete="off"
                      aria-label={`Katak ${r + 1}-qator ${c + 1}-ustun`}
                      className={cn(
                        "w-full h-full text-center font-display font-bold text-base sm:text-lg uppercase rounded-[3px] border transition-colors focus:outline-none focus:ring-2 focus:ring-neon-purple/50",
                        wrong
                          ? "bg-neon-red/[0.12] border-neon-red/40 text-neon-red"
                          : inActive
                          ? "bg-neon-purple/[0.10] border-neon-purple/40"
                          : "bg-card border-border"
                      )}
                    />
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Ta'riflar */}
        <div className="space-y-6 min-w-0">
          <ClueList title="Gorizontal" items={across} activeWord={activeWord} solved={solved} onPick={setActiveWord} />
          <ClueList title="Vertikal" items={down} activeWord={activeWord} solved={solved} onPick={setActiveWord} />
        </div>
      </div>

      {/* Boshqaruv */}
      <div className="mt-8 pt-6 border-t border-border/50 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <button onClick={hint} className="btn-ghost py-2.5 px-4 text-sm inline-flex items-center gap-2">
            <Lightbulb className="w-4 h-4" /> Harfni ochish
          </button>
          <button onClick={() => setChecked(true)} className="btn-ghost py-2.5 px-4 text-sm inline-flex items-center gap-2">
            <Eye className="w-4 h-4" /> Tekshirish
          </button>
          <button onClick={reset} className="btn-ghost py-2.5 px-4 text-sm inline-flex items-center gap-2">
            <RotateCcw className="w-4 h-4" /> Tozalash
          </button>
        </div>
        <button
          onClick={() => onFinish({ score, maxScore, correct: solvedCount, total })}
          className="btn-primary py-2.5 px-6 text-sm"
        >
          Yakunlash
        </button>
      </div>

      <AnimatePresence>
        {allSolved && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-center font-semibold text-neon-green"
          >
            Krossvord to&apos;liq yechildi
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function ClueList({
  title, items, activeWord, solved, onPick,
}: {
  title: string;
  items: { w: { clue: string; num?: number }; i: number }[];
  activeWord: number;
  solved: boolean[];
  onPick: (i: number) => void;
}) {
  if (!items.length) return null;
  return (
    <div>
      <h3 className="eyebrow mb-2">{title}</h3>
      <ul className="space-y-1">
        {items.map(({ w, i }) => (
          <li key={i}>
            <button
              onClick={() => onPick(i)}
              className={cn(
                "w-full text-left flex gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors",
                activeWord === i ? "bg-neon-purple/[0.10] text-foreground" : "hover:bg-surface text-muted-foreground",
                solved[i] && "line-through opacity-50"
              )}
            >
              <span className="numeric text-xs mt-0.5 flex-shrink-0 w-5">{w.num}</span>
              <span className="flex-1">{w.clue}</span>
              {solved[i] && <Check className="w-4 h-4 text-neon-green flex-shrink-0" />}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
