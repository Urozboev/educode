"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { Code2, Target, Users, BookOpen, Brain, Trophy, User } from "lucide-react";

export default function AboutPage() {
  const supabase = createClient();
  const [data, setData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: rows } = await supabase.from("about_page").select("key, value");
      if (rows) {
        const map: Record<string, string> = {};
        rows.forEach(r => { map[r.key] = r.value; });
        setData(map);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="max-w-3xl mx-auto space-y-4 animate-pulse"><div className="glass-card h-48" /><div className="glass-card h-32" /></div>;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <motion.div className="text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display font-bold text-4xl mb-3">{data.project_title || "EduCode Platformasi"}</h1>
        <p className="text-muted-foreground text-lg">{data.project_description || ""}</p>
      </motion.div>

      {/* Muallif */}
      <motion.div className="glass-card p-8 flex flex-col md:flex-row items-center gap-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="w-28 h-28 rounded-2xl bg-hero-gradient flex items-center justify-center flex-shrink-0 overflow-hidden">
          {data.author_image ? (
            <img src={data.author_image} alt={data.author_name} className="w-full h-full object-cover" />
          ) : (
            <User className="w-12 h-12 text-white" />
          )}
        </div>
        <div className="text-center md:text-left">
          <h2 className="font-display font-bold text-2xl">{data.author_name || "Muallif"}</h2>
          <p className="text-neon-purple font-medium text-sm mb-3">{data.author_title || ""}</p>
          <p className="text-muted-foreground leading-relaxed">{data.author_bio || ""}</p>
        </div>
      </motion.div>

      {/* Maqsadlar */}
      {data.project_goals && (
        <motion.div className="glass-card p-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="font-display font-bold text-xl mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-neon-purple" /> Loyiha maqsadlari
          </h2>
          <p className="text-muted-foreground leading-relaxed">{data.project_goals}</p>
        </motion.div>
      )}

      {/* Texnologiyalar */}
      <motion.div className="glass-card p-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h2 className="font-display font-bold text-xl mb-6">Ishlatilgan texnologiyalar</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { name: "Next.js 14", desc: "Frontend framework", color: "#6C5CE7" },
            { name: "Supabase", desc: "Backend va DB", color: "#00D2FF" },
            { name: "Claude AI", desc: "Kod tahlili", color: "#FF6B9D" },
            { name: "Gemini AI", desc: "Chatbot", color: "#FFD600" },
            { name: "Monaco Editor", desc: "Kod muharriri", color: "#00E676" },
            { name: "TypeScript", desc: "Dasturlash tili", color: "#FF5252" },
          ].map(t => (
            <div key={t.name} className="p-4 rounded-xl bg-surface/50 border border-border/50 text-center">
              <div className="w-3 h-3 rounded-full mx-auto mb-2" style={{ backgroundColor: t.color }} />
              <p className="font-semibold text-sm">{t.name}</p>
              <p className="text-[10px] text-muted-foreground">{t.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
