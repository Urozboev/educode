import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import {
  ROLE_COOKIE, ROLE_COOKIE_MAX_AGE, buildRoleCookie,
  normalizeRole, roleHome, needsPlacement,
} from '@/lib/auth/roles';

export const dynamic = 'force-dynamic';

/**
 * Rolni bazadan o'qib, middleware ishlatadigan keshni yangilaydi va
 * foydalanuvchi qaysi kabinetga tushishini aytadi.
 *
 * Nega alohida yo'l kerak: `user-role` cookie'si `httpOnly`, shuning
 * uchun uni brauzerdagi `document.cookie` bilan o'chirib bo'lmaydi.
 * Rol o'zgargandan keyin (admin tayinlasa yoki ariza tasdiqlansa)
 * kirishda eski kesh qolib ketardi va odam eski kabinetda qamalardi.
 */
export async function POST() {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value; },
        set(name: string, value: string, options: Record<string, unknown>) {
          try { cookieStore.set({ name, value, ...options } as any); } catch (_e) { /* noop */ }
        },
        remove(name: string, options: Record<string, unknown>) {
          try { cookieStore.set({ name, value: '', ...options } as any); } catch (_e) { /* noop */ }
        },
      },
    },
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  const role = normalizeRole(profile?.role);

  // Faqat o'quvchi uchun darajani aniqlash testi tekshiriladi
  let placementDone = true;
  if (needsPlacement(role)) {
    const { data: placement } = await supabase
      .from('placement_results')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();
    placementDone = !!placement;
  }

  const res = NextResponse.json({
    role,
    home: roleHome(role),
    placementDone,
    next: placementDone ? roleHome(role) : '/placement-test',
  });

  res.cookies.set(ROLE_COOKIE, buildRoleCookie(user.id, role), {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: ROLE_COOKIE_MAX_AGE,
    path: '/',
  });

  return res;
}
