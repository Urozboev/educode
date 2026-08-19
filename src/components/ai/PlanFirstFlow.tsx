"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Lock, Loader2, Sparkles, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { AILabel } from "@/components/ai/AILabel";
import { useI18n } from "@/lib/i18n";
import type { Dictionary } from "@/lib/i18n/dictionaries/uz";

interface Props {
  taskId: string;
  taskType: "topic_task" | "challenge";
  taskDescription: string;
  onCodeUnlocked: () => void;
  difficulty?: "easy" | "medium" | "hard";
}

type StepKey = "understanding" | "algorithm" | "pseudocode";

interface PlanRow {
  understanding: string;
  algorithm_words: string;
  pseudocode: string;
  code_unlocked: boolean;
  ai_review_understanding?: string;
  ai_review_algorithm?: string;
  ai_review_pseudocode?: string;
}

const STEP_META = (t: Dictionary): Record<StepKey, { idx: number; label: string; helper: string; placeholder: string; min: number }> => ({
  understanding: {
    idx: 1,
    label: "Tushunish",
    helper: t.misc.planWhatToFind,
    placeholder: t.misc.planWhatPh,
    min: 20,
  },
  algorithm: {
    idx: 2,
    label: t.misc.planAlgorithm,
    helper: t.misc.planAlgorithmHint,
    placeholder: "1. ro'yxatdagi har element ko'rib chiqaman\n2. eng katta qiymat va indeksini eslab qolaman\n3. oxirida ikki qiymatni qaytaraman...",
    min: 40,
  },
  pseudocode: {
    idx: 3,
    label: "Pseudo-kod",
    helper: "Endi sintaksis-erkin pseudo-kod yozing.",
    placeholder: "max ← arr[0]\nmax_idx ← 0\nFOR i FROM 1 TO len(arr) DO\n  IF arr[i] > max THEN\n    max ← arr[i]\n    max_idx ← i\nRETURN max, max_idx",
    min: 30,
  },
});

const STEP_ORDER: StepKey[] = ["understanding", "algorithm", "pseudocode"];

export default function PlanFirstFlow({ taskId, taskType, taskDescription, onCodeUnlocked, difficulty }: Props) {
  const { t } = useI18n();
  const supabase = createClient();
  const [row, setRow] = useState<PlanRow | null>(null);
  const [drafts, setDrafts] = useState<Record<StepKey, string>>({
    understanding: "",
    algorithm: "",
    pseudocode: "",
  });
  const [loading, setLoading] = useState<StepKey | null>(null);
  const [aiFeedback, setAiFeedback] = useState<Record<StepKey, { verdict: string; feedback: string; next_question?: string } | null>>({
    understanding: null,
    algorithm: null,
    pseudocode: null,
  });
  const [activeStep, setActiveStep] = useState<StepKey>("understanding");

  // Plan-First majburiymi? medium/hard uchun majburiy.
  const isRequired = difficulty === "medium" || difficulty === "hard";

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from('plan_first_submissions')
        .select('*')
        .eq('user_id', user.id)
        .eq('task_id', taskId)
        .eq('task_type', taskType)
        .maybeSingle();
      if (data) {
        setRow(data as any);
        setDrafts({
          understanding: data.understanding || "",
          algorithm: data.algorithm_words || "",
          pseudocode: data.pseudocode || "",
        });
        // Active step ni topish
        if (!data.understanding) setActiveStep("understanding");
        else if (!data.algorithm_words) setActiveStep("algorithm");
        else if (!data.pseudocode) setActiveStep("pseudocode");
        if (data.code_unlocked) onCodeUnlocked();
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId, taskType]);

  function isStepDone(step: StepKey): boolean {
    if (!row) return false;
    if (step === "understanding") return !!row.understanding;
    if (step === "algorithm") return !!row.algorithm_words;
    if (step === "pseudocode") return !!row.pseudocode;
    return false;
  }

  async function handleSubmitStep(step: StepKey) {
    const value = drafts[step].trim();
    const meta = STEP_META(t)[step];
    if (value.length < meta.min) {
      toast.warning(`Kamida ${meta.min} belgili javob bering.`);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { toast.error("Tizimga kiring"); return; }

    setLoading(step);
    try {
      // 1. AI review
      const reviewRes = await fetch('/api/ai/plan-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step, content: value, task_description: taskDescription, task_id: taskId, task_type: taskType }),
      });
      const review = await reviewRes.json();

      setAiFeedback(prev => ({ ...prev, [step]: review }));

      // 2. AI tasdiqlamasa — saqlamaymiz, talaba qayta yozsin
      if (review.verdict !== 'approved') {
        toast.warning(review.feedback || t.misc.planMoreDetail);
        setLoading(null);
        return;
      }

      // 3. Saqlash (upsert)
      const updateData: any = {
        user_id: user.id,
        task_id: taskId,
        task_type: taskType,
      };
      if (step === "understanding") {
        updateData.understanding = value;
        updateData.ai_review_understanding = review.feedback;
      } else if (step === "algorithm") {
        updateData.algorithm_words = value;
        updateData.ai_review_algorithm = review.feedback;
      } else if (step === "pseudocode") {
        updateData.pseudocode = value;
        updateData.ai_review_pseudocode = review.feedback;
        updateData.code_unlocked = true;
      }

      const { data: upserted, error } = await supabase
        .from('plan_first_submissions')
        .upsert(updateData, { onConflict: 'user_id,task_id,task_type' })
        .select()
        .single();

      if (error) {
        toast.error(error.message);
        setLoading(null);
        return;
      }
      setRow(upserted as any);
      toast.success(`Bosqich ${STEP_META(t)[step].idx} tasdiqlandi ✓`);

      // Keyingi bosqichga avtomatik o'tish
      const idx = STEP_ORDER.indexOf(step);
      if (idx < STEP_ORDER.length - 1) {
        setActiveStep(STEP_ORDER[idx + 1]);
      } else {
        // pseudocode tasdiqlandi → kod ochildi
        onCodeUnlocked();
        toast.success("Endi kod yozish bosqichiga o'tishingiz mumkin! 🎉");
      }
    } catch (e: any) {
      toast.error(e.message);
    }
    setLoading(null);
  }

  const codeUnlocked = !!row?.code_unlocked;

  if (!isRequired && codeUnlocked) {
    // Easy uchun ko'rsatmaymiz
    return null;
  }

  return (
    <div className="glass-card p-4 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-neon-purple" />
        <h3 className="font-semibold text-sm">Plan-First yondashuvi</h3>
        {!isRequired && (
          <span className="text-[10px] text-muted-foreground">{t.misc.optionalRecommended}</span>
        )}
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        {t.misc.planFirstNote}
      </p>

      {/* Steps */}
      <div className="space-y-3">
        {STEP_ORDER.map((step) => {
          const meta = STEP_META(t)[step];
          const idx = meta.idx;
          const done = isStepDone(step);
          const isActive = activeStep === step;
          const isLocked = idx > 1 && !isStepDone(STEP_ORDER[idx - 2]);
          const fb = aiFeedback[step];

          return (
            <div
              key={step}
              className={cn(
                "border rounded-xl overflow-hidden",
                done ? "bg-neon-green/5 border-neon-green/30"
                  : isActive ? "bg-surface border-neon-purple/40"
                  : isLocked ? "bg-surface/30 border-border/50 opacity-60"
                  : "bg-surface/50 border-border",
              )}
            >
              <button
                onClick={() => !isLocked && setActiveStep(step)}
                disabled={isLocked}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-left"
              >
                <span className={cn(
                  "w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0",
                  done ? "bg-neon-green text-background"
                    : isActive ? "bg-neon-purple text-white"
                    : "bg-surface border border-border",
                )}>
                  {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : isLocked ? <Lock className="w-3 h-3" /> : idx}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium">{meta.label}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{meta.helper}</p>
                </div>
                <ChevronRight className={cn("w-3.5 h-3.5 text-muted-foreground transition-transform", isActive && "rotate-90")} />
              </button>

              <AnimatePresence>
                {isActive && !isLocked && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-3 pb-3 space-y-2">
                      <textarea
                        value={drafts[step]}
                        onChange={e => setDrafts(p => ({ ...p, [step]: e.target.value }))}
                        placeholder={meta.placeholder}
                        className="input-field w-full resize-none text-xs font-mono"
                        rows={step === "pseudocode" ? 6 : 3}
                        disabled={done}
                      />
                      {fb && (
                        <div className={cn(
                          "p-2.5 rounded-lg text-xs space-y-1.5",
                          fb.verdict === 'approved' ? "bg-neon-green/5 border border-neon-green/20" :
                          fb.verdict === 'off_track' ? "bg-neon-red/5 border border-neon-red/20" :
                          "bg-neon-yellow/5 border border-neon-yellow/20",
                        )}>
                          <p className="leading-relaxed">{fb.feedback}</p>
                          {fb.next_question && (
                            <p className="italic text-muted-foreground">↪ {fb.next_question}</p>
                          )}
                          <AILabel
                            compact
                            model="claude-sonnet-4"
                            className="mt-1"
                          />
                        </div>
                      )}
                      {!done && (
                        <button
                          onClick={() => handleSubmitStep(step)}
                          disabled={loading === step}
                          className="btn-primary py-1.5 px-3 text-xs flex items-center gap-1.5 disabled:opacity-50"
                        >
                          {loading === step ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                          AI ga tasdiqlatish
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        {/* Code unlock indicator */}
        <div
          className={cn(
            "border rounded-xl px-3 py-2.5 flex items-center gap-2 text-xs",
            codeUnlocked ? "bg-neon-green/5 border-neon-green/30 text-neon-green" : "bg-surface/30 border-border/50 text-muted-foreground",
          )}
        >
          {codeUnlocked ? <CheckCircle2 className="w-4 h-4" /> : <Lock className="w-3.5 h-3.5" />}
          <span className="font-medium">
            {codeUnlocked ? "Kod yozish bosqichi ochildi!" : t.misc.planCodeLast}
          </span>
        </div>
      </div>
    </div>
  );
}
