import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // ============================================
  // OMMAVIY SAHIFALAR — hech narsa qilinmaydi
  // ============================================
  const publicPaths = ['/', '/login', '/register', '/forgot-password', '/verify-email', '/playground'];
  const isPublicPrefix = pathname.startsWith('/explore') || pathname.startsWith('/blog');

  // Public preview sahifalari (login talab qilmaydi):
  // /courses/[slug] — kurs mundarijasi
  // /courses/[slug]/topics/[topicSlug] — dars sahifasi (free preview darslar uchun;
  //   pullik kontent RLS va video-token API bilan himoyalanadi)
  // /challenges/[slug] — topshiriq tavsifi
  // Quiz/task sub-sahifalari AUTH talab qiladi
  const isCoursePreview = /^\/courses\/[^\/]+$/.test(pathname);
  const isTopicPreview = /^\/courses\/[^\/]+\/topics\/[^\/]+$/.test(pathname);
  const isChallengePreview = /^\/challenges\/[^\/]+$/.test(pathname);

  if (publicPaths.includes(pathname) || isPublicPrefix || isCoursePreview || isTopicPreview || isChallengePreview) {
    return NextResponse.next();
  }

  // ============================================
  // MAVJUD BO'LMAGAN MANZILLAR
  // ============================================
  // Faqat quyidagi prefikslar himoyalanadi. Ro'yxatga kirmagan manzil
  // umuman mavjud emas — uni /login ga yo'naltirish o'rniga Next.js ning
  // not-found.tsx sahifasiga o'tkazamiz. Aks holda noto'g'ri havolani
  // ochgan mehmon 404 o'rniga login formasini ko'radi.
  const protectedPrefixes = [
    '/dashboard',
    '/courses',
    '/challenges',
    // Kabinet ichidagi olimpiada. Ommaviy nusxasi /explore/contests da.
    '/contests',
    '/certificate',
    '/chat',
    '/games',
    '/leaderboard',
    '/my-results',
    '/profile',
    '/store',
    // Kitoblar/terminlar kabinet ichidagi ko'rinishi. Ommaviy nusxasi
    // /explore/books va /explore/glossary'da, u login talab qilmaydi.
    '/books',
    '/glossary',
    '/lesson-games',
    '/join',
    '/portfolio',
    '/placement-test',
    // O'qituvchi arizasi: login shart, lekin rol hali 'student'
    '/teacher-apply',
    '/a-',
    '/t-',
    '/p-',
  ];

  const isProtected = protectedPrefixes.some(
    (p) => pathname === p || pathname.startsWith(p.endsWith('-') ? p : `${p}/`)
  );

  if (!isProtected) {
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
  // ROL TEKSHIRISH (admin / teacher / parent)
  // ============================================
  const isAdminPath = pathname.startsWith('/a-');
  const isTeacherPath = pathname.startsWith('/t-');
  const isParentPath = pathname.startsWith('/p-');

  if (isAdminPath || isTeacherPath || isParentPath) {
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
    if (isParentPath && role !== 'parent' && role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon.svg|apple-icon.png|manifest.webmanifest|robots.txt|sitemap.xml|images|api).*)',
  ],
};
