-- ============================================================
-- MirAcademy — "Biz haqimizda" sahifasidagi muallif rasmi
--
-- MUAMMO
-- `about_page.author_image` da `blob:https://my.gov.uz/...` manzili
-- saqlangan edi. blob: manzil faqat u yaratilgan brauzer oynasida
-- yashaydi — saytga kirgan boshqa hech kim rasmni ko'rmasdi.
--
-- YECHIM
-- Rasm loyiha bilan birga joylashtirildi: public/images/about/muallif.jpg
-- Bu migratsiya sahifani shu faylga yo'naltiradi.
--
-- MUHIM: rasm sayt bilan birga deploy qilinadi. Avval kodni GitHub'ga
-- yuboring va Vercel deploy'i tugaganini kuting, keyin shu SQL ni
-- ishga tushiring — aks holda bir necha daqiqa rasm o'rnida bo'sh joy
-- ko'rinadi.
--
-- Keyinchalik rasmni almashtirish uchun SQL kerak emas: admin panel →
-- "Biz haqimizda" → "Rasm yuklash" tugmasi.
--
-- Supabase SQL Editor da ishga tushiring. Qayta ishga tushirish xavfsiz.
-- ============================================================

INSERT INTO about_page (key, value, updated_at)
VALUES ('author_image', '/images/about/muallif.jpg', now())
ON CONFLICT (key) DO UPDATE
  SET value = EXCLUDED.value,
      updated_at = now();

SELECT key, value FROM about_page WHERE key = 'author_image';
