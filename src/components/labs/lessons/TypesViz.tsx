"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, Shuffle, ListOrdered } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { VizSection, CodeLine, Chip, TypeBadge, NumField, StepControls, Note } from "./ui";
import {
  arith, convert, parseLiteral, parseNumber, repr, COMPLEX, TOO_BIG,
  type ArithOp, type Converter,
} from "./pyops";

/**
 * 1-laboratoriya: sonli turlar, arifmetik amallar va turlarni aylantirish.
 *
 * Uch tajriba: amallar kalkulyatori (natija va uning TURI), turlarni
 * aylantirish (qaysi aylantirish xato beradi) va amallar tartibi
 * (ifoda qadamma-qadam soddalashadi).
 */

const OPS: ArithOp[] = ["+", "-", "*", "/", "//", "%", "**"];
const CONVERTERS: Converter[] = ["int", "float", "str", "bool"];
const LITERALS = ['"42"', '"3.5"', "9.99", "17", '""', '"0"', "0", "True", '"abc"'];

/**
 * Amallar tartibi: har qadamda ifodaning qaysi qismi hisoblanayotgani.
 * [ko'rsatiladigan matn, ajratiladigan qism] — qo'lda yozilgan, chunki
 * maqsad Python qoidasini tushuntirish, ifoda tahlilchisi emas.
 */
const PRECEDENCE: { expr: string; steps: [string, string][] }[] = [
  { expr: "2 + 3 * 4", steps: [["2 + 3 * 4", "3 * 4"], ["2 + 12", "2 + 12"], ["14", ""]] },
  { expr: "(2 + 3) * 4", steps: [["(2 + 3) * 4", "(2 + 3)"], ["5 * 4", "5 * 4"], ["20", ""]] },
  { expr: "2 ** 3 ** 2", steps: [["2 ** 3 ** 2", "3 ** 2"], ["2 ** 9", "2 ** 9"], ["512", ""]] },
  {
    expr: "17 // 5 * 5 + 17 % 5",
    steps: [
      ["17 // 5 * 5 + 17 % 5", "17 // 5"],
      ["3 * 5 + 17 % 5", "3 * 5"],
      ["15 + 17 % 5", "17 % 5"],
      ["15 + 2", "15 + 2"],
      ["17", ""],
    ],
  },
];

export default function TypesViz() {
  const { t } = useI18n();
  const L = t.labViz;

  // ---------- 1) Amallar kalkulyatori ----------
  const [a, setA] = useState("17");
  const [b, setB] = useState("5");
  const [op, setOp] = useState<ArithOp>("/");

  const calc = useMemo(() => {
    const x = parseNumber(a);
    const y = parseNumber(b);
    if (!x || !y) return null;
    return { x, y, r: arith(x, op, y) };
  }, [a, b, op]);

  const opNote: Record<ArithOp, string> = {
    "+": L.opAdd, "-": L.opSub, "*": L.opMul, "/": L.opDiv,
    "//": L.opFloorDiv, "%": L.opMod, "**": L.opPow,
  };

  const errorText = (e: string) => (e === COMPLEX ? L.complexResult : e === TOO_BIG ? L.tooBig : e);

  // ---------- 2) Turlarni aylantirish ----------
  const [lit, setLit] = useState('"3.5"');
  const source = parseLiteral(lit);

  // ---------- 3) Amallar tartibi ----------
  const [pIdx, setPIdx] = useState(0);
  const [pStep, setPStep] = useState(0);
  const prec = PRECEDENCE[pIdx];
  const [shown, highlight] = prec.steps[pStep];

  return (
    <div className="space-y-4">
      {/* 1 — Kalkulyator */}
      <VizSection icon={Calculator} title={L.calcTitle} hint={L.calcHint}>
        <div className="flex flex-wrap items-end gap-3">
          <NumField label="a" value={a} onChange={setA} />
          <div className="flex flex-wrap gap-1.5 pb-0.5">
            {OPS.map((o) => (
              <Chip key={o} active={op === o} onClick={() => setOp(o)} className="font-mono min-w-[40px]">
                {o}
              </Chip>
            ))}
          </div>
          <NumField label="b" value={b} onChange={setB} />
        </div>

        {calc ? (
          <div className="grid sm:grid-cols-[1fr,auto] gap-3 items-center">
            <CodeLine>
              <span className="text-[#79c0ff]">print</span>({repr(calc.x)} <span className="text-[#ff7b72]">{op}</span> {repr(calc.y)})
            </CodeLine>
            <AnimatePresence mode="wait">
              <motion.div
                key={`${a}${op}${b}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="flex items-center gap-2 justify-end"
              >
                {calc.r.ok ? (
                  <>
                    <span className="font-mono text-2xl font-bold break-all">{repr(calc.r.value)}</span>
                    <TypeBadge type={calc.r.value.type} />
                  </>
                ) : (
                  <TypeBadge type="error" />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        ) : (
          <Note tone="warn">{L.enterNumbers}</Note>
        )}

        {calc && !calc.r.ok && <Note tone="error"><span className="font-mono text-xs">{errorText(calc.r.error)}</span></Note>}
        {calc?.r.ok && (
          <Note>
            <b>{op}</b> — {opNote[op]}
            {op === "/" && <> {L.divAlwaysFloat}</>}
            {(calc.x.type === "float" || calc.y.type === "float") && op !== "/" && <> {L.floatWins}</>}
          </Note>
        )}
      </VizSection>

      {/* 2 — Turlarni aylantirish */}
      <VizSection icon={Shuffle} title={L.convTitle} hint={L.convHint} color="text-emerald-500 bg-emerald-500/10">
        <div className="flex flex-wrap gap-1.5">
          {LITERALS.map((l) => (
            <Chip key={l} active={lit === l} onClick={() => setLit(l)} className="font-mono">{l}</Chip>
          ))}
        </div>
        <label className="flex flex-col gap-1 max-w-xs">
          <span className="text-[11px] text-muted-foreground">{L.ownValue}</span>
          <input value={lit} onChange={(e) => setLit(e.target.value)} className="input-field font-mono text-sm py-1.5" />
        </label>

        {!source ? (
          <Note tone="warn">{L.literalHelp}</Note>
        ) : (
          <div className="grid sm:grid-cols-2 gap-2">
            {CONVERTERS.map((fn) => {
              const r = convert(fn, source);
              return (
                <div
                  key={fn}
                  className={cn(
                    "rounded-xl border px-3 py-2.5 flex items-center justify-between gap-3",
                    r.ok ? "border-border/60 bg-surface/40" : "border-red-500/30 bg-red-500/[0.05]",
                  )}
                >
                  <span className="font-mono text-[13px]">
                    <span className="text-neon-purple">{fn}</span>({lit.trim()})
                  </span>
                  {r.ok ? (
                    <span className="flex items-center gap-2 min-w-0">
                      <span className="font-mono text-[13px] font-semibold truncate">{repr(r.value)}</span>
                      <TypeBadge type={r.value.type} />
                    </span>
                  ) : (
                    <span className="font-mono text-[11px] text-red-500 text-right">{r.error.split(":")[0]}</span>
                  )}
                </div>
              );
            })}
          </div>
        )}
        {source && !convert("int", source).ok && (
          <Note tone="error"><span className="font-mono text-xs">{(convert("int", source) as { error: string }).error}</span></Note>
        )}
        <Note>{L.convNote}</Note>
      </VizSection>

      {/* 3 — Amallar tartibi */}
      <VizSection icon={ListOrdered} title={L.precTitle} hint={L.precHint} color="text-amber-500 bg-amber-500/10">
        <div className="flex flex-wrap gap-1.5">
          {PRECEDENCE.map((p, i) => (
            <Chip key={p.expr} active={pIdx === i} onClick={() => { setPIdx(i); setPStep(0); }} className="font-mono">
              {p.expr}
            </Chip>
          ))}
        </div>
        <div className="rounded-xl bg-[#0d1117] border border-border/60 px-4 py-5 text-center overflow-x-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${pIdx}-${pStep}`}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="font-mono text-xl md:text-2xl text-[#e6edf3] whitespace-pre"
            >
              {highlight ? (
                <>
                  {shown.slice(0, shown.indexOf(highlight))}
                  <span className="rounded-md bg-amber-400/25 text-amber-300 px-1 ring-1 ring-amber-400/50">{highlight}</span>
                  {shown.slice(shown.indexOf(highlight) + highlight.length)}
                </>
              ) : (
                <span className="text-neon-green font-bold">{shown}</span>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        <StepControls
          step={pStep}
          total={prec.steps.length}
          onPrev={() => setPStep((s) => Math.max(0, s - 1))}
          onNext={() => setPStep((s) => Math.min(prec.steps.length - 1, s + 1))}
          onReset={() => setPStep(0)}
          labels={{ prev: L.prev, next: L.next, reset: L.reset, step: L.step }}
        />
        <Note>{pIdx === 2 ? L.powRightToLeft : L.precRule}</Note>
      </VizSection>
    </div>
  );
}
