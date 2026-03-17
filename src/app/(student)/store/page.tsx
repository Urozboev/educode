"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn, formatDate } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  ShoppingBag, Coins, Lock, Unlock, Loader2, CheckCircle2, Package,
  Clock, Star, Send, MessageSquare, Image as ImageIcon
} from "lucide-react";

export default function StorePage() {
  const supabase = createClient();
  const [items, setItems] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [coins, setCoins] = useState(0);
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState<string | null>(null);
  const [tab, setTab] = useState<"shop" | "orders" | "review">("shop");

  // Review form
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewSending, setReviewSending] = useState(false);
  const [reviewSent, setReviewSent] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const { data: profile } = await supabase.from("profiles").select("coins, full_name, avatar_url").eq("id", user.id).single();
      if (profile) { setCoins(profile.coins); setUserName(profile.full_name); }

      const { data: i } = await supabase.from("store_items").select("*").eq("is_active", true).order("order_index");
      if (i) setItems(i);

      const { data: o } = await supabase.from("store_orders").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
      if (o) setOrders(o);

      // Oldin izoh yozganmi
      const { data: existing } = await supabase.from("testimonials").select("id").eq("user_id", user.id).maybeSingle();
      if (existing) setReviewSent(true);

      setLoading(false);
    })();
  }, []);

  async function handleBuy(item: any) {
    if (coins < item.price_coins) { toast.error("Yetarli coin yo'q!"); return; }
    if (item.stock <= 0) { toast.error("Mahsulot tugagan"); return; }
    setBuying(item.id);

    const newBalance = coins - item.price_coins;
    await supabase.from("profiles").update({ coins: newBalance }).eq("id", userId);
    await supabase.from("coin_transactions").insert({
      user_id: userId, amount: -item.price_coins, type: "store_purchase",
      reference_id: item.id, description: `"${item.title}" sotib olindi`,
      balance_after: newBalance,
    });
    await supabase.from("store_orders").insert({
      user_id: userId, item_id: item.id, item_title: item.title, price_coins: item.price_coins,
    });
    await supabase.from("store_items").update({ stock: item.stock - 1 }).eq("id", item.id);

    setCoins(newBalance);
    setItems(items.map(i => i.id === item.id ? { ...i, stock: i.stock - 1 } : i));
    setOrders([{ item_title: item.title, price_coins: item.price_coins, status: "pending", created_at: new Date().toISOString() }, ...orders]);
    setBuying(null);
    toast.success(`"${item.title}" buyurtma qilindi! 🎉`);
  }

  async function submitReview() {
    if (!reviewText.trim() || reviewText.length < 10) { toast.error("Kamida 10 ta belgi yozing"); return; }
    setReviewSending(true);
    const { data: profile } = await supabase.from("profiles").select("full_name, avatar_url").eq("id", userId).single();
    await supabase.from("testimonials").insert({
      user_id: userId, full_name: profile?.full_name || userName,
      avatar_url: profile?.avatar_url, text: reviewText, rating: reviewRating,
    });
    setReviewSent(true); setReviewSending(false);
    toast.success("Izohingiz yuborildi! Admin tasdiqlangandan keyin bosh sahifada ko'rinadi.");
  }

  const statusConfig: Record<string, { label: string; icon: any; color: string }> = {
    pending: { label: "Kutilmoqda", icon: Clock, color: "text-neon-yellow" },
    approved: { label: "Tasdiqlangan", icon: CheckCircle2, color: "text-neon-blue" },
    delivered: { label: "Berildi", icon: Package, color: "text-neon-green" },
    rejected: { label: "Rad etildi", icon: Lock, color: "text-neon-red" },
  };

  if (loading) return <div className="space-y-4 animate-pulse"><div className="glass-card h-24" /><div className="grid md:grid-cols-3 gap-4">{[1,2,3].map(i=><div key={i} className="glass-card h-52" />)}</div></div>;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display font-bold text-3xl mb-1">Do'kon</h1>
        <p className="text-muted-foreground">Coinlaringiz bilan sovg'alar almashtiring</p>
      </motion.div>

      {/* Balance */}
      <motion.div className="glass-card p-5 flex items-center justify-between" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-neon-yellow/10 border border-neon-yellow/20 flex items-center justify-center"><Coins className="w-6 h-6 text-neon-yellow" /></div>
          <div><p className="text-sm text-muted-foreground">Balansingiz</p><p className="font-display font-bold text-2xl text-neon-yellow">{coins} coin</p></div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button onClick={() => setTab("shop")} className={cn("px-5 py-2.5 rounded-xl text-sm font-medium transition-all", tab === "shop" ? "bg-neon-purple/10 text-neon-purple border border-neon-purple/20" : "bg-surface text-muted-foreground")}>
          <ShoppingBag className="w-4 h-4 inline mr-1.5" /> Mahsulotlar</button>
        <button onClick={() => setTab("orders")} className={cn("px-5 py-2.5 rounded-xl text-sm font-medium transition-all", tab === "orders" ? "bg-neon-yellow/10 text-neon-yellow border border-neon-yellow/20" : "bg-surface text-muted-foreground")}>
          <Package className="w-4 h-4 inline mr-1.5" /> Buyurtmalarim ({orders.length})</button>
        <button onClick={() => setTab("review")} className={cn("px-5 py-2.5 rounded-xl text-sm font-medium transition-all", tab === "review" ? "bg-neon-green/10 text-neon-green border border-neon-green/20" : "bg-surface text-muted-foreground")}>
          <MessageSquare className="w-4 h-4 inline mr-1.5" /> Izoh yozish</button>
      </div>

      {/* SHOP TAB */}
      {tab === "shop" && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => {
            const canAfford = coins >= item.price_coins;
            const inStock = item.stock > 0;
            return (
              <motion.div key={item.id} className="glass-card overflow-hidden" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                {item.image_url ? (
                  <div className="h-40 bg-surface overflow-hidden"><img src={item.image_url} alt={item.title} className="w-full h-full object-cover hover:scale-105 transition-transform" /></div>
                ) : (
                  <div className="h-40 bg-surface flex items-center justify-center"><ImageIcon className="w-12 h-12 text-muted-foreground/10" /></div>
                )}
                <div className="p-5">
                  <h3 className="font-display font-bold text-lg mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="coin-badge"><Coins className="w-4 h-4" />{item.price_coins}</div>
                    <span className="text-xs text-muted-foreground">{item.stock > 0 ? `${item.stock} ta qoldi` : "Tugagan"}</span>
                  </div>
                  <button onClick={() => handleBuy(item)} disabled={!canAfford || !inStock || buying === item.id}
                    className={cn("w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all",
                      canAfford && inStock ? "btn-primary" : "bg-surface text-muted-foreground cursor-not-allowed")}>
                    {buying === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : canAfford && inStock ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    {buying === item.id ? "..." : !inStock ? "Tugagan" : canAfford ? "Almashish" : "Yetarli emas"}
                  </button>
                </div>
              </motion.div>
            );
          })}
          {items.length === 0 && <div className="col-span-3 text-center py-16"><ShoppingBag className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" /><p className="text-muted-foreground">Hozircha mahsulot yo'q</p></div>}
        </div>
      )}

      {/* ORDERS TAB */}
      {tab === "orders" && (
        <div className="space-y-3">
          {orders.length === 0 ? <div className="text-center py-16"><Package className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" /><p className="text-muted-foreground">Buyurtma yo'q</p></div> :
          orders.map((o, i) => {
            const sc = statusConfig[o.status] || statusConfig.pending;
            return (
              <motion.div key={o.id || i} className="glass-card p-4 flex items-center gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", `${sc.color.replace("text-", "bg-")}/10`)}>
                  <sc.icon className={cn("w-5 h-5", sc.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{o.item_title}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(o.created_at)} · {o.price_coins} coin</p>
                </div>
                <span className={cn("text-xs font-medium px-3 py-1 rounded-full", sc.color, `${sc.color.replace("text-", "bg-")}/10`)}>{sc.label}</span>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* REVIEW TAB */}
      {tab === "review" && (
        <motion.div className="glass-card p-6 max-w-xl" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="font-display font-semibold text-lg mb-2">Tizim haqida izoh yozing</h2>
          <p className="text-sm text-muted-foreground mb-5">Izohingiz admin tasdiqlangandan keyin bosh sahifada ko'rinadi.</p>
          {reviewSent ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-12 h-12 text-neon-green mx-auto mb-3" />
              <p className="font-semibold">Izohingiz yuborildi!</p>
              <p className="text-sm text-muted-foreground">Admin tasdiqlashini kuting.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Baho</label>
                <div className="flex gap-1">{[1,2,3,4,5].map(n => (
                  <button key={n} onClick={() => setReviewRating(n)}>
                    <Star className={cn("w-7 h-7 transition-all", n <= reviewRating ? "text-neon-yellow fill-neon-yellow" : "text-muted-foreground/30")} />
                  </button>
                ))}</div>
              </div>
              <div><label className="text-sm font-medium mb-1 block">Izoh matni</label>
                <textarea value={reviewText} onChange={e => setReviewText(e.target.value)} className="input-field min-h-[100px]"
                  placeholder="Platforma haqida fikringiz..." maxLength={500} />
                <p className="text-xs text-muted-foreground mt-1">{reviewText.length}/500</p>
              </div>
              <button onClick={submitReview} disabled={reviewSending || reviewText.length < 10}
                className="btn-primary py-3 px-6 flex items-center gap-2 disabled:opacity-50">
                {reviewSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Yuborish
              </button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
