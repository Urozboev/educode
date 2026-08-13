"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn, formatNumber, formatRelativeDate } from "@/lib/utils";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Coins, Loader2, CheckCircle2, XCircle, Clock, User, CreditCard,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface Req {
  id: string;
  parent_id: string;
  parent_name: string;
  amount_coins: number;
  amount_uzs: number;
  payment_note: string | null;
  status: string;
  created_at: string;
  review_note: string | null;
}

export default function AdminPaymentsPage() {
  const { t } = useI18n();
  const supabase = createClient();
  const [requests, setRequests] = useState<Req[]>([]);
  const [filter, setFilter] = useState<"pending" | "all">("pending");
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    let q = supabase
      .from("coin_purchase_requests")
      .select("*, parent:profiles!coin_purchase_requests_parent_id_fkey(full_name)")
      .order("created_at", { ascending: false });
    if (filter === "pending") q = q.eq("status", "pending");

    const { data } = await q.limit(100);
    setRequests(
      (data || []).map((r: any) => ({
        id: r.id, parent_id: r.parent_id,
        parent_name: r.parent?.full_name || "Ota-ona",
        amount_coins: r.amount_coins, amount_uzs: r.amount_uzs,
        payment_note: r.payment_note, status: r.status,
        created_at: r.created_at, review_note: r.review_note,
      })),
    );
    setLoading(false);
  }, [supabase, filter]);

  useEffect(() => { load(); }, [load]);

  async function review(id: string, approve: boolean) {
    let note: string | null = null;
    if (!approve) {
      note = prompt("Rad etish sababi (ixtiyoriy):") || null;
    }
    setActing(id);
    const { data, error } = await supabase.rpc("approve_coin_purchase", {
      p_request_id: id, p_approve: approve, p_note: note,
    });
    setActing(null);
    if (error) { toast.error(error.message); return; }
    if (!data?.ok) { toast.error(data?.error || "Xatolik"); return; }
    toast.success(data.message);
    load();
  }

  const pendingCount = requests.filter(r => r.status === "pending").length;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl">{t.admin.pay.title}</h1>
          <p className="text-sm text-muted-foreground">{t.admin.pay.subtitle}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setFilter("pending")}
            className={cn("px-4 py-2 rounded-xl text-sm font-medium transition-all",
              filter === "pending" ? "bg-neon-yellow/10 text-neon-yellow border border-neon-yellow/30" : "bg-surface text-muted-foreground")}>
            Kutilmoqda {filter === "pending" && pendingCount > 0 && `(${pendingCount})`}
          </button>
          <button onClick={() => setFilter("all")}
            className={cn("px-4 py-2 rounded-xl text-sm font-medium transition-all",
              filter === "all" ? "bg-neon-purple/10 text-neon-purple border border-neon-purple/30" : "bg-surface text-muted-foreground")}>
            Hammasi
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="glass-card h-24 animate-pulse" />)}</div>
      ) : requests.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Coins className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">{filter === "pending" ? "Kutilayotgan so'rov yo'q" : "So'rovlar yo'q"}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((r, i) => (
            <motion.div key={r.id} className="glass-card p-5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-neon-blue/10 flex items-center justify-center text-neon-blue flex-shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold">{r.parent_name}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-1 text-sm">
                      <span className="flex items-center gap-1 text-neon-yellow font-bold"><Coins className="w-4 h-4" />{formatNumber(r.amount_coins)} coin</span>
                      <span className="flex items-center gap-1 text-muted-foreground"><CreditCard className="w-4 h-4" />{formatNumber(r.amount_uzs)} so'm</span>
                      <span className="text-xs text-muted-foreground">{formatRelativeDate(r.created_at)}</span>
                    </div>
                    {r.payment_note && (
                      <p className="text-xs text-muted-foreground mt-1.5 p-2 rounded-lg bg-surface/50">📝 {r.payment_note}</p>
                    )}
                    {r.review_note && (
                      <p className="text-xs text-neon-red mt-1.5">Sabab: {r.review_note}</p>
                    )}
                  </div>
                </div>

                {r.status === "pending" ? (
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => review(r.id, true)} disabled={acting === r.id}
                      className="px-4 py-2 rounded-xl bg-neon-green/10 text-neon-green border border-neon-green/30 hover:bg-neon-green/20 text-sm font-medium flex items-center gap-1.5 disabled:opacity-50">
                      {acting === r.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />} Tasdiqlash
                    </button>
                    <button onClick={() => review(r.id, false)} disabled={acting === r.id}
                      className="px-4 py-2 rounded-xl bg-neon-red/10 text-neon-red border border-neon-red/30 hover:bg-neon-red/20 text-sm font-medium flex items-center gap-1.5 disabled:opacity-50">
                      <XCircle className="w-4 h-4" /> Rad
                    </button>
                  </div>
                ) : (
                  <span className={cn("flex items-center gap-1 text-xs font-medium flex-shrink-0 px-3 py-1.5 rounded-lg",
                    r.status === "approved" ? "bg-neon-green/10 text-neon-green" : "bg-neon-red/10 text-neon-red")}>
                    {r.status === "approved" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                    {r.status === "approved" ? "Tasdiqlangan" : "Rad etilgan"}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
