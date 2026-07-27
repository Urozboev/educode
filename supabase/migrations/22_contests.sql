-- ============================================
-- EduCode — Olimpiada (musobaqa)
--
-- Yondashuv: yechish oqimi o'zgarmaydi. Ishtirokchi mavjud
-- /challenges/<slug> sahifasida yechadi, natija allaqachon `submissions`
-- jadvaliga yoziladi. Musobaqa — shu yozuvlar ustidagi qatlam:
-- vaqt oralig'i + masalalar to'plami + ishtirokchilar ro'yxati.
-- Shu sababli alohida "contest_submissions" jadvali kerak emas va
-- ma'lumot ikki joyda saqlanib, bir-biriga zid bo'lib qolmaydi.
--
-- Reyting ICPC uslubida:
--   birlamchi — yechilgan masalalar soni (ko'p bo'lgani yuqori)
--   ikkilamchi — jarima vaqti (kam bo'lgani yuqori)
--   jarima = qabul qilingan yechimgacha o'tgan daqiqa
--            + har bir noto'g'ri urinish uchun 20 daqiqa
--
-- Supabase SQL Editor da ishga tushiring.
-- ============================================

CREATE TABLE IF NOT EXISTS contests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  rules_html TEXT,

  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,

  -- Noto'g'ri urinish uchun jarima (daqiqa)
  penalty_minutes INT NOT NULL DEFAULT 20,
  -- Reyting musobaqa tugagunicha yashiriladimi (oxirgi soatda "muzlatish")
  freeze_minutes INT NOT NULL DEFAULT 0,

  is_published BOOLEAN DEFAULT false,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  CONSTRAINT contests_time_order CHECK (ends_at > starts_at)
);

CREATE INDEX IF NOT EXISTS contests_published_idx ON contests(is_published, starts_at DESC);

ALTER TABLE contests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "contests_read" ON contests;
CREATE POLICY "contests_read" ON contests FOR SELECT USING (
  is_published = true
  OR author_id = auth.uid()
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS "contests_write" ON contests;
CREATE POLICY "contests_write" ON contests FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','teacher'))
);

DROP TRIGGER IF EXISTS contests_updated_at ON contests;
CREATE TRIGGER contests_updated_at BEFORE UPDATE ON contests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- MASALALAR
-- ============================================
CREATE TABLE IF NOT EXISTS contest_problems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contest_id UUID NOT NULL REFERENCES contests(id) ON DELETE CASCADE,
  challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  -- Musobaqada masalalar harf bilan belgilanadi: A, B, C...
  letter TEXT NOT NULL,
  order_index INT NOT NULL DEFAULT 0,
  UNIQUE(contest_id, challenge_id),
  UNIQUE(contest_id, letter)
);

CREATE INDEX IF NOT EXISTS contest_problems_contest_idx ON contest_problems(contest_id, order_index);

ALTER TABLE contest_problems ENABLE ROW LEVEL SECURITY;

-- Masalalar ro'yxati musobaqa boshlangandagina ochiladi — aks holda
-- ishtirokchilar oldindan tayyorlanib olishadi
DROP POLICY IF EXISTS "contest_problems_read" ON contest_problems;
CREATE POLICY "contest_problems_read" ON contest_problems FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM contests c
     WHERE c.id = contest_id
       AND c.is_published = true
       AND c.starts_at <= now()
  )
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  OR EXISTS (SELECT 1 FROM contests c WHERE c.id = contest_id AND c.author_id = auth.uid())
);

DROP POLICY IF EXISTS "contest_problems_write" ON contest_problems;
CREATE POLICY "contest_problems_write" ON contest_problems FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','teacher'))
);

-- ============================================
-- ISHTIROKCHILAR
-- ============================================
CREATE TABLE IF NOT EXISTS contest_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contest_id UUID NOT NULL REFERENCES contests(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  registered_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(contest_id, user_id)
);

CREATE INDEX IF NOT EXISTS contest_participants_contest_idx ON contest_participants(contest_id);

ALTER TABLE contest_participants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "contest_participants_read" ON contest_participants;
CREATE POLICY "contest_participants_read" ON contest_participants FOR SELECT USING (true);

DROP POLICY IF EXISTS "contest_participants_join" ON contest_participants;
CREATE POLICY "contest_participants_join" ON contest_participants FOR INSERT WITH CHECK (
  user_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM contests c
     WHERE c.id = contest_id AND c.is_published = true AND c.ends_at > now()
  )
);

DROP POLICY IF EXISTS "contest_participants_leave" ON contest_participants;
CREATE POLICY "contest_participants_leave" ON contest_participants FOR DELETE USING (
  user_id = auth.uid()
);

-- ============================================
-- REYTING
--
-- `submissions` RLS bilan foydalanuvchining o'ziga cheklangan, shuning uchun
-- reyting SECURITY DEFINER funksiya orqali hisoblanadi.
-- ============================================
CREATE OR REPLACE FUNCTION public.contest_standings(p_slug TEXT)
RETURNS TABLE (
  rank BIGINT,
  user_id UUID,
  full_name TEXT,
  username TEXT,
  avatar_url TEXT,
  solved BIGINT,
  penalty BIGINT,
  details JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_contest RECORD;
  v_cutoff TIMESTAMPTZ;
BEGIN
  SELECT * INTO v_contest FROM contests WHERE slug = p_slug AND is_published = true;
  IF v_contest.id IS NULL THEN
    RETURN;
  END IF;

  -- Muzlatish: musobaqa hali tugamagan bo'lsa, oxirgi N daqiqadagi
  -- yuborishlar reytingda ko'rinmaydi
  v_cutoff := CASE
    WHEN now() < v_contest.ends_at AND v_contest.freeze_minutes > 0
      THEN LEAST(now(), v_contest.ends_at - make_interval(mins => v_contest.freeze_minutes))
    ELSE LEAST(now(), v_contest.ends_at)
  END;

  RETURN QUERY
  WITH problems AS (
    SELECT cp.challenge_id, cp.letter
      FROM contest_problems cp
     WHERE cp.contest_id = v_contest.id
  ),
  parts AS (
    SELECT cpar.user_id
      FROM contest_participants cpar
     WHERE cpar.contest_id = v_contest.id
  ),
  subs AS (
    SELECT s.user_id, s.task_id, s.status, s.created_at
      FROM submissions s
      JOIN parts p ON p.user_id = s.user_id
      JOIN problems pr ON pr.challenge_id = s.task_id
     WHERE s.task_type = 'challenge'
       AND s.created_at >= v_contest.starts_at
       AND s.created_at <= v_cutoff
  ),
  -- Har ishtirokchi–masala juftligi uchun birinchi qabul qilingan yechim
  first_ac AS (
    SELECT user_id, task_id, min(created_at) AS ac_at
      FROM subs
     WHERE status = 'accepted'
     GROUP BY user_id, task_id
  ),
  -- Qabuldan OLDINGI noto'g'ri urinishlar (keyingilari jarimaga kirmaydi)
  wrongs AS (
    SELECT s.user_id, s.task_id, count(*) AS wrong_count
      FROM subs s
      JOIN first_ac f ON f.user_id = s.user_id AND f.task_id = s.task_id
     WHERE s.status <> 'accepted' AND s.created_at < f.ac_at
     GROUP BY s.user_id, s.task_id
  ),
  scored AS (
    SELECT
      f.user_id,
      f.task_id,
      pr.letter,
      EXTRACT(EPOCH FROM (f.ac_at - v_contest.starts_at))::BIGINT / 60
        + COALESCE(w.wrong_count, 0) * v_contest.penalty_minutes AS problem_penalty,
      COALESCE(w.wrong_count, 0) AS wrong_count,
      EXTRACT(EPOCH FROM (f.ac_at - v_contest.starts_at))::BIGINT / 60 AS ac_minute
    FROM first_ac f
    JOIN problems pr ON pr.challenge_id = f.task_id
    LEFT JOIN wrongs w ON w.user_id = f.user_id AND w.task_id = f.task_id
  ),
  totals AS (
    SELECT
      p.user_id,
      COALESCE(count(sc.task_id), 0) AS solved,
      COALESCE(sum(sc.problem_penalty), 0) AS penalty,
      COALESCE(
        jsonb_object_agg(sc.letter, jsonb_build_object(
          'minute', sc.ac_minute,
          'wrong', sc.wrong_count
        )) FILTER (WHERE sc.letter IS NOT NULL),
        '{}'::jsonb
      ) AS details
    FROM parts p
    LEFT JOIN scored sc ON sc.user_id = p.user_id
    GROUP BY p.user_id
  )
  SELECT
    ROW_NUMBER() OVER (ORDER BY t.solved DESC, t.penalty ASC, pf.full_name ASC) AS rank,
    t.user_id,
    pf.full_name,
    pf.username,
    pf.avatar_url,
    t.solved,
    t.penalty,
    t.details
  FROM totals t
  JOIN profiles pf ON pf.id = t.user_id
  ORDER BY t.solved DESC, t.penalty ASC, pf.full_name ASC;
END;
$$;

-- ============================================
-- MUSOBAQA HOLATI (bitta so'rovda sahifaga kerakli hamma narsa)
-- ============================================
CREATE OR REPLACE FUNCTION public.contest_overview(p_slug TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_c RECORD;
  v_started BOOLEAN;
BEGIN
  SELECT * INTO v_c FROM contests WHERE slug = p_slug AND is_published = true;
  IF v_c.id IS NULL THEN
    RETURN NULL;
  END IF;

  v_started := now() >= v_c.starts_at;

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
    'participants', (
      SELECT count(*) FROM contest_participants WHERE contest_id = v_c.id
    ),
    'is_registered', (
      SELECT EXISTS (
        SELECT 1 FROM contest_participants
         WHERE contest_id = v_c.id AND user_id = auth.uid()
      )
    ),
    -- Masalalar faqat boshlangandan keyin
    'problems', CASE WHEN v_started THEN COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'letter', cp.letter,
        'slug', ch.slug,
        'title', ch.title,
        'difficulty', ch.difficulty,
        'solved_by', (
          SELECT count(DISTINCT s.user_id)
            FROM submissions s
            JOIN contest_participants pp
              ON pp.user_id = s.user_id AND pp.contest_id = v_c.id
           WHERE s.task_type = 'challenge'
             AND s.task_id = cp.challenge_id
             AND s.status = 'accepted'
             AND s.created_at BETWEEN v_c.starts_at AND v_c.ends_at
        )
      ) ORDER BY cp.order_index, cp.letter)
      FROM contest_problems cp
      JOIN challenges ch ON ch.id = cp.challenge_id
      WHERE cp.contest_id = v_c.id
    ), '[]'::jsonb) ELSE '[]'::jsonb END,
    'problem_count', (SELECT count(*) FROM contest_problems WHERE contest_id = v_c.id)
  );
END;
$$;
