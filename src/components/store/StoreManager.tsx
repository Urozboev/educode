"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn, formatDateTime } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Plus, Pencil, Trash2, Save, X, Loader2, ShoppingBag, Package,
  Eye, EyeOff, Phone, Mail, MapPin, User, Coins, Truck, Hand, Sparkles,
  ChevronDown, ChevronUp, Users, Globe,
} from "lucide-react";
import {
  DELIVERY_TYPES, ORDER_STATUS, STORE_CATEGORIES, nextStatuses,
  deliveryLabel, categoryLabel,
  type StoreItem, type StoreOrder, type StoreOrderStatus, type StoreDeliveryType,
  type StoreAudience,
} from "@/lib/store";
import { useI18n } from "@/lib/i18n";

const DELIVERY_ICON: Record<StoreDeliveryType, typeof Truck> = {
  delivery: Truck, pickup: Hand, digital: Sparkles,
};

/**
 * Do'kon boshqaruvi — admin va o'qituvchi bir xil komponentdan foydalanadi.
 *
 * Farqi faqat `scope` da:
 *   admin   — barcha sovg'a va buyurtmalarni ko'radi, platforma sovg'asini
 *             yaratadi (owner_id NULL)
 *   teacher — faqat o'zining sovg'alarini va o'z sovg'asiga kelgan
 *             buyurtmalarni ko'radi; sovg'asi faqat o'z o'quvchilariga chiqadi
 *
 * Ro'yxatlarni RLS filtrlaydi, shuning uchun bu komponent qo'shimcha
 * xavfsizlik qatlami emas — u faqat interfeysni moslashtiradi.
 */
export default function StoreManager({ scope }: { scope: "admin" | "teacher" }) {
  const { t } = useI18n();
  const supabase = createClient();
  const [tab, setTab] = useState<"items" | "orders">("items");
  const [items, setItems] = useState<StoreItem[]>([]);
  const [orders, setOrders] = useState<StoreOrder[]>([]);
  const [buyers, setBuyers] = useState<Record<string, string>>({});
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", image_url: "",
    price_coins: scope === "teacher" ? 150 : 300,
    category: "accessory", stock: 10,
    delivery_type: (scope === "teacher" ? "pickup" : "delivery") as StoreDeliveryType,
    audience: (scope === "teacher" ? "my_students" : "everyone") as StoreAudience,
  });

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setUserId(user.id);

    let itemsQuery = supabase.from("store_items").select("*").order("order_index");
    if (scope === "teacher") itemsQuery = itemsQuery.eq("owner_id", user.id);
    else itemsQuery = itemsQuery.is("owner_id", null);

    const [{ data: i }, { data: o }] = await Promise.all([
      itemsQuery,
      supabase.from("store_orders").select("*").order("created_at", { ascending: false }),
    ]);

    if (i) setItems(i as StoreItem[]);
    if (o) setOrders(o as StoreOrder[]);

    const userIds = Array.from(new Set((o ?? []).map((x: any) => x.user_id)));
    if (userIds.length) {
      const { data: p } = await supabase.from("profiles").select("id, full_name").in("id", userIds);
      if (p) setBuyers(Object.fromEntries(p.map((x: any) => [x.id, x.full_name])));
    }
    setLoading(false);
  }, [supabase, scope]);

  useEffect(() => { load(); }, [load]);

  function resetForm() {
    setForm({
      title: "", description: "", image_url: "",
      price_coins: scope === "teacher" ? 150 : 300,
      category: "accessory", stock: 10,
      delivery_type: scope === "teacher" ? "pickup" : "delivery",
      audience: scope === "teacher" ? "my_students" : "everyone",
    });
    setEditId(null);
  }

  async function saveItem() {
    if (!form.title.trim()) { toast.error(t.store.enterName); return; }
    if (form.price_coins < 1) { toast.error(t.store.priceMin); return; }
    if (form.stock < 0) { toast.error(t.store.stockNonNegative); return; }

    setSaving(true);
    const payload: any = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      image_url: form.image_url.trim() || null,
      price_coins: form.price_coins,
      category: form.category,
      stock: form.stock,
      delivery_type: form.delivery_type,
      // O'qituvchi sovg'asi har doim o'ziniki va faqat o'z o'quvchilariga
      owner_id: scope === "teacher" ? userId : null,
      audience: scope === "teacher" ? "my_students" : form.audience,
    };

    const { error } = editId
      ? await supabase.from("store_items").update({ ...payload, updated_at: new Date().toISOString() }).eq("id", editId)
      : await supabase.from("store_items").insert({ ...payload, order_index: items.length, is_active: true });

    setSaving(false);
    if (error) { toast.error(t.admin.common.saveFailed + ": " + error.message); return; }
    toast.success(editId ? t.store.updatedToast : t.store.giftAdded);
    setShowForm(false);
    resetForm();
    load();
  }

  function openEdit(item: StoreItem) {
    setForm({
      title: item.title, description: item.description || "", image_url: item.image_url || "",
      price_coins: item.price_coins, category: item.category, stock: item.stock,
      delivery_type: item.delivery_type, audience: item.audience,
    });
    setEditId(item.id);
    setShowForm(true);
  }

  async function deleteItem(id: string) {
    if (!confirm(t.store.confirmDelete)) return;
    const { error } = await supabase.from("store_items").delete().eq("id", id);
    if (error) { toast.error(t.store.manage.deleteFailed + ": " + error.message); return; }
    toast.success(t.store.manage.deleted);
    load();
  }

  async function toggleActive(item: StoreItem) {
    const { error } = await supabase.from("store_items")
      .update({ is_active: !item.is_active, updated_at: new Date().toISOString() })
      .eq("id", item.id);
    if (error) { toast.error(error.message); return; }
    load();
  }

  // Faqat shu kishiga tegishli buyurtmalar (RLS allaqachon filtrlagan,
  // lekin admin uchun platforma buyurtmalarini ajratib ko'rsatamiz)
  const visibleOrders = scope === "teacher"
    ? orders.filter(o => o.seller_id === userId)
    : orders;

  const pendingCount = visibleOrders.filter(o => o.status === "pending").length;

  if (loading) return (
    <div className="space-y-4 animate-pulse">
      <div className="glass-card h-16" />
      <div className="grid md:grid-cols-2 gap-4">{[1, 2, 3, 4].map(i => <div key={i} className="glass-card h-32" />)}</div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display font-bold text-3xl">
            {scope === "teacher" ? t.store.myGifts : t.store.manageTitle}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {scope === "teacher"
              ? t.store.teacherSubtitle
              : t.store.adminSubtitle}
          </p>
        </div>
        {tab === "items" && (
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> {t.store.addGift}
          </button>
        )}
      </div>

      <div className="flex gap-2">
        <button onClick={() => setTab("items")} className={cn("px-5 py-2.5 rounded-xl text-sm font-medium transition-all", tab === "items" ? "bg-neon-purple/10 text-neon-purple border border-neon-purple/20" : "bg-surface text-muted-foreground")}>
          <ShoppingBag className="w-4 h-4 inline mr-1.5" /> Sovg'alar ({items.length})
        </button>
        <button onClick={() => setTab("orders")} className={cn("px-5 py-2.5 rounded-xl text-sm font-medium transition-all relative", tab === "orders" ? "bg-neon-yellow/10 text-neon-yellow border border-neon-yellow/20" : "bg-surface text-muted-foreground")}>
          <Package className="w-4 h-4 inline mr-1.5" /> Buyurtmalar ({visibleOrders.length})
          {pendingCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1.5 rounded-full bg-neon-red text-white text-[10px] font-bold flex items-center justify-center">
              {pendingCount}
            </span>
          )}
        </button>
      </div>

      {tab === "items" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map(item => {
            const DIcon = DELIVERY_ICON[item.delivery_type];
            return (
              <div key={item.id} className={cn("glass-card p-4 space-y-3", !item.is_active && "opacity-60")}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-semibold truncate">{item.title}</h3>
                    <p className="text-xs text-muted-foreground">{categoryLabel(item.category)}</p>
                  </div>
                  <div className="coin-badge flex-shrink-0"><Coins className="w-3.5 h-3.5" />{item.price_coins}</div>
                </div>

                {item.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                )}

                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><DIcon className="w-3.5 h-3.5" /> {deliveryLabel(item.delivery_type)}</span>
                  <span className="flex items-center gap-1">
                    {item.audience === "my_students" ? <Users className="w-3.5 h-3.5" /> : <Globe className="w-3.5 h-3.5" />}
                    {item.audience === "my_students" ? "O'quvchilarim" : "Hammaga"}
                  </span>
                  <span className={cn(item.stock <= 0 && "text-neon-red")}>{item.stock} ta</span>
                </div>

                <div className="flex items-center gap-1.5 pt-1">
                  <button onClick={() => openEdit(item)} className="flex-1 py-2 rounded-lg bg-surface hover:bg-surface/70 text-xs font-medium flex items-center justify-center gap-1.5 transition">
                    <Pencil className="w-3.5 h-3.5" /> Tahrirlash
                  </button>
                  <button onClick={() => toggleActive(item)} title={item.is_active ? "Yashirish" : "Ko'rsatish"} className="p-2 rounded-lg bg-surface hover:bg-surface/70 transition">
                    {item.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 text-muted-foreground" />}
                  </button>
                  <button onClick={() => deleteItem(item.id)} className="p-2 rounded-lg bg-surface hover:bg-neon-red/10 hover:text-neon-red transition">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
          {items.length === 0 && (
            <div className="col-span-full text-center py-16">
              <ShoppingBag className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
              <p className="text-muted-foreground">{t.store.manage.noGifts}</p>
            </div>
          )}
        </div>
      )}

      {tab === "orders" && (
        <OrderList orders={visibleOrders} buyers={buyers} onChanged={load} />
      )}

      {/* ============ SOVG'A FORMASI ============ */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => !saving && setShowForm(false)}
          >
            <motion.div
              className="w-full md:max-w-lg max-h-[92vh] overflow-y-auto bg-card border border-border rounded-t-3xl md:rounded-3xl p-6 space-y-4"
              initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h2 className="font-display font-bold text-xl">{editId ? t.misc.editGift : t.misc.newGift}</h2>
                <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-surface transition"><X className="w-5 h-5" /></button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{t.store.manage.nameLabel} *</label>
                  <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                    className="input-field w-full text-sm" placeholder={t.store.manage.namePh} />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{t.store.manage.descLabel}</label>
                  <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                    className="input-field w-full text-sm min-h-[70px] resize-y" placeholder="Nima ekani, o'lchami, ranggi..." />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{t.store.manage.imageLabel}</label>
                  <input value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })}
                    className="input-field w-full text-sm" placeholder="https://..." />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{t.store.manage.priceLabel} *</label>
                    <input type="number" min={1} value={form.price_coins}
                      onChange={e => setForm({ ...form, price_coins: +e.target.value })}
                      className="input-field w-full text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{t.store.manage.stockLabel}</label>
                    <input type="number" min={0} value={form.stock}
                      onChange={e => setForm({ ...form, stock: +e.target.value })}
                      className="input-field w-full text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{t.store.manage.categoryLabel}</label>
                    <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                      className="input-field w-full text-sm">
                      {STORE_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{t.store.manage.deliveryLabel}</label>
                  <div className="grid grid-cols-3 gap-2">
                    {DELIVERY_TYPES.map(d => {
                      const Icon = DELIVERY_ICON[d.value];
                      return (
                        <button
                          key={d.value}
                          onClick={() => setForm({ ...form, delivery_type: d.value })}
                          className={cn("p-3 rounded-xl border text-left transition",
                            form.delivery_type === d.value
                              ? "border-neon-purple bg-neon-purple/10"
                              : "border-border hover:border-neon-purple/40")}
                        >
                          <Icon className="w-4 h-4 mb-1" />
                          <p className="text-xs font-semibold">{d.label}</p>
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1.5">
                    {DELIVERY_TYPES.find(d => d.value === form.delivery_type)?.hint}
                  </p>
                </div>

                {scope === "admin" ? (
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{t.store.manage.audienceLabel}</label>
                    <select value={form.audience} onChange={e => setForm({ ...form, audience: e.target.value as StoreAudience })}
                      className="input-field w-full text-sm">
                      <option value="everyone">{t.store.manage.audienceAll}</option>
                    </select>
                  </div>
                ) : (
                  <p className="text-xs text-neon-blue bg-neon-blue/10 border border-neon-blue/20 rounded-xl p-3 flex items-start gap-2">
                    <Users className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    {t.store.myStudentsOnly}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border/60">
                <button onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-xl bg-surface text-sm font-medium">{t.common.cancel}</button>
                <button onClick={saveItem} disabled={saving}
                  className="btn-primary px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 disabled:opacity-60">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? t.misc.saving : t.misc.save}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ============================================================
   BUYURTMALAR RO'YXATI
   ============================================================ */
function OrderList({ orders, buyers, onChanged }: {
  orders: StoreOrder[];
  buyers: Record<string, string>;
  onChanged: () => void;
}) {
  const { t } = useI18n();
  const supabase = createClient();
  const [open, setOpen] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [filter, setFilter] = useState<StoreOrderStatus | "all">("all");

  const shown = filter === "all" ? orders : orders.filter(o => o.status === filter);

  async function setStatus(order: StoreOrder, status: StoreOrderStatus) {
    if ((status === "rejected" || status === "cancelled") && !note.trim()) {
      if (!confirm(t.store.manage.confirmRejectNoReason)) return;
    }
    setBusy(order.id);
    const { data, error } = await supabase.rpc("update_store_order", {
      p_order_id: order.id,
      p_status: status,
      p_note: note.trim() || null,
    });
    setBusy(null);
    if (error || !data?.ok) { toast.error(data?.message || error?.message || "O'zgartirilmadi"); return; }
    toast.success(data.refunded ? t.misc.statusChanged : "Holat o'zgardi");
    setNote("");
    onChanged();
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-1.5 flex-wrap">
        <FilterChip active={filter === "all"} onClick={() => setFilter("all")} label={`Hammasi (${orders.length})`} />
        {(Object.keys(ORDER_STATUS) as StoreOrderStatus[]).map(s => {
          const n = orders.filter(o => o.status === s).length;
          if (!n) return null;
          return <FilterChip key={s} active={filter === s} onClick={() => setFilter(s)} label={`${ORDER_STATUS[s].label} (${n})`} />;
        })}
      </div>

      {shown.length === 0 ? (
        <div className="text-center py-16">
          <Package className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
          <p className="text-muted-foreground">{t.store.manage.noOrders}</p>
        </div>
      ) : shown.map(o => {
        const sc = ORDER_STATUS[o.status] ?? ORDER_STATUS.pending;
        const expanded = open === o.id;
        const actions = nextStatuses(o);
        const DIcon = DELIVERY_ICON[o.delivery_type];
        return (
          <div key={o.id} className="glass-card overflow-hidden">
            <button
              onClick={() => { setOpen(expanded ? null : o.id); setNote(""); }}
              className="w-full p-4 flex items-center gap-4 text-left hover:bg-surface/40 transition"
            >
              <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center flex-shrink-0">
                <DIcon className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{o.item_title}</p>
                <p className="text-xs text-muted-foreground">
                  {buyers[o.user_id] ?? t.misc.student} · {formatDateTime(o.created_at)} · {o.price_coins} coin
                </p>
              </div>
              <span className={cn("text-xs font-medium px-3 py-1 rounded-full border flex-shrink-0", sc.color)}>{sc.label}</span>
              {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
            </button>

            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden border-t border-border/60"
                >
                  <div className="p-4 space-y-4">
                    {/* Aloqa va manzil */}
                    <div className="grid sm:grid-cols-2 gap-3">
                      <InfoRow icon={User} label={t.store.manage.recipient} value={o.full_name} />
                      <InfoRow icon={Phone} label={t.store.formPhone} value={o.phone} href={o.phone ? `tel:${o.phone.replace(/\s/g, "")}` : undefined} />
                      {o.email && <InfoRow icon={Mail} label={t.store.manage.email} value={o.email} href={`mailto:${o.email}`} />}
                      <InfoRow icon={DIcon} label={t.store.manage.handOver} value={deliveryLabel(o.delivery_type, t)} />
                    </div>

                    {(o.region || o.address) && (
                      <div className="bg-surface/60 border border-border/60 rounded-xl p-3 space-y-1">
                        <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5" /> Yetkazib berish manzili
                        </p>
                        <p className="text-sm">
                          {[o.region, o.district].filter(Boolean).join(", ")}
                        </p>
                        {o.address && <p className="text-sm">{o.address}</p>}
                        {o.landmark && <p className="text-xs text-muted-foreground">Mo'ljal: {o.landmark}</p>}
                      </div>
                    )}

                    {o.note && (
                      <p className="text-sm bg-surface/60 border border-border/60 rounded-xl p-3">
                        <span className="text-xs text-muted-foreground block mb-1">{t.store.manage.studentNote}</span>
                        {o.note}
                      </p>
                    )}

                    {o.tracking_note && <p className="text-xs text-muted-foreground">Oxirgi izoh: {o.tracking_note}</p>}
                    {o.reject_reason && <p className="text-xs text-neon-red">Rad sababi: {o.reject_reason}</p>}
                    {o.refunded && <p className="text-xs text-neon-green">{o.price_coins} coin o'quvchiga qaytarilgan</p>}

                    {/* Harakatlar */}
                    {actions.length > 0 ? (
                      <div className="space-y-2 pt-2 border-t border-border/60">
                        <input
                          value={note}
                          onChange={e => setNote(e.target.value)}
                          placeholder={t.misc.trackingNotePh}
                          className="input-field w-full text-sm"
                        />
                        <div className="flex gap-2 flex-wrap">
                          {actions.map(s => (
                            <button
                              key={s}
                              onClick={() => setStatus(o, s)}
                              disabled={busy === o.id}
                              className={cn("px-4 py-2 rounded-xl text-xs font-semibold border transition disabled:opacity-50",
                                s === "rejected"
                                  ? "border-neon-red/30 text-neon-red hover:bg-neon-red/10"
                                  : "border-neon-green/30 text-neon-green hover:bg-neon-green/10")}
                            >
                              {busy === o.id ? "..." : ORDER_STATUS[s].label}
                            </button>
                          ))}
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                          Rad etilsa yoki bekor qilinsa {o.price_coins} coin avtomatik qaytariladi.
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground pt-2 border-t border-border/60">
                        {t.store.orderClosed}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

function FilterChip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button onClick={onClick} className={cn("px-3.5 py-1.5 rounded-lg text-xs font-medium transition",
      active ? "bg-neon-purple/10 text-neon-purple border border-neon-purple/20" : "bg-surface text-muted-foreground border border-transparent")}>
      {label}
    </button>
  );
}

function InfoRow({ icon: Icon, label, value, href }: {
  icon: typeof User; label: string; value: string | null; href?: string;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
      <div className="min-w-0">
        <p className="text-[11px] text-muted-foreground">{label}</p>
        {href
          ? <a href={href} className="text-sm font-medium hover:text-neon-purple transition break-all">{value}</a>
          : <p className="text-sm font-medium break-words">{value}</p>}
      </div>
    </div>
  );
}
