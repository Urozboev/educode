"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatDate, cn, formatRelativeDate } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Plus, Trash2, Save, X, Loader2, ClipboardList, Calendar, Users,
  ChevronDown, CheckCircle2, XCircle, Eye
} from "lucide-react";

export default function TeacherAssignmentsPage() {
  const supabase = createClient();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");

  // Forms
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ challenge_id: "", group_id: "", title: "", instructions: "", deadline: "" });
  const [saving, setSaving] = useState(false);

  // Group management
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [groupForm, setGroupForm] = useState({ name: "", description: "" });

  // Assignment detail
  const [expandedAssignment, setExpandedAssignment] = useState<string | null>(null);
  const [assignmentSubmissions, setAssignmentSubmissions] = useState<any[]>([]);

  useEffect(() => { load(); }, []);

  async function load() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setUserId(user.id);

    // Topshiriqlar (biriktirilganlar)
    const { data: a } = await supabase.from("teacher_assignments")
      .select("*, challenge:challenges(title, difficulty, solved_count)")
      .eq("teacher_id", user.id).order("created_at", { ascending: false });
    if (a) setAssignments(a);

    // Barcha challenges
    const { data: c } = await supabase.from("challenges").select("id, title, difficulty").eq("is_published", true).order("title");
    if (c) setChallenges(c);

    // Guruhlar
    const { data: g } = await supabase.from("teacher_groups").select("*").eq("teacher_id", user.id);
    if (g) setGroups(g);

    // Talabalar
    const { data: ts } = await supabase.from("teacher_students").select("student_id").eq("teacher_id", user.id);
    const studentIds = ts?.map(t => t.student_id) || [];
    if (studentIds.length > 0) {
      const { data: profiles } = await supabase.from("profiles").select("id, full_name").in("id", studentIds);
      if (profiles) setStudents(profiles);
    }

    setLoading(false);
  }

  // ===== ASSIGNMENT CRUD =====
  async function handleSave() {
    if (!form.challenge_id) { toast.error("Topshiriq tanlang"); return; }
    setSaving(true);
    const { error } = await supabase.from("teacher_assignments").insert({
      teacher_id: userId, challenge_id: form.challenge_id,
      group_id: form.group_id || null, title: form.title || null,
      instructions: form.instructions || null,
      deadline: form.deadline ? new Date(form.deadline).toISOString() : null,
    });
    if (error) { toast.error(error.message); setSaving(false); return; }
    toast.success("Topshiriq biriktirildi");
    setShowForm(false); setSaving(false);
    setForm({ challenge_id: "", group_id: "", title: "", instructions: "", deadline: "" });
    load();
  }

  async function toggleActive(id: string, current: boolean) {
    await supabase.from("teacher_assignments").update({ is_active: !current }).eq("id", id);
    toast.success(current ? "O'chirildi" : "Faollashtirildi"); load();
  }

  async function deleteAssignment(id: string) {
    if (!confirm("O'chirish?")) return;
    await supabase.from("teacher_assignments").delete().eq("id", id);
    toast.success("O'chirildi"); load();
  }

  // ===== GROUP CRUD =====
  async function createGroup() {
    if (!groupForm.name.trim()) { toast.error("Guruh nomini kiriting"); return; }
    const { error } = await supabase.from("teacher_groups").insert({
      teacher_id: userId, name: groupForm.name, description: groupForm.description || null,
    });
    if (error) { toast.error(error.message); return; }
    toast.success("Guruh yaratildi");
    setGroupForm({ name: "", description: "" }); setShowGroupForm(false); load();
  }

  async function deleteGroup(id: string) {
    if (!confirm("Guruhni o'chirish?")) return;
    await supabase.from("teacher_groups").delete().eq("id", id);
    toast.success("O'chirildi"); load();
  }

  // ===== VIEW SUBMISSIONS =====
  async function viewSubmissions(assignmentId: string, challengeId: string) {
    if (expandedAssignment === assignmentId) { setExpandedAssignment(null); return; }
    setExpandedAssignment(assignmentId);

    const studentIds = students.map(s => s.id);
    if (studentIds.length === 0) { setAssignmentSubmissions([]); return; }

    const { data } = await supabase.from("submissions")
      .select("user_id, status, passed_tests, total_tests, created_at")
      .eq("task_id", challengeId).eq("task_type", "challenge")
      .in("user_id", studentIds).order("created_at", { ascending: false });

    const nameMap = Object.fromEntries(students.map(s => [s.id, s.full_name]));
    const subs = (data || []).map(s => ({ ...s, name: nameMap[s.user_id] || "Noma'lum" }));

    // Har bir talaba uchun eng yaxshi natija
    const best: Record<string, any> = {};
    subs.forEach(s => {
      if (!best[s.user_id] || (s.status === "accepted" && best[s.user_id].status !== "accepted")) {
        best[s.user_id] = s;
      }
    });
    setAssignmentSubmissions(Object.values(best));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display font-bold text-3xl mb-1">Topshiriq biriktirish</h1>
          <p className="text-muted-foreground text-sm">{assignments.length} ta topshiriq · {groups.length} ta guruh</p>
        </motion.div>
        <div className="flex gap-2">
          <button onClick={() => setShowGroupForm(!showGroupForm)} className="btn-ghost py-2.5 px-4 text-sm flex items-center gap-2">
            <Users className="w-4 h-4" /> Guruh yaratish
          </button>
          <button onClick={() => setShowForm(true)} className="btn-primary py-2.5 px-5 flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4" /> Biriktirish
          </button>
        </div>
      </div>

      {/* Groups */}
      {groups.length > 0 && (
        <motion.div className="glass-card p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h3 className="text-sm font-semibold mb-2 flex items-center gap-2"><Users className="w-4 h-4 text-neon-blue" /> Guruhlar</h3>
          <div className="flex gap-2 flex-wrap">
            {groups.map(g => (
              <div key={g.id} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface text-sm">
                <span>{g.name}</span>
                {g.description && <span className="text-[10px] text-muted-foreground">({g.description})</span>}
                <button onClick={() => deleteGroup(g.id)} className="p-0.5 hover:text-neon-red"><Trash2 className="w-3 h-3" /></button>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Group form */}
      <AnimatePresence>
        {showGroupForm && (
          <motion.div className="glass-card p-4 flex gap-3 items-end" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
            <div className="flex-1"><label className="text-sm font-medium mb-1 block">Guruh nomi</label>
              <input value={groupForm.name} onChange={e => setGroupForm({ ...groupForm, name: e.target.value })} className="input-field" placeholder="301-guruh" /></div>
            <div className="flex-1"><label className="text-sm font-medium mb-1 block">Tavsif (ixtiyoriy)</label>
              <input value={groupForm.description} onChange={e => setGroupForm({ ...groupForm, description: e.target.value })} className="input-field" placeholder="Kompyuter fanlari fakulteti" /></div>
            <button onClick={createGroup} className="btn-primary py-3 px-5 text-sm">Yaratish</button>
            <button onClick={() => setShowGroupForm(false)} className="btn-ghost py-3 px-3"><X className="w-4 h-4" /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Assignment form */}
      <AnimatePresence>
        {showForm && (
          <motion.div className="glass-card p-6" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-semibold">Topshiriq biriktirish</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 hover:bg-accent rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div><label className="text-sm font-medium mb-1 block">Topshiriq *</label>
                <select value={form.challenge_id} onChange={e => setForm({ ...form, challenge_id: e.target.value })} className="input-field">
                  <option value="">Tanlang...</option>
                  {challenges.map(c => <option key={c.id} value={c.id}>{c.title} ({c.difficulty})</option>)}
                </select></div>
              <div><label className="text-sm font-medium mb-1 block">Guruh</label>
                <select value={form.group_id} onChange={e => setForm({ ...form, group_id: e.target.value })} className="input-field">
                  <option value="">Barcha talabalar</option>
                  {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select></div>
              <div><label className="text-sm font-medium mb-1 block">Sarlavha</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="input-field" placeholder="Uy vazifasi #5" /></div>
              <div><label className="text-sm font-medium mb-1 block">Muddat</label>
                <input type="datetime-local" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} className="input-field" /></div>
              <div className="md:col-span-2"><label className="text-sm font-medium mb-1 block">Ko'rsatmalar</label>
                <textarea value={form.instructions} onChange={e => setForm({ ...form, instructions: e.target.value })} className="input-field min-h-[60px]" /></div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setShowForm(false)} className="btn-ghost py-2 px-5 text-sm">Bekor</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary py-2 px-5 text-sm flex items-center gap-2 disabled:opacity-50">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Biriktirish</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Assignments list */}
      <div className="space-y-2">
        {loading ? [1,2,3].map(i => <div key={i} className="glass-card p-4 h-20 animate-pulse" />) :
        assignments.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="mb-2">Hali topshiriq biriktirilmagan</p>
            <button onClick={() => setShowForm(true)} className="btn-primary text-sm py-2 px-5">
              <Plus className="w-4 h-4 inline mr-1" /> Birinchi topshiriqni biriktirish
            </button>
          </div>
        ) : assignments.map(a => (
          <div key={a.id}>
            <motion.div className={cn("glass-card p-4 flex items-center gap-4", !a.is_active && "opacity-50")} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center",
                a.is_active ? "bg-neon-green/10 text-neon-green" : "bg-surface text-muted-foreground")}>
                <ClipboardList className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{a.title || a.challenge?.title}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                  <span className={cn("px-1.5 py-0.5 rounded text-[10px]",
                    a.challenge?.difficulty === "easy" ? "bg-neon-green/10 text-neon-green" :
                    a.challenge?.difficulty === "medium" ? "bg-neon-yellow/10 text-neon-yellow" : "bg-neon-red/10 text-neon-red"
                  )}>{a.challenge?.difficulty}</span>
                  {a.deadline && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(a.deadline)}</span>}
                  {a.instructions && <span>📝 Ko'rsatma bor</span>}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => viewSubmissions(a.id, a.challenge_id)} className="p-1.5 hover:bg-accent rounded-lg text-muted-foreground hover:text-neon-blue" title="Natijalar">
                  <Eye className="w-4 h-4" />
                </button>
                <button onClick={() => toggleActive(a.id, a.is_active)} className="p-1.5 hover:bg-accent rounded-lg text-muted-foreground" title={a.is_active ? "O'chirish" : "Faollashtirish"}>
                  {a.is_active ? "🟢" : "⚪"}
                </button>
                <button onClick={() => deleteAssignment(a.id)} className="p-1.5 hover:bg-neon-red/10 rounded-lg text-muted-foreground hover:text-neon-red">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>

            {/* Expanded: submission results */}
            <AnimatePresence>
              {expandedAssignment === a.id && (
                <motion.div className="ml-14 mt-2 mb-4 glass-card p-4" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                  <h4 className="text-sm font-semibold mb-3">Talabalar natijalari ({assignmentSubmissions.length}/{students.length})</h4>
                  {assignmentSubmissions.length === 0 ? (
                    <p className="text-xs text-muted-foreground">Hali hech kim yubormagan</p>
                  ) : (
                    <div className="space-y-1.5">
                      {assignmentSubmissions.map((s, i) => (
                        <div key={i} className="flex items-center gap-3 py-1.5 text-xs">
                          {s.status === "accepted" ? <CheckCircle2 className="w-4 h-4 text-neon-green" /> : <XCircle className="w-4 h-4 text-neon-red" />}
                          <span className="flex-1 font-medium">{s.name}</span>
                          <span className={cn("font-mono", s.status === "accepted" ? "text-neon-green" : "text-neon-red")}>
                            {s.passed_tests}/{s.total_tests}
                          </span>
                          <span className="text-muted-foreground">{formatRelativeDate(s.created_at)}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Bajarilmaganlar */}
                  {students.length > assignmentSubmissions.length && (
                    <div className="mt-3 pt-3 border-t border-border/50">
                      <p className="text-xs text-muted-foreground mb-1">Hali bajarmagan ({students.length - assignmentSubmissions.length}):</p>
                      <div className="flex flex-wrap gap-1">
                        {students.filter(s => !assignmentSubmissions.find(sub => sub.user_id === s.id)).map(s => (
                          <span key={s.id} className="text-[10px] px-2 py-0.5 rounded bg-surface text-muted-foreground">{s.full_name}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
