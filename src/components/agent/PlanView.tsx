"use client";

/**
 * O'quv reja — "yo'l" ko'rinishida.
 *
 * DIZAYN QARORI: reja ro'yxat emas, uzluksiz yo'l qilib ko'rsatiladi.
 * Chiziqning o'zi ma'lumot tashiydi:
 *   to'liq chiziq  — o'tilgan yo'l
 *   uzuq chiziq    — hali ochilmagan
 *   halqa          — hozir turgan joyingiz
 *
 * Va eng muhimi: Ustoz o'zi qo'shgan modul yo'ldan chetga chiqib,
 * amber rangda belgilanadi. Bu shunchaki bezak emas — agentning
 * boshqa kurslardan asosiy farqi shu: reja o'quvchiga qarab
 * o'zgaradi. Buni ko'rmasa, o'quvchi bunga hech qachon e'tibor
 * bermaydi. Amber butun sahifada faqat shu maqsadda ishlatiladi.
 *
 * Qulflangan modul ataylab ko'rinadi (faqat bosib bo'lmaydi):
 * butun yo'lni ko'rgan odam oxiri borligini biladi.
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Check, Lock, Play, Loader2, RotateCcw, ChevronRight, SkipForward, Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

interface Module {
  id: string;
  order_index: number;
  title: string;
  summary: string | null;
  topic_key: string;
  level: string;
  estimated_minutes: number;
  status: "locked" | "active" | "done" | "skipped";
}

interface Track {
  id: string;
  title: string;
  goal: string | null;
  start_level: string;
  target_level: string;
  weekly_hours: number;
}

const LEVEL_LABELS: Record<string, string> = {
  zero: "Noldan",
  beginner: "Boshlang'ich",
  intermediate: "O'rta",
  advanced: "Yuqori",
};

/**
 * Ustoz qo'shgan modulni aniqlash: Tracker unga `.practice` bilan
 * tugaydigan kalit beradi (`agent_remedial_v1` prompti va zaxira
 * varianti ham shunday qiladi).
 */
function isRemedial(m: Module): boolean {
  return m.topic_key.endsWith(".practice");
}

export default function PlanView({ track, modules }: { track: Track; modules: Module[] }) {
  const { t } = useI18n();
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);

  const done = modules.filter((m) => m.status === "done" || m.status === "skipped").length;
  const percent = modules.length ? Math.round((done / modules.length) * 100) : 0;
  const totalMinutes = modules.reduce((s, m) => s + (m.estimated_minutes || 0), 0);
  const addedByUstoz = modules.filter(isRemedial).length;

  async function setStatus(moduleId: string, status: string) {
    setBusyId(moduleId);
    try {
      await fetch("/api/agent/plan", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleId, status }),
      });
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="py-8">
      {/* Sarlavha — yo'lning boshi */}
      <header className="mb-10">
        <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          {LEVEL_LABELS[track.start_level] || track.start_level}
          <span className="mx-2 text-neon-purple">→</span>
          {LEVEL_LABELS[track.target_level] || track.target_level}
        </div>

        <h1 className="font-display text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl">
          {track.title}
        </h1>

        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs text-muted-foreground">
          <span><span className="text-foreground">{modules.length}</span> modul</span>
          <span><span className="text-foreground">~{Math.round(totalMinutes / 60)}</span> soat</span>
          <span>haftasiga <span className="text-foreground">{track.weekly_hours}</span> soat</span>
          {addedByUstoz > 0 && (
            <span className="text-neon-yellow">
              {addedByUstoz} ta modulni Ustoz qo'shgan
            </span>
          )}
        </div>

        {/* Progress — yo'lning necha foizi bosib o'tilgani */}
        <div className="mt-6">
          <div className="mb-2 flex items-baseline justify-between font-mono text-xs">
            <span className="text-muted-foreground">{done} / {modules.length} bosib o'tildi</span>
            <span className="text-lg font-bold text-foreground">{percent}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full rounded-full bg-neon-purple"
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>

        <Link
          href="/agent/reja?yangi=1"
          className="mt-6 inline-flex items-center gap-2 font-mono text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          {t.agent.pickOtherTrack}
        </Link>
      </header>

      {/* Yo'l */}
      <ol className="relative">
        {modules.map((m, i) => {
          const isLocked = m.status === "locked";
          const isDone = m.status === "done";
          const isSkipped = m.status === "skipped";
          const isActive = m.status === "active";
          const remedial = isRemedial(m);
          const isLast = i === modules.length - 1;

          return (
            <motion.li
              key={m.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.4), duration: 0.3 }}
              className={cn("relative pb-3 pl-14", remedial && "pl-20")}
            >
              {/* Yo'l chizig'i: o'tilgan qism to'liq, oldindagisi uzuq */}
              {!isLast && (
                <span
                  aria-hidden
                  className={cn(
                    "absolute left-[19px] top-9 h-[calc(100%-1.25rem)] w-px",
                    isDone || isSkipped
                      ? "bg-neon-purple/50"
                      : "bg-[linear-gradient(to_bottom,hsl(var(--border))_50%,transparent_50%)] bg-[length:1px_6px]",
                  )}
                />
              )}

              {/* Ustoz qo'shgan modul yo'ldan chetga chiqadi */}
              {remedial && (
                <span
                  aria-hidden
                  className="absolute left-[19px] top-[19px] h-px w-6 bg-neon-yellow/60"
                />
              )}

              {/* Bekat */}
              <span
                className={cn(
                  "absolute top-[7px] flex h-[26px] w-[26px] items-center justify-center rounded-full border font-mono text-[11px] font-medium",
                  remedial ? "left-[26px]" : "left-[7px]",
                  isDone && "border-neon-purple bg-neon-purple text-white",
                  isSkipped && "border-border bg-muted text-muted-foreground",
                  isActive && "border-neon-purple bg-background text-neon-purple",
                  isLocked && "border-border bg-background text-muted-foreground/60",
                  remedial && !isDone && "border-neon-yellow text-neon-yellow",
                )}
              >
                {isDone ? <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  : isSkipped ? <SkipForward className="h-3 w-3" />
                  : isLocked ? <Lock className="h-3 w-3" />
                  : m.order_index}
              </span>

              {/* Hozirgi bekat atrofidagi halqa */}
              {isActive && (
                <span
                  aria-hidden
                  className={cn(
                    "absolute top-[3px] h-[34px] w-[34px] rounded-full ring-2 ring-neon-purple/25",
                    "motion-safe:animate-pulse",
                    remedial ? "left-[22px]" : "left-[3px]",
                  )}
                />
              )}

              <div
                className={cn(
                  "rounded-2xl border p-4 transition-colors",
                  isActive
                    ? remedial
                      ? "border-neon-yellow/40 bg-neon-yellow/[0.04]"
                      : "border-neon-purple/40 bg-neon-purple/[0.04]"
                    : "border-transparent",
                  isLocked && "opacity-50",
                )}
              >
                {remedial && (
                  <div className="mb-1.5 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-neon-yellow">
                    <Sparkles className="h-3 w-3" />
                    Ustoz qo'shdi
                  </div>
                )}

                <h2 className={cn(
                  "font-display font-semibold leading-snug",
                  isActive ? "text-lg" : "text-[15px]",
                )}>
                  {m.title}
                </h2>

                {m.summary && (
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {m.summary}
                  </p>
                )}

                <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] text-muted-foreground">
                  <span>{m.estimated_minutes} daq</span>
                  <span>{LEVEL_LABELS[m.level] || m.level}</span>
                  <span className="opacity-50">{m.topic_key}</span>
                </div>

                {isActive && (
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <Link
                      href={`/agent/dars/${m.id}`}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-white",
                        remedial ? "bg-neon-yellow text-[hsl(232_33%_10%)]" : "bg-neon-purple",
                      )}
                    >
                      <Play className="h-3.5 w-3.5" fill="currentColor" />
                      {t.agent.openLesson}
                    </Link>

                    <button
                      onClick={() => setStatus(m.id, "done")}
                      disabled={busyId === m.id}
                      className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 font-mono text-xs text-muted-foreground hover:text-foreground disabled:opacity-40"
                    >
                      {busyId === m.id
                        ? <Loader2 className="h-3 w-3 animate-spin" />
                        : <ChevronRight className="h-3 w-3" />}
                      bilaman, o'tkazish
                    </button>
                  </div>
                )}

                {(isDone || isSkipped) && (
                  <Link
                    href={`/agent/dars/${m.id}`}
                    className="mt-2 inline-block font-mono text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                  >
                    {t.agent.reread}
                  </Link>
                )}
              </div>
            </motion.li>
          );
        })}
      </ol>

      {/* Yo'lning oxiri */}
      <div className="relative mt-2 pl-14">
        <span className="absolute left-[13px] top-1 h-3.5 w-3.5 rounded-full border-2 border-dashed border-border" />
        <span className="font-mono text-xs text-muted-foreground">
          {percent === 100 ? "yo'l tugadi" : t.agent.pathEndsHere}
        </span>
      </div>
    </div>
  );
}
