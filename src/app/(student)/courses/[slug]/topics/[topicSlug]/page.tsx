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
  ArrowLeft, ArrowRight, BookOpen, Video, FileText, ClipboardList,
  Code2, CheckCircle2, Clock, Coins
} from "lucide-react";
import { cn, formatDuration } from "@/lib/utils";

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

  useEffect(() => { loadTopic(); }, [topicSlug]);

  async function loadTopic() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setUserId(user.id);

    const { data: courseData } = await supabase.from("courses").select("*").eq("slug", slug).single();
    if (!courseData) { router.push("/courses"); return; }
    setCourse(courseData as Course);

    const { data: topicsData } = await supabase.from("topics").select("*").eq("course_id", courseData.id).order("order_index");
    if (topicsData) setAllTopics(topicsData as Topic[]);

    const currentTopic = topicsData?.find(t => t.slug === topicSlug);
    if (!currentTopic) { router.push(`/courses/${slug}`); return; }
    setTopic(currentTopic as Topic);

    // Progress olish yoki yaratish
    let { data: prog } = await supabase.from("topic_progress").select("*").eq("user_id", user.id).eq("topic_id", currentTopic.id).single();
    if (!prog) {
      const { data: newProg } = await supabase.from("topic_progress").insert({
        user_id: user.id, topic_id: currentTopic.id, course_id: courseData.id,
      }).select().single();
      prog = newProg;
    }
    if (prog) setProgress(prog as TopicProgress);
    setLoading(false);
  }

  async function markContentRead() {
    if (!progress || progress.content_read || !topic || !course) return;
    await supabase.from("topic_progress").update({ content_read: true }).eq("id", progress.id);
    const updated = { ...progress, content_read: true };
    setProgress(updated);
    toast.success("Mavzu o'qildi!");

    // Agar test va topshiriq ham bajarilgan bo'lsa — tugatish
    if (updated.quiz_passed && updated.tasks_completed) {
      await completeTopic(supabase, userId, topic.id, course.id);
      setProgress({ ...updated, is_completed: true });
      toast.success(`Mavzu tugatildi! +${topic.coin_reward} coin 🎉`);
    }
  }

  async function markVideoWatched() {
    if (!progress || progress.video_watched) return;
    await supabase.from("topic_progress").update({ video_watched: true }).eq("id", progress.id);
    setProgress({ ...progress, video_watched: true });
  }

  const currentIndex = allTopics.findIndex(t => t.slug === topicSlug);
  const prevTopic = currentIndex > 0 ? allTopics[currentIndex - 1] : null;
  const nextTopic = currentIndex < allTopics.length - 1 ? allTopics[currentIndex + 1] : null;

  if (loading || !topic) return <div className="space-y-4 animate-pulse"><div className="h-8 w-64 bg-surface rounded-lg" /><div className="glass-card h-96" /></div>;

  const hasQuiz = true; // Assuming quizzes may exist
  const hasTask = true;

  return (
    <div className="max-w-4xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Link href={`/courses/${slug}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-3">
          <ArrowLeft className="w-4 h-4" /> {course?.title}
        </Link>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Mavzu {currentIndex + 1} / {allTopics.length}</p>
            <h1 className="font-display font-bold text-2xl">{topic.title}</h1>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-4 h-4" />{formatDuration(topic.estimated_minutes)}
            <Coins className="w-4 h-4 text-neon-yellow ml-2" />+{topic.coin_reward}
            {progress?.is_completed && <span className="text-neon-green flex items-center gap-1 ml-2"><CheckCircle2 className="w-4 h-4" /> Tugatildi</span>}
          </div>
        </div>
      </motion.div>

      {/* Progress & Action buttons */}
      <motion.div className="flex flex-wrap gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <button onClick={markContentRead} disabled={progress?.content_read}
          className={cn("flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
            progress?.content_read ? "bg-neon-green/10 text-neon-green border border-neon-green/20" : "bg-surface hover:bg-surface-hover border border-border")}>
          <CheckCircle2 className="w-4 h-4" /> {progress?.content_read ? "O'qildi ✓" : "O'qidim"}
        </button>
        <Link href={`/courses/${slug}/topics/${topicSlug}/quiz`}
          className={cn("flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
            progress?.quiz_passed ? "bg-neon-green/10 text-neon-green border border-neon-green/20" : "bg-neon-blue/10 text-neon-blue border border-neon-blue/20 hover:bg-neon-blue/20")}>
          <ClipboardList className="w-4 h-4" /> Test {progress?.quiz_passed ? "✓" : ""}
        </Link>
        <Link href={`/courses/${slug}/topics/${topicSlug}/task`}
          className={cn("flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
            progress?.tasks_completed ? "bg-neon-green/10 text-neon-green border border-neon-green/20" : "bg-neon-purple/10 text-neon-purple border border-neon-purple/20 hover:bg-neon-purple/20")}>
          <Code2 className="w-4 h-4" /> Amaliy topshiriq {progress?.tasks_completed ? "✓" : ""}
        </Link>
      </motion.div>

      {/* Video */}
      {topic.video_url && (
        <motion.div className="glass-card overflow-hidden" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <div className="flex items-center justify-between px-5 py-3 border-b border-border/50">
            <span className="flex items-center gap-2 text-sm font-medium"><Video className="w-4 h-4 text-neon-blue" /> Video dars</span>
            {!progress?.video_watched && <button onClick={markVideoWatched} className="text-xs text-neon-blue hover:underline">Ko'rdim</button>}
          </div>
          <div className="aspect-video bg-black">
            <iframe src={topic.video_url.includes("watch?v=") ? topic.video_url.replace("watch?v=", "embed/") : topic.video_url} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
          </div>
        </motion.div>
      )}

      {/* Content */}
      {topic.content_html && (
        <motion.div className="glass-card p-6 md:p-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="prose prose-invert prose-purple max-w-none
            prose-headings:font-display prose-p:text-muted-foreground prose-p:leading-relaxed
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
        <motion.div className="glass-card overflow-hidden" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <div className="px-5 py-3 border-b border-border/50 flex items-center gap-2 text-sm font-medium">
            <FileText className="w-4 h-4 text-neon-yellow" /> Taqdimot
          </div>
          <div className="aspect-[16/10]"><iframe src={topic.presentation_url} className="w-full h-full" /></div>
        </motion.div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-border/50">
        {prevTopic ? (
          <Link href={`/courses/${slug}/topics/${prevTopic.slug}`} className="btn-ghost py-2.5 px-5 flex items-center gap-2 text-sm">
            <ArrowLeft className="w-4 h-4" /> <span className="hidden sm:inline">{prevTopic.title}</span><span className="sm:hidden">Oldingi</span>
          </Link>
        ) : <div />}
        {nextTopic ? (
          <Link href={`/courses/${slug}/topics/${nextTopic.slug}`} className="btn-primary py-2.5 px-5 flex items-center gap-2 text-sm">
            <span className="hidden sm:inline">{nextTopic.title}</span><span className="sm:hidden">Keyingi</span> <ArrowRight className="w-4 h-4" />
          </Link>
        ) : (
          <Link href={`/courses/${slug}`} className="btn-primary py-2.5 px-5 flex items-center gap-2 text-sm">
            Kursga qaytish <CheckCircle2 className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  );
}
