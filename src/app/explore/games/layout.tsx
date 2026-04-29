import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { ogImageUrl, absUrl } from "@/lib/seo";

const PAGE_TITLE = "Dasturlash o'yinlari — kod o'rganishni o'ynab";
const PAGE_DESC =
  "EduCode'dagi dasturlash va algoritm o'yinlari. Coin yig'ing, reytingda yuksang, do'stlaringiz bilan musobaqalashing.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  alternates: { canonical: absUrl("/explore/games") },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESC,
    url: absUrl("/explore/games"),
    type: "website",
    images: [ogImageUrl({ title: "Dasturlash o'yinlari", subtitle: "Geymifikatsiyali ta'lim", type: "default" })],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESC,
    images: [ogImageUrl({ title: "Dasturlash o'yinlari", subtitle: "Geymifikatsiyali ta'lim", type: "default" })],
  },
};

export default function ExploreGamesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Bosh sahifa", url: "/" },
          { name: "O'yinlar", url: "/explore/games" },
        ]}
      />
      {children}
    </>
  );
}
