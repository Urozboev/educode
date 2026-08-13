"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Download, Loader2, Users, Target, ClipboardList } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function TeacherExportPage() {
  const { t } = useI18n();
  const supabase = createClient();
  const [studentIds, setStudentIds] = useState<string[]>([]);
  const [exporting, setExporting] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("teacher_students").select("student_id").eq("teacher_id", user.id);
      if (data) setStudentIds(data.map(d => d.student_id));
      setLoading(false);
    })();
  }, []);

  async function exportData(type: string) {
    if (studentIds.length === 0) { toast.error(t.teacher.exp.noStudents); return; }
    setExporting(type);

    try {
      let data: any;
      if (type === "students") {
        const { data: d } = await supabase.from("profiles").select("full_name,level,xp,coins,streak_days,created_at").in("id", studentIds).csv();
        data = d;
      } else if (type === "submissions") {
        const { data: d } = await supabase.from("submissions").select("user_id,task_type,language,status,passed_tests,total_tests,created_at").in("user_id", studentIds).csv();
        data = d;
      } else if (type === "quizzes") {
        const { data: d } = await supabase.from("quiz_results").select("user_id,score,total,percentage,completed_at").in("user_id", studentIds).csv();
        data = d;
      }

      if (data) {
        const blob = new Blob([data as unknown as string], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `teacher_${type}_${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success("Eksport qilindi");
      }
    } catch (e: any) { toast.error(e.message); }
    setExporting(null);
  }

  const exports = [
    { id: "students", label: t.teacher.exp.studentsFile, desc: t.teacher.exp.studentsCols, icon: Users, color: "#6C5CE7" },
    { id: "submissions", label: t.teacher.exp.submissionsFile, desc: t.teacher.exp.submissionsCols, icon: Target, color: "#00D2FF" },
    { id: "quizzes", label: "Test natijalari", desc: "Ball, foiz, sana", icon: ClipboardList, color: "#FFD600" },
  ];

  return (
    <div className="space-y-8 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display font-bold text-3xl mb-1">{t.teacher.export}</h1>
        <p className="text-muted-foreground">{studentIds.length} ta talabaning ma'lumotlarini yuklab oling</p>
      </motion.div>

      <div className="space-y-4">
        {exports.map((exp, i) => (
          <motion.div key={exp.id} className="glass-card p-6 flex items-center gap-5"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${exp.color}15` }}>
              <exp.icon className="w-6 h-6" style={{ color: exp.color }} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{exp.label}</h3>
              <p className="text-sm text-muted-foreground">{exp.desc}</p>
            </div>
            <button onClick={() => exportData(exp.id)} disabled={exporting === exp.id || loading}
              className="btn-primary py-2.5 px-5 flex items-center gap-2 text-sm disabled:opacity-50">
              {exporting === exp.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} CSV
            </button>
          </motion.div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">{t.teacher.exp.hint}</p>
    </div>
  );
}
