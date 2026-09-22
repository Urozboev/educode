import { unstable_cache } from "next/cache";

/**
 * Server tomondagi ommaviy ma'lumot uchun kesh.
 *
 * NEGA KERAK
 * Ildiz layout `headers()` ni o'qiydi (til uchun), shuning uchun barcha
 * sahifalar dinamik bo'lib qoladi va sahifadagi `export const revalidate`
 * amalda ishlamaydi — kurs, masala, blog ma'lumotlari HAR SO'ROVDA
 * bazadan qayta olinardi. Supabase'gacha bitta borish-kelish ~0,6 s
 * bo'lgani uchun `generateMetadata` + layout ketma-ket ikki marta so'rab,
 * sahifani 1-2 soniyaga sekinlashtirardi.
 *
 * `unstable_cache` Next.js ma'lumotlar keshida saqlaydi: sahifa dinamik
 * bo'lsa ham ishlaydi, `generateMetadata` va layout bitta natijani
 * bo'lishadi. Admin kontentni saqlaganda `/api/revalidate` teg bo'yicha
 * tozalaydi.
 */

/** Keshni tozalash uchun teglar — `/api/revalidate` shularni ishlatadi. */
export const CACHE_TAGS = {
  courses: "courses",
  challenges: "challenges",
  blog: "blog",
  games: "lesson-games",
  profiles: "public-profiles",
  home: "home",
} as const;

export type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS];

export function cached<Args extends unknown[], R>(
  fn: (...args: Args) => Promise<R>,
  key: string,
  opts: { revalidate: number; tags: CacheTag[] },
): (...args: Args) => Promise<R> {
  return unstable_cache(fn, [key], opts);
}
