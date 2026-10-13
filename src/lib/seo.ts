/**
 * MirAcademy — SEO konstantalar va yordamchilar.
 * Markaziy joy: site URL, brand info, default'lar.
 */

export const SITE_URL = (
  process.env.NEXT_PUBLIC_APP_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  // Domen www bilan xizmat qiladi: apex (miracademy.uz) unga
  // 308 bilan yo'naltiradi. Manzil yakuniy shaklda bo'lishi kerak,
  // aks holda har bir OG rasm so'rovi ortiqcha yo'naltirishdan o'tadi.
  "https://www.miracademy.uz"
).replace(/\/$/, "");

export const SITE_NAME = "MirAcademy";
export const SITE_BRAND_FULL = "MirAcademy (miracademy.uz)";
export const SITE_TAGLINE = "Dasturlashni o'ynab o'rgan";

/**
 * Brend nomining boshqa yozilish shakllari.
 *
 * Foydalanuvchilar nomni turlicha qidiradi: "mirakademiy", "mir akademiya",
 * "мир академия". Google bu shakllarni bitta brendga bog'lashi uchun ular
 * Organization sxemasidagi `alternateName` da sanab o'tiladi — bu rasmiy
 * signal. Faqat meta keywords yetarli emas: Google uni 2009-yildan beri
 * hisobga olmaydi.
 *
 * Ro'yxat tabiiy yozilish shakllari bilan cheklangan. Mavjud bo'lmagan
 * variantlarni to'plash spam sifatida baholanishi mumkin.
 */
export const BRAND_ALIASES = [
  "Mir Academy",
  "MirAkademiy",
  "Mir Akademiy",
  "Miracademiy",
  "Mir Akademiya",
  "MirAkademiya",
  "Мир Академия",
  "МирАкадемия",
  "Мир Академи",
  "miracademy.uz",
];

/** Qidiruv natijasida ko'rinadigan asosiy sarlavha. */
export const SITE_TITLE = `${SITE_NAME} (Mir Akademiya) — onlayn ta'lim platformasi`;

/**
 * Meta description. Google taxminan 160 belgini ko'rsatadi, shuning uchun
 * eng muhim so'zlar — brend nomi va uning varianti — boshida turadi.
 */
export const SITE_DESCRIPTION =
  "MirAcademy (Mir Akademiya) — onlayn ta'lim va dasturlash kurslari. Python, JavaScript, HTML/CSS va algoritmlarni AI mentor bilan o'zbek tilida o'rganing.";

/**
 * Meta keywords. Google buni reyting omili sifatida ishlatmaydi, lekin
 * Yandex va ba'zi mahalliy qidiruv tizimlari hali hisobga oladi —
 * shuning uchun brend variantlari shu yerda ham saqlanadi.
 */
export const DEFAULT_KEYWORDS = [
  // Brend va uning yozilish shakllari
  "MirAcademy",
  ...BRAND_ALIASES,
  // Yo'nalish
  "dasturlash",
  "dasturlash kurslari",
  "online dasturlash",
  "onlayn ta'lim",
  "python o'rganish",
  "javascript o'rganish",
  "html css o'zbek tilida",
  "kompyuter savodxonligi",
  "prompt engineering",
  "AI bilan dasturlash",
  "ta'lim platformasi",
  "IT kurslari O'zbekistonda",
  "bepul dasturlash",
  "interaktiv ta'lim",
];

export const SUPPORTED_LOCALES = ["uz", "ru", "en", "kaa"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const ORG_SOCIAL = {
  twitter: "@miracademy_uz",
  telegram: "https://t.me/miracademy_uz",
  // boshqa social havolalar bo'lsa, qo'shing
};

/** To'liq URL qaytaradi (path absolute bo'lsa, $SITE_URL bilan birlashtiradi). */
export function absUrl(path: string): string {
  if (!path) return SITE_URL;
  if (/^https?:\/\//i.test(path)) return path;
  return SITE_URL + (path.startsWith("/") ? path : `/${path}`);
}

/**
 * Brend versiyasi — OG rasm manziliga qo'shiladi.
 *
 * Telegram, WhatsApp va ijtimoiy tarmoqlar rasmni MANZIL bo'yicha
 * keshlaydi. Logotip yoki nom o'zgarganda manzil o'zgarmasa, ular eski
 * rasmni ko'rsatishda davom etadi. Brend yangilanganda shu raqamni
 * oshirish kifoya — manzil yangi bo'ladi va kesh chetlab o'tiladi.
 */
export const OG_VERSION = "2";

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
  params.set("v", OG_VERSION);
  return `${SITE_URL}/api/og?${params.toString()}`;
}

/**
 * Hreflang — ko'p tilli URL'lar uchun yordamchi.
 *
 * O'zbekcha prefikssiz ochiladi (`/kurslar`), qolgan tillar prefiks
 * bilan (`/ru/kurslar`). Middleware ham aynan shunday ishlaydi.
 */
export function localesAlternates(path: string) {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return {
    canonical: absUrl(clean),
    languages: {
      "uz-UZ": absUrl(clean),
      "ru-RU": absUrl(`/ru${clean}`),
      "en-US": absUrl(`/en${clean}`),
      // Qoraqalpoq tili uchun ISO 639-1 kodi yo'q — 639-3 ishlatiladi
      "kaa": absUrl(`/kaa${clean}`),
      "x-default": absUrl(clean),
    },
  };
}
