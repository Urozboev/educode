"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Save, Loader2, User, FileText } from "lucide-react";
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

export default function AdminAboutPage() {
  const { t } = useI18n();
  const supabase = createClient();
  const [data, setData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
    setSaving(true);
    for (const field of fields(t)) {
      await supabase.from("about_page").upsert(
        { key: field.key, value: data[field.key] || "", updated_at: new Date().toISOString() },
        { onConflict: "key" }
      );
    }
    toast.success("Saqlandi");
    setSaving(false);
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
            {f.type === "textarea" ? (
              <textarea value={data[f.key] || ""} onChange={e => setData({ ...data, [f.key]: e.target.value })}
                className="input-field min-h-[80px]" />
            ) : (
              <input value={data[f.key] || ""} onChange={e => setData({ ...data, [f.key]: e.target.value })}
                className="input-field" placeholder={f.key === "author_image" ? "https://..." : ""} />
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
