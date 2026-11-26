"use client";

import { useEffect, useState } from "react";
import { getImageProps } from "next/image";
import Link from "@/components/i18n/Link";
import { useI18n } from "@/lib/i18n";
import { cn, getInitials } from "@/lib/utils";
import { ArrowUpRight, ArrowRight, Terminal } from "lucide-react";
import { handFont } from "./fonts";

interface HeroCourse {
  id: string;
  slug: string;
  title: string;
  thumbnail_url?: string | null;
  is_free?: boolean;
  total_topics?: number;
}

interface Props {
  ctaHref: string;
  ctaLabel: string;
  stats: { users: number; courses: number; challenges: number };
  /** Endi sahnada ko'rsatilmaydi (kurslar pastdagi bo'limda), moslik uchun qoldirildi */
  course?: HeroCourse;
  people: string[];
}

/** 1240 → "1 240" — katta sonlar ko'z bilan tez o'qilsin */
const fmt = (n: number) => n.toLocaleString("ru-RU").replace(/ /g, " ");

/**
 * Toshkent vaqti. Faqat brauzerda hisoblanadi — server boshqa vaqt
 * mintaqasida render qilsa, gidratatsiyada farq chiqmasligi uchun.
 */
function useTashkentClock() {
  const [now, setNow] = useState<{ time: string; day: number } | null>(null);
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const time = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Tashkent", hour: "2-digit", minute: "2-digit", hour12: false,
      }).format(d);
      const wd = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Tashkent", weekday: "short" }).format(d);
      const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(wd);
      setNow({ time, day });
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);
  return now;
}

/**
 * Rasm ikki variantda: katta ekranda keng (16:9), telefonda tikka (9:16).
 * <picture> brauzerga faqat keraklisini yuklatadi; next/image esa har
 * birini ekran kengligiga mos o'lchamda WebP/AVIF qilib beradi.
 */
function useHeroPicture(alt: string) {
  const common = { alt, quality: 80, priority: true } as const;
  const wide = getImageProps({ ...common, src: "/home/hero-wide.webp", width: 2000, height: 1116, sizes: "(min-width: 1280px) 1280px, 100vw" }).props;
  const tall = getImageProps({ ...common, src: "/home/hero-tall.webp", width: 1116, height: 2000, sizes: "100vw" }).props;
  return { wide, tall };
}

/**
 * Bosh sahifaning ochilish qismi — kompyuterxona sahnasi.
 *
 * Kodi ishlab ketgan talaba quvonib mushtini ko'taradi; orqasidagi katta
 * oynadan kechki Toshkent ko'rinadi. Sarlavha osmon ustida turadi.
 * Ramka burchaklarida sahifa fonidan o'yilgan ikki joy bor: yuqori o'ngda
 * asosiy tugma, pastki chapda Toshkent vaqti.
 *
 * Telefonda rasm tepada, matn va kartochkalar uning ostida — rasm
 * pastidagi to'q rangga (#151122) qo'shilib ketadi.
 */
export default function HomeHero({ ctaHref, ctaLabel, stats, people }: Props) {
  const { t } = useI18n();
  const l = t.landing;
  const clock = useTashkentClock();
  const { wide, tall } = useHeroPicture(l.heroImageAlt);

  return (
    <section className={cn("pt-20 md:pt-24 px-3 md:px-5", handFont.variable)}>
      {/*
        Tashqi oq ramka (Fairway'dagidek). O'yiqlar shu ramkaning rangida
        o'yiladi va ramka ichida turadi — rasm burchagi dumaloq tugmani
        qirqmaydi. --p: ramka qalinligi, o'yiq bo'laklari shunga tayanadi.
      */}
      <div className="relative max-w-7xl mx-auto rounded-[2.4rem] md:rounded-[2.75rem] bg-card p-[var(--p)] ring-1 ring-border/70 shadow-[0_30px_70px_-40px_hsl(var(--shadow-color)/0.55)] [--p:0.4rem] md:[--p:0.55rem] [--notch-fill:hsl(var(--card))]">
      <div className="relative flex flex-col rounded-[2rem] md:rounded-[2.2rem] overflow-hidden bg-[#151122] text-white lg:block lg:h-[46rem]">
        {/* ===== Rasm ===== */}
        <div className="relative aspect-[9/14] sm:aspect-[4/3] lg:aspect-auto lg:absolute lg:inset-0">
          <picture>
            <source media="(min-width: 1024px)" srcSet={wide.srcSet} sizes={wide.sizes} />
            <source media="(min-width: 640px)" srcSet={wide.srcSet} sizes="100vw" />
            {/* eslint-disable-next-line jsx-a11y/alt-text -- alt getImageProps ichida */}
            <img
              {...tall}
              className="absolute inset-0 w-full h-full object-cover object-bottom sm:object-[15%_60%] lg:object-[15%_50%]"
            />
          </picture>
          {/* Matn o'qilishi uchun: telefonda tepasi va pasti, katta ekranda o'ng tomon biroz to'qlashadi */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#1b1650]/35 via-transparent via-40% to-[#151122] lg:hidden" aria-hidden />
          <div className="hidden lg:block absolute inset-0 bg-[linear-gradient(to_left,rgba(22,18,62,0.5),rgba(22,18,62,0.12)_55%,transparent_75%)]" aria-hidden />
          <div className="hidden lg:block absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#151122]/60 to-transparent" aria-hidden />
        </div>

        {/* ===== Qo'lda yozilgan "pufak" — talabaning boshi ustida (faqat katta ekranda) ===== */}
        <div className="hidden lg:block absolute z-10 left-24 top-12 -rotate-2">
          <p className="hand relative rounded-2xl bg-white text-[#1d1a33] px-5 py-3 text-[1.5rem] leading-[1.15] whitespace-pre-line shadow-[0_18px_40px_-20px_rgba(10,8,40,0.7)]">
            {l.note}
            <span className="absolute -bottom-2 left-[62%] w-5 h-5 bg-white rotate-45 rounded-[3px]" aria-hidden />
          </p>
        </div>

        {/*
          Sarlavha, matn va tugmalar. Katta ekranda — o'ng ustun.
          Telefonda bu o'ram `contents`: sarlavha rasm ustiga (osmonga)
          chiqadi, matn va tugmalar esa rasm ostidan oqimda davom etadi.
        */}
        <div className="contents lg:block lg:absolute lg:z-10 lg:top-24 lg:right-12 lg:w-[min(38rem,52%)]">
          <h1 className="absolute z-10 top-[4.5rem] inset-x-6 sm:top-[5.25rem] sm:left-auto sm:right-10 lg:static font-display text-white [text-shadow:0_2px_30px_rgba(20,16,70,0.35)]">
            <span className="block font-medium tracking-[-0.035em] leading-[1] text-[clamp(2.1rem,4.4vw,4.3rem)] text-white/90">
              {l.heroSmall}
            </span>
            <span className="block font-extrabold tracking-[-0.05em] leading-[0.88] text-[clamp(3.6rem,7.6vw,7.4rem)] pl-[0.5em] lg:pl-[0.9em]">
              {l.heroBig}
            </span>
          </h1>

          <div className="relative px-6 sm:px-10 pt-2 lg:p-0 lg:mt-6 lg:pl-[1.6em]">
            <p className="max-w-[34rem] text-[1.02rem] md:text-[1.08rem] leading-relaxed text-white/80">
              {l.heroLead}
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3 text-[0.95rem] font-semibold">
              <Link
                href="/explore/courses"
                className="group inline-flex items-center gap-2 pl-6 pr-5 py-3.5 rounded-full bg-white text-[#1d1a33] shadow-[0_14px_30px_-14px_rgba(0,0,0,0.6)] hover:bg-[#efeaff] transition-colors"
              >
                {l.ctaCourses} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/playground"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full border border-white/45 bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors"
              >
                <Terminal className="w-4 h-4" /> {l.ctaPlayground}
              </Link>
            </div>
          </div>
        </div>

        {/* ===== Pastki kartochkalar ===== */}
        <div className="relative grid sm:grid-cols-2 gap-3 px-4 pt-8 pb-4 sm:px-6 sm:pb-6 lg:p-0 lg:block lg:static">
          {/* Talabalar va raqamlar */}
          <div className="lg:absolute lg:z-10 lg:bottom-7 lg:left-[7.5rem] rounded-2xl bg-card text-foreground shadow-[0_18px_40px_-22px_rgba(10,8,40,0.75)] p-4 lg:w-[27rem]">
            <div className="flex items-center gap-3">
              {people.length > 0 && (
                <div className="flex -space-x-2.5">
                  {people.slice(0, 4).map((name, i) => (
                    <span
                      key={name + i}
                      className={cn(
                        "w-9 h-9 rounded-full border-2 border-card flex items-center justify-center text-[0.7rem] font-bold text-white",
                        ["bg-neon-purple", "bg-neon-blue", "bg-neon-green", "bg-neon-pink"][i % 4],
                      )}
                    >
                      {getInitials(name)}
                    </span>
                  ))}
                </div>
              )}
              <p className="leading-tight">
                <span className="font-display font-bold text-xl tabular-nums tracking-tight">{fmt(stats.users)}+</span>
                <span className="block text-xs text-muted-foreground">{l.studentsLabel}</span>
              </p>
            </div>
            {/* Raqamlar — haqiqiy statistika */}
            <dl className="mt-4 pt-4 border-t border-border grid grid-cols-2 gap-4">
              {[
                [stats.courses, l.statCourses],
                // Yuborilgan yechimlar soni ommaviy so'rovda RLS sababli doim 0 — ko'rsatilmaydi
                [stats.challenges, l.statProblems],
              ].map(([v, label]) => (
                <div key={label as string} className="flex items-baseline gap-2.5">
                  <dt className="sr-only">{label}</dt>
                  <dd className="font-display font-extrabold text-[2.6rem] leading-none tabular-nums tracking-[-0.04em] text-neon-purple">
                    {fmt(Number(v))}
                  </dd>
                  <p className="text-xs leading-tight text-muted-foreground max-w-[6rem]">{label}</p>
                </div>
              ))}
            </dl>
          </div>

          {/* Kod */}
          <div className="relative lg:absolute lg:z-10 lg:bottom-8 lg:right-8 lg:w-[22rem] rotate-[1.5deg] rounded-2xl bg-[#11151f] text-[#e6edf3] ring-1 ring-white/10 shadow-[0_24px_50px_-20px_rgba(0,0,0,0.8)] p-5 font-mono text-[0.85rem] leading-[1.75]">
            <span className="tape" aria-hidden />
            <div><span className="text-[#c4a7ff]">ism</span> = <span className="text-[#7cc7ff]">input</span>(<span className="text-[#a5d6a7]">&quot;Ismingiz: &quot;</span>)</div>
            <div><span className="text-[#7cc7ff]">print</span>(<span className="text-[#a5d6a7]">f&quot;Salom, {"{"}ism{"}"}!&quot;</span>)</div>
            <div className="mt-3 pt-3 border-t border-white/10 text-[0.8rem]">
              <span className="text-white/45">{l.output}</span>
              <div className="text-white/80">Ismingiz: <span className="text-[#f2cc60]">Sa&apos;diyaxon</span></div>
              <div className="text-[#a5d6a7]">Salom, Sa&apos;diyaxon!</div>
            </div>
          </div>

          {/* Telefonda izoh kartochkalar ostida */}
          <p className="hand lg:hidden sm:col-span-2 text-center text-[1.45rem] leading-tight whitespace-pre-line text-white/75 pt-3 pb-1 -rotate-1">
            {l.note}
          </p>
        </div>

      </div>

        {/* ===== Yuqori o'ng o'yiq — asosiy tugma (oq ramka ichida) ===== */}
        <div className="absolute top-0 right-0 z-20 bg-card text-foreground pt-[var(--p)] pr-[var(--p)] pl-2.5 pb-2.5 md:pl-3 md:pb-3 rounded-bl-[1.75rem] rounded-tr-[2.4rem] md:rounded-tr-[2.75rem]">
          <span className="notch-fillet notch-fillet--tr" style={{ top: "var(--p)", right: "100%" }} aria-hidden />
          <span className="notch-fillet notch-fillet--tr" style={{ top: "100%", right: "var(--p)" }} aria-hidden />
          <Link
            href={ctaHref}
            className="group flex items-center gap-3 pl-4 pr-1 py-1 rounded-full hover:bg-surface transition-colors"
          >
            <span className="font-display font-semibold text-sm md:text-[0.95rem] whitespace-nowrap">{ctaLabel}</span>
            <span className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-foreground text-background flex items-center justify-center transition-transform group-hover:rotate-45">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </Link>
        </div>

        {/* ===== Pastki chap o'yiq — Toshkent vaqti (faqat katta ekranda) ===== */}
        <div className="hidden lg:flex absolute bottom-0 left-0 z-20 bg-card text-foreground pb-[var(--p)] pl-[var(--p)] pr-3 pt-3 rounded-tr-[1.75rem] rounded-bl-[2.75rem]">
          <span className="notch-fillet notch-fillet--bl" style={{ bottom: "100%", left: "var(--p)" }} aria-hidden />
          <span className="notch-fillet notch-fillet--bl" style={{ bottom: "var(--p)", left: "100%" }} aria-hidden />
          <div className="w-[4.5rem] h-[14rem] flex items-end justify-center pb-4">
            <div className="[writing-mode:vertical-rl] rotate-180 flex items-center gap-3 whitespace-nowrap">
              <span className="font-display font-semibold text-[1.65rem] tabular-nums tracking-tight">
                {clock?.time ?? "--:--"}
              </span>
              <span className="text-sm text-muted-foreground">
                {clock ? `${l.weekdays[clock.day]}, ${l.city}` : l.city}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
