"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import {
  Play, Pause, SkipBack, SkipForward, RotateCcw, Rabbit, Turtle,
} from "lucide-react";
import type { Dictionary } from "@/lib/i18n/dictionaries/uz";

/**
 * Sikl va shart operatorlari laboratoriyasi.
 *
 * Bu yerda haqiqiy interpretator yo'q: har bir dastur uchun bajarilish
 * qadamlari oldindan hisoblanadi. Sabab — o'quvchiga kod qanday ishlashini
 * ko'rsatish kerak, kod yozdirish emas; oldindan hisoblangan iz ishonchli,
 * cheksiz sikl yoki xatolik bermaydi va orqaga qaytish ham oson.
 */

type Step = {
  /** Yoritiladigan qator (1 dan boshlab) */
  line: number;
  vars: Record<string, string | number>;
  output: string[];
  /** Nima sodir bo'lganini oddiy tilda tushuntirish */
  note: string;
};

type Program = {
  id: string;
  title: string;
  hint: string;
  code: string[];
  build: () => Step[];
};

/* ============================================================
   DASTURLAR
   ============================================================ */

const forSum = (t: Dictionary): Program => ({
  id: "for-sum",
  title: t.labs.progFor,
  hint: t.labs.progForHint,
  code: [
    "jami = 0",
    "for i in range(1, 6):",
    "    jami = jami + i",
    "print(jami)",
  ],
  build() {
    const steps: Step[] = [];
    let jami = 0;
    steps.push({ line: 1, vars: { jami }, output: [], note: t.labs.noteSumInit });
    for (let i = 1; i <= 5; i++) {
      steps.push({ line: 2, vars: { jami, i }, output: [], note: t.labs.noteLoopTurn.replace(/\{n\}/g, String(i)) });
      const prev = jami;
      jami += i;
      steps.push({ line: 3, vars: { jami, i }, output: [], note: t.labs.noteSumStep.replace("{prev}", String(prev)).replace("{i}", String(i)).replace("{sum}", String(jami)) });
    }
    steps.push({ line: 2, vars: { jami, i: 6 }, output: [], note: t.labs.noteLoopEnd });
    steps.push({ line: 4, vars: { jami }, output: [String(jami)], note: t.labs.notePrinted.replace("{v}", String(jami)) });
    return steps;
  },
});

const whileCount = (t: Dictionary): Program => ({
  id: "while",
  title: t.labs.progWhile,
  hint: t.labs.progWhileHint,
  code: [
    "son = 10",
    "while son > 0:",
    "    son = son - 3",
    "print(son)",
  ],
  build() {
    const steps: Step[] = [];
    let son = 10;
    steps.push({ line: 1, vars: { son }, output: [], note: t.labs.noteAssign });
    while (son > 0) {
      steps.push({ line: 2, vars: { son }, output: [], note: t.labs.noteCheckTrue.replace("{v}", String(son)) });
      const prev = son;
      son -= 3;
      steps.push({ line: 3, vars: { son }, output: [], note: t.labs.noteMinus.replace("{prev}", String(prev)).replace("{v}", String(son)) });
    }
    steps.push({ line: 2, vars: { son }, output: [], note: t.labs.noteCheckFalse.replace("{v}", String(son)) });
    steps.push({ line: 4, vars: { son }, output: [String(son)], note: t.labs.noteResult.replace("{v}", String(son)) });
    return steps;
  },
});

const ifElse = (t: Dictionary): Program => ({
  id: "if",
  title: t.labs.progIf,
  hint: t.labs.progIfHint,
  code: [
    "baho = 85",
    "if baho >= 90:",
    "    natija = \"A'lo\"",
    "elif baho >= 70:",
    "    natija = \"Yaxshi\"",
    "else:",
    "    natija = \"Qoniqarli\"",
    "print(natija)",
  ],
  build(): Step[] {
    const baho = 85;
    return [
      { line: 1, vars: { baho }, output: [], note: t.labs.noteGrade },
      { line: 2, vars: { baho }, output: [], note: t.labs.noteGradeFalse },
      { line: 4, vars: { baho }, output: [], note: t.labs.noteGradeTrue },
      { line: 5, vars: { baho, natija: "Yaxshi" }, output: [], note: "natija = \"Yaxshi\"" },
      { line: 8, vars: { baho, natija: "Yaxshi" }, output: ["Yaxshi"], note: t.labs.noteElseSkipped },
    ];
  },
});

const nested = (t: Dictionary): Program => ({
  id: "nested",
  title: t.labs.progNested,
  hint: t.labs.progNestedHint,
  code: [
    "for i in range(1, 4):",
    "    for j in range(1, 4):",
    "        print(i, 'x', j, '=', i * j)",
  ],
  build() {
    const steps: Step[] = [];
    const out: string[] = [];
    for (let i = 1; i <= 3; i++) {
      steps.push({ line: 1, vars: { i }, output: [...out], note: t.labs.noteOuter.replace("{i}", String(i)) });
      for (let j = 1; j <= 3; j++) {
        steps.push({ line: 2, vars: { i, j }, output: [...out], note: t.labs.noteInner.replace("{j}", String(j)) });
        out.push(`${i} x ${j} = ${i * j}`);
        steps.push({ line: 3, vars: { i, j }, output: [...out], note: t.labs.noteMultiplied.replace("{i}", String(i)).replace("{j}", String(j)).replace("{r}", String(i * j)) });
      }
      steps.push({ line: 2, vars: { i, j: 4 }, output: [...out], note: t.labs.noteInnerDone });
    }
    steps.push({ line: 1, vars: { i: 4 }, output: [...out], note: t.labs.noteBothDone });
    return steps;
  },
});

const PROGRAMS = (t: Dictionary) => [forSum(t), whileCount(t), ifElse(t), nested(t)];

const SPEEDS = [
  { label: "Sekin", ms: 1400, Icon: Turtle },
  { label: "O'rta", ms: 700, Icon: Rabbit },
  { label: "Tez", ms: 300, Icon: Rabbit },
];

/* ============================================================
   KOMPONENT
   ============================================================ */

export function LoopsLab() {
  const { t } = useI18n();
  const [progId, setProgId] = useState(PROGRAMS(t)[0].id);
  const [pos, setPos] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speedIdx, setSpeedIdx] = useState(0);

  const program = useMemo(() => PROGRAMS(t).find(p => p.id === progId)!, [progId]);
  const steps = useMemo(() => program.build(), [program]);
  const step = steps[Math.min(pos, steps.length - 1)];
  const atEnd = pos >= steps.length - 1;

  // Dastur almashsa boshidan
  useEffect(() => { setPos(0); setPlaying(false); }, [progId]);

  // Avtomatik yurish
  const posRef = useRef(pos);
  posRef.current = pos;
  useEffect(() => {
    if (!playing) return;
    const interval = setInterval(() => {
      if (posRef.current >= steps.length - 1) { setPlaying(false); return; }
      setPos(p => p + 1);
    }, SPEEDS[speedIdx].ms);
    return () => clearInterval(interval);
  }, [playing, speedIdx, steps.length]);

  const varEntries = Object.entries(step.vars);

  return (
    <div className="space-y-6">
      {/* Dastur tanlash */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
        {PROGRAMS(t).map(p => (
          <button
            key={p.id}
            onClick={() => setProgId(p.id)}
            className={cn(
              "px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap flex-shrink-0 border text-left",
              progId === p.id
                ? "bg-foreground text-background border-foreground shadow-sm"
                : "bg-card text-muted-foreground hover:text-foreground border-border hover:bg-surface"
            )}
          >
            {p.title}
          </button>
        ))}
      </div>
      <p className="text-sm text-muted-foreground -mt-3">{program.hint}</p>

      <div className="grid lg:grid-cols-[1.3fr_1fr] gap-5">
        {/* Kod */}
        <div className="rounded-xl overflow-hidden border border-border">
          <div className="flex items-center justify-between px-4 py-2.5 bg-surface border-b border-border">
            <span className="eyebrow">{t.cabinet.portfolioView.code}</span>
            <span className="numeric text-xs text-muted-foreground">
              {Math.min(pos + 1, steps.length)}/{steps.length}
            </span>
          </div>
          <div className="bg-[#0d1117] py-3">
            {program.code.map((line, i) => {
              const active = step.line === i + 1;
              return (
                <div
                  key={i}
                  className={cn(
                    "flex gap-3 px-4 py-1 font-mono text-[13px] sm:text-sm transition-colors",
                    active ? "bg-neon-yellow/[0.14]" : ""
                  )}
                >
                  <span className={cn(
                    "numeric select-none w-5 text-right flex-shrink-0",
                    active ? "text-[#e3a008]" : "text-[#484f58]"
                  )}>
                    {i + 1}
                  </span>
                  <span className={active ? "text-foreground font-semibold" : "text-[#c9d1d9]"}>
                    {line}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* O'ng tomon: o'zgaruvchilar + terminal */}
        <div className="flex flex-col gap-4">
          {/* O'zgaruvchilar jadvali */}
          <div className="rounded-xl border border-border bg-card p-4 flex-1">
            <p className="eyebrow mb-3">O&apos;zgaruvchilar</p>
            {varEntries.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">{t.labs.noVars}</p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {varEntries.map(([k, v]) => (
                  <div key={k} className="p-2.5 rounded-lg bg-surface border border-border flex items-center justify-between">
                    <span className="font-mono text-xs text-muted-foreground">{k}</span>
                    <span className="font-mono text-sm font-bold text-neon-purple">{String(v)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Terminal / stdout */}
          <div className="rounded-xl border border-border bg-[#0d1117] p-4 min-h-[120px]">
            <p className="eyebrow text-[#8b949e] mb-2">{t.cabinet.play.terminal}</p>
            {step.output.length === 0 ? (
              <p className="text-xs text-[#484f58] italic">{t.cabinet.play.emptyOutput}</p>
            ) : (
              <div className="font-mono text-xs text-neon-green space-y-0.5">
                {step.output.map((o, i) => <div key={i}>{o}</div>)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Izoh kartochkasi */}
      <motion.div
        key={pos}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-xl border border-neon-purple/30 bg-neon-purple/[0.06]"
      >
        <p className="text-sm leading-relaxed">{step.note}</p>
      </motion.div>

      {/* Boshqaruv */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setPlaying(false); setPos(0); }}
            className="p-2.5 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-surface transition-colors"
            aria-label={t.labs.restart}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => { setPlaying(false); setPos(p => Math.max(0, p - 1)); }}
            disabled={pos === 0}
            className="p-2.5 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-surface disabled:opacity-30 transition-colors"
            aria-label={t.common.back}
          >
            <SkipBack className="w-4 h-4" />
          </button>
          <button
            onClick={() => atEnd ? (setPos(0), setPlaying(true)) : setPlaying(p => !p)}
            className="btn-primary py-2.5 px-5 text-sm inline-flex items-center gap-2"
          >
            {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {playing ? t.labs.pause : atEnd ? t.labs.restart : t.labs.run}
          </button>
          <button
            onClick={() => { setPlaying(false); setPos(p => Math.min(steps.length - 1, p + 1)); }}
            disabled={atEnd}
            className="p-2.5 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-surface disabled:opacity-30 transition-colors"
            aria-label={t.common.next}
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-1 p-1 rounded-xl border border-border bg-surface/40">
          {SPEEDS.map((s, i) => (
            <button
              key={s.label}
              onClick={() => setSpeedIdx(i)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors",
                speedIdx === i ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Progress */}
      <div className="h-1.5 rounded-full bg-surface overflow-hidden">
        <motion.div
          className="h-full progress-gradient"
          animate={{ width: `${((pos + 1) / steps.length) * 100}%` }}
          transition={{ duration: 0.2 }}
        />
      </div>
    </div>
  );
}
