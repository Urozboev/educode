"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "@/components/i18n/Link";
import { createClient } from "@/lib/supabase/client";
import { cn, getInitials, formatNumber, getLevelLabel } from "@/lib/utils";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  ArrowLeft, Coins, Zap, Flame, BookOpen, CheckCircle2, Brain, Gift,
  Loader2, TrendingUp, Award, Clock, Activity,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface ChildProfile {
  id: string; full_name: string; avatar_url: string | null;
  coins: number; xp: number; streak_days: number; level: string;
  ai_dependency_score: number | null;
}
interface Enroll { id: string; progress_percent: number; is_completed: boolean; course: { title: string; slug: string } | null; }

export default function ChildDetailPage() {
  const { t } = useI18n();
  const { id: childId } = useParams<{ id: string }>();
  const supabase = createClient();
  const [child, setChild] = useState<ChildProfile | null>(null);
  const [enrollments, setEnrollments] = useState<Enroll[]>([]);
  const [stats, setStats] = useState({ coursesCompleted: 0, quizzesPassed: 0, challengesSolved: 0, reflections: 0 });
  const [aiToday, setAiToday] = useState<{ used: number; limit: number } | null>(null);
  const [linked, setLinked] = useState(true);
  const [loading, setLoading] = useState(true);

  // Gift
  const [giftOpen, setGiftOpen] = useState(false);
  const [giftAmount, setGiftAmount] = useState(50);
  const [giftMsg, setGiftMsg] = useState("");
  const [gifting, setGifting] = useState(false);
  const [myCoins, setMyCoins] = useState(0);

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Bog'lanish tekshiruvi
    const { data: link } = await supabase
      .from("parent_links")
      .select("id")
      .eq("parent_id", user.id).eq("child_id", childId).eq("status", "confirmed")
      .maybeSingle();
    if (!link) { setLinked(false); setLoading(false); return; }

    const { data: myProfile } = await supabase.from("profiles").select("coins").eq("id", user.id).single();
    if (myProfile) setMyCoins(myProfile.coins);

    // Farzand profili (RLS: parent ko'ra oladi)
    const { data: p } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url, coins, xp, streak_days, level, ai_dependency_score")
      .eq("id", childId).single();
    if (p) setChild(p as ChildProfile);

    // Enrollments (RLS ochilgan)
    const { data: enr } = await supabase
      .from("enrollments")
      .select("id, progress_percent, is_completed, course:courses(title, slug)")
      .eq("user_id", childId)
      .order("last_accessed_at", { ascending: false });
    if (enr) setEnrollments(enr as any[]);

    // Statistika
    const [completed, quizzes, challenges, refl] = await Promise.all([
      supabase.from("enrollments").select("id", { count: "exact", head: true }).eq("user_id", childId).eq("is_completed", true),
      supabase.from("quiz_results").select("id", { count: "exact", head: true }).eq("user_id", childId),
      supabase.from("submissions").select("id", { count: "exact", head: true }).eq("user_id", childId).eq("task_type", "challenge").eq("status", "accepted"),
      supabase.from("reflection_journals").select("id", { count: "exact", head: true }).eq("user_id", childId),
    ]);
    setStats({
      coursesCompleted: completed.count || 0,
      quizzesPassed: quizzes.count || 0,
      challengesSolved: challenges.count || 0,
      reflections: refl.count || 0,
    });

    // Bugungi AI usage
    const today = new Date().toISOString().slice(0, 10);
    const { data: usage } = await supabase
      .from("ai_usage_daily")
      .select("total_queries")
      .eq("user_id", childId).eq("date", today).maybeSingle();
    const { data: limitP } = await supabase.from("profiles").select("ai_daily_limit").eq("id", childId).single();
    setAiToday({ used: usage?.total_queries || 0, limit: (limitP as any)?.ai_daily_limit || 10 });

    setLoading(false);
  }, [supabase, childId]);

  useEffect(() => { load(); }, [load]);

  async function sendGift() {
    if (giftAmount <= 0) { toast.error(t.parent.enterAmount); return; }
    if (giftAmount > myCoins) { toast.error(t.parent.notEnoughCoins); return; }
    setGifting(true);
    const { data, error } = await supabase.rpc("gift_coins", {
      p_child_id: childId, p_amount: giftAmount, p_message: giftMsg || null,
    });
    setGifting(false);
    if (error) { toast.error(error.message); return; }
    if (!data?.ok) { toast.error(data?.error || "Xatolik"); return; }
    toast.success(data.message);
    setGiftOpen(false); setGiftMsg("");
    load();
  }

  if (loading) return <div className="glass-card h-96 animate-pulse" />;
  if (!linked) return (
    <div className="text-center py-20">
      <p className="text-muted-foreground mb-4">{t.parent.notLinked}</p>
      <Link href="/p-dashboard" className="btn-ghost">{t.parent.backToPanel}</Link>
    </div>
  );
  if (!child) return null;

  const depScore = child.ai_dependency_score ?? 0;
  const depZone = depScore <= 30 ? { label: t.parent.depHealthy, cls: "text-neon-green", emoji: "🟢" }
    : depScore <= 60 ? { label: t.parent.depMedium, cls: "text-neon-yellow", emoji: "🟡" }
    : depScore <= 80 ? { label: t.parent.depHigh, cls: "text-orange-400", emoji: "🟠" }
    : { label: t.parent.depVeryHigh, cls: "text-neon-red", emoji: "🔴" };

  const statCards = [
    { label: t.cabinet.dash.statCourses, value: stats.coursesCompleted, icon: BookOpen, color: "#6C5CE7" },
    { label: "O'tilgan testlar", value: stats.quizzesPassed, icon: CheckCircle2, color: "#00E676" },
    { label: t.cabinet.dash.statChallenges, value: stats.challengesSolved, icon: Award, color: "#00D2FF" },
    { label: t.parent.reflections, value: stats.reflections, icon: Brain, color: "#FFD600" },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <Link href="/p-dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4" /> Panelga qaytish
      </Link>

      {/* Header */}
      <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-neon-purple/15 flex items-center justify-center text-neon-purple font-bold text-xl">
            {child.avatar_url ? <img src={child.avatar_url} className="w-full h-full rounded-2xl object-cover" alt="" /> : getInitials(child.full_name)}
          </div>
          <div className="flex-1">
            <h1 className="font-display font-bold text-2xl">{child.full_name}</h1>
            <p className="text-sm text-muted-foreground">Daraja: {getLevelLabel(child.level)}</p>
          </div>
          <div className="flex gap-2">
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neon-yellow/10 border border-neon-yellow/20">
              <Coins className="w-4 h-4 text-neon-yellow" /><span className="font-bold text-sm">{formatNumber(child.coins)}</span>
            </div>
            <button onClick={() => setGiftOpen(true)} className="btn-primary py-2 px-4 text-sm flex items-center gap-2">
              <Gift className="w-4 h-4" /> {t.parent.giftCoins}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <motion.div key={s.label} className="glass-card p-5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: `${s.color}18` }}>
              <s.icon className="w-5 h-5" style={{ color: s.color }} />
            </div>
            <div className="font-display font-bold text-2xl mb-0.5">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Cognitive Health */}
      <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
          <Brain className="w-5 h-5 text-neon-purple" /> Kognitiv salomatlik
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm text-muted-foreground">{t.parent.aiDependency}</span>
              <span className={cn("text-sm font-bold", depZone.cls)}>{depZone.emoji} {depScore}% · {depZone.label}</span>
            </div>
            <div className="w-full h-2.5 bg-surface rounded-full overflow-hidden">
              <div className={cn("h-full rounded-full",
                depScore <= 30 ? "bg-neon-green" : depScore <= 60 ? "bg-neon-yellow" : depScore <= 80 ? "bg-orange-500" : "bg-neon-red")}
                style={{ width: `${Math.min(100, depScore)}%` }} />
            </div>
            <p className="text-[11px] text-muted-foreground mt-2">
              {depScore <= 30 ? "Farzandingiz mustaqil ishlayapti — a'lo!"
                : depScore <= 60 ? "AI yordamini me'yorida ishlatyapti."
                : "AI ga ko'proq tayanyapti. Mustaqil ishlashga undang."}
            </p>
          </div>
          <div className="bg-surface/40 rounded-xl p-4">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
              <Activity className="w-3.5 h-3.5" /> Bugungi AI murojaatlari
            </div>
            <div className="font-display font-bold text-2xl">{aiToday?.used ?? 0}<span className="text-sm text-muted-foreground font-normal">/{aiToday?.limit ?? 10}</span></div>
            <div className="w-full h-1.5 bg-border rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-neon-blue rounded-full" style={{ width: `${Math.min(100, ((aiToday?.used ?? 0) / (aiToday?.limit || 10)) * 100)}%` }} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Kurslar */}
      <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-neon-blue" /> {t.parent.courseProgress}
        </h2>
        {enrollments.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">{t.parent.notEnrolled}</p>
        ) : (
          <div className="space-y-3">
            {enrollments.map(e => (
              <div key={e.id} className="flex items-center gap-4 p-3 rounded-xl bg-surface/50">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                  e.is_completed ? "bg-neon-green/10 text-neon-green" : "bg-neon-purple/10 text-neon-purple")}>
                  {e.is_completed ? <CheckCircle2 className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{e.course?.title || t.admin.common.course}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                      <div className="h-full progress-gradient rounded-full" style={{ width: `${e.progress_percent}%` }} />
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">{e.progress_percent}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Gift modal */}
      {giftOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setGiftOpen(false)}>
          <motion.div className="glass-card max-w-sm w-full p-6" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-neon-yellow/10 flex items-center justify-center"><Gift className="w-5 h-5 text-neon-yellow" /></div>
              <div>
                <h3 className="font-display font-bold">{t.parent.giftCoinsTitle}</h3>
                <p className="text-xs text-muted-foreground">{child.full_name} uchun</p>
              </div>
            </div>
            <div className="mb-3 flex items-center justify-between text-sm px-3 py-2 rounded-lg bg-surface/50">
              <span className="text-muted-foreground">{t.parent.yourBalance}:</span>
              <span className="font-bold flex items-center gap-1"><Coins className="w-3.5 h-3.5 text-neon-yellow" />{myCoins}</span>
            </div>
            <div className="grid grid-cols-4 gap-2 mb-3">
              {[25, 50, 100, 200].map(a => (
                <button key={a} onClick={() => setGiftAmount(a)}
                  className={cn("py-2 rounded-lg text-sm font-medium border transition-all",
                    giftAmount === a ? "bg-neon-yellow/10 border-neon-yellow/40 text-neon-yellow" : "bg-surface border-border")}>
                  {a}
                </button>
              ))}
            </div>
            <input type="number" value={giftAmount} onChange={e => setGiftAmount(Math.max(0, +e.target.value))}
              className="input-field mb-3" placeholder={t.parent.amount} />
            <textarea value={giftMsg} onChange={e => setGiftMsg(e.target.value)} rows={2}
              className="input-field resize-none mb-4 text-sm" placeholder="Xabar (ixtiyoriy): Zo'r ishlayapsan!" />
            <div className="flex gap-2 justify-end">
              <button onClick={() => setGiftOpen(false)} className="btn-ghost py-2 px-4 text-sm">{t.common.cancel}</button>
              <button onClick={sendGift} disabled={gifting || giftAmount > myCoins} className="btn-primary py-2 px-4 text-sm flex items-center gap-2 disabled:opacity-50">
                {gifting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Gift className="w-4 h-4" />} Sovg'a qilish
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
