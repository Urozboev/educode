import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // ============================================
  // OMMAVIY SAHIFALAR — hech narsa qilinmaydi
  // ============================================
  const publicPaths = ['/', '/login', '/register', '/forgot-password', '/verify-email', '/playground'];
  const isPublicPrefix = pathname.startsWith('/explore');

  // Public preview sahifalari (login talab qilmaydi):
  // /courses/[slug] va /challenges/[slug] — kurs/topshiriq haqida ma'lumot
  // Lekin /courses/[slug]/topics/... va boshqa chuqur path'lar AUTH talab qiladi
  const isCoursePreview = /^\/courses\/[^\/]+$/.test(pathname);
  const isChallengePreview = /^\/challenges\/[^\/]+$/.test(pathname);

  if (publicPaths.includes(pathname) || isPublicPrefix || isCoursePreview || isChallengePreview) {
    return NextResponse.next();
  }

  // ============================================
  // HIMOYALANGAN SAHIFALAR
  // ============================================

  // Cookie larni to'plash uchun massiv
  const cookiesToSet: { name: string; value: string; options: any }[] = [];

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          // Request cookie ni yangilash (keyingi get() lar uchun)
          request.cookies.set({ name, value, ...options });
          // Massivga qo'shish (oxirida response ga yoziladi)
          cookiesToSet.push({ name, value, options });
        },
        remove(name: string, options: any) {
          request.cookies.set({ name, value: '', ...options });
          cookiesToSet.push({ name, value: '', options });
        },
      },
    }
  );

  // Session tekshirish va token yangilash
  const { data: { session } } = await supabase.auth.getSession();

  // Response yaratish va BARCHA cookie larni yozish
  const response = NextResponse.next({
    request: { headers: request.headers },
  });

  // To'plangan cookie larni response ga yozish
  for (const cookie of cookiesToSet) {
    response.cookies.set(cookie.name, cookie.value, cookie.options);
  }

  // Login qilmagan → login ga redirect
  if (!session) {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // ============================================
  // ADMIN/TEACHER tekshirish
  // ============================================
  const isAdminPath = pathname.startsWith('/a-');
  const isTeacherPath = pathname.startsWith('/t-');

  if (isAdminPath || isTeacherPath) {
    // Cookie dan rolni o'qish
    let role = request.cookies.get('user-role')?.value;

    if (!role) {
      // DB dan olish
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      role = profile?.role || 'student';
      const roleValue = role ?? "student";

      // Cookie ga saqlash
      response.cookies.set('user-role', roleValue, {
        httpOnly: true,
        sameSite: 'lax' as const,
        maxAge: 3600,
        path: '/',
      });
    }

    if (isAdminPath && role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    if (isTeacherPath && role !== 'teacher' && role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images|api).*)',
  ],
};
