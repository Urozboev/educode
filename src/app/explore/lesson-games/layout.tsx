import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { ogImageUrl, absUrl } from "@/lib/seo";
import { getServerDictionary } from "@/lib/i18n/server";

export const revalidate = 3600;


export async function generateMetadata(): Promise<Metadata> {
  const t = await getServerDictionary();
  return {
    title: t.seo.lessonGamesTitle,
    description: t.seo.lessonGamesDesc,
    alternates: { canonical: absUrl("/explore/lesson-games") },
    openGraph: {
      title: t.seo.lessonGamesTitle,
      description: t.seo.lessonGamesDesc,
      url: absUrl("/explore/lesson-games"),
      type: "website",
      images: [ogImageUrl({ title: t.seo.lessonGamesOg, subtitle: t.seo.lessonGamesOgSub, type: "default" })],
    },
    twitter: {
      card: "summary_large_image",
      title: t.seo.lessonGamesTitle,
      description: t.seo.lessonGamesDesc,
      images: [ogImageUrl({ title: t.seo.lessonGamesOg, subtitle: t.seo.lessonGamesOgSub, type: "default" })],
    },
  };
}

export default async function Layout({ children }: { children: React.ReactNode }) {
  const t = await getServerDictionary();
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: t.seo.homeCrumb, url: "/" },
          { name: t.seo.lessonGamesCrumb, url: "/explore/lesson-games" },
        ]}
      />
      {children}
    </>
  );
}
