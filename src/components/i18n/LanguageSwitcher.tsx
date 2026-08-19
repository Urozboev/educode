"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { Globe, Check, ChevronDown } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import {
  LOCALES, LOCALE_META, LOCALE_COOKIE, localizedHref, isLocalizedPath,
  splitLocale, type Locale,
} from "@/lib/i18n/config";

/**
 * Til tanlagich.
 *
 * Tanlov ikki joyga yoziladi:
 *  - cookie — kabinet sahifalari uchun (ular manzilda prefiks olmaydi)
 *  - profil (`preferred_language`) — boshqa qurilmada ham saqlanadi
 *
 * Ommaviy sahifada til almashtirilsa manzil ham qayta yoziladi
 * (/explore/... → /ru/explore/...), shunda havolani ulashganda til
 * saqlanib qoladi.
 */
export function LanguageSwitcher({ compact }: { compact?: boolean }) {
  const { t } = useI18n();
  const { locale } = useI18n();
  const router = useRouter();
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);
  const [dropUp, setDropUp] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  async function pick(next: Locale) {
    setOpen(false);
    if (next === locale) return;

    // Bir yil — til tanlovi tez-tez o'zgarmaydi
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;

    // Profilga ham yozamiz, lekin javobini kutmaymiz: til darhol
    // almashishi kerak, tarmoq sekin bo'lsa ham
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) supabase.from("profiles").update({ preferred_language: next }).eq("id", user.id);
    });

    const { rest } = splitLocale(pathname);
    if (isLocalizedPath(rest)) {
      router.push(localizedHref(rest, next));
    } else {
      // Kabinet: manzil o'zgarmaydi, faqat qayta render kerak
      router.refresh();
    }
  }

  const meta = LOCALE_META[locale];

  /**
   * Ro'yxat pastga sig'masa yuqoriga ochiladi.
   *
   * Yon panelning eng pastida turgan tanlagich pastga ochilganda
   * ro'yxat ekran chetiga tushib qirqilib qolardi — oxirgi til
   * umuman ko'rinmasdi.
   */
  function toggle() {
    if (!open && box.current) {
      const r = box.current.getBoundingClientRect();
      const needed = LOCALES.length * 42 + 16;
      setDropUp(window.innerHeight - r.bottom < needed && r.top > needed);
    }
    setOpen(o => !o);
  }

  return (
    <div className="relative" ref={box}>
      <button
        onClick={toggle}
        aria-label={t.nav.language}
        aria-expanded={open}
        className={cn(
          // O'lcham oldingisining ~90% i. Matn o'lchamini qavs ichida
          // BERMANG (`text-[13px]`) — Tailwind unda qator balandligini
          // qo'ymaydi va quti pastdan kichraymay qoladi. `text-xs` o'zi
          // `leading-4` ni ham beradi.
          "inline-flex items-center rounded-lg border border-border bg-surface/60 hover:bg-surface transition font-medium",
          compact ? "gap-1 px-2 py-1.5 text-xs" : "gap-1.5 px-2.5 py-2 text-xs"
        )}
      >
        <Globe className="w-3.5 h-3.5 flex-shrink-0" />
        <span>{meta.code}</span>
        {!compact && (
          <ChevronDown className={cn("w-3 h-3 transition-transform ml-auto", open && "rotate-180")} />
        )}
        <span className="sr-only">{meta.native}</span>
      </button>

      {open && (
        <div
          className={cn(
            "absolute right-0 w-52 rounded-xl border border-border bg-card shadow-lift z-[60] overflow-hidden",
            dropUp ? "bottom-full mb-2" : "top-full mt-2"
          )}
        >
          {LOCALES.map(l => (
            <button
              key={l}
              onClick={() => pick(l)}
              className={cn(
                "w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-left transition hover:bg-surface",
                l === locale && "bg-neon-purple/[0.08] text-neon-purple"
              )}
            >
              {/* Bayroq emas, til kodi — Windows bayroq emojilarini chizmaydi */}
              <span className={cn(
                "w-7 h-5 rounded flex items-center justify-center text-[10px] font-bold flex-shrink-0 border",
                l === locale
                  ? "bg-neon-purple/15 border-neon-purple/30 text-neon-purple"
                  : "bg-surface border-border text-muted-foreground"
              )}>
                {LOCALE_META[l].code}
              </span>
              <span className="flex-1">{LOCALE_META[l].native}</span>
              {l === locale && <Check className="w-4 h-4 flex-shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
