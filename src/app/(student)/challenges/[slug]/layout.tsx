import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { ogImageUrl, absUrl, SITE_NAME } from "@/lib/seo";
import { createAdminClient } from "@/lib/supabase/server";

export const revalidate = 1800;

interface Params {
  params: { slug: string };
}

async function fetchChallenge(slug: string) {
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("challenges")
      .select("title, slug, description, category, difficulty, languages, coin_reward, created_at, updated_at")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();
    return data ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const ch = await fetchChallenge(params.slug);
  if (!ch) {
    return {
      title: "Topshiriq topilmadi",
      description: "Bu topshiriq mavjud emas yoki olib tashlangan.",
      robots: { index: false, follow: false },
    };
  }

  const title = ch.title;
  const description =
    ch.description?.slice(0, 200) ||
    `${ch.title} — ${SITE_NAME} platformasidagi dasturlash topshirig'i.`;
  const url = absUrl(`/challenges/${ch.slug}`);
  const langs = (ch.languages || []).join(", ");
  const og = ogImageUrl({
    title: ch.title,
    subtitle: `${ch.difficulty || "amaliyot"}${langs ? " · " + langs : ""}`,
    type: "challenge",
  });

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      images: [{ url: og, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [og],
    },
  };
}

export default async function ChallengeLayout({
  params,
  children,
}: {
  params: { slug: string };
  children: React.ReactNode;
}) {
  const ch = await fetchChallenge(params.slug);
  return (
    <>
      {ch && (
        <BreadcrumbJsonLd
          items={[
            { name: "Bosh sahifa", url: "/" },
            { name: "Topshiriqlar", url: "/explore/challenges" },
            { name: ch.title, url: `/challenges/${ch.slug}` },
          ]}
        />
      )}
      {children}
    </>
  );
}
