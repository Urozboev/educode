-- ============================================
-- EduCode — Blog (SEO / organik traffik uchun)
-- blog_posts jadvali + RLS + view counter RPC
-- Supabase SQL Editor da ishga tushiring.
-- ============================================

CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,                                   -- qisqa tavsif (meta description + karta)
  content_html TEXT,                              -- to'liq maqola (RichTextEditor)
  cover_url TEXT,
  tags TEXT[] DEFAULT '{}',
  category TEXT DEFAULT 'umumiy',
  author_name TEXT DEFAULT 'EduCode',
  reading_minutes INT DEFAULT 5,
  views INT NOT NULL DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS blog_posts_published_idx ON blog_posts(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS blog_posts_slug_idx ON blog_posts(slug);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Nashr qilinganlar hammaga; admin hammasini ko'radi va yozadi
CREATE POLICY "blog_public_read" ON blog_posts FOR SELECT USING (
  is_published = true
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "blog_admin_all" ON blog_posts FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE TRIGGER blog_posts_updated_at BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Ko'rishlar hisoblagichi (anonim ham oshira oladi)
CREATE OR REPLACE FUNCTION increment_blog_view(p_slug TEXT)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE blog_posts SET views = views + 1 WHERE slug = p_slug AND is_published = true;
$$;
