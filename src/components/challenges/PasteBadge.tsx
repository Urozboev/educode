"use client";

import { cn } from "@/lib/utils";
import { ClipboardPaste } from "lucide-react";
import type { PasteLevel } from "@/types";

/**
 * Yechimda nusxa ko'chirish belgisi.
 *
 * Signal — AYBLOV EMAS: talaba o'z kodini boshqa muharrirdan yoki
 * telefonidan ko'chirgan bo'lishi mumkin. Shuning uchun belgi faqat
 * yechim egasiga, o'qituvchiga va adminga ko'rsatiladi — ochiq
 * reytingda yoki boshqa talabalarga emas.
 */

export function pasteLevel(ratio: number, count: number): PasteLevel {
  if (count === 0) return "none";
  if (ratio >= 80) return "high";
  if (ratio >= 40) return "medium";
  return "low";
}

const STYLE: Record<Exclude<PasteLevel, "none">, { cls: string; label: string }> = {
  low: {
    cls: "text-muted-foreground bg-surface border-border",
    label: "qisman ko'chirilgan",
  },
  medium: {
    cls: "text-neon-yellow bg-neon-yellow/10 border-neon-yellow/30",
    label: "ko'p qismi ko'chirilgan",
  },
  high: {
    cls: "text-neon-red bg-neon-red/10 border-neon-red/30",
    label: "deyarli to'liq ko'chirilgan",
  },
};

export function PasteBadge({
  count,
  ratio,
  chars,
  compact,
}: {
  count: number;
  ratio: number;
  chars?: number;
  compact?: boolean;
}) {
  const level = pasteLevel(ratio, count);
  if (level === "none") return null;

  const s = STYLE[level];

  return (
    <span
      title={`${count} marta nusxa qo'yilgan${chars != null ? `, jami ${chars} belgi` : ""} — kodning ~${ratio}% i`}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border font-medium flex-shrink-0",
        compact ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-1 text-[11px]",
        s.cls
      )}
    >
      <ClipboardPaste className={compact ? "w-3 h-3" : "w-3.5 h-3.5"} />
      {compact ? `${ratio}%` : `Nusxa ${ratio}% — ${s.label}`}
    </span>
  );
}
