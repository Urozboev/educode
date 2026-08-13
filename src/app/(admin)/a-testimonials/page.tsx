"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn, formatDate, getInitials } from "@/lib/utils";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { MessageSquare, CheckCircle2, XCircle, Trash2, Eye, EyeOff, Star } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function AdminTestimonialsPage() {
  const { t } = useI18n();
  const supabase = createClient();
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    const { data } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false });
    if (data) setTestimonials(data);
    setLoading(false);
  }

  async function toggleApprove(id: string, current: boolean) {
    await supabase.from("testimonials").update({ is_approved: !current }).eq("id", id);
    toast.success(current ? "Bosh sahifadan olib tashlandi" : "Bosh sahifada ko'rinadi");
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Izohni o'chirish?")) return;
    await supabase.from("testimonials").delete().eq("id", id);
    toast.success(t.admin.common.deleted); load();
  }

  const pending = testimonials.filter(t => !t.is_approved);
  const approved = testimonials.filter(t => t.is_approved);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display font-bold text-3xl">{t.admin.tst.title}</h1>
        <p className="text-muted-foreground text-sm">{pending.length} ta tasdiqlanmagan · {approved.length} ta bosh sahifada</p>
      </motion.div>

      {/* Pending */}
      {pending.length > 0 && (
        <div>
          <h2 className="font-semibold text-sm text-neon-yellow mb-3 flex items-center gap-2">⏳ Tasdiqlanmagan ({pending.length})</h2>
          <div className="space-y-3">
            {pending.map(t => (
              <div key={t.id} className="glass-card p-5 border-l-4 border-l-neon-yellow">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-hero-gradient flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                    {t.avatar_url ? <img src={t.avatar_url} className="w-full h-full rounded-full object-cover" /> : getInitials(t.full_name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-sm">{t.full_name}</p>
                      <div className="flex">{[...Array(t.rating)].map((_, i) => <Star key={i} className="w-3 h-3 text-neon-yellow fill-neon-yellow" />)}</div>
                      <span className="text-xs text-muted-foreground">{formatDate(t.created_at)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{t.text}</p>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={() => toggleApprove(t.id, false)} className="p-2 hover:bg-neon-green/10 rounded-lg text-neon-green" title={t.admin.common.approve}><CheckCircle2 className="w-5 h-5" /></button>
                    <button onClick={() => handleDelete(t.id)} className="p-2 hover:bg-neon-red/10 rounded-lg text-neon-red" title={t.common.delete}><Trash2 className="w-5 h-5" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Approved */}
      <div>
        <h2 className="font-semibold text-sm text-neon-green mb-3 flex items-center gap-2">✅ Bosh sahifada ko'rinadi ({approved.length})</h2>
        {approved.length === 0 ? <p className="text-sm text-muted-foreground py-4">{t.admin.tst.empty}</p> : (
          <div className="grid md:grid-cols-2 gap-3">
            {approved.map(t => (
              <div key={t.id} className="glass-card p-4 border-l-4 border-l-neon-green">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-hero-gradient flex items-center justify-center text-white font-bold text-[10px]">{getInitials(t.full_name)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-xs">{t.full_name}</p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-3">{t.text}</p>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={() => toggleApprove(t.id, true)} className="p-1 hover:bg-neon-yellow/10 rounded text-muted-foreground" title={t.admin.common.hide}><EyeOff className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleDelete(t.id)} className="p-1 hover:bg-neon-red/10 rounded text-muted-foreground hover:text-neon-red"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
