"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { SUPPORT_LEVELS, type SupportState } from "@/lib/ai/engagement";
import { cn } from "@/lib/utils";
import { Compass } from "lucide-react";

/**
 * Talabaning joriy SI ko'mak darajasi (89-migratsiya, ai_support_state).
 * Migratsiya yo'q yoki xato bo'lsa — 0 (cheklovsiz), ya'ni hech narsa o'zgarmaydi.
 * `version` o'zgarsa qayta so'raladi (masalan, topshiriq yechilgandan keyin).
 */
export function useSupportState(version: unknown = 0) {
  const [state, setState] = useState<SupportState>({ level: 0 });
  useEffect(() => {
    let alive = true;
    createClient().rpc("ai_support_state").then(({ data, error }) => {
      if (alive && !error && data) setState(data as SupportState);
    });
    return () => { alive = false; };
  }, [version]);
  return state;
}

const TONE = [
  "",
  "border-sky-500/30 bg-sky-500/[0.06]",
  "border-amber-500/30 bg-amber-500/[0.07]",
  "border-rose-500/30 bg-rose-500/[0.06]",
];

/** Daraja > 0 bo'lsa: nima o'zgardi, nega va qanday qaytariladi — ochiq tushuntiriladi */
export default function SupportLevelBanner({ state, className }: { state: SupportState; className?: string }) {
  if (!state || state.level === 0 || state.staff) return null;
  const l = SUPPORT_LEVELS[state.level];
  return (
    <div className={cn("rounded-2xl border px-4 py-3 flex items-start gap-3", TONE[state.level], className)}>
      <Compass className="w-5 h-5 shrink-0 mt-0.5 text-foreground/70" />
      <div className="text-sm space-y-1">
        <p className="font-semibold">SI ko&apos;magi: {l.name} <span className="text-xs font-normal text-muted-foreground">({state.level}/3)</span></p>
        <p className="text-muted-foreground">{l.short}</p>
        <p className="text-xs text-muted-foreground">
          Sababi: oxirgi 7 kunda SIga bog&apos;liqlik ko&apos;rsatkichingiz {state.index ?? "—"}/100
          {state.autonomous != null && <> (mustaqil yechimlar: {state.autonomous})</>}. Bu baho emas — mustaqil ishlash odatini tiklash uchun.
          Topshiriqni maslahatsiz yechsangiz, ko&apos;mak darhol bir bosqich ortadi.
        </p>
      </div>
    </div>
  );
}
