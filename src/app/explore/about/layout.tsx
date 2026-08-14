import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { ogImageUrl, absUrl } from "@/lib/seo";
import { getServerDictionary } from "@/lib/i18n/server";


export async function generateMetadata(): Promise<Metadata> {
  const t = await getServerDictionary();
  return {
    title: t.seo.aboutTitle,
    description: t.seo.aboutDesc,
    alternates: { canonical: absUrl("/explore/about") },
    openGraph: {
      title: t.seo.aboutTitle,
      description: t.seo.aboutDesc,
      url: absUrl("/explore/about"),
      type: "article",
      images: [ogImageUrl({ title: t.seo.aboutOg, subtitle: t.seo.aboutOgSub, type: "default" })],
    },
    twitter: {
      card: "summary_large_image",
      title: t.seo.aboutTitle,
      description: t.seo.aboutDesc,
      images: [ogImageUrl({ title: t.seo.aboutOg, subtitle: t.seo.aboutOgSub, type: "default" })],
    },
  };
}

export default async function ExploreAboutLayout({ children }: { children: React.ReactNode }) {
  const t = await getServerDictionary();
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: t.seo.homeCrumb, url: "/" },
          { name: t.seo.aboutCrumb, url: "/explore/about" },
        ]}
      />
      {children}
    </>
  );
}
