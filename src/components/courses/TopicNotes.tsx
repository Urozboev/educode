"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { NotebookPen, Check, Loader2, ChevronDown, Trash2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";

/**
 * Mavzu bo'yicha shaxsiy qayd.
 *
 * Avtomatik saqlanadi: "Saqlash" tugmasini bosishni unutish — dars
 * o'qiyotgan odam uchun eng tabiiy xato. Yozish to'xtagach 1.2 soniyada
 * jo'natiladi, sahifadan chiqishda esa kutilmayotgan o'zgarish qolsa
 * darhol yuboriladi.
 *
 * Qaydni faqat egasi ko'radi (RLS). O'qituvchi ham, admin ham ko'ra olmaydi.
 */

const AUTOSAVE_MS = 1200;

export function TopicNotes({ topicId }: { topicId: string }) {
  const { t } = useI18n();
  const supabase = createClient();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [state, setState] = useState<"idle" | "saving" | "saved">("idle");

  /** Oxirgi saqlangan matn — o'zgarmagan bo'lsa so'rov yubormaymiz */
  const savedRef = useRef("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoaded(true); return; }
      const { data } = await supabase
        .from("topic_notes")
        .select("content")
        .eq("topic_id", topicId)
        .eq("user_id", user.id)
        .maybeSingle();
      if (!alive) return;
      const c = data?.content ?? "";
      setValue(c);
      savedRef.current = c;
      // Qayd bor bo'lsa panel ochiq holda ochiladi — talaba uni qidirmasin
      if (c) setOpen(true);
      setLoaded(true);
    })();
    return () => { alive = false; };
  }, [supabase, topicId]);

  const save = useCallback(async (text: string) => {
    if (text === savedRef.current) return;
    setState("saving");
    const { data, error } = await supabase.rpc("save_topic_note", {
      p_topic_id: topicId,
      p_content: text,
    });
    if (error || !data?.ok) { setState("idle"); return; }
    savedRef.current = text;
    setState("saved");
    setTimeout(() => setState(s => (s === "saved" ? "idle" : s)), 1800);
  }, [supabase, topicId]);

  function onChange(text: string) {
    setValue(text);
    setState("idle");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => save(text), AUTOSAVE_MS);
  }

  // Sahifadan chiqishda saqlanmagan o'zgarishni yuboramiz
  const valueRef = useRef(value);
  valueRef.current = value;
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
    if (valueRef.current !== savedRef.current) save(valueRef.current);
  }, [save]);

  async function clearNote() {
    if (!confirm("Qaydni o'chirasizmi?")) return;
    if (timer.current) clearTimeout(timer.current);
    setValue("");
    await save("");
  }

  if (!loaded) return null;

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
          <p className="font-semibold text-sm">{t.courses.myNotes}</p>
          <p className="text-xs text-muted-foreground truncate">
            {value
              ? value.replace(/\s+/g, " ").slice(0, 70) + (value.length > 70 ? "…" : "")
              : t.courses.notePlaceholder}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {state === "saving" && (
            <motion.span key="s" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-xs text-muted-foreground inline-flex items-center gap-1.5 flex-shrink-0">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> {t.courses.saving}
            </motion.span>
          )}
          {state === "saved" && (
            <motion.span key="d" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-xs text-neon-green inline-flex items-center gap-1.5 flex-shrink-0">
              <Check className="w-3.5 h-3.5" /> {t.courses.savedShort}
            </motion.span>
          )}
        </AnimatePresence>

        <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform flex-shrink-0", open && "rotate-180")} />
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-2">
          <textarea
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={
              "Bu yerga o'zingiz uchun yozing: tushunmagan joy, misol, formula...\n\nO'zgarishlar avtomatik saqlanadi."
            }
            className="input-field w-full text-sm min-h-[160px] resize-y leading-relaxed font-mono"
            spellCheck={false}
          />
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] text-muted-foreground">
              {t.courses.notePrivate} <span className="numeric">{value.length}</span>/20000
            </p>
            {value && (
              <button
                onClick={clearNote}
                className="text-xs text-muted-foreground hover:text-neon-red transition inline-flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" /> O&apos;chirish
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
