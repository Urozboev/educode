"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatNumber, cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { BarChart3, Users, Target, TrendingUp, Brain, Activity } from "lucide-react";

export default function TeacherAnalyticsPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ students: 0, submissions: 0, accepted: 0, quizzes: 0, avgScore: 0 });
  const [topStudents, setTopStudents] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: ts } = await supabase.from("teacher_students").select("student_id").eq("teacher_id", user.id);
      const ids = ts?.map(t => t.student_id) || [];

      if (ids.length > 0) {
        const [subs, accepted, quizzes] = await Promise.all([
          supabase.from("submissions").select("*", { count: "exact", head: true }).in("user_id", ids),
          supabase.from("submissions").select("*", { count: "exact", head: true }).in("user_id", ids).eq("status", "accepted"),
          supabase.from("quiz_results").select("*", { count: "exact", head: true }).in("user_id", ids),
        ]);

        const { data: quizData } = await supabase.from("quiz_results").select("percentage").in("user_id", ids);
        const avg = quizData && quizData.length > 0 ? Math.round(quizData.reduce((s, q) => s + Number(q.percentage), 0) / quizData.length) : 0;

        setStats({ students: ids.length, submissions: subs.count || 0, accepted: accepted.count || 0, quizzes: quizzes.count || 0, avgScore: avg });

        const { data: top } = await supabase.from("profiles").select("id, full_name, xp, level").in("id", ids).order("xp", { ascending: false }).limit(5);
        if (top) setTopStudents(top);
      }
      setLoading(false);
    })();
  }, []);

  const cards = [
    { label: "Talabalar", value: stats.students, icon: Users, color: "#6C5CE7" },
    { label: "Yuborishlar", value: stats.submissions, icon: Target, color: "#00D2FF" },
    { label: "Qabul qilingan", value: stats.accepted, icon: TrendingUp, color: "#00E676" },
    { label: "O'rtacha test bali", value: `${stats.avgScore}%`, icon: Brain, color: "#FFD600" },
  ];

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display font-bold text-3xl mb-1">Tahlillar</h1>
        <p className="text-muted-foreground">Talabalaringiz faoliyati statistikasi</p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, i) => (
          <motion.div key={c.label} className="glass-card p-5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <c.icon className="w-7 h-7 mb-2" style={{ color: c.color }} />
            <div className="font-display font-bold text-2xl">{loading ? "..." : c.value}</div>
            <div className="text-xs text-muted-foreground">{c.label}</div>
          </motion.div>
        ))}
      </div>

      <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h2 className="font-display font-semibold text-lg mb-4">TOP 5 talaba (XP bo'yicha)</h2>
        <div className="space-y-3">
          {topStudents.map((s, i) => (
            <div key={s.id} className="flex items-center gap-4 p-3 rounded-xl bg-surface/50">
              <span className="font-bold text-lg text-muted-foreground/30 w-8">{i + 1}</span>
              <div className="flex-1"><p className="font-medium text-sm">{s.full_name}</p><p className="text-xs text-muted-foreground">{s.level}</p></div>
              <span className="font-mono text-neon-yellow font-bold">{s.xp} XP</span>
            </div>
          ))}
          {topStudents.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Talaba yo'q</p>}
        </div>

        {stats.submissions > 0 && (
          <div className="mt-6 p-4 rounded-xl bg-surface/50">
            <p className="text-sm text-muted-foreground mb-2">Qabul qilinish darajasi</p>
            <div className="w-full h-4 bg-border rounded-full overflow-hidden">
              <div className="h-full progress-gradient rounded-full" style={{ width: `${Math.round((stats.accepted / stats.submissions) * 100)}%` }} />
            </div>
            <p className="text-right text-xs text-muted-foreground mt-1">{Math.round((stats.accepted / stats.submissions) * 100)}%</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
