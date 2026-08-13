"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Achievement } from "@/types";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Plus, Pencil, Trash2, Save, X, Loader2, Trophy, Award } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const emptyForm = { title: "", description: "", icon: "trophy", color: "#FFD600", category: "learning", requirement_type: "challenges_solved", requirement_count: 1, coin_reward: 10, xp_reward: 50, is_hidden: false };

export default function AdminAchievementsPage() {
  const { t } = useI18n();
  const supabase = createClient();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    const { data } = await supabase.from("achievements").select("*").order("order_index");
    if (data) setAchievements(data as Achievement[]);
    setLoading(false);
  }

  function openEdit(a: Achievement) {
    setForm({ title: a.title, description: a.description || "", icon: a.icon, color: a.color, category: a.category, requirement_type: a.requirement_type, requirement_count: a.requirement_count, coin_reward: a.coin_reward, xp_reward: a.xp_reward, is_hidden: a.is_hidden });
    setEditId(a.id); setShowForm(true);
  }

  async function handleSave() {
    if (!form.title.trim()) { toast.error("Nomini kiriting"); return; }
    setSaving(true);
    const payload = { ...form, order_index: editId ? undefined : achievements.length };

    if (editId) {
      const { error } = await supabase.from("achievements").update(payload).eq("id", editId);
      if (error) { toast.error(error.message); setSaving(false); return; }
      toast.success("Yangilandi");
    } else {
      const { error } = await supabase.from("achievements").insert(payload);
      if (error) { toast.error(error.message); setSaving(false); return; }
      toast.success(t.admin.common.created);
    }
    setShowForm(false); setSaving(false); setEditId(null); load();
  }

  async function handleDelete(a: Achievement) {
    if (!confirm(`"${a.title}" ni o'chirish?`)) return;
    await supabase.from("achievements").delete().eq("id", a.id);
    toast.success(t.admin.common.deleted); load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="font-display font-bold text-3xl">{t.admin.ach.title}</h1>
          <p className="text-muted-foreground text-sm">{achievements.length} ta yutuq</p></div>
        <button onClick={() => { setForm(emptyForm); setEditId(null); setShowForm(true); }} className="btn-primary py-2.5 px-5 flex items-center gap-2 text-sm"><Plus className="w-4 h-4" /> {t.admin.ach.newOne}</button>
      </div>

      {showForm && (
        <motion.div className="glass-card p-6" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-semibold">{editId ? t.common.edit : t.admin.ach.newOne}</h2>
            <button onClick={() => setShowForm(false)} className="p-1.5 hover:bg-accent rounded-lg"><X className="w-5 h-5" /></button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div><label className="text-sm font-medium mb-1 block">{t.admin.common.nameRequired} *</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="input-field" placeholder="Birinchi qadam" /></div>
            <div><label className="text-sm font-medium mb-1 block">{t.admin.common.category}</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="input-field">
                <option value="learning">{t.admin.ach.catLearning}</option><option value="challenge">{t.admin.ach.catTask}</option>
                <option value="streak">{t.admin.ach.catStreak}</option><option value="special">{t.admin.ach.catSpecial}</option>
              </select></div>
            <div className="md:col-span-2"><label className="text-sm font-medium mb-1 block">{t.admin.common.description}</label>
              <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input-field" /></div>
            <div><label className="text-sm font-medium mb-1 block">{t.admin.ach.reqType}</label>
              <select value={form.requirement_type} onChange={e => setForm({ ...form, requirement_type: e.target.value })} className="input-field">
                <option value="challenges_solved">{t.admin.ach.reqSolved}</option>
                <option value="courses_completed">{t.admin.ach.reqCourses}</option>
                <option value="streak_days">{t.admin.ach.reqStreak}</option>
                <option value="quizzes_passed">{t.admin.ach.reqQuizzes}</option>
                <option value="topics_completed">{t.admin.ach.reqTopics}</option>
              </select></div>
            <div><label className="text-sm font-medium mb-1 block">{t.admin.ach.reqCount}</label>
              <input type="number" value={form.requirement_count} onChange={e => setForm({ ...form, requirement_count: +e.target.value })} className="input-field" /></div>
            <div><label className="text-sm font-medium mb-1 block">{t.admin.ach.coinReward}</label>
              <input type="number" value={form.coin_reward} onChange={e => setForm({ ...form, coin_reward: +e.target.value })} className="input-field" /></div>
            <div><label className="text-sm font-medium mb-1 block">{t.admin.ach.xpReward}</label>
              <input type="number" value={form.xp_reward} onChange={e => setForm({ ...form, xp_reward: +e.target.value })} className="input-field" /></div>
            <div><label className="text-sm font-medium mb-1 block">{t.admin.common.color}</label>
              <input type="color" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} className="input-field h-10" /></div>
            <div className="flex items-center gap-2 pt-6">
              <input type="checkbox" checked={form.is_hidden} onChange={e => setForm({ ...form, is_hidden: e.target.checked })} id="hidden" className="w-4 h-4" />
              <label htmlFor="hidden" className="text-sm">{t.admin.ach.hidden}</label>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button onClick={() => setShowForm(false)} className="btn-ghost py-2 px-5 text-sm">{t.common.cancel}</button>
            <button onClick={handleSave} disabled={saving} className="btn-primary py-2 px-5 text-sm flex items-center gap-2 disabled:opacity-50">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Saqlash</button>
          </div>
        </motion.div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? [1,2,3].map(i => <div key={i} className="glass-card p-5 h-32 animate-pulse" />) :
        achievements.map(a => (
          <motion.div key={a.id} className="glass-card p-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${a.color}20` }}>
                <Trophy className="w-5 h-5" style={{ color: a.color }} />
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(a)} className="p-1.5 hover:bg-accent rounded-lg text-muted-foreground"><Pencil className="w-3.5 h-3.5" /></button>
                <button onClick={() => handleDelete(a)} className="p-1.5 hover:bg-neon-red/10 rounded-lg text-muted-foreground hover:text-neon-red"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
            <h3 className="font-semibold text-sm">{a.title} {a.is_hidden && "🔒"}</h3>
            <p className="text-xs text-muted-foreground mt-1">{a.description}</p>
            <div className="flex items-center gap-3 mt-3 text-[10px] text-muted-foreground">
              <span>{a.requirement_type}: {a.requirement_count}</span>
              <span className="text-neon-yellow">+{a.coin_reward} coin</span>
              <span className="text-neon-purple">+{a.xp_reward} XP</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
