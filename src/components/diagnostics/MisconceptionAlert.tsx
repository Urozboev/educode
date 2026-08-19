"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import type { MisconceptionRule } from "@/lib/diagnostics/misconceptionEngine";
import { Lightbulb, ChevronDown, ChevronUp, AlertCircle, CheckCircle2, HelpCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MisconceptionAlertProps {
  rule: MisconceptionRule;
  onClose?: () => void;
}

export default function MisconceptionAlert({ rule, onClose }: MisconceptionAlertProps) {
  const { locale, t } = useI18n();
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.98 }}
      className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-foreground relative overflow-hidden shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Lightbulb className="w-4 h-4" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-400">
                {t.misconceptions.detected}
              </span>
              <h4 className="font-semibold text-sm truncate text-amber-300">
                {rule.title[locale] || rule.title.uz}
              </h4>
            </div>

            {/* Socratic Scaffolding Prompt */}
            <p className="text-xs text-muted-foreground leading-relaxed">
              {rule.socraticHint[locale] || rule.socraticHint.uz}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface transition text-xs flex items-center gap-1 border border-border"
          >
            <span>{expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface transition"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-3 pt-3 border-t border-amber-500/20 space-y-3 text-xs"
          >
            <div>
              <span className="font-medium text-amber-400 flex items-center gap-1.5 mb-1">
                <HelpCircle className="w-3.5 h-3.5" />
                {t.misconceptions.whyItHappens}
              </span>
              <p className="text-muted-foreground leading-relaxed">
                {rule.whyItHappens[locale] || rule.whyItHappens.uz}
              </p>
            </div>

            <div>
              <span className="font-medium text-neon-green flex items-center gap-1.5 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {t.misconceptions.howToFix}
              </span>
              <p className="text-muted-foreground leading-relaxed mb-2">
                {rule.howToFix[locale] || rule.howToFix.uz}
              </p>

              <div className="grid sm:grid-cols-2 gap-2 mt-2">
                <div className="p-2.5 rounded-lg bg-black/40 border border-red-500/30">
                  <div className="text-[11px] text-red-400 font-mono mb-1 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Noto&apos;g&apos;ri yondashuv:
                  </div>
                  <pre className="font-mono text-[11px] text-red-200/90 overflow-x-auto whitespace-pre-wrap">
                    {rule.badExample}
                  </pre>
                </div>

                <div className="p-2.5 rounded-lg bg-black/40 border border-neon-green/30">
                  <div className="text-[11px] text-neon-green font-mono mb-1 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Tavsiya qilingan yondashuv:
                  </div>
                  <pre className="font-mono text-[11px] text-neon-green/90 overflow-x-auto whitespace-pre-wrap">
                    {rule.goodExample}
                  </pre>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
