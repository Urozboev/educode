"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { formatNumber, formatDate, getInitials, cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Users, BookOpen, Swords, Activity, Brain, Coins, TrendingUp, Plus,
  ChevronRight, BarChart3, Target, Zap, Clock, CheckCircle2
} from "lucide-react";

export default function AdminDashboardPage() {
  const supabase = createClient();
  const [stats, setStats] = useState({ users: 0, students: 0, teachers: 0, admins: 0, courses: 0, publishedCourses: 0, challenges: 0, submissions: 0, accepted: 0, enrollments: 0, quizResults: 0 });
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [recentSubs, setRecentSubs] = useState<any[]>([]);
  const [topCourses, setTopCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const counts = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "student"),
        supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "teacher"),
        supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "admin"),
        supabase.from("courses").select("*", { count: "exact", head: true }),
        supabase.from("courses").select("*", { count: "exact", head: true }).eq("is_published", true),
        supabase.from("challenges").select("*", { count: "exact", head: true }),
        supabase.from("submissions").select("*", { count: "exact", head: true }),
        supabase.from("submissions").select("*", { count: "exact", head: true }).eq("status", "accepted"),
        supabase.from("enrollments").select("*", { count: "exact", head: true }),
        supabase.from("quiz_results").select("*", { count: "exact", head: true }),
      ]);
      setStats({
        users: counts[0].count || 0, students: counts[1].count || 0, teachers: counts[2].count || 0,
        admins: counts[3].count || 0, courses: counts[4].count || 0, publishedCourses: counts[5].count || 0,
        challenges: counts[6].count || 0, submissions: counts[7].count || 0, accepted: counts[8].count || 0,
        enrollments: counts[9].count || 0, quizResults: counts[10].count || 0,
      });

      const { data: ru } = await supabase.from("profiles").select("id, full_name, role, avatar_url, created_at").order("created_at", { ascending: false }).limit(8);
      if (ru) setRecentUsers(ru);

      const { data: rs } = await supabase.from("submissions").select("id, status, language, task_type, created_at, user_id").order("created_at", { ascending: false }).limit(8);
      if (rs) {
        const userIds = [...new Set(rs.map(s => s.user_id))];
        const { data: profiles } = await supabase.from("profiles").select("id, full_name").in("id", userIds);
        const nameMap = Object.fromEntries((profiles || []).map(p => [p.id, p.full_name]));
        setRecentSubs(rs.map(s => ({ ...s, user_name: nameMap[s.user_id] || "Noma'lum" })));
      }

      const { data: tc } = await supabase.from("courses").select("id, title, total_enrolled, total_topics").eq("is_published", true).order("total_enrolled", { ascending: false }).limit(5);
      if (tc) setTopCourses(tc);

      setLoading(false);
    })();
  }, []);

  const mainCards = [
    { label: "Foydalanuvchilar", value: stats.users, sub: `${stats.students} talaba · ${stats.teachers} o'qituvchi · ${stats.admins} admin`, icon: Users, color: "#6C5CE7", href: "/a-users" },
    { label: "Kurslar", value: stats.courses, sub: `${stats.publishedCourses} nashr · ${stats.enrollments} ro'yxat`, icon: BookOpen, color: "#00D2FF", href: "/a-courses" },
    { label: "Topshiriqlar", value: stats.challenges, sub: `${stats.submissions} yuborish · ${stats.accepted} qabul`, icon: Swords, color: "#00E676", href: "/a-challenges" },
    { label: "Testlar", value: stats.quizResults, sub: `${stats.quizResults} ta o'tkazildi`, icon: Brain, color: "#FFD600", href: "#" },
  ];

  const quickLinks = [
    { label: "Yangi kurs", href: "/a-courses", icon: BookOpen, color: "#6C5CE7" },
    { label: "Yangi topshiriq", href: "/a-challenges", icon: Swords, color: "#00D2FF" },
    { label: "Foydalanuvchilar", href: "/a-users", icon: Users, color: "#00E676" },
    { label: "Yutuqlar", href: "/a-achievements", icon: Target, color: "#FFD600" },
  ];

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display font-bold text-3xl mb-1">Admin Panel</h1>
        <p className="text-muted-foreground">Platforma boshqaruvi va statistikasi</p>
      </motion.div>

      {/* Main Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {mainCards.map((c, i) => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <Link href={c.href} className="glass-card-hover p-5 block group">
              <div className="flex items-center justify-between mb-3">
                <c.icon className="w-8 h-8" style={{ color: c.color }} />
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-all group-hover:translate-x-1" />
              </div>
              <div className="font-display font-bold text-3xl mb-0.5">{loading ? "..." : formatNumber(c.value)}</div>
              <div className="text-[11px] text-muted-foreground">{c.sub}</div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick Links */}
      <motion.div className="glass-card p-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <h2 className="font-display font-semibold text-sm mb-3 text-muted-foreground">Tezkor harakatlar</h2>
        <div className="grid grid-cols-4 gap-3">
          {quickLinks.map(ql => (
            <Link key={ql.href} href={ql.href} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-surface/50 hover:bg-surface transition-all group text-center">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110" style={{ backgroundColor: `${ql.color}15` }}>
                <ql.icon className="w-5 h-5" style={{ color: ql.color }} />
              </div>
              <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground">{ql.label}</span>
            </Link>
          ))}
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Users */}
        <motion.div className="glass-card p-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-sm">So'nggi foydalanuvchilar</h2>
            <Link href="/a-users" className="text-xs text-neon-purple hover:underline">Barchasi</Link>
          </div>
          <div className="space-y-2">
            {recentUsers.map(u => (
              <div key={u.id} className="flex items-center gap-3 py-1.5">
                <div className="w-7 h-7 rounded-full bg-hero-gradient flex items-center justify-center text-white font-bold text-[10px]">
                  {u.avatar_url ? <img src={u.avatar_url} className="w-full h-full rounded-full object-cover" /> : getInitials(u.full_name)}
                </div>
                <div className="flex-1 min-w-0"><p className="text-xs font-medium truncate">{u.full_name}</p></div>
                <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full",
                  u.role === "admin" ? "bg-neon-red/10 text-neon-red" : u.role === "teacher" ? "bg-neon-blue/10 text-neon-blue" : "bg-surface text-muted-foreground"
                )}>{u.role}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Submissions */}
        <motion.div className="glass-card p-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <h2 className="font-display font-semibold text-sm mb-4">So'nggi yuborishlar</h2>
          <div className="space-y-2">
            {recentSubs.map(s => (
              <div key={s.id} className="flex items-center gap-3 py-1.5">
                <div className={cn("w-2 h-2 rounded-full flex-shrink-0", s.status === "accepted" ? "bg-neon-green" : "bg-neon-red")} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{s.user_name}</p>
                  <p className="text-[10px] text-muted-foreground">{s.language} · {s.task_type}</p>
                </div>
                <span className={cn("text-[10px] font-mono", s.status === "accepted" ? "text-neon-green" : "text-neon-red")}>
                  {s.status === "accepted" ? "✓" : "✗"}
                </span>
              </div>
            ))}
            {recentSubs.length === 0 && <p className="text-xs text-muted-foreground text-center py-4">Hali yuborish yo'q</p>}
          </div>
        </motion.div>

        {/* Top Courses */}
        <motion.div className="glass-card p-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-sm">Mashhur kurslar</h2>
            <Link href="/a-courses" className="text-xs text-neon-purple hover:underline">Barchasi</Link>
          </div>
          <div className="space-y-3">
            {topCourses.map((c, i) => (
              <div key={c.id} className="flex items-center gap-3">
                <span className="text-lg font-bold text-muted-foreground/30 w-6">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{c.title}</p>
                  <p className="text-[10px] text-muted-foreground">{c.total_topics} mavzu</p>
                </div>
                <span className="text-xs font-semibold text-neon-purple">{c.total_enrolled} talaba</span>
              </div>
            ))}
            {topCourses.length === 0 && <p className="text-xs text-muted-foreground text-center py-4">Kurs yo'q</p>}
          </div>
        </motion.div>
      </div>

      {/* Acceptance Rate */}
      <motion.div className="glass-card p-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
        <h2 className="font-display font-semibold text-sm mb-4">Umumiy ko'rsatkichlar</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-surface/50 text-center">
            <p className="text-2xl font-bold text-neon-green">{stats.submissions > 0 ? Math.round((stats.accepted / stats.submissions) * 100) : 0}%</p>
            <p className="text-xs text-muted-foreground mt-1">Qabul qilinish darajasi</p>
          </div>
          <div className="p-4 rounded-xl bg-surface/50 text-center">
            <p className="text-2xl font-bold text-neon-blue">{stats.enrollments}</p>
            <p className="text-xs text-muted-foreground mt-1">Kursga yozilishlar</p>
          </div>
          <div className="p-4 rounded-xl bg-surface/50 text-center">
            <p className="text-2xl font-bold text-neon-yellow">{stats.submissions}</p>
            <p className="text-xs text-muted-foreground mt-1">Jami yuborishlar</p>
          </div>
          <div className="p-4 rounded-xl bg-surface/50 text-center">
            <p className="text-2xl font-bold text-neon-purple">{stats.quizResults}</p>
            <p className="text-xs text-muted-foreground mt-1">Test natijalari</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
