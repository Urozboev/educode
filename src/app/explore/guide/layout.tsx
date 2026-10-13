import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { ogImageUrl, absUrl } from "@/lib/seo";
import { getServerDictionary } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getServerDictionary();
  const og = ogImageUrl({ title: t.nav.guide, subtitle: t.guide.title, type: "default" });
  return {
    title: t.guide.title,
    description: t.guide.subtitle,
    alternates: { canonical: absUrl("/explore/guide") },
    openGraph: {
      title: t.guide.title,
      description: t.guide.subtitle,
      url: absUrl("/explore/guide"),
      type: "article",
      images: [og],
    },
    twitter: { card: "summary_large_image", title: t.guide.title, description: t.guide.subtitle, images: [og] },
  };
}

export default async function GuideLayout({ children }: { children: React.ReactNode }) {
  const t = await getServerDictionary();
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: t.seo.homeCrumb, url: "/" },
          { name: t.nav.guide, url: "/explore/guide" },
        ]}
      />
      {children}
    </>
  );
}
