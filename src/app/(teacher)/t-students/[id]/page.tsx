"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { getInitials, getLevelLabel, getLevelColor, cn, formatDate, formatRelativeDate, calculateXpLevel } from "@/lib/utils";
import type { Profile, Submission, Enrollment } from "@/types";
import { PasteBadge } from "@/components/challenges/PasteBadge";
import { motion } from "framer-motion";
import {
  ArrowLeft, Zap, Coins, Flame, BookOpen, Target, Brain,
  CheckCircle2, XCircle, Clock
} from "lucide-react";

export default function StudentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const supabase = createClient();
  const [student, setStudent] = useState<Profile | null>(null);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [quizResults, setQuizResults] = useState<any[]>([]);
  const [stats, setStats] = useState({ solved: 0, totalSubs: 0, avgQuiz: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: p } = await supabase.from("profiles").select("*").eq("id", id).single();
      if (p) setStudent(p as Profile);

      const { data: e } = await supabase.from("enrollments").select("*, course:courses(title, slug)")
        .eq("user_id", id).order("enrolled_at", { ascending: false });
      if (e) setEnrollments(e);

      const { data: s } = await supabase.from("submissions").select("*")
        .eq("user_id", id).order("created_at", { ascending: false }).limit(20);
      if (s) setSubmissions(s as Submission[]);

      const { data: q } = await supabase.from("quiz_results").select("*, topic:topics(title)")
        .eq("user_id", id).order("completed_at", { ascending: false }).limit(10);
      if (q) setQuizResults(q);

      // Stats
      const { count: solved } = await supabase.from("submissions").select("*", { count: "exact", head: true }).eq("user_id", id).eq("status", "accepted");
      const { count: totalSubs } = await supabase.from("submissions").select("*", { count: "exact", head: true }).eq("user_id", id);
      const quizData = q || [];
      const avgQuiz = quizData.length > 0 ? Math.round(quizData.reduce((sum: number, r: any) => sum + Number(r.percentage), 0) / quizData.length) : 0;

      setStats({ solved: solved || 0, totalSubs: totalSubs || 0, avgQuiz });
      setLoading(false);
    })();
  }, [id]);

  if (loading || !student) return <div className="space-y-4 animate-pulse"><div className="glass-card h-32" /><div className="grid grid-cols-4 gap-4">{[1,2,3,4].map(i=><div key={i} className="glass-card h-24" />)}</div></div>;

  const xpInfo = calculateXpLevel(student.xp);

  return (
    <div className="space-y-6">
      <Link href="/t-students" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4" /> Talabalar
      </Link>

      {/* Student Profile */}
      <motion.div className="glass-card p-6 flex items-center gap-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="w-16 h-16 rounded-2xl bg-hero-gradient flex items-center justify-center text-white font-bold text-xl">
          {student.avatar_url ? <img src={student.avatar_url} className="w-full h-full rounded-2xl object-cover" /> : getInitials(student.full_name)}
        </div>
        <div className="flex-1">
          <h1 className="font-display font-bold text-2xl">{student.full_name}</h1>
          <div className="flex items-center gap-4 mt-1">
            <span className={cn("text-sm font-medium", getLevelColor(student.level))}>{getLevelLabel(student.level)}</span>
            <span className="text-sm text-muted-foreground">A'zo: {formatDate(student.created_at)}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center"><Zap className="w-5 h-5 text-neon-yellow mx-auto" /><p className="font-bold">{student.xp}</p><p className="text-[10px] text-muted-foreground">XP</p></div>
          <div className="text-center"><Coins className="w-5 h-5 text-neon-yellow mx-auto" /><p className="font-bold">{student.coins}</p><p className="text-[10px] text-muted-foreground">Coin</p></div>
          <div className="text-center"><Flame className="w-5 h-5 text-neon-red mx-auto" /><p className="font-bold">{student.streak_days}</p><p className="text-[10px] text-muted-foreground">Streak</p></div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Yechilgan", value: stats.solved, icon: Target, color: "#00E676" },
          { label: "Jami yuborish", value: stats.totalSubs, icon: Brain, color: "#00D2FF" },
          { label: "O'rtacha test", value: `${stats.avgQuiz}%`, icon: CheckCircle2, color: "#FFD600" },
          { label: "Kurslar", value: enrollments.length, icon: BookOpen, color: "#6C5CE7" },
        ].map((c, i) => (
          <motion.div key={c.label} className="glass-card p-4 text-center" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <c.icon className="w-6 h-6 mx-auto mb-1" style={{ color: c.color }} />
            <div className="font-bold text-lg">{c.value}</div>
            <div className="text-[10px] text-muted-foreground">{c.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Enrollments */}
        <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h2 className="font-display font-semibold text-lg mb-4">Kurslar progressi</h2>
          {enrollments.length === 0 ? <p className="text-sm text-muted-foreground">Kursga yozilmagan</p> : (
            <div className="space-y-3">
              {enrollments.map(e => (
                <div key={e.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="truncate">{e.course?.title}</span>
                    <span className="text-xs text-muted-foreground font-mono">{e.progress_percent}%</span>
                  </div>
                  <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full", e.is_completed ? "bg-neon-green" : "progress-gradient")} style={{ width: `${e.progress_percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Recent submissions */}
        <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <h2 className="font-display font-semibold text-lg mb-4">So'nggi yuborishlar</h2>
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {submissions.slice(0, 15).map(s => (
              <div key={s.id} className="flex items-center gap-3 py-2 border-b border-border/30 last:border-0">
                <div className={cn("w-2 h-2 rounded-full", s.status === "accepted" ? "bg-neon-green" : "bg-neon-red")} />
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-mono">{s.language} · {s.task_type}</span>
                </div>
                <PasteBadge count={s.paste_count} ratio={s.paste_ratio} chars={s.pasted_chars} compact />
                <span className={cn("text-xs", s.status === "accepted" ? "text-neon-green" : "text-neon-red")}>
                  {s.passed_tests}/{s.total_tests}
                </span>
                <span className="text-[10px] text-muted-foreground">{formatRelativeDate(s.created_at)}</span>
              </div>
            ))}
            {submissions.length === 0 && <p className="text-sm text-muted-foreground">Yuborish yo'q</p>}
          </div>
        </motion.div>

        {/* Quiz results */}
        <motion.div className="glass-card p-6 lg:col-span-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h2 className="font-display font-semibold text-lg mb-4">Test natijalari</h2>
          {quizResults.length === 0 ? <p className="text-sm text-muted-foreground">Hali test topshirmagan</p> : (
            <div className="grid md:grid-cols-2 gap-3">
              {quizResults.map(q => (
                <div key={q.id} className="p-3 rounded-xl bg-surface/50 flex items-center gap-3">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm",
                    Number(q.percentage) >= 60 ? "bg-neon-green/10 text-neon-green" : "bg-neon-red/10 text-neon-red")}>
                    {q.percentage}%
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{q.topic?.title || "Mavzu"}</p>
                    <p className="text-[10px] text-muted-foreground">{q.score}/{q.total} · {formatDate(q.completed_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
