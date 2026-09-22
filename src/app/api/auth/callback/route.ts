import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';
import {
  ROLE_COOKIE, ROLE_COOKIE_MAX_AGE, buildRoleCookie,
  normalizeRole, roleHome, needsPlacement, isPathAllowedForRole,
} from '@/lib/auth/roles';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') || '/dashboard';
  const roleParam = searchParams.get('role'); // OAuth parent uchun

  if (code) {
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
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle();

        let role = normalizeRole(profile?.role);

        // OAuth orqali parent ro'yxatdan o'tgan bo'lsa, rolni to'g'rilash
        // (trigger Google metadata'da role topmaydi — default 'student' bo'ladi)
        if (roleParam === 'parent' && role === 'student') {
          await supabase.from('profiles').update({ role: 'parent' }).eq('id', user.id);
          role = 'parent';
        }

        // Darajani aniqlash testi faqat o'quvchiga tegishli. Ilgari bu
        // yerda faqat 'parent' tekshirilardi — shuning uchun o'qituvchi
        // ham testga tushib, undan keyin o'quvchi kabinetiga o'tardi.
        let target = roleHome(role);
        if (needsPlacement(role)) {
          const { data: placement } = await supabase
            .from('placement_results')
            .select('id')
            .eq('user_id', user.id)
            .maybeSingle();
          if (!placement) target = '/placement-test';
          else if (next && isPathAllowedForRole(role, next)) target = next;
        } else if (next && isPathAllowedForRole(role, next)) {
          target = next;
        }

        const res = NextResponse.redirect(`${origin}${target}`);
        // Middleware keshini darhol yangilaymiz, aks holda birinchi
        // navigatsiya eski rol bilan qaytarib yuborilardi.
        res.cookies.set(ROLE_COOKIE, buildRoleCookie(user.id, role), {
          httpOnly: true, sameSite: 'lax', maxAge: ROLE_COOKIE_MAX_AGE, path: '/',
        });
        return res;
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
