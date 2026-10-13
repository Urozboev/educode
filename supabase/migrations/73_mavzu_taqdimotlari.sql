-- ============================================================
-- MirAcademy — Mavzu taqdimotlari (slides)
--
-- Har bir mavzuga ichki taqdimot: `topics.slides` JSONB ustunida
-- slaydlar massivi. Mavzu sahifasida "Taqdimot" tabida
-- src/components/courses/SlideDeck.tsx orqali ko'rsatiladi.
--
-- Nega tashqi fayl (PowerPoint, Google Slides) emas:
--   · platforma dizayni va yorug'/qorong'i rejim bilan bir xil ko'rinadi
--   · telefonda ham o'qiladi, surib varaqlanadi
--   · savol slaydlari interaktiv, mini topshiriq Playground'da ochiladi
--   · tarjima qilinadi (content_translations orqali, quyida reyestr)
--
-- Eski `presentation_url` ustuni saqlanadi: slaydlar bo'lmagan mavzuda
-- admin qo'ygan tashqi havola avvalgidek ko'rsatiladi.
--
-- Slayd turlari: title, idea, points, code, compare, table, quiz,
-- task, summary — tuzilmasi src/types/index.ts dagi `Slide` turida.
--
-- Supabase SQL Editor da ishga tushiring. Qayta ishga tushirish xavfsiz.
-- Keyin 74, 75, 76 migratsiyalar slaydlarni to'ldiradi.
-- ============================================================

ALTER TABLE topics ADD COLUMN IF NOT EXISTS slides JSONB;

-- Faqat massiv yoki NULL saqlanishi mumkin
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'topics_slides_is_array'
  ) THEN
    ALTER TABLE topics
      ADD CONSTRAINT topics_slides_is_array
      CHECK (slides IS NULL OR jsonb_typeof(slides) = 'array');
  END IF;
END $$;

-- Admin paneldagi tarjimalar bo'limida ko'rinsin
INSERT INTO translatable_fields (resource, field, kind, label, order_index)
VALUES ('topics', 'slides', 'json', 'Taqdimot slaydlari', 5)
ON CONFLICT (resource, field) DO NOTHING;
