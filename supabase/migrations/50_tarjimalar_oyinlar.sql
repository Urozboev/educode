-- ============================================================
-- EduCode — Baza kontenti tarjimalari: DARS O'YINLARI (LESSON GAMES)
--   12 ta interaktiv dars o'yini: nomlari, tavsiflari (ru, en, kaa).
--
-- 42_kontent_tarjimalari.sql dan KEYIN ishga tushiring.
-- Qayta ishga tushirish xavfsiz (ON CONFLICT DO UPDATE).
--
-- TUZATILDI: o'yin slug'lari bazadagilarga moslandi
-- (shartlar-poygasi, modullar-va-funksiyalari). "Ma'lumot turlari
-- viktorinasi" bloki olib tashlandi — bazada bunday o'yin yo'q.
-- ============================================================

DO $$
BEGIN
  -- ============================================================
  -- 1. QUIZ RACE O'YINLARI
  -- ============================================================

  -- 1.1 Sintaksis poygasi
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'lesson_games', id, 'ru', 'title', 'Гонка по синтаксису' FROM lesson_games WHERE slug = 'sintaksis-poygasi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'lesson_games', id, 'ru', 'description', 'Скоростная викторина из 8 вопросов по синтаксису Python для закрепления 1-й темы.' FROM lesson_games WHERE slug = 'sintaksis-poygasi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'lesson_games', id, 'en', 'title', 'Syntax Sprint Race' FROM lesson_games WHERE slug = 'sintaksis-poygasi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'lesson_games', id, 'en', 'description', 'Fast-paced 8-question speed quiz covering Python syntax fundamentals.' FROM lesson_games WHERE slug = 'sintaksis-poygasi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'lesson_games', id, 'kaa', 'title', 'Sintaksis jarısı' FROM lesson_games WHERE slug = 'sintaksis-poygasi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'lesson_games', id, 'kaa', 'description', 'Python sintaksisi boyınsha 8 sorawdan ibarat tezlik viktorinası.' FROM lesson_games WHERE slug = 'sintaksis-poygasi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;


  -- 1.3 Shartlar va sikllar poygasi
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'lesson_games', id, 'ru', 'title', 'Гонка условий и циклов' FROM lesson_games WHERE slug = 'shartlar-poygasi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'lesson_games', id, 'en', 'title', 'Conditions & Loops Race' FROM lesson_games WHERE slug = 'shartlar-poygasi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'lesson_games', id, 'kaa', 'title', 'Shártler hám cikller jarısı' FROM lesson_games WHERE slug = 'shartlar-poygasi'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- 1.4 Funksiya va modul poygasi
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'lesson_games', id, 'ru', 'title', 'Гонка функций и модулей' FROM lesson_games WHERE slug = 'modullar-va-funksiyalari'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'lesson_games', id, 'en', 'title', 'Functions & Modules Sprint' FROM lesson_games WHERE slug = 'modullar-va-funksiyalari'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'lesson_games', id, 'kaa', 'title', 'Funktsiyalar hám moduller jarısı' FROM lesson_games WHERE slug = 'modullar-va-funksiyalari'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;


  -- ============================================================
  -- 2. MATCH PAIRS (JUFTLIKLAR)
  -- ============================================================

  -- 2.1 Xatolar va sabablari
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'lesson_games', id, 'ru', 'title', 'Ошибки и их причины' FROM lesson_games WHERE slug = 'xatolar-va-sabablari'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'lesson_games', id, 'ru', 'description', 'Сопоставьте каждый тип ошибки с ситуацией, которая её вызывает.' FROM lesson_games WHERE slug = 'xatolar-va-sabablari'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'lesson_games', id, 'en', 'title', 'Errors & Their Causes' FROM lesson_games WHERE slug = 'xatolar-va-sabablari'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'lesson_games', id, 'en', 'description', 'Match each Python exception type with the bug scenario that triggers it.' FROM lesson_games WHERE slug = 'xatolar-va-sabablari'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'lesson_games', id, 'kaa', 'title', 'Qátelikler hám olardıń sebepleri' FROM lesson_games WHERE slug = 'xatolar-va-sabablari'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'lesson_games', id, 'kaa', 'description', 'Hár bir qátelik túrin onı keltirip shıǵaratuǵın jaǵday menen sáykeslendiriń.' FROM lesson_games WHERE slug = 'xatolar-va-sabablari'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- 2.2 Amallar va natijalari
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'lesson_games', id, 'ru', 'title', 'Операции и результаты' FROM lesson_games WHERE slug = 'amallar-va-natijalari'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'lesson_games', id, 'en', 'title', 'Operations & Results' FROM lesson_games WHERE slug = 'amallar-va-natijalari'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'lesson_games', id, 'kaa', 'title', 'Ámeller hám nátiyjeleri' FROM lesson_games WHERE slug = 'amallar-va-natijalari'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- 2.3 Matn metodlari
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'lesson_games', id, 'ru', 'title', 'Методы строк' FROM lesson_games WHERE slug = 'matn-metodlari'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'lesson_games', id, 'en', 'title', 'String Methods Match' FROM lesson_games WHERE slug = 'matn-metodlari'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'lesson_games', id, 'kaa', 'title', 'Tekst metodları' FROM lesson_games WHERE slug = 'matn-metodlari'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- 2.4 Modullar va funksiyalari
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'lesson_games', id, 'ru', 'title', 'Модули и функции' FROM lesson_games WHERE slug = 'modullar-va-funksiyalari'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'lesson_games', id, 'en', 'title', 'Modules & Functions' FROM lesson_games WHERE slug = 'modullar-va-funksiyalari'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'lesson_games', id, 'kaa', 'title', 'Moduller hám funktsiyaları' FROM lesson_games WHERE slug = 'modullar-va-funksiyalari'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;


  -- ============================================================
  -- 3. JEOPARDY & KROSSVORDLAR
  -- ============================================================

  -- 3.1 Dasturlash asoslari jeopardy
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'lesson_games', id, 'ru', 'title', 'Своя игра: Основы программирования' FROM lesson_games WHERE slug = 'dasturlash-asoslari-jeopardy'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'lesson_games', id, 'ru', 'description', 'Четыре категории вопросов по 5 уровней сложности для командной игры в классе.' FROM lesson_games WHERE slug = 'dasturlash-asoslari-jeopardy'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'lesson_games', id, 'en', 'title', 'Jeopardy: Programming Fundamentals' FROM lesson_games WHERE slug = 'dasturlash-asoslari-jeopardy'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'lesson_games', id, 'en', 'description', 'Four categories across 5 difficulty levels designed for interactive classroom group competition.' FROM lesson_games WHERE slug = 'dasturlash-asoslari-jeopardy'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'lesson_games', id, 'kaa', 'title', 'Dastúrlew tiykarları: taxta oyını' FROM lesson_games WHERE slug = 'dasturlash-asoslari-jeopardy'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'lesson_games', id, 'kaa', 'description', 'Tórt kategoriya, hár birinde 5 ten soraw. Toparlarǵa bólip oynaw ushın.' FROM lesson_games WHERE slug = 'dasturlash-asoslari-jeopardy'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

  -- 3.2 Python atamalari krossvord
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'lesson_games', id, 'ru', 'title', 'Кроссворд: Термины Python' FROM lesson_games WHERE slug = 'python-atamalari-krossvord'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'lesson_games', id, 'en', 'title', 'Crossword: Python Terminology' FROM lesson_games WHERE slug = 'python-atamalari-krossvord'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;
  INSERT INTO content_translations (resource, row_id, locale, field, value)
  SELECT 'lesson_games', id, 'kaa', 'title', 'Krossvord: Python terminleri' FROM lesson_games WHERE slug = 'python-atamalari-krossvord'
  ON CONFLICT (resource, row_id, locale, field) DO UPDATE SET value = EXCLUDED.value;

END $$;
