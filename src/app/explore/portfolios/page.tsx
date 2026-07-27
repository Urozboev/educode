"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { cn, getInitials, getLevelLabel, getLevelColor } from "@/lib/utils";
import { Users, GraduationCap, Zap, ArrowRight } from "lucide-react";

type Row = {
  username: string;
  full_name: string;
  avatar_url: string | null;
  headline: string | null;
  level: string;
  xp: number;
  courses_completed: number;
};

export default function PortfoliosPage() {
  const supabase = createClient();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.rpc("list_public_portfolios", { p_limit: 48 });
      if (data) setRows(data as Row[]);
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-8 md:space-y-10">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
        <p className="eyebrow mb-3">Hamjamiyat</p>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight mb-3">
          Talabalar portfoliosi
        </h1>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
          Platformada o&apos;qiyotgan talabalarning ishlari, sertifikatlari va
          loyihalari. O&apos;zingiznikini <Link href="/portfolio" className="text-neon-purple hover:underline">shu yerdan</Link> oching.
        </p>
      </motion.div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-32 rounded-xl border border-border/40 bg-card/30 animate-pulse" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <div className="py-20 text-center">
          <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-base text-muted-foreground mb-6">
            Hali hech kim portfoliosini ochmagan
          </p>
          <Link href="/portfolio" className="btn-primary py-2.5 px-5 text-sm">
            Birinchi bo&apos;ling
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((r, i) => (
            <motion.article
              key={r.username}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: Math.min(i * 0.04, 0.3) }}
            >
              <Link
                href={`/u/${r.username}`}
                className="group flex flex-col h-full p-5 rounded-xl border border-border/50 bg-card/40 hover:border-neon-purple/30 hover:shadow-lift hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <span className="w-12 h-12 rounded-xl bg-hero-gradient flex items-center justify-center text-white font-display font-bold flex-shrink-0 overflow-hidden">
                    {r.avatar_url
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={r.avatar_url} alt="" className="w-full h-full object-cover" loading="lazy" />
                      : getInitials(r.full_name)}
                  </span>
                  <div className="min-w-0">
                    <p className="font-display font-bold truncate group-hover:text-neon-purple transition-colors">
                      {r.full_name}
                    </p>
                    <p className={cn("text-xs font-semibold", getLevelColor(r.level))}>
                      {getLevelLabel(r.level)}
                    </p>
                  </div>
                </div>

                {r.headline && (
                  <p className="text-sm text-muted-foreground leading-relaxed mt-3 line-clamp-2">
                    {r.headline}
                  </p>
                )}

                <div className="mt-auto pt-4 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1">
                      <GraduationCap className="w-3 h-3" /><span className="numeric">{r.courses_completed}</span>
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Zap className="w-3 h-3" /><span className="numeric">{r.xp}</span>
                    </span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-neon-purple transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      )}
    </div>
  );
}
