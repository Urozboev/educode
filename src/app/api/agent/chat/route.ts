/**
 * EduCode AI Agent — suhbat oqimi (SSE).
 *
 * NEGA STREAM: ovozli agent uchun bu shart. Javob to'liq kelishini
 * kutsak, foydalanuvchi 5-8 soniya jimlikni eshitadi. Oqim bilan
 * mijoz birinchi tugagan gapni darrov TTS'ga yuboradi va ovoz
 * deyarli darhol boshlanadi.
 *
 * Bu route mavjud `/api/chat` dan mustaqil: u sokratik yordamchi
 * (yechim bermaydi), bu esa o'qituvchi (tushuntiradi). Ikkalasining
 * prompti va limit mantig'i boshqa-boshqa.
 */

import { NextRequest } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getAgentAccess, consumeFreeMessage, isOverDailyCap, paywallMessage } from '@/lib/agent/access';
import { buildTutorPrompt, AGENT_PROMPT_VERSIONS } from '@/lib/agent/prompts';
import { loadMemory, saveMemoryItems, extractMemory, MEMORY_EXTRACT_EVERY } from '@/lib/agent/memory';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Promptga qo'shiladigan oxirgi xabarlar soni. Undan oldingisi xotiradan keladi. */
const HISTORY_WINDOW = 8;

function sse(event: string, data: unknown): string {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.AGENT_MODEL || process.env.NEXT_PUBLIC_GEMINI_MODEL || 'gemini-flash-latest';

  if (!apiKey) {
    return Response.json({ error: 'GEMINI_API_KEY sozlanmagan' }, { status: 500 });
  }

  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: 'Tizimga kiring', code: 'no_user' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const message: string = (body.message || '').trim();
  const lang: string = body.lang || 'uz';
  const exerciseMode: boolean = !!body.exerciseMode;
  let conversationId: string | null = body.conversationId || null;

  if (!message) {
    return Response.json({ error: 'Xabar bo\'sh' }, { status: 400 });
  }

  // --- Paywall ---
  const access = await getAgentAccess(supabase, user.id);
  if (!access.allowed) {
    return Response.json(
      { error: paywallMessage(access), code: access.reason, access },
      { status: 402 },
    );
  }

  if (await isOverDailyCap(supabase, user.id, access.plan)) {
    return Response.json(
      { error: 'Bugungi xabarlar chegarasiga yetdingiz. Ertaga davom etamiz.', code: 'daily_cap' },
      { status: 429 },
    );
  }

  // --- Suhbat ---
  if (!conversationId) {
    const { data: conv, error } = await supabase
      .from('agent_conversations')
      .insert({
        user_id: user.id,
        lang,
        // Sarlavha birinchi xabardan olinadi — foydalanuvchi keyin
        // suhbatlar ro'yxatidan tanib olsin
        title: message.slice(0, 60),
      })
      .select('id')
      .single();

    if (error || !conv) {
      return Response.json({ error: error?.message || 'Suhbat yaratilmadi' }, { status: 500 });
    }
    conversationId = conv.id;
  }

  // --- Kontekst ---
  const [{ data: profile }, { data: history }, memory, { data: track }] = await Promise.all([
    supabase.from('profiles').select('full_name, level').eq('id', user.id).maybeSingle(),
    supabase
      .from('agent_messages')
      .select('role, content')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: false })
      .limit(HISTORY_WINDOW),
    loadMemory(supabase, user.id),
    supabase
      .from('agent_tracks')
      .select('title')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .maybeSingle(),
  ]);

  const systemPrompt = buildTutorPrompt({
    lang,
    userName: profile?.full_name?.split(' ')[0] ?? null,
    level: profile?.level ?? null,
    trackTitle: track?.title ?? null,
    memory,
    exerciseMode,
  });

  const contents: any[] = [
    { role: 'user', parts: [{ text: systemPrompt }] },
    { role: 'model', parts: [{ text: 'Tayyorman. O\'qituvchi sifatida ishlayman.' }] },
  ];

  for (const m of (history || []).reverse()) {
    contents.push({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    });
  }
  contents.push({ role: 'user', parts: [{ text: message }] });

  // --- Gemini oqimi ---
  const upstream = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: { maxOutputTokens: 1024, temperature: 0.8, topP: 0.95 },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
        ],
      }),
    },
  );

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => '');
    console.error('[agent/chat] Gemini:', upstream.status, detail.slice(0, 300));
    return Response.json({ error: `AI xatolik (${upstream.status})` }, { status: 502 });
  }

  const convId = conversationId!;
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      controller.enqueue(encoder.encode(sse('meta', { conversationId: convId, model })));

      const reader = upstream.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let full = '';
      let tokensIn = 0;
      let tokensOut = 0;

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          // Oxirgi bo'lak tugallanmagan bo'lishi mumkin — buferda qoldiramiz
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (!line.startsWith('data:')) continue;
            const payload = line.slice(5).trim();
            if (!payload || payload === '[DONE]') continue;

            try {
              const chunk = JSON.parse(payload);
              const text = chunk?.candidates?.[0]?.content?.parts?.[0]?.text;
              if (text) {
                full += text;
                controller.enqueue(encoder.encode(sse('delta', { text })));
              }
              if (chunk?.usageMetadata) {
                tokensIn = chunk.usageMetadata.promptTokenCount ?? tokensIn;
                tokensOut = chunk.usageMetadata.candidatesTokenCount ?? tokensOut;
              }
            } catch {
              // Yarim JSON — keyingi bo'lak bilan to'liq keladi
            }
          }
        }

        controller.enqueue(encoder.encode(sse('done', { text: full, tokensIn, tokensOut })));
      } catch (e: any) {
        console.error('[agent/chat] oqim uzildi:', e?.message);
        controller.enqueue(encoder.encode(sse('error', { message: e?.message || 'Oqim uzildi' })));
      } finally {
        controller.close();
      }

      // --- Oqimdan keyingi ish: saqlash, hisob, xotira ---
      // Foydalanuvchi javobni allaqachon ko'rgan; bu qism uni kutkazmaydi.
      try {
        await supabase.from('agent_messages').insert([
          { conversation_id: convId, user_id: user.id, role: 'user', content: message },
          {
            conversation_id: convId,
            user_id: user.id,
            role: 'assistant',
            content: full,
            model,
            tokens_in: tokensIn,
            tokens_out: tokensOut,
          },
        ]);

        await supabase.rpc('agent_track_usage', {
          p_user_id: user.id,
          p_messages: 1,
          p_tokens_in: tokensIn,
          p_tokens_out: tokensOut,
        });

        if (access.isTrial) await consumeFreeMessage(supabase, user.id);

        // Har N xabarda bir marta xotira yangilanadi
        const { count } = await supabase
          .from('agent_messages')
          .select('id', { count: 'exact', head: true })
          .eq('conversation_id', convId);

        if (count && count % MEMORY_EXTRACT_EVERY === 0) {
          const transcript = `Foydalanuvchi: ${message}\nUstoz: ${full}`;
          const items = await extractMemory(transcript);
          if (items.length) await saveMemoryItems(supabase, user.id, items);
        }
      } catch (e: any) {
        console.error('[agent/chat] saqlashda xato:', e?.message);
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Prompt-Version': AGENT_PROMPT_VERSIONS.tutor,
    },
  });
}

export async function GET() {
  return Response.json({
    status: 'ok',
    route: '/api/agent/chat',
    model: process.env.AGENT_MODEL || process.env.NEXT_PUBLIC_GEMINI_MODEL || 'gemini-flash-latest',
    prompt_version: AGENT_PROMPT_VERSIONS.tutor,
    hasKey: !!process.env.GEMINI_API_KEY,
  });
}
