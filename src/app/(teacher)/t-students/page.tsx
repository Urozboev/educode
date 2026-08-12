"use client";

import { useState, useEffect } from "react";
import Link from "@/components/i18n/Link";
import { createClient } from "@/lib/supabase/client";
import { getInitials, getLevelLabel, getLevelColor, cn, formatDate } from "@/lib/utils";
import { motion } from "framer-motion";
import { Search, Users, Zap, Flame, BookOpen, Target, ChevronRight, BarChart3, Eye } from "lucide-react";

export default function TeacherStudentsPage() {
  const supabase = createClient();
  const [students, setStudents] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"xp" | "streak" | "solved" | "name">("xp");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: ts } = await supabase.from("teacher_students").select("student_id").eq("teacher_id", user.id);
      const ids = ts?.map(t => t.student_id) || [];

      if (ids.length > 0) {
        const { data } = await supabase.from("profiles").select("*").in("id", ids);
        if (data) {
          const enriched = await Promise.all(data.map(async (s) => {
            const [subs, enrolled, quizzes] = await Promise.all([
              supabase.from("submissions").select("*", { count: "exact", head: true }).eq("user_id", s.id).eq("status", "accepted"),
              supabase.from("enrollments").select("*", { count: "exact", head: true }).eq("user_id", s.id),
              supabase.from("quiz_results").select("percentage").eq("user_id", s.id),
            ]);
            const quizData = quizzes.data || [];
            const avgQuiz = quizData.length > 0 ? Math.round(quizData.reduce((sum: number, q: any) => sum + Number(q.percentage), 0) / quizData.length) : 0;
            return { ...s, solved: subs.count || 0, enrolled: enrolled.count || 0, avgQuiz };
          }));
          setStudents(enriched);
        }
      }
      setLoading(false);
    })();
  }, []);

  const sorted = [...students]
    .filter(s => s.full_name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "xp") return b.xp - a.xp;
      if (sortBy === "streak") return b.streak_days - a.streak_days;
      if (sortBy === "solved") return b.solved - a.solved;
      return a.full_name.localeCompare(b.full_name);
    });

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display font-bold text-3xl mb-1">Talabalarim</h1>
        <p className="text-muted-foreground text-sm">{students.length} ta talaba biriktirilgan</p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Talaba qidirish..." className="input-field pl-11" />
        </div>
        <div className="flex gap-2">
          {([
            { value: "xp", label: "XP bo'yicha" }, { value: "streak", label: "Streak" },
            { value: "solved", label: "Yechimlar" }, { value: "name", label: "Ism" },
          ] as const).map(s => (
            <button key={s.value} onClick={() => setSortBy(s.value)}
              className={cn("px-3 py-2 rounded-lg text-xs font-medium transition-all",
                sortBy === s.value ? "bg-neon-blue/10 text-neon-blue border border-neon-blue/20" : "bg-surface text-muted-foreground")}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">{[1,2,3,4].map(i => <div key={i} className="glass-card p-4 h-20 animate-pulse" />)}</div>
      ) : sorted.length === 0 ? (
        <div className="text-center py-20">
          <Users className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
          <p className="text-muted-foreground mb-2">{students.length === 0 ? "Talaba biriktirilmagan" : "Topilmadi"}</p>
          {students.length === 0 && <p className="text-xs text-muted-foreground">Admin paneldan talabalarni biriktiring</p>}
        </div>
      ) : (
        <div className="space-y-2">
          {sorted.map((s, i) => (
            <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <Link href={`/t-students/${s.id}`} className="glass-card-hover p-4 flex items-center gap-4 group block">
                <span className="text-sm font-bold text-muted-foreground/30 w-6 text-center">{i + 1}</span>
                <div className="w-10 h-10 rounded-full bg-hero-gradient flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                  {s.avatar_url ? <img src={s.avatar_url} className="w-full h-full rounded-full object-cover" /> : getInitials(s.full_name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm group-hover:text-neon-blue transition-colors">{s.full_name}</p>
                  <p className={cn("text-[10px] font-medium", getLevelColor(s.level))}>{getLevelLabel(s.level)}</p>
                </div>
                <div className="hidden md:flex items-center gap-6 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1 text-neon-yellow font-mono"><Zap className="w-3.5 h-3.5" /> {s.xp}</span>
                  {s.streak_days > 0 && <span className="flex items-center gap-1 text-neon-red"><Flame className="w-3.5 h-3.5" /> {s.streak_days}</span>}
                  <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {s.enrolled} kurs</span>
                  <span className="flex items-center gap-1 text-neon-green"><Target className="w-3.5 h-3.5" /> {s.solved} yechim</span>
                  <span className="flex items-center gap-1"><BarChart3 className="w-3.5 h-3.5" /> {s.avgQuiz}% test</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-neon-blue group-hover:translate-x-1 transition-all" />
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
