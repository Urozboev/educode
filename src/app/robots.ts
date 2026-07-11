import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/**
 * /robots.txt — qaysi sahifalarni indekslash mumkin / mumkin emas.
 * Auth sahifalari, API endpointlari va shaxsiy panellar bloklanadi.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/explore/",
          "/courses/",          // /courses/[slug] — public preview
          "/challenges/",       // /challenges/[slug] — public preview
        ],
        disallow: [
          "/api/",
          "/dashboard",
          "/profile",
          "/store",
          "/my-results",
          "/leaderboard",
          "/certificate/",
          "/chat",
          "/games",
          "/courses/*/topics/", // mavzu darslari auth talab qiladi
          "/t-",                // teacher panellari
          "/a-",                // admin panellari
          "/p-",                // ota-ona panellari
          "/login",
          "/register",
          "/forgot-password",
          "/verify-email",
          "/playground",
          "/placement-test",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
