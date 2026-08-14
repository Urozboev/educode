"use client";

import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import type { GlossaryTerm, CourseDifficulty } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import slugify from "slugify";
import { getCategoryLabel } from "@/lib/utils";
import { LevelBadge } from "@/components/ui/LevelBadge";
import {
  Plus, Pencil, Trash2, Save, X, Loader2, Eye, EyeOff, BookMarked, Search,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import type { Dictionary } from "@/lib/i18n/dictionaries/uz";

const CATEGORIES = (t: Dictionary) => [
  { value: "programming", label: t.admin.set.catProgramming },
  { value: "frontend", label: "Frontend" },
  { value: "computer_literacy", label: t.admin.set.catLiteracy },
  { value: "algorithms", label: t.admin.set.catAlgorithms },
];

const DIFFICULTIES = (t: Dictionary): { value: CourseDifficulty; label: string }[] => [
  { value: "beginner", label: t.difficulty.beginner },
  { value: "intermediate", label: t.difficulty.intermediate },
  { value: "advanced", label: t.difficulty.advanced },
];

const empty = {
  term: "",
  term_en: "",
  definition: "",
  example: "",
  synonyms: "",
  category: "programming",
  difficulty: "beginner" as CourseDifficulty,
};

export default function AdminGlossaryPage() {
  const { t } = useI18n();
  const supabase = createClient();
  const [terms, setTerms] = useState<GlossaryTerm[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");

  useEffect(() => { load(); }, []);

  async function load() {
    const { data } = await supabase.from("glossary_terms").select("*").order("term");
    if (data) setTerms(data as GlossaryTerm[]);
    setLoading(false);
  }

  const filtered = useMemo(() => terms.filter(t =>
    (filterCat === "all" || t.category === filterCat) &&
    (t.term.toLowerCase().includes(search.toLowerCase()) ||
      t.term_en?.toLowerCase().includes(search.toLowerCase()) ||
      t.definition.toLowerCase().includes(search.toLowerCase()))
  ), [terms, search, filterCat]);

  function openNew() { setForm(empty); setEditId(null); setShowForm(true); }

  function openEdit(t: GlossaryTerm) {
    setForm({
      term: t.term,
      term_en: t.term_en || "",
      definition: t.definition,
      example: t.example || "",
      synonyms: t.synonyms?.join(", ") || "",
      category: t.category,
      difficulty: t.difficulty,
    });
    setEditId(t.id);
    setShowForm(true);
  }

  async function save(publish?: boolean) {
    if (!form.term.trim()) { toast.error(t.admin.gls.enterTerm); return; }
    if (!form.definition.trim()) { toast.error(t.admin.gls.enterDefinition); return; }
    setSaving(true);

    const payload = {
      term: form.term.trim(),
      slug: slugify(form.term, { lower: true, strict: true }),
      term_en: form.term_en.trim() || null,
      definition: form.definition.trim(),
      example: form.example.trim() || null,
      synonyms: form.synonyms.split(",").map(s => s.trim()).filter(Boolean),
      category: form.category,
      difficulty: form.difficulty,
      ...(publish !== undefined ? { is_published: publish } : {}),
    };

    let error;
    if (editId) {
      ({ error } = await supabase.from("glossary_terms").update(payload).eq("id", editId));
    } else {
      ({ error } = await supabase.from("glossary_terms").insert(payload));
    }

    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success(editId ? t.admin.common.saved : t.admin.common.added);
    // Ketma-ket termin kiritish qulay bo'lishi uchun forma ochiq qoladi
    if (editId) { setShowForm(false); } else { setForm({ ...empty, category: form.category }); }
    load();
  }

  async function togglePublish(g: GlossaryTerm) {
    await supabase.from("glossary_terms").update({ is_published: !g.is_published }).eq("id", g.id);
    load();
  }

  async function del(g: GlossaryTerm) {
    if (!confirm(`"${g.term}" o'chirilsinmi?`)) return;
    await supabase.from("glossary_terms").delete().eq("id", g.id);
    toast.success(t.admin.common.deleted);
    load();
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl flex items-center gap-2">
            <BookMarked className="w-6 h-6 text-neon-purple" /> Terminlar lug'ati
          </h1>
          <p className="text-sm text-muted-foreground">{terms.length} ta termin</p>
        </div>
        <button onClick={openNew} className="btn-primary py-2.5 px-5 flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Yangi termin
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
              <h2 className="font-display font-semibold">{editId ? "Tahrirlash" : "Yangi termin"}</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 hover:bg-accent rounded-lg"><X className="w-5 h-5" /></button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">{t.admin.gls.term} *</label>
                <input value={form.term} onChange={e => setForm({ ...form, term: e.target.value })} className="input-field" placeholder={t.admin.gls.termPh} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">{t.admin.gls.english}</label>
                <input value={form.term_en} onChange={e => setForm({ ...form, term_en: e.target.value })} className="input-field" placeholder="Variable" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">{t.admin.gls.definition} *</label>
              <textarea
                value={form.definition}
                onChange={e => setForm({ ...form, definition: e.target.value })}
                className="input-field resize-none"
                rows={3}
                placeholder={t.admin.gls.defPh}
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground mt-1">{form.definition.length}/500</p>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">{t.admin.gls.example}</label>
              <textarea value={form.example} onChange={e => setForm({ ...form, example: e.target.value })} className="input-field resize-none font-mono text-sm" rows={2} placeholder={t.admin.gls.examplePh} />
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">{t.admin.gls.field}</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="input-field">
                  {CATEGORIES(t).map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">{t.admin.common.level}</label>
                <select value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value as CourseDifficulty })} className="input-field">
                  {DIFFICULTIES(t).map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">{t.admin.gls.synonyms}</label>
                <input value={form.synonyms} onChange={e => setForm({ ...form, synonyms: e.target.value })} className="input-field" placeholder="peremennaya" />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={() => setShowForm(false)} className="btn-ghost py-2 px-5 text-sm">{t.admin.common.close}</button>
              <button onClick={() => save(true)} disabled={saving} className="btn-primary py-2 px-5 text-sm flex items-center gap-2 disabled:opacity-50">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {editId ? t.admin.common.save : t.admin.gls.saveAndContinue}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FILTER */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-10" placeholder="Termin bo'yicha qidirish..." />
        </div>
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)} className="input-field w-auto">
          <option value="all">{t.admin.gls.allFields}</option>
          {CATEGORIES(t).map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
      </div>

      {/* LIST */}
      <div className="space-y-2">
        {loading ? [1, 2, 3].map(i => <div key={i} className="glass-card h-16 animate-pulse" />) :
        filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <BookMarked className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="mb-4">{terms.length === 0 ? t.admin.gls.empty : t.admin.common.noResults}</p>
            {terms.length === 0 && (
              <button onClick={openNew} className="btn-primary text-sm py-2 px-5"><Plus className="w-4 h-4 inline mr-1" /> {t.admin.gls.first}</button>
            )}
          </div>
        ) : filtered.map(g => (
          <div key={g.id} className="glass-card p-4 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-medium text-sm">{g.term}</p>
                {g.term_en && <span className="font-mono text-[11px] text-muted-foreground">{g.term_en}</span>}
                <LevelBadge difficulty={g.difficulty} />
              </div>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{g.definition}</p>
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                <span>{getCategoryLabel(g.category)}</span>
                {g.is_published
                  ? <span className="text-neon-green">· {t.admin.common.published}</span>
                  : <span className="text-neon-yellow">· {t.admin.common.hidden}</span>}
              </div>
            </div>
            <button onClick={() => togglePublish(g)} className="p-2 hover:bg-accent rounded-lg text-muted-foreground" title={g.is_published ? "Yashirish" : "Nashr"}>
              {g.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            <button onClick={() => openEdit(g)} className="p-2 hover:bg-accent rounded-lg text-muted-foreground hover:text-foreground"><Pencil className="w-4 h-4" /></button>
            <button onClick={() => del(g)} className="p-2 hover:bg-neon-red/10 rounded-lg text-muted-foreground hover:text-neon-red"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
