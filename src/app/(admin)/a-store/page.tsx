"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn, formatDate } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Save, X, Loader2, ShoppingBag, Package, CheckCircle2, XCircle, Clock, Image as ImageIcon } from "lucide-react";

export default function AdminStorePage() {
  const supabase = createClient();
  const [tab, setTab] = useState<"items" | "orders">("items");
  const [items, setItems] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Item form
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", description: "", image_url: "", price_coins: 100, category: "accessory", stock: 10 });
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    const { data: i } = await supabase.from("store_items").select("*").order("order_index");
    if (i) setItems(i);
    const { data: o } = await supabase.from("store_orders").select("*").order("created_at", { ascending: false });
    if (o) setOrders(o);
    setLoading(false);
  }

  async function saveItem() {
    if (!form.title.trim()) { toast.error("Nom kiriting"); return; }
    setSaving(true);
    const payload = { ...form, order_index: editId ? undefined : items.length, is_active: true };
    if (editId) {
      await supabase.from("store_items").update(payload).eq("id", editId);
      toast.success("Yangilandi");
    } else {
      await supabase.from("store_items").insert(payload);
      toast.success("Qo'shildi");
    }
    setShowForm(false); setSaving(false); setEditId(null);
    setForm({ title: "", description: "", image_url: "", price_coins: 100, category: "accessory", stock: 10 });
    load();
  }

  function openEdit(item: any) {
    setForm({ title: item.title, description: item.description || "", image_url: item.image_url || "", price_coins: item.price_coins, category: item.category, stock: item.stock });
    setEditId(item.id); setShowForm(true);
  }

  async function deleteItem(id: string) {
    if (!confirm("O'chirish?")) return;
    await supabase.from("store_items").delete().eq("id", id);
    toast.success("O'chirildi"); load();
  }

  async function toggleActive(id: string, current: boolean) {
    await supabase.from("store_items").update({ is_active: !current }).eq("id", id);
    load();
  }

  async function updateOrderStatus(orderId: string, newStatus: string) {
    await supabase.from("store_orders").update({ status: newStatus, updated_at: new Date().toISOString() }).eq("id", orderId);
    toast.success(`Holat: ${newStatus}`); load();
  }

  const statusConfig: Record<string, { label: string; color: string }> = {
    pending: { label: "Kutilmoqda", color: "text-neon-yellow bg-neon-yellow/10" },
    approved: { label: "Tasdiqlangan", color: "text-neon-blue bg-neon-blue/10" },
    delivered: { label: "Berildi", color: "text-neon-green bg-neon-green/10" },
    rejected: { label: "Rad etildi", color: "text-neon-red bg-neon-red/10" },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="font-display font-bold text-3xl">Do'kon boshqaruvi</h1>
          <p className="text-muted-foreground text-sm">{items.length} ta mahsulot · {orders.filter(o => o.status === "pending").length} ta yangi buyurtma</p></div>
        <button onClick={() => { setForm({ title: "", description: "", image_url: "", price_coins: 100, category: "accessory", stock: 10 }); setEditId(null); setShowForm(true); }}
          className="btn-primary py-2.5 px-5 flex items-center gap-2 text-sm"><Plus className="w-4 h-4" /> Mahsulot qo'shish</button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button onClick={() => setTab("items")} className={cn("px-5 py-2.5 rounded-xl text-sm font-medium transition-all", tab === "items" ? "bg-neon-purple/10 text-neon-purple border border-neon-purple/20" : "bg-surface text-muted-foreground")}>
          <ShoppingBag className="w-4 h-4 inline mr-1.5" /> Mahsulotlar ({items.length})</button>
        <button onClick={() => setTab("orders")} className={cn("px-5 py-2.5 rounded-xl text-sm font-medium transition-all", tab === "orders" ? "bg-neon-yellow/10 text-neon-yellow border border-neon-yellow/20" : "bg-surface text-muted-foreground")}>
          <Package className="w-4 h-4 inline mr-1.5" /> Buyurtmalar ({orders.filter(o => o.status === "pending").length} yangi)</button>
      </div>

      {/* Item form */}
      <AnimatePresence>
        {showForm && (
          <motion.div className="glass-card p-6" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="flex justify-between mb-4"><h2 className="font-semibold">{editId ? "Tahrirlash" : "Yangi mahsulot"}</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 hover:bg-accent rounded-lg"><X className="w-5 h-5" /></button></div>
            <div className="grid md:grid-cols-2 gap-4">
              <div><label className="text-sm font-medium mb-1 block">Nomi *</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="input-field" /></div>
              <div><label className="text-sm font-medium mb-1 block">Kategoriya</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="input-field"><option value="accessory">Aksessuar</option><option value="stationery">Kanselariya</option><option value="digital">Raqamli</option></select></div>
              <div className="md:col-span-2"><label className="text-sm font-medium mb-1 block">Tavsif</label><input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input-field" /></div>
              <div className="md:col-span-2"><label className="text-sm font-medium mb-1 block">Rasm URL</label><input value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} className="input-field" placeholder="https://..." /></div>
              <div><label className="text-sm font-medium mb-1 block">Narxi (coin)</label><input type="number" value={form.price_coins} onChange={e => setForm({ ...form, price_coins: +e.target.value })} className="input-field" /></div>
              <div><label className="text-sm font-medium mb-1 block">Zaxira soni</label><input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: +e.target.value })} className="input-field" /></div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setShowForm(false)} className="btn-ghost py-2 px-5 text-sm">Bekor</button>
              <button onClick={saveItem} disabled={saving} className="btn-primary py-2 px-5 text-sm flex items-center gap-2 disabled:opacity-50">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Saqlash</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Items */}
      {tab === "items" && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(item => (
            <div key={item.id} className={cn("glass-card overflow-hidden", !item.is_active && "opacity-50")}>
              {item.image_url ? (
                <div className="h-36 bg-surface overflow-hidden"><img src={item.image_url} alt={item.title} className="w-full h-full object-cover" /></div>
              ) : (
                <div className="h-36 bg-surface flex items-center justify-center"><ImageIcon className="w-10 h-10 text-muted-foreground/20" /></div>
              )}
              <div className="p-4">
                <div className="flex justify-between mb-2"><h3 className="font-semibold text-sm">{item.title}</h3>
                  <span className="text-sm font-bold text-neon-yellow">{item.price_coins} coin</span></div>
                <p className="text-xs text-muted-foreground mb-3">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Zaxira: {item.stock}</span>
                  <div className="flex gap-1">
                    <button onClick={() => toggleActive(item.id, item.is_active)} className="p-1.5 hover:bg-accent rounded text-xs">{item.is_active ? "🟢" : "⚪"}</button>
                    <button onClick={() => openEdit(item)} className="p-1.5 hover:bg-accent rounded text-muted-foreground"><Pencil className="w-3.5 h-3.5" /></button>
                    <button onClick={() => deleteItem(item.id)} className="p-1.5 hover:bg-neon-red/10 rounded text-muted-foreground hover:text-neon-red"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Orders */}
      {tab === "orders" && (
        <div className="glass-card overflow-hidden">
          <table className="w-full">
            <thead><tr className="border-b border-border/50 text-xs text-muted-foreground font-semibold">
              <th className="text-left px-5 py-3">Mahsulot</th><th className="text-center px-5 py-3">Narx</th>
              <th className="text-center px-5 py-3">Holat</th><th className="text-center px-5 py-3">Sana</th>
              <th className="text-right px-5 py-3">Amallar</th>
            </tr></thead>
            <tbody>
              {orders.length === 0 ? <tr><td colSpan={5} className="text-center py-8 text-muted-foreground">Buyurtma yo'q</td></tr> :
              orders.map(o => (
                <tr key={o.id} className="border-b border-border/30 hover:bg-surface/30">
                  <td className="px-5 py-3"><p className="font-medium text-sm">{o.item_title}</p><p className="text-[10px] text-muted-foreground">User: {o.user_id.substring(0, 8)}...</p></td>
                  <td className="px-5 py-3 text-center text-sm font-mono text-neon-yellow">{o.price_coins}</td>
                  <td className="px-5 py-3 text-center"><span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", statusConfig[o.status]?.color)}>{statusConfig[o.status]?.label}</span></td>
                  <td className="px-5 py-3 text-center text-xs text-muted-foreground">{formatDate(o.created_at)}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {o.status === "pending" && (<>
                        <button onClick={() => updateOrderStatus(o.id, "approved")} className="p-1.5 hover:bg-neon-green/10 rounded text-neon-green" title="Tasdiqlash"><CheckCircle2 className="w-4 h-4" /></button>
                        <button onClick={() => updateOrderStatus(o.id, "rejected")} className="p-1.5 hover:bg-neon-red/10 rounded text-neon-red" title="Rad etish"><XCircle className="w-4 h-4" /></button>
                      </>)}
                      {o.status === "approved" && (
                        <button onClick={() => updateOrderStatus(o.id, "delivered")} className="p-1.5 hover:bg-neon-green/10 rounded text-neon-green" title="Berildi"><Package className="w-4 h-4" /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
