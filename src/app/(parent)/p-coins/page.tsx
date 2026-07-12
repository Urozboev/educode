"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn, formatNumber } from "@/lib/utils";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Coins, Loader2, CreditCard, CheckCircle2, Clock, XCircle,
  Copy, Check, Gift, ShoppingCart,
} from "lucide-react";

interface Pkg { coins: number; uzs: number; }
interface Settings { price_per_coin: number; packages: Pkg[]; card_number: string; card_owner: string; }
interface Request { id: string; amount_coins: number; amount_uzs: number; status: string; created_at: string; review_note: string | null; }

export default function ParentCoinsPage() {
  const supabase = createClient();
  const [coins, setCoins] = useState(0);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [requests, setRequests] = useState<Request[]>([]);
  const [gifts, setGifts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Purchase form
  const [selectedPkg, setSelectedPkg] = useState<Pkg | null>(null);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [payingProvider, setPayingProvider] = useState<"payme" | "click" | null>(null);

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const [{ data: profile }, { data: setting }, { data: reqs }, { data: g }] = await Promise.all([
      supabase.from("profiles").select("coins").eq("id", user.id).single(),
      supabase.from("platform_settings").select("value").eq("key", "coin_price_uzs").maybeSingle(),
      supabase.from("coin_purchase_requests").select("*").eq("parent_id", user.id).order("created_at", { ascending: false }).limit(10),
      supabase.from("coin_gifts").select("*, child:profiles!coin_gifts_child_id_fkey(full_name)").eq("parent_id", user.id).order("created_at", { ascending: false }).limit(10),
    ]);

    if (profile) setCoins(profile.coins);
    if (setting?.value) setSettings(setting.value as Settings);
    if (reqs) setRequests(reqs as Request[]);
    if (g) setGifts(g);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { load(); }, [load]);

  function copyCard() {
    if (!settings?.card_number) return;
    navigator.clipboard.writeText(settings.card_number.replace(/\s/g, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function submitRequest() {
    if (!selectedPkg) { toast.error("Paketni tanlang"); return; }
    setSubmitting(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSubmitting(false); return; }

    const { error } = await supabase.from("coin_purchase_requests").insert({
      parent_id: user.id,
      amount_coins: selectedPkg.coins,
      amount_uzs: selectedPkg.uzs,
      payment_note: note || null,
    });
    setSubmitting(false);
    if (error) { toast.error(error.message); return; }
    toast.success("So'rov yuborildi! Admin tasdiqlagach coinlar hisobingizga tushadi.");
    setSelectedPkg(null); setNote("");
    load();
  }

  async function payOnline(provider: "payme" | "click") {
    if (!selectedPkg) return;
    setPayingProvider(provider);
    try {
      const res = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount_coins: selectedPkg.coins, amount_uzs: selectedPkg.uzs, provider }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; // provayder to'lov sahifasiga o'tish
      } else {
        toast.error(data.error || "To'lov tizimi sozlanmagan");
        setPayingProvider(null);
      }
    } catch (e: any) {
      toast.error(e.message);
      setPayingProvider(null);
    }
  }

  const statusBadge = (s: string) => {
    if (s === "approved") return <span className="inline-flex items-center gap-1 text-neon-green text-xs"><CheckCircle2 className="w-3.5 h-3.5" /> Tasdiqlandi</span>;
    if (s === "rejected") return <span className="inline-flex items-center gap-1 text-neon-red text-xs"><XCircle className="w-3.5 h-3.5" /> Rad etildi</span>;
    return <span className="inline-flex items-center gap-1 text-neon-yellow text-xs"><Clock className="w-3.5 h-3.5" /> Kutilmoqda</span>;
  };

  if (loading) return <div className="glass-card h-96 animate-pulse" />;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-display font-bold text-3xl mb-1">Coinlar</h1>
        <p className="text-muted-foreground">Coin sotib oling va farzandingizga sovg'a qiling.</p>
      </div>

      {/* Balans */}
      <motion.div className="glass-card p-6 flex items-center justify-between" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-neon-yellow/15 flex items-center justify-center">
            <Coins className="w-7 h-7 text-neon-yellow" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Sizning balansingiz</p>
            <p className="font-display font-extrabold text-3xl">{formatNumber(coins)} <span className="text-lg text-muted-foreground">coin</span></p>
          </div>
        </div>
      </motion.div>

      {/* Paketlar */}
      <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-neon-purple" /> Coin sotib olish
        </h2>

        <div className="grid sm:grid-cols-3 gap-3 mb-5">
          {(settings?.packages || []).map(pkg => (
            <button key={pkg.coins} onClick={() => setSelectedPkg(pkg)}
              className={cn("p-4 rounded-2xl border-2 text-center transition-all",
                selectedPkg?.coins === pkg.coins ? "border-neon-purple bg-neon-purple/10" : "border-border bg-surface/40 hover:bg-surface/60")}>
              <div className="flex items-center justify-center gap-1 text-neon-yellow font-display font-bold text-xl mb-1">
                <Coins className="w-5 h-5" />{formatNumber(pkg.coins)}
              </div>
              <p className="text-sm font-medium">{formatNumber(pkg.uzs)} so'm</p>
            </button>
          ))}
        </div>

        {selectedPkg && (
          <motion.div className="p-4 rounded-2xl bg-surface/50 border border-border space-y-4"
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>

            {/* Onlayn to'lov — Payme / Click */}
            <div>
              <p className="text-sm font-semibold mb-2 flex items-center gap-2"><CreditCard className="w-4 h-4 text-neon-green" /> Onlayn to'lov (darhol)</p>
              <div className="grid grid-cols-2 gap-2.5">
                <button onClick={() => payOnline("payme")} disabled={payingProvider !== null}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-[#33b0b9]/40 bg-[#33b0b9]/10 hover:bg-[#33b0b9]/20 font-bold text-sm transition-all disabled:opacity-50" style={{ color: "#33b0b9" }}>
                  {payingProvider === "payme" ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Payme
                </button>
                <button onClick={() => payOnline("click")} disabled={payingProvider !== null}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-[#00A0E3]/40 bg-[#00A0E3]/10 hover:bg-[#00A0E3]/20 font-bold text-sm transition-all disabled:opacity-50" style={{ color: "#00A0E3" }}>
                  {payingProvider === "click" ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Click
                </button>
              </div>
              <p className="text-[11px] text-muted-foreground mt-2">To'langach coinlar avtomatik hisobingizga tushadi.</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-[11px] text-muted-foreground">yoki karta orqali (qo'lda)</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Qo'lda — karta o'tkazma + admin tasdiq */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-neon-blue/5 border border-neon-blue/20">
              <CreditCard className="w-5 h-5 text-neon-blue flex-shrink-0 mt-0.5" />
              <div className="flex-1 text-sm">
                <p className="text-muted-foreground mb-1">Quyidagi kartaga <strong className="text-foreground">{formatNumber(selectedPkg.uzs)} so'm</strong> o'tkazing:</p>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-base">{settings?.card_number}</span>
                  <button onClick={copyCard} className="p-1 hover:bg-accent rounded">
                    {copied ? <Check className="w-4 h-4 text-neon-green" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{settings?.card_owner}</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">To'lov izohi (ixtiyoriy)</label>
              <input value={note} onChange={e => setNote(e.target.value)}
                placeholder="Masalan: 14:30 da o'tkazdim, ismim Aliyev A." className="input-field text-sm" />
            </div>

            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground max-w-xs">
                O'tkazmani amalga oshirgach, "So'rov yuborish" bosing. Admin tekshirib tasdiqlaydi.
              </p>
              <button onClick={submitRequest} disabled={submitting} className="btn-primary py-2.5 px-5 text-sm flex items-center gap-2 disabled:opacity-50">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />} So'rov yuborish
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* So'rovlar tarixi */}
      {requests.length > 0 && (
        <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h3 className="font-semibold text-sm mb-3">Xarid so'rovlari</h3>
          <div className="space-y-2">
            {requests.map(r => (
              <div key={r.id} className="flex items-center justify-between p-3 rounded-xl bg-surface/50 text-sm">
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-neon-yellow" />
                  <span className="font-medium">{formatNumber(r.amount_coins)} coin</span>
                  <span className="text-muted-foreground">· {formatNumber(r.amount_uzs)} so'm</span>
                </div>
                {statusBadge(r.status)}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Sovg'alar tarixi */}
      {gifts.length > 0 && (
        <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h3 className="font-semibold text-sm mb-3 flex items-center gap-2"><Gift className="w-4 h-4 text-neon-yellow" /> Sovg'alar tarixi</h3>
          <div className="space-y-2">
            {gifts.map(g => (
              <div key={g.id} className="flex items-center justify-between p-3 rounded-xl bg-surface/50 text-sm">
                <span>{g.child?.full_name || "Farzand"} ga sovg'a qilindi</span>
                <span className="font-bold text-neon-yellow flex items-center gap-1"><Coins className="w-3.5 h-3.5" />{g.amount}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
