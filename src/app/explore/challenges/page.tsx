"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { cn, getDifficultyConfig, getCategoryLabel } from "@/lib/utils";
import type { Challenge } from "@/types";
import { motion } from "framer-motion";
import { Search, Swords, Users, Coins, Lock } from "lucide-react";

const categories = [
  { value: "all", label: "Barchasi" }, { value: "math", label: "Matematika" },
  { value: "strings", label: "Satrlar" }, { value: "arrays", label: "Massivlar" },
  { value: "algorithms", label: "Algoritmlar" },
];

export default function ExploreChallenges() {
  const supabase = createClient();
  const router = useRouter();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
      const { data } = await supabase.from("challenges").select("*").eq("is_published", true).order("difficulty");
      if (data) setChallenges(data as Challenge[]);
      setLoading(false);
    })();
  }, []);

  function handleClick(slug: string) {
    router.push(isLoggedIn ? `/challenges/${slug}` : `/login?redirect=/challenges/${slug}`);
  }

  const filtered = challenges.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) && (category === "all" || c.category === category)
  );

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display font-bold text-4xl mb-2">Topshiriqlar</h1>
        <p className="text-muted-foreground text-lg">Dasturlash ko'nikmalaringizni sinab ko'ring</p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Topshiriq qidirish..." className="input-field pl-11" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map(c => (
            <button key={c.value} onClick={() => setCategory(c.value)}
              className={cn("px-3 py-2 rounded-xl text-sm font-medium transition-all",
                category === c.value ? "bg-neon-purple/10 text-neon-purple border border-neon-purple/20" : "bg-surface text-muted-foreground")}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? <div className="grid md:grid-cols-2 gap-4">{[1,2,3,4].map(i=><div key={i} className="glass-card h-28 animate-pulse" />)}</div> : (
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((ch, i) => {
            const diff = getDifficultyConfig(ch.difficulty);
            return (
              <motion.div key={ch.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <button onClick={() => handleClick(ch.slug)} className="glass-card-hover p-5 w-full text-left flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-neon-purple/10 flex items-center justify-center flex-shrink-0">
                    <Swords className="w-5 h-5 text-neon-purple" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm group-hover:text-neon-purple transition-colors">{ch.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{ch.description}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className={diff.class}>{diff.label}</span>
                      <span className="text-[10px] text-muted-foreground">{getCategoryLabel(ch.category)}</span>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-0.5"><Users className="w-3 h-3" />{ch.solved_count}</span>
                      <span className="text-[10px] text-neon-yellow flex items-center gap-0.5"><Coins className="w-3 h-3" />+{ch.coin_reward}</span>
                    </div>
                  </div>
                </button>
              </motion.div>
            );
          })}
        </div>
      )}

      {!isLoggedIn && (
        <motion.div className="glass-card p-8 text-center" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <Lock className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground mb-4">Topshiriqlarni yechish uchun ro'yxatdan o'ting</p>
          <Link href="/register" className="btn-primary text-sm py-2.5 px-6">Bepul boshlash</Link>
        </motion.div>
      )}
    </div>
  );
}
