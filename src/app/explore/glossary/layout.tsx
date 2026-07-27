import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { ogImageUrl, absUrl } from "@/lib/seo";

export const revalidate = 3600;

const PAGE_TITLE = "IT terminlar lug'ati — o'zbek tilida ta'riflar va flash-cardlar";
const PAGE_DESC =
  "Dasturlash, frontend, algoritmlar va kompyuter savodxonligi terminlari o'zbek tilida. Har bir termin uchun sodda ta'rif, misol va kartochkalar rejimi.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  alternates: { canonical: absUrl("/explore/glossary") },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESC,
    url: absUrl("/explore/glossary"),
    type: "website",
    images: [ogImageUrl({ title: "Terminlar lug'ati", subtitle: "Flash-cardlar bilan", type: "topic" })],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESC,
    images: [ogImageUrl({ title: "Terminlar lug'ati", subtitle: "Flash-cardlar bilan", type: "topic" })],
  },
};

export default function GlossaryLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Bosh sahifa", url: "/" },
          { name: "Terminlar", url: "/explore/glossary" },
        ]}
      />
      {children}
    </>
  );
}
