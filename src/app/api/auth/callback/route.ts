import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') || '/dashboard';

  if (code) {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) { return cookieStore.get(name)?.value; },
          set(name: string, value: string, options: CookieOptions) { cookieStore.set({ name, value, ...options }); },
          remove(name: string, options: CookieOptions) { cookieStore.set({ name, value: '', ...options }); },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Yangi foydalanuvchi bo'lsa — placement test ga yo'naltirish
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: placement } = await supabase
          .from('placement_results')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (!placement) {
          // Hali placement test topshirmagan — test sahifasiga
          return NextResponse.redirect(`${origin}/placement-test`);
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
