"use client";

import { useState, useEffect } from "react";
import Link from "@/components/i18n/Link";
import { createClient } from "@/lib/supabase/client";
import { useI18n } from "@/lib/i18n";
import { withTranslation } from "@/lib/i18n/content";
import type {
  LessonGame, QuizRaceContent, JeopardyContent, MatchPairsContent, CrosswordContent,
} from "@/types";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { QuizRace } from "./QuizRace";
import { Jeopardy } from "./Jeopardy";
import { MatchPairs } from "./MatchPairs";
import { Crossword } from "./Crossword";
import { GameIntro } from "./GameIntro";
import { GAME_TYPES } from "@/lib/lessonGames";
import {
  ArrowLeft, Trophy, RotateCcw, Coins, Zap, Loader2, Gamepad2,
} from "lucide-react";

type Finished = { score: number; maxScore: number; correct: number; total: number };

export function GamePlayer({ slug }: { slug: string }) {
  const { t } = useI18n();
  const supabase = createClient();
  const [game, setGame] = useState<LessonGame | null>(null);
  const [loading, setLoading] = useState(true);
  const [startedAt, setStartedAt] = useState<number>(Date.now());
  const [result, setResult] = useState<Finished | null>(null);
  const [saving, setSaving] = useState(false);
  const [reward, setReward] = useState<{ coins: number; xp: number } | null>(null);
  /** Mukofot berilmasa sababi — o'quvchi jimlikda qolmasligi uchun */
  const [outcome, setOutcome] = useState<string | null>(null);
  const [runKey, setRunKey] = useState(0);
  const { locale } = useI18n();
  /** Qoidalar ko'rsatilgach o'yin boshlanadi — taymer avval ishlab ketmasin */
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("lesson_games")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (data) setGame(await withTranslation(supabase, "lesson_games", data as LessonGame, locale));
      setLoading(false);
      setStartedAt(Date.now());
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, locale]);

  async function finish(r: Finished) {
    setResult(r);
    setSaving(true);

    // Natija faqat login qilganlar uchun saqlanadi — o'qituvchi darsda
    // proyektorda login'siz ham o'ynay olishi kerak
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !game) {
      setSaving(false);
      setOutcome("guest");
      return;
    }

    const { data, error } = await supabase.rpc("finish_lesson_game", {
      p_game_id: game.id,
      p_score: r.score,
      p_max_score: r.maxScore,
      p_correct: r.correct,
      p_total: r.total,
      p_duration: Math.round((Date.now() - startedAt) / 1000),
    });

    setSaving(false);
    if (error) {
      // Xatoning o'zini ko'rsatamiz — "xatolik yuz berdi" hech narsa tushuntirmaydi
      toast.error(error.message || t.lg.saveError);
      setOutcome("error");
      return;
    }
    setOutcome(data?.reason ?? null);
    if (data?.rewarded) setReward({ coins: data.coins, xp: data.xp });
  }

  function replay() {
    setResult(null);
    setReward(null);
    setOutcome(null);
    setPlaying(false);
    setStartedAt(Date.now());
    setRunKey(k => k + 1);
  }

  function start() {
    setPlaying(true);
    setStartedAt(Date.now());
  }

  if (loading) {
    return <div className="max-w-4xl mx-auto h-96 rounded-2xl border border-border/40 bg-card/30 animate-pulse" />;
  }

  if (!game) {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <Gamepad2 className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
        <p className="text-muted-foreground mb-6">{t.lg.gameNotFound}</p>
        <Link href="/explore/lesson-games" className="btn-primary py-2.5 px-5 text-sm">
          O&apos;yinlar ro&apos;yxati
        </Link>
      </div>
    );
  }

  const meta = GAME_TYPES.find(t => t.value === game.type);

  // ===== Yakuniy ekran =====
  if (result) {
    const pct = result.total ? Math.round((result.correct / result.total) * 100) : 0;
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg mx-auto text-center py-10"
      >
        <div className="w-20 h-20 rounded-2xl bg-neon-yellow/10 border border-neon-yellow/25 flex items-center justify-center mx-auto mb-6">
          <Trophy className="w-10 h-10 text-neon-yellow" />
        </div>

        <h1 className="font-display font-extrabold text-3xl tracking-tight mb-2">
          {pct >= 80 ? t.lg.greatResult : pct >= 50 ? "Yaxshi!" : "Yana urinib ko'ring"}
        </h1>
        <p className="text-muted-foreground mb-8">{game.title}</p>

        <div className="grid grid-cols-3 gap-3 mb-8">
          <Stat label="Ball" value={result.score} />
          <Stat label="To'g'ri" value={`${result.correct}/${result.total}`} />
          <Stat label="Foiz" value={`${pct}%`} />
        </div>

        {saving && (
          <p className="text-sm text-muted-foreground mb-6 inline-flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> {t.lg.savingResult}
          </p>
        )}

        {reward && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-4 px-5 py-3 rounded-xl bg-neon-green/[0.07] border border-neon-green/25 mb-8"
          >
            {reward.coins > 0 && (
              <span className="inline-flex items-center gap-1.5 font-semibold text-neon-yellow">
                <Coins className="w-4 h-4" /> +<span className="numeric">{reward.coins}</span>
              </span>
            )}
            {reward.xp > 0 && (
              <span className="inline-flex items-center gap-1.5 font-semibold text-neon-green">
                <Zap className="w-4 h-4" /> +<span className="numeric">{reward.xp}</span> XP
              </span>
            )}
          </motion.div>
        )}

        {/* Mukofot berilmagan bo'lsa sababini aytamiz */}
        {!reward && !saving && outcome && outcome !== "ok" && (
          <p className="text-sm text-muted-foreground mb-8 max-w-sm mx-auto leading-relaxed">
            {{
              already_played: t.lg.savedFirstOnly,
              low_score: t.lg.savedNeedHalf,
              draft: t.lg.savedUnpublished,
              guest: t.lg.loginToSave,
              error: t.lg.saveFailed,
            }[outcome] ?? ""}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button onClick={replay} className="btn-ghost py-2.5 px-5 text-sm inline-flex items-center gap-2">
            <RotateCcw className="w-4 h-4" /> Qaytadan o&apos;ynash
          </button>
          <Link href="/explore/lesson-games" className="btn-primary py-2.5 px-5 text-sm">
            Boshqa o&apos;yinlar
          </Link>
        </div>
      </motion.div>
    );
  }

  // ===== O'yin =====
  return (
    <div>
      <div className="max-w-5xl mx-auto mb-8">
        <Link
          href="/explore/lesson-games"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> O&apos;yinlar
        </Link>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="eyebrow mb-1.5">{meta?.label}</p>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight">{game.title}</h1>
            {game.description && (
              <p className="text-muted-foreground mt-1.5 max-w-xl">{game.description}</p>
            )}
          </div>
        </div>
      </div>

      {!playing && (
        <GameIntro type={game.type} title={game.title} onStart={start} />
      )}

      {/*
        Boshlangunicha o'yin komponenti UMUMAN yaratilmaydi — `hidden` bilan
        yashirish yetarli emas, QuizRace taymeri fon rejimda ishlab ketardi
        va o'quvchi birinchi savolni ko'rmasdan yo'qotardi.
      */}
      {playing && (
        <div key={runKey}>
          {game.type === "quiz_race" && (
            <QuizRace content={game.content as QuizRaceContent} onFinish={finish} />
          )}
          {game.type === "jeopardy" && (
            <Jeopardy content={game.content as JeopardyContent} onFinish={finish} />
          )}
          {game.type === "match_pairs" && (
            <MatchPairs content={game.content as MatchPairsContent} onFinish={finish} />
          )}
          {game.type === "crossword" && (
            <Crossword content={game.content as CrosswordContent} onFinish={finish} />
          )}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="p-4 rounded-xl border border-border bg-card/50">
      <p className="numeric text-2xl">{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
    </div>
  );
}
