"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "@/components/i18n/Link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useI18n } from "@/lib/i18n";
import { withTranslation, withTranslations } from "@/lib/i18n/content";
import type { ContestOverview, ContestStanding } from "@/types";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { cn, getInitials, getDifficultyConfig } from "@/lib/utils";
import {
  contestStatus, countdown, contestDuration,
  formatDateTime, formatPenalty, type ContestStatus,
} from "@/lib/contests";
import {
  Trophy, Clock, Users, ArrowLeft, ListOrdered, ScrollText, Check,
  Loader2, LogIn, Snowflake, CircleDot, Dumbbell,
} from "lucide-react";

type Tab = "problems" | "standings" | "rules";

/**
 * `basePath` — olimpiada qaysi bo'lim ichida ochilgani.
 *
 * Kabinetdagi o'quvchi uchun `/contests`, mehmon uchun `/explore/contests`.
 * Ilgari faqat `/explore/contests` bor edi: tizimga kirgan o'quvchi
 * olimpiadaga o'tganda kabinetdan chiqib ketardi va yon menyuda
 * olimpiadaga qaytish havolasi umuman yo'q edi.
 */
export function ContestPage({
  slug,
  basePath = "/explore/contests",
}: {
  slug: string;
  basePath?: string;
}) {
  const supabase = createClient();
  const router = useRouter();
  const [data, setData] = useState<ContestOverview | null>(null);
  const [standings, setStandings] = useState<ContestStanding[]>([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  // Masala sahifasidagi "Reyting" havolasi ?tab=standings bilan keladi
  const params = useSearchParams();
  const [tab, setTab] = useState<Tab>(
    params.get("tab") === "standings" ? "standings" : "problems"
  );
  const [now, setNow] = useState(() => Date.now());
  const [me, setMe] = useState<string | null>(null);
  const { locale, t } = useI18n();

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const loadOverview = useCallback(async () => {
    const { data: res } = await supabase.rpc("contest_overview", { p_slug: slug });
    if (res) {
      // Olimpiada va masala nomlari alohida resurslarda yotadi:
      // musobaqaning o'zi `contests`, masalalar esa `challenges` da
      const ov = res as ContestOverview;
      const [contest, problems] = await Promise.all([
        withTranslation(supabase, "contests", ov.contest, locale),
        withTranslations(supabase, "challenges", ov.problems, locale),
      ]);
      setData({ ...ov, contest: contest ?? ov.contest, problems });
    }
    setLoading(false);
  }, [supabase, slug, locale]);

  const loadStandings = useCallback(async () => {
    const { data: res } = await supabase.rpc("contest_standings", { p_slug: slug });
    if (res) setStandings(res as ContestStanding[]);
  }, [supabase, slug]);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setMe(user?.id ?? null);
      await loadOverview();
      await loadStandings();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  // Musobaqa davomida reyting o'zi yangilanib turadi
  const status: ContestStatus | null = data
    ? contestStatus(data.contest.starts_at, data.contest.ends_at, now)
    : null;

  useEffect(() => {
    if (status !== "running") return;
    const timer = setInterval(() => { loadStandings(); loadOverview(); }, 30000);
    return () => clearInterval(timer);
  }, [status, loadStandings, loadOverview]);

  async function join() {
    if (!data) return;
    if (!me) { router.push(`/login?redirect=${basePath}/${slug}`); return; }
    setJoining(true);
    // RPC orqali: to'g'ridan-to'g'ri INSERT dublikat va tugagan musobaqa
    // holatlarini o'zi hal qila olmasdi
    const { data: res, error } = await supabase.rpc("join_contest", { p_slug: slug });
    setJoining(false);
    if (error || !res?.ok) { toast.error(res?.message || error?.message || t.contests.page.joinFailed); return; }
    toast.success(t.contests.page.joined);
    loadOverview();
    loadStandings();
  }

  if (loading) {
    return <div className="max-w-4xl mx-auto h-96 rounded-2xl border border-border/40 bg-card/30 animate-pulse" />;
  }

  if (!data || !status) {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <Trophy className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
        <p className="text-muted-foreground mb-6">{t.contests.page.notPublished}</p>
        <Link href={basePath} className="btn-primary py-2.5 px-5 text-sm">
          {t.contests.page.listLink}
        </Link>
      </div>
    );
  }

  const c = data.contest;
  const frozen = status === "running" && c.freeze_minutes > 0 &&
    now >= new Date(c.ends_at).getTime() - c.freeze_minutes * 60000;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <Link href={basePath}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" /> {t.contests.page.backToList}
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl tracking-tight">{c.title}</h1>
            {c.description && (
              <p className="text-muted-foreground mt-2 max-w-2xl leading-relaxed">{c.description}</p>
            )}
          </div>

          {/* Ro'yxatdan o'tish — tugagandan keyin yopiladi */}
          {status !== "ended" && (
            data.is_registered ? (
              <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-neon-green/[0.08] text-neon-green border border-neon-green/25">
                <Check className="w-4 h-4" /> {t.contests.registered}
              </span>
            ) : (
              <button onClick={join} disabled={joining}
                className="btn-primary py-2.5 px-6 text-sm inline-flex items-center gap-2 disabled:opacity-50">
                {joining ? <Loader2 className="w-4 h-4 animate-spin" />
                  : me ? <Trophy className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
                {me ? t.contests.join : t.contests.page.loginAndJoin}
              </button>
            )
          )}
        </div>
      </div>

      {/* Holat paneli */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Info label={t.contests.page.statusLabel} value={status === "upcoming" ? t.contests.upcoming : status === "running" ? t.contests.running : t.contests.ended}
          accent={status === "running" ? "text-neon-green" : status === "upcoming" ? "text-neon-blue" : undefined} />
        <Info
          label={status === "upcoming" ? t.contests.page.untilStart : status === "running" ? t.contests.page.untilEnd : t.contests.page.startedAt}
          value={status === "ended" ? formatDateTime(c.starts_at, locale) : countdown(status === "upcoming" ? c.starts_at : c.ends_at, now, t)}
          mono={status !== "ended"}
          accent={status === "running" ? "text-neon-red" : undefined}
        />
        <Info label={t.contests.page.duration} value={contestDuration(c.starts_at, c.ends_at, t)} />
        <Info label={t.contests.participants} value={String(data.participants)} mono />
      </div>

      {frozen && (
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-neon-blue/[0.07] border border-neon-blue/25 text-sm">
          <Snowflake className="w-4 h-4 flex-shrink-0 mt-0.5 text-neon-blue" />
          <span className="leading-relaxed text-muted-foreground">
            {t.contests.page.frozen} <span className="numeric">{c.freeze_minutes}</span>{" "}
            {t.contests.page.frozenTail}
          </span>
        </div>
      )}

      {/* Tablar */}
      <div className="flex gap-2 border-b border-border">
        {([
          { v: "problems", label: t.contests.problems, Icon: ListOrdered },
          { v: "standings", label: t.contests.standings, Icon: Trophy },
          { v: "rules", label: t.contests.rules, Icon: ScrollText },
        ] as const).map(t => (
          <button
            key={t.v}
            onClick={() => setTab(t.v)}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 -mb-px transition-colors",
              tab === t.v
                ? "border-neon-purple text-neon-purple"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <t.Icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      {/* Tugagan musobaqa: masalalar mashq uchun ochiq, lekin reytingga kirmaydi */}
      {tab === "problems" && data.phase === "practice" && data.problems.length > 0 && (
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-surface/60 border border-border/60 text-sm">
          <Dumbbell className="w-4 h-4 flex-shrink-0 mt-0.5 text-muted-foreground" />
          <span className="leading-relaxed text-muted-foreground">
            {t.contests.page.practiceNote}
          </span>
        </div>
      )}

      {tab === "problems" && (
        data.phase === "upcoming" ? (
          <div className="py-16 text-center border border-dashed border-border rounded-2xl">
            <Clock className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="font-semibold mb-1">{t.contests.page.problemsLocked}</p>
            <p className="text-sm text-muted-foreground">
              <span className="numeric">{data.problem_count}</span> {t.contests.page.problemsLockedTail}
            </p>
          </div>
        ) : data.problems.length === 0 ? (
          <p className="py-12 text-center text-muted-foreground">{t.contests.page.noProblems}</p>
        ) : (
          <div className="space-y-2">
            {data.problems.map(p => {
              const diff = getDifficultyConfig(p.difficulty);
              return (
                <Link
                  key={p.letter}
                  // Musobaqa ichidagi manzil: taymer, harflar va reyting
                  // havolasi saqlanib qoladi
                  href={`${basePath}/${slug}/${p.letter.toLowerCase()}`}
                  className={cn(
                    "group flex items-center gap-4 p-4 rounded-xl border bg-card/40 transition-all",
                    p.my_status === "solved"
                      ? "border-neon-green/30 hover:border-neon-green/60"
                      : p.my_status === "tried"
                      ? "border-neon-red/25 hover:border-neon-red/50"
                      : "border-border/50 hover:border-neon-purple/30"
                  )}
                >
                  <span className={cn(
                    "w-10 h-10 rounded-xl border flex items-center justify-center font-display font-bold flex-shrink-0",
                    p.my_status === "solved"
                      ? "bg-neon-green/10 border-neon-green/30 text-neon-green"
                      : p.my_status === "tried"
                      ? "bg-neon-red/[0.08] border-neon-red/25 text-neon-red"
                      : "bg-neon-purple/[0.08] border-neon-purple/20 text-neon-purple"
                  )}>
                    {p.letter}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate group-hover:text-neon-purple transition-colors">
                      {p.title}
                    </p>
                    <span className="inline-flex items-center gap-2">
                      <span className={cn("text-[11px]", diff.class)}>{diff.label}</span>
                      <span className="text-[11px] text-neon-yellow numeric">{p.points} ball</span>
                    </span>
                  </div>

                  {p.my_status === "solved" && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-neon-green flex-shrink-0">
                      <Check className="w-3.5 h-3.5" /> Yechildi
                    </span>
                  )}
                  {p.my_status === "tried" && (
                    <span className="text-[11px] font-semibold text-neon-red flex-shrink-0">
                      Urinilgan
                    </span>
                  )}

                  <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground flex-shrink-0">
                    <Users className="w-3 h-3" /><span className="numeric">{p.solved_by}</span> {t.contests.page.solvedBy}
                  </span>
                </Link>
              );
            })}
          </div>
        )
      )}

      {tab === "standings" && (
        <Standings rows={standings} problems={data.problems.map(p => p.letter)} me={me} />
      )}

      {tab === "rules" && (
        <div className="space-y-5">
          <div className="p-5 rounded-xl border border-border bg-surface/30 space-y-2 text-sm">
            <p className="eyebrow mb-2">{t.contests.page.scoringTitle}</p>
            <p className="text-muted-foreground leading-relaxed">
              {t.contests.page.scoringRank} <b className="text-foreground">{t.contests.page.scoringRankBold}</b>{" "}
              {t.contests.page.scoringRankTail} <b className="text-foreground">{t.contests.page.scoringPenaltyBold}</b>{" "}
              {t.contests.page.scoringPenaltyTail}
            </p>
            <p className="text-muted-foreground leading-relaxed">
              {t.contests.page.penaltyFormula}{" "}
              <span className="numeric text-foreground">{c.penalty_minutes}</span>{" "}
              {t.contests.page.penaltyFormulaTail}
            </p>
          </div>
          {c.rules_html && (
            <div className="prose prose-sm dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: c.rules_html }} />
          )}
        </div>
      )}
    </div>
  );
}

function Info({ label, value, mono, accent }: { label: string; value: string; mono?: boolean; accent?: string }) {
  return (
    <div className="p-4 rounded-xl border border-border/60 bg-card/40">
      <p className="text-[11px] text-muted-foreground mb-1">{label}</p>
      <p className={cn("font-semibold", mono && "numeric", accent)}>{value}</p>
    </div>
  );
}

/**
 * Reyting jadvali.
 *
 * Bu ayni paytda ishtirokchilar ro'yxati ham: masala yechmaganlar 0 bilan
 * pastda turadi. Shuning uchun alohida "Ishtirokchilar" tabi qo'shilmadi —
 * u aynan shu ma'lumotni takrorlagan bo'lardi.
 *
 * Katak ranglari: yashil — yechilgan, qizil — urinilgan lekin yechilmagan,
 * bo'sh nuqta — umuman tegilmagan.
 */
function Standings({ rows, problems, me }: { rows: ContestStanding[]; problems: string[]; me: string | null }) {
  const { t } = useI18n();
  if (rows.length === 0) {
    return (
      <div className="py-16 text-center border border-dashed border-border rounded-2xl">
        <Trophy className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
        <p className="text-muted-foreground">{t.contests.page.noParticipants}</p>
        <p className="text-xs text-muted-foreground/70 mt-1.5">
          {t.contests.page.standingsHint}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4 text-[11px] text-muted-foreground flex-wrap">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-neon-green/20 border border-neon-green/40" /> {t.contests.page.legendSolved}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-neon-red/[0.12] border border-neon-red/35" /> {t.contests.page.legendTried}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <CircleDot className="w-3 h-3 text-muted-foreground/30" /> {t.contests.page.legendUntouched}
        </span>
        <span className="ml-auto">{t.contests.page.cellMeaning}</span>
      </div>

      <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="py-2.5 pr-3 font-medium text-muted-foreground text-xs">#</th>
              <th className="py-2.5 pr-3 font-medium text-muted-foreground text-xs">{t.contests.participants}</th>
              <th className="py-2.5 px-2 font-medium text-muted-foreground text-xs text-center">{t.contests.solvedCol}</th>
              <th className="py-2.5 px-2 font-medium text-neon-yellow text-xs text-center">{t.contests.pointsCol}</th>
              <th className="py-2.5 px-2 font-medium text-muted-foreground text-xs text-center">{t.contests.penaltyCol}</th>
              {problems.map(l => (
                <th key={l} className="py-2.5 px-1.5 font-medium text-muted-foreground text-xs text-center w-14">{l}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr
                key={r.user_id}
                className={cn(
                  "border-b border-border/50",
                  r.user_id === me && "bg-neon-purple/[0.06]"
                )}
              >
                <td className="py-2.5 pr-3 numeric text-muted-foreground">{r.rank}</td>
                <td className="py-2.5 pr-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-7 h-7 rounded-lg bg-hero-gradient flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 overflow-hidden">
                      {r.avatar_url
                        // eslint-disable-next-line @next/next/no-img-element
                        ? <img src={r.avatar_url} alt="" className="w-full h-full object-cover" />
                        : getInitials(r.full_name)}
                    </span>
                    {r.username ? (
                      <Link href={`/u/${r.username}`} className="truncate hover:text-neon-purple transition-colors">
                        {r.full_name}
                      </Link>
                    ) : (
                      <span className="truncate">{r.full_name}</span>
                    )}
                    {r.user_id === me && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-neon-purple/15 text-neon-purple flex-shrink-0">{t.contests.page.you}</span>
                    )}
                  </div>
                </td>
                <td className="py-2.5 px-2 text-center numeric font-semibold">{r.solved}</td>
                <td className="py-2.5 px-2 text-center numeric font-bold text-neon-yellow">{r.points}</td>
                <td className="py-2.5 px-2 text-center numeric text-muted-foreground">
                  {formatPenalty(r.penalty)}
                </td>
                {problems.map(l => {
                  const cell = r.details?.[l];
                  return (
                    <td key={l} className="py-1.5 px-1.5 text-center">
                      {!cell ? (
                        <CircleDot className="w-3 h-3 text-muted-foreground/20 mx-auto" />
                      ) : cell.status === "solved" ? (
                        <span className="inline-flex flex-col items-center leading-tight rounded-md bg-neon-green/[0.12] border border-neon-green/30 px-1.5 py-1 min-w-[42px]">
                          <span className="numeric text-[11px] font-semibold text-neon-green">+{cell.points}</span>
                          <span className="numeric text-[9px] text-muted-foreground">
                            {cell.minute}&apos;{cell.wrong > 0 && <span className="text-neon-red"> −{cell.wrong}</span>}
                          </span>
                        </span>
                      ) : (
                        <span className="inline-flex flex-col items-center leading-tight rounded-md bg-neon-red/[0.10] border border-neon-red/30 px-1.5 py-1 min-w-[42px]">
                          <span className="numeric text-[11px] font-semibold text-neon-red">−{cell.wrong}</span>
                          <span className="text-[9px] text-muted-foreground">urinish</span>
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
