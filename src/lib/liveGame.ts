import type { QuizRaceQuestion } from "@/types";

/**
 * Jonli sessiya (Kahoot rejimi) uchun umumiy narsalar.
 *
 * Ranglar QuizRace bilan bir xil — o'quvchi telefonida faqat rang va shakl
 * ko'rinadi, savol matni proyektorda turadi. Shuning uchun ikkala ekranda
 * rang-shakl mosligi juda muhim.
 */

export const LIVE_SHAPES = [
  { cls: "bg-[#CE2E4B]", label: "▲", name: "uchburchak" },
  { cls: "bg-[#1668C4]", label: "◆", name: "romb" },
  { cls: "bg-[#9A6100]", label: "●", name: "doira" },
  { cls: "bg-[#0B7A45]", label: "■", name: "kvadrat" },
];

export type LiveSession = {
  id: string;
  game_id: string;
  host_id: string;
  pin: string;
  status: "lobby" | "running" | "ended";
  current_index: number;
  question_started_at: string | null;
};

export type LivePlayer = {
  id: string;
  session_id: string;
  user_id: string | null;
  nickname: string;
  score: number;
  correct_count: number;
  joined_at: string;
};

/** Ishtirokchi kimligi brauzerda saqlanadi — akkaunt talab qilinmaydi */
const KEY = "educode-live-player";

export function savePlayer(sessionId: string, playerId: string, nickname: string) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ sessionId, playerId, nickname }));
  } catch { /* xotira yopiq bo'lsa jim o'tamiz */ }
}

export function loadPlayer(sessionId: string): { playerId: string; nickname: string } | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const v = JSON.parse(raw);
    if (v.sessionId !== sessionId) return null;
    return { playerId: v.playerId, nickname: v.nickname };
  } catch {
    return null;
  }
}

export function clearPlayer() {
  try { sessionStorage.removeItem(KEY); } catch { /* e'tiborsiz */ }
}

/** Savol tugashiga qolgan soniya */
export function secondsLeft(q: QuizRaceQuestion | undefined, startedAt: string | null): number {
  if (!q || !startedAt) return 0;
  const total = q.seconds || 20;
  const elapsed = (Date.now() - new Date(startedAt).getTime()) / 1000;
  return Math.max(0, Math.ceil(total - elapsed));
}
