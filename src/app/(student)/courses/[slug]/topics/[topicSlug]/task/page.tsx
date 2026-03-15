"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { completeTopic } from "@/lib/course-completion";
import dynamic from "next/dynamic";
import type { TopicTask, SubmissionTestResult } from "@/types";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ArrowLeft, Sparkles, Loader2, Lightbulb, ChevronDown } from "lucide-react";
import { cn, getDifficultyConfig } from "@/lib/utils";

const CodeEditor = dynamic(() => import("@/components/editor/CodeEditor"), { ssr: false });

export default function TaskPage() {
  const { slug, topicSlug } = useParams<{ slug: string; topicSlug: string }>();
  const supabase = createClient();
  const [tasks, setTasks] = useState<TopicTask[]>([]);
  const [currentTask, setCurrentTask] = useState<TopicTask | null>(null);
  const [aiFeedback, setAiFeedback] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [loading, setLoading] = useState(true);
  const [topicId, setTopicId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [userId, setUserId] = useState("");

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
      if (data && data.length > 0) { setTasks(data as TopicTask[]); setCurrentTask(data[0] as TopicTask); }
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
        toast.success("Mavzu tugatildi! 🎉");
      } else {
        toast.success("Topshiriq bajarildi! ✅");
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
    } catch { toast.error("AI xatolik"); }
    setAiLoading(false);
  }

  if (loading) return <div className="glass-card h-96 animate-pulse" />;
  if (!currentTask) return (
    <div className="text-center py-20">
      <p className="text-muted-foreground mb-4">Amaliy topshiriq mavjud emas</p>
      <Link href={`/courses/${slug}/topics/${topicSlug}`} className="btn-ghost">Mavzuga qaytish</Link>
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
              <button key={t.id} onClick={() => { setCurrentTask(t); setAiFeedback(""); }}
                className={cn("w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center transition-all",
                  currentTask.id === t.id ? "bg-neon-purple text-white" : "bg-surface text-muted-foreground hover:bg-surface-hover")}>
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ===== ROW 1: Description | Editor (yonma-yon) ===== */}
      <div className="grid lg:grid-cols-[1fr,1.2fr] gap-4">
        {/* Left: Task description */}
        <motion.div className="glass-card p-5 overflow-y-auto" style={{ maxHeight: "520px" }} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
          <div className="flex items-center gap-3 mb-3">
            <h2 className="font-display font-bold text-lg">{currentTask.title}</h2>
            <span className={diffConfig.class}>{diffConfig.label}</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">{currentTask.description}</p>
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

          {/* Hints */}
          {currentTask.hints && currentTask.hints.length > 0 && (
            <div className="border-t border-border/50 pt-3 mt-3">
              <button onClick={() => setShowHints(!showHints)} className="flex items-center gap-2 text-sm text-neon-yellow hover:underline">
                <Lightbulb className="w-4 h-4" /> Maslahatlar ({currentTask.hints.length})
                <ChevronDown className={cn("w-4 h-4 transition-transform", showHints && "rotate-180")} />
              </button>
              {showHints && (
                <div className="mt-2 space-y-2">
                  {currentTask.hints.map((h: any, i: number) => (
                    <p key={i} className="text-xs text-muted-foreground bg-neon-yellow/5 border border-neon-yellow/10 rounded-lg px-3 py-2">💡 {h.text}</p>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Right: Code Editor */}
        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
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
        </motion.div>
      </div>

      {/* ===== ROW 2: AI Feedback (pastda, to'liq kenglikda) ===== */}
      {(aiLoading || aiFeedback) && (
        <motion.div className="glass-card p-5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-neon-blue" />
            <h3 className="font-semibold">AI Tahlil</h3>
          </div>
          {aiLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" /> Tahlil qilinmoqda...</div>
          ) : (
            <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{aiFeedback}</div>
          )}
        </motion.div>
      )}
    </div>
  );
}
