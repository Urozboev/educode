-- ============================================
-- EduCode — Baza kontenti uchun tarjima jadvallari
--
-- MUAMMO: interfeys 4 tilda ishlaydi, lekin kontent — 24 mavzu,
-- ~150 test, 110 topshiriq, 48 termin, kitoblar, metodlar — bazada
-- faqat o'zbekcha yotibdi. Foydalanuvchi tilni ruschaga o'zgartirsa,
-- menyu ruschaga o'tadi-yu, dars matni o'zbekcha qolib ketadi.
--
-- YONDASHUV: har bir jadval uchun alohida `*_i18n` jadval yaratish
-- o'nta yangi jadval va o'nta RLS to'plami degani. Buning o'rniga
-- BITTA umumiy jadval: resurs nomi + qator id + til + maydon.
--
-- Afzalligi: yangi jadvalni tarjimaga ochish uchun faqat reyestrga
-- bir necha qator qo'shiladi, migratsiya kerak emas.
-- Kamchiligi: tur xavfsizligi yo'q — shuning uchun `translatable_fields`
-- reyestri bor va RPC undan tashqari hech nimani yozdirmaydi.
--
-- Supabase SQL Editor da ishga tushiring. Qayta ishga tushirish xavfsiz.
-- ============================================

-- ============================================
-- 1. TARJIMA QILINADIGAN MAYDONLAR REYESTRI
--
-- Bu shunchaki ma'lumotnoma emas: RPC yozishdan oldin shu yerdan
-- tekshiradi va admin interfeysi qaysi tahrirlagichni ko'rsatishni
-- shundan biladi.
-- ============================================
CREATE TABLE IF NOT EXISTS translatable_fields (
  resource TEXT NOT NULL,
  field TEXT NOT NULL,
  -- text  — bir qatorli matn
  -- long  — ko'p qatorli matn
  -- html  — HTML tahrirlagich
  -- json  — tuzilmali qiymat (test variantlari, o'yin kontenti)
  kind TEXT NOT NULL CHECK (kind IN ('text','long','html','json')),
  label TEXT NOT NULL,
  order_index INT NOT NULL DEFAULT 0,
  PRIMARY KEY (resource, field)
);

ALTER TABLE translatable_fields ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "translatable_fields_read" ON translatable_fields;
CREATE POLICY "translatable_fields_read" ON translatable_fields FOR SELECT USING (true);

INSERT INTO translatable_fields (resource, field, kind, label, order_index) VALUES
  ('courses',          'title',            'text', 'Kurs nomi',        0),
  ('courses',          'description',      'long', 'Qisqa tavsif',     1),
  ('courses',          'long_description', 'html', 'To''liq tavsif',   2),

  ('topics',           'title',            'text', 'Mavzu nomi',       0),
  ('topics',           'content_html',     'html', 'Dars matni',       1),

  ('quizzes',          'question',         'long', 'Savol',            0),
  ('quizzes',          'options',          'json', 'Variantlar',       1),
  ('quizzes',          'explanation',      'long', 'Izoh',             2),

  ('topic_tasks',      'title',            'text', 'Topshiriq nomi',   0),
  ('topic_tasks',      'description',      'long', 'Shart',            1),
  ('topic_tasks',      'instruction_html', 'html', 'Yo''riqnoma',      2),
  ('topic_tasks',      'hints',            'json', 'Maslahatlar',      3),

  ('challenges',       'title',            'text', 'Masala nomi',      0),
  ('challenges',       'description',      'long', 'Shart',            1),
  ('challenges',       'instruction_html', 'html', 'Yo''riqnoma',      2),

  ('glossary_terms',   'term',             'text', 'Termin',           0),
  ('glossary_terms',   'definition',       'long', 'Ta''rif',          1),
  ('glossary_terms',   'details_html',     'html', 'Batafsil',         2),
  ('glossary_terms',   'example',          'long', 'Misol',            3),

  ('teaching_methods', 'title',            'text', 'Metod nomi',       0),
  ('teaching_methods', 'summary',          'long', 'Qisqacha',         1),
  ('teaching_methods', 'guide_html',       'html', 'Yo''riqnoma',      2),

  ('books',            'title',            'text', 'Kitob nomi',       0),
  ('books',            'description',      'long', 'Tavsif',           1),

  ('lesson_games',     'title',            'text', 'O''yin nomi',      0),
  ('lesson_games',     'description',      'long', 'Tavsif',           1),
  ('lesson_games',     'content',          'json', 'O''yin kontenti',  2),

  ('contests',         'title',            'text', 'Olimpiada nomi',   0),
  ('contests',         'description',      'long', 'Tavsif',           1),
  ('contests',         'rules_html',       'html', 'Qoidalar',         2)
ON CONFLICT (resource, field) DO UPDATE
  SET kind = EXCLUDED.kind, label = EXCLUDED.label, order_index = EXCLUDED.order_index;

-- ============================================
-- 2. TARJIMALAR
-- ============================================
CREATE TABLE IF NOT EXISTS content_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource TEXT NOT NULL,
  row_id UUID NOT NULL,
  locale TEXT NOT NULL CHECK (locale IN ('uz','ru','en','kaa')),
  field TEXT NOT NULL,
  -- Matnli maydonlar shu yerda, tuzilmali qiymatlar `value_json` da.
  -- Ikkitasi alohida: JSONB ichidagi matnni qidirib bo'lmaydi va
  -- oddiy matnni jsonb'ga o'rash keraksiz murakkablik qo'shardi.
  value TEXT,
  value_json JSONB,
  updated_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (resource, row_id, locale, field),
  FOREIGN KEY (resource, field) REFERENCES translatable_fields(resource, field) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS content_translations_lookup_idx
  ON content_translations(resource, locale, row_id);

ALTER TABLE content_translations ENABLE ROW LEVEL SECURITY;

-- Tarjimalarni hamma o'qiydi — ular sahifada ko'rsatiladi
DROP POLICY IF EXISTS "content_translations_read" ON content_translations;
CREATE POLICY "content_translations_read" ON content_translations FOR SELECT USING (true);

-- Yozish faqat RPC orqali (reyestr tekshiruvi shu yerda)
DROP POLICY IF EXISTS "content_translations_write" ON content_translations;

DROP TRIGGER IF EXISTS content_translations_updated_at ON content_translations;
CREATE TRIGGER content_translations_updated_at BEFORE UPDATE ON content_translations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- 3. TARJIMANI SAQLASH
-- ============================================
CREATE OR REPLACE FUNCTION public.save_translation(
  p_resource TEXT,
  p_row_id UUID,
  p_locale TEXT,
  p_field TEXT,
  p_value TEXT DEFAULT NULL,
  p_value_json JSONB DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $fn$
DECLARE
  v_user UUID := auth.uid();
  v_kind TEXT;
  v_clean TEXT := NULLIF(btrim(COALESCE(p_value, '')), '');
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM profiles WHERE id = v_user AND role IN ('admin','teacher')
  ) THEN
    RETURN jsonb_build_object('ok', false, 'message', 'Ruxsat yo''q');
  END IF;

  SELECT kind INTO v_kind
    FROM translatable_fields WHERE resource = p_resource AND field = p_field;
  IF v_kind IS NULL THEN
    RETURN jsonb_build_object('ok', false,
      'message', format('"%s.%s" tarjima qilinadigan maydon emas', p_resource, p_field));
  END IF;

  -- Sukut til tarjima emas — u asl kontentning o'zi
  IF p_locale = 'uz' THEN
    RETURN jsonb_build_object('ok', false,
      'message', 'O''zbekcha matn asl jadvalda tahrirlanadi, bu yerda emas');
  END IF;

  -- Bo'sh qiymat — tarjimani olib tashlash
  IF v_clean IS NULL AND p_value_json IS NULL THEN
    DELETE FROM content_translations
     WHERE resource = p_resource AND row_id = p_row_id
       AND locale = p_locale AND field = p_field;
    RETURN jsonb_build_object('ok', true, 'deleted', true);
  END IF;

  INSERT INTO content_translations (resource, row_id, locale, field, value, value_json, updated_by)
  VALUES (p_resource, p_row_id, p_locale, p_field, v_clean, p_value_json, v_user)
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE
    SET value = EXCLUDED.value,
        value_json = EXCLUDED.value_json,
        updated_by = EXCLUDED.updated_by,
        updated_at = now();

  RETURN jsonb_build_object('ok', true, 'deleted', false);
END;
$fn$;

GRANT EXECUTE ON FUNCTION public.save_translation(TEXT, UUID, TEXT, TEXT, TEXT, JSONB) TO authenticated;

-- ============================================
-- 4. TARJIMALARNI O'QISH
--
-- Sahifa bir nechta qatorni ko'rsatadi (masalan 14 ta mavzu), shuning
-- uchun funksiya id massivini qabul qiladi va har qator uchun
-- maydon→qiymat xaritasini qaytaradi. Aks holda har mavzuga alohida
-- so'rov ketardi.
-- ============================================
CREATE OR REPLACE FUNCTION public.get_translations(
  p_resource TEXT,
  p_row_ids UUID[],
  p_locale TEXT
)
RETURNS TABLE (row_id UUID, fields JSONB)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $fn$
  SELECT ct.row_id,
         jsonb_object_agg(ct.field, COALESCE(ct.value_json, to_jsonb(ct.value)))
    FROM content_translations ct
   WHERE ct.resource = p_resource
     AND ct.locale = p_locale
     AND ct.row_id = ANY(p_row_ids)
   GROUP BY ct.row_id;
$fn$;

GRANT EXECUTE ON FUNCTION public.get_translations(TEXT, UUID[], TEXT) TO anon, authenticated;

-- ============================================
-- 5. TARJIMA HOLATI
--
-- Admin qaysi bo'lim qancha tarjima qilinganini bir qarashda ko'rsin.
-- Foizsiz bu ish "qachon tugaydi?" degan savolga aylanadi.
-- ============================================
CREATE OR REPLACE FUNCTION public.translation_progress()
RETURNS TABLE (
  resource TEXT,
  locale TEXT,
  translated BIGINT,
  total BIGINT,
  percent INT
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $fn$
DECLARE
  v_res TEXT;
  v_loc TEXT;
  v_rows BIGINT;
  v_fields BIGINT;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','teacher')
  ) THEN
    RETURN;
  END IF;

  FOR v_res IN SELECT DISTINCT tf.resource FROM translatable_fields tf ORDER BY 1 LOOP
    -- Har resursda nechta qator borligini dinamik hisoblaymiz:
    -- jadval nomlari reyestrdan keladi, ular ustidan qattiq nazorat bor
    EXECUTE format('SELECT count(*) FROM %I', v_res) INTO v_rows;
    SELECT count(*) INTO v_fields FROM translatable_fields tf WHERE tf.resource = v_res;

    FOREACH v_loc IN ARRAY ARRAY['ru','en','kaa'] LOOP
      RETURN QUERY
      SELECT
        v_res,
        v_loc,
        count(ct.id),
        v_rows * v_fields,
        CASE WHEN v_rows * v_fields = 0 THEN 0
             ELSE (count(ct.id) * 100 / (v_rows * v_fields))::INT END
      FROM content_translations ct
      WHERE ct.resource = v_res AND ct.locale = v_loc;
    END LOOP;
  END LOOP;
END;
$fn$;

GRANT EXECUTE ON FUNCTION public.translation_progress() TO authenticated;


-- ============================================
-- 6. OLIMPIADA MASALALARIGA challenge_id QO'SHISH
--
-- `contest_overview` masalalar ro'yxatini qaytaradi, lekin unda
-- `challenge_id` yo'q edi — faqat harf, slug va sarlavha. Tarjima esa
-- qator id si bo'yicha izlanadi, ya'ni idsiz masala nomini tarjima
-- qilib bo'lmasdi. Funksiya 38-migratsiyada yaratilgan va u allaqachon
-- qo'llangan, shuning uchun o'sha faylni tahrirlash o'rniga bu yerda
-- qayta e'lon qilinadi (CREATE OR REPLACE).
-- ============================================
CREATE OR REPLACE FUNCTION public.contest_overview(p_slug TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $fn$
DECLARE
  v_c RECORD;
  v_phase TEXT;
  v_user UUID := auth.uid();
BEGIN
  SELECT * INTO v_c FROM contests WHERE slug = p_slug AND is_published = true;
  IF v_c.id IS NULL THEN
    RETURN NULL;
  END IF;

  v_phase := CASE
    WHEN now() < v_c.starts_at THEN 'upcoming'
    WHEN now() <= v_c.ends_at THEN 'running'
    ELSE 'practice'   -- tugagan: masalalar mashq uchun ochiq
  END;

  RETURN jsonb_build_object(
    'contest', jsonb_build_object(
      'id', v_c.id,
      'title', v_c.title,
      'slug', v_c.slug,
      'description', v_c.description,
      'rules_html', v_c.rules_html,
      'starts_at', v_c.starts_at,
      'ends_at', v_c.ends_at,
      'penalty_minutes', v_c.penalty_minutes,
      'freeze_minutes', v_c.freeze_minutes
    ),
    'phase', v_phase,
    'participants', (SELECT count(*) FROM contest_participants WHERE contest_id = v_c.id),
    'is_registered', (
      SELECT EXISTS (
        SELECT 1 FROM contest_participants
         WHERE contest_id = v_c.id AND user_id = v_user
      )
    ),
    -- Masalalar boshlangandan keyin ochiladi va tugagach ham ochiq qoladi
    'problems', CASE WHEN v_phase = 'upcoming' THEN '[]'::jsonb ELSE COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'id', cp.challenge_id,
        'letter', cp.letter,
        'slug', ch.slug,
        'title', ch.title,
        'difficulty', ch.difficulty,
        'points', cp.points,
        'solved_by', (
          SELECT count(DISTINCT s.user_id)
            FROM submissions s
           WHERE s.task_type = 'challenge'
             AND s.task_id = cp.challenge_id
             AND s.status = 'accepted'
             AND s.created_at BETWEEN v_c.starts_at AND v_c.ends_at
        ),
        -- Joriy foydalanuvchining shu masaladagi holati.
        -- count(*) tekshiruvi SHART: agregat so'rov mos qator topilmasa ham
        -- bitta qator qaytaradi (bool_or = NULL), natijada COALESCE hech
        -- qachon ishga tushmay, hamma masala "tried" bo'lib ko'rinardi —
        -- hatto tizimga kirmagan mehmon uchun ham.
        'my_status', (
          SELECT CASE
                   WHEN count(*) = 0 THEN 'none'
                   WHEN bool_or(s.status = 'accepted') THEN 'solved'
                   ELSE 'tried'
                 END
            FROM submissions s
           WHERE s.task_type = 'challenge'
             AND s.task_id = cp.challenge_id
             AND s.user_id = v_user
        )
      ) ORDER BY cp.order_index, cp.letter)
      FROM contest_problems cp
      JOIN challenges ch ON ch.id = cp.challenge_id
      WHERE cp.contest_id = v_c.id
    ), '[]'::jsonb) END,
    'problem_count', (SELECT count(*) FROM contest_problems WHERE contest_id = v_c.id)
  );
END;
$fn$;

GRANT EXECUTE ON FUNCTION public.contest_overview(TEXT) TO anon, authenticated;
