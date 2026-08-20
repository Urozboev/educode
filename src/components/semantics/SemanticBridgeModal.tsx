"use client";

import { useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { useI18n } from "@/lib/i18n";
import { CONCEPT_METAPHORS, KEYWORD_EXPLANATIONS, type ConceptMetaphor } from "@/lib/semantics/analogiesData";
import { explainPythonCode, type LineSemanticExplanation } from "@/lib/semantics/codeExplainer";
import { X, BookOpen, Code2, Sparkles, Search, MessageSquare, Compass, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface SemanticBridgeModalProps {
  open: boolean;
  onClose: () => void;
  currentCode?: string;
}

export default function SemanticBridgeModal({ open, onClose, currentCode = "" }: SemanticBridgeModalProps) {
  const { locale, t } = useI18n();
  const [activeTab, setActiveTab] = useState<"code_explainer" | "metaphors_hub">(
    currentCode.trim().length > 0 ? "code_explainer" : "metaphors_hub"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedMetaphor, setSelectedMetaphor] = useState<ConceptMetaphor | null>(CONCEPT_METAPHORS[0]);

  // Line by line explanation
  const lineExplanations = useMemo(() => explainPythonCode(currentCode), [currentCode]);

  // Filtered metaphors
  const filteredMetaphors = useMemo(() => {
    return CONCEPT_METAPHORS.filter((m) => {
      const matchCat = selectedCategory === "all" || m.category === selectedCategory;
      const titleText = (m.title[locale] || m.title.uz).toLowerCase();
      const analogyText = (m.analogy[locale] || m.analogy.uz).toLowerCase();
      const q = searchQuery.toLowerCase();
      const matchSearch = !q || titleText.includes(q) || analogyText.includes(q);
      return matchCat && matchSearch;
    });
  }, [locale, selectedCategory, searchQuery]);

  // Modal <body> ga portal qilinadi. Bu panel .glass-card ichida
  // ko'rsatiladi, .glass-card da esa backdrop-filter bor — u
  // `position: fixed` uchun yangi konteyner yaratadi va modal
  // ekranni emas, kartaning ichini qoplab qolardi.
  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="w-full max-w-4xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-5 border-b border-border flex items-center justify-between bg-surface/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neon-cyan/20 text-neon-cyan flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg">{t.semanticBridge.title}</h3>
              <p className="text-xs text-muted-foreground">{t.semanticBridge.subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl hover:bg-surface flex items-center justify-center text-muted-foreground hover:text-foreground transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-5 border-b border-border bg-surface/20 flex items-center gap-2">
          <button
            onClick={() => setActiveTab("code_explainer")}
            className={cn(
              "py-3 px-4 text-xs font-semibold border-b-2 transition flex items-center gap-2",
              activeTab === "code_explainer"
                ? "border-neon-purple text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <Code2 className="w-4 h-4" />
            {t.semanticBridge.explainCode}
          </button>
          <button
            onClick={() => setActiveTab("metaphors_hub")}
            className={cn(
              "py-3 px-4 text-xs font-semibold border-b-2 transition flex items-center gap-2",
              activeTab === "metaphors_hub"
                ? "border-neon-purple text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <BookOpen className="w-4 h-4" />
            {t.semanticBridge.metaphorsTitle}
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === "code_explainer" ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">
                  {t.semanticBridge.lineExplanation} ({lineExplanations.length} {t.visualizer.line.toLowerCase()})
                </span>
                <span className="text-[11px] text-neon-purple font-mono bg-neon-purple/10 px-2 py-0.5 rounded border border-neon-purple/20">
                  Ona tilida semantik tahlil
                </span>
              </div>

              {lineExplanations.length > 0 ? (
                <div className="space-y-2.5">
                  {lineExplanations.map((item) => (
                    <div
                      key={item.lineNumber}
                      className="p-3 rounded-xl bg-surface/50 border border-border flex items-start gap-3 hover:border-neon-purple/30 transition"
                    >
                      <span className="font-mono text-xs font-bold text-neon-purple w-7 text-right pt-0.5">
                        {item.lineNumber}.
                      </span>

                      <div className="flex-1 min-w-0 space-y-1">
                        <pre className="font-mono text-xs text-foreground/90 bg-black/30 px-2.5 py-1 rounded-lg inline-block max-w-full overflow-x-auto">
                          {item.rawCode}
                        </pre>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {item.explanation[locale] || item.explanation.uz}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 text-muted-foreground text-xs">
                  {t.semanticBridge.noCode}
                </div>
              )}
            </div>
          ) : (
            /* Metaphors Hub */
            <div className="grid md:grid-cols-12 gap-5 min-h-[420px]">
              {/* Left Metaphors list with search */}
              <div className="md:col-span-5 flex flex-col gap-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t.semanticBridge.searchPlaceholder}
                    className="w-full bg-surface border border-border rounded-xl pl-9 pr-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-purple"
                  />
                </div>

                <div className="space-y-1.5 overflow-y-auto max-h-[380px] pr-1">
                  {filteredMetaphors.map((meta) => {
                    const isSelected = selectedMetaphor?.id === meta.id;
                    return (
                      <button
                        key={meta.id}
                        onClick={() => setSelectedMetaphor(meta)}
                        className={cn(
                          "w-full text-left p-3 rounded-xl border transition flex items-center justify-between text-xs",
                          isSelected
                            ? "bg-neon-purple/15 border-neon-purple text-foreground font-semibold shadow-sm"
                            : "bg-surface/40 border-border text-muted-foreground hover:text-foreground hover:bg-surface"
                        )}
                      >
                        <span className="truncate">{meta.title[locale] || meta.title.uz}</span>
                        <ArrowRight className="w-3.5 h-3.5 opacity-50 flex-shrink-0" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Metaphor Detail Card */}
              <div className="md:col-span-7 p-5 rounded-2xl bg-surface/60 border border-border flex flex-col justify-between overflow-y-auto">
                {selectedMetaphor ? (
                  <div className="space-y-4">
                    <div>
                      <span className="text-[11px] uppercase tracking-wider font-semibold text-neon-cyan px-2 py-0.5 rounded bg-neon-cyan/10">
                        {selectedMetaphor.category}
                      </span>
                      <h4 className="font-display font-bold text-lg mt-2 text-foreground">
                        {selectedMetaphor.title[locale] || selectedMetaphor.title.uz}
                      </h4>
                    </div>

                    {/* Analogy */}
                    <div className="p-3.5 rounded-xl bg-card border border-border space-y-1.5">
                      <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        {t.semanticBridge.analogy}
                      </span>
                      <p className="text-xs text-foreground/90 leading-relaxed">
                        {selectedMetaphor.analogy[locale] || selectedMetaphor.analogy.uz}
                      </p>
                    </div>

                    {/* Code snippet */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-semibold text-muted-foreground">Python namunasi:</span>
                      <pre className="font-mono text-xs p-3 rounded-xl bg-black/40 border border-border text-neon-green/90 whitespace-pre-wrap">
                        {selectedMetaphor.exampleCode}
                      </pre>
                    </div>

                    {/* Key takeaway */}
                    <div className="p-3 rounded-xl bg-neon-purple/10 border border-neon-purple/20 space-y-1 text-xs">
                      <span className="font-semibold text-neon-purple">{t.semanticBridge.keyTakeaway}:</span>
                      <p className="text-muted-foreground leading-relaxed">
                        {selectedMetaphor.keyTakeaway[locale] || selectedMetaphor.keyTakeaway.uz}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16 text-muted-foreground text-xs">
                    Mavzuni tanlang
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>,
    document.body
  );
}
