"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Play, Pause, SkipBack, SkipForward, RotateCcw, Rabbit, Turtle,
} from "lucide-react";

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

const forSum: Program = {
  id: "for-sum",
  title: "for sikli",
  hint: "1 dan 5 gacha sonlarni qo'shish",
  code: [
    "jami = 0",
    "for i in range(1, 6):",
    "    jami = jami + i",
    "print(jami)",
  ],
  build() {
    const steps: Step[] = [];
    let jami = 0;
    steps.push({ line: 1, vars: { jami }, output: [], note: "jami o'zgaruvchisi 0 qiymat bilan yaratildi" });
    for (let i = 1; i <= 5; i++) {
      steps.push({ line: 2, vars: { jami, i }, output: [], note: `Sikl ${i}-marta aylanmoqda, i = ${i}` });
      const prev = jami;
      jami += i;
      steps.push({ line: 3, vars: { jami, i }, output: [], note: `jami = ${prev} + ${i} = ${jami}` });
    }
    steps.push({ line: 2, vars: { jami, i: 6 }, output: [], note: "i 6 ga yetdi — sikl tugadi" });
    steps.push({ line: 4, vars: { jami }, output: [String(jami)], note: `Natija chop etildi: ${jami}` });
    return steps;
  },
};

const whileCount: Program = {
  id: "while",
  title: "while sikli",
  hint: "Shart yolg'on bo'lguncha takrorlash",
  code: [
    "son = 10",
    "while son > 0:",
    "    son = son - 3",
    "print(son)",
  ],
  build() {
    const steps: Step[] = [];
    let son = 10;
    steps.push({ line: 1, vars: { son }, output: [], note: "son = 10" });
    while (son > 0) {
      steps.push({ line: 2, vars: { son }, output: [], note: `Shart tekshirilmoqda: ${son} > 0 → rost` });
      const prev = son;
      son -= 3;
      steps.push({ line: 3, vars: { son }, output: [], note: `son = ${prev} − 3 = ${son}` });
    }
    steps.push({ line: 2, vars: { son }, output: [], note: `Shart tekshirilmoqda: ${son} > 0 → yolg'on, sikl to'xtadi` });
    steps.push({ line: 4, vars: { son }, output: [String(son)], note: `Natija: ${son}` });
    return steps;
  },
};

const ifElse: Program = {
  id: "if",
  title: "if / elif / else",
  hint: "Shartga qarab yo'l tanlash",
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
      { line: 1, vars: { baho }, output: [], note: "baho = 85" },
      { line: 2, vars: { baho }, output: [], note: "85 >= 90 → yolg'on, keyingi shartga o'tamiz" },
      { line: 4, vars: { baho }, output: [], note: "85 >= 70 → rost, shu tarmoq bajariladi" },
      { line: 5, vars: { baho, natija: "Yaxshi" }, output: [], note: "natija = \"Yaxshi\"" },
      { line: 8, vars: { baho, natija: "Yaxshi" }, output: ["Yaxshi"], note: "else tarmog'i o'tkazib yuborildi, natija chop etildi" },
    ];
  },
};

const nested: Program = {
  id: "nested",
  title: "Ichma-ich sikl",
  hint: "Ko'paytirish jadvali",
  code: [
    "for i in range(1, 4):",
    "    for j in range(1, 4):",
    "        print(i, 'x', j, '=', i * j)",
  ],
  build() {
    const steps: Step[] = [];
    const out: string[] = [];
    for (let i = 1; i <= 3; i++) {
      steps.push({ line: 1, vars: { i }, output: [...out], note: `Tashqi sikl: i = ${i}` });
      for (let j = 1; j <= 3; j++) {
        steps.push({ line: 2, vars: { i, j }, output: [...out], note: `Ichki sikl: j = ${j}` });
        out.push(`${i} x ${j} = ${i * j}`);
        steps.push({ line: 3, vars: { i, j }, output: [...out], note: `${i} × ${j} = ${i * j} chop etildi` });
      }
      steps.push({ line: 2, vars: { i, j: 4 }, output: [...out], note: `Ichki sikl tugadi, tashqisiga qaytamiz` });
    }
    steps.push({ line: 1, vars: { i: 4 }, output: [...out], note: "Ikkala sikl ham tugadi" });
    return steps;
  },
};

const PROGRAMS = [forSum, whileCount, ifElse, nested];

const SPEEDS = [
  { label: "Sekin", ms: 1400, Icon: Turtle },
  { label: "O'rta", ms: 700, Icon: Rabbit },
  { label: "Tez", ms: 300, Icon: Rabbit },
];

/* ============================================================
   KOMPONENT
   ============================================================ */

export function LoopsLab() {
  const [progId, setProgId] = useState(PROGRAMS[0].id);
  const [pos, setPos] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speedIdx, setSpeedIdx] = useState(0);

  const program = useMemo(() => PROGRAMS.find(p => p.id === progId)!, [progId]);
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
    const t = setInterval(() => {
      if (posRef.current >= steps.length - 1) { setPlaying(false); return; }
      setPos(p => p + 1);
    }, SPEEDS[speedIdx].ms);
    return () => clearInterval(t);
  }, [playing, speedIdx, steps.length]);

  const varEntries = Object.entries(step.vars);

  return (
    <div className="space-y-6">
      {/* Dastur tanlash */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
        {PROGRAMS.map(p => (
          <button
            key={p.id}
            onClick={() => setProgId(p.id)}
            className={cn(
              "px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap flex-shrink-0 border text-left",
              progId === p.id
                ? "bg-foreground text-background border-foreground"
                : "bg-surface/40 text-muted-foreground border-border/50 hover:border-border hover:text-foreground"
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
            <span className="eyebrow">Kod</span>
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
                  <pre className={cn("whitespace-pre", active ? "text-[#e6edf3]" : "text-[#8b949e]")}>
                    {line}
                  </pre>
                </div>
              );
            })}
          </div>
        </div>

        {/* O'zgaruvchilar va chiqish */}
        <div className="space-y-4">
          <div className="rounded-xl border border-border p-4">
            <p className="eyebrow mb-3">O&apos;zgaruvchilar</p>
            {varEntries.length === 0 ? (
              <p className="text-sm text-muted-foreground">Hali yaratilmagan</p>
            ) : (
              <div className="space-y-2">
                <AnimatePresence initial={false}>
                  {varEntries.map(([name, value]) => (
                    <motion.div
                      key={name}
                      layout
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-3"
                    >
                      <span className="font-mono text-sm text-neon-purple w-16 flex-shrink-0">{name}</span>
                      <span className="text-muted-foreground">=</span>
                      <motion.span
                        key={`${name}-${value}`}
                        initial={{ scale: 1.15, color: "hsl(var(--brand-amber))" }}
                        animate={{ scale: 1, color: "hsl(var(--foreground))" }}
                        transition={{ duration: 0.4 }}
                        className="numeric font-semibold"
                      >
                        {typeof value === "string" ? `"${value}"` : value}
                      </motion.span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-border p-4">
            <p className="eyebrow mb-3">Chiqish</p>
            {step.output.length === 0 ? (
              <p className="text-sm text-muted-foreground">Hali hech narsa chop etilmagan</p>
            ) : (
              <pre className="font-mono text-sm space-y-0.5">
                {step.output.map((o, i) => <div key={i}>{o}</div>)}
              </pre>
            )}
          </div>
        </div>
      </div>

      {/* Izoh */}
      <motion.div
        key={pos}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-xl bg-neon-purple/[0.06] border border-neon-purple/20"
      >
        <p className="text-sm leading-relaxed">{step.note}</p>
      </motion.div>

      {/* Boshqaruv */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setPlaying(false); setPos(0); }}
            className="p-2.5 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-surface transition-colors"
            aria-label="Boshidan"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => { setPlaying(false); setPos(p => Math.max(0, p - 1)); }}
            disabled={pos === 0}
            className="p-2.5 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-surface disabled:opacity-30 transition-colors"
            aria-label="Orqaga"
          >
            <SkipBack className="w-4 h-4" />
          </button>
          <button
            onClick={() => atEnd ? (setPos(0), setPlaying(true)) : setPlaying(p => !p)}
            className="btn-primary py-2.5 px-5 text-sm inline-flex items-center gap-2"
          >
            {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {playing ? "To'xtatish" : atEnd ? "Qaytadan" : "Ishga tushirish"}
          </button>
          <button
            onClick={() => { setPlaying(false); setPos(p => Math.min(steps.length - 1, p + 1)); }}
            disabled={atEnd}
            className="p-2.5 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-surface disabled:opacity-30 transition-colors"
            aria-label="Oldinga"
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
