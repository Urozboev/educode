-- ============================================
-- EduCode — Coin iqtisodini qayta balanslash
--
-- MUAMMOLAR (mavjud holat tahlili):
--  1. QuizBattle3D har o'yinda 15 coingacha beradi va CHEKLOV YO'Q —
--     o'yinni qayta-qayta o'ynab cheksiz coin yig'ish mumkin edi.
--     Bu butun iqtisodni ma'nosiz qiladi. Endi kuniga bir marta.
--  2. Registratsiya bonusi 100 — bu 10 ta mavzu tugatishga teng edi.
--     Ro'yxatdan o'tish eng katta daromad manbai bo'lmasligi kerak.
--  3. Mavzu o'qish (10) kod topshirig'idan (5) ikki barobar qimmat edi.
--     Passiv faoliyat faol faoliyatdan ko'p to'lardi — teskari mantiq.
--  4. Topshiriq qiyinligi coinга deyarli ta'sir qilmasdi (5/8/12),
--     `challenges` da esa umuman qilmasdi (hammasi 5).
--  5. Kurs tugatish mukofoti kurs hajmiga bog'liq emasdi: 24 mavzuli
--     kurs ham, 6 mavzuli kurs ham 50 coin berardi.
--
-- TAMOYIL: 1 coin ≈ bir birlik amaliy mehnat.
--   passiv (o'qish) arzon → faol (kod yozish) qimmat → qiyinlik keskin farqlansin.
--
-- YANGI SHKALA
--   Mavzu tugatish ............  6
--   Topshiriq: oson/o'rta/qiyin  5 / 10 / 18
--   Masala:    oson/o'rta/qiyin 10 / 18 / 30
--   Dars o'yini (bir marta) ...  4 (viktorina, juftlik) / 6 (jeopardy, krossvord)
--   Kurs tugatish ............. mavzular soni × 4
--   Registratsiya bonusi ......  25
--   Quiz Battle 3D ............  kuniga 1 marta, eng ko'pi 8
--
-- Bir semestrda tirishqoq talaba ~1400 coin yig'adi va shuning
-- 60% dan ortig'i kod yozish orqali keladi.
--
-- 35_dokon_va_oqituvchi_sovgalari.sql dan KEYIN ishga tushiring.
-- Qayta ishga tushirish xavfsiz.
-- ============================================

-- ============================================
-- 1. MAVZULAR
-- ============================================
UPDATE topics SET coin_reward = 6 WHERE coin_reward IS DISTINCT FROM 6;
ALTER TABLE topics ALTER COLUMN coin_reward SET DEFAULT 6;

-- ============================================
-- 2. MAVZU TOPSHIRIQLARI — qiyinlikka qarab
-- ============================================
UPDATE topic_tasks SET coin_reward = 5,  xp_reward = 15 WHERE difficulty = 'easy';
UPDATE topic_tasks SET coin_reward = 10, xp_reward = 30 WHERE difficulty = 'medium';
UPDATE topic_tasks SET coin_reward = 18, xp_reward = 55 WHERE difficulty = 'hard';
ALTER TABLE topic_tasks ALTER COLUMN coin_reward SET DEFAULT 5;

-- ============================================
-- 3. MUSTAQIL MASALALAR (challenges)
-- Mavzu topshirig'idan qimmatroq: kontekstsiz, mustaqil yechiladi
-- ============================================
UPDATE challenges SET coin_reward = 10, xp_reward = 30 WHERE difficulty = 'easy';
UPDATE challenges SET coin_reward = 18, xp_reward = 55 WHERE difficulty = 'medium';
UPDATE challenges SET coin_reward = 30, xp_reward = 90 WHERE difficulty = 'hard';
ALTER TABLE challenges ALTER COLUMN coin_reward SET DEFAULT 10;

-- ============================================
-- 4. DARS O'YINLARI
-- Bir marta o'ynaladi (finish_lesson_game takroriy to'lamaydi),
-- shuning uchun kichik, lekin sezilarli
-- ============================================
UPDATE lesson_games SET coin_reward = 4, xp_reward = 12 WHERE type IN ('quiz_race','match_pairs');
UPDATE lesson_games SET coin_reward = 6, xp_reward = 20 WHERE type IN ('jeopardy','crossword');
ALTER TABLE lesson_games ALTER COLUMN coin_reward SET DEFAULT 4;

-- ============================================
-- 5. KURSLAR — hajmga bog'liq
-- ============================================
UPDATE courses c SET coin_reward = GREATEST(20, t.n * 4)
  FROM (SELECT course_id, COUNT(*) AS n FROM topics WHERE is_published GROUP BY course_id) t
 WHERE c.id = t.course_id;
-- Mavzusi yo'q kurslar uchun eng kichik qiymat
UPDATE courses SET coin_reward = 20
 WHERE id NOT IN (SELECT DISTINCT course_id FROM topics WHERE is_published);
ALTER TABLE courses ALTER COLUMN coin_reward SET DEFAULT 20;

-- ============================================
-- 6. YUTUQLAR (achievements)
-- Yutuq — bonus, asosiy daromad emas. Qiyinligi bo'yicha zinapoya.
-- ============================================
UPDATE achievements SET coin_reward = 5,   xp_reward = 15  WHERE requirement_count <= 1;
UPDATE achievements SET coin_reward = 10,  xp_reward = 30  WHERE requirement_count BETWEEN 2 AND 5;
UPDATE achievements SET coin_reward = 20,  xp_reward = 60  WHERE requirement_count BETWEEN 6 AND 10;
UPDATE achievements SET coin_reward = 40,  xp_reward = 120 WHERE requirement_count BETWEEN 11 AND 30;
UPDATE achievements SET coin_reward = 80,  xp_reward = 250 WHERE requirement_count > 30;

-- ============================================
-- 7. QUIZ BATTLE 3D — kunlik chegara
-- Eng katta teshik shu yerda edi: o'yin cheksiz qayta o'ynalib,
-- har safar coin berardi. Endi mukofot serverda beriladi va
-- kuniga bir marta bilan cheklanadi.
-- ============================================
CREATE OR REPLACE FUNCTION public.award_quiz_battle(p_correct INT, p_total INT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $fn$
DECLARE
  v_user UUID := auth.uid();
  v_today_count INT;
  v_coins INT;
  v_xp INT;
  v_balance INT;
BEGIN
  IF v_user IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'coins', 0, 'reason', 'auth');
  END IF;

  IF p_correct IS NULL OR p_correct <= 0 OR p_total IS NULL OR p_total <= 0 THEN
    RETURN jsonb_build_object('ok', true, 'coins', 0, 'reason', 'no_correct');
  END IF;

  -- Bugun allaqachon mukofot olganmi?
  SELECT COUNT(*) INTO v_today_count
    FROM coin_transactions
   WHERE user_id = v_user
     AND type = 'quiz_bonus'
     AND created_at >= date_trunc('day', now());

  IF v_today_count > 0 THEN
    RETURN jsonb_build_object('ok', true, 'coins', 0, 'reason', 'daily_limit',
      'message', 'Bugungi mukofot allaqachon olingan. Ertaga yana urinib ko''ring.');
  END IF;

  -- Eng ko'pi 8 coin, to'g'ri javoblar ulushiga qarab
  v_coins := LEAST(8, GREATEST(1, (p_correct * 8) / GREATEST(p_total, 1)));
  v_xp := v_coins * 3;

  SELECT coins INTO v_balance FROM profiles WHERE id = v_user FOR UPDATE;
  IF v_balance IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'coins', 0, 'reason', 'no_profile');
  END IF;
  v_balance := v_balance + v_coins;

  UPDATE profiles SET coins = v_balance, xp = xp + v_xp WHERE id = v_user;

  INSERT INTO coin_transactions (user_id, amount, type, description, balance_after)
  VALUES (v_user, v_coins, 'quiz_bonus',
          format('Quiz Battle 3D: %s/%s to''g''ri javob', p_correct, p_total), v_balance);

  RETURN jsonb_build_object('ok', true, 'coins', v_coins, 'xp', v_xp, 'balance', v_balance);
END;
$fn$;

GRANT EXECUTE ON FUNCTION public.award_quiz_battle(INT, INT) TO authenticated;

-- ============================================
-- 8. RO'YXATDAN O'TISH BONUSI
-- Kod `src/lib/profile.ts` da 25 ga o'zgartirildi.
-- Bazadagi sukut qiymati ham moslashtiriladi.
-- ============================================
ALTER TABLE profiles ALTER COLUMN coins SET DEFAULT 25;

-- ============================================
-- 9. DO'KON NARXLARI
-- Bir semestrda ~1400 coin yig'iladi. Narxlar shunga qarab qo'yiladi:
--   raqamli / ramziy .... 60-200   (bir necha hafta ish)
--   o'rta ............... 350-600  (yarim semestr)
--   katta ............... 800-1200 (deyarli butun semestr)
--   premium ............ 1800+     (bir semestrdan ortiq — uzoq maqsad)
-- ============================================
-- Platforma sovg'alari (owner_id NULL). Dublikat bo'lmasligi uchun nomi
-- bo'yicha tekshiriladi — store_items da title unikal emas.
INSERT INTO store_items (title, description, price_coins, category, stock, delivery_type, audience, order_index, is_active)
SELECT * FROM (VALUES
('Profil uchun oltin ramka', 'Profilingiz avatariga 30 kunlik oltin ramka. Reytingda ajralib turasiz.', 60, 'digital', 999, 'digital', 'everyone', 1, true),
('EduCode stikerlar to''plami', '10 ta vinil stiker: Python, algoritm va EduCode logotipi. Noutbuk uchun.', 150, 'accessory', 50, 'delivery', 'everyone', 2, true),
('Brendli ruchka va bloknot', 'A5 bloknot va gel ruchka — dars konspekti uchun.', 200, 'accessory', 40, 'delivery', 'everyone', 3, true),
('EduCode futbolkasi', 'Paxta futbolka, dasturchi hazillari bosilgan. O''lchamni izohda yozing.', 450, 'clothing', 25, 'delivery', 'everyone', 4, true),
('Termos krujka', '350 ml po''lat termos krujka, EduCode logotipi bilan.', 550, 'accessory', 20, 'delivery', 'everyone', 5, true),
('"Python dasturlash tili" kitobi', 'Sh. A. Mengliyeva va hammualliflar, Termiz 2021. Qog''oz nashri.', 800, 'book', 15, 'delivery', 'everyone', 6, true),
('Simsiz sichqoncha', 'Ergonomik simsiz sichqoncha — uzoq kod yozish uchun.', 950, 'tech', 10, 'delivery', 'everyone', 7, true),
('Quloqchin', 'Shovqinni pasaytiruvchi quloqchin — diqqatni jamlash uchun.', 1200, 'tech', 8, 'delivery', 'everyone', 8, true),
('Mexanik klaviatura', 'Mexanik klaviatura, ko''k switch. Semestr bo''yi mehnatning mukofoti.', 2000, 'tech', 3, 'delivery', 'everyone', 9, true),
('Individual mentor soati', 'Tajribali dasturchi bilan 1 soatlik shaxsiy onlayn mashg''ulot.', 700, 'service', 12, 'digital', 'everyone', 10, true)
) AS v(title, description, price_coins, category, stock, delivery_type, audience, order_index, is_active)
WHERE NOT EXISTS (SELECT 1 FROM store_items s WHERE s.title = v.title);

-- Eski sovg'alarning tekin qolib ketgan narxlarini tuzatish
UPDATE store_items SET price_coins = 150 WHERE price_coins < 50;
