"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { completeTopic } from "@/lib/course-completion";
import type { Quiz, QuizOption } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight, CheckCircle2, XCircle, Sparkles, Loader2, RotateCcw, Trophy } from "lucide-react";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
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

  // Savollarni VA variantlarni aralashtirish
  const quizzes = useMemo(() => {
    return shuffle(rawQuizzes).map(q => ({
      ...q,
      options: shuffle(q.options as QuizOption[]),
    }));
  }, [rawQuizzes]);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
      const { data: course } = await supabase.from("courses").select("id").eq("slug", slug).single();
      if (course) setCourseId(course.id);
      const { data: topic } = await supabase.from("topics").select("id").eq("slug", topicSlug).single();
      if (!topic) return;
      setTopicId(topic.id);
      const { data } = await supabase.from("quizzes").select("*").eq("topic_id", topic.id).order("order_index");
      if (data) setRawQuizzes(data as Quiz[]);
      setLoading(false);
    })();
  }, []);

  function handleSelect(quizId: string, optionId: string, type: string) {
    if (submitted) return;
    setSelected(prev => {
      if (type === "single") return { ...prev, [quizId]: [optionId] };
      const current = prev[quizId] || [];
      return { ...prev, [quizId]: current.includes(optionId) ? current.filter(id => id !== optionId) : [...current, optionId] };
    });
  }

  async function handleSubmit() {
    let correct = 0;
    const answers = quizzes.map(q => {
      const sel = selected[q.id] || [];
      const correctOpts = (q.options as QuizOption[]).filter(o => o.is_correct).map(o => o.id);
      const isCorrect = sel.length === correctOpts.length && sel.every(s => correctOpts.includes(s));
      if (isCorrect) correct++;
      return { quiz_id: q.id, selected: sel, is_correct: isCorrect };
    });
    setScore(correct);
    setSubmitted(true);

    const percentage = Math.round((correct / quizzes.length) * 100);
    const passed = percentage >= 60;

    await supabase.from("quiz_results").insert({
      user_id: userId, topic_id: topicId, score: correct, total: quizzes.length, percentage, answers,
    });

    if (passed) {
      await supabase.from("topic_progress").update({ quiz_passed: true, quiz_score: correct, quiz_total: quizzes.length })
        .eq("user_id", userId).eq("topic_id", topicId);

      // Tugatishni tekshirish
      const { data: prog } = await supabase.from("topic_progress").select("*").eq("user_id", userId).eq("topic_id", topicId).single();
      if (prog && prog.content_read && prog.tasks_completed) {
        await completeTopic(supabase, userId, topicId, courseId);
      }
      toast.success(`Test o'tdi! ${correct}/${quizzes.length} 🎉`);
    } else {
      toast.error(`Test o'tmadi. ${correct}/${quizzes.length} (60% kerak)`);
    }
  }

  async function getAIFeedback() {
    setAiLoading(true);
    const wrong = quizzes.filter(q => {
      const sel = selected[q.id] || [];
      const correctOpts = (q.options as QuizOption[]).filter(o => o.is_correct).map(o => o.id);
      return !(sel.length === correctOpts.length && sel.every(s => correctOpts.includes(s)));
    }).map(q => ({ question: q.question, explanation: q.explanation }));

    try {
      const res = await fetch("/api/ai/feedback", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedback_type: "quiz_review", test_results: { score, total: quizzes.length, wrong_answers: wrong } }),
      });
      const data = await res.json();
      setAiFeedback(data.feedback);
    } catch (_e) { toast.error("AI xatolik"); }
    setAiLoading(false);
  }

  function handleRetry() {
    setSelected({}); setSubmitted(false); setScore(0); setAiFeedback(""); setCurrentIdx(0);
    setRawQuizzes([...rawQuizzes]); // Re-shuffle
  }

  if (loading) return <div className="glass-card p-8 h-64 animate-pulse" />;
  if (quizzes.length === 0) return (
    <div className="text-center py-20">
      <p className="text-muted-foreground mb-4">Bu mavzu uchun test mavjud emas</p>
      <Link href={`/courses/${slug}/topics/${topicSlug}`} className="btn-ghost">Mavzuga qaytish</Link>
    </div>
  );

  const percentage = Math.round((score / quizzes.length) * 100);

  // ===== NATIJALAR =====
  if (submitted) {
    return (
      <motion.div className="max-w-2xl mx-auto space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link href={`/courses/${slug}/topics/${topicSlug}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" /> Mavzuga qaytish
        </Link>

        <div className="glass-card p-8 text-center">
          <div className={cn("w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4", percentage >= 60 ? "bg-neon-green/10" : "bg-neon-red/10")}>
            {percentage >= 60 ? <Trophy className="w-10 h-10 text-neon-green" /> : <XCircle className="w-10 h-10 text-neon-red" />}
          </div>
          <h2 className="font-display font-bold text-2xl mb-2">{percentage >= 60 ? "Tabriklaymiz! 🎉" : "Qayta urinib ko'ring"}</h2>
          <div className="font-display font-bold text-5xl mb-2">
            <span className={percentage >= 60 ? "text-neon-green" : "text-neon-red"}>{score}</span>
            <span className="text-muted-foreground text-2xl">/{quizzes.length}</span>
          </div>
          <p className="text-muted-foreground mb-6">{percentage}% to'g'ri</p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <button onClick={handleRetry} className="btn-ghost py-2.5 px-5 flex items-center gap-2 text-sm"><RotateCcw className="w-4 h-4" /> Qayta</button>
            <button onClick={getAIFeedback} disabled={aiLoading} className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium bg-neon-blue/10 text-neon-blue border border-neon-blue/20 hover:bg-neon-blue/20 disabled:opacity-50">
              {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />} AI Tahlil
            </button>
          </div>
        </div>

        {aiFeedback && (
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-3"><Sparkles className="w-5 h-5 text-neon-blue" /><h3 className="font-semibold">AI Tahlil</h3></div>
            <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{aiFeedback}</div>
          </div>
        )}

        {/* Answers */}
        <div className="space-y-3">
          {quizzes.map((q, i) => {
            const sel = selected[q.id] || [];
            const correctOpts = (q.options as QuizOption[]).filter(o => o.is_correct).map(o => o.id);
            const isCorrect = sel.length === correctOpts.length && sel.every(s => correctOpts.includes(s));
            return (
              <div key={q.id} className={cn("glass-card p-5 border-l-4", isCorrect ? "border-l-neon-green" : "border-l-neon-red")}>
                <p className="font-medium text-sm mb-2">{i + 1}. {q.question}</p>
                <div className="space-y-1.5">
                  {(q.options as QuizOption[]).map(opt => (
                    <div key={opt.id} className={cn("flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg",
                      opt.is_correct ? "bg-neon-green/10 text-neon-green" : sel.includes(opt.id) ? "bg-neon-red/10 text-neon-red" : "text-muted-foreground")}>
                      {opt.is_correct ? <CheckCircle2 className="w-4 h-4" /> : sel.includes(opt.id) ? <XCircle className="w-4 h-4" /> : <div className="w-4 h-4" />}
                      {opt.text}
                    </div>
                  ))}
                </div>
                {q.explanation && <p className="text-xs text-muted-foreground mt-2 pt-2 border-t border-border/50">{q.explanation}</p>}
              </div>
            );
          })}
        </div>
      </motion.div>
    );
  }

  // ===== TEST JARAYONI =====
  const current = quizzes[currentIdx];
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link href={`/courses/${slug}/topics/${topicSlug}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4" /> Mavzuga qaytish
      </Link>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-surface rounded-full overflow-hidden">
          <motion.div className="h-full progress-gradient rounded-full" animate={{ width: `${((currentIdx + 1) / quizzes.length) * 100}%` }} />
        </div>
        <span className="text-sm font-mono text-muted-foreground">{currentIdx + 1}/{quizzes.length}</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={currentIdx} className="glass-card p-6 md:p-8" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
          <p className="text-xs text-muted-foreground mb-2">{current.question_type === "multiple" ? "Bir nechtasini tanlang" : "Bitta javobni tanlang"}</p>
          <h2 className="font-display font-semibold text-lg md:text-xl mb-6">{current.question}</h2>
          <div className="space-y-3">
            {(current.options as QuizOption[]).map(opt => {
              const isSelected = (selected[current.id] || []).includes(opt.id);
              return (
                <button key={opt.id} onClick={() => handleSelect(current.id, opt.id, current.question_type)}
                  className={cn("w-full text-left p-4 rounded-xl border-2 transition-all text-sm",
                    isSelected ? "border-neon-purple bg-neon-purple/10" : "border-border hover:border-neon-purple/30 hover:bg-surface text-muted-foreground")}>
                  <span className={cn("inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold mr-3",
                    isSelected ? "bg-neon-purple text-white" : "bg-surface")}>{opt.id.toUpperCase()}</span>
                  {opt.text}
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Answer dots + nav */}
      <div className="flex items-center justify-between">
        <button onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))} disabled={currentIdx === 0}
          className="btn-ghost py-2.5 px-5 text-sm disabled:opacity-30"><ArrowLeft className="w-4 h-4 inline mr-1" /> Oldingi</button>
        <div className="flex gap-1">{quizzes.map((q, i) => (
          <button key={q.id} onClick={() => setCurrentIdx(i)} className={cn("w-3 h-3 rounded-full transition-all",
            i === currentIdx ? "bg-neon-purple scale-125" : selected[q.id] ? "bg-neon-green" : "bg-surface")} />
        ))}</div>
        {currentIdx < quizzes.length - 1 ? (
          <button onClick={() => setCurrentIdx(currentIdx + 1)} className="btn-primary py-2.5 px-5 text-sm">Keyingi <ArrowRight className="w-4 h-4 inline ml-1" /></button>
        ) : (
          <button onClick={handleSubmit} disabled={Object.keys(selected).length < quizzes.length}
            className="btn-primary py-2.5 px-5 text-sm disabled:opacity-50">Tugatish <CheckCircle2 className="w-4 h-4 inline ml-1" /></button>
        )}
      </div>
    </div>
  );
}
