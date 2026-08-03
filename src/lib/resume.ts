import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * "Qoldirgan joyingizdan davom eting".
 *
 * Ilgari talaba kursga qaytganda mavzular ro'yxatidan o'zi qidirib topishi
 * kerak edi — 14 mavzuli kursda bu har safar takrorlanadigan ortiqcha qadam.
 * Bu yerda keyingi tugallanmagan mavzu va unda aynan nima qolgani hisoblanadi.
 */

export interface ResumePoint {
  topicId: string;
  slug: string;
  title: string;
  /** Kursdagi tartib raqami (1 dan) */
  position: number;
  totalTopics: number;
  /** Mavzu ichida nima qolgan */
  pending: ("content" | "quiz" | "tasks")[];
  /** Bu mavzu hali umuman ochilmaganmi */
  fresh: boolean;
  /** Kursning barcha mavzulari tugallanganmi */
  courseDone: boolean;
}

const PENDING_LABEL: Record<"content" | "quiz" | "tasks", string> = {
  content: "darsni o'qish",
  quiz: "testni topshirish",
  tasks: "topshiriqlarni bajarish",
};

/** "darsni o'qish va testni topshirish" ko'rinishidagi matn */
export function pendingText(pending: ResumePoint["pending"]): string {
  const parts = pending.map(p => PENDING_LABEL[p]);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0];
  return parts.slice(0, -1).join(", ") + " va " + parts[parts.length - 1];
}

/**
 * Kursdagi keyingi ish nuqtasini topadi.
 *
 * Qoida: tartib bo'yicha birinchi tugallanmagan mavzu. Hammasi tugallangan
 * bo'lsa oxirgi mavzu qaytariladi va `courseDone` true bo'ladi — talaba
 * takrorlash uchun baribir biror joyga o'ta olishi kerak.
 */
export async function getResumePoint(
  supabase: SupabaseClient,
  userId: string,
  courseId: string
): Promise<ResumePoint | null> {
  const [{ data: topics }, { data: progress }] = await Promise.all([
    supabase
      .from("topics")
      .select("id, slug, title, order_index")
      .eq("course_id", courseId)
      .eq("is_published", true)
      .order("order_index"),
    supabase
      .from("topic_progress")
      .select("topic_id, content_read, quiz_passed, tasks_completed, is_completed")
      .eq("user_id", userId)
      .eq("course_id", courseId),
  ]);

  if (!topics?.length) return null;

  const byTopic = new Map((progress ?? []).map((p: any) => [p.topic_id, p]));

  const idx = topics.findIndex(t => !byTopic.get(t.id)?.is_completed);
  const courseDone = idx === -1;
  const target = courseDone ? topics[topics.length - 1] : topics[idx];
  const p = byTopic.get(target.id);

  const pending: ResumePoint["pending"] = [];
  if (!p?.content_read) pending.push("content");
  if (!p?.quiz_passed) pending.push("quiz");
  if (!p?.tasks_completed) pending.push("tasks");

  return {
    topicId: target.id,
    slug: target.slug,
    title: target.title,
    position: (courseDone ? topics.length - 1 : idx) + 1,
    totalTopics: topics.length,
    pending,
    fresh: !p,
    courseDone,
  };
}
