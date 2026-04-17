"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { getInitials, formatNumber } from "@/lib/utils";
import { useTheme } from "next-themes";
import {
  Code2, Brain, Trophy, Gamepad2, Users, ChevronRight, ChevronLeft,
  BookOpen, Terminal, Shield, Globe, ArrowRight, ArrowUpRight,
  LayoutDashboard, LogOut, Menu, X, Star, Quote, Moon, Sun,
  Sparkles, Play, CheckCircle2, GraduationCap, MessageCircle,
  Cpu, Layers, Binary, Zap, Monitor
} from "lucide-react";
import { LanguageLogo } from "@/components/icons/LanguageLogo";

const fadeUp = (delay = 0) => ({ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] } } });
const stagger = { visible: { transition: { staggerChildren: 0.08 } } };

export default function LandingPage() {
  const supabase = createClient();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<{ name: string; avatar: string | null; role: string } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [stats, setStats] = useState({ users: 0, courses: 0, challenges: 0, submissions: 0 });
  const [courses, setCourses] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [tIdx, setTIdx] = useState(0);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: p } = await supabase.from("profiles").select("full_name, avatar_url, role").eq("id", session.user.id).single();
        if (p) setUser({ name: p.full_name, avatar: p.avatar_url, role: p.role });
      }
      const [u, c, ch, s] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("courses").select("*", { count: "exact", head: true }).eq("is_published", true),
        supabase.from("challenges").select("*", { count: "exact", head: true }).eq("is_published", true),
        supabase.from("submissions").select("*", { count: "exact", head: true }),
      ]);
      setStats({ users: u.count || 0, courses: c.count || 0, challenges: ch.count || 0, submissions: s.count || 0 });
      const { data: co } = await supabase.from("courses").select("id,title,slug,description,category,total_topics,total_enrolled,is_free,price_coins,difficulty").eq("is_published", true).order("order_index").limit(6);
      if (co) setCourses(co);
      const { data: t } = await supabase.from("testimonials").select("*").eq("is_approved", true).order("created_at", { ascending: false }).limit(10);
      if (t) setTestimonials(t);
    })();
  }, []);

  useEffect(() => { if (testimonials.length <= 1) return; const t = setInterval(() => setTIdx(i => (i + 1) % testimonials.length), 6000); return () => clearInterval(t); }, [testimonials.length]);

  const dUrl = user?.role === "admin" ? "/a-dashboard" : user?.role === "teacher" ? "/t-dashboard" : "/dashboard";
  const categoryIcon = (cat: string, size = 22) => {
    const key = (cat || "").toLowerCase();
    if (key === "python") return <LanguageLogo lang="python" size={size} />;
    if (key === "frontend") return <LanguageLogo lang="react" size={size} />;
    if (key === "programming") return <Code2 className="text-neon-purple" style={{ width: size, height: size }} />;
    if (key === "computer_literacy") return <Monitor className="text-neon-blue" style={{ width: size, height: size }} />;
    if (key === "prompt_engineering") return <Brain className="text-neon-pink" style={{ width: size, height: size }} />;
    if (key === "algorithms") return <Binary className="text-neon-green" style={{ width: size, height: size }} />;
    return <BookOpen className="text-muted-foreground" style={{ width: size, height: size }} />;
  };
  const navLinks = [
    { href: "/explore/courses", label: "Kurslar" },
    { href: "/explore/challenges", label: "Topshiriqlar" },
    { href: "/playground", label: "Playground" },
    { href: "/explore/games", label: "O'yinlar" },
    { href: "/explore/about", label: "Tizim haqida" },
  ];

  async function handleLogout() { await supabase.auth.signOut(); document.cookie = "user-role=; path=/; max-age=0"; setUser(null); setMenuOpen(false); }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">

      {/* ========== NAVBAR ========== */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-2xl border-b border-border/40">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-hero-gradient flex items-center justify-center shadow-lg shadow-neon-purple/20 group-hover:shadow-neon-purple/40 transition-shadow">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">Edu<span className="gradient-text">Code</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(l => (
              <Link key={l.href} href={l.href} className="px-4 py-2 rounded-lg text-[0.9rem] text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all">{l.label}</Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {mounted && (
              <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="p-2.5 hover:bg-accent rounded-xl text-muted-foreground transition-colors">
                {theme === "dark" ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
              </button>
            )}

            {user ? (
              <div className="relative">
                <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-surface hover:bg-surface-hover border border-border/60 transition-all">
                  <div className="w-7 h-7 rounded-full bg-hero-gradient flex items-center justify-center text-white font-bold text-[10px]">
                    {user.avatar ? <img src={user.avatar} alt="" className="w-full h-full rounded-full object-cover" /> : getInitials(user.name)}
                  </div>
                  <span className="text-sm font-medium hidden sm:block">{user.name.split(" ")[0]}</span>
                </button>
                {menuOpen && (<>
                  <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 top-12 w-52 glass-card p-1.5 shadow-2xl z-50 border border-border/60">
                    <Link href={dUrl} onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm hover:bg-accent transition-colors"><LayoutDashboard className="w-4 h-4 text-muted-foreground" /> Dashboard</Link>
                    <button onClick={handleLogout} className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-neon-red hover:bg-neon-red/8 w-full transition-colors"><LogOut className="w-4 h-4" /> Chiqish</button>
                  </div>
                </>)}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/login" className="px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all">Kirish</Link>
                <Link href="/register" className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-foreground text-background hover:opacity-90 transition-all">Boshlash</Link>
              </div>
            )}

            <button onClick={() => setMobileNav(!mobileNav)} className="md:hidden p-2.5 hover:bg-accent rounded-xl">
              {mobileNav ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>{mobileNav && (
          <motion.div className="md:hidden bg-card/95 backdrop-blur-xl border-b border-border px-5 py-4 space-y-1"
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
            {navLinks.map(l => <Link key={l.href} href={l.href} onClick={() => setMobileNav(false)} className="block py-3 px-3 rounded-xl text-[0.95rem] hover:bg-accent/50 transition-colors">{l.label}</Link>)}
            {!user && (
              <div className="flex gap-2 pt-3 mt-2 border-t border-border">
                <Link href="/login" onClick={() => setMobileNav(false)} className="flex-1 text-center py-2.5 rounded-xl text-sm font-medium bg-surface hover:bg-surface-hover border border-border transition-all">Kirish</Link>
                <Link href="/register" onClick={() => setMobileNav(false)} className="flex-1 text-center py-2.5 rounded-xl text-sm font-semibold bg-foreground text-background hover:opacity-90 transition-all">Boshlash</Link>
              </div>
            )}
          </motion.div>
        )}</AnimatePresence>
      </nav>

      {/* ========== HERO ========== */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 px-5 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-24 left-[15%] w-[500px] h-[500px] bg-neon-purple/[0.04] rounded-full blur-[120px]" />
          <div className="absolute top-32 right-[10%] w-[400px] h-[400px] bg-neon-blue/[0.04] rounded-full blur-[100px]" />
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left — Text */}
            <motion.div initial="hidden" animate="visible" variants={stagger}>
              <motion.div variants={fadeUp(0)} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neon-purple/8 border border-neon-purple/15 text-neon-purple text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" /> Raqamli intellektual ta'lim platformasi
              </motion.div>

              <motion.h1 variants={fadeUp(0.05)} className="font-display font-extrabold text-4xl md:text-[3.5rem] leading-[1.1] tracking-tight mb-5">
                Dasturlashni<br />
                <span className="gradient-text">zamonaviy usulda</span> o'rganing
              </motion.h1>

              <motion.p variants={fadeUp(0.1)} className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg mb-8">
                Interaktiv kurslar, AI feedback, gamifikatsiya va professional kod muharriri — barchasi bitta platformada.
              </motion.p>

              <motion.div variants={fadeUp(0.15)} className="flex flex-wrap items-center gap-3">
                <Link href={user ? dUrl : "/register"} className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-foreground text-background font-display font-bold text-[0.95rem] hover:opacity-90 transition-all shadow-lg shadow-foreground/10">
                  {user ? "Dashboard" : "Bepul boshlash"} <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/explore/courses" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-border bg-surface/50 hover:bg-surface font-medium text-[0.95rem] transition-all">
                  <Play className="w-4 h-4" /> Kurslarni ko'rish
                </Link>
              </motion.div>

              <motion.div variants={fadeUp(0.2)} className="flex items-center gap-6 mt-10 pt-8 border-t border-border/40">
                {[
                  { val: stats.users, label: "Foydalanuvchi" },
                  { val: stats.courses, label: "Kurs" },
                  { val: stats.submissions, label: "Yuborish" },
                ].map(s => (
                  <div key={s.label}>
                    <div className="font-display font-bold text-2xl md:text-3xl">{formatNumber(Number(s.val))}+</div>
                    <div className="text-sm text-muted-foreground">{s.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right — Illustration */}
            <motion.div className="hidden md:block" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}>
              <div className="relative">
                {/* Code editor illustration */}
                <div className="rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm shadow-2xl shadow-black/10 overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-surface/50">
                    <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-neon-red/50" /><div className="w-3 h-3 rounded-full bg-neon-yellow/50" /><div className="w-3 h-3 rounded-full bg-neon-green/50" /></div>
                    <span className="text-xs font-mono text-muted-foreground ml-2">main.py</span>
                    <div className="ml-auto flex items-center gap-1.5"><span className="text-[10px] px-2 py-0.5 rounded-full bg-neon-green/10 text-neon-green">Python ✓</span></div>
                  </div>
                  <div className="p-5 font-mono text-sm leading-7">
                    <div><span className="text-neon-purple">def</span> <span className="text-neon-blue">salom</span>(ism):</div>
                    <div className="pl-6"><span className="text-neon-purple">return</span> <span className="text-neon-green">f&quot;Salom, {'{'}ism{'}'}!&quot;</span></div>
                    <div className="mt-2"><span className="text-muted-foreground"># AI yordamchi tahlil qiladi</span></div>
                    <div>natija = salom(<span className="text-neon-yellow">&quot;Talaba&quot;</span>)</div>
                    <div><span className="text-neon-blue">print</span>(natija)</div>
                  </div>
                  <div className="px-5 py-3 border-t border-border/50 bg-neon-green/5">
                    <div className="flex items-center gap-2 text-sm text-neon-green"><CheckCircle2 className="w-4 h-4" /> <span className="font-mono">Salom, Talaba!</span></div>
                  </div>
                </div>

                {/* Floating badges */}
                <motion.div className="absolute -top-3 -right-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neon-yellow/10 border border-neon-yellow/20 text-neon-yellow text-xs font-bold shadow-lg"
                  animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                  <Trophy className="w-3.5 h-3.5" /> +50 XP
                </motion.div>
                <motion.div className="absolute -bottom-3 -left-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neon-blue/10 border border-neon-blue/20 text-neon-blue text-xs font-bold shadow-lg"
                  animate={{ y: [0, 6, 0] }} transition={{ duration: 3.5, repeat: Infinity }}>
                  <Brain className="w-3.5 h-3.5" /> AI Tahlil
                </motion.div>
                <motion.div className="absolute top-1/2 -right-6 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neon-green/10 border border-neon-green/20 text-neon-green text-xs font-bold shadow-lg"
                  animate={{ y: [0, -4, 0] }} transition={{ duration: 2.8, repeat: Infinity }}>
                  <CheckCircle2 className="w-3.5 h-3.5" /> 4/4 test
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========== FEATURES ========== */}
      <section className="py-20 px-5 border-t border-border/30">
        <div className="max-w-6xl mx-auto">
          <motion.div className="max-w-2xl mb-14" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.p variants={fadeUp()} className="text-sm font-semibold text-neon-purple uppercase tracking-widest mb-3">Imkoniyatlar</motion.p>
            <motion.h2 variants={fadeUp(0.05)} className="font-display font-bold text-3xl md:text-4xl tracking-tight mb-4">
              Nima uchun <span className="gradient-text">EduCode</span>?
            </motion.h2>
            <motion.p variants={fadeUp(0.1)} className="text-muted-foreground text-lg">
              Platformamiz zamonaviy ta'lim yondashuvlarini birlashtirib, o'rganishni samarali va qiziqarli qiladi.
            </motion.p>
          </motion.div>

          <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            {[
              { icon: Code2, title: "Interaktiv kod muharriri", desc: "Monaco Editor (VS Code asosi) bilan brauzerda kod yozing. Python va JavaScript to'liq qo'llab-quvvatlanadi.", color: "#6C5CE7" },
              { icon: Brain, title: "Sun'iy intellekt yordamchi", desc: "Claude AI kodingizni tahlil qiladi. Gemini chatbot IT savollariga javob beradi. 24/7 tezkor feedback.", color: "#00D2FF" },
              { icon: Trophy, title: "Gamifikatsiya tizimi", desc: "Coin va XP yig'ing, reytingda o'rningizni oshiring, do'kondan sovg'alar oling.", color: "#FFD600" },
              { icon: Gamepad2, title: "6 ta interaktiv o'yin", desc: "Code Puzzle, Bug Fix, Maze Runner, Code Bird — o'ynab o'rganing.", color: "#00E676" },
              { icon: GraduationCap, title: "Sertifikatlash", desc: "Kursni tugatib professional sertifikat oling. PNG va chop etish.", color: "#FF6B9D" },
              { icon: Terminal, title: "Playground", desc: "Python, C++, Java, C#, JavaScript, HTML — 7 ta tilda kod yozing.", color: "#FF5252" },
            ].map((f, i) => (
              <motion.div key={f.title} variants={fadeUp(i * 0.05)} className="group p-6 rounded-2xl border border-border/50 bg-card/30 hover:bg-card/60 hover:border-border hover:shadow-lg hover:shadow-black/[0.03] transition-all duration-300">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${f.color}10`, border: `1px solid ${f.color}20` }}>
                  <f.icon className="w-5 h-5" style={{ color: f.color }} />
                </div>
                <h3 className="font-display font-bold text-lg mb-2 group-hover:text-foreground transition-colors">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ========== COURSES ========== */}
      {courses.length > 0 && (
        <section className="py-20 px-5 bg-surface/30 border-t border-border/30">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-sm font-semibold text-neon-purple uppercase tracking-widest mb-3">Kurslar</p>
                <h2 className="font-display font-bold text-3xl tracking-tight">Mashhur kurslar</h2>
              </div>
              <Link href="/explore/courses" className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Barcha kurslar <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {courses.map((c, i) => (
                <motion.div key={c.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp(i * 0.05)}>
                  <Link href={user ? `/courses/${c.slug}` : "/login"} className="block group p-5 rounded-2xl border border-border/50 bg-card/50 hover:bg-card hover:border-border hover:shadow-lg hover:shadow-black/[0.03] transition-all duration-300">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-11 h-11 rounded-xl bg-surface flex items-center justify-center border border-border/50">{categoryIcon(c.category, 22)}</div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-display font-bold truncate group-hover:text-neon-purple transition-colors">{c.title}</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-muted-foreground">{c.total_topics} mavzu</span>
                          <span className="text-xs text-muted-foreground">·</span>
                          <span className="text-xs text-muted-foreground">{c.total_enrolled} talaba</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{c.description}</p>
                    <div className="flex items-center justify-between">
                      {c.is_free
                        ? <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-neon-green/8 text-neon-green border border-neon-green/15">Bepul</span>
                        : <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-neon-yellow/8 text-neon-yellow border border-neon-yellow/15">{c.price_coins} coin</span>}
                      <ArrowUpRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-neon-purple group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 md:hidden text-center">
              <Link href="/explore/courses" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">Barcha kurslar <ArrowUpRight className="w-4 h-4" /></Link>
            </div>
          </div>
        </section>
      )}

      {/* ========== HOW IT WORKS ========== */}
      <section className="py-20 px-5 border-t border-border/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-neon-purple uppercase tracking-widest mb-3">Jarayon</p>
            <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight">Qanday ishlaydi?</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Ro'yxatdan o'ting", desc: "Email yoki Google orqali. Bepul 100 coin beriladi.", icon: Users, color: "#6C5CE7" },
              { step: "02", title: "Darajangizni bilin", desc: "AI testi bilim darajangizni aniqlaydi va mos kurs tavsiya etadi.", icon: Brain, color: "#00D2FF" },
              { step: "03", title: "O'rganing va bajarin", desc: "Ma'ruzalar, testlar, amaliy topshiriqlar va o'yinlar orqali.", icon: Code2, color: "#00E676" },
              { step: "04", title: "Sertifikat oling", desc: "Kursni tugatib, professional sertifikat va sovg'alar oling.", icon: GraduationCap, color: "#FFD600" },
            ].map((s, i) => (
              <motion.div key={s.step} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp(i * 0.08)} className="relative">
                {i < 3 && <div className="hidden md:block absolute top-10 left-[calc(100%_-_12px)] w-[calc(100%_-_48px)] h-[1px] bg-border/60" />}
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${s.color}10`, border: `1px solid ${s.color}20` }}>
                  <s.icon className="w-5 h-5" style={{ color: s.color }} />
                </div>
                <div className="text-xs font-mono text-muted-foreground/40 mb-1">{s.step}</div>
                <h3 className="font-display font-bold mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== TESTIMONIALS ========== */}
      {testimonials.length > 0 && (
        <section className="py-20 px-5 bg-surface/30 border-t border-border/30">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-sm font-semibold text-neon-purple uppercase tracking-widest mb-3">Izohlar</p>
              <h2 className="font-display font-bold text-3xl tracking-tight">Talabalar fikrlari</h2>
            </div>

            <div className="relative min-h-[180px]">
              <AnimatePresence mode="wait">
                <motion.div key={tIdx} className="p-8 md:p-10 rounded-2xl border border-border/50 bg-card/50 text-center"
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
                  <Quote className="w-8 h-8 text-neon-purple/15 mx-auto mb-4" />
                  <p className="text-lg leading-relaxed text-muted-foreground mb-6 italic max-w-xl mx-auto">
                    &ldquo;{testimonials[tIdx].text}&rdquo;
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-hero-gradient flex items-center justify-center text-white font-bold text-sm shadow-md">
                      {getInitials(testimonials[tIdx].full_name)}
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-sm">{testimonials[tIdx].full_name}</p>
                      <div className="flex gap-0.5">{Array.from({ length: testimonials[tIdx].rating }).map((_, i) => <Star key={i} className="w-3 h-3 text-neon-yellow fill-neon-yellow" />)}</div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {testimonials.length > 1 && (
                <div className="flex justify-center gap-2 mt-5">
                  {testimonials.map((_, i) => (
                    <button key={i} onClick={() => setTIdx(i)} className={`h-1.5 rounded-full transition-all duration-300 ${i === tIdx ? "bg-neon-purple w-6" : "bg-border w-1.5"}`} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ========== CTA ========== */}
      <section className="py-20 px-5 border-t border-border/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-sm font-semibold text-neon-purple uppercase tracking-widest mb-3">Tayyor misiz?</p>
              <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight mb-4">Dasturlash sayohatingizni hoziroq boshlang</h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">Ro'yxatdan o'ting va 100 ta bepul coin, AI yordamchi, professional kurslar va sertifikatlarga ega bo'ling.</p>
              <div className="flex flex-wrap gap-3">
                <Link href={user ? dUrl : "/register"} className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-foreground text-background font-display font-bold text-[0.95rem] hover:opacity-90 transition-all shadow-lg shadow-foreground/10">
                  {user ? "Dashboard" : "Bepul boshlash"} <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/playground" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-border bg-surface/50 hover:bg-surface font-medium text-[0.95rem] transition-all">
                  <Terminal className="w-4 h-4" /> Playground sinab ko'rish
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: CheckCircle2, text: "7 ta dasturlash tili", color: "#6C5CE7" },
                { icon: Brain, text: "AI kod tahlili", color: "#00D2FF" },
                { icon: Trophy, text: "Coin va sovg'alar", color: "#FFD600" },
                { icon: GraduationCap, text: "Professional sertifikat", color: "#00E676" },
                { icon: Gamepad2, text: "6 ta interaktiv o'yin", color: "#FF6B9D" },
                { icon: Globe, text: "To'liq o'zbek tilida", color: "#FF5252" },
              ].map(f => (
                <div key={f.text} className="flex items-center gap-3 p-3.5 rounded-xl border border-border/40 bg-card/30">
                  <f.icon className="w-5 h-5 flex-shrink-0" style={{ color: f.color }} />
                  <span className="text-sm font-medium">{f.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="border-t border-border/40 py-12 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-lg bg-hero-gradient flex items-center justify-center"><Code2 className="w-4 h-4 text-white" /></div>
                <span className="font-display font-bold text-lg">EduCode</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                Raqamli intellektual ta'lim platformasi. Dasturlash tillarini interaktiv kurslar, AI yordamchi va gamifikatsiya orqali o'rganing.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Platforma</h4>
              <div className="space-y-2">
                {navLinks.map(l => <Link key={l.href} href={l.href} className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{l.label}</Link>)}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Resurslar</h4>
              <div className="space-y-2">
                <Link href={user ? dUrl : "/register"} className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Boshlash</Link>
                <Link href="/explore/about" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Loyiha haqida</Link>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">© 2026 EduCode. Barcha huquqlar himoyalangan.</p>
            <p className="text-xs text-muted-foreground">
              <a href="https://t.me/MirjalolUrozboev">MirjalolUrozboev</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
