/**
 * EduCode — SEO konstantalar va yordamchilar.
 * Markaziy joy: site URL, brand info, default'lar.
 */

export const SITE_URL = (
  process.env.NEXT_PUBLIC_APP_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://malla.uz"
).replace(/\/$/, "");

export const SITE_NAME = "EduCode";
export const SITE_BRAND_FULL = "EduCode (malla.uz)";
export const SITE_TAGLINE = "Dasturlashni o'ynab o'rgan";
export const SITE_DESCRIPTION =
  "Raqamli intellektual ta'lim platformasi. Dasturlash tillarini interaktiv kurslar, AI Sokratik mentor va gamifikatsiya orqali o'rganing. Python, JavaScript, HTML/CSS, algoritmlar — o'zbek tilida bepul.";

export const DEFAULT_KEYWORDS = [
  "dasturlash",
  "dasturlash kurslari",
  "online dasturlash",
  "python o'rganish",
  "javascript o'rganish",
  "html css o'zbek tilida",
  "kompyuter savodxonligi",
  "prompt engineering",
  "AI bilan dasturlash",
  "EduCode",
  "malla.uz",
  "ta'lim platformasi",
  "IT kurslari O'zbekistonda",
  "bepul dasturlash",
  "interaktiv ta'lim",
];

export const SUPPORTED_LOCALES = ["uz", "en", "ru"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const ORG_SOCIAL = {
  twitter: "@educode_uz",
  telegram: "https://t.me/educode_uz",
  // boshqa social havolalar bo'lsa, qo'shing
};

/** To'liq URL qaytaradi (path absolute bo'lsa, $SITE_URL bilan birlashtiradi). */
export function absUrl(path: string): string {
  if (!path) return SITE_URL;
  if (/^https?:\/\//i.test(path)) return path;
  return SITE_URL + (path.startsWith("/") ? path : `/${path}`);
}

/** Dynamic OG image URL — har sahifa uchun avtomatik chiroyli rasm. */
export function ogImageUrl(opts: {
  title: string;
  subtitle?: string;
  type?: "course" | "challenge" | "topic" | "default";
}): string {
  const params = new URLSearchParams();
  params.set("title", opts.title.slice(0, 80));
  if (opts.subtitle) params.set("subtitle", opts.subtitle.slice(0, 100));
  if (opts.type) params.set("type", opts.type);
  return `${SITE_URL}/api/og?${params.toString()}`;
}

/** Hreflang — ko'p tilli URL'lar uchun yordamchi. */
export function localesAlternates(path: string) {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return {
    canonical: absUrl(clean),
    languages: {
      "uz-UZ": absUrl(clean),
      "x-default": absUrl(clean),
      // Kelajakda i18n routing kiritilsa: 'en-US': absUrl(`/en${clean}`), ...
    },
  };
}
