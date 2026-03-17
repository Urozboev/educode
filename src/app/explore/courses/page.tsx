"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { cn, getDifficultyConfig } from "@/lib/utils";
import type { Course } from "@/types";
import { motion } from "framer-motion";
import { BookOpen, Search, Users, Coins, ChevronRight, Lock } from "lucide-react";

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

  function handleClick(slug: string) {
    router.push(isLoggedIn ? `/courses/${slug}` : `/login?redirect=/courses/${slug}`);
  }

  const filtered = courses.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) &&
    (category === "all" || c.category === category)
  );

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display font-bold text-3xl md:text-4xl mb-2">Kurslar</h1>
        <p className="text-muted-foreground">Dasturlash kurslarini ko'ring va o'rganishni boshlang</p>
      </motion.div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Kurs qidirish..." className="input-field pl-11 w-full" />
      </div>

      {/* Categories - scrollable on mobile */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
        {categories.map(c => (
          <button key={c.value} onClick={() => setCategory(c.value)}
            className={cn("px-3 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap flex-shrink-0",
              category === c.value ? "bg-neon-purple/10 text-neon-purple border border-neon-purple/20" : "bg-surface text-muted-foreground border border-transparent")}>
            {c.label}
          </button>
        ))}
      </div>

      {/* Courses grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{[1,2,3,4,5,6].map(i => <div key={i} className="glass-card p-6 h-48 animate-pulse" />)}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((course, i) => {
            const diff = getDifficultyConfig(course.difficulty || "beginner");
            return (
              <motion.div key={course.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <button onClick={() => handleClick(course.slug)} className="glass-card-hover p-5 w-full text-left group block">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-neon-purple/10 border border-neon-purple/20 flex items-center justify-center text-xl flex-shrink-0">
                      {categoryEmoji[course.category] || "📚"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-display font-bold text-base truncate group-hover:text-neon-purple transition-colors">{course.title}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={diff.class}>{diff.label}</span>
                        {course.is_free ? <span className="text-[10px] px-2 py-0.5 rounded-full bg-neon-green/10 text-neon-green font-semibold">Bepul</span>
                          : <span className="text-[10px] px-2 py-0.5 rounded-full bg-neon-yellow/10 text-neon-yellow font-semibold">{course.price_coins} coin</span>}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{course.description}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex gap-3">
                      <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" />{course.total_topics}</span>
                      <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{course.total_enrolled}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 group-hover:text-neon-purple group-hover:translate-x-1 transition-all" />
                  </div>
                </button>
              </motion.div>
            );
          })}
        </div>
      )}

      {!isLoggedIn && (
        <div className="glass-card p-6 text-center">
          <Lock className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-muted-foreground text-sm mb-3">Kurslardan foydalanish uchun ro'yxatdan o'ting</p>
          <Link href="/register" className="btn-primary text-sm py-2 px-6">Bepul boshlash</Link>
        </div>
      )}
    </div>
  );
}
