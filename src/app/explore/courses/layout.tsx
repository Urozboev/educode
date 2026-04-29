import type { Metadata } from "next";
import { ItemListJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { ogImageUrl, absUrl, SITE_NAME } from "@/lib/seo";
import { createAdminClient } from "@/lib/supabase/server";

export const revalidate = 1800; // 30 daqiqada yangilanadi

const PAGE_TITLE = "Onlayn dasturlash kurslari — bepul, o'zbek tilida";
const PAGE_DESC =
  "EduCode'dagi barcha dasturlash kurslari ro'yxati. Python, JavaScript, HTML/CSS, algoritmlar va prompt engineering — interaktiv darslar, AI mentor va sertifikat bilan.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  alternates: { canonical: absUrl("/explore/courses") },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESC,
    url: absUrl("/explore/courses"),
    type: "website",
    images: [ogImageUrl({ title: "Dasturlash kurslari", subtitle: "Bepul · o'zbek tilida", type: "course" })],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESC,
    images: [ogImageUrl({ title: "Dasturlash kurslari", subtitle: "Bepul · o'zbek tilida", type: "course" })],
  },
};

async function fetchCourses() {
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("courses")
      .select("title, slug")
      .eq("is_published", true)
      .order("order_index")
      .limit(50);
    return data ?? [];
  } catch {
    return [];
  }
}

export default async function ExploreCoursesLayout({ children }: { children: React.ReactNode }) {
  const courses = await fetchCourses();
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Bosh sahifa", url: "/" },
          { name: "Kurslar", url: "/explore/courses" },
        ]}
      />
      <ItemListJsonLd
        name={`${SITE_NAME} kurslari`}
        description={PAGE_DESC}
        items={courses.map((c: any) => ({
          name: c.title,
          url: `/courses/${c.slug}`,
        }))}
      />
      {children}
    </>
  );
}
