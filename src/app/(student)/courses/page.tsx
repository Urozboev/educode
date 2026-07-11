"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { cn, getDifficultyConfig } from "@/lib/utils";
import type { Course, Enrollment } from "@/types";
import { motion } from "framer-motion";
import {
  BookOpen, Search, Clock, Users, Coins, Star,
  ChevronRight, CheckCircle2, Play, Sparkles, Layers,
} from "lucide-react";

const categories = [
  { value: "all", label: "Barchasi", icon: "✨" },
  { value: "python", label: "Python", icon: "🐍" },
  { value: "programming", label: "Dasturlash", icon: "💻" },
  { value: "frontend", label: "Frontend", icon: "⚛️" },
  { value: "computer_literacy", label: "Kompyuter savodxonligi", icon: "🖥️" },
  { value: "prompt_engineering", label: "Prompt Engineering", icon: "🤖" },
  { value: "algorithms", label: "Algoritmlar", icon: "🧠" },
];

/** Kategoriya bo'yicha cover gradient + emoji */
const categoryStyle: Record<string, { gradient: string; emoji: string; accent: string }> = {
  python: { gradient: "from-[#3776AB]/30 via-[#FFD43B]/10 to-transparent", emoji: "🐍", accent: "#3776AB" },
  programming: { gradient: "from-neon-purple/30 via-neon-blue/10 to-transparent", emoji: "💻", accent: "#6C5CE7" },
  frontend: { gradient: "from-[#61DAFB]/25 via-neon-purple/10 to-transparent", emoji: "⚛️", accent: "#61DAFB" },
  computer_literacy: { gradient: "from-neon-blue/25 via-neon-green/10 to-transparent", emoji: "🖥️", accent: "#00D2FF" },
  prompt_engineering: { gradient: "from-neon-pink/25 via-neon-purple/10 to-transparent", emoji: "🤖", accent: "#FF6BCB" },
  algorithms: { gradient: "from-neon-green/25 via-neon-blue/10 to-transparent", emoji: "🧠", accent: "#00E676" },
};
const defaultStyle = { gradient: "from-neon-purple/25 via-neon-blue/10 to-transparent", emoji: "📚", accent: "#6C5CE7" };

export default function CoursesPage() {
  const supabase = createClient();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser();

    const { data: coursesData } = await supabase
      .from("courses")
      .select("*")
      .eq("is_published", true)
      .order("order_index");
    if (coursesData) setCourses(coursesData as Course[]);

    if (user) {
      const { data: enrollData } = await supabase
        .from("enrollments")
        .select("*")
        .eq("user_id", user.id);
      if (enrollData) setEnrollments(enrollData as Enrollment[]);
    }

    setLoading(false);
  }

  const filteredCourses = courses.filter((course) => {
    const matchSearch = course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.description?.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "all" || course.category === category;
    return matchSearch && matchCategory;
  });

  function getEnrollment(courseId: string) {
    return enrollments.find((e) => e.course_id === courseId);
  }

  // Davom etayotgan kurslar (progress bor, tugallanmagan)
  const continuing = enrollments
    .filter(e => !e.is_completed && e.progress_percent > 0)
    .map(e => ({ enrollment: e, course: courses.find(c => c.id === e.course_id) }))
    .filter(x => x.course)
    .slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        className="relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-neon-purple/[0.12] via-card/60 to-neon-blue/[0.08] p-7 md:p-9"
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      >
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-neon-purple/15 blur-[80px] pointer-events-none" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-purple/10 border border-neon-purple/20 text-neon-purple text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" /> {courses.length} ta kurs mavjud
          </div>
          <h1 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight mb-2">
            Kurslar <span className="gradient-text">katalogi</span>
          </h1>
          <p className="text-muted-foreground max-w-lg">
            O'zingizga mos kursni tanlang — interaktiv darslar, AI mentor va amaliy topshiriqlar bilan o'rganing.
          </p>
        </div>
      </motion.div>

      {/* Davom etayotgan kurslar */}
      {continuing.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <h2 className="font-display font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
            <Play className="w-4 h-4 text-neon-green" /> Davom ettirish
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {continuing.map(({ enrollment, course }) => (
              <Link
                key={enrollment.id}
                href={`/courses/${course!.slug}`}
                className="group relative overflow-hidden rounded-2xl border border-neon-green/20 bg-neon-green/[0.04] hover:bg-neon-green/[0.08] p-4 flex items-center gap-3.5 transition-all"
              >
                <div className="relative w-11 h-11 flex-shrink-0">
                  <svg className="w-11 h-11 -rotate-90" viewBox="0 0 44 44">
                    <circle cx="22" cy="22" r="19" fill="none" stroke="currentColor" strokeWidth="4" className="text-border" />
                    <circle
                      cx="22" cy="22" r="19" fill="none" stroke="#00E676" strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray={`${(enrollment.progress_percent / 100) * 119.4} 119.4`}
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold font-mono">
                    {enrollment.progress_percent}%
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display font-semibold text-sm truncate group-hover:text-neon-green transition-colors">{course!.title}</p>
                  <p className="text-[11px] text-muted-foreground">Qolgan joydan davom eting</p>
                </div>
                <ChevronRight className="w-4.5 h-4.5 text-muted-foreground group-hover:text-neon-green group-hover:translate-x-1 transition-all flex-shrink-0" />
              </Link>
            ))}
          </div>
        </motion.div>
      )}

      {/* Search & Filter */}
      <motion.div
        className="space-y-3"
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
      >
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Kurs qidirish..."
            className="input-field pl-11"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all border",
                category === cat.value
                  ? "bg-neon-purple/10 text-neon-purple border-neon-purple/30 shadow-lg shadow-neon-purple/10"
                  : "bg-surface text-muted-foreground hover:bg-surface-hover border-transparent hover:border-border/60"
              )}
            >
              <span className="text-sm">{cat.icon}</span> {cat.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Course Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="glass-card h-72 animate-pulse" />
          ))}
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-center py-20">
          <BookOpen className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
          <h3 className="font-display font-semibold text-xl mb-2">Kurs topilmadi</h3>
          <p className="text-muted-foreground">Qidiruv so'zini o'zgartiring yoki boshqa kategoriyani tanlang</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCourses.map((course, i) => {
            const enrollment = getEnrollment(course.id);
            const diffConfig = getDifficultyConfig(course.difficulty || "beginner");
            const style = categoryStyle[course.category] || defaultStyle;

            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.4) }}
              >
                <Link
                  href={`/courses/${course.slug}`}
                  className="group relative flex flex-col h-full rounded-3xl border border-border/50 bg-card/40 overflow-hidden hover:border-transparent hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 block"
                  style={{ ["--accent" as any]: style.accent }}
                >
                  {/* Hover gradient halqa (border glow) */}
                  <div
                    className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20"
                    style={{ boxShadow: `inset 0 0 0 1.5px ${style.accent}66, 0 20px 50px -16px ${style.accent}40` }}
                  />

                  {/* Cover — rasm bo'lsa rasm, bo'lmasa gradient+emoji */}
                  <div className={cn("relative h-40 overflow-hidden", !course.thumbnail_url && `bg-gradient-to-br ${style.gradient}`)}>
                    {course.thumbnail_url ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={course.thumbnail_url}
                          alt={course.title}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          loading="lazy"
                        />
                        {/* Pastdan qoraytiruvchi gradient — matn o'qilishi uchun */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                      </>
                    ) : (
                      <>
                        {/* Pattern dots */}
                        <div
                          className="absolute inset-0 opacity-[0.15]"
                          style={{ backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)", backgroundSize: "16px 16px" }}
                        />
                        <div className="absolute bottom-3 left-5 text-6xl drop-shadow-lg group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300 origin-bottom-left">
                          {style.emoji}
                        </div>
                      </>
                    )}

                    {/* Shine sweep — hover'da yorug'lik o'tadi */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

                    {/* Narx badge */}
                    <div className="absolute top-3.5 right-4 flex gap-1.5">
                      {course.is_free ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-neon-green/90 text-background backdrop-blur-sm shadow-lg shadow-neon-green/30">
                          BEPUL
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-neon-yellow/90 text-[#1a1a00] backdrop-blur-sm shadow-lg shadow-neon-yellow/30">
                          <Coins className="w-3 h-3" />{course.price_coins}
                        </span>
                      )}
                    </div>

                    {enrollment?.is_completed && (
                      <div className="absolute bottom-3 right-4 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-neon-green text-background shadow-lg">
                        <CheckCircle2 className="w-3 h-3" /> TUGATILDI
                      </div>
                    )}
                  </div>

                  {/* Body — toza, havodor uslub */}
                  <div className="flex flex-col flex-1 p-5 md:p-6">
                    {/* Daraja chipi */}
                    <div className="mb-3">
                      <span className={diffConfig.class}>{diffConfig.label}</span>
                    </div>

                    <h3 className="font-display font-bold text-xl leading-snug mb-2 group-hover:text-neon-purple transition-colors line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
                      {course.description}
                    </p>

                    {/* Teglar (mono chiplar) */}
                    {course.tags && course.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {course.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="px-2 py-1 rounded-md text-[10px] font-mono font-semibold bg-surface border border-border/60 text-muted-foreground uppercase tracking-wide">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex-1" />

                    {/* Statistika qatori */}
                    <div className="flex items-center justify-between py-3 border-t border-border/50 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />{course.estimated_hours ? `${course.estimated_hours} soat` : "—"}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5" />{course.total_topics} dars
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-foreground">
                        <Star className="w-3.5 h-3.5 text-neon-yellow fill-neon-yellow" />
                        {course.average_rating > 0 ? Number(course.average_rating).toFixed(1) : "yangi"}
                      </span>
                    </div>

                    {/* Pastki qator: narx / progress + Ko'rish */}
                    <div className="pt-3 border-t border-border/50">
                      {enrollment && !enrollment.is_completed ? (
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-semibold text-neon-blue">Davom etmoqda</span>
                            <span className="text-xs text-muted-foreground font-mono">{enrollment.progress_percent}%</span>
                          </div>
                          <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                            <div className="h-full progress-gradient rounded-full transition-all" style={{ width: `${enrollment.progress_percent}%` }} />
                          </div>
                        </div>
                      ) : enrollment?.is_completed ? (
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-neon-green text-sm font-bold">
                            <CheckCircle2 className="w-4 h-4" /> Tugatildi
                          </span>
                          <span className="inline-flex items-center gap-1.5 text-sm font-bold text-neon-green">
                            Ko'rish <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className={cn("font-display font-bold text-base", course.is_free ? "text-neon-green" : "text-neon-yellow")}>
                            {course.is_free ? "Bepul" : (
                              <span className="inline-flex items-center gap-1"><Coins className="w-4 h-4" />{course.price_coins} coin</span>
                            )}
                          </span>
                          <span className="inline-flex items-center gap-1.5 text-sm font-bold transition-all group-hover:gap-2.5" style={{ color: style.accent }}>
                            <Play className="w-3.5 h-3.5" /> Ko'rish <ChevronRight className="w-4 h-4" />
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
