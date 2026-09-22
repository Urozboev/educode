"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GitBranch, Table2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { VizSection, CodeLine, Chip, Note, fill } from "./ui";

/**
 * 4-laboratoriya: tarmoqlanish.
 *
 * 1) Baho qo'yish blok-sxemasi — ball o'zgarganda qaysi shartlar
 *    tekshirilgani, qaysi biri rost bo'lgani va qolganlari umuman
 *    TEKSHIRILMAGANI rangda ko'rinadi. "Tartibni buzish" rejimi eng
 *    ko'p uchraydigan xatoni ko'rsatadi: 95 ball "qoniqarli" bo'lib qoladi.
 * 2) Qavslar — `A and B or C` va `A and (B or C)` rostlik jadvali.
 */

type Branch = { cond: number | null; label: string; tone: string };

export default function ConditionsViz() {
  const { t } = useI18n();
  const L = t.labViz;
  const v = L.idScore;

  const [score, setScore] = useState(75);
  const [wrongOrder, setWrongOrder] = useState(false);
  const [tested, setTested] = useState<{ s: number; r: string }[]>([]);

  const correct: Branch[] = [
    { cond: 90, label: L.gradeExcellent, tone: "text-neon-green" },
    { cond: 70, label: L.gradeGood, tone: "text-sky-500" },
    { cond: 60, label: L.gradeSatisfactory, tone: "text-amber-500" },
    { cond: null, label: L.gradeFail, tone: "text-red-500" },
  ];
  const wrong: Branch[] = [
    { cond: 60, label: L.gradeSatisfactory, tone: "text-amber-500" },
    { cond: 70, label: L.gradeGood, tone: "text-sky-500" },
    { cond: 90, label: L.gradeExcellent, tone: "text-neon-green" },
    { cond: null, label: L.gradeFail, tone: "text-red-500" },
  ];
  const branches = wrongOrder ? wrong : correct;
  const takenIdx = branches.findIndex((b) => b.cond === null || score >= b.cond);
  const result = branches[takenIdx];
  const correctResult = correct[correct.findIndex((b) => b.cond === null || score >= b.cond)];
  const isBug = wrongOrder && result.label !== correctResult.label;

  function tryValue(s: number) {
    setScore(s);
    const idx = branches.findIndex((b) => b.cond === null || s >= b.cond);
    setTested((prev) => [{ s, r: branches[idx].label }, ...prev.filter((p) => p.s !== s)].slice(0, 8));
  }

  // ---------- Rostlik jadvali ----------
  const rows: [boolean, boolean, boolean][] = [];
  for (const A of [true, false]) for (const B of [true, false]) for (const C of [true, false]) rows.push([A, B, C]);
  const tf = (x: boolean) => (x ? "True" : "False");

  return (
    <div className="space-y-4">
      {/* 1 — Blok-sxema */}
      <VizSection icon={GitBranch} title={L.flowTitle} hint={L.flowHint}>
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm font-mono">{v} =</label>
          <input
            type="range" min={0} max={100} value={score}
            onChange={(e) => setScore(Number(e.target.value))}
            className="flex-1 min-w-[160px] accent-neon-purple"
          />
          <span className="font-mono text-2xl font-bold w-14 text-right">{score}</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <span className="text-[11px] text-muted-foreground self-center mr-1">{L.boundaryTest}</span>
          {[59, 60, 61, 69, 70, 89, 90, 95].map((s) => (
            <Chip key={s} active={score === s} onClick={() => tryValue(s)} className="font-mono">{s}</Chip>
          ))}
        </div>

        <label className="inline-flex items-center gap-2 text-xs cursor-pointer">
          <input type="checkbox" checked={wrongOrder} onChange={(e) => setWrongOrder(e.target.checked)} />
          {L.wrongOrderToggle}
        </label>

        {/* Sxema */}
        <div className="space-y-1.5">
          {branches.map((b, i) => {
            const state = i < takenIdx ? "false" : i === takenIdx ? "taken" : "skipped";
            const kw = i === 0 ? "if" : b.cond === null ? "else" : "elif";
            return (
              <motion.div
                key={`${wrongOrder}-${i}`}
                layout
                className={cn(
                  "flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors",
                  state === "taken" && "border-neon-green/50 bg-neon-green/[0.07]",
                  state === "false" && "border-border/60 bg-surface/40",
                  state === "skipped" && "border-dashed border-border/60 opacity-50",
                )}
              >
                <span className="font-mono text-[13px] flex-1 min-w-0">
                  <span className="text-neon-purple font-semibold">{kw}</span>
                  {b.cond !== null && <> {v} &gt;= {b.cond}</>}:
                  <span className="text-muted-foreground"> print(&quot;</span>
                  <span className={b.tone}>{b.label}</span>
                  <span className="text-muted-foreground">&quot;)</span>
                </span>
                <span
                  className={cn(
                    "text-[11px] font-semibold px-2 py-0.5 rounded-md whitespace-nowrap",
                    state === "taken" && "bg-neon-green/15 text-neon-green",
                    state === "false" && "bg-red-500/10 text-red-500",
                    state === "skipped" && "bg-surface text-muted-foreground",
                  )}
                >
                  {state === "taken" ? (b.cond === null ? L.stateElse : `True → ${L.stateRun}`) : state === "false" ? "False" : L.stateSkipped}
                </span>
              </motion.div>
            );
          })}
        </div>

        <Note tone={isBug ? "error" : "ok"}>
          {L.resultLabel}: <b className={result.tone}>{result.label}</b>
          {isBug && <> — {fill(L.orderBug, { s: score, right: correctResult.label })}</>}
        </Note>
        <Note>{L.firstTrueWins}</Note>

        {tested.length > 0 && (
          <div className="overflow-x-auto">
            <table className="text-xs font-mono w-full max-w-sm">
              <thead>
                <tr className="text-muted-foreground text-left">
                  <th className="py-1 pr-4 font-medium">{v}</th>
                  <th className="py-1 font-medium">{L.resultLabel}</th>
                </tr>
              </thead>
              <tbody>
                {tested.map((row) => (
                  <tr key={row.s} className="border-t border-border/50">
                    <td className="py-1 pr-4">{row.s}</td>
                    <td className="py-1">{row.r}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </VizSection>

      {/* 2 — Qavslar va rostlik jadvali */}
      <VizSection icon={Table2} title={L.parenTitle} hint={L.parenHint} color="text-amber-500 bg-amber-500/10">
        <CodeLine>
          {`X = A and B or C        `}<span className="text-[#8b949e]"># = (A and B) or C</span>
          {`\nY = A and (B or C)`}
        </CodeLine>
        <div className="overflow-x-auto">
          <table className="text-xs font-mono w-full min-w-[340px]">
            <thead>
              <tr className="text-muted-foreground">
                <th className="py-1.5 font-medium">A</th>
                <th className="py-1.5 font-medium">B</th>
                <th className="py-1.5 font-medium">C</th>
                <th className="py-1.5 font-medium">X</th>
                <th className="py-1.5 font-medium">Y</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([A, B, C]) => {
                const X = (A && B) || C;
                const Y = A && (B || C);
                const differ = X !== Y;
                return (
                  <tr key={`${A}${B}${C}`} className={cn("border-t border-border/50 text-center", differ && "bg-red-500/10")}>
                    <td className="py-1">{tf(A)}</td>
                    <td className="py-1">{tf(B)}</td>
                    <td className="py-1">{tf(C)}</td>
                    <td className={cn("py-1 font-bold", X ? "text-neon-green" : "text-muted-foreground")}>{tf(X)}</td>
                    <td className={cn("py-1 font-bold", Y ? "text-neon-green" : "text-muted-foreground")}>{tf(Y)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <Note tone="warn">{L.parenDiffer}</Note>
        <Note>{L.leapNote}</Note>
      </VizSection>
    </div>
  );
}
