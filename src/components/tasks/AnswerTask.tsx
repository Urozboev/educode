"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getCurrentUser } from "@/lib/supabase/user";
import { checkAnswers } from "@/lib/task-answers";
import type { TopicTask } from "@/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { CheckCircle2, XCircle, Loader2, Send, RotateCcw } from "lucide-react";

/**
 * `answer` topshirig'i: talaba hisob-kitob natijasini kiritadi.
 *
 * Tekshiruv darhol, brauzerda — kod topshiriqlari ham testlarni
 * shu yerda (Pyodide'da) ishga tushiradi, ya'ni ishonch modeli bir xil.
 * Har bir urinish `submissions` ga yoziladi: o'qituvchi talaba necha
 * marta urinib ko'rganini va qaysi maydonda adashganini ko'radi.
 *
 * Noto'g'ri maydon belgilanadi, lekin to'g'ri javob ko'rsatilmaydi —
 * aks holda topshiriq "ikkinchi urinishda ko'chirib yozish"ga aylanadi.
 */
export default function AnswerTask({
  task,
  solved,
  onSolved,
}: {
  task: TopicTask;
  solved: boolean;
  onSolved: () => void;
}) {
  const supabase = createClient();
  const fields = task.answer_spec?.fields ?? [];
  const [values, setValues] = useState<string[]>(() => fields.map(() => ""));
  const [result, setResult] = useState<boolean[] | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [busy, setBusy] = useState(false);

  // Topshiriq almashganda holat tozalanadi
  useEffect(() => {
    setValues(fields.map(() => ""));
    setResult(null);
    setAttempts(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task.id]);

  const allFilled = values.every((v) => v.trim() !== "");
  const allCorrect = !!result && result.every(Boolean);

  async function submit() {
    if (!allFilled || busy) return;
    setBusy(true);
    const res = checkAnswers(fields, values);
    setResult(res);
    setAttempts((a) => a + 1);
    const ok = res.every(Boolean);
    const passed = res.filter(Boolean).length;

    const user = await getCurrentUser(supabase);
    if (user) {
      const { error } = await supabase.from("submissions").insert({
        user_id: user.id,
        task_id: task.id,
        task_type: "topic_task",
        language: "answer",
        code: JSON.stringify(values),
        status: ok ? "accepted" : "wrong_answer",
        passed_tests: passed,
        total_tests: fields.length,
        test_results: res.map((r, i) => ({ field: fields[i].label, passed: r })),
      });
      if (error) toast.error(`Saqlashda xato: ${error.message}`);
    }

    setBusy(false);
    if (ok) onSolved();
    else toast.error(`${passed}/${fields.length} to'g'ri. Belgilangan maydonlarni qayta hisoblang.`);
  }

  function reset() {
    setValues(fields.map(() => ""));
    setResult(null);
  }

  if (fields.length === 0) {
    return <div className="glass-card p-6 text-sm text-muted-foreground">Topshiriq sozlanmagan.</div>;
  }

  return (
    <div className="glass-card p-5 space-y-4">
      {solved && !result && (
        <div className="flex items-center gap-2 rounded-xl border border-neon-green/30 bg-neon-green/[0.07] px-3.5 py-2.5 text-sm">
          <CheckCircle2 className="w-4 h-4 text-neon-green shrink-0" />
          Bu topshiriqni avval to'g'ri bajargansiz. Xohlasangiz qayta yechib ko'ring.
        </div>
      )}

      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        {fields.map((f, i) => {
          const state = result ? (result[i] ? "ok" : "bad") : null;
          return (
            <div key={i} className="space-y-1.5">
              <label htmlFor={`ans-${task.id}-${i}`} className="text-sm font-semibold flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-neon-purple/10 text-neon-purple text-[11px] font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                {f.label}
                {state === "ok" && <CheckCircle2 className="w-4 h-4 text-neon-green" aria-label="to'g'ri" />}
                {state === "bad" && <XCircle className="w-4 h-4 text-neon-red" aria-label="noto'g'ri" />}
              </label>

              {f.type === "choice" && f.options ? (
                <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={f.label}>
                  {f.options.map((o) => (
                    <button
                      key={o}
                      type="button"
                      role="radio"
                      aria-checked={values[i] === o}
                      onClick={() => {
                        const next = [...values];
                        next[i] = o;
                        setValues(next);
                        setResult(null);
                      }}
                      className={cn(
                        "px-3.5 py-2 rounded-xl text-sm border transition-all",
                        values[i] === o
                          ? "bg-foreground text-background border-foreground"
                          : "bg-surface/60 border-border hover:bg-surface",
                      )}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    id={`ans-${task.id}-${i}`}
                    value={values[i]}
                    onChange={(e) => {
                      const next = [...values];
                      next[i] = e.target.value;
                      setValues(next);
                      setResult(null);
                    }}
                    inputMode={f.type === "number" ? "decimal" : "text"}
                    autoComplete="off"
                    spellCheck={false}
                    placeholder={f.placeholder ?? (f.type === "ip" ? "masalan: 192.168.1.0" : "")}
                    className={cn(
                      "input-field flex-1 text-sm",
                      (f.type === "ip" || f.type === "number") && "font-mono",
                      state === "ok" && "border-neon-green/60",
                      state === "bad" && "border-neon-red/60",
                    )}
                  />
                  {f.unit && <span className="text-sm text-muted-foreground shrink-0">{f.unit}</span>}
                </div>
              )}
            </div>
          );
        })}

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            type="submit"
            disabled={!allFilled || busy}
            className="btn-primary py-2.5 px-5 text-sm flex items-center gap-2 disabled:opacity-50"
          >
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Tekshirish
          </button>
          {result && !allCorrect && (
            <button type="button" onClick={reset} className="btn-ghost py-2.5 px-4 text-sm flex items-center gap-2">
              <RotateCcw className="w-4 h-4" /> Tozalash
            </button>
          )}
          {attempts > 0 && <span className="text-xs text-muted-foreground font-mono ml-auto">urinish: {attempts}</span>}
        </div>
      </form>

      {allCorrect && (
        <div className="flex items-center gap-2 rounded-xl border border-neon-green/30 bg-neon-green/[0.07] px-3.5 py-3 text-sm font-medium">
          <CheckCircle2 className="w-5 h-5 text-neon-green shrink-0" />
          Barcha javoblar to'g'ri!
        </div>
      )}
      {result && !allCorrect && attempts >= 3 && (
        <p className="text-xs text-muted-foreground leading-relaxed">
          Bir necha marta urindingiz — chapdagi yordamchi maslahatlarni oching yoki mavzu simulyatsiyasida hisobni qadamma-qadam tekshiring.
        </p>
      )}
    </div>
  );
}
