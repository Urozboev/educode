"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { Puzzle, Bug, Keyboard, Swords, Lock, ArrowRight, Gamepad2 } from "lucide-react";

const games = [
  { id: "puzzle", title: "Code Puzzle", desc: "Kod qatorlarini to'g'ri tartibga qo'ying. Mantiqiy fikrlashni rivojlantiradi.", icon: Puzzle, color: "#6C5CE7", difficulty: "Oson" },
  { id: "bugfix", title: "Bug Fix Challenge", desc: "Xatoli kodni toping va tuzating. Real loyihalardagi muammolarni tushunishga yordam beradi.", icon: Bug, color: "#FF5252", difficulty: "O'rta" },
  { id: "typing", title: "Code Typing Race", desc: "Kod yozish tezligingizni sinab ko'ring. Tezkor yozish — tezkor dasturlash.", icon: Keyboard, color: "#00D2FF", difficulty: "Oson" },
  { id: "battle", title: "Code Battle", desc: "Boshqa talabalar bilan real-time musobaqa. Kim tezroq yechadi?", icon: Swords, color: "#00E676", difficulty: "Qiyin" },
];

export default function ExploreGames() {
  const supabase = createClient();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
    })();
  }, []);

  function handleClick() {
    router.push(isLoggedIn ? "/games" : "/login?redirect=/games");
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display font-bold text-4xl mb-2">O'yinlar</h1>
        <p className="text-muted-foreground text-lg">Dasturlashni o'yin orqali osonroq o'rganing</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {games.map((game, i) => (
          <motion.button key={game.id} onClick={handleClick}
            className="glass-card-hover p-8 text-left group w-full" initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
                style={{ backgroundColor: `${game.color}15`, border: `1px solid ${game.color}30` }}>
                <game.icon className="w-8 h-8" style={{ color: game.color }} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-display font-bold text-xl group-hover:text-neon-purple transition-colors">{game.title}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface text-muted-foreground">{game.difficulty}</span>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">{game.desc}</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Animated gaming SVG */}
      <motion.div className="flex justify-center py-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <svg width="300" height="180" viewBox="0 0 300 180" className="opacity-30">
          <rect x="40" y="30" width="220" height="130" rx="16" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
          <circle cx="100" cy="95" r="25" fill="none" stroke="#6C5CE7" strokeWidth="1.5" opacity="0.5">
            <animate attributeName="r" values="25;28;25" dur="2s" repeatCount="indefinite" />
          </circle>
          <line x1="100" y1="80" x2="100" y2="110" stroke="#6C5CE7" strokeWidth="2" opacity="0.5" />
          <line x1="85" y1="95" x2="115" y2="95" stroke="#6C5CE7" strokeWidth="2" opacity="0.5" />
          <circle cx="190" cy="85" r="8" fill="#FF5252" opacity="0.5"><animate attributeName="opacity" values="0.3;0.7;0.3" dur="1.5s" repeatCount="indefinite" /></circle>
          <circle cx="210" cy="95" r="8" fill="#00E676" opacity="0.5"><animate attributeName="opacity" values="0.5;0.9;0.5" dur="1.5s" repeatCount="indefinite" begin="0.3s" /></circle>
          <circle cx="190" cy="105" r="8" fill="#00D2FF" opacity="0.5"><animate attributeName="opacity" values="0.4;0.8;0.4" dur="1.5s" repeatCount="indefinite" begin="0.6s" /></circle>
          <circle cx="170" cy="95" r="8" fill="#FFD600" opacity="0.5"><animate attributeName="opacity" values="0.3;0.7;0.3" dur="1.5s" repeatCount="indefinite" begin="0.9s" /></circle>
        </svg>
      </motion.div>

      {!isLoggedIn && (
        <motion.div className="glass-card p-8 text-center" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <Gamepad2 className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground mb-4">O'yinlardan foydalanish uchun ro'yxatdan o'ting</p>
          <Link href="/register" className="btn-primary text-sm py-2.5 px-6">Bepul boshlash</Link>
        </motion.div>
      )}
    </div>
  );
}
