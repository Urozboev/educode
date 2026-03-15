"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { cn, getDifficultyConfig, getCategoryLabel } from "@/lib/utils";
import type { Course, Enrollment } from "@/types";
import { motion } from "framer-motion";
import {
  BookOpen, Search, Filter, Clock, Users, Coins, Star,
  ChevronRight, Lock, CheckCircle2, GraduationCap
} from "lucide-react";

const categories = [
  { value: "all", label: "Barchasi" },
  { value: "python", label: "Python" },
  { value: "programming", label: "Dasturlash" },
  { value: "frontend", label: "Frontend" },
  { value: "computer_literacy", label: "Kompyuter savodxonligi" },
  { value: "prompt_engineering", label: "Prompt Engineering" },
  { value: "algorithms", label: "Algoritmlar" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.06 } }),
};

export default function CoursesPage() {
  const supabase = createClient();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
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

  const categoryIcons: Record<string, string> = {
    python: "🐍", programming: "💻", frontend: "⚛️",
    computer_literacy: "🖥️", prompt_engineering: "🤖", algorithms: "🧠",
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display font-bold text-3xl mb-1">Kurslar</h1>
        <p className="text-muted-foreground">O'zingizga mos kursni tanlang va o'rganishni boshlang</p>
      </motion.div>

      {/* Search & Filter */}
      <motion.div
        className="flex flex-col md:flex-row gap-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="relative flex-1">
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
                "px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
                category === cat.value
                  ? "bg-neon-purple/10 text-neon-purple border border-neon-purple/20"
                  : "bg-surface text-muted-foreground hover:bg-surface-hover border border-transparent"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Course Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="glass-card p-6 h-64 animate-pulse" />
          ))}
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-center py-20">
          <BookOpen className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
          <h3 className="font-display font-semibold text-xl mb-2">Kurs topilmadi</h3>
          <p className="text-muted-foreground">Qidiruv so'zini o'zgartiring yoki boshqa kategoriyani tanlang</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course, i) => {
            const enrollment = getEnrollment(course.id);
            const diffConfig = getDifficultyConfig(course.difficulty || 'beginner');

            return (
              <motion.div
                key={course.id}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
              >
                <Link
                  href={`/courses/${course.slug}`}
                  className="glass-card-hover p-6 flex flex-col h-full group block"
                >
                  {/* Thumbnail / Icon */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-neon-purple/10 border border-neon-purple/20 flex items-center justify-center text-2xl flex-shrink-0">
                      {categoryIcons[course.category] || "📚"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-display font-bold text-lg truncate group-hover:text-neon-purple transition-colors">
                        {course.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={diffConfig.class}>{diffConfig.label}</span>
                        {!course.is_free && (
                          <span className="coin-badge text-[10px] py-0.5 px-2">
                            <Coins className="w-3 h-3" />
                            {course.price_coins}
                          </span>
                        )}
                        {course.is_free && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-neon-green/10 text-neon-green border border-neon-green/20">
                            Bepul
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1 line-clamp-2">
                    {course.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" />
                      {course.total_topics} mavzu
                    </span>
                    {course.estimated_hours && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        ~{course.estimated_hours} soat
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {course.total_enrolled}
                    </span>
                  </div>

                  {/* Progress or CTA */}
                  {enrollment ? (
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-medium">
                          {enrollment.is_completed ? (
                            <span className="flex items-center gap-1 text-neon-green">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Tugatildi
                            </span>
                          ) : (
                            "Davom etmoqda"
                          )}
                        </span>
                        <span className="text-xs text-muted-foreground font-mono">{enrollment.progress_percent}%</span>
                      </div>
                      <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                        <div className="h-full progress-gradient rounded-full" style={{ width: `${enrollment.progress_percent}%` }} />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-neon-purple group-hover:underline">
                        {course.is_free ? "Boshlash" : "Ko'rish"}
                      </span>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-neon-purple group-hover:translate-x-1 transition-all" />
                    </div>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
