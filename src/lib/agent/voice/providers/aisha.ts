/**
 * Aisha (aisha.group) — o'zbek TTS.
 *
 * NEGA GEMINI EMAS: Gemini TTS 84 tilni qo'llab-quvvatlaydi, lekin
 * o'zbek tili ular ro'yxatida YO'Q. Google Cloud TTS da ham `uz-UZ`
 * ovozi yo'q. Shuning uchun agentning "miyasi" Gemini bo'lsa ham,
 * o'zbekcha ovozi mahalliy provayderdan olinadi.
 *
 * API: POST https://back.aisha.group/api/v1/tts/post/
 *      X-Api-Key: <key>, form-encoded
 *      201 → { "audio_path": "/media/tts_audios/<id>.wav" }
 *
 * Chegara: bitta so'rovda 1000 belgi (shu sababli `splitForTTS`).
 */

const BASE_URL = 'https://back.aisha.group';

export interface RawAudio {
  buffer: Buffer;
  ext: string;
  contentType: string;
  voice: string;
}

export async function synthesizeAisha(
  text: string,
  lang: string,
): Promise<RawAudio> {
  const apiKey = process.env.AISHA_API_KEY;
  if (!apiKey) throw new Error('AISHA_API_KEY sozlanmagan');

  const model = process.env.AISHA_TTS_MODEL || 'Gulnoza';
  const mood = process.env.AISHA_TTS_MOOD || 'Neutral';
  const voiceId = process.env.AISHA_VOICE_ID;

  const body = new URLSearchParams();
  body.set('transcript', text);
  // Aisha faqat uz/ru/en qabul qiladi; qoraqalpoqcha uchun eng yaqini — uz
  body.set('language', ['uz', 'ru', 'en'].includes(lang) ? lang : 'uz');
  if (voiceId) {
    body.set('voice_id', voiceId);
  } else {
    // model/mood faqat o'rnatilgan o'zbek ovozi uchun ma'noga ega
    body.set('model', model);
    body.set('mood', mood);
  }

  const res = await fetch(`${BASE_URL}/api/v1/tts/post/`, {
    method: 'POST',
    headers: {
      'X-Api-Key': apiKey,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Aisha TTS ${res.status}: ${detail.slice(0, 200)}`);
  }

  const data = await res.json();

  // Asinxron rejim (202) — bizga darhol audio kerak, webhook ishlatmaymiz
  if (!data?.audio_path) {
    throw new Error(`Aisha javobida audio_path yo'q: ${JSON.stringify(data).slice(0, 200)}`);
  }

  const audioUrl = data.audio_path.startsWith('http')
    ? data.audio_path
    : `${BASE_URL}${data.audio_path}`;

  // Faylni o'zimizga ko'chirib olamiz: provayder vaqtinchalik fayllarni
  // tozalab yuborsa, keshimizdagi havola o'lik bo'lib qolmasin.
  const audioRes = await fetch(audioUrl);
  if (!audioRes.ok) throw new Error(`Aisha audio yuklab bo'lmadi: ${audioRes.status}`);

  const buffer = Buffer.from(await audioRes.arrayBuffer());

  return {
    buffer,
    ext: 'wav',
    contentType: 'audio/wav',
    voice: voiceId || `${model}/${mood}`,
  };
}
