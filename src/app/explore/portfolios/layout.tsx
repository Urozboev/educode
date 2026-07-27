import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { ogImageUrl, absUrl } from "@/lib/seo";

export const revalidate = 3600;

const PAGE_TITLE = "Talabalar portfoliosi — ishlar, sertifikatlar va natijalar";
const PAGE_DESC = "EduCode platformasida o'qiyotgan talabalarning loyihalari, sertifikatlari va o'quv natijalari. Har bir portfolio ochiq havola orqali ko'riladi.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  alternates: { canonical: absUrl("/explore/portfolios") },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESC,
    url: absUrl("/explore/portfolios"),
    type: "website",
    images: [ogImageUrl({ title: "Talabalar portfoliosi", subtitle: "Ishlar va natijalar", type: "default" })],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESC,
    images: [ogImageUrl({ title: "Talabalar portfoliosi", subtitle: "Ishlar va natijalar", type: "default" })],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Bosh sahifa", url: "/" },
          { name: "Portfoliolar", url: "/explore/portfolios" },
        ]}
      />
      {children}
    </>
  );
}
