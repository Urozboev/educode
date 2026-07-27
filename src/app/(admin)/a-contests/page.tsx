"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Contest, Challenge } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import slugify from "slugify";
import { cn, getDifficultyConfig } from "@/lib/utils";
import { contestStatus, STATUS_LABEL, contestDuration, formatDateTime } from "@/lib/contests";
import {
  Plus, Pencil, Trash2, Save, X, Loader2, Eye, EyeOff, Trophy,
  Search, GripVertical, ExternalLink, Users,
} from "lucide-react";

/** `datetime-local` input uchun: ISO → "YYYY-MM-DDTHH:mm" (mahalliy vaqtda) */
function toLocalInput(iso: string): string {
  const d = new Date(iso);
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 16);
}

/** Sukut bo'yicha: ertaga soat 10:00 dan 3 soat */
function defaultTimes() {
  const start = new Date();
  start.setDate(start.getDate() + 1);
  start.setHours(10, 0, 0, 0);
  const end = new Date(start.getTime() + 3 * 3600_000);
  return { starts_at: toLocalInput(start.toISOString()), ends_at: toLocalInput(end.toISOString()) };
}

const emptyForm = () => ({
  title: "", description: "", rules_html: "",
  penalty_minutes: 20, freeze_minutes: 0,
  ...defaultTimes(),
});

export default function AdminContestsPage() {
  const supabase = createClient();
  const [contests, setContests] = useState<Contest[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [picked, setPicked] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  async function load() {
    const { data: { user } } = await supabase.auth.getUser();
    setUserId(user?.id ?? null);

    const [{ data: cs }, { data: chs }, { data: parts }] = await Promise.all([
      supabase.from("contests").select("*").order("starts_at", { ascending: false }),
      supabase.from("challenges").select("*").eq("is_published", true).order("title"),
      supabase.from("contest_participants").select("contest_id"),
    ]);

    if (cs) setContests(cs as Contest[]);
    if (chs) setChallenges(chs as Challenge[]);
    if (parts) {
      const m: Record<string, number> = {};
      (parts as { contest_id: string }[]).forEach(p => { m[p.contest_id] = (m[p.contest_id] || 0) + 1; });
      setCounts(m);
    }
    setLoading(false);
  }

  const filteredChallenges = useMemo(
    () => challenges.filter(c => c.title.toLowerCase().includes(search.toLowerCase())),
    [challenges, search]
  );

  function openNew() {
    setForm(emptyForm());
    setPicked([]);
    setEditId(null);
    setShowForm(true);
  }

  async function openEdit(c: Contest) {
    setForm({
      title: c.title,
      description: c.description || "",
      rules_html: c.rules_html || "",
      penalty_minutes: c.penalty_minutes,
      freeze_minutes: c.freeze_minutes,
      starts_at: toLocalInput(c.starts_at),
      ends_at: toLocalInput(c.ends_at),
    });
    const { data } = await supabase
      .from("contest_problems")
      .select("challenge_id, order_index")
      .eq("contest_id", c.id)
      .order("order_index");
    setPicked((data as { challenge_id: string }[] | null)?.map(x => x.challenge_id) || []);
    setEditId(c.id);
    setShowForm(true);
  }

  function toggle(id: string) {
    setPicked(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  }

  async function save(publish?: boolean) {
    if (!form.title.trim()) { toast.error("Nom kiriting"); return; }
    if (!userId) { toast.error("Sessiya topilmadi"); return; }

    const startsAt = new Date(form.starts_at);
    const endsAt = new Date(form.ends_at);
    if (!(endsAt > startsAt)) { toast.error("Tugash vaqti boshlanishdan keyin bo'lishi kerak"); return; }
    if (picked.length === 0) { toast.error("Kamida bitta masala tanlang"); return; }

    setSaving(true);
    const payload = {
      title: form.title.trim(),
      slug: slugify(form.title, { lower: true, strict: true }),
      description: form.description.trim() || null,
      rules_html: form.rules_html.trim() || null,
      starts_at: startsAt.toISOString(),
      ends_at: endsAt.toISOString(),
      penalty_minutes: form.penalty_minutes,
      freeze_minutes: form.freeze_minutes,
      ...(editId ? {} : { author_id: userId }),
      ...(publish !== undefined ? { is_published: publish } : {}),
    };

    let contestId = editId;
    if (editId) {
      const { error } = await supabase.from("contests").update(payload).eq("id", editId);
      if (error) { setSaving(false); toast.error(error.message); return; }
    } else {
      const { data, error } = await supabase.from("contests").insert(payload).select("id").single();
      if (error || !data) { setSaving(false); toast.error(error?.message || "Xatolik"); return; }
      contestId = data.id;
    }

    // Masalalarni qaytadan yozamiz — tartib va harflar o'zgargan bo'lishi mumkin
    await supabase.from("contest_problems").delete().eq("contest_id", contestId!);
    const rows = picked.map((challenge_id, i) => ({
      contest_id: contestId!,
      challenge_id,
      letter: String.fromCharCode(65 + i),
      order_index: i,
    }));
    const { error: pErr } = await supabase.from("contest_problems").insert(rows);

    setSaving(false);
    if (pErr) { toast.error(`Masalalar saqlanmadi: ${pErr.message}`); return; }
    toast.success(editId ? "Saqlandi" : "Yaratildi");
    setShowForm(false);
    load();
  }

  async function togglePublish(c: Contest) {
    await supabase.from("contests").update({ is_published: !c.is_published }).eq("id", c.id);
    load();
  }

  async function del(c: Contest) {
    if (!confirm(`"${c.title}" o'chirilsinmi? Ishtirokchilar ro'yxati ham o'chadi.`)) return;
    await supabase.from("contests").delete().eq("id", c.id);
    toast.success("O'chirildi");
    load();
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl flex items-center gap-2">
            <Trophy className="w-6 h-6 text-neon-purple" /> Olimpiadalar
          </h1>
          <p className="text-sm text-muted-foreground">{contests.length} ta musobaqa</p>
        </div>
        <button onClick={openNew} className="btn-primary py-2.5 px-5 flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Yangi olimpiada
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            className="glass-card p-6 space-y-5"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display font-semibold">{editId ? "Tahrirlash" : "Yangi olimpiada"}</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 hover:bg-accent rounded-lg"><X className="w-5 h-5" /></button>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Nom *</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                className="input-field" placeholder="Bahorgi dasturlash olimpiadasi" />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Tavsif</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                className="input-field resize-none" rows={2} placeholder="Kimlar uchun, qanday mavzular" maxLength={400} />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Boshlanish *</label>
                <input type="datetime-local" value={form.starts_at}
                  onChange={e => setForm({ ...form, starts_at: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Tugash *</label>
                <input type="datetime-local" value={form.ends_at}
                  onChange={e => setForm({ ...form, ends_at: e.target.value })} className="input-field" />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Jarima (daqiqa)</label>
                <input type="number" min={0} value={form.penalty_minutes}
                  onChange={e => setForm({ ...form, penalty_minutes: +e.target.value })} className="input-field" />
                <p className="text-xs text-muted-foreground mt-1">Har noto&apos;g&apos;ri urinish uchun</p>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Muzlatish (daqiqa)</label>
                <input type="number" min={0} value={form.freeze_minutes}
                  onChange={e => setForm({ ...form, freeze_minutes: +e.target.value })} className="input-field" />
                <p className="text-xs text-muted-foreground mt-1">Oxirgi N daqiqada reyting yashiriladi. 0 — muzlatilmaydi</p>
              </div>
            </div>

            {/* Masalalar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">
                  Masalalar <span className="numeric text-muted-foreground">({picked.length})</span>
                </label>
                {picked.length > 0 && (
                  <button onClick={() => setPicked([])} className="text-xs text-muted-foreground hover:text-neon-red">
                    Tozalash
                  </button>
                )}
              </div>

              {picked.length > 0 && (
                <div className="space-y-1.5 mb-3">
                  {picked.map((id, i) => {
                    const ch = challenges.find(c => c.id === id);
                    if (!ch) return null;
                    return (
                      <div key={id} className="flex items-center gap-3 p-2.5 rounded-lg bg-surface border border-border">
                        <GripVertical className="w-4 h-4 text-muted-foreground/40 flex-shrink-0" />
                        <span className="w-7 h-7 rounded-lg bg-neon-purple/10 text-neon-purple font-display font-bold text-sm flex items-center justify-center flex-shrink-0">
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span className="flex-1 min-w-0 truncate text-sm">{ch.title}</span>
                        <button onClick={() => toggle(id)} className="p-1.5 rounded hover:bg-neon-red/10 text-muted-foreground hover:text-neon-red">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                  <p className="text-xs text-muted-foreground pt-1">
                    Harflar tanlash tartibida beriladi
                  </p>
                </div>
              )}

              <div className="relative mb-2">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  className="input-field pl-10 text-sm" placeholder="Topshiriq qidirish..." />
              </div>

              <div className="max-h-56 overflow-y-auto space-y-1 rounded-lg border border-border p-2">
                {filteredChallenges.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    {challenges.length === 0 ? "Nashr qilingan topshiriq yo'q" : "Natija topilmadi"}
                  </p>
                ) : filteredChallenges.map(ch => {
                  const on = picked.includes(ch.id);
                  const diff = getDifficultyConfig(ch.difficulty);
                  return (
                    <button
                      key={ch.id}
                      onClick={() => toggle(ch.id)}
                      className={cn(
                        "w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-colors",
                        on ? "bg-neon-purple/[0.10] text-neon-purple" : "hover:bg-surface"
                      )}
                    >
                      <span className={cn(
                        "w-4 h-4 rounded border flex items-center justify-center flex-shrink-0",
                        on ? "bg-neon-purple border-neon-purple" : "border-border"
                      )}>
                        {on && <span className="w-1.5 h-1.5 rounded-sm bg-white" />}
                      </span>
                      <span className="flex-1 min-w-0 truncate text-sm">{ch.title}</span>
                      <span className={cn("text-[11px] flex-shrink-0", diff.class)}>{diff.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={() => setShowForm(false)} className="btn-ghost py-2 px-5 text-sm">Bekor</button>
              <button onClick={() => save(false)} disabled={saving}
                className="btn-ghost py-2 px-5 text-sm border border-border flex items-center gap-2 disabled:opacity-50">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Qoralama
              </button>
              <button onClick={() => save(true)} disabled={saving}
                className="btn-primary py-2 px-5 text-sm flex items-center gap-2 disabled:opacity-50">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />} E&apos;lon qilish
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-2">
        {loading ? [1, 2].map(i => <div key={i} className="glass-card h-20 animate-pulse" />) :
        contests.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="mb-4">Hali olimpiada yaratilmagan</p>
            <button onClick={openNew} className="btn-primary text-sm py-2 px-5">
              <Plus className="w-4 h-4 inline mr-1" /> Birinchi olimpiada
            </button>
          </div>
        ) : contests.map(c => {
          const status = contestStatus(c.starts_at, c.ends_at);
          return (
            <div key={c.id} className="glass-card p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{c.title}</p>
                <div className="flex flex-wrap items-center gap-x-2 text-[11px] text-muted-foreground mt-0.5">
                  <span className={cn(
                    status === "running" ? "text-neon-green" : status === "upcoming" ? "text-neon-blue" : ""
                  )}>
                    {STATUS_LABEL[status]}
                  </span>
                  <span>· {formatDateTime(c.starts_at)}</span>
                  <span>· {contestDuration(c.starts_at, c.ends_at)}</span>
                  <span className="inline-flex items-center gap-1">· <Users className="w-3 h-3" />{counts[c.id] || 0}</span>
                  {c.is_published
                    ? <span className="text-neon-green">· E&apos;lon qilingan</span>
                    : <span className="text-neon-yellow">· Qoralama</span>}
                </div>
              </div>
              {c.is_published && (
                <Link href={`/explore/contests/${c.slug}`} target="_blank"
                  className="p-2 hover:bg-accent rounded-lg text-muted-foreground hover:text-foreground" title="Ochish">
                  <ExternalLink className="w-4 h-4" />
                </Link>
              )}
              <button onClick={() => togglePublish(c)} className="p-2 hover:bg-accent rounded-lg text-muted-foreground"
                title={c.is_published ? "Yashirish" : "E'lon qilish"}>
                {c.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button onClick={() => openEdit(c)} className="p-2 hover:bg-accent rounded-lg text-muted-foreground hover:text-foreground">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => del(c)} className="p-2 hover:bg-neon-red/10 rounded-lg text-muted-foreground hover:text-neon-red">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
