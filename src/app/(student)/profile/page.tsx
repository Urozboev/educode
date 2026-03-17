"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { getOrCreateProfile } from "@/lib/profile";
import { cn, getInitials, getLevelLabel, getLevelColor, calculateXpLevel, formatDate } from "@/lib/utils";
import type { Profile, UserAchievement, Achievement } from "@/types";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { User, Mail, Edit3, Save, Loader2, Zap, Coins, Flame, Trophy, X, Star, Send, CheckCircle2, MessageSquare } from "lucide-react";

export default function ProfilePage() {
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [achievements, setAchievements] = useState<(UserAchievement & { achievement: Achievement })[]>([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ full_name: "", username: "", bio: "" });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");

  // Review
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewSending, setReviewSending] = useState(false);
  const [reviewSent, setReviewSent] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setEmail(user.email || "");
      const p = await getOrCreateProfile(supabase, user.id);
      if (p) { setProfile(p as Profile); setForm({ full_name: p.full_name, username: p.username || "", bio: p.bio || "" }); }
      const { data: ach } = await supabase.from("user_achievements").select("*, achievement:achievements(*)").eq("user_id", user.id);
      if (ach) setAchievements(ach as any[]);
      const { data: existing } = await supabase.from("testimonials").select("id").eq("user_id", user.id).maybeSingle();
      if (existing) setReviewSent(true);
      setLoading(false);
    })();
  }, []);

  async function handleSave() {
    if (!profile || !form.full_name.trim()) { toast.error("Ismni kiriting"); return; }
    setSaving(true);
    const { error } = await supabase.from("profiles").update({ full_name: form.full_name, username: form.username || null, bio: form.bio || null }).eq("id", profile.id);
    if (error) { toast.error(error.message); setSaving(false); return; }
    setProfile({ ...profile, ...form } as Profile);
    setEditing(false); setSaving(false);
    toast.success("Profil yangilandi");
  }

  async function submitReview() {
    if (!reviewText.trim() || reviewText.length < 10) { toast.error("Kamida 10 ta belgi yozing"); return; }
    if (!profile) return;
    setReviewSending(true);
    await supabase.from("testimonials").insert({ user_id: profile.id, full_name: profile.full_name, avatar_url: profile.avatar_url, text: reviewText, rating: reviewRating });
    setReviewSent(true); setReviewSending(false);
    toast.success("Izohingiz yuborildi! Admin tasdiqlangandan keyin bosh sahifada ko'rinadi.");
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
      <motion.div className="glass-card p-6 md:p-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-hero-gradient flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
            {profile.avatar_url ? <img src={profile.avatar_url} alt="" className="w-full h-full rounded-2xl object-cover" /> : getInitials(profile.full_name)}
          </div>
          <div className="flex-1 min-w-0">
            {editing ? (
              <div className="space-y-3">
                <div><label className="text-xs font-medium text-muted-foreground mb-1 block">To'liq ism</label><input value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} className="input-field" /></div>
                <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Username</label><input value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} className="input-field" placeholder="@username" /></div>
                <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Bio</label><textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} className="input-field min-h-[60px]" /></div>
                <div className="flex gap-2">
                  <button onClick={handleSave} disabled={saving} className="btn-primary py-2 px-4 text-sm flex items-center gap-1.5 disabled:opacity-50">{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Saqlash</button>
                  <button onClick={() => setEditing(false)} className="btn-ghost py-2 px-4 text-sm"><X className="w-4 h-4" /></button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div><h2 className="font-display font-bold text-xl md:text-2xl">{profile.full_name}</h2>{profile.username && <p className="text-sm text-muted-foreground">@{profile.username}</p>}</div>
                  <button onClick={() => setEditing(true)} className="p-2 hover:bg-accent rounded-xl text-muted-foreground"><Edit3 className="w-5 h-5" /></button>
                </div>
                {profile.bio && <p className="text-sm text-muted-foreground mt-2">{profile.bio}</p>}
                <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground"><Mail className="w-3.5 h-3.5" /> {email}</div>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        {[
          { icon: Zap, value: profile.xp, label: "XP", color: "text-neon-yellow" },
          { icon: Coins, value: profile.coins, label: "Coinlar", color: "text-neon-yellow" },
          { icon: Flame, value: profile.streak_days, label: "Streak", color: "text-neon-red" },
          { icon: Trophy, value: achievements.length, label: "Yutuqlar", color: "text-neon-purple" },
        ].map(s => (
          <div key={s.label} className="glass-card p-4 text-center">
            <s.icon className={cn("w-5 h-5 mx-auto mb-1", s.color)} />
            <div className="font-bold text-lg">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Level */}
      <motion.div className="glass-card p-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-sm">Daraja: <span className={getLevelColor(profile.level)}>{getLevelLabel(profile.level)}</span></span>
          <span className="text-xs text-muted-foreground">{profile.xp} / {xpInfo.nextThreshold} XP</span>
        </div>
        <div className="w-full h-3 bg-surface rounded-full overflow-hidden"><div className="h-full progress-gradient rounded-full transition-all" style={{ width: `${Math.min(xpInfo.progress, 100)}%` }} /></div>
        <p className="text-xs text-muted-foreground mt-2">A'zo: {formatDate(profile.created_at)}</p>
      </motion.div>

      {/* Achievements */}
      {achievements.length > 0 && (
        <motion.div className="glass-card p-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h3 className="font-display font-semibold text-lg mb-3">Yutuqlar</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {achievements.map(a => (
              <div key={a.achievement_id} className="p-3 rounded-xl bg-surface/50 border border-border/50 text-center">
                <div className="text-xl mb-1">🏆</div>
                <p className="font-semibold text-xs">{a.achievement?.title}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* IZOH YOZISH */}
      <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <h3 className="font-display font-semibold text-lg mb-2 flex items-center gap-2"><MessageSquare className="w-5 h-5 text-neon-blue" /> Platforma haqida izoh</h3>
        <p className="text-sm text-muted-foreground mb-4">Izohingiz admin tasdiqlangandan keyin bosh sahifada ko'rinadi.</p>
        {reviewSent ? (
          <div className="text-center py-6">
            <CheckCircle2 className="w-10 h-10 text-neon-green mx-auto mb-2" />
            <p className="font-semibold text-sm">Izohingiz yuborildi!</p>
            <p className="text-xs text-muted-foreground">Admin tasdiqlashini kuting.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Baho</label>
              <div className="flex gap-1">{[1,2,3,4,5].map(n => (
                <button key={n} onClick={() => setReviewRating(n)}>
                  <Star className={cn("w-6 h-6 transition-all", n <= reviewRating ? "text-neon-yellow fill-neon-yellow" : "text-muted-foreground/30")} />
                </button>
              ))}</div>
            </div>
            <div><label className="text-sm font-medium mb-1 block">Izoh</label>
              <textarea value={reviewText} onChange={e => setReviewText(e.target.value)} className="input-field min-h-[80px]" placeholder="Platforma haqida fikringiz..." maxLength={500} />
              <p className="text-xs text-muted-foreground mt-1">{reviewText.length}/500</p>
            </div>
            <button onClick={submitReview} disabled={reviewSending || reviewText.length < 10}
              className="btn-primary py-2.5 px-6 flex items-center gap-2 text-sm disabled:opacity-50">
              {reviewSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Yuborish
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
