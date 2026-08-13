"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "@/components/i18n/Link";
import { createClient } from "@/lib/supabase/client";
import { completeTopic } from "@/lib/course-completion";
import { useI18n } from "@/lib/i18n";
import { withTranslations } from "@/lib/i18n/content";
import type { Quiz, QuizOption } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Sparkles,
  Loader2,
  RotateCcw,
  Trophy,
} from "lucide-react";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function QuizPage() {
  const { slug, topicSlug } = useParams<{ slug: string; topicSlug: string }>();
  const supabase = createClient();
  const [rawQuizzes, setRawQuizzes] = useState<Quiz[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<Record<string, string[]>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [aiFeedback, setAiFeedback] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [topicId, setTopicId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [userId, setUserId] = useState("");
  const { locale, t } = useI18n();

  const quizzes = useMemo(() => {
    return shuffle(rawQuizzes).map((q) => ({
      ...q,
      options: shuffle(q.options as QuizOption[]),
    }));
  }, [rawQuizzes]);

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
      const { data: course } = await supabase.from("courses").select("id").eq("slug", slug).single();
      if (course) setCourseId(course.id);
      const { data: topic } = await supabase.from("topics").select("id").eq("slug", topicSlug).single();
      if (!topic) return;
      setTopicId(topic.id);
      const { data } = await supabase
        .from("quizzes")
        .select("*")
        .eq("topic_id", topic.id)
        .order("order_index");
      if (data) setRawQuizzes(await withTranslations(supabase, "quizzes", data as Quiz[], locale));
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSelect(quizId: string, optionId: string, type: string) {
    if (submitted) return;
    setSelected((prev) => {
      if (type === "single") return { ...prev, [quizId]: [optionId] };
      const current = prev[quizId] || [];
      return {
        ...prev,
        [quizId]: current.includes(optionId)
          ? current.filter((id) => id !== optionId)
          : [...current, optionId],
      };
    });
  }

  async function handleSubmit() {
    let correct = 0;
    const answers = quizzes.map((q) => {
      const sel = selected[q.id] || [];
      const correctOpts = (q.options as QuizOption[]).filter((o) => o.is_correct).map((o) => o.id);
      const isCorrect = sel.length === correctOpts.length && sel.every((s) => correctOpts.includes(s));
      if (isCorrect) correct++;
      return { quiz_id: q.id, selected: sel, is_correct: isCorrect };
    });
    setScore(correct);
    setSubmitted(true);

    const percentage = Math.round((correct / quizzes.length) * 100);
    const passed = percentage >= 60;

    await supabase.from("quiz_results").insert({
      user_id: userId,
      topic_id: topicId,
      score: correct,
      total: quizzes.length,
      percentage,
      answers,
    });

    if (passed) {
      await supabase
        .from("topic_progress")
        .update({ quiz_passed: true, quiz_score: correct, quiz_total: quizzes.length })
        .eq("user_id", userId)
        .eq("topic_id", topicId);

      const { data: prog } = await supabase
        .from("topic_progress")
        .select("*")
        .eq("user_id", userId)
        .eq("topic_id", topicId)
        .single();
      if (prog && prog.content_read && prog.tasks_completed) {
        await completeTopic(supabase, userId, topicId, courseId);
      }
      toast.success(`Test o'tdi — ${correct}/${quizzes.length}`);
    } else {
      toast.error(`Test o'tmadi. ${correct}/${quizzes.length} (60% kerak)`);
    }
  }

  async function getAIFeedback() {
    setAiLoading(true);
    const wrong = quizzes
      .filter((q) => {
        const sel = selected[q.id] || [];
        const correctOpts = (q.options as QuizOption[]).filter((o) => o.is_correct).map((o) => o.id);
        return !(sel.length === correctOpts.length && sel.every((s) => correctOpts.includes(s)));
      })
      .map((q) => ({ question: q.question, explanation: q.explanation }));

    try {
      const res = await fetch("/api/ai/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          feedback_type: "quiz_review",
          test_results: { score, total: quizzes.length, wrong_answers: wrong },
        }),
      });
      const data = await res.json();
      setAiFeedback(data.feedback);
    } catch (_e) {
      toast.error("AI xatolik");
    }
    setAiLoading(false);
  }

  function handleRetry() {
    setSelected({});
    setSubmitted(false);
    setScore(0);
    setAiFeedback("");
    setCurrentIdx(0);
    setRawQuizzes([...rawQuizzes]);
  }

  if (loading)
    return <div className="h-64 rounded-3xl border border-border/50 bg-card/40 animate-pulse" />;
  if (quizzes.length === 0)
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground mb-4">{t.courses.topic.noQuiz}</p>
        <Link
          href={`/courses/${slug}/topics/${topicSlug}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-surface/60 hover:bg-surface font-semibold text-sm transition"
        >
          <ArrowLeft className="w-4 h-4" /> Mavzuga qaytish
        </Link>
      </div>
    );

  const percentage = Math.round((score / quizzes.length) * 100);
  const passed = percentage >= 60;

  // ===== RESULTS =====
  if (submitted) {
    return (
      <motion.div
        className="max-w-2xl mx-auto space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Link
          href={`/courses/${slug}/topics/${topicSlug}`}
          className="inline-flex items-center gap-2 text-[15px] font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Mavzuga qaytish
        </Link>

        <div className="rounded-3xl border border-border/60 bg-card/40 p-8 md:p-10 text-center">
          <div
            className={cn(
              "w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5 border",
              passed
                ? "bg-neon-green/10 border-neon-green/20"
                : "bg-neon-red/10 border-neon-red/20"
            )}
          >
            {passed ? (
              <Trophy className="w-10 h-10 text-neon-green" />
            ) : (
              <XCircle className="w-10 h-10 text-neon-red" />
            )}
          </div>
          <h2 className="font-display font-extrabold text-2xl md:text-3xl tracking-tight mb-3">
            {passed ? t.courses.topic.congrats : t.courses.topic.tryAgain}
          </h2>
          <div className="font-display font-extrabold text-5xl md:text-6xl mb-2 tracking-tight">
            <span className={passed ? "text-neon-green" : "text-neon-red"}>{score}</span>
            <span className="text-muted-foreground text-3xl">/{quizzes.length}</span>
          </div>
          <p className="text-[15px] text-muted-foreground mb-7">{percentage}% {t.courses.topic.correctAnswers}</p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <button
              onClick={handleRetry}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-surface/60 hover:bg-surface font-semibold text-sm transition"
            >
              <RotateCcw className="w-4 h-4" /> {t.courses.topic.retry}
            </button>
            <button
              onClick={getAIFeedback}
              disabled={aiLoading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neon-blue/10 text-neon-blue border border-neon-blue/20 hover:bg-neon-blue/15 font-semibold text-sm transition disabled:opacity-50"
            >
              {aiLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}{" "}
              AI Tahlil
            </button>
          </div>
        </div>

        {aiFeedback && (
          <div className="rounded-2xl border border-border/60 bg-card/40 p-6">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-neon-blue" />
              <h3 className="font-display font-bold text-lg tracking-tight">AI Tahlil</h3>
            </div>
            <div className="text-[15px] text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {aiFeedback}
            </div>
          </div>
        )}

        <div className="space-y-3">
          {quizzes.map((q, i) => {
            const sel = selected[q.id] || [];
            const correctOpts = (q.options as QuizOption[]).filter((o) => o.is_correct).map((o) => o.id);
            const isCorrect = sel.length === correctOpts.length && sel.every((s) => correctOpts.includes(s));
            return (
              <div
                key={q.id}
                className={cn(
                  "rounded-2xl border bg-card/40 p-5 border-l-4",
                  isCorrect
                    ? "border-border/60 border-l-neon-green"
                    : "border-border/60 border-l-neon-red"
                )}
              >
                <p className="font-semibold text-[15px] mb-3 whitespace-pre-line">
                  {i + 1}. {q.question}
                </p>
                <div className="space-y-1.5">
                  {(q.options as QuizOption[]).map((opt) => (
                    <div
                      key={opt.id}
                      className={cn(
                        "flex items-center gap-2 text-sm px-3 py-2 rounded-lg",
                        opt.is_correct
                          ? "bg-neon-green/10 text-neon-green"
                          : sel.includes(opt.id)
                          ? "bg-neon-red/10 text-neon-red"
                          : "text-muted-foreground"
                      )}
                    >
                      {opt.is_correct ? (
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                      ) : sel.includes(opt.id) ? (
                        <XCircle className="w-4 h-4 flex-shrink-0" />
                      ) : (
                        <div className="w-4 h-4 flex-shrink-0" />
                      )}
                      {opt.text}
                    </div>
                  ))}
                </div>
                {q.explanation && (
                  <p className="text-sm text-muted-foreground mt-3 pt-3 border-t border-border/50 whitespace-pre-line">
                    {q.explanation}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>
    );
  }

  // ===== QUIZ FLOW =====
  const current = quizzes[currentIdx];
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link
        href={`/courses/${slug}/topics/${topicSlug}`}
        className="inline-flex items-center gap-2 text-[15px] font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Mavzuga qaytish
      </Link>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-surface rounded-full overflow-hidden">
          <motion.div
            className="h-full progress-gradient rounded-full"
            animate={{ width: `${((currentIdx + 1) / quizzes.length) * 100}%` }}
          />
        </div>
        <span className="text-sm font-mono font-semibold text-muted-foreground">
          {currentIdx + 1}/{quizzes.length}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          className="rounded-3xl border border-border/60 bg-card/40 p-6 md:p-8"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
            {current.question_type === "multiple" ? t.courses.topic.pickMany : t.courses.topic.pickOne}
          </p>
          {/* Savol matnida kod namunalari ko'p qatorli bo'lishi mumkin —
              qator uzilishlari saqlanadi */}
          <h2 className="font-display font-bold text-xl md:text-2xl tracking-tight mb-6 whitespace-pre-line">
            {current.question}
          </h2>
          <div className="space-y-3">
            {(current.options as QuizOption[]).map((opt) => {
              const isSelected = (selected[current.id] || []).includes(opt.id);
              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelect(current.id, opt.id, current.question_type)}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border-2 transition-all text-[15px]",
                    isSelected
                      ? "border-neon-purple bg-neon-purple/10"
                      : "border-border hover:border-neon-purple/40 hover:bg-surface/60"
                  )}
                >
                  <span
                    className={cn(
                      "inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold mr-3",
                      isSelected ? "bg-neon-purple text-white" : "bg-surface"
                    )}
                  >
                    {opt.id.toUpperCase()}
                  </span>
                  {opt.text}
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
          disabled={currentIdx === 0}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-border bg-surface/60 hover:bg-surface font-semibold text-sm transition disabled:opacity-30"
        >
          <ArrowLeft className="w-4 h-4" /> Oldingi
        </button>
        <div className="flex gap-1.5">
          {quizzes.map((q, i) => (
            <button
              key={q.id}
              onClick={() => setCurrentIdx(i)}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-all",
                i === currentIdx
                  ? "bg-neon-purple scale-125"
                  : selected[q.id]
                  ? "bg-neon-green"
                  : "bg-surface"
              )}
            />
          ))}
        </div>
        {currentIdx < quizzes.length - 1 ? (
          <button
            onClick={() => setCurrentIdx(currentIdx + 1)}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-foreground text-background font-semibold text-sm hover:opacity-90 transition"
          >
            Keyingi <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={Object.keys(selected).length < quizzes.length}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-foreground text-background font-semibold text-sm hover:opacity-90 transition disabled:opacity-50"
          >
            Tugatish <CheckCircle2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
