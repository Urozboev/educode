import type { Metadata } from "next";
import { ItemListJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { ogImageUrl, absUrl, SITE_NAME } from "@/lib/seo";
import { createAdminClient } from "@/lib/supabase/server";

export const revalidate = 1800;

const PAGE_TITLE = "Dasturlash topshiriqlari — algoritm va kod amaliyoti";
const PAGE_DESC =
  "Algoritm va dasturlash topshiriqlari to'plami. Python, JavaScript va boshqa tillarda yeching. Avtomatik test, AI Sokratik mentor va coin mukofotlari.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  alternates: { canonical: absUrl("/explore/challenges") },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESC,
    url: absUrl("/explore/challenges"),
    type: "website",
    images: [ogImageUrl({ title: "Dasturlash topshiriqlari", subtitle: "Algoritm · kod amaliyoti", type: "challenge" })],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESC,
    images: [ogImageUrl({ title: "Dasturlash topshiriqlari", subtitle: "Algoritm · kod amaliyoti", type: "challenge" })],
  },
};

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
  const challenges = await fetchChallenges();
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Bosh sahifa", url: "/" },
          { name: "Topshiriqlar", url: "/explore/challenges" },
        ]}
      />
      <ItemListJsonLd
        name={`${SITE_NAME} topshiriqlari`}
        description={PAGE_DESC}
        items={challenges.map((c: any) => ({
          name: c.title,
          url: `/challenges/${c.slug}`,
        }))}
      />
      {children}
    </>
  );
}
