"use client";

import { useState, useEffect } from "react";
import Link from "@/components/i18n/Link";
import { createClient } from "@/lib/supabase/client";
import { useI18n } from "@/lib/i18n";
import { withTranslations } from "@/lib/i18n/content";
import { cn, getDifficultyConfig, getCategoryLabel } from "@/lib/utils";
import type { Challenge } from "@/types";
import { motion } from "framer-motion";
import {
  Search, Swords, Users, Coins, CheckCircle2, Zap, Trophy,
  Flame, ChevronRight, Target,
} from "lucide-react";

const categories = [
  { value: "all", label: "Barchasi", icon: "✨" },
  { value: "basics", label: "Asoslar", icon: "🌱" },
  { value: "math", label: "Matematika", icon: "🔢" },
  { value: "strings", label: "Satrlar", icon: "🔤" },
  { value: "arrays", label: "Massivlar", icon: "📊" },
  { value: "algorithms", label: "Algoritmlar", icon: "🧠" },
];
const difficulties = [
  { value: "all", label: "Barchasi" },
  { value: "easy", label: "Oson" },
  { value: "medium", label: "O'rta" },
  { value: "hard", label: "Qiyin" },
];

const diffAccent: Record<string, string> = {
  easy: "#00E676",
  medium: "#FFD600",
  hard: "#FF5252",
};

export default function ChallengesPage() {
  const supabase = createClient();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [solvedIds, setSolvedIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [loading, setLoading] = useState(true);
  const { locale } = useI18n();

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data } = await supabase.from("challenges").select("*").eq("is_published", true).order("difficulty");
      if (data) setChallenges(await withTranslations(supabase, "challenges", data as Challenge[], locale));
      if (user) {
        const { data: subs } = await supabase.from("submissions").select("task_id")
          .eq("user_id", user.id).eq("task_type", "challenge").eq("status", "accepted");
        if (subs) setSolvedIds(new Set(subs.map(s => s.task_id)));
      }
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  const filtered = challenges.filter(c => {
    return (c.title.toLowerCase().includes(search.toLowerCase())) &&
      (category === "all" || c.category === category) &&
      (difficulty === "all" || c.difficulty === difficulty);
  });

  // Statistika: qiyinchilik bo'yicha yechilganlar
  const byDiff = (d: string) => {
    const total = challenges.filter(c => c.difficulty === d).length;
    const solved = challenges.filter(c => c.difficulty === d && solvedIds.has(c.id)).length;
    return { total, solved };
  };
  const easy = byDiff("easy"), medium = byDiff("medium"), hard = byDiff("hard");
  const totalSolved = solvedIds.size;
  const totalCount = challenges.length;
  const solvedPct = totalCount ? Math.round((totalSolved / totalCount) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Header + statistika */}
      <motion.div
        className="relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-neon-blue/[0.1] via-card/60 to-neon-purple/[0.08] p-7 md:p-8"
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      >
        <div className="absolute -bottom-20 -left-16 w-56 h-56 rounded-full bg-neon-blue/15 blur-[80px] pointer-events-none" />
        <div className="relative flex flex-col lg:flex-row lg:items-center gap-6">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-blue/10 border border-neon-blue/20 text-neon-blue text-xs font-semibold mb-3">
              <Swords className="w-3.5 h-3.5" /> {totalCount} ta topshiriq
            </div>
            <h1 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight mb-2">
              Kod <span className="gradient-text">maydonchasi</span>
            </h1>
            <p className="text-muted-foreground max-w-md">
              Algoritm va dasturlash topshiriqlarini yeching, coin yig'ing va reytingda ko'tariling.
            </p>
          </div>

          {/* Progress ring + diff stats */}
          <div className="flex items-center gap-5">
            <div className="relative w-24 h-24 flex-shrink-0">
              <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
                <circle cx="48" cy="48" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-border/60" />
                <circle
                  cx="48" cy="48" r="40" fill="none" stroke="url(#chGrad)" strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={`${(solvedPct / 100) * 251.3} 251.3`}
                />
                <defs>
                  <linearGradient id="chGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#6C5CE7" />
                    <stop offset="100%" stopColor="#00D2FF" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display font-extrabold text-xl leading-none">{totalSolved}</span>
                <span className="text-[9px] text-muted-foreground">yechilgan</span>
              </div>
            </div>
            <div className="space-y-1.5 text-xs">
              {[
                { label: "Oson", ...easy, color: "#00E676" },
                { label: "O'rta", ...medium, color: "#FFD600" },
                { label: "Qiyin", ...hard, color: "#FF5252" },
              ].map(d => (
                <div key={d.label} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-muted-foreground w-10">{d.label}</span>
                  <span className="font-mono font-semibold">{d.solved}/{d.total}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Search & Filter */}
      <div className="space-y-3">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Topshiriq qidirish..." className="input-field pl-11" />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {categories.map(c => (
            <button key={c.value} onClick={() => setCategory(c.value)}
              className={cn("inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all border",
                category === c.value
                  ? "bg-neon-purple/10 text-neon-purple border-neon-purple/30"
                  : "bg-surface text-muted-foreground hover:bg-surface-hover border-transparent")}>
              <span>{c.icon}</span> {c.label}
            </button>
          ))}
          <div className="w-px h-6 bg-border mx-1" />
          {difficulties.map(d => (
            <button key={d.value} onClick={() => setDifficulty(d.value)}
              className={cn("px-3.5 py-2 rounded-xl text-sm font-medium transition-all border",
                difficulty === d.value
                  ? "bg-neon-blue/10 text-neon-blue border-neon-blue/30"
                  : "bg-surface text-muted-foreground hover:bg-surface-hover border-transparent")}>
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Challenge list */}
      {loading ? (
        <div className="grid md:grid-cols-2 gap-4">{[1, 2, 3, 4].map(i => <div key={i} className="glass-card p-5 h-32 animate-pulse" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <Target className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
          <h3 className="font-display font-semibold text-xl mb-2">Topshiriq topilmadi</h3>
          <p className="text-muted-foreground">Filtrlarni o'zgartirib ko'ring</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((ch, i) => {
            const solved = solvedIds.has(ch.id);
            const diff = getDifficultyConfig(ch.difficulty);
            const accent = diffAccent[ch.difficulty] || "#6C5CE7";
            return (
              <motion.div key={ch.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.03, 0.3) }}>
                <Link
                  href={`/challenges/${ch.slug}`}
                  className={cn(
                    "group relative rounded-2xl border bg-card/40 p-5 flex items-start gap-4 block overflow-hidden",
                    "hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/10 transition-all duration-300",
                    solved ? "border-neon-green/25" : "border-border/50 hover:border-border",
                  )}
                >
                  {/* Chap accent chiziq (qiyinchilik rangi) */}
                  <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: solved ? "#00E676" : accent, opacity: solved ? 0.9 : 0.5 }} />

                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 border transition-transform group-hover:scale-110"
                    style={{
                      backgroundColor: solved ? "#00E67615" : `${accent}12`,
                      borderColor: solved ? "#00E67630" : `${accent}25`,
                    }}
                  >
                    {solved
                      ? <CheckCircle2 className="w-5 h-5 text-neon-green" />
                      : <Swords className="w-5 h-5" style={{ color: accent }} />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-semibold text-[15px] group-hover:text-neon-purple transition-colors truncate">{ch.title}</h3>
                      {solved && <span className="text-[9px] font-bold text-neon-green bg-neon-green/10 border border-neon-green/20 rounded-full px-2 py-0.5 flex-shrink-0">YECHILGAN</span>}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{ch.description}</p>
                    <div className="flex items-center gap-3 mt-2.5">
                      <span className={diff.class}>{diff.label}</span>
                      <span className="text-[10px] text-muted-foreground">{getCategoryLabel(ch.category)}</span>
                      <span className="text-[10px] text-neon-yellow flex items-center gap-0.5 font-semibold"><Coins className="w-3 h-3" />+{ch.coin_reward}</span>
                      {ch.solved_count > 0 && (
                        <span className="text-[10px] text-muted-foreground flex items-center gap-0.5"><Users className="w-3 h-3" />{ch.solved_count}</span>
                      )}
                    </div>
                  </div>

                  <ChevronRight className="w-4.5 h-4.5 text-muted-foreground/40 group-hover:text-neon-purple group-hover:translate-x-1 transition-all flex-shrink-0 self-center" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
