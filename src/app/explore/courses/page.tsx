"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { cn, getDifficultyConfig } from "@/lib/utils";
import type { Course } from "@/types";
import { motion } from "framer-motion";
import {
  BookOpen,
  Search,
  Users,
  ArrowRight,
  Lock,
  Code2,
  Monitor,
  Brain,
  Binary,
} from "lucide-react";
import { LanguageLogo } from "@/components/icons/LanguageLogo";

const categories = [
  { value: "all", label: "Barchasi" },
  { value: "python", label: "Python" },
  { value: "programming", label: "Dasturlash" },
  { value: "frontend", label: "Frontend" },
  { value: "computer_literacy", label: "Kompyuter" },
  { value: "algorithms", label: "Algoritmlar" },
];

function CategoryIcon({ category, size = 28 }: { category: string; size?: number }) {
  const key = (category || "").toLowerCase();
  if (key === "python") return <LanguageLogo lang="python" size={size} />;
  if (key === "frontend") return <LanguageLogo lang="react" size={size} />;
  if (key === "programming") return <Code2 className="text-neon-purple" style={{ width: size, height: size }} />;
  if (key === "computer_literacy") return <Monitor className="text-neon-blue" style={{ width: size, height: size }} />;
  if (key === "prompt_engineering") return <Brain className="text-neon-pink" style={{ width: size, height: size }} />;
  if (key === "algorithms") return <Binary className="text-neon-green" style={{ width: size, height: size }} />;
  return <BookOpen className="text-muted-foreground" style={{ width: size, height: size }} />;
}

export default function ExploreCourses() {
  const supabase = createClient();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
      const { data } = await supabase
        .from("courses")
        .select("*")
        .eq("is_published", true)
        .order("order_index");
      if (data) setCourses(data as Course[]);
      setLoading(false);
    })();
  }, []);

  function handleClick(slug: string) {
    router.push(isLoggedIn ? `/courses/${slug}` : `/login?redirect=/courses/${slug}`);
  }

  const filtered = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) &&
      (category === "all" || c.category === category)
  );

  return (
    <div className="space-y-8 md:space-y-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl"
      >
        <h1 className="font-display font-extrabold text-4xl md:text-5xl tracking-tight mb-3">
          Kurslar kutubxonasi
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Python, algoritmlar, frontend va boshqa yo'nalishlardagi kurslarni tanlang va
          bosqichma-bosqich o'rganing.
        </p>
      </motion.div>

      {/* Search + Filter bar */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Kurs nomi bo'yicha qidirish..."
            className="w-full bg-surface/60 border border-border rounded-2xl pl-12 pr-4 py-3.5 text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-neon-purple/40 focus:border-neon-purple/40 transition-all"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
          {categories.map((c) => (
            <button
              key={c.value}
              onClick={() => setCategory(c.value)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap flex-shrink-0 border",
                category === c.value
                  ? "bg-foreground text-background border-foreground"
                  : "bg-surface/40 text-muted-foreground border-border/50 hover:border-border hover:text-foreground"
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Courses grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="p-6 h-56 rounded-2xl border border-border/40 bg-card/30 animate-pulse"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center">
          <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-base text-muted-foreground">Natija topilmadi</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((course, i) => {
            const diff = getDifficultyConfig(course.difficulty || "beginner");
            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
              >
                <button
                  onClick={() => handleClick(course.slug)}
                  className="group w-full text-left p-6 rounded-2xl border border-border/50 bg-card/40 hover:bg-card hover:border-border hover:shadow-xl hover:shadow-black/[0.04] transition-all duration-300"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-surface flex items-center justify-center border border-border/60 flex-shrink-0 group-hover:scale-105 transition-transform">
                      <CategoryIcon category={course.category} size={28} />
                    </div>
                    <div className="min-w-0 flex-1 pt-0.5">
                      <h3 className="font-display font-bold text-lg leading-snug group-hover:text-neon-purple transition-colors line-clamp-2">
                        {course.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-1.5 mt-2">
                        <span className={diff.class}>{diff.label}</span>
                        {course.is_free ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-neon-green/10 text-neon-green border border-neon-green/20">
                            Bepul
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-neon-yellow/10 text-neon-yellow border border-neon-yellow/20">
                            {course.price_coins} coin
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-[15px] text-muted-foreground line-clamp-2 leading-relaxed mb-5">
                    {course.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-border/40">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4" />
                        <span className="font-medium">{course.total_topics}</span> mavzu
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Users className="w-4 h-4" />
                        <span className="font-medium">{course.total_enrolled}</span>
                      </span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground/60 group-hover:text-neon-purple group-hover:translate-x-1 transition-all" />
                  </div>
                </button>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* CTA for guests */}
      {!isLoggedIn && !loading && (
        <div className="p-8 md:p-10 rounded-3xl border border-border/50 bg-surface/30 text-center">
          <div className="w-14 h-14 rounded-2xl bg-neon-purple/10 border border-neon-purple/20 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6 text-neon-purple" />
          </div>
          <h3 className="font-display font-bold text-xl mb-2">
            Kurslarda o'qish uchun ro'yxatdan o'ting
          </h3>
          <p className="text-muted-foreground text-base mb-5 max-w-md mx-auto">
            100 bepul coin, AI yordamchi va barcha kurslarga kirish huquqi.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-foreground text-background font-display font-semibold text-sm hover:opacity-90 transition-all"
          >
            Bepul boshlash <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
