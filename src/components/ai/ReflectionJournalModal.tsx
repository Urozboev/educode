"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, X, Loader2, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

export interface ReflectionEntry {
  what_learned: string;
  ai_usage_reflection: string;
  difficulties: string;
  next_steps: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  topicId?: string;
  courseId?: string;
  topicTitle?: string;
  onSaved?: (entry: ReflectionEntry) => void;
}

export default function ReflectionJournalModal({
  open, onClose, topicId, courseId, topicTitle, onSaved,
}: Props) {
  const { t } = useI18n();
  const supabase = createClient();
  const [entry, setEntry] = useState<ReflectionEntry>({
    what_learned: "",
    ai_usage_reflection: "",
    difficulties: "",
    next_steps: "",
  });
  const [saving, setSaving] = useState(false);

  const isFilled = entry.what_learned.trim().length >= 10;

  async function handleSave() {
    if (!isFilled) {
      toast.warning(t.reflection.minLenError);
      return;
    }
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { toast.error(t.nav.login); setSaving(false); return; }
      const { error } = await supabase.from("reflection_journals").insert({
        user_id: user.id,
        topic_id: topicId || null,
        course_id: courseId || null,
        what_learned: entry.what_learned.trim(),
        ai_usage_reflection: entry.ai_usage_reflection.trim() || null,
        difficulties: entry.difficulties.trim() || null,
        next_steps: entry.next_steps.trim() || null,
      });
      if (error) { toast.error(error.message); setSaving(false); return; }
      toast.success(t.reflection.savedToast);
      onSaved?.(entry);
      onClose();
    } catch (e: any) {
      toast.error(e.message);
    }
    setSaving(false);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="glass-card max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-neon-green/10 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-neon-green" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-lg">{t.reflection.title}</h2>
                  <p className="text-xs text-muted-foreground">
                    {topicTitle ? `"${topicTitle}" — ` : ""}{t.reflection.subtitle}
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-foreground mb-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-neon-yellow" /> {t.reflection.q1}
                </label>
                <textarea
                  value={entry.what_learned}
                  onChange={e => setEntry(p => ({ ...p, what_learned: e.target.value }))}
                  placeholder={t.reflection.ph1}
                  className="input-field w-full resize-none text-sm"
                  rows={2}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">
                  {t.reflection.q2}
                </label>
                <textarea
                  value={entry.ai_usage_reflection}
                  onChange={e => setEntry(p => ({ ...p, ai_usage_reflection: e.target.value }))}
                  placeholder={t.reflection.ph2}
                  className="input-field w-full resize-none text-sm"
                  rows={2}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">
                  {t.reflection.q3}
                </label>
                <textarea
                  value={entry.difficulties}
                  onChange={e => setEntry(p => ({ ...p, difficulties: e.target.value }))}
                  placeholder={t.reflection.ph3}
                  className="input-field w-full resize-none text-sm"
                  rows={2}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">
                  {t.reflection.q4}
                </label>
                <textarea
                  value={entry.next_steps}
                  onChange={e => setEntry(p => ({ ...p, next_steps: e.target.value }))}
                  placeholder={t.reflection.ph4}
                  className="input-field w-full resize-none text-sm"
                  rows={2}
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end mt-4">
              <button onClick={onClose} disabled={saving} className="btn-ghost py-2 px-4 text-sm">
                {t.reflection.later}
              </button>
              <button
                onClick={handleSave}
                disabled={!isFilled || saving}
                className="btn-primary py-2 px-4 text-sm flex items-center gap-2 disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <BookOpen className="w-4 h-4" />}
                {t.common.save}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
