"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
} from "lucide-react";

const games = [
  {
    id: "puzzle",
    title: "Code Puzzle",
    desc: "Kod qatorlarini to'g'ri tartibga qo'ying. Mantiqiy fikrlash va algoritm tuzilishini mashq qilasiz.",
    icon: Puzzle,
    color: "#6C5CE7",
    difficulty: "Oson",
  },
  {
    id: "bugfix",
    title: "Bug Fix Challenge",
    desc: "Kodning qayeri xato ekanligini toping va tuzating. Debug qilish ko'nikmalaringizni rivojlantirasiz.",
    icon: Bug,
    color: "#FF5252",
    difficulty: "O'rta",
  },
  {
    id: "typing",
    title: "Code Typing Race",
    desc: "Kod yozish tezligingizni sinab ko'ring. WPM va aniqlikni o'lchovchi real-time musobaqa.",
    icon: Keyboard,
    color: "#00D2FF",
    difficulty: "Oson",
  },
  {
    id: "battle",
    title: "Code Battle",
    desc: "30 soniyada ko'proq masalani yeching. Streak bilan ko'p ochko to'plang.",
    icon: Swords,
    color: "#00E676",
    difficulty: "Qiyin",
  },
  {
    id: "maze",
    title: "Maze Runner",
    desc: "Robotni buyruqlar ketma-ketligi bilan labirintdan olib chiqing. Sikllar va shartlarni o'rganing.",
    icon: Map,
    color: "#FFD600",
    difficulty: "O'rta",
  },
  {
    id: "bird",
    title: "Code Bird",
    desc: "Qushni yulduzlarga yo'naltiring. 8 yo'nalishli harakat va to'siqlarni oldini olish.",
    icon: Bird,
    color: "#FF6B9D",
    difficulty: "Qiyin",
  },
];

export default function ExploreGames() {
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
  }, []);

  function handleClick() {
    router.push(isLoggedIn ? "/games" : "/login?redirect=/games");
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl"
      >
        <h1 className="font-display font-extrabold text-4xl md:text-5xl tracking-tight mb-3">
          Interaktiv o'yinlar
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Dasturlashni o'yin orqali osonroq va qiziqarliroq o'rganing. 6 xil format —
          algoritm, debug, tezlik va mantiq uchun.
        </p>
      </motion.div>

      {/* Games grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {games.map((game, i) => (
          <motion.button
            key={game.id}
            onClick={handleClick}
            className="group w-full text-left p-6 rounded-2xl border border-border/50 bg-card/40 hover:bg-card hover:border-border hover:shadow-xl hover:shadow-black/[0.04] transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform group-hover:scale-105"
              style={{
                backgroundColor: `${game.color}14`,
                border: `1px solid ${game.color}33`,
              }}
            >
              <game.icon className="w-7 h-7" style={{ color: game.color }} />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-display font-bold text-xl group-hover:text-neon-purple transition-colors">
                {game.title}
              </h3>
            </div>
            <p className="text-[15px] text-muted-foreground leading-relaxed mb-4 line-clamp-3">
              {game.desc}
            </p>
            <div className="flex items-center justify-between pt-4 border-t border-border/40">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-surface text-muted-foreground border border-border/60">
                {game.difficulty}
              </span>
              <ArrowRight className="w-5 h-5 text-muted-foreground/60 group-hover:text-neon-purple group-hover:translate-x-1 transition-all" />
            </div>
          </motion.button>
        ))}
      </div>

      {/* CTA */}
      {!isLoggedIn ? (
        <div className="p-8 md:p-10 rounded-3xl border border-border/50 bg-surface/30 text-center">
          <div className="w-14 h-14 rounded-2xl bg-neon-purple/10 border border-neon-purple/20 flex items-center justify-center mx-auto mb-4">
            <Gamepad2 className="w-6 h-6 text-neon-purple" />
          </div>
          <h3 className="font-display font-bold text-xl mb-2">
            O'yinlarda ishtirok etish uchun ro'yxatdan o'ting
          </h3>
          <p className="text-muted-foreground text-base mb-5 max-w-md mx-auto">
            Har bir o'yinda coin va XP yig'ing. Reytingda yuqori o'ringa chiqing.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-foreground text-background font-display font-semibold text-sm hover:opacity-90 transition-all"
          >
            Bepul boshlash <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="p-8 md:p-10 rounded-3xl border border-border/50 bg-surface/30 text-center">
          <p className="text-muted-foreground text-base mb-4">
            O'yin vaqtida XP va coin yig'ib, reytingda yuqoriga ko'tariling.
          </p>
          <Link
            href="/games"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-foreground text-background font-display font-semibold text-sm hover:opacity-90 transition-all"
          >
            O'yinlarga kirish <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
