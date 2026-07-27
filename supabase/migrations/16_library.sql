-- ============================================
-- EduCode — Kutubxona bloki (1-bosqich)
--   books            — kitoblar (PDF yuklab olish, login talab qilmaydi)
--   glossary_terms   — terminlar lug'ati (flash-card rejimi bilan)
--   teaching_methods — o'qituvchi uchun metodlar yo'riqnomasi
-- Uchalasi ham ommaviy o'qiladi, faqat admin yozadi.
-- Supabase SQL Editor da ishga tushiring.
-- ============================================

-- ============================================
-- 1. KITOBLAR
-- ============================================
CREATE TABLE IF NOT EXISTS books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  author TEXT,
  description TEXT,
  cover_url TEXT,
  -- Fayl Supabase Storage'da (`books` bucket) yoki tashqi havolada bo'lishi mumkin
  file_url TEXT NOT NULL,
  file_size_bytes BIGINT,
  file_type TEXT DEFAULT 'pdf' CHECK (file_type IN ('pdf','epub','djvu','doc','link')),
  page_count INT,
  language TEXT DEFAULT 'uz' CHECK (language IN ('uz','ru','en')),
  category TEXT NOT NULL DEFAULT 'programming',
  tags TEXT[] DEFAULT '{}',
  publisher TEXT,
  published_year INT,
  downloads INT NOT NULL DEFAULT 0,
  order_index INT DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS books_published_idx ON books(is_published, order_index, created_at DESC);
CREATE INDEX IF NOT EXISTS books_category_idx ON books(category);
CREATE INDEX IF NOT EXISTS books_slug_idx ON books(slug);

ALTER TABLE books ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "books_public_read" ON books;
CREATE POLICY "books_public_read" ON books FOR SELECT USING (
  is_published = true
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS "books_admin_all" ON books;
CREATE POLICY "books_admin_all" ON books FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

DROP TRIGGER IF EXISTS books_updated_at ON books;
CREATE TRIGGER books_updated_at BEFORE UPDATE ON books
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Yuklab olishlar hisoblagichi (anonim ham oshira oladi — login talab qilinmaydi)
CREATE OR REPLACE FUNCTION increment_book_download(p_slug TEXT)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE books SET downloads = downloads + 1 WHERE slug = p_slug AND is_published = true;
$$;

-- ============================================
-- 2. TERMINLAR LUG'ATI (GLOSSARY)
-- ============================================
CREATE TABLE IF NOT EXISTS glossary_terms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  term TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  -- Qisqa ta'rif — flash-card orqa tomonida va ro'yxatda shu ko'rinadi
  definition TEXT NOT NULL,
  -- Kengaytirilgan izoh (ixtiyoriy, RichTextEditor)
  details_html TEXT,
  example TEXT,
  -- Inglizcha muqobili — IT terminlarining aksari inglizchadan kirgan
  term_en TEXT,
  synonyms TEXT[] DEFAULT '{}',
  category TEXT NOT NULL DEFAULT 'programming',
  difficulty TEXT DEFAULT 'beginner' CHECK (difficulty IN ('beginner','intermediate','advanced')),
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS glossary_published_idx ON glossary_terms(is_published, term);
CREATE INDEX IF NOT EXISTS glossary_category_idx ON glossary_terms(category);
CREATE INDEX IF NOT EXISTS glossary_slug_idx ON glossary_terms(slug);

ALTER TABLE glossary_terms ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "glossary_public_read" ON glossary_terms;
CREATE POLICY "glossary_public_read" ON glossary_terms FOR SELECT USING (
  is_published = true
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS "glossary_admin_all" ON glossary_terms;
CREATE POLICY "glossary_admin_all" ON glossary_terms FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

DROP TRIGGER IF EXISTS glossary_terms_updated_at ON glossary_terms;
CREATE TRIGGER glossary_terms_updated_at BEFORE UPDATE ON glossary_terms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- 3. O'QITISH METODLARI
-- ============================================
CREATE TABLE IF NOT EXISTS teaching_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  summary TEXT NOT NULL,
  -- Qadamma-qadam yo'riqnoma (RichTextEditor)
  guide_html TEXT,
  advantages TEXT[] DEFAULT '{}',
  disadvantages TEXT[] DEFAULT '{}',
  -- Kerakli materiallar: doska, stiker, kompyuter...
  materials TEXT[] DEFAULT '{}',
  duration_minutes INT,
  -- Guruh hajmi: 'individual' | 'small' (2-6) | 'class' (10-30) | 'any'
  group_size TEXT DEFAULT 'any' CHECK (group_size IN ('individual','small','class','any')),
  -- Qaysi bosqichda qo'llanadi: 'warmup' | 'explain' | 'practice' | 'assess' | 'reflect'
  stage TEXT DEFAULT 'practice' CHECK (stage IN ('warmup','explain','practice','assess','reflect')),
  order_index INT DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS methods_published_idx ON teaching_methods(is_published, order_index);
CREATE INDEX IF NOT EXISTS methods_slug_idx ON teaching_methods(slug);

ALTER TABLE teaching_methods ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "methods_public_read" ON teaching_methods;
CREATE POLICY "methods_public_read" ON teaching_methods FOR SELECT USING (
  is_published = true
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','teacher'))
);

DROP POLICY IF EXISTS "methods_admin_all" ON teaching_methods;
CREATE POLICY "methods_admin_all" ON teaching_methods FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

DROP TRIGGER IF EXISTS teaching_methods_updated_at ON teaching_methods;
CREATE TRIGGER teaching_methods_updated_at BEFORE UPDATE ON teaching_methods
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- 4. KITOB FAYLLARI UCHUN STORAGE BUCKET
-- ============================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'books',
  'books',
  true,
  52428800,                                       -- 50MB
  ARRAY[
    'application/pdf',
    'application/epub+zip',
    'image/vnd.djvu',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY[
    'application/pdf',
    'application/epub+zip',
    'image/vnd.djvu',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

DROP POLICY IF EXISTS "books_files_public_read" ON storage.objects;
CREATE POLICY "books_files_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'books');

DROP POLICY IF EXISTS "books_files_admin_insert" ON storage.objects;
CREATE POLICY "books_files_admin_insert" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'books'
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "books_files_admin_update" ON storage.objects;
CREATE POLICY "books_files_admin_update" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'books'
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "books_files_admin_delete" ON storage.objects;
CREATE POLICY "books_files_admin_delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'books'
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Kitob muqovalari uchun alohida bucket (rasm)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('book-covers', 'book-covers', true, 2097152, ARRAY['image/jpeg','image/png','image/webp'])
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 2097152,
  allowed_mime_types = ARRAY['image/jpeg','image/png','image/webp'];

DROP POLICY IF EXISTS "book_covers_public_read" ON storage.objects;
CREATE POLICY "book_covers_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'book-covers');

DROP POLICY IF EXISTS "book_covers_admin_write" ON storage.objects;
CREATE POLICY "book_covers_admin_write" ON storage.objects
  FOR ALL USING (
    bucket_id = 'book-covers'
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
