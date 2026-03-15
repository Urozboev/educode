"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn, getDifficultyConfig } from "@/lib/utils";
import type { Course, Profile } from "@/types";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Coins, Lock, Unlock, ShoppingBag, CheckCircle2, Loader2 } from "lucide-react";

export default function StorePage() {
  const supabase = createClient();
  const [paidCourses, setPaidCourses] = useState<Course[]>([]);
  const [enrolledIds, setEnrolledIds] = useState<Set<string>>(new Set());
  const [coins, setCoins] = useState(0);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase.from("profiles").select("coins").eq("id", user.id).single();
      if (profile) setCoins(profile.coins);

      const { data: courses } = await supabase.from("courses").select("*")
        .eq("is_published", true).eq("is_free", false).order("price_coins");
      if (courses) setPaidCourses(courses as Course[]);

      const { data: enrollments } = await supabase.from("enrollments").select("course_id").eq("user_id", user.id);
      if (enrollments) setEnrolledIds(new Set(enrollments.map(e => e.course_id)));

      setLoading(false);
    })();
  }, []);

  async function handleBuy(course: Course) {
    if (coins < course.price_coins) { toast.error("Yetarli coin yo'q!"); return; }
    if (enrolledIds.has(course.id)) { toast.info("Bu kurs allaqachon ochilgan"); return; }

    setBuying(course.id);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const newBalance = coins - course.price_coins;
    await supabase.from("profiles").update({ coins: newBalance }).eq("id", user.id);
    await supabase.from("coin_transactions").insert({
      user_id: user.id, amount: -course.price_coins, type: "course_purchase",
      reference_id: course.id, description: `"${course.title}" kursi sotib olindi`,
      balance_after: newBalance,
    });
    await supabase.from("enrollments").insert({
      user_id: user.id, course_id: course.id, total_topics: course.total_topics,
    });

    setCoins(newBalance);
    setEnrolledIds(new Set([...enrolledIds, course.id]));
    setBuying(null);
    toast.success(`"${course.title}" kursi ochildi! 🎉`);
  }

  if (loading) return <div className="space-y-4 animate-pulse"><div className="h-8 w-48 bg-surface rounded-lg" /><div className="grid md:grid-cols-2 gap-4">{[1,2,3].map(i=><div key={i} className="glass-card h-40" />)}</div></div>;

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display font-bold text-3xl mb-1">Coin Do'kon</h1>
        <p className="text-muted-foreground">Coinlaringiz bilan pullik kurslarni oching</p>
      </motion.div>

      {/* Balance */}
      <motion.div className="glass-card p-6 flex items-center justify-between" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-neon-yellow/10 border border-neon-yellow/20 flex items-center justify-center">
            <Coins className="w-7 h-7 text-neon-yellow" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Sizning balansingiz</p>
            <p className="font-display font-bold text-3xl text-neon-yellow">{coins} <span className="text-lg">coin</span></p>
          </div>
        </div>
        <div className="text-right text-xs text-muted-foreground">
          <p>Coin qanday yig'iladi?</p>
          <p className="mt-1">Mavzu tugatish: +10 · Topshiriq: +5-20 · Kurs: +50</p>
        </div>
      </motion.div>

      {/* Courses */}
      {paidCourses.length === 0 ? (
        <div className="text-center py-20">
          <ShoppingBag className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
          <p className="text-muted-foreground">Hozircha pullik kurs yo'q</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {paidCourses.map((course, i) => {
            const owned = enrolledIds.has(course.id);
            const canAfford = coins >= course.price_coins;
            const diff = getDifficultyConfig(course.difficulty || "beginner");

            return (
              <motion.div key={course.id} className="glass-card p-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}>
                <div className="flex items-center justify-between mb-3">
                  <span className={diff.class}>{diff.label}</span>
                  {owned && <span className="flex items-center gap-1 text-xs text-neon-green font-medium"><CheckCircle2 className="w-4 h-4" /> Ochilgan</span>}
                </div>
                <h3 className="font-display font-bold text-lg mb-2">{course.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{course.description}</p>
                <div className="flex items-center justify-between">
                  <div className="coin-badge"><Coins className="w-4 h-4" />{course.price_coins} coin</div>
                  {owned ? (
                    <span className="text-xs text-neon-green">Allaqachon ochilgan</span>
                  ) : (
                    <button onClick={() => handleBuy(course)} disabled={!canAfford || buying === course.id}
                      className={cn("flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all",
                        canAfford ? "btn-primary" : "bg-surface text-muted-foreground cursor-not-allowed")}
                    >
                      {buying === course.id ? <Loader2 className="w-4 h-4 animate-spin" /> : canAfford ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                      {buying === course.id ? "Ochilmoqda..." : canAfford ? "Sotib olish" : "Yetarli emas"}
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
