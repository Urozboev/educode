"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { getOrCreateProfile } from "@/lib/profile";
import { cn, formatNumber, getLevelLabel, getLevelColor, calculateXpLevel } from "@/lib/utils";
import type { Profile, Enrollment, Course, LeaderboardEntry } from "@/types";
import { motion } from "framer-motion";
import {
  BookOpen, Code2, Trophy, Flame, Target, TrendingUp,
  ChevronRight, Clock, Zap, Brain, Star, Coins, Play,
  CheckCircle2, ArrowUpRight, GraduationCap
} from "lucide-react";
import CognitiveHealthCard from "@/components/ai/CognitiveHealthCard";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.08 } }),
};

export default function DashboardPage() {
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [enrollments, setEnrollments] = useState<(Enrollment & { course: Course })[]>([]);
  const [completedEnrollments, setCompletedEnrollments] = useState<(Enrollment & { course: Course })[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [stats, setStats] = useState({
    coursesCompleted: 0,
    challengesSolved: 0,
    totalXp: 0,
    quizzesPassed: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Barcha so'rovlar PARALLEL — 7 ta ketma-ket roundtrip o'rniga bitta to'lqin
    const [
      profileData,
      { data: enrollData },
      { data: completedData },
      { data: certsData },
      { count: completedCourses },
      { count: solvedChallenges },
      { count: passedQuizzes },
    ] = await Promise.all([
      getOrCreateProfile(supabase, user.id),
      supabase
        .from("enrollments")
        .select("*, course:courses(*)")
        .eq("user_id", user.id)
        .eq("is_completed", false)
        .order("last_accessed_at", { ascending: false })
        .limit(4),
      supabase
        .from("enrollments")
        .select("*, course:courses(*)")
        .eq("user_id", user.id)
        .eq("is_completed", true)
        .order("completed_at", { ascending: false })
        .limit(4),
      supabase
        .from("certificates")
        .select("*")
        .eq("user_id", user.id)
        .order("issued_at", { ascending: false })
        .limit(4),
      supabase
        .from("enrollments").select("*", { count: "exact", head: true })
        .eq("user_id", user.id).eq("is_completed", true),
      supabase
        .from("submissions").select("*", { count: "exact", head: true })
        .eq("user_id", user.id).eq("task_type", "challenge").eq("status", "accepted"),
      supabase
        .from("quiz_results").select("*", { count: "exact", head: true })
        .eq("user_id", user.id),
    ]);

    if (profileData) setProfile(profileData as Profile);
    if (enrollData) setEnrollments(enrollData as any[]);
    if (completedData) setCompletedEnrollments(completedData as any[]);
    if (certsData) setCertificates(certsData);

    setStats({
      coursesCompleted: completedCourses || 0,
      challengesSolved: solvedChallenges || 0,
      totalXp: profileData?.xp || 0,
      quizzesPassed: passedQuizzes || 0,
    });

    setLoading(false);
  }

  const xpInfo = profile ? calculateXpLevel(profile.xp) : null;

  const statCards = [
    { label: "Tugatilgan kurslar", value: stats.coursesCompleted, icon: BookOpen, color: "#6C5CE7", bg: "bg-neon-purple/10" },
    { label: "Yechilgan topshiriqlar", value: stats.challengesSolved, icon: Target, color: "#00D2FF", bg: "bg-neon-blue/10" },
    { label: "Umumiy XP", value: formatNumber(stats.totalXp), icon: Zap, color: "#FFD600", bg: "bg-neon-yellow/10" },
    { label: "O'tilgan testlar", value: stats.quizzesPassed, icon: Brain, color: "#00E676", bg: "bg-neon-green/10" },
  ];

  const quickActions = [
    { label: "Kurslarni ko'rish", href: "/courses", icon: BookOpen, color: "#6C5CE7" },
    { label: "Topshiriq yechish", href: "/challenges", icon: Code2, color: "#00D2FF" },
    { label: "O'yin o'ynash", href: "/games", icon: Play, color: "#00E676" },
    { label: "Reyting", href: "/leaderboard", icon: Trophy, color: "#FFD600" },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-surface rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="glass-card p-6 h-28 animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-card p-6 h-64 animate-pulse" />
          <div className="glass-card p-6 h-64 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display font-bold text-3xl mb-1">
          Salom, {profile?.full_name?.split(" ")[0]}! 👋
        </h1>
        <p className="text-muted-foreground">
          Bugun ham yangi narsalar o'rganishga tayyormisiz?
        </p>
      </motion.div>

      {/* XP Progress Bar */}
      {xpInfo && profile && (
        <motion.div
          className="glass-card p-5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-hero-gradient flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-sm">Daraja: <span className={getLevelColor(profile.level)}>{getLevelLabel(profile.level)}</span></p>
                <p className="text-xs text-muted-foreground">{profile.xp} / {xpInfo.nextThreshold} XP</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {profile.streak_days > 0 && (
                <div className="flex items-center gap-1.5 text-neon-red font-semibold text-sm">
                  <Flame className="w-5 h-5" />
                  {profile.streak_days} kunlik streak
                </div>
              )}
              <div className="coin-badge">
                <Coins className="w-4 h-4" />
                {profile.coins}
              </div>
            </div>
          </div>
          <div className="w-full h-3 bg-surface rounded-full overflow-hidden">
            <motion.div
              className="h-full progress-gradient rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(xpInfo.progress, 100)}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
            />
          </div>
        </motion.div>
      )}

      {/* Cognitive Health */}
      <CognitiveHealthCard />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="glass-card-hover p-5"
            custom={i}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", stat.bg)}>
              <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
            </div>
            <div className="font-display font-bold text-2xl mb-0.5">{stat.value}</div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Davom etayotgan kurslar */}
        <motion.div
          className="lg:col-span-2 glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-semibold text-lg">Davom etayotgan kurslar</h2>
            <Link href="/courses" className="text-sm text-neon-purple hover:underline flex items-center gap-1">
              Barchasi <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {enrollments.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">Hali kursga yozilmagansiz</p>
              <Link href="/courses" className="btn-primary text-sm py-2 px-6">
                Kurslarni ko'rish
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {enrollments.map((enrollment) => (
                <Link
                  key={enrollment.id}
                  href={`/courses/${enrollment.course?.slug}`}
                  className="flex items-center gap-4 p-4 rounded-xl bg-surface/50 hover:bg-surface transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-neon-purple/10 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-6 h-6 text-neon-purple" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate group-hover:text-neon-purple transition-colors">
                      {enrollment.course?.title}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                        <div
                          className="h-full progress-gradient rounded-full transition-all"
                          style={{ width: `${enrollment.progress_percent}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground font-mono">
                        {enrollment.progress_percent}%
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-neon-purple group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          )}
        </motion.div>

        {/* Tezkor harakatlar */}
        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="font-display font-semibold text-lg mb-5">Tezkor harakatlar</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-surface/50 hover:bg-surface transition-all group text-center"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${action.color}15` }}
                >
                  <action.icon className="w-5 h-5" style={{ color: action.color }} />
                </div>
                <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground">
                  {action.label}
                </span>
              </Link>
            ))}
          </div>

          {/* Kunlik maslahat */}
          <div className="mt-5 p-4 rounded-xl bg-neon-purple/5 border border-neon-purple/10">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-neon-yellow" />
              <span className="text-xs font-semibold text-neon-purple">Kunlik maslahat</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Har kuni kamida 1 ta topshiriq bajarib, streak yig'ing. 7 kunlik streak uchun 30 ta qo'shimcha coin olasiz!
            </p>
          </div>
        </motion.div>
      </div>

      {/* Tugatilgan kurslar va sertifikatlar */}
      {(completedEnrollments.length > 0 || certificates.length > 0) && (
        <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-semibold text-lg flex items-center gap-2">
              🏆 Tugatilgan kurslar
            </h2>
            <Link href="/my-results" className="text-sm text-neon-purple hover:underline flex items-center gap-1">
              Natijalarim <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {completedEnrollments.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Hali kurs tugatilmagan</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-3">
              {completedEnrollments.map(e => {
                const cert = certificates.find(c => c.course_id === e.course_id);
                return (
                  <div key={e.id} className="p-4 rounded-xl bg-neon-green/5 border border-neon-green/10 flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-neon-green/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-6 h-6 text-neon-green" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{e.course?.title}</p>
                      <p className="text-xs text-muted-foreground">100% tugatildi</p>
                    </div>
                    {cert && (
                      <Link href={`/certificate/${cert.id}`}
                        className="text-xs text-neon-yellow hover:underline flex items-center gap-1 flex-shrink-0">
                        📜 Sertifikat
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
