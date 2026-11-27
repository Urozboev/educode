"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "@/components/i18n/Link";
import { createClient } from "@/lib/supabase/client";
import { getCurrentUser } from "@/lib/supabase/user";
import { completeTopic } from "@/lib/course-completion";
import { TopicNotes } from "@/components/courses/TopicNotes";
import { useI18n } from "@/lib/i18n";
import { withTranslation, withTranslations } from "@/lib/i18n/content";
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
  Presentation,
  ListTree,
  ChevronDown,
} from "lucide-react";
import LessonToc, { withHeadingIds, useActiveHeading } from "@/components/courses/LessonToc";
import { useScrollableTables, wrapTables } from "@/components/courses/useScrollableTables";
import BrandLoader from "@/components/brand/BrandLoader";
import { cn, formatDuration } from "@/lib/utils";
import ReflectionJournalModal from "@/components/ai/ReflectionJournalModal";
import ProtectedVideoPlayer from "@/components/video/ProtectedVideoPlayer";
import TopicAudioPlayer from "@/components/courses/TopicAudioPlayer";
import LabVisual, { hasLabVisual } from "@/components/labs/lessons/LabVisual";
import dynamic from "next/dynamic";

// Taqdimot faqat "Taqdimot" tabi ochilganda yuklanadi
const SlideDeck = dynamic(() => import("@/components/courses/SlideDeck"), {
  ssr: false,
  loading: () => <div className="aspect-[16/10] rounded-3xl border border-border/60 bg-card/40 animate-pulse" />,
});

type LessonTab = "lesson" | "deck";

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
  const { locale, t } = useI18n();
  const [showReflection, setShowReflection] = useState(false);
  const [reflectionDone, setReflectionDone] = useState(false);
  const [watchFrac, setWatchFrac] = useState(0); // video ko'rish ulushi (0–1)
  const [tab, setTab] = useState<LessonTab>(() =>
    typeof window !== "undefined" && new URLSearchParams(window.location.search).get("tab") === "taqdimot"
      ? "deck" : "lesson");

  // Video bor va yetarlicha ko'rilganmi (90%+)? — "Ko'rdim" tugmasi shunga bog'liq
  const hasVideo = !!(topic?.video_url || topic?.video_id);
  const videoWatched = !hasVideo || watchFrac >= 0.9 || !!progress?.video_watched;

  useEffect(() => {
    loadTopic();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicSlug, locale]);

  async function loadTopic() {
    setLoading(true);

    // 1-bosqich — bir vaqtda: foydalanuvchi (lokal sessiya), kurs va
    // mavzular. Mavzular kurs id'sini kutmasdan kurs slug'i bo'yicha
    // so'raladi (courses!inner). Ilgari bu uch so'rov ketma-ket edi —
    // Supabase uzoq hududda bo'lgani uchun har biri ~0,7 s qo'shardi.
    //
    // topics RLS: free preview / bepul kurs / enrollment bo'lsagina qator keladi.
    // Guest foydalanuvchi faqat is_free_preview darslarni oladi.
    const [user, { data: courseData }, { data: topicsRaw }] = await Promise.all([
      getCurrentUser(supabase),
      supabase.from("courses").select("*").eq("slug", slug).single(),
      supabase.from("topics").select("*, courses!inner(slug)").eq("courses.slug", slug).order("order_index"),
    ]);
    if (user) setUserId(user.id);
    if (!courseData) {
      router.push(user ? "/courses" : "/explore/courses");
      return;
    }
    // Birlashtirish uchun qo'shilgan `courses` maydoni mavzu obyektida qolmasin
    const topicsData = (topicsRaw ?? []).map(({ courses: _c, ...t }: Record<string, unknown>) => t) as unknown as Topic[];
    const [courseTr, translated] = await Promise.all([
      withTranslation(supabase, "courses", courseData as Course, locale),
      topicsData.length ? withTranslations(supabase, "topics", topicsData, locale) : Promise.resolve([] as Topic[]),
    ]);
    setCourse(courseTr);
    setAllTopics(translated);

    const currentTopic = translated.find((t) => t.slug === topicSlug);
    if (!currentTopic) {
      // RLS qatorni bermadi — dars yopiq yoki mavjud emas → kurs sahifasiga
      router.push(`/courses/${slug}`);
      return;
    }
    setTopic(currentTopic as Topic);

    // Progress faqat login qilgan foydalanuvchi uchun
    // 2-bosqich — progress va refleksiya bir vaqtda
    if (user) {
      const [progRes, { count: reflCount }] = await Promise.all([
        supabase.from("topic_progress").select("*").eq("user_id", user.id).eq("topic_id", currentTopic.id).maybeSingle(),
        supabase.from("reflection_journals").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("topic_id", currentTopic.id),
      ]);
      if ((reflCount ?? 0) > 0) setReflectionDone(true);
      let prog = progRes.data;
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
    toast.success(t.courses.topic.markedRead);

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

  // Dars matnidagi bo'limlar: sarlavhalarga id, mundarija va o'qilayotgan bo'lim.
  // Hook'lar yuklanish sharti (early return) dan OLDIN turishi shart.
  const tableHint = t.courses.topic.tableScrollHint;
  const lessonDoc = useMemo(
    () => (topic?.content_html ? withHeadingIds(wrapTables(topic.content_html, tableHint)) : { html: "", toc: [] }),
    [topic?.content_html, tableHint],
  );
  const tocIds = useMemo(() => lessonDoc.toc.map((x) => x.id), [lessonDoc]);
  const activeHeading = useActiveHeading(tocIds);
  const mobileTocRef = useRef<HTMLDetailsElement>(null);

  // O'qish ulushi — yopishqoq qator ostidagi ingichka chiziq uchun
  const contentRef = useRef<HTMLDivElement>(null);
  const [readFrac, setReadFrac] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = contentRef.current;
      if (!el) return setReadFrac(0);
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight * 0.6;
      setReadFrac(total <= 0 ? 1 : Math.min(1, Math.max(0, -r.top / total)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lessonDoc, tab]);

  // Sig'magan jadvallarga "suring" yorlig'i va chetidagi xiralik
  const lessonBodyRef = useRef<HTMLDivElement>(null);
  useScrollableTables(lessonBodyRef);

  const currentIndex = allTopics.findIndex((t) => t.slug === topicSlug);
  const prevTopic = currentIndex > 0 ? allTopics[currentIndex - 1] : null;
  const nextTopic = currentIndex < allTopics.length - 1 ? allTopics[currentIndex + 1] : null;

  // Route loading.tsx bilan bir xil logo — sahifa almashishdan ma'lumot
  // kelguncha bitta uzluksiz animatsiya ko'rinadi
  if (loading || !topic)
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <BrandLoader />
      </div>
    );

  // Dars bosqichlari holati (progress tracker uchun)
  const steps = [
    { key: "video", label: t.courses.topic.stepVideo, done: !!progress?.video_watched, has: hasVideo, icon: Video },
    { key: "read", label: t.courses.topic.stepRead, done: !!progress?.content_read, has: !!topic.content_html, icon: FileText },
    { key: "quiz", label: t.courses.topic.stepQuiz, done: !!progress?.quiz_passed, has: true, icon: ClipboardList },
    { key: "task", label: t.courses.topic.stepTask, done: !!progress?.tasks_completed, has: true, icon: Code2 },
  ].filter(s => s.has);
  const doneSteps = steps.filter(s => s.done).length;

  // Taqdimot: ichki slaydlar ustun, bo'lmasa admin qo'ygan tashqi havola
  const hasDeck = Array.isArray(topic.slides) && topic.slides.length > 0;
  const hasPresentation = hasDeck || !!topic.presentation_url;
  const hasLesson = !!topic.content_html || hasLabVisual(topic.slug);
  const shownTab: LessonTab = !hasPresentation ? "lesson" : !hasLesson ? "deck" : tab;

  function switchTab(next: LessonTab) {
    setTab(next);
    // Havola ulashilsa, o'sha tab ochilsin
    const url = new URL(window.location.href);
    if (next === "deck") url.searchParams.set("tab", "taqdimot");
    else url.searchParams.delete("tab");
    window.history.replaceState(null, "", url);
  }

  return (
    // Kenglik: chap menyudan qolgan joyning deyarli hammasi. Katta ekranda
    // o'ngda yopishqoq ustun (mundarija + bosqichlar) — talaba qayerdaligini
    // va keyingi qadamni doim ko'radi.
    <div className="max-w-[80rem] mx-auto space-y-6">
      {/* Breadcrumb + progress tracker */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Link
          href={`/courses/${slug}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> {course?.title}
        </Link>

        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <span className="font-semibold uppercase tracking-widest">Dars {currentIndex + 1}/{allTopics.length}</span>
          <span>·</span>
          <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" />{formatDuration(topic.estimated_minutes)}</span>
          <span>·</span>
          <span className="inline-flex items-center gap-1 text-neon-yellow"><Coins className="w-3 h-3" />+{topic.coin_reward}</span>
        </div>

        <h1 className="font-display font-extrabold text-2xl md:text-4xl tracking-tight mb-4">
          {topic.title}
        </h1>

        {/* Bosqich tracker */}
        {/* Katta ekranda bosqichlar o'ng ustunda — bu yerda takrorlanmaydi */}
        {userId && (
          <div className="flex items-center gap-1.5 xl:hidden">
            {steps.map((s, i) => (
              <div key={s.key} className="flex items-center gap-1.5 flex-1">
                <div className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold flex-1 justify-center border transition-colors",
                  s.done ? "bg-neon-green/10 text-neon-green border-neon-green/20"
                    : "bg-surface/50 text-muted-foreground border-border/50",
                )}>
                  {s.done ? <CheckCircle2 className="w-3.5 h-3.5" /> : <s.icon className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">{s.label}</span>
                </div>
                {i < steps.length - 1 && <div className={cn("h-0.5 w-2 rounded", steps[i].done ? "bg-neon-green/40" : "bg-border")} />}
              </div>
            ))}
          </div>
        )}
      </motion.div>

      <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_16.5rem] xl:gap-10 xl:items-start">
      <div className="min-w-0 space-y-6">

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
              <Video className="w-4 h-4 text-neon-blue" /> {t.courses.topic.videoLesson}
            </span>
            {userId && (
              progress?.video_watched ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-neon-green">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Körildi
                </span>
              ) : (
                <button
                  onClick={markVideoWatched}
                  disabled={watchFrac < 0.9}
                  title={watchFrac < 0.9 ? "Videoni oxirigaça köring" : undefined}
                  className={cn(
                    "inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all",
                    watchFrac < 0.9
                      ? "text-muted-foreground/50 border-border/40 cursor-not-allowed"
                      : "text-neon-green border-neon-green/30 bg-neon-green/10 hover:bg-neon-green/20"
                  )}
                >
                  {watchFrac < 0.9 ? <Lock className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  Kördim
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
                {Math.round(watchFrac * 100)}% körildi
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
          <p className="font-display font-bold text-lg mb-1">{t.courses.topic.previewTitle}</p>
          <p className="text-sm text-muted-foreground mb-4">
            {t.courses.topic.previewText}
          </p>
          <div className="flex gap-2 justify-center">
            <Link
              href={`/register?redirect=/courses/${slug}`}
              className="px-6 py-2.5 rounded-xl bg-foreground text-background font-display font-bold text-sm hover:opacity-90 transition"
            >
              {t.courses.topic.freeRegister}
            </Link>
            <Link
              href={`/login?redirect=/courses/${slug}`}
              className="px-6 py-2.5 rounded-xl border border-border/60 text-sm font-medium hover:bg-surface/50 transition"
            >
              {t.courses.topic.loginShort}
            </Link>
          </div>
        </motion.div>
      )}

      {/*
        Yopishqoq qator: Dars matni / Taqdimot tablari va Test, Topshiriq
        havolalari. Sahifa pastida turib ham tabni almashtirish yoki testga
        o'tish uchun yuqoriga qaytish shart emas. Ostidagi chiziq — o'qish ulushi.
      */}
      <div className={cn("sticky z-20 -mx-3 px-3 py-2.5 bg-background/85 backdrop-blur-md flex items-center gap-2", userId ? "top-16 lg:top-0" : "top-16")}>
      {hasPresentation && hasLesson && (
        <div role="tablist" aria-label={topic.title} className="inline-flex p-1 rounded-2xl border border-border/60 bg-card/60">
          {([
            ["lesson", t.courses.topic.lessonTab, FileText],
            ["deck", t.courses.topic.presentation, Presentation],
          ] as const).map(([key, label, Icon]) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={shownTab === key}
              onClick={() => switchTab(key)}
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors",
                shownTab === key ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="w-4 h-4" /> <span className="max-[380px]:hidden">{label}</span>
            </button>
          ))}
        </div>
      )}
      {userId && (
        <div className="ml-auto flex items-center gap-1.5">
          {([
            ["quiz", `/courses/${slug}/topics/${topicSlug}/quiz`, t.courses.topic.stepQuiz, ClipboardList, progress?.quiz_passed],
            ["task", `/courses/${slug}/topics/${topicSlug}/task`, t.courses.topic.stepTask, Code2, progress?.tasks_completed],
          ] as const).map(([k, href, label, Icon, done]) => (
            <Link
              key={k}
              href={href}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold border transition-colors",
                done
                  ? "bg-neon-green/10 text-neon-green border-neon-green/25"
                  : "bg-card/60 border-border/60 text-foreground hover:bg-surface",
              )}
            >
              {done ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
              <span className="hidden sm:inline">{label}</span>
            </Link>
          ))}
        </div>
      )}
      {shownTab === "lesson" && topic.content_html && (
        <span className="absolute left-3 right-3 bottom-0 h-0.5 rounded-full bg-border/60 overflow-hidden" aria-hidden>
          <span className="block h-full bg-neon-purple transition-[width] duration-150" style={{ width: `${Math.round(readFrac * 100)}%` }} />
        </span>
      )}
      </div>

      {/* Taqdimot */}
      {shownTab === "deck" && (
        hasDeck ? (
          <SlideDeck slides={topic.slides!} title={topic.title} />
        ) : (
          <div className="rounded-3xl border border-border/60 bg-card/40 overflow-hidden">
            <div className="aspect-[16/10]">
              <iframe src={topic.presentation_url!} className="w-full h-full" title={topic.title} />
            </div>
          </div>
        )
      )}

      {/* Laboratoriya darslari: matndan oldin interaktiv vizual tajriba */}
      {shownTab === "lesson" && hasLabVisual(topic.slug) && <LabVisual topicSlug={topic.slug} />}

      {/* Content */}
      {shownTab === "lesson" && topic.content_html && (
        <motion.div
          ref={contentRef}
          className="rounded-3xl border border-border/60 bg-card/40 p-5 sm:p-7 md:p-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Audio Tinglash Pleyeri */}
          <TopicAudioPlayer
            contentHtml={topic.content_html}
            topicTitle={topic.title}
          />

          {/* Mundarija — katta ekranda o'ng ustunda, kichigida shu yerda ochiluvchi */}
          {lessonDoc.toc.length > 1 && (
            <details ref={mobileTocRef} className="xl:hidden group mb-7 rounded-2xl border border-border/60 bg-surface/40">
              <summary className="flex items-center gap-2 px-4 py-3 cursor-pointer list-none text-sm font-semibold [&::-webkit-details-marker]:hidden">
                <ListTree className="w-4 h-4 text-neon-purple" />
                {t.courses.topic.onThisPage}
                <span className="text-muted-foreground font-normal">· {lessonDoc.toc.filter((x) => x.level === 2).length}</span>
                <ChevronDown className="w-4 h-4 ml-auto text-muted-foreground transition-transform group-open:rotate-180" />
              </summary>
              <LessonToc
                items={lessonDoc.toc}
                active={activeHeading}
                onPick={() => { if (mobileTocRef.current) mobileTocRef.current.open = false; }}
                className="mx-4 mb-4"
              />
            </details>
          )}

          <div
            ref={lessonBodyRef}
            className="prose lesson-body max-w-none"
            dangerouslySetInnerHTML={{ __html: lessonDoc.html }}
          />
        </motion.div>
      )}

      {/* Darsni yakunlash bloki (faqat login qilganlarga) */}
      {userId && (
        <motion.div
          className="rounded-2xl border border-border/60 bg-card/40 p-5 md:p-6"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-neon-green/10 flex items-center justify-center">
              <CheckCircle2 className="w-4.5 h-4.5 text-neon-green" />
            </div>
            <div>
              <h3 className="font-display font-bold">{t.courses.topic.finishTitle}</h3>
              <p className="text-xs text-muted-foreground">{doneSteps}/{steps.length} {t.courses.topic.stepsDone}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {topic.content_html && (
              <button
                onClick={markContentRead}
                disabled={progress?.content_read || !videoWatched}
                title={!videoWatched ? "Avval videoni oxirigaça köring" : undefined}
                className={cn(
                  "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border",
                  progress?.content_read
                    ? "bg-neon-green/10 text-neon-green border-neon-green/20"
                    : !videoWatched
                    ? "bg-surface/30 border-border/40 text-muted-foreground/50 cursor-not-allowed"
                    : "bg-surface/60 hover:bg-surface border-border text-foreground"
                )}
              >
                {progress?.content_read ? <CheckCircle2 className="w-4 h-4" /> : !videoWatched ? <Lock className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                {progress?.content_read ? t.courses.topic.read : t.courses.topic.markRead}
              </button>
            )}
            <Link
              href={`/courses/${slug}/topics/${topicSlug}/quiz`}
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border",
                progress?.quiz_passed
                  ? "bg-neon-green/10 text-neon-green border-neon-green/20"
                  : "bg-neon-blue/10 text-neon-blue border-neon-blue/20 hover:bg-neon-blue/15"
              )}
            >
              <ClipboardList className="w-4 h-4" /> {progress?.quiz_passed ? t.courses.topic.quizPassedBtn : t.courses.topic.stepQuiz}
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
              <Code2 className="w-4 h-4" /> {progress?.tasks_completed ? t.courses.topic.taskDone : t.courses.topic.practiceTask}
              {progress?.tasks_completed && <CheckCircle2 className="w-3.5 h-3.5" />}
            </Link>
          </div>
        </motion.div>
      )}

      {/* Shaxsiy qaydlar — faqat tizimga kirgan foydalanuvchi uchun */}
      {userId && <TopicNotes topicId={topic.id} />}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-border/50">
        {prevTopic ? (
          <Link
            href={`/courses/${slug}/topics/${prevTopic.slug}`}
            className="inline-flex items-center gap-2 py-2.5 px-5 rounded-xl border border-border bg-surface/60 hover:bg-surface font-semibold text-sm transition"
          >
            <ArrowLeft className="w-4 h-4" />{" "}
            <span className="hidden sm:inline">{prevTopic.title}</span>
            <span className="sm:hidden">{t.courses.topic.prevShort}</span>
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
            <span className="sm:hidden">{t.courses.topic.nextShort}</span> <ArrowRight className="w-4 h-4" />
          </Link>
        ) : (
          <Link
            href={`/courses/${slug}`}
            className="inline-flex items-center gap-2 py-2.5 px-5 rounded-xl bg-foreground text-background font-semibold text-sm hover:opacity-90 transition"
          >
            {t.courses.topic.backToCourse} <CheckCircle2 className="w-4 h-4" />
          </Link>
        )}
      </div>

      {/* Refleksiya — tugatilgan mavzu uchun yoki istalgan paytda yozish mumkin */}
      {progress?.is_completed && !reflectionDone && (
        <button
          onClick={() => setShowReflection(true)}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neon-green/10 border border-neon-green/30 text-neon-green text-sm hover:bg-neon-green/20 transition"
        >
          📓 Refleksiya yoziş (3 daqiqa)
        </button>
      )}
      </div>

      {/* ===== O'ng ustun (xl+): mundarija, bosqichlar, qo'shni darslar ===== */}
      <aside className={cn("hidden xl:block sticky overflow-y-auto overscroll-contain space-y-7 pb-4", userId ? "top-20 max-h-[calc(100vh-6rem)]" : "top-32 max-h-[calc(100vh-9rem)]")}>
        {shownTab === "lesson" && lessonDoc.toc.length > 1 && (
          <section>
            <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              <ListTree className="w-3.5 h-3.5" /> {t.courses.topic.onThisPage}
            </p>
            <LessonToc items={lessonDoc.toc} active={activeHeading} />
          </section>
        )}

        {userId && (
          <section className="rounded-2xl border border-border/60 bg-card/50 p-4">
            <p className="mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              {t.courses.topic.lessonSteps}
              <span className="tabular-nums normal-case tracking-normal">{doneSteps}/{steps.length}</span>
            </p>
            <ol className="space-y-1">
              {steps.map((s) => {
                const href = s.key === "quiz" ? `/courses/${slug}/topics/${topicSlug}/quiz`
                  : s.key === "task" ? `/courses/${slug}/topics/${topicSlug}/task` : null;
                const body = (
                  <>
                    <span className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0",
                      s.done ? "bg-neon-green/12 text-neon-green" : "bg-surface text-muted-foreground",
                    )}>
                      {s.done ? <CheckCircle2 className="w-4 h-4" /> : <s.icon className="w-4 h-4" />}
                    </span>
                    <span className={cn("flex-1 text-sm", s.done ? "text-muted-foreground line-through decoration-neon-green/50" : "font-medium")}>{s.label}</span>
                    {href && !s.done && <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />}
                  </>
                );
                return (
                  <li key={s.key}>
                    {href ? (
                      <Link href={href} className="flex items-center gap-2.5 rounded-xl px-1.5 py-1.5 hover:bg-surface/70 transition-colors">{body}</Link>
                    ) : s.key === "read" && !s.done ? (
                      <button
                        type="button"
                        onClick={markContentRead}
                        disabled={!videoWatched}
                        className="w-full flex items-center gap-2.5 rounded-xl px-1.5 py-1.5 text-left hover:bg-surface/70 transition-colors disabled:opacity-50"
                        title={t.courses.topic.markRead}
                      >
                        {body}
                      </button>
                    ) : (
                      <div className="flex items-center gap-2.5 px-1.5 py-1.5">{body}</div>
                    )}
                  </li>
                );
              })}
            </ol>
          </section>
        )}

        <section className="space-y-2">
          {prevTopic && (
            <Link href={`/courses/${slug}/topics/${prevTopic.slug}`} className="group block rounded-xl border border-border/60 px-3.5 py-2.5 hover:bg-surface/60 transition-colors">
              <span className="flex items-center gap-1 text-[11px] text-muted-foreground"><ArrowLeft className="w-3 h-3" /> {t.courses.topic.prevShort}</span>
              <span className="block text-sm font-medium leading-snug line-clamp-2">{prevTopic.title}</span>
            </Link>
          )}
          {nextTopic && (
            <Link href={`/courses/${slug}/topics/${nextTopic.slug}`} className="group block rounded-xl bg-foreground text-background px-3.5 py-2.5 hover:opacity-90 transition-opacity">
              <span className="flex items-center gap-1 text-[11px] opacity-70">{t.courses.topic.nextShort} <ArrowRight className="w-3 h-3" /></span>
              <span className="block text-sm font-semibold leading-snug line-clamp-2">{nextTopic.title}</span>
            </Link>
          )}
        </section>
      </aside>
      </div>

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
