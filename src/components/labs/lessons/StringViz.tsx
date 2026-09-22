"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Scissors, Wand2, MousePointerClick } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { VizSection, CodeLine, Chip, NumField, Note, fill } from "./ui";
import { sliceIndices, pyTitle, pyCapitalize, pyStrip, pyCount, strRepr } from "./pyops";

/**
 * 2-laboratoriya: matn (str) — indekslash, kesish va metodlar.
 *
 * Matn kataklar tasmasi sifatida chiziladi: har belgi ustida musbat,
 * ostida manfiy indeks. Kesish parametrlari o'zgarganda tanlangan
 * belgilar yonadi. Metodlar esa yangi matn qaytarishini, aslining
 * o'zgarmasligini yonma-yon ko'rsatadi.
 */

type Method = "upper" | "lower" | "title" | "capitalize" | "strip" | "replace";

const toInt = (v: string) => (v === "" || v === "-" ? null : Number.isFinite(Number(v)) ? Math.trunc(Number(v)) : null);

export default function StringViz() {
  const { t } = useI18n();
  const L = t.labViz;

  const [text, setText] = useState<string>(L.sampleWord);
  const chars = useMemo(() => [...text], [text]);
  const n = chars.length;

  // ---------- Indekslash ----------
  const [picked, setPicked] = useState<number | null>(0);

  // ---------- Kesish ----------
  const [start, setStart] = useState("0");
  const [stop, setStop] = useState("6");
  const [step, setStep] = useState("");

  const sel = useMemo(() => sliceIndices(n, toInt(start), toInt(stop), toInt(step)), [n, start, stop, step]);
  const selected = Array.isArray(sel) ? sel : [];
  const sliceExpr = `s[${start}:${stop}${step !== "" ? `:${step}` : ""}]`;

  // ---------- Metodlar ----------
  const [method, setMethod] = useState<Method>("upper");
  const [reassign, setReassign] = useState(false);
  const [padded, setPadded] = useState(false);
  const base = padded ? `  ${text}  ` : text;
  const firstChar = chars[0] ?? "a";

  const methodResult = (() => {
    switch (method) {
      case "upper": return base.toUpperCase();
      case "lower": return base.toLowerCase();
      case "title": return pyTitle(base);
      case "capitalize": return pyCapitalize(base);
      case "strip": return pyStrip(base);
      case "replace": return base.split(firstChar).join("*");
    }
  })();
  const methodCall = method === "replace" ? `replace(${strRepr(firstChar)}, '*')` : `${method}()`;
  const variable = reassign ? methodResult : base;

  const presets: [string, string, string][] = [
    ["0", "3", ""], ["3", "", ""], ["", "", "-1"], ["", "", "2"], ["-3", "", ""], ["1", "-1", ""],
  ];

  const showSpaces = (s: string) => s.replace(/ /g, "·");

  return (
    <div className="space-y-4">
      {/* Matn kiritish */}
      <label className="flex flex-col gap-1 max-w-sm">
        <span className="text-[11px] text-muted-foreground">{L.yourText}</span>
        <input
          value={text}
          maxLength={20}
          onChange={(e) => { setText(e.target.value); setPicked(null); }}
          className="input-field font-mono text-sm py-1.5"
        />
      </label>

      {/* 1 — Indekslar tasmasi */}
      <VizSection icon={MousePointerClick} title={L.indexTitle} hint={L.indexHint}>
        <div className="overflow-x-auto pb-1">
          <div className="inline-flex flex-col gap-1 min-w-full">
            <div className="flex gap-1">
              {chars.map((_, i) => (
                <span key={i} className="w-10 text-center text-[11px] font-mono text-sky-500">{i}</span>
              ))}
            </div>
            <div className="flex gap-1">
              {chars.map((ch, i) => (
                <motion.button
                  key={i}
                  type="button"
                  onClick={() => setPicked(i)}
                  whileTap={{ scale: 0.92 }}
                  className={cn(
                    "w-10 h-11 rounded-lg border font-mono text-lg font-bold flex items-center justify-center transition-colors",
                    picked === i ? "bg-neon-purple text-white border-neon-purple"
                      : selected.includes(i) ? "bg-amber-400/20 border-amber-400/60"
                      : "bg-surface/60 border-border",
                  )}
                  style={{ minHeight: 44 }}
                >
                  {ch === " " ? "·" : ch}
                </motion.button>
              ))}
            </div>
            <div className="flex gap-1">
              {chars.map((_, i) => (
                <span key={i} className="w-10 text-center text-[11px] font-mono text-pink-500">{i - n}</span>
              ))}
            </div>
          </div>
        </div>
        {picked !== null && picked < n && (
          <CodeLine>
            s[{picked}] <span className="text-[#8b949e]">→</span> <span className="text-[#a5d6ff]">{strRepr(chars[picked])}</span>
            <span className="text-[#8b949e]">   {L.sameAs}   </span>
            s[{picked - n}] <span className="text-[#8b949e]">→</span> <span className="text-[#a5d6ff]">{strRepr(chars[picked])}</span>
          </CodeLine>
        )}
        <Note>{fill(L.indexNote, { n, last: n - 1 })}</Note>
      </VizSection>

      {/* 2 — Kesish */}
      <VizSection icon={Scissors} title={L.sliceTitle} hint={L.sliceHint} color="text-amber-500 bg-amber-500/10">
        <div className="flex flex-wrap items-end gap-3">
          <NumField label={L.start} value={start} onChange={setStart} allowEmpty placeholder="—" width="w-16" />
          <NumField label={L.stop} value={stop} onChange={setStop} allowEmpty placeholder="—" width="w-16" />
          <NumField label={L.stepLabel} value={step} onChange={setStep} allowEmpty placeholder="1" width="w-16" />
          <div className="flex flex-wrap gap-1.5 pb-0.5">
            {presets.map(([a, b, c]) => (
              <Chip key={`${a}|${b}|${c}`} onClick={() => { setStart(a); setStop(b); setStep(c); }} className="font-mono">
                s[{a}:{b}{c !== "" ? `:${c}` : ""}]
              </Chip>
            ))}
          </div>
        </div>
        {Array.isArray(sel) ? (
          <CodeLine>
            {sliceExpr} <span className="text-[#8b949e]">→</span>{" "}
            <span className="text-[#a5d6ff]">{strRepr(selected.map((i) => chars[i]).join(""))}</span>
          </CodeLine>
        ) : (
          <Note tone="error"><span className="font-mono text-xs">{sel.error}</span></Note>
        )}
        <Note>{L.sliceNote}</Note>
      </VizSection>

      {/* 3 — Metodlar va o'zgarmaslik */}
      <VizSection icon={Wand2} title={L.methodTitle} hint={L.methodHint} color="text-emerald-500 bg-emerald-500/10">
        <div className="flex flex-wrap gap-1.5">
          {(["upper", "lower", "title", "capitalize", "strip", "replace"] as Method[]).map((m) => (
            <Chip key={m} active={method === m} onClick={() => setMethod(m)} className="font-mono">.{m}()</Chip>
          ))}
        </div>
        <div className="flex flex-wrap gap-4 text-xs">
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={padded} onChange={(e) => setPadded(e.target.checked)} />
            {L.addSpaces}
          </label>
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={reassign} onChange={(e) => setReassign(e.target.checked)} />
            <span className="font-mono">s = s.{methodCall}</span>
          </label>
        </div>

        <CodeLine>
          {`s = ${strRepr(base)}\n`}
          {reassign ? `s = s.${methodCall}\n` : `s.${methodCall}\n`}
          <span className="text-[#79c0ff]">print</span>(s)
        </CodeLine>

        <div className="grid sm:grid-cols-2 gap-2">
          <div className="rounded-xl border border-border/60 bg-surface/40 p-3">
            <div className="text-[11px] text-muted-foreground mb-1">{L.methodReturns}</div>
            <div className="font-mono text-sm break-all">{strRepr(showSpaces(methodResult))}</div>
          </div>
          <div className={cn("rounded-xl border p-3", reassign ? "border-neon-green/40 bg-neon-green/[0.05]" : "border-amber-500/40 bg-amber-500/[0.05]")}>
            <div className="text-[11px] text-muted-foreground mb-1">{L.variableNow}</div>
            <div className="font-mono text-sm break-all">{strRepr(showSpaces(variable))}</div>
          </div>
        </div>
        <Note tone={reassign ? "ok" : "warn"}>{reassign ? L.reassignedNote : L.immutableNote}</Note>

        <div className="flex flex-wrap gap-2 text-xs font-mono text-muted-foreground">
          <span className="rounded-lg bg-surface/60 border border-border px-2 py-1">
            len(s) = {[...base].length}
          </span>
          <span className="rounded-lg bg-surface/60 border border-border px-2 py-1">
            s.count({strRepr(firstChar)}) = {pyCount(base, firstChar)}
          </span>
          <span className="rounded-lg bg-surface/60 border border-border px-2 py-1">
            s.find({strRepr(firstChar)}) = {base.indexOf(firstChar)}
          </span>
        </div>
      </VizSection>
    </div>
  );
}
