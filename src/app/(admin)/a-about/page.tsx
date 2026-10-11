"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Save, Loader2, User, Upload, X } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import type { Dictionary } from "@/lib/i18n/dictionaries/uz";

const fields = (t: Dictionary) => [
  { key: "author_name", label: t.admin.abt.authorName, type: "text" },
  { key: "author_title", label: t.admin.abt.authorTitle, type: "text" },
  { key: "author_bio", label: t.admin.abt.bio, type: "textarea" },
  { key: "author_image", label: t.admin.abt.imageUrl, type: "text" },
  { key: "project_title", label: t.admin.abt.projectTitle, type: "text" },
  { key: "project_description", label: t.admin.abt.projectDesc, type: "textarea" },
  { key: "project_goals", label: t.admin.abt.goals, type: "textarea" },
];

const BUCKET = "course-thumbnails";
const MAX_HAJM = 2 * 1024 * 1024; // bucket chegarasi (11-migratsiya)
const TURLAR = ["image/jpeg", "image/png", "image/webp"];

/**
 * Manzil boshqa odamlarda ham ochiladimi?
 *
 * `blob:` va `data:` manzillar faqat ular yaratilgan brauzer oynasida
 * yashaydi. Masalan, my.gov.uz dan rasmni "manzilini nusxalash" bilan
 * olinsa `blob:https://my.gov.uz/...` chiqadi — saqlansa ham, saytga
 * kirgan hech kim rasmni ko'rmaydi.
 */
function rasmManziliTogri(url: string): boolean {
  if (!url) return true;
  return /^https?:\/\//i.test(url) || url.startsWith("/");
}

export default function AdminAboutPage() {
  const { t } = useI18n();
  const supabase = createClient();
  const [data, setData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function rasmYukla(file: File) {
    if (!TURLAR.includes(file.type)) {
      toast.error(t.admin.abt.imageType);
      return;
    }
    if (file.size > MAX_HAJM) {
      toast.error(t.admin.abt.imageTooBig);
      return;
    }
    setUploading(true);
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    // Har safar yangi nom — brauzer va CDN eski rasmni keshdan ko'rsatmasligi uchun
    const path = `about/muallif-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, { cacheControl: "31536000" });
    if (error) {
      toast.error(error.message);
      setUploading(false);
      return;
    }
    const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
    setData((d) => ({ ...d, author_image: pub.publicUrl }));
    setUploading(false);
    toast.success(t.admin.abt.imageUploaded);
  }

  useEffect(() => {
    (async () => {
      const { data: rows } = await supabase.from("about_page").select("key, value");
      if (rows) {
        const map: Record<string, string> = {};
        rows.forEach(r => { map[r.key] = r.value; });
        setData(map);
      }
      setLoading(false);
    })();
  }, []);

  async function handleSave() {
    if (!rasmManziliTogri(data.author_image || "")) {
      toast.error(t.admin.abt.imageBadUrl);
      return;
    }
    setSaving(true);
    // Hamma maydon bitta so'rovda — biri yozilmay qolsa, xato ko'rinadi.
    // .select() qaytgan qatorlarni sanash uchun: RLS yozuvni rad etsa,
    // PostgREST xato bermaydi, shunchaki 0 qator qaytaradi.
    const now = new Date().toISOString();
    const rows = fields(t).map((f) => ({ key: f.key, value: data[f.key] || "", updated_at: now }));
    const { data: saved, error } = await supabase
      .from("about_page")
      .upsert(rows, { onConflict: "key" })
      .select("key");
    setSaving(false);
    if (error || !saved || saved.length !== rows.length) {
      toast.error(error?.message || t.admin.usr.updateFailed);
      return;
    }
    toast.success(t.admin.common.saved);
  }

  if (loading) return <div className="glass-card p-8 h-64 animate-pulse" />;

  return (
    <div className="space-y-6 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display font-bold text-3xl">{t.admin.abt.title}</h1>
        <p className="text-muted-foreground text-sm">{t.admin.abt.subtitle}</p>
      </motion.div>

      <div className="space-y-4">
        {fields(t).map(f => (
          <div key={f.key} className="glass-card p-5">
            <label className="text-sm font-medium mb-2 block">{f.label}</label>
            {f.key === "author_image" ? (
              <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                <div className="w-24 h-24 rounded-2xl bg-hero-gradient flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {data.author_image && rasmManziliTogri(data.author_image) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={data.author_image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-10 h-10 text-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
                      className="btn-primary py-2 px-4 text-sm inline-flex items-center gap-2 disabled:opacity-50">
                      {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      {t.admin.abt.uploadImage}
                    </button>
                    {data.author_image && (
                      <button type="button" onClick={() => setData({ ...data, author_image: "" })}
                        className="btn-ghost py-2 px-4 text-sm inline-flex items-center gap-2">
                        <X className="w-4 h-4" /> {t.admin.abt.removeImage}
                      </button>
                    )}
                  </div>
                  <input ref={fileRef} type="file" accept={TURLAR.join(",")} className="hidden"
                    onChange={e => { const file = e.target.files?.[0]; if (file) rasmYukla(file); e.target.value = ""; }} />
                  <input value={data.author_image || ""} onChange={e => setData({ ...data, author_image: e.target.value })}
                    className="input-field text-xs" placeholder={t.admin.abt.imageUrlHint} />
                  {data.author_image && !rasmManziliTogri(data.author_image) && (
                    <p className="text-xs text-neon-red">{t.admin.abt.imageBadUrl}</p>
                  )}
                </div>
              </div>
            ) : f.type === "textarea" ? (
              <textarea value={data[f.key] || ""} onChange={e => setData({ ...data, [f.key]: e.target.value })}
                className="input-field min-h-[80px]" />
            ) : (
              <input value={data[f.key] || ""} onChange={e => setData({ ...data, [f.key]: e.target.value })}
                className="input-field" />
            )}
          </div>
        ))}
      </div>

      <button onClick={handleSave} disabled={saving} className="btn-primary py-3 px-8 flex items-center gap-2 disabled:opacity-50">
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Saqlash
      </button>
    </div>
  );
}
