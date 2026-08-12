"use client";

import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { useI18n } from "@/lib/i18n";
import { withTranslations } from "@/lib/i18n/content";
import type { TeachingMethod, MethodStage } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { STAGES, groupSizeLabel } from "@/lib/methods";
import {
  Lightbulb, Search, Clock, Users, ThumbsUp, ThumbsDown,
  Package, ChevronDown,
} from "lucide-react";

export function MethodsView() {
  const supabase = createClient();
  const [methods, setMethods] = useState<TeachingMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const { locale, t } = useI18n();
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState<MethodStage | "all">("all");
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("teaching_methods")
        .select("*")
        .eq("is_published", true)
        .order("order_index")
        .order("title");
      if (data) setMethods(await withTranslations(supabase, "teaching_methods", data as TeachingMethod[], locale));
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  const filtered = useMemo(() => methods.filter(m =>
    (stage === "all" || m.stage === stage) &&
    (m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.summary.toLowerCase().includes(search.toLowerCase()))
  ), [methods, search, stage]);

  return (
    <div className="space-y-8 md:space-y-10">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
        <p className="eyebrow mb-3">{t.explore.methodsEyebrow}</p>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight mb-3">
          Dars metodlari
        </h1>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
          Har bir metod bo&apos;yicha qadamma-qadam yo&apos;riqnoma, afzallik va kamchiliklari.
          Dars bosqichiga qarab tanlang.
        </p>
      </motion.div>

      {/* Qidiruv va bosqich filtri */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t.explore.methodsSearch}
            className="w-full bg-surface/60 border border-border rounded-2xl pl-12 pr-4 py-3.5 text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-neon-purple/40 focus:border-neon-purple/40 transition-all"
          />
        </div>

        {/* Bosqichlar dars ketma-ketligini bildiradi — shuning uchun tartib muhim */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
          <button
            onClick={() => setStage("all")}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap flex-shrink-0 border",
              stage === "all"
                ? "bg-foreground text-background border-foreground"
                : "bg-surface/40 text-muted-foreground border-border/50 hover:border-border hover:text-foreground"
            )}
          >
            Barchasi
          </button>
          {STAGES.map((s, i) => (
            <button
              key={s.value}
              onClick={() => setStage(s.value)}
              title={s.hint}
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap flex-shrink-0 border",
                stage === s.value
                  ? "bg-foreground text-background border-foreground"
                  : "bg-surface/40 text-muted-foreground border-border/50 hover:border-border hover:text-foreground"
              )}
            >
              <span className={cn("numeric text-[11px]", stage === s.value ? "opacity-70" : "opacity-50")}>
                {String(i + 1).padStart(2, "0")}
              </span>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Ro'yxat */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-28 rounded-xl border border-border/40 bg-card/30 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center">
          <Lightbulb className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-base text-muted-foreground">
            {methods.length === 0 ? "Metodlar tez orada qo'shiladi" : "Natija topilmadi"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((m, i) => {
            const open = openId === m.id;
            return (
              <motion.article
                key={m.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: Math.min(i * 0.04, 0.3) }}
                className="rounded-xl border border-border/50 bg-card/40 overflow-hidden"
              >
                <button
                  onClick={() => setOpenId(open ? null : m.id)}
                  className="w-full text-left p-5 flex items-start gap-4 hover:bg-surface/40 transition-colors"
                  aria-expanded={open}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <span className="eyebrow">
                        {STAGES.find(s => s.value === m.stage)?.label}
                      </span>
                      {m.duration_minutes ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Clock className="w-3 h-3" />{m.duration_minutes} daq
                        </span>
                      ) : null}
                      <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Users className="w-3 h-3" />{groupSizeLabel(m.group_size)}
                      </span>
                    </div>
                    <h2 className="font-display font-bold text-lg leading-snug">{m.title}</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed mt-1">{m.summary}</p>
                  </div>
                  <ChevronDown className={cn("w-5 h-5 text-muted-foreground flex-shrink-0 mt-1 transition-transform", open && "rotate-180")} />
                </button>

                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-1 space-y-5 border-t border-border/50">
                        {/* Afzallik / kamchilik */}
                        {(m.advantages?.length > 0 || m.disadvantages?.length > 0) && (
                          <div className="grid sm:grid-cols-2 gap-4 pt-5">
                            {m.advantages?.length > 0 && (
                              <div>
                                <h3 className="inline-flex items-center gap-1.5 text-sm font-semibold text-neon-green mb-2">
                                  <ThumbsUp className="w-4 h-4" /> Afzalliklari
                                </h3>
                                <ul className="space-y-1.5">
                                  {m.advantages.map(a => (
                                    <li key={a} className="text-sm text-muted-foreground leading-relaxed flex gap-2">
                                      <span className="text-neon-green mt-0.5">+</span>{a}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {m.disadvantages?.length > 0 && (
                              <div>
                                <h3 className="inline-flex items-center gap-1.5 text-sm font-semibold text-neon-red mb-2">
                                  <ThumbsDown className="w-4 h-4" /> Kamchiliklari
                                </h3>
                                <ul className="space-y-1.5">
                                  {m.disadvantages.map(d => (
                                    <li key={d} className="text-sm text-muted-foreground leading-relaxed flex gap-2">
                                      <span className="text-neon-red mt-0.5">−</span>{d}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Materiallar */}
                        {m.materials?.length > 0 && (
                          <div>
                            <h3 className="inline-flex items-center gap-1.5 text-sm font-semibold mb-2">
                              <Package className="w-4 h-4 text-muted-foreground" /> Kerakli materiallar
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {m.materials.map(mt => (
                                <span key={mt} className="px-2.5 py-1 rounded-lg text-xs bg-surface border border-border/60">
                                  {mt}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Yo'riqnoma */}
                        {m.guide_html && (
                          <div>
                            <h3 className="text-sm font-semibold mb-2">{t.explore.howToRun}</h3>
                            <div
                              className="prose prose-sm dark:prose-invert max-w-none"
                              dangerouslySetInnerHTML={{ __html: m.guide_html }}
                            />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.article>
            );
          })}
        </div>
      )}
    </div>
  );
}
