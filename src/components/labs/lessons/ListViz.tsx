"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Boxes, Link2, Repeat, Play, Pause } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { VizSection, CodeLine, Chip, NumField, StepControls, Note, fill } from "./ui";

/**
 * 3-laboratoriya: ro'yxat (list) va for sikli.
 *
 * 1) Metodlar — har amal bajarilgach kataklar animatsiya bilan joyini
 *    o'zgartiradi, bajarilgan kod qatori va qaytgan qiymat ko'rinadi.
 * 2) Nusxa tuzog'i — `b = a` da ikkala nom BITTA ro'yxatga, `a.copy()`
 *    da ikki xil ro'yxatga strelka bilan ko'rsatiladi.
 * 3) for sikli — har aylanishda qaysi element olinayotgani va yig'indi.
 */

type Cell = { id: number; v: number };
let nextId = 1;
const cells = (vals: number[]): Cell[] => vals.map((v) => ({ id: nextId++, v }));
const INITIAL = [4, 8, 15, 16, 23];

function Row({ items, highlight, tone = "pink" }: { items: Cell[]; highlight?: number; tone?: "pink" | "sky" }) {
  return (
    <div className="flex flex-wrap gap-1.5 min-h-[62px]">
      <AnimatePresence initial={false}>
        {items.map((c, i) => (
          <motion.div
            key={c.id}
            layout
            initial={{ opacity: 0, scale: 0.6, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 12 }}
            transition={{ type: "spring", stiffness: 420, damping: 30 }}
            className="flex flex-col items-center"
          >
            <span
              className={cn(
                "w-12 h-11 rounded-lg border font-mono font-bold flex items-center justify-center",
                highlight === i
                  ? "bg-neon-purple text-white border-neon-purple shadow-lg shadow-neon-purple/30"
                  : tone === "pink" ? "bg-pink-500/10 border-pink-500/30" : "bg-sky-500/10 border-sky-500/30",
              )}
            >
              {c.v}
            </span>
            <span className="text-[10px] font-mono text-muted-foreground mt-0.5">[{i}]</span>
          </motion.div>
        ))}
      </AnimatePresence>
      {items.length === 0 && <span className="text-sm font-mono text-muted-foreground self-center">[]</span>}
    </div>
  );
}

export default function ListViz() {
  const { t } = useI18n();
  const L = t.labViz;
  const name = L.idNums;

  // ---------- 1) Metodlar ----------
  const [list, setList] = useState<Cell[]>(() => cells(INITIAL));
  const [x, setX] = useState("42");
  const [log, setLog] = useState<{ code: string; out?: string; error?: boolean }>({ code: `${name} = [${INITIAL.join(", ")}]` });

  const xv = Number.isFinite(Number(x)) && x !== "" ? Math.trunc(Number(x)) : 0;
  const show = (arr: Cell[]) => `[${arr.map((c) => c.v).join(", ")}]`;

  function run(kind: "append" | "insert" | "remove" | "pop" | "sort" | "reverse" | "reset") {
    if (kind === "reset") {
      const fresh = cells(INITIAL);
      setList(fresh);
      setLog({ code: `${name} = [${INITIAL.join(", ")}]` });
      return;
    }
    const next = [...list];
    let code = "";
    let out: string | undefined;
    let error = false;
    switch (kind) {
      case "append": next.push({ id: nextId++, v: xv }); code = `${name}.append(${xv})`; break;
      case "insert": next.splice(0, 0, { id: nextId++, v: xv }); code = `${name}.insert(0, ${xv})`; break;
      case "remove": {
        code = `${name}.remove(${xv})`;
        const i = next.findIndex((c) => c.v === xv);
        if (i < 0) { out = "ValueError: list.remove(x): x not in list"; error = true; }
        else next.splice(i, 1);
        break;
      }
      case "pop": {
        code = `${L.idLast} = ${name}.pop()`;
        if (!next.length) { out = "IndexError: pop from empty list"; error = true; }
        else out = `${L.idLast} = ${next.pop()!.v}`;
        break;
      }
      case "sort": next.sort((p, q) => p.v - q.v); code = `${name}.sort()`; break;
      case "reverse": next.reverse(); code = `${name}.reverse()`; break;
    }
    if (!error) setList(next);
    setLog({ code, out, error });
  }

  // ---------- 2) Nusxa tuzog'i ----------
  const [copyMode, setCopyMode] = useState<"alias" | "copy">("alias");
  const [objA, setObjA] = useState<Cell[]>(() => cells([1, 2, 3]));
  const [objB, setObjB] = useState<Cell[]>(() => cells([1, 2, 3]));
  const aliased = copyMode === "alias";
  const bList = aliased ? objA : objB;

  function resetCopy(mode: "alias" | "copy") {
    setCopyMode(mode);
    setObjA(cells([1, 2, 3]));
    setObjB(cells([1, 2, 3]));
  }
  function appendToB() {
    if (aliased) setObjA((p) => [...p, { id: nextId++, v: 4 + p.length - 3 }]);
    else setObjB((p) => [...p, { id: nextId++, v: 4 + p.length - 3 }]);
  }

  // ---------- 3) for sikli ----------
  const loopValues = useMemo(() => list.map((c) => c.v), [list]);
  // 0 — `total = 0`, 1..n — aylanishlar, n+1 — print(total)
  const loopSteps = loopValues.length + 2;
  const [ls, setLs] = useState(0);
  const [playing, setPlaying] = useState(false);
  useEffect(() => setLs(0), [loopValues.length]);
  useEffect(() => {
    if (!playing) return;
    if (ls >= loopSteps - 1) { setPlaying(false); return; }
    const id = setTimeout(() => setLs((s) => s + 1), 900);
    return () => clearTimeout(id);
  }, [playing, ls, loopSteps]);

  const done = ls === loopSteps - 1;
  const cur = ls >= 1 && ls <= loopValues.length ? ls - 1 : -1;
  const partial = loopValues.slice(0, done ? loopValues.length : ls).reduce((s, v) => s + v, 0);

  return (
    <div className="space-y-4">
      {/* 1 — Metodlar */}
      <VizSection icon={Boxes} title={L.listTitle} hint={L.listHint} color="text-pink-500 bg-pink-500/10">
        <Row items={list} />
        <div className="flex flex-wrap items-end gap-3">
          <NumField label="x" value={x} onChange={setX} width="w-16" />
          <div className="flex flex-wrap gap-1.5 pb-0.5">
            <Chip onClick={() => run("append")} className="font-mono">append(x)</Chip>
            <Chip onClick={() => run("insert")} className="font-mono">insert(0, x)</Chip>
            <Chip onClick={() => run("remove")} className="font-mono">remove(x)</Chip>
            <Chip onClick={() => run("pop")} className="font-mono">pop()</Chip>
            <Chip onClick={() => run("sort")} className="font-mono">sort()</Chip>
            <Chip onClick={() => run("reverse")} className="font-mono">reverse()</Chip>
            <Chip onClick={() => run("reset")}>↺ {L.reset}</Chip>
          </div>
        </div>
        <CodeLine>
          {log.code}
          {log.out && !log.error && <span className="text-[#8b949e]">{`   # ${log.out}`}</span>}
          {`\n`}<span className="text-[#79c0ff]">print</span>({name}) <span className="text-[#8b949e]"># {show(list)}</span>
        </CodeLine>
        {log.error && <Note tone="error"><span className="font-mono text-xs">{log.out}</span></Note>}
        <div className="flex flex-wrap gap-2 text-xs font-mono text-muted-foreground">
          <span className="rounded-lg bg-surface/60 border border-border px-2 py-1">len = {list.length}</span>
          {list.length > 0 && (
            <>
              <span className="rounded-lg bg-surface/60 border border-border px-2 py-1">sum = {loopValues.reduce((s, v) => s + v, 0)}</span>
              <span className="rounded-lg bg-surface/60 border border-border px-2 py-1">max = {Math.max(...loopValues)}</span>
              <span className="rounded-lg bg-surface/60 border border-border px-2 py-1">min = {Math.min(...loopValues)}</span>
            </>
          )}
        </div>
      </VizSection>

      {/* 2 — Nusxa tuzog'i */}
      <VizSection icon={Link2} title={L.aliasTitle} hint={L.aliasHint} color="text-sky-500 bg-sky-500/10">
        <div className="flex flex-wrap gap-1.5">
          <Chip active={aliased} onClick={() => resetCopy("alias")} className="font-mono">b = a</Chip>
          <Chip active={!aliased} onClick={() => resetCopy("copy")} className="font-mono">b = a.copy()</Chip>
          <Chip onClick={appendToB} className="font-mono">b.append(…)</Chip>
        </div>

        <div className="grid grid-cols-[auto,1fr] gap-x-3 gap-y-3 items-center">
          {/* a */}
          <span className="font-mono font-bold text-lg w-8 text-center">a</span>
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-muted-foreground">→</span>
            <div className="rounded-xl border-2 border-pink-500/40 p-2 min-w-0 flex-1">
              <div className="text-[10px] font-mono text-muted-foreground mb-1">{L.objectInMemory} #1</div>
              <Row items={objA} />
            </div>
          </div>
          {/* b */}
          <span className="font-mono font-bold text-lg w-8 text-center">b</span>
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-muted-foreground">{aliased ? "↗" : "→"}</span>
            {aliased ? (
              <div className="rounded-xl border-2 border-dashed border-pink-500/40 px-3 py-2 text-xs text-pink-500 font-semibold flex-1">
                {L.sameObject}
              </div>
            ) : (
              <div className="rounded-xl border-2 border-sky-500/40 p-2 min-w-0 flex-1">
                <div className="text-[10px] font-mono text-muted-foreground mb-1">{L.objectInMemory} #2</div>
                <Row items={objB} tone="sky" />
              </div>
            )}
          </div>
        </div>

        <CodeLine>
          <span className="text-[#79c0ff]">print</span>(a) <span className="text-[#8b949e]"># {show(objA)}</span>
          {`\n`}<span className="text-[#79c0ff]">print</span>(b) <span className="text-[#8b949e]"># {show(bList)}</span>
        </CodeLine>
        <Note tone={aliased ? "warn" : "ok"}>{aliased ? L.aliasNote : L.copyNote}</Note>
      </VizSection>

      {/* 3 — for sikli */}
      <VizSection icon={Repeat} title={L.forTitle} hint={L.forHint}>
        <Row items={list} highlight={cur === -1 ? undefined : cur} />
        <CodeLine>
          <span className={cn(ls === 0 && "bg-amber-400/20")}>{`${L.idTotal} = 0`}</span>
          {`\n`}
          <span className={cn(cur >= 0 && "bg-amber-400/20")}>
            <span className="text-[#ff7b72]">for</span> x <span className="text-[#ff7b72]">in</span> {name}:
          </span>
          {`\n    `}
          <span className={cn(cur >= 0 && "bg-amber-400/20")}>{`${L.idTotal} += x`}</span>
          {`\n`}
          <span className={cn(done && "bg-neon-green/20")}>
            <span className="text-[#79c0ff]">print</span>({L.idTotal})
          </span>
        </CodeLine>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl border border-border/60 bg-surface/40 py-2">
            <div className="text-[11px] text-muted-foreground">{L.turn}</div>
            <div className="font-mono text-lg font-bold">{cur === -1 ? "—" : cur + 1}</div>
          </div>
          <div className="rounded-xl border border-border/60 bg-surface/40 py-2">
            <div className="text-[11px] text-muted-foreground">x</div>
            <div className="font-mono text-lg font-bold">{cur === -1 ? "—" : loopValues[cur]}</div>
          </div>
          <div className="rounded-xl border border-neon-green/30 bg-neon-green/[0.05] py-2">
            <div className="text-[11px] text-muted-foreground">{L.idTotal}</div>
            <div className="font-mono text-lg font-bold text-neon-green">{partial}</div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <StepControls
            step={ls}
            total={loopSteps}
            onPrev={() => { setPlaying(false); setLs((s) => Math.max(0, s - 1)); }}
            onNext={() => { setPlaying(false); setLs((s) => Math.min(loopSteps - 1, s + 1)); }}
            onReset={() => { setPlaying(false); setLs(0); }}
            labels={{ prev: L.prev, next: L.next, reset: L.reset, step: L.step }}
          />
          <Chip onClick={() => { if (ls >= loopSteps - 1) setLs(0); setPlaying((p) => !p); }}>
            {playing ? <Pause className="w-3.5 h-3.5 inline" /> : <Play className="w-3.5 h-3.5 inline" />} {playing ? L.pause : L.play}
          </Chip>
        </div>
        {done && <Note tone="ok">{fill(L.forDone, { n: loopValues.length })}</Note>}
      </VizSection>
    </div>
  );
}
