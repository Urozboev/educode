"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { RotateCcw, Check, Shuffle, Target, Lightbulb } from "lucide-react";
import { useI18n } from "@/lib/i18n";

/**
 * Ikkilik sanoq sistemasi laboratoriyasi.
 *
 * Ikki rejim: erkin o'ynash (bitlarni bosib, o'nlik qiymat qanday
 * o'zgarishini ko'rish) va mashq (berilgan sonni ikkilikda yig'ish).
 * Har bit ustida uning o'rin qiymati (2^n) turadi — o'quvchi qo'shish
 * orqali natijaga kelayotganini ko'radi.
 */

const BITS = 8;
const WEIGHTS = Array.from({ length: BITS }, (_, i) => 2 ** (BITS - 1 - i)); // 128..1

type Mode = "explore" | "practice";

export function BinaryLab() {
  const { t } = useI18n();
  const [mode, setMode] = useState<Mode>("explore");
  const [bits, setBits] = useState<boolean[]>(() => Array(BITS).fill(false));
  const [target, setTarget] = useState(() => randomTarget());
  const [solved, setSolved] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const value = useMemo(
    () => bits.reduce((sum, on, i) => sum + (on ? WEIGHTS[i] : 0), 0),
    [bits]
  );

  const isMatch = mode === "practice" && value === target;

  // To'g'ri topilganda keyingi songa o'tamiz
  useEffect(() => {
    if (!isMatch) return;
    const t = setTimeout(() => {
      setSolved(s => s + 1);
      setTarget(randomTarget());
      setBits(Array(BITS).fill(false));
      setShowHint(false);
    }, 1200);
    return () => clearTimeout(t);
  }, [isMatch]);

  function toggle(i: number) {
    if (isMatch) return;
    setBits(b => b.map((v, idx) => idx === i ? !v : v));
  }

  function reset() {
    setBits(Array(BITS).fill(false));
    setShowHint(false);
  }

  const onBits = bits.map((on, i) => on ? WEIGHTS[i] : 0).filter(Boolean);

  return (
    <div className="space-y-6">
      {/* Rejim */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="inline-flex rounded-xl border border-border p-1 bg-surface/40">
          {([
            { v: "explore", label: "Erkin" },
            { v: "practice", label: "Mashq" },
          ] as const).map(m => (
            <button
              key={m.v}
              onClick={() => { setMode(m.v); reset(); setTarget(randomTarget()); }}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-semibold transition-all",
                mode === m.v ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {m.label}
            </button>
          ))}
        </div>

        {mode === "practice" && (
          <span className="text-sm text-muted-foreground">
            {t.labs.found} <span className="numeric text-foreground">{solved}</span>
          </span>
        )}
      </div>

      {/* Maqsad */}
      {mode === "practice" && (
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-neon-purple/[0.06] border border-neon-purple/20">
          <p className="inline-flex items-center gap-2 text-sm">
            <Target className="w-4 h-4 text-neon-purple flex-shrink-0" />
            Ushbu sonni ikkilik ko&apos;rinishda yig&apos;ing:
            <span className="numeric text-2xl text-neon-purple">{target}</span>
          </p>
          <button
            onClick={() => setShowHint(h => !h)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            <Lightbulb className="w-3.5 h-3.5" /> {showHint ? "Maslahatni yashirish" : "Maslahat"}
          </button>
        </div>
      )}

      {showHint && mode === "practice" && (
        <motion.p
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-muted-foreground -mt-3"
        >
          Eng katta o&apos;rin qiymatidan boshlang: {target} dan kichik yoki teng eng katta
          darajani tanlang, qolganini ayiring va davom eting.
        </motion.p>
      )}

      {/* Bitlar */}
      <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-1.5 sm:gap-2 justify-center min-w-max mx-auto">
          {bits.map((on, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <span className="numeric text-[10px] sm:text-xs text-muted-foreground">{WEIGHTS[i]}</span>
              <button
                onClick={() => toggle(i)}
                aria-pressed={on}
                aria-label={`${WEIGHTS[i]} o'rin qiymati`}
                className={cn(
                  "w-9 h-12 sm:w-12 sm:h-16 rounded-lg border-2 font-display font-extrabold text-lg sm:text-2xl transition-all",
                  on
                    ? "bg-neon-purple/[0.14] border-neon-purple text-neon-purple"
                    : "bg-card border-border text-muted-foreground/40 hover:border-neon-purple/40"
                )}
              >
                {on ? 1 : 0}
              </button>
              <span className="numeric text-[9px] text-muted-foreground/50">2{sup(BITS - 1 - i)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Hisob */}
      <div className="p-5 rounded-xl border border-border bg-surface/30 text-center space-y-2">
        <p className="font-mono text-sm text-muted-foreground break-all">
          {bits.map(b => b ? 1 : 0).join("")}
        </p>
        {onBits.length > 0 ? (
          <p className="text-sm text-muted-foreground">
            {onBits.join(" + ")} =
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">Bitta ham bit yoqilmagan</p>
        )}
        <motion.p
          key={value}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          className={cn(
            "numeric text-4xl sm:text-5xl",
            isMatch ? "text-neon-green" : "text-foreground"
          )}
        >
          {value}
        </motion.p>
      </div>

      <AnimatePresence>
        {isMatch && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center gap-2 p-4 rounded-xl bg-neon-green/[0.07] border border-neon-green/25"
          >
            <Check className="w-5 h-5 text-neon-green" />
            <span className="font-semibold text-neon-green">To&apos;g&apos;ri! Keyingi son tayyorlanmoqda</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button onClick={reset} className="btn-ghost py-2.5 px-5 text-sm inline-flex items-center gap-2">
          <RotateCcw className="w-4 h-4" /> Tozalash
        </button>
        {mode === "practice" && (
          <button
            onClick={() => { setTarget(randomTarget()); reset(); }}
            className="btn-ghost py-2.5 px-5 text-sm inline-flex items-center gap-2"
          >
            <Shuffle className="w-4 h-4" /> Boshqa son
          </button>
        )}
      </div>

      {mode === "explore" && (
        <div className="p-4 rounded-xl border border-border bg-surface/30 text-sm text-muted-foreground leading-relaxed">
          {t.labs.bitPrefix} <b className="text-foreground">{t.labs.bitWord}</b>{t.labs.bitExplain}
          {t.labs.bytePrefix} <b className="text-foreground">{t.labs.byteWord}</b>{t.labs.byteExplain}
        </div>
      )}
    </div>
  );
}

/** 1..255 oralig'ida — nol bo'lsa mashq ma'nosiz bo'ladi */
function randomTarget() {
  return Math.floor(Math.random() * 255) + 1;
}

/** Yuqori indeks: 2⁷, 2⁶ ... */
function sup(n: number): string {
  const map = ["⁰", "¹", "²", "³", "⁴", "⁵", "⁶", "⁷", "⁸", "⁹"];
  return String(n).split("").map(d => map[+d]).join("");
}
