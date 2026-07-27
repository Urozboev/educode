import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { ogImageUrl, absUrl } from "@/lib/seo";

export const revalidate = 3600;

const PAGE_TITLE = "Dars metodlari — informatika o'qituvchisi uchun yo'riqnoma";
const PAGE_DESC =
  "Interaktiv dars metodlari: qadamma-qadam yo'riqnoma, afzallik va kamchiliklari, kerakli materiallar va davomiyligi. Dars bosqichiga qarab tanlang.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  alternates: { canonical: absUrl("/explore/methods") },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESC,
    url: absUrl("/explore/methods"),
    type: "website",
    images: [ogImageUrl({ title: "Dars metodlari", subtitle: "O'qituvchiga yordam", type: "default" })],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESC,
    images: [ogImageUrl({ title: "Dars metodlari", subtitle: "O'qituvchiga yordam", type: "default" })],
  },
};

export default function MethodsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Bosh sahifa", url: "/" },
          { name: "Metodlar", url: "/explore/methods" },
        ]}
      />
      {children}
    </>
  );
}
