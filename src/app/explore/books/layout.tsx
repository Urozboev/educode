import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { ogImageUrl, absUrl } from "@/lib/seo";

export const revalidate = 3600;

const PAGE_TITLE = "Dasturlash kitoblari — bepul yuklab olish, o'zbek tilida";
const PAGE_DESC =
  "Dasturlash, algoritmlar va kompyuter savodxonligi bo'yicha kitoblar to'plami. PDF formatida bepul yuklab oling — ro'yxatdan o'tish talab qilinmaydi.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  alternates: { canonical: absUrl("/explore/books") },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESC,
    url: absUrl("/explore/books"),
    type: "website",
    images: [ogImageUrl({ title: "Kitoblar", subtitle: "Bepul yuklab olish", type: "default" })],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESC,
    images: [ogImageUrl({ title: "Kitoblar", subtitle: "Bepul yuklab olish", type: "default" })],
  },
};

export default function BooksLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Bosh sahifa", url: "/" },
          { name: "Kitoblar", url: "/explore/books" },
        ]}
      />
      {children}
    </>
  );
}
