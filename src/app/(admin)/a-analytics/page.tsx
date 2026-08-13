"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatNumber, cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { BarChart3, Users, TrendingUp, Target, BookOpen, Brain, Activity, Calendar } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function AdminAnalyticsPage() {
  const { t } = useI18n();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0, newUsersThisWeek: 0, totalSubmissions: 0, acceptRate: 0,
    totalEnrollments: 0, completedCourses: 0, totalQuizzes: 0, avgQuizScore: 0,
  });
  const [courseStats, setCourseStats] = useState<any[]>([]);
  const [challengeStats, setChallengeStats] = useState<any[]>([]);
  const [dailyActivity, setDailyActivity] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      // Asosiy statistikalar
      const [users, subs, accepted, enrollments, completed, quizzes] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("submissions").select("*", { count: "exact", head: true }),
        supabase.from("submissions").select("*", { count: "exact", head: true }).eq("status", "accepted"),
        supabase.from("enrollments").select("*", { count: "exact", head: true }),
        supabase.from("enrollments").select("*", { count: "exact", head: true }).eq("is_completed", true),
        supabase.from("quiz_results").select("*", { count: "exact", head: true }),
      ]);

      // Shu haftada ro'yxatdan o'tganlar
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const { count: newUsers } = await supabase.from("profiles").select("*", { count: "exact", head: true }).gte("created_at", weekAgo);

      // O'rtacha test bali
      const { data: quizData } = await supabase.from("quiz_results").select("percentage").limit(1000);
      const avgScore = quizData && quizData.length > 0 ? Math.round(quizData.reduce((s, q) => s + Number(q.percentage), 0) / quizData.length) : 0;

      const totalSubs = subs.count || 0;
      const totalAccepted = accepted.count || 0;

      setStats({
        totalUsers: users.count || 0, newUsersThisWeek: newUsers || 0,
        totalSubmissions: totalSubs, acceptRate: totalSubs > 0 ? Math.round((totalAccepted / totalSubs) * 100) : 0,
        totalEnrollments: enrollments.count || 0, completedCourses: completed.count || 0,
        totalQuizzes: quizzes.count || 0, avgQuizScore: avgScore,
      });

      // Kurs statistikasi
      const { data: cs } = await supabase.from("courses").select("id, title, total_enrolled, total_topics").eq("is_published", true).order("total_enrolled", { ascending: false });
      if (cs) setCourseStats(cs);

      // Challenge statistikasi
      const { data: chs } = await supabase.from("challenges").select("id, title, difficulty, solved_count, attempt_count").eq("is_published", true).order("solved_count", { ascending: false }).limit(10);
      if (chs) setChallengeStats(chs);

      // Kunlik faollik (oxirgi 7 kun)
      const days = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
        const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate()).toISOString();
        const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1).toISOString();
        const { count } = await supabase.from("submissions").select("*", { count: "exact", head: true }).gte("created_at", dayStart).lt("created_at", dayEnd);
        days.push({ day: date.toLocaleDateString("uz", { weekday: "short" }), count: count || 0 });
      }
      setDailyActivity(days);

      setLoading(false);
    })();
  }, []);

  const mainCards = [
    { label: "Foydalanuvchilar", value: stats.totalUsers, sub: `+${stats.newUsersThisWeek} shu hafta`, icon: Users, color: "#6C5CE7" },
    { label: t.admin.ana.acceptRate, value: `${stats.acceptRate}%`, sub: `${stats.totalSubmissions} yuborish`, icon: Target, color: "#00E676" },
    { label: t.admin.ana.courseCompletion, value: stats.completedCourses, sub: `${stats.totalEnrollments} ro'yxat`, icon: BookOpen, color: "#00D2FF" },
    { label: t.admin.ana.avgQuiz, value: `${stats.avgQuizScore}%`, sub: `${stats.totalQuizzes} ta test`, icon: Brain, color: "#FFD600" },
  ];

  const maxActivity = Math.max(...dailyActivity.map(d => d.count), 1);

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display font-bold text-3xl mb-1">{t.admin.ana.title}</h1>
        <p className="text-muted-foreground">{t.admin.ana.subtitle}</p>
      </motion.div>

      {/* Main Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {mainCards.map((c, i) => (
          <motion.div key={c.label} className="glass-card p-5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <c.icon className="w-7 h-7 mb-2" style={{ color: c.color }} />
            <div className="font-display font-bold text-2xl">{loading ? "..." : c.value}</div>
            <div className="text-xs text-muted-foreground">{c.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Daily Activity Bar Chart */}
      <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2"><Activity className="w-5 h-5 text-neon-purple" /> {t.admin.ana.dailySubmissions}</h2>
        <div className="flex items-end gap-3 h-40">
          {dailyActivity.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-xs font-mono text-muted-foreground">{d.count}</span>
              <motion.div className="w-full rounded-t-lg progress-gradient" style={{ minHeight: 4 }}
                initial={{ height: 4 }} animate={{ height: `${Math.max((d.count / maxActivity) * 120, 4)}px` }}
                transition={{ delay: 0.4 + i * 0.05, duration: 0.5 }} />
              <span className="text-[10px] text-muted-foreground">{d.day}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Course Stats */}
        <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h2 className="font-display font-semibold text-lg mb-4">{t.admin.ana.courseStats}</h2>
          <div className="space-y-3">
            {courseStats.map((c, i) => {
              const maxEnrolled = Math.max(...courseStats.map(x => x.total_enrolled), 1);
              return (
                <div key={c.id} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="truncate flex-1 mr-2">{c.title}</span>
                    <span className="text-xs text-muted-foreground">{c.total_enrolled} talaba · {c.total_topics} mavzu</span>
                  </div>
                  <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
                    <motion.div className="h-full progress-gradient rounded-full"
                      initial={{ width: 0 }} animate={{ width: `${(c.total_enrolled / maxEnrolled) * 100}%` }}
                      transition={{ delay: 0.5 + i * 0.05, duration: 0.5 }} />
                  </div>
                </div>
              );
            })}
            {courseStats.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">{t.admin.common.noData}</p>}
          </div>
        </motion.div>

        {/* Challenge Stats */}
        <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
          <h2 className="font-display font-semibold text-lg mb-4">{t.admin.ana.challengeStats}</h2>
          <div className="space-y-2">
            {challengeStats.map(ch => (
              <div key={ch.id} className="flex items-center gap-3 py-2 border-b border-border/30 last:border-0">
                <div className={cn("w-2 h-2 rounded-full", ch.difficulty === "easy" ? "bg-neon-green" : ch.difficulty === "medium" ? "bg-neon-yellow" : "bg-neon-red")} />
                <span className="flex-1 text-sm truncate">{ch.title}</span>
                <span className="text-xs text-neon-green font-mono">{ch.solved_count} yechdi</span>
                <span className="text-xs text-muted-foreground font-mono">{ch.attempt_count} urinish</span>
              </div>
            ))}
            {challengeStats.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">{t.admin.common.noData}</p>}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
