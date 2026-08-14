"use client";

/**
 * Reja tuzish sehrgari: yo'nalish → kirish testi → reja.
 *
 * Kirish testi MAJBURIY EMAS. Uni majburiy qilsak, odam birinchi
 * qadamdayoq 8 ta savolga duch keladi va ko'pchilik shu yerda
 * to'xtaydi. Tashlab ketgan odamga "noldan" darajasi beriladi —
 * bu eng xavfsiz taxmin.
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2, ArrowRight, Check, Sparkles, Clock, Target, RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import type { Dictionary } from "@/lib/i18n/dictionaries/uz";

interface Option { id: string; text: string }
interface Question {
  id: number;
  question: string;
  topic_key: string;
  difficulty: string;
  options: Option[];
}

interface PlacementResult {
  score: number;
  level: string;
  correctCount: number;
  total: number;
  weakTopics: string[];
}

/**
 * `key` — BAZAGA va AI promptiga boradigan barqaror identifikator,
 * u tarjima QILINMAYDI. Ekranga `label` chiqadi.
 */
const DIRECTIONS = (t: Dictionary) => [
  { key: "Frontend dasturchi", label: t.agent.dirFrontend, desc: t.agent.dirFrontendDesc },
  { key: "Backend dasturchi", label: t.agent.dirBackend, desc: t.agent.dirBackendDesc },
  { key: "Mobil dasturchi", label: t.agent.dirMobile, desc: t.agent.dirMobileDesc },
  { key: "Data Analitik", label: t.agent.dirData, desc: t.agent.dirDataDesc },
  { key: "DevOps muhandis", label: t.agent.dirDevops, desc: t.agent.dirDevopsDesc },
  { key: "Kompyuter savodxonligi", label: t.agent.dirLiteracy, desc: t.agent.dirLiteracyDesc },
];

const LEVEL_LABELS: Record<string, string> = {
  zero: "Noldan",
  beginner: "Boshlang'ich",
  intermediate: "O'rta",
  advanced: "Yuqori",
};

type Step = "direction" | "placement" | "building";

export default function PlanWizard() {
  const { t } = useI18n();
  const router = useRouter();

  const [step, setStep] = useState<Step>("direction");
  const [direction, setDirection] = useState("");
  const [customDirection, setCustomDirection] = useState("");
  const [weeklyHours, setWeeklyHours] = useState(5);

  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<PlacementResult | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const chosen = customDirection.trim() || direction;

  /* ---------------- Kirish testi ---------------- */

  async function startPlacement() {
    if (!chosen) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/agent/placement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate", direction: chosen }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Test tuzilmadi");

      setAssessmentId(data.assessmentId);
      setQuestions(data.questions);
      setStep("placement");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function submitPlacement() {
    if (!assessmentId) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/agent/placement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "submit", assessmentId, answers }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Baholanmadi");

      setResult(data.result);
      await buildPlan(data.result.level);
    } catch (e: any) {
      setError(e.message);
      setLoading(false);
    }
  }

  /* ---------------- Reja ---------------- */

  async function buildPlan(startLevel: string) {
    setStep("building");
    setLoading(true);

    try {
      const res = await fetch("/api/agent/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          direction: chosen,
          goal: chosen,
          startLevel,
          weeklyHours,
          placementId: assessmentId,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Reja tuzilmadi");

      // Sahifa serverdan qayta yuklanadi va tayyor reja ko'rinadi
      router.refresh();
    } catch (e: any) {
      setError(e.message);
      setStep("direction");
    } finally {
      setLoading(false);
    }
  }

  /* ---------------- Ko'rinish ---------------- */

  if (step === "building") {
    return (
      <div className="py-24 text-center">
        <Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin text-primary" />
        <h2 className="mb-2 text-lg font-semibold">Reja tuzilmoqda...</h2>
        <p className="text-sm text-muted-foreground">
          {result
            ? `Darajangiz: ${LEVEL_LABELS[result.level] || result.level}. Shunga mos yo'l tuzyapman.`
            : "Bir necha soniya kuting."}
        </p>
      </div>
    );
  }

  if (step === "placement") {
    const answeredCount = Object.keys(answers).length;

    return (
      <div className="space-y-6 py-6">
        <div>
          <h2 className="text-xl font-bold">Darajangizni aniqlaymiz</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {questions.length} ta savol. Bilmasangiz &quot;Bilmayman&quot; ni tanlang —
            bu xato javobdan yaxshiroq, chunki reja aniqroq chiqadi.
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
                      selected
                        ? "border-primary bg-primary/5 font-medium"
                        : "border-border hover:bg-muted",
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

        {error && <ErrorBox message={error} />}

        <div className="sticky bottom-4 flex items-center gap-3 rounded-2xl border border-border bg-background/95 p-4 backdrop-blur">
          <span className="text-sm text-muted-foreground">
            {answeredCount}/{questions.length} javob berildi
          </span>
          <button
            onClick={submitPlacement}
            disabled={loading || answeredCount < questions.length}
            className="ml-auto flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-40"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            Yakunlash
          </button>
        </div>
      </div>
    );
  }

  /* --- 1-qadam: yo'nalish --- */
  return (
    <div className="space-y-8 py-6">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Target className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-bold">Qaysi yo'nalishni o'rganmoqchisiz?</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t.agent.wizardHint}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {DIRECTIONS(t).map((d) => (
          <button
            key={d.key}
            onClick={() => { setDirection(d.key); setCustomDirection(""); }}
            className={cn(
              "rounded-2xl border p-4 text-left transition-colors",
              direction === d.key && !customDirection.trim()
                ? "border-primary bg-primary/5"
                : "border-border hover:bg-muted",
            )}
          >
            <div className="font-medium">{d.label}</div>
            <div className="mt-1 text-xs text-muted-foreground">{d.desc}</div>
          </button>
        ))}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">{t.agent.orWriteYourself}</label>
        <input
          value={customDirection}
          onChange={(e) => setCustomDirection(e.target.value)}
          placeholder={t.agent.ownTopicPh}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="mb-2 flex items-center gap-2 text-sm font-medium">
          <Clock className="h-4 w-4" />
          Haftasiga necha soat ajrata olasiz? — {weeklyHours} soat
        </label>
        <input
          type="range"
          min={1}
          max={20}
          value={weeklyHours}
          onChange={(e) => setWeeklyHours(Number(e.target.value))}
          className="w-full accent-primary"
        />
      </div>

      {error && <ErrorBox message={error} />}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          onClick={startPlacement}
          disabled={!chosen || loading}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground disabled:opacity-40"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          Darajani aniqlab, reja tuzish
        </button>
        <button
          onClick={() => buildPlan("zero")}
          disabled={!chosen || loading}
          className="flex items-center justify-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-medium hover:bg-muted disabled:opacity-40"
        >
          Testsiz, noldan boshlash
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
      <RefreshCw className="mt-0.5 h-4 w-4 shrink-0" />
      {message}
    </div>
  );
}
