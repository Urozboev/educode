import { NextRequest, NextResponse } from 'next/server';
import { SOCRATIC_CHAT_PROMPT, PROMPT_VERSIONS } from '@/lib/ai-prompts';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { checkAIQuota, logAIInteraction, getSupportState } from '@/lib/ai/usage';
import { classifyMessage, CLASSIFIER_VERSION, SUPPORT_LEVELS, OFFLOAD_NUDGE } from '@/lib/ai/engagement';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.NEXT_PUBLIC_GEMINI_MODEL || 'gemini-flash-latest';

  if (!apiKey) {
    return NextResponse.json({ reply: '⚠️ GEMINI_API_KEY sozlanmagan. .env.local faylini tekşiring.' });
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

    // Xabar kodi (CO — fikrlashni topshirish, AL — faol o'rganish) va
    // ko'mak darajasi: mentor javobining chuqurligi shularga moslanadi
    const engagement = classifyMessage(message);
    const support = user ? await getSupportState(supabase, user.id) : { level: 0 as const };
    const extra: string[] = [];
    if (support.level > 0) extra.push(SUPPORT_LEVELS[support.level].rule);
    if (engagement.kind === 'CO' && engagement.code !== 'CO4') extra.push(OFFLOAD_NUDGE);

    const contents: any[] = [];
    contents.push({
      role: 'user',
      parts: [{ text: SOCRATIC_CHAT_PROMPT + (extra.length ? `\n\nQO'SHIMCHA KÖRSATMA:\n- ${extra.join('\n- ')}` : '') }],
    });
    contents.push({ role: 'model', parts: [{ text: "Tuşundim. Sokratik usulda yöl-yöriq beraman." }] });

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
      return NextResponse.json({ reply: `⚠️ AI xatolik (${response.status}). API kalitni tekşiring.` });
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
        engagement_code: engagement.code,
        engagement_kind: engagement.kind,
        classifier_version: CLASSIFIER_VERSION,
        support_level: support.level,
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
      engagement,
      supportLevel: support.level,
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
    model: process.env.NEXT_PUBLIC_GEMINI_MODEL || 'gemini-flash-latest',
    prompt_template: PROMPT_VERSIONS.socraticChat,
    hasKey: !!process.env.GEMINI_API_KEY,
  });
}
