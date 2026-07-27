import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { ogImageUrl, absUrl } from "@/lib/seo";

export const revalidate = 3600;

const PAGE_TITLE = "Dasturlash olimpiadalari — onlayn musobaqalar";
const PAGE_DESC = "Belgilangan vaqtda masalalarni yeching, jonli reytingda o'rningizni kuzating. Yechilgan masala soni va jarima vaqti bo'yicha baholanadi.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  alternates: { canonical: absUrl("/explore/contests") },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESC,
    url: absUrl("/explore/contests"),
    type: "website",
    images: [ogImageUrl({ title: "Olimpiadalar", subtitle: "Onlayn musobaqalar", type: "challenge" })],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESC,
    images: [ogImageUrl({ title: "Olimpiadalar", subtitle: "Onlayn musobaqalar", type: "challenge" })],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Bosh sahifa", url: "/" },
          { name: "Olimpiada", url: "/explore/contests" },
        ]}
      />
      {children}
    </>
  );
}
