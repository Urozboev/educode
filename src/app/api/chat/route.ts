import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SYSTEM_PROMPT = `Sen EduCode platformasining AI yordamchisisisan. Faqat quyidagi sohalar bo'yicha javob ber:
- Dasturlash (Python, JavaScript, HTML/CSS, algoritimlar, ma'lumot tuzilmalari)
- Kompyuter savodxonligi (operatsion tizimlar, internet, xavfsizlik, ofis dasturlari)
- Prompt Engineering (sun'iy intellekt bilan ishlash, prompt yozish usullari)

QOIDALAR:
1. Faqat yuqoridagi sohalar bo'yicha javob ber. Boshqa sohalarga "Bu soha bo'yicha yordam bera olmayman" de.
2. O'zbek tilida javob ber (agar savol o'zbekcha bo'lsa).
3. Kod misollarini \`\`\` ichida ber.
4. Qisqa va aniq javob ber — 200 so'zdan oshmasin (agar batafsil so'ralmasa).
5. Xushmuomala va rag'batlantiruvchi bo'l.`;

export async function POST(request: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.NEXT_PUBLIC_GEMINI_MODEL || 'gemini-2.0-flash';

  if (!apiKey) {
    return NextResponse.json({ reply: '⚠️ GEMINI_API_KEY sozlanmagan. .env.local faylini tekshiring.' });
  }

  try {
    const { message, history } = await request.json();

    if (!message?.trim()) {
      return NextResponse.json({ reply: 'Savolingizni yozing.' });
    }

    // Gemini API formatida tarix tayyorlash (max 6 ta xabar — token tejash)
    const contents: any[] = [];

    // System prompt birinchi user message sifatida
    contents.push({ role: 'user', parts: [{ text: SYSTEM_PROMPT }] });
    contents.push({ role: 'model', parts: [{ text: 'Tushundim. Faqat IT sohalari bo'yicha yordam beraman.' }] });

    // Oxirgi 6 ta xabarni qo'shish (token tejash)
    const recentHistory = (history || []).slice(-6);
    for (const msg of recentHistory) {
      contents.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      });
    }

    // Yangi xabar
    contents.push({ role: 'user', parts: [{ text: message }] });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: {
            maxOutputTokens: 1024,
            temperature: 0.7,
            topP: 0.9,
          },
          safetySettings: [
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
          ],
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error('Gemini API:', response.status, err);
      return NextResponse.json({ reply: `⚠️ AI xatolik (${response.status}). API kalitni tekshiring.` });
    }

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Javob olinmadi.';

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error('Chat error:', error);
    return NextResponse.json({ reply: `⚠️ Xatolik: ${error.message}` });
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    route: '/api/chat',
    model: process.env.NEXT_PUBLIC_GEMINI_MODEL || 'gemini-2.0-flash',
    hasKey: !!process.env.GEMINI_API_KEY,
  });
}
