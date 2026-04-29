/**
 * JSON-LD (Schema.org) komponentlari.
 * Universal — ham Server, ham Client Component'larda ishlaydi.
 * Har bir page'ga qo'shiladi va Google "rich result" beradi.
 */

import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, ORG_SOCIAL, absUrl } from "@/lib/seo";

function Json({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

/* =============================================================
 * 1. EducationalOrganization — bosh sahifaga
 * ============================================================= */
export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: SITE_NAME,
    alternateName: "EduCode malla.uz",
    url: SITE_URL,
    logo: absUrl("/icon-512.png"),
    description: SITE_DESCRIPTION,
    sameAs: [ORG_SOCIAL.telegram].filter(Boolean),
    address: {
      "@type": "PostalAddress",
      addressCountry: "UZ",
    },
    inLanguage: ["uz", "en"],
  };
  return <Json data={data} />;
}

/* =============================================================
 * 2. WebSite + SearchAction — bosh sahifaga
 * ============================================================= */
export function WebsiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: "uz-UZ",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/explore/courses?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
  return <Json data={data} />;
}

/* =============================================================
 * 3. Course — har bir kurs sahifasiga
 * ============================================================= */
export interface CourseJsonLdProps {
  title: string;
  description?: string | null;
  slug: string;
  thumbnailUrl?: string | null;
  difficulty?: string | null;
  estimatedHours?: number | null;
  price?: number;
  currency?: string;
  authorName?: string;
  rating?: number;
  ratingCount?: number;
  totalEnrolled?: number;
  publishedAt?: string;
  updatedAt?: string;
  language?: string;
}

export function CourseJsonLd({
  title, description, slug, thumbnailUrl, difficulty, estimatedHours,
  price = 0, currency = "UZS", authorName, rating, ratingCount, totalEnrolled,
  publishedAt, updatedAt, language = "uz",
}: CourseJsonLdProps) {
  const url = absUrl(`/courses/${slug}`);
  const data: any = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: title,
    description: description || `${title} — interaktiv onlayn kurs.`,
    url,
    inLanguage: language,
    provider: {
      "@type": "EducationalOrganization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    offers: {
      "@type": "Offer",
      price: price.toString(),
      priceCurrency: currency,
      availability: "https://schema.org/InStock",
      url,
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      ...(estimatedHours
        ? { courseWorkload: `PT${estimatedHours}H` }
        : {}),
    },
  };

  if (thumbnailUrl) data.image = thumbnailUrl;
  if (authorName) data.author = { "@type": "Person", name: authorName };
  if (difficulty) data.educationalLevel = difficulty;
  if (publishedAt) data.datePublished = publishedAt;
  if (updatedAt) data.dateModified = updatedAt;
  if (rating && ratingCount && ratingCount > 0) {
    data.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: rating.toFixed(1),
      ratingCount: ratingCount,
      bestRating: "5",
      worstRating: "1",
    };
  }

  return <Json data={data} />;
}

/* =============================================================
 * 4. BreadcrumbList — har sahifaga (har xil chuqurlikda)
 * ============================================================= */
export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: absUrl(item.url),
    })),
  };
  return <Json data={data} />;
}

/* =============================================================
 * 5. ItemList — kurs/challenge ro'yxatlari (explore)
 * ============================================================= */
export interface ItemListEntry {
  name: string;
  url: string;
}

export function ItemListJsonLd({
  items,
  name,
  description,
}: {
  items: ItemListEntry[];
  name: string;
  description?: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    description,
    numberOfItems: items.length,
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      url: absUrl(item.url),
    })),
  };
  return <Json data={data} />;
}

/* =============================================================
 * 6. FAQ — bosh sahifa yoki "About" uchun
 * ============================================================= */
export function FaqJsonLd({ items }: { items: { question: string; answer: string }[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(i => ({
      "@type": "Question",
      name: i.question,
      acceptedAnswer: { "@type": "Answer", text: i.answer },
    })),
  };
  return <Json data={data} />;
}
