/**
 * Matnni ovozga tayyorlash. Pure funksiyalar — server ham, brauzer
 * ham ishlatadi, hech qanday tashqi bog'liqlik yo'q.
 */

/** Aisha API bitta so'rovda 1000 belgigacha qabul qiladi — zaxira bilan olamiz */
export const TTS_CHUNK_LIMIT = 900;

/**
 * Markdown va kodni ovoz uchun tozalaydi.
 *
 * Kod bloklari butunlay olib tashlanadi va o'rniga qisqa ishora
 * qo'yiladi: TTS `for i in range(10):` ni o'qisa, tinglovchi uchun
 * bu shovqindan boshqa narsa emas. Kod ekranda ko'rinadi, quloq
 * uchun esa "kod ekranda" degani kifoya.
 */
export function stripForSpeech(markdown: string): string {
  return markdown
    // ```kod``` bloklari
    .replace(/```[\s\S]*?```/g, ' Kodni ekranda ko\'rishingiz mumkin. ')
    // `inline kod` — belgilarni olib tashlaymiz, matnni qoldiramiz
    .replace(/`([^`]+)`/g, '$1')
    // sarlavha belgilari
    .replace(/^#{1,6}\s+/gm, '')
    // **qalin** va *kursiv*
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    // [matn](havola) → matn
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // ro'yxat belgilari
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    // emoji va boshqa belgilar ovozda "noma'lum belgi" bo'lib chiqadi.
    // Surrogat juftlik ko'rinishida yozilgan — `u` bayrog'i tsconfig
    // target'i bilan mos kelmaydi.
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '')
    .replace(/[☀-➿️]/g, '')
    .replace(/\n{2,}/g, '. ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/**
 * Matnni TTS chegarasiga sig'adigan bo'laklarga bo'ladi.
 * Gap o'rtasidan kesmaydi: kesilgan joyda ovoz g'alati to'xtaydi.
 */
export function splitForTTS(text: string, limit = TTS_CHUNK_LIMIT): string[] {
  const clean = text.trim();
  if (!clean) return [];
  if (clean.length <= limit) return [clean];

  const sentences = clean.match(/[^.!?…]+[.!?…]+|\s*[^.!?…]+$/g) || [clean];
  const chunks: string[] = [];
  let current = '';

  for (const raw of sentences) {
    const sentence = raw.trim();
    if (!sentence) continue;

    // Bitta gap ham chegaradan uzun bo'lsa — so'zlar bo'yicha kesamiz
    if (sentence.length > limit) {
      if (current) { chunks.push(current); current = ''; }
      let buf = '';
      for (const word of sentence.split(/\s+/)) {
        if ((buf + ' ' + word).trim().length > limit) { chunks.push(buf.trim()); buf = word; }
        else buf = (buf + ' ' + word).trim();
      }
      if (buf) current = buf;
      continue;
    }

    if ((current + ' ' + sentence).trim().length > limit) {
      chunks.push(current.trim());
      current = sentence;
    } else {
      current = (current + ' ' + sentence).trim();
    }
  }

  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

/**
 * Oqim (stream) davomida tugagan gaplarni ajratadi — ovoz butun
 * javob kelishini kutmasdan boshlanishi uchun.
 *
 * Qaytaradi: [gapirishga tayyor matn, hali tugallanmagan qoldiq]
 */
export function takeCompleteSentences(buffer: string, minLength = 40): [string, string] {
  if (buffer.length < minLength) return ['', buffer];

  // Tugallangan oxirgi gap chegarasini topamiz
  const match = buffer.match(/^[\s\S]*[.!?…](?=\s|$)/);
  if (!match) return ['', buffer];

  const ready = match[0];
  if (ready.trim().length < minLength) return ['', buffer];

  return [ready.trim(), buffer.slice(ready.length)];
}
