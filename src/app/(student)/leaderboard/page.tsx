"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn, getInitials, getLevelLabel, getLevelColor } from "@/lib/utils";
import { motion } from "framer-motion";
import { Trophy, Medal, Flame, Zap, Crown } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function LeaderboardPage() {
  const { t } = useI18n();
  const supabase = createClient();
  const [users, setUsers] = useState<any[]>([]);
  const [myId, setMyId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setMyId(user.id);
      const { data } = await supabase.from("profiles").select("id, full_name, avatar_url, xp, coins, streak_days, level")
        .eq("role", "student").eq("is_blocked", false).order("xp", { ascending: false }).limit(50);
      if (data) setUsers(data);
      setLoading(false);
    })();
  }, []);

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div className="space-y-8 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display font-bold text-3xl mb-1">{t.cabinet.board.title}</h1>
        <p className="text-muted-foreground">{t.cabinet.board.subtitle}</p>
      </motion.div>

      {/* Top 3 */}
      {!loading && users.length >= 3 && (
        <div className="grid grid-cols-3 gap-4">
          {[1, 0, 2].map((idx) => {
            const u = users[idx];
            if (!u) return null;
            return (
              <motion.div key={u.id} className={cn("glass-card p-5 text-center", idx === 0 && "ring-2 ring-neon-yellow/30")}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
                <div className="text-3xl mb-2">{medals[idx]}</div>
                <div className="w-14 h-14 rounded-full bg-hero-gradient flex items-center justify-center text-white font-bold mx-auto mb-2">
                  {u.avatar_url ? <img src={u.avatar_url} className="w-full h-full rounded-full object-cover" /> : getInitials(u.full_name)}
                </div>
                <p className="font-semibold text-sm truncate">{u.full_name}</p>
                <p className="text-xs text-neon-yellow font-mono mt-1">{u.xp} XP</p>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Full list */}
      <div className="glass-card overflow-hidden">
        <div className="grid grid-cols-[3rem,1fr,5rem,5rem,5rem] gap-4 px-5 py-3 border-b border-border/50 text-xs font-semibold text-muted-foreground">
          <span>#</span><span>{t.cabinet.board.colStudent}</span><span className="text-center">{t.common.xp}</span><span className="text-center">{t.cabinet.board.colStreak}</span><span className="text-center">{t.cabinet.board.colLevel}</span>
        </div>
        {loading ? <div className="p-8 text-center text-muted-foreground">{t.common.loading}</div> : (
          <div>
            {users.map((u, i) => (
              <motion.div key={u.id} className={cn("grid grid-cols-[3rem,1fr,5rem,5rem,5rem] gap-4 px-5 py-3 items-center text-sm border-b border-border/30 last:border-0 transition-colors",
                u.id === myId && "bg-neon-purple/5")}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}>
                <span className="font-mono text-muted-foreground font-bold">{i < 3 ? medals[i] : i + 1}</span>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-hero-gradient flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                    {u.avatar_url ? <img src={u.avatar_url} className="w-full h-full rounded-full object-cover" /> : getInitials(u.full_name)}
                  </div>
                  <span className={cn("truncate font-medium", u.id === myId && "text-neon-purple")}>{u.full_name} {u.id === myId && t.cabinet.board.you}</span>
                </div>
                <span className="text-center font-mono text-neon-yellow">{u.xp}</span>
                <span className="text-center">{u.streak_days > 0 && <span className="inline-flex items-center gap-1 text-neon-red text-xs"><Flame className="w-3 h-3" />{u.streak_days}</span>}</span>
                <span className={cn("text-center text-xs font-medium", getLevelColor(u.level))}>{getLevelLabel(u.level, t)}</span>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
