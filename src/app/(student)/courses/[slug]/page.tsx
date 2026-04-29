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
    if (!courseData) {
      // Login qilmagan foydalanuvchi uchun /explore'ga, login qilganga /courses'ga qaytaramiz
      router.push(user ? "/courses" : "/explore/courses");
      return;
    }
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
    <div className="space-y-10 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Link href="/courses" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground mb-5 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Kurslar ro'yxati
        </Link>

        <div className="p-7 md:p-10 rounded-3xl border border-border/50 bg-card/40">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className={diffConfig.class}>{diffConfig.label}</span>
                {course.is_free ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-neon-green/10 text-neon-green border border-neon-green/20">Bepul</span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-neon-yellow/10 text-neon-yellow border border-neon-yellow/20"><Coins className="w-3 h-3" />{course.price_coins} coin</span>
                )}
              </div>
              <h1 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight mb-3">{course.title}</h1>
              <p className="text-[15px] md:text-base text-muted-foreground leading-relaxed mb-5">{course.description}</p>
              <div className="flex flex-wrap items-center gap-4 md:gap-5 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" /><span className="font-medium">{topics.length}</span> mavzu</span>
                {course.estimated_hours && <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />~{course.estimated_hours} soat</span>}
                <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /><span className="font-medium">{course.total_enrolled}</span> talaba</span>
                <span className="flex items-center gap-1.5 text-neon-yellow"><Star className="w-4 h-4 fill-neon-yellow" />+{course.coin_reward} mukofot</span>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 md:min-w-[220px]">
              {enrollment ? (
                enrollment.is_completed ? (
                  <>
                    <div className="text-center">
                      <div className="font-display font-extrabold text-5xl text-neon-green mb-1">100%</div>
                      <p className="text-sm text-neon-green font-semibold inline-flex items-center gap-1"><CheckCircle2 className="w-4 h-4" />Tugatildi</p>
                    </div>
                    <CertificateLink courseId={course.id} userId={userId || ""} />
                  </>
                ) : (
                  <>
                    <div className="text-center w-full">
                      <div className="font-display font-extrabold text-5xl gradient-text mb-1">{enrollment.progress_percent}%</div>
                      <p className="text-sm text-muted-foreground">tugatildi</p>
                    </div>
                    <div className="w-full h-2.5 bg-surface rounded-full overflow-hidden">
                      <div className="h-full progress-gradient rounded-full transition-all" style={{ width: `${enrollment.progress_percent}%` }} />
                    </div>
                    <Link href={`/courses/${slug}/topics/${topics[0]?.slug}`}
                      className="w-full text-center py-3 rounded-xl bg-foreground text-background font-display font-bold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2">
                      <Play className="w-4 h-4" /> Davom ettirish
                    </Link>
                  </>
                )
              ) : userId ? (
                <button onClick={handleEnroll} disabled={enrolling}
                  className="w-full py-3.5 rounded-xl bg-foreground text-background font-display font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {enrolling ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  {course.is_free ? "Bepul boshlash" : `${course.price_coins} coin bilan ochish`}
                </button>
              ) : (
                <>
                  <Link
                    href={`/register?redirect=/courses/${slug}`}
                    className="w-full py-3.5 rounded-xl bg-foreground text-background font-display font-bold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    Bepul ro'yxatdan o'tish
                  </Link>
                  <Link
                    href={`/login?redirect=/courses/${slug}`}
                    className="w-full py-2.5 rounded-xl border border-border/60 text-sm font-medium hover:bg-surface/50 transition-all flex items-center justify-center"
                  >
                    Hisobim bor
                  </Link>
                  <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
                    Ro'yxatdan o'tish bepul · 100 coin sovg'a
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Topics List */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <div className="flex items-end justify-between mb-5">
          <h2 className="font-display font-bold text-2xl tracking-tight">Mavzular</h2>
          <span className="text-sm text-muted-foreground">{topics.length} ta</span>
        </div>
        <div className="space-y-2.5">
          {topics.map((topic, i) => {
            const progress = getTopicProgress(topic.id);
            const isCompleted = progress?.is_completed;
            // Login qilmagan foydalanuvchi yoki coin'li kursga yozilmagan foydalanuvchi → lock
            const isLockedForGuest = !userId;
            const isLockedForCoin = !!userId && !enrollment && !course.is_free;
            const isLocked = isLockedForGuest || isLockedForCoin;

            return (
              <motion.div key={topic.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.04 * i }}>
                {isLocked ? (
                  isLockedForGuest ? (
                    <Link
                      href={`/register?redirect=/courses/${slug}`}
                      className="p-4 md:p-5 rounded-2xl border border-border/40 bg-card/30 flex items-center gap-4 hover:bg-card/50 transition-colors group"
                    >
                      <div className="w-11 h-11 rounded-xl bg-surface flex items-center justify-center text-muted-foreground flex-shrink-0 group-hover:text-neon-purple transition-colors">
                        <Lock className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-display font-semibold text-[15px] truncate">{topic.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {formatDuration(topic.estimated_minutes)} · ro'yxatdan o'ting va boshlang
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground/60 group-hover:text-neon-purple group-hover:translate-x-1 transition-all" />
                    </Link>
                  ) : (
                    <div className="p-4 md:p-5 rounded-2xl border border-border/40 bg-card/30 flex items-center gap-4 opacity-60 cursor-not-allowed">
                      <div className="w-11 h-11 rounded-xl bg-surface flex items-center justify-center text-muted-foreground flex-shrink-0">
                        <Lock className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-display font-semibold text-[15px] truncate">{topic.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{formatDuration(topic.estimated_minutes)}</p>
                      </div>
                    </div>
                  )
                ) : (
                  <Link href={`/courses/${slug}/topics/${topic.slug}`}
                    className="group p-4 md:p-5 rounded-2xl border border-border/50 bg-card/40 hover:bg-card hover:border-border hover:shadow-lg hover:shadow-black/[0.04] transition-all flex items-center gap-4 block">
                    <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center text-[15px] font-bold border flex-shrink-0",
                      isCompleted ? "bg-neon-green/10 text-neon-green border-neon-green/20" : "bg-neon-purple/10 text-neon-purple border-neon-purple/20")}>
                      {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <span>{String(i + 1).padStart(2, "0")}</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-semibold text-[15px] group-hover:text-neon-purple transition-colors line-clamp-1">{topic.title}</p>
                      <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{formatDuration(topic.estimated_minutes)}</span>
                        {topic.video_url && <span className="flex items-center gap-1"><Video className="w-3.5 h-3.5" />Video</span>}
                        <span className="flex items-center gap-1 text-neon-yellow font-medium"><Coins className="w-3.5 h-3.5" />+{topic.coin_reward}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {progress && !isCompleted && (
                        <div className="flex gap-1">
                          {progress.content_read && <div className="w-2 h-2 rounded-full bg-neon-green" title="O'qildi" />}
                          {progress.quiz_passed && <div className="w-2 h-2 rounded-full bg-neon-blue" title="Test o'tdi" />}
                          {progress.tasks_completed && <div className="w-2 h-2 rounded-full bg-neon-purple" title="Topshiriq bajarildi" />}
                        </div>
                      )}
                      <ChevronRight className="w-5 h-5 text-muted-foreground/60 group-hover:text-neon-purple group-hover:translate-x-1 transition-all" />
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