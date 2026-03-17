"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { getInitials, formatNumber } from "@/lib/utils";
import {
  Code2, Brain, Trophy, Gamepad2, Users, Zap, ChevronRight, ChevronLeft,
  BookOpen, Terminal, Sparkles, Shield, Globe, ArrowRight,
  LayoutDashboard, LogOut, User, Menu, X, Star, MessageSquare, Quote
} from "lucide-react";

const features = [
  { icon: Code2, title: "Interaktiv kod muharriri", description: "Brauzerda kod yozing va natijani darhol ko'ring.", color: "#6C5CE7" },
  { icon: Brain, title: "AI yordamchi", description: "Sun'iy intellekt kodingizni tahlil qiladi va tavsiya beradi.", color: "#00D2FF" },
  { icon: Trophy, title: "Coin va yutuqlar", description: "Topshiriqlarni bajaring, coinlar yig'ing, sovg'alar almashtiring.", color: "#FFD600" },
  { icon: Gamepad2, title: "O'yin orqali o'rganish", description: "6 ta o'yin: Code Puzzle, Bug Fix, Maze, Battle va boshqalar.", color: "#00E676" },
  { icon: Shield, title: "Sertifikatlash", description: "Kursni tugatib rasmiy sertifikat oling.", color: "#FF6B9D" },
  { icon: Globe, title: "O'zbek tilida", description: "Barcha materiallar o'zbek tilida.", color: "#FF5252" },
];

const slides = [
  { title: "Dasturlashni noldan o'rganing", sub: "Python, JavaScript va boshqa tillar", bg: "from-[#6C5CE7] to-[#00D2FF]", emoji: "🚀" },
  { title: "AI bilan kodingizni tahlil qiling", sub: "Sun'iy intellekt sizga yordam beradi", bg: "from-[#00D2FF] to-[#00E676]", emoji: "🤖" },
  { title: "O'yin orqali o'rganing", sub: "Maze, Code Battle, Bug Fix va boshqalar", bg: "from-[#FFD600] to-[#FF6B9D]", emoji: "🎮" },
  { title: "Coinlar yig'ing, sovg'alar oling", sub: "Do'konda sichqoncha, klaviatura va boshqalar", bg: "from-[#FF6B9D] to-[#6C5CE7]", emoji: "🎁" },
];

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1 } }) };

export default function LandingPage() {
  const supabase = createClient();
  const [user, setUser] = useState<{ name: string; avatar: string | null; role: string } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [realStats, setRealStats] = useState({ users: 0, courses: 0, challenges: 0, submissions: 0 });
  const [slideIdx, setSlideIdx] = useState(0);
  const [dbCourses, setDbCourses] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase.from("profiles").select("full_name, avatar_url, role").eq("id", session.user.id).single();
        if (profile) setUser({ name: profile.full_name, avatar: profile.avatar_url, role: profile.role });
      }
      setAuthLoading(false);

      const [u, c, ch, s] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("courses").select("*", { count: "exact", head: true }).eq("is_published", true),
        supabase.from("challenges").select("*", { count: "exact", head: true }).eq("is_published", true),
        supabase.from("submissions").select("*", { count: "exact", head: true }),
      ]);
      setRealStats({ users: u.count || 0, courses: c.count || 0, challenges: ch.count || 0, submissions: s.count || 0 });

      const { data: courses } = await supabase.from("courses").select("id,title,slug,description,category,total_topics,total_enrolled,is_free,price_coins")
        .eq("is_published", true).order("order_index").limit(6);
      if (courses) setDbCourses(courses);

      const { data: tst } = await supabase.from("testimonials").select("*").eq("is_approved", true).order("created_at", { ascending: false }).limit(10);
      if (tst) setTestimonials(tst);
    })();
  }, []);

  useEffect(() => {
    const t1 = setInterval(() => setSlideIdx(i => (i + 1) % slides.length), 4000);
    return () => clearInterval(t1);
  }, []);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const t2 = setInterval(() => setTestimonialIdx(i => (i + 1) % testimonials.length), 5000);
    return () => clearInterval(t2);
  }, [testimonials.length]);

  const dashboardUrl = user?.role === "admin" ? "/a-dashboard" : user?.role === "teacher" ? "/t-dashboard" : "/dashboard";
  const categoryEmoji: Record<string, string> = { python: "🐍", programming: "💻", frontend: "⚛️", computer_literacy: "🖥️", prompt_engineering: "🤖", algorithms: "🧠" };
  const navLinks = [{ href: "/explore/courses", label: "Kurslar" }, { href: "/explore/challenges", label: "Topshiriqlar" }, { href: "/explore/games", label: "O'yinlar" }];
  const stats = [
    { label: "Foydalanuvchilar", value: realStats.users, icon: Users },
    { label: "Kurslar", value: realStats.courses, icon: BookOpen },
    { label: "Topshiriqlar", value: realStats.challenges, icon: Terminal },
    { label: "Yuborishlar", value: realStats.submissions, icon: Brain },
  ];

  async function handleLogout() { await supabase.auth.signOut(); document.cookie = 'user-role=; path=/; max-age=0'; setUser(null); setMenuOpen(false); }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-hero-gradient flex items-center justify-center"><Code2 className="w-5 h-5 text-white" /></div>
            <span className="font-display font-bold text-xl">Edu<span className="gradient-text">Code</span></span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(l => <Link key={l.href} href={l.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{l.label}</Link>)}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileNav(!mobileNav)} className="md:hidden p-2 hover:bg-accent rounded-xl">{mobileNav ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button>
            {authLoading ? <div className="w-20 h-9 bg-surface rounded-full animate-pulse" /> : user ? (
              <div className="relative">
                <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface hover:bg-surface-hover border border-border transition-all">
                  <div className="w-7 h-7 rounded-full bg-hero-gradient flex items-center justify-center text-white font-bold text-xs">
                    {user.avatar ? <img src={user.avatar} alt="" className="w-full h-full rounded-full object-cover" /> : getInitials(user.name)}
                  </div>
                  <span className="text-sm font-medium hidden sm:block">{user.name.split(" ")[0]}</span>
                </button>
                {menuOpen && (<><div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 top-12 w-56 glass-card p-2 shadow-xl z-50">
                    <div className="px-3 py-2 border-b border-border/50 mb-1"><p className="font-semibold text-sm">{user.name}</p><p className="text-xs text-muted-foreground capitalize">{user.role}</p></div>
                    <Link href={dashboardUrl} onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-accent"><LayoutDashboard className="w-4 h-4" /> Dashboard</Link>
                    <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-neon-red hover:bg-neon-red/10 w-full"><LogOut className="w-4 h-4" /> Chiqish</button>
                  </div></>)}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link href="/login" className="btn-ghost text-sm py-2 px-5">Kirish</Link>
                <Link href="/register" className="btn-primary text-sm py-2 px-5">Boshlash</Link>
              </div>
            )}
          </div>
        </div>
        <AnimatePresence>{mobileNav && (
          <motion.div className="md:hidden bg-card border-b border-border px-6 py-4 space-y-2" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
            {navLinks.map(l => <Link key={l.href} href={l.href} onClick={() => setMobileNav(false)} className="block py-2 text-sm hover:text-neon-purple">{l.label}</Link>)}
            {!user && <div className="flex gap-2 pt-2 border-t border-border mt-2"><Link href="/login" className="btn-ghost text-sm py-2 px-4 flex-1 text-center">Kirish</Link><Link href="/register" className="btn-primary text-sm py-2 px-4 flex-1 text-center">Boshlash</Link></div>}
          </motion.div>
        )}</AnimatePresence>
      </nav>

      {/* SLIDER */}
      <section className="relative pt-24 pb-4 px-4 md:px-6">
        <div className="absolute inset-0 overflow-hidden"><div className="absolute top-20 left-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-[120px]" /><div className="absolute top-40 right-1/4 w-80 h-80 bg-neon-blue/10 rounded-full blur-[120px]" /></div>
        <div className="max-w-7xl mx-auto relative">
          <div className="relative overflow-hidden rounded-3xl mb-8">
            <AnimatePresence mode="wait">
              <motion.div key={slideIdx} className={`bg-gradient-to-r ${slides[slideIdx].bg} p-8 md:p-16 text-white relative`}
                initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }} transition={{ duration: 0.5 }}>
                <div className="absolute inset-0 bg-black/10" />
                <div className="relative flex items-center justify-between">
                  <div><span className="text-4xl md:text-5xl mb-4 block">{slides[slideIdx].emoji}</span>
                    <h2 className="font-display font-extrabold text-2xl md:text-5xl mb-3">{slides[slideIdx].title}</h2>
                    <p className="text-white/80 text-base md:text-lg mb-6">{slides[slideIdx].sub}</p>
                    <Link href={user ? dashboardUrl : "/register"} className="inline-flex items-center gap-2 bg-white text-gray-900 font-display font-bold px-6 md:px-8 py-3 rounded-full hover:bg-white/90 transition-all text-sm md:text-base">
                      {user ? "Dashboard" : "Boshlash"} <ArrowRight className="w-5 h-5" /></Link>
                  </div>
                  <div className="hidden md:block">
                    <svg width="180" height="180" viewBox="0 0 200 200" className="animate-float">
                      <defs><linearGradient id="cg"><stop offset="0%" stopColor="rgba(255,255,255,0.3)" /><stop offset="100%" stopColor="rgba(255,255,255,0.05)" /></linearGradient></defs>
                      <rect x="20" y="30" width="160" height="120" rx="12" fill="url(#cg)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
                      <rect x="30" y="35" width="12" height="8" rx="4" fill="rgba(255,100,100,0.6)" /><rect x="46" y="35" width="12" height="8" rx="4" fill="rgba(255,200,50,0.6)" /><rect x="62" y="35" width="12" height="8" rx="4" fill="rgba(100,255,100,0.6)" />
                      <text x="40" y="70" fill="rgba(180,130,255,0.8)" fontSize="11" fontFamily="monospace">def</text><text x="65" y="70" fill="rgba(100,200,255,0.8)" fontSize="11" fontFamily="monospace">learn():</text>
                      <text x="55" y="88" fill="rgba(100,255,150,0.7)" fontSize="11" fontFamily="monospace">return &quot;🚀&quot;</text>
                      <rect x="40" y="100" width="80" height="6" rx="3" fill="rgba(255,255,255,0.1)" />
                      <rect x="40" y="100" width="50" height="6" rx="3" fill="rgba(100,255,150,0.4)"><animate attributeName="width" from="20" to="80" dur="3s" repeatCount="indefinite" /></rect>
                    </svg>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">{slides.map((_, i) => (
              <button key={i} onClick={() => setSlideIdx(i)} className={`w-2.5 h-2.5 rounded-full transition-all ${i === slideIdx ? "bg-white w-6" : "bg-white/40"}`} />
            ))}</div>
            <button onClick={() => setSlideIdx(i => (i - 1 + slides.length) % slides.length)} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white"><ChevronLeft className="w-5 h-5" /></button>
            <button onClick={() => setSlideIdx(i => (i + 1) % slides.length)} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white"><ChevronRight className="w-5 h-5" /></button>
          </div>

          <div className="max-w-3xl mx-auto text-center mb-4">
            <motion.h1 className="font-display font-extrabold text-3xl md:text-6xl leading-tight mb-4" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
              Dasturlashni{" "}<span className="gradient-text">o'ynab</span>{" "}o'rgan
            </motion.h1>
            <motion.p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
              Interaktiv kurslar, real-time kod muharriri, AI feedback va gamifikatsiya.
            </motion.p>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-10 px-4 md:px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, i) => (
            <motion.div key={stat.label} className="glass-card p-5 text-center" custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <stat.icon className="w-7 h-7 text-neon-purple mx-auto mb-2" />
              <div className="font-display font-bold text-2xl gradient-text mb-1">{formatNumber(Number(stat.value))}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-14 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.h2 className="font-display font-bold text-3xl md:text-4xl text-center mb-10" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Nima uchun <span className="gradient-text">EduCode</span>?
          </motion.h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div key={f.title} className="glass-card-hover p-7 group" custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" style={{ backgroundColor: `${f.color}15`, border: `1px solid ${f.color}30` }}>
                  <f.icon className="w-6 h-6" style={{ color: f.color }} />
                </div>
                <h3 className="font-display font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* COURSES */}
      {dbCourses.length > 0 && (
        <section className="py-14 px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display font-bold text-3xl">Mashhur <span className="gradient-text">kurslar</span></h2>
              <Link href="/explore/courses" className="btn-ghost text-sm py-2 px-5 flex items-center gap-1">Barchasi <ChevronRight className="w-4 h-4" /></Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {dbCourses.map((course, i) => (
                <motion.div key={course.id} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                  <Link href={user ? `/courses/${course.slug}` : "/login"} className="glass-card-hover p-5 block group">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-2xl bg-neon-purple/10 border border-neon-purple/20 flex items-center justify-center text-xl">{categoryEmoji[course.category] || "📚"}</div>
                      <div><h3 className="font-display font-bold group-hover:text-neon-purple transition-colors">{course.title}</h3>
                        <p className="text-xs text-muted-foreground">{course.total_topics} mavzu · {course.total_enrolled} talaba</p></div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{course.description}</p>
                    <div className="flex items-center justify-between">
                      {course.is_free ? <span className="text-xs font-semibold px-3 py-1 rounded-full bg-neon-green/10 text-neon-green">Bepul</span> :
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-neon-yellow/10 text-neon-yellow">{course.price_coins} coin</span>}
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-neon-purple group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TESTIMONIALS SLIDER */}
      {testimonials.length > 0 && (
        <section className="py-14 px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div className="text-center mb-8" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <h2 className="font-display font-bold text-3xl mb-2">Talabalar <span className="gradient-text">fikrlari</span></h2>
              <p className="text-muted-foreground">Platformamiz haqida talabalar nima deyishadi</p>
            </motion.div>

            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div key={testimonialIdx} className="glass-card p-8 md:p-10 text-center"
                  initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.4 }}>
                  <Quote className="w-10 h-10 text-neon-purple/20 mx-auto mb-4" />
                  <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-6 italic">
                    &ldquo;{testimonials[testimonialIdx].text}&rdquo;
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-hero-gradient flex items-center justify-center text-white font-bold text-sm">
                      {testimonials[testimonialIdx].avatar_url ? (
                        <img src={testimonials[testimonialIdx].avatar_url} className="w-full h-full rounded-full object-cover" />
                      ) : getInitials(testimonials[testimonialIdx].full_name)}
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-sm">{testimonials[testimonialIdx].full_name}</p>
                      <div className="flex gap-0.5">{[...Array(testimonials[testimonialIdx].rating)].map((_, i) => <Star key={i} className="w-3 h-3 text-neon-yellow fill-neon-yellow" />)}</div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {testimonials.length > 1 && (
                <>
                  <button onClick={() => setTestimonialIdx(i => (i - 1 + testimonials.length) % testimonials.length)}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-9 h-9 rounded-full bg-card border border-border hover:bg-accent flex items-center justify-center"><ChevronLeft className="w-4 h-4" /></button>
                  <button onClick={() => setTestimonialIdx(i => (i + 1) % testimonials.length)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-9 h-9 rounded-full bg-card border border-border hover:bg-accent flex items-center justify-center"><ChevronRight className="w-4 h-4" /></button>
                  <div className="flex justify-center gap-2 mt-4">{testimonials.map((_, i) => (
                    <button key={i} onClick={() => setTestimonialIdx(i)} className={`w-2 h-2 rounded-full transition-all ${i === testimonialIdx ? "bg-neon-purple w-5" : "bg-surface"}`} />
                  ))}</div>
                </>
              )}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-14 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div className="relative overflow-hidden rounded-3xl bg-hero-gradient p-10 md:p-16 text-center" initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            <Zap className="w-14 h-14 text-white/90 mx-auto mb-5" />
            <h2 className="font-display font-bold text-2xl md:text-4xl text-white mb-4">Dasturlash sayohatingizni boshlang</h2>
            <p className="text-white/80 max-w-xl mx-auto mb-8">100 ta bepul coin, AI yordamchi va kurslar sizni kutmoqda.</p>
            <Link href={user ? dashboardUrl : "/register"} className="inline-flex items-center gap-2 bg-white text-neon-purple font-display font-bold px-10 py-4 rounded-full text-lg hover:bg-white/90 transition-all shadow-lg">
              {user ? "Dashboard" : "Hoziroq boshlash"} <ArrowRight className="w-5 h-5" /></Link>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border py-10 px-4 md:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-hero-gradient flex items-center justify-center"><Code2 className="w-4 h-4 text-white" /></div>
            <span className="font-display font-bold text-lg">EduCode</span>
          </div>
          <div className="flex items-center gap-6">{navLinks.map(l => <Link key={l.href} href={l.href} className="text-sm text-muted-foreground hover:text-foreground">{l.label}</Link>)}</div>
          <p className="text-sm text-muted-foreground">© 2026 EduCode Platform</p>
        </div>
      </footer>
    </div>
  );
}
