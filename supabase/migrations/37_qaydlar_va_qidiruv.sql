-- ============================================
-- EduCode — Mavzu qaydlari va kurs ichida qidiruv
--
-- 1. `topic_notes` — talabaning mavzu bo'yicha shaxsiy qaydlari.
--    Faqat egasi ko'radi va tahrirlaydi; o'qituvchi ham, admin ham emas.
--    Qayd — shaxsiy o'quv vositasi, uni boshqaga ko'rsatish talabani
--    ochiq yozishdan tiyadi.
--
-- 2. `search_course_topics` — kurs ichida qidiruv.
--    Nega RPC? `topics_toc` ko'rinishida `content_html` ataylab YO'Q:
--    view RLS'ni chetlab o'tadi, ya'ni kontentni unga qo'shsak pullik
--    kursning matni yozilmagan foydalanuvchiga ham ochilib qolardi.
--    Shuning uchun qidiruv serverda bajariladi va avval ruxsat tekshiriladi:
--    kontent bo'yicha qidiruv faqat yozilganlar yoki bepul kurs uchun,
--    sarlavhalar esa hammaga ochiq (ular allaqachon mundarijada ko'rinadi).
--
-- Supabase SQL Editor da ishga tushiring. Qayta ishga tushirish xavfsiz.
-- ============================================

-- ============================================
-- 1. QAYDLAR
-- ============================================
CREATE TABLE IF NOT EXISTS topic_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  content TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  -- Bir mavzuga bitta qayd: tahrirlash oqimi ko'p yozuvdan sodda va
  -- "qaysi qayd joriy?" degan savol umuman tug'ilmaydi
  UNIQUE (user_id, topic_id)
);

CREATE INDEX IF NOT EXISTS topic_notes_user_course_idx ON topic_notes(user_id, course_id, updated_at DESC);

ALTER TABLE topic_notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "topic_notes_own" ON topic_notes;
CREATE POLICY "topic_notes_own" ON topic_notes FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP TRIGGER IF EXISTS topic_notes_updated_at ON topic_notes;
CREATE TRIGGER topic_notes_updated_at BEFORE UPDATE ON topic_notes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

/**
 * Qaydni saqlash. Bo'sh matn yuborilsa qayd o'chiriladi — foydalanuvchi
 * matnni tozalab, "endi bu qayd yo'q" deb kutadi.
 */
CREATE OR REPLACE FUNCTION public.save_topic_note(
  p_topic_id UUID,
  p_content TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $fn$
DECLARE
  v_user UUID := auth.uid();
  v_course UUID;
  v_clean TEXT := btrim(COALESCE(p_content, ''));
BEGIN
  IF v_user IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'message', 'Avval tizimga kiring');
  END IF;

  SELECT course_id INTO v_course FROM topics WHERE id = p_topic_id;
  IF v_course IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'message', 'Mavzu topilmadi');
  END IF;

  IF v_clean = '' THEN
    DELETE FROM topic_notes WHERE user_id = v_user AND topic_id = p_topic_id;
    RETURN jsonb_build_object('ok', true, 'deleted', true);
  END IF;

  IF length(v_clean) > 20000 THEN
    RETURN jsonb_build_object('ok', false, 'message', 'Qayd juda uzun (20000 belgidan ko''p)');
  END IF;

  INSERT INTO topic_notes (user_id, topic_id, course_id, content)
  VALUES (v_user, p_topic_id, v_course, v_clean)
  ON CONFLICT (user_id, topic_id) DO UPDATE
    SET content = EXCLUDED.content, updated_at = now();

  RETURN jsonb_build_object('ok', true, 'deleted', false);
END;
$fn$;

GRANT EXECUTE ON FUNCTION public.save_topic_note(UUID, TEXT) TO authenticated;

-- ============================================
-- 2. KURS ICHIDA QIDIRUV
-- ============================================
CREATE OR REPLACE FUNCTION public.search_course_topics(
  p_course_id UUID,
  p_query TEXT
)
RETURNS TABLE (
  topic_id UUID,
  slug TEXT,
  title TEXT,
  order_index INT,
  /** 'title' — sarlavhada, 'content' — matn ichida topildi */
  match_in TEXT,
  /** Topilgan joy atrofidagi parcha */
  snippet TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $fn$
DECLARE
  v_user UUID := auth.uid();
  v_can_read_content BOOLEAN := false;
  v_q TEXT := btrim(COALESCE(p_query, ''));
BEGIN
  IF length(v_q) < 2 THEN
    RETURN;
  END IF;

  -- Kontent bo'yicha qidirishga huquq: bepul kurs yoki yozilgan bo'lsa
  SELECT
    c.is_free
    OR EXISTS (SELECT 1 FROM enrollments e WHERE e.course_id = c.id AND e.user_id = v_user)
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = v_user AND p.role IN ('admin','teacher'))
  INTO v_can_read_content
  FROM courses c WHERE c.id = p_course_id;

  RETURN QUERY
  WITH matn AS (
    SELECT
      t.id, t.slug, t.title, t.order_index,
      -- HTML teglarini olib tashlaymiz: qidiruv <code> ichidagi so'zni
      -- ham topsin, natijada esa teg ko'rinmasin
      btrim(regexp_replace(
        regexp_replace(COALESCE(t.content_html, ''), '<[^>]+>', ' ', 'g'),
        '\s+', ' ', 'g'
      )) AS plain
    FROM topics t
    WHERE t.course_id = p_course_id AND t.is_published = true
  )
  SELECT
    m.id, m.slug, m.title, m.order_index,
    CASE WHEN m.title ILIKE '%' || v_q || '%' THEN 'title' ELSE 'content' END AS match_in,
    CASE
      WHEN m.title ILIKE '%' || v_q || '%' THEN left(m.plain, 140)
      ELSE
        -- Topilgan joydan 60 belgi oldin boshlab 180 belgi kesamiz
        substr(m.plain, GREATEST(1, position(lower(v_q) IN lower(m.plain)) - 60), 180)
    END AS snippet
  FROM matn m
  WHERE m.title ILIKE '%' || v_q || '%'
     OR (v_can_read_content AND m.plain ILIKE '%' || v_q || '%')
  ORDER BY
    -- Sarlavhada topilganlar yuqorida
    (m.title ILIKE '%' || v_q || '%') DESC,
    m.order_index;
END;
$fn$;

GRANT EXECUTE ON FUNCTION public.search_course_topics(UUID, TEXT) TO anon, authenticated;
