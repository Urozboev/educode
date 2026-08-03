"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { cn, formatDuration, getLevelLabel } from "@/lib/utils";
import { LevelBadge } from "@/components/ui/LevelBadge";
import { ResumeCard } from "@/components/courses/ResumeCard";
import { CourseSearch } from "@/components/courses/CourseSearch";
import { CourseNotes } from "@/components/courses/CourseNotes";
import { getResumePoint, type ResumePoint } from "@/lib/resume";
import type { Course, TopicTocEntry, CourseSection, Enrollment, TopicProgress } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  BookOpen, Clock, Users, Coins, ChevronRight, ChevronDown, Lock, Play,
  CheckCircle2, Circle, FileText, Video, ClipboardList, Code2,
  ArrowLeft, Star, Loader2, Sparkles, GraduationCap, Download, Eye
} from "lucide-react";

export default function CourseDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const supabase = createClient();

  const [course, setCourse] = useState<Course | null>(null);
  const [topics, setTopics] = useState<TopicTocEntry[]>([]);
  const [sections, setSections] = useState<CourseSection[]>([]);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [topicProgress, setTopicProgress] = useState<TopicProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userCoins, setUserCoins] = useState(0);
  const [resume, setResume] = useState<ResumePoint | null>(null);

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

    // Mundarija public view'dan (kontent ustunlari yo'q — RLS'siz o'qiladi)
    // va bo'limlar parallel yuklanadi
    const [{ data: topicsData }, { data: sectionsData }] = await Promise.all([
      supabase.from("topics_toc").select("*").eq("course_id", courseData.id).order("order_index"),
      supabase.from("course_sections").select("*").eq("course_id", courseData.id).eq("is_published", true).order("order_index"),
    ]);
    if (topicsData) setTopics(topicsData as TopicTocEntry[]);
    if (sectionsData) {
      setSections(sectionsData as CourseSection[]);
      // Birinchi bo'lim ochiq holda boshlanadi
      if (sectionsData.length > 0) {
        setOpenSections({ [sectionsData[0].id]: true });
      }
    }

    if (user) {
      const { data: enrollData } = await supabase
        .from("enrollments").select("*").eq("user_id", user.id).eq("course_id", courseData.id).single();
      if (enrollData) setEnrollment(enrollData as Enrollment);

      const { data: progressData } = await supabase
        .from("topic_progress").select("*").eq("user_id", user.id).eq("course_id", courseData.id);
      if (progressData) setTopicProgress(progressData as TopicProgress[]);

      // Faqat kursga yozilganlarga — yozilmaganda "davom ettirish" ma'nosiz
      if (enrollData) {
        setResume(await getResumePoint(supabase, user.id, courseData.id));
      }
    }
    setLoading(false);
  }

  function toggleSection(id: string) {
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
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

  return (
    <div className="space-y-10 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Link href="/courses" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground mb-5 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Kurslar ro'yxati
        </Link>

        <div className="rounded-[14px] border border-border/50 bg-card/40 overflow-hidden">
          {/* ===== BANNER (rasm yoki gradient) ===== */}
          <div className="relative h-52 md:h-64 overflow-hidden">
            {course.thumbnail_url ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={course.thumbnail_url} alt={course.title} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-transparent" />
              </>
            ) : (
              <>
                <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/25 via-card to-neon-blue/15" />
                <div
                  className="absolute inset-0 opacity-[0.12]"
                  style={{ backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)", backgroundSize: "18px 18px" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
              </>
            )}

            {/* Banner ustidagi kontent */}
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <LevelBadge difficulty={course.difficulty || "beginner"} variant="onDark" />
                {course.is_free ? (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-neon-green/90 text-background shadow-lg shadow-neon-green/30">BEPUL</span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-neon-yellow/90 text-white dark:text-[#1a1a00] shadow-lg shadow-neon-yellow/30"><Coins className="w-3 h-3" />{course.price_coins} coin</span>
                )}
                {course.tags && course.tags.length > 0 && course.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="px-2 py-1 rounded-md text-[10px] font-mono font-semibold bg-black/40 border border-white/15 text-white/90 uppercase tracking-wide backdrop-blur-sm">
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight drop-shadow-sm">{course.title}</h1>
            </div>
          </div>

          {/* ===== BANNER OSTI: tavsif + statistika + enroll ===== */}
          <div className="p-6 md:p-8 pt-5">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <p className="text-[15px] md:text-base text-muted-foreground leading-relaxed mb-5">{course.description}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { icon: BookOpen, val: `${topics.length}`, label: "dars", color: "#6C5CE7" },
                  { icon: Clock, val: course.estimated_hours ? `~${course.estimated_hours}` : "—", label: "soat", color: "#00D2FF" },
                  { icon: Users, val: `${course.total_enrolled}`, label: "talaba", color: "#00E676" },
                  { icon: Star, val: `+${course.coin_reward}`, label: "coin mukofot", color: "#FFD600" },
                ].map(s => (
                  <div key={s.label} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-surface/50 border border-border/40">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${s.color}15` }}>
                      <s.icon className="w-4 h-4" style={{ color: s.color }} />
                    </div>
                    <div className="leading-tight">
                      <div className="font-display font-bold text-sm">{s.val}</div>
                      <div className="text-[10px] text-muted-foreground">{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-4 md:min-w-[230px] md:border-l md:border-border/40 md:pl-8">
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
        </div>
      </motion.div>

      {/* Qoldirgan joydan davom ettirish — mundarijadan qidirmaslik uchun */}
      {resume && <ResumeCard courseSlug={slug} point={resume} />}

      {/* Kurs bo'yicha barcha qaydlar — qayd bo'lmasa ko'rinmaydi */}
      {course && userId && <CourseNotes courseId={course.id} courseSlug={slug} />}

      {/* Topics List */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <div className="flex items-end justify-between mb-5">
          <h2 className="font-display font-bold text-2xl tracking-tight">Kurs mundarijasi</h2>
          <span className="text-sm text-muted-foreground">
            {sections.length > 0 && `${sections.length} bo'lim · `}{topics.length} dars
          </span>
        </div>

        {/*
          Qidiruv. Kichik kurslarda ortiqcha, shuning uchun faqat mavzu
          soni ko'p bo'lganda ko'rsatiladi — 5 ta darsni ko'z bilan ham
          topsa bo'ladi.
        */}
        {course && topics.length >= 6 && (
          <div className="mb-5">
            <CourseSearch courseId={course.id} courseSlug={slug} />
          </div>
        )}

        {sections.length > 0 ? (
          /* ======== BO'LIMLAR ACCORDION ======== */
          <div className="space-y-3">
            {sections.map((section, sIdx) => {
              const sectionTopics = topics.filter(t => t.section_id === section.id);
              const isOpen = !!openSections[section.id];
              const completedCount = sectionTopics.filter(t => getTopicProgress(t.id)?.is_completed).length;
              const totalMinutes = section.estimated_minutes ||
                sectionTopics.reduce((s, t) => s + (t.estimated_minutes || 0), 0);

              return (
                <div key={section.id} className="rounded-2xl border border-border/50 bg-card/40 overflow-hidden">
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center gap-4 p-4 md:p-5 text-left hover:bg-card/70 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-neon-purple/10 text-neon-purple border border-neon-purple/20 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {sIdx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-bold text-[15px] md:text-base">{section.title}</p>
                      <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span>{sectionTopics.length} dars</span>
                        {totalMinutes > 0 && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatDuration(totalMinutes)}</span>}
                        {userId && enrollment && completedCount > 0 && (
                          <span className="text-neon-green">{completedCount}/{sectionTopics.length} tugatildi</span>
                        )}
                      </div>
                    </div>
                    <ChevronDown className={cn("w-5 h-5 text-muted-foreground transition-transform flex-shrink-0", isOpen && "rotate-180")} />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="px-3 pb-3 space-y-1.5 border-t border-border/40 pt-3">
                          {sectionTopics.map((topic, i) => renderTopicRow(topic, i))}
                          {sectionTopics.length === 0 && (
                            <p className="text-xs text-muted-foreground px-3 py-2">Darslar tez orada qo'shiladi</p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}

            {/* Bo'limga biriktirilmagan darslar */}
            {topics.filter(t => !t.section_id).length > 0 && (
              <div className="rounded-2xl border border-border/50 bg-card/40 p-3 space-y-1.5">
                {topics.filter(t => !t.section_id).map((topic, i) => renderTopicRow(topic, i))}
              </div>
            )}
          </div>
        ) : (
          /* ======== ODDIY RO'YXAT (bo'limsiz kurslar) ======== */
          <div className="space-y-2.5">
            {topics.map((topic, i) => renderTopicRow(topic, i))}
          </div>
        )}
      </motion.div>
    </div>
  );

  /* ======== BITTA DARS QATORI ======== */
  function renderTopicRow(topic: TopicTocEntry, i: number) {
    const progress = getTopicProgress(topic.id);
    const isCompleted = progress?.is_completed;
    const hasAccess = !!enrollment || course!.is_free;
    // Free preview darslar HAMMAGA ochiq (login'siz ham)
    const isPreviewOpen = topic.is_free_preview;
    const isLocked = !isPreviewOpen && (!userId || (!!userId && !hasAccess));
    const lockedForGuest = isLocked && !userId;

    if (isLocked) {
      return (
        <Link
          key={topic.id}
          href={lockedForGuest ? `/register?redirect=/courses/${slug}` : "#enroll"}
          onClick={lockedForGuest ? undefined : (e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); toast.info("Avval kursga yoziling"); }}
          className="p-3.5 md:p-4 rounded-xl border border-border/40 bg-card/30 flex items-center gap-3.5 hover:bg-card/50 transition-colors group"
        >
          <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center text-muted-foreground flex-shrink-0 group-hover:text-neon-purple transition-colors">
            <Lock className="w-4.5 h-4.5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-display font-semibold text-[14px] truncate">{topic.title}</p>
            <div className="flex items-center gap-2.5 mt-0.5 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatDuration(topic.estimated_minutes)}</span>
              {topic.has_video && <span className="flex items-center gap-1"><Video className="w-3 h-3" />Video</span>}
            </div>
          </div>
          <ChevronRight className="w-4.5 h-4.5 text-muted-foreground/50 group-hover:text-neon-purple transition-colors flex-shrink-0" />
        </Link>
      );
    }

    return (
      <Link
        key={topic.id}
        href={`/courses/${slug}/topics/${topic.slug}`}
        className="group p-3.5 md:p-4 rounded-xl border border-border/50 bg-card/40 hover:bg-card hover:border-border transition-all flex items-center gap-3.5"
      >
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold border flex-shrink-0",
          isCompleted ? "bg-neon-green/10 text-neon-green border-neon-green/20"
            : isPreviewOpen && !enrollment ? "bg-neon-blue/10 text-neon-blue border-neon-blue/20"
            : "bg-neon-purple/10 text-neon-purple border-neon-purple/20")}>
          {isCompleted ? <CheckCircle2 className="w-4.5 h-4.5" />
            : isPreviewOpen && !enrollment ? <Play className="w-4 h-4" />
            : <span>{String(i + 1).padStart(2, "0")}</span>}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-display font-semibold text-[14px] group-hover:text-neon-purple transition-colors line-clamp-1">{topic.title}</p>
            {isPreviewOpen && !enrollment && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-neon-blue/10 text-neon-blue border border-neon-blue/20 flex-shrink-0">
                <Eye className="w-3 h-3" /> Bepul ko'rish
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2.5 mt-0.5 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatDuration(topic.estimated_minutes)}</span>
            {topic.has_video && <span className="flex items-center gap-1"><Video className="w-3 h-3" />Video</span>}
            <span className="flex items-center gap-1 text-neon-yellow font-medium"><Coins className="w-3 h-3" />+{topic.coin_reward}</span>
          </div>
        </div>
        <div className="flex items-center gap-2.5 flex-shrink-0">
          {progress && !isCompleted && (
            <div className="flex gap-1">
              {progress.content_read && <div className="w-2 h-2 rounded-full bg-neon-green" title="O'qildi" />}
              {progress.quiz_passed && <div className="w-2 h-2 rounded-full bg-neon-blue" title="Test o'tdi" />}
              {progress.tasks_completed && <div className="w-2 h-2 rounded-full bg-neon-purple" title="Topshiriq bajarildi" />}
            </div>
          )}
          <ChevronRight className="w-4.5 h-4.5 text-muted-foreground/60 group-hover:text-neon-purple group-hover:translate-x-1 transition-all" />
        </div>
      </Link>
    );
  }
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