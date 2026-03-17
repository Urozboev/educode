import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const apiKey = process.env.CLAUDE_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      feedback: '⚠️ CLAUDE_API_KEY .env.local faylida sozlanmagan. Qo\'shib, serverni qayta ishga tushiring.',
    });
  }

  try {
    const body = await request.json();
    const { feedback_type, code, task_description, language, test_results, user_level } = body;

    let systemPrompt = "Sen dasturlash o'qituvchisisan. O'zbek tilida javob ber. Qisqa va aniq bo'l.";
    let userPrompt = '';

    if (feedback_type === 'code_review') {
      systemPrompt = `Sen tajribali dasturlash o'qituvchisisan. O'zbek tilida javob ber.
Talaba darajasi: ${user_level || 'beginner'}. Qisqa, rag'batlantiruvchi va aniq feedback ber.
Kod xatolarini tushuntir, to'g'ri yo'lini ko'rsat.`;
      userPrompt = `Topshiriq: ${task_description || 'Dasturlash topshiriqni bajarish'}
Til: ${language || 'python'}
Kod:
\`\`\`
${code || ''}
\`\`\`
Test natijalari: ${JSON.stringify(test_results || [])}
Kodini tahlil qilib feedback ber.`;

    } else if (feedback_type === 'quiz_review') {
      userPrompt = `Test natijasi: ${test_results?.score || 0}/${test_results?.total || 0}.
Xato javoblar: ${JSON.stringify(test_results?.wrong_answers || [])}
Qaysi mavzularni qayta o'rganish kerak?`;

    } else if (feedback_type === 'placement_analysis') {
      systemPrompt = `Sen ta'lim ekspertisan. O'zbek tilida. 150 so'zda: umumiy baho, kuchli/zaif tomonlar, tavsiya, motivatsiya.`;
      const cats = test_results?.categories || [];
      userPrompt = `Daraja testi: ${test_results?.score}/${test_results?.total}, daraja: ${test_results?.level}.
Sohalar:
${cats.map((c: any) => `${c.name}: ${c.correct}/${c.total} (${c.percentage}%)`).join('\n')}`;

    } else if (feedback_type === 'topic_recommendation') {
      userPrompt = `Daraja: ${user_level}. Tugatganlar: ${JSON.stringify(test_results?.completed_topics || [])}. Keyingi mavzuni tavsiya qil.`;

    } else {
      return NextResponse.json({ feedback: 'Noma\'lum feedback turi: ' + feedback_type });
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
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Claude API xatolik:', response.status, errText);
      return NextResponse.json({
        feedback: `⚠️ AI javob bermadi (${response.status}). .env.local da CLAUDE_API_KEY to'g'riligini tekshiring.`,
      });
    }

    const data = await response.json();
    const feedback = data.content?.[0]?.text || 'AI javob bermadi';
    return NextResponse.json({ feedback });
  } catch (error: any) {
    console.error('AI Feedback xatolik:', error);
    return NextResponse.json({ feedback: `⚠️ Xatolik: ${error.message}` });
  }
}

// Health check
export async function GET() {
  const hasKey = !!process.env.CLAUDE_API_KEY;
  return NextResponse.json({
    status: 'ok',
    route: '/api/ai/feedback',
    hasApiKey: hasKey,
    keyPrefix: hasKey ? process.env.CLAUDE_API_KEY!.substring(0, 10) + '...' : 'NOT SET',
  });
}
