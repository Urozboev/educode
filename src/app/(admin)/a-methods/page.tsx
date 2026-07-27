"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { createClient } from "@/lib/supabase/client";
import type { TeachingMethod, MethodGroupSize, MethodStage } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import slugify from "slugify";
import { GROUP_SIZES, STAGES } from "@/lib/methods";
import {
  Plus, Pencil, Trash2, Save, X, Loader2, Eye, EyeOff, Lightbulb,
  ThumbsUp, ThumbsDown, Clock, Users,
} from "lucide-react";

const RichTextEditor = dynamic(() => import("@/components/editor/RichTextEditor"), { ssr: false });


const empty = {
  title: "",
  summary: "",
  guide_html: "",
  advantages: "",
  disadvantages: "",
  materials: "",
  duration_minutes: 15,
  group_size: "any" as MethodGroupSize,
  stage: "practice" as MethodStage,
  order_index: 0,
};

/** Ko'p qatorli maydonni massivga: har qator — alohida element */
const toList = (s: string) => s.split("\n").map(x => x.trim()).filter(Boolean);

export default function AdminMethodsPage() {
  const supabase = createClient();
  const [methods, setMethods] = useState<TeachingMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    const { data } = await supabase
      .from("teaching_methods")
      .select("*")
      .order("order_index")
      .order("created_at", { ascending: false });
    if (data) setMethods(data as TeachingMethod[]);
    setLoading(false);
  }

  function openNew() { setForm(empty); setEditId(null); setShowForm(true); }

  function openEdit(m: TeachingMethod) {
    setForm({
      title: m.title,
      summary: m.summary,
      guide_html: m.guide_html || "",
      advantages: m.advantages?.join("\n") || "",
      disadvantages: m.disadvantages?.join("\n") || "",
      materials: m.materials?.join("\n") || "",
      duration_minutes: m.duration_minutes || 15,
      group_size: m.group_size,
      stage: m.stage,
      order_index: m.order_index,
    });
    setEditId(m.id);
    setShowForm(true);
  }

  async function save(publish?: boolean) {
    if (!form.title.trim()) { toast.error("Metod nomini kiriting"); return; }
    if (!form.summary.trim()) { toast.error("Qisqa tavsif kiriting"); return; }
    setSaving(true);

    const payload = {
      title: form.title.trim(),
      slug: slugify(form.title, { lower: true, strict: true }),
      summary: form.summary.trim(),
      guide_html: form.guide_html || null,
      advantages: toList(form.advantages),
      disadvantages: toList(form.disadvantages),
      materials: toList(form.materials),
      duration_minutes: form.duration_minutes || null,
      group_size: form.group_size,
      stage: form.stage,
      order_index: form.order_index,
      ...(publish !== undefined ? { is_published: publish } : {}),
    };

    let error;
    if (editId) {
      ({ error } = await supabase.from("teaching_methods").update(payload).eq("id", editId));
    } else {
      ({ error } = await supabase.from("teaching_methods").insert(payload));
    }

    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success(editId ? "Saqlandi" : "Qo'shildi");
    setShowForm(false);
    load();
  }

  async function togglePublish(m: TeachingMethod) {
    await supabase.from("teaching_methods").update({ is_published: !m.is_published }).eq("id", m.id);
    load();
  }

  async function del(m: TeachingMethod) {
    if (!confirm(`"${m.title}" o'chirilsinmi?`)) return;
    await supabase.from("teaching_methods").delete().eq("id", m.id);
    toast.success("O'chirildi");
    load();
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-neon-purple" /> O&apos;qitish metodlari
          </h1>
          <p className="text-sm text-muted-foreground">{methods.length} ta metod</p>
        </div>
        <button onClick={openNew} className="btn-primary py-2.5 px-5 flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Yangi metod
        </button>
      </div>

      {/* FORM */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="glass-card p-6 space-y-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display font-semibold">{editId ? "Tahrirlash" : "Yangi metod"}</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 hover:bg-accent rounded-lg"><X className="w-5 h-5" /></button>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Metod nomi *</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="input-field" placeholder="Aqliy hujum (Brainstorming)" />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Qisqa tavsif *</label>
              <textarea value={form.summary} onChange={e => setForm({ ...form, summary: e.target.value })} className="input-field resize-none" rows={2} placeholder="Bir jumlada: metod nima qiladi va nima uchun ishlatiladi" maxLength={300} />
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Dars bosqichi</label>
                <select value={form.stage} onChange={e => setForm({ ...form, stage: e.target.value as MethodStage })} className="input-field">
                  {STAGES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Guruh hajmi</label>
                <select value={form.group_size} onChange={e => setForm({ ...form, group_size: e.target.value as MethodGroupSize })} className="input-field">
                  {GROUP_SIZES.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Davomiyligi (daqiqa)</label>
                <input type="number" value={form.duration_minutes || ""} onChange={e => setForm({ ...form, duration_minutes: +e.target.value })} className="input-field" placeholder="15" />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block flex items-center gap-1.5">
                  <ThumbsUp className="w-4 h-4 text-neon-green" /> Afzalliklari
                </label>
                <textarea value={form.advantages} onChange={e => setForm({ ...form, advantages: e.target.value })} className="input-field resize-none text-sm" rows={5} placeholder="Har qatorda bitta afzallik:&#10;Barcha o'quvchi jalb qilinadi&#10;Tayyorgarlik talab qilmaydi" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block flex items-center gap-1.5">
                  <ThumbsDown className="w-4 h-4 text-neon-red" /> Kamchiliklari
                </label>
                <textarea value={form.disadvantages} onChange={e => setForm({ ...form, disadvantages: e.target.value })} className="input-field resize-none text-sm" rows={5} placeholder="Har qatorda bitta kamchilik:&#10;Katta sinfda boshqarish qiyin&#10;Vaqt cho'zilib ketishi mumkin" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Kerakli materiallar</label>
              <textarea value={form.materials} onChange={e => setForm({ ...form, materials: e.target.value })} className="input-field resize-none text-sm" rows={3} placeholder="Har qatorda bittadan:&#10;Doska va marker&#10;Stikerlar" />
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Qadamma-qadam yo&apos;riqnoma</label>
              <RichTextEditor value={form.guide_html} onChange={html => setForm(f => ({ ...f, guide_html: html }))} placeholder="1-qadam: ..." />
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={() => setShowForm(false)} className="btn-ghost py-2 px-5 text-sm">Bekor</button>
              <button onClick={() => save(false)} disabled={saving} className="btn-ghost py-2 px-5 text-sm border border-border flex items-center gap-2 disabled:opacity-50">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Qoralama
              </button>
              <button onClick={() => save(true)} disabled={saving} className="btn-primary py-2 px-5 text-sm flex items-center gap-2 disabled:opacity-50">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />} Nashr qilish
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LIST */}
      <div className="space-y-2">
        {loading ? [1, 2, 3].map(i => <div key={i} className="glass-card h-16 animate-pulse" />) :
        methods.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Lightbulb className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="mb-4">Hali metod qo&apos;shilmagan</p>
            <button onClick={openNew} className="btn-primary text-sm py-2 px-5"><Plus className="w-4 h-4 inline mr-1" /> Birinchi metod</button>
          </div>
        ) : methods.map(m => (
          <div key={m.id} className="glass-card p-4 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{m.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{m.summary}</p>
              <div className="flex flex-wrap items-center gap-x-2 text-[11px] text-muted-foreground mt-1">
                <span>{STAGES.find(s => s.value === m.stage)?.label}</span>
                {m.duration_minutes ? <span className="inline-flex items-center gap-1">· <Clock className="w-3 h-3" />{m.duration_minutes} daq</span> : null}
                <span className="inline-flex items-center gap-1">· <Users className="w-3 h-3" />{GROUP_SIZES.find(g => g.value === m.group_size)?.label}</span>
                {m.is_published
                  ? <span className="text-neon-green">· Nashr qilingan</span>
                  : <span className="text-neon-yellow">· Qoralama</span>}
              </div>
            </div>
            <button onClick={() => togglePublish(m)} className="p-2 hover:bg-accent rounded-lg text-muted-foreground" title={m.is_published ? "Yashirish" : "Nashr"}>
              {m.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            <button onClick={() => openEdit(m)} className="p-2 hover:bg-accent rounded-lg text-muted-foreground hover:text-foreground"><Pencil className="w-4 h-4" /></button>
            <button onClick={() => del(m)} className="p-2 hover:bg-neon-red/10 rounded-lg text-muted-foreground hover:text-neon-red"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
