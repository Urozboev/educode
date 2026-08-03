"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PlayCircle, RotateCcw, ArrowRight } from "lucide-react";
import { pendingText, type ResumePoint } from "@/lib/resume";

/**
 * Kurs sahifasining tepasidagi "davom ettirish" kartasi.
 *
 * Maqsad — talaba kursga qaytganda birinchi ko'radigan narsa "keyin nima
 * qilishim kerak" degan savolga javob bo'lsin. Mavzular ro'yxatini
 * aylantirib qidirish o'rniga bitta tugma.
 */
export function ResumeCard({ courseSlug, point }: { courseSlug: string; point: ResumePoint }) {
  const href = `/courses/${courseSlug}/topics/${point.slug}`;
  const left = pendingText(point.pending);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-neon-purple/25 bg-neon-purple/[0.06] p-5 flex flex-col sm:flex-row sm:items-center gap-4"
    >
      <div className="w-12 h-12 rounded-xl bg-neon-purple/15 flex items-center justify-center flex-shrink-0">
        {point.courseDone
          ? <RotateCcw className="w-6 h-6 text-neon-purple" />
          : <PlayCircle className="w-6 h-6 text-neon-purple" />}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold uppercase tracking-widest text-neon-purple mb-1">
          {point.courseDone
            ? "Kurs tugatilgan"
            : point.fresh
            ? "Keyingi mavzu"
            : "Qoldirgan joyingiz"}
        </p>
        <p className="font-display font-bold text-lg leading-tight truncate">{point.title}</p>
        <p className="text-xs text-muted-foreground mt-1">
          <span className="numeric">{point.position}</span>/
          <span className="numeric">{point.totalTopics}</span>-mavzu
          {left && !point.courseDone && <> · qoldi: {left}</>}
        </p>
      </div>

      <Link
        href={href}
        className="btn-primary py-2.5 px-5 text-sm inline-flex items-center justify-center gap-2 flex-shrink-0"
      >
        {point.courseDone ? "Takrorlash" : point.fresh ? "Boshlash" : "Davom ettirish"}
        <ArrowRight className="w-4 h-4" />
      </Link>
    </motion.div>
  );
}
