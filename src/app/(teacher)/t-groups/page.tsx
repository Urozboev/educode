"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { cn, getInitials, formatDate } from "@/lib/utils";
import {
  Users, Plus, Copy, Check, Trash2, X, Loader2, UserMinus,
  Lock, Unlock, School, Info,
} from "lucide-react";

type Group = {
  id: string;
  name: string;
  description: string | null;
  join_code: string | null;
  is_open: boolean;
  created_at: string;
};

type Student = {
  student_id: string;
  group_id: string | null;
  assigned_at: string;
  full_name: string;
  avatar_url: string | null;
  level: string;
  xp: number;
};

export default function TeacherGroupsPage() {
  const supabase = createClient();
  const [groups, setGroups] = useState<Group[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    const [{ data: g }, { data: ts }] = await Promise.all([
      supabase.from("teacher_groups").select("*").eq("teacher_id", user.id).order("created_at"),
      supabase.from("teacher_students").select("student_id, group_id, assigned_at").eq("teacher_id", user.id),
    ]);

    if (g) setGroups(g as Group[]);

    if (ts && ts.length) {
      const ids = (ts as any[]).map(x => x.student_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url, level, xp")
        .in("id", ids);

      const byId = new Map((profiles || []).map((p: any) => [p.id, p]));
      setStudents((ts as any[]).map(t => ({
        student_id: t.student_id,
        group_id: t.group_id,
        assigned_at: t.assigned_at,
        full_name: byId.get(t.student_id)?.full_name || "Noma'lum",
        avatar_url: byId.get(t.student_id)?.avatar_url || null,
        level: byId.get(t.student_id)?.level || "beginner",
        xp: byId.get(t.student_id)?.xp || 0,
      })));
    } else {
      setStudents([]);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => { load(); }, [load]);

  async function createGroup() {
    if (!name.trim()) { toast.error("Guruh nomini kiriting"); return; }
    setCreating(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setCreating(false); return; }

    const { error } = await supabase.from("teacher_groups").insert({
      teacher_id: user.id,
      name: name.trim(),
      description: description.trim() || null,
    });

    setCreating(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Guruh yaratildi");
    setName(""); setDescription(""); setShowForm(false);
    load();
  }

  async function toggleOpen(g: Group) {
    await supabase.from("teacher_groups").update({ is_open: !g.is_open }).eq("id", g.id);
    load();
  }

  async function delGroup(g: Group) {
    if (!confirm(`"${g.name}" guruhi o'chirilsinmi? O'quvchilar bog'lanishi ham uziladi.`)) return;
    await supabase.from("teacher_groups").delete().eq("id", g.id);
    toast.success("O'chirildi");
    load();
  }

  async function removeStudent(s: Student) {
    if (!confirm(`${s.full_name} ro'yxatdan chiqarilsinmi?`)) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("teacher_students").delete()
      .eq("teacher_id", user.id).eq("student_id", s.student_id);
    toast.success("Chiqarildi");
    load();
  }

  function copyCode(code: string) {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  }

  const ungrouped = students.filter(s => !s.group_id);

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl flex items-center gap-2">
            <School className="w-6 h-6 text-neon-purple" /> Guruhlar
          </h1>
          <p className="text-sm text-muted-foreground">
            <span className="numeric">{groups.length}</span> guruh ·{" "}
            <span className="numeric">{students.length}</span> o&apos;quvchi
          </p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary py-2.5 px-5 flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Yangi guruh
        </button>
      </div>

      {/* Qanday ishlashi */}
      <div className="flex items-start gap-2.5 p-4 rounded-xl bg-neon-blue/[0.06] border border-neon-blue/20 text-sm">
        <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-neon-blue" />
        <span className="leading-relaxed text-muted-foreground">
          Guruh yaratganingizda unga <b className="text-foreground">kod</b> beriladi.
          O&apos;quvchilarga kodni ayting — ular <code className="px-1.5 py-0.5 rounded bg-surface border border-border text-xs">/join</code>{" "}
          sahifasida kiritib guruhga qo&apos;shiladi. Shundan keyin natijalari
          sizning jurnalingizda ko&apos;rinadi.
        </span>
      </div>

      {/* Yaratish formasi */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="glass-card p-6 space-y-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display font-semibold">Yangi guruh</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 hover:bg-accent rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Nomi *</label>
              <input value={name} onChange={e => setName(e.target.value)} className="input-field" placeholder="9-A sinf" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Izoh</label>
              <input value={description} onChange={e => setDescription(e.target.value)} className="input-field" placeholder="Informatika, 2026-yil" />
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowForm(false)} className="btn-ghost py-2 px-5 text-sm">Bekor</button>
              <button onClick={createGroup} disabled={creating} className="btn-primary py-2 px-5 text-sm flex items-center gap-2 disabled:opacity-50">
                {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Yaratish
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Guruhlar */}
      {loading ? (
        <div className="space-y-3">{[1, 2].map(i => <div key={i} className="glass-card h-32 animate-pulse" />)}</div>
      ) : groups.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="mb-4">Hali guruh yaratilmagan</p>
          <button onClick={() => setShowForm(true)} className="btn-primary text-sm py-2 px-5">
            <Plus className="w-4 h-4 inline mr-1" /> Birinchi guruh
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {groups.map(g => {
            const members = students.filter(s => s.group_id === g.id);
            return (
              <div key={g.id} className="glass-card p-5">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div className="min-w-0">
                    <h3 className="font-display font-bold text-lg">{g.name}</h3>
                    {g.description && <p className="text-sm text-muted-foreground mt-0.5">{g.description}</p>}
                    <p className="text-[11px] text-muted-foreground mt-1">
                      <span className="numeric">{members.length}</span> o&apos;quvchi · {formatDate(g.created_at)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleOpen(g)}
                      title={g.is_open ? "Qo'shilishni yopish" : "Qo'shilishni ochish"}
                      className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent"
                    >
                      {g.is_open ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => delGroup(g)}
                      className="p-2 rounded-lg text-muted-foreground hover:text-neon-red hover:bg-neon-red/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Kod */}
                <div className={cn(
                  "flex flex-wrap items-center gap-4 p-4 rounded-xl border mb-4",
                  g.is_open ? "bg-neon-purple/[0.06] border-neon-purple/20" : "bg-surface border-border"
                )}>
                  <div>
                    <p className="eyebrow mb-1">Qo&apos;shilish kodi</p>
                    <p className={cn(
                      "font-display font-extrabold text-3xl tracking-[0.2em]",
                      g.is_open ? "text-neon-purple" : "text-muted-foreground line-through"
                    )}>
                      {g.join_code || "—"}
                    </p>
                  </div>
                  {g.join_code && g.is_open && (
                    <button
                      onClick={() => copyCode(g.join_code!)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold border border-border hover:bg-surface transition-colors"
                    >
                      {copied === g.join_code ? <Check className="w-4 h-4 text-neon-green" /> : <Copy className="w-4 h-4" />}
                      {copied === g.join_code ? "Nusxalandi" : "Nusxalash"}
                    </button>
                  )}
                  {!g.is_open && (
                    <span className="text-sm text-muted-foreground">Qo&apos;shilish yopilgan</span>
                  )}
                </div>

                {/* A'zolar */}
                {members.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4 border border-dashed border-border rounded-lg">
                    Hali hech kim qo&apos;shilmagan
                  </p>
                ) : (
                  <div className="space-y-1.5">
                    {members.map(s => (
                      <div key={s.student_id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-surface/60">
                        <span className="w-8 h-8 rounded-lg bg-hero-gradient flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0 overflow-hidden">
                          {s.avatar_url
                            // eslint-disable-next-line @next/next/no-img-element
                            ? <img src={s.avatar_url} alt="" className="w-full h-full object-cover" />
                            : getInitials(s.full_name)}
                        </span>
                        <span className="flex-1 min-w-0 truncate text-sm">{s.full_name}</span>
                        <span className="numeric text-xs text-muted-foreground">{s.xp} XP</span>
                        <button
                          onClick={() => removeStudent(s)}
                          className="p-1.5 rounded text-muted-foreground hover:text-neon-red hover:bg-neon-red/10"
                          title="Chiqarish"
                        >
                          <UserMinus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Guruhsiz o'quvchilar */}
      {ungrouped.length > 0 && (
        <div className="glass-card p-5">
          <h3 className="font-display font-semibold mb-1">Guruhga biriktirilmagan</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Bu o&apos;quvchilar sizga bog&apos;langan, lekin guruhi yo&apos;q
          </p>
          <div className="space-y-1.5">
            {ungrouped.map(s => (
              <div key={s.student_id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-surface/60">
                <span className="w-8 h-8 rounded-lg bg-hero-gradient flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0">
                  {getInitials(s.full_name)}
                </span>
                <span className="flex-1 min-w-0 truncate text-sm">{s.full_name}</span>
                <button
                  onClick={() => removeStudent(s)}
                  className="p-1.5 rounded text-muted-foreground hover:text-neon-red hover:bg-neon-red/10"
                >
                  <UserMinus className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
