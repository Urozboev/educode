"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn, getInitials } from "@/lib/utils";
import { toast } from "sonner";
import {
  Users, Key, Copy, Check, Loader2, Clock, CheckCircle2, XCircle,
  ShieldCheck, RefreshCw,
} from "lucide-react";

interface PendingLink { id: string; parent_id: string; parent_name: string; created_at: string; }
interface ConfirmedParent { id: string; parent_name: string; }
interface ActiveCode { code: string; expires_at: string; }

/**
 * Talaba profilidagi "Ota-ona nazorati" bo'limi:
 * - ulanish kodi yaratish (24 soat)
 * - email orqali kelgan pending so'rovlarni tasdiqlash/rad etish
 * - bog'langan ota-onalar ro'yxati
 */
export default function ParentControlSection() {
  const supabase = createClient();
  const [pending, setPending] = useState<PendingLink[]>([]);
  const [parents, setParents] = useState<ConfirmedParent[]>([]);
  const [activeCode, setActiveCode] = useState<ActiveCode | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Linklar
    const { data: links } = await supabase
      .from("parent_links")
      .select("id, parent_id, status")
      .eq("child_id", user.id)
      .neq("status", "rejected");

    if (links && links.length > 0) {
      const parentIds = links.map(l => l.parent_id);
      const { data: profiles } = await supabase
        .from("profiles").select("id, full_name").in("id", parentIds);
      const nameOf = (id: string) => profiles?.find(p => p.id === id)?.full_name || "Ota-ona";

      setPending(links.filter(l => l.status === "pending").map(l => ({
        id: l.id, parent_id: l.parent_id, parent_name: nameOf(l.parent_id), created_at: "",
      })));
      setParents(links.filter(l => l.status === "confirmed").map(l => ({
        id: l.parent_id, parent_name: nameOf(l.parent_id),
      })));
    } else {
      setPending([]); setParents([]);
    }

    // Faol kod (ishlatilmagan, muddati o'tmagan)
    const { data: codes } = await supabase
      .from("parent_link_codes")
      .select("code, expires_at")
      .eq("child_id", user.id)
      .is("used_at", null)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1);
    setActiveCode(codes && codes.length > 0 ? codes[0] as ActiveCode : null);

    setLoading(false);
  }, [supabase]);

  useEffect(() => { load(); }, [load]);

  async function generateCode() {
    setGenerating(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setGenerating(false); return; }
    // Eski faol kodlarni o'chirish (bitta faol kod bo'lsin)
    await supabase.from("parent_link_codes").delete().eq("child_id", user.id).is("used_at", null);
    const { data, error } = await supabase
      .from("parent_link_codes")
      .insert({ child_id: user.id })
      .select("code, expires_at")
      .single();
    setGenerating(false);
    if (error) { toast.error(error.message); return; }
    setActiveCode(data as ActiveCode);
    toast.success("Kod yaratildi! Ota-onangizga bering.");
  }

  function copyCode() {
    if (!activeCode) return;
    navigator.clipboard.writeText(activeCode.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function respond(linkId: string, accept: boolean) {
    const { data, error } = await supabase.rpc("respond_parent_link", { p_link_id: linkId, p_accept: accept });
    if (error) { toast.error(error.message); return; }
    if (!data?.ok) { toast.error(data?.error || "Xatolik"); return; }
    toast.success(data.message);
    load();
  }

  if (loading) return <div className="glass-card h-40 animate-pulse" />;

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <ShieldCheck className="w-5 h-5 text-neon-blue" />
        <h2 className="font-display font-semibold text-lg">Ota-ona nazorati</h2>
      </div>

      {/* Pending so'rovlar */}
      {pending.length > 0 && (
        <div className="mb-5 space-y-2">
          <p className="text-sm font-medium text-neon-yellow flex items-center gap-1.5">
            <Clock className="w-4 h-4" /> Tasdiqlashni kutayotgan so'rovlar
          </p>
          {pending.map(p => (
            <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl bg-neon-yellow/5 border border-neon-yellow/20">
              <div className="w-9 h-9 rounded-full bg-neon-yellow/10 flex items-center justify-center text-neon-yellow text-xs font-bold">
                {getInitials(p.parent_name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{p.parent_name}</p>
                <p className="text-xs text-muted-foreground">sizni kuzatmoqchi</p>
              </div>
              <button onClick={() => respond(p.id, true)} className="p-2 rounded-lg bg-neon-green/10 text-neon-green hover:bg-neon-green/20" title="Tasdiqlash">
                <CheckCircle2 className="w-4 h-4" />
              </button>
              <button onClick={() => respond(p.id, false)} className="p-2 rounded-lg bg-neon-red/10 text-neon-red hover:bg-neon-red/20" title="Rad etish">
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Ulanish kodi */}
      <div className="mb-5">
        <p className="text-sm font-medium mb-2 flex items-center gap-1.5"><Key className="w-4 h-4 text-neon-blue" /> Ulanish kodi</p>
        <p className="text-xs text-muted-foreground mb-3">
          Ota-onangiz sizni kuzatishi uchun bu kodni ularga bering. Kod 24 soat amal qiladi.
        </p>
        {activeCode ? (
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center justify-between px-4 py-3 rounded-xl bg-neon-blue/5 border border-neon-blue/30">
              <span className="font-mono font-bold text-xl tracking-[0.3em] text-neon-blue">{activeCode.code}</span>
              <button onClick={copyCode} className="p-1.5 hover:bg-accent rounded-lg">
                {copied ? <Check className="w-4 h-4 text-neon-green" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
              </button>
            </div>
            <button onClick={generateCode} disabled={generating} className="btn-ghost py-3 px-3 border border-border" title="Yangi kod">
              {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            </button>
          </div>
        ) : (
          <button onClick={generateCode} disabled={generating} className="btn-primary py-2.5 px-5 text-sm flex items-center gap-2 disabled:opacity-50">
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4" />} Kod yaratish
          </button>
        )}
      </div>

      {/* Bog'langan ota-onalar */}
      {parents.length > 0 && (
        <div>
          <p className="text-sm font-medium mb-2 flex items-center gap-1.5"><Users className="w-4 h-4 text-neon-green" /> Bog'langan ota-onalar</p>
          <div className="space-y-2">
            {parents.map(p => (
              <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl bg-surface/50">
                <div className="w-9 h-9 rounded-full bg-neon-green/10 flex items-center justify-center text-neon-green text-xs font-bold">
                  {getInitials(p.parent_name)}
                </div>
                <p className="text-sm font-medium flex-1">{p.parent_name}</p>
                <CheckCircle2 className="w-4 h-4 text-neon-green" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
