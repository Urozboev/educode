import type { MetadataRoute } from "next";
import { createAdminClient } from "@/lib/supabase/server";
import { SITE_URL } from "@/lib/seo";

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
  ];

  // 2) Dinamik mazmun
  let courses: Item[] = [];
  let challenges: Item[] = [];
  let topics: Item[] = [];

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
  } catch (e) {
    console.warn("[sitemap] Supabase fetch failed:", e);
  }

  return [...staticRoutes, ...courses, ...challenges, ...topics];
}
