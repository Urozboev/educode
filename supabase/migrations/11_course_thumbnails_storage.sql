-- ============================================
-- EduCode — Kurs rasmlari uchun Storage bucket
-- course-thumbnails: hammaga o'qish, faqat admin yozish
-- Supabase SQL Editor da ishga tushiring.
-- ============================================

-- 1) Bucket yaratish (public — rasmlar to'g'ridan-to'g'ri URL orqali ochiladi)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'course-thumbnails',
  'course-thumbnails',
  true,
  2097152,                                        -- 2MB limit
  ARRAY['image/jpeg','image/png','image/webp','image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 2097152,
  allowed_mime_types = ARRAY['image/jpeg','image/png','image/webp','image/gif'];

-- 2) Policies (storage.objects)
-- Hammaga o'qish
DROP POLICY IF EXISTS "course_thumbnails_public_read" ON storage.objects;
CREATE POLICY "course_thumbnails_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'course-thumbnails');

-- Faqat admin yuklaydi
DROP POLICY IF EXISTS "course_thumbnails_admin_insert" ON storage.objects;
CREATE POLICY "course_thumbnails_admin_insert" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'course-thumbnails'
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Faqat admin yangilaydi/o'chiradi
DROP POLICY IF EXISTS "course_thumbnails_admin_update" ON storage.objects;
CREATE POLICY "course_thumbnails_admin_update" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'course-thumbnails'
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "course_thumbnails_admin_delete" ON storage.objects;
CREATE POLICY "course_thumbnails_admin_delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'course-thumbnails'
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
