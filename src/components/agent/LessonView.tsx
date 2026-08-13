"use client";

/**
 * Dars sahifasi: matn, misollar, ovozda eshitish va progress.
 *
 * Dars ochilganda avtomatik gapirmaydi. Sabab: sahifa ochilishi
 * bilan gapira boshlagan ovoz ko'p holatda bezovta qiladi
 * (jamoat joyi, tungi vaqt) va brauzerlar ham foydalanuvchi
 * harakatisiz audio o'ynatishni bloklaydi.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Loader2, Volume2, Square, Check, MessageCircle, ArrowLeft, Copy, Zap, Code2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAgentVoice } from "./useAgentVoice";
import QuizView from "./QuizView";
import TaskView from "./TaskView";

interface Example {
  title: string;
  language: string;
  code: string;
  explanation: string;
}

interface Lesson {
  id: string;
  title: string;
  content_html: string;
  narration: string;
  examples: Example[];
}

export default function LessonView({ moduleId, lang = "uz" }: { moduleId: string; lang?: string }) {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [cached, setCached] = useState(false);
  const [loading, setLoading] = useState(true);
  const [finishing, setFinishing] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Amaliy topshiriq alohida yuklanadi: uni generatsiya qilish
  // namunaviy yechimni testlarda tekshirishni ham o'z ichiga oladi,
  // ya'ni sekinroq. Dars ochilishini kutkazishga arzimaydi.
  const [taskLoading, setTaskLoading] = useState(false);
  const [task, setTask] = useState<{ task: any; assessmentId: string } | null>(null);

  const { speak, stop, speaking } = useAgentVoice(lang);
  const startedAt = useRef(Date.now());

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/agent/lesson", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ moduleId }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Dars ochilmadi");
        if (cancelled) return;

        setLesson(data.lesson);
        setCached(data.cached);
      } catch (e: any) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [moduleId]);

  const spentSeconds = useCallback(
    () => Math.round((Date.now() - startedAt.current) / 1000),
    [],
  );

  /**
   * Darsni o'qib bo'lgach testga o'tiladi.
   *
   * Modul holati bu yerda "done" QILINMAYDI — buni Tracker test
   * natijasiga qarab hal qiladi. Aks holda o'quvchi darsni ochib
   * yopgani bilanoq mavzu "o'zlashtirilgan" bo'lib qolardi.
   */
  async function goToQuiz() {
    if (!lesson) return;
    setFinishing(true);

    try {
      await fetch("/api/agent/lesson", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId: lesson.id, status: "read", secondsSpent: spentSeconds() }),
      });

      stop();
      setShowQuiz(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setFinishing(false);
    }
  }

  if (loading) {
    return (
      <div className="py-24 text-center">
        <Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Dars tayyorlanmoqda...</p>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="py-16 text-center">
        <p className="mb-4 text-sm text-destructive">{error || "Dars topilmadi"}</p>
        <Link href="/agent/reja" className="text-sm text-primary hover:underline">
          Rejaga qaytish
        </Link>
      </div>
    );
  }

  async function openTask() {
    setTaskLoading(true);
    setError(null);
    stop();

    try {
      const res = await fetch("/api/agent/task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "start", moduleId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Topshiriq ochilmadi");

      setTask({ task: data.task, assessmentId: data.assessmentId });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setTaskLoading(false);
    }
  }

  if (task) {
    return (
      <TaskView
        task={task.task}
        assessmentId={task.assessmentId}
        onBack={() => setTask(null)}
      />
    );
  }

  if (showQuiz) {
    return <QuizView moduleId={moduleId} onBackToLesson={() => setShowQuiz(false)} />;
  }

  return (
    <article className="py-6">
      <header className="mb-8">
        <Link
          href="/agent/reja"
          className="mb-4 inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          yo'lga qaytish
        </Link>

        <h1 className="font-display text-[26px] font-bold leading-[1.15] tracking-tight sm:text-3xl">
          {lesson.title}
        </h1>

        {/*
          Ovoz — bu darsning ikkinchi ko'rinishi, ikkilamchi tugma emas.
          Ko'p o'quvchi uchun o'qishdan ko'ra eshitish qulayroq, shuning
          uchun u sarlavha ostida alohida turadi va nima bo'lishini aytadi.
        */}
        {lesson.narration && (
          <button
            onClick={() => (speaking ? stop() : speak(lesson.narration, true))}
            className={cn(
              "mt-5 flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-colors sm:w-auto",
              speaking
                ? "border-neon-purple bg-neon-purple/[0.06]"
                : "border-border hover:border-neon-purple/40 hover:bg-neon-purple/[0.03]",
            )}
          >
            <span className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
              speaking ? "bg-neon-purple text-white" : "bg-neon-purple/10 text-neon-purple",
            )}>
              {speaking ? <Square className="h-3.5 w-3.5" fill="currentColor" /> : <Volume2 className="h-4 w-4" />}
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-medium">
                {speaking ? "To'xtatish" : "Darsni eshitish"}
              </span>
              <span className="block font-mono text-[11px] text-muted-foreground">
                {speaking ? "Ustoz gapiryapti" : "~2 daqiqa · Ustoz ovozida"}
              </span>
            </span>
          </button>
        )}

        {cached && (
          <div className="mt-4 flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
            <Zap className="h-3 w-3" />
            tayyor darsdan olindi
          </div>
        )}
      </header>

      {/* Dars matni. HTML serverda oq ro'yxat bo'yicha tozalangan. */}
      <div
        className={cn(
          "text-[15px] leading-relaxed",
          "[&_h3]:mb-2 [&_h3]:mt-7 [&_h3]:text-lg [&_h3]:font-semibold",
          "[&_h4]:mb-2 [&_h4]:mt-5 [&_h4]:font-semibold",
          "[&_p]:mb-3",
          "[&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6",
          "[&_li]:mb-1.5",
          "[&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[13px]",
          "[&_pre]:mb-4 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:bg-muted [&_pre]:p-4",
          "[&_pre_code]:bg-transparent [&_pre_code]:p-0",
          "[&_table]:mb-4 [&_table]:w-full [&_table]:text-sm",
          "[&_th]:border-b [&_th]:border-border [&_th]:p-2 [&_th]:text-left",
          "[&_td]:border-b [&_td]:border-border [&_td]:p-2",
        )}
        dangerouslySetInnerHTML={{ __html: lesson.content_html }}
      />

      {lesson.examples?.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-lg font-semibold">Misollar</h2>
          <div className="space-y-4">
            {lesson.examples.map((ex, i) => (
              <ExampleCard key={i} example={ex} />
            ))}
          </div>
        </section>
      )}

      <div className="mt-10 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row">
        <button
          onClick={goToQuiz}
          disabled={finishing}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground disabled:opacity-40"
        >
          {finishing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
          Tushundim — testni topshiraman
        </button>

        <button
          onClick={openTask}
          disabled={taskLoading}
          className="flex items-center justify-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-medium hover:bg-muted disabled:opacity-40"
        >
          {taskLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Code2 className="h-4 w-4" />}
          Amaliy topshiriq
        </button>

        <Link
          href={`/agent?modul=${moduleId}`}
          className="flex items-center justify-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-medium hover:bg-muted"
        >
          <MessageCircle className="h-4 w-4" />
          Savolim bor
        </Link>
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}
    </article>
  );
}

function ExampleCard({ example }: { example: Example }) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="overflow-hidden rounded-2xl border border-border">
      <div className="flex items-center justify-between border-b border-border bg-muted/50 px-4 py-2.5">
        <span className="text-sm font-medium">{example.title}</span>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">{example.language}</span>
          <button
            onClick={() => {
              navigator.clipboard.writeText(example.code);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
            className="text-muted-foreground hover:text-foreground"
            title="Nusxa olish"
          >
            {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed">
        <code>{example.code}</code>
      </pre>

      {example.explanation && (
        <p className="border-t border-border px-4 py-3 text-sm text-muted-foreground">
          {example.explanation}
        </p>
      )}
    </div>
  );
}
