import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'CLAUDE_API_KEY sozlanmagan', data: null });
  }

  try {
    const { type, topic_title, course_title, language, difficulty } = await request.json();

    let systemPrompt = '';
    let userPrompt = '';

    if (type === 'lecture') {
      systemPrompt = `Sen tajribali dasturlash o'qituvchisisan. HTML formatda ma'ruza yoz. h2,h3,p,pre,code,ul,ol ishlatib. O'zbek tilida. 500-800 so'z.`;
      userPrompt = `Kurs: "${course_title || 'Dasturlash'}". Mavzu: "${topic_title}". Batafsil ma'ruza yoz.`;

    } else if (type === 'quiz') {
      systemPrompt = `Faqat JSON array qaytar. Boshqa hech narsa yozma. O'zbek tilida test yarat.`;
      userPrompt = `"${topic_title}" mavzusidan 5 ta test. JSON: [{"question":"...","question_type":"single","options":[{"id":"a","text":"...","is_correct":false},{"id":"b","text":"...","is_correct":true},{"id":"c","text":"...","is_correct":false},{"id":"d","text":"...","is_correct":false}],"explanation":"...","points":1,"order_index":1}]`;

    } else if (type === 'task') {
      systemPrompt = `Faqat JSON qaytar. O'zbek tilida. Til: ${language || 'python'}.`;
      userPrompt = `"${topic_title}" mavzusidan amaliy topshiriq. JSON: {"title":"...","description":"...","starter_code":"...","solution_code":"...","language":"${language || 'python'}","test_cases":[{"input":"...","expected_output":"...","is_hidden":false}],"hints":[{"order":1,"text":"..."}],"difficulty":"${difficulty || 'easy'}","coin_reward":5,"xp_reward":15}`;

    } else if (type === 'placement_quiz') {
      systemPrompt = `Faqat JSON array qaytar. O'zbek tilida. ${difficulty || 'beginner'} darajada.`;
      userPrompt = `"${topic_title}" sohasidan 3 ta daraja aniqlash savoli. JSON: [{"question":"...","question_type":"single","options":[{"id":"a","text":"...","is_correct":false},{"id":"b","text":"...","is_correct":true},{"id":"c","text":"...","is_correct":false},{"id":"d","text":"...","is_correct":false}],"explanation":"..."}]`;

    } else if (type === 'challenge') {
      systemPrompt = `Faqat JSON qaytar. O'zbek tilida.`;
      userPrompt = `"${topic_title}" topshiriq yarat. JSON: {"title":"...","description":"...","category":"${language || 'math'}","difficulty":"${difficulty || 'easy'}","starter_code":{"python":"def solve():\\n    pass","javascript":"function solve() {\\n}"},"test_cases":[{"input":"...","expected_output":"...","is_hidden":false}],"hidden_test_cases":[{"input":"...","expected_output":"...","is_hidden":true}],"coin_reward":5,"xp_reward":15}`;
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Claude API error:', response.status, errText);
      return NextResponse.json({ error: `API xatolik (${response.status})`, data: null, details: errText.substring(0, 200) });
    }

    const data = await response.json();
    const content = data.content?.[0]?.text || '';

    if (type === 'lecture') {
      return NextResponse.json({ data: content, raw: content });
    }

    // JSON parse
    try {
      const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(cleaned);
      return NextResponse.json({ data: parsed, raw: content });
    } catch {
      return NextResponse.json({ data: null, raw: content, error: 'JSON parse xatolik' });
    }
  } catch (error: any) {
    console.error('AI Generate error:', error);
    return NextResponse.json({ error: error.message, data: null });
  }
}
