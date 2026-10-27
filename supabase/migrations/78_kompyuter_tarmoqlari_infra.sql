-- ============================================================
-- MirAcademy — "Kompyuter tarmoqlari" fani: infratuzilma
--
-- Manba: Buxoro innovatsiyalar universiteti, KT1406 fan dasturi
-- (60610100 — Axborot tizimlari va texnologiyalari, 4-semestr, 6 ECTS).
--
-- Bu migratsiya:
--   1) uchta bepul kurs yaratadi — ma'ruza, amaliyot, laboratoriya;
--   2) topic_tasks ga yangi topshiriq turlarini qo'shadi;
--   3) hisobot rasmlari uchun yopiq Storage bucket ochadi;
--   4) o'qituvchi/admin hisobotni tekshiradigan RPC yozadi.
--
-- Mavzular, taqdimotlar, testlar va topshiriqlar 79–87 migratsiyalarda
-- (scripts/kontent/kompyuter-tarmoqlari/build.py yaratadi).
--
-- ------------------------------------------------------------
-- NEGA YANGI TOPSHIRIQ TURLARI
--
-- Platformadagi topshiriqlar hozirgacha faqat kod edi (stdin → stdout).
-- Tarmoq fanida bu yetarli emas:
--   · 'answer' — hisob-kitob natijasini kiritish: tarmoq manzili,
--     xostlar soni, kechikish vaqti. Talaba dastur yozmaydi, javobni
--     yozadi; tekshiruv darhol.
--   · 'report' — amaliy ish hisoboti: Packet Tracer sxemasi, Wireshark
--     yoki `ipconfig` skrinshoti va xulosa. Bunday ishni avtomatik
--     tekshirib bo'lmaydi — o'qituvchi ko'rib, qabul qiladi yoki izoh
--     bilan qaytaradi.
--   · 'code' — avvalgidek (subnet kalkulyatori, CRC va h.k.).
--
-- Supabase SQL Editor da ishga tushiring. Qayta ishga tushirish xavfsiz.
-- ============================================================

-- ============================================================
-- 1) KURSLAR
-- ============================================================
INSERT INTO courses (title, slug, description, long_description, category, difficulty,
                     is_free, price_coins, is_published, coin_reward, estimated_hours,
                     tags, order_index)
VALUES
  ('Kompyuter tarmoqlari (Ma''ruza)', 'kompyuter-tarmoqlari-maruza',
   'Lokal va global tarmoqlar, OSI va TCP/IP modellari, IP adreslash, marshrutlash, tarmoq xizmatlari va xavfsizlik — 15 ta ma''ruza.',
   'KT1406 fan dasturi asosidagi nazariy kurs. Har bir ma''ruzada matn, interaktiv taqdimot, virtual simulyatsiya, test va qisqa topshiriqlar bor. Kurs tarmoqlarning tarixidan boshlab Ethernet, Wi-Fi, IP manzillar, marshrutlash, TCP/UDP, DNS, server operatsion tizimlar va tarmoq xavfsizligigacha bo''lgan mavzularni qamraydi.',
   'computer_literacy', 'beginner', true, 0, true, 60, 30,
   ARRAY['tarmoq','OSI','TCP/IP','IP','maruza'], 9),
  ('Kompyuter tarmoqlari (Amaliyot)', 'kompyuter-tarmoqlari-amaliyot',
   'Topologiya, kodlash, subnetting, VLSM, marshrutlash jadvallari, firewall qoidalari va diagnostika bo''yicha 15 ta amaliy mashg''ulot.',
   'Ma''ruzalarni mustahkamlovchi amaliy mashg''ulotlar: hisob-kitob, tahlil va keys-stadilar. Har bir mashg''ulotda yechilgan namunalar, simulyatsiya, test va avtomatik tekshiriladigan topshiriqlar bor.',
   'computer_literacy', 'beginner', true, 0, true, 60, 30,
   ARRAY['tarmoq','subnetting','amaliyot'], 10),
  ('Kompyuter tarmoqlari (Laboratoriya)', 'kompyuter-tarmoqlari-laboratoriya',
   'Tarmoq qurilmalari, Packet Tracer, Wireshark, Wi-Fi, marshrutizator, soketlar, Windows Server, brandmauer va VPN bo''yicha 14 ta laboratoriya ishi.',
   'Fan dasturidagi 14 ta laboratoriya ishi. Har bir ishda bosqichma-bosqich yo''riqnoma, virtual simulyatsiya, test va hisobot topshirig''i bor: talaba ishni bajarib, skrinshot va xulosa yuklaydi, o''qituvchi tekshiradi.',
   'computer_literacy', 'intermediate', true, 0, true, 60, 28,
   ARRAY['tarmoq','Packet Tracer','Wireshark','laboratoriya'], 11)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  long_description = EXCLUDED.long_description,
  is_free = true,
  price_coins = 0,
  is_published = true,
  tags = EXCLUDED.tags;

-- ============================================================
-- 2) TOPSHIRIQ TURLARI
-- ============================================================
ALTER TABLE topic_tasks ADD COLUMN IF NOT EXISTS task_kind TEXT NOT NULL DEFAULT 'code';
ALTER TABLE topic_tasks ADD COLUMN IF NOT EXISTS answer_spec JSONB;
ALTER TABLE topic_tasks ADD COLUMN IF NOT EXISTS report_spec JSONB;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'topic_tasks_kind_check') THEN
    ALTER TABLE topic_tasks ADD CONSTRAINT topic_tasks_kind_check
      CHECK (task_kind IN ('code', 'answer', 'report'));
  END IF;
END $$;

COMMENT ON COLUMN topic_tasks.answer_spec IS
  '{"fields":[{"label":"...","type":"text|number|ip|choice","accept":["..."],"tol":0,"options":["..."],"placeholder":"..."}]}';
COMMENT ON COLUMN topic_tasks.report_spec IS
  '{"steps":["..."],"min_images":1,"max_images":4,"min_chars":60,"prompt":"..."}';

-- ============================================================
-- 3) HISOBOT YUBORISHLARI
--
-- Hisobot ham `submissions` ga yoziladi (task_type = 'topic_task'):
--   code        — talaba xulosasi
--   language    — 'report' (javob topshirig'ida 'answer')
--   attachments — Storage'dagi rasm yo'llari
--   status      — 'pending' (tekshirilmoqda) → 'accepted' | 'wrong_answer'
-- ============================================================
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS attachments JSONB;
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS review_note TEXT;
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES profiles(id) ON DELETE SET NULL;
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ;

-- Tekshiruv navbati tez ochilishi uchun
CREATE INDEX IF NOT EXISTS submissions_report_queue_idx
  ON submissions (created_at DESC)
  WHERE language = 'report';

-- ============================================================
-- 4) STORAGE: hisobot rasmlari (YOPIQ)
--
-- Skrinshotlarda shaxsiy ma'lumot bo'lishi mumkin (kompyuter nomi,
-- IP, foydalanuvchi nomi) — shuning uchun bucket ommaviy emas.
-- Fayl yo'li: <user_id>/<task_id>/<tasodifiy>.png
-- Ko'rish imzolangan havola (signed URL) orqali.
-- ============================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'task-reports',
  'task-reports',
  false,
  5242880, -- 5 MB
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Talaba faqat o'z papkasiga yuklaydi
DROP POLICY IF EXISTS "task_reports_insert_own" ON storage.objects;
CREATE POLICY "task_reports_insert_own" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'task-reports'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- O'zi, o'qituvchi va admin ko'radi
DROP POLICY IF EXISTS "task_reports_select" ON storage.objects;
CREATE POLICY "task_reports_select" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'task-reports'
    AND (
      (storage.foldername(name))[1] = auth.uid()::text
      OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher'))
    )
  );

-- Talaba o'z rasmini o'chira oladi (yuborishdan oldin almashtirish uchun)
DROP POLICY IF EXISTS "task_reports_delete_own" ON storage.objects;
CREATE POLICY "task_reports_delete_own" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'task-reports'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- ============================================================
-- 5) HISOBOTNI TEKSHIRISH (o'qituvchi yoki admin)
--
-- submissions jadvalida UPDATE policy yo'q — talaba o'z natijasini
-- o'zgartira olmasligi kerak. Tekshiruv shu funksiya orqali.
-- ============================================================
CREATE OR REPLACE FUNCTION review_report_submission(
  p_submission_id UUID,
  p_accept BOOLEAN,
  p_note TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_reviewer UUID := auth.uid();
  v_role TEXT;
  v_sub submissions;
BEGIN
  SELECT role INTO v_role FROM profiles WHERE id = v_reviewer;
  IF v_role IS NULL OR v_role NOT IN ('admin', 'teacher') THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Faqat o''qituvchi yoki admin');
  END IF;

  SELECT * INTO v_sub FROM submissions WHERE id = p_submission_id FOR UPDATE;
  IF v_sub.id IS NULL OR v_sub.language <> 'report' THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Hisobot topilmadi');
  END IF;

  IF NOT p_accept AND coalesce(trim(p_note), '') = '' THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Qaytarishda sababini yozing');
  END IF;

  UPDATE submissions
  SET status = CASE WHEN p_accept THEN 'accepted' ELSE 'wrong_answer' END,
      passed_tests = CASE WHEN p_accept THEN 1 ELSE 0 END,
      total_tests = 1,
      review_note = nullif(trim(p_note), ''),
      reviewed_by = v_reviewer,
      reviewed_at = now()
  WHERE id = p_submission_id;

  RETURN jsonb_build_object('ok', true, 'message',
    CASE WHEN p_accept THEN 'Hisobot qabul qilindi' ELSE 'Hisobot qayta ishlashga qaytarildi' END);
END;
$$;

GRANT EXECUTE ON FUNCTION review_report_submission(UUID, BOOLEAN, TEXT) TO authenticated;
