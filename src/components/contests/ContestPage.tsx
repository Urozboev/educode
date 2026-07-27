"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { ContestOverview, ContestStanding } from "@/types";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { cn, getInitials, getDifficultyConfig } from "@/lib/utils";
import {
  contestStatus, STATUS_LABEL, countdown, contestDuration,
  formatDateTime, formatPenalty, type ContestStatus,
} from "@/lib/contests";
import {
  Trophy, Clock, Users, ArrowLeft, ListOrdered, ScrollText, Check,
  Loader2, LogIn, Snowflake, CircleDot,
} from "lucide-react";

type Tab = "problems" | "standings" | "rules";

export function ContestPage({ slug }: { slug: string }) {
  const supabase = createClient();
  const router = useRouter();
  const [data, setData] = useState<ContestOverview | null>(null);
  const [standings, setStandings] = useState<ContestStanding[]>([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [tab, setTab] = useState<Tab>("problems");
  const [now, setNow] = useState(() => Date.now());
  const [me, setMe] = useState<string | null>(null);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const loadOverview = useCallback(async () => {
    const { data: res } = await supabase.rpc("contest_overview", { p_slug: slug });
    if (res) setData(res as ContestOverview);
    setLoading(false);
  }, [supabase, slug]);

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
    const t = setInterval(() => { loadStandings(); loadOverview(); }, 30000);
    return () => clearInterval(t);
  }, [status, loadStandings, loadOverview]);

  async function join() {
    if (!data) return;
    if (!me) { router.push(`/login?redirect=/explore/contests/${slug}`); return; }
    setJoining(true);
    const { error } = await supabase.from("contest_participants").insert({
      contest_id: data.contest.id,
      user_id: me,
    });
    setJoining(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Ro'yxatdan o'tdingiz");
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
        <p className="text-muted-foreground mb-6">Olimpiada topilmadi yoki hali e&apos;lon qilinmagan</p>
        <Link href="/explore/contests" className="btn-primary py-2.5 px-5 text-sm">
          Olimpiadalar ro&apos;yxati
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
        <Link href="/explore/contests"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" /> Olimpiadalar
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
                <Check className="w-4 h-4" /> Ro&apos;yxatdasiz
              </span>
            ) : (
              <button onClick={join} disabled={joining}
                className="btn-primary py-2.5 px-6 text-sm inline-flex items-center gap-2 disabled:opacity-50">
                {joining ? <Loader2 className="w-4 h-4 animate-spin" />
                  : me ? <Trophy className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
                {me ? "Ishtirok etish" : "Kirib ro'yxatdan o'tish"}
              </button>
            )
          )}
        </div>
      </div>

      {/* Holat paneli */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Info label="Holat" value={STATUS_LABEL[status]}
          accent={status === "running" ? "text-neon-green" : status === "upcoming" ? "text-neon-blue" : undefined} />
        <Info
          label={status === "upcoming" ? "Boshlanishiga" : status === "running" ? "Tugashiga" : "Boshlangan"}
          value={status === "ended" ? formatDateTime(c.starts_at) : countdown(status === "upcoming" ? c.starts_at : c.ends_at, now)}
          mono={status !== "ended"}
          accent={status === "running" ? "text-neon-red" : undefined}
        />
        <Info label="Davomiyligi" value={contestDuration(c.starts_at, c.ends_at)} />
        <Info label="Ishtirokchi" value={String(data.participants)} mono />
      </div>

      {frozen && (
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-neon-blue/[0.07] border border-neon-blue/25 text-sm">
          <Snowflake className="w-4 h-4 flex-shrink-0 mt-0.5 text-neon-blue" />
          <span className="leading-relaxed text-muted-foreground">
            Reyting muzlatildi — oxirgi <span className="numeric">{c.freeze_minutes}</span> daqiqadagi
            natijalar musobaqa tugagach ko&apos;rinadi.
          </span>
        </div>
      )}

      {/* Tablar */}
      <div className="flex gap-2 border-b border-border">
        {([
          { v: "problems", label: "Masalalar", Icon: ListOrdered },
          { v: "standings", label: "Reyting", Icon: Trophy },
          { v: "rules", label: "Qoidalar", Icon: ScrollText },
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

      {tab === "problems" && (
        status === "upcoming" ? (
          <div className="py-16 text-center border border-dashed border-border rounded-2xl">
            <Clock className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="font-semibold mb-1">Masalalar hali yopiq</p>
            <p className="text-sm text-muted-foreground">
              <span className="numeric">{data.problem_count}</span> ta masala musobaqa
              boshlanganda ochiladi
            </p>
          </div>
        ) : data.problems.length === 0 ? (
          <p className="py-12 text-center text-muted-foreground">Masalalar qo&apos;shilmagan</p>
        ) : (
          <div className="space-y-2">
            {data.problems.map(p => {
              const diff = getDifficultyConfig(p.difficulty);
              return (
                <Link
                  key={p.letter}
                  href={`/challenges/${p.slug}`}
                  className="group flex items-center gap-4 p-4 rounded-xl border border-border/50 bg-card/40 hover:border-neon-purple/30 transition-all"
                >
                  <span className="w-10 h-10 rounded-xl bg-neon-purple/[0.08] border border-neon-purple/20 flex items-center justify-center font-display font-bold text-neon-purple flex-shrink-0">
                    {p.letter}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate group-hover:text-neon-purple transition-colors">
                      {p.title}
                    </p>
                    <span className={cn("text-[11px]", diff.class)}>{diff.label}</span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground flex-shrink-0">
                    <Users className="w-3 h-3" /><span className="numeric">{p.solved_by}</span> yechdi
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
            <p className="eyebrow mb-2">Baholash</p>
            <p className="text-muted-foreground leading-relaxed">
              O&apos;rin avval <b className="text-foreground">yechilgan masalalar soni</b> bo&apos;yicha
              beriladi. Teng bo&apos;lsa — <b className="text-foreground">jarima vaqti</b> kam
              bo&apos;lgani yuqori turadi.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Jarima = masala yechilgan daqiqa + har bir noto&apos;g&apos;ri urinish uchun{" "}
              <span className="numeric text-foreground">{c.penalty_minutes}</span> daqiqa.
              Yechilmagan masala uchun jarima yozilmaydi.
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

function Standings({ rows, problems, me }: { rows: ContestStanding[]; problems: string[]; me: string | null }) {
  if (rows.length === 0) {
    return (
      <div className="py-16 text-center border border-dashed border-border rounded-2xl">
        <Trophy className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
        <p className="text-muted-foreground">Hali ishtirokchi yo&apos;q</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-border text-left">
            <th className="py-2.5 pr-3 font-medium text-muted-foreground text-xs">#</th>
            <th className="py-2.5 pr-3 font-medium text-muted-foreground text-xs">Ishtirokchi</th>
            <th className="py-2.5 px-2 font-medium text-muted-foreground text-xs text-center">Yechdi</th>
            <th className="py-2.5 px-2 font-medium text-muted-foreground text-xs text-center">Jarima</th>
            {problems.map(l => (
              <th key={l} className="py-2.5 px-1.5 font-medium text-muted-foreground text-xs text-center w-12">{l}</th>
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
                </div>
              </td>
              <td className="py-2.5 px-2 text-center numeric font-semibold">{r.solved}</td>
              <td className="py-2.5 px-2 text-center numeric text-muted-foreground">
                {formatPenalty(r.penalty)}
              </td>
              {problems.map(l => {
                const cell = r.details?.[l];
                return (
                  <td key={l} className="py-2.5 px-1.5 text-center">
                    {cell ? (
                      <span className="inline-flex flex-col items-center leading-tight">
                        <span className="numeric text-[11px] text-neon-green">{cell.minute}</span>
                        {cell.wrong > 0 && (
                          <span className="numeric text-[9px] text-neon-red">−{cell.wrong}</span>
                        )}
                      </span>
                    ) : (
                      <CircleDot className="w-3 h-3 text-muted-foreground/20 mx-auto" />
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
