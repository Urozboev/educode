"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn, getDifficultyConfig, getCategoryLabel } from "@/lib/utils";
import type { Challenge } from "@/types";
import { motion } from "framer-motion";
import { toast } from "sonner";
import slugify from "slugify";
import { Plus, Search, Pencil, Trash2, Eye, EyeOff, Save, X, Loader2, Swords, Sparkles } from "lucide-react";

const emptyForm = {
  title: "", description: "", category: "math", difficulty: "easy" as const,
  languages: "python,javascript", coin_reward: 5, xp_reward: 15,
  time_limit_ms: 2000, starter_python: "def solve():\n    # Kodingizni yozing\n    pass",
  starter_js: "function solve() {\n    // Kodingizni yozing\n}",
  test_cases: '[{"input":"5 3","expected_output":"8","is_hidden":false}]',
  hidden_test_cases: '[{"input":"100 200","expected_output":"300","is_hidden":true}]',
};

export default function AdminChallengesPage() {
  const supabase = createClient();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    const { data } = await supabase.from("challenges").select("*").order("created_at", { ascending: false });
    if (data) setChallenges(data as Challenge[]);
    setLoading(false);
  }

  async function aiGenerateChallenge() {
    if (!form.title.trim()) { toast.error("Avval topshiriq nomini kiriting"); return; }
    setAiGenerating(true);
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "challenge", topic_title: form.title, language: form.category, difficulty: form.difficulty }),
      });
      const data = await res.json();
      if (data.data) {
        const ch = data.data;
        setForm(f => ({
          ...f,
          description: ch.description || f.description,
          starter_python: ch.starter_code?.python || f.starter_python,
          starter_js: ch.starter_code?.javascript || f.starter_js,
          test_cases: JSON.stringify(ch.test_cases || [], null, 2),
          hidden_test_cases: JSON.stringify(ch.hidden_test_cases || [], null, 2),
          coin_reward: ch.coin_reward || f.coin_reward,
        }));
        toast.success("AI topshiriq yaratdi! Tekshirib saqlang.");
      } else {
        toast.error("AI generatsiya xatolik");
      }
    } catch { toast.error("Xatolik"); }
    setAiGenerating(false);
  }

  function openNew() { setForm(emptyForm); setEditId(null); setShowForm(true); }

  function openEdit(c: Challenge) {
    setForm({
      title: c.title, description: c.description, category: c.category,
      difficulty: c.difficulty, languages: c.languages.join(","),
      coin_reward: c.coin_reward, xp_reward: c.xp_reward, time_limit_ms: c.time_limit_ms,
      starter_python: c.starter_code?.python || "", starter_js: c.starter_code?.javascript || "",
      test_cases: JSON.stringify(c.test_cases, null, 2),
      hidden_test_cases: JSON.stringify(c.hidden_test_cases, null, 2),
    });
    setEditId(c.id); setShowForm(true);
  }

  async function handleSave() {
    if (!form.title.trim()) { toast.error("Nomini kiriting"); return; }
    setSaving(true);

    let testCases, hiddenCases;
    try {
      testCases = JSON.parse(form.test_cases);
      hiddenCases = JSON.parse(form.hidden_test_cases);
    } catch { toast.error("Test case'lar JSON formatda bo'lishi kerak"); setSaving(false); return; }

    const slug = slugify(form.title, { lower: true, strict: true });
    const langs = form.languages.split(",").map(l => l.trim());
    const payload = {
      title: form.title, slug, description: form.description, category: form.category,
      difficulty: form.difficulty, languages: langs, coin_reward: form.coin_reward,
      xp_reward: form.xp_reward, time_limit_ms: form.time_limit_ms,
      starter_code: { python: form.starter_python, javascript: form.starter_js },
      test_cases: testCases, hidden_test_cases: hiddenCases,
    };

    if (editId) {
      const { error } = await supabase.from("challenges").update(payload).eq("id", editId);
      if (error) { toast.error(error.message); setSaving(false); return; }
      toast.success("Topshiriq yangilandi");
    } else {
      const { error } = await supabase.from("challenges").insert({ ...payload, is_published: true });
      if (error) { toast.error(error.message); setSaving(false); return; }
      toast.success("Yangi topshiriq yaratildi");
    }
    setShowForm(false); setSaving(false); load();
  }

  async function togglePublish(c: Challenge) {
    await supabase.from("challenges").update({ is_published: !c.is_published }).eq("id", c.id);
    toast.success(c.is_published ? "Yashirildi" : "Nashr qilindi"); load();
  }

  async function handleDelete(c: Challenge) {
    if (!confirm(`"${c.title}" ni o'chirish?`)) return;
    await supabase.from("challenges").delete().eq("id", c.id);
    toast.success("O'chirildi"); load();
  }

  const filtered = challenges.filter(c => c.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="font-display font-bold text-3xl">Topshiriqlar boshqaruvi</h1>
          <p className="text-muted-foreground text-sm">{challenges.length} ta topshiriq</p></div>
        <button onClick={openNew} className="btn-primary py-2.5 px-5 flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Yangi topshiriq
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Qidirish..." className="input-field pl-11" />
      </div>

      {showForm && (
        <motion.div className="glass-card p-6" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-semibold text-lg">{editId ? "Tahrirlash" : "Yangi topshiriq"}</h2>
            <div className="flex items-center gap-2">
              <button onClick={aiGenerateChallenge} disabled={aiGenerating || !form.title}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-neon-blue/10 text-neon-blue border border-neon-blue/20 hover:bg-neon-blue/20 disabled:opacity-50 transition-all">
                {aiGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                AI bilan to'ldirish
              </button>
              <button onClick={() => setShowForm(false)} className="p-1.5 hover:bg-accent rounded-lg"><X className="w-5 h-5" /></button>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div><label className="text-sm font-medium mb-1 block">Nomi *</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="input-field" /></div>
            <div><label className="text-sm font-medium mb-1 block">Kategoriya</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="input-field">
                <option value="math">Matematika</option><option value="strings">Satrlar</option>
                <option value="arrays">Massivlar</option><option value="algorithms">Algoritmlar</option>
                <option value="data_structures">Tuzilmalar</option>
              </select></div>
            <div className="md:col-span-2"><label className="text-sm font-medium mb-1 block">Tavsif</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input-field min-h-[80px]" /></div>
            <div><label className="text-sm font-medium mb-1 block">Qiyinlik</label>
              <select value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value as any })} className="input-field">
                <option value="easy">Oson</option><option value="medium">O'rta</option><option value="hard">Qiyin</option>
              </select></div>
            <div><label className="text-sm font-medium mb-1 block">Tillar (vergul bilan)</label>
              <input value={form.languages} onChange={e => setForm({ ...form, languages: e.target.value })} className="input-field" /></div>
            <div><label className="text-sm font-medium mb-1 block">Coin mukofot</label>
              <input type="number" value={form.coin_reward} onChange={e => setForm({ ...form, coin_reward: +e.target.value })} className="input-field" /></div>
            <div><label className="text-sm font-medium mb-1 block">Vaqt limiti (ms)</label>
              <input type="number" value={form.time_limit_ms} onChange={e => setForm({ ...form, time_limit_ms: +e.target.value })} className="input-field" /></div>
            <div className="md:col-span-2"><label className="text-sm font-medium mb-1 block">Python starter code</label>
              <textarea value={form.starter_python} onChange={e => setForm({ ...form, starter_python: e.target.value })} className="input-field font-mono text-sm min-h-[80px]" /></div>
            <div className="md:col-span-2"><label className="text-sm font-medium mb-1 block">JavaScript starter code</label>
              <textarea value={form.starter_js} onChange={e => setForm({ ...form, starter_js: e.target.value })} className="input-field font-mono text-sm min-h-[80px]" /></div>
            <div className="md:col-span-2"><label className="text-sm font-medium mb-1 block">Test case'lar (JSON)</label>
              <textarea value={form.test_cases} onChange={e => setForm({ ...form, test_cases: e.target.value })} className="input-field font-mono text-xs min-h-[100px]" />
              <p className="text-[10px] text-muted-foreground mt-1">{`[{"input":"5 3","expected_output":"8","is_hidden":false}]`}</p></div>
            <div className="md:col-span-2"><label className="text-sm font-medium mb-1 block">Yashirin test case'lar (JSON)</label>
              <textarea value={form.hidden_test_cases} onChange={e => setForm({ ...form, hidden_test_cases: e.target.value })} className="input-field font-mono text-xs min-h-[80px]" /></div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button onClick={() => setShowForm(false)} className="btn-ghost py-2 px-5 text-sm">Bekor</button>
            <button onClick={handleSave} disabled={saving} className="btn-primary py-2 px-5 text-sm flex items-center gap-2 disabled:opacity-50">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Saqlash
            </button>
          </div>
        </motion.div>
      )}

      <div className="glass-card overflow-hidden">
        <table className="w-full">
          <thead><tr className="border-b border-border/50 text-xs text-muted-foreground font-semibold">
            <th className="text-left px-5 py-3">Topshiriq</th><th className="text-center px-5 py-3">Kategoriya</th>
            <th className="text-center px-5 py-3">Daraja</th><th className="text-center px-5 py-3">Yechganlar</th>
            <th className="text-center px-5 py-3">Holat</th><th className="text-right px-5 py-3">Amallar</th>
          </tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">Yuklanmoqda...</td></tr> :
            filtered.map(c => {
              const diff = getDifficultyConfig(c.difficulty);
              return (
                <tr key={c.id} className="border-b border-border/30 hover:bg-surface/30">
                  <td className="px-5 py-3"><p className="font-medium text-sm">{c.title}</p></td>
                  <td className="px-5 py-3 text-center text-xs text-muted-foreground">{getCategoryLabel(c.category)}</td>
                  <td className="px-5 py-3 text-center"><span className={diff.class}>{diff.label}</span></td>
                  <td className="px-5 py-3 text-center text-sm">{c.solved_count}</td>
                  <td className="px-5 py-3 text-center">
                    <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", c.is_published ? "bg-neon-green/10 text-neon-green" : "bg-surface text-muted-foreground")}>
                      {c.is_published ? "Nashr" : "Qoralama"}</span></td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(c)} className="p-1.5 hover:bg-accent rounded-lg text-muted-foreground hover:text-foreground"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => togglePublish(c)} className="p-1.5 hover:bg-accent rounded-lg text-muted-foreground hover:text-foreground">
                        {c.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                      <button onClick={() => handleDelete(c)} className="p-1.5 hover:bg-neon-red/10 rounded-lg text-muted-foreground hover:text-neon-red"><Trash2 className="w-4 h-4" /></button>
                    </div></td>
                </tr>);
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
