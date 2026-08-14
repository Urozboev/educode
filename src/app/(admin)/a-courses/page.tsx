"use client";

import { useState, useEffect } from "react";
import Link from "@/components/i18n/Link";
import { createClient } from "@/lib/supabase/client";
import { cn, getDifficultyConfig } from "@/lib/utils";
import type { Course, CourseDifficulty } from "@/types";
import { motion } from "framer-motion";
import { toast } from "sonner";
import slugify from "slugify";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  BookOpen,
  Loader2,
  X,
  Save,
  Coins,
  ImagePlus,
  Upload,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";

type CourseFormType = {
  title: string;
  description: string;
  category: string;
  difficulty: CourseDifficulty;
  is_free: boolean;
  price_coins: number;
  coin_reward: number;
  estimated_hours: number;
  tags: string;
  thumbnail_url: string;
};

const emptyForm: CourseFormType = {
  title: "",
  description: "",
  category: "programming",
  difficulty: "beginner",
  is_free: true,
  price_coins: 0,
  coin_reward: 50,
  estimated_hours: 10,
  tags: "",
  thumbnail_url: "",
};

export default function AdminCoursesPage() {
  const { t } = useI18n();
  const supabase = createClient();
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  /** Rasm faylini Supabase Storage'ga yuklab, public URL ni formaga yozadi */
  async function handleThumbnailUpload(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error(t.admin.crs.onlyImageFile);
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error(t.admin.crs.imageTooBig);
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${Date.now()}-${slugify(form.title || "kurs", { lower: true, strict: true })}.${ext}`;
      const { error } = await supabase.storage
        .from("course-thumbnails")
        .upload(path, file, { cacheControl: "31536000", upsert: false });
      if (error) {
        toast.error(`Yuklash xatolik: ${error.message}`);
        setUploading(false);
        return;
      }
      const { data } = supabase.storage.from("course-thumbnails").getPublicUrl(path);
      setForm(f => ({ ...f, thumbnail_url: data.publicUrl }));
      toast.success("Rasm yuklandi");
    } catch (e: any) {
      toast.error(e.message);
    }
    setUploading(false);
  }

  useEffect(() => {
    loadCourses();
  }, []);

  async function loadCourses() {
    const { data } = await supabase
      .from("courses")
      .select("*")
      .order("order_index");
    if (data) setCourses(data as Course[]);
    setLoading(false);
  }

  function openNew() {
    setForm(emptyForm);
    setEditId(null);
    setShowForm(true);
  }

  function openEdit(c: Course) {
    setForm({
      title: c.title,
      description: c.description || "",
      category: c.category,
      difficulty: c.difficulty || "beginner",
      is_free: c.is_free,
      price_coins: c.price_coins,
      coin_reward: c.coin_reward,
      estimated_hours: c.estimated_hours || 10,
      tags: c.tags?.join(", ") || "",
      thumbnail_url: c.thumbnail_url || "",
    });
    setEditId(c.id);
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.title.trim()) {
      toast.error(t.admin.crs.enterName);
      return;
    }
    setSaving(true);
    const slug = slugify(form.title, { lower: true, strict: true });
    const payload = {
      title: form.title,
      slug,
      description: form.description,
      category: form.category,
      difficulty: form.difficulty,
      is_free: form.is_free,
      price_coins: form.is_free ? 0 : form.price_coins,
      coin_reward: form.coin_reward,
      estimated_hours: form.estimated_hours,
      thumbnail_url: form.thumbnail_url || null,
      tags: form.tags
        ? form.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
    };

    if (editId) {
      const { error } = await supabase
        .from("courses")
        .update(payload)
        .eq("id", editId);
      if (error) {
        toast.error(t.admin.common.error + ": " + error.message);
        setSaving(false);
        return;
      }
      toast.success(t.admin.crs.updated);
    } else {
      const { error } = await supabase
        .from("courses")
        .insert({
          ...payload,
          is_published: false,
          order_index: courses.length,
        });
      if (error) {
        toast.error(t.admin.common.error + ": " + error.message);
        setSaving(false);
        return;
      }
      toast.success(t.admin.crs.created);
    }
    setShowForm(false);
    setSaving(false);
    loadCourses();
    // Bosh sahifa/katalog cache'ini darhol tozalash
    fetch("/api/revalidate", { method: "POST" }).catch(() => {});
  }

  async function togglePublish(c: Course) {
    await supabase
      .from("courses")
      .update({ is_published: !c.is_published })
      .eq("id", c.id);
    toast.success(c.is_published ? t.admin.crs.hiddenToast : t.admin.crs.publishedToast);
    loadCourses();
    fetch("/api/revalidate", { method: "POST" }).catch(() => {});
  }

  async function handleDelete(c: Course) {
    if (!confirm(`"${c.title}" kursini o'chirishni tasdiqlaysizmi?`)) return;
    await supabase.from("courses").delete().eq("id", c.id);
    toast.success(t.admin.crs.deleted);
    loadCourses();
    fetch("/api/revalidate", { method: "POST" }).catch(() => {});
  }

  const filtered = courses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display font-bold text-3xl">
            {t.admin.crs.pageTitle}
          </h1>
          <p className="text-muted-foreground text-sm">
            {courses.length} ta kurs
          </p>
        </motion.div>
        <button
          onClick={openNew}
          className="btn-primary py-2.5 px-5 flex items-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" /> {t.admin.common.newCourse}
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t.admin.crs.searchPh}
          className="input-field pl-11"
        />
      </div>

      {/* Course Form Modal */}
      {showForm && (
        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-semibold text-lg">
              {editId ? t.admin.crs.editTitle : t.admin.common.newCourse}
            </h2>
            <button
              onClick={() => setShowForm(false)}
              className="p-1.5 hover:bg-accent rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">
                {t.admin.crs.nameLabel} *
              </label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="input-field"
                placeholder="Python dasturlash asoslari"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Kategoriya
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="input-field"
              >
                <option value="programming">{t.admin.crs.catProgramming}</option>
                <option value="python">Python</option>
                <option value="frontend">{t.admin.crs.catFrontend}</option>
                <option value="computer_literacy">
                  Kompyuter savodxonligi
                </option>
                <option value="prompt_engineering">{t.admin.crs.catPrompt}</option>
                <option value="algorithms">{t.admin.crs.catAlgorithms}</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium mb-1 block">{t.admin.common.description}</label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="input-field min-h-[80px]"
                placeholder={t.admin.crs.descPh}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Qiyinlik darajasi
              </label>
              <select
                value={form.difficulty}
                onChange={(e) =>
                  setForm({ ...form, difficulty: e.target.value as any })
                }
                className="input-field"
              >
                <option value="beginner">{t.difficulty.beginner}</option>
                <option value="intermediate">{t.difficulty.intermediate}</option>
                <option value="advanced">{t.difficulty.advanced}</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Taxminiy soat
              </label>
              <input
                type="number"
                value={form.estimated_hours}
                onChange={(e) =>
                  setForm({ ...form, estimated_hours: +e.target.value })
                }
                className="input-field"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">{t.admin.common.isFree}</label>
              <div className="flex items-center gap-3 mt-2">
                <button
                  onClick={() => setForm({ ...form, is_free: true })}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium",
                    form.is_free
                      ? "bg-neon-green/10 text-neon-green border border-neon-green/20"
                      : "bg-surface text-muted-foreground",
                  )}
                >
                  Bepul
                </button>
                <button
                  onClick={() => setForm({ ...form, is_free: false })}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium",
                    !form.is_free
                      ? "bg-neon-yellow/10 text-neon-yellow border border-neon-yellow/20"
                      : "bg-surface text-muted-foreground",
                  )}
                >
                  Pullik
                </button>
              </div>
            </div>
            {!form.is_free && (
              <div>
                <label className="text-sm font-medium mb-1 block">
                  {t.admin.crs.priceCoins}
                </label>
                <input
                  type="number"
                  value={form.price_coins}
                  onChange={(e) =>
                    setForm({ ...form, price_coins: +e.target.value })
                  }
                  className="input-field"
                />
              </div>
            )}
            <div>
              <label className="text-sm font-medium mb-1 block">
                {t.admin.crs.rewardOnFinish}
              </label>
              <input
                type="number"
                value={form.coin_reward}
                onChange={(e) =>
                  setForm({ ...form, coin_reward: +e.target.value })
                }
                className="input-field"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                {t.admin.common.tags}
              </label>
              <input
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                className="input-field"
                placeholder="python, boshlang'ich"
              />
            </div>

            {/* Kurs rasmi (cover) */}
            <div className="md:col-span-2">
              <label className="text-sm font-medium mb-1 block">
                {t.admin.crs.coverHint}
              </label>
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                {/* Preview */}
                <div className="relative w-full sm:w-64 h-36 rounded-[10px] border border-border/60 bg-surface/40 overflow-hidden flex items-center justify-center flex-shrink-0">
                  {form.thumbnail_url ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={form.thumbnail_url} alt={t.admin.crs.coverLabel} className="w-full h-full object-cover" />
                      <button
                        onClick={() => setForm({ ...form, thumbnail_url: "" })}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white hover:bg-neon-red/80 transition-colors"
                        title="Rasmni olib tashlash"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <ImagePlus className="w-8 h-8 mx-auto mb-1 opacity-40" />
                      <p className="text-[11px]">{t.admin.common.noImage}</p>
                    </div>
                  )}
                </div>

                {/* Upload + URL */}
                <div className="flex-1 space-y-2 w-full">
                  <label className={cn(
                    "flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed cursor-pointer transition-all text-sm font-medium",
                    uploading
                      ? "border-neon-blue/40 bg-neon-blue/5 text-neon-blue"
                      : "border-border hover:border-neon-purple/40 hover:bg-neon-purple/5 text-muted-foreground hover:text-foreground",
                  )}>
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    {uploading ? "Yuklanmoqda..." : t.admin.crs.pickFromPc}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      className="hidden"
                      disabled={uploading}
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleThumbnailUpload(f);
                        e.target.value = "";
                      }}
                    />
                  </label>
                  <input
                    value={form.thumbnail_url}
                    onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })}
                    className="input-field text-xs font-mono"
                    placeholder={t.admin.crs.orExternalUrl}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setShowForm(false)}
              className="btn-ghost py-2 px-5 text-sm"
            >
              Bekor
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary py-2 px-5 text-sm flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {editId ? t.admin.common.save : "Yaratish"}
            </button>
          </div>
        </motion.div>
      )}

      {/* Courses Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50 text-xs text-muted-foreground font-semibold">
                <th className="text-left px-5 py-3">{t.admin.common.course}</th>
                <th className="text-left px-5 py-3">{t.admin.common.category}</th>
                <th className="text-center px-5 py-3">{t.admin.common.level}</th>
                <th className="text-center px-5 py-3">{t.admin.common.price}</th>
                <th className="text-center px-5 py-3">{t.admin.common.topics}</th>
                <th className="text-center px-5 py-3">{t.admin.common.students}</th>
                <th className="text-center px-5 py-3">{t.admin.common.status}</th>
                <th className="text-right px-5 py-3">{t.admin.common.actions}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Yuklanmoqda...
                  </td>
                </tr>
              ) : (
                filtered.map((c) => {
                  const diff = getDifficultyConfig(c.difficulty || "beginner");
                  return (
                    <tr
                      key={c.id}
                      className="border-b border-border/30 last:border-0 hover:bg-surface/30 transition-colors"
                    >
                      <td className="px-5 py-3">
                        <p className="font-medium text-sm">{c.title}</p>
                        <p className="text-[10px] text-muted-foreground font-mono">
                          /{c.slug}
                        </p>
                      </td>
                      <td className="px-5 py-3 text-sm text-muted-foreground">
                        {c.category}
                      </td>
                      <td className="px-5 py-3 text-center">
                        <span className={diff.class}>{diff.label}</span>
                      </td>
                      <td className="px-5 py-3 text-center">
                        {c.is_free ? (
                          <span className="text-xs text-neon-green">{t.courses.free}</span>
                        ) : (
                          <span className="coin-badge text-[10px]">
                            <Coins className="w-3 h-3" />
                            {c.price_coins}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-center text-sm">
                        {c.total_topics}
                      </td>
                      <td className="px-5 py-3 text-center text-sm">
                        {c.total_enrolled}
                      </td>
                      <td className="px-5 py-3 text-center">
                        <span
                          className={cn(
                            "text-xs font-medium px-2 py-0.5 rounded-full",
                            c.is_published
                              ? "bg-neon-green/10 text-neon-green"
                              : "bg-surface text-muted-foreground",
                          )}
                        >
                          {c.is_published ? "Nashr" : "Qoralama"}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/a-courses/${c.id}/topics`}
                            className="p-1.5 hover:bg-accent rounded-lg text-muted-foreground hover:text-foreground"
                            title={t.admin.common.topics}
                          >
                            <BookOpen className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => openEdit(c)}
                            className="p-1.5 hover:bg-accent rounded-lg text-muted-foreground hover:text-foreground"
                            title={t.common.edit}
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => togglePublish(c)}
                            className="p-1.5 hover:bg-accent rounded-lg text-muted-foreground hover:text-foreground"
                            title={
                              c.is_published ? "Yashirish" : t.admin.crs.publish
                            }
                          >
                            {c.is_published ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDelete(c)}
                            className="p-1.5 hover:bg-neon-red/10 rounded-lg text-muted-foreground hover:text-neon-red"
                            title={t.common.delete}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
