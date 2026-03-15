"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { getOrCreateProfile } from "@/lib/profile";
import { cn, getInitials, getLevelLabel, getLevelColor, calculateXpLevel, formatDate } from "@/lib/utils";
import type { Profile, UserAchievement, Achievement } from "@/types";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  User, Mail, Edit3, Save, Loader2, Zap, Coins, Flame,
  Trophy, Calendar, BookOpen, Target, X
} from "lucide-react";

export default function ProfilePage() {
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [achievements, setAchievements] = useState<(UserAchievement & { achievement: Achievement })[]>([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ full_name: "", username: "", bio: "" });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setEmail(user.email || "");

      const p = await getOrCreateProfile(supabase, user.id);
      if (p) {
        setProfile(p as Profile);
        setForm({ full_name: p.full_name, username: p.username || "", bio: p.bio || "" });
      }

      const { data: ach } = await supabase
        .from("user_achievements")
        .select("*, achievement:achievements(*)")
        .eq("user_id", user.id);
      if (ach) setAchievements(ach as any[]);

      setLoading(false);
    })();
  }, []);

  async function handleSave() {
    if (!profile || !form.full_name.trim()) { toast.error("Ismni kiriting"); return; }
    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      full_name: form.full_name,
      username: form.username || null,
      bio: form.bio || null,
    }).eq("id", profile.id);

    if (error) { toast.error(error.message); setSaving(false); return; }
    setProfile({ ...profile, ...form } as Profile);
    setEditing(false); setSaving(false);
    toast.success("Profil yangilandi");
  }

  if (loading) return <div className="max-w-2xl space-y-4 animate-pulse"><div className="glass-card h-48" /><div className="glass-card h-32" /></div>;
  if (!profile) return null;

  const xpInfo = calculateXpLevel(profile.xp);

  return (
    <div className="max-w-2xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display font-bold text-3xl mb-1">Profil</h1>
      </motion.div>

      {/* Profile Card */}
      <motion.div className="glass-card p-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 rounded-2xl bg-hero-gradient flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-full h-full rounded-2xl object-cover" />
            ) : getInitials(profile.full_name)}
          </div>
          <div className="flex-1">
            {editing ? (
              <div className="space-y-3">
                <div><label className="text-xs font-medium text-muted-foreground mb-1 block">To'liq ism</label>
                  <input value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} className="input-field" /></div>
                <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Username</label>
                  <input value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} className="input-field" placeholder="@username" /></div>
                <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Bio</label>
                  <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} className="input-field min-h-[60px]" placeholder="O'zingiz haqingizda..." /></div>
                <div className="flex gap-2">
                  <button onClick={handleSave} disabled={saving} className="btn-primary py-2 px-4 text-sm flex items-center gap-1.5 disabled:opacity-50">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Saqlash</button>
                  <button onClick={() => setEditing(false)} className="btn-ghost py-2 px-4 text-sm"><X className="w-4 h-4" /></button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-display font-bold text-2xl">{profile.full_name}</h2>
                    {profile.username && <p className="text-sm text-muted-foreground">@{profile.username}</p>}
                  </div>
                  <button onClick={() => setEditing(true)} className="p-2 hover:bg-accent rounded-xl text-muted-foreground hover:text-foreground">
                    <Edit3 className="w-5 h-5" /></button>
                </div>
                {profile.bio && <p className="text-sm text-muted-foreground mt-2">{profile.bio}</p>}
                <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                  <Mail className="w-3.5 h-3.5" /> {email}
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="glass-card p-4 text-center">
          <Zap className="w-6 h-6 text-neon-yellow mx-auto mb-1" />
          <div className="font-bold text-xl">{profile.xp}</div>
          <div className="text-xs text-muted-foreground">XP</div>
        </div>
        <div className="glass-card p-4 text-center">
          <Coins className="w-6 h-6 text-neon-yellow mx-auto mb-1" />
          <div className="font-bold text-xl">{profile.coins}</div>
          <div className="text-xs text-muted-foreground">Coinlar</div>
        </div>
        <div className="glass-card p-4 text-center">
          <Flame className="w-6 h-6 text-neon-red mx-auto mb-1" />
          <div className="font-bold text-xl">{profile.streak_days}</div>
          <div className="text-xs text-muted-foreground">Streak</div>
        </div>
        <div className="glass-card p-4 text-center">
          <Trophy className="w-6 h-6 text-neon-purple mx-auto mb-1" />
          <div className="font-bold text-xl">{achievements.length}</div>
          <div className="text-xs text-muted-foreground">Yutuqlar</div>
        </div>
      </motion.div>

      {/* Level Progress */}
      <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div className="flex items-center justify-between mb-3">
          <span className="font-semibold text-sm">Daraja: <span className={getLevelColor(profile.level)}>{getLevelLabel(profile.level)}</span></span>
          <span className="text-xs text-muted-foreground">{profile.xp} / {xpInfo.nextThreshold} XP</span>
        </div>
        <div className="w-full h-3 bg-surface rounded-full overflow-hidden">
          <div className="h-full progress-gradient rounded-full transition-all" style={{ width: `${Math.min(xpInfo.progress, 100)}%` }} />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          A'zo bo'lgan sana: {formatDate(profile.created_at)}
        </p>
      </motion.div>

      {/* Achievements */}
      {achievements.length > 0 && (
        <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h3 className="font-display font-semibold text-lg mb-4">Yutuqlar</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {achievements.map(a => (
              <div key={a.achievement_id} className="p-3 rounded-xl bg-surface/50 border border-border/50 text-center">
                <div className="text-2xl mb-1">🏆</div>
                <p className="font-semibold text-xs">{a.achievement?.title}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{a.achievement?.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
