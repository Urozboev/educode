"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Download, Loader2, Users, BookOpen, Swords, BarChart3, Coins, ClipboardList } from "lucide-react";

const exportTypes = [
  { id: "users", label: "Foydalanuvchilar", desc: "Barcha foydalanuvchilar — ism, rol, XP, coin, daraja", icon: Users, color: "#6C5CE7", table: "profiles", columns: "full_name,role,level,xp,coins,streak_days,created_at" },
  { id: "enrollments", label: "Kursga yozilishlar", desc: "Qaysi talaba qaysi kursga yozilgan, progress", icon: BookOpen, color: "#00D2FF", table: "enrollments", columns: "user_id,course_id,progress_percent,is_completed,enrolled_at" },
  { id: "submissions", label: "Kod yuborishlar", desc: "Barcha submissions — talaba, topshiriq, natija", icon: Swords, color: "#00E676", table: "submissions", columns: "user_id,task_id,task_type,language,status,passed_tests,total_tests,created_at" },
  { id: "quiz_results", label: "Test natijalari", desc: "Barcha test natijalari — talaba, mavzu, ball", icon: ClipboardList, color: "#FFD600", table: "quiz_results", columns: "user_id,topic_id,score,total,percentage,completed_at" },
  { id: "coins", label: "Coin tranzaksiyalar", desc: "Barcha coin harakatlari tarixi", icon: Coins, color: "#FF6B9D", table: "coin_transactions", columns: "user_id,amount,type,description,balance_after,created_at" },
];

export default function AdminExportPage() {
  const supabase = createClient();
  const [exporting, setExporting] = useState<string | null>(null);

  async function handleExport(type: typeof exportTypes[0]) {
    setExporting(type.id);
    try {
      const { data, error } = await supabase.from(type.table).select(type.columns).csv();
      if (error) { toast.error(error.message); setExporting(null); return; }

      // CSV faylni yuklab olish
      const blob = new Blob([data as unknown as string], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `educode_${type.id}_${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success(`${type.label} eksport qilindi`);
    } catch (e: any) { toast.error(e.message); }
    setExporting(null);
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display font-bold text-3xl mb-1">Ma'lumotlar eksporti</h1>
        <p className="text-muted-foreground">Platforma ma'lumotlarini CSV formatida yuklab oling</p>
      </motion.div>

      <div className="space-y-4">
        {exportTypes.map((type, i) => (
          <motion.div key={type.id} className="glass-card p-6 flex items-center gap-5"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${type.color}15` }}>
              <type.icon className="w-6 h-6" style={{ color: type.color }} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{type.label}</h3>
              <p className="text-sm text-muted-foreground">{type.desc}</p>
            </div>
            <button onClick={() => handleExport(type)} disabled={exporting === type.id}
              className="btn-primary py-2.5 px-5 flex items-center gap-2 text-sm disabled:opacity-50">
              {exporting === type.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              CSV
            </button>
          </motion.div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        Eksport qilingan CSV fayllarni Excel, Google Sheets yoki boshqa dasturlarda ochishingiz mumkin. Bu ma'lumotlarni dissertatsiya tahlili uchun ishlatishingiz mumkin.
      </p>
    </div>
  );
}
