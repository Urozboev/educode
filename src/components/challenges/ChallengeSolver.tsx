"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "@/components/i18n/Link";
import { createClient } from "@/lib/supabase/client";
import dynamic from "next/dynamic";
import type { Challenge, Submission, SubmissionTestResult, SupportedLanguage } from "@/types";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Sparkles, Loader2, Coins, Users, Clock, Lock } from "lucide-react";
import { cn, getDifficultyConfig, getCategoryLabel, formatRelativeDate } from "@/lib/utils";
import { PasteBadge } from "./PasteBadge";
import { useI18n } from "@/lib/i18n";

const CodeEditor = dynamic(() => import("@/components/editor/CodeEditor"), { ssr: false });

/**
 * Masala tavsifi + kod muharriri.
 *
 * Ikki joyda ishlatiladi: mustaqil topshiriq sahifasi (`/challenges/<slug>`)
 * va olimpiada masalasi (`/explore/contests/<slug>/<harf>`). Ilgari faqat
 * birinchisi bor edi, shuning uchun olimpiadadagi masalaga bosgan odam
 * musobaqa kontekstidan chiqib ketardi va qaytishning yo'li qolmasdi.
 *
 * `onSolved` — yechim qabul qilinganda chaqiriladi; olimpiada sahifasi
 * shundan foydalanib masalalar ro'yxatini yangilaydi.
 */
export function ChallengeSolver({
  challenge,
  userId,
  loginRedirect,
  onSolved,
}: {
  challenge: Challenge;
  userId: string | null;
  /** Login qilmagan foydalanuvchi qaytadigan manzil */
  loginRedirect: string;
  onSolved?: () => void;
}) {
  const { t } = useI18n();
  const supabase = createClient();
  const [lang, setLang] = useState<SupportedLanguage>(
    (challenge.languages?.[0] as SupportedLanguage) || "python"
  );
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [aiFeedback, setAiFeedback] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const loadSubmissions = useCallback(async () => {
    if (!userId) return;
    const { data } = await supabase
      .from("submissions")
      .select("*")
      .eq("user_id", userId)
      .eq("task_id", challenge.id)
      .order("created_at", { ascending: false })
      .limit(10);
    if (data) setSubmissions(data as Submission[]);
  }, [supabase, userId, challenge.id]);

  useEffect(() => { loadSubmissions(); }, [loadSubmissions]);

  async function handleAIFeedback(code: string, results: SubmissionTestResult[]) {
    setAiLoading(true);
    try {
      const res = await fetch("/api/ai/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          feedback_type: "code_review", code, language: lang,
          task_description: challenge.description, test_results: results,
        }),
      });
      const data = await res.json();
      setAiFeedback(data.feedback);
    } catch { toast.error("AI feedback xatolik"); }
    setAiLoading(false);
  }

  const diff = getDifficultyConfig(challenge.difficulty);
  const allTestCases = [...challenge.test_cases, ...challenge.hidden_test_cases];

  return (
    <div className="grid lg:grid-cols-[1fr,1fr] gap-6">
      {/* Chap: tavsif */}
      <div className="space-y-4">
        <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-3">
            <h1 className="font-display font-bold text-xl">{challenge.title}</h1>
            <span className={diff.class}>{diff.label}</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4 flex-wrap">
            <span>{getCategoryLabel(challenge.category)}</span>
            <span className="flex items-center gap-1"><Users className="w-3 h-3" />{challenge.solved_count} yechgan</span>
            <span className="flex items-center gap-1 text-neon-yellow"><Coins className="w-3 h-3" />+{challenge.coin_reward}</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{challenge.time_limit_ms}ms limit</span>
          </div>
          <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{challenge.description}</div>
          {challenge.instruction_html && (
            <div className="mt-4 text-sm prose prose-invert prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: challenge.instruction_html }} />
          )}
          <div className="mt-4 pt-4 border-t border-border/50">
            <p className="text-xs font-semibold text-muted-foreground mb-2">Namuna testlar:</p>
            {challenge.test_cases.filter(tc => !tc.is_hidden).map((tc, i) => (
              <div key={i} className="flex gap-4 text-xs font-mono bg-surface rounded-lg px-3 py-2 mb-1.5">
                <span>Kirish: <span className="text-foreground whitespace-pre-wrap">{tc.input}</span></span>
                <span>Kutilgan: <span className="text-neon-green whitespace-pre-wrap">{tc.expected_output}</span></span>
              </div>
            ))}
          </div>
        </motion.div>

        {submissions.length > 0 && (
          <div className="glass-card p-5">
            <h3 className="font-semibold text-sm mb-3">{t.courses.recentSubmissions}</h3>
            <div className="space-y-2">
              {submissions.slice(0, 5).map(sub => (
                <div key={sub.id} className="flex items-center gap-2 text-xs bg-surface rounded-lg px-3 py-2">
                  <span className={cn("font-mono font-semibold", sub.status === "accepted" ? "text-neon-green" : "text-neon-red")}>
                    {sub.status === "accepted" ? t.courses.accepted : "✗ " + sub.status.replace(/_/g, " ")}
                  </span>
                  {/* O'z yechimidagi nusxa belgisi — talaba nima qayd
                      etilayotganini bilib tursin */}
                  <PasteBadge count={sub.paste_count} ratio={sub.paste_ratio} chars={sub.pasted_chars} compact />
                  <span className="text-muted-foreground ml-auto">
                    {sub.passed_tests}/{sub.total_tests} test · {formatRelativeDate(sub.created_at)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {(aiLoading || aiFeedback) && (
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-neon-blue" />
              <h3 className="font-semibold text-sm">AI Tahlil</h3>
            </div>
            {aiLoading
              ? <div className="flex items-center gap-2 text-muted-foreground text-sm"><Loader2 className="w-4 h-4 animate-spin" /> {t.courses.topic.analysing}</div>
              : <div className="text-sm text-muted-foreground whitespace-pre-wrap">{aiFeedback}</div>}
          </div>
        )}
      </div>

      {/* O'ng: muharrir yoki login taklifi */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        {userId ? (
          <>
            <div className="mb-3 flex gap-2">
              {challenge.languages.map(l => (
                <button key={l} onClick={() => setLang(l as SupportedLanguage)}
                  className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                    lang === l ? "bg-neon-purple/10 text-neon-purple border border-neon-purple/20" : "bg-surface text-muted-foreground")}>
                  {l}
                </button>
              ))}
            </div>
            <CodeEditor
              language={lang}
              starterCode={challenge.starter_code?.[lang] || ""}
              testCases={allTestCases}
              taskId={challenge.id}
              taskType="challenge"
              onSubmit={async () => { await loadSubmissions(); onSolved?.(); }}
              onAIFeedback={handleAIFeedback}
              height="500px"
            />
          </>
        ) : (
          <div className="glass-card p-8 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-neon-purple/10 flex items-center justify-center mb-4">
              <Lock className="w-7 h-7 text-neon-purple" />
            </div>
            <h3 className="font-display font-bold text-lg mb-2">{t.explore.guestCtaTitle}</h3>
            <p className="text-sm text-muted-foreground mb-5 max-w-sm">
              {t.courses.solverCta}
            </p>
            <div className="flex flex-col sm:flex-row gap-2 w-full max-w-xs">
              <Link href={`/register?redirect=${encodeURIComponent(loginRedirect)}`} className="btn-primary flex-1 py-2.5 text-sm">
                Ro&apos;yxatdan o&apos;tish
              </Link>
              <Link href={`/login?redirect=${encodeURIComponent(loginRedirect)}`} className="btn-ghost flex-1 py-2.5 text-sm">
                Kirish
              </Link>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
