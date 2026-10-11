"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import Link from "@/components/i18n/Link";
import { createClient } from "@/lib/supabase/client";
import { useI18n } from "@/lib/i18n";
import { cn, getInitials, getLevelLabel, getLevelColor, formatDate } from "@/lib/utils";
import {
  X, Flame, Zap, Trophy, Award, BookOpen, CheckCircle2,
  Swords, Gamepad2, GraduationCap, ExternalLink, Activity, UserX,
} from "lucide-react";

interface StudentCard {
  profile: {
    id: string;
    full_name: string;
    avatar_url: string | null;
    level: string;
    xp: number;
    streak_days: number;
    longest_streak: number;
    created_at: string;
    username: string | null;
    headline: string | null;
    bio: string | null;
    skills: string[] | null;
    has_portfolio: boolean;
  };
  rank: number;
  stats: {
    courses_completed: number;
    topics_completed: number;
    challenges_solved: number;
    tasks_solved: number;
    quizzes_passed: number;
    certificates: number;
    achievements: number;
    games_played: number;
  };
  courses: { title: string; slug: string; category: string; completed_at: string | null }[];
  achievements: { title: string; icon: string; color: string; earned_at: string }[];
  activity: { week: string; count: number }[];
}

/**
 * Reyting jadvalidagi qatorga bosilganda ochiladigan karta.
 *
 * Ma'lumot `get_student_card` RPC orqali keladi (66-migratsiya) — u
 * nimani ko'rsatish mumkinligini bazaning o'zida hal qiladi, chunki
 * manba jadvallar RLS bilan har kimning o'ziga cheklangan. Mijoz
 * tomonda hech qanday filtr yo'q: bu yerda qaytgan narsaning hammasini
 * ko'rsatish mumkin.
 */
export default function StudentCardModal({
  userId,
  onClose,
}: {
  userId: string | null;
  onClose: () => void;
}) {
  const { t } = useI18n();
  const [data, setData] = useState<StudentCard | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    let bekor = false;
    setLoading(true);
    setData(null);
    (async () => {
      const supabase = createClient();
      const { data: res } = await supabase.rpc("get_student_card", { p_user_id: userId });
      if (bekor) return;
      setData((res as StudentCard) ?? null);
      setLoading(false);
    })();
    return () => { bekor = true; };
  }, [userId]);

  // Ochiq modal ustida sahifa aylanmasligi kerak
  useEffect(() => {
    if (!userId) return;
    const oldingi = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", esc);
    return () => {
      document.body.style.overflow = oldingi;
      window.removeEventListener("keydown", esc);
    };
  }, [userId, onClose]);

  if (!userId || typeof document === "undefined") return null;

  const c = t.cabinet.boardCard;
  const p = data?.profile;
  const s = data?.stats;

  const tiles = s
    ? [
        { Icon: GraduationCap, label: c.statCourses, value: s.courses_completed, color: "text-neon-green" },
        { Icon: BookOpen, label: c.statTopics, value: s.topics_completed, color: "text-neon-blue" },
        { Icon: Swords, label: c.statChallenges, value: s.challenges_solved, color: "text-neon-purple" },
        { Icon: CheckCircle2, label: c.statTasks, value: s.tasks_solved, color: "text-neon-green" },
        { Icon: Zap, label: c.statQuizzes, value: s.quizzes_passed, color: "text-neon-yellow" },
        { Icon: Award, label: c.statCertificates, value: s.certificates, color: "text-neon-yellow" },
        { Icon: Trophy, label: c.statAchievements, value: s.achievements, color: "text-neon-yellow" },
        { Icon: Gamepad2, label: c.statGames, value: s.games_played, color: "text-neon-blue" },
      ]
    : [];

  // Faollik ustunlari eng band haftaga nisbatan o'lchanadi
  const maxHafta = Math.max(1, ...(data?.activity ?? []).map((a) => a.count));

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]"
      >
        {/* Sarlavha */}
        <div className="p-5 border-b border-border flex items-start justify-between gap-4 bg-surface/50">
          {loading || !p ? (
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-surface animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 w-36 rounded bg-surface animate-pulse" />
                <div className="h-3 w-24 rounded bg-surface animate-pulse" />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-14 h-14 rounded-full bg-hero-gradient flex items-center justify-center text-white font-bold flex-shrink-0 overflow-hidden">
                {p.avatar_url ? (
                  <img src={p.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  getInitials(p.full_name)
                )}
              </div>
              <div className="min-w-0">
                <h3 className="font-display font-bold text-lg truncate">{p.full_name}</h3>
                <div className="flex items-center gap-2.5 text-xs flex-wrap mt-0.5">
                  <span className="font-mono text-muted-foreground">#{data!.rank}</span>
                  <span className={cn("font-medium", getLevelColor(p.level))}>
                    {getLevelLabel(p.level, t)}
                  </span>
                  <span className="font-mono text-neon-yellow">{p.xp} XP</span>
                  {p.streak_days > 0 && (
                    <span className="inline-flex items-center gap-1 text-neon-red">
                      <Flame className="w-3 h-3" />
                      {p.streak_days}
                    </span>
                  )}
                </div>
                {p.headline && (
                  <p className="text-xs text-muted-foreground truncate mt-1">{p.headline}</p>
                )}
              </div>
            </div>
          )}

          <button
            onClick={onClose}
            aria-label={t.common.close}
            className="w-9 h-9 rounded-xl hover:bg-surface flex items-center justify-center text-muted-foreground hover:text-foreground transition flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tanasi */}
        <div className="p-5 overflow-y-auto space-y-6">
          {!loading && !data && (
            <div className="text-center py-10">
              <UserX className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">{c.notFound}</p>
            </div>
          )}

          {data && (
            <>
              {/* Ko'rsatkichlar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {tiles.map(({ Icon, label, value, color }) => (
                  <div key={label} className="rounded-xl border border-border/50 bg-surface/40 p-3">
                    <Icon className={cn("w-4 h-4 mb-1.5", color)} />
                    <div className="font-display font-bold text-xl leading-none">{value}</div>
                    <div className="text-[11px] text-muted-foreground mt-1 leading-tight">{label}</div>
                  </div>
                ))}
              </div>

              {/* Faollik */}
              {data.activity.length > 0 && (
                <section>
                  <h4 className="flex items-center gap-1.5 text-sm font-semibold mb-3">
                    <Activity className="w-4 h-4 text-neon-green" />
                    {c.sectionActivity}
                  </h4>
                  <div className="flex items-end gap-1 h-16">
                    {data.activity.map((a) => (
                      <div key={a.week} className="flex-1 flex flex-col justify-end" title={`${a.week}: ${a.count}`}>
                        <div
                          className={cn(
                            "rounded-sm w-full transition-all",
                            a.count > 0 ? "bg-neon-green/70" : "bg-surface",
                          )}
                          style={{ height: `${Math.max(a.count > 0 ? 12 : 4, (a.count / maxHafta) * 100)}%` }}
                        />
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Tugatilgan kurslar */}
              {data.courses.length > 0 && (
                <section>
                  <h4 className="flex items-center gap-1.5 text-sm font-semibold mb-3">
                    <GraduationCap className="w-4 h-4 text-neon-green" />
                    {c.sectionCourses}
                  </h4>
                  <ul className="space-y-1.5">
                    {data.courses.map((k) => (
                      <li
                        key={k.slug}
                        className="flex items-center justify-between gap-3 text-sm rounded-lg bg-surface/40 border border-border/40 px-3 py-2"
                      >
                        <span className="truncate">{k.title}</span>
                        {k.completed_at && (
                          <span className="text-xs text-muted-foreground flex-shrink-0 font-mono">
                            {formatDate(k.completed_at)}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Yutuqlar */}
              {data.achievements.length > 0 && (
                <section>
                  <h4 className="flex items-center gap-1.5 text-sm font-semibold mb-3">
                    <Trophy className="w-4 h-4 text-neon-yellow" />
                    {c.sectionAchievements}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {data.achievements.map((a) => (
                      <span
                        key={a.title}
                        className="inline-flex items-center gap-1.5 text-xs rounded-full border px-2.5 py-1"
                        style={{ borderColor: `${a.color}55`, color: a.color }}
                        title={formatDate(a.earned_at)}
                      >
                        <Trophy className="w-3 h-3" />
                        {a.title}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Tavsif — faqat portfolio ochiq bo'lsa keladi */}
              {p?.bio && (
                <section>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{p.bio}</p>
                </section>
              )}

              {data.courses.length === 0 &&
                data.achievements.length === 0 &&
                s!.topics_completed === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">{c.empty}</p>
                )}
            </>
          )}
        </div>

        {/* Pastki qism */}
        {p?.has_portfolio && p.username && (
          <div className="p-4 border-t border-border bg-surface/40">
            <Link
              href={`/u/${p.username}`}
              className="btn-primary w-full py-2.5 text-sm inline-flex items-center justify-center gap-2"
            >
              {c.openPortfolio}
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </motion.div>
    </div>,
    document.body,
  );
}
