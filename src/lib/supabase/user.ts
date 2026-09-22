"use client";

import type { SupabaseClient, User } from "@supabase/supabase-js";

/**
 * Brauzerda joriy foydalanuvchini KESHLAB qaytaradi.
 *
 * NEGA KERAK
 * `supabase.auth.getUser()` har chaqirilganda Supabase Auth API ga
 * tarmoq so'rovi yuboradi. Loyihada u 88 o'rinda ishlatilardi — ya'ni
 * deyarli har bir sahifa ochilishida ma'lumot so'rashdan OLDIN yana bir
 * borish-kelish qo'shilardi. Bir vaqtda 10-20 talaba ishlaganda bu ham
 * kechikish, ham Auth API chegarasiga bosim beradi.
 *
 * `getSession()` esa tokenni brauzerdagi xotiradan o'qiydi va tarmoqqa
 * chiqmaydi. Foydalanuvchi ID si shundan olinadi.
 *
 * XAVFSIZLIK
 * Bu ID faqat so'rov qurish uchun ishlatiladi. Haqiqiy ruxsat tekshiruvi
 * serverda — RLS siyosatlari `auth.uid()` ni imzolangan tokendan oladi.
 * Ya'ni brauzerdagi qiymatni "aldash" bilan begona ma'lumot olib
 * bo'lmaydi. Serverda (route handler, middleware) esa avvalgidek
 * `getUser()` ishlatilishi kerak.
 */

let cache: { user: User | null; at: number } | null = null;
let inflight: Promise<User | null> | null = null;
let subscribed = false;

/** Kesh muddati — sessiya baribir o'zgarganda tozalanadi. */
const TTL_MS = 30_000;

function watchAuthChanges(supabase: SupabaseClient) {
  if (subscribed) return;
  subscribed = true;
  // Kirish/chiqish yoki token yangilanishida keshni tashlaymiz
  supabase.auth.onAuthStateChange((_event, session) => {
    cache = { user: session?.user ?? null, at: Date.now() };
  });
}

export async function getCurrentUser(supabase: SupabaseClient): Promise<User | null> {
  watchAuthChanges(supabase);

  if (cache && Date.now() - cache.at < TTL_MS) return cache.user;
  if (inflight) return inflight;

  inflight = (async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      let user = session?.user ?? null;

      // Sessiya topilmasa — bir marta tarmoqqa chiqamiz. Bu holat kamdan
      // kam uchraydi (masalan boshqa oynadan chiqilgan bo'lsa).
      if (!user) {
        const { data } = await supabase.auth.getUser();
        user = data.user ?? null;
      }

      cache = { user, at: Date.now() };
      return user;
    } catch (_e) {
      cache = { user: null, at: Date.now() };
      return null;
    } finally {
      inflight = null;
    }
  })();

  return inflight;
}

/** Chiqishda yoki rol o'zgarganda qo'lda tozalash. */
export function clearUserCache() {
  cache = null;
  inflight = null;
}
