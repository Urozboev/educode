"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "@/components/i18n/Link";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import {
  Puzzle,
  Bug,
  Keyboard,
  Swords,
  Lock,
  ArrowRight,
  Gamepad2,
  Map,
  Bird,
  Bot,
  Plane,
  Binary,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import type { Dictionary } from "@/lib/i18n/dictionaries/uz";

const games = (t: Dictionary) => [
  {
    id: "quiz3d",
    title: "Quiz Battle 3D",
    desc: t.cabinet.gamesPage.descQuiz3d,
    icon: Swords,
    color: "#B388FF",
    difficulty: "3D Arena",
  },
  {
    id: "maze3d",
    title: "Maze Runner 3D",
    desc: t.cabinet.gamesPage.descMaze3d,
    icon: Bot,
    color: "#FFD600",
    difficulty: "3D Labirint",
  },
  {
    id: "flight3d",
    title: "Cyber Flight 3D",
    desc: t.cabinet.gamesPage.descFlight3d,
    icon: Plane,
    color: "#00D2FF",
    difficulty: "3D Parvoz",
  },
  {
    id: "binary3d",
    title: "Binary Bridge 3D",
    desc: t.cabinet.gamesPage.descBinary3d,
    icon: Binary,
    color: "#00E676",
    difficulty: "3D Kosmik",
  },
  {
    id: "puzzle",
    title: "Code Puzzle",
    desc: t.explore.gPuzzle,
    icon: Puzzle,
    color: "#6C5CE7",
    difficulty: "Oson",
  },
  {
    id: "bugfix",
    title: "Bug Fix Challenge",
    desc: t.explore.gBugFix,
    icon: Bug,
    color: "#FF5252",
    difficulty: "O'rta",
  },
  {
    id: "typing",
    title: "Code Typing Race",
    desc: t.explore.gTyping,
    icon: Keyboard,
    color: "#00D2FF",
    difficulty: "Oson",
  },
  {
    id: "battle",
    title: "Code Battle",
    desc: t.explore.gBattle,
    icon: Swords,
    color: "#00E676",
    difficulty: "Qiyin",
  },
  {
    id: "maze",
    title: "Maze Runner",
    desc: t.explore.gMaze,
    icon: Map,
    color: "#FFD600",
    difficulty: "O'rta",
  },
  {
    id: "bird",
    title: "Code Bird",
    desc: t.explore.gBird,
    icon: Bird,
    color: "#FF6B9D",
    difficulty: "Qiyin",
  },
];

export default function ExploreGames() {
  const { t } = useI18n();
  const supabase = createClient();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
    })();
  }, [supabase]);

  function handleClick() {
    router.push(isLoggedIn ? "/games" : "/login?redirect=/games");
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-2xl mx-auto"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neon-purple/10 border border-neon-purple/20 text-neon-purple text-xs font-semibold tracking-widest uppercase mb-4">
          <Gamepad2 className="w-3.5 h-3.5" />
          {t.cabinet.gamesPage.eyebrow}
        </div>
        <h1 className="font-display font-extrabold text-4xl md:text-5xl tracking-tight mb-3">
          {t.cabinet.gamesPage.title}
        </h1>
        <p className="text-[15px] md:text-base text-muted-foreground">
          {t.explore.gamesSubtitle}
        </p>
      </motion.div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {games(t).map((game, i) => {
          const Icon = game.icon;
          return (
            <motion.div
              key={game.id}
              onClick={handleClick}
              className="group relative p-6 rounded-3xl border border-border/50 bg-card/40 hover:bg-card/80 hover:border-border transition-all overflow-hidden cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div
                className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity"
                style={{ backgroundColor: game.color }}
              />
              <div className="relative">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 border"
                  style={{
                    backgroundColor: `${game.color}14`,
                    borderColor: `${game.color}33`,
                    color: game.color,
                  }}
                >
                  <Icon className="w-7 h-7" strokeWidth={2} />
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-display font-bold text-lg tracking-tight group-hover:text-neon-purple transition-colors">
                    {game.title}
                  </h3>
                  <span className="text-[11px] px-2 py-0.5 rounded-full border border-border bg-surface/60 text-muted-foreground font-medium">
                    {game.difficulty}
                  </span>
                </div>
                <p className="text-[15px] text-muted-foreground leading-relaxed">{game.desc}</p>

                <div className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-foreground/70 group-hover:text-neon-purple transition-colors">
                  {!isLoggedIn && <Lock className="w-3.5 h-3.5" />}
                  {isLoggedIn ? "O'ynash" : "Kirish va o'ynash"}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* CTA for non-logged in */}
      {!isLoggedIn && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8 rounded-3xl border border-neon-purple/20 bg-neon-purple/5 max-w-xl mx-auto"
        >
          <h3 className="font-display font-bold text-xl mb-2">
            {t.explore.gamesCtaTitle}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {t.explore.gamesCtaText}
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-foreground text-background font-display font-bold text-sm hover:opacity-90 transition"
          >
            {t.explore.guestCtaButton}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      )}
    </div>
  );
}
