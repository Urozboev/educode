"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "@/components/i18n/Link";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { Slide } from "@/types";
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, Check, X, Lightbulb, Play } from "lucide-react";

/**
 * Mavzu taqdimoti.
 *
 * Ko'rinish g'oyasi — katak daftar varag'i: nozik katakli to'r va chap
 * tomonda qizil hoshiya chizig'i, slayd raqami hoshiyaga "qo'lda" yozilgan
 * kabi turadi. Kod esa varaqqa yopishtirilgan qorong'i ekran. Har bir
 * slayd turining o'z rangi bor — talaba nima qilishi kerakligini
 * (o'qish, o'ylash, javob berish, yozish) ranggidan biladi.
 *
 * Slaydlar `topics.slides` dan keladi (73-migratsiya). Matnda HTML yo'q —
 * `kod` va **qalin** shu yerda React elementlariga aylanadi, shuning uchun
 * dangerouslySetInnerHTML kerak emas.
 */

const PLAYGROUND_PREFILL_KEY = "playground:prefill";

type Tone = "amber" | "blue" | "purple" | "green" | "coral" | "ink";

const TONE: Record<Tone, { text: string; bg: string; border: string; dot: string }> = {
  amber: { text: "text-neon-yellow", bg: "bg-neon-yellow/10", border: "border-neon-yellow/30", dot: "bg-neon-yellow" },
  blue: { text: "text-neon-blue", bg: "bg-neon-blue/10", border: "border-neon-blue/30", dot: "bg-neon-blue" },
  purple: { text: "text-neon-purple", bg: "bg-neon-purple/10", border: "border-neon-purple/30", dot: "bg-neon-purple" },
  green: { text: "text-neon-green", bg: "bg-neon-green/10", border: "border-neon-green/30", dot: "bg-neon-green" },
  coral: { text: "text-neon-red", bg: "bg-neon-red/10", border: "border-neon-red/30", dot: "bg-neon-red" },
  ink: { text: "text-foreground", bg: "bg-surface", border: "border-border", dot: "bg-foreground/60" },
};

function toneOf(s: Slide): Tone {
  switch (s.t) {
    case "idea": return "amber";
    case "code": return "blue";
    case "quiz": return "purple";
    case "task": return "green";
    case "compare": return "coral";
    case "summary": return "green";
    default: return "ink";
  }
}

/* ------------------------------------------------------------------ matn */

/** `kod` va **qalin** belgilashlarini xavfsiz React elementlariga aylantiradi. */
function Rich({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) => {
        if (p.startsWith("`") && p.endsWith("`") && p.length > 1) {
          return (
            <code key={i} className="font-mono text-[0.88em] px-[0.35em] py-[0.05em] rounded-md bg-surface border border-border text-neon-green whitespace-nowrap">
              {p.slice(1, -1)}
            </code>
          );
        }
        if (p.startsWith("**") && p.endsWith("**") && p.length > 4) {
          return <strong key={i} className="font-semibold text-foreground">{p.slice(2, -2)}</strong>;
        }
        return <span key={i}>{p}</span>;
      })}
    </>
  );
}

/* ------------------------------------------------------------------ kod */

const KW = new Set([
  "def", "return", "if", "elif", "else", "for", "while", "in", "import", "from", "class",
  "try", "except", "finally", "raise", "with", "as", "and", "or", "not", "is", "break",
  "continue", "pass", "lambda", "global", "None", "True", "False", "del", "yield",
]);
const BUILTIN = new Set([
  "print", "input", "len", "range", "int", "str", "float", "list", "dict", "set", "tuple",
  "sum", "min", "max", "sorted", "type", "open", "enumerate", "abs", "round", "map",
  "isinstance", "zip", "bool", "super", "reversed", "any", "all",
]);

/** Python uchun yengil rang berish — kutubxonasiz, 9 ta slayd uchun yetarli. */
function highlight(code: string): ReactNode[] {
  const re = /(#[^\n]*)|("""[\s\S]*?"""|'''[\s\S]*?'''|[rbfRBF]{0,2}"[^"\n]*"|[rbfRBF]{0,2}'[^'\n]*')|(\b\d+(?:\.\d+)?\b)|(\b[A-Za-z_]\w*\b)/g;
  const out: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(code))) {
    if (m.index > last) out.push(code.slice(last, m.index));
    const [tok, com, str, num, word] = m;
    let cls = "";
    if (com) cls = "text-[#8b949e] italic";
    else if (str) cls = "text-[#a5d6a7]";
    else if (num) cls = "text-[#f2cc60]";
    else if (word && KW.has(word)) cls = "text-[#c4a7ff]";
    else if (word && BUILTIN.has(word)) cls = "text-[#7cc7ff]";
    out.push(cls ? <span key={k++} className={cls}>{tok}</span> : tok);
    last = m.index + tok.length;
  }
  if (last < code.length) out.push(code.slice(last));
  return out;
}

function CodeScreen({ code, className }: { code: string; className?: string }) {
  return (
    <pre className={cn(
      "rounded-xl bg-[#0f1420] text-[#e6edf3] border border-black/20 shadow-[0_10px_30px_-12px_hsl(var(--shadow-color)/0.45)]",
      "px-[1.1em] py-[0.9em] overflow-x-auto font-mono text-[0.82em] leading-[1.65]",
      className,
    )}>
      <code>{highlight(code)}</code>
    </pre>
  );
}

function OutputBox({ label, text }: { label: string; text: string }) {
  return (
    <div className="rounded-xl border border-neon-green/30 bg-neon-green/[0.06] overflow-hidden">
      <div className="px-[0.9em] pt-[0.5em] text-[0.72em] font-semibold text-neon-green">{label}</div>
      <pre className="px-[0.9em] pb-[0.6em] pt-[0.2em] font-mono text-[0.8em] leading-[1.6] text-foreground whitespace-pre-wrap break-words">
        {text}
      </pre>
    </div>
  );
}

/* ------------------------------------------------------------------ slaydlar */

function Kind({ tone, children }: { tone: Tone; children: ReactNode }) {
  const c = TONE[tone];
  return (
    <span className={cn("inline-flex items-center gap-[0.45em] text-[0.74em] font-semibold rounded-full px-[0.75em] py-[0.25em] border", c.text, c.bg, c.border)}>
      <span className={cn("w-[0.45em] h-[0.45em] rounded-full", c.dot)} />
      {children}
    </span>
  );
}

function Heading({ children }: { children: ReactNode }) {
  return (
    <h3 className="font-display font-bold text-[1.55em] md:text-[1.75em] leading-[1.18] tracking-[-0.02em] text-foreground">
      {children}
    </h3>
  );
}

function QuizSlide({ s, labels }: { s: Extract<Slide, { t: "quiz" }>; labels: Record<string, string> }) {
  const [picked, setPicked] = useState<number | null>(null);
  const done = picked !== null;
  return (
    <div className="space-y-[1em]">
      <Heading><Rich text={s.question} /></Heading>
      {s.code && <CodeScreen code={s.code} />}
      <div className="grid gap-[0.55em] sm:grid-cols-2">
        {s.options.map((o, i) => {
          const isRight = i === s.answer;
          const isPicked = i === picked;
          return (
            <button
              key={i}
              type="button"
              disabled={done}
              onClick={() => setPicked(i)}
              className={cn(
                "text-left flex items-start gap-[0.7em] rounded-xl border px-[0.9em] py-[0.7em] text-[0.95em] transition-colors",
                !done && "border-border bg-card/70 hover:border-neon-purple/50 hover:bg-neon-purple/[0.05]",
                done && isRight && "border-neon-green/50 bg-neon-green/10",
                done && isPicked && !isRight && "border-neon-red/50 bg-neon-red/10",
                done && !isRight && !isPicked && "border-border/60 opacity-55",
              )}
            >
              <span className={cn(
                "flex-shrink-0 w-[1.7em] h-[1.7em] rounded-lg flex items-center justify-center font-mono text-[0.8em] font-bold border",
                done && isRight ? "bg-neon-green text-white border-transparent"
                  : done && isPicked ? "bg-neon-red text-white border-transparent"
                  : "border-border text-muted-foreground",
              )}>
                {done && isRight ? <Check className="w-[1em] h-[1em]" /> : done && isPicked ? <X className="w-[1em] h-[1em]" /> : String.fromCharCode(65 + i)}
              </span>
              <span className="pt-[0.1em]"><Rich text={o} /></span>
            </button>
          );
        })}
      </div>
      {done && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn("rounded-xl border px-[1em] py-[0.75em] text-[0.92em]",
            picked === s.answer ? "border-neon-green/30 bg-neon-green/[0.06]" : "border-neon-red/30 bg-neon-red/[0.06]")}
        >
          <span className={cn("font-semibold mr-[0.4em]", picked === s.answer ? "text-neon-green" : "text-neon-red")}>
            {picked === s.answer ? labels.correct : labels.wrong}
          </span>
          <span className="text-foreground/80"><Rich text={s.explain} /></span>
        </motion.div>
      )}
    </div>
  );
}

function TaskSlide({ s, labels }: { s: Extract<Slide, { t: "task" }>; labels: Record<string, string> }) {
  const [hint, setHint] = useState(false);
  return (
    <div className="space-y-[1em]">
      <Heading><Rich text={s.title} /></Heading>
      <p className="text-[1.05em] leading-[1.6] text-foreground/85 whitespace-pre-line"><Rich text={s.text} /></p>
      {s.starter && <CodeScreen code={s.starter} />}
      <div className="flex flex-wrap gap-[0.6em]">
        {s.hint && (
          <button
            type="button"
            onClick={() => setHint((h) => !h)}
            className="inline-flex items-center gap-[0.45em] rounded-xl border border-neon-yellow/40 bg-neon-yellow/10 text-neon-yellow px-[0.9em] py-[0.5em] text-[0.85em] font-semibold"
          >
            <Lightbulb className="w-[1.05em] h-[1.05em]" /> {hint ? labels.hideHint : labels.showHint}
          </button>
        )}
        <Link
          href="/playground"
          onClick={() => {
            try { sessionStorage.setItem(PLAYGROUND_PREFILL_KEY, s.starter || "# " + s.title + "\n"); } catch { /* yopiq bo'lsa oddiy ochiladi */ }
          }}
          className="inline-flex items-center gap-[0.45em] rounded-xl bg-neon-green text-white px-[0.9em] py-[0.5em] text-[0.85em] font-semibold hover:opacity-90"
        >
          <Play className="w-[1em] h-[1em]" /> {labels.tryInPlayground}
        </Link>
      </div>
      {hint && s.hint && (
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-neon-yellow/30 bg-neon-yellow/[0.07] px-[1em] py-[0.7em] text-[0.92em] text-foreground/85"
        >
          <Rich text={s.hint} />
        </motion.p>
      )}
    </div>
  );
}

function SlideBody({ s, labels }: { s: Slide; labels: Record<string, string> }) {
  switch (s.t) {
    case "title":
      return (
        <div className="h-full flex flex-col justify-center gap-[0.9em]">
          {s.emoji && <div className="text-[4.2em] leading-none" aria-hidden>{s.emoji}</div>}
          <h2 className="font-display font-extrabold text-[2.1em] md:text-[2.6em] leading-[1.08] tracking-[-0.03em] text-foreground max-w-[18ch]">
            {s.title}
          </h2>
          {s.subtitle && (
            <p className="text-[1.15em] text-muted-foreground max-w-[42ch] leading-[1.5]"><Rich text={s.subtitle} /></p>
          )}
        </div>
      );

    case "idea":
      return (
        <div className="h-full flex flex-col justify-center gap-[1.1em]">
          <Kind tone="amber">{labels.idea}</Kind>
          <div className="flex flex-col sm:flex-row gap-[1.2em] sm:items-center">
            {s.emoji && (
              <div className="flex-shrink-0 w-[3.4em] h-[3.4em] rounded-[1.1em] bg-neon-yellow/10 border border-neon-yellow/30 flex items-center justify-center text-[1.9em]" aria-hidden>
                {s.emoji}
              </div>
            )}
            <div className="space-y-[0.6em]">
              <Heading><Rich text={s.title} /></Heading>
              <p className="text-[1.12em] leading-[1.6] text-foreground/85 max-w-[52ch] whitespace-pre-line"><Rich text={s.text} /></p>
            </div>
          </div>
        </div>
      );

    case "points":
      return (
        <div className="space-y-[1em]">
          <Kind tone="ink">{labels.points}</Kind>
          <Heading><Rich text={s.title} /></Heading>
          <ul className={cn("grid gap-[0.6em]", s.items.length > 4 && "md:grid-cols-2")}>
            {s.items.map((it, i) => (
              <li key={i} className="flex items-start gap-[0.7em] rounded-xl bg-card/70 border border-border/70 px-[0.9em] py-[0.65em]">
                <span className="text-[1.15em] leading-[1.3] flex-shrink-0" aria-hidden>{it.e || "•"}</span>
                <span className="text-[1em] leading-[1.5] text-foreground/85"><Rich text={it.text} /></span>
              </li>
            ))}
          </ul>
        </div>
      );

    case "code":
      return (
        <div className="space-y-[0.9em]">
          <Kind tone="blue">{labels.code}</Kind>
          <Heading><Rich text={s.title} /></Heading>
          <div className={cn("grid gap-[0.8em]", s.note && "lg:grid-cols-[1.35fr,1fr] lg:items-start")}>
            <div className="space-y-[0.6em] min-w-0">
              <CodeScreen code={s.code} />
              {s.input && <OutputBox label={labels.input} text={s.input} />}
              {s.output !== undefined && <OutputBox label={labels.output} text={s.output || " "} />}
            </div>
            {s.note && (
              <p className="text-[0.98em] leading-[1.6] text-foreground/80 border-l-2 border-neon-blue/50 pl-[0.9em]">
                <Rich text={s.note} />
              </p>
            )}
          </div>
        </div>
      );

    case "compare": {
      const side = (x: { label: string; code?: string; text?: string }, good: boolean) => (
        <div className={cn("rounded-2xl border p-[0.9em] space-y-[0.6em] min-w-0",
          good ? "border-neon-green/40 bg-neon-green/[0.05]" : "border-neon-red/40 bg-neon-red/[0.05]")}>
          <div className={cn("inline-flex items-center gap-[0.4em] font-semibold text-[0.9em]", good ? "text-neon-green" : "text-neon-red")}>
            {good ? <Check className="w-[1.1em] h-[1.1em]" /> : <X className="w-[1.1em] h-[1.1em]" />} {x.label}
          </div>
          {x.code && <CodeScreen code={x.code} />}
          {x.text && <p className="text-[0.95em] leading-[1.55] text-foreground/85"><Rich text={x.text} /></p>}
        </div>
      );
      return (
        <div className="space-y-[1em]">
          <Kind tone="coral">{labels.compare}</Kind>
          <Heading><Rich text={s.title} /></Heading>
          <div className="grid gap-[0.8em] md:grid-cols-2">
            {side(s.left, false)}
            {side(s.right, true)}
          </div>
        </div>
      );
    }

    case "table":
      return (
        <div className="space-y-[1em]">
          <Kind tone="ink">{labels.table}</Kind>
          <Heading><Rich text={s.title} /></Heading>
          <div className="overflow-x-auto rounded-xl border border-border bg-card/70">
            <table className="w-full text-[0.92em] border-separate border-spacing-0">
              <thead>
                <tr>
                  {s.head.map((h, i) => (
                    <th key={i} className="text-left font-semibold px-[0.9em] py-[0.55em] bg-surface border-b border-border">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {s.rows.map((r, i) => (
                  <tr key={i}>
                    {r.map((c, j) => (
                      <td key={j} className={cn("px-[0.9em] py-[0.5em] align-top text-foreground/85", i < s.rows.length - 1 && "border-b border-border/70")}>
                        <Rich text={c} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {s.note && <p className="text-[0.92em] text-muted-foreground"><Rich text={s.note} /></p>}
        </div>
      );

    case "quiz":
      return (
        <div className="space-y-[0.9em]">
          <Kind tone="purple">{s.title || labels.quiz}</Kind>
          <QuizSlide s={s} labels={labels} />
        </div>
      );

    case "task":
      return (
        <div className="space-y-[0.9em]">
          <Kind tone="green">{labels.task}</Kind>
          <TaskSlide s={s} labels={labels} />
        </div>
      );

    case "summary":
      return (
        <div className="space-y-[1em]">
          <Kind tone="green">{labels.summary}</Kind>
          <Heading><Rich text={s.title} /></Heading>
          <ul className="space-y-[0.55em]">
            {s.items.map((it, i) => (
              <li key={i} className="flex items-start gap-[0.7em]">
                <span className="flex-shrink-0 mt-[0.15em] w-[1.35em] h-[1.35em] rounded-full bg-neon-green/15 text-neon-green flex items-center justify-center">
                  <Check className="w-[0.85em] h-[0.85em]" />
                </span>
                <span className="text-[1.04em] leading-[1.5] text-foreground/85"><Rich text={it} /></span>
              </li>
            ))}
          </ul>
        </div>
      );
  }
}

/* ------------------------------------------------------------------ pleyer */

export default function SlideDeck({ slides, title }: { slides: Slide[]; title: string }) {
  const { t } = useI18n();
  const d = t.courses.topic.deck;
  const labels = d as unknown as Record<string, string>;
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const [full, setFull] = useState(false);
  const touchX = useRef<number | null>(null);
  const n = slides.length;

  const go = useCallback((to: number) => {
    const next = Math.max(0, Math.min(n - 1, to));
    setI((cur) => {
      if (next !== cur) setDir(next > cur ? 1 : -1);
      return next;
    });
  }, [n]);

  useEffect(() => {
    const onFs = () => setFull(document.fullscreenElement === rootRef.current);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  function toggleFull() {
    const el = rootRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen?.();
    else el.requestFullscreen?.().catch(() => { /* brauzer ruxsat bermasa — oddiy rejim */ });
  }

  function onKey(e: React.KeyboardEvent) {
    // Javob variantlari yoki tugmalar ichida Enter/Space o'z ishini qilsin
    if (e.key === "ArrowRight" || e.key === "PageDown") { e.preventDefault(); go(i + 1); }
    else if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); go(i - 1); }
    else if (e.key === "Home") { e.preventDefault(); go(0); }
    else if (e.key === "End") { e.preventDefault(); go(n - 1); }
  }

  if (n === 0) return null;
  const s = slides[i];

  return (
    <div
      ref={rootRef}
      tabIndex={0}
      onKeyDown={onKey}
      role="region"
      aria-roledescription="carousel"
      aria-label={title}
      className={cn(
        "outline-none focus-visible:ring-2 focus-visible:ring-neon-purple/50 rounded-3xl",
        full && "bg-background flex flex-col justify-center p-4 md:p-8 rounded-none",
      )}
    >
      {/* Varaq */}
      <div
        onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          touchX.current = null;
          if (Math.abs(dx) > 50) go(i + (dx < 0 ? 1 : -1));
        }}
        className={cn(
          "deck-paper relative overflow-hidden rounded-3xl border border-border/80",
          "shadow-[0_18px_50px_-28px_hsl(var(--shadow-color)/0.5)]",
          full
            ? "w-full mx-auto max-w-[min(100%,calc((100vh-9rem)*1.6))] aspect-[16/10] text-[clamp(0.95rem,1.45vw,1.55rem)]"
            : "min-h-[480px] md:min-h-0 md:aspect-[16/10] text-[0.95rem] md:text-[1rem]",
        )}
      >
        {/* Hoshiya va sahifa raqami */}
        <div className="absolute inset-y-0 left-[2.6em] md:left-[3.6em] w-px bg-neon-red/40" aria-hidden />
        <div className="absolute top-[1.1em] left-0 w-[2.6em] md:w-[3.6em] text-center font-display text-[0.8em] font-semibold text-neon-red/70 tabular-nums" aria-hidden>
          {i + 1}
        </div>

        <AnimatePresence mode="wait" initial={false} custom={dir}>
          <motion.div
            key={i}
            custom={dir}
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: dir * 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, x: dir * -28 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="absolute inset-0 overflow-y-auto pl-[3.5em] md:pl-[4.8em] pr-[1.2em] md:pr-[2.4em] py-[1.4em] md:py-[2em]"
            aria-live="polite"
          >
            <SlideBody s={s} labels={labels} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Boshqaruv */}
      <div className={cn("flex items-center gap-3 mt-3", full && "max-w-[min(100%,calc((100vh-9rem)*1.6))] w-full mx-auto")}>
        <button
          type="button"
          onClick={() => go(i - 1)}
          disabled={i === 0}
          aria-label={d.prev}
          className="w-10 h-10 flex-shrink-0 rounded-xl border border-border bg-card flex items-center justify-center hover:bg-surface disabled:opacity-35 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Har bir slayd — bitta bo'lak; bosib o'sha slaydga o'tiladi */}
        <div className="flex-1 flex items-center gap-1" role="tablist">
          {slides.map((x, k) => (
            <button
              key={k}
              type="button"
              role="tab"
              aria-selected={k === i}
              aria-label={`${k + 1} ${d.of} ${n}`}
              onClick={() => go(k)}
              className="flex-1 h-6 flex items-center group"
            >
              <span className={cn(
                "w-full h-1.5 rounded-full transition-colors",
                k === i ? TONE[toneOf(x)].dot : k < i ? "bg-foreground/25" : "bg-border",
                "group-hover:bg-foreground/40",
              )} />
            </button>
          ))}
        </div>

        <span className="text-xs text-muted-foreground tabular-nums flex-shrink-0 w-12 text-center">
          {i + 1}/{n}
        </span>

        <button
          type="button"
          onClick={toggleFull}
          aria-label={full ? d.exitFullscreen : d.fullscreen}
          title={full ? d.exitFullscreen : d.fullscreen}
          className="hidden sm:flex w-10 h-10 flex-shrink-0 rounded-xl border border-border bg-card items-center justify-center hover:bg-surface"
        >
          {full ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

        <button
          type="button"
          onClick={() => go(i + 1)}
          disabled={i === n - 1}
          aria-label={d.next}
          className="w-10 h-10 flex-shrink-0 rounded-xl bg-foreground text-background flex items-center justify-center hover:opacity-90 disabled:opacity-35 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      {!full && <p className="mt-2 text-[11px] text-muted-foreground text-center">{d.keysHint}</p>}
    </div>
  );
}
