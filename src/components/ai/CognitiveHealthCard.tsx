"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Brain, TrendingUp, Clock, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import type { Dictionary } from "@/lib/i18n/dictionaries/uz";

interface AIStats {
  daily: { used: number; limit: number; remaining: number; cooldownUntil?: string | null };
  submissionsToday: number;
  autonomousToday: number;
  dependencyScore: number;
  trend: { date: string; total_queries: number }[];
}

function getZone(score: number, t: Dictionary): { label: string; emoji: string; cls: string; tip: string } {
  if (score <= 30) return {
    label: "Sog'lom",
    emoji: "🟢",
    cls: "bg-neon-green/10 border-neon-green/30 text-neon-green",
    tip: t.misc.balanceHealthy,
  };
  if (score <= 60) return {
    label: "O'rtacha",
    emoji: "🟡",
    cls: "bg-neon-yellow/10 border-neon-yellow/30 text-neon-yellow",
    tip: t.misc.balanceModerate,
  };
  if (score <= 80) return {
    label: "Yuqori",
    emoji: "🟠",
    cls: "bg-orange-500/10 border-orange-500/30 text-orange-400",
    tip: t.misc.balanceHigh,
  };
  return {
    label: "Juda yuqori",
    emoji: "🔴",
    cls: "bg-neon-red/10 border-neon-red/30 text-neon-red",
    tip: t.misc.balanceRisky,
  };
}

export default function CognitiveHealthCard({ className }: { className?: string }) {
  const { t } = useI18n();
  const [stats, setStats] = useState<AIStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/ai/stats")
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setStats(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className={cn("glass-card p-5 h-48 animate-pulse", className)} />;
  if (!stats) return null;

  const zone = getZone(stats.dependencyScore, t);
  const used = stats.daily.used;
  const limit = stats.daily.limit;
  const usedPct = Math.min(100, (used / Math.max(limit, 1)) * 100);

  return (
    <motion.div
      className={cn("glass-card p-5", className)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-neon-purple/10 flex items-center justify-center">
            <Brain className="w-4.5 h-4.5 text-neon-purple" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Cognitive Health</h3>
            <p className="text-[10px] text-muted-foreground">{t.misc.balanceTitle}</p>
          </div>
        </div>
        <span
          className={cn("px-2.5 py-1 rounded-lg text-[11px] font-semibold border", zone.cls)}
          title={zone.tip}
        >
          {zone.emoji} {zone.label}
        </span>
      </div>

      {/* Dependency score bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] text-muted-foreground">AI bog'liqlik indeksi</span>
          <span className="text-xs font-mono font-semibold">{stats.dependencyScore}%</span>
        </div>
        <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
          <motion.div
            className={cn(
              "h-full rounded-full",
              stats.dependencyScore <= 30 ? "bg-neon-green" :
              stats.dependencyScore <= 60 ? "bg-neon-yellow" :
              stats.dependencyScore <= 80 ? "bg-orange-500" : "bg-neon-red",
            )}
            initial={{ width: 0 }}
            animate={{ width: `${stats.dependencyScore}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-surface/40 rounded-lg p-2.5">
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-1">
            <Activity className="w-3 h-3" /> {t.misc.todayAiQuestions}
          </div>
          <div className="text-sm font-semibold font-mono">
            {used}/{limit}
          </div>
          <div className="w-full h-1 bg-border rounded-full mt-1 overflow-hidden">
            <div className="h-full bg-neon-blue rounded-full" style={{ width: `${usedPct}%` }} />
          </div>
        </div>
        <div className="bg-surface/40 rounded-lg p-2.5">
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-1">
            <TrendingUp className="w-3 h-3" /> Mustaqil yechilgan
          </div>
          <div className="text-sm font-semibold font-mono text-neon-green">
            {stats.autonomousToday}
          </div>
          <div className="text-[9px] text-muted-foreground mt-0.5">
            jami {stats.submissionsToday} ta topshiriq
          </div>
        </div>
      </div>

      {/* Cooldown */}
      {stats.daily.cooldownUntil && (
        <div className="mb-3 px-2.5 py-2 rounded-lg bg-neon-red/5 border border-neon-red/20 flex items-center gap-2 text-[11px] text-neon-red">
          <Clock className="w-3 h-3 flex-shrink-0" />
          <span>
            Cooldown: {new Date(stats.daily.cooldownUntil).toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" })} gacha
          </span>
        </div>
      )}

      {/* Tip */}
      <div className="text-[11px] text-muted-foreground leading-relaxed border-t border-border/50 pt-2">
        💡 {zone.tip}
      </div>
    </motion.div>
  );
}
