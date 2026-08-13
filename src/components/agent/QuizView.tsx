"use client";

/**
 * Darsdan keyingi test va natija.
 *
 * Natijadan keyin agent rejani o'zgartirishi mumkin — shuning uchun
 * bu ekran shunchaki ball ko'rsatmaydi, balki "endi nima bo'ladi"ni
 * ham aytadi: keyingi modul ochildimi, yoki rejaga qo'shimcha
 * amaliyot qo'shildimi.
 */

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Loader2, Check, X, ArrowRight, RotateCcw, BookOpen, PartyPopper, ListChecks,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Option { id: string; text: string }
interface Question {
  id: number;
  question: string;
  difficulty: string;
  options: Option[];
}

interface FeedbackItem {
  id: number;
  given: string | null;
  correct: string;
  isCorrect: boolean;
  explanation: string;
}

interface Decision {
  outcome: "passed" | "retry" | "remedial";
  masteryScore: number;
  remedialTitle: string | null;
  message: string;
  trackCompleted: boolean;
}

interface Result {
  score: number;
  correctCount: number;
  total: number;
  feedback: FeedbackItem[];
}

export default function QuizView({
  moduleId,
  onBackToLesson,
}: {
  moduleId: string;
  onBackToLesson: () => void;
}) {
  const router = useRouter();

  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<Result | null>(null);
  const [decision, setDecision] = useState<Decision | null>(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const start = useCallback(async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setDecision(null);
    setAnswers({});

    try {
      const res = await fetch("/api/agent/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "start", moduleId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Test ochilmadi");

      setAssessmentId(data.assessmentId);
      setQuestions(data.questions);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [moduleId]);

  useEffect(() => { void start(); }, [start]);

  async function submit() {
    if (!assessmentId) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/agent/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "submit", assessmentId, answers }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Baholanmadi");

      setResult(data.result);
      setDecision(data.decision);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="py-24 text-center">
        <Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Test tayyorlanmoqda...</p>
      </div>
    );
  }

  if (error && !questions.length) {
    return (
      <div className="py-16 text-center">
        <p className="mb-4 text-sm text-destructive">{error}</p>
        <button onClick={() => void start()} className="text-sm text-primary hover:underline">
          Qayta urinish
        </button>
      </div>
    );
  }

  /* ---------------- Natija ---------------- */
  if (result && decision) {
    const good = decision.outcome === "passed";

    return (
      <div className="space-y-6 py-6">
        <div className={cn(
          "rounded-2xl border p-6 text-center",
          good ? "border-primary bg-primary/5" : "border-border",
        )}>
          <div className={cn(
            "mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl",
            good ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground",
          )}>
            {good ? <PartyPopper className="h-7 w-7" /> : <RotateCcw className="h-7 w-7" />}
          </div>

          <div className="text-3xl font-bold">{result.score}%</div>
          <p className="mt-1 text-sm text-muted-foreground">
            {result.correctCount} / {result.total} to'g'ri javob
          </p>

          <p className="mx-auto mt-4 max-w-md text-sm">{decision.message}</p>

          <div className="mt-3 text-xs text-muted-foreground">
            Mavzu bo'yicha o'zlashtirish: {decision.masteryScore}%
          </div>
        </div>

        {/* Har savol bo'yicha izoh */}
        <div className="space-y-3">
          {questions.map((q, idx) => {
            const fb = result.feedback.find((f) => f.id === q.id);
            if (!fb) return null;

            return (
              <div key={q.id} className="rounded-2xl border border-border p-4">
                <div className="mb-2 flex items-start gap-3">
                  <span className={cn(
                    "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                    fb.isCorrect ? "bg-primary text-primary-foreground" : "bg-destructive/15 text-destructive",
                  )}>
                    {fb.isCorrect ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                  </span>
                  <p className="text-sm font-medium leading-relaxed">{idx + 1}. {q.question}</p>
                </div>

                {!fb.isCorrect && (
                  <div className="ml-9 space-y-1 text-sm">
                    <p className="text-muted-foreground">
                      Sizning javobingiz:{" "}
                      <span className="text-destructive">
                        {q.options.find((o) => o.id === fb.given)?.text || "javob berilmadi"}
                      </span>
                    </p>
                    <p className="text-muted-foreground">
                      To'g'ri javob:{" "}
                      <span className="font-medium text-foreground">
                        {q.options.find((o) => o.id === fb.correct)?.text}
                      </span>
                    </p>
                  </div>
                )}

                {fb.explanation && (
                  <p className="ml-9 mt-2 text-sm text-muted-foreground">{fb.explanation}</p>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row">
          {decision.outcome === "retry" ? (
            <>
              <button
                onClick={onBackToLesson}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground"
              >
                <BookOpen className="h-4 w-4" />
                Darsni qayta o'qish
              </button>
              <button
                onClick={() => void start()}
                className="flex items-center justify-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-medium hover:bg-muted"
              >
                <RotateCcw className="h-4 w-4" />
                Testni qayta topshirish
              </button>
            </>
          ) : (
            <Link
              href="/agent/reja"
              onClick={() => router.refresh()}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground"
            >
              <ListChecks className="h-4 w-4" />
              {decision.trackCompleted ? "Rejani ko'rish" : "Rejaga o'tish"}
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    );
  }

  /* ---------------- Savollar ---------------- */
  const answered = Object.keys(answers).length;

  return (
    <div className="space-y-5 py-6">
      <div>
        <h2 className="text-xl font-bold">Mavzuni tekshiramiz</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {questions.length} ta savol. Bilmasangiz &quot;Bilmayman&quot; ni tanlang — tavakkal
          qilingan javob mavzuni o'zlashtirilgan deb belgilab, sizni oldinga o'tkazib yuboradi.
        </p>
      </div>

      {questions.map((q, idx) => (
        <div key={q.id} className="rounded-2xl border border-border p-5">
          <div className="mb-3 flex items-start gap-3">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
              {idx + 1}
            </span>
            <p className="whitespace-pre-wrap text-sm font-medium leading-relaxed">{q.question}</p>
          </div>

          <div className="ml-9 space-y-2">
            {q.options.map((opt) => {
              const selected = answers[String(q.id)] === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setAnswers((a) => ({ ...a, [String(q.id)]: opt.id }))}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border px-4 py-2.5 text-left text-sm transition-colors",
                    selected ? "border-primary bg-primary/5 font-medium" : "border-border hover:bg-muted",
                  )}
                >
                  <span className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px]",
                    selected ? "border-primary bg-primary text-primary-foreground" : "border-border",
                  )}>
                    {selected ? <Check className="h-3 w-3" /> : opt.id.toUpperCase()}
                  </span>
                  {opt.text}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="sticky bottom-4 flex items-center gap-3 rounded-2xl border border-border bg-background/95 p-4 backdrop-blur">
        <button onClick={onBackToLesson} className="text-sm text-muted-foreground hover:text-foreground">
          Darsga qaytish
        </button>
        <span className="ml-auto text-sm text-muted-foreground">
          {answered}/{questions.length}
        </span>
        <button
          onClick={submit}
          disabled={submitting || answered < questions.length}
          className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-40"
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
          Yakunlash
        </button>
      </div>
    </div>
  );
}
