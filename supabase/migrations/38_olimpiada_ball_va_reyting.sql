-- ============================================
-- EduCode — Olimpiada: ball tizimi va reytingni tuzatish
--
-- TUZATILADIGAN MUAMMOLAR
--  1. Reyting BO'SH ko'rinardi. Sabab: `contest_standings` ishtirokchilarni
--     faqat `contest_participants` jadvalidan olardi. Masalani yechgan,
--     lekin "Ro'yxatdan o'tish" tugmasini bosmagan odam reytingga umuman
--     tushmasdi. Endi ro'yxatdan o'tganlar VA musobaqa vaqtida yechim
--     yuborganlar birga hisobga olinadi.
--  2. Ball tizimi yo'q edi — faqat ICPC jarima vaqti bor edi.
--     Endi har masala qiyinligiga qarab ball oladi (oson 100, o'rta 200,
--     qiyin 300), ball esa yechish vaqti va noto'g'ri urinishlar uchun
--     kamayadi.
--  3. Reytingda kim qaysi masalani yechgani ko'rinmasdi. Endi har katak
--     uchun holat qaytariladi: yechilgan / urinilgan / tegilmagan.
--
-- TARTIBLASH: yechilgan masalalar soni → ball (ko'p bo'lgani yuqori)
--             → jarima vaqti (kam bo'lgani yuqori).
--             Masala soni birlamchi, ball esa teng natijalarni ajratadi.
--
-- BALL FORMULASI (bir masala uchun)
--     ball = asos × vaqt_koeffitsiyenti × urinish_koeffitsiyenti
--     asos ................ oson 100 / o'rta 200 / qiyin 300
--     vaqt_koeffitsiyenti .. 1.0 dan 0.5 gacha chiziqli kamayadi
--                            (musobaqa boshida 1.0, oxirida 0.5)
--     urinish_koeff ........ har noto'g'ri urinish −10%, eng kami 0.6
--   Ya'ni eng yomon holatda ham masala asos balining 30% ini beradi —
--   kech yechgan odam ham butunlay quruq qolmaydi.
--
-- MASHQ REJIMI: masalalar musobaqa TUGAGANDAN keyin ochiladi. Boshlanishidan
--   oldin yopiq (oldindan tayyorlanib olishning oldini oladi), tugagach
--   mashq uchun ochiq, lekin bunday yechimlar reytingga kirmaydi.
--
-- 22_contests.sql va 34_olimpiada_masalalar.sql dan KEYIN ishga tushiring.
-- Qayta ishga tushirish xavfsiz.
-- ============================================

-- ============================================
-- 1. MASALA BALI
-- ============================================
ALTER TABLE contest_problems ADD COLUMN IF NOT EXISTS points INT;

-- Qiyinlikka qarab avtomatik to'ldiramiz
UPDATE contest_problems cp
   SET points = CASE ch.difficulty
         WHEN 'easy' THEN 100
         WHEN 'medium' THEN 200
         WHEN 'hard' THEN 300
         ELSE 150
       END
  FROM challenges ch
 WHERE ch.id = cp.challenge_id AND cp.points IS NULL;

ALTER TABLE contest_problems ALTER COLUMN points SET DEFAULT 100;
UPDATE contest_problems SET points = 100 WHERE points IS NULL;
ALTER TABLE contest_problems ALTER COLUMN points SET NOT NULL;

-- ============================================
-- 2. MUSOBAQAGA QO'SHILISH
-- Ilgari mijoz to'g'ridan-to'g'ri INSERT qilardi. Endi RPC: masalani
-- ochgan odam avtomatik ro'yxatga tushadi va "yechdim, lekin reytingda
-- yo'qman" holati umuman yuzaga kelmaydi.
-- ============================================
CREATE OR REPLACE FUNCTION public.join_contest(p_slug TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $fn$
DECLARE
  v_user UUID := auth.uid();
  v_c RECORD;
BEGIN
  IF v_user IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'message', 'Avval tizimga kiring');
  END IF;

  SELECT * INTO v_c FROM contests WHERE slug = p_slug AND is_published = true;
  IF v_c.id IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'message', 'Olimpiada topilmadi');
  END IF;

  IF now() > v_c.ends_at THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'ended',
      'message', 'Olimpiada tugagan — masalalarni mashq uchun yechish mumkin');
  END IF;

  INSERT INTO contest_participants (contest_id, user_id)
  VALUES (v_c.id, v_user)
  ON CONFLICT (contest_id, user_id) DO NOTHING;

  RETURN jsonb_build_object('ok', true);
END;
$fn$;

GRANT EXECUTE ON FUNCTION public.join_contest(TEXT) TO authenticated;

-- ============================================
-- 3. REYTING
-- ============================================
DROP FUNCTION IF EXISTS public.contest_standings(TEXT);

CREATE OR REPLACE FUNCTION public.contest_standings(p_slug TEXT)
RETURNS TABLE (
  rank BIGINT,
  user_id UUID,
  full_name TEXT,
  username TEXT,
  avatar_url TEXT,
  solved BIGINT,
  points BIGINT,
  penalty BIGINT,
  details JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $fn$
DECLARE
  v_contest RECORD;
  v_cutoff TIMESTAMPTZ;
  v_duration NUMERIC;
BEGIN
  SELECT * INTO v_contest FROM contests WHERE slug = p_slug AND is_published = true;
  IF v_contest.id IS NULL THEN
    RETURN;
  END IF;

  -- Musobaqa davomiyligi (daqiqa) — vaqt koeffitsiyenti shunga nisbatan
  v_duration := GREATEST(1, EXTRACT(EPOCH FROM (v_contest.ends_at - v_contest.starts_at)) / 60);

  -- Muzlatish: musobaqa hali tugamagan bo'lsa, oxirgi N daqiqadagi
  -- yuborishlar reytingda ko'rinmaydi
  v_cutoff := CASE
    WHEN now() < v_contest.ends_at AND v_contest.freeze_minutes > 0
      THEN LEAST(now(), v_contest.ends_at - make_interval(mins => v_contest.freeze_minutes))
    ELSE LEAST(now(), v_contest.ends_at)
  END;

  RETURN QUERY
  WITH problems AS (
    SELECT cp.challenge_id, cp.letter, cp.points AS base_points
      FROM contest_problems cp
     WHERE cp.contest_id = v_contest.id
  ),
  -- Musobaqa oynasidagi barcha yuborishlar (kim yuborganidan qat'i nazar)
  subs AS (
    SELECT s.user_id, s.task_id, s.status, s.created_at
      FROM submissions s
      JOIN problems pr ON pr.challenge_id = s.task_id
     WHERE s.task_type = 'challenge'
       AND s.created_at >= v_contest.starts_at
       AND s.created_at <= v_cutoff
  ),
  -- Ishtirokchilar: ro'yxatdan o'tganlar + musobaqa vaqtida yechim
  -- yuborganlar. Ikkinchisi bo'lmasa reyting bo'sh ko'rinardi.
  parts AS (
    SELECT cpar.user_id FROM contest_participants cpar WHERE cpar.contest_id = v_contest.id
    UNION
    SELECT DISTINCT s.user_id FROM subs s
  ),
  -- Har ishtirokchi–masala juftligi uchun birinchi qabul qilingan yechim
  first_ac AS (
    SELECT s.user_id, s.task_id, min(s.created_at) AS ac_at
      FROM subs s
     WHERE s.status = 'accepted'
     GROUP BY s.user_id, s.task_id
  ),
  -- Qabuldan OLDINGI noto'g'ri urinishlar
  wrongs AS (
    SELECT s.user_id, s.task_id, count(*) AS wrong_count
      FROM subs s
      JOIN first_ac f ON f.user_id = s.user_id AND f.task_id = s.task_id
     WHERE s.status <> 'accepted' AND s.created_at < f.ac_at
     GROUP BY s.user_id, s.task_id
  ),
  -- Yechilmagan, lekin urinilgan masalalar — reytingda qizil katak
  tried AS (
    SELECT s.user_id, s.task_id, count(*) AS try_count
      FROM subs s
     WHERE NOT EXISTS (
       SELECT 1 FROM first_ac f WHERE f.user_id = s.user_id AND f.task_id = s.task_id
     )
     GROUP BY s.user_id, s.task_id
  ),
  scored AS (
    SELECT
      f.user_id,
      pr.letter,
      COALESCE(w.wrong_count, 0)::BIGINT AS wrong_count,
      (EXTRACT(EPOCH FROM (f.ac_at - v_contest.starts_at))::BIGINT / 60)::BIGINT AS ac_minute,
      ((EXTRACT(EPOCH FROM (f.ac_at - v_contest.starts_at))::BIGINT / 60)
        + COALESCE(w.wrong_count, 0) * v_contest.penalty_minutes)::BIGINT AS problem_penalty,
      -- Ball: asos × vaqt × urinish
      GREATEST(1, ROUND(
        pr.base_points
        * GREATEST(0.5, 1 - 0.5 * (EXTRACT(EPOCH FROM (f.ac_at - v_contest.starts_at)) / 60) / v_duration)
        * GREATEST(0.6, 1 - 0.1 * COALESCE(w.wrong_count, 0))
      ))::BIGINT AS earned
    FROM first_ac f
    JOIN problems pr ON pr.challenge_id = f.task_id
    LEFT JOIN wrongs w ON w.user_id = f.user_id AND w.task_id = f.task_id
  ),
  -- Har foydalanuvchi uchun katak holatlari
  cells AS (
    SELECT sc.user_id, sc.letter,
           jsonb_build_object(
             'status', 'solved',
             'minute', sc.ac_minute,
             'wrong', sc.wrong_count,
             'points', sc.earned
           ) AS cell
      FROM scored sc
    UNION ALL
    SELECT t.user_id, pr.letter,
           jsonb_build_object(
             'status', 'tried',
             'wrong', t.try_count
           ) AS cell
      FROM tried t
      JOIN problems pr ON pr.challenge_id = t.task_id
  ),
  totals AS (
    SELECT
      p.user_id,
      -- sum() numeric qaytaradi, funksiya esa BIGINT kutadi — aniq cast
      -- qilinmasa "structure of query does not match" xatosi chiqadi
      COALESCE(count(sc.letter), 0)::BIGINT AS solved,
      COALESCE(sum(sc.earned), 0)::BIGINT AS points,
      COALESCE(sum(sc.problem_penalty), 0)::BIGINT AS penalty
    FROM parts p
    LEFT JOIN scored sc ON sc.user_id = p.user_id
    GROUP BY p.user_id
  ),
  cell_map AS (
    SELECT c.user_id, jsonb_object_agg(c.letter, c.cell) AS details
      FROM cells c
     GROUP BY c.user_id
  )
  SELECT
    ROW_NUMBER() OVER (
      ORDER BY t.solved DESC, t.points DESC, t.penalty ASC, pf.full_name ASC
    ) AS rank,
    t.user_id,
    pf.full_name,
    pf.username,
    pf.avatar_url,
    t.solved,
    t.points,
    t.penalty,
    COALESCE(cm.details, '{}'::jsonb) AS details
  FROM totals t
  JOIN profiles pf ON pf.id = t.user_id
  LEFT JOIN cell_map cm ON cm.user_id = t.user_id
  ORDER BY t.solved DESC, t.points DESC, t.penalty ASC, pf.full_name ASC;
END;
$fn$;

GRANT EXECUTE ON FUNCTION public.contest_standings(TEXT) TO anon, authenticated;

-- ============================================
-- 4. MUSOBAQA HOLATI
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
