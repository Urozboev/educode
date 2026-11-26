import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Öyinga kiriş",
  description: "Öqituvçi bergan PIN kod bilan dars öyiniga qöşiling.",
  robots: { index: false, follow: false },
};

/**
 * Jonli o'yin ekrani telefonda ochiladi va butun ekranni egallashi kerak —
 * shuning uchun na navbar, na yon menyu.
 */
export default function LiveLayout({ children }: { children: React.ReactNode }) {
  return <main className="min-h-[100dvh]">{children}</main>;
}
