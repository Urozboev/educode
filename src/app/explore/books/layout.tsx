import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { ogImageUrl, absUrl } from "@/lib/seo";
import { getServerDictionary } from "@/lib/i18n/server";

export const revalidate = 3600;


export async function generateMetadata(): Promise<Metadata> {
  const t = await getServerDictionary();
  return {
    title: t.seo.booksTitle,
    description: t.seo.booksDesc,
    alternates: { canonical: absUrl("/explore/books") },
    openGraph: {
      title: t.seo.booksTitle,
      description: t.seo.booksDesc,
      url: absUrl("/explore/books"),
      type: "website",
      images: [ogImageUrl({ title: t.seo.booksOg, subtitle: t.seo.booksOgSub, type: "default" })],
    },
    twitter: {
      card: "summary_large_image",
      title: t.seo.booksTitle,
      description: t.seo.booksDesc,
      images: [ogImageUrl({ title: t.seo.booksOg, subtitle: t.seo.booksOgSub, type: "default" })],
    },
  };
}

export default async function BooksLayout({ children }: { children: React.ReactNode }) {
  const t = await getServerDictionary();
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: t.seo.homeCrumb, url: "/" },
          { name: t.seo.booksCrumb, url: "/explore/books" },
        ]}
      />
      {children}
    </>
  );
}
