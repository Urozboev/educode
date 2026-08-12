"use client";

/**
 * Tayyor rejani ko'rsatadi: modullar ro'yxati, holati va progress.
 *
 * Qulflangan modul ataylab KO'RINADI (faqat bosib bo'lmaydi) —
 * o'quvchi butun yo'lni oldindan ko'rsa, oxiri bor ekanini biladi
 * va davom etishga turtki bo'ladi.
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Check, Lock, Play, Loader2, Clock, RotateCcw, ChevronRight, SkipForward,
} from "lucide-react";
import { cn } from "@/lib/utils";

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

export default function PlanView({ track, modules }: { track: Track; modules: Module[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [replanning, setReplanning] = useState(false);

  const done = modules.filter((m) => m.status === "done" || m.status === "skipped").length;
  const percent = modules.length ? Math.round((done / modules.length) * 100) : 0;
  const totalMinutes = modules.reduce((s, m) => s + (m.estimated_minutes || 0), 0);

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
    <div className="space-y-6 py-6">
      {/* Sarlavha */}
      <div className="rounded-2xl border border-border p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold">{track.title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {LEVEL_LABELS[track.start_level] || track.start_level} →{" "}
              {LEVEL_LABELS[track.target_level] || track.target_level} ·{" "}
              {modules.length} modul · ~{Math.round(totalMinutes / 60)} soat ·
              haftasiga {track.weekly_hours} soat
            </p>
          </div>

          <button
            onClick={() => { setReplanning(true); router.push("/agent/reja?yangi=1"); }}
            className="flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm hover:bg-muted"
          >
            {replanning ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}
            Yangi reja
          </button>
        </div>

        <div className="mt-5">
          <div className="mb-2 flex justify-between text-xs text-muted-foreground">
            <span>{done} / {modules.length} tugallandi</span>
            <span>{percent}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Modullar */}
      <div className="space-y-2">
        {modules.map((m) => {
          const isLocked = m.status === "locked";
          const isDone = m.status === "done";
          const isSkipped = m.status === "skipped";
          const isActive = m.status === "active";

          return (
            <div
              key={m.id}
              className={cn(
                "flex items-start gap-4 rounded-2xl border p-4 transition-colors",
                isActive ? "border-primary bg-primary/5" : "border-border",
                isLocked && "opacity-55",
              )}
            >
              <div className={cn(
                "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-medium",
                isDone ? "bg-primary text-primary-foreground"
                  : isActive ? "bg-primary/15 text-primary"
                  : "bg-muted text-muted-foreground",
              )}>
                {isDone ? <Check className="h-4 w-4" />
                  : isSkipped ? <SkipForward className="h-4 w-4" />
                  : isLocked ? <Lock className="h-3.5 w-3.5" />
                  : m.order_index}
              </div>

              <div className="min-w-0 flex-1">
                <div className="font-medium">{m.title}</div>
                {m.summary && (
                  <p className="mt-0.5 text-sm text-muted-foreground">{m.summary}</p>
                )}
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {m.estimated_minutes} daq
                  </span>
                  <span className="rounded-full bg-muted px-2 py-0.5">
                    {LEVEL_LABELS[m.level] || m.level}
                  </span>
                  <code className="text-[11px] opacity-60">{m.topic_key}</code>
                </div>
              </div>

              {isActive && (
                <div className="flex shrink-0 flex-col gap-2">
                  <Link
                    href={`/agent?modul=${m.id}`}
                    className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                  >
                    <Play className="h-3.5 w-3.5" />
                    Boshlash
                  </Link>
                  <button
                    onClick={() => setStatus(m.id, "done")}
                    disabled={busyId === m.id}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-border px-4 py-1.5 text-xs hover:bg-muted disabled:opacity-40"
                  >
                    {busyId === m.id
                      ? <Loader2 className="h-3 w-3 animate-spin" />
                      : <ChevronRight className="h-3 w-3" />}
                    Bilaman, o'tkazish
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
