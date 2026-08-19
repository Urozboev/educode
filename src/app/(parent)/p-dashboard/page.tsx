"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "@/components/i18n/Link";
import { createClient } from "@/lib/supabase/client";
import { cn, getInitials, formatNumber, getLevelLabel } from "@/lib/utils";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Users, UserPlus, Key, Mail, Loader2, Coins, Flame, Zap,
  ChevronRight, Clock, X, AlertCircle, Unlink,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface ChildRow {
  link_id: string;
  child_id: string;
  status: "pending" | "confirmed" | "rejected";
  full_name: string;
  avatar_url: string | null;
  coins: number;
  xp: number;
  streak_days: number;
  level: string;
}

export default function ParentDashboard() {
  const { t } = useI18n();
  const supabase = createClient();
  const [children, setChildren] = useState<ChildRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"code" | "email">("code");
  const [codeInput, setCodeInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [removing, setRemoving] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoadError(null);
    const { data: { user } } = await supabase.auth.getUser();
    // Sessiya yo'q — layout /login ga yo'naltiradi, lekin skelet abadiy
    // aylanib qolmasligi uchun yuklanish shu yerda ham tugatiladi.
    if (!user) { setLoading(false); return; }

    // Barcha linklar (pending + confirmed)
    const { data: links, error: linksError } = await supabase
      .from("parent_links")
      .select("id, child_id, status")
      .eq("parent_id", user.id)
      .neq("status", "rejected")
      .order("created_at", { ascending: false });

    // Xatoni yutib yubormaymiz: aks holda so'rov muvaffaqiyatsiz bo'lganda
    // ham "Hali farzand bog'lanmagan" ko'rinadi va sabab bilinmaydi.
    if (linksError) { setLoadError(linksError.message); setLoading(false); return; }
    if (!links || links.length === 0) { setChildren([]); setLoading(false); return; }

    // Farzand profillari
    const childIds = links.map(l => l.child_id);
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url, coins, xp, streak_days, level")
      .in("id", childIds);

    if (profilesError) { setLoadError(profilesError.message); setLoading(false); return; }

    const rows: ChildRow[] = links.map(l => {
      const p = profiles?.find(pr => pr.id === l.child_id);
      return {
        link_id: l.id,
        child_id: l.child_id,
        status: l.status as ChildRow["status"],
        full_name: p?.full_name || "Farzand",
        avatar_url: p?.avatar_url || null,
        coins: p?.coins || 0,
        xp: p?.xp || 0,
        streak_days: p?.streak_days || 0,
        level: p?.level || "beginner",
      };
    });
    setChildren(rows);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { load(); }, [load]);

  async function addByCode() {
    if (!codeInput.trim()) { toast.error(t.parent.enterCode); return; }
    setSubmitting(true);
    const { data, error } = await supabase.rpc("redeem_parent_link_code", { p_code: codeInput.trim() });
    setSubmitting(false);
    if (error) { toast.error(error.message); return; }
    if (!data?.ok) { toast.error(data?.error || "Xatolik"); return; }
    toast.success(data.message);
    setCodeInput("");
    load();
  }

  async function addByEmail() {
    if (!emailInput.trim()) { toast.error(t.parent.enterEmail); return; }
    setSubmitting(true);
    const { data, error } = await supabase.rpc("create_parent_link_by_email", { p_email: emailInput.trim() });
    setSubmitting(false);
    if (error) { toast.error(error.message); return; }
    if (!data?.ok) { toast.error(data?.error || "Xatolik"); return; }
    toast.success(data.message);
    setEmailInput("");
    load();
  }

  // Kutilayotgan so'rovni bekor qilish / bog'langan farzandni uzish.
  // parent_links da yozish policy'si yo'q — faqat RPC orqali.
  async function removeLink(linkId: string, isPending: boolean, name: string) {
    if (!isPending && !confirm(`${name} ro'yxatdan olib tashlansinmi? Uning ma'lumotlarini ko'ra olmay qolasiz.`)) return;
    setRemoving(linkId);
    const { data, error } = await supabase.rpc("cancel_parent_link", { p_link_id: linkId });
    setRemoving(null);
    if (error) { toast.error(error.message); return; }
    if (!data?.ok) { toast.error(data?.error || "Xatolik"); return; }
    toast.success(data.message);
    load();
  }

  const confirmed = children.filter(c => c.status === "confirmed");
  const pending = children.filter(c => c.status === "pending");

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="font-display font-bold text-3xl mb-1">{t.parent.panel}</h1>
        <p className="text-muted-foreground">{t.parent.dashSubtitle}</p>
      </div>

      {/* Farzand qo'shish */}
      <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-neon-blue" /> Farzand qo'shish
        </h2>

        <div className="flex gap-2 mb-4">
          <button onClick={() => setMode("code")}
            className={cn("flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
              mode === "code" ? "bg-neon-blue/10 text-neon-blue border border-neon-blue/30" : "bg-surface text-muted-foreground")}>
            <Key className="w-4 h-4" /> Kod orqali
          </button>
          <button onClick={() => setMode("email")}
            className={cn("flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
              mode === "email" ? "bg-neon-blue/10 text-neon-blue border border-neon-blue/30" : "bg-surface text-muted-foreground")}>
            <Mail className="w-4 h-4" /> Email orqali
          </button>
        </div>

        {mode === "code" ? (
          <div>
            <p className="text-xs text-muted-foreground mb-2">
              {t.parent.linkCodeHintA} <strong>{t.parent.linkCodeBold}</strong> {t.parent.linkCodeHintB}
            </p>
            <div className="flex gap-2">
              <input value={codeInput} onChange={e => setCodeInput(e.target.value.toUpperCase())}
                placeholder={t.parent.linkCodePh} maxLength={8}
                className="input-field flex-1 font-mono tracking-widest uppercase" />
              <button onClick={addByCode} disabled={submitting} className="btn-primary py-3 px-6 text-sm flex items-center gap-2 disabled:opacity-50">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4" />} {t.parent.link}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-xs text-muted-foreground mb-2">
              {t.parent.emailHintA} <strong>{t.parent.emailBold}</strong> {t.parent.emailHintB}
            </p>
            <div className="flex gap-2">
              <input value={emailInput} onChange={e => setEmailInput(e.target.value)} type="email"
                placeholder={t.parent.emailPh} className="input-field flex-1" />
              <button onClick={addByEmail} disabled={submitting} className="btn-primary py-3 px-6 text-sm flex items-center gap-2 disabled:opacity-50">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />} So'rov yuborish
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Kutilayotgan so'rovlar */}
      {pending.length > 0 && (
        <div>
          <h3 className="font-semibold text-sm text-muted-foreground mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" /> Tasdiqlanishi kutilmoqda
          </h3>
          <div className="space-y-2">
            {pending.map(c => (
              <div key={c.link_id} className="glass-card p-4 flex items-center gap-3 opacity-80">
                <div className="w-10 h-10 rounded-full bg-neon-yellow/10 flex items-center justify-center text-neon-yellow text-sm font-bold">
                  {getInitials(c.full_name)}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{c.full_name}</p>
                  <p className="text-xs text-neon-yellow">Farzand tasdiqlashini kutmoqda...</p>
                </div>
                <Clock className="w-4 h-4 text-neon-yellow" />
                <button onClick={() => removeLink(c.link_id, true, c.full_name)}
                  disabled={removing === c.link_id}
                  title={t.parent.cancelRequest}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-neon-red hover:bg-neon-red/10 transition-colors disabled:opacity-50">
                  {removing === c.link_id ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Farzandlar */}
      <div>
        <h3 className="font-display font-semibold text-lg mb-3 flex items-center gap-2">
          <Users className="w-5 h-5" /> Farzandlarim {confirmed.length > 0 && `(${confirmed.length})`}
        </h3>

        {loading ? (
          <div className="grid md:grid-cols-2 gap-4">
            {[1, 2].map(i => <div key={i} className="glass-card p-5 h-32 animate-pulse" />)}
          </div>
        ) : loadError ? (
          <div className="glass-card p-8 text-center">
            <AlertCircle className="w-10 h-10 text-neon-red/60 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground mb-1">{t.parent.loadFailed}</p>
            <p className="text-xs text-muted-foreground/70 mb-4">{loadError}</p>
            <button onClick={() => { setLoading(true); load(); }} className="btn-ghost text-sm">{t.parent.retry}</button>
          </div>
        ) : confirmed.length === 0 ? (
          <div className="glass-card p-10 text-center">
            <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">{t.parent.noChildren}</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {confirmed.map(c => (
              <Link key={c.link_id} href={`/p-children/${c.child_id}`}
                className="glass-card-hover p-5 group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-neon-purple/15 flex items-center justify-center text-neon-purple font-bold">
                    {c.avatar_url ? <img src={c.avatar_url} className="w-full h-full rounded-full object-cover" alt="" /> : getInitials(c.full_name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-semibold truncate group-hover:text-neon-purple transition-colors">{c.full_name}</p>
                    <p className="text-xs text-muted-foreground">{getLevelLabel(c.level)}</p>
                  </div>
                  {/* Karta havola — tugma bosilganda sahifaga o'tib ketmasligi kerak */}
                  <button
                    onClick={e => { e.preventDefault(); e.stopPropagation(); removeLink(c.link_id, false, c.full_name); }}
                    disabled={removing === c.link_id}
                    title={t.parent.unlink}
                    className="p-1.5 rounded-lg text-muted-foreground/50 hover:text-neon-red hover:bg-neon-red/10 transition-colors disabled:opacity-50">
                    {removing === c.link_id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Unlink className="w-4 h-4" />}
                  </button>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-neon-purple group-hover:translate-x-1 transition-all" />
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-surface/50 rounded-lg py-2">
                    <div className="flex items-center justify-center gap-1 text-neon-yellow font-bold text-sm"><Coins className="w-3.5 h-3.5" />{formatNumber(c.coins)}</div>
                    <p className="text-[10px] text-muted-foreground">coin</p>
                  </div>
                  <div className="bg-surface/50 rounded-lg py-2">
                    <div className="flex items-center justify-center gap-1 text-neon-blue font-bold text-sm"><Zap className="w-3.5 h-3.5" />{formatNumber(c.xp)}</div>
                    <p className="text-[10px] text-muted-foreground">XP</p>
                  </div>
                  <div className="bg-surface/50 rounded-lg py-2">
                    <div className="flex items-center justify-center gap-1 text-neon-red font-bold text-sm"><Flame className="w-3.5 h-3.5" />{c.streak_days}</div>
                    <p className="text-[10px] text-muted-foreground">streak</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
