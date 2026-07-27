import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { ogImageUrl, absUrl } from "@/lib/seo";

export const revalidate = 3600;

const PAGE_TITLE = "Virtual laboratoriyalar — algoritm va kompyuter vizualizatorlari";
const PAGE_DESC = "Saralash algoritmlari, sikl va shartlar, ikkilik sanoq sistemasi va kompyuter qurilmalari bo'yicha interaktiv laboratoriyalar. Qadamma-qadam kuzating va o'zingiz sinab ko'ring.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  alternates: { canonical: absUrl("/explore/labs") },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESC,
    url: absUrl("/explore/labs"),
    type: "website",
    images: [ogImageUrl({ title: "Virtual laboratoriyalar", subtitle: "Interaktiv vizualizatorlar", type: "topic" })],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESC,
    images: [ogImageUrl({ title: "Virtual laboratoriyalar", subtitle: "Interaktiv vizualizatorlar", type: "topic" })],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Bosh sahifa", url: "/" },
          { name: "Laboratoriyalar", url: "/explore/labs" },
        ]}
      />
      {children}
    </>
  );
}
