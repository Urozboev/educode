"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn, getLevelLabel, getLevelColor } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  ArrowRight, ArrowLeft, CheckCircle2, Brain, Sparkles, Loader2,
  BookOpen, Target, XCircle, ChevronRight
} from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface PlacementQuestion {
  id: string; question: string; category: string; difficulty: string;
  options: { id: string; text: string }[]; correct_option: string;
}

interface CategoryResult {
  category: string;
  label: string;
  total: number;
  correct: number;
  percentage: number;
}

export default function PlacementTestPage() {
  const { t } = useI18n();
  const supabase = createClient();
  const router = useRouter();
  const [questions, setQuestions] = useState<PlacementQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userId, setUserId] = useState("");

  // Natijalar
  const [result, setResult] = useState<{
    level: string; score: number; total: number;
    categoryResults: CategoryResult[];
    aiRecommendation: string;
    weakCategory: string;
    recommendedCourse: { title: string; slug: string } | null;
  } | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      setUserId(user.id);

      // Oldin test topshirganmi tekshirish
      const { data: existing } = await supabase.from("placement_results").select("id").eq("user_id", user.id).maybeSingle();
      if (existing) { router.push("/dashboard"); return; }

      // Savollarni yuklash — har kategoriyadan aralashtirish
      const { data } = await supabase.from("placement_tests").select("*").eq("is_active", true).order("order_index");
      if (data && data.length > 0) {
        // Savollarni aralashtirish
        const shuffled = [...data].sort(() => Math.random() - 0.5);
        setQuestions(shuffled as PlacementQuestion[]);
      }
      setLoading(false);
    })();
  }, []);

  function handleSelect(questionId: string, optionId: string) {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
  }

  async function handleSubmit() {
    setSubmitting(true);

    // Natijalarni hisoblash
    let totalScore = 0;
    const categoryMap: Record<string, { total: number; correct: number }> = {};

    questions.forEach(q => {
      const cat = q.category;
      if (!categoryMap[cat]) categoryMap[cat] = { total: 0, correct: 0 };
      categoryMap[cat].total++;

      if (answers[q.id] === q.correct_option) {
        totalScore++;
        categoryMap[cat].correct++;
      }
    });

    const percentage = questions.length > 0 ? (totalScore / questions.length) * 100 : 0;

    // Darajani aniqlash
    let level = "beginner";
    if (percentage >= 80) level = "advanced";
    else if (percentage >= 60) level = "intermediate";
    else if (percentage >= 35) level = "elementary";

    // Kategoriya natijalarini tayyorlash
    const categoryLabels: Record<string, string> = {
      basic_programming: "Dasturlash asoslari", computer_literacy: "Kompyuter savodxonligi",
      prompt_engineering: "Prompt Engineering", logic: "Mantiq", algorithms: "Algoritmlar",
    };

    const categoryResults: CategoryResult[] = Object.entries(categoryMap).map(([cat, data]) => ({
      category: cat, label: categoryLabels[cat] || cat,
      total: data.total, correct: data.correct,
      percentage: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
    }));

    // Eng zaif sohani aniqlash
    const weakest = categoryResults.reduce((min, cr) => cr.percentage < min.percentage ? cr : min, categoryResults[0]);

    // DB ga saqlash
    await supabase.from("placement_results").insert({
      user_id: userId, answers, score: totalScore, total: questions.length, assigned_level: level,
    });
    await supabase.from("profiles").update({ level }).eq("id", userId);

    // Zaif soha bo'yicha kurs topish
    const categoryToCourse: Record<string, string> = {
      basic_programming: "python-basics", computer_literacy: "computer-literacy",
      prompt_engineering: "prompt-engineering", algorithms: "algorithms-ds",
    };
    const courseSlug = categoryToCourse[weakest?.category] || "python-basics";
    const { data: course } = await supabase.from("courses").select("title, slug").eq("slug", courseSlug).eq("is_published", true).single();

    setResult({
      level, score: totalScore, total: questions.length,
      categoryResults, aiRecommendation: "",
      weakCategory: weakest?.label || "",
      recommendedCourse: course ? { title: course.title, slug: course.slug } : null,
    });

    setSubmitting(false);

    // AI tahlil (background da)
    getAIAnalysis(totalScore, questions.length, level, categoryResults);
  }

  async function getAIAnalysis(score: number, total: number, level: string, categories: CategoryResult[]) {
    setAiLoading(true);
    try {
      const res = await fetch("/api/ai/feedback", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          feedback_type: "placement_analysis",
          test_results: {
            score, total, level,
            categories: categories.map(c => ({
              name: c.label, correct: c.correct, total: c.total, percentage: c.percentage,
            })),
          },
        }),
      });
      const data = await res.json();
      if (data.feedback) {
        setResult(prev => prev ? { ...prev, aiRecommendation: data.feedback } : prev);
      }
    } catch (e) { console.error("AI analysis error:", e); }
    setAiLoading(false);
  }

  function handleSkip() {
    // Test topshirmasdan o'tish
    (async () => {
      await supabase.from("placement_results").insert({
        user_id: userId, answers: {}, score: 0, total: 0, assigned_level: "beginner",
        ai_recommendation: "Test topshirilmadi",
      });
      router.push("/dashboard");
    })();
  }

  if (loading) return (
    <div className="w-full max-w-lg"><div className="glass-card p-8 h-64 animate-pulse" /></div>
  );

  // Savol yo'q
  if (questions.length === 0) {
    return (
      <motion.div className="w-full max-w-md text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="glass-card p-8">
          <Brain className="w-14 h-14 text-neon-purple mx-auto mb-4" />
          <h1 className="font-display font-bold text-2xl mb-2">Xush kelibsiz!</h1>
          <p className="text-muted-foreground mb-6">{t.auth.placementEmpty}</p>
          <button onClick={handleSkip} className="btn-primary py-3 px-8">Dashboard ga o'tish</button>
        </div>
      </motion.div>
    );
  }

  // ===== NATIJALAR SAHIFASI =====
  if (result) {
    return (
      <motion.div className="w-full max-w-2xl space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Daraja */}
        <div className="glass-card p-8 text-center">
          <Sparkles className="w-14 h-14 text-neon-purple mx-auto mb-4" />
          <h1 className="font-display font-bold text-2xl mb-2">{t.auth.levelFound}</h1>
          <div className={cn("font-display font-bold text-5xl my-4", getLevelColor(result.level))}>
            {getLevelLabel(result.level)}
          </div>
          <p className="text-lg text-muted-foreground mb-2">
            <span className="font-bold text-foreground">{result.score}</span> / {result.total} to'g'ri javob
            ({Math.round((result.score / result.total) * 100)}%)
          </p>
        </div>

        {/* Kategoriyalar bo'yicha natija */}
        <div className="glass-card p-6">
          <h2 className="font-display font-semibold text-lg mb-4">{t.auth.byCategory}</h2>
          <div className="space-y-4">
            {result.categoryResults.map(cr => (
              <div key={cr.category}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium">{cr.label}</span>
                  <span className={cn("text-sm font-bold",
                    cr.percentage >= 70 ? "text-neon-green" : cr.percentage >= 40 ? "text-neon-yellow" : "text-neon-red"
                  )}>{cr.correct}/{cr.total} ({cr.percentage}%)</span>
                </div>
                <div className="w-full h-3 bg-surface rounded-full overflow-hidden">
                  <motion.div
                    className={cn("h-full rounded-full",
                      cr.percentage >= 70 ? "bg-neon-green" : cr.percentage >= 40 ? "bg-neon-yellow" : "bg-neon-red"
                    )}
                    initial={{ width: 0 }}
                    animate={{ width: `${cr.percentage}%` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Zaif soha va tavsiya */}
        {result.weakCategory && (
          <div className="glass-card p-6 border-l-4 border-l-neon-yellow">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-neon-yellow" />
              <h3 className="font-semibold">Zaif sohangiz: <span className="text-neon-yellow">{result.weakCategory}</span></h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{t.auth.practiceMore}</p>
            {result.recommendedCourse && (
              <div className="p-3 rounded-xl bg-neon-purple/5 border border-neon-purple/10 flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-neon-purple flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-semibold">{t.auth.recommendedCourse}</p>
                  <p className="text-sm text-neon-purple">{result.recommendedCourse.title}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* AI Tahlil */}
        {(aiLoading || result.aiRecommendation) && (
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-neon-blue" />
              <h3 className="font-semibold">AI Tahlil</h3>
            </div>
            {aiLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Loader2 className="w-4 h-4 animate-spin" /> {t.auth.analysing}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {result.aiRecommendation}
              </div>
            )}
          </div>
        )}

        {/* Davom ettirish */}
        <div className="flex items-center justify-center gap-4">
          {result.recommendedCourse && (
            <button onClick={() => router.push(`/courses/${result.recommendedCourse!.slug}`)}
              className="btn-neon py-3 px-6 flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> {t.auth.goToCourse}
            </button>
          )}
          <button onClick={() => router.push("/dashboard")}
            className="btn-primary py-3 px-8 flex items-center gap-2">
            Dashboard <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    );
  }

  // ===== TEST JARAYONI =====
  const current = questions[currentIdx];
  const answeredCount = Object.keys(answers).length;
  const currentCategory: Record<string, string> = {
    basic_programming: "🖥️ Dasturlash", computer_literacy: "💻 Kompyuter", prompt_engineering: "🤖 Prompt Eng.",
    logic: "🧠 Mantiq", algorithms: "📊 Algoritm",
  };

  return (
    <motion.div className="w-full max-w-2xl" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="glass-card p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display font-bold text-xl">{t.auth.placementTitle}</h1>
            <p className="text-xs text-muted-foreground mt-0.5">{t.auth.placementSubtitle}</p>
          </div>
          <button onClick={handleSkip} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            {t.auth.placementSkip}
          </button>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-2.5 bg-surface rounded-full overflow-hidden">
            <motion.div className="h-full progress-gradient rounded-full"
              animate={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <span className="text-sm font-mono text-muted-foreground">{currentIdx + 1}/{questions.length}</span>
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div key={currentIdx} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
            {/* Category badge */}
            <div className="mb-3">
              <span className="text-xs px-3 py-1 rounded-full bg-surface text-muted-foreground">
                {currentCategory[current.category] || current.category}
              </span>
            </div>

            <h2 className="font-display font-semibold text-lg mb-6">{current.question}</h2>

            <div className="space-y-3">
              {current.options.map((opt: any) => {
                const isSelected = answers[current.id] === opt.id;
                return (
                  <button key={opt.id} onClick={() => handleSelect(current.id, opt.id)}
                    className={cn("w-full text-left p-4 rounded-xl border-2 transition-all text-sm",
                      isSelected ? "border-neon-purple bg-neon-purple/10 text-foreground" : "border-border hover:border-neon-purple/30 hover:bg-surface text-muted-foreground")}>
                    <span className={cn("inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold mr-3",
                      isSelected ? "bg-neon-purple text-white" : "bg-surface")}>
                      {opt.id.toUpperCase()}
                    </span>
                    {opt.text}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <button onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))} disabled={currentIdx === 0}
            className="btn-ghost py-2.5 px-5 flex items-center gap-2 text-sm disabled:opacity-30">
            <ArrowLeft className="w-4 h-4" /> Oldingi
          </button>

          {/* Answer indicators */}
          <div className="flex gap-1">
            {questions.map((q, i) => (
              <button key={q.id} onClick={() => setCurrentIdx(i)}
                className={cn("w-3 h-3 rounded-full transition-all",
                  i === currentIdx ? "bg-neon-purple scale-125" :
                  answers[q.id] ? "bg-neon-green" : "bg-surface"
                )} />
            ))}
          </div>

          {currentIdx < questions.length - 1 ? (
            <button onClick={() => setCurrentIdx(currentIdx + 1)}
              className="btn-primary py-2.5 px-5 flex items-center gap-2 text-sm">
              Keyingi <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={submitting || answeredCount < questions.length}
              className="btn-primary py-2.5 px-5 flex items-center gap-2 text-sm disabled:opacity-50">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              Tugatish ({answeredCount}/{questions.length})
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
