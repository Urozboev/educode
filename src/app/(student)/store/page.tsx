"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn, formatDate } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  ShoppingBag, Coins, Lock, Unlock, Loader2, CheckCircle2, Package, Clock,
  Image as ImageIcon, X, Truck, Hand, Sparkles, GraduationCap, XCircle, MapPin,
} from "lucide-react";
import {
  ORDER_STATUS, ORDER_FLOW, UZ_REGIONS,
  emptyOrderForm, validateOrderForm, needsAddress, deliveryLabel, deliveryHint,
  categoryLabel, orderStatusLabel, orderStatusHint,
  type StoreItem, type StoreOrder, type OrderForm, type StoreDeliveryType,
} from "@/lib/store";
import { useI18n } from "@/lib/i18n";

const DELIVERY_ICON: Record<StoreDeliveryType, typeof Truck> = {
  delivery: Truck, pickup: Hand, digital: Sparkles,
};

export default function StorePage() {
  const { t } = useI18n();
  const supabase = createClient();
  const [items, setItems] = useState<StoreItem[]>([]);
  const [orders, setOrders] = useState<StoreOrder[]>([]);
  const [teachers, setTeachers] = useState<Record<string, string>>({});
  const [coins, setCoins] = useState(0);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"shop" | "orders">("shop");

  // Buyurtma formasi
  const [active, setActive] = useState<StoreItem | null>(null);
  const [form, setForm] = useState<OrderForm>(emptyOrderForm());
  const [placing, setPlacing] = useState(false);
  const [cancelling, setCancelling] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const [{ data: profile }, { data: i }, { data: o }] = await Promise.all([
      supabase.from("profiles").select("coins, full_name").eq("id", user.id).single(),
      supabase.from("store_items").select("*").eq("is_active", true).order("order_index"),
      supabase.from("store_orders").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
    ]);

    if (profile) {
      setCoins(profile.coins);
      // Formani profil ma'lumoti bilan oldindan to'ldiramiz
      setForm(f => ({
        ...f,
        full_name: f.full_name || profile.full_name || "",
        email: f.email || user.email || "",
      }));
    }
    if (i) setItems(i as StoreItem[]);
    if (o) setOrders(o as StoreOrder[]);

    // O'qituvchi sovg'asida kim taqdim etganini ko'rsatamiz
    const ownerIds = Array.from(new Set((i ?? []).map((x: any) => x.owner_id).filter(Boolean)));
    if (ownerIds.length) {
      const { data: t } = await supabase.from("profiles").select("id, full_name").in("id", ownerIds);
      if (t) setTeachers(Object.fromEntries(t.map((p: any) => [p.id, p.full_name])));
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => { load(); }, [load]);

  function openOrder(item: StoreItem) {
    if (coins < item.price_coins) { toast.error(t.store.notEnough); return; }
    if (item.stock <= 0) { toast.error(t.store.outOfStock); return; }
    setActive(item);
  }

  async function placeOrder() {
    if (!active) return;
    const err = validateOrderForm(form, active.delivery_type, t);
    if (err) { toast.error(err); return; }

    setPlacing(true);
    const { data, error } = await supabase.rpc("place_store_order", {
      p_item_id: active.id,
      p_full_name: form.full_name,
      p_phone: form.phone,
      p_email: form.email || null,
      p_region: form.region || null,
      p_district: form.district || null,
      p_address: form.address || null,
      p_landmark: form.landmark || null,
      p_note: form.note || null,
    });
    setPlacing(false);

    if (error) { toast.error(t.store.orderFailed + ": " + error.message); return; }
    if (!data?.ok) { toast.error(data?.message || t.store.orderRejected); return; }

    toast.success(data.message || t.store.orderPlaced);
    setActive(null);
    setForm(f => ({ ...emptyOrderForm(), full_name: f.full_name, phone: f.phone, email: f.email }));
    setTab("orders");
    load();
  }

  async function cancelOrder(orderId: string) {
    if (!confirm(t.store.confirmCancel)) return;
    setCancelling(orderId);
    const { data, error } = await supabase.rpc("cancel_my_store_order", { p_order_id: orderId });
    setCancelling(null);
    if (error || !data?.ok) { toast.error(data?.message || t.store.cancelFailed); return; }
    toast.success(t.store.cancelled);
    load();
  }

  if (loading) return (
    <div className="space-y-4 animate-pulse">
      <div className="glass-card h-24" />
      <div className="grid md:grid-cols-3 gap-4">{[1, 2, 3].map(i => <div key={i} className="glass-card h-52" />)}</div>
    </div>
  );

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display font-bold text-3xl mb-1">{t.store.title}</h1>
        <p className="text-muted-foreground">{t.store.subtitle}</p>
      </motion.div>

      <motion.div className="glass-card p-5 flex items-center justify-between" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-neon-yellow/10 border border-neon-yellow/20 flex items-center justify-center">
            <Coins className="w-6 h-6 text-neon-yellow" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t.store.balance}</p>
            <p className="font-display font-bold text-2xl text-neon-yellow">{coins} {t.common.coins}</p>
          </div>
        </div>
      </motion.div>

      <div className="flex gap-2">
        <button onClick={() => setTab("shop")} className={cn("px-5 py-2.5 rounded-xl text-sm font-medium transition-all", tab === "shop" ? "bg-neon-purple/10 text-neon-purple border border-neon-purple/20" : "bg-surface text-muted-foreground")}>
          <ShoppingBag className="w-4 h-4 inline mr-1.5" /> {t.store.tabShop}
        </button>
        <button onClick={() => setTab("orders")} className={cn("px-5 py-2.5 rounded-xl text-sm font-medium transition-all", tab === "orders" ? "bg-neon-yellow/10 text-neon-yellow border border-neon-yellow/20" : "bg-surface text-muted-foreground")}>
          <Package className="w-4 h-4 inline mr-1.5" /> {t.store.tabOrders} ({orders.length})
        </button>
      </div>

      {tab === "shop" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item, i) => {
            const DIcon = DELIVERY_ICON[item.delivery_type];
            const affordable = coins >= item.price_coins && item.stock > 0;
            return (
              <motion.div key={item.id} className="glass-card overflow-hidden flex flex-col" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                {item.image_url
                  ? <div className="h-40 bg-surface overflow-hidden"><img src={item.image_url} alt={item.title} className="w-full h-full object-cover hover:scale-105 transition-transform" /></div>
                  : <div className="h-40 bg-surface flex items-center justify-center"><ImageIcon className="w-12 h-12 text-muted-foreground/10" /></div>}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-display font-bold text-lg">{item.title}</h3>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground bg-surface px-2 py-1 rounded-md flex-shrink-0">
                      {categoryLabel(item.category, t)}
                    </span>
                  </div>

                  {item.owner_id && (
                    <p className="text-xs text-neon-blue flex items-center gap-1 mb-2">
                      <GraduationCap className="w-3.5 h-3.5" />
                      {teachers[item.owner_id] ?? "—"} {t.store.teacherGift}
                    </p>
                  )}

                  <p className="text-sm text-muted-foreground mb-3 flex-1">{item.description}</p>

                  <p className="text-xs text-muted-foreground flex items-center gap-1.5 mb-3">
                    <DIcon className="w-3.5 h-3.5" /> {deliveryLabel(item.delivery_type, t)}
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <div className="coin-badge"><Coins className="w-4 h-4" />{item.price_coins}</div>
                    <span className="text-xs text-muted-foreground">{item.stock > 0 ? `${item.stock} ${t.store.left}` : t.store.soldOut}</span>
                  </div>

                  <button
                    onClick={() => openOrder(item)}
                    disabled={!affordable}
                    className={cn("w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all",
                      affordable ? "btn-primary" : "bg-surface text-muted-foreground cursor-not-allowed")}
                  >
                    {affordable ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    {item.stock <= 0 ? t.store.soldOut : affordable ? t.store.exchange : `${t.store.needMore} ${item.price_coins - coins} ${t.common.coins}`}
                  </button>
                </div>
              </motion.div>
            );
          })}
          {items.length === 0 && (
            <div className="col-span-full text-center py-16">
              <ShoppingBag className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
              <p className="text-muted-foreground">{t.store.noItems}</p>
            </div>
          )}
        </div>
      )}

      {tab === "orders" && (
        <div className="space-y-3">
          {orders.length === 0 ? (
            <div className="text-center py-16">
              <Package className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
              <p className="text-muted-foreground">{t.store.noOrders}</p>
            </div>
          ) : orders.map(o => {
            const sc = ORDER_STATUS[o.status] ?? ORDER_STATUS.pending;
            const stepIdx = ORDER_FLOW.indexOf(o.status);
            const closed = o.status === "rejected" || o.status === "cancelled";
            return (
              <motion.div key={o.id} className="glass-card p-5 space-y-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center flex-shrink-0">
                    {o.status === "delivered" ? <CheckCircle2 className="w-5 h-5 text-neon-green" />
                      : closed ? <XCircle className="w-5 h-5 text-neon-red" />
                      : <Clock className="w-5 h-5 text-neon-yellow" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{o.item_title}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(o.created_at)} · {o.price_coins} {t.common.coins} · {deliveryLabel(o.delivery_type, t)}
                    </p>
                  </div>
                  <span className={cn("text-xs font-medium px-3 py-1 rounded-full border flex-shrink-0", sc.color)}>{orderStatusLabel(o.status, t)}</span>
                </div>

                {/* Bosqichlar chizig'i — faqat jarayondagi buyurtmalar uchun */}
                {!closed && (
                  <div className="flex items-center gap-1 pl-14">
                    {ORDER_FLOW.filter(s => o.delivery_type === "delivery" || s !== "shipped").map((s, idx, arr) => {
                      const flowIdx = ORDER_FLOW.indexOf(s);
                      const done = stepIdx >= flowIdx;
                      return (
                        <div key={s} className="flex items-center gap-1 flex-1 last:flex-none">
                          <div className={cn("h-1.5 rounded-full flex-1 min-w-[24px]", done ? "bg-neon-green" : "bg-surface")} />
                          {idx === arr.length - 1 && (
                            <span className="text-[10px] text-muted-foreground ml-1 whitespace-nowrap">
                              {orderStatusHint(o.status, t)}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {o.tracking_note && <p className="text-xs text-muted-foreground pl-14">{o.tracking_note}</p>}
                {o.reject_reason && <p className="text-xs text-neon-red pl-14">{t.store.reason}: {o.reject_reason}</p>}
                {o.refunded && (
                  <p className="text-xs text-neon-green pl-14">{o.price_coins} {t.store.refunded}</p>
                )}

                {o.status === "pending" && (
                  <div className="pl-14">
                    <button
                      onClick={() => cancelOrder(o.id)}
                      disabled={cancelling === o.id}
                      className="text-xs text-muted-foreground hover:text-neon-red transition disabled:opacity-50"
                    >
                      {cancelling === o.id ? t.store.cancelling : t.store.cancelOrder}
                    </button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ============ BUYURTMA FORMASI ============ */}
      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => !placing && setActive(null)}
          >
            <motion.div
              className="w-full md:max-w-lg max-h-[92vh] overflow-y-auto bg-card border border-border rounded-t-3xl md:rounded-3xl p-6 space-y-4"
              initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-display font-bold text-xl">{active.title}</h2>
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                    <Coins className="w-4 h-4 text-neon-yellow" /> {active.price_coins} coin
                    <span className="text-muted-foreground/50">·</span>
                    {deliveryLabel(active.delivery_type, t)}
                  </p>
                </div>
                <button onClick={() => setActive(null)} disabled={placing} className="p-2 rounded-lg hover:bg-surface transition">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-muted-foreground bg-surface/60 border border-border/60 rounded-xl p-3">
                {deliveryHint(active.delivery_type, t)}
                {" "}{t.store.privacyNote}
              </p>

              <div className="space-y-3">
                <Field label={t.store.formName + " *"} value={form.full_name} onChange={v => setForm({ ...form, full_name: v })} placeholder={t.store.phName} />
                <div className="grid grid-cols-2 gap-3">
                  <Field label={t.store.formPhone + " *"} value={form.phone} onChange={v => setForm({ ...form, phone: v })} placeholder="+998 90 123 45 67" />
                  <Field label={t.store.formEmail} value={form.email} onChange={v => setForm({ ...form, email: v })} placeholder="ali@mail.uz" />
                </div>

                {needsAddress(active.delivery_type) && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{t.store.formRegion} *</label>
                        <select
                          value={form.region}
                          onChange={e => setForm({ ...form, region: e.target.value })}
                          className="input-field w-full text-sm"
                        >
                          <option value="">{t.store.pickRegion}</option>
                          {UZ_REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </div>
                      <Field label={t.store.formDistrict} value={form.district} onChange={v => setForm({ ...form, district: v })} placeholder={t.store.phDistrict} />
                    </div>
                    <Field label={t.store.formAddress + " *"} value={form.address} onChange={v => setForm({ ...form, address: v })} placeholder={t.store.phAddress} textarea />
                    <Field label={t.store.formLandmark} value={form.landmark} onChange={v => setForm({ ...form, landmark: v })} placeholder={t.store.phLandmark} />
                  </>
                )}

                <Field label={t.store.formNote} value={form.note} onChange={v => setForm({ ...form, note: v })} placeholder={t.store.phNote} textarea />
              </div>

              <div className="flex items-center justify-between gap-3 pt-2 border-t border-border/60">
                <p className="text-sm text-muted-foreground">
                  {t.store.balanceShort}: <span className="text-neon-yellow font-semibold">{coins}</span>
                  {" → "}
                  <span className="font-semibold">{coins - active.price_coins}</span>
                </p>
                <button
                  onClick={placeOrder}
                  disabled={placing}
                  className="btn-primary px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 disabled:opacity-60"
                >
                  {placing ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
                  {placing ? t.store.placing : t.store.placeOrder}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, textarea }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; textarea?: boolean;
}) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{label}</label>
      {textarea ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className="input-field w-full text-sm min-h-[60px] resize-y" />
      ) : (
        <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className="input-field w-full text-sm" />
      )}
    </div>
  );
}
