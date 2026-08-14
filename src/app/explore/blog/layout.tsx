import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { ogImageUrl, absUrl } from "@/lib/seo";
import { getServerDictionary } from "@/lib/i18n/server";


export async function generateMetadata(): Promise<Metadata> {
  const t = await getServerDictionary();
  return {
    title: t.seo.blogTitle,
    description: t.seo.blogDesc,
    alternates: { canonical: absUrl("/blog") },
    openGraph: {
      title: t.seo.blogTitle,
      description: t.seo.blogDesc,
      url: absUrl("/blog"),
      type: "website",
      images: [ogImageUrl({ title: t.seo.blogOg, subtitle: t.seo.blogOgSub, type: "default" })],
    },
  };
}

export default async function BlogListLayout({ children }: { children: React.ReactNode }) {
  const t = await getServerDictionary();
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: t.seo.homeCrumb, url: "/" }, { name: "Blog", url: "/blog" }]} />
      {children}
    </>
  );
}
