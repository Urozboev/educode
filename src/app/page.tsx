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
  Cpu, Layers, Binary, Zap, Monitor, Plus
} from "lucide-react";
import { LanguageLogo } from "@/components/icons/LanguageLogo";
import { OrganizationJsonLd, WebsiteJsonLd, FaqJsonLd } from "@/components/seo/JsonLd";

const fadeUp = (delay = 0) => ({ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] } } });
const stagger = { visible: { transition: { staggerChildren: 0.08 } } };

/**
 * Kreativ "spreadsheet" uslubidagi hero mosaic — har bir katak kod/rasm/statistika.
 * Googlesheet.uz hero'dan ilhomlanib, EduCode uchun moslandi.
 * Bitta CSS grid ichida 6 ustun × 6 qator — markazda 2×2 "big" cell.
 */
type MosaicCell =
  | { kind: "empty"; tone?: "plain" | "purple" | "blue" | "green" | "yellow" | "pink" }
  | { kind: "lang"; lang: "python" | "javascript" | "typescript" | "react" | "c++" | "java" | "csharp" | "html" }
  | { kind: "snippet"; text: string; color?: string }
  | { kind: "stat"; value: string; label: string; color: string }
  | { kind: "icon"; Icon: any; color: string; badge?: string }
  | { kind: "progress"; value: number; color: string; label: string }
  | { kind: "check"; label: string };

const TONE_BG: Record<string, string> = {
  plain: "bg-surface/40",
  purple: "bg-neon-purple/[0.08] border-neon-purple/15",
  blue: "bg-neon-blue/[0.08] border-neon-blue/15",
  green: "bg-neon-green/[0.08] border-neon-green/15",
  yellow: "bg-neon-yellow/[0.08] border-neon-yellow/15",
  pink: "bg-neon-pink/[0.08] border-neon-pink/15",
};

function MosaicCellView({ c, delay, idx, active }: { c: MosaicCell; delay: number; idx: number; active: boolean }) {
  const base =
    "relative aspect-square rounded-xl border flex items-center justify-center overflow-hidden transition-all duration-500 hover:scale-[1.06] hover:border-border hover:shadow-lg hover:shadow-black/5 hover:z-10 " +
    (active
      ? "border-neon-purple/50 bg-neon-purple/[0.08] shadow-[0_0_24px_rgba(108,92,231,0.25)] scale-[1.03] z-10"
      : "border-border/50 bg-card/40");

  // Har katak uchun deterministik "tasodifiy" suzish parametrlari
  // (Math.random emas — hydration mos bo'lishi uchun index'dan)
  const floatDur = 3.2 + ((idx * 37) % 17) / 10;      // 3.2s – 4.9s
  const floatDelay = ((idx * 53) % 20) / 10;           // 0 – 2s
  const floatAmp = 2.5 + ((idx * 29) % 3);             // 2.5 – 4.5px

  const inner = (() => {
    switch (c.kind) {
      case "empty":
        return <div className={`w-full h-full ${TONE_BG[c.tone || "plain"]}`} />;
      case "lang":
        return <LanguageLogo lang={c.lang as any} size={28} />;
      case "snippet":
        return (
          <code
            className="text-[10px] md:text-[11px] font-mono font-semibold truncate px-1.5"
            style={{ color: c.color || "currentColor" }}
          >
            {c.text}
            <span className="animate-pulse opacity-70">▍</span>
          </code>
        );
      case "stat":
        return (
          <div className="text-center leading-none">
            <div
              className="font-display font-extrabold text-lg tracking-tight"
              style={{ color: c.color }}
            >
              {c.value}
            </div>
            <div className="text-[9px] font-medium text-muted-foreground mt-0.5">{c.label}</div>
          </div>
        );
      case "icon":
        return (
          <div className="flex flex-col items-center">
            <c.Icon className="w-5 h-5" style={{ color: c.color }} />
            {c.badge && (
              <span className="text-[8px] font-bold mt-1" style={{ color: c.color }}>
                {c.badge}
              </span>
            )}
          </div>
        );
      case "progress":
        return (
          <div className="w-full px-2">
            <div className="text-[9px] font-mono font-semibold mb-1" style={{ color: c.color }}>
              {c.label}
            </div>
            <div className="h-1.5 rounded-full bg-surface overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: c.color }}
                initial={{ width: 0 }}
                animate={{ width: `${c.value}%` }}
                transition={{ duration: 1.2, delay: delay + 0.3 }}
              />
            </div>
            <div className="text-[9px] text-muted-foreground mt-1 text-right">{c.value}%</div>
          </div>
        );
      case "check":
        return (
          <div className="flex flex-col items-center">
            <CheckCircle2 className="w-4 h-4 text-neon-green" />
            <span className="text-[9px] font-semibold text-neon-green mt-0.5">{c.label}</span>
          </div>
        );
      default:
        return null;
    }
  })();

  return (
    <motion.div
      className={base}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Doimiy yumshoq suzish — ichki qatlam (kirish animatsiyasiga xalaqit bermaydi) */}
      <motion.div
        className="w-full h-full flex items-center justify-center"
        animate={{ y: [0, -floatAmp, 0] }}
        transition={{ repeat: Infinity, duration: floatDur, delay: floatDelay, ease: "easeInOut" }}
      >
        {inner}
      </motion.div>
    </motion.div>
  );
}

function HeroMosaic() {
  // 6×6 grid + "big" 2×2 cell at rows 2–3, cols 2–3 (center-ish)
  // Big cell col-start/row-start explicit; qolgan kataklar flow bilan joylanadi.
  // Har bir katak uchun flow tartibini bilish uchun explicit (col,row) berib ketamiz,
  // lekin sodda shaklda faqat 6×6 dan big cell joylarini (2,2),(3,2),(2,3),(3,3) chiqarib tashlaymiz.

  const bigSlots = new Set(["2-2", "3-2", "2-3", "3-3"]); // 1-indexed grid-column/row

  // 6×6 = 36 joy bor; big 4 tani oladi → bizga 32 cell kerak.
  const cells: MosaicCell[] = [
    // Row 1 (6)
    { kind: "lang", lang: "python" },
    { kind: "snippet", text: "print()", color: "#00D2FF" },
    { kind: "empty", tone: "purple" },
    { kind: "icon", Icon: Sparkles, color: "#FFD600", badge: "AI" },
    { kind: "lang", lang: "javascript" },
    { kind: "stat", value: "7", label: "til", color: "#6C5CE7" },
    // Row 2 — big at cols 2,3 → normal cells at cols 1,4,5,6 (4 cells)
    { kind: "empty", tone: "green" },
    { kind: "icon", Icon: Trophy, color: "#FFD600" },
    { kind: "lang", lang: "typescript" },
    { kind: "snippet", text: "if x > 0:", color: "#FF6B9D" },
    // Row 3 — big continues → 4 cells at cols 1,4,5,6
    { kind: "stat", value: "+50", label: "XP", color: "#FFD600" },
    { kind: "lang", lang: "react" },
    { kind: "empty", tone: "blue" },
    { kind: "snippet", text: "for i in..", color: "#00E676" },
    // Row 4 (6)
    { kind: "check", label: "4/4" },
    { kind: "progress", value: 72, color: "#6C5CE7", label: "Py" },
    { kind: "empty", tone: "yellow" },
    { kind: "lang", lang: "c++" },
    { kind: "icon", Icon: Brain, color: "#00D2FF" },
    { kind: "snippet", text: "return 0", color: "#FF5252" },
    // Row 5 (6)
    { kind: "lang", lang: "java" },
    { kind: "empty", tone: "pink" },
    { kind: "stat", value: "100+", label: "kurs", color: "#00E676" },
    { kind: "snippet", text: "while..", color: "#00D2FF" },
    { kind: "empty", tone: "plain" },
    { kind: "icon", Icon: Gamepad2, color: "#FF6B9D" },
    // Row 6 (6)
    { kind: "icon", Icon: CheckCircle2, color: "#00E676" },
    { kind: "snippet", text: "=> ok", color: "#00E676" },
    { kind: "lang", lang: "csharp" },
    { kind: "empty", tone: "purple" },
    { kind: "progress", value: 45, color: "#00D2FF", label: "JS" },
    { kind: "lang", lang: "html" },
  ];

  // Explicit placement: (col, row) 1-indexed, skipping bigSlots for rows 2-3
  const placements: { col: number; row: number; cell: MosaicCell }[] = [];
  let i = 0;
  for (let row = 1; row <= 6; row++) {
    for (let col = 1; col <= 6; col++) {
      if (bigSlots.has(`${col}-${row}`)) continue;
      if (i < cells.length) {
        placements.push({ col, row, cell: cells[i] });
        i++;
      }
    }
  }

  // "Jonli faollik" — har 1.6s da tasodifiy katak yorishadi
  // (xuddi jadvalda kimdir ishlayotgandek)
  const [activeIdx, setActiveIdx] = useState(3);
  useEffect(() => {
    const t = setInterval(() => {
      setActiveIdx(prev => {
        let next = Math.floor(Math.random() * 32);
        if (next === prev) next = (next + 7) % 32;
        return next;
      });
    }, 1600);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative">
      {/* Soft gradient behind the grid */}
      <div className="absolute -inset-10 bg-[radial-gradient(ellipse_at_center,rgba(108,92,231,0.14)_0%,transparent_70%)] -z-10" />

      {/* Column labels — like spreadsheet A B C D */}
      <div className="grid grid-cols-[18px_repeat(6,1fr)] gap-1.5 mb-1.5">
        <div />
        {["A", "B", "C", "D", "E", "F"].map((l) => (
          <div
            key={l}
            className="text-center text-[10px] font-mono font-semibold text-muted-foreground/40"
          >
            {l}
          </div>
        ))}
      </div>

      {/* Row numbers + single grid */}
      <div className="grid grid-cols-[18px_repeat(6,1fr)] gap-1.5">
        {/* Row numbers column */}
        <div className="grid grid-rows-6 gap-1.5">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="flex items-center justify-end pr-1 text-[10px] font-mono font-semibold text-muted-foreground/40"
            >
              {n}
            </div>
          ))}
        </div>

        {/* Actual 6×6 grid cells with explicit placement */}
        <div
          className="col-span-6 grid grid-cols-6 grid-rows-6 gap-1.5"
          style={{ gridAutoFlow: "dense" }}
        >
          {/* Big 2×2 cell */}
          <motion.div
            style={{
              gridColumn: "2 / span 2",
              gridRow: "2 / span 2",
              boxShadow: "0 0 0 1px rgba(108,92,231,0.2) inset, 0 10px 40px -10px rgba(108,92,231,0.35)",
            }}
            className="rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm p-3 flex flex-col gap-2 relative overflow-hidden hover:scale-[1.02] transition-all"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-1.5">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-neon-red/60" />
                <div className="w-1.5 h-1.5 rounded-full bg-neon-yellow/60" />
                <div className="w-1.5 h-1.5 rounded-full bg-neon-green/60" />
              </div>
              <span className="text-[9px] font-mono text-muted-foreground ml-auto">main.py</span>
            </div>
            <div className="flex-1 flex flex-col justify-center text-[10px] md:text-[11px] leading-tight font-mono">
              <div>
                <span className="text-neon-purple">def</span>{" "}
                <span className="text-neon-blue">salom</span>
                (ism):
              </div>
              <div className="pl-3">
                <span className="text-neon-purple">return</span>{" "}
                <span className="text-neon-green">f&quot;Hi, {"{"}ism{"}"}&quot;</span>
              </div>
              <div className="mt-1 text-muted-foreground/50"># AI tahlil</div>
            </div>
            <div className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded self-start bg-neon-green/15 text-neon-green">
              <CheckCircle2 className="w-2.5 h-2.5" /> bajarildi
            </div>
          </motion.div>

          {/* All other cells */}
          {placements.map((p, idx) => (
            <div
              key={`${p.col}-${p.row}`}
              style={{ gridColumn: p.col, gridRow: p.row }}
            >
              <MosaicCellView c={p.cell} delay={0.05 + idx * 0.02} idx={idx} active={idx === activeIdx} />
            </div>
          ))}
        </div>
      </div>

      {/* Floating chips over the grid */}
      <motion.div
        className="absolute -top-5 left-10 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neon-yellow/95 backdrop-blur text-[#1a1a00] text-[11px] font-extrabold shadow-xl shadow-neon-yellow/40 rotate-[-4deg]"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <Trophy className="w-3.5 h-3.5" /> +50 XP
      </motion.div>
      <motion.div
        className="absolute -bottom-4 -right-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neon-blue/95 backdrop-blur text-white text-[11px] font-extrabold shadow-xl shadow-neon-blue/40 rotate-[3deg]"
        animate={{ y: [0, 4, 0] }}
        transition={{ duration: 3.5, repeat: Infinity }}
      >
        <Brain className="w-3.5 h-3.5" /> AI Tahlil
      </motion.div>
      <motion.div
        className="absolute top-[48%] -left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neon-green/95 backdrop-blur text-[#001a00] text-[11px] font-extrabold shadow-xl shadow-neon-green/40 rotate-[-6deg]"
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 2.8, repeat: Infinity }}
      >
        <CheckCircle2 className="w-3.5 h-3.5" /> 4/4
      </motion.div>
    </div>
  );
}

/* ============ Hero'da aylanuvchi so'z ============ */
const ROTATING_WORDS = [
  { text: "zamonaviy usulda", color: "gradient-text" },
  { text: "AI mentor bilan", color: "text-neon-blue" },
  { text: "o'ynab-o'ynab", color: "text-neon-green" },
  { text: "amaliyot orqali", color: "text-neon-yellow" },
];

function RotatingWord() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % ROTATING_WORDS.length), 2600);
    return () => clearInterval(t);
  }, []);
  const w = ROTATING_WORDS[idx];
  return (
    <span className="relative inline-block min-w-[280px] md:min-w-[420px]">
      <AnimatePresence mode="wait">
        <motion.span
          key={idx}
          className={`inline-block ${w.color === "gradient-text" ? "gradient-text" : w.color}`}
          initial={{ opacity: 0, y: 18, rotateX: 45 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          exit={{ opacity: 0, y: -18, rotateX: -45 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {w.text}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/* ============ Sanovchi raqam (count-up) ============ */
function CountUp({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!value) return;
    const dur = 1200;
    const t0 = performance.now();
    let raf: number;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      // easeOutCubic
      setDisplay(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <>{formatNumber(display)}</>;
}

/* ============ Til logolari marquee ============ */
const MARQUEE_LANGS = ["python", "javascript", "typescript", "react", "html", "java", "c++", "csharp"];

function LangMarquee() {
  const row = [...MARQUEE_LANGS, ...MARQUEE_LANGS, ...MARQUEE_LANGS];
  return (
    <div className="relative overflow-hidden py-6 border-y border-border/30 bg-surface/20">
      {/* Chekka fade */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      <motion.div
        className="flex items-center gap-12 w-max"
        animate={{ x: ["0%", "-33.333%"] }}
        transition={{ repeat: Infinity, duration: 28, ease: "linear" }}
      >
        {row.map((l, i) => (
          <div key={i} className="flex items-center gap-2.5 opacity-50 hover:opacity-100 transition-opacity">
            <LanguageLogo lang={l as any} size={26} />
            <span className="text-sm font-medium text-muted-foreground capitalize whitespace-nowrap">
              {l === "csharp" ? "C#" : l === "c++" ? "C++" : l}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* ============ FAQ (JSON-LD savollariga mos ko'rinadigan qism) ============ */
const FAQ_ITEMS = [
  { q: "EduCode platformasi nima?", a: "EduCode (malla.uz) — interaktiv dasturlash kurslari, AI Sokratik mentor va gamifikatsiya bilan o'zbek tilidagi onlayn ta'lim platformasi. Python, JavaScript, HTML/CSS, algoritmlar va prompt engineering bo'yicha kurslar mavjud." },
  { q: "EduCode bepulmi?", a: "Ha, asosiy kurslar va topshiriqlar bepul. Ba'zi premium kurslar coin yoki to'g'ridan-to'g'ri sotib olish orqali ochiladi. Ro'yxatdan o'tganda 100 coin sovg'a qilinadi." },
  { q: "AI mentor qanday ishlaydi?", a: "AI mentor Sokratik usulda ishlaydi: tayyor kod yechimini bermaydi, savollar orqali sizni mustaqil yechishga yo'naltiradi. Bu chuqur o'rganish va mustaqil fikrlashni rivojlantiradi." },
  { q: "Qaysi dasturlash tillarini o'rganish mumkin?", a: "Hozircha Python, JavaScript, HTML/CSS, algoritmlar va ma'lumot tuzilmalari bo'yicha kurslar mavjud. Playground'da esa 7 ta tilda kod yozib sinash mumkin." },
  { q: "Sertifikat olish mumkinmi?", a: "Ha, kursni 100% tugatgan talabalarga avtomatik raqamli sertifikat beriladi. Uni profilingizdan PDF sifatida yuklab olishingiz mumkin." },
];

function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="py-20 px-5 border-t border-border/30">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-neon-purple uppercase tracking-widest mb-3">Savol-javob</p>
          <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight">Ko'p so'raladigan savollar</h2>
        </div>
        <div className="space-y-3">
          {FAQ_ITEMS.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className={`rounded-2xl border transition-colors overflow-hidden ${open === i ? "border-neon-purple/30 bg-neon-purple/[0.04]" : "border-border/50 bg-card/30 hover:bg-card/50"}`}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-5 md:px-6 py-4.5 text-left py-4"
              >
                <span className="font-display font-semibold text-[15px] md:text-base">{item.q}</span>
                <span className={`w-7 h-7 rounded-full border flex items-center justify-center flex-shrink-0 transition-all ${open === i ? "bg-neon-purple border-neon-purple text-white rotate-45" : "border-border text-muted-foreground"}`}>
                  <Plus className="w-4 h-4" />
                </span>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 md:px-6 pb-5 text-sm md:text-[15px] text-muted-foreground leading-relaxed">{item.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
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
      <OrganizationJsonLd />
      <WebsiteJsonLd />
      <FaqJsonLd
        items={[
          {
            question: "EduCode platformasi nima?",
            answer:
              "EduCode (malla.uz) — interaktiv dasturlash kurslari, AI Sokratik mentor va gamifikatsiya bilan o'zbek tilidagi onlayn ta'lim platformasi. Python, JavaScript, HTML/CSS, algoritmlar va prompt engineering bo'yicha kurslar mavjud.",
          },
          {
            question: "EduCode bepulmi?",
            answer:
              "Ha, EduCode'ning asosiy kurslari va topshiriqlari bepul. Ba'zi premium kurslar coin yoki to'g'ridan-to'g'ri sotib olish orqali ochiladi.",
          },
          {
            question: "AI mentor qanday ishlaydi?",
            answer:
              "AI mentor Sokratik usulda ishlaydi: tayyor kod yechimini bermaydi, savollar orqali talabani mustaqil yechishga yo'naltiradi. Bu yondashuv Code.org 2024 va UNESCO 2024 tavsiyalariga muvofiq.",
          },
          {
            question: "Qaysi dasturlash tillarini o'rganish mumkin?",
            answer:
              "Hozircha Python, JavaScript, HTML/CSS, algoritmlar va ma'lumot tuzilmalari bo'yicha kurslar mavjud. Yaqin orada C++ va boshqa tillar qo'shiladi.",
          },
          {
            question: "Sertifikat olish mumkinmi?",
            answer:
              "Ha, kursni 100% tugatgan talabalarga avtomatik raqamli sertifikat beriladi. Sertifikat profilingizda saqlanadi va PDF sifatida yuklab olish mumkin.",
          },
        ]}
      />

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
                <RotatingWord /><br className="md:hidden" /> o'rganing
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
                    <div className="font-display font-bold text-2xl md:text-3xl">
                      <CountUp value={Number(s.val)} />+
                    </div>
                    <div className="text-sm text-muted-foreground">{s.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right — Creative spreadsheet-style mosaic */}
            <motion.div
              className="hidden md:block"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <HeroMosaic />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========== TIL LOGOLARI MARQUEE ========== */}
      <LangMarquee />

      {/* ========== FEATURES — BENTO GRID ========== */}
      <section className="py-20 px-5">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="max-w-2xl mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.p
              variants={fadeUp()}
              className="text-sm font-semibold text-neon-purple uppercase tracking-widest mb-3"
            >
              Imkoniyatlar
            </motion.p>
            <motion.h2
              variants={fadeUp(0.05)}
              className="font-display font-extrabold text-3xl md:text-4xl tracking-tight mb-4"
            >
              Nima uchun <span className="gradient-text">EduCode</span>?
            </motion.h2>
            <motion.p variants={fadeUp(0.1)} className="text-[15px] md:text-base text-muted-foreground">
              Har bir blok — aniq bir imkoniyat. Yig&apos;ilganda u butun boshli o&apos;qitish tizimini beradi.
            </motion.p>
          </motion.div>

          {/* Bento grid: 6 ustun, turli o'lchamli bloklar */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 auto-rows-[140px] md:auto-rows-[160px]">
            {/* 1. AI Tahlil — KATTA (col-span 3, row-span 2) */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="col-span-2 md:col-span-3 md:row-span-2 relative p-6 md:p-7 rounded-3xl border border-border/60 bg-gradient-to-br from-neon-blue/[0.07] via-card/40 to-transparent overflow-hidden group hover:border-neon-blue/30 transition-all"
            >
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-neon-blue/10 rounded-full blur-3xl" />
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="w-12 h-12 rounded-xl bg-neon-blue/10 border border-neon-blue/20 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-neon-blue" />
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-2xl md:text-[28px] tracking-tight mb-2">
                    AI kod tahlili
                  </h3>
                  <p className="text-[15px] text-muted-foreground leading-relaxed max-w-md">
                    Claude AI kodingizni satr-satr tekshirib, xatolaringizni, yaxshilanish joylarini va
                    tushunchalarni o&apos;zbek tilida tushuntiradi. Gemini 24/7 savollarga javob beradi.
                  </p>
                  {/* Demo snippet */}
                  <div className="mt-4 rounded-xl border border-border/60 bg-background/60 p-3 font-mono text-[12px] leading-relaxed max-w-sm">
                    <div className="text-neon-purple">
                      def <span className="text-neon-blue">kvadrat</span>(x): <span className="text-muted-foreground">return</span> x*x
                    </div>
                    <div className="mt-1.5 pt-1.5 border-t border-border/40 text-neon-blue flex items-start gap-1.5">
                      <Sparkles className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <span className="text-[11px]">Toza funksiya. Type hint qo&apos;shishingiz mumkin.</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 2. Playground — med (col-span 3) */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="col-span-2 md:col-span-3 p-6 rounded-3xl border border-border/60 bg-card/40 hover:bg-card/80 hover:border-border transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-11 h-11 rounded-xl bg-neon-purple/10 border border-neon-purple/20 flex items-center justify-center">
                  <Terminal className="w-5 h-5 text-neon-purple" />
                </div>
                <div className="flex -space-x-2">
                  {(["python", "javascript", "c++", "java", "csharp"] as const).map((lg, i) => (
                    <div
                      key={lg}
                      className="w-8 h-8 rounded-lg border-2 border-card bg-surface flex items-center justify-center"
                      style={{ zIndex: 10 - i }}
                    >
                      <LanguageLogo lang={lg} size={18} />
                    </div>
                  ))}
                </div>
              </div>
              <h3 className="font-display font-extrabold text-xl tracking-tight mb-1.5">Playground</h3>
              <p className="text-[14px] text-muted-foreground leading-snug">
                7 ta tilda kod yozing — Judge0 + Piston orqali real bajarish, stdin qo&apos;llab-quvvatlash.
              </p>
            </motion.div>

            {/* 3. Monaco (col-span 2, row-span 1) */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.12 }}
              className="col-span-1 md:col-span-2 p-5 rounded-3xl border border-border/60 bg-card/40 hover:bg-card/80 hover:border-border transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-neon-purple/10 border border-neon-purple/20 flex items-center justify-center mb-3">
                <Code2 className="w-5 h-5 text-neon-purple" />
              </div>
              <h3 className="font-display font-bold text-[15px] tracking-tight mb-1">VS Code muharrir</h3>
              <p className="text-[12px] text-muted-foreground leading-snug">Monaco engine — syntax, IntelliSense.</p>
            </motion.div>

            {/* 4. Gamification (col-span 1) */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="col-span-1 p-5 rounded-3xl border border-border/60 bg-gradient-to-br from-neon-yellow/[0.08] to-transparent hover:border-neon-yellow/30 transition-all relative overflow-hidden"
            >
              <div className="absolute top-3 right-3 text-[32px] font-display font-extrabold leading-none text-neon-yellow/15">
                XP
              </div>
              <div className="w-10 h-10 rounded-lg bg-neon-yellow/10 border border-neon-yellow/20 flex items-center justify-center mb-3">
                <Trophy className="w-5 h-5 text-neon-yellow" />
              </div>
              <h3 className="font-display font-bold text-[15px] tracking-tight mb-1">Coin &amp; XP</h3>
              <p className="text-[12px] text-muted-foreground leading-snug">Reyting, sovg&apos;alar.</p>
            </motion.div>

            {/* 5. Games (col-span 2) */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="col-span-2 md:col-span-2 p-5 rounded-3xl border border-border/60 bg-card/40 hover:bg-card/80 hover:border-border transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-lg bg-neon-green/10 border border-neon-green/20 flex items-center justify-center flex-shrink-0">
                  <Gamepad2 className="w-5 h-5 text-neon-green" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-display font-bold text-[15px] tracking-tight truncate">
                    6 ta interaktiv o&apos;yin
                  </h3>
                  <p className="text-[12px] text-muted-foreground leading-snug truncate">
                    Puzzle, BugFix, Maze, Bird…
                  </p>
                </div>
              </div>
              <div className="mt-3 flex gap-1 flex-wrap">
                {["Puzzle", "Bug", "Maze", "Bird", "Typing", "Battle"].map((t) => (
                  <span
                    key={t}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-surface/60 border border-border/50 text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* 6. Certificate (col-span 2) */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.24 }}
              className="col-span-2 md:col-span-2 p-5 rounded-3xl border border-border/60 bg-gradient-to-br from-neon-pink/[0.06] to-transparent hover:border-neon-pink/30 transition-all relative overflow-hidden"
            >
              <div className="absolute -bottom-6 -right-4 rotate-[-8deg] opacity-40">
                <div className="px-3 py-2 rounded-lg border-2 border-neon-pink/40 bg-card">
                  <div className="text-[8px] font-mono text-muted-foreground">CERTIFICATE</div>
                  <div className="text-[10px] font-bold text-neon-pink">EduCode</div>
                </div>
              </div>
              <div className="relative">
                <div className="w-10 h-10 rounded-lg bg-neon-pink/10 border border-neon-pink/20 flex items-center justify-center mb-3">
                  <GraduationCap className="w-5 h-5 text-neon-pink" />
                </div>
                <h3 className="font-display font-bold text-[15px] tracking-tight mb-1">Sertifikat</h3>
                <p className="text-[12px] text-muted-foreground leading-snug max-w-[200px]">
                  Kursni tugating va PNG sertifikatni oling.
                </p>
              </div>
            </motion.div>

            {/* 7. Multi-language tag row (col-span 6) */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.28 }}
              className="col-span-2 md:col-span-6 p-5 md:p-6 rounded-3xl border border-border/60 bg-card/40 hover:bg-card/80 hover:border-border transition-all flex items-center gap-4 md:gap-6 flex-wrap"
            >
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="w-10 h-10 rounded-lg bg-neon-red/10 border border-neon-red/20 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-neon-red" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-[15px] tracking-tight">7 ta dasturlash tili</h3>
                  <p className="text-[12px] text-muted-foreground leading-tight">
                    Bir platformada — bir interfeysda
                  </p>
                </div>
              </div>
              <div className="flex-1 flex flex-wrap gap-2 md:justify-end">
                {(
                  [
                    { k: "python", label: "Python" },
                    { k: "javascript", label: "JavaScript" },
                    { k: "typescript", label: "TypeScript" },
                    { k: "c++", label: "C++" },
                    { k: "java", label: "Java" },
                    { k: "csharp", label: "C#" },
                    { k: "html", label: "HTML/CSS" },
                  ] as const
                ).map((l) => (
                  <div
                    key={l.k}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-surface/80 border border-border/60 text-[12px] font-semibold"
                  >
                    <LanguageLogo lang={l.k as any} size={14} />
                    {l.label}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
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
                  <Link
                    href={user ? `/courses/${c.slug}` : `/courses/${c.slug}`}
                    className="relative block group rounded-3xl border border-border/50 bg-card/50 overflow-hidden hover:border-neon-purple/40 hover:shadow-2xl hover:shadow-neon-purple/10 hover:-translate-y-1.5 transition-all duration-300"
                  >
                    {/* Cover — rasm yoki gradient */}
                    <div className="relative h-36 overflow-hidden bg-gradient-to-br from-neon-purple/20 via-card/50 to-neon-blue/10">
                      {c.thumbnail_url ? (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={c.thumbnail_url}
                            alt={c.title}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                        </>
                      ) : (
                        <div className="absolute bottom-3 left-5 opacity-90 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300 origin-bottom-left">
                          {categoryIcon(c.category, 52)}
                        </div>
                      )}
                      {/* Shine sweep */}
                      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />
                      {/* Narx badge */}
                      <div className="absolute top-3 right-3.5">
                        {c.is_free
                          ? <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-neon-green/90 text-background shadow-lg shadow-neon-green/30">BEPUL</span>
                          : <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-neon-yellow/90 text-[#1a1a00] shadow-lg shadow-neon-yellow/30">{c.price_coins} coin</span>}
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="font-display font-bold text-lg leading-snug mb-1.5 group-hover:text-neon-purple transition-colors line-clamp-1">{c.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{c.description}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{c.total_topics} mavzu · {c.total_enrolled} talaba</span>
                        <span className="inline-flex items-center gap-1 font-semibold text-neon-purple opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all">
                          Boshlash <ArrowUpRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
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

      {/* ========== FAQ ========== */}
      <FaqSection />

      {/* ========== CTA ========== */}
      <section className="py-20 px-5 border-t border-border/30">
        <div className="max-w-6xl mx-auto">
          <div className="relative rounded-[2rem] border border-neon-purple/20 bg-gradient-to-br from-neon-purple/[0.08] via-card/40 to-neon-blue/[0.06] p-8 md:p-12 overflow-hidden">
            <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-neon-purple/15 blur-[90px] pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-neon-blue/10 blur-[90px] pointer-events-none" />
          <div className="relative grid md:grid-cols-2 gap-10 items-center">
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
                { icon: Gamepad2, text: "7 ta interaktiv o'yin (3D bilan)", color: "#FF6B9D" },
                { icon: Globe, text: "To'liq o'zbek tilida", color: "#FF5252" },
              ].map(f => (
                <div key={f.text} className="flex items-center gap-3 p-3.5 rounded-xl border border-border/40 bg-card/40 backdrop-blur-sm hover:border-border transition-colors">
                  <f.icon className="w-5 h-5 flex-shrink-0" style={{ color: f.color }} />
                  <span className="text-sm font-medium">{f.text}</span>
                </div>
              ))}
            </div>
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
