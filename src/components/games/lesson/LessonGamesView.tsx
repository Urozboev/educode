"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "@/components/i18n/Link";
import { createClient } from "@/lib/supabase/client";
import { useI18n } from "@/lib/i18n";
import { withTranslations } from "@/lib/i18n/content";
import type { LessonGame, LessonGameType } from "@/types";
import { motion } from "framer-motion";
import { cn, getCategoryLabel } from "@/lib/utils";
import { GAME_TYPES } from "@/lib/lessonGames";
import { LevelBadge } from "@/components/ui/LevelBadge";
import { Gamepad2, Search, Play, Users, Timer, Grid3x3, Link2, Table2 } from "lucide-react";

const TYPE_ICON: Record<LessonGameType, React.ElementType> = {
  quiz_race: Timer,
  jeopardy: Grid3x3,
  match_pairs: Link2,
  crossword: Table2,
};

export function LessonGamesView() {
  const supabase = createClient();
  const [games, setGames] = useState<LessonGame[]>([]);
  const [loading, setLoading] = useState(true);
  const { locale, t } = useI18n();
  const [search, setSearch] = useState("");
  const [type, setType] = useState<LessonGameType | "all">("all");

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("lesson_games")
        .select("*")
        .eq("is_published", true)
        .order("order_index")
        .order("created_at", { ascending: false });
      if (data) setGames(await withTranslations(supabase, "lesson_games", data as LessonGame[], locale));
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  const filtered = useMemo(() => games.filter(g =>
    (type === "all" || g.type === type) &&
    (g.title.toLowerCase().includes(search.toLowerCase()) ||
      g.description?.toLowerCase().includes(search.toLowerCase()))
  ), [games, search, type]);

  return (
    <div className="space-y-8 md:space-y-10">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
        <p className="eyebrow mb-3">{t.explore.lessonGamesEyebrow}</p>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight mb-3">
          Dars o&apos;yinlari
        </h1>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
          Mavzu bo&apos;yicha viktorina, Jeopardy taxtasi va juftlik o&apos;yinlari.
          Proyektorda sinf bilan birga yoki yakka tartibda o&apos;ynash mumkin.
        </p>
      </motion.div>

      {/* Qidiruv va tur filtri */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t.explore.lessonGamesSearch}
            className="w-full bg-surface/60 border border-border rounded-2xl pl-12 pr-4 py-3.5 text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-neon-purple/40 focus:border-neon-purple/40 transition-all"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
          <button
            onClick={() => setType("all")}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap flex-shrink-0 border",
              type === "all"
                ? "bg-foreground text-background border-foreground"
                : "bg-surface/40 text-muted-foreground border-border/50 hover:border-border hover:text-foreground"
            )}
          >
            Barchasi
          </button>
          {GAME_TYPES.map(t => {
            const Icon = TYPE_ICON[t.value];
            return (
              <button
                key={t.value}
                onClick={() => setType(t.value)}
                title={t.akin}
                className={cn(
                  "inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap flex-shrink-0 border",
                  type === t.value
                    ? "bg-foreground text-background border-foreground"
                    : "bg-surface/40 text-muted-foreground border-border/50 hover:border-border hover:text-foreground"
                )}
              >
                <Icon className="w-4 h-4" /> {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Ro'yxat */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map(i => <div key={i} className="h-44 rounded-[10px] border border-border/40 bg-card/30 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center">
          <Gamepad2 className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-base text-muted-foreground">
            {games.length === 0 ? "O'yinlar tez orada qo'shiladi" : "Natija topilmadi"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((g, i) => {
            const meta = GAME_TYPES.find(t => t.value === g.type);
            const Icon = TYPE_ICON[g.type];
            return (
              <motion.article
                key={g.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.4) }}
              >
                <Link
                  href={`/play/${g.slug}`}
                  className="group flex flex-col h-full p-5 rounded-[10px] border border-border/50 bg-card/40 hover:border-neon-purple/30 hover:shadow-lift hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-10 h-10 rounded-xl bg-neon-purple/[0.08] border border-neon-purple/20 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-neon-purple" />
                    </span>
                    <LevelBadge difficulty={g.difficulty} />
                  </div>

                  <p className="eyebrow mb-1.5">{meta?.label}</p>
                  <h2 className="font-display font-bold text-lg leading-snug group-hover:text-neon-purple transition-colors line-clamp-2">
                    {g.title}
                  </h2>
                  {g.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed mt-1.5 line-clamp-2">
                      {g.description}
                    </p>
                  )}

                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <Users className="w-3 h-3" /> <span className="numeric">{g.plays}</span> marta
                      <span className="mx-1">·</span>
                      {getCategoryLabel(g.category)}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-sm font-bold text-neon-purple">
                      <Play className="w-3.5 h-3.5" /> O&apos;ynash
                    </span>
                  </div>
                </Link>
              </motion.article>
            );
          })}
        </div>
      )}
    </div>
  );
}
