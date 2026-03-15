"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn, getDifficultyConfig } from "@/lib/utils";
import type { Course } from "@/types";
import { motion } from "framer-motion";
import { BookOpen, Search, Clock, Users, Coins, ChevronRight, Lock } from "lucide-react";

const categories = [
  { value: "all", label: "Barchasi" }, { value: "python", label: "Python" },
  { value: "programming", label: "Dasturlash" }, { value: "frontend", label: "Frontend" },
  { value: "computer_literacy", label: "Kompyuter" }, { value: "algorithms", label: "Algoritmlar" },
];

const categoryEmoji: Record<string, string> = { python: "🐍", programming: "💻", frontend: "⚛️", computer_literacy: "🖥️", prompt_engineering: "🤖", algorithms: "🧠" };

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
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
      const { data } = await supabase.from("courses").select("*").eq("is_published", true).order("order_index");
      if (data) setCourses(data as Course[]);
      setLoading(false);
    })();
  }, []);

  function handleCourseClick(slug: string) {
    if (isLoggedIn) router.push(`/courses/${slug}`);
    else router.push(`/login?redirect=/courses/${slug}`);
  }

  const filtered = courses.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) &&
    (category === "all" || c.category === category)
  );

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display font-bold text-4xl mb-2">Kurslar</h1>
        <p className="text-muted-foreground text-lg">Dasturlash kurslarini ko'ring va o'rganishni boshlang</p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Kurs qidirish..." className="input-field pl-11" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map(c => (
            <button key={c.value} onClick={() => setCategory(c.value)}
              className={cn("px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
                category === c.value ? "bg-neon-purple/10 text-neon-purple border border-neon-purple/20" : "bg-surface text-muted-foreground hover:bg-surface-hover border border-transparent")}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{[1,2,3,4,5,6].map(i => <div key={i} className="glass-card p-6 h-48 animate-pulse" />)}</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((course, i) => {
            const diff = getDifficultyConfig(course.difficulty || "beginner");
            return (
              <motion.div key={course.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <button onClick={() => handleCourseClick(course.slug)} className="glass-card-hover p-6 w-full text-left group block">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-neon-purple/10 border border-neon-purple/20 flex items-center justify-center text-2xl">
                      {categoryEmoji[course.category] || "📚"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-bold text-lg truncate group-hover:text-neon-purple transition-colors">{course.title}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={diff.class}>{diff.label}</span>
                        {course.is_free ? <span className="text-[10px] px-2 py-0.5 rounded-full bg-neon-green/10 text-neon-green font-semibold">Bepul</span>
                          : <span className="text-[10px] px-2 py-0.5 rounded-full bg-neon-yellow/10 text-neon-yellow font-semibold">{course.price_coins} coin</span>}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{course.description}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex gap-4">
                      <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" />{course.total_topics} mavzu</span>
                      <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{course.total_enrolled}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 group-hover:text-neon-purple group-hover:translate-x-1 transition-all" />
                  </div>
                </button>
              </motion.div>
            );
          })}
        </div>
      )}

      {!isLoggedIn && (
        <motion.div className="glass-card p-8 text-center" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <Lock className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground mb-4">Kurslardan foydalanish uchun ro'yxatdan o'ting</p>
          <Link href="/register" className="btn-primary text-sm py-2.5 px-6">Bepul boshlash</Link>
        </motion.div>
      )}
    </div>
  );
}
