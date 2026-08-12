"use client";

import { useState, useEffect } from "react";
import Link from "@/components/i18n/Link";
import { createClient } from "@/lib/supabase/client";
import { cn, formatDate } from "@/lib/utils";
import { NotebookPen, ChevronDown, ArrowRight } from "lucide-react";

/**
 * Kurs bo'yicha barcha shaxsiy qaydlar bir ro'yxatda.
 *
 * Alohida mavzu sahifasidagi qayd yozish uchun; bu esa takrorlash uchun —
 * imtihon oldidan 14 ta mavzuni birma-bir ochib chiqmaslik kerak.
 * Qayd yo'q bo'lsa blok umuman ko'rinmaydi: bo'sh holat bu yerda foydasiz.
 */

interface NoteRow {
  topic_id: string;
  content: string;
  updated_at: string;
  topic: { slug: string; title: string; order_index: number } | null;
}

export function CourseNotes({ courseId, courseSlug }: { courseId: string; courseSlug: string }) {
  const supabase = createClient();
  const [notes, setNotes] = useState<NoteRow[]>([]);
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoaded(true); return; }
      const { data } = await supabase
        .from("topic_notes")
        .select("topic_id, content, updated_at, topic:topics(slug, title, order_index)")
        .eq("user_id", user.id)
        .eq("course_id", courseId);
      if (!alive) return;
      const rows = ((data ?? []) as any[])
        .filter(r => r.topic)
        .sort((a, b) => (a.topic?.order_index ?? 0) - (b.topic?.order_index ?? 0));
      setNotes(rows);
      setLoaded(true);
    })();
    return () => { alive = false; };
  }, [supabase, courseId]);

  if (!loaded || notes.length === 0) return null;

  return (
    <div className="rounded-2xl border border-border/60 bg-card/40 overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-surface/40 transition"
      >
        <div className="w-9 h-9 rounded-xl bg-neon-yellow/10 flex items-center justify-center flex-shrink-0">
          <NotebookPen className="w-4.5 h-4.5 text-neon-yellow" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm">Qaydlarim</p>
          <p className="text-xs text-muted-foreground">
            <span className="numeric">{notes.length}</span> ta mavzu bo&apos;yicha — takrorlash uchun
          </p>
        </div>
        <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform flex-shrink-0", open && "rotate-180")} />
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-2.5">
          {notes.map(n => (
            <Link
              key={n.topic_id}
              href={`/courses/${courseSlug}/topics/${n.topic!.slug}`}
              className="block p-3.5 rounded-xl border border-border/60 bg-surface/30 hover:border-neon-yellow/40 transition group"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <p className="font-semibold text-sm flex-1 min-w-0 truncate group-hover:text-neon-yellow transition-colors">
                  {n.topic!.title}
                </p>
                <span className="text-[11px] text-muted-foreground flex-shrink-0">{formatDate(n.updated_at)}</span>
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line line-clamp-4">
                {n.content}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
