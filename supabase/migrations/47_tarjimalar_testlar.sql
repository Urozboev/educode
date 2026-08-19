-- ============================================================
-- EduCode — Baza kontenti tarjimalari: TESTLAR (QUIZZES)
--   Dasturlash asoslari kursidagi asosiy test savollari,
--   javob variantlari (options JSON) va izohlari (ru, en, kaa).
--
-- 42_kontent_tarjimalari.sql dan KEYIN ishga tushiring.
-- Qayta ishga tushirish xavfsiz (ON CONFLICT DO UPDATE).
--
-- TUZATILDI: mavzu slug'lari bazadagilarga moslandi (while-sikli,
-- funksiyalar). Shart operatorlari bloki olib tashlandi — undagi
-- "elif" savoli bazadagi test to'plamida yo'q edi.
-- ============================================================

DO $$
DECLARE
  v_course UUID;
  t_sintaksis UUID;
  t_arifm UUID;
  t_sikl UUID;
  t_royxat UUID;
  t_lugat UUID;
  t_funk UUID;
  v_qid UUID;
BEGIN
  SELECT id INTO v_course FROM courses WHERE slug = 'dasturlash-asoslari-maruza';
  IF v_course IS NULL THEN
    SELECT id INTO v_course FROM courses WHERE slug = 'python-basics' LIMIT 1;
  END IF;

  SELECT id INTO t_sintaksis FROM topics WHERE slug IN ('python-sintaksis', 'python-intro') LIMIT 1;
  SELECT id INTO t_arifm FROM topics WHERE slug IN ('malumot-turlari', 'operators', 'arifmetik-amallar') LIMIT 1;
  SELECT id INTO t_sikl FROM topics WHERE slug IN ('while-sikli', 'takrorlanuvchi-jarayonlar', 'loops') LIMIT 1;
  SELECT id INTO t_royxat FROM topics WHERE slug IN ('royxatlar-va-amallar', 'lists') LIMIT 1;
  SELECT id INTO t_lugat FROM topics WHERE slug IN ('lugatlar-bilan-ishlash', 'lugat-va-toplam') LIMIT 1;
  SELECT id INTO t_funk FROM topics WHERE slug IN ('funksiyalar', 'funksiyalar-va-qamrov', 'functions') LIMIT 1;

  -- ============================================================
  -- 1. SINTAKSIS BO'YICHA TESTLAR
  -- ============================================================
  IF t_sintaksis IS NOT NULL THEN
    -- Test 1 (order_index = 0)
    SELECT id INTO v_qid FROM quizzes WHERE topic_id = t_sintaksis AND order_index = 0 LIMIT 1;
    IF v_qid IS NOT NULL THEN
      -- RU
      INSERT INTO content_translations (resource, row_id, locale, field, value, value_json)
      VALUES ('quizzes', v_qid, 'ru', 'question', 'С помощью чего в Python разделяются блоки кода?', NULL)
      ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

      INSERT INTO content_translations (resource, row_id, locale, field, value, value_json)
      VALUES ('quizzes', v_qid, 'ru', 'options', NULL, '[{"id":"a","text":"Фигурные скобки { }","is_correct":false},{"id":"b","text":"Отступы (пробелы)","is_correct":true},{"id":"c","text":"Точка с запятой ;","is_correct":false},{"id":"d","text":"Ключевые слова begin и end","is_correct":false}]'::jsonb)
      ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value_json = EXCLUDED.value_json;

      INSERT INTO content_translations (resource, row_id, locale, field, value, value_json)
      VALUES ('quizzes', v_qid, 'ru', 'explanation', 'Ключевая особенность Python — границы блоков кода определяются отступами (обычно 4 пробела).', NULL)
      ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

      -- EN
      INSERT INTO content_translations (resource, row_id, locale, field, value, value_json)
      VALUES ('quizzes', v_qid, 'en', 'question', 'How are code blocks demarcated in Python?', NULL)
      ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

      INSERT INTO content_translations (resource, row_id, locale, field, value, value_json)
      VALUES ('quizzes', v_qid, 'en', 'options', NULL, '[{"id":"a","text":"Curly braces { }","is_correct":false},{"id":"b","text":"Indentation (whitespace)","is_correct":true},{"id":"c","text":"Semicolons ;","is_correct":false},{"id":"d","text":"begin and end keywords","is_correct":false}]'::jsonb)
      ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value_json = EXCLUDED.value_json;

      INSERT INTO content_translations (resource, row_id, locale, field, value, value_json)
      VALUES ('quizzes', v_qid, 'en', 'explanation', 'A distinctive feature of Python: block scope is determined by consistent indentation (standardly 4 spaces).', NULL)
      ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

      -- KAA
      INSERT INTO content_translations (resource, row_id, locale, field, value, value_json)
      VALUES ('quizzes', v_qid, 'kaa', 'question', 'Python tilinde kod blokları ne arqalı ajıratıladı?', NULL)
      ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

      INSERT INTO content_translations (resource, row_id, locale, field, value, value_json)
      VALUES ('quizzes', v_qid, 'kaa', 'options', NULL, '[{"id":"a","text":"Figuralı qawsırmalar { }","is_correct":false},{"id":"b","text":"Sheginiw (bos orınlar)","is_correct":true},{"id":"c","text":"Nükteli útir ;","is_correct":false},{"id":"d","text":"begin hám end sózleri","is_correct":false}]'::jsonb)
      ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value_json = EXCLUDED.value_json;

      INSERT INTO content_translations (resource, row_id, locale, field, value, value_json)
      VALUES ('quizzes', v_qid, 'kaa', 'explanation', 'Pythonnıń ózine tán ózgesheligi — blok shegarası sheginiw menen belgilenedi. Ádette 4 bos orın qollanıladı.', NULL)
      ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
    END IF;

    -- Test 2 (order_index = 1)
    SELECT id INTO v_qid FROM quizzes WHERE topic_id = t_sintaksis AND order_index = 1 LIMIT 1;
    IF v_qid IS NOT NULL THEN
      -- RU
      INSERT INTO content_translations (resource, row_id, locale, field, value, value_json)
      VALUES ('quizzes', v_qid, 'ru', 'question', 'Какой тип данных всегда возвращает встроенная функция input()?', NULL)
      ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

      INSERT INTO content_translations (resource, row_id, locale, field, value, value_json)
      VALUES ('quizzes', v_qid, 'ru', 'options', NULL, '[{"id":"a","text":"Всегда строку (str)","is_correct":true},{"id":"b","text":"Число или строку в зависимости от ввода","is_correct":false},{"id":"c","text":"Всегда целое число (int)","is_correct":false},{"id":"d","text":"Логическое значение (bool)","is_correct":false}]'::jsonb)
      ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value_json = EXCLUDED.value_json;

      -- EN
      INSERT INTO content_translations (resource, row_id, locale, field, value, value_json)
      VALUES ('quizzes', v_qid, 'en', 'question', 'What data type does the built-in input() function always return?', NULL)
      ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

      INSERT INTO content_translations (resource, row_id, locale, field, value, value_json)
      VALUES ('quizzes', v_qid, 'en', 'options', NULL, '[{"id":"a","text":"Always a string (str)","is_correct":true},{"id":"b","text":"Number or string dynamically","is_correct":false},{"id":"c","text":"Always an integer (int)","is_correct":false},{"id":"d","text":"Boolean (bool)","is_correct":false}]'::jsonb)
      ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value_json = EXCLUDED.value_json;

      -- KAA
      INSERT INTO content_translations (resource, row_id, locale, field, value, value_json)
      VALUES ('quizzes', v_qid, 'kaa', 'question', 'input() funktsiyası qanday túrdegi mánisti qaytaradı?', NULL)
      ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

      INSERT INTO content_translations (resource, row_id, locale, field, value, value_json)
      VALUES ('quizzes', v_qid, 'kaa', 'options', NULL, '[{"id":"a","text":"Hár dayım tekst (str)","is_correct":true},{"id":"b","text":"Kiritilgen mániske qarap san yamasa tekst","is_correct":false},{"id":"c","text":"Hár dayım pútin san (int)","is_correct":false},{"id":"d","text":"Logikalıq mánis (bool)","is_correct":false}]'::jsonb)
      ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value_json = EXCLUDED.value_json;
    END IF;
  END IF;


  -- ============================================================
  -- 2. SIKLLAR BO'YICHA TESTLAR (while-sikli, 3-savol: break)
  -- ============================================================
  IF t_sikl IS NOT NULL THEN
    SELECT id INTO v_qid FROM quizzes WHERE topic_id = t_sikl AND order_index = 2 LIMIT 1;
    IF v_qid IS NOT NULL THEN
      -- RU
      INSERT INTO content_translations (resource, row_id, locale, field, value, value_json)
      VALUES ('quizzes', v_qid, 'ru', 'question', 'Какой оператор немедленно завершает выполнение текущего цикла?', NULL)
      ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

      INSERT INTO content_translations (resource, row_id, locale, field, value, value_json)
      VALUES ('quizzes', v_qid, 'ru', 'options', NULL, '[{"id":"a","text":"continue","is_correct":false},{"id":"b","text":"break","is_correct":true},{"id":"c","text":"pass","is_correct":false},{"id":"d","text":"exit","is_correct":false}]'::jsonb)
      ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value_json = EXCLUDED.value_json;

      -- EN
      INSERT INTO content_translations (resource, row_id, locale, field, value, value_json)
      VALUES ('quizzes', v_qid, 'en', 'question', 'Which statement immediately terminates the loop execution?', NULL)
      ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

      INSERT INTO content_translations (resource, row_id, locale, field, value, value_json)
      VALUES ('quizzes', v_qid, 'en', 'options', NULL, '[{"id":"a","text":"continue","is_correct":false},{"id":"b","text":"break","is_correct":true},{"id":"c","text":"pass","is_correct":false},{"id":"d","text":"exit","is_correct":false}]'::jsonb)
      ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value_json = EXCLUDED.value_json;

      -- KAA
      INSERT INTO content_translations (resource, row_id, locale, field, value, value_json)
      VALUES ('quizzes', v_qid, 'kaa', 'question', 'Qaysı operator cikldiń orınlanıwın dárriw toqtatadı?', NULL)
      ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

      INSERT INTO content_translations (resource, row_id, locale, field, value, value_json)
      VALUES ('quizzes', v_qid, 'kaa', 'options', NULL, '[{"id":"a","text":"continue","is_correct":false},{"id":"b","text":"break","is_correct":true},{"id":"c","text":"pass","is_correct":false},{"id":"d","text":"exit","is_correct":false}]'::jsonb)
      ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value_json = EXCLUDED.value_json;
    END IF;
  END IF;

  -- ============================================================
  -- 3. FUNKSIYALAR BO'YICHA TESTLAR
  -- ============================================================
  IF t_funk IS NOT NULL THEN
    SELECT id INTO v_qid FROM quizzes WHERE topic_id = t_funk AND order_index = 0 LIMIT 1;
    IF v_qid IS NOT NULL THEN
      -- RU
      INSERT INTO content_translations (resource, row_id, locale, field, value, value_json)
      VALUES ('quizzes', v_qid, 'ru', 'question', 'С помощью какого ключевого слова объявляется функция в Python?', NULL)
      ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

      INSERT INTO content_translations (resource, row_id, locale, field, value, value_json)
      VALUES ('quizzes', v_qid, 'ru', 'options', NULL, '[{"id":"a","text":"function","is_correct":false},{"id":"b","text":"def","is_correct":true},{"id":"c","text":"fn","is_correct":false},{"id":"d","text":"func","is_correct":false}]'::jsonb)
      ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value_json = EXCLUDED.value_json;

      -- EN
      INSERT INTO content_translations (resource, row_id, locale, field, value, value_json)
      VALUES ('quizzes', v_qid, 'en', 'question', 'Which keyword is used to declare a user function in Python?', NULL)
      ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

      INSERT INTO content_translations (resource, row_id, locale, field, value, value_json)
      VALUES ('quizzes', v_qid, 'en', 'options', NULL, '[{"id":"a","text":"function","is_correct":false},{"id":"b","text":"def","is_correct":true},{"id":"c","text":"fn","is_correct":false},{"id":"d","text":"func","is_correct":false}]'::jsonb)
      ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value_json = EXCLUDED.value_json;

      -- KAA
      INSERT INTO content_translations (resource, row_id, locale, field, value, value_json)
      VALUES ('quizzes', v_qid, 'kaa', 'question', 'Python tilinde funktsiya jaratıw ushın qaysı gilt sóz qollanıladı?', NULL)
      ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

      INSERT INTO content_translations (resource, row_id, locale, field, value, value_json)
      VALUES ('quizzes', v_qid, 'kaa', 'options', NULL, '[{"id":"a","text":"function","is_correct":false},{"id":"b","text":"def","is_correct":true},{"id":"c","text":"fn","is_correct":false},{"id":"d","text":"func","is_correct":false}]'::jsonb)
      ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value_json = EXCLUDED.value_json;
    END IF;
  END IF;

END $$;
