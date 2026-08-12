/**
 * EduCode AI Agent — umumiy tiplar.
 *
 * Agent alohida modul: bu yerdagi tiplar `@/types` dagi platforma
 * tiplariga bog'lanmaydi. Shunda agentni platformadan ajratib
 * olish yoki alohida deploy qilish oson bo'ladi.
 */

export type AgentPlan = 'free' | 'pro' | 'pro_plus';
export type AgentSubStatus = 'active' | 'pending' | 'expired' | 'cancelled';
export type AgentLevel = 'zero' | 'beginner' | 'intermediate' | 'advanced';
export type AgentLang = 'uz' | 'ru' | 'en' | 'kaa';

export interface AgentSubscription {
  user_id: string;
  plan: AgentPlan;
  status: AgentSubStatus;
  free_messages_used: number;
  started_at: string | null;
  expires_at: string | null;
}

export interface AgentAccess {
  allowed: boolean;
  plan: AgentPlan;
  /** Nega ruxsat yo'q — UI shu asosda paywall matnini tanlaydi */
  reason?: 'no_user' | 'free_limit_reached' | 'expired';
  /** Bepul demo xabarlaridan nechtasi qolgan (pro uchun null) */
  freeRemaining: number | null;
  expiresAt: string | null;
  /** Obuna emas, lekin demo doirasida ishlayapti */
  isTrial: boolean;
}

export type AgentMessageRole = 'user' | 'assistant' | 'system';

export interface AgentMessage {
  id?: string;
  role: AgentMessageRole;
  content: string;
  audio_url?: string | null;
  created_at?: string;
}

export type AgentMemoryKind = 'fact' | 'goal' | 'preference' | 'weakness' | 'strength';

export interface AgentMemoryItem {
  kind: AgentMemoryKind;
  content: string;
  weight: number;
}

export interface AgentTrack {
  id: string;
  title: string;
  goal: string | null;
  start_level: AgentLevel;
  target_level: Exclude<AgentLevel, 'zero'>;
  weekly_hours: number;
  status: 'draft' | 'active' | 'paused' | 'completed';
  lang: AgentLang;
}

export interface AgentModule {
  id: string;
  track_id: string;
  order_index: number;
  title: string;
  summary: string | null;
  topic_key: string;
  level: AgentLevel;
  estimated_minutes: number;
  status: 'locked' | 'active' | 'done' | 'skipped';
  suggested_course_id: string | null;
}

/* ---------------- Ovoz ---------------- */

export type TTSProviderName = 'aisha' | 'gemini' | 'browser';

export interface TTSResult {
  provider: TTSProviderName;
  /** `browser` bo'lsa null — sintez brauzerda bajariladi */
  audioUrl: string | null;
  cached: boolean;
  charCount: number;
  /** Provayder ishlamay, browser fallback'ga tushgan bo'lsa sabab */
  fallbackReason?: string;
}
