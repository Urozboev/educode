"use client";

import { useState, useEffect } from "react";
import type { CrosswordContent } from "@/types";
import { buildCrossword, buildGrid, cellKey, normalizeAnswer } from "@/lib/crossword";
import { cn } from "@/lib/utils";
import { Plus, Trash2, Wand2, AlertTriangle } from "lucide-react";

type Entry = { answer: string; clue: string };

/**
 * Krossvord muharriri.
 *
 * O'qituvchi so'z va ta'rifni kiritadi, "To'rni yaratish" bosilganda joylashuv
 * hisoblanadi va natija ko'rsatiladi. Saqlanadigan `content` — tayyor to'r,
 * shuning uchun o'yin har ochilganda bir xil bo'ladi.
 */
export function CrosswordEditor({
  content,
  onChange,
}: {
  content: CrosswordContent;
  onChange: (c: CrosswordContent) => void;
}) {
  // Mavjud to'rdan so'zlar ro'yxatini tiklaymiz (tahrirlash uchun)
  const [entries, setEntries] = useState<Entry[]>(() =>
    content.words?.length
      ? content.words.map(w => ({ answer: w.answer, clue: w.clue }))
      : [{ answer: "", clue: "" }, { answer: "", clue: "" }, { answer: "", clue: "" }]
  );
  const [skipped, setSkipped] = useState<string[]>([]);
  const [built, setBuilt] = useState(!!content.words?.length);

  // So'z ro'yxati o'zgarsa, oldingi to'r eskirgan hisoblanadi
  useEffect(() => { setBuilt(false); }, [entries]);

  function set(i: number, patch: Partial<Entry>) {
    setEntries(e => e.map((x, xi) => xi === i ? { ...x, ...patch } : x));
  }

  function generate() {
    const usable = entries.filter(e => normalizeAnswer(e.answer).length >= 2 && e.clue.trim());
    const { content: built, skipped } = buildCrossword(usable);
    onChange(built);
    setSkipped(skipped);
    setBuilt(true);
  }

  const grid = built && content.words?.length ? buildGrid(content) : null;
  const usableCount = entries.filter(e => normalizeAnswer(e.answer).length >= 2 && e.clue.trim()).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-sm">
          So&apos;zlar <span className="numeric text-muted-foreground">({usableCount})</span>
        </h3>
        <button
          type="button"
          onClick={() => setEntries(e => [...e, { answer: "", clue: "" }])}
          className="text-xs font-semibold text-neon-purple hover:underline inline-flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" /> So&apos;z qo&apos;shish
        </button>
      </div>

      <p className="text-xs text-muted-foreground">
        Javobdagi apostrof va bo&apos;shliqlar olib tashlanadi:
        <span className="font-mono"> o&apos;zgaruvchi → OZGARUVCHI</span>
      </p>

      {entries.map((e, i) => (
        <div key={i} className="grid sm:grid-cols-[24px_180px_1fr_40px] gap-2 items-center">
          <span className="numeric text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
          <input
            value={e.answer}
            onChange={ev => set(i, { answer: ev.target.value })}
            className="input-field text-sm uppercase"
            placeholder="Javob (so'z)"
          />
          <input
            value={e.clue}
            onChange={ev => set(i, { clue: ev.target.value })}
            className="input-field text-sm"
            placeholder="Ta'rif / savol"
          />
          {entries.length > 2 && (
            <button
              type="button"
              onClick={() => setEntries(x => x.filter((_, xi) => xi !== i))}
              className="p-2.5 rounded-lg text-muted-foreground hover:text-neon-red hover:bg-neon-red/10"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={generate}
        disabled={usableCount < 2}
        className="btn-ghost py-2.5 px-5 text-sm inline-flex items-center gap-2 disabled:opacity-40"
      >
        <Wand2 className="w-4 h-4" /> To&apos;rni yaratish
      </button>

      {skipped.length > 0 && (
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-neon-yellow/[0.07] border border-neon-yellow/25 text-sm">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-neon-yellow" />
          <div className="leading-relaxed">
            <p className="font-semibold mb-0.5">To&apos;rga sig&apos;madi: {skipped.join(", ")}</p>
            <p className="text-muted-foreground text-xs">
              Bu so&apos;zlarning boshqalar bilan umumiy harfi topilmadi. Ularni
              o&apos;zgartiring yoki umumiy harfi bor so&apos;z qo&apos;shing.
            </p>
          </div>
        </div>
      )}

      {/* Ko'rib chiqish */}
      {grid && content.rows > 0 && (
        <div>
          <p className="eyebrow mb-2">
            Natija: <span className="numeric">{content.words.length}</span> so&apos;z,{" "}
            <span className="numeric">{content.rows}</span>×<span className="numeric">{content.cols}</span>
          </p>
          <div className="overflow-x-auto p-3 rounded-xl bg-surface/40 border border-border">
            <div
              className="inline-grid gap-[2px]"
              style={{ gridTemplateColumns: `repeat(${content.cols}, minmax(0, 1fr))` }}
            >
              {Array.from({ length: content.rows }).map((_, r) =>
                Array.from({ length: content.cols }).map((_, c) => {
                  const cell = grid.get(cellKey(r, c));
                  return (
                    <div
                      key={cellKey(r, c)}
                      className={cn(
                        "relative w-7 h-7 flex items-center justify-center rounded-[2px] text-[11px] font-display font-bold",
                        cell ? "bg-card border border-border" : "bg-transparent"
                      )}
                    >
                      {cell?.num != null && (
                        <span className="absolute top-0 left-0.5 numeric text-[7px] leading-none text-muted-foreground">
                          {cell.num}
                        </span>
                      )}
                      {cell?.ch}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {!built && usableCount >= 2 && (
        <p className="text-xs text-neon-yellow">
          So&apos;zlar o&apos;zgardi — saqlashdan oldin &laquo;To&apos;rni yaratish&raquo;ni bosing
        </p>
      )}
    </div>
  );
}
