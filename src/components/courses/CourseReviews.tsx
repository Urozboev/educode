"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn, formatDate, getInitials } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Star, Loader2, Pencil, Trash2, MessageSquare, BadgeCheck, EyeOff } from "lucide-react";
import { useI18n } from "@/lib/i18n";

/**
 * Kurs baholari va izohlari.
 *
 * Baho qoldirish faqat kursga yozilganlarga ochiq (`upsert_course_review`
 * ichida tekshiriladi) — aks holda kursni ko'rmagan odam ham reytingga
 * ta'sir qilardi. Bir foydalanuvchi bitta izoh yozadi va uni tahrirlaydi.
 */

interface Review {
  id: string;
  user_id: string;
  full_name: string;
  username: string | null;
  avatar_url: string | null;
  rating: number;
  comment: string | null;
  is_hidden: boolean;
  created_at: string;
  completed: boolean;
}

export function CourseReviews({
  courseId,
  isEnrolled,
}: {
  courseId: string;
  isEnrolled: boolean;
}) {
  const { t } = useI18n();
  const supabase = createClient();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [me, setMe] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Forma
  const [editing, setEditing] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const [{ data: { user } }, { data }] = await Promise.all([
      supabase.auth.getUser(),
      supabase.rpc("course_reviews_list", { p_course_id: courseId, p_limit: 100 }),
    ]);
    setMe(user?.id ?? null);
    const rows = (data ?? []) as Review[];
    setReviews(rows);

    const mine = rows.find(r => r.user_id === user?.id);
    if (mine) { setRating(mine.rating); setComment(mine.comment ?? ""); }
    setLoading(false);
  }, [supabase, courseId]);

  useEffect(() => { load(); }, [load]);

  const myReview = reviews.find(r => r.user_id === me);
  const count = reviews.length;
  const avg = count ? reviews.reduce((s, r) => s + r.rating, 0) / count : 0;

  // 5→1 yulduzcha taqsimoti
  const dist = [5, 4, 3, 2, 1].map(star => ({
    star,
    n: reviews.filter(r => r.rating === star).length,
  }));

  async function save() {
    if (rating < 1) { toast.error(t.reviews.pickStar); return; }
    setSaving(true);
    const { data, error } = await supabase.rpc("upsert_course_review", {
      p_course_id: courseId,
      p_rating: rating,
      p_comment: comment || null,
    });
    setSaving(false);
    if (error || !data?.ok) { toast.error(data?.message || error?.message || t.admin.common.saveFailed); return; }
    toast.success(myReview ? "Izoh yangilandi" : "Rahmat! Izohingiz qo'shildi");
    setEditing(false);
    load();
  }

  async function remove() {
    if (!myReview || !confirm("Izohingizni o'chirasizmi?")) return;
    const { error } = await supabase.from("course_reviews").delete().eq("id", myReview.id);
    if (error) { toast.error(error.message); return; }
    setRating(0); setComment(""); setEditing(false);
    toast.success("O'chirildi");
    load();
  }

  if (loading) return <div className="glass-card h-40 animate-pulse" />;

  return (
    <section className="space-y-5">
      <div className="flex items-end justify-between gap-4">
        <h2 className="font-display font-bold text-2xl tracking-tight">{t.reviews.title}</h2>
        {count > 0 && (
          <span className="text-sm text-muted-foreground">
            <span className="numeric">{count}</span> ta izoh
          </span>
        )}
      </div>

      {/* Umumiy baho */}
      {count > 0 && (
        <div className="flex flex-col sm:flex-row gap-6 p-5 rounded-2xl border border-border/60 bg-card/40">
          <div className="text-center sm:text-left flex-shrink-0">
            <p className="numeric font-display font-extrabold text-4xl">{avg.toFixed(1)}</p>
            <Stars value={Math.round(avg)} readOnly size="sm" />
            <p className="text-xs text-muted-foreground mt-1">
              <span className="numeric">{count}</span> ta baho asosida
            </p>
          </div>

          <div className="flex-1 space-y-1 min-w-0">
            {dist.map(d => (
              <div key={d.star} className="flex items-center gap-2">
                <span className="numeric text-xs text-muted-foreground w-3">{d.star}</span>
                <Star className="w-3 h-3 text-neon-yellow flex-shrink-0" fill="currentColor" />
                <div className="flex-1 h-1.5 rounded-full bg-surface overflow-hidden">
                  <div
                    className="h-full bg-neon-yellow rounded-full transition-all"
                    style={{ width: count ? `${(d.n / count) * 100}%` : "0%" }}
                  />
                </div>
                <span className="numeric text-xs text-muted-foreground w-6 text-right">{d.n}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* O'z bahosi */}
      {me && (
        isEnrolled ? (
          myReview && !editing ? (
            <div className="p-5 rounded-2xl border border-neon-purple/25 bg-neon-purple/[0.04] space-y-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold">{t.reviews.yourRating}</p>
                <div className="flex gap-1">
                  <button onClick={() => setEditing(true)}
                    className="text-xs text-muted-foreground hover:text-neon-purple transition inline-flex items-center gap-1.5">
                    <Pencil className="w-3.5 h-3.5" /> Tahrirlash
                  </button>
                  <button onClick={remove}
                    className="text-xs text-muted-foreground hover:text-neon-red transition inline-flex items-center gap-1.5 ml-3">
                    <Trash2 className="w-3.5 h-3.5" /> O&apos;chirish
                  </button>
                </div>
              </div>
              <Stars value={myReview.rating} readOnly />
              {myReview.comment && (
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{myReview.comment}</p>
              )}
            </div>
          ) : (
            <div className="p-5 rounded-2xl border border-border/60 bg-card/40 space-y-4">
              <p className="text-sm font-semibold">
                {myReview ? "Bahoyingizni o'zgartiring" : t.reviews.rateThis}
              </p>

              <div onMouseLeave={() => setHover(0)}>
                <Stars
                  value={hover || rating}
                  onPick={setRating}
                  onHover={setHover}
                  size="lg"
                />
                <p className="text-xs text-muted-foreground mt-2 h-4">
                  {(hover || rating) > 0 && RATING_LABEL[(hover || rating) as 1 | 2 | 3 | 4 | 5]}
                </p>
              </div>

              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder={t.reviews.placeholder}
                className="input-field w-full text-sm min-h-[90px] resize-y"
                maxLength={2000}
              />

              <div className="flex items-center justify-between gap-3">
                <span className="text-[11px] text-muted-foreground">
                  <span className="numeric">{comment.length}</span>/2000
                </span>
                <div className="flex gap-2">
                  {myReview && (
                    <button onClick={() => { setEditing(false); setRating(myReview.rating); setComment(myReview.comment ?? ""); }}
                      className="btn-ghost py-2.5 px-5 text-sm">
                      Bekor
                    </button>
                  )}
                  <button onClick={save} disabled={saving || rating < 1}
                    className="btn-primary py-2.5 px-6 text-sm inline-flex items-center gap-2 disabled:opacity-50">
                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                    {myReview ? "Yangilash" : t.reviews.submit}
                  </button>
                </div>
              </div>
            </div>
          )
        ) : (
          <p className="text-sm text-muted-foreground p-4 rounded-xl border border-dashed border-border">
            {t.reviews.needEnroll}
          </p>
        )
      )}

      {/* Izohlar ro'yxati */}
      <AnimatePresence>
        {reviews.filter(r => r.user_id !== me).length === 0 ? (
          count === 0 && (
            <div className="py-12 text-center border border-dashed border-border rounded-2xl">
              <MessageSquare className="w-10 h-10 text-muted-foreground/25 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">Hali izoh yo&apos;q — birinchi bo&apos;ling</p>
            </div>
          )
        ) : (
          <div className="space-y-3">
            {reviews.filter(r => r.user_id !== me).map(r => (
              <motion.article
                key={r.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl border border-border/60 bg-card/40"
              >
                <div className="flex items-start gap-3">
                  <span className="w-9 h-9 rounded-xl bg-hero-gradient flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0 overflow-hidden">
                    {r.avatar_url
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={r.avatar_url} alt="" className="w-full h-full object-cover" />
                      : getInitials(r.full_name)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm">{r.full_name}</span>
                      {r.completed && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-neon-green bg-neon-green/10 border border-neon-green/25 px-1.5 py-0.5 rounded">
                          <BadgeCheck className="w-3 h-3" /> {t.reviews.completedBadge}
                        </span>
                      )}
                      <span className="text-[11px] text-muted-foreground ml-auto">{formatDate(r.created_at)}</span>
                    </div>
                    <Stars value={r.rating} readOnly size="sm" />
                    {r.is_hidden ? (
                      <p className="text-xs text-muted-foreground italic mt-2 inline-flex items-center gap-1.5">
                        <EyeOff className="w-3.5 h-3.5" /> Izoh matni administrator tomonidan yashirilgan
                      </p>
                    ) : r.comment ? (
                      <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line mt-2">
                        {r.comment}
                      </p>
                    ) : null}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

const RATING_LABEL: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: "Yomon",
  2: "Qoniqarsiz",
  3: "O'rtacha",
  4: "Yaxshi",
  5: "Ajoyib",
};

function Stars({
  value, onPick, onHover, readOnly, size = "md",
}: {
  value: number;
  onPick?: (n: number) => void;
  onHover?: (n: number) => void;
  readOnly?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const cls = size === "lg" ? "w-8 h-8" : size === "sm" ? "w-3.5 h-3.5" : "w-5 h-5";
  return (
    <div className="flex gap-0.5" role={readOnly ? undefined : "radiogroup"}>
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          disabled={readOnly}
          onClick={() => onPick?.(n)}
          onMouseEnter={() => onHover?.(n)}
          aria-label={`${n} yulduzcha`}
          className={cn("transition-transform", !readOnly && "hover:scale-110 cursor-pointer")}
        >
          <Star
            className={cn(cls, n <= value ? "text-neon-yellow" : "text-muted-foreground/25")}
            fill={n <= value ? "currentColor" : "none"}
          />
        </button>
      ))}
    </div>
  );
}
