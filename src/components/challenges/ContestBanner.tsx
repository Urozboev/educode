"use client";

import { useState, useEffect } from "react";
import Link from "@/components/i18n/Link";
import { createClient } from "@/lib/supabase/client";
import { Trophy, ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";

/**
 * "Bu masala olimpiadaga tegishli" belgisi.
 *
 * Olimpiada masalalari `/explore/challenges` va kabinetdagi "Topshiriqlar"
 * ro'yxatida ham chiqadi — ular oddiy `challenges` yozuvlari. Odam shu
 * yo'l bilan kirib yechsa, olimpiadaga qaytish havolasi hech qayerda
 * bo'lmasdi. Endi masala tepasida olimpiada nomi va unga havola turadi.
 *
 * `contest_problems` RLS'i masalalarni faqat musobaqa boshlangandan keyin
 * ochadi, ya'ni boshlanmagan olimpiada bu yerda oshkor bo'lmaydi.
 */
export function ContestBanner({
  challengeId,
  isLoggedIn,
}: {
  challengeId: string;
  isLoggedIn: boolean;
}) {
  const { t } = useI18n();
  const supabase = createClient();
  const [items, setItems] = useState<{ letter: string; slug: string; title: string }[]>([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      const { data } = await supabase
        .from("contest_problems")
        .select("letter, contest:contests(slug, title, is_published)")
        .eq("challenge_id", challengeId);
      if (!alive || !data) return;
      setItems(
        (data as any[])
          .filter(r => r.contest?.is_published)
          .map(r => ({ letter: r.letter, slug: r.contest.slug, title: r.contest.title }))
      );
    })();
    return () => { alive = false; };
  }, [supabase, challengeId]);

  if (items.length === 0) return null;

  const base = isLoggedIn ? "/contests" : "/explore/contests";

  return (
    <div className="space-y-2">
      {items.map(c => (
        <Link
          key={c.slug + c.letter}
          href={`${base}/${c.slug}/${c.letter.toLowerCase()}`}
          className="group flex items-center gap-3 p-3.5 rounded-xl border border-neon-yellow/25 bg-neon-yellow/[0.06] hover:border-neon-yellow/50 transition-all"
        >
          <div className="w-9 h-9 rounded-xl bg-neon-yellow/10 flex items-center justify-center flex-shrink-0">
            <Trophy className="w-4.5 h-4.5 text-neon-yellow" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold truncate">{c.title}</p>
            <p className="text-xs text-muted-foreground">
              {t.store.contestBannerA} <span className="font-semibold">{c.letter}</span>{" "}
              {t.store.contestBannerB}
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-neon-yellow group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
        </Link>
      ))}
    </div>
  );
}
