"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useI18n } from "@/lib/i18n";
import { withTranslations } from "@/lib/i18n/content";
import type { GlossaryTerm } from "@/types";
import { motion } from "framer-motion";
import { cn, getCategoryLabel } from "@/lib/utils";
import { CategoryIcon } from "@/components/icons/CategoryIcon";
import { LevelBadge } from "@/components/ui/LevelBadge";
import {
  BookMarked, Search, Layers, List, Shuffle, RotateCcw,
  ChevronLeft, ChevronRight, Check, X as XIcon,
} from "lucide-react";

const CATEGORIES = [
  { value: "all", label: "Barchasi" },
  { value: "programming", label: "Dasturlash" },
  { value: "frontend", label: "Frontend" },
  { value: "computer_literacy", label: "Kompyuter" },
  { value: "algorithms", label: "Algoritmlar" },
];

type Mode = "list" | "cards";

export function GlossaryView() {
  const supabase = createClient();
  const [terms, setTerms] = useState<GlossaryTerm[]>([]);
  const [loading, setLoading] = useState(true);
  const { locale, t } = useI18n();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [mode, setMode] = useState<Mode>("list");

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("glossary_terms")
        .select("*")
        .eq("is_published", true)
        .order("term");
      if (data) setTerms(await withTranslations(supabase, "glossary_terms", data as GlossaryTerm[], locale));
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  const filtered = useMemo(() => terms.filter(t =>
    (category === "all" || t.category === category) &&
    (t.term.toLowerCase().includes(search.toLowerCase()) ||
      t.term_en?.toLowerCase().includes(search.toLowerCase()) ||
      t.definition.toLowerCase().includes(search.toLowerCase()))
  ), [terms, search, category]);

  /** Alifbo bo'yicha guruhlash — ro'yxat rejimida navigatsiyani osonlashtiradi */
  const grouped = useMemo<[string, GlossaryTerm[]][]>(() => {
    const map: Record<string, GlossaryTerm[]> = {};
    filtered.forEach(t => {
      const letter = t.term.charAt(0).toUpperCase();
      (map[letter] ||= []).push(t);
    });
    return Object.entries(map).sort((a, b) => a[0].localeCompare(b[0], "uz"));
  }, [filtered]);

  return (
    <div className="space-y-8 md:space-y-10">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
        <p className="eyebrow mb-3">{t.explore.glossaryEyebrow}</p>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight mb-3">
          Terminlar
        </h1>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
          {t.misc.glossarySubtitle}
        </p>
      </motion.div>

      {/* Rejim almashtirgich */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-xl border border-border p-1 bg-surface/40">
          <button
            onClick={() => setMode("list")}
            className={cn(
              "inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all",
              mode === "list" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <List className="w-4 h-4" /> Ro&apos;yxat
          </button>
          <button
            onClick={() => setMode("cards")}
            className={cn(
              "inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all",
              mode === "cards" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Layers className="w-4 h-4" /> Kartochkalar
          </button>
        </div>
        <span className="text-sm text-muted-foreground">{filtered.length} ta termin</span>
      </div>

      {/* Qidiruv va filtr */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t.explore.glossarySearch}
            className="w-full bg-surface/60 border border-border rounded-2xl pl-12 pr-4 py-3.5 text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-neon-purple/40 focus:border-neon-purple/40 transition-all"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
          {CATEGORIES.map(c => (
            <button
              key={c.value}
              onClick={() => setCategory(c.value)}
              className={cn(
                "inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap flex-shrink-0 border",
                category === c.value
                  ? "bg-foreground text-background border-foreground"
                  : "bg-surface/40 text-muted-foreground border-border/50 hover:border-border hover:text-foreground"
              )}
            >
              <CategoryIcon category={c.value} size={17} /> {c.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-20 rounded-xl border border-border/40 bg-card/30 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center">
          <BookMarked className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-base text-muted-foreground">
            {terms.length === 0 ? "Terminlar tez orada qo'shiladi" : t.misc.noResults}
          </p>
        </div>
      ) : mode === "cards" ? (
        <FlashcardDeck terms={filtered} />
      ) : (
        <div className="space-y-8">
          {grouped.map(([letter, items]) => (
            <section key={letter}>
              <h2 className="numeric text-2xl text-muted-foreground/40 mb-3">{letter}</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {items.map(t => (
                  <article key={t.id} className="p-4 rounded-xl border border-border/50 bg-card/40">
                    <div className="flex items-start justify-between gap-3 mb-1.5">
                      <div className="min-w-0">
                        <h3 className="font-display font-bold">{t.term}</h3>
                        {t.term_en && (
                          <p className="font-mono text-[11px] text-muted-foreground mt-0.5">{t.term_en}</p>
                        )}
                      </div>
                      <LevelBadge difficulty={t.difficulty} className="flex-shrink-0" />
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{t.definition}</p>
                    {t.example && (
                      <pre className="mt-3 p-2.5 rounded-lg bg-surface text-xs overflow-x-auto">{t.example}</pre>
                    )}
                    <p className="text-[11px] text-muted-foreground/70 mt-3">{getCategoryLabel(t.category)}</p>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   FLASH-CARD REJIMI
   Natijalar faqat brauzerda saqlanadi — login talab qilinmaydi.
   ============================================================ */

function FlashcardDeck({ terms }: { terms: GlossaryTerm[] }) {
  const { t } = useI18n();
  const [order, setOrder] = useState<number[]>(() => terms.map((_, i) => i));
  const [pos, setPos] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<Set<string>>(new Set());
  const [unknown, setUnknown] = useState<Set<string>>(new Set());

  // Filtr o'zgarsa, to'plam boshidan boshlanadi
  useEffect(() => {
    setOrder(terms.map((_, i) => i));
    setPos(0);
    setFlipped(false);
  }, [terms]);

  const current = terms[order[pos]];

  const go = useCallback((delta: number) => {
    setFlipped(false);
    setPos(p => Math.min(Math.max(p + delta, 0), order.length - 1));
  }, [order.length]);

  function mark(isKnown: boolean) {
    if (!current) return;
    const id = current.id;
    setKnown(prev => { const n = new Set(prev); isKnown ? n.add(id) : n.delete(id); return n; });
    setUnknown(prev => { const n = new Set(prev); isKnown ? n.delete(id) : n.add(id); return n; });
    if (pos < order.length - 1) go(1);
  }

  function shuffle() {
    const shuffled = [...order];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setOrder(shuffled);
    setPos(0);
    setFlipped(false);
  }

  function reset() {
    setOrder(terms.map((_, i) => i));
    setPos(0);
    setFlipped(false);
    setKnown(new Set());
    setUnknown(new Set());
  }

  // Klaviatura: bo'shliq — ag'darish, o'q — o'tish
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space") { e.preventDefault(); setFlipped(f => !f); }
      if (e.code === "ArrowRight") go(1);
      if (e.code === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  if (!current) return null;

  const progress = ((pos + 1) / order.length) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-1.5 rounded-full bg-surface overflow-hidden">
          <motion.div className="h-full progress-gradient" animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
        </div>
        <span className="numeric text-sm text-muted-foreground">{pos + 1}/{order.length}</span>
      </div>

      {/* Kartochka */}
      <div
        className="relative cursor-pointer select-none"
        style={{ perspective: "1400px" }}
        onClick={() => setFlipped(f => !f)}
        role="button"
        tabIndex={0}
        aria-label={t.explore.flipHint}
        onKeyDown={e => { if (e.key === "Enter") setFlipped(f => !f); }}
      >
        <motion.div
          className="relative w-full min-h-[280px]"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Old tomon — termin */}
          <div
            className="absolute inset-0 rounded-2xl border border-border bg-card p-8 flex flex-col items-center justify-center text-center shadow-soft"
            style={{ backfaceVisibility: "hidden" }}
          >
            <LevelBadge difficulty={current.difficulty} className="mb-4" />
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl tracking-tight">{current.term}</h2>
            {current.term_en && (
              <p className="font-mono text-sm text-muted-foreground mt-2">{current.term_en}</p>
            )}
            <p className="eyebrow mt-8">{t.explore.flipHint}</p>
          </div>

          {/* Orqa tomon — ta'rif */}
          <div
            className="absolute inset-0 rounded-2xl border border-neon-purple/30 bg-card p-8 flex flex-col justify-center shadow-soft"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <p className="eyebrow mb-3">{current.term}</p>
            <p className="text-lg leading-relaxed">{current.definition}</p>
            {current.example && (
              <pre className="mt-4 p-3 rounded-lg bg-surface text-sm overflow-x-auto">{current.example}</pre>
            )}
            {current.synonyms?.length > 0 && (
              <p className="text-xs text-muted-foreground mt-4">
                {t.explore.synonyms} {current.synonyms.join(", ")}
              </p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Boshqaruv */}
      <div className="flex items-center justify-between gap-3 mt-6">
        <button
          onClick={() => go(-1)}
          disabled={pos === 0}
          className="p-3 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-surface disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          aria-label={t.common.back}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex gap-2">
          <button
            onClick={() => mark(false)}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold border border-neon-red/30 text-neon-red bg-neon-red/[0.06] hover:bg-neon-red/[0.12] transition-colors"
          >
            <XIcon className="w-4 h-4" /> {t.explore.dontKnow}
          </button>
          <button
            onClick={() => mark(true)}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold border border-neon-green/30 text-neon-green bg-neon-green/[0.06] hover:bg-neon-green/[0.12] transition-colors"
          >
            <Check className="w-4 h-4" /> {t.explore.know}
          </button>
        </div>

        <button
          onClick={() => go(1)}
          disabled={pos === order.length - 1}
          className="p-3 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-surface disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          aria-label={t.common.next}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Natija va qo'shimcha amallar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-6 pt-5 border-t border-border/50">
        <div className="flex items-center gap-4 text-sm">
          <span className="inline-flex items-center gap-1.5 text-neon-green">
            <Check className="w-4 h-4" /> <span className="numeric">{known.size}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 text-neon-red">
            <XIcon className="w-4 h-4" /> <span className="numeric">{unknown.size}</span>
          </span>
        </div>
        <div className="flex gap-2">
          <button onClick={shuffle} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-surface transition-colors">
            <Shuffle className="w-4 h-4" /> Aralashtirish
          </button>
          <button onClick={reset} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-surface transition-colors">
            <RotateCcw className="w-4 h-4" /> Boshidan
          </button>
        </div>
      </div>

      <p className="text-xs text-muted-foreground/70 text-center mt-4">
        Klaviatura: <kbd>Bo&apos;shliq</kbd> — ag&apos;darish, <kbd>←</kbd> <kbd>→</kbd> — o&apos;tish
      </p>
    </div>
  );
}
