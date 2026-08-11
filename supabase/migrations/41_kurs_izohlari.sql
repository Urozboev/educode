-- ============================================
-- EduCode — Kurs izohlari va baholari
--
-- Baho 1 dan 5 gacha yulduzcha, izoh ixtiyoriy.
--
-- KIM YOZA OLADI: faqat kursga yozilgan foydalanuvchi. Kursni ko'rmagan
-- odam baho qo'ya olsa, reyting tez orada ma'nosiz bo'lib qoladi.
--
-- Bir foydalanuvchi — bir izoh (UNIQUE). Fikri o'zgarsa tahrirlaydi,
-- yangi yozuv yaratmaydi. Aks holda bitta odam reytingni ko'tarib
-- yuborishi mumkin edi.
--
-- `courses.average_rating` ustuni allaqachon mavjud edi, lekin hech
-- qachon to'ldirilmagan. Endi trigger uni avtomatik yangilab turadi.
--
-- Supabase SQL Editor da ishga tushiring. Qayta ishga tushirish xavfsiz.
-- ============================================

CREATE TABLE IF NOT EXISTS course_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  -- Admin nomaqbul izohni yashiradi. O'chirmaydi: baho reytingda qoladi,
  -- faqat matn ko'rinmaydi — shunda o'chirish orqali reytingni
  -- tozalab yuborish imkoni bo'lmaydi.
  is_hidden BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (course_id, user_id)
);

CREATE INDEX IF NOT EXISTS course_reviews_course_idx
  ON course_reviews(course_id, created_at DESC);

-- Reyting sanog'i uchun alohida ustun (average_rating allaqachon bor)
ALTER TABLE courses ADD COLUMN IF NOT EXISTS rating_count INT NOT NULL DEFAULT 0;

ALTER TABLE course_reviews ENABLE ROW LEVEL SECURITY;

-- Izohlarni hamma o'qiydi — kurs tanlashda ular asosiy manba
DROP POLICY IF EXISTS "course_reviews_read" ON course_reviews;
CREATE POLICY "course_reviews_read" ON course_reviews FOR SELECT USING (true);

-- Yozish faqat RPC orqali: yozilganlikni tekshirish va reytingni
-- qayta hisoblash bitta joyda tursin
DROP POLICY IF EXISTS "course_reviews_insert" ON course_reviews;
DROP POLICY IF EXISTS "course_reviews_update" ON course_reviews;

-- O'z izohini o'chirish
DROP POLICY IF EXISTS "course_reviews_delete_own" ON course_reviews;
CREATE POLICY "course_reviews_delete_own" ON course_reviews FOR DELETE USING (
  user_id = auth.uid()
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

DROP TRIGGER IF EXISTS course_reviews_updated_at ON course_reviews;
CREATE TRIGGER course_reviews_updated_at BEFORE UPDATE ON course_reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- REYTINGNI QAYTA HISOBLASH
-- ============================================
CREATE OR REPLACE FUNCTION public.recalc_course_rating()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $fn$
DECLARE
  v_course UUID := COALESCE(NEW.course_id, OLD.course_id);
BEGIN
  UPDATE courses c
     SET average_rating = COALESCE(r.avg_rating, 0),
         rating_count = COALESCE(r.n, 0)
    FROM (
      SELECT round(avg(rating)::numeric, 2) AS avg_rating, count(*) AS n
        FROM course_reviews WHERE course_id = v_course
    ) r
   WHERE c.id = v_course;
  RETURN NULL;
END;
$fn$;

DROP TRIGGER IF EXISTS course_reviews_recalc ON course_reviews;
CREATE TRIGGER course_reviews_recalc
  AFTER INSERT OR UPDATE OR DELETE ON course_reviews
  FOR EACH ROW EXECUTE FUNCTION public.recalc_course_rating();

-- ============================================
-- IZOH QOLDIRISH / TAHRIRLASH
-- ============================================
CREATE OR REPLACE FUNCTION public.upsert_course_review(
  p_course_id UUID,
  p_rating SMALLINT,
  p_comment TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $fn$
DECLARE
  v_user UUID := auth.uid();
  v_text TEXT := NULLIF(btrim(COALESCE(p_comment, '')), '');
BEGIN
  IF v_user IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'message', 'Avval tizimga kiring');
  END IF;

  IF p_rating IS NULL OR p_rating < 1 OR p_rating > 5 THEN
    RETURN jsonb_build_object('ok', false, 'message', 'Bahoni 1 dan 5 gacha tanlang');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM enrollments WHERE course_id = p_course_id AND user_id = v_user
  ) THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'not_enrolled',
      'message', 'Baho qoldirish uchun avval kursga yoziling');
  END IF;

  IF v_text IS NOT NULL AND length(v_text) > 2000 THEN
    RETURN jsonb_build_object('ok', false, 'message', 'Izoh juda uzun (2000 belgidan ko''p)');
  END IF;

  INSERT INTO course_reviews (course_id, user_id, rating, comment)
  VALUES (p_course_id, v_user, p_rating, v_text)
  ON CONFLICT (course_id, user_id) DO UPDATE
    SET rating = EXCLUDED.rating,
        comment = EXCLUDED.comment,
        updated_at = now();

  RETURN jsonb_build_object('ok', true);
END;
$fn$;

GRANT EXECUTE ON FUNCTION public.upsert_course_review(UUID, SMALLINT, TEXT) TO authenticated;

-- ============================================
-- KURS IZOHLARI (muallif ma'lumoti bilan)
--
-- `profiles` ni mijozdan JOIN qilish RLS tufayli ishonchsiz, shuning
-- uchun ism va avatar shu yerda qo'shib beriladi.
-- ============================================
CREATE OR REPLACE FUNCTION public.course_reviews_list(
  p_course_id UUID,
  p_limit INT DEFAULT 50
)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  full_name TEXT,
  username TEXT,
  avatar_url TEXT,
  rating SMALLINT,
  comment TEXT,
  is_hidden BOOLEAN,
  created_at TIMESTAMPTZ,
  /** Izoh muallifi kursni tugatganmi — ishonch belgisi */
  completed BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $fn$
BEGIN
  RETURN QUERY
  SELECT
    r.id, r.user_id, p.full_name, p.username, p.avatar_url,
    r.rating,
    -- Yashirilgan izohning matni berilmaydi, lekin bahosi qoladi
    CASE WHEN r.is_hidden THEN NULL ELSE r.comment END,
    r.is_hidden,
    r.created_at,
    COALESCE((
      SELECT e.is_completed FROM enrollments e
       WHERE e.course_id = r.course_id AND e.user_id = r.user_id
    ), false)
  FROM course_reviews r
  JOIN profiles p ON p.id = r.user_id
  WHERE r.course_id = p_course_id
  ORDER BY r.created_at DESC
  LIMIT GREATEST(1, LEAST(p_limit, 200));
END;
$fn$;

GRANT EXECUTE ON FUNCTION public.course_reviews_list(UUID, INT) TO anon, authenticated;

-- Mavjud kurslar uchun reytingni bir marta hisoblab chiqamiz
UPDATE courses c
   SET average_rating = COALESCE(r.avg_rating, 0),
       rating_count = COALESCE(r.n, 0)
  FROM (
    SELECT course_id, round(avg(rating)::numeric, 2) AS avg_rating, count(*) AS n
      FROM course_reviews GROUP BY course_id
  ) r
 WHERE c.id = r.course_id;
