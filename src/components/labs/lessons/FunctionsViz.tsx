"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cog, Layers, ArrowRightLeft } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { VizSection, CodeLine, Chip, NumField, StepControls, Note, TypeBadge, fill } from "./ui";

/**
 * 6-laboratoriya: funksiyalar.
 *
 * 1) Funksiya mashinasi — argument kiradi, `return` qiymati chiqadi.
 * 2) print va return — ikkalasi ham ekranga chiqaradigandek ko'rinadi,
 *    lekin natijani o'zgaruvchiga saqlaganda farq ochiladi (None).
 * 3) Chaqiruvlar steki — bir funksiya boshqasini chaqirganda yangi
 *    "ramka" (frame) ochiladi va o'z lokal o'zgaruvchilari bilan yopiladi.
 */

type Frame = { fn: string; vars: [string, string][] };
type StackStep = { frames: Frame[]; line: number; note: string };

export default function FunctionsViz() {
  const { t } = useI18n();
  const L = t.labViz;
  const F = { square: L.fnSquare, cube: L.fnCube, isOdd: L.fnIsOdd, sumSq: L.fnSumSquares, nums: L.idNums, total: L.idTotal };

  // ---------- 1) Mashina ----------
  const [fn, setFn] = useState<"square" | "cube" | "isOdd">("square");
  const [arg, setArg] = useState("5");
  const [pulse, setPulse] = useState(0);
  const x = Math.trunc(Number(arg) || 0);
  const machine = {
    // BigInt — katta sonlarda ham Python kabi aniq natija
    square: { body: "return x * x", out: String(BigInt(x) * BigInt(x)), type: "int" },
    cube: { body: "return x ** 3", out: String(BigInt(x) ** 3n), type: "int" },
    isOdd: { body: "return x % 2 == 1", out: ((x % 2) + 2) % 2 === 1 ? "True" : "False", type: "bool" },
  }[fn];
  const fnName = fn === "square" ? F.square : fn === "cube" ? F.cube : F.isOdd;

  // ---------- 2) print va return ----------
  const [mode, setMode] = useState<"return" | "print">("return");

  // ---------- 3) Chaqiruvlar steki ----------
  const values = [1, 2, 3];
  const steps = useMemo<StackStep[]>(() => {
    const out: StackStep[] = [];
    const g = (): Frame => ({ fn: "<module>", vars: [[F.square, "<function>"], [F.sumSq, "<function>"]] });
    out.push({ frames: [g()], line: 9, note: fill(L.stackCall, { fn: F.sumSq }) });
    let total = 0;
    out.push({
      frames: [g(), { fn: F.sumSq, vars: [[F.nums, "[1, 2, 3]"], [F.total, "0"]] }],
      line: 4,
      note: fill(L.stackNewFrame, { fn: F.sumSq }),
    });
    for (const s of values) {
      const outer = (tot: number, sVal?: number): Frame => ({
        fn: F.sumSq,
        vars: [[F.nums, "[1, 2, 3]"], [F.total, String(tot)], ...(sVal !== undefined ? [["s", String(sVal)] as [string, string]] : [])],
      });
      out.push({
        frames: [g(), outer(total, s), { fn: F.square, vars: [["x", String(s)]] }],
        line: 1,
        note: fill(L.stackInner, { fn: F.square, x: s }),
      });
      out.push({
        frames: [g(), outer(total, s), { fn: F.square, vars: [["x", String(s)], ["return", String(s * s)]] }],
        line: 1,
        note: fill(L.stackReturn, { v: s * s }),
      });
      total += s * s;
      out.push({
        frames: [g(), outer(total, s)],
        line: 6,
        note: fill(L.stackPopped, { fn: F.square, total }),
      });
    }
    out.push({
      frames: [g(), { fn: F.sumSq, vars: [[F.nums, "[1, 2, 3]"], [F.total, String(total)], ["return", String(total)]] }],
      line: 7,
      note: fill(L.stackReturn, { v: total }),
    });
    out.push({ frames: [g()], line: 9, note: fill(L.stackDone, { v: total }) });
    return out;
  }, [F.square, F.sumSq, F.nums, F.total, L.stackCall, L.stackNewFrame, L.stackInner, L.stackReturn, L.stackPopped, L.stackDone]);
  const [ss, setSs] = useState(0);
  const st = steps[ss];

  const code = [
    `def ${F.square}(x):`,
    `    return x * x`,
    ``,
    `def ${F.sumSq}(${F.nums}):`,
    `    ${F.total} = 0`,
    `    for s in ${F.nums}:`,
    `        ${F.total} += ${F.square}(s)`,
    `    return ${F.total}`,
    ``,
    `print(${F.sumSq}([1, 2, 3]))`,
  ];
  // Qadamdagi `line` — code massividagi indeks (0 dan)
  const activeLine = st.line;

  return (
    <div className="space-y-4">
      {/* 1 — Funksiya mashinasi */}
      <VizSection icon={Cog} title={L.machineTitle} hint={L.machineHint}>
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex flex-wrap gap-1.5">
            {(["square", "cube", "isOdd"] as const).map((k) => (
              <Chip key={k} active={fn === k} onClick={() => { setFn(k); setPulse((p) => p + 1); }} className="font-mono">
                {k === "square" ? F.square : k === "cube" ? F.cube : F.isOdd}(x)
              </Chip>
            ))}
          </div>
          <NumField label="x" value={arg} onChange={(v) => { setArg(v); setPulse((p) => p + 1); }} width="w-16" />
        </div>

        <div className="flex items-center justify-center gap-2 md:gap-4 py-2 flex-wrap">
          <motion.div key={`in-${pulse}`} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
            className="rounded-xl border border-sky-500/40 bg-sky-500/10 px-4 py-3 font-mono text-center min-w-[72px]">
            <div className="text-[10px] text-muted-foreground">{L.argument}</div>
            <div className="text-xl font-bold">{x}</div>
          </motion.div>
          <span className="text-muted-foreground text-xl">→</span>
          <motion.div key={`box-${pulse}`} initial={{ scale: 0.95 }} animate={{ scale: [0.95, 1.04, 1] }} transition={{ duration: 0.4 }}
            className="rounded-2xl border-2 border-neon-purple/50 bg-neon-purple/[0.07] px-4 py-3 font-mono text-[13px]">
            <div className="text-neon-purple font-semibold">def {fnName}(x):</div>
            <div className="pl-4 text-muted-foreground">{machine.body}</div>
          </motion.div>
          <span className="text-muted-foreground text-xl">→</span>
          <motion.div key={`out-${pulse}`} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.25 }}
            className="rounded-xl border border-neon-green/40 bg-neon-green/10 px-4 py-3 font-mono text-center min-w-[72px]">
            <div className="text-[10px] text-muted-foreground">return</div>
            <div className="text-xl font-bold flex items-center gap-1.5 justify-center">{machine.out}<TypeBadge type={machine.type} /></div>
          </motion.div>
        </div>
        <Note>{L.machineNote}</Note>
      </VizSection>

      {/* 2 — print va return */}
      <VizSection icon={ArrowRightLeft} title={L.prVsRetTitle} hint={L.prVsRetHint} color="text-amber-500 bg-amber-500/10">
        <div className="flex gap-1.5">
          <Chip active={mode === "return"} onClick={() => setMode("return")} className="font-mono">return x * x</Chip>
          <Chip active={mode === "print"} onClick={() => setMode("print")} className="font-mono">print(x * x)</Chip>
        </div>
        <CodeLine>
          {`def ${F.square}(x):\n    `}
          {mode === "return" ? "return x * x" : <><span className="text-[#79c0ff]">print</span>(x * x)</>}
          {`\n\nr = ${F.square}(4)\n`}
          <span className="text-[#79c0ff]">print</span>{`("r =", r)\n`}
          <span className="text-[#79c0ff]">print</span>{`("r + 1 =", r + 1)`}
        </CodeLine>
        <div className="rounded-xl bg-[#0d1117] border border-border/60 px-3.5 py-2.5 font-mono text-[13px] text-[#e6edf3] space-y-0.5">
          <div className="text-[10px] uppercase tracking-wider text-[#8b949e] mb-1">{L.console}</div>
          {mode === "return" ? (
            <>
              <div>r = 16</div>
              <div>r + 1 = 17</div>
            </>
          ) : (
            <>
              <div>16</div>
              <div>r = None</div>
              <div className="text-red-400">TypeError: unsupported operand type(s) for +: &apos;NoneType&apos; and &apos;int&apos;</div>
            </>
          )}
        </div>
        <Note tone={mode === "return" ? "ok" : "error"}>{mode === "return" ? L.returnNote : L.printNote}</Note>
      </VizSection>

      {/* 3 — Chaqiruvlar steki */}
      <VizSection icon={Layers} title={L.stackTitle} hint={L.stackHint} color="text-sky-500 bg-sky-500/10">
        <div className="grid md:grid-cols-2 gap-3">
          <div className="font-mono text-[13px] rounded-xl bg-[#0d1117] text-[#e6edf3] border border-border/60 py-2 overflow-x-auto">
            {code.map((line, i) => (
              <div key={i} className={cn("px-3 whitespace-pre min-h-[20px] flex gap-3", i === activeLine && "bg-amber-400/20")}>
                <span className="text-[#6e7681] select-none w-4 text-right">{i + 1}</span>
                <span>{line}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col-reverse gap-1.5 justify-start">
            <AnimatePresence initial={false}>
              {st.frames.map((f, i) => (
                <motion.div
                  key={`${f.fn}-${i}`}
                  layout
                  initial={{ opacity: 0, y: -16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  className={cn(
                    "rounded-xl border px-3 py-2",
                    i === st.frames.length - 1 ? "border-neon-purple/50 bg-neon-purple/[0.07]" : "border-border/60 bg-surface/40",
                  )}
                >
                  <div className="text-xs font-semibold font-mono mb-1">
                    {f.fn === "<module>" ? L.globalFrame : `${f.fn}()`}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {f.vars.map(([k, val]) => (
                      <span key={k} className={cn("text-[11px] font-mono px-1.5 py-0.5 rounded border",
                        k === "return" ? "border-neon-green/40 bg-neon-green/10" : "border-border bg-card")}>
                        {k} = {val}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground text-center">{L.stackBottom}</div>
          </div>
        </div>

        <StepControls
          step={ss}
          total={steps.length}
          onPrev={() => setSs((s) => Math.max(0, s - 1))}
          onNext={() => setSs((s) => Math.min(steps.length - 1, s + 1))}
          onReset={() => setSs(0)}
          labels={{ prev: L.prev, next: L.next, reset: L.reset, step: L.step }}
        />
        <Note>{st.note}</Note>
        <Note tone="warn">{L.scopeNote}</Note>
      </VizSection>
    </div>
  );
}
