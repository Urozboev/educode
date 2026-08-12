import { headers } from "next/headers";
import { DEFAULT_LOCALE, isLocale, localizedHref, type Locale } from "./config";

/**
 * Server komponentlar uchun til.
 *
 * Mijoz tomonida `useI18n()` bor, lekin server komponentda kontekst
 * hooki ishlamaydi. Til middleware qo'yadigan `x-locale` sarlavhasidan
 * olinadi — prefiksli manzil rewrite qilingani uchun uni boshqa yo'l
 * bilan bilib bo'lmaydi.
 */
export async function getServerLocale(): Promise<Locale> {
  const h = await headers();
  const v = h.get("x-locale");
  return isLocale(v) ? v : DEFAULT_LOCALE;
}

/**
 * Server komponentda havolalarni tilga moslash uchun.
 *
 *   const href = await serverHref();
 *   <Link href={href("/blog")}>...</Link>
 *
 * Har havolaga alohida `await` yozmaslik uchun funksiya qaytaradi.
 */
export async function serverHref(): Promise<(path: string) => string> {
  const locale = await getServerLocale();
  return (path: string) => localizedHref(path, locale);
}
