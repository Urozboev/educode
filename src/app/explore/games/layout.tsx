import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { ogImageUrl, absUrl } from "@/lib/seo";
import { getServerDictionary } from "@/lib/i18n/server";


export async function generateMetadata(): Promise<Metadata> {
  const t = await getServerDictionary();
  return {
    title: t.seo.gamesTitle,
    description: t.seo.gamesDesc,
    alternates: { canonical: absUrl("/explore/games") },
    openGraph: {
      title: t.seo.gamesTitle,
      description: t.seo.gamesDesc,
      url: absUrl("/explore/games"),
      type: "website",
      images: [ogImageUrl({ title: t.seo.gamesOg, subtitle: t.seo.gamesOgSub, type: "default" })],
    },
    twitter: {
      card: "summary_large_image",
      title: t.seo.gamesTitle,
      description: t.seo.gamesDesc,
      images: [ogImageUrl({ title: t.seo.gamesOg, subtitle: t.seo.gamesOgSub, type: "default" })],
    },
  };
}

export default async function ExploreGamesLayout({ children }: { children: React.ReactNode }) {
  const t = await getServerDictionary();
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: t.seo.homeCrumb, url: "/" },
          { name: t.seo.gamesCrumb, url: "/explore/games" },
        ]}
      />
      {children}
    </>
  );
}
