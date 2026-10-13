"use client";

import Link from "@/components/i18n/Link";
import { useI18n } from "@/lib/i18n";
import { GUIDE_SECTIONS, type GuideIcon } from "@/lib/guide";
import { GuideVideo, useGuideVideos } from "./GuideVideo";
import { LogIn, BookOpen, Code2, Coins, Zap, FlaskConical, Gamepad2, Puzzle, Trophy, ArrowUpRight } from "lucide-react";

const ICON: Record<GuideIcon, typeof LogIn> = {
  login: LogIn, courses: BookOpen, tasks: Code2, coins: Coins, xp: Zap,
  labs: FlaskConical, games: Gamepad2, lessonGames: Puzzle, contests: Trophy,
};

/**
 * Bosh sahifadagi yo'riqnoma bloki: katta tanishtiruv videosi va
 * mavzular bo'yicha tezkor havolalar.
 *
 * Admin hali umumiy video qo'ymagan bo'lsa ham blok bo'sh qolmaydi —
 * mavzular kartochkalari ko'rinadi va har biri yo'riqnomaning tegishli
 * bo'limiga olib boradi.
 */
export default function HomeGuideSection() {
  const { t } = useI18n();
  const g = t.guide;
  const { videos, loaded } = useGuideVideos();
  const hasVideo = !!videos.overview;

  return (
    <section className="py-16 md:py-20 px-5 border-t border-border/30" aria-labelledby="home-guide-title">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div className="max-w-2xl">
            <h2 id="home-guide-title" className="font-display font-extrabold text-3xl md:text-4xl tracking-tight mb-3">
              {g.homeTitle}
            </h2>
            <p className="text-muted-foreground text-[15px] md:text-base">{g.homeSubtitle}</p>
          </div>
          <Link href="/explore/guide"
            className="inline-flex items-center gap-2 self-start md:self-auto px-5 py-2.5 rounded-xl bg-foreground text-background font-semibold text-sm hover:opacity-90 transition">
            {g.homeCta} <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {hasVideo && <GuideVideo url={videos.overview} title={g.homeTitle} className="shadow-2xl mb-8" />}

        {/* Video yuklanguncha joy sakramasligi uchun kartochkalar doim chiziladi */}
        <div>
          {hasVideo && <p className="text-sm font-semibold text-muted-foreground mb-3">{g.topicsLabel}</p>}
          <div className={hasVideo
            ? "flex gap-2 flex-wrap"
            : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3"}>
            {GUIDE_SECTIONS.map((s) => {
              const Icon = ICON[s.icon];
              return hasVideo ? (
                <Link key={s.id} href={`/explore/guide#${s.id}`}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-border bg-card text-sm hover:border-neon-purple/40 transition-colors">
                  <Icon className="w-4 h-4 text-neon-purple" /> {s.title}
                </Link>
              ) : (
                <Link key={s.id} href={`/explore/guide#${s.id}`}
                  className="group rounded-2xl border border-border bg-card p-4 hover:border-neon-purple/40 transition-colors">
                  <Icon className="w-5 h-5 text-neon-purple mb-3" />
                  <p className="font-semibold text-sm leading-snug mb-1">{s.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{s.lead}</p>
                </Link>
              );
            })}
          </div>
          {!loaded && <span className="sr-only">{t.common.loading}</span>}
        </div>
      </div>
    </section>
  );
}
