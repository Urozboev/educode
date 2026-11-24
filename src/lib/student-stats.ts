/**
 * Talabalar statistikasi (admin): 88-migratsiyadagi RPC lar qaytaradigan
 * qatorlar va ularni ko'rsatish yordamchilari.
 *
 * Baho formulasi bazada (student_course_stats) — bu yerda faqat ko'rinish.
 */

export interface StudentOverviewRow {
  id: string;
  full_name: string;
  username: string | null;
  avatar_url: string | null;
  xp: number;
  coins: number;
  streak_days: number;
  is_blocked: boolean;
  created_at: string;
  courses_count: number;
  avg_progress: number;
  avg_score: number | null;
  grade: number | null;
  quiz_avg: number | null;
  tasks_solved: number;
  /** Faqat bitta kurs tanlanganda */
  current_order: number | null;
  current_title: string | null;
  total_topics: number | null;
  topics_today: number;
  topics_week: number;
  actions_today: number;
  actions_week: number;
  last_activity_at: string | null;
}

export interface CourseOverviewRow {
  id: string;
  title: string;
  slug: string;
  is_published: boolean;
  total_topics: number;
  enrolled: number;
  active_today: number;
  active_week: number;
  completed: number;
  avg_progress: number;
  avg_score: number | null;
  avg_quiz: number | null;
}

export interface StudentCourseStat {
  user_id: string;
  course_id: string;
  course_title: string;
  course_slug: string;
  enrolled_at: string;
  is_completed: boolean;
  total_topics: number;
  topics_done: number;
  progress: number;
  /** Tugatilmagan birinchi mavzu; hammasi tugagan bo'lsa null */
  current_order: number | null;
  current_title: string | null;
  current_slug: string | null;
  quiz_avg: number | null;
  quizzes_taken: number;
  tasks_total: number;
  tasks_solved: number;
  last_activity_at: string | null;
  score: number;
  grade: number;
}

/** 5 ballik baho rangi va nomi (OTM shkalasi) */
export function gradeInfo(grade: number | null | undefined) {
  switch (grade) {
    case 5: return { label: "A'lo", cls: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" };
    case 4: return { label: "Yaxshi", cls: "bg-sky-500/15 text-sky-600 dark:text-sky-400" };
    case 3: return { label: "Qoniqarli", cls: "bg-amber-500/15 text-amber-600 dark:text-amber-400" };
    case 2: return { label: "Qoniqarsiz", cls: "bg-rose-500/15 text-rose-600 dark:text-rose-400" };
    default: return { label: "—", cls: "bg-surface text-muted-foreground" };
  }
}

/** Foizga qarab rang: test va progress ustunlari uchun */
export function pctColor(p: number | null | undefined) {
  if (p == null) return "text-muted-foreground";
  if (p >= 86) return "text-emerald-600 dark:text-emerald-400";
  if (p >= 56) return "text-amber-600 dark:text-amber-400";
  return "text-rose-600 dark:text-rose-400";
}

/** Toshkent vaqti bo'yicha kun kaliti: "2026-11-24" */
export function dayKey(d: Date | string) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Tashkent" }).format(new Date(d));
}

/** Faollik holati: bugun / shu hafta / uzoq vaqt */
export function activityState(iso: string | null) {
  if (!iso) return { label: "Hali boshlamagan", cls: "bg-surface text-muted-foreground" };
  const today = dayKey(new Date());
  const k = dayKey(iso);
  if (k === today) return { label: "Bugun faol", cls: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" };
  const days = Math.round((Date.parse(today) - Date.parse(k)) / 86400000);
  if (days < 7) return { label: `${days} kun oldin`, cls: "bg-sky-500/15 text-sky-600 dark:text-sky-400" };
  return { label: `${days} kun faol emas`, cls: "bg-rose-500/15 text-rose-600 dark:text-rose-400" };
}

/** Jadvalni CSV qilib yuklab berish (Excel o'zbekcha harflarni to'g'ri ochishi uchun BOM bilan) */
export function downloadCsv(filename: string, head: string[], rows: (string | number | null)[][]) {
  const esc = (v: string | number | null) => {
    const s = v == null ? "" : String(v);
    return /[",;\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = "﻿" + [head, ...rows].map((r) => r.map(esc).join(";")).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
