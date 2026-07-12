import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/server";
import { ItemListJsonLd } from "@/components/seo/JsonLd";
import { Clock, Eye, ArrowRight, Newspaper } from "lucide-react";

export const revalidate = 300;

function fmtDate(d: string | null) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("uz-UZ", { day: "numeric", month: "long", year: "numeric" });
}

export default async function BlogListPage() {
  let posts: any[] = [];
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("blog_posts")
      .select("title, slug, excerpt, cover_url, tags, category, reading_minutes, views, published_at")
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .limit(50);
    posts = data || [];
  } catch { /* bo'sh */ }

  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <div className="space-y-8">
      <ItemListJsonLd
        name="EduCode Blog"
        description="Dasturlash va IT maqolalari"
        items={posts.map(p => ({ name: p.title, url: `/blog/${p.slug}` }))}
      />

      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-neon-purple/[0.1] via-card/60 to-neon-blue/[0.08] p-7 md:p-9">
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-neon-purple/15 blur-[80px] pointer-events-none" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-purple/10 border border-neon-purple/20 text-neon-purple text-xs font-semibold mb-3">
            <Newspaper className="w-3.5 h-3.5" /> Blog
          </div>
          <h1 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight mb-2">
            Dasturlash va IT <span className="gradient-text">maqolalari</span>
          </h1>
          <p className="text-muted-foreground max-w-lg">
            Foydali qo'llanmalar, maslahatlar va karyera yo'l-yo'riqlari — o'zbek tilida.
          </p>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20">
          <Newspaper className="w-14 h-14 text-muted-foreground/20 mx-auto mb-4" />
          <p className="text-muted-foreground">Hozircha maqola yo'q. Tez orada qo'shiladi.</p>
        </div>
      ) : (
        <>
          {/* Featured (birinchi post — katta) */}
          {featured && (
            <Link href={`/blog/${featured.slug}`}
              className="group grid md:grid-cols-2 gap-0 rounded-3xl border border-border/50 bg-card/40 overflow-hidden hover:border-neon-purple/40 hover:shadow-2xl transition-all">
              <div className="relative h-52 md:h-full min-h-[220px] overflow-hidden bg-gradient-to-br from-neon-purple/20 to-neon-blue/10">
                {featured.cover_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={featured.cover_url} alt={featured.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                )}
              </div>
              <div className="p-6 md:p-8 flex flex-col justify-center">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                  <span className="px-2 py-0.5 rounded-full bg-neon-purple/10 text-neon-purple font-semibold uppercase tracking-wide">{featured.category}</span>
                  <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" />{featured.reading_minutes} daq</span>
                </div>
                <h2 className="font-display font-extrabold text-2xl leading-tight mb-3 group-hover:text-neon-purple transition-colors">{featured.title}</h2>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{featured.excerpt}</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-bold text-neon-purple">O'qish <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
              </div>
            </Link>
          )}

          {/* Qolganlari grid */}
          {rest.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {rest.map(p => (
                <Link key={p.slug} href={`/blog/${p.slug}`}
                  className="group flex flex-col rounded-[10px] border border-border/50 bg-card/40 overflow-hidden hover:border-neon-purple/40 hover:-translate-y-1 hover:shadow-xl transition-all">
                  <div className="relative h-40 overflow-hidden bg-gradient-to-br from-neon-purple/15 to-neon-blue/10">
                    {p.cover_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.cover_url} alt={p.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    )}
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/50 text-white backdrop-blur-sm uppercase tracking-wide">{p.category}</span>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-display font-bold text-lg leading-snug mb-2 group-hover:text-neon-purple transition-colors line-clamp-2">{p.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{p.excerpt}</p>
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground mt-auto pt-3 border-t border-border/50">
                      <span>{fmtDate(p.published_at)}</span>
                      <span className="flex items-center gap-2.5">
                        <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" />{p.reading_minutes} daq</span>
                        <span className="inline-flex items-center gap-1"><Eye className="w-3 h-3" />{p.views}</span>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
