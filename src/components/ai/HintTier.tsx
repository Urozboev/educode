"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, Lock, Loader2, Coins, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

export interface HintTierItem {
  level: number;             // 1..4
  text: string;
  unlock_cost?: number;      // 0, 2, 5, 10
}

interface Props {
  taskId: string;
  taskType: "topic_task" | "challenge";
  hints: HintTierItem[] | any[];   // backward compat: ['text'] yoki [{text}]
}

const LEVEL_LABELS = ["Umumiy yo'nalish", "Aniqroq yo'nalish", "Konkret qism", "Kod parchasi"];
const DEFAULT_COSTS = [0, 2, 5, 10];

/**
 * Bosqichma-bosqich ochiladigan maslahat tizimi.
 * Har bir daraja uchun talaba REASONING yozadi, keyin coin sarflab ochadi.
 */
export default function HintTier({ taskId, taskType, hints }: Props) {
  const { t } = useI18n();
  const supabase = createClient();
  const [unlocked, setUnlocked] = useState<Record<number, boolean>>({});
  const [reasoning, setReasoning] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState<number | null>(null);
  const [coins, setCoins] = useState<number | null>(null);
  const [expandedLevel, setExpandedLevel] = useState<number | null>(null);

  // Hints'ni 4 darajaga normalizatsiya qilish
  const tieredHints: HintTierItem[] = (hints && hints.length > 0)
    ? hints.map((h: any, i: number) => ({
        level: typeof h?.level === 'number' ? h.level : i + 1,
        text: typeof h === "string" ? h : h?.text || "",
        unlock_cost: typeof h?.unlock_cost === 'number' ? h.unlock_cost : DEFAULT_COSTS[i] ?? 0,
      })).filter(h => h.text).sort((a, b) => a.level - b.level)
    : [];

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: prof } = await supabase.from('profiles').select('coins').eq('id', user.id).single();
      if (prof) setCoins(prof.coins);
      const { data: rows } = await supabase
        .from('hint_unlocks')
        .select('hint_level')
        .eq('user_id', user.id)
        .eq('task_id', taskId)
        .eq('task_type', taskType);
      if (rows) {
        const map: Record<number, boolean> = {};
        for (const r of rows) map[r.hint_level] = true;
        setUnlocked(map);
      }
    })();
  }, [taskId, taskType, supabase]);

  async function handleUnlock(level: number, cost: number) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { toast.error("Tizimga kiring"); return; }

    const why = (reasoning[level] || "").trim();
    if (level > 1 && why.length < 10) {
      toast.warning(t.misc.hintExplainFirst);
      return;
    }

    if (cost > 0 && (coins ?? 0) < cost) {
      toast.error(`Ushbu maslahat uchun ${cost} coin kerak. Sizda ${coins ?? 0} coin bor.`);
      return;
    }

    // Oldingi daraja ochilganmi?
    if (level > 1 && !unlocked[level - 1]) {
      toast.warning("Avvalgi darajani oching!");
      return;
    }

    setLoading(level);
    try {
      const { error } = await supabase.from('hint_unlocks').insert({
        user_id: user.id,
        task_id: taskId,
        task_type: taskType,
        hint_level: level,
        reasoning: why || null,
        coins_spent: cost,
      });
      if (error) {
        if (error.code === '23505') {
          // duplicate — allaqachon ochilgan
          setUnlocked(p => ({ ...p, [level]: true }));
        } else {
          toast.error(error.message);
          setLoading(null);
          return;
        }
      }

      // Coin yechish
      if (cost > 0) {
        const newCoins = (coins ?? 0) - cost;
        setCoins(newCoins);
        await supabase.from('profiles').update({ coins: newCoins }).eq('id', user.id);
        await supabase.from('coin_transactions').insert({
          user_id: user.id,
          amount: -cost,
          type: 'hint_unlock',
          reference_id: taskId,
          description: `Hint daraja ${level} ochildi`,
          balance_after: newCoins,
        });
      }
      setUnlocked(p => ({ ...p, [level]: true }));
      setExpandedLevel(level);
      toast.success(`Maslahat ${level} ochildi`);
    } catch (e: any) {
      toast.error(e.message);
    }
    setLoading(null);
  }

  if (tieredHints.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-neon-yellow" />
          Bosqichma-bosqich maslahatlar
        </h3>
        {coins !== null && (
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Coins className="w-3.5 h-3.5 text-neon-yellow" /> {coins}
          </span>
        )}
      </div>
      <p className="text-[11px] text-muted-foreground mb-2">
        {t.misc.hintNote}
      </p>

      {tieredHints.map((h) => {
        const level = h.level;
        const isUnlocked = !!unlocked[level];
        const cost = h.unlock_cost ?? 0;
        const isLocked = level > 1 && !unlocked[level - 1];
        return (
          <motion.div
            key={level}
            className={cn(
              "border rounded-xl overflow-hidden transition-colors",
              isUnlocked
                ? "bg-neon-yellow/5 border-neon-yellow/30"
                : isLocked
                ? "bg-surface/30 border-border/50 opacity-60"
                : "bg-surface/50 border-border",
            )}
          >
            <button
              onClick={() => setExpandedLevel(expandedLevel === level ? null : level)}
              className="w-full flex items-center justify-between gap-2 px-3 py-2.5 text-left"
              disabled={isLocked}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className={cn(
                  "w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0",
                  isUnlocked ? "bg-neon-yellow text-background" : "bg-surface border border-border",
                )}>
                  {isUnlocked ? <Check className="w-3.5 h-3.5" /> : level}
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-medium truncate">{LEVEL_LABELS[level - 1] || `Daraja ${level}`}</p>
                  {!isUnlocked && (
                    <p className="text-[10px] text-muted-foreground">
                      {cost === 0 ? "Tekin" : `${cost} coin`}
                      {isLocked && " · oldingi darajani oching"}
                    </p>
                  )}
                </div>
              </div>
              {isLocked ? (
                <Lock className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
              ) : (
                <span className="text-[10px] text-muted-foreground">
                  {expandedLevel === level ? "▲" : "▼"}
                </span>
              )}
            </button>

            <AnimatePresence>
              {expandedLevel === level && !isLocked && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-3 pb-3 space-y-2">
                    {isUnlocked ? (
                      <p className="text-xs leading-relaxed bg-background/40 rounded-lg p-2.5 whitespace-pre-wrap">
                        💡 {h.text}
                      </p>
                    ) : (
                      <>
                        {level > 1 && (
                          <div>
                            <label className="text-[10px] text-muted-foreground block mb-1">
                              {t.hintTier.reasonPrompt}
                            </label>
                            <textarea
                              value={reasoning[level] || ""}
                              onChange={e => setReasoning(p => ({ ...p, [level]: e.target.value }))}
                              placeholder={t.hintTier.placeholder}
                              className="input-field w-full resize-none text-xs"
                              rows={2}
                            />
                          </div>
                        )}
                        <button
                          onClick={() => handleUnlock(level, cost)}
                          disabled={loading === level}
                          className={cn(
                            "w-full py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5",
                            cost === 0
                              ? "bg-neon-green/10 text-neon-green border border-neon-green/30 hover:bg-neon-green/20"
                              : "bg-neon-yellow/10 text-neon-yellow border border-neon-yellow/30 hover:bg-neon-yellow/20",
                          )}
                        >
                          {loading === level
                            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            : <Lightbulb className="w-3.5 h-3.5" />}
                          {cost === 0 ? t.hintTier.unlockFree : `${cost} ${t.hintTier.unlockPaid}`}
                        </button>
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
