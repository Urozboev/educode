import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createServerSupabaseClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try { cookieStore.set({ name, value, ...options }); } catch (e) {}
        },
        remove(name: string, options: CookieOptions) {
          try { cookieStore.set({ name, value: '', ...options }); } catch (e) {}
        },
      },
    }
  );
}

/** Service role kaliti sozlanganmi — route'lar shu bilan oldindan tekshiradi */
export function hasServiceRole(): boolean {
  return !!process.env.SUPABASE_SERVICE_ROLE_KEY;
}

/**
 * Service role klienti — RLS'ni chetlab o'tadi.
 *
 * Kalit yo'q bo'lsa DARROV xato tashlaydi. Ilgari `undefined` kalit
 * bilan klient yaratilar va so'rov anon huquqi bilan ketardi;
 * natijada foydalanuvchi "new row violates row-level security policy"
 * degan xatoni ko'rardi va sababi umuman boshqa joyda — muhit
 * o'zgaruvchisida — ekanini bilishning iloji yo'q edi.
 */
export function createAdminClient() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY sozlanmagan. Vercel loyihasining ' +
      'Environment Variables bo\'limiga qo\'shing va qayta deploy qiling.',
    );
  }

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      cookies: {
        get() { return undefined; },
        set() {},
        remove() {},
      },
    }
  );
}
