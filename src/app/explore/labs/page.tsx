"use client";

import Link from "@/components/i18n/Link";
import { motion } from "framer-motion";
import { LABS } from "@/lib/labs";
import { LevelBadge } from "@/components/ui/LevelBadge";
import { FlaskConical, Clock, ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function LabsPage() {
  const { t } = useI18n();
  return (
    <div className="space-y-8 md:space-y-10">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
        <p className="eyebrow mb-3">Amaliyot</p>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight mb-3">
          Virtual laboratoriyalar
        </h1>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
          {t.explore.labsSubtitle}
        </p>
      </motion.div>

      <div className="grid gap-5 sm:grid-cols-2">
        {LABS.map((lab, i) => (
          <motion.article
            key={lab.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          >
            <Link
              href={`/explore/labs/${lab.slug}`}
              className="group flex flex-col h-full p-6 rounded-[10px] border border-border/50 bg-card/40 hover:border-neon-purple/30 hover:shadow-lift hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="w-11 h-11 rounded-xl bg-neon-purple/[0.08] border border-neon-purple/20 flex items-center justify-center">
                  <FlaskConical className="w-5 h-5 text-neon-purple" />
                </span>
                <LevelBadge difficulty={lab.difficulty} />
              </div>

              <h2 className="font-display font-bold text-xl leading-snug group-hover:text-neon-purple transition-colors">
                {lab.title}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed mt-2">{lab.summary}</p>

              <div className="mt-auto pt-5 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <Clock className="w-3 h-3" /> ~<span className="numeric">{lab.minutes}</span> daqiqa
                </span>
                <span className="inline-flex items-center gap-1.5 text-sm font-bold text-neon-purple">
                  Ochish <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
