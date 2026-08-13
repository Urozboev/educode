"use client";

/**
 * Amaliy kod topshirig'i: shart, muharrir, sinash va topshirish.
 *
 * Platformadagi `CodeEditor` ishlatilmadi — u `submissions`,
 * AI deklaratsiya modali va nusxa ko'chirish detektoriga bog'langan,
 * ya'ni kurs topshiriqlari oqimiga. Agent mustaqil modul bo'lgani
 * uchun bu yerda faqat Monaco va agent API'si bor.
 */

import { useState } from "react";
import Link from "next/link";
import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";
import {
  Play, Send, Loader2, Check, X, Lock, Lightbulb, RotateCcw, ListChecks,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskExample { input: string; expected_output: string }

interface Task {
  id: string;
  title: string;
  description: string;
  language: string;
  starter_code: string;
  examples: TaskExample[];
  hiddenCount: number;
  hints: string[];
}

interface Outcome {
  index: number;
  isHidden: boolean;
  passed: boolean;
  input?: string;
  expected?: string;
  actual?: string;
  stderr?: string;
}

interface SubmitResult {
  score: number;
  passedCount: number;
  total: number;
  outcomes: Outcome[];
}

export default function TaskView({
  task,
  assessmentId,
  onBack,
}: {
  task: Task;
  assessmentId: string;
  onBack: () => void;
}) {
  const { theme } = useTheme();

  const [code, setCode] = useState(task.starter_code || "");
  const [stdin, setStdin] = useState(task.examples[0]?.input || "");
  const [output, setOutput] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [hintsShown, setHintsShown] = useState(0);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setRunning(true);
    setError(null);
    setOutput(null);

    try {
      const res = await fetch("/api/agent/task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "run", taskId: task.id, code, stdin }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ishga tushmadi");

      setOutput(data.result.stderr || data.result.stdout || "(chiqish bo'sh)");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setRunning(false);
    }
  }

  async function submit() {
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/agent/task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "submit", assessmentId, code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Tekshirilmadi");

      setResult(data.result);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  const allPassed = result?.passedCount === result?.total && !!result;

  return (
    <div className="space-y-5 py-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <button onClick={onBack} className="mb-2 text-sm text-muted-foreground hover:text-foreground">
            ← Darsga qaytish
          </button>
          <h1 className="text-xl font-bold">{task.title}</h1>
        </div>
        <span className="shrink-0 rounded-full bg-muted px-3 py-1 text-xs font-medium">
          {task.language}
        </span>
      </div>

      {/* Shart */}
      <div className="whitespace-pre-wrap rounded-2xl border border-border p-5 text-sm leading-relaxed">
        {task.description}
      </div>

      {/* Misollar */}
      {task.examples.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold">Misollar</h2>
          {task.examples.map((ex, i) => (
            <div key={i} className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border">
                <div className="border-b border-border px-3 py-1.5 text-xs text-muted-foreground">Kirish</div>
                <pre className="overflow-x-auto p-3 text-[13px]">{ex.input || "(bo'sh)"}</pre>
              </div>
              <div className="rounded-xl border border-border">
                <div className="border-b border-border px-3 py-1.5 text-xs text-muted-foreground">Chiqish</div>
                <pre className="overflow-x-auto p-3 text-[13px]">{ex.expected_output}</pre>
              </div>
            </div>
          ))}
          {task.hiddenCount > 0 && (
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Lock className="h-3 w-3" />
              Yana {task.hiddenCount} ta yashirin test — ular chegara holatlarni tekshiradi
            </p>
          )}
        </div>
      )}

      {/* Muharrir */}
      <div className="overflow-hidden rounded-2xl border border-border">
        <Editor
          height="340px"
          language={task.language === "cpp" ? "cpp" : task.language}
          theme={theme === "dark" ? "vs-dark" : "light"}
          value={code}
          onChange={(v) => setCode(v || "")}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            tabSize: 4,
            automaticLayout: true,
          }}
        />
      </div>

      {/* Sinash */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs text-muted-foreground">Kirish (stdin)</label>
          <textarea
            value={stdin}
            onChange={(e) => setStdin(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-border bg-background p-3 font-mono text-[13px] outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs text-muted-foreground">Chiqish</label>
          <pre className="h-[86px] overflow-auto rounded-xl border border-border bg-muted/50 p-3 font-mono text-[13px]">
            {output ?? "—"}
          </pre>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          onClick={run}
          disabled={running || submitting}
          className="flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm font-medium hover:bg-muted disabled:opacity-40"
        >
          {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
          Sinab ko'rish
        </button>

        <button
          onClick={submit}
          disabled={submitting || running || !code.trim()}
          className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-40"
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          Topshirish
        </button>

        {task.hints.length > hintsShown && (
          <button
            onClick={() => setHintsShown((n) => n + 1)}
            className="ml-auto flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm text-muted-foreground hover:bg-muted"
          >
            <Lightbulb className="h-4 w-4" />
            Maslahat ({hintsShown}/{task.hints.length})
          </button>
        )}
      </div>

      {/* Maslahatlar — bosqichma-bosqich ochiladi */}
      {hintsShown > 0 && (
        <div className="space-y-2">
          {task.hints.slice(0, hintsShown).map((h, i) => (
            <div key={i} className="flex gap-3 rounded-xl border border-border bg-muted/30 p-4 text-sm">
              <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>{h}</span>
            </div>
          ))}
        </div>
      )}

      {/* Natija */}
      {result && (
        <div className={cn(
          "rounded-2xl border p-5",
          allPassed ? "border-primary bg-primary/5" : "border-border",
        )}>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-lg font-bold">
                {result.passedCount} / {result.total} test o'tdi
              </div>
              <div className="text-sm text-muted-foreground">Natija: {result.score}%</div>
            </div>
            {allPassed && (
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check className="h-5 w-5" />
              </span>
            )}
          </div>

          <div className="space-y-2">
            {result.outcomes.map((o) => (
              <div key={o.index} className="rounded-xl border border-border p-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full",
                    o.passed ? "bg-primary text-primary-foreground" : "bg-destructive/15 text-destructive",
                  )}>
                    {o.passed ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                  </span>
                  <span className="font-medium">
                    Test {o.index}
                    {o.isHidden && <span className="ml-2 text-xs text-muted-foreground">(yashirin)</span>}
                  </span>
                </div>

                {!o.passed && !o.isHidden && (
                  <div className="ml-7 mt-2 space-y-1 font-mono text-xs">
                    <div className="text-muted-foreground">Kirish: {o.input || "(bo'sh)"}</div>
                    <div className="text-muted-foreground">Kutilgan: {o.expected}</div>
                    <div className="text-destructive">Chiqdi: {o.actual || "(bo'sh)"}</div>
                  </div>
                )}

                {o.stderr && (
                  <pre className="ml-7 mt-2 overflow-x-auto whitespace-pre-wrap text-xs text-destructive">
                    {o.stderr}
                  </pre>
                )}
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            {allPassed ? (
              <Link
                href="/agent/reja"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground"
              >
                <ListChecks className="h-4 w-4" />
                Rejaga qaytish
              </Link>
            ) : (
              <button
                onClick={() => setResult(null)}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-medium hover:bg-muted"
              >
                <RotateCcw className="h-4 w-4" />
                Yana urinish
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
