import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { ogImageUrl, absUrl } from "@/lib/seo";
import { getServerDictionary } from "@/lib/i18n/server";

export const revalidate = 3600;


export async function generateMetadata(): Promise<Metadata> {
  const t = await getServerDictionary();
  return {
    title: t.seo.methodsTitle,
    description: t.seo.methodsDesc,
    alternates: { canonical: absUrl("/explore/methods") },
    openGraph: {
      title: t.seo.methodsTitle,
      description: t.seo.methodsDesc,
      url: absUrl("/explore/methods"),
      type: "website",
      images: [ogImageUrl({ title: t.seo.methodsOg, subtitle: t.seo.methodsOgSub, type: "default" })],
    },
    twitter: {
      card: "summary_large_image",
      title: t.seo.methodsTitle,
      description: t.seo.methodsDesc,
      images: [ogImageUrl({ title: t.seo.methodsOg, subtitle: t.seo.methodsOgSub, type: "default" })],
    },
  };
}

export default async function MethodsLayout({ children }: { children: React.ReactNode }) {
  const t = await getServerDictionary();
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: t.seo.homeCrumb, url: "/" },
          { name: t.seo.methodsCrumb, url: "/explore/methods" },
        ]}
      />
      {children}
    </>
  );
}
