import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { ogImageUrl, absUrl } from "@/lib/seo";
import { getServerDictionary } from "@/lib/i18n/server";

export const revalidate = 3600;


export async function generateMetadata(): Promise<Metadata> {
  const t = await getServerDictionary();
  return {
    title: t.seo.labsTitle,
    description: t.seo.labsDesc,
    alternates: { canonical: absUrl("/explore/labs") },
    openGraph: {
      title: t.seo.labsTitle,
      description: t.seo.labsDesc,
      url: absUrl("/explore/labs"),
      type: "website",
      images: [ogImageUrl({ title: t.seo.labsOg, subtitle: t.seo.labsOgSub, type: "topic" })],
    },
    twitter: {
      card: "summary_large_image",
      title: t.seo.labsTitle,
      description: t.seo.labsDesc,
      images: [ogImageUrl({ title: t.seo.labsOg, subtitle: t.seo.labsOgSub, type: "topic" })],
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
          { name: t.seo.labsCrumb, url: "/explore/labs" },
        ]}
      />
      {children}
    </>
  );
}
