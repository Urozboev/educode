import { NextRequest, NextResponse } from 'next/server';
import { PLAN_REVIEW_PROMPT, PROMPT_VERSIONS, fillPlaceholders } from '@/lib/ai-prompts';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { logAIInteraction } from '@/lib/ai/usage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'CLAUDE_API_KEY sozlanmagan' }, { status: 500 });
  }

  try {
    const { step, content, task_description, task_id, task_type } = await request.json();
    if (!['understanding', 'algorithm', 'pseudocode'].includes(step)) {
      return NextResponse.json({ error: 'Noto\'g\'ri step' }, { status: 400 });
    }
    if (!content?.trim() || content.trim().length < 5) {
      return NextResponse.json({
        verdict: 'needs_more',
        feedback: 'Iltimos, javobingizni biroz batafsilroq yozing.',
      });
    }

    const supabase = createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    const systemPrompt = fillPlaceholders(PLAN_REVIEW_PROMPT, { STEP: step });
    const userPrompt = `Topshiriq: ${task_description || ''}

Bosqich: ${step}
Talaba javobi:
"""
${content}
"""

Yuqoridagi qoidalar asosida bahoni JSON shaklida qaytar.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 512,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Claude plan-review:', response.status, err);
      return NextResponse.json({ error: `AI xatolik (${response.status})` }, { status: 500 });
    }

    const data = await response.json();
    const raw = data.content?.[0]?.text || '{}';
    const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    let parsed: { verdict: string; feedback: string; next_question?: string };
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = { verdict: 'needs_more', feedback: raw.slice(0, 500) };
    }

    if (user) {
      await logAIInteraction(supabase, {
        user_id: user.id,
        interaction_type: 'plan_review',
        task_type: task_type || 'topic_task',
        task_id: task_id || undefined,
        model_used: 'claude-sonnet-4-20250514',
        prompt_template: PROMPT_VERSIONS.planReview,
        user_query: `[${step}] ${content}`.slice(0, 2000),
        ai_response: JSON.stringify(parsed),
        tokens_input: data.usage?.input_tokens,
        tokens_output: data.usage?.output_tokens,
      });
    }

    return NextResponse.json({
      ...parsed,
      meta: {
        model: 'claude-sonnet-4-20250514',
        prompt_template: PROMPT_VERSIONS.planReview,
        ai_generated: true,
      },
    });
  } catch (error: any) {
    console.error('plan-review error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
