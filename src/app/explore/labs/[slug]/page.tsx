"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { getLab, type LabSlug } from "@/lib/labs";
import { SortingLab } from "@/components/labs/SortingLab";
import { LoopsLab } from "@/components/labs/LoopsLab";
import { HardwareLab } from "@/components/labs/HardwareLab";
import { BinaryLab } from "@/components/labs/BinaryLab";
import { ArrowLeft, Target, Clock } from "lucide-react";

/**
 * Slug → komponent. Zanjir `if` o'rniga xarita: yangi lab qo'shilganda
 * bitta qator yoziladi va biror turi qolib ketsa TypeScript xato beradi.
 */
const LAB_COMPONENTS: Record<LabSlug, React.ComponentType> = {
  sorting: SortingLab,
  loops: LoopsLab,
  hardware: HardwareLab,
  binary: BinaryLab,
};

export default function LabPage() {
  const { slug } = useParams<{ slug: string }>();
  const lab = getLab(slug);
  if (!lab) notFound();

  const Lab = LAB_COMPONENTS[lab.slug];

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Link
          href="/explore/labs"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Laboratoriyalar
        </Link>

        <h1 className="font-display font-extrabold text-3xl sm:text-4xl tracking-tight mb-3">
          {lab.title}
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed max-w-2xl">{lab.summary}</p>

        <div className="mt-5 p-4 rounded-xl border border-border bg-surface/30 max-w-2xl">
          <div className="flex items-center justify-between gap-4 mb-2">
            <p className="eyebrow inline-flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5" /> Nimani o&apos;rganasiz
            </p>
            <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Clock className="w-3 h-3" /> <span className="numeric">{lab.minutes}</span> daqiqa
            </span>
          </div>
          <ul className="space-y-1">
            {lab.goals.map(g => (
              <li key={g} className="text-sm text-muted-foreground flex gap-2">
                <span className="text-neon-purple mt-0.5">·</span>{g}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      <Lab />
    </div>
  );
}
