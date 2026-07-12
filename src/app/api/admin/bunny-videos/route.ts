import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Bunny Stream kutubxonasidagi videolar ro'yxati (faqat admin).
 * Admin panelda mavzuga video GUID tanlash uchun ishlatiladi.
 *
 * Kerak: BUNNY_API_KEY — bu KUTUBXONA API kaliti!
 * Joyi: bunny.net -> Stream -> [kutubxona] -> chap menyu "API" -> API Key
 * (Akkaunt API kaliti EMAS — u ishlamaydi)
 */
export async function GET() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'forbidden' }, { status: 403 });

  const libraryId = process.env.BUNNY_STREAM_LIBRARY_ID;
  const apiKey = process.env.BUNNY_API_KEY;
  if (!libraryId || !apiKey) {
    return NextResponse.json({
      error: "BUNNY_STREAM_LIBRARY_ID yoki BUNNY_API_KEY .env.local da yo'q",
    }, { status: 500 });
  }

  try {
    const res = await fetch(
      `https://video.bunnycdn.com/library/${libraryId}/videos?page=1&itemsPerPage=100&orderBy=date`,
      { headers: { AccessKey: apiKey }, cache: 'no-store' },
    );
    const data = await res.json();

    if (!res.ok || !data.items) {
      return NextResponse.json({
        error: res.status === 401
          ? "Bunny API kaliti noto'g'ri. Kutubxona API kalitini oling: Stream -> kutubxona -> API -> API Key"
          : `Bunny xatosi (${res.status})`,
      }, { status: 502 });
    }

    return NextResponse.json({
      total: data.totalItems,
      videos: data.items.map((v: any) => ({
        guid: v.guid,
        title: v.title,
        status: v.status === 4 ? 'tayyor' : v.status === 3 ? 'kodlanmoqda' : `holat-${v.status}`,
        minutes: Math.round((v.length || 0) / 60),
        thumbnail: v.thumbnailFileName
          ? `https://${process.env.BUNNY_CDN_HOSTNAME || ''}/${v.guid}/${v.thumbnailFileName}`
          : null,
      })),
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
