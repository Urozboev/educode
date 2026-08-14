"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "@/components/i18n/Link";
import { createClient } from "@/lib/supabase/client";
import type { LessonGame, QuizRaceContent } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { LIVE_SHAPES, secondsLeft, type LiveSession, type LivePlayer } from "@/lib/liveGame";
import {
  Users, Play, SkipForward, Square, Loader2, Trophy, Clock,
  Copy, Check, ArrowLeft, Monitor,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";

/**
 * O'qituvchi ekrani — proyektorga chiqariladi.
 *
 * {t.lg.question} matni va variantlar SHU YERDA turadi; o'quvchi telefonida faqat
 * rangli tugmalar bo'ladi. Shuning uchun bu ekranda shrift katta va
 * kontrast baland — orqa qatordan ham o'qilishi kerak.
 */
export function HostScreen({ sessionId }: { sessionId: string }) {
  const { t } = useI18n();
  const supabase = createClient();
  const [session, setSession] = useState<LiveSession | null>(null);
  const [game, setGame] = useState<LessonGame | null>(null);
  const [players, setPlayers] = useState<LivePlayer[]>([]);
  const [answerCount, setAnswerCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [tick, setTick] = useState(0);

  const questions = (game?.content as QuizRaceContent | undefined)?.questions ?? [];
  const q = questions[session?.current_index ?? 0];
  const left = secondsLeft(q, session?.question_started_at ?? null);
  const isLast = (session?.current_index ?? 0) >= questions.length - 1;

  // Taymer uchun har soniyada qayta chizamiz
  useEffect(() => {
    const t = setInterval(() => setTick(x => x + 1), 500);
    return () => clearInterval(t);
  }, []);

  const loadAll = useCallback(async () => {
    const { data: s } = await supabase.from("game_sessions").select("*").eq("id", sessionId).maybeSingle();
    if (!s) { setLoading(false); return; }
    setSession(s as LiveSession);

    const { data: g } = await supabase.from("lesson_games").select("*").eq("id", (s as LiveSession).game_id).maybeSingle();
    if (g) setGame(g as LessonGame);

    const { data: p } = await supabase
      .from("game_session_players").select("*")
      .eq("session_id", sessionId).order("score", { ascending: false });
    if (p) setPlayers(p as LivePlayer[]);

    setLoading(false);
  }, [supabase, sessionId]);

  useEffect(() => { loadAll(); }, [loadAll]);

  // Ishtirokchilar real vaqtda qo'shilib turadi
  useEffect(() => {
    const ch = supabase
      .channel(`host-${sessionId}`)
      .on("postgres_changes",
        { event: "*", schema: "public", table: "game_session_players", filter: `session_id=eq.${sessionId}` },
        () => { loadPlayers(); })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  const loadPlayers = useCallback(async () => {
    const { data } = await supabase
      .from("game_session_players").select("*")
      .eq("session_id", sessionId).order("score", { ascending: false });
    if (data) setPlayers(data as LivePlayer[]);
  }, [supabase, sessionId]);

  // Javob berganlar sonini kuzatamiz — qachon keyingisiga o'tishni bilish uchun
  const idxRef = useRef(0);
  idxRef.current = session?.current_index ?? 0;
  useEffect(() => {
    if (session?.status !== "running") return;
    let alive = true;
    const poll = async () => {
      const { count } = await supabase
        .from("game_session_answers")
        .select("id", { count: "exact", head: true })
        .eq("session_id", sessionId)
        .eq("question_index", idxRef.current);
      if (alive) setAnswerCount(count ?? 0);
    };
    poll();
    const t = setInterval(poll, 2000);
    return () => { alive = false; clearInterval(t); };
  }, [supabase, sessionId, session?.status, session?.current_index]);

  async function start() {
    setBusy(true);
    const { error } = await supabase.from("game_sessions")
      .update({ status: "running", current_index: 0, question_started_at: new Date().toISOString() })
      .eq("id", sessionId);
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    setRevealed(false);
    loadAll();
  }

  async function next() {
    if (!session) return;
    setBusy(true);
    if (isLast) {
      const { error } = await supabase.from("game_sessions")
        .update({ status: "ended", ended_at: new Date().toISOString() })
        .eq("id", sessionId);
      setBusy(false);
      if (error) { toast.error(error.message); return; }
    } else {
      const { error } = await supabase.from("game_sessions")
        .update({ current_index: session.current_index + 1, question_started_at: new Date().toISOString() })
        .eq("id", sessionId);
      setBusy(false);
      if (error) { toast.error(error.message); return; }
    }
    setRevealed(false);
    setAnswerCount(0);
    loadAll();
  }

  async function endNow() {
    if (!confirm("O'yin to'xtatilsinmi?")) return;
    await supabase.from("game_sessions")
      .update({ status: "ended", ended_at: new Date().toISOString() }).eq("id", sessionId);
    loadAll();
  }

  function copyPin() {
    if (!session) return;
    navigator.clipboard.writeText(session.pin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return <div className="h-96 rounded-2xl border border-border/40 bg-card/30 animate-pulse" />;
  }

  if (!session || !game) {
    return (
      <div className="text-center py-20">
        <Monitor className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
        <p className="text-muted-foreground mb-6">{t.lg.sessionNotFound}</p>
        <Link href="/t-lesson-games" className="btn-primary py-2.5 px-5 text-sm">O&apos;yinlar</Link>
      </div>
    );
  }

  /* ===== LOBBI ===== */
  if (session.status === "lobby") {
    return (
      <div className="space-y-8">
        <Link href="/t-lesson-games" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" /> O&apos;yinlar
        </Link>

        <div className="text-center">
          <p className="eyebrow mb-2">{game.title}</p>
          <h1 className="font-display font-extrabold text-2xl mb-8">
            O&apos;quvchilar qo&apos;shilishini kuting
          </h1>

          <div className="inline-block p-8 rounded-3xl bg-neon-purple/[0.07] border-2 border-neon-purple/25">
            <p className="eyebrow mb-3">{t.lg.joinPin}</p>
            <p className="font-display font-extrabold text-6xl sm:text-7xl tracking-[0.15em] text-neon-purple">
              {session.pin}
            </p>
            <button onClick={copyPin} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground">
              {copied ? <Check className="w-4 h-4 text-neon-green" /> : <Copy className="w-4 h-4" />}
              {copied ? "Nusxalandi" : "Nusxalash"}
            </button>
          </div>

          <p className="text-muted-foreground mt-6">
            Telefondan <b className="text-foreground">educode</b> saytining{" "}
            <code className="px-2 py-1 rounded bg-surface border border-border">/live</code>{" "}
            sahifasiga kirib PIN kiritsin
          </p>
        </div>

        {/* Qo'shilganlar */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="eyebrow inline-flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" /> Qo&apos;shilganlar
            </h2>
            <span className="numeric text-2xl font-display font-bold">{players.length}</span>
          </div>

          {players.length === 0 ? (
            <p className="text-center text-muted-foreground py-10 border border-dashed border-border rounded-2xl">
              {t.lg.nobodyJoined}
            </p>
          ) : (
            <div className="flex flex-wrap gap-2 justify-center">
              <AnimatePresence>
                {players.map(p => (
                  <motion.span
                    key={p.id}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="px-4 py-2.5 rounded-xl bg-card border border-border font-semibold"
                  >
                    {p.nickname}
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <button
            onClick={start}
            disabled={busy || players.length === 0 || questions.length === 0}
            className="btn-primary py-3.5 px-10 text-base inline-flex items-center gap-2 disabled:opacity-40"
          >
            {busy ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
            Boshlash
          </button>
        </div>
        {players.length === 0 && (
          <p className="text-center text-sm text-muted-foreground -mt-4">
            {t.lg.needOneStudent}
          </p>
        )}
      </div>
    );
  }

  /* ===== YAKUN ===== */
  if (session.status === "ended") {
    const top = players.slice(0, 3);
    return (
      <div className="space-y-8 text-center">
        <div>
          <Trophy className="w-14 h-14 text-neon-yellow mx-auto mb-4" />
          <h1 className="font-display font-extrabold text-3xl">O&apos;yin tugadi</h1>
          <p className="text-muted-foreground mt-1">{game.title}</p>
        </div>

        {top.length > 0 && (
          <div className="flex items-end justify-center gap-3 max-w-lg mx-auto">
            {[1, 0, 2].map(pos => {
              const p = top[pos];
              if (!p) return <div key={pos} className="flex-1" />;
              const heights = ["h-32", "h-24", "h-20"];
              return (
                <div key={p.id} className="flex-1">
                  <p className="font-semibold text-sm truncate mb-1">{p.nickname}</p>
                  <p className="numeric text-sm text-neon-yellow mb-2">{p.score}</p>
                  <div className={cn(
                    "rounded-t-xl border border-b-0 flex items-center justify-center font-display font-extrabold text-2xl",
                    heights[pos],
                    pos === 0 ? "bg-neon-yellow/15 border-neon-yellow/30 text-neon-yellow"
                      : "bg-surface border-border text-muted-foreground"
                  )}>
                    {pos + 1}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="max-w-lg mx-auto text-left">
          <h2 className="eyebrow mb-2">To&apos;liq reyting</h2>
          <ul className="space-y-1.5">
            {players.map((p, i) => (
              <li key={p.id} className="flex items-center gap-3 p-3 rounded-xl border border-border/60 bg-card/40">
                <span className="numeric text-sm text-muted-foreground w-6">{i + 1}</span>
                <span className="flex-1 min-w-0 truncate font-medium text-sm">{p.nickname}</span>
                <span className="text-xs text-muted-foreground">
                  <span className="numeric">{p.correct_count}</span>/{questions.length}
                </span>
                <span className="numeric font-semibold text-neon-yellow">{p.score}</span>
              </li>
            ))}
          </ul>
        </div>

        <Link href="/t-lesson-games" className="btn-primary py-2.5 px-6 text-sm inline-block">
          O&apos;yinlarga qaytish
        </Link>
      </div>
    );
  }

  /* ===== SAVOL ===== */
  const timeUp = left <= 0;
  const showAnswers = revealed || timeUp;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <span className="eyebrow">
          Savol <span className="numeric">{session.current_index + 1}</span>/<span className="numeric">{questions.length}</span>
        </span>
        <div className="flex items-center gap-5">
          <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <Users className="w-4 h-4" /><span className="numeric">{answerCount}</span>/<span className="numeric">{players.length}</span> {t.lg.answered}
          </span>
          <span className={cn(
            "inline-flex items-center gap-1.5 font-display font-bold text-2xl",
            left <= 5 ? "text-neon-red" : "text-foreground"
          )}>
            <Clock className="w-5 h-5" /><span className="numeric">{left}</span>
          </span>
        </div>
      </div>

      <div className="h-2 rounded-full bg-surface overflow-hidden">
        <motion.div
          className={cn("h-full", left <= 5 ? "bg-neon-red" : "progress-gradient")}
          animate={{ width: `${q ? (left / (q.seconds || 20)) * 100 : 0}%` }}
          transition={{ duration: 0.4, ease: "linear" }}
        />
      </div>

      <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-center text-balance py-8">
        {q?.text}
      </h1>

      <div className="grid sm:grid-cols-2 gap-3">
        {q?.options.map((o, i) => {
          const shape = LIVE_SHAPES[i % 4];
          return (
            <div
              key={i}
              className={cn(
                "flex items-center gap-4 p-6 rounded-2xl text-white font-semibold text-xl sm:text-2xl transition-all",
                shape.cls,
                showAnswers && !o.correct && "opacity-30",
                showAnswers && o.correct && "ring-4 ring-white/70"
              )}
            >
              <span className="text-3xl leading-none opacity-90">{shape.label}</span>
              <span className="flex-1">{o.text}</span>
              {showAnswers && o.correct && <Check className="w-8 h-8" />}
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
        <button onClick={endNow} className="btn-ghost py-2.5 px-5 text-sm inline-flex items-center gap-2">
          <Square className="w-4 h-4" /> To&apos;xtatish
        </button>

        <div className="flex gap-3">
          {!showAnswers && (
            <button onClick={() => setRevealed(true)} className="btn-ghost py-2.5 px-5 text-sm">
              {t.lg.revealAnswer}
            </button>
          )}
          <button onClick={next} disabled={busy} className="btn-primary py-2.5 px-6 text-sm inline-flex items-center gap-2 disabled:opacity-50">
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <SkipForward className="w-4 h-4" />}
            {isLast ? "Yakunlash" : t.lg.nextQuestion}
          </button>
        </div>
      </div>

      {/* Joriy reyting */}
      {players.length > 0 && (
        <div className="pt-4 border-t border-border/50">
          <h2 className="eyebrow mb-2">Yetakchilar</h2>
          <div className="flex flex-wrap gap-2">
            {players.slice(0, 5).map((p, i) => (
              <span key={p.id} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-card border border-border text-sm">
                <span className="numeric text-xs text-muted-foreground">{i + 1}</span>
                <span className="font-medium">{p.nickname}</span>
                <span className="numeric text-neon-yellow">{p.score}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
