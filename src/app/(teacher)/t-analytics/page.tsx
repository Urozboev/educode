"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatNumber, cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { BarChart3, Users, Target, TrendingUp, Brain, Activity, ShieldAlert, BookOpen, ClipboardCheck } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface AiRow {
  id: string; full_name: string;
  dependency: number;      // AI bog'liqlik indeksi (0-100)
  aiToday: number;
  reflections: number;
  pasteFlags: number;
}

export default function TeacherAnalyticsPage() {
  const { t } = useI18n();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ students: 0, submissions: 0, accepted: 0, quizzes: 0, avgScore: 0 });
  const [topStudents, setTopStudents] = useState<any[]>([]);
  const [aiRows, setAiRows] = useState<AiRow[]>([]);
  const [aiAgg, setAiAgg] = useState({ avgDep: 0, reflTotal: 0, pasteTotal: 0 });

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: ts } = await supabase.from("teacher_students").select("student_id").eq("teacher_id", user.id);
      const ids = ts?.map(t => t.student_id) || [];

      if (ids.length > 0) {
        const [subs, accepted, quizzes] = await Promise.all([
          supabase.from("submissions").select("*", { count: "exact", head: true }).in("user_id", ids),
          supabase.from("submissions").select("*", { count: "exact", head: true }).in("user_id", ids).eq("status", "accepted"),
          supabase.from("quiz_results").select("*", { count: "exact", head: true }).in("user_id", ids),
        ]);

        const { data: quizData } = await supabase.from("quiz_results").select("percentage").in("user_id", ids);
        const avg = quizData && quizData.length > 0 ? Math.round(quizData.reduce((s, q) => s + Number(q.percentage), 0) / quizData.length) : 0;

        setStats({ students: ids.length, submissions: subs.count || 0, accepted: accepted.count || 0, quizzes: quizzes.count || 0, avgScore: avg });

        const { data: top } = await supabase.from("profiles").select("id, full_name, xp, level, ai_dependency_score").in("id", ids).order("xp", { ascending: false });
        if (top) setTopStudents(top.slice(0, 5));

        // ===== AI / Cognitive Safeguards tahlili (dissertatsiya ma'lumotlari) =====
        const today = new Date().toISOString().slice(0, 10);
        const [usageToday, refl, pastes] = await Promise.all([
          supabase.from("ai_usage_daily").select("user_id, total_queries").in("user_id", ids).eq("date", today),
          supabase.from("reflection_journals").select("user_id").in("user_id", ids),
          supabase.from("code_snapshots").select("user_id").in("user_id", ids).eq("paste_detected", true),
        ]);
        const countBy = (arr: any[] | null, key = "user_id") => {
          const m: Record<string, number> = {};
          (arr || []).forEach(r => { m[r[key]] = (m[r[key]] || 0) + 1; });
          return m;
        };
        const usageMap: Record<string, number> = {};
        (usageToday.data || []).forEach((r: any) => { usageMap[r.user_id] = r.total_queries; });
        const reflMap = countBy(refl.data);
        const pasteMap = countBy(pastes.data);

        const rows: AiRow[] = (top || []).map((s: any) => ({
          id: s.id,
          full_name: s.full_name,
          dependency: Math.round(Number(s.ai_dependency_score) || 0),
          aiToday: usageMap[s.id] || 0,
          reflections: reflMap[s.id] || 0,
          pasteFlags: pasteMap[s.id] || 0,
        })).sort((a, b) => b.dependency - a.dependency);
        setAiRows(rows);

        const avgDep = rows.length ? Math.round(rows.reduce((s, r) => s + r.dependency, 0) / rows.length) : 0;
        setAiAgg({
          avgDep,
          reflTotal: (refl.data || []).length,
          pasteTotal: (pastes.data || []).length,
        });
      }
      setLoading(false);
    })();
  }, []);

  const depZone = (d: number) => d <= 30 ? { c: "text-neon-green", b: "bg-neon-green" }
    : d <= 60 ? { c: "text-neon-yellow", b: "bg-neon-yellow" }
    : d <= 80 ? { c: "text-orange-400", b: "bg-orange-500" }
    : { c: "text-neon-red", b: "bg-neon-red" };

  const cards = [
    { label: t.teacher.students, value: stats.students, icon: Users, color: "#6C5CE7" },
    { label: t.teacher.submissions, value: stats.submissions, icon: Target, color: "#00D2FF" },
    { label: "Qabul qilingan", value: stats.accepted, icon: TrendingUp, color: "#00E676" },
    { label: t.teacher.avgQuiz, value: `${stats.avgScore}%`, icon: Brain, color: "#FFD600" },
  ];

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display font-bold text-3xl mb-1">{t.teacher.ana.title}</h1>
        <p className="text-muted-foreground">{t.teacher.ana.subtitle}</p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, i) => (
          <motion.div key={c.label} className="glass-card p-5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <c.icon className="w-7 h-7 mb-2" style={{ color: c.color }} />
            <div className="font-display font-bold text-2xl">{loading ? "..." : c.value}</div>
            <div className="text-xs text-muted-foreground">{c.label}</div>
          </motion.div>
        ))}
      </div>

      <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h2 className="font-display font-semibold text-lg mb-4">{t.teacher.ana.top5}</h2>
        <div className="space-y-3">
          {topStudents.map((s, i) => (
            <div key={s.id} className="flex items-center gap-4 p-3 rounded-xl bg-surface/50">
              <span className="font-bold text-lg text-muted-foreground/30 w-8">{i + 1}</span>
              <div className="flex-1"><p className="font-medium text-sm">{s.full_name}</p><p className="text-xs text-muted-foreground">{s.level}</p></div>
              <span className="font-mono text-neon-yellow font-bold">{s.xp} XP</span>
            </div>
          ))}
          {topStudents.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">{t.teacher.ana.noStudent}</p>}
        </div>

        {stats.submissions > 0 && (
          <div className="mt-6 p-4 rounded-xl bg-surface/50">
            <p className="text-sm text-muted-foreground mb-2">{t.teacher.ana.acceptRate}</p>
            <div className="w-full h-4 bg-border rounded-full overflow-hidden">
              <div className="h-full progress-gradient rounded-full" style={{ width: `${Math.round((stats.accepted / stats.submissions) * 100)}%` }} />
            </div>
            <p className="text-right text-xs text-muted-foreground mt-1">{Math.round((stats.accepted / stats.submissions) * 100)}%</p>
          </div>
        )}
      </motion.div>

      {/* ===== AI FOYDALANISH TAHLILI (Cognitive Safeguards) ===== */}
      <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <div className="flex items-center gap-2 mb-1">
          <Brain className="w-5 h-5 text-neon-purple" />
          <h2 className="font-display font-semibold text-lg">{t.teacher.ana.aiUsage}</h2>
        </div>
        <p className="text-xs text-muted-foreground mb-5">
          Talabalarning AI mentordan foydalanishi, mustaqil tafakkur va akademik halollik ko'rsatkichlari.
        </p>

        {/* Agregat kartalar */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="p-4 rounded-xl bg-surface/50 text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1"><Activity className="w-4 h-4 text-neon-purple" /></div>
            <div className={cn("font-display font-bold text-2xl", depZone(aiAgg.avgDep).c)}>{aiAgg.avgDep}%</div>
            <div className="text-[11px] text-muted-foreground">{t.teacher.ana.avgAiDependence}</div>
          </div>
          <div className="p-4 rounded-xl bg-surface/50 text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1"><BookOpen className="w-4 h-4 text-neon-green" /></div>
            <div className="font-display font-bold text-2xl text-neon-green">{aiAgg.reflTotal}</div>
            <div className="text-[11px] text-muted-foreground">refleksiya yozuvi</div>
          </div>
          <div className="p-4 rounded-xl bg-surface/50 text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1"><ShieldAlert className="w-4 h-4 text-neon-red" /></div>
            <div className="font-display font-bold text-2xl text-neon-red">{aiAgg.pasteTotal}</div>
            <div className="text-[11px] text-muted-foreground">paste ogohlantirishi</div>
          </div>
        </div>

        {/* Talabalar jadvali */}
        {aiRows.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[11px] text-muted-foreground uppercase tracking-wider border-b border-border/50">
                  <th className="text-left font-medium py-2">{t.teacher.ana.colStudent}</th>
                  <th className="text-center font-medium py-2">{t.teacher.ana.colAi}</th>
                  <th className="text-center font-medium py-2">{t.teacher.ana.colToday}</th>
                  <th className="text-center font-medium py-2">{t.teacher.ana.colReflection}</th>
                  <th className="text-center font-medium py-2">{t.teacher.ana.colPaste}</th>
                </tr>
              </thead>
              <tbody>
                {aiRows.map(r => {
                  const z = depZone(r.dependency);
                  return (
                    <tr key={r.id} className="border-b border-border/30 last:border-0">
                      <td className="py-2.5 font-medium">{r.full_name}</td>
                      <td className="py-2.5">
                        <div className="flex items-center gap-2 justify-center">
                          <div className="w-16 h-1.5 bg-border rounded-full overflow-hidden">
                            <div className={cn("h-full rounded-full", z.b)} style={{ width: `${Math.min(100, r.dependency)}%` }} />
                          </div>
                          <span className={cn("text-xs font-semibold tabular-nums", z.c)}>{r.dependency}%</span>
                        </div>
                      </td>
                      <td className="py-2.5 text-center text-muted-foreground">{r.aiToday}</td>
                      <td className="py-2.5 text-center">
                        {r.reflections > 0
                          ? <span className="inline-flex items-center gap-1 text-neon-green text-xs"><ClipboardCheck className="w-3.5 h-3.5" />{r.reflections}</span>
                          : <span className="text-muted-foreground/40 text-xs">—</span>}
                      </td>
                      <td className="py-2.5 text-center">
                        {r.pasteFlags > 0
                          ? <span className="inline-flex items-center gap-1 text-neon-red text-xs font-semibold"><ShieldAlert className="w-3.5 h-3.5" />{r.pasteFlags}</span>
                          : <span className="text-neon-green/60 text-xs">✓</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className="text-[11px] text-muted-foreground mt-3">
              💡 AI bog'liqlik &le;30% — sog'lom, 61%+ — e'tibor talab qiladi. Paste ogohlantirishlari akademik halollik uchun.
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-6">{t.teacher.ana.collecting}</p>
        )}
      </motion.div>
    </div>
  );
}
