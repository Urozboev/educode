"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Loader2, FileText, Type } from "lucide-react";

/**
 * Kurs ichida qidiruv.
 *
 * Qidiruv serverda (`search_course_topics`) bajariladi: mavzu matni
 * `topics_toc` ko'rinishida yo'q, chunki u RLS'ni chetlab o'tadi va
 * kontentni unga qo'shish pullik kurs matnini ochib qo'yardi. RPC esa
 * avval ruxsatni tekshiradi — yozilmagan foydalanuvchi faqat
 * sarlavhalar bo'yicha natija oladi.
 */

interface Hit {
  topic_id: string;
  slug: string;
  title: string;
  order_index: number;
  match_in: "title" | "content";
  snippet: string;
}

const DEBOUNCE_MS = 300;

export function CourseSearch({ courseId, courseSlug }: { courseId: string; courseSlug: string }) {
  const supabase = createClient();
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [busy, setBusy] = useState(false);
  const [searched, setSearched] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const run = useCallback(async (query: string) => {
    if (query.trim().length < 2) {
      setHits([]); setSearched(false); setBusy(false);
      return;
    }
    setBusy(true);
    const { data, error } = await supabase.rpc("search_course_topics", {
      p_course_id: courseId,
      p_query: query.trim(),
    });
    setBusy(false);
    setSearched(true);
    setHits(error ? [] : ((data ?? []) as Hit[]));
  }, [supabase, courseId]);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => run(q), DEBOUNCE_MS);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [q, run]);

  /** Topilgan so'zni parcha ichida ajratib ko'rsatish */
  function highlight(text: string) {
    const needle = q.trim();
    if (!needle) return text;
    const i = text.toLowerCase().indexOf(needle.toLowerCase());
    if (i === -1) return text;
    return (
      <>
        {text.slice(0, i)}
        <mark className="bg-neon-yellow/25 text-foreground rounded px-0.5">{text.slice(i, i + needle.length)}</mark>
        {text.slice(i + needle.length)}
      </>
    );
  }

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Kurs ichidan qidirish: mavzu nomi yoki matn..."
          className="input-field w-full text-sm pl-10 pr-10"
          aria-label="Kurs ichida qidirish"
        />
        {busy ? (
          <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground animate-spin" />
        ) : q ? (
          <button
            onClick={() => setQ("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-surface transition"
            aria-label="Tozalash"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        ) : null}
      </div>

      <AnimatePresence>
        {searched && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="mt-3"
          >
            {hits.length === 0 ? (
              <p className="text-sm text-muted-foreground px-1 py-3">
                &quot;{q.trim()}&quot; bo&apos;yicha hech nima topilmadi
              </p>
            ) : (
              <>
                <p className="text-xs text-muted-foreground px-1 mb-2">
                  <span className="numeric">{hits.length}</span> ta natija
                </p>
                <ul className="space-y-1.5">
                  {hits.map(h => (
                    <li key={h.topic_id}>
                      <Link
                        href={`/courses/${courseSlug}/topics/${h.slug}`}
                        className="flex gap-3 p-3 rounded-xl border border-border/60 bg-card/40 hover:border-neon-purple/40 hover:bg-surface/40 transition group"
                      >
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                          h.match_in === "title" ? "bg-neon-purple/10" : "bg-surface"
                        )}>
                          {h.match_in === "title"
                            ? <Type className="w-4 h-4 text-neon-purple" />
                            : <FileText className="w-4 h-4 text-muted-foreground" />}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm group-hover:text-neon-purple transition-colors">
                            {h.match_in === "title" ? highlight(h.title) : h.title}
                          </p>
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5 leading-relaxed">
                            {h.match_in === "content" ? <>…{highlight(h.snippet)}…</> : h.snippet}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
