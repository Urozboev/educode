"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Settings, Save, Loader2, Coins, Zap, RefreshCw, Plus, Trash2, X,
  Brain, Sparkles, ChevronDown, ChevronUp, ClipboardList, Code2
} from "lucide-react";

export default function AdminSettingsPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"coins" | "placement">("coins");

  // Coin/XP settings
  const [coinSettings, setCoinSettings] = useState({
    registration_bonus: 100, topic_complete: 10, course_complete: 50,
    challenge_easy: 5, challenge_medium: 10, challenge_hard: 20,
    streak_3: 15, streak_7: 30, streak_30: 100,
  });
  const [xpSettings, setXpSettings] = useState({
    topic_complete: 25, course_complete: 100,
    challenge_easy: 15, challenge_medium: 30, challenge_hard: 50, quiz_pass: 10,
  });

  // Placement tests
  const [placementQuestions, setPlacementQuestions] = useState<any[]>([]);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [qForm, setQForm] = useState({
    question: "", category: "basic_programming", difficulty: "beginner",
    options: '[{"id":"a","text":""},{"id":"b","text":""},{"id":"c","text":""},{"id":"d","text":""}]',
    correct_option: "a",
  });
  const [aiGenerating, setAiGenerating] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: coinData } = await supabase.from("platform_settings").select("value").eq("key", "coin_settings").single();
      if (coinData?.value) setCoinSettings(coinData.value as any);
      const { data: xpData } = await supabase.from("platform_settings").select("value").eq("key", "xp_settings").single();
      if (xpData?.value) setXpSettings(xpData.value as any);
      await loadPlacementQuestions();
      setLoading(false);
    })();
  }, []);

  async function loadPlacementQuestions() {
    const { data } = await supabase.from("placement_tests").select("*").order("order_index");
    if (data) setPlacementQuestions(data);
  }

  async function handleSaveCoinSettings() {
    setSaving(true);
    await supabase.from("platform_settings").upsert({ key: "coin_settings", value: coinSettings, updated_at: new Date().toISOString() });
    await supabase.from("platform_settings").upsert({ key: "xp_settings", value: xpSettings, updated_at: new Date().toISOString() });
    toast.success("Sozlamalar saqlandi");
    setSaving(false);
  }

  // ===== PLACEMENT QUESTION CRUD =====
  async function saveQuestion() {
    if (!qForm.question.trim()) { toast.error("Savolni kiriting"); return; }
    let options;
    try { options = JSON.parse(qForm.options); } catch { toast.error("Options JSON noto'g'ri"); return; }

    const { error } = await supabase.from("placement_tests").insert({
      question: qForm.question, category: qForm.category, difficulty: qForm.difficulty,
      options, correct_option: qForm.correct_option, order_index: placementQuestions.length, is_active: true,
    });
    if (error) { toast.error(error.message); return; }
    toast.success("Savol qo'shildi");
    setShowQuestionForm(false);
    setQForm({ question: "", category: "basic_programming", difficulty: "beginner", options: '[{"id":"a","text":""},{"id":"b","text":""},{"id":"c","text":""},{"id":"d","text":""}]', correct_option: "a" });
    loadPlacementQuestions();
  }

  async function deleteQuestion(id: string) {
    if (!confirm("Savolni o'chirish?")) return;
    await supabase.from("placement_tests").delete().eq("id", id);
    toast.success("O'chirildi"); loadPlacementQuestions();
  }

  async function toggleActive(id: string, current: boolean) {
    await supabase.from("placement_tests").update({ is_active: !current }).eq("id", id);
    loadPlacementQuestions();
  }

  // ===== AI GENERATE PLACEMENT QUESTIONS =====
  async function aiGeneratePlacementQuestions() {
    setAiGenerating(true);
    try {
      const categories = [
        { cat: "basic_programming", title: "Dasturlash asoslari", count: 3, diff: "beginner" },
        { cat: "computer_literacy", title: "Kompyuter savodxonligi", count: 3, diff: "beginner" },
        { cat: "prompt_engineering", title: "Prompt Engineering", count: 3, diff: "elementary" },
      ];

      for (const { cat, title, count, diff } of categories) {
        const res = await fetch("/api/ai/generate", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "placement_quiz", topic_title: title,
            course_title: "Daraja aniqlash testi", difficulty: diff,
          }),
        });
        const data = await res.json();

        // AI dan kelgan formatni tekshirish
        if (data.data && Array.isArray(data.data)) {
          for (let i = 0; i < Math.min(data.data.length, count); i++) {
            const q = data.data[i];
            const correctOpt = q.options?.find((o: any) => o.is_correct)?.id || "a";
            await supabase.from("placement_tests").insert({
              question: q.question, category: cat, difficulty: diff,
              options: q.options, correct_option: correctOpt,
              order_index: placementQuestions.length + i, is_active: true,
            });
          }
        }
      }

      toast.success("9 ta daraja aniqlash savoli yaratildi! (3 ta har kategoriyadan)");
      loadPlacementQuestions();
    } catch (e: any) { toast.error("AI xatolik: " + e.message); }
    setAiGenerating(false);
  }

  const categoryLabels: Record<string, string> = {
    basic_programming: "Dasturlash", computer_literacy: "Kompyuter", prompt_engineering: "Prompt Eng.",
    logic: "Mantiq", algorithms: "Algoritm",
  };
  const diffLabels: Record<string, string> = { beginner: "Boshlang'ich", elementary: "Elementar", intermediate: "O'rta", advanced: "Yuqori" };

  if (loading) return <div className="glass-card p-8 h-64 animate-pulse" />;

  return (
    <div className="space-y-6 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display font-bold text-3xl mb-1">Platforma sozlamalari</h1>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button onClick={() => setActiveTab("coins")} className={cn("px-5 py-2.5 rounded-xl text-sm font-medium transition-all",
          activeTab === "coins" ? "bg-neon-yellow/10 text-neon-yellow border border-neon-yellow/20" : "bg-surface text-muted-foreground")}>
          <Coins className="w-4 h-4 inline mr-1.5" /> Coin / XP
        </button>
        <button onClick={() => setActiveTab("placement")} className={cn("px-5 py-2.5 rounded-xl text-sm font-medium transition-all",
          activeTab === "placement" ? "bg-neon-purple/10 text-neon-purple border border-neon-purple/20" : "bg-surface text-muted-foreground")}>
          <Brain className="w-4 h-4 inline mr-1.5" /> Daraja aniqlash testi
        </button>
      </div>

      {/* ===== COIN/XP TAB ===== */}
      {activeTab === "coins" && (
        <div className="space-y-6">
          <motion.div className="glass-card p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2"><Coins className="w-5 h-5 text-neon-yellow" /> Coin sozlamalari</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(coinSettings).map(([key, value]) => (
                <div key={key}><label className="text-xs font-medium text-muted-foreground mb-1 block">{key.replace(/_/g, " ")}</label>
                  <input type="number" value={value} onChange={e => setCoinSettings({ ...coinSettings, [key]: +e.target.value })} className="input-field" /></div>
              ))}
            </div>
          </motion.div>

          <motion.div className="glass-card p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2"><Zap className="w-5 h-5 text-neon-purple" /> XP sozlamalari</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(xpSettings).map(([key, value]) => (
                <div key={key}><label className="text-xs font-medium text-muted-foreground mb-1 block">{key.replace(/_/g, " ")}</label>
                  <input type="number" value={value} onChange={e => setXpSettings({ ...xpSettings, [key]: +e.target.value })} className="input-field" /></div>
              ))}
            </div>
          </motion.div>

          <button onClick={handleSaveCoinSettings} disabled={saving} className="btn-primary py-3 px-8 flex items-center gap-2 disabled:opacity-50">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Saqlash
          </button>
        </div>
      )}

      {/* ===== PLACEMENT TEST TAB ===== */}
      {activeTab === "placement" && (
        <div className="space-y-6">
          <motion.div className="glass-card p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-display font-semibold text-lg">Daraja aniqlash savollari</h2>
                <p className="text-xs text-muted-foreground">{placementQuestions.length} ta savol · Foydalanuvchi register qilganda ko'rsatiladi</p>
              </div>
              <div className="flex gap-2">
                <button onClick={aiGeneratePlacementQuestions} disabled={aiGenerating}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-neon-blue/10 text-neon-blue border border-neon-blue/20 hover:bg-neon-blue/20 disabled:opacity-50 transition-all">
                  {aiGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  AI: 9 ta savol yaratish
                </button>
                <button onClick={() => setShowQuestionForm(!showQuestionForm)} className="btn-primary py-2 px-4 text-sm flex items-center gap-1.5">
                  <Plus className="w-4 h-4" /> Qo'lda qo'shish
                </button>
              </div>
            </div>

            {/* Category breakdown */}
            <div className="flex gap-3 mb-4">
              {Object.entries(categoryLabels).map(([cat, label]) => {
                const count = placementQuestions.filter(q => q.category === cat && q.is_active).length;
                return (
                  <span key={cat} className="text-xs px-3 py-1.5 rounded-lg bg-surface">
                    {label}: <strong>{count}</strong>
                  </span>
                );
              })}
            </div>

            {/* Add question form */}
            {showQuestionForm && (
              <motion.div className="p-4 rounded-xl bg-surface/50 border border-border mb-4 space-y-3" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                <div><label className="text-sm font-medium mb-1 block">Savol *</label>
                  <textarea value={qForm.question} onChange={e => setQForm({ ...qForm, question: e.target.value })} className="input-field min-h-[60px]" placeholder="Dasturlash tili nima vazifa bajaradi?" /></div>
                <div className="grid grid-cols-3 gap-3">
                  <div><label className="text-xs font-medium mb-1 block">Kategoriya</label>
                    <select value={qForm.category} onChange={e => setQForm({ ...qForm, category: e.target.value })} className="input-field text-sm">
                      <option value="basic_programming">Dasturlash</option>
                      <option value="computer_literacy">Kompyuter savodxonligi</option>
                      <option value="prompt_engineering">Prompt Engineering</option>
                      <option value="logic">Mantiq</option>
                      <option value="algorithms">Algoritmlar</option>
                    </select></div>
                  <div><label className="text-xs font-medium mb-1 block">Qiyinlik</label>
                    <select value={qForm.difficulty} onChange={e => setQForm({ ...qForm, difficulty: e.target.value })} className="input-field text-sm">
                      <option value="beginner">Boshlang'ich</option><option value="elementary">Elementar</option>
                      <option value="intermediate">O'rta</option><option value="advanced">Yuqori</option>
                    </select></div>
                  <div><label className="text-xs font-medium mb-1 block">To'g'ri javob</label>
                    <select value={qForm.correct_option} onChange={e => setQForm({ ...qForm, correct_option: e.target.value })} className="input-field text-sm">
                      <option value="a">A</option><option value="b">B</option><option value="c">C</option><option value="d">D</option>
                    </select></div>
                </div>
                <div><label className="text-xs font-medium mb-1 block">Variantlar (JSON)</label>
                  <textarea value={qForm.options} onChange={e => setQForm({ ...qForm, options: e.target.value })} className="input-field font-mono text-[10px] min-h-[60px]" /></div>
                <div className="flex gap-2">
                  <button onClick={saveQuestion} className="btn-primary py-1.5 px-4 text-sm">Qo'shish</button>
                  <button onClick={() => setShowQuestionForm(false)} className="btn-ghost py-1.5 px-4 text-sm">Bekor</button>
                </div>
              </motion.div>
            )}

            {/* Questions list */}
            <div className="space-y-2">
              {placementQuestions.map((q, i) => (
                <div key={q.id} className={cn("flex items-center gap-3 p-3 rounded-xl border transition-all",
                  q.is_active ? "bg-surface/30 border-border/50" : "bg-surface/10 border-border/20 opacity-50")}>
                  <span className="text-xs font-mono text-muted-foreground w-6">{i + 1}</span>
                  <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium",
                    q.category === "basic_programming" ? "bg-neon-purple/10 text-neon-purple" :
                    q.category === "computer_literacy" ? "bg-neon-blue/10 text-neon-blue" :
                    "bg-neon-green/10 text-neon-green"
                  )}>{categoryLabels[q.category] || q.category}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface text-muted-foreground">{diffLabels[q.difficulty] || q.difficulty}</span>
                  <span className="flex-1 text-sm truncate">{q.question}</span>
                  <span className="text-xs font-mono text-neon-green">✓{q.correct_option}</span>
                  <button onClick={() => toggleActive(q.id, q.is_active)} className="p-1 hover:bg-accent rounded text-muted-foreground text-xs">
                    {q.is_active ? "🟢" : "⚪"}
                  </button>
                  <button onClick={() => deleteQuestion(q.id)} className="p-1 hover:bg-neon-red/10 rounded text-muted-foreground hover:text-neon-red">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {placementQuestions.length === 0 && (
                <p className="text-center text-muted-foreground py-8 text-sm">Hali savol qo'shilmagan. "AI: 9 ta savol yaratish" tugmasini bosing.</p>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
