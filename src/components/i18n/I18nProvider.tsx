"use client";

import { useMemo, useCallback } from "react";
import { usePathname } from "next/navigation";
import { I18nContext, getDictionary } from "@/lib/i18n";
import { localizedHref, splitLocale, DEFAULT_LOCALE, type Locale } from "@/lib/i18n/config";

/**
 * Tilni butun daraxtga uzatadi.
 *
 * Til manzil boshidagi prefiksdan olinadi (`/ru/explore/...`). Prefiks
 * bo'lmasa — sukut til. Kabinet sahifalari prefiks olmaydi, ularga til
 * `initialLocale` orqali cookie'dan keladi.
 */
export function I18nProvider({
  children,
  initialLocale,
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
}) {
  const pathname = usePathname() || "/";
  const fromPath = splitLocale(pathname).locale;
  const locale: Locale = fromPath ?? initialLocale ?? DEFAULT_LOCALE;

  const href = useCallback(
    (path: string) => localizedHref(path, locale),
    [locale]
  );

  const value = useMemo(
    () => ({ locale, t: getDictionary(locale), href }),
    [locale, href]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
