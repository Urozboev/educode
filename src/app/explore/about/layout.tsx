import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { ogImageUrl, absUrl } from "@/lib/seo";

const PAGE_TITLE = "Platforma haqida — EduCode (malla.uz)";
const PAGE_DESC =
  "EduCode — Sokratik AI mentor, akademik halollik va gamifikatsiya bilan dasturlashni o'zbek tilida o'rgatuvchi platforma. Pedagogik missiya va texnik arxitektura.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  alternates: { canonical: absUrl("/explore/about") },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESC,
    url: absUrl("/explore/about"),
    type: "article",
    images: [ogImageUrl({ title: "Platforma haqida", subtitle: "EduCode — pedagogik missiya", type: "default" })],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESC,
    images: [ogImageUrl({ title: "Platforma haqida", subtitle: "EduCode — pedagogik missiya", type: "default" })],
  },
};

export default function ExploreAboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Bosh sahifa", url: "/" },
          { name: "Platforma haqida", url: "/explore/about" },
        ]}
      />
      {children}
    </>
  );
}
