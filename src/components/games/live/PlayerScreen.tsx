"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { LessonGame, QuizRaceContent } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  LIVE_SHAPES, loadPlayer, clearPlayer, secondsLeft,
  type LiveSession, type LivePlayer,
} from "@/lib/liveGame";
import { Check, X, Clock, Trophy, Loader2, Hourglass } from "lucide-react";

/**
 * O'quvchi ekrani — telefon uchun.
 *
 * Savol matni bu yerda ATAYLAB ko'rsatilmaydi: u proyektorda turadi va
 * o'quvchi boshini ko'tarib qarashi kerak. Telefonda faqat katta rangli
 * tugmalar — Kahoot shu tamoyilda ishlaydi va sinfni jipslashtiradi.
 */
export function PlayerScreen({ sessionId }: { sessionId: string }) {
  const supabase = createClient();
  const [session, setSession] = useState<LiveSession | null>(null);
  const [game, setGame] = useState<LessonGame | null>(null);
  const [me, setMe] = useState<LivePlayer | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [answering, setAnswering] = useState(false);
  const [answered, setAnswered] = useState<{ index: number; correct: boolean; points: number } | null>(null);
  const [standings, setStandings] = useState<{ rank: number; nickname: string; score: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setTick] = useState(0);

  const questions = (game?.content as QuizRaceContent | undefined)?.questions ?? [];
  const q = questions[session?.current_index ?? 0];
  const left = secondsLeft(q, session?.question_started_at ?? null);

  useEffect(() => {
    const t = setInterval(() => setTick(x => x + 1), 500);
    return () => clearInterval(t);
  }, []);

  const loadSession = useCallback(async () => {
    const { data: s } = await supabase.from("game_sessions").select("*").eq("id", sessionId).maybeSingle();
    if (s) setSession(s as LiveSession);
    return s as LiveSession | null;
  }, [supabase, sessionId]);

  useEffect(() => {
    (async () => {
      const stored = loadPlayer(sessionId);
      if (!stored) { setLoading(false); return; }
      setPlayerId(stored.playerId);

      const s = await loadSession();
      if (s) {
        const { data: g } = await supabase.from("lesson_games").select("*").eq("id", s.game_id).maybeSingle();
        if (g) setGame(g as LessonGame);
      }

      const { data: p } = await supabase
        .from("game_session_players").select("*").eq("id", stored.playerId).maybeSingle();
      if (p) setMe(p as LivePlayer);

      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  // Sessiya holati o'zgarishini real vaqtda kuzatamiz
  useEffect(() => {
    const ch = supabase
      .channel(`player-${sessionId}`)
      .on("postgres_changes",
        { event: "UPDATE", schema: "public", table: "game_sessions", filter: `id=eq.${sessionId}` },
        payload => {
          const s = payload.new as LiveSession;
          setSession(s);
          // Yangi savol ochilganda javob holatini tozalaymiz
          setAnswered(prev => (prev && prev.index !== s.current_index ? null : prev));
        })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  // Zaxira: realtime yetib kelmasa ham holat yangilanib tursin
  useEffect(() => {
    const t = setInterval(loadSession, 4000);
    return () => clearInterval(t);
  }, [loadSession]);

  // Yakunda reyting
  useEffect(() => {
    if (session?.status !== "ended") return;
    (async () => {
      const { data } = await supabase.rpc("game_session_standings", { p_session_id: sessionId });
      if (data) setStandings(data as any[]);
      if (playerId) {
        const { data: p } = await supabase.from("game_session_players").select("*").eq("id", playerId).maybeSingle();
        if (p) setMe(p as LivePlayer);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.status]);

  async function answer(optionIndex: number) {
    if (!playerId || !session || answered || answering) return;
    setAnswering(true);
    const { data, error } = await supabase.rpc("answer_game_session", {
      p_player_id: playerId,
      p_question_index: session.current_index,
      p_option_index: optionIndex,
    });
    setAnswering(false);
    if (error) {
      // Vaqt tugagan yoki takroriy javob — jim qoldirmaymiz
      setAnswered({ index: session.current_index, correct: false, points: 0 });
      return;
    }
    setAnswered({ index: session.current_index, correct: !!data?.correct, points: data?.points ?? 0 });
    const { data: p } = await supabase.from("game_session_players").select("*").eq("id", playerId).maybeSingle();
    if (p) setMe(p as LivePlayer);
  }

  if (loading) {
    return <Center><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></Center>;
  }

  if (!playerId) {
    return (
      <Center>
        <p className="text-muted-foreground mb-6 text-center">
          Bu sessiyaga qo&apos;shilmagansiz
        </p>
        <Link href="/live" className="btn-primary py-2.5 px-6 text-sm">PIN kiritish</Link>
      </Center>
    );
  }

  if (!session) {
    return <Center><p className="text-muted-foreground">Sessiya topilmadi</p></Center>;
  }

  /* ===== LOBBI ===== */
  if (session.status === "lobby") {
    return (
      <Center>
        <motion.div
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-20 h-20 rounded-3xl bg-neon-purple/10 border-2 border-neon-purple/25 flex items-center justify-center mb-6"
        >
          <Hourglass className="w-9 h-9 text-neon-purple" />
        </motion.div>
        <h1 className="font-display font-extrabold text-2xl mb-2">Siz o&apos;yindasiz</h1>
        <p className="text-muted-foreground text-center mb-1">
          <b className="text-foreground">{me?.nickname}</b>
        </p>
        <p className="text-muted-foreground text-center">
          O&apos;qituvchi boshlashini kuting
        </p>
      </Center>
    );
  }

  /* ===== YAKUN ===== */
  if (session.status === "ended") {
    const myRank = standings.findIndex(s => s.nickname === me?.nickname) + 1;
    return (
      <Center>
        <Trophy className="w-14 h-14 text-neon-yellow mb-4" />
        <h1 className="font-display font-extrabold text-3xl mb-1">O&apos;yin tugadi</h1>
        {myRank > 0 && (
          <p className="text-lg text-muted-foreground mb-6">
            Sizning o&apos;rningiz: <b className="numeric text-foreground">{myRank}</b>
          </p>
        )}

        <div className="grid grid-cols-2 gap-3 w-full max-w-xs mb-8">
          <Box label="Ball" value={me?.score ?? 0} />
          <Box label="To'g'ri" value={me?.correct_count ?? 0} />
        </div>

        {standings.length > 0 && (
          <div className="w-full max-w-sm mb-8">
            <p className="eyebrow mb-2">Reyting</p>
            <ul className="space-y-1.5">
              {standings.slice(0, 5).map(s => (
                <li key={s.nickname} className={cn(
                  "flex items-center gap-3 p-3 rounded-xl border",
                  s.nickname === me?.nickname
                    ? "bg-neon-purple/[0.08] border-neon-purple/25"
                    : "bg-card/40 border-border/60"
                )}>
                  <span className="numeric text-sm text-muted-foreground w-5">{s.rank}</span>
                  <span className="flex-1 min-w-0 truncate text-sm font-medium">{s.nickname}</span>
                  <span className="numeric text-neon-yellow">{s.score}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Link href="/live" onClick={clearPlayer} className="btn-ghost py-2.5 px-6 text-sm">
          Chiqish
        </Link>
      </Center>
    );
  }

  /* ===== JAVOB BERILGAN — natijani ko'rsatamiz ===== */
  if (answered && answered.index === session.current_index) {
    return (
      <Center>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={cn(
            "w-24 h-24 rounded-3xl flex items-center justify-center mb-6 border-2",
            answered.correct
              ? "bg-neon-green/10 border-neon-green/30"
              : "bg-neon-red/10 border-neon-red/30"
          )}
        >
          {answered.correct
            ? <Check className="w-12 h-12 text-neon-green" />
            : <X className="w-12 h-12 text-neon-red" />}
        </motion.div>

        <h1 className="font-display font-extrabold text-2xl mb-1">
          {answered.correct ? "To'g'ri!" : "Noto'g'ri"}
        </h1>
        {answered.points > 0 && (
          <p className="numeric text-lg text-neon-yellow mb-2">+{answered.points}</p>
        )}
        <p className="text-muted-foreground text-center">
          Jami: <span className="numeric text-foreground">{me?.score ?? 0}</span> ball
        </p>
        <p className="text-sm text-muted-foreground mt-6 text-center">
          Keyingi savolni kuting
        </p>
      </Center>
    );
  }

  /* ===== JAVOB BERISH ===== */
  const timeUp = left <= 0;

  return (
    <div className="min-h-[100dvh] flex flex-col p-4">
      <div className="flex items-center justify-between mb-4">
        <span className="eyebrow">
          <span className="numeric">{session.current_index + 1}</span>/<span className="numeric">{questions.length}</span>
        </span>
        <span className="text-sm font-medium">{me?.nickname}</span>
        <span className={cn(
          "inline-flex items-center gap-1.5 font-display font-bold text-xl",
          left <= 5 ? "text-neon-red" : ""
        )}>
          <Clock className="w-4 h-4" /><span className="numeric">{left}</span>
        </span>
      </div>

      {timeUp ? (
        <Center>
          <Hourglass className="w-10 h-10 text-muted-foreground/40 mb-4" />
          <p className="text-muted-foreground text-center">Vaqt tugadi</p>
          <p className="text-sm text-muted-foreground mt-1">Keyingi savolni kuting</p>
        </Center>
      ) : (
        <>
          <p className="text-center text-muted-foreground mb-4">
            Ekranga qarang va javobni tanlang
          </p>
          <div className="grid grid-cols-2 gap-3 flex-1">
            {(q?.options ?? []).map((_, i) => {
              const shape = LIVE_SHAPES[i % 4];
              return (
                <button
                  key={i}
                  onClick={() => answer(i)}
                  disabled={answering}
                  aria-label={shape.name}
                  className={cn(
                    "rounded-2xl text-white flex items-center justify-center transition-transform active:scale-95 disabled:opacity-60",
                    shape.cls
                  )}
                >
                  <span className="text-6xl leading-none">{shape.label}</span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function Center({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center p-6">{children}</div>
  );
}

function Box({ label, value }: { label: string; value: number }) {
  return (
    <div className="p-4 rounded-xl border border-border bg-card/50 text-center">
      <p className="numeric text-2xl">{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
    </div>
  );
}
