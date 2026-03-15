"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { getOrCreateProfile } from "@/lib/profile";
import { formatNumber, getInitials, getLevelLabel, getLevelColor, cn, formatRelativeDate } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Users, Target, TrendingUp, BookOpen, ChevronRight, BarChart3,
  ClipboardList, Download, Flame, Brain, Activity
} from "lucide-react";

export default function TeacherDashboardPage() {
  const supabase = createClient();
  const [teacherName, setTeacherName] = useState("");
  const [students, setStudents] = useState<any[]>([]);
  const [recentSubs, setRecentSubs] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalStudents: 0, totalSubmissions: 0, accepted: 0, avgQuizScore: 0, activeAssignments: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const profile = await getOrCreateProfile(supabase, user.id);
      if (profile) setTeacherName(profile.full_name);

      // Biriktirilgan talabalar
      const { data: ts } = await supabase.from("teacher_students").select("student_id").eq("teacher_id", user.id);
      const studentIds = ts?.map(t => t.student_id) || [];

      if (studentIds.length > 0) {
        // Talabalar profillari
        const { data: profiles } = await supabase.from("profiles")
          .select("id, full_name, avatar_url, xp, level, streak_days, coins, last_active_date")
          .in("id", studentIds).order("xp", { ascending: false });
        if (profiles) setStudents(profiles);

        // Statistikalar
        const [subs, accepted, quizzes, assignments] = await Promise.all([
          supabase.from("submissions").select("*", { count: "exact", head: true }).in("user_id", studentIds),
          supabase.from("submissions").select("*", { count: "exact", head: true }).in("user_id", studentIds).eq("status", "accepted"),
          supabase.from("quiz_results").select("percentage").in("user_id", studentIds),
          supabase.from("teacher_assignments").select("*", { count: "exact", head: true }).eq("teacher_id", user.id).eq("is_active", true),
        ]);

        const quizData = quizzes.data || [];
        const avgScore = quizData.length > 0 ? Math.round(quizData.reduce((s: number, q: any) => s + Number(q.percentage), 0) / quizData.length) : 0;

        setStats({
          totalStudents: studentIds.length, totalSubmissions: subs.count || 0,
          accepted: accepted.count || 0, avgQuizScore: avgScore,
          activeAssignments: assignments.count || 0,
        });

        // So'nggi yuborishlar
        const { data: recentData } = await supabase.from("submissions")
          .select("id, user_id, status, language, task_type, created_at")
          .in("user_id", studentIds).order("created_at", { ascending: false }).limit(8);
        if (recentData) {
          const nameMap = Object.fromEntries((profiles || []).map((p: any) => [p.id, p.full_name]));
          setRecentSubs(recentData.map(s => ({ ...s, name: nameMap[s.user_id] || "Noma'lum" })));
        }
      }
      setLoading(false);
    })();
  }, []);

  const statCards = [
    { label: "Talabalar", value: stats.totalStudents, icon: Users, color: "#6C5CE7" },
    { label: "Jami yuborishlar", value: stats.totalSubmissions, icon: Target, color: "#00D2FF" },
    { label: "Qabul qilingan", value: stats.accepted, icon: TrendingUp, color: "#00E676" },
    { label: "O'rtacha test bali", value: `${stats.avgQuizScore}%`, icon: Brain, color: "#FFD600" },
  ];

  const quickLinks = [
    { label: "Talabalarim", href: "/t-students", icon: Users, color: "#6C5CE7" },
    { label: "Topshiriq biriktirish", href: "/t-assignments", icon: ClipboardList, color: "#00D2FF" },
    { label: "Tahlillar", href: "/t-analytics", icon: BarChart3, color: "#00E676" },
    { label: "Eksport", href: "/t-export", icon: Download, color: "#FFD600" },
  ];

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display font-bold text-3xl mb-1">Salom, {teacherName.split(" ")[0]}! 👨‍🏫</h1>
        <p className="text-muted-foreground">O'qituvchi paneli · {stats.activeAssignments} ta faol topshiriq</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((c, i) => (
          <motion.div key={c.label} className="glass-card p-5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <c.icon className="w-7 h-7 mb-2" style={{ color: c.color }} />
            <div className="font-display font-bold text-2xl">{loading ? "..." : c.value}</div>
            <div className="text-xs text-muted-foreground">{c.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Quick links */}
      <motion.div className="grid grid-cols-4 gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        {quickLinks.map(ql => (
          <Link key={ql.href} href={ql.href} className="glass-card-hover p-4 flex flex-col items-center gap-2 text-center group">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform" style={{ backgroundColor: `${ql.color}15` }}>
              <ql.icon className="w-5 h-5" style={{ color: ql.color }} />
            </div>
            <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground">{ql.label}</span>
          </Link>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top students */}
        <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-lg">Talabalar (XP bo'yicha)</h2>
            <Link href="/t-students" className="text-sm text-neon-blue hover:underline flex items-center gap-1">Barchasi <ChevronRight className="w-4 h-4" /></Link>
          </div>
          {students.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-3">Hali talaba biriktirilmagan</p>
              <p className="text-xs text-muted-foreground">Admin paneldan talabalarni biriktirishni so'rang</p>
            </div>
          ) : (
            <div className="space-y-2">
              {students.slice(0, 8).map((s, i) => (
                <Link key={s.id} href={`/t-students/${s.id}`} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface/50 transition-all group">
                  <span className="text-xs font-bold text-muted-foreground/30 w-5">{i + 1}</span>
                  <div className="w-8 h-8 rounded-full bg-hero-gradient flex items-center justify-center text-white font-bold text-[10px]">
                    {s.avatar_url ? <img src={s.avatar_url} className="w-full h-full rounded-full object-cover" /> : getInitials(s.full_name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate group-hover:text-neon-blue transition-colors">{s.full_name}</p>
                    <p className={cn("text-[10px] font-medium", getLevelColor(s.level))}>{getLevelLabel(s.level)}</p>
                  </div>
                  <span className="text-xs font-mono text-neon-yellow">{s.xp} XP</span>
                  {s.streak_days > 0 && <span className="text-[10px] text-neon-red flex items-center gap-0.5"><Flame className="w-3 h-3" />{s.streak_days}</span>}
                </Link>
              ))}
            </div>
          )}
        </motion.div>

        {/* Recent submissions */}
        <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-neon-purple" /> So'nggi faollik
          </h2>
          {recentSubs.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">Hali yuborish yo'q</p>
          ) : (
            <div className="space-y-2">
              {recentSubs.map(s => (
                <div key={s.id} className="flex items-center gap-3 py-2 border-b border-border/30 last:border-0">
                  <div className={cn("w-2.5 h-2.5 rounded-full flex-shrink-0", s.status === "accepted" ? "bg-neon-green" : "bg-neon-red")} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{s.name}</p>
                    <p className="text-[10px] text-muted-foreground">{s.language} · {s.task_type === "challenge" ? "Topshiriq" : "Amaliy"}</p>
                  </div>
                  <div className="text-right">
                    <span className={cn("text-xs font-mono", s.status === "accepted" ? "text-neon-green" : "text-neon-red")}>
                      {s.status === "accepted" ? "✓ Qabul" : "✗ Xato"}
                    </span>
                    <p className="text-[10px] text-muted-foreground">{formatRelativeDate(s.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Acceptance rate */}
      {stats.totalSubmissions > 0 && (
        <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-sm">Umumiy qabul darajasi</h2>
            <span className="text-lg font-bold text-neon-green">{Math.round((stats.accepted / stats.totalSubmissions) * 100)}%</span>
          </div>
          <div className="w-full h-4 bg-surface rounded-full overflow-hidden">
            <motion.div className="h-full progress-gradient rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.round((stats.accepted / stats.totalSubmissions) * 100)}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">{stats.accepted} / {stats.totalSubmissions} yuborish qabul qilindi</p>
        </motion.div>
      )}
    </div>
  );
}
