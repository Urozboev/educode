import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { ogImageUrl, absUrl } from "@/lib/seo";

export const revalidate = 3600;

const PAGE_TITLE = "Dars o'yinlari — viktorina, Jeopardy va krossvord";
const PAGE_DESC = "Mavzu bo'yicha tezlik viktorinasi, Jeopardy taxtasi, juftlik o'yini va krossvord. Sinf bilan proyektorda yoki yakka tartibda o'ynash mumkin.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  alternates: { canonical: absUrl("/explore/lesson-games") },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESC,
    url: absUrl("/explore/lesson-games"),
    type: "website",
    images: [ogImageUrl({ title: "Dars o'yinlari", subtitle: "Sinfda o'ynash uchun", type: "default" })],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESC,
    images: [ogImageUrl({ title: "Dars o'yinlari", subtitle: "Sinfda o'ynash uchun", type: "default" })],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Bosh sahifa", url: "/" },
          { name: "Dars o'yinlari", url: "/explore/lesson-games" },
        ]}
      />
      {children}
    </>
  );
}
