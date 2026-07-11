import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';

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

        // OAuth orqali parent ro'yxatdan o'tgan bo'lsa, rolni to'g'rilash
        // (trigger Google metadata'da role topmaydi — default 'student' bo'ladi)
        if (roleParam === 'parent' && profile?.role === 'student') {
          await supabase.from('profiles').update({ role: 'parent' }).eq('id', user.id);
          return NextResponse.redirect(`${origin}/p-dashboard`);
        }

        // Ota-ona placement test topshirmaydi
        if (profile?.role === 'parent') {
          return NextResponse.redirect(`${origin}/p-dashboard`);
        }

        // Talaba — placement test tekshiruvi
        const { data: placement } = await supabase
          .from('placement_results')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (!placement) {
          return NextResponse.redirect(`${origin}/placement-test`);
        }
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
