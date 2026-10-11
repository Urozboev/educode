-- ============================================================
-- MirAcademy — Kurs kartasida "0 dars" ko'rinishi
--
-- MUAMMO
-- Kurs kartasidagi "N dars" `courses.total_topics` ustunidan olinadi.
-- Bu ustunni faqat admin panel yangilardi: mavzu qo'shilganda +1,
-- o'chirilganda -1. SQL migratsiyalar orqali qo'shilgan mavzular
-- (27-32, 68-70) uni umuman o'zgartirmagan — shuning uchun Amaliyot va
-- Laboratoriya kurslarida 12 ta mavzu bo'lsa ham "0 dars" ko'rinadi.
--
-- Admin paneldagi hisob ham ishonchsiz edi: nashr qilinmagan
-- mavzularni ham sanardi, mavzu nashrdan olinganda esa o'zgarmasdi.
--
-- YECHIM
-- 1. Trigger: `topics` jadvalida qo'shish, o'chirish, nashr holati yoki
--    kursi o'zgarganda tegishli kurs(lar)ning soni bazaning o'zida
--    qayta sanaladi. Kim qo'shganidan qat'i nazar — admin panel,
--    migratsiya yoki SQL Editor — son doim to'g'ri bo'ladi.
-- 2. Mavjud barcha kurslar uchun sonni bir marta tiklash.
-- 3. Hali tugatilmagan yozilishlarda (enrollments) jami mavzular va
--    foizni yangi songa moslash. Tugatilgan kurslar tegilmaydi —
--    berilgan sertifikat va mukofotlar o'z kuchida qoladi.
--
-- Faqat NASHR QILINGAN mavzular sanaladi — kursni tugatish tekshiruvi
-- (src/lib/course-completion.ts) ham aynan shunday sanaydi.
--
-- Supabase SQL Editor da ishga tushiring. Qayta ishga tushirish xavfsiz.
-- Oxirida natija jadvali chiqadi — har bir kursdagi mavzular soni.
-- ============================================================

-- ------------------------------------------------------------
-- 1. TRIGGER
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.sync_course_topic_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_kurslar UUID[];
BEGIN
  IF TG_OP = 'INSERT' THEN
    v_kurslar := ARRAY[NEW.course_id];
  ELSIF TG_OP = 'DELETE' THEN
    v_kurslar := ARRAY[OLD.course_id];
  ELSE
    -- Mavzu boshqa kursga ko'chirilsa, ikkala kurs ham yangilanadi
    v_kurslar := ARRAY[NEW.course_id, OLD.course_id];
  END IF;

  UPDATE courses c
     SET total_topics = (
       SELECT count(*) FROM topics t
        WHERE t.course_id = c.id AND t.is_published = true
     )
   WHERE c.id = ANY(v_kurslar);

  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS topics_sync_course_count ON topics;
CREATE TRIGGER topics_sync_course_count
  AFTER INSERT OR DELETE OR UPDATE OF course_id, is_published ON topics
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_course_topic_count();

-- ------------------------------------------------------------
-- 2. MAVJUD KURSLAR SONINI TIKLASH
-- ------------------------------------------------------------
UPDATE courses c
   SET total_topics = s.soni
  FROM (
    SELECT k.id, count(t.id)::int AS soni
      FROM courses k
      LEFT JOIN topics t ON t.course_id = k.id AND t.is_published = true
     GROUP BY k.id
  ) s
 WHERE c.id = s.id
   AND c.total_topics IS DISTINCT FROM s.soni;

-- ------------------------------------------------------------
-- 3. TUGATILMAGAN YOZILISHLAR PROGRESSINI MOSLASH
-- ------------------------------------------------------------
WITH hisob AS (
  SELECT e.id,
         c.total_topics AS jami,
         (SELECT count(*)::int
            FROM topic_progress p
            JOIN topics t ON t.id = p.topic_id AND t.is_published = true
           WHERE p.user_id = e.user_id
             AND p.course_id = e.course_id
             AND p.is_completed = true) AS tugagan
    FROM enrollments e
    JOIN courses c ON c.id = e.course_id
   WHERE e.is_completed = false
)
UPDATE enrollments e
   SET total_topics     = h.jami,
       completed_topics = h.tugagan,
       progress_percent = CASE WHEN h.jami > 0
                               THEN round(h.tugagan * 100.0 / h.jami)::int
                               ELSE 0 END
  FROM hisob h
 WHERE e.id = h.id
   AND (e.total_topics IS DISTINCT FROM h.jami
        OR e.completed_topics IS DISTINCT FROM h.tugagan);

-- ------------------------------------------------------------
-- Natija: har bir kursdagi mavzular soni
-- ------------------------------------------------------------
SELECT title AS kurs, total_topics AS mavzular, is_published AS nashr
  FROM courses
 ORDER BY title;
