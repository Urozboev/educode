import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import {
  LOCALES, DEFAULT_LOCALE, LOCALE_COOKIE, isLocalizedPath,
} from '@/lib/i18n/config';
import {
  ROLE_COOKIE, ROLE_COOKIE_MAX_AGE, buildRoleCookie, parseRoleCookie,
  isPathAllowedForRole, roleHome, normalizeRole, type AppRole,
} from '@/lib/auth/roles';

export async function middleware(request: NextRequest) {
  let pathname = request.nextUrl.pathname;

  // ============================================
  // TIL PREFIKSI
  //
  // Ommaviy sahifalar /ru/explore/... ko'rinishida ochiladi. Marshrut
  // daraxtini to'rt marta ko'chirmaslik uchun prefiks shu yerda olib
  // tashlanadi va so'rov prefikssiz manzilga qayta yo'naltiriladi
  // (rewrite — brauzerdagi manzil o'zgarmaydi).
  //
  // Tanlangan til `x-locale` sarlavhasi orqali layout'ga uzatiladi.
  // ============================================
  const seg = pathname.split('/')[1];
  const urlLocale = (LOCALES as readonly string[]).includes(seg) ? seg : null;

  if (urlLocale) {
    const rest = pathname.slice(urlLocale.length + 1) || '/';

    // Kabinet manzillari prefiks olmaydi — /ru/dashboard bo'lsa,
    // uni prefikssiz manzilga qaytaramiz
    if (!isLocalizedPath(rest)) {
      return NextResponse.redirect(new URL(rest, request.url));
    }

    // Sukut til prefikssiz ishlaydi: /uz/explore → /explore
    //
    // Cookie ham yangilanadi: aks holda ilgari /ru/ ga kirgan odam
    // /uz/... ni ochsa, prefikssiz manzilga o'tib eski tilni ko'rardi —
    // ya'ni tilni aniq so'raganiga qaramay boshqa til chiqardi.
    if (urlLocale === DEFAULT_LOCALE) {
      const res = NextResponse.redirect(new URL(rest, request.url));
      res.cookies.set(LOCALE_COOKIE, DEFAULT_LOCALE, {
        path: '/', maxAge: 60 * 60 * 24 * 365, sameSite: 'lax',
      });
      return res;
    }

    const url = request.nextUrl.clone();
    url.pathname = rest;
    const res = NextResponse.rewrite(url);
    res.headers.set('x-locale', urlLocale);
    res.cookies.set(LOCALE_COOKIE, urlLocale, {
      path: '/', maxAge: 60 * 60 * 24 * 365, sameSite: 'lax',
    });
    return res;
  }

  // Prefikssiz manzil: til cookie'dan olinadi
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  const activeLocale = (LOCALES as readonly string[]).includes(cookieLocale ?? '')
    ? cookieLocale! : DEFAULT_LOCALE;

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
    const res = NextResponse.next();
    res.headers.set('x-locale', activeLocale);
    return res;
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
    // AI agent — obuna tekshiruvi sahifa ichida, lekin login shu yerda
    '/agent',
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
    // Ro'yxatga kirmagan manzil — Next.js not-found sahifasiga tushadi.
    // Sarlavha shu yerda ham qo'yiladi, aks holda 404 sahifa tanlangan
    // tilni bilmay, doim o'zbekcha chiqardi.
    const res = NextResponse.next();
    res.headers.set('x-locale', activeLocale);
    return res;
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

  // Redirect ham yangilangan cookie larni olib ketishi kerak. Aks holda
  // Supabase yangilagan sessiya tokeni yo'qoladi va foydalanuvchi
  // keyingi so'rovda tizimdan chiqib qolishi mumkin.
  const redirectTo = (target: string) => {
    const res = NextResponse.redirect(new URL(target, request.url));
    for (const cookie of cookiesToSet) {
      res.cookies.set(cookie.name, cookie.value, cookie.options);
    }
    return res;
  };

  // Login qilmagan → login ga redirect
  if (!session) {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', pathname);
    const res = NextResponse.redirect(url);
    for (const cookie of cookiesToSet) {
      res.cookies.set(cookie.name, cookie.value, cookie.options);
    }
    return res;
  }

  // ============================================
  // ROL TEKSHIRISH
  //
  // Har bir rol faqat o'z hududida ishlaydi: teacher → /t-*,
  // parent → /p-*, student → qolgan kabinet sahifalari. Ilgari tekshiruv
  // faqat /a- /t- /p- prefikslariga qo'llanardi, shuning uchun ota-ona
  // yoki o'qituvchi /dashboard ni qo'lda yozib o'quvchi kabinetiga
  // kirib ketardi.
  //
  // Admin bundan mustasno — u barcha kabinetlarni ko'ra oladi.
  // ============================================
  const cookieOpts = {
    httpOnly: true,
    sameSite: 'lax' as const,
    maxAge: ROLE_COOKIE_MAX_AGE,
    path: '/',
  };

  const rememberRole = (r: AppRole) => {
    const value = buildRoleCookie(session.user.id, r);
    response.cookies.set(ROLE_COOKIE, value, cookieOpts);
    cookiesToSet.push({ name: ROLE_COOKIE, value, options: cookieOpts });
  };

  const fetchRole = async (): Promise<AppRole> => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();
    return normalizeRole(profile?.role);
  };

  // Cookie dan rolni o'qish, bo'lmasa DB dan. Kesh har bir so'rovda
  // profiles jadvaliga borishning oldini oladi.
  let role = parseRoleCookie(request.cookies.get(ROLE_COOKIE)?.value, session.user.id);
  let roleFromDb = false;

  if (!role) {
    role = await fetchRole();
    roleFromDb = true;
    rememberRole(role);
  }

  if (!isPathAllowedForRole(role, pathname)) {
    // Keshdagi rol yo'l bermayapti — lekin u eskirgan bo'lishi mumkin.
    // Admin rolni o'zgartirganda cookie httpOnly bo'lgani uchun brauzer
    // tomonidan o'chirib bo'lmaydi va foydalanuvchi eski kabinetda
    // qamalib qolardi. Shuning uchun RAD ETISHDAN OLDIN bazadan bir
    // marta qayta o'qiymiz — narx faqat mos kelmagan holatda to'lanadi.
    if (!roleFromDb) {
      const fresh = await fetchRole();
      if (fresh !== role) {
        role = fresh;
        rememberRole(fresh);
      }
    }

    if (!isPathAllowedForRole(role, pathname)) {
      return redirectTo(roleHome(role));
    }
  }

  response.headers.set('x-locale', activeLocale);
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon.svg|apple-icon.png|manifest.webmanifest|robots.txt|sitemap.xml|images|api).*)',
  ],
};
