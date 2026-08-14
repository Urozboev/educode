import type { Metadata } from "next";
import { ItemListJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { ogImageUrl, absUrl, SITE_NAME } from "@/lib/seo";
import { createAdminClient } from "@/lib/supabase/server";
import { getServerDictionary } from "@/lib/i18n/server";

export const revalidate = 1800; // 30 daqiqada yangilanadi


export async function generateMetadata(): Promise<Metadata> {
  const t = await getServerDictionary();
  return {
    title: t.seo.coursesTitle,
    description: t.seo.coursesDesc,
    alternates: { canonical: absUrl("/explore/courses") },
    openGraph: {
      title: t.seo.coursesTitle,
      description: t.seo.coursesDesc,
      url: absUrl("/explore/courses"),
      type: "website",
      images: [ogImageUrl({ title: t.seo.coursesOg, subtitle: t.seo.coursesOgSub, type: "course" })],
    },
    twitter: {
      card: "summary_large_image",
      title: t.seo.coursesTitle,
      description: t.seo.coursesDesc,
      images: [ogImageUrl({ title: t.seo.coursesOg, subtitle: t.seo.coursesOgSub, type: "course" })],
    },
  };
}

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
  const t = await getServerDictionary();
  const courses = await fetchCourses();
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: t.seo.homeCrumb, url: "/" },
          { name: t.seo.coursesCrumb, url: "/explore/courses" },
        ]}
      />
      <ItemListJsonLd
        name={`${SITE_NAME} kurslari`}
        description={t.seo.coursesDesc}
        items={courses.map((c: any) => ({
          name: c.title,
          url: `/courses/${c.slug}`,
        }))}
      />
      {children}
    </>
  );
}
