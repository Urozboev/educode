"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { FlaskConical, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * Laboratoriya darslari uchun interaktiv vizual tajriba.
 *
 * Dars matni (content_html) bazada turadi va o'zgarmaydi — tajriba
 * mavzu slug'iga qarab shu yerda ulanadi. Yangi laboratoriya qo'shilsa,
 * faqat LAB_VISUALS xaritasiga bitta qator yoziladi.
 *
 * Har komponent `dynamic` bilan yuklanadi: laboratoriya bo'lmagan
 * darslarga bu kod umuman yuklanmaydi.
 */

const loading = () => <div className="h-48 rounded-2xl border border-border/60 bg-card/40 animate-pulse" />;

const LAB_VISUALS: Record<string, React.ComponentType> = {
  "lab-1-sintaksis-turlar": dynamic(() => import("./TypesViz"), { ssr: false, loading }),
  "lab-2-matnlar": dynamic(() => import("./StringViz"), { ssr: false, loading }),
  "lab-3-royxatlar-for": dynamic(() => import("./ListViz"), { ssr: false, loading }),
  "lab-4-shartlar": dynamic(() => import("./ConditionsViz"), { ssr: false, loading }),
  "lab-5-while": dynamic(() => import("./WhileViz"), { ssr: false, loading }),
  "lab-6-funksiyalar": dynamic(() => import("./FunctionsViz"), { ssr: false, loading }),
};

export function hasLabVisual(topicSlug: string): boolean {
  return topicSlug in LAB_VISUALS;
}

export default function LabVisual({ topicSlug }: { topicSlug: string }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(true);
  const Viz = LAB_VISUALS[topicSlug];
  if (!Viz) return null;

  return (
    <motion.section
      id="vizual-tajriba"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="rounded-3xl border border-neon-purple/25 bg-gradient-to-br from-neon-purple/[0.06] via-card/40 to-neon-cyan/[0.04] p-4 md:p-6"
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full flex items-center gap-3 text-left"
      >
        <span className="w-11 h-11 rounded-2xl bg-hero-gradient text-white flex items-center justify-center shrink-0 shadow-lg shadow-neon-purple/20">
          <FlaskConical className="w-5 h-5" />
        </span>
        <span className="flex-1 min-w-0">
          <span className="block font-display font-bold text-lg leading-tight">{t.labViz.title}</span>
          <span className="block text-xs text-muted-foreground mt-0.5">{t.labViz.subtitle}</span>
        </span>
        <ChevronDown className={cn("w-5 h-5 text-muted-foreground transition-transform shrink-0", open && "rotate-180")} />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-5">
              <Viz />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
