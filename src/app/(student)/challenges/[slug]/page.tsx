"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import dynamic from "next/dynamic";
import type { Challenge, Submission, SubmissionTestResult, SupportedLanguage } from "@/types";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ArrowLeft, Sparkles, Loader2, Coins, Users, Clock, Lock } from "lucide-react";
import { cn, getDifficultyConfig, getCategoryLabel, formatRelativeDate } from "@/lib/utils";

const CodeEditor = dynamic(() => import("@/components/editor/CodeEditor"), { ssr: false });

export default function ChallengeDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const supabase = createClient();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [lang, setLang] = useState<SupportedLanguage>("python");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [aiFeedback, setAiFeedback] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: ch } = await supabase
        .from("challenges")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();
      if (ch) {
        setChallenge(ch as Challenge);
        if (ch.languages?.[0]) setLang(ch.languages[0] as SupportedLanguage);
      }
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
      if (user && ch) {
        const { data: subs } = await supabase.from("submissions").select("*")
          .eq("user_id", user.id).eq("task_id", ch.id).order("created_at", { ascending: false }).limit(10);
        if (subs) setSubmissions(subs as Submission[]);
      }
      setLoading(false);
    })();
  }, [slug]);

  async function handleAIFeedback(code: string, results: SubmissionTestResult[]) {
    if (!challenge) return;
    setAiLoading(true);
    try {
      const res = await fetch("/api/ai/feedback", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedback_type: "code_review", code, language: lang, task_description: challenge.description, test_results: results }),
      });
      const data = await res.json();
      setAiFeedback(data.feedback);
    } catch (_e) { toast.error("AI feedback xatolik"); }
    setAiLoading(false);
  }

  if (loading || !challenge) return <div className="glass-card h-96 animate-pulse" />;
  const diff = getDifficultyConfig(challenge.difficulty);
  const allTestCases = [...challenge.test_cases, ...challenge.hidden_test_cases];

  return (
    <div className="space-y-6">
      <Link
        href={userId ? "/challenges" : "/explore/challenges"}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="w-4 h-4" /> Topshiriqlar
      </Link>

      <div className="grid lg:grid-cols-[1fr,1fr] gap-6">
        {/* Left: Description */}
        <div className="space-y-4">
          <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-3">
              <h1 className="font-display font-bold text-xl">{challenge.title}</h1>
              <span className={diff.class}>{diff.label}</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
              <span>{getCategoryLabel(challenge.category)}</span>
              <span className="flex items-center gap-1"><Users className="w-3 h-3" />{challenge.solved_count} yechgan</span>
              <span className="flex items-center gap-1 text-neon-yellow"><Coins className="w-3 h-3" />+{challenge.coin_reward}</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{challenge.time_limit_ms}ms limit</span>
            </div>
            <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{challenge.description}</div>
            {challenge.instruction_html && (
              <div className="mt-4 text-sm prose prose-invert prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: challenge.instruction_html }} />
            )}
            <div className="mt-4 pt-4 border-t border-border/50">
              <p className="text-xs font-semibold text-muted-foreground mb-2">Namuna testlar:</p>
              {challenge.test_cases.filter(tc => !tc.is_hidden).map((tc, i) => (
                <div key={i} className="flex gap-4 text-xs font-mono bg-surface rounded-lg px-3 py-2 mb-1.5">
                  <span>Kirish: <span className="text-foreground">{tc.input}</span></span>
                  <span>Kutilgan: <span className="text-neon-green">{tc.expected_output}</span></span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Submissions history */}
          {submissions.length > 0 && (
            <div className="glass-card p-5">
              <h3 className="font-semibold text-sm mb-3">So'nggi yuborishlar</h3>
              <div className="space-y-2">
                {submissions.slice(0, 5).map(sub => (
                  <div key={sub.id} className="flex items-center justify-between text-xs bg-surface rounded-lg px-3 py-2">
                    <span className={cn("font-mono font-semibold", sub.status === "accepted" ? "text-neon-green" : "text-neon-red")}>
                      {sub.status === "accepted" ? "✓ Qabul qilindi" : "✗ " + sub.status.replace(/_/g, " ")}
                    </span>
                    <span className="text-muted-foreground">{sub.passed_tests}/{sub.total_tests} test · {formatRelativeDate(sub.created_at)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(aiLoading || aiFeedback) && (
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-3"><Sparkles className="w-5 h-5 text-neon-blue" /><h3 className="font-semibold text-sm">AI Tahlil</h3></div>
              {aiLoading ? <div className="flex items-center gap-2 text-muted-foreground text-sm"><Loader2 className="w-4 h-4 animate-spin" /> Tahlil qilinmoqda...</div>
                : <div className="text-sm text-muted-foreground whitespace-pre-wrap">{aiFeedback}</div>}
            </div>
          )}
        </div>

        {/* Right: Editor (auth bor bo'lsa) yoki CTA panel (login qilmaganlar uchun) */}
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
                onSubmit={async () => {
                  const { data: { user } } = await supabase.auth.getUser();
                  if (user) {
                    const { data: subs } = await supabase.from("submissions").select("*")
                      .eq("user_id", user.id).eq("task_id", challenge.id).order("created_at", { ascending: false }).limit(10);
                    if (subs) setSubmissions(subs as Submission[]);
                  }
                }}
                onAIFeedback={handleAIFeedback}
                height="500px"
              />
            </>
          ) : (
            <div className="glass-card p-8 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-neon-purple/10 flex items-center justify-center mb-4">
                <Lock className="w-7 h-7 text-neon-purple" />
              </div>
              <h3 className="font-display font-bold text-lg mb-2">Topshiriqni yechish uchun ro'yxatdan o'ting</h3>
              <p className="text-sm text-muted-foreground mb-5 max-w-sm">
                Bepul hisob yarating, kod yozing va avtomatik testlar orqali yechimni tekshirib ko'ring.
                AI Sokratik mentor sizga yo'l-yo'riq beradi.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 w-full max-w-xs">
                <Link
                  href={`/register?redirect=/challenges/${slug}`}
                  className="flex-1 py-3 rounded-xl bg-foreground text-background font-display font-bold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Bepul boshlash
                </Link>
                <Link
                  href={`/login?redirect=/challenges/${slug}`}
                  className="flex-1 py-3 rounded-xl border border-border/60 text-sm font-medium hover:bg-surface/50 transition-all flex items-center justify-center"
                >
                  Kirish
                </Link>
              </div>
              <p className="text-[11px] text-muted-foreground/70 mt-4">
                Ro'yxatdan o'tish 30 sekund · 100 coin sovg'a
              </p>
              <div className="mt-6 pt-6 border-t border-border/40 w-full max-w-sm">
                <p className="text-xs font-semibold text-muted-foreground mb-2 text-left">Tillar:</p>
                <div className="flex gap-2 flex-wrap justify-center">
                  {challenge.languages.map(l => (
                    <span key={l} className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-surface border border-border">
                      {l}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
