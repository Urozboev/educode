import type { Metadata } from "next";
import { ItemListJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { ogImageUrl, absUrl, SITE_NAME } from "@/lib/seo";
import { createAdminClient } from "@/lib/supabase/server";
import { getServerDictionary } from "@/lib/i18n/server";

export const revalidate = 1800;


export async function generateMetadata(): Promise<Metadata> {
  const t = await getServerDictionary();
  return {
    title: t.seo.challengesTitle,
    description: t.seo.challengesDesc,
    alternates: { canonical: absUrl("/explore/challenges") },
    openGraph: {
      title: t.seo.challengesTitle,
      description: t.seo.challengesDesc,
      url: absUrl("/explore/challenges"),
      type: "website",
      images: [ogImageUrl({ title: t.seo.challengesOg, subtitle: t.seo.challengesOgSub, type: "challenge" })],
    },
    twitter: {
      card: "summary_large_image",
      title: t.seo.challengesTitle,
      description: t.seo.challengesDesc,
      images: [ogImageUrl({ title: t.seo.challengesOg, subtitle: t.seo.challengesOgSub, type: "challenge" })],
    },
  };
}

async function fetchChallenges() {
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("challenges")
      .select("title, slug")
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(50);
    return data ?? [];
  } catch {
    return [];
  }
}

export default async function ExploreChallengesLayout({ children }: { children: React.ReactNode }) {
  const t = await getServerDictionary();
  const challenges = await fetchChallenges();
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: t.seo.homeCrumb, url: "/" },
          { name: t.seo.challengesCrumb, url: "/explore/challenges" },
        ]}
      />
      <ItemListJsonLd
        name={`${SITE_NAME} topshiriqlari`}
        description={t.seo.challengesDesc}
        items={challenges.map((c: any) => ({
          name: c.title,
          url: `/challenges/${c.slug}`,
        }))}
      />
      {children}
    </>
  );
}
