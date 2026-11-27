"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "@/components/i18n/Link";
import { createClient } from "@/lib/supabase/client";
import { cn, getInitials, formatDate, formatDateTime, getLevelLabel, getLevelColor } from "@/lib/utils";
import type { Profile } from "@/types";
import { type StudentCourseStat, gradeInfo, pctColor, activityState, dayKey } from "@/lib/student-stats";
import { SUPPORT_LEVELS } from "@/lib/ai/engagement";
import {
  ArrowLeft, Zap, Coins, Flame, BookOpen, CheckCircle2, XCircle, Clock, ChevronDown,
  FileText, Code2, ListChecks, GraduationCap, Activity, Loader2, Circle, PlayCircle, Swords,
} from "lucide-react";

/** Admin: bitta talaba haqida to'liq ma'lumot — kurslar, mavzular, testlar, topshiriqlar, faollik, coinlar. */

interface TopicRow { id: string; course_id: string; title: string; order_index: number }
interface ProgRow { topic_id: string; content_read: boolean; quiz_passed: boolean; tasks_completed: boolean; is_completed: boolean; started_at: string; completed_at: string | null }
interface QuizRow { id: string; topic_id: string; score: number; total: number; percentage: number; attempt_number: number | null; completed_at: string }
interface SubRow {
  id: string; task_id: string; task_type: string; language: string; status: string;
  passed_tests: number; total_tests: number; created_at: string; review_note: string | null; reviewed_at: string | null;
}
interface TaskRow { id: string; topic_id: string; title: string; task_kind: string | null }
interface CogRow {
  dep_index: number | null; dep_events: number; support_level: number; level_changes: number;
  turns: number; co_share: number | null; recovery: number | null;
  cal_resolved: number; cal_brier: number | null; cal_bias: number | null;
}
interface CoinRow { id: string; amount: number; type: string; description: string | null; balance_after: number | null; created_at: string }

type Ev = { ts: string; kind: "topic" | "quiz" | "sub" | "start"; title: string; sub?: string; ok?: boolean | null; course?: string };

const STATUS: Record<string, { label: string; ok: boolean | null }> = {
  accepted: { label: "Qabul qilindi", ok: true },
  wrong_answer: { label: "Notöğri", ok: false },
  pending: { label: "Tekshirilmoqda", ok: null },
  running: { label: "Tekshirilmoqda", ok: null },
  compilation_error: { label: "Kompilyatsiya xatosi", ok: false },
  runtime_error: { label: "Bajariliş xatosi", ok: false },
  time_limit: { label: "Vaqt limiti", ok: false },
  memory_limit: { label: "Xotira limiti", ok: false },
};
const KIND: Record<string, string> = { code: "Kod", answer: "Javob", report: "Hisobot" };

export default function AdminStudentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const supabase = createClient();
  const [student, setStudent] = useState<Profile | null>(null);
  const [stats, setStats] = useState<StudentCourseStat[]>([]);
  const [topics, setTopics] = useState<TopicRow[]>([]);
  const [prog, setProg] = useState<ProgRow[]>([]);
  const [quizzes, setQuizzes] = useState<QuizRow[]>([]);
  const [subs, setSubs] = useState<SubRow[]>([]);
  const [tasks, setTasks] = useState<TaskRow[]>([]);
  const [challenges, setChallenges] = useState<Record<string, string>>({});
  const [coins, setCoins] = useState<CoinRow[]>([]);
  /** 89-migratsiya: bog'liqlik, ko'mak darajasi, muloqot va kalibrlash */
  const [cog, setCog] = useState<CogRow | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [feedRange, setFeedRange] = useState<"today" | "week" | "month">("week");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [p, st, pr, q, s, c] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", id).single(),
        supabase.rpc("student_course_stats", { p_user: id, p_course: null }),
        supabase.from("topic_progress").select("topic_id, content_read, quiz_passed, tasks_completed, is_completed, started_at, completed_at").eq("user_id", id),
        supabase.from("quiz_results").select("id, topic_id, score, total, percentage, attempt_number, completed_at").eq("user_id", id).order("completed_at", { ascending: false }),
        supabase.from("submissions").select("id, task_id, task_type, language, status, passed_tests, total_tests, created_at, review_note, reviewed_at").eq("user_id", id).order("created_at", { ascending: false }).limit(500),
        supabase.from("coin_transactions").select("id, amount, type, description, balance_after, created_at").eq("user_id", id).order("created_at", { ascending: false }).limit(100),
      ]);
      if (p.data) setStudent(p.data as Profile);
      if (st.error) setError(st.error.message);
      const statRows = (st.data ?? []) as StudentCourseStat[];
      setStats(statRows);
      setOpen(statRows[0]?.course_id ?? null);
      setProg((pr.data ?? []) as ProgRow[]);
      setQuizzes((q.data ?? []) as QuizRow[]);
      const subRows = (s.data ?? []) as SubRow[];
      setSubs(subRows);
      setCoins((c.data ?? []) as CoinRow[]);
      supabase.rpc("cognitive_overview", { p_user: id }).then(({ data }) => setCog(((data ?? []) as CogRow[])[0] ?? null));

      const courseIds = statRows.map((r) => r.course_id);
      const challengeIds = [...new Set(subRows.filter((x) => x.task_type === "challenge").map((x) => x.task_id))];
      const [t, ch] = await Promise.all([
        courseIds.length
          ? supabase.from("topics").select("id, course_id, title, order_index").in("course_id", courseIds).eq("is_published", true).order("order_index")
          : Promise.resolve({ data: [] }),
        challengeIds.length ? supabase.from("challenges").select("id, title").in("id", challengeIds) : Promise.resolve({ data: [] }),
      ]);
      const topicRows = (t.data ?? []) as TopicRow[];
      setTopics(topicRows);
      if (topicRows.length) {
        const { data: tk } = await supabase.from("topic_tasks").select("id, topic_id, title, task_kind").in("topic_id", topicRows.map((x) => x.id));
        setTasks((tk ?? []) as TaskRow[]);
      }
      setChallenges(Object.fromEntries(((ch.data ?? []) as { id: string; title: string }[]).map((x) => [x.id, x.title])));
      setLoading(false);
    })();
  }, [id]);

  // ---- Indekslar ----
  const topicById = useMemo(() => new Map(topics.map((t) => [t.id, t])), [topics]);
  const taskById = useMemo(() => new Map(tasks.map((t) => [t.id, t])), [tasks]);
  const courseTitle = useMemo(() => new Map(stats.map((s) => [s.course_id, s.course_title])), [stats]);
  const progByTopic = useMemo(() => new Map(prog.map((p) => [p.topic_id, p])), [prog]);

  // Faollik hodisalari (mavzu ochish/tugatish, test, topshiriq)
  const events = useMemo<Ev[]>(() => {
    const ev: Ev[] = [];
    for (const p of prog) {
      const t = topicById.get(p.topic_id);
      const course = t ? courseTitle.get(t.course_id) : undefined;
      ev.push({ ts: p.started_at, kind: "start", title: t?.title ?? "Mavzu", sub: "Mavzuni oçdi", course });
      if (p.is_completed && p.completed_at) ev.push({ ts: p.completed_at, kind: "topic", title: t?.title ?? "Mavzu", sub: "Mavzuni tugatdi", ok: true, course });
    }
    for (const q of quizzes) {
      const t = topicById.get(q.topic_id);
      ev.push({ ts: q.completed_at, kind: "quiz", title: t?.title ?? "Test", sub: `Test: ${q.score}/${q.total} (${Math.round(q.percentage)}%)`, ok: q.percentage >= 60, course: t ? courseTitle.get(t.course_id) : undefined });
    }
    for (const s of subs) {
      const tk = taskById.get(s.task_id);
      const t = tk ? topicById.get(tk.topic_id) : undefined;
      const st = STATUS[s.status] ?? { label: s.status, ok: null };
      ev.push({
        ts: s.created_at, kind: "sub",
        title: s.task_type === "challenge" ? (challenges[s.task_id] ?? "Masala") : (tk?.title ?? "Topshiriq"),
        sub: `${s.task_type === "challenge" ? "Masala" : KIND[tk?.task_kind ?? "code"] ?? "Topshiriq"} · ${st.label}${s.total_tests > 0 && s.language !== "report" ? ` (${s.passed_tests}/${s.total_tests})` : ""}`,
        ok: st.ok, course: t ? courseTitle.get(t.course_id) : undefined,
      });
    }
    return ev.sort((a, b) => b.ts.localeCompare(a.ts));
  }, [prog, quizzes, subs, topicById, taskById, courseTitle, challenges]);

  const today = dayKey(new Date());
  const days14 = useMemo(() => {
    const out: { key: string; label: string; n: number }[] = [];
    for (let k = 13; k >= 0; k--) {
      const d = new Date(Date.now() - k * 86400000);
      out.push({ key: dayKey(d), label: String(Number(dayKey(d).slice(8))), n: 0 });
    }
    const idx = new Map(out.map((d, i) => [d.key, i]));
    for (const e of events) {
      if (e.kind === "start") continue;
      const i = idx.get(dayKey(e.ts));
      if (i !== undefined) out[i].n++;
    }
    return out;
  }, [events]);
  const weekStart = days14[7]?.key ?? today;

  const counts = (from: string) => {
    const ev = events.filter((e) => dayKey(e.ts) >= from);
    return {
      topics: ev.filter((e) => e.kind === "topic").length,
      quizzes: ev.filter((e) => e.kind === "quiz").length,
      subs: ev.filter((e) => e.kind === "sub").length,
      solved: ev.filter((e) => e.kind === "sub" && e.ok).length,
    };
  };
  const cToday = counts(today);
  const cWeek = counts(weekStart);

  const feedFrom = feedRange === "today" ? today : feedRange === "week" ? weekStart : dayKey(new Date(Date.now() - 29 * 86400000));
  const feed = events.filter((e) => dayKey(e.ts) >= feedFrom);

  if (loading || !student) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="glass-card h-32" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{[1, 2, 3, 4].map((i) => <div key={i} className="glass-card h-24" />)}</div>
        <div className="glass-card h-64 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
      </div>
    );
  }

  const lastAct = events.find((e) => e.kind !== "start")?.ts ?? events[0]?.ts ?? null;
  const act = activityState(lastAct);
  const maxDay = Math.max(1, ...days14.map((d) => d.n));
  const totalScore = stats.length ? Math.round(stats.reduce((a, s) => a + s.score, 0) / stats.length) : null;
  const overallGrade = totalScore == null ? null : totalScore >= 86 ? 5 : totalScore >= 71 ? 4 : totalScore >= 56 ? 3 : 2;
  const og = gradeInfo(overallGrade);

  return (
    <div className="space-y-6">
      <Link href="/a-students" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4" /> Talabalar statistikasi
      </Link>

      {/* Profil */}
      <div className="glass-card p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-5">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="w-16 h-16 rounded-2xl bg-hero-gradient flex items-center justify-center text-white font-bold text-xl shrink-0 overflow-hidden">
            {student.avatar_url ? <img src={student.avatar_url} alt="" className="w-full h-full object-cover" /> : getInitials(student.full_name)}
          </div>
          <div className="min-w-0">
            <h1 className="font-display font-bold text-2xl truncate">{student.full_name}</h1>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm">
              {student.username && <span className="text-muted-foreground">@{student.username}</span>}
              <span className={cn("font-medium", getLevelColor(student.level))}>{getLevelLabel(student.level)}</span>
              <span className="text-muted-foreground">Aʼzo: {formatDate(student.created_at)}</span>
              <span className={cn("text-[11px] font-medium px-2 py-0.5 rounded-full", act.cls)}>{act.label}</span>
              {student.is_blocked && <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-neon-red/10 text-neon-red">Bloklangan</span>}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4 md:gap-6">
          <Stat icon={<Zap className="w-5 h-5 text-neon-yellow" />} value={student.xp} label="XP" />
          <Stat icon={<Coins className="w-5 h-5 text-neon-yellow" />} value={student.coins} label="Coin" />
          <Stat icon={<Flame className="w-5 h-5 text-neon-red" />} value={student.streak_days} label="Streak" />
          <div className="text-center">
            <span className={cn("inline-flex w-9 h-9 items-center justify-center rounded-xl font-bold", og.cls)}>{overallGrade ?? "—"}</span>
            <p className="text-[10px] text-muted-foreground mt-1">Umumiy baho{totalScore != null && ` (${totalScore})`}</p>
          </div>
        </div>
      </div>

      {error && <div className="glass-card p-4 text-sm border-l-4 border-l-neon-red">Kurs statistikasi yuklanmadi: {error}. 88-migratsiya işga tuşirilganini tekşiring.</div>}

      {/* Bugun / hafta + grafik */}
      <div className="grid lg:grid-cols-3 gap-4">
        <PeriodCard title="Bugun" c={cToday} />
        <PeriodCard title="Oxirgi 7 kun" c={cWeek} />
        <div className="glass-card p-5">
          <p className="text-sm font-semibold mb-3 flex items-center gap-2"><Activity className="w-4 h-4 text-neon-purple" /> 14 kunlik faollik</p>
          <div className="flex items-end gap-1 h-24">
            {days14.map((d) => (
              <div key={d.key} className="flex-1 flex flex-col items-center gap-1 h-full justify-end" title={`${d.key}: ${d.n} ta hodisa`}>
                {d.n > 0 && <span className="text-[9px] text-muted-foreground">{d.n}</span>}
                <div className={cn("w-full rounded-t", d.n ? (d.key === today ? "bg-neon-green" : "bg-neon-purple/70") : "bg-surface")} style={{ height: `${Math.max(4, (d.n / maxDay) * 72)}px` }} />
                <span className={cn("text-[9px]", d.key === today ? "text-foreground font-bold" : "text-muted-foreground")}>{d.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {cog && (
        <div className="glass-card p-5">
          <div className="flex items-center justify-between gap-2 mb-3">
            <p className="text-sm font-semibold">Kognitiv avtonomiya</p>
            <Link href="/a-cognitive" className="text-xs text-neon-purple hover:underline">Barça talabalar →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
            <Mini label="SIga boğliqlik (7 kun)" value={cog.dep_index == null ? "—" : String(cog.dep_index)} hint={`${cog.dep_events} ta hodisa; 3 tadan kam bölsa talqin qilinmaydi`} />
            <Mini label="Kömak darajasi" value={`${cog.support_level} · ${SUPPORT_LEVELS[cog.support_level].name}`} hint={`${cog.level_changes} marta özgargan`} />
            <Mini label="Tayyor yeçim söraş" value={cog.co_share == null ? "—" : `${cog.co_share}%`} hint={`${cog.turns} ta mentor savoli (30 kun)`} />
            <Mini label="Öz fikriga qaytiş" value={cog.recovery == null ? "—" : `${cog.recovery}%`} />
            <Mini label="Özini baholaş aniqligi" value={cog.cal_brier == null ? "—" : `${Math.round((1 - Number(cog.cal_brier)) * 100)}%`}
              hint={cog.cal_bias == null ? undefined : `${cog.cal_resolved} ta başorat, siljiş ${Number(cog.cal_bias).toFixed(2)} (> 0 — ortiqça baholaş)`} />
          </div>
        </div>
      )}

      {/* Kurslar */}
      <div className="space-y-3">
        <h2 className="font-display font-semibold text-xl flex items-center gap-2"><BookOpen className="w-5 h-5 text-neon-purple" /> Kurslar ({stats.length})</h2>
        {stats.length === 0 && <div className="glass-card p-6 text-sm text-muted-foreground">Talaba hali heç qaysi kursga yozilmagan.</div>}
        {stats.map((s) => {
          const g = gradeInfo(s.grade);
          const isOpen = open === s.course_id;
          const courseTopics = topics.filter((t) => t.course_id === s.course_id);
          return (
            <div key={s.course_id} className="glass-card overflow-hidden">
              <button onClick={() => setOpen(isOpen ? null : s.course_id)} className="w-full text-left p-5 hover:bg-surface/30 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold truncate">{s.course_title}</p>
                      {s.is_completed && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">Tugatgan</span>}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {s.current_order
                        ? <>Hozir: <b className="text-foreground">{s.current_order}-mavzu</b> · {s.current_title}</>
                        : "Barça mavzular tugatilgan"}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 h-2.5 rounded-full bg-surface overflow-hidden max-w-md">
                        <div className={cn("h-full rounded-full", s.progress >= 100 ? "bg-neon-green" : "progress-gradient")} style={{ width: `${s.progress}%` }} />
                      </div>
                      <span className="text-xs font-mono">{s.topics_done}/{s.total_topics} · {s.progress}%</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-3 text-center shrink-0">
                    <Mini label="Test örtaça" value={s.quiz_avg == null ? "—" : `${s.quiz_avg}%`} cls={pctColor(s.quiz_avg)} hint={`${s.quizzes_taken} ta test topşirgan`} />
                    <Mini label="Topşiriqlar" value={`${s.tasks_solved}/${s.tasks_total}`} />
                    <Mini label="Reyting" value={String(s.score)} />
                    <div>
                      <span className={cn("inline-flex w-9 h-9 items-center justify-center rounded-xl font-bold", g.cls)} title={g.label}>{s.grade}</span>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{g.label}</p>
                    </div>
                  </div>
                  <ChevronDown className={cn("w-5 h-5 text-muted-foreground transition-transform hidden lg:block", isOpen && "rotate-180")} />
                </div>
                <p className="text-[11px] text-muted-foreground mt-2">
                  Yozilgan: {formatDate(s.enrolled_at)}{s.last_activity_at && <> · Oxirgi faollik: {formatDateTime(s.last_activity_at)}</>}
                </p>
              </button>

              {isOpen && (
                <div className="border-t border-border/50 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-xs text-muted-foreground border-b border-border/50">
                        <th className="text-left px-5 py-2 font-semibold w-10">#</th>
                        <th className="text-left px-3 py-2 font-semibold">Mavzu</th>
                        <th className="text-left px-3 py-2 font-semibold">Holat</th>
                        <th className="px-3 py-2 font-semibold">Matn</th>
                        <th className="px-3 py-2 font-semibold">Test (eng yaxşi)</th>
                        <th className="px-3 py-2 font-semibold">Topşiriqlar</th>
                        <th className="text-left px-3 py-2 font-semibold">Tugatgan sana</th>
                      </tr>
                    </thead>
                    <tbody>
                      {courseTopics.map((t, k) => {
                        const p = progByTopic.get(t.id);
                        const tq = quizzes.filter((q) => q.topic_id === t.id);
                        const best = tq.length ? Math.max(...tq.map((q) => Number(q.percentage))) : null;
                        const tt = tasks.filter((x) => x.topic_id === t.id);
                        const solved = tt.filter((x) => subs.some((s2) => s2.task_id === x.id && s2.status === "accepted")).length;
                        const pendingRep = tt.some((x) => subs.some((s2) => s2.task_id === x.id && s2.status === "pending" && s2.language === "report"));
                        const isCur = s.current_order === k + 1;
                        return (
                          <tr key={t.id} className={cn("border-b border-border/30", isCur && "bg-neon-purple/[0.07]")}>
                            <td className="px-5 py-2 font-mono text-xs text-muted-foreground">{k + 1}</td>
                            <td className="px-3 py-2">{t.title}{isCur && <span className="ml-2 text-[10px] font-semibold text-neon-purple">← hozir şu yerda</span>}</td>
                            <td className="px-3 py-2 whitespace-nowrap">
                              {p?.is_completed
                                ? <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400"><CheckCircle2 className="w-3.5 h-3.5" /> Tugatgan</span>
                                : p
                                  ? <span className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400"><PlayCircle className="w-3.5 h-3.5" /> Boşlagan</span>
                                  : <span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><Circle className="w-3.5 h-3.5" /> Oçilmagan</span>}
                            </td>
                            <td className="px-3 py-2 text-center">{p?.content_read ? <CheckCircle2 className="w-4 h-4 text-emerald-500 inline" /> : <span className="text-muted-foreground">—</span>}</td>
                            <td className={cn("px-3 py-2 text-center font-mono text-xs", pctColor(best))}>
                              {best == null ? "—" : `${Math.round(best)}%`}{tq.length > 1 && <span className="text-muted-foreground"> · {tq.length} uriniş</span>}
                            </td>
                            <td className="px-3 py-2 text-center font-mono text-xs">
                              {tt.length ? <span className={solved === tt.length ? "text-emerald-600 dark:text-emerald-400" : ""}>{solved}/{tt.length}</span> : "—"}
                              {pendingRep && <span className="ml-1 text-[10px] text-amber-600" title="Hisobot öqituvçi tekşiruvini kutmoqda">⏳</span>}
                            </td>
                            <td className="px-3 py-2 text-xs text-muted-foreground whitespace-nowrap">{p?.completed_at ? formatDateTime(p.completed_at) : ""}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="grid xl:grid-cols-2 gap-6">
        {/* Faollik lentasi */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between gap-2 mb-3">
            <h2 className="font-display font-semibold text-lg">Nima bajardi</h2>
            <div className="flex gap-1">
              {([["today", "Bugun"], ["week", "7 kun"], ["month", "30 kun"]] as const).map(([k, l]) => (
                <button key={k} onClick={() => setFeedRange(k)}
                  className={cn("px-2.5 py-1 rounded-lg text-xs font-medium", feedRange === k ? "bg-neon-purple/10 text-neon-purple" : "bg-surface text-muted-foreground")}>{l}</button>
              ))}
            </div>
          </div>
          <div className="space-y-1 max-h-[480px] overflow-y-auto pr-1">
            {feed.length === 0 && <p className="text-sm text-muted-foreground py-6 text-center">Bu davrda faollik yöq</p>}
            {feed.map((e, k) => {
              const Icon = e.kind === "topic" ? GraduationCap : e.kind === "quiz" ? ListChecks : e.kind === "start" ? BookOpen : e.sub?.startsWith("Masala") ? Swords : e.sub?.startsWith("Hisobot") ? FileText : Code2;
              return (
                <div key={k} className="flex items-start gap-3 py-2 border-b border-border/30 last:border-0">
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                    e.ok === true ? "bg-emerald-500/10 text-emerald-600" : e.ok === false ? "bg-rose-500/10 text-rose-600" : "bg-surface text-muted-foreground")}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{e.title}</p>
                    <p className="text-xs text-muted-foreground">{e.sub}{e.course && <> · {e.course}</>}</p>
                  </div>
                  <span className="text-[11px] text-muted-foreground whitespace-nowrap">{formatDateTime(e.ts)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Topshiriqlar */}
        <div className="glass-card p-5">
          <h2 className="font-display font-semibold text-lg mb-3">Topşiriq va masalalar ({subs.length})</h2>
          <div className="space-y-1 max-h-[480px] overflow-y-auto pr-1">
            {subs.length === 0 && <p className="text-sm text-muted-foreground py-6 text-center">Hali yuborilmagan</p>}
            {subs.map((s) => {
              const tk = taskById.get(s.task_id);
              const t = tk ? topicById.get(tk.topic_id) : undefined;
              const st = STATUS[s.status] ?? { label: s.status, ok: null };
              const pct = s.total_tests > 0 ? Math.round((s.passed_tests / s.total_tests) * 100) : null;
              return (
                <div key={s.id} className="flex items-start gap-3 py-2 border-b border-border/30 last:border-0">
                  {st.ok === true ? <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" /> : st.ok === false ? <XCircle className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" /> : <Clock className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{s.task_type === "challenge" ? (challenges[s.task_id] ?? "Masala") : (tk?.title ?? "Topshiriq")}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {s.task_type === "challenge" ? "Masala" : KIND[tk?.task_kind ?? "code"]}{t && <> · {t.title}</>}
                    </p>
                    {s.review_note && <p className="text-xs mt-0.5 text-amber-700 dark:text-amber-400">Öqituvçi izohi: {s.review_note}</p>}
                  </div>
                  <div className="text-right shrink-0">
                    <p className={cn("text-xs font-semibold", st.ok === true ? "text-emerald-600 dark:text-emerald-400" : st.ok === false ? "text-rose-600 dark:text-rose-400" : "text-amber-600")}>
                      {st.label}{pct != null && s.language !== "report" && ` · ${pct}%`}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{formatDateTime(s.created_at)}</p>
                    {s.language === "report" && s.status === "pending" && <Link href="/a-reports" className="text-[10px] text-neon-purple hover:underline">Tekşiriş →</Link>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Testlar */}
        <div className="glass-card p-5">
          <h2 className="font-display font-semibold text-lg mb-3">Test natijalari ({quizzes.length})</h2>
          <div className="space-y-1 max-h-[420px] overflow-y-auto pr-1">
            {quizzes.length === 0 && <p className="text-sm text-muted-foreground py-6 text-center">Hali test topşirmagan</p>}
            {quizzes.map((q) => {
              const t = topicById.get(q.topic_id);
              const p = Math.round(Number(q.percentage));
              return (
                <div key={q.id} className="flex items-center gap-3 py-2 border-b border-border/30 last:border-0">
                  <div className={cn("w-12 h-9 rounded-lg flex items-center justify-center font-bold text-xs", p >= 86 ? "bg-emerald-500/10 text-emerald-600" : p >= 56 ? "bg-amber-500/10 text-amber-600" : "bg-rose-500/10 text-rose-600")}>{p}%</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{t?.title ?? "Mavzu"}</p>
                    <p className="text-xs text-muted-foreground truncate">{q.score}/{q.total} töğri{q.attempt_number && q.attempt_number > 1 ? ` · ${q.attempt_number}-uriniş` : ""}{t && <> · {courseTitle.get(t.course_id)}</>}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">{formatDateTime(q.completed_at)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Coinlar */}
        <div className="glass-card p-5">
          <h2 className="font-display font-semibold text-lg mb-3">Coin tarixi</h2>
          <div className="space-y-1 max-h-[420px] overflow-y-auto pr-1">
            {coins.length === 0 && <p className="text-sm text-muted-foreground py-6 text-center">Tranzaksiyalar yöq</p>}
            {coins.map((c) => (
              <div key={c.id} className="flex items-center gap-3 py-2 border-b border-border/30 last:border-0">
                <span className={cn("w-14 text-right font-mono text-sm font-semibold", c.amount >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400")}>{c.amount > 0 ? "+" : ""}{c.amount}</span>
                <p className="flex-1 min-w-0 text-sm truncate">{c.description ?? c.type}</p>
                {c.balance_after != null && <span className="text-[10px] text-muted-foreground font-mono">= {c.balance_after}</span>}
                <span className="text-[10px] text-muted-foreground whitespace-nowrap">{formatDateTime(c.created_at)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <div className="text-center">
      <div className="flex justify-center">{icon}</div>
      <p className="font-bold">{value}</p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}

function Mini({ label, value, cls, hint }: { label: string; value: string; cls?: string; hint?: string }) {
  return (
    <div title={hint}>
      <p className={cn("font-bold font-mono", cls)}>{value}</p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}

function PeriodCard({ title, c }: { title: string; c: { topics: number; quizzes: number; subs: number; solved: number } }) {
  return (
    <div className="glass-card p-5">
      <p className="text-sm font-semibold mb-3">{title}</p>
      <div className="grid grid-cols-2 gap-3">
        {[
          ["Tugatgan mavzu", c.topics, "text-neon-purple"],
          ["Test topşirgan", c.quizzes, "text-neon-blue"],
          ["Topşiriq yuborgan", c.subs, "text-foreground"],
          ["Şundan qabul", c.solved, "text-neon-green"],
        ].map(([l, v, cls]) => (
          <div key={l as string} className="rounded-xl bg-surface/50 px-3 py-2">
            <p className={cn("font-display font-bold text-xl", cls as string)}>{v as number}</p>
            <p className="text-[11px] text-muted-foreground">{l as string}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
