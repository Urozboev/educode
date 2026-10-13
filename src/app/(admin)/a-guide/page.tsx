"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Save, Loader2, CheckCircle2, AlertCircle, ArrowUpRight } from "lucide-react";
import Link from "@/components/i18n/Link";
import { createClient } from "@/lib/supabase/client";
import { useI18n } from "@/lib/i18n";
import {
  GUIDE_SECTIONS, GUIDE_ROLES, GUIDE_SETTINGS_KEY, toEmbed,
  type GuideVideoKey, type GuideVideos,
} from "@/lib/guide";

/**
 * Yo'riqnoma videolari — har bir bo'lim uchun bitta havola.
 * Saqlanadi: platform_settings.guide_videos (JSON). Bosh sahifadagi
 * blok va /explore/guide sahifasi shu yerdan o'qiydi.
 */
export default function AdminGuidePage() {
  const { t } = useI18n();
  const a = t.admin;
  const supabase = createClient();
  const [videos, setVideos] = useState<GuideVideos>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("platform_settings").select("value").eq("key", GUIDE_SETTINGS_KEY).maybeSingle();
      if (data?.value && typeof data.value === "object") setVideos(data.value as GuideVideos);
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const groups: { title: string; items: { key: GuideVideoKey; label: string }[] }[] = [
    { title: a.gvOverview, items: [{ key: "overview", label: a.gvOverview }] },
    { title: a.gvSections, items: GUIDE_SECTIONS.map((s) => ({ key: s.id as GuideVideoKey, label: s.title })) },
    { title: a.gvRoles, items: GUIDE_ROLES.map((r) => ({ key: r.id, label: r.title })) },
  ];

  const xato = (url?: string) => !!url?.trim() && !toEmbed(url);

  async function save() {
    if (Object.values(videos).some((u) => xato(u))) {
      toast.error(a.gvInvalid);
      return;
    }
    setSaving(true);
    // Bo'sh qatorlar saqlanmaydi — JSON toza turadi
    const toza = Object.fromEntries(Object.entries(videos).filter(([, v]) => v && v.trim()).map(([k, v]) => [k, v!.trim()]));
    const { data, error } = await supabase
      .from("platform_settings")
      .upsert({ key: GUIDE_SETTINGS_KEY, value: toza, description: "Yo'riqnoma videolari", updated_at: new Date().toISOString() })
      .select("key");
    setSaving(false);
    if (error || !data?.length) {
      toast.error(error?.message || t.admin.usr.updateFailed);
      return;
    }
    toast.success(a.gvSaved);
  }

  if (loading) return <div className="glass-card p-8 h-64 animate-pulse" />;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display font-bold text-3xl">{a.guideVideos}</h1>
          <p className="text-muted-foreground text-sm mt-1 max-w-xl">{a.gvSubtitle}</p>
        </div>
        <Link href="/explore/guide" className="inline-flex items-center gap-1.5 text-sm font-semibold text-neon-purple hover:underline">
          {a.gvOpenGuide} <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      {groups.map((g) => (
        <div key={g.title} className="glass-card p-5 space-y-4">
          {g.items.length > 1 && <h2 className="font-display font-semibold text-lg">{g.title}</h2>}
          {g.items.map((it) => {
            const v = videos[it.key] || "";
            const ok = !!v.trim() && !!toEmbed(v);
            return (
              <label key={it.key} className="block">
                <span className="text-sm font-medium flex items-center gap-1.5 mb-1.5">
                  {it.label}
                  {ok && <CheckCircle2 className="w-3.5 h-3.5 text-neon-green" />}
                  {xato(v) && <AlertCircle className="w-3.5 h-3.5 text-neon-red" />}
                </span>
                <input
                  value={v}
                  onChange={(e) => setVideos({ ...videos, [it.key]: e.target.value })}
                  placeholder="https://youtu.be/..."
                  className="input-field text-sm"
                />
                {xato(v) && <span className="text-xs text-neon-red mt-1 block">{a.gvInvalid}</span>}
              </label>
            );
          })}
        </div>
      ))}

      <p className="text-xs text-muted-foreground">{a.gvScripts}</p>

      <button onClick={save} disabled={saving} className="btn-primary py-3 px-8 flex items-center gap-2 disabled:opacity-50">
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} {t.common.save}
      </button>
    </div>
  );
}
