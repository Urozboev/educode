-- ============================================
-- EduCode — Bunny videolarni "Kompyuter savodxonligi" darslariga bog'lash
-- Library 702991 dagi 13 ta video GUID → topic slug (1-N)
-- Idempotent: qayta ishga tushirsa faqat qiymatni yangilaydi.
-- Supabase SQL Editor da ishga tushiring.
-- ============================================

DO $$
DECLARE
  v_course UUID;
  -- lesson_slug => bunny_guid
  m TEXT[][] := ARRAY[
    ['1-1',  '3e3c6879-f131-472d-bf3b-d107b7731df1'],  -- Kompyuter va uning turlari
    ['1-2',  '67348f10-810b-40b5-acde-26f2ed393921'],  -- Asosiy qismlar
    ['1-3',  'c5d63ea9-a7d1-4349-9fdf-9aa1bf66b049'],  -- O'chirib-yoqish
    ['1-4',  '8fbeea68-8de8-46c4-86a9-4017a7529e05'],  -- Operatsion tizim
    ['1-5',  '16da4826-28df-46b9-bd60-96f74896fdb9'],  -- Ish stoli
    ['1-6',  'd707703e-4150-41f1-bead-c72e35733572'],  -- Fayl va papkalar
    ['1-7',  '67db60fa-4663-4eb2-a865-d0764c816f58'],  -- Fayl kengaytmalari
    ['1-8',  '1e1c995a-a4a4-4fe4-9c4a-8dd30dc97b0c'],  -- Fayl qidirish
    ['1-9',  '8a132cd7-24df-4489-a73e-7fa04d7fe586'],  -- Klaviatura
    ['1-11', 'f9aaf07d-1692-4158-af8f-de29a5d15154'],  -- Tezkor tugmalar
    ['1-12', 'ba4ddc49-5757-48f0-a4e0-f6a7d09aac12'],  -- Sozlamalar
    ['1-13', 'e5c3de1b-51ec-45a5-a472-544c85001204'],  -- Dastur o'rnatish
    ['1-15', '6e35d54f-882f-4dda-85ba-be1f1689a3f7']   -- Xotira turlari
  ];
  i INT;
BEGIN
  SELECT id INTO v_course FROM courses WHERE slug = 'kompyuter-savodxonligi';
  IF v_course IS NULL THEN
    RAISE NOTICE 'Kurs topilmadi — avval 10_seed ni ishga tushiring';
    RETURN;
  END IF;

  FOR i IN 1 .. array_length(m, 1) LOOP
    UPDATE topics
    SET video_provider = 'bunny',
        video_id = m[i][2]
    WHERE course_id = v_course AND slug = m[i][1];
  END LOOP;

  RAISE NOTICE 'Bunny videolar bog''landi (% ta dars)', array_length(m, 1);
END $$;
