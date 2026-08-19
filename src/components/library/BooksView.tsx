"use client";

import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { useI18n } from "@/lib/i18n";
import { withTranslations } from "@/lib/i18n/content";
import type { Book } from "@/types";
import { motion } from "framer-motion";
import { cn, formatBytes, getCategoryLabel } from "@/lib/utils";
import { CategoryIcon } from "@/components/icons/CategoryIcon";
import { Library, Search, Download, FileText, Languages, BookOpen } from "lucide-react";

const CATEGORIES = [
  { value: "all", label: "Barchasi" },
  { value: "programming", label: "Dasturlash" },
  { value: "python", label: "Python" },
  { value: "frontend", label: "Frontend" },
  { value: "computer_literacy", label: "Kompyuter" },
  { value: "algorithms", label: "Algoritmlar" },
];

const LANG_LABEL: Record<string, string> = { uz: "O'zbekcha", ru: "Ruscha", en: "Inglizcha" };

export function BooksView() {
  const supabase = createClient();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const { locale, t } = useI18n();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("books")
        .select("*")
        .eq("is_published", true)
        .order("order_index")
        .order("created_at", { ascending: false });
      if (data) setBooks(await withTranslations(supabase, "books", data as Book[], locale));
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  const filtered = useMemo(() => books.filter(b =>
    (category === "all" || b.category === category) &&
    (b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author?.toLowerCase().includes(search.toLowerCase()) ||
      b.description?.toLowerCase().includes(search.toLowerCase()))
  ), [books, search, category]);

  /** Yuklab olishlar hisoblagichi — natijasini kutmaymiz, yuklash darhol boshlanadi */
  function countDownload(slug: string) {
    supabase.rpc("increment_book_download", { p_slug: slug });
  }

  return (
    <div className="space-y-8 md:space-y-10">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
        <p className="eyebrow mb-3">{t.explore.booksEyebrow}</p>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight mb-3">
          Kitoblar
        </h1>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
          {t.misc.booksSubtitle}
        </p>
      </motion.div>

      {/* Qidiruv va filtr */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t.explore.booksSearch}
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

      {/* Ro'yxat */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-56 rounded-[10px] border border-border/40 bg-card/30 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center">
          <Library className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-base text-muted-foreground">
            {books.length === 0 ? "Kitoblar tez orada qo'shiladi" : t.misc.noResults}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((b, i) => (
            <motion.article
              key={b.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.4) }}
              className="group flex gap-4 p-4 rounded-[10px] border border-border/50 bg-card/40 hover:border-neon-purple/30 hover:shadow-lift transition-all duration-300"
            >
              {/* Muqova */}
              <div className="w-[76px] h-[106px] flex-shrink-0 rounded-md overflow-hidden bg-surface border border-border/60 flex items-center justify-center">
                {b.cover_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={b.cover_url} alt={b.title} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <BookOpen className="w-7 h-7 text-muted-foreground/30" />
                )}
              </div>

              <div className="flex flex-col min-w-0 flex-1">
                <h2 className="font-display font-bold text-[0.95rem] leading-snug line-clamp-2 group-hover:text-neon-purple transition-colors">
                  {b.title}
                </h2>
                {b.author && (
                  <p className="text-xs text-muted-foreground mt-1 truncate">{b.author}</p>
                )}

                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted-foreground mt-2">
                  <span className="inline-flex items-center gap-1">
                    <Languages className="w-3 h-3" />{LANG_LABEL[b.language] || b.language}
                  </span>
                  {b.page_count ? <span>· {b.page_count} bet</span> : null}
                  <span className="font-mono uppercase">· {b.file_type}</span>
                  {b.file_size_bytes ? <span>· {formatBytes(b.file_size_bytes)}</span> : null}
                </div>

                <div className="mt-auto pt-3 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-muted-foreground">
                    {getCategoryLabel(b.category)}
                  </span>
                  <a
                    href={b.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => countDownload(b.slug)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-neon-purple/[0.08] text-neon-purple border border-neon-purple/25 hover:bg-neon-purple/[0.14] transition-colors"
                  >
                    {b.file_type === "link" ? <FileText className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
                    {b.file_type === "link" ? "Ochish" : "Yuklab olish"}
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </div>
  );
}
