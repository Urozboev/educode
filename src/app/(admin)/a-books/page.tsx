"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Book, BookFileType, BookLanguage } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import slugify from "slugify";
import { formatBytes } from "@/lib/utils";
import {
  Plus, Pencil, Trash2, Save, X, Loader2, Eye, EyeOff, Library,
  Upload, ImagePlus, FileText, Download, Link2,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import type { Dictionary } from "@/lib/i18n/dictionaries/uz";

const CATEGORIES = (t: Dictionary) => [
  { value: "programming", label: t.admin.set.catProgramming },
  { value: "python", label: "Python" },
  { value: "frontend", label: "Frontend" },
  { value: "computer_literacy", label: t.admin.set.catLiteracy },
  { value: "algorithms", label: t.admin.set.catAlgorithms },
  { value: "prompt_engineering", label: t.admin.common.catAi },
  { value: "other", label: t.admin.tch.subjOther },
];

const LANGUAGES = (t: Dictionary): { value: BookLanguage; label: string }[] => [
  { value: "uz", label: t.admin.common.langUz },
  { value: "ru", label: t.admin.common.langRu },
  { value: "en", label: t.admin.common.langEn },
];

const MAX_FILE_MB = 50;

const empty = {
  title: "",
  author: "",
  description: "",
  cover_url: "",
  file_url: "",
  file_size_bytes: 0,
  file_type: "pdf" as BookFileType,
  page_count: 0,
  language: "uz" as BookLanguage,
  category: "programming",
  tags: "",
  publisher: "",
  published_year: 0,
  order_index: 0,
};

export default function AdminBooksPage() {
  const { t } = useI18n();
  const supabase = createClient();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    const { data } = await supabase
      .from("books")
      .select("*")
      .order("order_index")
      .order("created_at", { ascending: false });
    if (data) setBooks(data as Book[]);
    setLoading(false);
  }

  function openNew() { setForm(empty); setEditId(null); setShowForm(true); }

  function openEdit(b: Book) {
    setForm({
      title: b.title,
      author: b.author || "",
      description: b.description || "",
      cover_url: b.cover_url || "",
      file_url: b.file_url,
      file_size_bytes: b.file_size_bytes || 0,
      file_type: b.file_type,
      page_count: b.page_count || 0,
      language: b.language,
      category: b.category,
      tags: b.tags?.join(", ") || "",
      publisher: b.publisher || "",
      published_year: b.published_year || 0,
      order_index: b.order_index,
    });
    setEditId(b.id);
    setShowForm(true);
  }

  async function uploadCover(file: File) {
    if (!file.type.startsWith("image/")) { toast.error(t.admin.common.onlyImage); return; }
    setUploadingCover(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${Date.now()}-${slugify(form.title || "book", { lower: true, strict: true })}.${ext}`;
      const { error } = await supabase.storage.from("book-covers").upload(path, file, { cacheControl: "31536000" });
      if (error) { toast.error(error.message); setUploadingCover(false); return; }
      const { data } = supabase.storage.from("book-covers").getPublicUrl(path);
      setForm(f => ({ ...f, cover_url: data.publicUrl }));
      toast.success("Muqova yuklandi");
    } catch (e: any) { toast.error(e.message); }
    setUploadingCover(false);
  }

  async function uploadBookFile(file: File) {
    const sizeMb = file.size / 1024 / 1024;
    if (sizeMb > MAX_FILE_MB) {
      toast.error(`Fayl juda katta (${sizeMb.toFixed(1)} MB). Chegara ${MAX_FILE_MB} MB — kattaroq kitob uchun tashqi havoladan foydalaning.`);
      return;
    }
    setUploadingFile(true);
    try {
      const ext = (file.name.split(".").pop() || "pdf").toLowerCase();
      const path = `${Date.now()}-${slugify(form.title || "book", { lower: true, strict: true })}.${ext}`;
      const { error } = await supabase.storage.from("books").upload(path, file, {
        cacheControl: "31536000",
        contentType: file.type || "application/pdf",
      });
      if (error) { toast.error(error.message); setUploadingFile(false); return; }
      const { data } = supabase.storage.from("books").getPublicUrl(path);
      const detected: BookFileType =
        ext === "epub" ? "epub" : ext === "djvu" ? "djvu" : ext.startsWith("doc") ? "doc" : "pdf";
      setForm(f => ({ ...f, file_url: data.publicUrl, file_size_bytes: file.size, file_type: detected }));
      toast.success("Kitob yuklandi");
    } catch (e: any) { toast.error(e.message); }
    setUploadingFile(false);
  }

  async function save(publish?: boolean) {
    if (!form.title.trim()) { toast.error(t.admin.common.enterTitle); return; }
    if (!form.file_url.trim()) { toast.error(t.admin.bks.needFile); return; }
    setSaving(true);

    const payload = {
      title: form.title.trim(),
      slug: slugify(form.title, { lower: true, strict: true }),
      author: form.author.trim() || null,
      description: form.description.trim() || null,
      cover_url: form.cover_url || null,
      file_url: form.file_url.trim(),
      file_size_bytes: form.file_size_bytes || null,
      file_type: form.file_type,
      page_count: form.page_count || null,
      language: form.language,
      category: form.category,
      tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
      publisher: form.publisher.trim() || null,
      published_year: form.published_year || null,
      order_index: form.order_index,
      ...(publish !== undefined ? { is_published: publish } : {}),
    };

    let error;
    if (editId) {
      ({ error } = await supabase.from("books").update(payload).eq("id", editId));
    } else {
      ({ error } = await supabase.from("books").insert(payload));
    }

    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success(editId ? t.admin.common.saved : t.admin.common.added);
    setShowForm(false);
    load();
  }

  async function togglePublish(b: Book) {
    await supabase.from("books").update({ is_published: !b.is_published }).eq("id", b.id);
    load();
  }

  async function del(b: Book) {
    if (!confirm(`"${b.title}" o'chirilsinmi?`)) return;
    await supabase.from("books").delete().eq("id", b.id);
    toast.success(t.admin.common.deleted);
    load();
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl flex items-center gap-2">
            <Library className="w-6 h-6 text-neon-purple" /> Kitoblar
          </h1>
          <p className="text-sm text-muted-foreground">{books.length} ta kitob</p>
        </div>
        <button onClick={openNew} className="btn-primary py-2.5 px-5 flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Yangi kitob
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
              <h2 className="font-display font-semibold">{editId ? "Tahrirlash" : "Yangi kitob"}</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 hover:bg-accent rounded-lg"><X className="w-5 h-5" /></button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">{t.admin.bks.titleLabel} *</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="input-field" placeholder="Python asoslari" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">{t.admin.bks.author}</label>
                <input value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} className="input-field" placeholder={t.admin.bks.authorPh} />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">{t.admin.common.shortDesc}</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input-field resize-none" rows={2} placeholder={t.admin.bks.descPh} maxLength={400} />
            </div>

            <div className="grid sm:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">{t.admin.common.category}</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="input-field">
                  {CATEGORIES(t).map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">{t.admin.common.language}</label>
                <select value={form.language} onChange={e => setForm({ ...form, language: e.target.value as BookLanguage })} className="input-field">
                  {LANGUAGES(t).map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">{t.admin.bks.pages}</label>
                <input type="number" value={form.page_count || ""} onChange={e => setForm({ ...form, page_count: +e.target.value })} className="input-field" placeholder="320" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">{t.admin.bks.year}</label>
                <input type="number" value={form.published_year || ""} onChange={e => setForm({ ...form, published_year: +e.target.value })} className="input-field" placeholder="2024" />
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="text-sm font-medium mb-1 block">{t.admin.common.tags}</label>
                <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} className="input-field" placeholder="python, boshlang'ich, amaliyot" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">{t.admin.bks.publisher}</label>
                <input value={form.publisher} onChange={e => setForm({ ...form, publisher: e.target.value })} className="input-field" placeholder={t.admin.common.publisherPh} />
              </div>
            </div>

            {/* Muqova */}
            <div>
              <label className="text-sm font-medium mb-1 block">{t.admin.common.coverImage}</label>
              <div className="flex items-center gap-3">
                <div className="w-20 h-28 rounded-lg border border-border/60 bg-surface/40 overflow-hidden flex items-center justify-center flex-shrink-0">
                  {form.cover_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={form.cover_url} className="w-full h-full object-cover" alt="" />
                  ) : <ImagePlus className="w-6 h-6 text-muted-foreground/40" />}
                </div>
                <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-border hover:border-neon-purple/40 cursor-pointer text-sm text-muted-foreground">
                  {uploadingCover ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  Muqova tanlash
                  <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) uploadCover(f); e.target.value = ""; }} />
                </label>
              </div>
            </div>

            {/* Kitob fayli */}
            <div>
              <label className="text-sm font-medium mb-1 block">{t.admin.bks.file} *</label>
              <div className="flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-border hover:border-neon-purple/40 cursor-pointer text-sm text-muted-foreground">
                  {uploadingFile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  Fayl yuklash (PDF, EPUB — {MAX_FILE_MB} MB gacha)
                  <input
                    type="file"
                    accept=".pdf,.epub,.djvu,.doc,.docx"
                    className="hidden"
                    onChange={e => { const f = e.target.files?.[0]; if (f) uploadBookFile(f); e.target.value = ""; }}
                  />
                </label>
                {form.file_url && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-neon-green">
                    <FileText className="w-3.5 h-3.5" />
                    {form.file_type.toUpperCase()}
                    {form.file_size_bytes ? ` · ${formatBytes(form.file_size_bytes)}` : ""}
                  </span>
                )}
              </div>
              <div className="mt-2">
                <label className="text-xs text-muted-foreground mb-1 flex items-center gap-1.5">
                  <Link2 className="w-3.5 h-3.5" />
                  {t.admin.bks.orExternal}
                </label>
                <input
                  value={form.file_url}
                  onChange={e => setForm({ ...form, file_url: e.target.value, file_type: "link" })}
                  className="input-field text-sm"
                  placeholder="https://..."
                />
              </div>
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
        books.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Library className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="mb-4">{t.admin.bks.empty}</p>
            <button onClick={openNew} className="btn-primary text-sm py-2 px-5"><Plus className="w-4 h-4 inline mr-1" /> {t.admin.bks.first}</button>
          </div>
        ) : books.map(b => (
          <div key={b.id} className="glass-card p-4 flex items-center gap-4">
            <div className="w-12 h-16 rounded-lg bg-surface overflow-hidden flex-shrink-0 flex items-center justify-center">
              {b.cover_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={b.cover_url} className="w-full h-full object-cover" alt="" />
              ) : <Library className="w-5 h-5 text-muted-foreground/40" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{b.title}</p>
              <div className="flex flex-wrap items-center gap-x-2 text-[11px] text-muted-foreground mt-0.5">
                {b.author && <span>{b.author}</span>}
                <span>· {b.file_type.toUpperCase()}</span>
                {b.file_size_bytes ? <span>· {formatBytes(b.file_size_bytes)}</span> : null}
                <span className="inline-flex items-center gap-1">· <Download className="w-3 h-3" />{b.downloads}</span>
                {b.is_published
                  ? <span className="text-neon-green">· {t.admin.common.published}</span>
                  : <span className="text-neon-yellow">· {t.admin.common.draft}</span>}
              </div>
            </div>
            <button onClick={() => togglePublish(b)} className="p-2 hover:bg-accent rounded-lg text-muted-foreground" title={b.is_published ? "Yashirish" : "Nashr"}>
              {b.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            <button onClick={() => openEdit(b)} className="p-2 hover:bg-accent rounded-lg text-muted-foreground hover:text-foreground"><Pencil className="w-4 h-4" /></button>
            <button onClick={() => del(b)} className="p-2 hover:bg-neon-red/10 rounded-lg text-muted-foreground hover:text-neon-red"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
