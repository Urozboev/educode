import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { ogImageUrl, absUrl } from "@/lib/seo";
import { getServerDictionary } from "@/lib/i18n/server";

export const revalidate = 3600;


export async function generateMetadata(): Promise<Metadata> {
  const t = await getServerDictionary();
  return {
    title: t.seo.contestsTitle,
    description: t.seo.contestsDesc,
    alternates: { canonical: absUrl("/explore/contests") },
    openGraph: {
      title: t.seo.contestsTitle,
      description: t.seo.contestsDesc,
      url: absUrl("/explore/contests"),
      type: "website",
      images: [ogImageUrl({ title: t.seo.contestsOg, subtitle: t.seo.contestsOgSub, type: "challenge" })],
    },
    twitter: {
      card: "summary_large_image",
      title: t.seo.contestsTitle,
      description: t.seo.contestsDesc,
      images: [ogImageUrl({ title: t.seo.contestsOg, subtitle: t.seo.contestsOgSub, type: "challenge" })],
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
          { name: t.seo.contestsCrumb, url: "/explore/contests" },
        ]}
      />
      {children}
    </>
  );
}
