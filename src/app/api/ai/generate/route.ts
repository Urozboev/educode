import { NextRequest, NextResponse } from 'next/server';
import { HINT_TIER_GENERATION_PROMPT, PROMPT_VERSIONS } from '@/lib/ai-prompts';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'CLAUDE_API_KEY sozlanmagan', data: null });
  }

  try {
    const { type, topic_title, course_title, language, difficulty, task_description, task_solution } = await request.json();
    let systemPrompt = '', userPrompt = '';

    const DOMAIN_RULE = `MUHIM QOIDA: Faqat "${course_title || topic_title}" mavzusi doirasida yoz. Sohadan chiqma. IT, dasturlash, kompyuter savodxonligi va prompt engineering doirasida bo'l.`;

    if (type === 'lecture') {
      systemPrompt = `Sen tajribali dasturlash o'qituvchisisan. HTML formatda ma'ruza yoz. h2,h3,p,pre,code,ul,ol ishlatib. O'zbek tilida. 500-800 so'z. ${DOMAIN_RULE}`;
      userPrompt = `Kurs: "${course_title || 'Dasturlash'}". Mavzu: "${topic_title}". Faqat shu mavzu doirasida batafsil ma'ruza yoz.`;
    } else if (type === 'quiz' || type === 'placement_quiz') {
      const count = type === 'placement_quiz' ? 3 : 5;
      systemPrompt = `Faqat JSON array qaytar. Boshqa hech narsa yozma. O'zbek tilida. ${DOMAIN_RULE}`;
      userPrompt = `"${topic_title}" mavzusidan ${count} ta test. Faqat shu mavzu doirasida bo'lsin. JSON: [{"question":"...","question_type":"single","options":[{"id":"a","text":"...","is_correct":false},{"id":"b","text":"...","is_correct":true},{"id":"c","text":"...","is_correct":false},{"id":"d","text":"...","is_correct":false}],"explanation":"...","points":1,"order_index":1}]`;
    } else if (type === 'task') {
      systemPrompt = `Faqat JSON qaytar. O'zbek tilida. Til: ${language || 'python'}. ${DOMAIN_RULE}
MUHIM QOIDALAR:
1. starter_code da input() funksiyasidan foydalanilsin (stdin dan o'qish)
2. test_cases da har xil qiymatlar bilan kamida 4 ta test bo'lsin
3. input — stdin ga beriladigan matn, expected_output — print() chiqishi
4. Masalan: input="5 3", expected_output="8" (foydalanuvchi input() dan o'qib print() qiladi)
5. hints — TO'RT BOSQICHLI: 1-eng noaniq, 4-konkret kod parchasi (lekin to'liq yechim emas).
   Format: [{"level":1,"text":"...","unlock_cost":0},{"level":2,"text":"...","unlock_cost":2},{"level":3,"text":"...","unlock_cost":5},{"level":4,"text":"...","unlock_cost":10}]`;
      userPrompt = `"${topic_title}" mavzusidan amaliy topshiriq yarat. Faqat shu mavzuga oid.
STARTER CODE input() ishlatsin. Kamida 4 ta test case bo'lsin (har xil qiymatlar bilan).
hints maydonida 4 daraja maslahat bo'lsin (level 1-4, har biri oldingisidan aniqroq).
JSON: {"title":"...","description":"... input() funksiyasidan foydalaning.","starter_code":"# input() dan o'qing va print() bilan chiqaring\\nn = int(input())\\n# kodingizni yozing\\nprint(natija)","solution_code":"...","language":"${language || 'python'}","test_cases":[{"input":"4","expected_output":"Juft","is_hidden":false},{"input":"7","expected_output":"Toq","is_hidden":false},{"input":"0","expected_output":"Juft","is_hidden":false},{"input":"13","expected_output":"Toq","is_hidden":true}],"hints":[{"level":1,"text":"Algoritmingizning birinchi bosqichini tahlil qiling","unlock_cost":0},{"level":2,"text":"Sonni 2 ga bo'lishdan qolgan qoldiqni o'ylab ko'ring","unlock_cost":2},{"level":3,"text":"% operatori 0 ga teng bo'lsa juft bo'ladi","unlock_cost":5},{"level":4,"text":"if n % 2 == 0: print('Juft')","unlock_cost":10}],"difficulty":"${difficulty || 'easy'}","coin_reward":5,"xp_reward":15}`;
    } else if (type === 'hint_tier') {
      // Mavjud topshiriq uchun 4 darajali hint generatsiya qilish
      systemPrompt = HINT_TIER_GENERATION_PROMPT;
      userPrompt = `Topshiriq tavsifi:
${task_description || topic_title || ''}

${task_solution ? `Yechim (referens uchun, hint'ga to'g'ridan-to'g'ri tushirmang):\n${task_solution}` : ''}

Yuqoridagi topshiriq uchun 4 daraja maslahat tuzing.`;
    } else if (type === 'challenge') {
      systemPrompt = `Faqat JSON qaytar. O'zbek tilida. ${DOMAIN_RULE}
MUHIM: starter_code da input() ishlatilsin. test_cases da kamida 4 ta har xil qiymatli test bo'lsin.
hints maydoni 4 BOSQICHLI tier (level 1-4, har biri oldingisidan aniqroq). 4-daraja kod parchasi bo'lishi mumkin (to'liq yechim emas).`;
      userPrompt = `"${topic_title}" topshiriq yarat. Dasturlash/IT doirasida.
Foydalanuvchi input() bilan ma'lumot o'qib, print() bilan javob chiqarishi kerak. Kamida 4 ta test case, har xil qiymatlar bilan.
hints maydonida 4 daraja maslahat bo'lsin.
JSON: {"title":"...","description":"... input() funksiyasidan foydalaning.","category":"${language || 'math'}","difficulty":"${difficulty || 'easy'}","starter_code":{"python":"# input() dan o'qing va print() bilan chiqaring\\n","javascript":"// readline() dan o'qing va console.log() bilan chiqaring\\n"},"test_cases":[{"input":"...","expected_output":"...","is_hidden":false},{"input":"...","expected_output":"...","is_hidden":false}],"hidden_test_cases":[{"input":"...","expected_output":"...","is_hidden":true},{"input":"...","expected_output":"...","is_hidden":true}],"hints":[{"level":1,"text":"...","unlock_cost":0},{"level":2,"text":"...","unlock_cost":2},{"level":3,"text":"...","unlock_cost":5},{"level":4,"text":"...","unlock_cost":10}],"coin_reward":5,"xp_reward":15}`;
    } else {
      return NextResponse.json({ error: 'Noma\'lum tur: ' + type, data: null });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 4096, system: systemPrompt, messages: [{ role: 'user', content: userPrompt }] }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Claude API:', response.status, errText);
      return NextResponse.json({ error: `API xatolik (${response.status})`, data: null });
    }

    const data = await response.json();
    const content = data.content?.[0]?.text || '';

    if (type === 'lecture') return NextResponse.json({ data: content, raw: content, meta: { model: 'claude-sonnet-4-20250514', prompt_template: 'lecture_v1' } });

    try {
      const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      return NextResponse.json({
        data: JSON.parse(cleaned),
        raw: content,
        meta: {
          model: 'claude-sonnet-4-20250514',
          prompt_template: type === 'hint_tier' ? PROMPT_VERSIONS.hintTier : `${type}_v1`,
        },
      });
    } catch (_e) {
      return NextResponse.json({ data: null, raw: content, error: 'JSON parse xatolik' });
    }
  } catch (error: any) {
    console.error('AI Generate xatolik:', error);
    return NextResponse.json({ error: error.message, data: null });
  }
}

export async function GET() {
  return NextResponse.json({ status: 'ok', route: '/api/ai/generate', hasKey: !!process.env.CLAUDE_API_KEY });
}
