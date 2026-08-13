"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "@/components/i18n/Link";
import { createClient } from "@/lib/supabase/client";
import { useI18n } from "@/lib/i18n";
import { withTranslations } from "@/lib/i18n/content";
import { completeTopic } from "@/lib/course-completion";
import dynamic from "next/dynamic";
import type { TopicTask, SubmissionTestResult } from "@/types";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ArrowLeft, Sparkles, Loader2 } from "lucide-react";
import { cn, getDifficultyConfig } from "@/lib/utils";
import { AILabel, AIDisclaimer } from "@/components/ai/AILabel";
import HintTier from "@/components/ai/HintTier";
import PlanFirstFlow from "@/components/ai/PlanFirstFlow";

const CodeEditor = dynamic(() => import("@/components/editor/CodeEditor"), { ssr: false });

export default function TaskPage() {
  const { slug, topicSlug } = useParams<{ slug: string; topicSlug: string }>();
  const supabase = createClient();
  const [tasks, setTasks] = useState<TopicTask[]>([]);
  const [currentTask, setCurrentTask] = useState<TopicTask | null>(null);
  const [aiFeedback, setAiFeedback] = useState("");
  const [aiFeedbackMeta, setAiFeedbackMeta] = useState<{ model?: string; prompt_template?: string; generated_at?: string } | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [codeUnlocked, setCodeUnlocked] = useState(false);
  const [topicId, setTopicId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [userId, setUserId] = useState("");
  const { locale, t } = useI18n();

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
      const { data: course } = await supabase.from("courses").select("id").eq("slug", slug).single();
      if (course) setCourseId(course.id);
      const { data: topic } = await supabase.from("topics").select("id").eq("slug", topicSlug).single();
      if (!topic) return;
      setTopicId(topic.id);
      const { data } = await supabase.from("topic_tasks").select("*").eq("topic_id", topic.id).order("order_index");
      if (data && data.length > 0) {
        const tr = await withTranslations(supabase, "topic_tasks", data as TopicTask[], locale);
        setTasks(tr); setCurrentTask(tr[0]);
      }
      setLoading(false);
    })();
  }, []);

  async function handleSubmit(code: string, results: SubmissionTestResult[]) {
    const allPassed = results.every(r => r.passed);
    if (allPassed) {
      await supabase.from("topic_progress").update({ tasks_completed: true }).eq("user_id", userId).eq("topic_id", topicId);
      // Tugatishni tekshirish
      const { data: prog } = await supabase.from("topic_progress").select("*").eq("user_id", userId).eq("topic_id", topicId).single();
      if (prog && prog.content_read && prog.quiz_passed) {
        await completeTopic(supabase, userId, topicId, courseId);
        toast.success(t.courses.topic.topicDoneToast + " 🎉");
      } else {
        toast.success(t.courses.topic.taskDoneToast + " ✅");
      }
    }
  }

  async function handleAIFeedback(code: string, results: SubmissionTestResult[]) {
    if (!currentTask) return;
    setAiLoading(true);
    try {
      const res = await fetch("/api/ai/feedback", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedback_type: "code_review", code, language: currentTask.language, task_description: currentTask.description, test_results: results }),
      });
      const data = await res.json();
      setAiFeedback(data.feedback);
      setAiFeedbackMeta({
        model: data.meta?.model,
        prompt_template: data.meta?.prompt_template,
        generated_at: new Date().toISOString(),
      });
    } catch (_e) { toast.error("AI xatolik"); }
    setAiLoading(false);
  }

  if (loading) return <div className="glass-card h-96 animate-pulse" />;
  if (!currentTask) return (
    <div className="text-center py-20">
      <p className="text-muted-foreground mb-4">{t.courses.topic.noTask}</p>
      <Link href={`/courses/${slug}/topics/${topicSlug}`} className="btn-ghost">{t.courses.topic.backToTopic}</Link>
    </div>
  );

  const diffConfig = getDifficultyConfig(currentTask.difficulty);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <Link href={`/courses/${slug}/topics/${topicSlug}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" /> Mavzuga qaytish
        </Link>
        {tasks.length > 1 && (
          <div className="flex gap-2">
            {tasks.map((t, i) => (
              <button key={t.id} onClick={() => { setCurrentTask(t); setAiFeedback(""); setAiFeedbackMeta(null); setCodeUnlocked(t.difficulty === 'easy'); }}
                className={cn("w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center transition-all",
                  currentTask.id === t.id ? "bg-neon-purple text-white" : "bg-surface text-muted-foreground hover:bg-surface-hover")}>
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Plan-First flow (medium/hard uchun majburiy, easy uchun yashirin) */}
      {currentTask.difficulty !== 'easy' && (
        <PlanFirstFlow
          key={currentTask.id}
          taskId={currentTask.id}
          taskType="topic_task"
          taskDescription={currentTask.description}
          difficulty={currentTask.difficulty as any}
          onCodeUnlocked={() => setCodeUnlocked(true)}
        />
      )}

      {/* ===== ROW 1: Description | Editor (yonma-yon) ===== */}
      <div className="grid lg:grid-cols-[1fr,1.2fr] gap-4">
        {/* Left: Task description */}
        <motion.div className="glass-card p-5 overflow-y-auto" style={{ maxHeight: "520px" }} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
          <div className="flex items-center gap-3 mb-3">
            <h2 className="font-display font-bold text-lg">{currentTask.title}</h2>
            <span className={diffConfig.class}>{diffConfig.label}</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4 whitespace-pre-line">{currentTask.description}</p>
          {currentTask.instruction_html && (
            <div className="text-sm prose prose-invert prose-sm max-w-none mb-4" dangerouslySetInnerHTML={{ __html: currentTask.instruction_html }} />
          )}

          {/* Test cases */}
          <div className="border-t border-border/50 pt-3">
            <p className="text-xs font-semibold text-muted-foreground mb-2">Misol testlar:</p>
            {currentTask.test_cases.filter(tc => !tc.is_hidden).slice(0, 3).map((tc, i) => (
              <div key={i} className="flex gap-4 text-xs font-mono bg-surface rounded-lg px-3 py-2 mb-1.5">
                <span className="text-muted-foreground">Kirish: <span className="text-foreground">{tc.input}</span></span>
                <span className="text-muted-foreground">Kutilgan: <span className="text-neon-green">{tc.expected_output}</span></span>
              </div>
            ))}
          </div>

          {/* Tiered Hints */}
          {currentTask.hints && currentTask.hints.length > 0 && (
            <div className="border-t border-border/50 pt-3 mt-3">
              <HintTier
                taskId={currentTask.id}
                taskType="topic_task"
                hints={currentTask.hints as any}
              />
            </div>
          )}
        </motion.div>

        {/* Right: Code Editor */}
        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          {currentTask.difficulty !== 'easy' && !codeUnlocked ? (
            <div className="glass-card flex flex-col items-center justify-center text-center p-8 h-[460px]">
              <div className="w-12 h-12 rounded-xl bg-neon-purple/10 flex items-center justify-center mb-3">
                <Sparkles className="w-6 h-6 text-neon-purple" />
              </div>
              <h3 className="font-semibold mb-1">{t.courses.topic.planFirstTitle}</h3>
              <p className="text-xs text-muted-foreground max-w-xs">
                {t.courses.topic.planFirstText}
              </p>
            </div>
          ) : (
            <CodeEditor
              language={currentTask.language as any}
              starterCode={currentTask.starter_code}
              testCases={currentTask.test_cases}
              taskId={currentTask.id}
              taskType="topic_task"
              onSubmit={handleSubmit}
              onAIFeedback={handleAIFeedback}
              height="460px"
            />
          )}
        </motion.div>
      </div>

      {/* ===== ROW 2: AI Feedback (pastda, to'liq kenglikda) ===== */}
      {(aiLoading || aiFeedback) && (
        <motion.div className="glass-card p-5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-neon-blue" />
            <h3 className="font-semibold">{t.courses.topic.aiReview}</h3>
          </div>
          {aiLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" /> {t.courses.topic.analysing}</div>
          ) : (
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{aiFeedback}</div>
              {aiFeedbackMeta && (
                <div className="flex flex-col gap-1 pt-2 border-t border-border/50">
                  <AILabel
                    model={aiFeedbackMeta.model}
                    promptTemplate={aiFeedbackMeta.prompt_template}
                    generatedAt={aiFeedbackMeta.generated_at}
                  />
                  <AIDisclaimer />
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
