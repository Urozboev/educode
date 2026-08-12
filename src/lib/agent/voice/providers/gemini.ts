/**
 * Gemini TTS — rus va ingliz tillari uchun.
 *
 * O'zbek tili Gemini TTS ro'yxatida yo'q, shuning uchun `uz` bu
 * provayderga umuman yuborilmaydi (index.ts da tanlanadi).
 *
 * Gemini xom PCM qaytaradi (24kHz, 16-bit, mono) — brauzer buni
 * to'g'ridan-to'g'ri o'ynata olmaydi, shuning uchun WAV sarlavhasini
 * o'zimiz qo'shamiz.
 */

import type { RawAudio } from './aisha';

/** Gemini TTS qo'llab-quvvatlaydigan tillar (o'zbek yo'q) */
export const GEMINI_TTS_LANGS = ['ru', 'en'];

const SAMPLE_RATE = 24000;
const BITS_PER_SAMPLE = 16;
const CHANNELS = 1;

export async function synthesizeGemini(text: string, lang: string): Promise<RawAudio> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY sozlanmagan');
  if (!GEMINI_TTS_LANGS.includes(lang)) {
    throw new Error(`Gemini TTS "${lang}" tilini qo'llab-quvvatlamaydi`);
  }

  const model = process.env.GEMINI_TTS_MODEL || 'gemini-2.5-flash-preview-tts';
  const voice = process.env.GEMINI_TTS_VOICE || 'Kore';

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text }] }],
        generationConfig: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } },
          },
        },
      }),
    },
  );

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Gemini TTS ${res.status}: ${detail.slice(0, 200)}`);
  }

  const data = await res.json();
  const b64 = data?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!b64) throw new Error('Gemini TTS javobida audio yo\'q');

  const pcm = Buffer.from(b64, 'base64');

  return {
    buffer: pcmToWav(pcm),
    ext: 'wav',
    contentType: 'audio/wav',
    voice,
  };
}

/** 44 baytli standart WAV sarlavhasi + xom PCM */
function pcmToWav(pcm: Buffer): Buffer {
  const byteRate = (SAMPLE_RATE * CHANNELS * BITS_PER_SAMPLE) / 8;
  const blockAlign = (CHANNELS * BITS_PER_SAMPLE) / 8;
  const header = Buffer.alloc(44);

  header.write('RIFF', 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);          // fmt bo'limi uzunligi
  header.writeUInt16LE(1, 20);           // PCM
  header.writeUInt16LE(CHANNELS, 22);
  header.writeUInt32LE(SAMPLE_RATE, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(BITS_PER_SAMPLE, 34);
  header.write('data', 36);
  header.writeUInt32LE(pcm.length, 40);

  return Buffer.concat([header, pcm]);
}
