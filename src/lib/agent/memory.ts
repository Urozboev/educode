/**
 * EduCode AI Agent — uzoq muddatli xotira.
 *
 * Muammo: suhbat tarixi o'sgan sari uni to'liq promptga solish
 * token xarajatini chiziqli oshiradi va oxiri kontekst chegarasiga
 * urilib qoladi.
 *
 * Yechim: agent suhbatdan qisqa faktlarni ajratib DB ga yozadi
 * ("Python asoslarini biladi", "kechqurun o'qiydi"). Keyingi
 * suhbatlarda faqat shu 10-12 qator yuboriladi. Natijada agent
 * odamni "eslab qoladi", xarajat esa barqaror qoladi.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { AgentMemoryItem, AgentMemoryKind } from './types';
import { AGENT_MEMORY_EXTRACT_PROMPT } from './prompts';

const MAX_MEMORY_IN_PROMPT = 12;
const VALID_KINDS: AgentMemoryKind[] = ['fact', 'goal', 'preference', 'weakness', 'strength'];

/** Har necha xabarda bir marta xotira ajratiladi — har xabarda emas */
export const MEMORY_EXTRACT_EVERY = 6;

export async function loadMemory(
  supabase: SupabaseClient,
  userId: string,
): Promise<string[]> {
  const { data } = await supabase
    .from('agent_memory')
    .select('kind, content')
    .eq('user_id', userId)
    .order('weight', { ascending: false })
    .limit(MAX_MEMORY_IN_PROMPT);

  return (data || []).map((m) => `[${m.kind}] ${m.content}`);
}

export async function saveMemoryItems(
  supabase: SupabaseClient,
  userId: string,
  items: AgentMemoryItem[],
): Promise<void> {
  const rows = items
    .filter((i) => i.content?.trim() && VALID_KINDS.includes(i.kind))
    .slice(0, 5)
    .map((i) => ({
      user_id: userId,
      kind: i.kind,
      content: i.content.trim().slice(0, 200),
      weight: i.weight ?? 1,
    }));

  if (!rows.length) return;

  // UNIQUE (user_id, kind, content) — takroriy fakt yangi qator
  // yaratmaydi, shunchaki e'tiborsiz qoldiriladi.
  await supabase.from('agent_memory').upsert(rows, {
    onConflict: 'user_id,kind,content',
    ignoreDuplicates: true,
  });
}

/**
 * Suhbatdan faktlarni ajratadi. Alohida, arzon model chaqiruvi.
 * Xato bo'lsa jim o'tadi: xotira yozilmasligi suhbatni to'xtatishga
 * arzimaydigan muammo.
 */
export async function extractMemory(
  transcript: string,
): Promise<AgentMemoryItem[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return [];

  const model = process.env.AGENT_MEMORY_MODEL || 'gemini-flash-latest';

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: `${AGENT_MEMORY_EXTRACT_PROMPT}\n\nSUHBAT:\n${transcript}` }] }],
          generationConfig: { maxOutputTokens: 512, temperature: 0.2, responseMimeType: 'application/json' },
        }),
      },
    );

    if (!res.ok) return [];

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return [];

    const parsed = JSON.parse(text);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((p: any) => p?.content && VALID_KINDS.includes(p.kind))
      .map((p: any) => ({ kind: p.kind as AgentMemoryKind, content: String(p.content), weight: 1 }));
  } catch (e: any) {
    console.error('[agent/memory] ajratib bo\'lmadi:', e?.message);
    return [];
  }
}
