/**
 * EduCode AI Agent — Gemini'dan tuzilgan (JSON) javob olish.
 *
 * Chat route oqim bilan ishlaydi, planner esa yo'q: unga to'liq va
 * tekshirilgan JSON kerak. `responseMimeType: application/json` bilan
 * model markdown ```json bloki qo'shmaydi — aks holda har safar
 * qo'lda tozalashga to'g'ri kelardi.
 */

/**
 * Model JSON satri ichida XOM qator ko'chirish qoldirsa tuzatadi.
 *
 * Bu nazariy muammo emas: `responseMimeType: application/json`
 * bo'lsa ham, kod qaytaradigan javoblarda (dars misollari, amaliy
 * topshiriqning `solution_code` maydoni) model ko'p marta
 * "\n" o'rniga haqiqiy qator ko'chirish yozadi. JSON standarti
 * satr ichida boshqaruv belgisini taqiqlaydi, natijada butun
 * javob "Bad control character" bilan yo'qoladi.
 *
 * Satr ichidami yoki tashqarisidami — qo'shtirnoq va ekranlashni
 * kuzatib borish orqali aniqlanadi.
 */
export function escapeControlCharsInStrings(raw: string): string {
  let out = '';
  let inString = false;
  let escaped = false;

  for (const ch of raw) {
    if (escaped) { out += ch; escaped = false; continue; }
    if (ch === '\\') { out += ch; escaped = true; continue; }
    if (ch === '"') { inString = !inString; out += ch; continue; }

    if (inString) {
      const code = ch.charCodeAt(0);
      if (ch === '\n') { out += '\\n'; continue; }
      if (ch === '\r') { out += '\\r'; continue; }
      if (ch === '\t') { out += '\\t'; continue; }
      if (code < 0x20) { out += '\\u' + code.toString(16).padStart(4, '0'); continue; }
    }

    out += ch;
  }

  return out;
}

function parseModelJson<T>(text: string): T {
  try {
    return JSON.parse(text) as T;
  } catch {
    // Ikkinchi urinish — xom boshqaruv belgilarini ekranlab
    return JSON.parse(escapeControlCharsInStrings(text)) as T;
  }
}

export interface JsonCallResult<T> {
  data: T | null;
  error?: string;
  tokensIn: number;
  tokensOut: number;
  model: string;
}

export async function geminiJson<T>(
  systemPrompt: string,
  userPrompt: string,
  opts: { model?: string; maxOutputTokens?: number; temperature?: number } = {},
): Promise<JsonCallResult<T>> {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = opts.model
    || process.env.AGENT_PLANNER_MODEL
    || process.env.AGENT_MODEL
    || 'gemini-flash-latest';

  if (!apiKey) {
    return { data: null, error: 'GEMINI_API_KEY sozlanmagan', tokensIn: 0, tokensOut: 0, model };
  }

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            { role: 'user', parts: [{ text: systemPrompt }] },
            { role: 'model', parts: [{ text: 'Tushundim. Faqat JSON qaytaraman.' }] },
            { role: 'user', parts: [{ text: userPrompt }] },
          ],
          generationConfig: {
            responseMimeType: 'application/json',
            maxOutputTokens: opts.maxOutputTokens ?? 4096,
            temperature: opts.temperature ?? 0.7,
          },
          safetySettings: [
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
          ],
        }),
      },
    );

    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      return {
        data: null,
        error: `Gemini ${res.status}: ${detail.slice(0, 200)}`,
        tokensIn: 0, tokensOut: 0, model,
      };
    }

    const json = await res.json();
    const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;
    const tokensIn = json?.usageMetadata?.promptTokenCount ?? 0;
    const tokensOut = json?.usageMetadata?.candidatesTokenCount ?? 0;
    const reason = json?.candidates?.[0]?.finishReason;

    if (!text) {
      // Xavfsizlik filtri yoki bo'sh javob — sababi finishReason da
      return { data: null, error: `Javob bo'sh (${reason || 'nomalum'})`, tokensIn, tokensOut, model };
    }

    // Chegaraga urilgan javob yarim JSON bo'ladi va `JSON.parse` da
    // "Unterminated string" beradi — bu xato o'qiganda chalkashtiradi.
    // Sababini aniq aytamiz: chegarani oshirish kerak.
    if (reason === 'MAX_TOKENS') {
      return {
        data: null,
        error: `Javob token chegarasiga urildi (maxOutputTokens=${opts.maxOutputTokens ?? 4096}). Chegarani oshiring yoki so'rovni qisqartiring.`,
        tokensIn, tokensOut, model,
      };
    }

    return { data: parseModelJson<T>(text), tokensIn, tokensOut, model };
  } catch (e: any) {
    return { data: null, error: e?.message || 'JSON tahlil qilinmadi', tokensIn: 0, tokensOut: 0, model };
  }
}
