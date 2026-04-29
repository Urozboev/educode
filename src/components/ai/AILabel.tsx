"use client";

import { Bot, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AILabelProps {
  model?: string;
  promptTemplate?: string;
  confidence?: "low" | "medium" | "high";
  generatedAt?: string | Date;
  className?: string;
  compact?: boolean;
}

const confidenceLabel = {
  low: "Past",
  medium: "O'rta",
  high: "Yuqori",
} as const;

const confidenceColor = {
  low: "text-neon-red",
  medium: "text-neon-yellow",
  high: "text-neon-green",
} as const;

/**
 * AI tomonidan yaratilgan kontent yorlig'i (UNESCO 2024 talablariga muvofiq).
 * Har AI javobida ko'rsatiladi: model, vaqt, ishonch darajasi, ogohlantirish.
 */
export function AILabel({
  model,
  promptTemplate,
  confidence,
  generatedAt,
  className,
  compact = false,
}: AILabelProps) {
  const time = generatedAt
    ? new Date(generatedAt).toLocaleString("uz-UZ", { hour: "2-digit", minute: "2-digit" })
    : null;

  if (compact) {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-1 text-[10px] text-muted-foreground",
          className,
        )}
      >
        <Bot className="w-3 h-3 text-neon-blue" />
        <span>AI</span>
        {model && <span className="opacity-70">· {model.split("-")[0]}</span>}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex flex-wrap items-center gap-2 rounded-lg border border-neon-blue/20 bg-neon-blue/5 px-2.5 py-1 text-[11px]",
        className,
      )}
    >
      <span className="inline-flex items-center gap-1 font-medium text-neon-blue">
        <Bot className="w-3.5 h-3.5" /> AI tomonidan yaratilgan
      </span>
      {model && <span className="text-muted-foreground">Model: <span className="font-mono">{model}</span></span>}
      {time && <span className="text-muted-foreground">· {time}</span>}
      {confidence && (
        <span className={cn("font-medium", confidenceColor[confidence])}>
          · Ishonch: {confidenceLabel[confidence]}
        </span>
      )}
      {promptTemplate && (
        <span className="text-muted-foreground/70 font-mono">· {promptTemplate}</span>
      )}
    </div>
  );
}

/**
 * AI javobi tagidagi ogohlantirish — AI ba'zan xato bo'lishi mumkin.
 */
export function AIDisclaimer({ className }: { className?: string }) {
  return (
    <div className={cn("inline-flex items-center gap-1 text-[10px] text-muted-foreground/80", className)}>
      <AlertTriangle className="w-3 h-3 text-neon-yellow/80" />
      <span>AI ba'zan xato qilishi mumkin — javobni mustaqil tekshiring.</span>
    </div>
  );
}
