"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

/**
 * Laboratoriya vizual tajribalari uchun umumiy qismlar.
 * Hamma tajriba bir xil ko'rinishda bo'lishi uchun shu yerda turadi.
 */

/** Bitta tajriba bloki: sarlavha, qisqa izoh va ichki tarkib. */
export function VizSection({
  icon: Icon,
  title,
  hint,
  color = "text-neon-purple bg-neon-purple/10",
  children,
}: {
  icon: LucideIcon;
  title: string;
  hint?: string;
  color?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border/60 bg-card/60 p-4 md:p-5 space-y-4">
      <header className="flex items-start gap-3">
        <span className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0", color)}>
          <Icon className="w-[18px] h-[18px]" />
        </span>
        <div className="min-w-0">
          <h3 className="font-display font-bold text-base leading-tight">{title}</h3>
          {hint && <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{hint}</p>}
        </div>
      </header>
      {children}
    </section>
  );
}

/** Kod qatori — bitta satrli, monospace, gorizontal aylantiriladi. */
export function CodeLine({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "font-mono text-[13px] leading-relaxed rounded-xl bg-[#0d1117] text-[#e6edf3] border border-border/60 px-3.5 py-2.5 overflow-x-auto whitespace-pre",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Tugmalar guruhidagi kichik "chip" tugma. */
export function Chip({
  active,
  onClick,
  children,
  className,
  disabled,
  title,
}: {
  active?: boolean;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        "px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap",
        active
          ? "bg-foreground text-background border-foreground"
          : "bg-surface/60 border-border hover:bg-surface text-foreground",
        className,
      )}
      style={{ minHeight: 32 }}
    >
      {children}
    </button>
  );
}

/** Python turi belgisi — rang bilan: int, float, str, bool, list, None, xato. */
const TYPE_COLORS: Record<string, string> = {
  int: "bg-sky-500/15 text-sky-500 border-sky-500/30",
  float: "bg-violet-500/15 text-violet-500 border-violet-500/30",
  str: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30",
  bool: "bg-amber-500/15 text-amber-600 border-amber-500/30",
  list: "bg-pink-500/15 text-pink-500 border-pink-500/30",
  NoneType: "bg-zinc-500/15 text-zinc-500 border-zinc-500/30",
  error: "bg-red-500/15 text-red-500 border-red-500/30",
};

export function TypeBadge({ type }: { type: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-mono font-semibold border",
        TYPE_COLORS[type] ?? TYPE_COLORS.NoneType,
      )}
    >
      {type}
    </span>
  );
}

/** Kichik raqamli kiritish maydoni (qadamlar, qiymatlar uchun). */
export function NumField({
  label,
  value,
  onChange,
  placeholder,
  width = "w-20",
  allowEmpty = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  width?: string;
  allowEmpty?: boolean;
}) {
  return (
    <label className="inline-flex flex-col gap-1">
      <span className="text-[11px] font-mono text-muted-foreground">{label}</span>
      <input
        inputMode="decimal"
        value={value}
        placeholder={placeholder}
        onChange={(e) => {
          const v = e.target.value.trim();
          if (v === "" && allowEmpty) return onChange("");
          if (/^-?\d*\.?\d*$/.test(v)) onChange(v);
        }}
        className={cn(
          "input-field font-mono text-sm py-1.5 px-2.5 text-center",
          width,
        )}
      />
    </label>
  );
}

/** Qadamma-qadam boshqaruv: orqaga, keyingi, boshidan. */
export function StepControls({
  step,
  total,
  onPrev,
  onNext,
  onReset,
  labels,
}: {
  step: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  onReset: () => void;
  labels: { prev: string; next: string; reset: string; step: string };
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Chip onClick={onPrev} disabled={step <= 0}>← {labels.prev}</Chip>
      <Chip onClick={onNext} disabled={step >= total - 1} active>
        {labels.next} →
      </Chip>
      <Chip onClick={onReset}>↺ {labels.reset}</Chip>
      <span className="text-xs font-mono text-muted-foreground ml-1">
        {labels.step}: {Math.min(step + 1, total)}/{total}
      </span>
    </div>
  );
}

/** Ma'lumot / ogohlantirish qutisi. */
export function Note({
  tone = "info",
  children,
}: {
  tone?: "info" | "ok" | "warn" | "error";
  children: ReactNode;
}) {
  const cls = {
    info: "bg-neon-purple/[0.06] border-neon-purple/20 text-foreground",
    ok: "bg-neon-green/[0.07] border-neon-green/25 text-foreground",
    warn: "bg-amber-500/[0.08] border-amber-500/25 text-foreground",
    error: "bg-red-500/[0.07] border-red-500/25 text-foreground",
  }[tone];
  return <div className={cn("rounded-xl border px-3.5 py-2.5 text-[13px] leading-relaxed", cls)}>{children}</div>;
}

/**
 * Matndagi {kalit} o'rinlarini to'ldiradi — HAMMA uchrashuvini.
 * `String.replace` faqat birinchisini almashtiradi, shuning uchun
 * "{before} % 10 = … , {before} // 10 = …" kabi matnlarda xato berardi.
 */
export function fill(template: string, vars: Record<string, string | number>): string {
  return Object.entries(vars).reduce(
    (s, [k, v]) => s.split(`{${k}}`).join(String(v)),
    template,
  );
}
