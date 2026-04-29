import { NextRequest, NextResponse } from 'next/server';
import { SOCRATIC_CHAT_PROMPT, PROMPT_VERSIONS } from '@/lib/ai-prompts';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { checkAIQuota, logAIInteraction } from '@/lib/ai/usage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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

    const supabase = createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Quota tekshiruv (foydalanuvchi tizimga kirgan bo'lsa)
    let quota = null as Awaited<ReturnType<typeof checkAIQuota>> | null;
    if (user) {
      quota = await checkAIQuota(supabase, user.id);
      if (!quota.allowed) {
        return NextResponse.json({
          reply: quota.message,
          quota,
          blocked: true,
        }, { status: 429 });
      }
    }

    const contents: any[] = [];
    contents.push({ role: 'user', parts: [{ text: SOCRATIC_CHAT_PROMPT }] });
    contents.push({ role: 'model', parts: [{ text: "Tushundim. Sokratik usulda yo'l-yo'riq beraman." }] });

    const recentHistory = (history || []).slice(-6);
    for (const msg of recentHistory) {
      contents.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      });
    }

    contents.push({ role: 'user', parts: [{ text: message }] });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: { maxOutputTokens: 1024, temperature: 0.7, topP: 0.9 },
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

    // Log + counter
    let cooldownTriggered = false;
    if (user) {
      const r = await logAIInteraction(supabase, {
        user_id: user.id,
        interaction_type: 'chat',
        task_type: 'free_chat',
        model_used: model,
        prompt_template: PROMPT_VERSIONS.socraticChat,
        user_query: message,
        ai_response: reply,
      });
      cooldownTriggered = r.cooldownTriggered;
    }

    return NextResponse.json({
      reply,
      meta: {
        model,
        prompt_template: PROMPT_VERSIONS.socraticChat,
        ai_generated: true,
      },
      quota: quota ? { ...quota, used: quota.used + 1, remaining: Math.max(0, quota.remaining - 1) } : null,
      cooldownTriggered,
    });
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
    prompt_template: PROMPT_VERSIONS.socraticChat,
    hasKey: !!process.env.GEMINI_API_KEY,
  });
}
