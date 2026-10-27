"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Bir mavzuda bir nechta ssenariy (masalan, "Kommutator | Hub"). Har ssenariy alohida hikoya. */
export function StoryTabs({ tabs, initial }: { tabs: { key: string; label: string; render: () => ReactNode }[]; initial?: string }) {
  const [k, setK] = useState(initial ?? tabs[0].key);
  const cur = tabs.find((t) => t.key === k) ?? tabs[0];
  return (
    <div className="space-y-3">
      <div className="inline-flex flex-wrap p-1 rounded-2xl border border-border/60 bg-card/60 gap-0.5">
        {tabs.map((t) => (
          <button key={t.key} type="button" onClick={() => setK(t.key)}
            className={cn("px-4 py-2 rounded-xl text-sm font-semibold transition-all", k === t.key ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground")}>
            {t.label}
          </button>
        ))}
      </div>
      <div key={cur.key}>{cur.render()}</div>
    </div>
  );
}
