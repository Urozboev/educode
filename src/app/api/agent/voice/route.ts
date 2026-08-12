/**
 * EduCode AI Agent — matnni ovozga aylantirish.
 *
 * Mijoz oqim davomida tugagan gaplarni shu yerga yuboradi, javobdagi
 * URL'larni navbat bilan o'ynatadi. Shu tufayli ovoz butun javob
 * kelishini kutmaydi.
 *
 * Provayder ishlamasa `provider: "browser"` qaytadi — mijoz
 * `speechSynthesis` ga o'tadi. Agent hech qachon butunlay soqov
 * bo'lib qolmaydi.
 */

import { NextRequest } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getAgentAccess } from '@/lib/agent/access';
import { synthesize, pickProvider } from '@/lib/agent/voice';
import { stripForSpeech, splitForTTS } from '@/lib/agent/speech-text';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Bitta so'rovda nechta bo'lak — cheksiz matn yuborib xarajat oshirilmasin */
const MAX_CHUNKS = 6;

export async function POST(req: NextRequest) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: 'Tizimga kiring' }, { status: 401 });
  }

  const access = await getAgentAccess(supabase, user.id);
  if (!access.allowed) {
    return Response.json({ error: 'Obuna talab qilinadi', code: access.reason }, { status: 402 });
  }

  const { text, lang = 'uz', raw = false } = await req.json().catch(() => ({} as any));
  if (!text || typeof text !== 'string') {
    return Response.json({ error: 'Matn yo\'q' }, { status: 400 });
  }

  // `raw: true` — matn allaqachon tozalangan (mijoz oqim davomida
  // gap bo'yicha yuboradi va o'zi tozalaydi)
  const speech = raw ? text.trim() : stripForSpeech(text);
  if (!speech) {
    return Response.json({ provider: 'browser', clips: [] });
  }

  const chunks = splitForTTS(speech).slice(0, MAX_CHUNKS);

  // Ketma-ket: provayderlar parallel so'rovlarni cheklaydi va
  // bo'laklar tartibi ovozda muhim.
  const clips: Array<{ text: string; audioUrl: string | null; cached: boolean }> = [];
  let provider = pickProvider(lang);
  let fallbackReason: string | undefined;
  let billedChars = 0;

  for (const chunk of chunks) {
    const result = await synthesize(chunk, lang);
    clips.push({ text: chunk, audioUrl: result.audioUrl, cached: result.cached });
    provider = result.provider;
    if (result.fallbackReason) fallbackReason = result.fallbackReason;
    // Keshdan kelgani uchun to'lanmaydi — hisobga ham qo'shmaymiz
    if (!result.cached && result.audioUrl) billedChars += result.charCount;
  }

  if (billedChars > 0) {
    await supabase.rpc('agent_track_usage', { p_user_id: user.id, p_tts_chars: billedChars });
  }

  return Response.json({ provider, clips, fallbackReason });
}

export async function GET() {
  return Response.json({
    status: 'ok',
    route: '/api/agent/voice',
    provider_uz: pickProvider('uz'),
    provider_ru: pickProvider('ru'),
    provider_en: pickProvider('en'),
    hasAisha: !!process.env.AISHA_API_KEY,
    hasGemini: !!process.env.GEMINI_API_KEY,
  });
}
