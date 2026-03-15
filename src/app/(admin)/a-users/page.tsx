"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  cn,
  getInitials,
  getLevelLabel,
  getLevelColor,
  formatDate,
} from "@/lib/utils";
import type { Profile } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Search,
  Users,
  Shield,
  ShieldOff,
  Coins,
  ChevronDown,
  UserPlus,
  UserMinus,
  Link2,
  X,
  Loader2,
  GraduationCap,
} from "lucide-react";

export default function AdminUsersPage() {
  const supabase = createClient();
  const [users, setUsers] = useState<Profile[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // Teacher-student assignment
  const [showAssignPanel, setShowAssignPanel] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<string>("");
  const [teacherStudents, setTeacherStudents] = useState<string[]>([]);
  const [assignLoading, setAssignLoading] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setUsers(data as Profile[]);
    setLoading(false);
  }

  async function changeRole(userId: string, newRole: string) {
    await supabase.from("profiles").update({ role: newRole }).eq("id", userId);
    toast.success(`Rol "${newRole}" ga o'zgartirildi`);
    load();
  }

  async function toggleBlock(user: Profile) {
    await supabase
      .from("profiles")
      .update({ is_blocked: !user.is_blocked })
      .eq("id", user.id);
    toast.success(user.is_blocked ? "Aktivlashtirildi" : "Bloklandi");
    load();
  }

  async function adjustCoins(userId: string) {
    const user = users.find((u) => u.id === userId);
    if (!user) return;
    const amt = prompt(
      `${user.full_name} — Hozirgi balans: ${user.coins} coin\n\n` +
        `Qo'shish uchun musbat son kiriting (masalan: 50)\n` +
        `Ayirish uchun manfiy son kiriting (masalan: -30)`,
    );
    if (!amt) return;
    const amount = parseInt(amt);
    if (isNaN(amount) || amount === 0) {
      toast.error("To'g'ri son kiriting");
      return;
    }
    const newBalance = user.coins + amount;
    if (newBalance < 0) {
      toast.error(
        `Yetarli coin yo'q! Hozirgi: ${user.coins}, ayirish: ${Math.abs(amount)}`,
      );
      return;
    }
    await supabase
      .from("profiles")
      .update({ coins: newBalance })
      .eq("id", userId);
    await supabase.from("coin_transactions").insert({
      user_id: userId,
      amount,
      type: "admin_adjustment",
      description: `Admin: ${amount > 0 ? "+" : ""}${amount} coin`,
      balance_after: newBalance,
    });
    toast.success(`${amount > 0 ? "+" : ""}${amount} coin`);
    load();
  }

  // ===== TEACHER-STUDENT ASSIGNMENT =====
  async function openAssignPanel(teacherId: string) {
    setSelectedTeacher(teacherId);
    setShowAssignPanel(true);
    setAssignLoading(true);
    const { data } = await supabase
      .from("teacher_students")
      .select("student_id")
      .eq("teacher_id", teacherId);
    setTeacherStudents(data?.map((d) => d.student_id) || []);
    setAssignLoading(false);
  }

  async function toggleStudentAssignment(studentId: string) {
    if (!selectedTeacher) return;
    const isAssigned = teacherStudents.includes(studentId);

    if (isAssigned) {
      await supabase
        .from("teacher_students")
        .delete()
        .eq("teacher_id", selectedTeacher)
        .eq("student_id", studentId);
      setTeacherStudents((prev) => prev.filter((id) => id !== studentId));
      toast.success("Talaba ajratildi");
    } else {
      await supabase.from("teacher_students").insert({
        teacher_id: selectedTeacher,
        student_id: studentId,
      });
      setTeacherStudents((prev) => [...prev, studentId]);
      toast.success("Talaba biriktirildi");
    }
  }

  async function assignAllStudents() {
    if (!selectedTeacher) return;

    const students = users.filter((u) => u.role === "student" && !u.is_blocked);

    for (const s of students) {
      if (!teacherStudents.includes(s.id)) {
        await supabase.from("teacher_students").upsert(
          {
            teacher_id: selectedTeacher,
            student_id: s.id,
          },
          {
            onConflict: "teacher_id,student_id",
          },
        );
      }
    }

    setTeacherStudents(students.map((s) => s.id));
    toast.success(`${students.length} ta talaba biriktirildi`);
  }

  const teachers = users.filter((u) => u.role === "teacher");
  const students = users.filter((u) => u.role === "student");
  const selectedTeacherProfile = users.find((u) => u.id === selectedTeacher);

  const filtered = users.filter((u) => {
    const matchSearch = u.full_name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const roleCounts = {
    all: users.length,
    student: students.length,
    teacher: teachers.length,
    admin: users.filter((u) => u.role === "admin").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display font-bold text-3xl">Foydalanuvchilar</h1>
          <p className="text-muted-foreground text-sm">
            {users.length} ta foydalanuvchi
          </p>
        </motion.div>
        {teachers.length > 0 && (
          <div className="flex gap-2">
            <select
              onChange={(e) => {
                if (e.target.value) openAssignPanel(e.target.value);
              }}
              className="input-field text-sm py-2"
              defaultValue=""
            >
              <option value="" disabled>
                👨‍🏫 Talaba biriktirish...
              </option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.full_name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* ===== TEACHER-STUDENT ASSIGNMENT PANEL ===== */}
      <AnimatePresence>
        {showAssignPanel && selectedTeacherProfile && (
          <motion.div
            className="glass-card p-6 border-l-4 border-l-neon-blue"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-neon-blue/20 flex items-center justify-center text-neon-blue font-bold text-sm">
                  {getInitials(selectedTeacherProfile.full_name)}
                </div>
                <div>
                  <h2 className="font-semibold">
                    {selectedTeacherProfile.full_name}
                  </h2>
                  <p className="text-xs text-neon-blue">
                    O'qituvchi · {teacherStudents.length} ta talaba
                    biriktirilgan
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={assignAllStudents}
                  className="text-xs px-3 py-1.5 rounded-lg bg-neon-green/10 text-neon-green hover:bg-neon-green/20 transition-all"
                >
                  Hammasini biriktirish
                </button>
                <button
                  onClick={() => setShowAssignPanel(false)}
                  className="p-1.5 hover:bg-accent rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {assignLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground py-4">
                <Loader2 className="w-4 h-4 animate-spin" /> Yuklanmoqda...
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-64 overflow-y-auto">
                {students.map((s) => {
                  const isAssigned = teacherStudents.includes(s.id);
                  return (
                    <button
                      key={s.id}
                      onClick={() => toggleStudentAssignment(s.id)}
                      className={cn(
                        "flex items-center gap-2 p-2.5 rounded-xl text-left text-sm transition-all border",
                        isAssigned
                          ? "bg-neon-green/10 border-neon-green/20 text-foreground"
                          : "bg-surface/30 border-transparent hover:border-neon-blue/20 text-muted-foreground",
                      )}
                    >
                      <div
                        className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0",
                          isAssigned
                            ? "bg-neon-green text-white"
                            : "bg-surface",
                        )}
                      >
                        {isAssigned ? "✓" : getInitials(s.full_name)}
                      </div>
                      <span className="truncate text-xs">{s.full_name}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {students.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Hali "student" rolidagi foydalanuvchi yo'q
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== FILTERS ===== */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Ism qidirish..."
            className="input-field pl-11"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "student", "teacher", "admin"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={cn(
                "px-3 py-2 rounded-lg text-xs font-medium transition-all",
                roleFilter === r
                  ? "bg-neon-purple/10 text-neon-purple border border-neon-purple/20"
                  : "bg-surface text-muted-foreground",
              )}
            >
              {r === "all" ? "Barchasi" : r} ({roleCounts[r]})
            </button>
          ))}
        </div>
      </div>

      {/* ===== USERS TABLE ===== */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50 text-xs text-muted-foreground font-semibold">
                <th className="text-left px-5 py-3">Foydalanuvchi</th>
                <th className="text-center px-5 py-3">Rol</th>
                <th className="text-center px-5 py-3">Daraja</th>
                <th className="text-center px-5 py-3">XP</th>
                <th className="text-center px-5 py-3">Coin</th>
                <th className="text-center px-5 py-3">Holat</th>
                <th className="text-right px-5 py-3">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Yuklanmoqda...
                  </td>
                </tr>
              ) : (
                filtered.map((u) => (
                  <tr
                    key={u.id}
                    className={cn(
                      "border-b border-border/30 hover:bg-surface/30",
                      u.is_blocked && "opacity-50",
                    )}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-hero-gradient flex items-center justify-center text-white font-bold text-xs">
                          {u.avatar_url ? (
                            <img
                              src={u.avatar_url}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            getInitials(u.full_name)
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{u.full_name}</p>
                          {u.username && (
                            <p className="text-[10px] text-muted-foreground">
                              @{u.username}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <select
                        value={u.role}
                        onChange={(e) => changeRole(u.id, e.target.value)}
                        className="text-xs bg-surface border border-border rounded-lg px-2 py-1 cursor-pointer"
                      >
                        <option value="student">student</option>
                        <option value="teacher">teacher</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                    <td
                      className={cn(
                        "px-5 py-3 text-center text-xs font-medium",
                        getLevelColor(u.level),
                      )}
                    >
                      {getLevelLabel(u.level)}
                    </td>
                    <td className="px-5 py-3 text-center text-sm font-mono">
                      {u.xp}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <button
                        onClick={() => adjustCoins(u.id)}
                        className="text-sm font-mono text-neon-yellow hover:underline cursor-pointer"
                      >
                        {u.coins}
                      </button>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span
                        className={cn(
                          "text-xs font-medium px-2 py-0.5 rounded-full",
                          u.is_blocked
                            ? "bg-neon-red/10 text-neon-red"
                            : "bg-neon-green/10 text-neon-green",
                        )}
                      >
                        {u.is_blocked ? "Bloklangan" : "Aktiv"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {u.role === "teacher" && (
                          <button
                            onClick={() => openAssignPanel(u.id)}
                            className="p-1.5 hover:bg-neon-blue/10 rounded-lg text-muted-foreground hover:text-neon-blue"
                            title="Talaba biriktirish"
                          >
                            <UserPlus className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => toggleBlock(u)}
                          className={cn(
                            "p-1.5 rounded-lg",
                            u.is_blocked
                              ? "hover:bg-neon-green/10 text-neon-green"
                              : "hover:bg-neon-red/10 text-neon-red",
                          )}
                          title={u.is_blocked ? "Aktivlashtirish" : "Bloklash"}
                        >
                          {u.is_blocked ? (
                            <Shield className="w-4 h-4" />
                          ) : (
                            <ShieldOff className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick guide */}
      <div className="glass-card p-5 bg-neon-blue/5 border-neon-blue/10">
        <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-neon-blue" /> Teacher-Student
          biriktirish qanday ishlaydi?
        </h3>
        <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
          <li>
            Foydalanuvchini <strong>"teacher"</strong> roliga o'zgartiring (Rol
            ustunidagi dropdown)
          </li>
          <li>
            O'sha teacher qatoridagi <strong>👤+ ikonini</strong> bosing yoki
            yuqoridagi dropdown dan tanlang
          </li>
          <li>
            Ochilgan panelda talabalar ustiga bosib{" "}
            <strong>biriktiring/ajrating</strong>
          </li>
          <li>
            Teacher o'z panelida (<code>/t-dashboard</code>) biriktirilgan
            talabalarni ko'radi
          </li>
        </ol>
      </div>
    </div>
  );
}
