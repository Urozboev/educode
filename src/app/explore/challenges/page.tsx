"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { cn, getDifficultyConfig, getCategoryLabel } from "@/lib/utils";
import type { Challenge } from "@/types";
import { motion } from "framer-motion";
import { Search, Swords, Users, Coins, Lock, ArrowRight } from "lucide-react";

const categories = [
  { value: "all", label: "Barchasi" },
  { value: "math", label: "Matematika" },
  { value: "strings", label: "Satrlar" },
  { value: "arrays", label: "Massivlar" },
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
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
      const { data } = await supabase
        .from("challenges")
        .select("*")
        .eq("is_published", true)
        .order("difficulty");
      if (data) setChallenges(data as Challenge[]);
      setLoading(false);
    })();
  }, []);

  function handleClick(slug: string) {
    router.push(isLoggedIn ? `/challenges/${slug}` : `/login?redirect=/challenges/${slug}`);
  }

  const filtered = challenges.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) &&
      (category === "all" || c.category === category)
  );

  return (
    <div className="space-y-8 md:space-y-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl"
      >
        <h1 className="font-display font-extrabold text-4xl md:text-5xl tracking-tight mb-3">
          Topshiriqlar
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Algoritmik masalalar, matematik jumboqlar va amaliy muammolarni yechib, coin va XP yig'ing.
        </p>
      </motion.div>

      {/* Search + filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Topshiriq nomi bo'yicha qidirish..."
            className="w-full bg-surface/60 border border-border rounded-2xl pl-12 pr-4 py-3.5 text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-neon-purple/40 focus:border-neon-purple/40 transition-all"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
          {categories.map((c) => (
            <button
              key={c.value}
              onClick={() => setCategory(c.value)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap flex-shrink-0 border",
                category === c.value
                  ? "bg-foreground text-background border-foreground"
                  : "bg-surface/40 text-muted-foreground border-border/50 hover:border-border hover:text-foreground"
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Challenges grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-36 rounded-2xl border border-border/40 bg-card/30 animate-pulse"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center">
          <Swords className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-base text-muted-foreground">Natija topilmadi</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {filtered.map((ch, i) => {
            const diff = getDifficultyConfig(ch.difficulty);
            return (
              <motion.div
                key={ch.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
              >
                <button
                  onClick={() => handleClick(ch.slug)}
                  className="group w-full text-left p-6 rounded-2xl border border-border/50 bg-card/40 hover:bg-card hover:border-border hover:shadow-xl hover:shadow-black/[0.04] transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-neon-purple/10 border border-neon-purple/20 flex items-center justify-center flex-shrink-0">
                      <Swords className="w-5 h-5 text-neon-purple" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-bold text-lg leading-snug group-hover:text-neon-purple transition-colors line-clamp-1">
                        {ch.title}
                      </h3>
                      <p className="text-[15px] text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
                        {ch.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-4">
                        <span className={diff.class}>{diff.label}</span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-surface text-muted-foreground border border-border/60">
                          {getCategoryLabel(ch.category)}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <Users className="w-3.5 h-3.5" />
                          {ch.solved_count}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-neon-yellow">
                          <Coins className="w-3.5 h-3.5" />+{ch.coin_reward}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground/60 group-hover:text-neon-purple group-hover:translate-x-1 transition-all mt-1" />
                  </div>
                </button>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* CTA for guests */}
      {!isLoggedIn && !loading && (
        <div className="p-8 md:p-10 rounded-3xl border border-border/50 bg-surface/30 text-center">
          <div className="w-14 h-14 rounded-2xl bg-neon-purple/10 border border-neon-purple/20 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6 text-neon-purple" />
          </div>
          <h3 className="font-display font-bold text-xl mb-2">
            Topshiriqlarni yechish uchun ro'yxatdan o'ting
          </h3>
          <p className="text-muted-foreground text-base mb-5 max-w-md mx-auto">
            Masalalarni bajaring va coin yig'ing. AI yordamchi kodingizni tahlil qiladi.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-foreground text-background font-display font-semibold text-sm hover:opacity-90 transition-all"
          >
            Bepul boshlash <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
