"use client";

import Link from "@/components/i18n/Link";
import { useI18n } from "@/lib/i18n";
import { GUIDE_SECTIONS, type GuideIcon } from "@/lib/guide";
import { GuideVideo, useGuideVideos } from "./GuideVideo";
import { LogIn, BookOpen, Code2, Coins, Zap, FlaskConical, Gamepad2, Puzzle, Trophy, ArrowUpRight, PlayCircle } from "lucide-react";

const ICON: Record<GuideIcon, typeof LogIn> = {
  login: LogIn, courses: BookOpen, tasks: Code2, coins: Coins, xp: Zap,
  labs: FlaskConical, games: Gamepad2, lessonGames: Puzzle, contests: Trophy,
};

/**
 * Bosh sahifadagi yo'riqnoma bloki — daftar mundarijasi ko'rinishida:
 * bo'lim nomi, nuqtali chiziq va strelka. Admin umumiy video qo'ygan
 * bo'lsa, u mundarija yonida katta bo'lib turadi; qo'ymagan bo'lsa,
 * mundarija o'zi to'liq kenglikda ikki ustunda chiqadi.
 */
export default function HomeGuideSection() {
  const { t } = useI18n();
  const g = t.guide;
  const { videos } = useGuideVideos();
  const hasVideo = !!videos.overview;

  const toc = (
    <ol className={hasVideo ? "" : "md:columns-2 md:gap-14"}>
      {GUIDE_SECTIONS.map((s) => {
        const Icon = ICON[s.icon];
        return (
          <li key={s.id} className="break-inside-avoid">
            <Link href={`/explore/guide#${s.id}`} className="group flex items-center gap-3 py-3.5">
              <Icon className="w-[1.1rem] h-[1.1rem] text-neon-purple flex-shrink-0" />
              <span className="font-medium group-hover:text-neon-purple transition-colors">{s.title}</span>
              {videos[s.id as keyof typeof videos] && <PlayCircle className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
              <span className="flex-1 border-b-2 border-dotted border-border translate-y-1 min-w-6" aria-hidden />
              <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
            </Link>
          </li>
        );
      })}
    </ol>
  );

  return (
    <section className="py-20 md:py-24 px-5" aria-labelledby="home-guide-title">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-[1fr,1.2fr] gap-6 md:gap-16 items-end mb-10">
          <h2 id="home-guide-title" className="font-display font-extrabold text-4xl md:text-5xl tracking-[-0.04em] leading-[0.95]">
            {g.homeTitle}
          </h2>
          <div>
            <p className="text-lg text-foreground/70 leading-relaxed max-w-md mb-4">{g.homeSubtitle}</p>
            <Link href="/explore/guide"
              className="inline-flex items-center gap-1.5 font-semibold underline decoration-2 underline-offset-[6px] decoration-neon-purple/50 hover:decoration-neon-purple">
              {g.homeCta} <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {hasVideo ? (
          <div className="grid lg:grid-cols-[1.5fr,1fr] gap-10 items-start">
            <GuideVideo url={videos.overview} title={g.homeTitle} className="shadow-xl" />
            {toc}
          </div>
        ) : (
          toc
        )}
      </div>
    </section>
  );
}
