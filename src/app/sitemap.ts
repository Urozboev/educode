import type { MetadataRoute } from "next";
import { createAdminClient } from "@/lib/supabase/server";
import { SITE_URL } from "@/lib/seo";
import { LABS } from "@/lib/labs";

export const revalidate = 3600; // har soatda yangilanadi

type Item = {
  url: string;
  lastModified?: Date;
  changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
};

/**
 * /sitemap.xml — Google va boshqa qidiruv tizimlari uchun.
 * Statik sahifalar + dinamik kurs/challenge/topic ro'yxati.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // 1) Statik public sahifalar
  const staticRoutes: Item[] = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE_URL}/explore/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/explore/courses`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/explore/challenges`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/explore/games`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/explore/books`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/explore/glossary`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/explore/methods`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/explore/labs`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/explore/portfolios`, lastModified: now, changeFrequency: "daily", priority: 0.6 },
    { url: `${SITE_URL}/explore/contests`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/explore/lesson-games`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    // Laboratoriyalar reyestrdan olinadi — yangisi qo'shilsa sitemap o'zi yangilanadi
    ...LABS.map((l): Item => ({
      url: `${SITE_URL}/explore/labs/${l.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    })),
  ];

  // 2) Dinamik mazmun
  let blog: Item[] = [];
  let courses: Item[] = [];
  let challenges: Item[] = [];
  let topics: Item[] = [];
  let games: Item[] = [];
  let contests: Item[] = [];
  let portfolios: Item[] = [];

  try {
    const supabase = createAdminClient();

    // Published kurslar
    const { data: courseRows } = await supabase
      .from("courses")
      .select("slug, updated_at")
      .eq("is_published", true);

    if (courseRows) {
      courses = courseRows.map((c: any) => ({
        url: `${SITE_URL}/courses/${c.slug}`,
        lastModified: c.updated_at ? new Date(c.updated_at) : now,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));

      // Topic'lar — har course bo'yicha (preview)
      const slugs = courseRows.map((c: any) => c.slug);
      if (slugs.length) {
        const { data: topicRows } = await supabase
          .from("topics")
          .select("slug, updated_at, courses!inner(slug, is_published)")
          .eq("is_published", true)
          .eq("courses.is_published", true)
          .limit(2000);

        if (topicRows) {
          topics = (topicRows as any[]).map((t: any) => {
            const courseSlug = Array.isArray(t.courses) ? t.courses[0]?.slug : t.courses?.slug;
            return {
              url: `${SITE_URL}/courses/${courseSlug}/topics/${t.slug}`,
              lastModified: t.updated_at ? new Date(t.updated_at) : now,
              changeFrequency: "monthly" as const,
              priority: 0.6,
            };
          }).filter(t => t.url.includes("/topics/"));
        }
      }
    }

    // Published challenge'lar
    const { data: challengeRows } = await supabase
      .from("challenges")
      .select("slug, updated_at")
      .eq("is_published", true);

    if (challengeRows) {
      challenges = challengeRows.map((c: any) => ({
        url: `${SITE_URL}/challenges/${c.slug}`,
        lastModified: c.updated_at ? new Date(c.updated_at) : now,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }));
    }

    /**
     * Quyidagi uch jadval keyingi migratsiyalarda qo'shilgan. Jadval hali
     * yaratilmagan bo'lsa supabase-js xato tashlamaydi — `data` null bo'ladi
     * va bo'lim shunchaki tushib qoladi, qolgan sitemap buzilmaydi.
     */

    // Nashr qilingan dars o'yinlari
    const { data: gameRows } = await supabase
      .from("lesson_games")
      .select("slug, updated_at")
      .eq("is_published", true);
    if (gameRows) {
      games = gameRows.map((g: any) => ({
        url: `${SITE_URL}/play/${g.slug}`,
        lastModified: g.updated_at ? new Date(g.updated_at) : now,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }));
    }

    // E'lon qilingan olimpiadalar
    const { data: contestRows } = await supabase
      .from("contests")
      .select("slug, updated_at")
      .eq("is_published", true);
    if (contestRows) {
      contests = contestRows.map((c: any) => ({
        url: `${SITE_URL}/explore/contests/${c.slug}`,
        lastModified: c.updated_at ? new Date(c.updated_at) : now,
        changeFrequency: "daily" as const,
        priority: 0.7,
      }));
    }

    // Ochiq portfoliolar — faqat talaba o'zi ochganlari
    const { data: portfolioRows } = await supabase
      .from("profiles")
      .select("username, updated_at")
      .eq("is_portfolio_public", true)
      .eq("is_blocked", false)
      .not("username", "is", null)
      .limit(1000);
    if (portfolioRows) {
      portfolios = portfolioRows.map((p: any) => ({
        url: `${SITE_URL}/u/${p.username}`,
        lastModified: p.updated_at ? new Date(p.updated_at) : now,
        changeFrequency: "weekly" as const,
        priority: 0.5,
      }));
    }

    // Blog maqolalari
    const { data: blogRows } = await supabase
      .from("blog_posts")
      .select("slug, updated_at")
      .eq("is_published", true);
    if (blogRows) {
      blog = blogRows.map((b: any) => ({
        url: `${SITE_URL}/blog/${b.slug}`,
        lastModified: b.updated_at ? new Date(b.updated_at) : now,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
    }
  } catch (e) {
    console.warn("[sitemap] Supabase fetch failed:", e);
  }

  return [
    ...staticRoutes,
    ...courses, ...challenges, ...topics, ...blog,
    ...games, ...contests, ...portfolios,
  ];
}
