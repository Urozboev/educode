"use client";

import { useState, useEffect } from "react";
import Link from "@/components/i18n/Link";
import { createClient } from "@/lib/supabase/client";
import { useI18n } from "@/lib/i18n";
import { withTranslations } from "@/lib/i18n/content";
import { cn } from "@/lib/utils";
import type { Course } from "@/types";
import { motion } from "framer-motion";
import {
  BookOpen, Search, Clock, Coins, Star,
  ChevronRight, Play, Lock, ArrowRight, Layers,
} from "lucide-react";
import { CategoryIcon } from "@/components/icons/CategoryIcon";
import { LevelBadge } from "@/components/ui/LevelBadge";

const categories = [
  { value: "all", label: "Barchasi" },
  { value: "python", label: "Python" },
  { value: "programming", label: "Dasturlash" },
  { value: "frontend", label: "Frontend" },
  { value: "computer_literacy", label: "Kompyuter" },
  { value: "algorithms", label: "Algoritmlar" },
];

/** Kategoriya bo'yicha cover gradienti va bezak rangi */
const categoryStyle: Record<string, { gradient: string; accent: string }> = {
  python: { gradient: "from-[#3776AB]/30 via-[#FFD43B]/10 to-transparent", accent: "#3776AB" },
  programming: { gradient: "from-neon-purple/30 via-neon-blue/10 to-transparent", accent: "#6A55E8" },
  frontend: { gradient: "from-[#61DAFB]/25 via-neon-purple/10 to-transparent", accent: "#3F97BC" },
  computer_literacy: { gradient: "from-neon-blue/25 via-neon-green/10 to-transparent", accent: "#2196C9" },
  prompt_engineering: { gradient: "from-neon-pink/25 via-neon-purple/10 to-transparent", accent: "#C2479B" },
  algorithms: { gradient: "from-neon-green/25 via-neon-blue/10 to-transparent", accent: "#16A085" },
};
const defaultStyle = { gradient: "from-neon-purple/25 via-neon-blue/10 to-transparent", accent: "#6A55E8" };

/** Teglar bo'sh bo'lsa kategoriyadan fallback */
const fallbackTags: Record<string, string[]> = {
  python: ["PYTHON", "ASOSLAR"],
  programming: ["KOD", "AMALIYOT"],
  frontend: ["HTML", "CSS", "JS"],
  computer_literacy: ["OFIS", "INTERNET"],
  prompt_engineering: ["AI", "PROMPT"],
  algorithms: ["ALGORITM", "MANTIQ"],
};

/** Reyting yo'q kurslar uchun barqaror 4.5–4.8 qiymat (id'dan deterministik) */
function pseudoRating(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return (4.5 + (h % 4) / 10).toFixed(1);
}

export default function ExploreCourses() {
  const supabase = createClient();
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const { locale, t } = useI18n();

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
      const { data } = await supabase
        .from("courses")
        .select("*")
        .eq("is_published", true)
        .order("order_index");
      if (data) setCourses(await withTranslations(supabase, "courses", data as Course[], locale));
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  const filtered = courses.filter(
    (c) =>
      (c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.description?.toLowerCase().includes(search.toLowerCase())) &&
      (category === "all" || c.category === category)
  );

  return (
    <div className="space-y-8 md:space-y-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl"
      >
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight mb-3">
          {t.explore.coursesTitle}
        </h1>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
          {t.explore.coursesSubtitle}
        </p>
      </motion.div>

      {/* Search + Filter bar */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.explore.coursesSearch}
            className="w-full bg-surface/60 border border-border rounded-2xl pl-12 pr-4 py-3.5 text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-neon-purple/40 focus:border-neon-purple/40 transition-all"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
          {categories.map((c) => (
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

      {/* Courses grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-72 rounded-[10px] border border-border/40 bg-card/30 animate-pulse"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center">
          <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-base text-muted-foreground">{t.explore.noResults}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((course, i) => {
            const style = categoryStyle[course.category] || defaultStyle;
            return (
              <motion.div
                key={course.id}
                className="h-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.4) }}
              >
                <Link
                  href={`/courses/${course.slug}`}
                  className="group relative flex flex-col h-full rounded-[10px] border border-border/50 bg-card/40 overflow-hidden hover:border-transparent hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300"
                  style={{ ["--accent" as any]: style.accent }}
                >
                  {/* Hover gradient halqa */}
                  <div
                    className="absolute inset-0 rounded-[10px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20"
                    style={{ boxShadow: `inset 0 0 0 1.5px ${style.accent}66, 0 20px 50px -16px ${style.accent}40` }}
                  />

                  {/* Cover — rasm yoki gradient+emoji (teng balandlik) */}
                  <div className={cn("relative h-48 sm:h-52 flex-shrink-0 overflow-hidden", !course.thumbnail_url && `bg-gradient-to-br ${style.gradient}`)}>
                    {course.thumbnail_url ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={course.thumbnail_url}
                          alt={course.title}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                      </>
                    ) : (
                      <>
                        <div
                          className="absolute inset-0 opacity-[0.15]"
                          style={{ backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)", backgroundSize: "16px 16px" }}
                        />
                        <div
                          className="absolute bottom-4 left-5 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300 origin-bottom-left"
                          style={{ color: style.accent }}
                        >
                          <CategoryIcon category={course.category} size={56} strokeWidth={1.2} />
                        </div>
                      </>
                    )}

                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

                    {/* Narx badge */}
                    <div className="absolute top-3.5 right-4 flex gap-1.5">
                      {course.is_free ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-neon-green/90 text-background backdrop-blur-sm shadow-lg shadow-neon-green/30">
                          BEPUL
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-neon-yellow/90 text-white dark:text-[#1a1a00] backdrop-blur-sm shadow-lg shadow-neon-yellow/30">
                          <Coins className="w-3 h-3" />{course.price_coins}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="flex flex-col flex-1 p-5 md:p-6">
                    <div className="mb-3">
                      <LevelBadge difficulty={course.difficulty || "beginner"} />
                    </div>

                    <h3 className="font-display font-bold text-lg leading-snug mb-2 group-hover:text-neon-purple transition-colors line-clamp-2 min-h-[3.25rem]">
                      {course.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2 min-h-[2.6rem]">
                      {course.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-4 min-h-[26px]">
                      {(course.tags?.length ? course.tags : (fallbackTags[course.category] || [t.explore.tagFallback])).slice(0, 3).map(tag => (
                        <span key={tag} className="px-2 py-1 rounded-md text-[10px] font-mono font-semibold bg-surface border border-border/60 text-muted-foreground uppercase tracking-wide">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex-1" />

                    {/* Statistika qatori */}
                    <div className="flex items-center justify-between py-3 border-t border-border/50 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />{course.estimated_hours ? `${course.estimated_hours} soat` : "—"}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5" />{course.total_topics} dars
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-foreground">
                        <Star className="w-3.5 h-3.5 text-neon-yellow fill-neon-yellow" />
                        {course.average_rating > 0 ? Number(course.average_rating).toFixed(1) : pseudoRating(course.id)}
                      </span>
                    </div>

                    <div className="pt-3 border-t border-border/50 flex items-center justify-between">
                      <span className={cn("font-display font-bold text-base", course.is_free ? "text-neon-green" : "text-neon-yellow")}>
                        {course.is_free ? "Bepul" : (
                          <span className="inline-flex items-center gap-1"><Coins className="w-4 h-4" />{course.price_coins} coin</span>
                        )}
                      </span>
                      {/* Rang tokendan olinadi — kategoriya accent'i (masalan React'ning
                          och siyanı) matn sifatida oq fonda o'qilmaydi */}
                      <span className="inline-flex items-center gap-1.5 text-sm font-bold text-neon-purple transition-all group-hover:gap-2.5">
                        <Play className="w-3.5 h-3.5" /> {t.explore.view} <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* CTA for guests */}
      {!isLoggedIn && !loading && (
        <div className="p-8 md:p-10 rounded-3xl border border-border/50 bg-surface/30 text-center">
          <div className="w-14 h-14 rounded-2xl bg-neon-purple/10 border border-neon-purple/20 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6 text-neon-purple" />
          </div>
          <h3 className="font-display font-bold text-xl mb-2">
            {t.explore.coursesCtaTitle}
          </h3>
          <p className="text-muted-foreground text-base mb-5 max-w-md mx-auto">
            {t.explore.coursesCtaText}
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-foreground text-background font-display font-semibold text-sm hover:opacity-90 transition-all"
          >
            Bepul boshlash <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
