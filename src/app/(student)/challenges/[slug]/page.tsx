"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "@/components/i18n/Link";
import { createClient } from "@/lib/supabase/client";
import { useI18n } from "@/lib/i18n";
import { withTranslation } from "@/lib/i18n/content";
import type { Challenge } from "@/types";
import { ArrowLeft } from "lucide-react";
import { ChallengeSolver } from "@/components/challenges/ChallengeSolver";
import { ContestBanner } from "@/components/challenges/ContestBanner";

export default function ChallengeDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const supabase = createClient();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { locale } = useI18n();

  useEffect(() => {
    (async () => {
      const [{ data: ch }, { data: { user } }] = await Promise.all([
        supabase.from("challenges").select("*").eq("slug", slug).eq("is_published", true).maybeSingle(),
        supabase.auth.getUser(),
      ]);
      if (ch) setChallenge(await withTranslation(supabase, "challenges", ch as Challenge, locale));
      if (user) setUserId(user.id);
      setLoading(false);
    })();
  }, [slug, supabase, locale]);

  if (loading || !challenge) return <div className="glass-card h-96 animate-pulse" />;

  return (
    <div className="space-y-6">
      <Link
        href={userId ? "/challenges" : "/explore/challenges"}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="w-4 h-4" /> Topshiriqlar
      </Link>

      {/* Masala olimpiadaga tegishli bo'lsa — unga qaytish havolasi */}
      <ContestBanner challengeId={challenge.id} isLoggedIn={!!userId} />

      <ChallengeSolver
        challenge={challenge}
        userId={userId}
        loginRedirect={`/challenges/${slug}`}
      />
    </div>
  );
}
