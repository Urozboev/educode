import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/server";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { SITE_URL, SITE_NAME, absUrl, ogImageUrl } from "@/lib/seo";
import { ArrowLeft, Clock, Eye, Calendar } from "lucide-react";
import { BlogViewCounter } from "./view-counter";

export const revalidate = 300;

interface Params { params: { slug: string }; }

async function fetchPost(slug: string) {
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();
    return data as any;
  } catch { return null; }
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const post = await fetchPost(params.slug);
  if (!post) return { title: "Maqola topilmadi", robots: { index: false, follow: false } };

  const desc = post.excerpt || `${post.title} — ${SITE_NAME} blog.`;
  const url = absUrl(`/blog/${post.slug}`);
  const og = post.cover_url || ogImageUrl({ title: post.title, subtitle: post.category, type: "default" });

  return {
    title: post.title,
    description: desc,
    keywords: post.tags,
    alternates: { canonical: url },
    openGraph: {
      title: post.title, description: desc, url, type: "article",
      publishedTime: post.published_at, authors: [post.author_name],
      images: [{ url: og, width: 1200, height: 630, alt: post.title }],
    },
    twitter: { card: "summary_large_image", title: post.title, description: desc, images: [og] },
  };
}

function fmtDate(d: string | null) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("uz-UZ", { day: "numeric", month: "long", year: "numeric" });
}

export default async function BlogPostPage({ params }: Params) {
  const post = await fetchPost(params.slug);
  if (!post) notFound();

  // Article JSON-LD
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || undefined,
    image: post.cover_url || undefined,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: { "@type": "Organization", name: post.author_name || SITE_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    mainEntityOfPage: absUrl(`/blog/${post.slug}`),
  };

  return (
    <article className="max-w-3xl mx-auto">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd).replace(/</g, "\\u003c") }} />
      <BreadcrumbJsonLd items={[{ name: "Bosh sahifa", url: "/" }, { name: "Blog", url: "/blog" }, { name: post.title, url: `/blog/${post.slug}` }]} />
      <BlogViewCounter slug={post.slug} />

      <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground mb-5 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Blogga qaytish
      </Link>

      {/* Category + meta */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-3">
        <span className="px-2.5 py-1 rounded-full bg-neon-purple/10 text-neon-purple font-semibold uppercase tracking-wide">{post.category}</span>
        <span className="inline-flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{fmtDate(post.published_at)}</span>
        <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{post.reading_minutes} daqiqa</span>
        <span className="inline-flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{post.views}</span>
      </div>

      <h1 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight leading-tight mb-4">{post.title}</h1>
      {post.excerpt && <p className="text-lg text-muted-foreground leading-relaxed mb-6">{post.excerpt}</p>}

      {/* Cover */}
      {post.cover_url && (
        <div className="rounded-2xl overflow-hidden border border-border/60 mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.cover_url} alt={post.title} className="w-full object-cover" />
        </div>
      )}

      {/* Kontent */}
      <div
        className="prose prose-invert prose-purple max-w-none
          prose-headings:font-display prose-headings:tracking-tight
          prose-p:text-[16px] prose-p:text-muted-foreground prose-p:leading-relaxed
          prose-a:text-neon-purple prose-a:font-medium hover:prose-a:underline
          prose-strong:text-foreground
          prose-code:text-neon-green prose-code:bg-surface prose-code:px-1.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
          prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-border
          prose-li:text-muted-foreground prose-li:marker:text-neon-purple/60
          prose-img:rounded-2xl prose-img:border prose-img:border-border/60
          prose-blockquote:border-l-neon-purple prose-blockquote:bg-neon-purple/[0.04] prose-blockquote:rounded-r-xl prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:not-italic"
        dangerouslySetInnerHTML={{ __html: post.content_html || "" }}
      />

      {/* Teglar */}
      {post.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-border/50">
          {post.tags.map((t: string) => (
            <span key={t} className="px-3 py-1 rounded-full text-xs font-medium bg-surface border border-border/60 text-muted-foreground">#{t}</span>
          ))}
        </div>
      )}

      {/* CTA */}
      <div className="mt-10 rounded-2xl border border-neon-purple/20 bg-gradient-to-br from-neon-purple/[0.08] to-neon-blue/[0.05] p-6 text-center">
        <p className="font-display font-bold text-lg mb-1">Dasturlashni o'rganishni boshlang</p>
        <p className="text-sm text-muted-foreground mb-4">Interaktiv kurslar, AI mentor va amaliy topshiriqlar bilan.</p>
        <Link href="/register" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-foreground text-background font-display font-bold text-sm hover:opacity-90 transition">
          Bepul boshlash
        </Link>
      </div>
    </article>
  );
}
