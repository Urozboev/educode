"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { cn, getDifficultyConfig, getCategoryLabel } from "@/lib/utils";
import type { Challenge } from "@/types";
import { motion } from "framer-motion";
import { Search, Swords, Users, Coins, CheckCircle2 } from "lucide-react";

const categories = [
  { value: "all", label: "Barchasi" }, { value: "math", label: "Matematika" },
  { value: "strings", label: "Satrlar" }, { value: "arrays", label: "Massivlar" },
  { value: "algorithms", label: "Algoritmlar" },
];
const difficulties = [
  { value: "all", label: "Barchasi" }, { value: "easy", label: "Oson" },
  { value: "medium", label: "O'rta" }, { value: "hard", label: "Qiyin" },
];

export default function ChallengesPage() {
  const supabase = createClient();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [solvedIds, setSolvedIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data } = await supabase.from("challenges").select("*").eq("is_published", true).order("difficulty");
      if (data) setChallenges(data as Challenge[]);
      if (user) {
        const { data: subs } = await supabase.from("submissions").select("task_id")
          .eq("user_id", user.id).eq("task_type", "challenge").eq("status", "accepted");
        if (subs) setSolvedIds(new Set(subs.map(s => s.task_id)));
      }
      setLoading(false);
    })();
  }, []);

  const filtered = challenges.filter(c => {
    return (c.title.toLowerCase().includes(search.toLowerCase())) &&
      (category === "all" || c.category === category) &&
      (difficulty === "all" || c.difficulty === difficulty);
  });

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display font-bold text-3xl mb-1">Topshiriqlar</h1>
        <p className="text-muted-foreground">Dasturlash ko'nikmalaringizni sinab ko'ring · {solvedIds.size} ta yechilgan</p>
      </motion.div>
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Topshiriq qidirish..." className="input-field pl-11" />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map(c => (<button key={c.value} onClick={() => setCategory(c.value)} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-all", category === c.value ? "bg-neon-purple/10 text-neon-purple border border-neon-purple/20" : "bg-surface text-muted-foreground hover:bg-surface-hover")}>{c.label}</button>))}
          <div className="w-px bg-border mx-1" />
          {difficulties.map(d => (<button key={d.value} onClick={() => setDifficulty(d.value)} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-all", difficulty === d.value ? "bg-neon-blue/10 text-neon-blue border border-neon-blue/20" : "bg-surface text-muted-foreground hover:bg-surface-hover")}>{d.label}</button>))}
        </div>
      </div>
      {loading ? <div className="grid md:grid-cols-2 gap-4">{[1,2,3,4].map(i => <div key={i} className="glass-card p-5 h-32 animate-pulse" />)}</div> : (
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((ch, i) => {
            const solved = solvedIds.has(ch.id); const diff = getDifficultyConfig(ch.difficulty);
            return (
              <motion.div key={ch.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <Link href={`/challenges/${ch.slug}`} className={cn("glass-card-hover p-5 flex items-start gap-4 group block", solved && "border-l-2 border-l-neon-green")}>
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", solved ? "bg-neon-green/10" : "bg-neon-purple/10")}>
                    {solved ? <CheckCircle2 className="w-5 h-5 text-neon-green" /> : <Swords className="w-5 h-5 text-neon-purple" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm group-hover:text-neon-purple transition-colors">{ch.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{ch.description}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className={diff.class}>{diff.label}</span>
                      <span className="text-[10px] text-muted-foreground">{getCategoryLabel(ch.category)}</span>
                      <span className="text-[10px] text-neon-yellow flex items-center gap-0.5"><Coins className="w-3 h-3" />+{ch.coin_reward}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
