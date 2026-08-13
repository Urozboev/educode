"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "@/components/i18n/Link";
import { createClient } from "@/lib/supabase/client";
import { getOrCreateProfile } from "@/lib/profile";
import {
  getInitials, getLevelLabel, getLevelColor, cn, formatRelativeDate,
} from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Users, Target, TrendingUp, ChevronRight, BarChart3, ClipboardList,
  Download, Flame, Brain, Activity, School, Gamepad2, Copy, Check,
  Lightbulb, ArrowRight, Trophy,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";

type Student = {
  id: string; full_name: string; avatar_url: string | null;
  xp: number; level: string; streak_days: number;
};

type Group = { id: string; name: string; join_code: string | null; is_open: boolean };

type Feed = {
  key: string;
  kind: "submission" | "game";
  name: string;
  ok: boolean;
  detail: string;
  at: string;
};

export default function TeacherDashboardPage() {
  const { t } = useI18n();
  const supabase = createClient();
  const [teacherName, setTeacherName] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [feed, setFeed] = useState<Feed[]>([]);
  const [stats, setStats] = useState({
    totalStudents: 0, totalSubmissions: 0, accepted: 0,
    avgQuizScore: 0, gamePlays: 0,
  });
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    const profile = await getOrCreateProfile(supabase, user.id);
    if (profile) setTeacherName(profile.full_name);

    const [{ data: ts }, { data: gs }] = await Promise.all([
      supabase.from("teacher_students").select("student_id").eq("teacher_id", user.id),
      supabase.from("teacher_groups").select("id, name, join_code, is_open").eq("teacher_id", user.id).order("created_at"),
    ]);

    if (gs) setGroups(gs as Group[]);

    const studentIds = (ts as any[] | null)?.map(t => t.student_id) ?? [];
    if (studentIds.length === 0) { setLoading(false); return; }

    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url, xp, level, streak_days")
      .in("id", studentIds)
      .order("xp", { ascending: false });
    if (profiles) setStudents(profiles as Student[]);

    const nameMap = Object.fromEntries((profiles || []).map((p: any) => [p.id, p.full_name]));

    const [subs, accepted, quizzes, recentSubs, gameResults] = await Promise.all([
      supabase.from("submissions").select("*", { count: "exact", head: true }).in("user_id", studentIds),
      supabase.from("submissions").select("*", { count: "exact", head: true }).in("user_id", studentIds).eq("status", "accepted"),
      supabase.from("quiz_results").select("percentage").in("user_id", studentIds),
      supabase.from("submissions")
        .select("id, user_id, status, language, task_type, created_at")
        .in("user_id", studentIds).order("created_at", { ascending: false }).limit(8),
      // Dars o'yinlari natijalari — jadval bo'lmasa jim o'tadi
      supabase.from("game_results")
        .select("id, user_id, correct_count, total_count, score, created_at")
        .in("user_id", studentIds).order("created_at", { ascending: false }).limit(8),
    ]);

    const quizData = (quizzes.data as any[]) || [];
    const avgScore = quizData.length
      ? Math.round(quizData.reduce((s, q) => s + Number(q.percentage), 0) / quizData.length)
      : 0;

    setStats({
      totalStudents: studentIds.length,
      totalSubmissions: subs.count || 0,
      accepted: accepted.count || 0,
      avgQuizScore: avgScore,
      gamePlays: (gameResults.data as any[])?.length ?? 0,
    });

    // Ikki manbani bitta lentaga birlashtiramiz — o'qituvchi barcha
    // faollikni bir joyda ko'rgani qulay
    const merged: Feed[] = [
      ...((recentSubs.data as any[]) || []).map(s => ({
        key: `s-${s.id}`,
        kind: "submission" as const,
        name: nameMap[s.user_id] || t.teacher.unknown,
        ok: s.status === "accepted",
        detail: `${s.language} · ${s.task_type === "challenge" ? "Topshiriq" : "Amaliy"}`,
        at: s.created_at,
      })),
      ...((gameResults.data as any[]) || []).map(g => ({
        key: `g-${g.id}`,
        kind: "game" as const,
        name: nameMap[g.user_id] || t.teacher.unknown,
        ok: g.total_count > 0 && g.correct_count * 2 >= g.total_count,
        detail: `O'yin · ${g.correct_count}/${g.total_count} to'g'ri`,
        at: g.created_at,
      })),
    ].sort((a, b) => +new Date(b.at) - +new Date(a.at)).slice(0, 10);

    setFeed(merged);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { load(); }, [load]);

  function copyCode(code: string) {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  }

  const statCards = [
    { label: t.teacher.students, value: stats.totalStudents, Icon: Users, cls: "text-neon-purple" },
    { label: t.teacher.submissions, value: stats.totalSubmissions, Icon: Target, cls: "text-neon-blue" },
    { label: "Qabul qilingan", value: stats.accepted, Icon: TrendingUp, cls: "text-neon-green" },
    { label: t.teacher.avgQuiz, value: `${stats.avgQuizScore}%`, Icon: Brain, cls: "text-neon-yellow" },
  ];

  const quickLinks = [
    { label: t.teacher.groups, href: "/t-groups", Icon: School },
    { label: "Dars o'yinlari", href: "/t-lesson-games", Icon: Gamepad2 },
    { label: t.nav.challenges, href: "/t-assignments", Icon: ClipboardList },
    { label: t.nav.methods, href: "/t-methods", Icon: Lightbulb },
    { label: t.teacher.analytics, href: "/t-analytics", Icon: BarChart3 },
    { label: t.teacher.export, href: "/t-export", Icon: Download },
  ];

  /* ===== Hali o'quvchi yo'q — nima qilish kerakligini aytamiz ===== */
  const isEmpty = !loading && stats.totalStudents === 0;

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display font-bold text-3xl mb-1">
          Salom{teacherName ? `, ${teacherName.split(" ")[0]}` : ""}
        </h1>
        <p className="text-muted-foreground">{t.teacher.dash.title}</p>
      </motion.div>

      {isEmpty ? (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8"
        >
          <School className="w-10 h-10 text-neon-purple mb-4" />
          <h2 className="font-display font-bold text-xl mb-2">{t.teacher.dash.startWithGroup}</h2>
          <p className="text-muted-foreground leading-relaxed mb-6 max-w-lg">
            Hozircha sizga o&apos;quvchi biriktirilmagan. Guruh yarating — unga
            avtomatik kod beriladi. O&apos;quvchilar shu kodni <code className="px-1.5 py-0.5 rounded bg-surface border border-border text-xs">/join</code>{" "}
            sahifasida kiritsa, natijalari shu panelda ko&apos;rina boshlaydi.
          </p>

          <ol className="space-y-3 mb-7">
            {[
              { n: "01", t: "Guruh yarating", d: "Masalan “9-A sinf”" },
              { n: "02", t: "Kodni o'quvchilarga ayting", d: "Doskaga yozing yoki guruhga tashlang" },
              { n: "03", t: "Dars o'yinini boshlang", d: "Tayyor o'yinlardan foydalaning yoki o'zingiz tuzing" },
            ].map(s => (
              <li key={s.n} className="flex gap-3">
                <span className="numeric text-sm text-muted-foreground/50 mt-0.5">{s.n}</span>
                <div>
                  <p className="font-medium text-sm">{s.t}</p>
                  <p className="text-xs text-muted-foreground">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="flex flex-wrap gap-3">
            <Link href="/t-groups" className="btn-primary py-2.5 px-5 text-sm inline-flex items-center gap-2">
              Guruh yaratish <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/t-lesson-games" className="btn-ghost py-2.5 px-5 text-sm">
              O&apos;yinlarni ko&apos;rish
            </Link>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((c, i) => (
            <motion.div
              key={c.label}
              className="glass-card p-5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <c.Icon className={cn("w-6 h-6 mb-2", c.cls)} />
              <div className="numeric text-2xl">{loading ? "—" : c.value}</div>
              <div className="text-xs text-muted-foreground">{c.label}</div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Guruh kodlari — o'qituvchi darsda tez topishi uchun yuqorida */}
      {groups.length > 0 && (
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="eyebrow">{t.teacher.dash.groupCodes}</h2>
            <Link href="/t-groups" className="text-sm text-neon-purple hover:underline inline-flex items-center gap-1">
              Boshqarish <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex flex-wrap gap-3">
            {groups.map(g => (
              <button
                key={g.id}
                onClick={() => g.join_code && copyCode(g.join_code)}
                disabled={!g.join_code || !g.is_open}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors text-left",
                  g.is_open
                    ? "bg-card border-border hover:border-neon-purple/40"
                    : "bg-surface border-border opacity-60"
                )}
              >
                <div>
                  <p className="text-xs text-muted-foreground">{g.name}</p>
                  <p className={cn(
                    "font-display font-extrabold text-xl tracking-[0.15em]",
                    g.is_open ? "text-neon-purple" : "text-muted-foreground line-through"
                  )}>
                    {g.join_code || "—"}
                  </p>
                </div>
                {g.is_open && (copied === g.join_code
                  ? <Check className="w-4 h-4 text-neon-green" />
                  : <Copy className="w-4 h-4 text-muted-foreground" />)}
              </button>
            ))}
          </div>
        </motion.section>
      )}

      {/* Tezkor havolalar */}
      <motion.div
        className="grid grid-cols-3 sm:grid-cols-6 gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
      >
        {quickLinks.map(ql => (
          <Link
            key={ql.href}
            href={ql.href}
            className="glass-card-hover p-4 flex flex-col items-center gap-2 text-center group"
          >
            <span className="w-10 h-10 rounded-xl bg-neon-purple/[0.08] border border-neon-purple/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ql.Icon className="w-5 h-5 text-neon-purple" />
            </span>
            <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground leading-tight">
              {ql.label}
            </span>
          </Link>
        ))}
      </motion.div>

      {!isEmpty && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* O'quvchilar */}
          <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-lg">{t.teacher.students}</h2>
              <Link href="/t-students" className="text-sm text-neon-purple hover:underline flex items-center gap-1">
                Barchasi <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {students.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">{t.teacher.dash.noStudents}</p>
            ) : (
              <div className="space-y-2">
                {students.slice(0, 8).map((s, i) => (
                  <Link
                    key={s.id}
                    href={`/t-students/${s.id}`}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface/50 transition-all group"
                  >
                    <span className="numeric text-xs text-muted-foreground/40 w-5">{i + 1}</span>
                    <span className="w-8 h-8 rounded-full bg-hero-gradient flex items-center justify-center text-white font-bold text-[10px] overflow-hidden flex-shrink-0">
                      {s.avatar_url
                        // eslint-disable-next-line @next/next/no-img-element
                        ? <img src={s.avatar_url} alt="" className="w-full h-full object-cover" />
                        : getInitials(s.full_name)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate group-hover:text-neon-purple transition-colors">
                        {s.full_name}
                      </p>
                      <p className={cn("text-[10px] font-medium", getLevelColor(s.level))}>
                        {getLevelLabel(s.level)}
                      </p>
                    </div>
                    <span className="numeric text-xs text-neon-yellow">{s.xp} XP</span>
                    {s.streak_days > 0 && (
                      <span className="text-[10px] text-neon-red flex items-center gap-0.5">
                        <Flame className="w-3 h-3" />{s.streak_days}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </motion.div>

          {/* Faollik lentasi */}
          <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-neon-purple" /> So&apos;nggi faollik
            </h2>

            {feed.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">{t.teacher.dash.noActivity}</p>
            ) : (
              <div className="space-y-2">
                {feed.map(f => (
                  <div key={f.key} className="flex items-center gap-3 py-2 border-b border-border/30 last:border-0">
                    <span className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0",
                      f.ok ? "bg-neon-green/10 text-neon-green" : "bg-neon-red/10 text-neon-red"
                    )}>
                      {f.kind === "game"
                        ? <Trophy className="w-3.5 h-3.5" />
                        : <Target className="w-3.5 h-3.5" />}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{f.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{f.detail}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground flex-shrink-0">
                      {formatRelativeDate(f.at)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* Qabul darajasi */}
      {stats.totalSubmissions > 0 && (
        <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-sm">{t.teacher.dash.acceptRate}</h2>
            <span className="numeric text-lg text-neon-green">
              {Math.round((stats.accepted / stats.totalSubmissions) * 100)}%
            </span>
          </div>
          <div className="w-full h-3 bg-surface rounded-full overflow-hidden">
            <motion.div
              className="h-full progress-gradient rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.round((stats.accepted / stats.totalSubmissions) * 100)}%` }}
              transition={{ duration: 0.9, delay: 0.45 }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            <span className="numeric">{stats.accepted}</span> / <span className="numeric">{stats.totalSubmissions}</span> yuborish qabul qilindi
          </p>
        </motion.div>
      )}
    </div>
  );
}
