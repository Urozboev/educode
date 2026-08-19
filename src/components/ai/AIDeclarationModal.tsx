"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

export type DeclarationAnswer = "yes" | "no" | "partial";

export interface AIDeclarationData {
  used_ai: DeclarationAnswer;
  ai_used_for: string[];
  ai_used_for_other: string;
  could_solve_alone: DeclarationAnswer;
  honesty_pledge: boolean;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: AIDeclarationData) => Promise<void> | void;
  submitting?: boolean;
  hint?: { aiUsedToday?: number; pasteDetected?: boolean };
}

export default function AIDeclarationModal({ open, onClose, onConfirm, submitting, hint }: Props) {
  const { t } = useI18n();
  const [usedAI, setUsedAI] = useState<DeclarationAnswer | null>(null);
  const [areas, setAreas] = useState<string[]>([]);
  const [otherText, setOtherText] = useState("");
  const [otherChecked, setOtherChecked] = useState(false);
  const [couldSolve, setCouldSolve] = useState<DeclarationAnswer | null>(null);
  const [pledge, setPledge] = useState(false);

  const AI_AREAS = [
    { id: "algorithm", label: t.aiDeclaration.areas.algorithm },
    { id: "syntax", label: t.aiDeclaration.areas.syntax },
    { id: "debugging", label: t.aiDeclaration.areas.debugging },
    { id: "concept", label: t.aiDeclaration.areas.concept },
  ];

  const valid =
    usedAI !== null &&
    couldSolve !== null &&
    pledge &&
    (usedAI === "no" || areas.length > 0 || otherChecked);

  function toggleArea(id: string) {
    setAreas(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
  }

  async function handleSubmit() {
    if (!valid || !usedAI || !couldSolve) return;
    const finalAreas = otherChecked && otherText.trim() ? [...areas, "other"] : areas;
    await onConfirm({
      used_ai: usedAI,
      ai_used_for: finalAreas,
      ai_used_for_other: otherChecked ? otherText.trim() : "",
      could_solve_alone: couldSolve,
      honesty_pledge: pledge,
    });
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
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-neon-purple/10 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-neon-purple" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-lg">{t.aiDeclaration.title}</h2>
                  <p className="text-xs text-muted-foreground">{t.aiDeclaration.subtitle}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {hint?.aiUsedToday !== undefined && hint.aiUsedToday > 0 && (
              <div className="mb-4 px-3 py-2 rounded-lg bg-neon-blue/5 border border-neon-blue/20 text-[11px] text-muted-foreground">
                ℹ️ {t.aiDeclaration.aiUsedCount.replace("{count}", String(hint.aiUsedToday))}
              </div>
            )}
            {hint?.pasteDetected && (
              <div className="mb-4 px-3 py-2 rounded-lg bg-neon-yellow/5 border border-neon-yellow/20 text-[11px] text-neon-yellow">
                ⚠️ {t.aiDeclaration.pasteWarning}
              </div>
            )}

            {/* 1-savol */}
            <div className="space-y-2 mb-4">
              <p className="text-sm font-medium">
                {t.aiDeclaration.q1}
              </p>
              <div className="flex gap-2">
                {(["yes", "no", "partial"] as DeclarationAnswer[]).map(opt => (
                  <button
                    key={opt}
                    onClick={() => setUsedAI(opt)}
                    className={cn(
                      "flex-1 px-3 py-2 rounded-lg text-sm border transition-all",
                      usedAI === opt
                        ? "bg-neon-purple text-white border-neon-purple"
                        : "bg-surface border-border text-muted-foreground hover:bg-surface-hover",
                    )}
                  >
                    {opt === "yes" ? t.aiDeclaration.yes : opt === "no" ? t.aiDeclaration.no : t.aiDeclaration.partial}
                  </button>
                ))}
              </div>
            </div>

            {/* 2-savol — agar yes/partial */}
            {(usedAI === "yes" || usedAI === "partial") && (
              <div className="space-y-2 mb-4">
                <p className="text-sm font-medium">{t.aiDeclaration.q2}</p>
                <div className="grid grid-cols-2 gap-2">
                  {AI_AREAS.map(a => (
                    <label
                      key={a.id}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer text-sm",
                        areas.includes(a.id)
                          ? "bg-neon-purple/10 border-neon-purple/40 text-foreground"
                          : "bg-surface border-border text-muted-foreground hover:bg-surface-hover",
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={areas.includes(a.id)}
                        onChange={() => toggleArea(a.id)}
                        className="accent-neon-purple"
                      />
                      <span>{a.label}</span>
                    </label>
                  ))}
                  <label className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer text-sm col-span-2",
                    otherChecked
                      ? "bg-neon-purple/10 border-neon-purple/40"
                      : "bg-surface border-border hover:bg-surface-hover",
                  )}>
                    <input
                      type="checkbox"
                      checked={otherChecked}
                      onChange={e => setOtherChecked(e.target.checked)}
                      className="accent-neon-purple"
                    />
                    <span>{t.aiDeclaration.other}</span>
                    <input
                      type="text"
                      value={otherText}
                      onChange={e => setOtherText(e.target.value)}
                      disabled={!otherChecked}
                      placeholder={t.aiDeclaration.otherPh}
                      className="input-field flex-1 py-1 px-2 text-xs"
                    />
                  </label>
                </div>
              </div>
            )}

            {/* 3-savol */}
            <div className="space-y-2 mb-4">
              <p className="text-sm font-medium">{t.aiDeclaration.q3}</p>
              <div className="flex gap-2">
                {(["yes", "no", "partial"] as DeclarationAnswer[]).map(opt => (
                  <button
                    key={opt}
                    onClick={() => setCouldSolve(opt)}
                    className={cn(
                      "flex-1 px-3 py-2 rounded-lg text-sm border transition-all",
                      couldSolve === opt
                        ? "bg-neon-blue text-white border-neon-blue"
                        : "bg-surface border-border text-muted-foreground hover:bg-surface-hover",
                    )}
                  >
                    {opt === "yes" ? t.aiDeclaration.yes : opt === "no" ? t.aiDeclaration.no : t.aiDeclaration.partial}
                  </button>
                ))}
              </div>
            </div>

            {/* Pledge */}
            <label className={cn(
              "flex items-start gap-2 p-3 rounded-lg border cursor-pointer mb-4",
              pledge ? "bg-neon-green/5 border-neon-green/30" : "bg-surface border-border",
            )}>
              <input
                type="checkbox"
                checked={pledge}
                onChange={e => setPledge(e.target.checked)}
                className="accent-neon-green mt-1"
              />
              <span className="text-xs leading-relaxed">
                {t.aiDeclaration.pledge}
              </span>
            </label>

            {/* Actions */}
            <div className="flex gap-2 justify-end">
              <button
                onClick={onClose}
                disabled={submitting}
                className="btn-ghost py-2 px-4 text-sm"
              >
                {t.common.cancel}
              </button>
              <button
                onClick={handleSubmit}
                disabled={!valid || submitting}
                className="btn-primary py-2 px-4 text-sm flex items-center gap-2 disabled:opacity-50"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                {t.aiDeclaration.confirmSubmit}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
