import { headers } from "next/headers";
import { DEFAULT_LOCALE, isLocale, localizedHref, type Locale } from "./config";
// Lug'atlar to'g'ridan-to'g'ri import qilinadi: `./index` da "use client"
// bor va u React kontekstini ham olib kelardi — serverga kerak emas.
import { uz, type Dictionary } from "./dictionaries/uz";
import { ru } from "./dictionaries/ru";
import { en } from "./dictionaries/en";
import { kaa } from "./dictionaries/kaa";

const DICTIONARIES: Record<Locale, Dictionary> = { uz, ru, en, kaa };

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
 * Server komponentlar uchun lug'at.
 *
 * Mijozdagi `useI18n().t` ning server varianti — `generateMetadata`,
 * JSON-LD va boshqa server kodida ishlatiladi. To'rtala lug'at ham
 * statik import qilinadi: ular kichik va `generateMetadata` ichida
 * `await import()` qilish sahifa javobini sekinlashtiradi.
 */
export async function getServerDictionary(): Promise<Dictionary> {
  return DICTIONARIES[await getServerLocale()];
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
