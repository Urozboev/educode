"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Hash, Divide, InfinityIcon } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { VizSection, CodeLine, Chip, NumField, StepControls, Note, fill } from "./ui";

/**
 * 5-laboratoriya: while sikli.
 *
 * 1) Raqamlarga ajratish — har aylanishda oxirgi raqam `% 10` bilan
 *    "uzilib" savatga tushadi, son esa `// 10` bilan qisqaradi.
 *    Shart `n > 0` har qadamda tekshiriladi va sikl qachon to'xtashi
 *    ko'rinadi.
 * 2) Evklid algoritmi — b har qadamda qat'iy kamayadi, shuning uchun
 *    sikl albatta to'xtaydi (ustunli diagramma).
 * 3) Cheksiz sikl — o'zgaruvchini yangilash unutilsa nima bo'ladi.
 */

export default function WhileViz() {
  const { t } = useI18n();
  const L = t.labViz;
  const N = L.idNum;
  const D = L.idDigit;

  // ---------- 1) Raqamlar ----------
  const [numText, setNumText] = useState("4729");
  const start = Math.min(Math.max(0, Math.trunc(Number(numText) || 0)), 999999999);
  const digitSteps = useMemo(() => {
    const out: { before: number; digit: number; after: number }[] = [];
    let n = start;
    while (n > 0) {
      out.push({ before: n, digit: n % 10, after: Math.floor(n / 10) });
      n = Math.floor(n / 10);
    }
    return out;
  }, [start]);
  // qadamlar: 0 — boshlanish, 1..k — aylanishlar, k+1 — shart False
  const dTotal = digitSteps.length + 2;
  const [ds, setDs] = useState(0);
  useEffect(() => setDs(0), [start]);
  const doneDigits = digitSteps.slice(0, Math.min(ds, digitSteps.length));
  const current = ds === 0 ? start : ds <= digitSteps.length ? digitSteps[ds - 1].after : 0;
  const finished = ds === dTotal - 1;
  const digitSum = doneDigits.reduce((s, x) => s + x.digit, 0);
  const reversed = doneDigits.map((x) => x.digit).join("");

  // ---------- 2) Evklid ----------
  const [ea, setEa] = useState("48");
  const [eb, setEb] = useState("18");
  const euclid = useMemo(() => {
    let a = Math.max(0, Math.trunc(Number(ea) || 0));
    let b = Math.max(0, Math.trunc(Number(eb) || 0));
    const rows: { a: number; b: number; r: number }[] = [];
    let guard = 0;
    while (b !== 0 && guard++ < 60) {
      rows.push({ a, b, r: a % b });
      [a, b] = [b, a % b];
    }
    return { rows, gcd: a };
  }, [ea, eb]);
  const maxB = Math.max(1, ...euclid.rows.map((r) => r.b));

  // ---------- 3) Cheksiz sikl ----------
  const [forget, setForget] = useState(true);
  const [ticks, setTicks] = useState<number[]>([]);
  const [running, setRunning] = useState(false);
  const LIMIT = 20;
  useEffect(() => {
    if (!running) return;
    const i = forget ? 1 : ticks.length + 1;
    if (i > 5 || ticks.length >= LIMIT) { setRunning(false); return; }
    const id = setTimeout(() => setTicks((p) => [...p, i]), 160);
    return () => clearTimeout(id);
  }, [running, ticks, forget]);

  return (
    <div className="space-y-4">
      {/* 1 — Raqamlarga ajratish */}
      <VizSection icon={Hash} title={L.digitsTitle} hint={L.digitsHint}>
        <div className="flex flex-wrap items-end gap-3">
          <NumField label={N} value={numText} onChange={setNumText} width="w-28" />
          <div className="flex flex-wrap gap-1.5 pb-0.5">
            {["4729", "472", "1000", "7"].map((p) => (
              <Chip key={p} active={numText === p} onClick={() => setNumText(p)} className="font-mono">{p}</Chip>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <CodeLine>
            <span className={cn(ds === 0 && "bg-amber-400/20")}>{`${N} = ${start}`}</span>
            {`\n`}
            <span className={cn(ds > 0 && "bg-amber-400/20", finished && "bg-red-500/20")}>
              <span className="text-[#ff7b72]">while</span>{` ${N} > 0:`}
            </span>
            {`\n    `}
            <span className={cn(ds > 0 && !finished && "bg-amber-400/20")}>{`${D} = ${N} % 10`}</span>
            {`\n    `}
            <span className={cn(ds > 0 && !finished && "bg-amber-400/20")}>{`${N} //= 10`}</span>
            {`\n    `}
            <span className="text-[#79c0ff]">print</span>({D}, end=<span className="text-[#a5d6ff]">&quot; &quot;</span>)
          </CodeLine>

          {/* Son va savat */}
          <div className="rounded-xl border border-border/60 bg-surface/40 p-3 space-y-3">
            <div>
              <div className="text-[11px] text-muted-foreground mb-1">{N}</div>
              <div className="flex gap-1 min-h-[44px]">
                <AnimatePresence initial={false}>
                  {String(current === 0 && ds > 0 ? "" : current).split("").filter(Boolean).map((ch, i, arr) => (
                    <motion.span
                      key={`${arr.length}-${i}-${ch}`}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, y: 30 }}
                      className={cn(
                        "w-9 h-11 rounded-lg border font-mono text-xl font-bold flex items-center justify-center",
                        i === arr.length - 1 && !finished ? "border-amber-400/70 bg-amber-400/15" : "border-border bg-card",
                      )}
                    >
                      {ch}
                    </motion.span>
                  ))}
                </AnimatePresence>
                {current === 0 && ds > 0 && <span className="font-mono text-xl text-muted-foreground self-center">0</span>}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-muted-foreground mb-1">{L.digitsBasket}</div>
              <div className="flex gap-1 min-h-[44px] flex-wrap">
                <AnimatePresence initial={false}>
                  {doneDigits.map((x, i) => (
                    <motion.span
                      key={`${start}-${i}`}
                      initial={{ opacity: 0, y: -20, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className="w-9 h-11 rounded-lg border border-neon-green/40 bg-neon-green/10 font-mono text-xl font-bold flex items-center justify-center"
                    >
                      {x.digit}
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        <StepControls
          step={ds}
          total={dTotal}
          onPrev={() => setDs((s) => Math.max(0, s - 1))}
          onNext={() => setDs((s) => Math.min(dTotal - 1, s + 1))}
          onReset={() => setDs(0)}
          labels={{ prev: L.prev, next: L.next, reset: L.reset, step: L.step }}
        />

        <div className="flex flex-wrap gap-2 text-xs font-mono text-muted-foreground">
          <span className="rounded-lg bg-surface/60 border border-border px-2 py-1">{L.digitCount}: {doneDigits.length}</span>
          <span className="rounded-lg bg-surface/60 border border-border px-2 py-1">{L.digitSum}: {digitSum}</span>
          <span className="rounded-lg bg-surface/60 border border-border px-2 py-1">{L.reversedNum}: {reversed || "—"}</span>
        </div>

        <Note tone={finished ? "ok" : "info"}>
          {finished
            ? fill(L.digitsDone, { n: digitSteps.length })
            : ds === 0
              ? L.digitsStart
              : fill(L.digitsStepNote, {
                before: digitSteps[ds - 1].before,
                digit: digitSteps[ds - 1].digit,
                after: digitSteps[ds - 1].after,
              })}
        </Note>
      </VizSection>

      {/* 2 — Evklid */}
      <VizSection icon={Divide} title={L.euclidTitle} hint={L.euclidHint} color="text-sky-500 bg-sky-500/10">
        <div className="flex flex-wrap items-end gap-3">
          <NumField label="a" value={ea} onChange={setEa} />
          <NumField label="b" value={eb} onChange={setEb} />
          <div className="flex flex-wrap gap-1.5 pb-0.5">
            {[["48", "18"], ["120", "84"], ["17", "5"], ["100", "75"]].map(([a, b]) => (
              <Chip key={a + b} onClick={() => { setEa(a); setEb(b); }} className="font-mono">({a}, {b})</Chip>
            ))}
          </div>
        </div>

        <CodeLine>
          <span className="text-[#ff7b72]">while</span>{` b != 0:\n    a, b = b, a % b\n`}
          <span className="text-[#79c0ff]">print</span>(a)
        </CodeLine>

        {euclid.rows.length > 0 ? (
          <div className="space-y-1.5">
            {euclid.rows.map((r, i) => (
              <div key={i} className="grid grid-cols-[2.5rem,1fr] items-center gap-2">
                <span className="text-[11px] font-mono text-muted-foreground">#{i + 1}</span>
                <div className="flex items-center gap-2 min-w-0">
                  <motion.div
                    className="h-6 rounded-md bg-sky-500/30 border border-sky-500/50"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max(4, (r.b / maxB) * 100)}%` }}
                    transition={{ delay: i * 0.08 }}
                  />
                  <span className="font-mono text-xs whitespace-nowrap">
                    a={r.a}, b={r.b} → a % b = <b>{r.r}</b>
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Note tone="warn">{L.euclidZero}</Note>
        )}
        <Note tone="ok">{fill(L.euclidResult, { g: euclid.gcd })}</Note>
        <Note>{L.euclidWhy}</Note>
      </VizSection>

      {/* 3 — Cheksiz sikl */}
      <VizSection icon={InfinityIcon} title={L.infTitle} hint={L.infHint} color="text-red-500 bg-red-500/10">
        <label className="inline-flex items-center gap-2 text-xs cursor-pointer">
          <input type="checkbox" checked={forget} onChange={(e) => { setForget(e.target.checked); setTicks([]); setRunning(false); }} />
          {L.forgetIncrement}
        </label>
        <CodeLine>
          {`i = 1\n`}
          <span className="text-[#ff7b72]">while</span>{` i <= 5:\n    `}
          <span className="text-[#79c0ff]">print</span>{`(i)\n    `}
          <span className={cn(forget && "line-through text-[#8b949e]")}>i += 1</span>
          {forget && <span className="text-[#ff7b72]">{`   # ${L.forgotten}`}</span>}
        </CodeLine>
        <div className="flex flex-wrap gap-2">
          <Chip active onClick={() => { setTicks([]); setRunning(true); }}>▶ {L.run}</Chip>
          <Chip onClick={() => { setRunning(false); setTicks([]); }}>↺ {L.reset}</Chip>
        </div>
        <div className="flex flex-wrap gap-1 min-h-[36px] font-mono text-sm">
          {ticks.map((v, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              className={cn("px-2 py-1 rounded-md border", forget ? "border-red-500/40 bg-red-500/10" : "border-neon-green/40 bg-neon-green/10")}
            >
              {v}
            </motion.span>
          ))}
        </div>
        {forget && ticks.length >= LIMIT && <Note tone="error">{fill(L.infStopped, { n: LIMIT })}</Note>}
        {!forget && ticks.length >= 5 && !running && <Note tone="ok">{L.infOk}</Note>}
        <Note>{L.infRules}</Note>
      </VizSection>
    </div>
  );
}
