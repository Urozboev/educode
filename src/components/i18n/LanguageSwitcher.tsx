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
  const { locale } = useI18n();
  const router = useRouter();
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);
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

  return (
    <div className="relative" ref={box}>
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Til tanlash"
        aria-expanded={open}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface/60 hover:bg-surface transition font-medium",
          compact ? "px-2.5 py-2 text-xs" : "px-3 py-2 text-sm"
        )}
      >
        <Globe className="w-4 h-4 flex-shrink-0" />
        <span className="uppercase">{locale}</span>
        {!compact && <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", open && "rotate-180")} />}
        <span className="sr-only">{meta.native}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-border bg-card shadow-lift z-50 overflow-hidden">
          {LOCALES.map(l => (
            <button
              key={l}
              onClick={() => pick(l)}
              className={cn(
                "w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-left transition hover:bg-surface",
                l === locale && "bg-neon-purple/[0.08] text-neon-purple"
              )}
            >
              <span className="text-base leading-none">{LOCALE_META[l].flag}</span>
              <span className="flex-1">{LOCALE_META[l].native}</span>
              {l === locale && <Check className="w-4 h-4 flex-shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
