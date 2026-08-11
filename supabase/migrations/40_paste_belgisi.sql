-- ============================================
-- EduCode — Yechimda nusxa ko'chirish (paste) belgisi
--
-- MUAMMO: paste aniqlash qisman bor edi, lekin uchta kamchilik bilan:
--   1. Belgi faqat `code_snapshots` ga tushardi, `submissions` ga emas.
--      Ya'ni admin bironta yechimga qarab "bu paste qilinganmi?" degan
--      savolga javob ololmasdi — faqat `/t-analytics` da umumiy sanoq bor edi.
--   2. Chegara 40 belgi edi. Oson masalalarning yechimi bir qatorlik
--      (`print(n * n)` — 14 belgi), ya'ni aynan eng ko'p nusxalanadigan
--      holat umuman qayd etilmasdi.
--   3. Necha marta va qancha belgi ko'chirilgani saqlanmasdi.
--
-- Endi har bir yuborish o'zi bilan birga paste statistikasini olib yuradi.
--
-- MUHIM: bu signal — ayblov emas, ko'rsatkich. Talaba o'z kodini boshqa
-- muharrirdan ko'chirgan bo'lishi ham mumkin. Shuning uchun belgi faqat
-- egasiga, o'qituvchiga va adminga ko'rinadi; ochiq reytingda emas.
--
-- Supabase SQL Editor da ishga tushiring. Qayta ishga tushirish xavfsiz.
-- ============================================

-- Nechta paste bo'lgani va jami qancha belgi ko'chirilgani
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS paste_count INT NOT NULL DEFAULT 0;
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS pasted_chars INT NOT NULL DEFAULT 0;

-- Yechimning qancha qismi ko'chirilgan — 0..100.
-- Alohida ustun sifatida saqlanadi, chunki yuborilgandan keyin kod
-- o'zgarmaydi va har safar qayta hisoblash ma'nosiz.
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS paste_ratio INT NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS submissions_paste_idx
  ON submissions(created_at DESC) WHERE paste_count > 0;

-- ============================================
-- ADMIN UCHUN HISOBOT
--
-- `submissions` RLS'i admin va o'qituvchiga hammasini ko'rsatadi, lekin
-- masala nomi `challenges` va `topic_tasks` da alohida yotadi. Ikkalasini
-- bitta ro'yxatga yig'ish mijoz tomonida uchta so'rov talab qilardi.
-- ============================================
CREATE OR REPLACE FUNCTION public.paste_report(
  p_limit INT DEFAULT 100,
  p_min_ratio INT DEFAULT 1
)
RETURNS TABLE (
  submission_id UUID,
  created_at TIMESTAMPTZ,
  user_id UUID,
  full_name TEXT,
  username TEXT,
  task_type TEXT,
  task_title TEXT,
  status TEXT,
  language TEXT,
  code_length INT,
  paste_count INT,
  pasted_chars INT,
  paste_ratio INT,
  /** Masala olimpiadaga tegishli bo'lsa — uning nomi */
  contest_title TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $fn$
BEGIN
  -- Faqat admin va o'qituvchi
  IF NOT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','teacher')
  ) THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT
    s.id,
    s.created_at,
    s.user_id,
    p.full_name,
    p.username,
    s.task_type,
    COALESCE(ch.title, tt.title, 'Nomsiz') AS task_title,
    s.status,
    s.language,
    length(s.code)::INT AS code_length,
    s.paste_count,
    s.pasted_chars,
    s.paste_ratio,
    (
      SELECT c.title FROM contest_problems cp
        JOIN contests c ON c.id = cp.contest_id
       WHERE cp.challenge_id = s.task_id
       LIMIT 1
    ) AS contest_title
  FROM submissions s
  JOIN profiles p ON p.id = s.user_id
  LEFT JOIN challenges ch ON ch.id = s.task_id AND s.task_type = 'challenge'
  LEFT JOIN topic_tasks tt ON tt.id = s.task_id AND s.task_type = 'topic_task'
  WHERE s.paste_count > 0
    AND s.paste_ratio >= p_min_ratio
  ORDER BY s.created_at DESC
  LIMIT GREATEST(1, LEAST(p_limit, 500));
END;
$fn$;

GRANT EXECUTE ON FUNCTION public.paste_report(INT, INT) TO authenticated;
