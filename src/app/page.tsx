"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { getInitials, formatNumber } from "@/lib/utils";
import { useTheme } from "next-themes";
import {
  Code2, Brain, Trophy, Gamepad2, Users, Zap, ChevronRight, ChevronLeft,
  BookOpen, Terminal, Sparkles, Shield, Globe, ArrowRight,
  LayoutDashboard, LogOut, User, Menu, X, Star, Quote, Moon, Sun, MessageCircle
} from "lucide-react";

const features = [
  { icon: Code2, title: "Interaktiv kod muharriri", desc: "Brauzerda kod yozing va natijani darhol ko'ring.", color: "#6C5CE7" },
  { icon: Brain, title: "AI yordamchi", desc: "Sun'iy intellekt kodingizni tahlil qiladi.", color: "#00D2FF" },
  { icon: Trophy, title: "Coin va sovg'alar", desc: "Coinlar yig'ing, do'kondan sovg'alar oling.", color: "#FFD600" },
  { icon: Gamepad2, title: "6 ta o'yin", desc: "Maze, Code Battle, Bug Fix va boshqalar.", color: "#00E676" },
  { icon: Shield, title: "Sertifikat", desc: "Kursni tugatib rasmiy sertifikat oling.", color: "#FF6B9D" },
  { icon: Globe, title: "O'zbek tilida", desc: "Barcha materiallar o'zbek tilida.", color: "#FF5252" },
];

const slides = [
  { title: "Dasturlashni noldan o'rganing", sub: "Python, JavaScript va boshqa tillar", bg: "from-[#6C5CE7] to-[#00D2FF]", emoji: "🚀" },
  { title: "AI bilan kodingizni tahlil qiling", sub: "Sun'iy intellekt sizga yordam beradi", bg: "from-[#00D2FF] to-[#00E676]", emoji: "🤖" },
  { title: "O'yin orqali o'rganing", sub: "Maze, Code Battle, Bug Fix va boshqalar", bg: "from-[#FFD600] to-[#FF6B9D]", emoji: "🎮" },
  { title: "Coinlar yig'ing, sovg'alar oling", sub: "Do'konda sichqoncha, klaviatura va boshqalar", bg: "from-[#FF6B9D] to-[#6C5CE7]", emoji: "🎁" },
];

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08 } }) };

export default function LandingPage() {
  const supabase = createClient();
  const { theme, setTheme } = useTheme();
  const [user, setUser] = useState<{ name: string; avatar: string | null; role: string } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [realStats, setRealStats] = useState({ users: 0, courses: 0, challenges: 0, submissions: 0 });
  const [slideIdx, setSlideIdx] = useState(0);
  const [dbCourses, setDbCourses] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [tIdx, setTIdx] = useState(0);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: p } = await supabase.from("profiles").select("full_name, avatar_url, role").eq("id", session.user.id).single();
        if (p) setUser({ name: p.full_name, avatar: p.avatar_url, role: p.role });
      }
      setAuthLoading(false);
      const [u, c, ch, s] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("courses").select("*", { count: "exact", head: true }).eq("is_published", true),
        supabase.from("challenges").select("*", { count: "exact", head: true }).eq("is_published", true),
        supabase.from("submissions").select("*", { count: "exact", head: true }),
      ]);
      setRealStats({ users: u.count || 0, courses: c.count || 0, challenges: ch.count || 0, submissions: s.count || 0 });
      const { data: courses } = await supabase.from("courses").select("id,title,slug,description,category,total_topics,total_enrolled,is_free,price_coins").eq("is_published", true).order("order_index").limit(6);
      if (courses) setDbCourses(courses);
      const { data: tst } = await supabase.from("testimonials").select("*").eq("is_approved", true).order("created_at", { ascending: false }).limit(10);
      if (tst) setTestimonials(tst);
    })();
  }, []);

  useEffect(() => { const t = setInterval(() => setSlideIdx(i => (i + 1) % slides.length), 4000); return () => clearInterval(t); }, []);
  useEffect(() => { if (testimonials.length <= 1) return; const t = setInterval(() => setTIdx(i => (i + 1) % testimonials.length), 5000); return () => clearInterval(t); }, [testimonials.length]);

  const dUrl = user?.role === "admin" ? "/a-dashboard" : user?.role === "teacher" ? "/t-dashboard" : "/dashboard";
  const catEmoji: Record<string, string> = { python: "🐍", programming: "💻", frontend: "⚛️", computer_literacy: "🖥️", prompt_engineering: "🤖", algorithms: "🧠" };
  const navLinks = [{ href: "/explore/courses", label: "Kurslar" }, { href: "/explore/challenges", label: "Topshiriqlar" }, { href: "/explore/games", label: "O'yinlar" }, { href: "/explore/about", label: "Haqida" }];
  const stats = [
    { label: "Foydalanuvchilar", value: realStats.users, icon: Users },
    { label: "Kurslar", value: realStats.courses, icon: BookOpen },
    { label: "Topshiriqlar", value: realStats.challenges, icon: Terminal },
    { label: "Yuborishlar", value: realStats.submissions, icon: Brain },
  ];

  async function handleLogout() { await supabase.auth.signOut(); document.cookie = 'user-role=; path=/; max-age=0'; setUser(null); setMenuOpen(false); }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-hero-gradient flex items-center justify-center"><Code2 className="w-4 h-4 text-white" /></div>
            <span className="font-display font-bold text-lg">Edu<span className="gradient-text">Code</span></span>
          </Link>
          <div className="hidden md:flex items-center gap-5">{navLinks.map(l => <Link key={l.href} href={l.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{l.label}</Link>)}</div>
          <div className="flex items-center gap-2">
            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="p-2 hover:bg-accent rounded-lg text-muted-foreground">
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            {authLoading ? <div className="w-16 h-8 bg-surface rounded-full animate-pulse" /> : user ? (
              <div className="relative">
                <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-surface hover:bg-surface-hover border border-border transition-all">
                  <div className="w-6 h-6 rounded-full bg-hero-gradient flex items-center justify-center text-white font-bold text-[10px]">
                    {user.avatar ? <img src={user.avatar} alt="" className="w-full h-full rounded-full object-cover" /> : getInitials(user.name)}
                  </div>
                  <span className="text-sm font-medium hidden sm:block">{user.name.split(" ")[0]}</span>
                </button>
                {menuOpen && (<><div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 top-11 w-48 glass-card p-2 shadow-xl z-50">
                    <Link href={dUrl} onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-accent"><LayoutDashboard className="w-4 h-4" /> Dashboard</Link>
                    <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-neon-red hover:bg-neon-red/10 w-full"><LogOut className="w-4 h-4" /> Chiqish</button>
                  </div></>)}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/login" className="btn-ghost text-xs py-1.5 px-4">Kirish</Link>
                <Link href="/register" className="btn-primary text-xs py-1.5 px-4">Boshlash</Link>
              </div>
            )}
            <button onClick={() => setMobileNav(!mobileNav)} className="md:hidden p-2 hover:bg-accent rounded-lg">{mobileNav ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button>
          </div>
        </div>
        <AnimatePresence>{mobileNav && (
          <motion.div className="md:hidden bg-card border-b border-border px-4 py-3 space-y-1" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
            {navLinks.map(l => <Link key={l.href} href={l.href} onClick={() => setMobileNav(false)} className="block py-2.5 px-3 rounded-lg text-sm hover:bg-accent">{l.label}</Link>)}
            {!user && <div className="flex gap-2 pt-2 border-t border-border mt-2"><Link href="/login" onClick={() => setMobileNav(false)} className="btn-ghost text-sm py-2 flex-1 text-center">Kirish</Link><Link href="/register" onClick={() => setMobileNav(false)} className="btn-primary text-sm py-2 flex-1 text-center">Boshlash</Link></div>}
          </motion.div>
        )}</AnimatePresence>
      </nav>

      {/* SLIDER */}
      <section className="relative pt-20 pb-4 px-4 md:px-6">
        <div className="absolute inset-0 overflow-hidden"><div className="absolute top-20 left-1/4 w-72 h-72 bg-neon-purple/10 rounded-full blur-[100px]" /><div className="absolute top-32 right-1/4 w-60 h-60 bg-neon-blue/10 rounded-full blur-[100px]" /></div>
        <div className="max-w-7xl mx-auto relative">
          <div className="relative overflow-hidden rounded-2xl mb-8">
            <AnimatePresence mode="wait">
              <motion.div key={slideIdx} className={`bg-gradient-to-r ${slides[slideIdx].bg} p-6 md:p-14 text-white relative`} initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -80 }} transition={{ duration: 0.4 }}>
                <div className="absolute inset-0 bg-black/10" />
                <div className="relative">
                  <span className="text-3xl md:text-4xl mb-3 block">{slides[slideIdx].emoji}</span>
                  <h2 className="font-display font-extrabold text-xl md:text-4xl mb-2">{slides[slideIdx].title}</h2>
                  <p className="text-white/80 text-sm md:text-lg mb-5">{slides[slideIdx].sub}</p>
                  <Link href={user ? dUrl : "/register"} className="inline-flex items-center gap-2 bg-white text-gray-900 font-display font-bold px-5 md:px-8 py-2.5 rounded-full hover:bg-white/90 transition-all text-sm">
                    {user ? "Dashboard" : "Boshlash"} <ArrowRight className="w-4 h-4" /></Link>
                </div>
              </motion.div>
            </AnimatePresence>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">{slides.map((_, i) => <button key={i} onClick={() => setSlideIdx(i)} className={`w-2 h-2 rounded-full transition-all ${i === slideIdx ? "bg-white w-5" : "bg-white/40"}`} />)}</div>
          </div>
          <div className="max-w-2xl mx-auto text-center mb-4">
            <motion.h1 className="font-display font-extrabold text-3xl md:text-5xl leading-tight mb-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              Dasturlashni <span className="gradient-text">o'ynab</span> o'rgan
            </motion.h1>
            <motion.p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
              Interaktiv kurslar, AI feedback, gamifikatsiya — barchasi bitta platformada.
            </motion.p>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-8 px-4 md:px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map((s, i) => (
            <motion.div key={s.label} className="glass-card p-4 text-center" custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <s.icon className="w-6 h-6 text-neon-purple mx-auto mb-1.5" />
              <div className="font-display font-bold text-xl gradient-text">{formatNumber(Number(s.value))}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-12 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-center mb-8">Nima uchun <span className="gradient-text">EduCode</span>?</h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <motion.div key={f.title} className="glass-card-hover p-5 group" custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform" style={{ backgroundColor: `${f.color}15` }}>
                  <f.icon className="w-5 h-5" style={{ color: f.color }} />
                </div>
                <h3 className="font-display font-bold text-sm md:text-base mb-1">{f.title}</h3>
                <p className="text-muted-foreground text-xs md:text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* COURSES */}
      {dbCourses.length > 0 && (
        <section className="py-12 px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-2xl">Mashhur <span className="gradient-text">kurslar</span></h2>
              <Link href="/explore/courses" className="btn-ghost text-xs py-1.5 px-4">Barchasi <ChevronRight className="w-4 h-4 inline" /></Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dbCourses.map((c, i) => (
                <motion.div key={c.id} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                  <Link href={user ? `/courses/${c.slug}` : "/login"} className="glass-card-hover p-4 block group">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-neon-purple/10 flex items-center justify-center text-lg flex-shrink-0">{catEmoji[c.category] || "📚"}</div>
                      <div className="min-w-0"><h3 className="font-display font-bold text-sm truncate group-hover:text-neon-purple transition-colors">{c.title}</h3>
                        <p className="text-[10px] text-muted-foreground">{c.total_topics} mavzu · {c.total_enrolled} talaba</p></div>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{c.description}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="py-12 px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display font-bold text-2xl text-center mb-6">Talabalar <span className="gradient-text">fikrlari</span></h2>
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div key={tIdx} className="glass-card p-6 md:p-8 text-center" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3 }}>
                  <Quote className="w-8 h-8 text-neon-purple/20 mx-auto mb-3" />
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-4 italic">&ldquo;{testimonials[tIdx].text}&rdquo;</p>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-hero-gradient flex items-center justify-center text-white font-bold text-xs">{getInitials(testimonials[tIdx].full_name)}</div>
                    <div className="text-left"><p className="font-semibold text-xs">{testimonials[tIdx].full_name}</p>
                      <div className="flex gap-0.5">{Array.from({ length: testimonials[tIdx].rating }).map((_, i) => <Star key={i} className="w-2.5 h-2.5 text-neon-yellow fill-neon-yellow" />)}</div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
              {testimonials.length > 1 && (
                <div className="flex justify-center gap-1.5 mt-3">{testimonials.map((_, i) => <button key={i} onClick={() => setTIdx(i)} className={`w-1.5 h-1.5 rounded-full transition-all ${i === tIdx ? "bg-neon-purple w-4" : "bg-surface"}`} />)}</div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-12 px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl bg-hero-gradient p-8 md:p-12 text-center">
            <Zap className="w-12 h-12 text-white/90 mx-auto mb-4" />
            <h2 className="font-display font-bold text-xl md:text-3xl text-white mb-3">Dasturlash sayohatingizni boshlang</h2>
            <p className="text-white/80 text-sm max-w-md mx-auto mb-6">100 ta bepul coin, AI yordamchi va kurslar sizni kutmoqda.</p>
            <Link href={user ? dUrl : "/register"} className="inline-flex items-center gap-2 bg-white text-neon-purple font-display font-bold px-8 py-3 rounded-full hover:bg-white/90 transition-all shadow-lg text-sm">
              {user ? "Dashboard" : "Boshlash"} <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border py-8 px-4 md:px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2"><div className="w-7 h-7 rounded-lg bg-hero-gradient flex items-center justify-center"><Code2 className="w-3.5 h-3.5 text-white" /></div><span className="font-display font-bold">EduCode</span></div>
          <div className="flex items-center gap-4 flex-wrap justify-center">{navLinks.map(l => <Link key={l.href} href={l.href} className="text-xs text-muted-foreground hover:text-foreground">{l.label}</Link>)}</div>
          <p className="text-xs text-muted-foreground">© 2026 EduCode</p>
        </div>
      </footer>
    </div>
  );
}
