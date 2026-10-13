"use client";

import { useEffect, useState } from "react";
import Link from "@/components/i18n/Link";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { GUIDE_SECTIONS, GUIDE_ROLES, type GuideIcon } from "@/lib/guide";
import { GuideVideo, useGuideVideos } from "@/components/guide/GuideVideo";
import {
  LogIn, BookOpen, Code2, Coins, Zap, FlaskConical, Gamepad2, Puzzle, Trophy,
  GraduationCap, School, Users, ShieldCheck, Lightbulb, ArrowUpRight, PlayCircle,
} from "lucide-react";

const ICON: Record<GuideIcon, typeof LogIn> = {
  login: LogIn, courses: BookOpen, tasks: Code2, coins: Coins, xp: Zap,
  labs: FlaskConical, games: Gamepad2, lessonGames: Puzzle, contests: Trophy,
};

const ROLE_ICON = {
  "role-student": GraduationCap,
  "role-teacher": School,
  "role-parent": Users,
  "role-admin": ShieldCheck,
} as const;

/**
 * Yo'riqnoma — har bir imkoniyat uchun qadamlar va (bo'lsa) qisqa video.
 * Mazmun: src/lib/guide.ts. Videolar: admin panel → /a-guide.
 */
export default function GuidePage() {
  const { t } = useI18n();
  const g = t.guide;
  const { videos } = useGuideVideos();
  const [active, setActive] = useState<string>(GUIDE_SECTIONS[0].id);

  // Mundarijada joriy bo'lim: boshi ekranning yuqori uchdan biridan
  // o'tgan oxirgi bo'lim. IntersectionObserver tez aylantirishda bo'limlarni
  // "sakrab o'tib" adashardi — har aylantirishda holatni hisoblash ishonchli.
  useEffect(() => {
    const ids = [...GUIDE_SECTIONS.map((s) => s.id), "rollar"];
    let frame = 0;
    const update = () => {
      frame = 0;
      const chegara = window.innerHeight * 0.3;
      let joriy = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= chegara) joriy = id;
      }
      // Sahifa oxiriga yetganda oxirgi bo'lim (rollar) faol bo'lsin
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) joriy = ids[ids.length - 1];
      setActive(joriy);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); if (frame) cancelAnimationFrame(frame); };
  }, []);

  const tocLink = (id: string, active_: boolean) => cn(
    "flex items-start gap-2.5 px-3 py-2 rounded-xl text-sm leading-snug transition-colors",
    active_ ? "bg-neon-purple/10 text-neon-purple font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-surface",
  );

  return (
    <div className="py-2 md:py-4">
      {/* Sarlavha */}
      <header className="max-w-3xl mb-10">
        <h1 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight leading-[1.08] mb-4">{g.title}</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">{g.subtitle}</p>
      </header>

      {videos.overview && (
        <GuideVideo url={videos.overview} title={g.homeTitle} className="mb-14 shadow-xl" />
      )}

      <div className="lg:grid lg:grid-cols-[250px,1fr] lg:gap-10">
        {/* Mundarija — desktopda joyida turadi va joriy bo'limni ko'rsatadi */}
        <nav aria-label={g.contents} className="hidden lg:block">
          <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-1 space-y-0.5">
            <p className="text-sm font-semibold text-muted-foreground mb-2 px-3">{g.contents}</p>
            {GUIDE_SECTIONS.map((s) => {
              const Icon = ICON[s.icon];
              const on = active === s.id;
              return (
                <a key={s.id} href={`#${s.id}`} aria-current={on ? "location" : undefined} className={tocLink(s.id, on)}>
                  <Icon className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{s.title}</span>
                  {videos[s.id as keyof typeof videos] && <PlayCircle className="w-3.5 h-3.5 ml-auto mt-0.5 flex-shrink-0" />}
                </a>
              );
            })}
            <a href="#rollar" aria-current={active === "rollar" ? "location" : undefined} className={tocLink("rollar", active === "rollar")}>
              <Users className="w-4 h-4 flex-shrink-0 mt-0.5" /> <span>{g.rolesTitle}</span>
            </a>
          </div>
        </nav>

        <div className="space-y-16 min-w-0">
          {/* Mobil mundarija — gorizontal */}
          <div className="lg:hidden -mx-4 px-4 overflow-x-auto">
            <div className="flex gap-2 w-max pb-1">
              {GUIDE_SECTIONS.map((s) => (
                <a key={s.id} href={`#${s.id}`} className="px-3.5 py-2 rounded-full border border-border bg-card text-sm whitespace-nowrap">
                  {s.title}
                </a>
              ))}
              <a href="#rollar" className="px-3.5 py-2 rounded-full border border-border bg-card text-sm whitespace-nowrap">{g.rolesTitle}</a>
            </div>
          </div>

          {GUIDE_SECTIONS.map((s, idx) => {
            const Icon = ICON[s.icon];
            const video = videos[s.id as keyof typeof videos];
            return (
              <section key={s.id} id={s.id} className="scroll-mt-24">
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-neon-purple/10 border border-neon-purple/20 text-neon-purple flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-display font-bold text-2xl md:text-[1.7rem] tracking-tight leading-tight">{s.title}</h2>
                    <p className="text-muted-foreground mt-1.5 leading-relaxed">{s.lead}</p>
                  </div>
                </div>

                <div className={cn("grid gap-6", video && "xl:grid-cols-[1.15fr,1fr] xl:items-start")}>
                  {video && <GuideVideo url={video} title={s.title} />}

                  <div className="space-y-5">
                    <div>
                      <h3 className="font-semibold mb-3">{g.steps}</h3>
                      <ol className="space-y-2.5">
                        {s.steps.map((st, i) => (
                          <li key={i} className="flex gap-3">
                            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-foreground text-background text-sm font-bold flex items-center justify-center tabular-nums">{i + 1}</span>
                            <span className="pt-0.5 leading-relaxed text-foreground/85">{st}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    {s.pairs && (
                      <div className="grid sm:grid-cols-2 gap-4">
                        {s.pairs.map((p) => (
                          <div key={p.title} className="rounded-2xl border border-border bg-card overflow-hidden">
                            <p className="px-4 py-2.5 font-semibold text-sm bg-surface border-b border-border">{p.title}</p>
                            <dl className="divide-y divide-border">
                              {p.rows.map(([k, v]) => (
                                <div key={k} className="px-4 py-2 flex justify-between gap-3 text-sm">
                                  <dt className="font-medium">{k}</dt>
                                  <dd className="text-muted-foreground text-right">{v}</dd>
                                </div>
                              ))}
                            </dl>
                          </div>
                        ))}
                      </div>
                    )}

                    {s.tips && (
                      <div className="rounded-2xl border border-neon-yellow/30 bg-neon-yellow/[0.06] p-4">
                        <p className="flex items-center gap-2 font-semibold text-sm mb-2 text-neon-yellow">
                          <Lightbulb className="w-4 h-4" /> {g.tips}
                        </p>
                        <ul className="space-y-1.5 text-sm text-foreground/85 list-disc pl-5">
                          {s.tips.map((tip, i) => <li key={i}>{tip}</li>)}
                        </ul>
                      </div>
                    )}

                    {s.link && (
                      <Link href={s.link.href}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-neon-purple hover:underline underline-offset-4">
                        {s.link.label} <ArrowUpRight className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </div>
                {idx < GUIDE_SECTIONS.length - 1 && <hr className="mt-16 border-border/60" />}
              </section>
            );
          })}

          {/* Rollar */}
          <section id="rollar" className="scroll-mt-24 pt-4">
            <h2 className="font-display font-bold text-2xl md:text-3xl tracking-tight mb-2">{g.rolesTitle}</h2>
            <p className="text-muted-foreground mb-8">{g.rolesSubtitle}</p>
            <div className="grid md:grid-cols-2 gap-5">
              {GUIDE_ROLES.map((r) => {
                const Icon = ROLE_ICON[r.id];
                const video = videos[r.id];
                return (
                  <article key={r.id} id={r.id} className="rounded-3xl border border-border bg-card p-6 flex flex-col gap-4 scroll-mt-24">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-surface border border-border flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-xl">{r.title}</h3>
                        <p className="text-sm text-muted-foreground">{r.who}</p>
                      </div>
                    </div>
                    {video && <GuideVideo url={video} title={r.title} />}
                    <div>
                      <p className="text-sm font-semibold mb-2">{g.canDo}</p>
                      <ul className="space-y-1.5 text-sm text-foreground/85">
                        {r.can.map((c, i) => (
                          <li key={i} className="flex gap-2"><span className="text-neon-green mt-0.5">✓</span><span>{c}</span></li>
                        ))}
                      </ul>
                    </div>
                    <p className="mt-auto text-sm rounded-xl bg-surface px-4 py-3">
                      <span className="font-semibold">{g.howToStart}: </span>
                      <span className="text-muted-foreground">{r.start}</span>
                    </p>
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
