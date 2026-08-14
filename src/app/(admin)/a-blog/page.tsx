"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { createClient } from "@/lib/supabase/client";
import type { BlogPost } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import slugify from "slugify";
import { cn } from "@/lib/utils";
import {
  Plus, Pencil, Trash2, Save, X, Loader2, Eye, EyeOff, Newspaper,
  Upload, Sparkles, ImagePlus,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import type { Dictionary } from "@/lib/i18n/dictionaries/uz";

const RichTextEditor = dynamic(() => import("@/components/editor/RichTextEditor"), { ssr: false });

const CATEGORIES = ["dasturlash", "kompyuter savodxonligi", "sun'iy intellekt", "karyera", "umumiy"];

const empty = {
  title: "", excerpt: "", content_html: "", cover_url: "",
  category: "dasturlash", tags: "", reading_minutes: 5,
};

export default function AdminBlogPage() {
  const { t } = useI18n();
  const supabase = createClient();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [aiGen, setAiGen] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
    if (data) setPosts(data as BlogPost[]);
    setLoading(false);
  }

  function openNew() { setForm(empty); setEditId(null); setShowForm(true); }
  function openEdit(p: BlogPost) {
    setForm({
      title: p.title, excerpt: p.excerpt || "", content_html: p.content_html || "",
      cover_url: p.cover_url || "", category: p.category, tags: p.tags?.join(", ") || "",
      reading_minutes: p.reading_minutes,
    });
    setEditId(p.id); setShowForm(true);
  }

  async function uploadCover(file: File) {
    if (!file.type.startsWith("image/")) { toast.error(t.admin.common.onlyImage); return; }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `blog/${Date.now()}-${slugify(form.title || "post", { lower: true, strict: true })}.${ext}`;
      const { error } = await supabase.storage.from("course-thumbnails").upload(path, file, { cacheControl: "31536000" });
      if (error) { toast.error(error.message); setUploading(false); return; }
      const { data } = supabase.storage.from("course-thumbnails").getPublicUrl(path);
      setForm(f => ({ ...f, cover_url: data.publicUrl }));
      toast.success("Cover yuklandi");
    } catch (e: any) { toast.error(e.message); }
    setUploading(false);
  }

  async function aiWrite() {
    if (!form.title.trim()) { toast.error(t.admin.blg.titleFirst); return; }
    setAiGen(true);
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "lecture", topic_title: form.title, course_title: t.admin.blg.seoPrefix + form.category }),
      });
      const data = await res.json();
      if (data.data) {
        setForm(f => ({ ...f, content_html: data.data }));
        toast.success("AI maqola yozdi — tahrirlang");
      } else toast.error(data.error || "AI xatolik");
    } catch (e: any) { toast.error(e.message); }
    setAiGen(false);
  }

  async function save(publish?: boolean) {
    if (!form.title.trim()) { toast.error(t.admin.common.enterTitle); return; }
    setSaving(true);
    const slug = slugify(form.title, { lower: true, strict: true });
    const payload: any = {
      title: form.title, slug, excerpt: form.excerpt || null,
      content_html: form.content_html, cover_url: form.cover_url || null,
      category: form.category, reading_minutes: form.reading_minutes,
      tags: form.tags ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
    };
    if (publish !== undefined) {
      payload.is_published = publish;
      if (publish) payload.published_at = new Date().toISOString();
    }

    let error;
    if (editId) {
      ({ error } = await supabase.from("blog_posts").update(payload).eq("id", editId));
    } else {
      payload.is_published = publish ?? false;
      if (payload.is_published) payload.published_at = new Date().toISOString();
      ({ error } = await supabase.from("blog_posts").insert(payload));
    }
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success(editId ? "Yangilandi" : "Yaratildi");
    setShowForm(false);
    load();
    fetch("/api/revalidate", { method: "POST" }).catch(() => {});
  }

  async function togglePublish(p: BlogPost) {
    await supabase.from("blog_posts").update({
      is_published: !p.is_published,
      published_at: !p.is_published ? new Date().toISOString() : p.published_at,
    }).eq("id", p.id);
    toast.success(p.is_published ? t.admin.blg.hiddenToast : t.admin.common.publishedToast);
    load();
    fetch("/api/revalidate", { method: "POST" }).catch(() => {});
  }

  async function del(p: BlogPost) {
    if (!confirm(`"${p.title}" o'chirilsinmi?`)) return;
    await supabase.from("blog_posts").delete().eq("id", p.id);
    toast.success(t.admin.common.deleted); load();
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl flex items-center gap-2"><Newspaper className="w-6 h-6 text-neon-purple" /> {t.nav.blog}</h1>
          <p className="text-sm text-muted-foreground">{posts.length} ta maqola</p>
        </div>
        <button onClick={openNew} className="btn-primary py-2.5 px-5 flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Yangi maqola
        </button>
      </div>

      {/* FORM */}
      <AnimatePresence>
        {showForm && (
          <motion.div className="glass-card p-6 space-y-4" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
            <div className="flex items-center justify-between">
              <h2 className="font-display font-semibold">{editId ? "Tahrirlash" : "Yangi maqola"}</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 hover:bg-accent rounded-lg"><X className="w-5 h-5" /></button>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">{t.admin.common.title2} *</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="input-field" placeholder={t.admin.blg.titlePh} />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">{t.admin.blg.metaDesc}</label>
              <textarea value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} className="input-field resize-none" rows={2} placeholder={t.admin.blg.metaHint} maxLength={200} />
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">{t.admin.common.category}</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="input-field">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">{t.admin.common.tags}</label>
                <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} className="input-field" placeholder="python, boshlang'ich" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">{t.admin.blg.readMinutes}</label>
                <input type="number" value={form.reading_minutes} onChange={e => setForm({ ...form, reading_minutes: +e.target.value })} className="input-field" />
              </div>
            </div>

            {/* Cover */}
            <div>
              <label className="text-sm font-medium mb-1 block">{t.admin.common.coverImage}</label>
              <div className="flex items-center gap-3">
                <div className="w-40 h-24 rounded-xl border border-border/60 bg-surface/40 overflow-hidden flex items-center justify-center flex-shrink-0">
                  {form.cover_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={form.cover_url} className="w-full h-full object-cover" alt="" />
                  ) : <ImagePlus className="w-6 h-6 text-muted-foreground/40" />}
                </div>
                <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-border hover:border-neon-purple/40 cursor-pointer text-sm text-muted-foreground">
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  Rasm tanlash
                  <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) uploadCover(f); e.target.value = ""; }} />
                </label>
              </div>
            </div>

            {/* Content */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium">{t.admin.blg.body}</label>
                <button onClick={aiWrite} disabled={!form.title || aiGen}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-neon-blue/10 text-neon-blue border border-neon-blue/20 hover:bg-neon-blue/20 disabled:opacity-50">
                  {aiGen ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />} AI bilan yozish
                </button>
              </div>
              <RichTextEditor value={form.content_html} onChange={html => setForm(f => ({ ...f, content_html: html }))} placeholder="Maqola matnini yozing..." />
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={() => setShowForm(false)} className="btn-ghost py-2 px-5 text-sm">{t.common.cancel}</button>
              <button onClick={() => save(false)} disabled={saving} className="btn-ghost py-2 px-5 text-sm border border-border flex items-center gap-2 disabled:opacity-50">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Qoralama saqlash
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
        posts.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Newspaper className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="mb-4">{t.admin.blg.empty}</p>
            <button onClick={openNew} className="btn-primary text-sm py-2 px-5"><Plus className="w-4 h-4 inline mr-1" /> {t.admin.blg.first}</button>
          </div>
        ) : posts.map(p => (
          <div key={p.id} className="glass-card p-4 flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-surface overflow-hidden flex-shrink-0 flex items-center justify-center">
              {p.cover_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.cover_url} className="w-full h-full object-cover" alt="" />
              ) : <Newspaper className="w-5 h-5 text-muted-foreground/40" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{p.title}</p>
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                <span className="capitalize">{p.category}</span>
                <span>· {p.views} ko'rish</span>
                {p.is_published
                  ? <span className="text-neon-green">· {t.admin.common.published}</span>
                  : <span className="text-neon-yellow">· {t.admin.common.draft}</span>}
              </div>
            </div>
            <button onClick={() => togglePublish(p)} className="p-2 hover:bg-accent rounded-lg text-muted-foreground" title={p.is_published ? "Yashirish" : "Nashr"}>
              {p.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            <button onClick={() => openEdit(p)} className="p-2 hover:bg-accent rounded-lg text-muted-foreground hover:text-foreground"><Pencil className="w-4 h-4" /></button>
            <button onClick={() => del(p)} className="p-2 hover:bg-neon-red/10 rounded-lg text-muted-foreground hover:text-neon-red"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
