/**
 * 4 tillilik konfiguratsiyasi.
 *
 * URL strategiyasi ARALASH (foydalanuvchi tanlovi):
 *   - Ommaviy sahifalar (/explore, /blog, /u, /sertifikat, bosh sahifa)
 *     til prefiksi bilan ochiladi: /ru/explore/courses
 *     Sabab: Google har bir tilni alohida indekslaydi va havolani
 *     ulashganda til saqlanib qoladi.
 *   - Kabinet sahifalari (/dashboard, /courses, /a-*, /t-*) prefikssiz.
 *     Ular qidiruv tizimiga chiqmaydi, til esa profil va cookie'dan olinadi.
 *
 * Sukut til — o'zbekcha, u prefikssiz ham ochiladi (/explore/courses).
 */

export const LOCALES = ["uz", "ru", "en", "kaa"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "uz";

/** Cookie nomi — server komponentlar ham shundan o'qiydi */
export const LOCALE_COOKIE = "educode_locale";

export const LOCALE_META: Record<Locale, {
  label: string;
  /** O'z tilidagi nomi — tanlagichda shu ko'rinadi */
  native: string;
  /** <html lang> va hreflang uchun */
  htmlLang: string;
  /**
   * Qisqa kod — tanlagichdagi belgi.
   *
   * Bayroq emoji ISHLATILMAYDI: Windows'dagi Chrome bayroq emojilarini
   * chizmaydi va ular o'rniga ikki harfli quti ko'rinadi ("UZ", "GB").
   * Bundan tashqari qoraqalpoq tili davlat emas — unga bayroq qo'yish
   * noto'g'ri bo'lardi va o'zbekchaniki bilan bir xil chiqardi.
   */
  code: string;
}> = {
  uz:  { label: "O'zbekcha",     native: "O'zbekcha",     htmlLang: "uz",  code: "UZ" },
  ru:  { label: "Ruscha",        native: "Русский",       htmlLang: "ru",  code: "RU" },
  en:  { label: "Inglizcha",     native: "English",       htmlLang: "en",  code: "EN" },
  kaa: { label: "Qoraqalpoqcha", native: "Qaraqalpaqsha", htmlLang: "kaa", code: "QQ" },
};

/**
 * Til prefiksi qo'llanadigan bo'limlar. Bu ro'yxatga kirmagan manzil
 * prefikssiz ishlaydi (kabinet).
 */
export const LOCALIZED_PREFIXES = ["/explore", "/blog", "/u", "/sertifikat", "/live"];

/** Manzil ommaviy (prefiksli) bo'limga tegishlimi */
export function isLocalizedPath(pathname: string): boolean {
  if (pathname === "/") return true;
  return LOCALIZED_PREFIXES.some(p => pathname === p || pathname.startsWith(`${p}/`));
}

/** Manzil boshidagi til kodini ajratib oladi */
export function splitLocale(pathname: string): { locale: Locale | null; rest: string } {
  const m = pathname.match(/^\/([a-z]{2,3})(\/.*)?$/);
  if (m && (LOCALES as readonly string[]).includes(m[1])) {
    return { locale: m[1] as Locale, rest: m[2] || "/" };
  }
  return { locale: null, rest: pathname };
}

/**
 * Berilgan manzilni tanlangan tilda qayta yasaydi.
 * Kabinet manzillari o'zgarmaydi — ular prefiks olmaydi.
 */
export function localizedHref(pathname: string, locale: Locale): string {
  const { rest } = splitLocale(pathname);
  if (!isLocalizedPath(rest)) return rest;
  if (locale === DEFAULT_LOCALE) return rest;
  return `/${locale}${rest === "/" ? "" : rest}`;
}

export function isLocale(v: string | undefined | null): v is Locale {
  return !!v && (LOCALES as readonly string[]).includes(v);
}
