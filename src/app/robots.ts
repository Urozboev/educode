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
        allow: ["/"],
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
          "/challenges/",       // login talab qiladigan instance'lar (slug bilan) — ehtiyotkorlik
          "/courses/",          // login talab qiladigan content (slug bilan)
          "/t-",                // teacher panellari (t-dashboard, t-students, ...)
          "/login",
          "/register",
          "/forgot-password",
          "/verify-email",
          "/playground",
          "/placement-test",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: ["/", "/explore/", "/explore/courses", "/explore/challenges", "/explore/games", "/explore/about"],
        disallow: ["/api/", "/dashboard", "/profile", "/t-"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
