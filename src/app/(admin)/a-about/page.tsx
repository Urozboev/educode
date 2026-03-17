"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Save, Loader2, User, FileText } from "lucide-react";

const fields = [
  { key: "author_name", label: "Muallif ismi", type: "text" },
  { key: "author_title", label: "Lavozim / Unvon", type: "text" },
  { key: "author_bio", label: "Biografiya", type: "textarea" },
  { key: "author_image", label: "Rasm URL", type: "text" },
  { key: "project_title", label: "Loyiha nomi", type: "text" },
  { key: "project_description", label: "Loyiha tavsifi", type: "textarea" },
  { key: "project_goals", label: "Maqsadlar", type: "textarea" },
];

export default function AdminAboutPage() {
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
    for (const field of fields) {
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
        <h1 className="font-display font-bold text-3xl">Platforma haqida</h1>
        <p className="text-muted-foreground text-sm">Bosh sahifada va /explore/about da ko'rinadigan ma'lumotlar</p>
      </motion.div>

      <div className="space-y-4">
        {fields.map(f => (
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
