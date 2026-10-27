"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, HelpCircle, CheckCircle2, XCircle, Eye, MousePointerClick } from "lucide-react";
import { cn } from "@/lib/utils";
import { Device, deviceHalfHeight, type DeviceKind } from "./devices";

/**
 * Tarmoq "hikoyasi" — barcha simulyatsiyalarning umumiy dvigateli.
 *
 * Talaba jadval o'qimaydi, voqeani KO'RADI: haqiqiy ko'rinishdagi
 * qurilmalar, kabel bo'ylab uchadigan konvert (paket), qurilma ustida
 * qisqa fikr ("Menga emas", "Eslab qoldim") va pastda 1–2 gap izoh.
 *
 * Hikoya o'rtasida SAVOL qadamlari bor ("Sinab ko'ring"): avtomatik
 * ko'rsatish to'xtaydi, talaba javobni sahnadagi qurilmani bosib yoki
 * variant tanlab beradi. To'g'ri javobdan keyin shu qadamning
 * animatsiyasi o'ynaydi — talaba o'z taxmini to'g'riligini ko'radi.
 *
 * Animatsiya SVG `animateMotion` bilan: vaqtga asoslangan, ya'ni
 * requestAnimationFrame'ga bog'liq emas.
 */

export interface SceneNode {
  id: string;
  kind: DeviceKind;
  x: number;
  y: number;
  label?: string;
  sub?: string;
}
export interface SceneLink { a: string; b: string; wireless?: boolean; label?: string }

export type Tone = "blue" | "amber" | "green" | "red" | "purple" | "pink";
export interface Flight {
  from: string;
  to: string;
  label: string;
  tone?: Tone;
  /** sekundda, qadam boshidan */
  delay?: number;
  /** Yo'lni qo'lda berish (aks holda kabellar bo'ylab eng qisqa yo'l). [] — to'g'ri chiziq */
  via?: string[];
  /** Paket yo'lda yo'qoladi: shu qurilmagacha boradi va qizil bo'lib yo'qoladi */
  lostAt?: string;
}
export interface Mark { text: string; tone?: "ok" | "drop" | "info" | "warn"; at?: number }

export interface Ask {
  q: string;
  /** Sahnada bosiladigan to'g'ri qurilma(lar). Massiv bo'lsa — bir nechtasini tanlab "Tekshirish". */
  pick?: string | string[];
  /** Yoki variantlar */
  options?: string[];
  answer?: number;
  /** To'g'ri javobdan keyin (yoki "Javobni ko'rsatish"dan keyin) chiqadigan izoh */
  explain: string;
  /** Noto'g'ri javobda yordamchi ishora */
  hint?: string;
}

export interface Step {
  say: ReactNode;
  flights?: Flight[];
  marks?: Record<string, Mark>;
  /** Qadamda faol qurilmalar — qolganlari xiralashadi */
  focus?: string[];
  /** Ishdan chiqqan qurilmalar va kabellar ("a-b" ko'rinishida) */
  broken?: string[];
  /** Shu qadamda ko'rinmaydigan qurilmalar va kabellar ("a-b") — tarmoqni bosqichma-bosqich "yig'ish" uchun */
  hide?: string[];
  /** Qurilma ostidagi yozuvni shu qadamda almashtirish (masalan, IP olingach) */
  subs?: Record<string, string>;
  /** Sahnaning pastidagi karta (jadval, buyruq natijasi) */
  panel?: ReactNode;
  /** Panel savolning shartiga kiradi (buyruq natijasi, paketlar ro'yxati) — savol paytida ham ko'rinsin */
  panelDuringAsk?: boolean;
  ask?: Ask;
}

const TONE: Record<Tone, { stroke: string; fill: string }> = {
  blue: { stroke: "#0ea5e9", fill: "#e0f2fe" },
  amber: { stroke: "#f59e0b", fill: "#fef3c7" },
  green: { stroke: "#10b981", fill: "#d1fae5" },
  red: { stroke: "#ef4444", fill: "#fee2e2" },
  purple: { stroke: "#8b5cf6", fill: "#ede9fe" },
  pink: { stroke: "#ec4899", fill: "#fce7f3" },
};

const HOP = 1.1; // bir kabel uchun sekund
const SCALE = 1.3; // qurilmalar kattaligi — telefonda ham ko'rinsin
const SPEEDS = [{ k: 0.6, t: "Sekin" }, { k: 1, t: "Oddiy" }, { k: 1.6, t: "Tez" }];
const END_KINDS = new Set<DeviceKind>(["pc", "laptop", "phone", "server"]);

const lk = (a: string, b: string) => [a, b].sort().join("-");

function route(f: Flight, nodes: Map<string, SceneNode>, links: SceneLink[], broken: Set<string>): string[] {
  const target = f.to;
  const cut = (path: string[]) => {
    if (!f.lostAt) return path;
    const idx = path.indexOf(f.lostAt);
    return idx > 0 ? path.slice(0, idx + 1) : path;
  };
  if (f.via) return cut([f.from, ...f.via, target]);
  const adj = new Map<string, string[]>();
  links.forEach((l) => {
    adj.set(l.a, [...(adj.get(l.a) ?? []), l.b]);
    adj.set(l.b, [...(adj.get(l.b) ?? []), l.a]);
  });
  const prev = new Map<string, string | null>([[f.from, null]]);
  const q = [f.from];
  while (q.length) {
    const c = q.shift()!;
    if (c === target) break;
    for (const n of adj.get(c) ?? []) {
      if (n !== target && END_KINDS.has(nodes.get(n)!.kind)) continue;
      if (broken.has(lk(c, n)) && !f.lostAt) continue;
      if (!prev.has(n)) { prev.set(n, c); q.push(n); }
    }
  }
  if (!prev.has(target)) return [f.from, target];
  const out: string[] = [];
  for (let c: string | null = target; c; c = prev.get(c) ?? null) out.unshift(c);
  return cut(out);
}

function Packet({ points, label, tone = "blue", delay = 0, speed, lost }: { points: [number, number][]; label: string; tone?: Tone; delay?: number; speed: number; lost?: boolean }) {
  const show = useRef<SVGSetElement>(null);
  const move = useRef<SVGAnimateMotionElement>(null);
  const fade = useRef<SVGAnimateElement>(null);
  const red = useRef<SVGSetElement>(null);
  const xShow = useRef<SVGSetElement>(null);
  const dur = Math.max(0.3, ((points.length - 1) * HOP) / speed);
  const d = "M " + points.map((p) => `${p[0]} ${p[1]}`).join(" L ");
  useEffect(() => {
    const t0 = delay / speed;
    show.current?.beginElementAt(t0);
    move.current?.beginElementAt(t0);
    red.current?.beginElementAt(t0 + dur);
    xShow.current?.beginElementAt(t0 + dur);
    fade.current?.beginElementAt(t0 + dur + (lost ? 0.5 : 0.9));
  }, [delay, dur, speed, lost]);
  const c = TONE[lost ? "red" : tone];
  const w = Math.max(34, label.length * 7.4 + 16);
  return (
    <g visibility="hidden">
      <set ref={show} attributeName="visibility" to="visible" begin="indefinite" fill="freeze" />
      <animateMotion ref={move} path={d} dur={`${dur}s`} begin="indefinite" fill="freeze" calcMode="linear" />
      <animate ref={fade} attributeName="opacity" from="1" to="0" dur="0.4s" begin="indefinite" fill="freeze" />
      <rect x={-16} y={-11} width={32} height={22} rx={3} fill={c.fill} stroke={c.stroke} strokeWidth={2} />
      <path d="M -16 -10 L 0 2 L 16 -10" fill="none" stroke={c.stroke} strokeWidth={1.6} />
      <rect x={-w / 2} y={-34} width={w} height={19} rx={9.5} fill={TONE[tone].stroke}>
        {lost && <set ref={red} attributeName="fill" to="#ef4444" begin="indefinite" fill="freeze" />}
      </rect>
      <text x={0} y={-20.5} textAnchor="middle" fontSize="12" fontWeight={800} fill="#fff">{label}</text>
      {lost && (
        <g visibility="hidden">
          <set ref={xShow} attributeName="visibility" to="visible" begin="indefinite" fill="freeze" />
          <path d="M -10 -8 L 10 12 M 10 -8 L -10 12" stroke="#ef4444" strokeWidth={4} strokeLinecap="round" />
        </g>
      )}
    </g>
  );
}

export function Story({
  nodes,
  links,
  steps,
  width = 760,
  height = 360,
  title,
}: {
  nodes: SceneNode[];
  links: SceneLink[];
  steps: Step[];
  width?: number;
  height?: number;
  title?: string;
}) {
  const [i, setI] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [sp, setSp] = useState(1);
  const speed = SPEEDS[sp].k;
  const byId = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);
  const step = i >= 0 ? steps[i] : null;

  // Savol holati — har qadamda yangidan
  const [answered, setAnswered] = useState<Record<number, "ok" | "shown">>({});
  const [sel, setSel] = useState<string[]>([]);
  const [wrong, setWrong] = useState<string | null>(null);
  const [score, setScore] = useState({ ok: 0, total: 0 });
  const triedRef = useRef<Set<number>>(new Set());
  useEffect(() => { setSel([]); setWrong(null); }, [i]);

  const ask = step?.ask;
  const waiting = !!ask && !answered[i];
  const broken = useMemo(() => new Set(step?.broken ?? []), [step]);
  const hidden = useMemo(() => new Set(step?.hide ?? []), [step]);

  const flights = useMemo(() => (waiting ? [] : step?.flights ?? []).map((f) => {
    const r = route(f, byId, links, broken);
    return { ...f, points: r.map((id) => [byId.get(id)!.x, byId.get(id)!.y] as [number, number]), hops: r.length - 1 };
  }), [step, byId, links, waiting, broken]);
  const animEnd = flights.reduce((m, f) => Math.max(m, (f.delay ?? 0) + f.hops * HOP), 0) / speed;

  useEffect(() => {
    if (!playing || i < 0 || waiting) return;
    if (i >= steps.length - 1) { setPlaying(false); return; }
    const text = typeof steps[i].say === "string" ? (steps[i].say as string) : "";
    const extra = steps[i].ask ? 3 : 0;
    const read = (Math.max(2.8, text.length * 0.05) + extra) / speed;
    const t = setTimeout(() => setI((x) => x + 1), (animEnd + read) * 1000);
    return () => clearTimeout(t);
  }, [playing, i, steps, animEnd, speed, waiting]);

  function grade(ok: boolean, wrongText?: string) {
    if (!triedRef.current.has(i)) {
      triedRef.current.add(i);
      setScore((s) => ({ ok: s.ok + (ok ? 1 : 0), total: s.total + 1 }));
    }
    if (ok) { setAnswered((a) => ({ ...a, [i]: "ok" })); setWrong(null); }
    else setWrong(wrongText ?? ask?.hint ?? "Yana bir bor o'ylab ko'ring.");
  }

  function clickNode(id: string) {
    if (!waiting || !ask?.pick) return;
    if (Array.isArray(ask.pick)) {
      setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
      setWrong(null);
    } else {
      grade(id === ask.pick, id !== ask.pick ? `${byId.get(id)?.label ?? id} — to'g'ri emas. ${ask.hint ?? ""}`.trim() : undefined);
    }
  }
  function checkMulti() {
    if (!ask || !Array.isArray(ask.pick)) return;
    const want = [...ask.pick].sort().join(",");
    grade([...sel].sort().join(",") === want);
  }

  const start = () => { setI(0); setPlaying(true); triedRef.current = new Set(); setScore({ ok: 0, total: 0 }); setAnswered({}); };
  const pickable = waiting && !!ask?.pick;
  const totalAsks = steps.filter((s) => s.ask).length;

  return (
    <div className="rounded-3xl border border-border/60 bg-card/70 overflow-hidden">
      {title && (
        <div className="px-5 pt-4 flex items-center gap-2 flex-wrap">
          <span className="font-display font-bold text-base">{title}</span>
          {totalAsks > 0 && (
            <span className="ml-auto text-xs rounded-full bg-neon-purple/10 text-neon-purple px-2.5 py-1 font-semibold">
              {totalAsks} ta savol · {score.ok}/{score.total} to&apos;g&apos;ri
            </span>
          )}
        </div>
      )}

      <div className="relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto block select-none" role="img" aria-label={title ?? "Tarmoq sahnasi"}>
          <defs>
            <pattern id="net-grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" className="fill-slate-200 dark:fill-slate-800" />
            </pattern>
          </defs>
          <rect width={width} height={height} fill="url(#net-grid)" />

          {links.map((l) => {
            const A = byId.get(l.a)!, B = byId.get(l.b)!;
            if (hidden.has(l.a) || hidden.has(l.b) || hidden.has(lk(l.a, l.b))) return null;
            const isBroken = broken.has(lk(l.a, l.b));
            const faded = step?.focus && !(step.focus.includes(l.a) && step.focus.includes(l.b));
            return (
              <g key={`${l.a}-${l.b}`} opacity={faded && !isBroken ? 0.25 : 1} style={{ transition: "opacity .3s" }}>
                <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} strokeWidth={l.wireless ? 2.5 : 4} strokeLinecap="round"
                  strokeDasharray={isBroken ? "8 8" : l.wireless ? "2 7" : undefined}
                  className={isBroken ? "stroke-rose-500" : l.wireless ? "stroke-emerald-400" : "stroke-slate-300 dark:stroke-slate-600"} />
                {isBroken && (
                  <g transform={`translate(${(A.x + B.x) / 2} ${(A.y + B.y) / 2})`}>
                    <circle r={12} className="fill-rose-500" />
                    <path d="M -5 -5 L 5 5 M 5 -5 L -5 5" stroke="#fff" strokeWidth={3} strokeLinecap="round" />
                  </g>
                )}
                {l.label && !isBroken && (
                  <text x={(A.x + B.x) / 2} y={(A.y + B.y) / 2 - 8} textAnchor="middle" fontSize="12" className="fill-muted-foreground">{l.label}</text>
                )}
              </g>
            );
          })}

          {nodes.map((n) => {
            if (hidden.has(n.id)) return null;
            const isBroken = broken.has(n.id);
            const active = !!step && !isBroken && (step.focus ? step.focus.includes(n.id) : flights.some((f) => f.from === n.id || f.to === n.id));
            const dim = !!step?.focus && !step.focus.includes(n.id) && !isBroken;
            const h = deviceHalfHeight(n.kind) * SCALE;
            const chosen = sel.includes(n.id);
            // Savol kutilayotganda yozuvlar javobni oshkor qilmasin — oldingi qadamnikini ko'rsatamiz
            const sub = (waiting ? steps[i - 1]?.subs?.[n.id] : step?.subs?.[n.id]) ?? n.sub;
            return (
              <g key={n.id} transform={`translate(${n.x} ${n.y})`}
                onClick={() => clickNode(n.id)}
                className={cn(pickable && "cursor-pointer")}>
                {pickable && (
                  <circle r={h + 18} className={cn("transition-all", chosen ? "fill-neon-purple/20 stroke-neon-purple" : "fill-neon-purple/5 stroke-neon-purple/40 hover:fill-neon-purple/15")} strokeWidth={2} strokeDasharray={chosen ? undefined : "5 5"} />
                )}
                <g transform={`scale(${SCALE})`} opacity={isBroken ? 0.45 : 1}><Device kind={n.kind} active={active || chosen} dim={dim} /></g>
                {isBroken && (
                  <g>
                    <circle r={15} className="fill-rose-500" />
                    <path d="M -6 -6 L 6 6 M 6 -6 L -6 6" stroke="#fff" strokeWidth={3.5} strokeLinecap="round" />
                  </g>
                )}
                {n.label && <text y={h + 19} textAnchor="middle" fontSize="15" fontWeight={800} className="fill-foreground" opacity={dim ? 0.4 : 1}>{n.label}</text>}
                {sub && <text y={h + 35} textAnchor="middle" fontSize="12.5" className="fill-muted-foreground font-mono" opacity={dim ? 0.4 : 1}>{sub}</text>}
              </g>
            );
          })}

          {flights.map((f, k) => (
            <Packet key={`${i}-${answered[i] ?? ""}-${k}`} points={f.points} label={f.label} tone={f.tone} delay={f.delay} speed={speed} lost={!!f.lostAt} />
          ))}

          {!waiting && step?.marks && Object.entries(step.marks).map(([id, m]) => {
            const n = byId.get(id);
            if (!n) return null;
            const h = deviceHalfHeight(n.kind) * SCALE;
            const w = Math.min(280, m.text.length * 7.6 + 24);
            const tone = m.tone ?? "info";
            const cls = tone === "ok" ? "fill-emerald-500" : tone === "drop" ? "fill-rose-500" : tone === "warn" ? "fill-amber-500" : "fill-slate-700 dark:fill-slate-200";
            const txt = tone === "info" ? "fill-white dark:fill-slate-900" : "fill-white";
            const at = (m.at ?? animEnd * speed) / speed;
            const top = n.y - h - 14;
            const x = Math.max(w / 2 + 4, Math.min(width - w / 2 - 4, n.x));
            return (
              <g key={`${i}-${answered[i] ?? ""}-${id}`} style={{ opacity: 0, animation: `netFadeIn .35s ease ${at}s forwards` }}>
                <rect x={x - w / 2} y={top - 27} width={w} height={25} rx={12.5} className={cls} />
                <path d={`M ${n.x - 5} ${top - 3} L ${n.x} ${top + 4} L ${n.x + 5} ${top - 3} Z`} className={cls} />
                <text x={x} y={top - 10} textAnchor="middle" fontSize="13" fontWeight={700} className={txt}>{m.text}</text>
              </g>
            );
          })}
        </svg>

        {i < 0 && (
          <button type="button" onClick={start} className="absolute inset-0 flex items-center justify-center bg-background/40 backdrop-blur-[1px] group">
            <span className="flex items-center gap-3 rounded-full bg-hero-gradient text-white pl-5 pr-6 py-3 font-semibold shadow-xl shadow-neon-purple/30 group-hover:scale-105 transition-transform">
              <span className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center"><Play className="w-5 h-5 fill-white" /></span>
              Ko&apos;rsatish
            </span>
          </button>
        )}
      </div>

      <div className="border-t border-border/60 bg-surface/40 px-5 py-4 space-y-3">
        <div className={cn("text-[15px] md:text-base leading-relaxed", !waiting && "min-h-[52px]")} aria-live="polite">
          {step ? (waiting ? null : step.say) : <span className="text-muted-foreground">&quot;Ko&apos;rsatish&quot; tugmasini bosing — voqea qadamma-qadam ko&apos;rsatiladi, orada sizga savollar beriladi.</span>}
        </div>

        {ask && (
          <div className={cn("rounded-2xl border-2 px-4 py-3 space-y-2.5", waiting ? "border-neon-purple/50 bg-neon-purple/[0.06]" : "border-emerald-500/40 bg-emerald-500/[0.07]")}>
            <p className="font-semibold flex items-start gap-2">
              {waiting ? <HelpCircle className="w-5 h-5 text-neon-purple shrink-0 mt-0.5" /> : <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />}
              <span>{ask.q}</span>
            </p>
            {waiting && ask.pick && (
              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                <MousePointerClick className="w-4 h-4" />
                {Array.isArray(ask.pick) ? "Sahnadagi kerakli qurilmalarni bosib belgilang, keyin «Tekshirish»." : "Javob uchun sahnadagi qurilmani bosing."}
              </p>
            )}
            {waiting && ask.options && (
              <div className="flex flex-wrap gap-2">
                {ask.options.map((o, k) => (
                  <button key={o} type="button" onClick={() => grade(k === ask.answer, `«${o}» — to'g'ri emas. ${ask.hint ?? ""}`.trim())}
                    className="px-4 py-2 rounded-xl border border-border bg-card hover:border-neon-purple hover:bg-neon-purple/5 text-sm font-medium transition-colors">
                    {o}
                  </button>
                ))}
              </div>
            )}
            {waiting && Array.isArray(ask.pick) && (
              <button type="button" onClick={checkMulti} disabled={sel.length === 0}
                className="btn-primary py-2 px-4 text-sm disabled:opacity-50">Tekshirish ({sel.length})</button>
            )}
            {waiting && wrong && (
              <p className="text-sm text-rose-600 dark:text-rose-400 flex items-start gap-1.5"><XCircle className="w-4 h-4 shrink-0 mt-0.5" />{wrong}</p>
            )}
            {waiting && (
              <button type="button" onClick={() => { grade(false, ""); setAnswered((a) => ({ ...a, [i]: "shown" })); }}
                className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> Javobni ko&apos;rsatish</button>
            )}
            {!waiting && (
              <p className="text-sm leading-relaxed">
                {answered[i] === "ok" ? <b className="text-emerald-600 dark:text-emerald-400">To&apos;g&apos;ri! </b> : <b>Javob: </b>}
                {ask.explain}
              </p>
            )}
          </div>
        )}

        {step?.panel && (!waiting || step.panelDuringAsk) && <div>{step.panel}</div>}

        <div className="flex flex-wrap items-center gap-2">
          <button type="button" aria-label="Boshidan" onClick={() => { setI(-1); setPlaying(false); }}
            className="w-9 h-9 rounded-full border border-border bg-card flex items-center justify-center hover:bg-surface"><RotateCcw className="w-4 h-4" /></button>
          <button type="button" aria-label="Oldingi qadam" disabled={i <= 0} onClick={() => { setPlaying(false); setI((x) => Math.max(0, x - 1)); }}
            className="w-9 h-9 rounded-full border border-border bg-card flex items-center justify-center hover:bg-surface disabled:opacity-40"><ChevronLeft className="w-4 h-4" /></button>
          <button type="button" aria-label={playing ? "To'xtatish" : "Davom etish"}
            onClick={() => { if (i < 0) start(); else if (i >= steps.length - 1) { setI(0); setPlaying(true); } else setPlaying((p) => !p); }}
            className="w-11 h-11 rounded-full bg-hero-gradient text-white flex items-center justify-center shadow-lg shadow-neon-purple/20">
            {playing && !waiting ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
          </button>
          <button type="button" aria-label="Keyingi qadam" disabled={i >= steps.length - 1 || waiting} onClick={() => { setPlaying(false); setI((x) => Math.min(steps.length - 1, x + 1)); }}
            className="w-9 h-9 rounded-full border border-border bg-card flex items-center justify-center hover:bg-surface disabled:opacity-40"><ChevronRight className="w-4 h-4" /></button>

          <div className="flex items-center ml-1">
            {steps.map((s, k) => (
              <button key={k} type="button" aria-label={`${k + 1}-qadam`} onClick={() => { setPlaying(false); setI(k); }} className="h-6 px-0.5 flex items-center">
                <span className={cn("block h-2 rounded-full transition-all",
                  k === i ? "w-6 bg-neon-purple" : s.ask ? (answered[k] ? "w-2 bg-emerald-500" : "w-2 bg-amber-400") : k < i ? "w-2 bg-neon-purple/50" : "w-2 bg-border")} />
              </button>
            ))}
          </div>

          <div className="ml-auto inline-flex rounded-full border border-border p-0.5">
            {SPEEDS.map((s, k) => (
              <button key={s.t} type="button" onClick={() => setSp(k)}
                className={cn("text-xs px-2.5 py-1 rounded-full", sp === k ? "bg-foreground text-background" : "text-muted-foreground")}>{s.t}</button>
            ))}
          </div>
        </div>

        {i === steps.length - 1 && totalAsks > 0 && (
          <p className="text-sm text-muted-foreground">
            Natija: {score.ok} / {totalAsks} savolga birinchi urinishda to&apos;g&apos;ri javob berdingiz.{score.ok < totalAsks && " Qayta ko'rish uchun ⟲ ni bosing."}
          </p>
        )}
      </div>
      <style>{`@keyframes netFadeIn { from { opacity: 0; transform: translateY(4px) } to { opacity: 1; transform: none } }`}</style>
    </div>
  );
}

/** Pastdagi kichik jadval kartasi */
export function MiniTable({ title, head, rows, highlight }: { title: string; head: string[]; rows: string[][]; highlight?: number }) {
  return (
    <div className="inline-block rounded-xl border border-border bg-card text-[13px] overflow-hidden min-w-[220px] max-w-full">
      <div className="px-3 py-1.5 text-xs font-semibold bg-surface/70 border-b border-border">{title}</div>
      <table className="w-full">
        <thead><tr className="text-[11px] text-muted-foreground">{head.map((h) => <th key={h} className="text-left px-3 py-1 font-medium">{h}</th>)}</tr></thead>
        <tbody>
          {rows.length === 0 && <tr><td colSpan={head.length} className="px-3 py-2 text-muted-foreground text-xs">bo&apos;sh</td></tr>}
          {rows.map((r, k) => (
            <tr key={k} className={cn("border-t border-border/50 font-mono", k === highlight && "bg-emerald-500/15")}>
              {r.map((c, j) => <td key={j} className="px-3 py-1">{c}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Buyruq qatori natijasi */
export function Console({ lines }: { lines: string[] }) {
  return (
    <div className="rounded-xl bg-[#0c0c0c] text-[#e6e6e6] font-mono text-[12.5px] leading-snug px-4 py-3 whitespace-pre-wrap overflow-x-auto">
      {lines.join("\n")}
    </div>
  );
}

/** Bitlar qatori: har bit katakda, kerakli qismi rangli (IP, maska, kodlash uchun) */
export function Bits({ label, bits, split, tone = "purple" }: { label: string; bits: string; split?: number; tone?: "purple" | "amber" }) {
  return (
    <div className="flex items-center gap-2 font-mono text-[13px]">
      <span className="w-24 shrink-0 text-xs text-muted-foreground font-sans">{label}</span>
      <span className="flex flex-wrap gap-y-1">
        {bits.split("").map((b, k) => (
          b === "." ? <span key={k} className="w-2" /> : (
            <span key={k} className={cn("w-[15px] text-center rounded",
              split !== undefined && bits.slice(0, k).replace(/\./g, "").length < split
                ? tone === "purple" ? "bg-neon-purple/15 text-neon-purple font-bold" : "bg-amber-500/15 text-amber-600 font-bold"
                : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400")}>{b}</span>
          )
        ))}
      </span>
    </div>
  );
}
