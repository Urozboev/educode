"use client";

import { useState, useEffect } from "react";
import Link from "@/components/i18n/Link";
import { createClient } from "@/lib/supabase/client";
import type { PublicPortfolio } from "@/types";
import { motion } from "framer-motion";
import { cn, getInitials, getLevelLabel, getLevelColor, formatDate, getCategoryLabel } from "@/lib/utils";
import {
  Github, Send, Linkedin, Globe, GraduationCap, Award, Swords,
  Gamepad2, Zap, ExternalLink, Code2, UserX, Lock, Flame,
  Trophy, BookOpen, CheckCircle2, Activity,
} from "lucide-react";

export function PortfolioView({ username }: { username: string }) {
  const supabase = createClient();
  const [data, setData] = useState<PublicPortfolio | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: res } = await supabase.rpc("get_public_portfolio", { p_username: username });
      if (res) setData(res as PublicPortfolio);
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  if (loading) {
    return <div className="max-w-4xl mx-auto h-96 rounded-2xl border border-border/40 bg-card/30 animate-pulse" />;
  }

  if (!data) {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <UserX className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
        <h1 className="font-display font-bold text-xl mb-2">Portfolio topilmadi</h1>
        <p className="text-muted-foreground mb-6">
          Bunday foydalanuvchi yo&apos;q yoki portfoliosi yopiq.
        </p>
        <Link href="/explore/portfolios" className="btn-primary py-2.5 px-5 text-sm">
          Boshqa portfoliolar
        </Link>
      </div>
    );
  }

  const {
    profile: p, stats, certificates, projects,
    completed_courses: completed = [],
    active_courses: active = [],
    achievements = [],
    activity = [],
  } = data;
  const links = [
    { url: p.github_url, Icon: Github, label: "GitHub" },
    { url: p.telegram_username ? `https://t.me/${p.telegram_username.replace(/^@/, "")}` : null, Icon: Send, label: "Telegram" },
    { url: p.linkedin_url, Icon: Linkedin, label: "LinkedIn" },
    { url: p.website_url, Icon: Globe, label: "Sayt" },
  ].filter(l => l.url);

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Egasiga eslatma */}
      {!p.is_public && (
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-neon-yellow/[0.07] border border-neon-yellow/25 text-sm">
          <Lock className="w-4 h-4 flex-shrink-0 mt-0.5 text-neon-yellow" />
          <span className="leading-relaxed text-muted-foreground">
            Portfolioyingiz hozir yopiq — buni faqat siz ko&apos;ryapsiz.
            <Link href="/portfolio" className="text-neon-purple hover:underline ml-1">
              Sozlamalardan oching
            </Link>
          </span>
        </div>
      )}

      {/* Sarlavha */}
      <motion.header initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row sm:items-start gap-5">
          <div className="w-20 h-20 rounded-2xl bg-hero-gradient flex items-center justify-center text-white font-display font-bold text-2xl flex-shrink-0 overflow-hidden">
            {p.avatar_url
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={p.avatar_url} alt="" className="w-full h-full object-cover" />
              : getInitials(p.full_name)}
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl tracking-tight">
              {p.full_name}
            </h1>
            {p.headline && (
              <p className="text-lg text-muted-foreground mt-1">{p.headline}</p>
            )}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-sm">
              <span className="font-mono text-muted-foreground">@{p.username}</span>
              <span className={cn("font-semibold", getLevelColor(p.level))}>
                {getLevelLabel(p.level)}
              </span>
              <span className="text-muted-foreground">
                {formatDate(p.created_at)} dan beri
              </span>
            </div>

            {links.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {links.map(({ url, Icon, label }) => (
                  <a
                    key={label}
                    href={url!}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border border-border text-muted-foreground hover:text-foreground hover:border-neon-purple/40 transition-colors"
                  >
                    <Icon className="w-4 h-4" /> {label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {p.bio && (
          <p className="mt-6 text-base leading-relaxed text-muted-foreground max-w-2xl">{p.bio}</p>
        )}
      </motion.header>

      {/* Statistika */}
      <section className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        <Stat Icon={GraduationCap} value={stats.courses_completed} label="tugatilgan kurs" />
        <Stat Icon={BookOpen} value={stats.topics_completed ?? 0} label="dars" />
        <Stat Icon={Swords} value={stats.challenges_solved} label="topshiriq" />
        <Stat Icon={Award} value={stats.certificates} label="sertifikat" />
        <Stat Icon={Trophy} value={stats.achievements ?? 0} label="yutuq" />
        <Stat Icon={Zap} value={p.xp} label="XP" />
      </section>

      {/* Faollik — oxirgi 12 hafta */}
      {activity.length > 0 && (
        <section>
          <h2 className="eyebrow mb-3 inline-flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5" /> Faollik — oxirgi 12 hafta
          </h2>
          <ActivityStrip weeks={activity} />
        </section>
      )}

      {/* Ko'nikmalar */}
      {p.skills?.length > 0 && (
        <section>
          <h2 className="eyebrow mb-3">Ko&apos;nikmalar</h2>
          <div className="flex flex-wrap gap-2">
            {p.skills.map(s => (
              <span key={s} className="px-3 py-1.5 rounded-lg text-sm bg-surface border border-border">
                {s}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Loyihalar */}
      {projects.length > 0 && (
        <section>
          <h2 className="font-display font-bold text-xl mb-4">Loyihalar</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {projects.map(pr => (
              <article
                key={pr.id}
                className="flex flex-col rounded-xl border border-border/60 bg-card/40 overflow-hidden hover:border-neon-purple/30 transition-colors"
              >
                {pr.cover_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={pr.cover_url} alt="" className="w-full h-36 object-cover" loading="lazy" />
                )}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-display font-bold">{pr.title}</h3>
                  {pr.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed mt-1.5">{pr.description}</p>
                  )}
                  {pr.tech?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {pr.tech.map(t => (
                        <span key={t} className="px-2 py-0.5 rounded text-[11px] font-mono bg-surface border border-border/60">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-auto pt-4 flex gap-3 text-sm">
                    {pr.demo_url && (
                      <a href={pr.demo_url} target="_blank" rel="noopener noreferrer nofollow"
                        className="inline-flex items-center gap-1.5 font-semibold text-neon-purple hover:underline">
                        <ExternalLink className="w-3.5 h-3.5" /> Ko&apos;rish
                      </a>
                    )}
                    {pr.repo_url && (
                      <a href={pr.repo_url} target="_blank" rel="noopener noreferrer nofollow"
                        className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground">
                        <Github className="w-3.5 h-3.5" /> Kod
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Kurslar */}
      {(completed.length > 0 || active.length > 0) && (
        <section>
          <h2 className="font-display font-bold text-xl mb-4">Kurslar</h2>

          {completed.length > 0 && (
            <div className="mb-5">
              <p className="eyebrow mb-2">Tugatilgan</p>
              <ul className="space-y-2">
                {completed.map(c => (
                  <li key={c.id} className="flex items-center gap-4 p-4 rounded-xl border border-border/60 bg-card/40">
                    <span className="w-9 h-9 rounded-lg bg-neon-green/10 border border-neon-green/25 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-neon-green" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{c.title}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {getCategoryLabel(c.category)}
                        {c.completed_at ? ` · ${formatDate(c.completed_at)}` : ""}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {active.length > 0 && (
            <div>
              <p className="eyebrow mb-2">Davom etmoqda</p>
              <ul className="space-y-2">
                {active.map(c => (
                  <li key={c.id} className="p-4 rounded-xl border border-border/60 bg-card/40">
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <p className="font-medium text-sm truncate min-w-0">{c.title}</p>
                      <span className="numeric text-sm text-neon-purple flex-shrink-0">
                        {c.progress_percent}%
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-surface overflow-hidden">
                      <div className="h-full progress-gradient" style={{ width: `${c.progress_percent}%` }} />
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1.5">
                      {getCategoryLabel(c.category)} · <span className="numeric">{c.completed_topics}</span>/
                      <span className="numeric">{c.total_topics}</span> dars
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {/* Yutuqlar */}
      {achievements.length > 0 && (
        <section>
          <h2 className="font-display font-bold text-xl mb-4">Yutuqlar</h2>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {achievements.map(a => (
              <div key={a.id} className="flex items-center gap-3 p-3.5 rounded-xl border border-border/60 bg-card/40">
                <span
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 border"
                  style={{ backgroundColor: `${a.color}1A`, borderColor: `${a.color}40` }}
                >
                  <Trophy className="w-4 h-4" style={{ color: a.color }} />
                </span>
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{a.title}</p>
                  {a.description && (
                    <p className="text-[11px] text-muted-foreground truncate">{a.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Sertifikatlar */}
      {certificates.length > 0 && (
        <section>
          <h2 className="font-display font-bold text-xl mb-4">Sertifikatlar</h2>
          <ul className="space-y-2">
            {certificates.map(c => (
              <li key={c.id} className="flex items-center gap-4 p-4 rounded-xl border border-border/60 bg-card/40">
                <span className="w-10 h-10 rounded-xl bg-neon-yellow/10 border border-neon-yellow/25 flex items-center justify-center flex-shrink-0">
                  <Award className="w-5 h-5 text-neon-yellow" />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{c.course_title}</p>
                  <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
                    {c.certificate_number} · {formatDate(c.completion_date)}
                  </p>
                </div>
                {c.score_percentage != null && (
                  <span className="numeric text-sm text-neon-green">{Math.round(c.score_percentage)}%</span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Bo'sh holat */}
      {projects.length === 0 && certificates.length === 0 && stats.courses_completed === 0 &&
       active.length === 0 && achievements.length === 0 && (
        <div className="py-14 text-center border border-dashed border-border rounded-2xl">
          <Code2 className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">Bu portfolio hali to&apos;ldirilmagan</p>
        </div>
      )}

      <footer className="pt-8 border-t border-border/50 flex items-center justify-between gap-4 flex-wrap">
        <p className="text-sm text-muted-foreground">
          Bu portfolio <Link href="/" className="text-neon-purple hover:underline">EduCode</Link> platformasida yig&apos;ilgan
        </p>
        {p.longest_streak > 0 && (
          <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <Flame className="w-4 h-4 text-neon-red" />
            Eng uzun seriya: <span className="numeric text-foreground">{p.longest_streak}</span> kun
          </span>
        )}
      </footer>
    </div>
  );
}

/**
 * Faollik chizig'i — GitHub'niki kabi, lekin haftalik.
 * Rang zichligi eng faol haftaga nisbatan hisoblanadi, shuning uchun
 * kam yechadigan o'quvchida ham farq ko'rinadi.
 */
function ActivityStrip({ weeks }: { weeks: { week: string; count: number }[] }) {
  const max = Math.max(1, ...weeks.map(w => w.count));
  const total = weeks.reduce((s, w) => s + w.count, 0);

  return (
    <div>
      <div className="flex gap-1.5">
        {weeks.map(w => {
          const level = w.count === 0 ? 0 : Math.ceil((w.count / max) * 4);
          return (
            <div
              key={w.week}
              title={`${w.week} — ${w.count} ta yechim`}
              className={cn(
                "flex-1 h-9 rounded-md border transition-colors",
                level === 0 && "bg-surface border-border/50",
                level === 1 && "bg-neon-green/20 border-neon-green/25",
                level === 2 && "bg-neon-green/40 border-neon-green/35",
                level === 3 && "bg-neon-green/60 border-neon-green/45",
                level >= 4 && "bg-neon-green/80 border-neon-green/60"
              )}
            />
          );
        })}
      </div>
      <p className="text-[11px] text-muted-foreground mt-2">
        So&apos;nggi 12 haftada <span className="numeric text-foreground">{total}</span> ta topshiriq yechilgan
      </p>
    </div>
  );
}

function Stat({ Icon, value, label }: { Icon: React.ElementType; value: number; label: string }) {
  return (
    <div className="p-4 rounded-xl border border-border/60 bg-card/40 text-center">
      <Icon className="w-4 h-4 text-muted-foreground mx-auto mb-1.5" />
      <p className="numeric text-2xl">{value}</p>
      <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight">{label}</p>
    </div>
  );
}
