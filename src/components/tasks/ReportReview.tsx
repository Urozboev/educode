"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getCurrentUser } from "@/lib/supabase/user";
import { cn, formatDateTime, getInitials } from "@/lib/utils";
import { toast } from "sonner";
import {
  CheckCircle2, Clock, AlertTriangle, Loader2, X, FileCheck2, RotateCcw, Users,
} from "lucide-react";

const BUCKET = "task-reports";

type Status = "pending" | "accepted" | "wrong_answer";

interface Row {
  id: string;
  user_id: string;
  task_id: string;
  status: Status;
  code: string;
  attachments: string[] | null;
  test_results: { step: string; done: boolean }[] | null;
  review_note: string | null;
  reviewed_at: string | null;
  created_at: string;
  // qo'shimcha
  student?: { full_name: string | null; avatar_url: string | null };
  task?: { title: string; topic_title: string; course_title: string };
  urls?: string[];
}

/**
 * Amaliy ish hisobotlarini tekshirish (o'qituvchi va admin).
 *
 * Bir talaba bir topshiriqqa bir necha marta yuborishi mumkin —
 * navbatda faqat ENG SO'NGGI varianti ko'rsatiladi, eskilari
 * tekshirishni talab qilmaydi.
 *
 * Holat o'zgarishi `review_report_submission` RPC orqali: submissions
 * jadvalida UPDATE ruxsati yo'q, talaba natijasini o'zi o'zgartira
 * olmasligi uchun.
 */
export default function ReportReview({ mode }: { mode: "admin" | "teacher" }) {
  const supabase = createClient();
  const [filter, setFilter] = useState<"pending" | "all">("pending");
  const [onlyMine, setOnlyMine] = useState(mode === "teacher");
  const [myStudents, setMyStudents] = useState<string[] | null>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [acting, setActing] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);

  // O'qituvchining talabalari (guruhlardagi)
  useEffect(() => {
    if (mode !== "teacher") return;
    (async () => {
      const user = await getCurrentUser(supabase);
      if (!user) return;
      const { data } = await supabase.from("teacher_students").select("student_id").eq("teacher_id", user.id);
      const ids = (data ?? []).map((d) => d.student_id as string);
      setMyStudents(ids);
      // Hali talaba biriktirilmagan bo'lsa — hammasini ko'rsatamiz
      if (ids.length === 0) setOnlyMine(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const load = useCallback(async () => {
    if (mode === "teacher" && onlyMine && myStudents === null) return;
    setLoading(true);

    let q = supabase
      .from("submissions")
      .select("id, user_id, task_id, status, code, attachments, test_results, review_note, reviewed_at, created_at")
      .eq("language", "report")
      .order("created_at", { ascending: false })
      .limit(filter === "pending" ? 200 : 100);
    if (onlyMine && myStudents && myStudents.length > 0) q = q.in("user_id", myStudents);

    const { data, error } = await q;
    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    // Har talaba + topshiriq juftligidan faqat eng so'nggisi
    const seen = new Set<string>();
    let list = ((data ?? []) as Row[]).filter((r) => {
      const k = `${r.user_id}:${r.task_id}`;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
    if (filter === "pending") list = list.filter((r) => r.status === "pending");

    // Topshiriq → mavzu → kurs nomlari
    const taskIds = Array.from(new Set(list.map((r) => r.task_id)));
    const userIds = Array.from(new Set(list.map((r) => r.user_id)));
    const [{ data: tasks }, { data: profiles }] = await Promise.all([
      taskIds.length
        ? supabase.from("topic_tasks").select("id, title, topic_id").in("id", taskIds)
        : Promise.resolve({ data: [] as { id: string; title: string; topic_id: string }[] }),
      userIds.length
        ? supabase.from("profiles").select("id, full_name, avatar_url").in("id", userIds)
        : Promise.resolve({ data: [] as { id: string; full_name: string | null; avatar_url: string | null }[] }),
    ]);
    const topicIds = Array.from(new Set((tasks ?? []).map((t) => t.topic_id)));
    const { data: topics } = topicIds.length
      ? await supabase.from("topics").select("id, title, course_id").in("id", topicIds)
      : { data: [] as { id: string; title: string; course_id: string }[] };
    const courseIds = Array.from(new Set((topics ?? []).map((t) => t.course_id)));
    const { data: courses } = courseIds.length
      ? await supabase.from("courses").select("id, title").in("id", courseIds)
      : { data: [] as { id: string; title: string }[] };

    // Rasmlar uchun imzolangan havolalar — bitta so'rovda
    const allPaths = list.flatMap((r) => r.attachments ?? []);
    const urlByPath = new Map<string, string>();
    if (allPaths.length) {
      const { data: signed } = await supabase.storage.from(BUCKET).createSignedUrls(allPaths, 3600);
      (signed ?? []).forEach((s) => { if (s.path && s.signedUrl) urlByPath.set(s.path, s.signedUrl); });
    }

    setRows(list.map((r) => {
      const task = tasks?.find((t) => t.id === r.task_id);
      const topic = topics?.find((t) => t.id === task?.topic_id);
      const course = courses?.find((c) => c.id === topic?.course_id);
      const p = profiles?.find((x) => x.id === r.user_id);
      return {
        ...r,
        student: { full_name: p?.full_name ?? null, avatar_url: p?.avatar_url ?? null },
        task: { title: task?.title ?? "—", topic_title: topic?.title ?? "—", course_title: course?.title ?? "—" },
        urls: (r.attachments ?? []).map((path) => urlByPath.get(path)).filter(Boolean) as string[],
      };
    }));
    setLoading(false);
  }, [supabase, filter, onlyMine, myStudents, mode]);

  useEffect(() => { load(); }, [load]);

  async function review(id: string, accept: boolean) {
    const note = (notes[id] ?? "").trim();
    if (!accept && !note) {
      toast.error("Qaytarishda talabaga nimani tuzatish kerakligini yozing");
      return;
    }
    setActing(id);
    const { data, error } = await supabase.rpc("review_report_submission", {
      p_submission_id: id, p_accept: accept, p_note: note || null,
    });
    setActing(null);
    if (error) { toast.error(error.message); return; }
    if (!data?.ok) { toast.error(data?.error || "Xatolik"); return; }
    toast.success(data.message);
    if (filter === "pending") {
      setRows((prev) => prev.filter((r) => r.id !== id));
    } else {
      load();
    }
  }

  const pendingCount = useMemo(() => rows.filter((r) => r.status === "pending").length, [rows]);

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl mb-1 flex items-center gap-3">
            <FileCheck2 className="w-7 h-7 text-neon-purple" /> Hisobotlar
          </h1>
          <p className="text-muted-foreground text-sm max-w-xl">
            Talabalar laboratoriya va amaliy ishlar bo&apos;yicha yuborgan skrinshot va xulosalar. Qabul qiling yoki nimani tuzatish kerakligini yozib qaytaring.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(["pending", "all"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium border transition-all",
                filter === f ? "bg-neon-purple/10 text-neon-purple border-neon-purple/30" : "bg-surface border-border text-muted-foreground",
              )}
            >
              {f === "pending" ? `Kutilmoqda${filter === "pending" && !loading ? ` (${pendingCount})` : ""}` : "Barchasi"}
            </button>
          ))}
          {mode === "teacher" && myStudents && myStudents.length > 0 && (
            <button
              onClick={() => setOnlyMine((v) => !v)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium border transition-all flex items-center gap-2",
                onlyMine ? "bg-neon-blue/10 text-neon-blue border-neon-blue/30" : "bg-surface border-border text-muted-foreground",
              )}
            >
              <Users className="w-4 h-4" /> Faqat mening talabalarim
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">{[1, 2].map((i) => <div key={i} className="glass-card h-56 animate-pulse" />)}</div>
      ) : rows.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <CheckCircle2 className="w-12 h-12 text-neon-green/40 mx-auto mb-3" />
          <p className="text-muted-foreground">
            {filter === "pending" ? "Tekshiruvni kutayotgan hisobot yo'q." : "Hali hisobot yuborilmagan."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {rows.map((r) => (
            <article key={r.id} className="glass-card p-5 space-y-4">
              <header className="flex flex-wrap items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-neon-purple/15 text-neon-purple font-bold text-sm flex items-center justify-center shrink-0 overflow-hidden">
                  {r.student?.avatar_url
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={r.student.avatar_url} alt="" className="w-full h-full object-cover" />
                    : getInitials(r.student?.full_name || "?")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">{r.student?.full_name || "Talaba"}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {r.task?.course_title} › {r.task?.topic_title}
                  </p>
                  <p className="text-sm font-medium mt-0.5">{r.task?.title}</p>
                </div>
                <div className="text-right shrink-0">
                  {r.status === "pending" && <span className="inline-flex items-center gap-1 text-xs text-amber-500"><Clock className="w-3.5 h-3.5" /> Kutilmoqda</span>}
                  {r.status === "accepted" && <span className="inline-flex items-center gap-1 text-xs text-neon-green"><CheckCircle2 className="w-3.5 h-3.5" /> Qabul qilingan</span>}
                  {r.status === "wrong_answer" && <span className="inline-flex items-center gap-1 text-xs text-neon-red"><AlertTriangle className="w-3.5 h-3.5" /> Qaytarilgan</span>}
                  <p className="text-[11px] text-muted-foreground mt-1">{formatDateTime(r.created_at)}</p>
                </div>
              </header>

              {r.urls && r.urls.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {r.urls.map((u, i) => (
                    <button key={i} type="button" onClick={() => setLightbox(u)} className="block rounded-xl overflow-hidden border border-border hover:border-neon-purple/50 transition-colors">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={u} alt={`Skrinshot ${i + 1}`} className="h-32 w-auto max-w-[240px] object-cover" />
                    </button>
                  ))}
                </div>
              )}

              <p className="text-sm leading-relaxed whitespace-pre-line rounded-xl bg-surface/50 px-4 py-3">{r.code}</p>

              {r.test_results && r.test_results.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  Belgilangan qadamlar: {r.test_results.filter((s) => s.done).length}/{r.test_results.length}
                </p>
              )}

              {r.status === "pending" ? (
                <div className="space-y-2">
                  <textarea
                    value={notes[r.id] ?? ""}
                    onChange={(e) => setNotes((n) => ({ ...n, [r.id]: e.target.value }))}
                    rows={2}
                    className="input-field text-sm resize-y"
                    placeholder="Izoh (qaytarishda majburiy): nimani qayta bajarish kerak?"
                  />
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => review(r.id, true)}
                      disabled={acting === r.id}
                      className="btn-primary py-2 px-4 text-sm flex items-center gap-2 disabled:opacity-50"
                    >
                      {acting === r.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                      Qabul qilish
                    </button>
                    <button
                      onClick={() => review(r.id, false)}
                      disabled={acting === r.id}
                      className="btn-ghost py-2 px-4 text-sm flex items-center gap-2 text-neon-red disabled:opacity-50"
                    >
                      <RotateCcw className="w-4 h-4" /> Qaytarish
                    </button>
                  </div>
                </div>
              ) : r.review_note ? (
                <p className="text-xs text-muted-foreground">
                  <span className="font-semibold">Izoh:</span> {r.review_note}
                  {r.reviewed_at && <> · {formatDateTime(r.reviewed_at)}</>}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      )}

      {lightbox && (
        <div
          className="fixed inset-0 z-[60] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Skrinshot"
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            aria-label="Yopish"
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20"
          >
            <X className="w-5 h-5" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={lightbox} alt="Skrinshot" className="max-w-full max-h-full rounded-lg shadow-2xl" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}
