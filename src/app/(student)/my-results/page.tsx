"use client";

import { useState, useEffect } from "react";
import Link from "@/components/i18n/Link";
import { createClient } from "@/lib/supabase/client";
import { formatNumber, formatDate, getLevelLabel, getLevelColor, cn } from "@/lib/utils";
import type { Profile, Enrollment, Course, Certificate, CoinTransaction } from "@/types";
import { motion } from "framer-motion";
import {
  BookOpen, Target, Zap, Brain, Trophy, Coins, Flame, ChevronRight,
  CheckCircle2, Clock, GraduationCap, TrendingUp, Download
} from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function MyResultsPage() {
  const { t } = useI18n();
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [enrollments, setEnrollments] = useState<(Enrollment & { course: Course })[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [coinHistory, setCoinHistory] = useState<CoinTransaction[]>([]);
  const [stats, setStats] = useState({ courses: 0, challenges: 0, quizzes: 0, totalCoinsEarned: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: p } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (p) setProfile(p as Profile);

      const { data: enr } = await supabase.from("enrollments").select("*, course:courses(*)").eq("user_id", user.id).order("enrolled_at", { ascending: false });
      if (enr) setEnrollments(enr as any[]);

      const { data: certs } = await supabase.from("certificates").select("*").eq("user_id", user.id);
      if (certs) setCertificates(certs as Certificate[]);

      const { data: coins } = await supabase.from("coin_transactions").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(20);
      if (coins) setCoinHistory(coins as CoinTransaction[]);

      const { count: completedCourses } = await supabase.from("enrollments").select("*", { count: "exact", head: true }).eq("user_id", user.id).eq("is_completed", true);
      const { count: solvedChallenges } = await supabase.from("submissions").select("*", { count: "exact", head: true }).eq("user_id", user.id).eq("task_type", "challenge").eq("status", "accepted");
      const { count: passedQuizzes } = await supabase.from("quiz_results").select("*", { count: "exact", head: true }).eq("user_id", user.id);
      const earned = coins?.filter(c => c.amount > 0).reduce((sum, c) => sum + c.amount, 0) || 0;

      setStats({ courses: completedCourses || 0, challenges: solvedChallenges || 0, quizzes: passedQuizzes || 0, totalCoinsEarned: earned });
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="space-y-4 animate-pulse"><div className="h-8 w-48 bg-surface rounded-lg" /><div className="grid grid-cols-4 gap-4">{[1,2,3,4].map(i=><div key={i} className="glass-card h-28" />)}</div></div>;

  const statCards = [
    { label: t.cabinet.dash.statCourses, value: stats.courses, icon: BookOpen, color: "#6C5CE7" },
    { label: t.cabinet.dash.statChallenges, value: stats.challenges, icon: Target, color: "#00D2FF" },
    { label: t.cabinet.dash.statXp, value: formatNumber(profile?.xp || 0), icon: Zap, color: "#FFD600" },
    { label: t.cabinet.results.totalCoins, value: stats.totalCoinsEarned, icon: Coins, color: "#00E676" },
  ];

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display font-bold text-3xl mb-1">{t.cabinet.results.title}</h1>
        <p className="text-muted-foreground">{t.cabinet.results.subtitle}</p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <motion.div key={s.label} className="glass-card p-5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <s.icon className="w-8 h-8 mb-2" style={{ color: s.color }} />
            <div className="font-display font-bold text-2xl">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Kurslar progressi */}
        <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h2 className="font-display font-semibold text-lg mb-4">{t.cabinet.results.courseProgress}</h2>
          {enrollments.length === 0 ? <p className="text-muted-foreground text-sm">{t.cabinet.dash.noEnrollments}</p> : (
            <div className="space-y-3">
              {enrollments.map(e => (
                <Link key={e.id} href={`/courses/${e.course?.slug}`} className="flex items-center gap-3 p-3 rounded-xl bg-surface/50 hover:bg-surface transition-all group">
                  <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center text-sm",
                    e.is_completed ? "bg-neon-green/10 text-neon-green" : "bg-neon-purple/10 text-neon-purple")}>
                    {e.is_completed ? <CheckCircle2 className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate group-hover:text-neon-purple transition-colors">{e.course?.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden"><div className="h-full progress-gradient rounded-full" style={{ width: `${e.progress_percent}%` }} /></div>
                      <span className="text-[10px] font-mono text-muted-foreground">{e.progress_percent}%</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </motion.div>

        {/* Coin tarixi */}
        <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h2 className="font-display font-semibold text-lg mb-4">{t.cabinet.results.coinHistory}</h2>
          {coinHistory.length === 0 ? <p className="text-muted-foreground text-sm">{t.cabinet.results.noCoins}</p> : (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {coinHistory.map(c => (
                <div key={c.id} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0 text-sm">
                  <div>
                    <p className="text-sm">{c.description || c.type}</p>
                    <p className="text-[10px] text-muted-foreground">{formatDate(c.created_at)}</p>
                  </div>
                  <span className={cn("font-mono font-bold", c.amount > 0 ? "text-neon-green" : "text-neon-red")}>
                    {c.amount > 0 ? "+" : ""}{c.amount}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Sertifikatlar */}
      {certificates.length > 0 && (
        <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2"><GraduationCap className="w-5 h-5 text-neon-yellow" /> {t.cabinet.results.certificates}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {certificates.map(cert => (
              <Link key={cert.id} href={`/certificate/${cert.id}`}
                className="p-4 rounded-xl bg-surface/50 border border-neon-yellow/10 hover:border-neon-yellow/30 transition-all group block">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-neon-yellow/10 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-neon-yellow" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate group-hover:text-neon-yellow transition-colors">{cert.course_title}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(cert.completion_date)}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-[10px] font-mono text-muted-foreground">{cert.certificate_number}</p>
                  <span className="text-xs text-neon-purple flex items-center gap-1"><Download className="w-3 h-3" /> {t.cabinet.results.viewDownload}</span>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
