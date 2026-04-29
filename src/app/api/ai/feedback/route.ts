import { NextRequest, NextResponse } from 'next/server';
import { SOCRATIC_FEEDBACK_PROMPT, PROMPT_VERSIONS } from '@/lib/ai-prompts';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { checkAIQuota, logAIInteraction } from '@/lib/ai/usage';

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
    const { feedback_type, code, task_description, language, test_results, user_level, task_id, task_type, topic_id } = body;

    const supabase = createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Quota tekshiruv faqat code_review (talaba ishlayotgan paytda) uchun.
    // Quiz/placement_analysis/topic_recommendation — sistemali so'rovlar, limitga kirmaydi.
    const quotaApplies = feedback_type === 'code_review';
    let quota = null as Awaited<ReturnType<typeof checkAIQuota>> | null;
    if (user && quotaApplies) {
      quota = await checkAIQuota(supabase, user.id);
      if (!quota.allowed) {
        return NextResponse.json({
          feedback: quota.message,
          quota,
          blocked: true,
        }, { status: 429 });
      }
    }

    let systemPrompt = "Sen dasturlash o'qituvchisisan. O'zbek tilida javob ber. Qisqa va aniq bo'l.";
    let userPrompt = '';
    let promptTemplate: string = PROMPT_VERSIONS.socraticFeedback;

    if (feedback_type === 'code_review') {
      systemPrompt = SOCRATIC_FEEDBACK_PROMPT + `\n\nTalaba darajasi: ${user_level || 'beginner'}.`;
      userPrompt = `Topshiriq: ${task_description || 'Dasturlash topshiriqni bajarish'}
Til: ${language || 'python'}
Talabaning kodi:
\`\`\`
${code || ''}
\`\`\`
Test natijalari: ${JSON.stringify(test_results || [])}

Yuqoridagi qoidalar asosida talabaga Sokratik usulda yo'l-yo'riq ber. To'liq yechim yozma.`;

    } else if (feedback_type === 'quiz_review') {
      promptTemplate = PROMPT_VERSIONS.quizReview;
      userPrompt = `Test natijasi: ${test_results?.score || 0}/${test_results?.total || 0}.
Xato javoblar: ${JSON.stringify(test_results?.wrong_answers || [])}
Qaysi mavzularni qayta o'rganish kerak? Qisqa, motivatsiyali javob ber.`;

    } else if (feedback_type === 'placement_analysis') {
      promptTemplate = PROMPT_VERSIONS.placementAnalysis;
      systemPrompt = `Sen ta'lim ekspertisan. O'zbek tilida. 150 so'zda: umumiy baho, kuchli/zaif tomonlar, tavsiya, motivatsiya.`;
      const cats = test_results?.categories || [];
      userPrompt = `Daraja testi: ${test_results?.score}/${test_results?.total}, daraja: ${test_results?.level}.
Sohalar:
${cats.map((c: any) => `${c.name}: ${c.correct}/${c.total} (${c.percentage}%)`).join('\n')}`;

    } else if (feedback_type === 'topic_recommendation') {
      promptTemplate = PROMPT_VERSIONS.topicRecommendation;
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
    const tokens_input = data.usage?.input_tokens;
    const tokens_output = data.usage?.output_tokens;

    // Log + counter (faqat code_review)
    let cooldownTriggered = false;
    if (user && quotaApplies) {
      const r = await logAIInteraction(supabase, {
        user_id: user.id,
        interaction_type: 'feedback',
        task_type: task_type || 'topic_task',
        task_id: task_id || undefined,
        topic_id: topic_id || undefined,
        model_used: 'claude-sonnet-4-20250514',
        prompt_template: promptTemplate,
        user_query: userPrompt.slice(0, 2000),
        ai_response: feedback,
        tokens_input,
        tokens_output,
        code_snapshot: code,
        error_snapshot: Array.isArray(test_results)
          ? test_results.find((r: any) => !r.passed)?.error
          : undefined,
      });
      cooldownTriggered = r.cooldownTriggered;
    }

    return NextResponse.json({
      feedback,
      meta: {
        model: 'claude-sonnet-4-20250514',
        prompt_template: promptTemplate,
        tokens_input,
        tokens_output,
        ai_generated: true,
      },
      quota: quota ? { ...quota, used: quota.used + 1, remaining: Math.max(0, quota.remaining - 1) } : null,
      cooldownTriggered,
    });
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
    prompt_template: PROMPT_VERSIONS.socraticFeedback,
  });
}
