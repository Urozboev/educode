import type { Metadata } from "next";
import { ogImageUrl, absUrl, SITE_NAME } from "@/lib/seo";
import { createAdminClient } from "@/lib/supabase/server";
import { gameTypeLabel } from "@/lib/lessonGames";
import type { LessonGameType } from "@/types";
import { cached, CACHE_TAGS } from "@/lib/cache";

export const revalidate = 600;

interface Params {
  params: { slug: string };
}

/**
 * O'yin havolasi darsda ulashiladi — o'qituvchi guruhga tashlaydi yoki
 * proyektorda ochadi. Sarlavhada o'yin nomi va turi ko'rinsin.
 */
const fetchGame = cached(
  async (slug: string) => {
    try {
      const supabase = createAdminClient();
      const { data } = await supabase
        .from("lesson_games")
        .select("title, slug, description, type, is_published")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();
      return data ?? null;
    } catch {
      return null;
    }
  },
  "lesson-game-meta",
  { revalidate: 600, tags: [CACHE_TAGS.games] },
);

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const g = await fetchGame(params.slug);

  if (!g) {
    return {
      title: "O'yin topilmadi",
      description: "Bu o'yin mavjud emas yoki hali nashr qilinmagan.",
      robots: { index: false, follow: false },
    };
  }

  const kind = gameTypeLabel(g.type as LessonGameType);
  const title = `${g.title} — ${kind}`;
  const description =
    g.description ||
    `${g.title}: ${SITE_NAME} platformasidagi interaktiv dars o'yini. Ro'yxatdan o'tmasdan o'ynash mumkin.`;
  const url = absUrl(`/play/${g.slug}`);
  const og = ogImageUrl({ title: g.title, subtitle: kind, type: "default" });

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website", images: [og] },
    twitter: { card: "summary_large_image", title, description, images: [og] },
  };
}

export default function PlaySlugLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
