"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import {
  ALGOS, algoMeta, generateFrames, randomArray, parseArray,
  type SortAlgo,
} from "@/lib/sorting";
import {
  Play, Pause, SkipBack, SkipForward, RotateCcw, Shuffle, Gauge,
} from "lucide-react";

/**
 * Saralash algoritmlari laboratoriyasi.
 *
 * Algoritm oldindan kadrlarga yoyiladi (`generateFrames`), keyin animatsiya
 * shu ro'yxat bo'ylab yuradi. Bu orqaga qadam tashlashni ham, tezlikni
 * o'zgartirishni ham hisobni buzmasdan amalga oshiradi.
 */

const SPEEDS = [
  { label: "0.5×", ms: 700 },
  { label: "1×", ms: 350 },
  { label: "2×", ms: 160 },
  { label: "4×", ms: 60 },
];

/**
 * Boshlang'ich massiv ataylab qat'iy: tasodifiy qiymat serverda va brauzerda
 * har xil chiqib, hydration mos kelmay qoladi. Qolaversa, hamma o'quvchi bir
 * xil misoldan boshlagani darsda qulay — aralashtirish tugma orqali.
 */
const DEFAULT_ARRAY = [42, 17, 93, 8, 55, 71, 24, 60, 33, 88, 5, 49];

export function SortingLab() {
  const [algo, setAlgo] = useState<SortAlgo>("bubble");
  const [size, setSize] = useState(DEFAULT_ARRAY.length);
  const [input, setInput] = useState<number[]>(DEFAULT_ARRAY);
  const [customText, setCustomText] = useState("");

  const [pos, setPos] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speedIdx, setSpeedIdx] = useState(1);

  const frames = useMemo(() => generateFrames(input, algo), [input, algo]);
  const frame = frames[Math.min(pos, frames.length - 1)];
  const meta = algoMeta(algo);
  const maxVal = useMemo(() => Math.max(...input, 1), [input]);

  // Massiv yoki algoritm o'zgarsa boshidan boshlanadi
  useEffect(() => { setPos(0); setPlaying(false); }, [input, algo]);

  // Animatsiya
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!playing) return;
    if (pos >= frames.length - 1) { setPlaying(false); return; }
    timer.current = setTimeout(() => setPos(p => p + 1), SPEEDS[speedIdx].ms);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [playing, pos, frames.length, speedIdx]);

  const regenerate = useCallback((n = size) => {
    setInput(randomArray(n));
    setCustomText("");
  }, [size]);

  function applyCustom() {
    const arr = parseArray(customText);
    if (arr.length < 2) return;
    setInput(arr);
    setSize(arr.length);
  }

  const atEnd = pos >= frames.length - 1;

  return (
    <div className="space-y-6">
      {/* Algoritm tanlash */}
      <div className="grid sm:grid-cols-3 gap-3">
        {ALGOS.map(a => (
          <button
            key={a.value}
            onClick={() => setAlgo(a.value)}
            className={cn(
              "text-left p-4 rounded-xl border-2 transition-all",
              algo === a.value
                ? "border-neon-purple bg-neon-purple/[0.08]"
                : "border-border bg-surface/40 hover:bg-surface/60"
            )}
          >
            <p className="font-display font-bold text-sm">{a.label}</p>
            <p className="font-mono text-[11px] text-muted-foreground mt-1">{a.complexity}</p>
          </button>
        ))}
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed">{meta.idea}</p>

      {/* Diagramma */}
      <div className="rounded-2xl border border-border bg-card/40 p-4 sm:p-6">
        <div className="flex items-end gap-[3px] h-56 sm:h-72" role="img" aria-label="Saralash diagrammasi">
          {frame.array.map((v, i) => {
            const isComparing = frame.comparing?.includes(i);
            const isSwapping = frame.swapping?.includes(i);
            const isSorted = frame.sorted.includes(i);
            return (
              <div
                key={i}
                className="flex-1 min-w-0 flex flex-col items-center justify-end gap-1"
                style={{ height: "100%" }}
              >
                <span
                  className={cn(
                    "w-full rounded-t-[3px] transition-[height,background-color] duration-150",
                    isSwapping ? "bg-neon-red"
                      : isComparing ? "bg-neon-yellow"
                      : isSorted ? "bg-neon-green"
                      : "bg-neon-purple/45"
                  )}
                  style={{ height: `${(v / maxVal) * 100}%` }}
                />
                {frame.array.length <= 20 && (
                  <span className="numeric text-[10px] text-muted-foreground leading-none">{v}</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Rang izohi */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-4 text-[11px] text-muted-foreground">
          <Legend cls="bg-neon-yellow" label="solishtirilmoqda" />
          <Legend cls="bg-neon-red" label="almashtirilmoqda" />
          <Legend cls="bg-neon-green" label="o'z o'rnida" />
          <Legend cls="bg-neon-purple/45" label="tegilmagan" />
        </div>
      </div>

      {/* Izoh va hisoblagichlar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-medium min-h-[1.5em]">{frame.note}</p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>Solishtirish: <span className="numeric text-foreground">{frame.comparisons}</span></span>
          <span>Almashtirish: <span className="numeric text-foreground">{frame.swaps}</span></span>
        </div>
      </div>

      {/* Qadam chizig'i */}
      <div>
        <input
          type="range"
          min={0}
          max={Math.max(0, frames.length - 1)}
          value={pos}
          onChange={e => { setPlaying(false); setPos(+e.target.value); }}
          className="w-full accent-[hsl(var(--brand-purple))]"
          aria-label="Qadam"
        />
        <div className="flex justify-between text-[11px] text-muted-foreground mt-1">
          <span>Qadam <span className="numeric">{pos + 1}</span></span>
          <span className="numeric">{frames.length}</span>
        </div>
      </div>

      {/* Boshqaruv */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => { setPlaying(false); setPos(p => Math.max(0, p - 1)); }}
          disabled={pos === 0}
          className="p-3 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-surface disabled:opacity-30 transition-colors"
          aria-label="Orqaga"
        >
          <SkipBack className="w-4 h-4" />
        </button>

        <button
          onClick={() => { if (atEnd) setPos(0); setPlaying(p => !p); }}
          className="btn-primary py-3 px-6 inline-flex items-center gap-2 text-sm"
        >
          {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {playing ? "To'xtatish" : atEnd ? "Qaytadan" : "Boshlash"}
        </button>

        <button
          onClick={() => { setPlaying(false); setPos(p => Math.min(frames.length - 1, p + 1)); }}
          disabled={atEnd}
          className="p-3 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-surface disabled:opacity-30 transition-colors"
          aria-label="Oldinga"
        >
          <SkipForward className="w-4 h-4" />
        </button>

        <button
          onClick={() => { setPlaying(false); setPos(0); }}
          className="p-3 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-surface transition-colors"
          aria-label="Boshiga"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <div className="inline-flex items-center gap-1 ml-auto">
          <Gauge className="w-4 h-4 text-muted-foreground mr-1" />
          {SPEEDS.map((s, i) => (
            <button
              key={s.label}
              onClick={() => setSpeedIdx(i)}
              className={cn(
                "px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors",
                speedIdx === i ? "bg-foreground text-background" : "text-muted-foreground hover:bg-surface"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Psevdokod */}
      <div className="rounded-xl border border-border overflow-hidden">
        <div className="px-4 py-2 bg-surface border-b border-border">
          <p className="eyebrow">Psevdokod</p>
        </div>
        <pre className="bg-[#0d1117] text-[#c9d1d9] p-4 text-sm overflow-x-auto">
          {meta.pseudocode.map((l, i) => (
            <div
              key={i}
              className={cn(
                "px-2 -mx-2 rounded transition-colors",
                frame.line === i ? "bg-[#e3a008]/20 text-[#f0c674]" : ""
              )}
            >
              {l}
            </div>
          ))}
        </pre>
      </div>

      {/* Massivni sozlash */}
      <div className="rounded-xl border border-border bg-surface/30 p-4 sm:p-5 space-y-4">
        <p className="eyebrow">Massivni sozlash</p>

        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-3 flex-1 min-w-[200px]">
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              Elementlar: <span className="numeric text-foreground">{size}</span>
            </span>
            <input
              type="range"
              min={4}
              max={30}
              value={size}
              onChange={e => { const n = +e.target.value; setSize(n); regenerate(n); }}
              className="flex-1 accent-[hsl(var(--brand-purple))]"
            />
          </label>
          <button onClick={() => regenerate()} className="btn-ghost py-2.5 px-4 text-sm inline-flex items-center gap-2">
            <Shuffle className="w-4 h-4" /> Yangi massiv
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          <input
            value={customText}
            onChange={e => setCustomText(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") applyCustom(); }}
            className="input-field flex-1 min-w-[200px] text-sm"
            placeholder="O'z sonlaringiz: 5, 3, 8, 1 (40 tagacha)"
            inputMode="numeric"
          />
          <button
            onClick={applyCustom}
            disabled={parseArray(customText).length < 2}
            className="btn-ghost py-2.5 px-5 text-sm disabled:opacity-40"
          >
            Qo&apos;llash
          </button>
        </div>
      </div>
    </div>
  );
}

function Legend({ cls, label }: { cls: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={cn("w-3 h-3 rounded-[2px]", cls)} /> {label}
    </span>
  );
}
