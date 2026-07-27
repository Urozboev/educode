import type { Metadata } from "next";
import { ogImageUrl, absUrl, SITE_NAME } from "@/lib/seo";
import { createAdminClient } from "@/lib/supabase/server";

export const revalidate = 600;

interface Params {
  params: { username: string };
}

/**
 * Portfolio havolasi tashqariga ulashiladi — Telegram, LinkedIn, elektron xat.
 * Shuning uchun sarlavha va tavsif dinamik: havola ko'chirilganda talabaning
 * ismi va qisqa tavsifi ko'rinadi, "EduCode" degan quruq matn emas.
 *
 * Yopiq portfolio uchun metadata umumiy bo'ladi va indekslanmaydi —
 * yopiq profil qidiruvda chiqib qolmasligi kerak.
 */
async function fetchProfile(username: string) {
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("profiles")
      .select("full_name, username, headline, bio, avatar_url, is_portfolio_public, is_blocked")
      .eq("username", username)
      .maybeSingle();
    if (!data || data.is_blocked || !data.is_portfolio_public) return null;
    return data;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const p = await fetchProfile(params.username);

  if (!p) {
    return {
      title: "Portfolio",
      description: "Bu portfolio mavjud emas yoki yopiq.",
      robots: { index: false, follow: false },
    };
  }

  const title = `${p.full_name} — portfolio`;
  const description =
    p.headline ||
    p.bio?.slice(0, 155) ||
    `${p.full_name}ning ${SITE_NAME} platformasidagi o'quv natijalari, sertifikatlari va loyihalari.`;
  const url = absUrl(`/u/${p.username}`);
  const og = ogImageUrl({
    title: p.full_name,
    subtitle: p.headline || "Talaba portfoliosi",
    type: "default",
  });

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "profile",
      images: [og],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [og],
    },
  };
}

export default function PublicProfileSlugLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
