"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { cn, getDifficultyConfig, formatDuration, getLevelLabel } from "@/lib/utils";
import type { Course, Topic, Enrollment, TopicProgress } from "@/types";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  BookOpen, Clock, Users, Coins, ChevronRight, Lock, Play,
  CheckCircle2, Circle, FileText, Video, ClipboardList, Code2,
  ArrowLeft, Star, Loader2, Sparkles, GraduationCap, Download
} from "lucide-react";

export default function CourseDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const supabase = createClient();

  const [course, setCourse] = useState<Course | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [topicProgress, setTopicProgress] = useState<TopicProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userCoins, setUserCoins] = useState(0);

  useEffect(() => {
    loadCourse();
  }, [slug]);

  async function loadCourse() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUserId(user.id);
      const { data: profile } = await supabase.from("profiles").select("coins").eq("id", user.id).single();
      if (profile) setUserCoins(profile.coins);
    }

    const { data: courseData } = await supabase
      .from("courses").select("*").eq("slug", slug).eq("is_published", true).single();
    if (!courseData) { router.push("/courses"); return; }
    setCourse(courseData as Course);

    const { data: topicsData } = await supabase
      .from("topics").select("*").eq("course_id", courseData.id).eq("is_published", true).order("order_index");
    if (topicsData) setTopics(topicsData as Topic[]);

    if (user) {
      const { data: enrollData } = await supabase
        .from("enrollments").select("*").eq("user_id", user.id).eq("course_id", courseData.id).single();
      if (enrollData) setEnrollment(enrollData as Enrollment);

      const { data: progressData } = await supabase
        .from("topic_progress").select("*").eq("user_id", user.id).eq("course_id", courseData.id);
      if (progressData) setTopicProgress(progressData as TopicProgress[]);
    }
    setLoading(false);
  }

  async function handleEnroll() {
    if (!userId || !course) return;
    setEnrolling(true);

    if (!course.is_free && course.price_coins > 0) {
      if (userCoins < course.price_coins) {
        toast.error(`Yetarli coin yo'q! Kerak: ${course.price_coins}, Sizda: ${userCoins}`);
        setEnrolling(false);
        return;
      }
      await supabase.from("profiles").update({ coins: userCoins - course.price_coins }).eq("id", userId);
      await supabase.from("coin_transactions").insert({
        user_id: userId, amount: -course.price_coins, type: "course_purchase",
        reference_id: course.id, description: `"${course.title}" kursi sotib olindi`,
        balance_after: userCoins - course.price_coins,
      });
    }

    const { data, error } = await supabase.from("enrollments").insert({
      user_id: userId, course_id: course.id, total_topics: topics.length,
    }).select().single();

    if (error) { toast.error("Xatolik yuz berdi"); setEnrolling(false); return; }

    await supabase.from("courses").update({ total_enrolled: (course.total_enrolled || 0) + 1 }).eq("id", course.id);

    setEnrollment(data as Enrollment);
    toast.success("Kursga muvaffaqiyatli yozildingiz!");
    setEnrolling(false);
  }

  function getTopicProgress(topicId: string) {
    return topicProgress.find(p => p.topic_id === topicId);
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-surface rounded-lg" />
        <div className="glass-card p-8 h-48" />
        <div className="space-y-3">{[1,2,3,4].map(i => <div key={i} className="glass-card p-4 h-20" />)}</div>
      </div>
    );
  }

  if (!course) return null;
  const diffConfig = getDifficultyConfig(course.difficulty || "beginner");

  return (
    <div className="space-y-8 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Link href="/courses" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="w-4 h-4" /> Kurslar
        </Link>

        <div className="glass-card p-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className={diffConfig.class}>{diffConfig.label}</span>
                {course.is_free ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-neon-green/10 text-neon-green border border-neon-green/20">Bepul</span>
                ) : (
                  <span className="coin-badge text-xs"><Coins className="w-3 h-3" />{course.price_coins} coin</span>
                )}
              </div>
              <h1 className="font-display font-bold text-3xl mb-3">{course.title}</h1>
              <p className="text-muted-foreground leading-relaxed mb-4">{course.description}</p>
              <div className="flex items-center gap-5 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" />{topics.length} mavzu</span>
                {course.estimated_hours && <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />~{course.estimated_hours} soat</span>}
                <span className="flex items-center gap-1.5"><Users className="w-4 h-4" />{course.total_enrolled} talaba</span>
                <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-neon-yellow" />{course.coin_reward} coin mukofot</span>
              </div>
            </div>

            <div className="flex flex-col items-center gap-3 min-w-[200px]">
              {enrollment ? (
                enrollment.is_completed ? (
                  <>
                    <div className="text-center">
                      <div className="font-display font-bold text-4xl text-neon-green mb-1">100%</div>
                      <p className="text-sm text-neon-green font-medium">Tugatildi! 🎉</p>
                    </div>
                    <CertificateLink courseId={course.id} userId={userId || ""} />
                  </>
                ) : (
                  <>
                    <div className="text-center">
                      <div className="font-display font-bold text-4xl gradient-text mb-1">{enrollment.progress_percent}%</div>
                      <p className="text-sm text-muted-foreground">tugatildi</p>
                    </div>
                    <div className="w-full h-3 bg-surface rounded-full overflow-hidden">
                      <div className="h-full progress-gradient rounded-full" style={{ width: `${enrollment.progress_percent}%` }} />
                    </div>
                    <Link href={`/courses/${slug}/topics/${topics[0]?.slug}`}
                      className="btn-primary w-full text-center py-3 flex items-center justify-center gap-2">
                      <Play className="w-4 h-4" /> Davom ettirish
                    </Link>
                  </>
                )
              ) : (
                <button onClick={handleEnroll} disabled={enrolling}
                  className="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-50">
                  {enrolling ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  {course.is_free ? "Bepul boshlash" : `${course.price_coins} coin bilan ochish`}
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Topics List */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 className="font-display font-semibold text-xl mb-4">Mavzular</h2>
        <div className="space-y-2">
          {topics.map((topic, i) => {
            const progress = getTopicProgress(topic.id);
            const isCompleted = progress?.is_completed;
            const isLocked = !enrollment && !course.is_free;

            return (
              <motion.div key={topic.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}>
                {isLocked ? (
                  <div className="glass-card p-4 flex items-center gap-4 opacity-50 cursor-not-allowed">
                    <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center text-muted-foreground">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{topic.title}</p>
                      <p className="text-xs text-muted-foreground">{formatDuration(topic.estimated_minutes)}</p>
                    </div>
                  </div>
                ) : (
                  <Link href={`/courses/${slug}/topics/${topic.slug}`}
                    className="glass-card-hover p-4 flex items-center gap-4 group block">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold",
                      isCompleted ? "bg-neon-green/10 text-neon-green" : "bg-neon-purple/10 text-neon-purple")}>
                      {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <span>{i + 1}</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm group-hover:text-neon-purple transition-colors truncate">{topic.title}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatDuration(topic.estimated_minutes)}</span>
                        {topic.video_url && <span className="flex items-center gap-1"><Video className="w-3 h-3" />Video</span>}
                        <span className="flex items-center gap-1"><Coins className="w-3 h-3 text-neon-yellow" />+{topic.coin_reward}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {progress && !isCompleted && (
                        <div className="flex gap-1">
                          {progress.content_read && <div className="w-2 h-2 rounded-full bg-neon-green" title="O'qildi" />}
                          {progress.quiz_passed && <div className="w-2 h-2 rounded-full bg-neon-blue" title="Test o'tdi" />}
                          {progress.tasks_completed && <div className="w-2 h-2 rounded-full bg-neon-purple" title="Topshiriq bajarildi" />}
                        </div>
                      )}
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-neon-purple group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

// Sertifikat havola komponenti
function CertificateLink({ courseId, userId }: { courseId: string; userId: string }) {
  const supabase = createClient();
  const [certId, setCertId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (!userId) return;
      const { data } = await supabase
        .from("certificates")
        .select("id")
        .eq("user_id", userId)
        .eq("course_id", courseId)
        .maybeSingle();
      if (data) setCertId(data.id);
    })();
  }, [userId, courseId]);

  if (!certId) return (
    <p className="text-xs text-muted-foreground text-center">Sertifikat tayyorlanmoqda...</p>
  );

  return (
    <Link href={`/certificate/${certId}`}
      className="btn-neon w-full text-center py-3 flex items-center justify-center gap-2">
      <GraduationCap className="w-4 h-4" /> Sertifikatni ko'rish
    </Link>
  );
}