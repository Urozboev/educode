"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "@/components/i18n/Link";
import { createClient } from "@/lib/supabase/client";
import { getInitials } from "@/lib/utils";
import { useTheme } from "next-themes";
import {
  Code2, Brain, Binary, BookOpen, Monitor, ArrowRight, ArrowUpRight,
  LayoutDashboard, LogOut, Menu, X, Star, Moon, Sun, Plus, Clock, ChevronDown, Users,
} from "lucide-react";
import { LanguageLogo } from "@/components/icons/LanguageLogo";
import { OrganizationJsonLd, WebsiteJsonLd, FaqJsonLd } from "@/components/seo/JsonLd";
import { primaryLinks, resourceLinks, tailLinks, allGuestLinks } from "@/lib/nav";
import { useI18n } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import type { Dictionary } from "@/lib/i18n/dictionaries/uz";
import { BrandMark } from "@/components/brand/BrandMark";
import HomeGuideSection from "@/components/guide/HomeGuideSection";
import HomeHero from "@/components/home/HomeHero";
import HomeFeatures from "@/components/home/HomeFeatures";
import MobileNavSheet from "@/components/nav/MobileNavSheet";
import { handFont } from "@/components/home/fonts";

/* ============ FAQ (JSON-LD savollariga mos ko'rinadigan qism) ============ */
/** Savol-javob matni lug'atda — JSON-LD ham shu manbadan oziqlanadi */
const FAQ_ITEMS = (t: Dictionary) => [
  { q: t.home.faq1q, a: t.home.faq1a },
  { q: t.home.faq2q, a: t.home.faq2a },
  { q: t.home.faq3q, a: t.home.faq3a },
  { q: t.home.faq4q, a: t.home.faq4a },
  { q: t.home.faq5q, a: t.home.faq5a },
];

function FaqSection() {
  const { t } = useI18n();
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="py-20 md:py-24 px-5">
      <div className="max-w-6xl mx-auto grid md:grid-cols-[1fr,1.6fr] gap-10 md:gap-16">
        <h2 className="font-display font-extrabold text-4xl md:text-5xl tracking-[-0.04em] leading-[0.95] md:sticky md:top-28 self-start">
          {t.home.faqTitle}
        </h2>
        <div className="divide-y divide-border border-y border-border">
          {FAQ_ITEMS(t).map((item, i) => (
            <div key={i}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                className="w-full flex items-center justify-between gap-6 py-5 text-left"
              >
                <span className="font-display font-semibold text-base md:text-lg">{item.q}</span>
                <span className={`w-8 h-8 rounded-full border flex items-center justify-center flex-shrink-0 transition-transform ${open === i ? "rotate-45 bg-foreground text-background border-foreground" : "border-border"}`}>
                  <Plus className="w-4 h-4" />
                </span>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    className="overflow-hidden"
                  >
                    <p className="pb-6 pr-12 text-[0.95rem] md:text-base text-foreground/70 leading-relaxed">{item.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function LandingPage() {
  const supabase = createClient();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<{ name: string; avatar: string | null; role: string } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const closeMobileNav = useCallback(() => setMobileNav(false), []);
  const { t } = useI18n();
  const nav = primaryLinks(t);
  const navResources = resourceLinks(t);
  const navTail = tailLinks(t);
  const navAll = allGuestLinks(t);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [stats, setStats] = useState({ users: 0, courses: 0, challenges: 0, submissions: 0 });
  const [courses, setCourses] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [tIdx, setTIdx] = useState(0);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    // Statistika, kurslar va testimonial'lar — bitta cache'langan endpoint
    // (avval 6 ta alohida Supabase roundtrip edi)
    fetch("/api/public/home")
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (!d) return;
        if (d.stats) setStats(d.stats);
        if (d.courses) setCourses(d.courses);
        if (d.testimonials) setTestimonials(d.testimonials);
      })
      .catch(() => {});

    // Auth holati alohida (sessiyaga bog'liq — cache qilinmaydi)
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: p } = await supabase.from("profiles").select("full_name, avatar_url, role").eq("id", session.user.id).single();
        if (p) setUser({ name: p.full_name, avatar: p.avatar_url, role: p.role });
      }
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

  async function handleLogout() { await supabase.auth.signOut(); document.cookie = "user-role=; path=/; max-age=0"; setUser(null); setMenuOpen(false); }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <OrganizationJsonLd />
      <WebsiteJsonLd />
      <FaqJsonLd
        items={[
          {
            question: t.home.faq1q,
            answer: t.home.faq1a,
          },
          {
            question: t.home.faq2q,
            answer: t.home.faq2a,
          },
          {
            question: t.home.faq3q,
            answer: t.home.faq3a,
          },
          {
            question: t.home.faq4q,
            answer: t.home.faq4a,
          },
          {
            question: t.home.faq5q,
            answer: t.home.faq5a,
          },
        ]}
      />

      {/* ========== NAVBAR ========== */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-2xl border-b border-border/40">
        {/* Kenglik explore va kabinet navbar'lari bilan bir xil (max-w-7xl) — 6xl da menyu sig'mas edi */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-hero-gradient flex items-center justify-center shadow-lg shadow-neon-purple/20 group-hover:shadow-neon-purple/40 transition-shadow">
              <BrandMark className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">Mir<span className="gradient-text">Academy</span></span>
          </Link>

          {/* Menyu explore layout'idagi bilan bir xil — manba: lib/nav.ts */}
          <div className="hidden xl:flex items-center gap-1">
            {nav.map(l => (
              <Link key={l.href} href={l.href} className="px-3 py-2 rounded-lg text-[0.9rem] whitespace-nowrap text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all">{l.label}</Link>
            ))}

            <div
              className="relative"
              onMouseEnter={() => setResourcesOpen(true)}
              onMouseLeave={() => setResourcesOpen(false)}
            >
              <button
                onClick={() => setResourcesOpen(o => !o)}
                aria-expanded={resourcesOpen}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-[0.9rem] whitespace-nowrap text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all"
              >
                {t.nav.resources}
                <ChevronDown className={`w-4 h-4 transition-transform ${resourcesOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {resourcesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full pt-2 w-64"
                  >
                    <div className="rounded-xl border border-border bg-card shadow-lift p-1.5">
                      {navResources.map(r => (
                        <Link
                          key={r.href}
                          href={r.href}
                          onClick={() => setResourcesOpen(false)}
                          className="block px-3 py-2.5 rounded-lg hover:bg-accent transition-colors"
                        >
                          <span className="block text-sm font-medium">{r.label}</span>
                          <span className="block text-[11px] text-muted-foreground mt-0.5">{r.hint}</span>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {navTail.map(l => (
              <Link key={l.href} href={l.href} className="px-3 py-2 rounded-lg text-[0.9rem] whitespace-nowrap text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all">{l.label}</Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <LanguageSwitcher compact />

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
                    <Link href={dUrl} onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm hover:bg-accent transition-colors"><LayoutDashboard className="w-4 h-4 text-muted-foreground" /> {t.nav.dashboard}</Link>
                    <button onClick={handleLogout} className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-neon-red hover:bg-neon-red/8 w-full transition-colors"><LogOut className="w-4 h-4" /> {t.nav.logout}</button>
                  </div>
                </>)}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/login" className="px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all">{t.nav.login}</Link>
                <Link href="/register" className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-foreground text-background hover:opacity-90 transition-all">{t.nav.register}</Link>
              </div>
            )}

            <button onClick={() => setMobileNav(!mobileNav)} aria-expanded={mobileNav} aria-controls="mobile-nav" aria-label="Menu" className="xl:hidden p-2.5 hover:bg-accent rounded-xl">
              {mobileNav ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

      </nav>

      {/* Mobil menyu — navbar'dan TASHQARIDA (sabab komponent izohida) */}
      <MobileNavSheet open={mobileNav} onClose={closeMobileNav} dashboardHref={user ? dUrl : null} pathname="/" />

      {/* ========== HERO — daftar varag'i ========== */}
      <HomeHero
        ctaHref={user ? dUrl : "/register"}
        ctaLabel={user ? t.nav.dashboard : t.landing.ctaStart}
        stats={stats}
        course={courses[0]}
        people={testimonials.map((x) => x.full_name).filter(Boolean)}
      />

      {/* ========== YO'RIQNOMA — tanishtiruv videosi va mavzular ========== */}
      <HomeGuideSection />

      {/* ========== IMKONIYATLAR — lenta bilan yopishtirilgan kartochkalar ========== */}
      <HomeFeatures />

      {/* ========== COURSES ========== */}
      {courses.length > 0 && (
        <section className="py-20 md:py-24 px-5 border-t border-border/60">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between gap-6 mb-10">
              <h2 className="font-display font-extrabold text-4xl md:text-5xl tracking-[-0.04em] leading-[0.95]">{t.landing.coursesTitle}</h2>
              <Link href="/explore/courses" className="hidden md:inline-flex items-center gap-1.5 text-[0.95rem] font-semibold underline decoration-2 underline-offset-[6px] decoration-neon-purple/50 hover:decoration-neon-purple">
                {t.home.allCourses} <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {courses.map((c) => (
                <Link
                  key={c.id}
                  href={`/courses/${c.slug}`}
                  className="group flex flex-col h-full rounded-2xl border border-border bg-card p-3 hover:border-foreground/25 transition-colors"
                >
                  <div className="relative h-44 rounded-xl overflow-hidden bg-surface">
                    {c.thumbnail_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={c.thumbnail_url} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <div className="absolute inset-0 hatch flex items-center justify-center">
                        <span className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center shadow-sm">
                          {categoryIcon(c.category, 30)}
                        </span>
                      </div>
                    )}
                    <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-card/95 ${c.is_free ? "text-neon-green" : "text-neon-yellow"}`}>
                      {c.is_free ? t.landing.free : `${c.price_coins} coin`}
                    </span>
                    {/* Reyting: baho bo'lmasa "Yangi" — 0.0 yulduz kursni yomon ko'rsatadi */}
                    <span className="absolute top-3 right-3 inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-card/95">
                      {Number(c.rating_count) > 0 ? (
                        <>
                          <Star className="w-3.5 h-3.5 text-neon-yellow fill-neon-yellow" />
                          {Number(c.average_rating).toFixed(1)}
                          <span className="font-normal text-muted-foreground">({c.rating_count})</span>
                        </>
                      ) : (
                        <span className="text-neon-purple">{t.landing.newCourse}</span>
                      )}
                    </span>
                  </div>

                  <div className="flex flex-col flex-1 px-2 pt-4 pb-2">
                    <h3 className="font-display font-bold text-lg leading-snug mb-1.5 line-clamp-2">{c.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{c.description}</p>
                    <div className="flex-1" />
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{c.estimated_hours ? `${c.estimated_hours} ${t.landing.hours}` : "—"}</span>
                        <span className="inline-flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" />{c.total_topics} {t.landing.lessons}</span>
                        <span className="inline-flex items-center gap-1" title={t.landing.studentsLabel}><Users className="w-3.5 h-3.5" />{Number(c.total_enrolled || 0).toLocaleString("ru-RU")}</span>
                      </span>
                      <span className="w-9 h-9 rounded-full border border-border flex items-center justify-center transition-colors group-hover:bg-foreground group-hover:text-background">
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-8 md:hidden">
              <Link href="/explore/courses" className="inline-flex items-center gap-1.5 font-semibold underline decoration-2 underline-offset-[6px] decoration-neon-purple/50">{t.home.allCourses} <ArrowUpRight className="w-4 h-4" /></Link>
            </div>
          </div>
        </section>
      )}

      {/* ========== QANDAY BOSHLANADI — qadamlar haqiqiy ketma-ketlik ========== */}
      <section className={`py-20 md:py-24 px-5 border-t border-border/60 ${handFont.variable}`}>
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display font-extrabold text-4xl md:text-5xl tracking-[-0.04em] leading-[0.95] mb-14 max-w-xl">{t.landing.stepsTitle}</h2>
          <ol className="grid md:grid-cols-4 gap-10 md:gap-8">
            {[
              { title: t.home.steps.signupTitle, desc: t.home.steps.signupText },
              { title: t.home.steps.levelTitle, desc: t.home.steps.levelText },
              { title: t.home.steps.learnTitle, desc: t.home.steps.learnText },
              { title: t.home.steps.certTitle, desc: t.home.steps.certText },
            ].map((s, i) => (
              <li key={s.title} className="relative">
                <span className="hand block text-6xl text-neon-purple mb-3 -rotate-3 origin-left" aria-hidden>{i + 1}</span>
                <h3 className="font-display font-bold text-lg mb-2">{s.title}</h3>
                <p className="text-[0.95rem] text-foreground/70 leading-relaxed">{s.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ========== TESTIMONIALS ========== */}
      {testimonials.length > 0 && (
        <section className="py-20 md:py-24 px-5 border-t border-border/60">
          <div className="max-w-4xl mx-auto">
            <h2 className="sr-only">{t.home.testimonials}</h2>
            <div className="relative min-h-[170px] md:min-h-[220px]">
              <AnimatePresence mode="wait">
                <motion.figure key={tIdx}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  <blockquote className="font-display font-semibold text-2xl md:text-[2.1rem] leading-[1.3] tracking-[-0.02em]">
                    &ldquo;{testimonials[tIdx].text}&rdquo;
                  </blockquote>
                  <figcaption className="mt-8 flex items-center gap-3">
                    <span className="w-11 h-11 rounded-full bg-neon-purple text-white flex items-center justify-center font-bold text-sm">
                      {getInitials(testimonials[tIdx].full_name)}
                    </span>
                    <span>
                      <span className="block font-semibold">{testimonials[tIdx].full_name}</span>
                      <span className="flex gap-0.5 mt-0.5">{Array.from({ length: testimonials[tIdx].rating }).map((_, i) => <Star key={i} className="w-3.5 h-3.5 text-neon-yellow fill-neon-yellow" />)}</span>
                    </span>
                  </figcaption>
                </motion.figure>
              </AnimatePresence>
            </div>
            {testimonials.length > 1 && (
              <div className="flex mt-6 -ml-1.5">
                {/*
                  Tugma o'zi — bosish uchun katta, shaffof maydon (telefonda
                  globals.css tugmalarga min-height: 40px beradi). Ko'rinadigan
                  ingichka chiziq — ichidagi span.
                */}
                {testimonials.map((_, i) => (
                  <button key={i} onClick={() => setTIdx(i)} aria-label={`${i + 1}`} aria-current={i === tIdx}
                    className="group flex items-center h-10 px-1.5">
                    <span className={`block h-1.5 rounded-full transition-all duration-300 ${i === tIdx ? "bg-foreground w-8" : "bg-border w-3 group-hover:bg-foreground/40"}`} />
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ========== FAQ ========== */}
      <div className="border-t border-border/60"><FaqSection /></div>

      {/* ========== CTA — daftar muqovasi ========== */}
      <section className={`px-3 md:px-5 pb-16 ${handFont.variable}`}>
        <div className="relative max-w-7xl mx-auto rounded-[2rem] md:rounded-[2.25rem] bg-foreground text-background overflow-hidden px-6 md:px-16 py-14 md:py-20">
          <div className="absolute inset-y-0 left-8 md:left-12 w-px bg-neon-red/50" aria-hidden />
          <div className="relative grid md:grid-cols-[1.4fr,1fr] gap-10 items-end pl-6 md:pl-8">
            <div>
              <h2 className="font-display font-extrabold text-4xl md:text-6xl tracking-[-0.045em] leading-[0.95] mb-6">{t.landing.ctaTitle}</h2>
              <p className="text-lg text-background/70 leading-relaxed max-w-xl">{t.landing.ctaText}</p>
            </div>
            <div className="flex flex-col items-start md:items-end gap-4">
              <Link href={user ? dUrl : "/register"}
                className="group inline-flex items-center gap-3 pl-6 pr-1.5 py-1.5 rounded-full bg-background text-foreground font-display font-semibold">
                {user ? t.nav.dashboard : t.landing.ctaStart}
                <span className="w-11 h-11 rounded-full bg-foreground text-background flex items-center justify-center transition-transform group-hover:rotate-45">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </Link>
              <span className="hand text-2xl text-background/60 -rotate-2">{t.landing.ctaNote}</span>
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
                <div className="w-8 h-8 rounded-lg bg-hero-gradient flex items-center justify-center"><BrandMark className="w-4 h-4 text-white" /></div>
                <span className="font-display font-bold text-lg">MirAcademy</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                {t.home.footerAbout2}
              </p>
              {/* Brend nomining boshqa yozilish shakllari — qidiruv tizimlari
                  ularni bitta brendga bog'lashi uchun tabiiy matnda ham
                  uchrashi kerak (JsonLd dagi alternateName ni to'ldiradi). */}
              <p className="text-xs text-muted-foreground/70 leading-relaxed max-w-sm mt-2">
                {t.home.footerBrandAliases}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">{t.home.footerPlatform}</h4>
              <div className="space-y-2">
                {navAll.map(l => <Link key={l.href} href={l.href} className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{l.label}</Link>)}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">{t.footer.resources}</h4>
              <div className="space-y-2">
                <Link href={user ? dUrl : "/register"} className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{t.nav.register}</Link>
                <Link href="/explore/about" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{t.home.footerAbout}</Link>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">© 2026 MirAcademy. {t.home.footerRights}.</p>
            <p className="text-xs text-muted-foreground">
              <a href="https://t.me/MirjalolUrozboev">MirjalolUrozboev</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
