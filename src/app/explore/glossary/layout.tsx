import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { ogImageUrl, absUrl } from "@/lib/seo";
import { getServerDictionary } from "@/lib/i18n/server";

export const revalidate = 3600;


export async function generateMetadata(): Promise<Metadata> {
  const t = await getServerDictionary();
  return {
    title: t.seo.glossaryTitle,
    description: t.seo.glossaryDesc,
    alternates: { canonical: absUrl("/explore/glossary") },
    openGraph: {
      title: t.seo.glossaryTitle,
      description: t.seo.glossaryDesc,
      url: absUrl("/explore/glossary"),
      type: "website",
      images: [ogImageUrl({ title: t.seo.glossaryOg, subtitle: t.seo.glossaryOgSub, type: "topic" })],
    },
    twitter: {
      card: "summary_large_image",
      title: t.seo.glossaryTitle,
      description: t.seo.glossaryDesc,
      images: [ogImageUrl({ title: t.seo.glossaryOg, subtitle: t.seo.glossaryOgSub, type: "topic" })],
    },
  };
}

export default async function GlossaryLayout({ children }: { children: React.ReactNode }) {
  const t = await getServerDictionary();
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: t.seo.homeCrumb, url: "/" },
          { name: t.seo.glossaryCrumb, url: "/explore/glossary" },
        ]}
      />
      {children}
    </>
  );
}
