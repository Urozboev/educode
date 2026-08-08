"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Contest } from "@/types";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  contestStatus, STATUS_LABEL, countdown, contestDuration, formatDateTime,
  type ContestStatus,
} from "@/lib/contests";
import { Trophy, Clock, Users, Calendar, ArrowRight } from "lucide-react";

const STATUS_STYLE: Record<ContestStatus, string> = {
  running: "bg-neon-green/10 text-neon-green border-neon-green/25",
  upcoming: "bg-neon-blue/10 text-neon-blue border-neon-blue/25",
  ended: "bg-surface text-muted-foreground border-border",
};

/** `basePath` — kabinetda `/contests`, mehmon sahifasida `/explore/contests` */
export function ContestsView({ basePath = "/explore/contests" }: { basePath?: string } = {}) {
  const supabase = createClient();
  const [contests, setContests] = useState<Contest[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  // Sanoq real vaqtda yurishi uchun har soniyada yangilanadi
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("contests")
        .select("*")
        .eq("is_published", true)
        .order("starts_at", { ascending: false });
      if (data) {
        setContests(data as Contest[]);
        const { data: parts } = await supabase
          .from("contest_participants")
          .select("contest_id");
        if (parts) {
          const map: Record<string, number> = {};
          (parts as { contest_id: string }[]).forEach(p => {
            map[p.contest_id] = (map[p.contest_id] || 0) + 1;
          });
          setCounts(map);
        }
      }
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const groups = useMemo(() => {
    const g: Record<ContestStatus, Contest[]> = { running: [], upcoming: [], ended: [] };
    contests.forEach(c => g[contestStatus(c.starts_at, c.ends_at, now)].push(c));
    // Boshlanmaganlar eng yaqinidan boshlab
    g.upcoming.sort((a, b) => +new Date(a.starts_at) - +new Date(b.starts_at));
    return g;
  }, [contests, now]);

  return (
    <div className="space-y-8 md:space-y-10">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
        <p className="eyebrow mb-3">Musobaqa</p>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight mb-3">
          Olimpiadalar
        </h1>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
          Belgilangan vaqtda masalalarni yeching, natijangiz jonli reytingda
          ko&apos;rinadi. Yechilgan masala soni bo&apos;yicha, teng bo&apos;lsa
          jarima vaqti bo&apos;yicha o&apos;rin beriladi.
        </p>
      </motion.div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-28 rounded-xl border border-border/40 bg-card/30 animate-pulse" />)}
        </div>
      ) : contests.length === 0 ? (
        <div className="py-20 text-center">
          <Trophy className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-base text-muted-foreground">Olimpiadalar tez orada e&apos;lon qilinadi</p>
        </div>
      ) : (
        <div className="space-y-10">
          {(["running", "upcoming", "ended"] as ContestStatus[]).map(status =>
            groups[status].length > 0 && (
              <section key={status}>
                <h2 className="eyebrow mb-4">{STATUS_LABEL[status]}</h2>
                <div className="space-y-3">
                  {groups[status].map((c, i) => (
                    <ContestCard key={c.id} contest={c} status={status} now={now} basePath={basePath}
                      participants={counts[c.id] || 0} delay={i * 0.04} />
                  ))}
                </div>
              </section>
            )
          )}
        </div>
      )}
    </div>
  );
}

function ContestCard({
  contest: c, status, now, participants, delay, basePath,
}: {
  contest: Contest;
  status: ContestStatus;
  now: number;
  participants: number;
  delay: number;
  basePath: string;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
    >
      <Link
        href={`${basePath}/${c.slug}`}
        className="group block p-5 rounded-xl border border-border/50 bg-card/40 hover:border-neon-purple/30 hover:shadow-lift transition-all duration-300"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className={cn("px-2.5 py-1 rounded-full text-[11px] font-semibold border", STATUS_STYLE[status])}>
                {STATUS_LABEL[status]}
              </span>
              {status === "running" && (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-neon-red">
                  <Clock className="w-3 h-3" />
                  <span className="numeric">{countdown(c.ends_at, now)}</span> qoldi
                </span>
              )}
              {status === "upcoming" && (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-neon-blue">
                  <Clock className="w-3 h-3" />
                  <span className="numeric">{countdown(c.starts_at, now)}</span> keyin
                </span>
              )}
            </div>

            <h3 className="font-display font-bold text-lg leading-snug group-hover:text-neon-purple transition-colors">
              {c.title}
            </h3>
            {c.description && (
              <p className="text-sm text-muted-foreground leading-relaxed mt-1 line-clamp-2">
                {c.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground mt-3">
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-3 h-3" />{formatDateTime(c.starts_at)}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3 h-3" />{contestDuration(c.starts_at, c.ends_at)}
              </span>
              <span className="inline-flex items-center gap-1">
                <Users className="w-3 h-3" /><span className="numeric">{participants}</span> ishtirokchi
              </span>
            </div>
          </div>

          <ArrowRight className="w-5 h-5 text-neon-purple flex-shrink-0 transition-transform group-hover:translate-x-0.5" />
        </div>
      </Link>
    </motion.article>
  );
}
