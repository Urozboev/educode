import type { Metadata } from "next";
import { CourseJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { ogImageUrl, absUrl, SITE_NAME } from "@/lib/seo";
import { createAdminClient } from "@/lib/supabase/server";

export const revalidate = 1800;

interface Params {
  params: { slug: string };
}

async function fetchCourse(slug: string) {
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("courses")
      .select(
        "title, slug, description, long_description, thumbnail_url, difficulty, estimated_hours, is_free, price_coins, average_rating, total_enrolled, created_at, updated_at, is_published",
      )
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();
    return data ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const course = await fetchCourse(params.slug);
  if (!course) {
    return {
      title: "Kurs topilmadi",
      description: "Bu kurs mavjud emas yoki olib tashlangan.",
      robots: { index: false, follow: false },
    };
  }

  const title = course.title;
  const description =
    course.description ||
    `${course.title} — ${SITE_NAME} platformasidagi interaktiv onlayn kurs.`;
  const url = absUrl(`/courses/${course.slug}`);
  const og = course.thumbnail_url || ogImageUrl({
    title: course.title,
    subtitle: course.description?.slice(0, 100) || "Interaktiv onlayn kurs",
    type: "course",
  });

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      images: [{ url: og, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [og],
    },
  };
}

export default async function CourseLayout({
  params,
  children,
}: {
  params: { slug: string };
  children: React.ReactNode;
}) {
  const course = await fetchCourse(params.slug);

  return (
    <>
      {course && (
        <>
          <BreadcrumbJsonLd
            items={[
              { name: "Bosh sahifa", url: "/" },
              { name: "Kurslar", url: "/explore/courses" },
              { name: course.title, url: `/courses/${course.slug}` },
            ]}
          />
          <CourseJsonLd
            title={course.title}
            description={course.description}
            slug={course.slug}
            thumbnailUrl={course.thumbnail_url}
            difficulty={course.difficulty}
            estimatedHours={course.estimated_hours}
            price={course.is_free ? 0 : course.price_coins}
            currency="UZS"
            rating={course.average_rating}
            ratingCount={course.total_enrolled}
            totalEnrolled={course.total_enrolled}
            publishedAt={course.created_at}
            updatedAt={course.updated_at}
          />
        </>
      )}
      {children}
    </>
  );
}
