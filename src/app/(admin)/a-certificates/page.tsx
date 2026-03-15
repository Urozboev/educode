"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatDate, getInitials } from "@/lib/utils";
import type { Certificate } from "@/types";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { GraduationCap, Search, Download, Trash2, RefreshCw } from "lucide-react";

export default function AdminCertificatesPage() {
  const supabase = createClient();
  const [certificates, setCertificates] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    const { data } = await supabase.from("certificates")
      .select("*, course:courses(title)").order("issued_at", { ascending: false });
    if (data) setCertificates(data);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Sertifikatni o'chirish?")) return;
    await supabase.from("certificates").delete().eq("id", id);
    toast.success("O'chirildi"); load();
  }

  const filtered = certificates.filter(c =>
    c.full_name.toLowerCase().includes(search.toLowerCase()) ||
    c.course_title.toLowerCase().includes(search.toLowerCase()) ||
    c.certificate_number.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display font-bold text-3xl mb-1">Sertifikatlar</h1>
        <p className="text-muted-foreground text-sm">{certificates.length} ta sertifikat berilgan</p>
      </motion.div>

      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Ism, kurs yoki raqam..." className="input-field pl-11" />
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full">
          <thead><tr className="border-b border-border/50 text-xs text-muted-foreground font-semibold">
            <th className="text-left px-5 py-3">Talaba</th>
            <th className="text-left px-5 py-3">Kurs</th>
            <th className="text-center px-5 py-3">Raqam</th>
            <th className="text-center px-5 py-3">Ball</th>
            <th className="text-center px-5 py-3">Sana</th>
            <th className="text-right px-5 py-3">Amallar</th>
          </tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">Yuklanmoqda...</td></tr> :
            filtered.length === 0 ? <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">
              {certificates.length === 0 ? "Hali sertifikat berilmagan" : "Topilmadi"}</td></tr> :
            filtered.map(c => (
              <tr key={c.id} className="border-b border-border/30 hover:bg-surface/30">
                <td className="px-5 py-3"><p className="font-medium text-sm">{c.full_name}</p></td>
                <td className="px-5 py-3 text-sm text-muted-foreground">{c.course_title}</td>
                <td className="px-5 py-3 text-center"><span className="text-xs font-mono bg-surface px-2 py-0.5 rounded">{c.certificate_number}</span></td>
                <td className="px-5 py-3 text-center text-sm">{c.score_percentage ? `${c.score_percentage}%` : "-"}</td>
                <td className="px-5 py-3 text-center text-xs text-muted-foreground">{formatDate(c.completion_date)}</td>
                <td className="px-5 py-3 text-right">
                  <button onClick={() => handleDelete(c.id)} className="p-1.5 hover:bg-neon-red/10 rounded-lg text-muted-foreground hover:text-neon-red">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
