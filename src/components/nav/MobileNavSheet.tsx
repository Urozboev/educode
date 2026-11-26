"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, LayoutDashboard } from "lucide-react";
import Link from "@/components/i18n/Link";
import { useI18n } from "@/lib/i18n";
import { primaryLinks, resourceLinks, tailLinks, extraLinks } from "@/lib/nav";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
  /** Kirgan foydalanuvchi uchun kabinet manzili; mehmon uchun null */
  dashboardHref?: string | null;
  /** Faol bo'limni belgilash uchun (tilsiz yo'l, masalan "/explore/books") */
  pathname?: string;
}

/**
 * Mehmon uchun mobil menyu — navbar ostidan butun ekranni egallaydi.
 *
 * MUHIM: navbar'ning ICHIGA qo'yilmaydi. Navbar'da `backdrop-blur` bor,
 * u esa `fixed` bolalar uchun yangi "containing block" yaratadi — menyu
 * ekranga emas, 64px li navbar'ga bog'lanib, ro'yxat sahifa ustiga
 * toshib chiqardi. Shuning uchun navbar'ning yonida (sibling) render qilinadi.
 *
 * Tuzilishi: asosiy 4 bo'lim — katta yozuv bilan, resurslar — izohli
 * ikki ustunli kartochkalar, qolganlari — kichik havolalar. Kirish
 * tugmalari pastda doim ko'rinib turadi. Ochiq paytda sahifa aylanmaydi.
 */
export default function MobileNavSheet({ open, onClose, dashboardHref, pathname }: Props) {
  const { t } = useI18n();
  const primary = primaryLinks(t);
  const resources = resourceLinks(t);
  const small = [...tailLinks(t), ...extraLinks(t)];

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    // Ekran xl ga kengaysa (planshetni burish) menyu yopiladi — u yerda to'liq panel bor
    const mq = window.matchMedia("(min-width: 1280px)");
    const onMq = () => { if (mq.matches) onClose(); };
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
    };
  }, [open, onClose]);

  const isActive = (h: string) => pathname === h;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="mobile-nav"
          id="mobile-nav"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="xl:hidden fixed inset-x-0 top-16 bottom-0 z-40 flex flex-col bg-background overflow-y-auto overscroll-contain"
        >
          <nav aria-label="Menu" className="flex-1 px-5 pt-3 pb-8">
            {/* Asosiy bo'limlar */}
            <ol className="divide-y divide-border">
              {primary.map((l, i) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={onClose}
                    className={cn("group flex items-center gap-4 py-4", isActive(l.href) && "text-neon-purple")}
                  >
                    <span className="w-6 text-xs tabular-nums text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                    <span className="flex-1 font-display font-bold text-[1.65rem] leading-none tracking-[-0.03em]">{l.label}</span>
                    <ArrowUpRight className="w-5 h-5 text-muted-foreground transition-transform group-active:translate-x-0.5 group-active:-translate-y-0.5" />
                  </Link>
                </li>
              ))}
            </ol>

            {/* Resurslar */}
            <p className="mt-8 mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t.nav.resources}</p>
            <div className="grid grid-cols-2 gap-2">
              {resources.map(r => (
                <Link
                  key={r.href}
                  href={r.href}
                  onClick={onClose}
                  className={cn(
                    "rounded-2xl border p-3.5 transition-colors",
                    isActive(r.href) ? "border-neon-purple/40 bg-neon-purple/8" : "border-border bg-card active:bg-surface",
                  )}
                >
                  <span className={cn("block font-semibold text-[0.95rem] leading-snug", isActive(r.href) && "text-neon-purple")}>{r.label}</span>
                  <span className="block mt-1 text-xs leading-snug text-muted-foreground line-clamp-2">{r.hint}</span>
                </Link>
              ))}
            </div>

            {/* Qolganlari */}
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-[0.95rem] font-medium">
              {small.map(l => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={onClose}
                  className={cn(
                    "underline decoration-2 underline-offset-[6px]",
                    isActive(l.href) ? "text-neon-purple decoration-neon-purple" : "decoration-border hover:decoration-foreground",
                  )}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </nav>

          {/* Kirish — pastda doim ko'rinadi */}
          <div className="sticky bottom-0 flex gap-2 border-t border-border bg-background/95 backdrop-blur px-5 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            {dashboardHref ? (
              <Link href={dashboardHref} onClick={onClose}
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold bg-foreground text-background">
                <LayoutDashboard className="w-4 h-4" /> {t.nav.dashboard}
              </Link>
            ) : (
              <>
                <Link href="/login" onClick={onClose}
                  className="flex-1 text-center py-3 rounded-xl text-sm font-semibold border border-border bg-card">
                  {t.nav.login}
                </Link>
                <Link href="/register" onClick={onClose}
                  className="flex-1 text-center py-3 rounded-xl text-sm font-semibold bg-foreground text-background">
                  {t.nav.register}
                </Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
