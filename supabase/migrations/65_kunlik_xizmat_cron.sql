-- ============================================================
-- MirAcademy — Kunlik avtomatik xizmat (Vercel Cron chaqiradi)
--
-- MUAMMO
-- Bazada `streak_days`, `longest_streak`, `user_streaks` va
-- `user_achievements` jadvallari bor, lekin ularni HECH KIM
-- to'ldirmaydi. Shuning uchun:
--   · reyting va dashboard'dagi olov belgisi doim 0 ko'rsatadi
--   · yutuqlar (achievements) hech qachon berilmaydi
--
-- YECHIM
-- Har kecha bir marta ishlaydigan funksiya:
--   1. Faollik kunlarini `user_streaks` ga yig'adi
--   2. Ketma-ket kunlarni sanab `streak_days` / `longest_streak` ni yangilaydi
--   3. Shartini bajargan foydalanuvchilarga yutuqlarni beradi
--      (coin va XP bilan birga, tranzaksiya yozuvini qoldirib)
--
-- Sana hisobi Toshkent vaqtida yuritiladi — talaba kechqurun 23:00 da
-- topshiriq yechsa, bu UTC bo'yicha ertangi kun bo'lib qolmasligi kerak.
--
-- Qayta ishga tushirish xavfsiz. Funksiya idempotent: ikki marta
-- chaqirilsa ham yutuq ikki marta berilmaydi.
--
-- DIQQAT: birinchi ishga tushirishda tarixdagi hamma yutuq bir vaqtda
-- beriladi. Bu kutilgan holat — ular allaqachon haqiqatda qo'lga
-- kiritilgan edi, shunchaki hech kim bermagan.
--
-- Supabase SQL Editor da ishga tushiring.
-- ============================================================

CREATE OR REPLACE FUNCTION public.run_daily_maintenance()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_today     DATE := (now() AT TIME ZONE 'Asia/Tashkent')::date;
  v_kunlar    INT  := 0;   -- yozilgan faollik kunlari
  v_streaklar INT  := 0;   -- streak'i o'zgargan foydalanuvchilar
  v_nollandi  INT  := 0;   -- streak'i uzilgan foydalanuvchilar
  v_yutuqlar  INT  := 0;   -- berilgan yutuqlar
  v_coinlar   INT  := 0;   -- berilgan coinlar
  v_balans    INT;
  r           RECORD;
BEGIN
  ------------------------------------------------------------
  -- 1. FAOLLIK KUNLARI
  --
  -- Faol kun deb hisoblanadi: qabul qilingan yechim, tugatilgan
  -- mavzu yoki topshirilgan test. Oxirgi 400 kun qayta hisoblanadi
  -- — bu o'z-o'zini tuzatadi, ya'ni bir kecha cron ishlamay qolsa
  -- ham ertasi kuni hammasi joyiga tushadi.
  ------------------------------------------------------------
  WITH faollik AS (
    SELECT user_id,
           (created_at AT TIME ZONE 'Asia/Tashkent')::date AS kun,
           count(*)::int AS soni
      FROM submissions
     WHERE status = 'accepted'
       AND created_at > now() - INTERVAL '400 days'
     GROUP BY 1, 2

    UNION ALL

    SELECT user_id,
           (completed_at AT TIME ZONE 'Asia/Tashkent')::date,
           count(*)::int
      FROM topic_progress
     WHERE is_completed = true
       AND completed_at IS NOT NULL
       AND completed_at > now() - INTERVAL '400 days'
     GROUP BY 1, 2

    UNION ALL

    SELECT user_id,
           (completed_at AT TIME ZONE 'Asia/Tashkent')::date,
           count(*)::int
      FROM quiz_results
     WHERE completed_at > now() - INTERVAL '400 days'
     GROUP BY 1, 2
  ),
  jamlangan AS (
    SELECT user_id, kun, sum(soni)::int AS soni
      FROM faollik
     GROUP BY 1, 2
  ),
  yozildi AS (
    INSERT INTO user_streaks (user_id, date, activities_count)
    SELECT user_id, kun, soni FROM jamlangan
    ON CONFLICT (user_id, date)
    DO UPDATE SET activities_count = EXCLUDED.activities_count
    RETURNING 1
  )
  SELECT count(*)::int INTO v_kunlar FROM yozildi;

  ------------------------------------------------------------
  -- 2. KETMA-KET KUNLARNI SANASH
  --
  -- Usul: har bir sanadan uning tartib raqamini ayiramiz. Ketma-ket
  -- kunlar uchun bu ayirma bir xil chiqadi, demak ular bitta guruhga
  -- tushadi. Guruhdagi kunlar soni — streak uzunligi.
  --
  -- Joriy streak deb bugun yoki kecha tugagan guruh olinadi: bugun
  -- hali hech narsa qilmagan talabaning seriyasi uzilgan hisoblanmaydi.
  ------------------------------------------------------------
  WITH guruh AS (
    SELECT user_id,
           date,
           date - (row_number() OVER (PARTITION BY user_id ORDER BY date))::int AS g
      FROM user_streaks
  ),
  ketma_ket AS (
    SELECT user_id, g, count(*)::int AS uzunlik, max(date) AS oxirgi_kun
      FROM guruh
     GROUP BY user_id, g
  ),
  hisob AS (
    SELECT user_id,
           COALESCE(max(uzunlik) FILTER (WHERE oxirgi_kun >= v_today - 1), 0) AS joriy,
           max(uzunlik) AS eng_uzun
      FROM ketma_ket
     GROUP BY user_id
  ),
  yangilandi AS (
    UPDATE profiles p
       SET streak_days    = h.joriy,
           longest_streak = GREATEST(COALESCE(p.longest_streak, 0), h.eng_uzun)
      FROM hisob h
     WHERE p.id = h.user_id
       AND (p.streak_days IS DISTINCT FROM h.joriy
            OR COALESCE(p.longest_streak, 0) < h.eng_uzun)
    RETURNING 1
  )
  SELECT count(*)::int INTO v_streaklar FROM yangilandi;

  -- Umuman faollik yozuvi yo'q, lekin streak'i nolga teng bo'lmaganlar
  WITH nollandi AS (
    UPDATE profiles p
       SET streak_days = 0
     WHERE p.streak_days <> 0
       AND NOT EXISTS (
         SELECT 1 FROM user_streaks s
          WHERE s.user_id = p.id AND s.date >= v_today - 1
       )
    RETURNING 1
  )
  SELECT count(*)::int INTO v_nollandi FROM nollandi;

  ------------------------------------------------------------
  -- 3. YUTUQLAR
  --
  -- Har bir yutuqning `requirement_type` maydoni qaysi ko'rsatkichga
  -- qarashni aytadi. Shartni bajargan, lekin hali olmagan har bir
  -- juftlikka yutuq beriladi.
  --
  -- Sikl ishlatilgan, chunki har bir yutuq uchun uchta narsa kerak:
  -- yozuv, balans o'zgarishi va tranzaksiya tarixi. Bitta so'rovda
  -- balansni ketma-ket oshirib borishning iloji yo'q.
  ------------------------------------------------------------
  FOR r IN
    WITH korsatkich AS (
      SELECT p.id AS user_id,
             p.streak_days,
             (SELECT count(DISTINCT s.task_id) FROM submissions s
               WHERE s.user_id = p.id AND s.status = 'accepted')      AS challenges_solved,
             (SELECT count(*) FROM enrollments e
               WHERE e.user_id = p.id AND e.is_completed = true)      AS courses_completed,
             (SELECT count(*) FROM quiz_results q
               WHERE q.user_id = p.id AND q.percentage >= 60)         AS quizzes_passed
        FROM profiles p
       WHERE p.role = 'student' AND p.is_blocked = false
    )
    SELECT k.user_id,
           a.id          AS ach_id,
           a.title       AS ach_title,
           a.coin_reward,
           a.xp_reward
      FROM korsatkich k
      JOIN achievements a
        ON (CASE a.requirement_type
              WHEN 'streak_days'       THEN k.streak_days
              WHEN 'challenges_solved' THEN k.challenges_solved
              WHEN 'courses_completed' THEN k.courses_completed
              WHEN 'quizzes_passed'    THEN k.quizzes_passed
              ELSE -1
            END) >= a.requirement_count
     WHERE NOT EXISTS (
       SELECT 1 FROM user_achievements ua
        WHERE ua.user_id = k.user_id AND ua.achievement_id = a.id
     )
  LOOP
    INSERT INTO user_achievements (user_id, achievement_id)
    VALUES (r.user_id, r.ach_id)
    ON CONFLICT DO NOTHING;

    UPDATE profiles
       SET coins = coins + COALESCE(r.coin_reward, 0),
           xp    = xp    + COALESCE(r.xp_reward, 0)
     WHERE id = r.user_id
    RETURNING coins INTO v_balans;

    IF COALESCE(r.coin_reward, 0) <> 0 THEN
      INSERT INTO coin_transactions
        (user_id, amount, type, reference_id, description, balance_after)
      VALUES
        (r.user_id, r.coin_reward, 'achievement_bonus', r.ach_id,
         'Yutuq: ' || r.ach_title, v_balans);
    END IF;

    v_yutuqlar := v_yutuqlar + 1;
    v_coinlar  := v_coinlar + COALESCE(r.coin_reward, 0);
  END LOOP;

  RETURN jsonb_build_object(
    'sana',             v_today,
    'faollik_kunlari',  v_kunlar,
    'streak_yangilandi', v_streaklar,
    'streak_uzildi',    v_nollandi,
    'yutuq_berildi',    v_yutuqlar,
    'coin_berildi',     v_coinlar
  );
END;
$$;

-- Funksiyani faqat server (service_role) chaqiradi. Oddiy foydalanuvchi
-- chaqira olmasligi kerak — u coin va XP beradi.
REVOKE ALL ON FUNCTION public.run_daily_maintenance() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.run_daily_maintenance() TO service_role;

-- Ketma-ketlikni sanash user_streaks ni to'liq o'qiydi
CREATE INDEX IF NOT EXISTS user_streaks_user_date_idx ON user_streaks(user_id, date);

-- ------------------------------------------------------------
-- Qo'lda sinab ko'rish (SQL Editor service_role huquqi bilan ishlaydi):
--   SELECT public.run_daily_maintenance();
-- ------------------------------------------------------------
