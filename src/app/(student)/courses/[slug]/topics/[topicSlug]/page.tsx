"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { completeTopic } from "@/lib/course-completion";
import type { Topic, Course, TopicProgress } from "@/types";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  Video,
  FileText,
  ClipboardList,
  Code2,
  CheckCircle2,
  Clock,
  Coins,
  Lock,
} from "lucide-react";
import { cn, formatDuration } from "@/lib/utils";
import ReflectionJournalModal from "@/components/ai/ReflectionJournalModal";
import ProtectedVideoPlayer from "@/components/video/ProtectedVideoPlayer";

export default function TopicPage() {
  const { slug, topicSlug } = useParams<{ slug: string; topicSlug: string }>();
  const router = useRouter();
  const supabase = createClient();

  const [topic, setTopic] = useState<Topic | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [allTopics, setAllTopics] = useState<Topic[]>([]);
  const [progress, setProgress] = useState<TopicProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");
  const [showReflection, setShowReflection] = useState(false);
  const [reflectionDone, setReflectionDone] = useState(false);
  const [watchFrac, setWatchFrac] = useState(0); // video ko'rish ulushi (0–1)

  // Video bor va yetarlicha ko'rilganmi (90%+)? — "Ko'rdim" tugmasi shunga bog'liq
  const hasVideo = !!(topic?.video_url || topic?.video_id);
  const videoWatched = !hasVideo || watchFrac >= 0.9 || !!progress?.video_watched;

  useEffect(() => {
    loadTopic();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicSlug]);

  async function loadTopic() {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) setUserId(user.id);

    const { data: courseData } = await supabase
      .from("courses")
      .select("*")
      .eq("slug", slug)
      .single();
    if (!courseData) {
      router.push(user ? "/courses" : "/explore/courses");
      return;
    }
    setCourse(courseData as Course);

    // topics RLS: free preview / bepul kurs / enrollment bo'lsagina qator keladi.
    // Guest foydalanuvchi faqat is_free_preview darslarni oladi.
    const { data: topicsData } = await supabase
      .from("topics")
      .select("*")
      .eq("course_id", courseData.id)
      .order("order_index");
    if (topicsData) setAllTopics(topicsData as Topic[]);

    const currentTopic = topicsData?.find((t) => t.slug === topicSlug);
    if (!currentTopic) {
      // RLS qatorni bermadi — dars yopiq yoki mavjud emas → kurs sahifasiga
      router.push(`/courses/${slug}`);
      return;
    }
    setTopic(currentTopic as Topic);

    // Progress faqat login qilgan foydalanuvchi uchun
    if (user) {
      let { data: prog } = await supabase
        .from("topic_progress")
        .select("*")
        .eq("user_id", user.id)
        .eq("topic_id", currentTopic.id)
        .single();
      if (!prog) {
        const { data: newProg } = await supabase
          .from("topic_progress")
          .insert({
            user_id: user.id,
            topic_id: currentTopic.id,
            course_id: courseData.id,
          })
          .select()
          .single();
        prog = newProg;
      }
      if (prog) setProgress(prog as TopicProgress);

      // Refleksiya yozilganmi?
      const { count: reflCount } = await supabase
        .from("reflection_journals")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("topic_id", currentTopic.id);
      if ((reflCount ?? 0) > 0) setReflectionDone(true);
    }

    setLoading(false);
  }

  // Zaxira: agar video bor-u, 45 soniyada player.js'dan hech progress kelmasa
  // (ehtimol brauzer/pleyer hodisalarni bermayapti), tugmani qulfdan chiqaramiz.
  useEffect(() => {
    if (!hasVideo || progress?.video_watched) return;
    const t = setTimeout(() => {
      setWatchFrac(prev => (prev < 0.05 ? 0.9 : prev));
    }, 45000);
    return () => clearTimeout(t);
  }, [hasVideo, progress?.video_watched, topic?.id]);

  // Mavzu tugatilganda refleksiya modal'ni avtomatik ochish
  useEffect(() => {
    if (progress?.is_completed && !reflectionDone && !showReflection) {
      const t = setTimeout(() => setShowReflection(true), 1200);
      return () => clearTimeout(t);
    }
  }, [progress?.is_completed, reflectionDone, showReflection]);

  async function markContentRead() {
    if (!progress || progress.content_read || !topic || !course) return;
    await supabase.from("topic_progress").update({ content_read: true }).eq("id", progress.id);
    const updated = { ...progress, content_read: true };
    setProgress(updated);
    toast.success("Mavzu o'qildi");

    if (updated.quiz_passed && updated.tasks_completed) {
      await completeTopic(supabase, userId, topic.id, course.id);
      setProgress({ ...updated, is_completed: true });
      toast.success(`Mavzu tugatildi! +${topic.coin_reward} coin`);
    }
  }

  async function markVideoWatched() {
    if (!progress || progress.video_watched) return;
    await supabase.from("topic_progress").update({ video_watched: true }).eq("id", progress.id);
    setProgress({ ...progress, video_watched: true });
  }

  const currentIndex = allTopics.findIndex((t) => t.slug === topicSlug);
  const prevTopic = currentIndex > 0 ? allTopics[currentIndex - 1] : null;
  const nextTopic = currentIndex < allTopics.length - 1 ? allTopics[currentIndex + 1] : null;

  if (loading || !topic)
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-64 bg-surface rounded-lg" />
        <div className="h-96 rounded-3xl border border-border/50 bg-card/40" />
      </div>
    );

  return (
    <div className="max-w-4xl space-y-7">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Link
          href={`/courses/${slug}`}
          className="inline-flex items-center gap-2 text-[15px] font-medium text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> {course?.title}
        </Link>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
              Mavzu {currentIndex + 1} / {allTopics.length}
            </p>
            <h1 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight">
              {topic.title}
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface/60 border border-border text-xs font-medium text-muted-foreground">
              <Clock className="w-3.5 h-3.5" /> {formatDuration(topic.estimated_minutes)}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neon-yellow/10 border border-neon-yellow/20 text-xs font-semibold text-neon-yellow">
              <Coins className="w-3.5 h-3.5" /> +{topic.coin_reward}
            </span>
            {progress?.is_completed && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neon-green/10 border border-neon-green/20 text-xs font-semibold text-neon-green">
                <CheckCircle2 className="w-3.5 h-3.5" /> Tugatildi
              </span>
            )}
          </div>
        </div>
      </motion.div>

      {/* Action pills */}
      <motion.div
        className="flex flex-wrap gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <button
          onClick={markContentRead}
          disabled={progress?.content_read || !videoWatched}
          title={!videoWatched ? "Avval videoni oxirigacha ko'ring" : undefined}
          className={cn(
            "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border",
            progress?.content_read
              ? "bg-neon-green/10 text-neon-green border-neon-green/20"
              : !videoWatched
              ? "bg-surface/30 border-border/40 text-muted-foreground/50 cursor-not-allowed"
              : "bg-surface/60 hover:bg-surface border-border text-foreground"
          )}
        >
          {!videoWatched ? <Lock className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
          {progress?.content_read ? "O'qildi" : "O'qidim"}
        </button>
        <Link
          href={`/courses/${slug}/topics/${topicSlug}/quiz`}
          className={cn(
            "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border",
            progress?.quiz_passed
              ? "bg-neon-green/10 text-neon-green border-neon-green/20"
              : "bg-neon-blue/10 text-neon-blue border-neon-blue/20 hover:bg-neon-blue/15"
          )}
        >
          <ClipboardList className="w-4 h-4" /> Test
          {progress?.quiz_passed && <CheckCircle2 className="w-3.5 h-3.5" />}
        </Link>
        <Link
          href={`/courses/${slug}/topics/${topicSlug}/task`}
          className={cn(
            "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border",
            progress?.tasks_completed
              ? "bg-neon-green/10 text-neon-green border-neon-green/20"
              : "bg-neon-purple/10 text-neon-purple border-neon-purple/20 hover:bg-neon-purple/15"
          )}
        >
          <Code2 className="w-4 h-4" /> Amaliy topshiriq
          {progress?.tasks_completed && <CheckCircle2 className="w-3.5 h-3.5" />}
        </Link>
      </motion.div>

      {/* Video — himoyalangan player (signed URL, watermark, nodownload) */}
      {(topic.video_url || topic.video_id) && (
        <motion.div
          className="rounded-3xl border border-border/60 bg-card/40 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="flex items-center justify-between px-5 py-3 border-b border-border/50">
            <span className="inline-flex items-center gap-2 text-sm font-semibold">
              <Video className="w-4 h-4 text-neon-blue" /> Video dars
            </span>
            {userId && (
              progress?.video_watched ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-neon-green">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Ko'rildi
                </span>
              ) : (
                <button
                  onClick={markVideoWatched}
                  disabled={watchFrac < 0.9}
                  title={watchFrac < 0.9 ? "Videoni oxirigacha ko'ring" : undefined}
                  className={cn(
                    "inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all",
                    watchFrac < 0.9
                      ? "text-muted-foreground/50 border-border/40 cursor-not-allowed"
                      : "text-neon-green border-neon-green/30 bg-neon-green/10 hover:bg-neon-green/20"
                  )}
                >
                  {watchFrac < 0.9 ? <Lock className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  Ko'rdim
                </button>
              )
            )}
          </div>
          <ProtectedVideoPlayer
            topicId={topic.id}
            redirectPath={`/courses/${slug}/topics/${topicSlug}`}
            onProgress={setWatchFrac}
          />
          {/* Ko'rish progress'i */}
          {userId && !progress?.video_watched && (
            <div className="px-5 py-2.5 border-t border-border/50 flex items-center gap-3">
              <div className="flex-1 h-1.5 bg-surface rounded-full overflow-hidden">
                <div
                  className="h-full bg-neon-blue rounded-full transition-all duration-500"
                  style={{ width: `${Math.round(watchFrac * 100)}%` }}
                />
              </div>
              <span className="text-[11px] font-mono text-muted-foreground tabular-nums">
                {Math.round(watchFrac * 100)}% ko'rildi
              </span>
            </div>
          )}
        </motion.div>
      )}

      {/* Guest (free preview) uchun register CTA */}
      {!userId && (
        <motion.div
          className="rounded-3xl border border-neon-purple/30 bg-neon-purple/5 p-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="font-display font-bold text-lg mb-1">Bu — bepul namunaviy dars</p>
          <p className="text-sm text-muted-foreground mb-4">
            Kursning barcha darslari, testlari va amaliy topshiriqlariga kirish uchun ro'yxatdan o'ting.
          </p>
          <div className="flex gap-2 justify-center">
            <Link
              href={`/register?redirect=/courses/${slug}`}
              className="px-6 py-2.5 rounded-xl bg-foreground text-background font-display font-bold text-sm hover:opacity-90 transition"
            >
              Bepul ro'yxatdan o'tish
            </Link>
            <Link
              href={`/login?redirect=/courses/${slug}`}
              className="px-6 py-2.5 rounded-xl border border-border/60 text-sm font-medium hover:bg-surface/50 transition"
            >
              Kirish
            </Link>
          </div>
        </motion.div>
      )}

      {/* Content */}
      {topic.content_html && (
        <motion.div
          className="rounded-3xl border border-border/60 bg-card/40 p-6 md:p-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div
            className="prose prose-invert prose-purple max-w-none
              prose-headings:font-display prose-headings:tracking-tight
              prose-p:text-[16px] prose-p:text-muted-foreground prose-p:leading-relaxed
              prose-a:text-neon-purple prose-strong:text-foreground
              prose-code:text-neon-green prose-code:bg-surface prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
              prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-border prose-pre:overflow-x-auto
              prose-li:text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: topic.content_html }}
          />
        </motion.div>
      )}

      {/* Presentation */}
      {topic.presentation_url && (
        <motion.div
          className="rounded-3xl border border-border/60 bg-card/40 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <div className="px-5 py-3 border-b border-border/50 inline-flex items-center gap-2 text-sm font-semibold">
            <FileText className="w-4 h-4 text-neon-yellow" /> Taqdimot
          </div>
          <div className="aspect-[16/10]">
            <iframe src={topic.presentation_url} className="w-full h-full" />
          </div>
        </motion.div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-border/50">
        {prevTopic ? (
          <Link
            href={`/courses/${slug}/topics/${prevTopic.slug}`}
            className="inline-flex items-center gap-2 py-2.5 px-5 rounded-xl border border-border bg-surface/60 hover:bg-surface font-semibold text-sm transition"
          >
            <ArrowLeft className="w-4 h-4" />{" "}
            <span className="hidden sm:inline">{prevTopic.title}</span>
            <span className="sm:hidden">Oldingi</span>
          </Link>
        ) : (
          <div />
        )}
        {nextTopic ? (
          <Link
            href={`/courses/${slug}/topics/${nextTopic.slug}`}
            className="inline-flex items-center gap-2 py-2.5 px-5 rounded-xl bg-foreground text-background font-semibold text-sm hover:opacity-90 transition"
          >
            <span className="hidden sm:inline">{nextTopic.title}</span>
            <span className="sm:hidden">Keyingi</span> <ArrowRight className="w-4 h-4" />
          </Link>
        ) : (
          <Link
            href={`/courses/${slug}`}
            className="inline-flex items-center gap-2 py-2.5 px-5 rounded-xl bg-foreground text-background font-semibold text-sm hover:opacity-90 transition"
          >
            Kursga qaytish <CheckCircle2 className="w-4 h-4" />
          </Link>
        )}
      </div>

      {/* Refleksiya — tugatilgan mavzu uchun yoki istalgan paytda yozish mumkin */}
      {progress?.is_completed && !reflectionDone && (
        <button
          onClick={() => setShowReflection(true)}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neon-green/10 border border-neon-green/30 text-neon-green text-sm hover:bg-neon-green/20 transition"
        >
          📓 Refleksiya yozish (3 daqiqa)
        </button>
      )}

      <ReflectionJournalModal
        open={showReflection}
        onClose={() => setShowReflection(false)}
        topicId={topic?.id}
        courseId={course?.id}
        topicTitle={topic?.title}
        onSaved={() => setReflectionDone(true)}
      />
    </div>
  );
}
