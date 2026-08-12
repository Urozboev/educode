/**
 * EduCode AI Agent — ovoz qatlami (server tomon).
 *
 * NEGA ADAPTER: o'zbek TTS bozori hali barqaror emas — narx, sifat
 * va provayderlar tez o'zgaradi. Route'lar to'g'ridan-to'g'ri
 * provayder API'sini chaqirsa, provayderni almashtirish uchun
 * butun kod bazasini kovlashga to'g'ri kelardi. Shu yerda esa bitta
 * `switch` o'zgaradi.
 *
 * NEGA KESH: TTS belgilar bo'yicha pul oladi. Bir xil dars matnini
 * 500 talaba eshitsa, keshsiz 500 marta to'laymiz. Hash bo'yicha
 * kesh bilan — bir marta.
 */

import { createHash } from 'crypto';
import { createAdminClient } from '@/lib/supabase/server';
import type { TTSResult, TTSProviderName } from '../types';
import { synthesizeAisha, type RawAudio } from './providers/aisha';
import { synthesizeGemini, GEMINI_TTS_LANGS } from './providers/gemini';

const BUCKET = 'agent-audio';

/**
 * Til uchun provayderni tanlaydi.
 *
 * O'zbek: Aisha (kalit bo'lsa), aks holda brauzer fallback.
 * Rus/ingliz: Gemini — bir API kaliti bilan ishlaydi, alohida
 * shartnoma kerak emas.
 */
export function pickProvider(lang: string): TTSProviderName {
  const forced = process.env.AGENT_TTS_PROVIDER as TTSProviderName | undefined;
  if (forced) return forced;

  if (lang === 'uz' || lang === 'kaa') {
    return process.env.AISHA_API_KEY ? 'aisha' : 'browser';
  }
  if (GEMINI_TTS_LANGS.includes(lang) && process.env.GEMINI_API_KEY) {
    return 'gemini';
  }
  return process.env.AISHA_API_KEY ? 'aisha' : 'browser';
}

export function voiceCacheKey(text: string, lang: string, provider: string): string {
  return createHash('sha256').update(`${provider}|${lang}|${text}`).digest('hex');
}

/**
 * Matnni ovozga aylantiradi. Kesh → provayder → storage tartibida.
 *
 * Provayder ishlamasa xato tashlamaydi: `browser` fallback qaytaradi
 * va mijoz `speechSynthesis` bilan o'qiydi. Sifat pastroq, lekin
 * agent butunlay soqov bo'lib qolgandan ko'ra yaxshi.
 */
export async function synthesize(text: string, lang = 'uz'): Promise<TTSResult> {
  const clean = text.trim();
  if (!clean) {
    return { provider: 'browser', audioUrl: null, cached: false, charCount: 0 };
  }

  const provider = pickProvider(lang);
  if (provider === 'browser') {
    return {
      provider: 'browser',
      audioUrl: null,
      cached: false,
      charCount: clean.length,
      fallbackReason: 'TTS provayder sozlanmagan',
    };
  }

  const hash = voiceCacheKey(clean, lang, provider);
  const admin = createAdminClient();

  // 1. Kesh
  const { data: cached } = await admin
    .from('agent_voice_cache')
    .select('audio_url, hit_count, char_count')
    .eq('hash', hash)
    .maybeSingle();

  if (cached?.audio_url) {
    // Hisoblagichni yangilaymiz, lekin javobni kutmaymiz — bu
    // statistika, foydalanuvchini kutkazishga arzimaydi.
    void admin
      .from('agent_voice_cache')
      .update({ hit_count: (cached.hit_count ?? 0) + 1 })
      .eq('hash', hash);

    return {
      provider,
      audioUrl: cached.audio_url,
      cached: true,
      charCount: cached.char_count ?? clean.length,
    };
  }

  // 2. Sintez
  let raw: RawAudio;
  try {
    raw = provider === 'gemini'
      ? await synthesizeGemini(clean, lang)
      : await synthesizeAisha(clean, lang);
  } catch (e: any) {
    console.error('[agent/voice] sintez xatosi:', e?.message);
    return {
      provider: 'browser',
      audioUrl: null,
      cached: false,
      charCount: clean.length,
      fallbackReason: e?.message || 'TTS xatosi',
    };
  }

  // 3. Storage
  const path = `${lang}/${hash}.${raw.ext}`;
  const { error: upErr } = await admin.storage
    .from(BUCKET)
    .upload(path, raw.buffer, { contentType: raw.contentType, upsert: true });

  if (upErr) {
    console.error('[agent/voice] storage xatosi:', upErr.message);
    return {
      provider: 'browser',
      audioUrl: null,
      cached: false,
      charCount: clean.length,
      fallbackReason: upErr.message,
    };
  }

  const { data: pub } = admin.storage.from(BUCKET).getPublicUrl(path);
  const audioUrl = pub.publicUrl;

  await admin.from('agent_voice_cache').insert({
    hash,
    lang,
    provider,
    voice: raw.voice,
    text_preview: clean.slice(0, 120),
    char_count: clean.length,
    audio_url: audioUrl,
  });

  return { provider, audioUrl, cached: false, charCount: clean.length };
}
