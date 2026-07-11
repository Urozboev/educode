import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Himoyalangan video uchun vaqtinchalik (signed) embed URL beradi.
 *
 * Ruxsat modeli: topic'ni foydalanuvchi sessiyasi bilan o'qiymiz.
 * topics RLS policy'si (07-migration) qatorni faqat quyidagilarga beradi:
 *   - is_free_preview = true, YOKI
 *   - kurs bepul, YOKI
 *   - foydalanuvchi kursga yozilgan, YOKI
 *   - admin/teacher
 * Qator kelsa — ruxsat bor. Kelmasa — 403.
 *
 * Provider bo'yicha embed URL:
 *   - bunny: token bilan imzolangan URL (4 soat amal qiladi) — TAVSIYA ETILGAN
 *   - cloudflare: iframe embed
 *   - youtube: nocookie embed (himoya cheklangan — faqat bepul kontent uchun)
 *   - vimeo: dnt embed
 *
 * Kerakli env'lar (Bunny Stream):
 *   BUNNY_STREAM_LIBRARY_ID  — video kutubxona ID
 *   BUNNY_STREAM_TOKEN_KEY   — Token Authentication Key (Stream > Security)
 */

const TOKEN_TTL_SECONDS = 4 * 60 * 60; // 4 soat

function bunnySignedEmbed(libraryId: string, videoId: string, tokenKey: string): string {
  const expires = Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS;
  // Bunny token: SHA256_HEX(token_key + video_id + expires)
  const token = createHash('sha256')
    .update(tokenKey + videoId + expires)
    .digest('hex');
  return `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}?token=${token}&expires=${expires}&autoplay=false&preload=true`;
}

export async function POST(request: NextRequest) {
  try {
    const { topic_id } = await request.json();
    if (!topic_id) {
      return NextResponse.json({ error: 'topic_id kerak' }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();

    // RLS ruxsat qoidasi shu yerda ishlaydi: qator kelmasa — ruxsat yo'q
    const { data: topic } = await supabase
      .from('topics')
      .select('id, course_id, video_url, video_provider, video_id, is_free_preview, is_published')
      .eq('id', topic_id)
      .maybeSingle();

    if (!topic || !topic.is_published) {
      const { data: { user } } = await supabase.auth.getUser();
      return NextResponse.json(
        {
          error: user ? 'Bu darsni ko\'rish uchun kursga yoziling' : 'Tizimga kiring',
          requires: user ? 'enrollment' : 'auth',
        },
        { status: 403 },
      );
    }

    // ============ EMBED URL QURISH ============
    const provider = topic.video_provider || 'youtube';

    if (provider === 'bunny' && topic.video_id) {
      const libraryId = process.env.BUNNY_STREAM_LIBRARY_ID;
      const tokenKey = process.env.BUNNY_STREAM_TOKEN_KEY;
      if (!libraryId || !tokenKey) {
        return NextResponse.json({ error: 'Bunny Stream sozlanmagan (env)' }, { status: 500 });
      }
      return NextResponse.json({
        provider: 'bunny',
        embed_url: bunnySignedEmbed(libraryId, topic.video_id, tokenKey),
        expires_in: TOKEN_TTL_SECONDS,
      });
    }

    if (provider === 'cloudflare' && topic.video_id) {
      const customerCode = process.env.CF_STREAM_CUSTOMER_CODE;
      if (!customerCode) {
        return NextResponse.json({ error: 'Cloudflare Stream sozlanmagan (env)' }, { status: 500 });
      }
      return NextResponse.json({
        provider: 'cloudflare',
        embed_url: `https://customer-${customerCode}.cloudflarestream.com/${topic.video_id}/iframe`,
        expires_in: TOKEN_TTL_SECONDS,
      });
    }

    if (provider === 'vimeo' && topic.video_id) {
      return NextResponse.json({
        provider: 'vimeo',
        embed_url: `https://player.vimeo.com/video/${topic.video_id}?dnt=1&title=0&byline=0&portrait=0`,
        expires_in: TOKEN_TTL_SECONDS,
      });
    }

    // YouTube (video_id yoki eski video_url)
    let ytId = topic.video_id;
    if (!ytId && topic.video_url) {
      const m = topic.video_url.match(/(?:watch\?v=|youtu\.be\/|embed\/)([\w-]{11})/);
      ytId = m?.[1] ?? null;
    }
    if (ytId) {
      return NextResponse.json({
        provider: 'youtube',
        embed_url: `https://www.youtube-nocookie.com/embed/${ytId}?modestbranding=1&rel=0&iv_load_policy=3`,
        expires_in: TOKEN_TTL_SECONDS,
      });
    }

    // direct URL (mp4) — himoyasiz, faqat eski kontent uchun
    if (topic.video_url) {
      return NextResponse.json({
        provider: 'direct',
        embed_url: topic.video_url,
        expires_in: TOKEN_TTL_SECONDS,
      });
    }

    return NextResponse.json({ error: 'Video mavjud emas' }, { status: 404 });
  } catch (error: any) {
    console.error('video/token error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
