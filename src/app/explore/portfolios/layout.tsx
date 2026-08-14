import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { ogImageUrl, absUrl } from "@/lib/seo";
import { getServerDictionary } from "@/lib/i18n/server";

export const revalidate = 3600;


export async function generateMetadata(): Promise<Metadata> {
  const t = await getServerDictionary();
  return {
    title: t.seo.portfoliosTitle,
    description: t.seo.portfoliosDesc,
    alternates: { canonical: absUrl("/explore/portfolios") },
    openGraph: {
      title: t.seo.portfoliosTitle,
      description: t.seo.portfoliosDesc,
      url: absUrl("/explore/portfolios"),
      type: "website",
      images: [ogImageUrl({ title: t.seo.portfoliosOg, subtitle: t.seo.portfoliosOgSub, type: "default" })],
    },
    twitter: {
      card: "summary_large_image",
      title: t.seo.portfoliosTitle,
      description: t.seo.portfoliosDesc,
      images: [ogImageUrl({ title: t.seo.portfoliosOg, subtitle: t.seo.portfoliosOgSub, type: "default" })],
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
          { name: t.seo.portfoliosCrumb, url: "/explore/portfolios" },
        ]}
      />
      {children}
    </>
  );
}
