"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Challenge, ContestOverview } from "@/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ArrowLeft, Trophy, Clock, CheckCircle2, XCircle, Coins } from "lucide-react";
import { ChallengeSolver } from "@/components/challenges/ChallengeSolver";
import { contestStatus, countdown } from "@/lib/contests";

/**
 * Olimpiada masalasi.
 *
 * Ilgari masalaga bosilganda `/challenges/<slug>` ochilardi — u yerda
 * musobaqa haqida hech qanday belgi yo'q edi va orqaga qaytish havolasi
 * "Topshiriqlar" bo'limiga olib borardi. Odam olimpiadani boshqa topa
 * olmasdi. Endi masala musobaqa ichida ochiladi: yuqorida taymer, A–E
 * harflari va reytingga havola turadi.
 *
 * Sahifa ochilganda foydalanuvchi musobaqaga avtomatik qo'shiladi —
 * "yechdim, lekin reytingda yo'qman" holati shundan kelib chiqqan edi.
 */
export function ContestProblemView({ basePath }: { basePath: string }) {
  const { slug, letter } = useParams<{ slug: string; letter: string }>();
  const supabase = createClient();
  const [data, setData] = useState<ContestOverview | null>(null);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(() => Date.now());

  const load = useCallback(async () => {
    const [{ data: overview }, { data: { user } }] = await Promise.all([
      supabase.rpc("contest_overview", { p_slug: slug }),
      supabase.auth.getUser(),
    ]);
    if (user) setUserId(user.id);
    if (!overview) { setLoading(false); return; }

    const ov = overview as ContestOverview;
    setData(ov);

    const problem = ov.problems.find(p => p.letter.toUpperCase() === letter.toUpperCase());
    if (problem) {
      const { data: ch } = await supabase
        .from("challenges").select("*").eq("slug", problem.slug).maybeSingle();
      if (ch) setChallenge(ch as Challenge);
    }
    setLoading(false);
  }, [supabase, slug, letter]);

  useEffect(() => { load(); }, [load]);

  // Musobaqa ketayotgan bo'lsa avtomatik ro'yxatga qo'shamiz
  useEffect(() => {
    if (!userId || !data || data.phase !== "running" || data.is_registered) return;
    (async () => {
      const { data: res } = await supabase.rpc("join_contest", { p_slug: slug });
      if (res?.ok) {
        toast.success("Olimpiada ishtirokchisi sifatida qo'shildingiz");
        load();
      }
    })();
  }, [userId, data, supabase, slug, load]);

  // Taymer
  useEffect(() => {
    if (data?.phase !== "running") return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [data?.phase]);

  if (loading) return <div className="glass-card h-96 animate-pulse" />;

  if (!data || !challenge) {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <Trophy className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
        <p className="text-muted-foreground mb-6">
          {data?.phase === "upcoming"
            ? "Masalalar musobaqa boshlanganda ochiladi"
            : "Masala topilmadi"}
        </p>
        <Link href={`${basePath}/${slug}`} className="btn-primary py-2.5 px-5 text-sm">
          Olimpiadaga qaytish
        </Link>
      </div>
    );
  }

  const current = data.problems.find(p => p.letter.toUpperCase() === letter.toUpperCase());
  const status = contestStatus(data.contest.starts_at, data.contest.ends_at, now);
  const remaining = new Date(data.contest.ends_at).getTime() - now;

  return (
    <div className="space-y-5">
      {/* Musobaqa paneli — masaladan chiqib ketmaslik uchun doim ko'rinadi */}
      <div className="rounded-2xl border border-border/60 bg-card/40 p-4 space-y-3">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <Link
            href={`${basePath}/${slug}`}
            className="inline-flex items-center gap-2 text-sm font-semibold hover:text-neon-purple transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> {data.contest.title}
          </Link>

          <div className="flex items-center gap-4">
            {status === "running" ? (
              <span className={cn(
                "inline-flex items-center gap-1.5 text-sm font-semibold tabular-nums",
                remaining < 10 * 60 * 1000 ? "text-neon-red" : "text-muted-foreground"
              )}>
                <Clock className="w-4 h-4" /> {countdown(data.contest.ends_at, now)}
              </span>
            ) : (
              <span className="text-xs px-2.5 py-1 rounded-full bg-surface border border-border text-muted-foreground">
                Mashq rejimi — reytingga kirmaydi
              </span>
            )}
            <Link
              href={`${basePath}/${slug}?tab=standings`}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-neon-purple transition-colors"
            >
              <Trophy className="w-4 h-4" /> Reyting
            </Link>
          </div>
        </div>

        {/* Masalalar bo'ylab yurish */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {data.problems.map(p => {
            const active = p.letter.toUpperCase() === letter.toUpperCase();
            return (
              <Link
                key={p.letter}
                href={`${basePath}/${slug}/${p.letter.toLowerCase()}`}
                title={`${p.title} — ${p.points} ball`}
                className={cn(
                  "w-10 h-10 rounded-xl border flex items-center justify-center font-display font-bold text-sm transition-all",
                  active
                    ? "bg-neon-purple text-white border-neon-purple"
                    : p.my_status === "solved"
                    ? "bg-neon-green/10 text-neon-green border-neon-green/30 hover:border-neon-green/60"
                    : p.my_status === "tried"
                    ? "bg-neon-red/[0.08] text-neon-red border-neon-red/25 hover:border-neon-red/50"
                    : "bg-surface border-border text-muted-foreground hover:border-neon-purple/40"
                )}
              >
                {p.letter}
              </Link>
            );
          })}

          {current && (
            <span className="ml-auto inline-flex items-center gap-1.5 text-sm text-neon-yellow font-semibold">
              <Coins className="w-4 h-4" /> {current.points} ball
              {current.my_status === "solved" && <CheckCircle2 className="w-4 h-4 text-neon-green ml-1" />}
              {current.my_status === "tried" && <XCircle className="w-4 h-4 text-neon-red ml-1" />}
            </span>
          )}
        </div>
      </div>

      <ChallengeSolver
        challenge={challenge}
        userId={userId}
        loginRedirect={`${basePath}/${slug}/${letter}`}
        onSolved={load}
      />
    </div>
  );
}
