"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "@/components/i18n/Link";
import { createClient } from "@/lib/supabase/client";
import { cn, getInitials, formatRelativeDate } from "@/lib/utils";
import {
  type StudentOverviewRow, type CourseOverviewRow,
  gradeInfo, pctColor, activityState, downloadCsv,
} from "@/lib/student-stats";
import {
  Search, Users, Activity, CalendarDays, TrendingUp, Award, Download,
  Loader2, BookOpen, ChevronRight, X, AlertTriangle,
} from "lucide-react";

/**
 * Talabalar statistikasi: kurslar kesimi + talabalar ro'yxati.
 * Ma'lumot 88-migratsiyadagi RPC lardan (baho va progress bazada hisoblanadi).
 */

type ActFilter = "all" | "today" | "week" | "idle" | "never";
type SortKey = "last" | "progress" | "score" | "xp" | "week" | "name";

const ACT: { k: ActFilter; label: string }[] = [
  { k: "all", label: "Hammasi" },
  { k: "today", label: "Bugun faol" },
  { k: "week", label: "7 kunda faol" },
  { k: "idle", label: "7+ kun faol emas" },
  { k: "never", label: "Boshlamagan" },
];

const SORTS: { k: SortKey; label: string }[] = [
  { k: "last", label: "Oxirgi faollik" },
  { k: "progress", label: "Progress" },
  { k: "score", label: "Reyting bali" },
  { k: "week", label: "Haftalik faollik" },
  { k: "xp", label: "XP" },
  { k: "name", label: "Ism" },
];

const WEEK_MS = 7 * 86400000;

export default function AdminStudentsPage() {
  const supabase = createClient();
  const [courses, setCourses] = useState<CourseOverviewRow[]>([]);
  const [rows, setRows] = useState<StudentOverviewRow[]>([]);
  const [course, setCourse] = useState<string>("");
  const [search, setSearch] = useState("");
  const [act, setAct] = useState<ActFilter>("all");
  const [sort, setSort] = useState<SortKey>("last");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.rpc("admin_courses_overview");
      if (error) setError(error.message);
      else setCourses((data ?? []) as CourseOverviewRow[]);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await supabase.rpc("admin_students_overview", { p_course: course || null });
      if (error) setError(error.message);
      else { setRows((data ?? []) as StudentOverviewRow[]); setError(null); }
      setLoading(false);
    })();
  }, [course]);

  const selectedCourse = courses.find((c) => c.id === course);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const now = Date.now();
    const list = rows.filter((r) => {
      if (q && !r.full_name.toLowerCase().includes(q) && !(r.username ?? "").toLowerCase().includes(q)) return false;
      const last = r.last_activity_at ? Date.parse(r.last_activity_at) : null;
      switch (act) {
        case "today": return r.actions_today > 0 || activityState(r.last_activity_at).label === "Bugun faol";
        case "week": return last !== null && now - last < WEEK_MS;
        case "idle": return last !== null && now - last >= WEEK_MS;
        case "never": return last === null && r.avg_progress === 0;
        default: return true;
      }
    });
    const by = (r: StudentOverviewRow): number | string => {
      switch (sort) {
        case "progress": return r.avg_progress;
        case "score": return r.avg_score ?? -1;
        case "xp": return r.xp;
        case "week": return r.actions_week;
        case "name": return r.full_name.toLowerCase();
        default: return r.last_activity_at ? Date.parse(r.last_activity_at) : 0;
      }
    };
    return list.sort((a, b) => {
      const x = by(a), y = by(b);
      if (typeof x === "string") return x.localeCompare(y as string);
      return (y as number) - (x as number);
    });
  }, [rows, search, act, sort]);

  // Yuqoridagi kartalar — joriy filtr (kurs) bo'yicha
  const now = Date.now();
  const summary = {
    total: rows.length,
    today: rows.filter((r) => r.actions_today > 0 || activityState(r.last_activity_at).label === "Bugun faol").length,
    week: rows.filter((r) => r.last_activity_at && now - Date.parse(r.last_activity_at) < WEEK_MS).length,
    progress: rows.length ? Math.round(rows.reduce((s, r) => s + r.avg_progress, 0) / rows.length) : 0,
    score: (() => {
      const s = rows.filter((r) => r.avg_score != null);
      return s.length ? Math.round(s.reduce((a, r) => a + (r.avg_score ?? 0), 0) / s.length) : null;
    })(),
  };

  function exportCsv() {
    const head = ["Talaba", "Username", ...(course ? ["Joriy mavzu"] : ["Kurslar"]), "Progress %", "Test örtaça %",
      "Yeçilgan topşiriqlar", "Reyting bali", "Baho", "XP", "Coin", "Bugun (hodisa)", "7 kun (hodisa)", "Oxirgi faollik"];
    downloadCsv(
      `talabalar-${selectedCourse?.slug ?? "barcha"}-${new Date().toISOString().slice(0, 10)}.csv`,
      head,
      filtered.map((r) => [
        r.full_name, r.username,
        course ? (r.current_order ? `${r.current_order}/${r.total_topics}. ${r.current_title}` : "Tugatgan") : r.courses_count,
        r.avg_progress, r.quiz_avg, r.tasks_solved, r.avg_score, r.grade, r.xp, r.coins,
        r.actions_today, r.actions_week,
        r.last_activity_at ? new Date(r.last_activity_at).toLocaleString("uz-UZ") : "",
      ]),
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display font-bold text-3xl">Talabalar statistikasi</h1>
          <p className="text-muted-foreground text-sm">Kim qaysi kursda, qayergaça yetdi, bugun va şu hafta nima bajardi, baholari</p>
        </div>
        <button onClick={exportCsv} disabled={!filtered.length}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-card text-sm font-medium hover:bg-accent disabled:opacity-50">
          <Download className="w-4 h-4" /> Excel (CSV)
        </button>
      </div>

      {error && (
        <div className="glass-card p-4 border-l-4 border-l-neon-red text-sm flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-neon-red shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Statistikani yuklab bölmadi</p>
            <p className="text-muted-foreground">{error}</p>
            <p className="text-muted-foreground mt-1">Agar xato funksiya topilmagani haqida bölsa — <code>88_talabalar_statistikasi.sql</code> migratsiyasini Supabase SQL Editor da işga tuşiring.</p>
          </div>
        </div>
      )}

      {/* Umumiy kartalar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: selectedCourse ? "Kursdagi talabalar" : "Talabalar", value: summary.total, icon: Users, color: "#6C5CE7" },
          { label: "Bugun faol", value: summary.today, icon: Activity, color: "#00E676" },
          { label: "7 kunda faol", value: summary.week, icon: CalendarDays, color: "#00D2FF" },
          { label: "Örtaça progress", value: `${summary.progress}%`, icon: TrendingUp, color: "#FFD600" },
          { label: "Örtaça reyting", value: summary.score == null ? "—" : summary.score, icon: Award, color: "#FF6B9D" },
        ].map((c) => (
          <div key={c.label} className="glass-card p-4">
            <c.icon className="w-5 h-5 mb-2" style={{ color: c.color }} />
            <div className="font-display font-bold text-2xl">{c.value}</div>
            <div className="text-xs text-muted-foreground">{c.label}</div>
          </div>
        ))}
      </div>

      {/* Kurslar kesimi */}
      <div className="glass-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border/50 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-neon-purple" />
          <h2 className="font-display font-semibold text-lg">Kurslar böyiça</h2>
          <span className="text-xs text-muted-foreground">— qatorni bossangiz, pastdagi röyxat şu kurs bilan filtrlanadi</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50 text-xs text-muted-foreground">
                <th className="text-left px-5 py-2.5 font-semibold">Kurs</th>
                <th className="px-3 py-2.5 font-semibold">Talabalar</th>
                <th className="px-3 py-2.5 font-semibold">Bugun faol</th>
                <th className="px-3 py-2.5 font-semibold">7 kunda faol</th>
                <th className="px-3 py-2.5 font-semibold">Tugatgan</th>
                <th className="px-3 py-2.5 font-semibold min-w-[140px]">Örtaça progress</th>
                <th className="px-3 py-2.5 font-semibold">Test örtaça</th>
                <th className="px-3 py-2.5 font-semibold">Reyting</th>
              </tr>
            </thead>
            <tbody>
              {courses.filter((c) => c.enrolled > 0 || c.is_published).map((c) => (
                <tr key={c.id} onClick={() => setCourse(course === c.id ? "" : c.id)}
                  className={cn("border-b border-border/30 cursor-pointer hover:bg-surface/40", course === c.id && "bg-neon-purple/10")}>
                  <td className="px-5 py-2.5">
                    <p className="font-medium">{c.title}</p>
                    <p className="text-[11px] text-muted-foreground">{c.total_topics} mavzu{!c.is_published && " · naşr qilinmagan"}</p>
                  </td>
                  <td className="px-3 py-2.5 text-center font-semibold">{c.enrolled}</td>
                  <td className="px-3 py-2.5 text-center">{c.active_today}</td>
                  <td className="px-3 py-2.5 text-center">{c.active_week}</td>
                  <td className="px-3 py-2.5 text-center">{c.completed}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full bg-surface overflow-hidden"><div className="h-full progress-gradient rounded-full" style={{ width: `${c.avg_progress}%` }} /></div>
                      <span className="text-xs font-mono w-9 text-right">{c.avg_progress}%</span>
                    </div>
                  </td>
                  <td className={cn("px-3 py-2.5 text-center font-mono", pctColor(c.avg_quiz))}>{c.avg_quiz == null ? "—" : `${c.avg_quiz}%`}</td>
                  <td className="px-3 py-2.5 text-center font-mono">{c.avg_score ?? "—"}</td>
                </tr>
              ))}
              {courses.length === 0 && !error && (
                <tr><td colSpan={8} className="text-center py-6 text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin inline" /></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Filtrlar */}
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Ism yoki username böyiça qidiriş" className="input-field pl-11" />
        </div>
        <select value={course} onChange={(e) => setCourse(e.target.value)} className="input-field lg:w-72">
          <option value="">Barça kurslar</option>
          {courses.filter((c) => c.enrolled > 0).map((c) => <option key={c.id} value={c.id}>{c.title} ({c.enrolled})</option>)}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="input-field lg:w-52">
          {SORTS.map((s) => <option key={s.k} value={s.k}>Saralaş: {s.label}</option>)}
        </select>
      </div>
      <div className="flex flex-wrap gap-2">
        {ACT.map((a) => (
          <button key={a.k} onClick={() => setAct(a.k)}
            className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
              act === a.k ? "bg-neon-purple/10 text-neon-purple border border-neon-purple/20" : "bg-surface text-muted-foreground")}>
            {a.label}
          </button>
        ))}
        {selectedCourse && (
          <button onClick={() => setCourse("")} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-neon-purple text-white inline-flex items-center gap-1">
            {selectedCourse.title} <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Talabalar jadvali */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50 text-xs text-muted-foreground">
                <th className="text-left px-5 py-3 font-semibold">Talaba</th>
                <th className="text-left px-3 py-3 font-semibold">{course ? "Joriy mavzu" : "Kurslar"}</th>
                <th className="px-3 py-3 font-semibold min-w-[130px]">Progress</th>
                <th className="px-3 py-3 font-semibold">Test</th>
                <th className="px-3 py-3 font-semibold">Topşiriq</th>
                <th className="px-3 py-3 font-semibold">Baho</th>
                <th className="px-3 py-3 font-semibold">XP</th>
                <th className="px-3 py-3 font-semibold">Coin</th>
                <th className="px-3 py-3 font-semibold" title="Tugatilgan mavzular / jami hodisalar (test, topşiriq, mavzu)">Bugun</th>
                <th className="px-3 py-3 font-semibold" title="Oxirgi 7 kun: tugatilgan mavzular / jami hodisalar">7 kun</th>
                <th className="text-left px-3 py-3 font-semibold">Faollik</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={12} className="text-center py-10 text-muted-foreground"><Loader2 className="w-5 h-5 animate-spin inline mr-2" />Yuklanmoqda…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={12} className="text-center py-10 text-muted-foreground">Talaba topilmadi</td></tr>
              ) : filtered.map((r) => {
                const g = gradeInfo(r.grade);
                const a = activityState(r.last_activity_at);
                return (
                  <tr key={r.id} className={cn("border-b border-border/30 hover:bg-surface/30", r.is_blocked && "opacity-50")}>
                    <td className="px-5 py-3">
                      <Link href={`/a-students/${r.id}`} className="flex items-center gap-3 group">
                        <div className="w-9 h-9 rounded-full bg-hero-gradient flex items-center justify-center text-white font-bold text-xs shrink-0 overflow-hidden">
                          {r.avatar_url ? <img src={r.avatar_url} alt="" className="w-full h-full object-cover" /> : getInitials(r.full_name)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium truncate group-hover:text-neon-purple">{r.full_name}</p>
                          {r.username && <p className="text-[11px] text-muted-foreground">@{r.username}</p>}
                        </div>
                      </Link>
                    </td>
                    <td className="px-3 py-3 max-w-[220px]">
                      {course ? (
                        r.current_order ? (
                          <span className="text-xs"><b className="font-mono">{r.current_order}/{r.total_topics}</b> · <span className="text-muted-foreground">{r.current_title}</span></span>
                        ) : <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">Kursni tugatgan</span>
                      ) : (
                        <span className="text-xs">{r.courses_count} ta kurs</span>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 rounded-full bg-surface overflow-hidden"><div className="h-full progress-gradient rounded-full" style={{ width: `${r.avg_progress}%` }} /></div>
                        <span className="text-xs font-mono w-9 text-right">{r.avg_progress}%</span>
                      </div>
                    </td>
                    <td className={cn("px-3 py-3 text-center font-mono text-xs", pctColor(r.quiz_avg))}>{r.quiz_avg == null ? "—" : `${r.quiz_avg}%`}</td>
                    <td className="px-3 py-3 text-center font-mono text-xs">{r.tasks_solved}</td>
                    <td className="px-3 py-3 text-center">
                      <span className={cn("inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap", g.cls)} title={r.avg_score != null ? `Reyting bali: ${r.avg_score}/100` : undefined}>
                        {r.grade ?? "—"}{r.avg_score != null && <span className="font-normal opacity-80">({r.avg_score})</span>}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center font-mono text-xs">{r.xp}</td>
                    <td className="px-3 py-3 text-center font-mono text-xs text-neon-yellow">{r.coins}</td>
                    <td className="px-3 py-3 text-center font-mono text-xs">{r.topics_today}<span className="text-muted-foreground"> / {r.actions_today}</span></td>
                    <td className="px-3 py-3 text-center font-mono text-xs">{r.topics_week}<span className="text-muted-foreground"> / {r.actions_week}</span></td>
                    <td className="px-3 py-3">
                      <span className={cn("text-[11px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap", a.cls)}>{a.label}</span>
                      {r.last_activity_at && <p className="text-[10px] text-muted-foreground mt-0.5">{formatRelativeDate(r.last_activity_at)}</p>}
                    </td>
                    <td className="pr-4">
                      <Link href={`/a-students/${r.id}`} className="p-1.5 rounded-lg hover:bg-accent inline-flex" aria-label="Batafsil"><ChevronRight className="w-4 h-4" /></Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="glass-card p-5 text-xs text-muted-foreground space-y-1.5">
        <p><b className="text-foreground">Reyting bali (0–100)</b> = mavzular progressi 40% + testlar örtaçasi 30% + yeçilgan topşiriqlar 30% (topşiriq bölmagan kursda: progress 55% + testlar 45%). Test bali — har mavzudagi eng yaxşi uriniş.</p>
        <p><b className="text-foreground">Baho</b> (OTM şkalasi): 86–100 → 5, 71–85 → 4, 56–70 → 3, 55 va kam → 2. Bu joriy (oraliq) baho, kurs davomida özgarib boradi.</p>
        <p><b className="text-foreground">Bugun / 7 kun</b>: tugatilgan mavzular / jami hodisalar (test topşiriş, topşiriq yuboriş, mavzu tugatiş). Vaqt — Toşkent böyiça.</p>
      </div>
    </div>
  );
}
