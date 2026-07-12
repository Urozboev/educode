import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { ogImageUrl, absUrl } from "@/lib/seo";

const PAGE_TITLE = "Blog — dasturlash va IT bo'yicha maqolalar";
const PAGE_DESC =
  "Dasturlash, kompyuter savodxonligi, sun'iy intellekt va IT karyera bo'yicha foydali maqolalar. EduCode jamoasidan o'zbek tilida.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  alternates: { canonical: absUrl("/blog") },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESC,
    url: absUrl("/blog"),
    type: "website",
    images: [ogImageUrl({ title: "EduCode Blog", subtitle: "Dasturlash va IT maqolalari", type: "default" })],
  },
};

export default function BlogListLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Bosh sahifa", url: "/" }, { name: "Blog", url: "/blog" }]} />
      {children}
    </>
  );
}
