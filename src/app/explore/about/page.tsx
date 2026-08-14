"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { Target, User, Layers } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function AboutPage() {
  const supabase = createClient();
  const [data, setData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: rows } = await supabase.from("about_page").select("key, value");
      if (rows) {
        const map: Record<string, string> = {};
        rows.forEach((r) => {
          map[r.key] = r.value;
        });
        setData(map);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-pulse">
        <div className="h-48 rounded-2xl border border-border/40 bg-card/30" />
        <div className="h-32 rounded-2xl border border-border/40 bg-card/30" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      {/* Header */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-sm font-semibold text-neon-purple uppercase tracking-widest mb-4">
          Platforma
        </p>
        <h1 className="font-display font-extrabold text-4xl md:text-5xl tracking-tight mb-4">
          {data.project_title || "EduCode Platformasi"}
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
          {data.project_description || ""}
        </p>
      </motion.div>

      {/* Author */}
      <motion.div
        className="p-7 md:p-8 rounded-3xl border border-border/50 bg-card/40 flex flex-col md:flex-row items-center md:items-start gap-6"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="w-28 h-28 rounded-2xl bg-hero-gradient flex items-center justify-center flex-shrink-0 overflow-hidden shadow-lg shadow-neon-purple/20">
          {data.author_image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={data.author_image} alt={data.author_name} className="w-full h-full object-cover" />
          ) : (
            <User className="w-12 h-12 text-white" />
          )}
        </div>
        <div className="text-center md:text-left flex-1">
          <h2 className="font-display font-bold text-2xl">{data.author_name || "Muallif"}</h2>
          <p className="text-neon-purple font-semibold text-[15px] mb-3">
            {data.author_title || ""}
          </p>
          <p className="text-[15px] text-muted-foreground leading-relaxed">
            {data.author_bio || ""}
          </p>
        </div>
      </motion.div>

      {/* Goals */}
      {data.project_goals && (
        <motion.div
          className="p-7 md:p-8 rounded-3xl border border-border/50 bg-card/40"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-neon-purple/10 border border-neon-purple/20 flex items-center justify-center">
              <Target className="w-5 h-5 text-neon-purple" />
            </div>
            <h2 className="font-display font-bold text-xl">Loyiha maqsadlari</h2>
          </div>
          <p className="text-[15px] text-muted-foreground leading-relaxed whitespace-pre-line">
            {data.project_goals}
          </p>
        </motion.div>
      )}

      {/* Tech stack */}
      <motion.div
        className="p-7 md:p-8 rounded-3xl border border-border/50 bg-card/40"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-neon-blue/10 border border-neon-blue/20 flex items-center justify-center">
            <Layers className="w-5 h-5 text-neon-blue" />
          </div>
          <h2 className="font-display font-bold text-xl">Ishlatilgan texnologiyalar</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { name: "Next.js 14", desc: "Frontend framework", color: "#6C5CE7" },
            { name: "Supabase", desc: "Backend va DB", color: "#00D2FF" },
            { name: "Claude AI", desc: "Kod tahlili", color: "#FF6B9D" },
            { name: "Gemini AI", desc: "Chatbot", color: "#FFD600" },
            { name: "Monaco Editor", desc: "Kod muharriri", color: "#00E676" },
            { name: "Judge0", desc: "Kod bajarish", color: "#FF5252" },
          ].map((t) => (
            <div
              key={t.name}
              className="p-4 rounded-2xl bg-surface/50 border border-border/50"
            >
              <div
                className="w-2.5 h-2.5 rounded-full mb-2.5"
                style={{ backgroundColor: t.color }}
              />
              <p className="font-display font-bold text-[15px] leading-tight">{t.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{t.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
