-- ============================================
-- EduCode — Talaba portfoliosi
--
-- Portfolio ikki qismdan iborat:
--   1) Avtomatik yig'iladigan qism — tugatilgan kurslar, sertifikatlar,
--      yechilgan topshiriqlar, XP. Bularni talaba o'zgartira olmaydi.
--   2) O'zi qo'shadigan qism — havolalar, ko'nikmalar va loyihalar.
--
-- Ommaviy sahifa /u/<username> manzilida ochiladi, lekin FAQAT talaba
-- o'zi yoqqan bo'lsa (`is_portfolio_public`). Sukut bo'yicha o'chiq.
--
-- Supabase SQL Editor da ishga tushiring.
-- ============================================

-- ============================================
-- 1) PROFIL: portfolio maydonlari
-- ============================================
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS headline TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS skills TEXT[] DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS github_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS telegram_username TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS linkedin_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS website_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_portfolio_public BOOLEAN DEFAULT false;

CREATE INDEX IF NOT EXISTS profiles_username_idx ON profiles(username) WHERE username IS NOT NULL;

-- ============================================
-- 2) LOYIHALAR
-- ============================================
CREATE TABLE IF NOT EXISTS portfolio_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  cover_url TEXT,
  demo_url TEXT,
  repo_url TEXT,
  tech TEXT[] DEFAULT '{}',
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS portfolio_projects_user_idx ON portfolio_projects(user_id, order_index);

ALTER TABLE portfolio_projects ENABLE ROW LEVEL SECURITY;

-- Egasi hamma vaqt ko'radi; boshqalar faqat portfolio ochiq bo'lsa
DROP POLICY IF EXISTS "portfolio_projects_read" ON portfolio_projects;
CREATE POLICY "portfolio_projects_read" ON portfolio_projects FOR SELECT USING (
  user_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM profiles p
     WHERE p.id = portfolio_projects.user_id AND p.is_portfolio_public = true
  )
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS "portfolio_projects_write_own" ON portfolio_projects;
CREATE POLICY "portfolio_projects_write_own" ON portfolio_projects FOR ALL USING (
  user_id = auth.uid()
) WITH CHECK (
  user_id = auth.uid()
);

DROP TRIGGER IF EXISTS portfolio_projects_updated_at ON portfolio_projects;
CREATE TRIGGER portfolio_projects_updated_at BEFORE UPDATE ON portfolio_projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- 3) OMMAVIY PORTFOLIO
--
-- Statistika enrollments / certificates / submissions jadvallaridan olinadi.
-- Ular RLS bilan foydalanuvchining o'ziga cheklangan, shuning uchun ommaviy
-- sahifa uchun bitta SECURITY DEFINER funksiya ishlatiladi — RLS'ni
-- bo'shatish o'rniga aynan kerakli maydonlarni qaytaramiz.
-- ============================================
CREATE OR REPLACE FUNCTION public.get_public_portfolio(p_username TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_p RECORD;
  v_result JSONB;
BEGIN
  SELECT * INTO v_p
    FROM profiles
   WHERE username = p_username
     AND is_blocked = false
   LIMIT 1;

  IF v_p.id IS NULL THEN
    RETURN NULL;
  END IF;

  -- Egasi o'zining yopiq portfoliosini ham ko'ra oladi (ko'rib chiqish uchun)
  IF v_p.is_portfolio_public = false AND v_p.id <> auth.uid() THEN
    RETURN NULL;
  END IF;

  SELECT jsonb_build_object(
    'profile', jsonb_build_object(
      'id', v_p.id,
      'full_name', v_p.full_name,
      'username', v_p.username,
      'avatar_url', v_p.avatar_url,
      'bio', v_p.bio,
      'headline', v_p.headline,
      'skills', COALESCE(v_p.skills, '{}'),
      'level', v_p.level,
      'xp', v_p.xp,
      'longest_streak', v_p.longest_streak,
      'created_at', v_p.created_at,
      'github_url', v_p.github_url,
      'telegram_username', v_p.telegram_username,
      'linkedin_url', v_p.linkedin_url,
      'website_url', v_p.website_url,
      'is_public', v_p.is_portfolio_public
    ),
    'stats', jsonb_build_object(
      'courses_completed', (
        SELECT count(*) FROM enrollments
         WHERE user_id = v_p.id AND is_completed = true
      ),
      'certificates', (
        SELECT count(*) FROM certificates WHERE user_id = v_p.id
      ),
      'challenges_solved', (
        SELECT count(DISTINCT task_id) FROM submissions
         WHERE user_id = v_p.id AND task_type = 'challenge' AND status = 'accepted'
      ),
      'games_played', (
        SELECT count(*) FROM game_results WHERE user_id = v_p.id
      )
    ),
    'certificates', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'id', c.id,
        'course_title', c.course_title,
        'certificate_number', c.certificate_number,
        'completion_date', c.completion_date,
        'score_percentage', c.score_percentage
      ) ORDER BY c.completion_date DESC)
      FROM certificates c WHERE c.user_id = v_p.id
    ), '[]'::jsonb),
    'projects', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'id', pr.id,
        'title', pr.title,
        'description', pr.description,
        'cover_url', pr.cover_url,
        'demo_url', pr.demo_url,
        'repo_url', pr.repo_url,
        'tech', COALESCE(pr.tech, '{}')
      ) ORDER BY pr.order_index, pr.created_at DESC)
      FROM portfolio_projects pr WHERE pr.user_id = v_p.id
    ), '[]'::jsonb)
  ) INTO v_result;

  RETURN v_result;
END;
$$;

-- Ommaviy portfoliolar ro'yxati (kashfiyot uchun)
CREATE OR REPLACE FUNCTION public.list_public_portfolios(p_limit INT DEFAULT 24)
RETURNS TABLE (
  username TEXT,
  full_name TEXT,
  avatar_url TEXT,
  headline TEXT,
  level TEXT,
  xp INT,
  courses_completed BIGINT
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    p.username, p.full_name, p.avatar_url, p.headline, p.level, p.xp,
    (SELECT count(*) FROM enrollments e WHERE e.user_id = p.id AND e.is_completed = true)
  FROM profiles p
  WHERE p.is_portfolio_public = true
    AND p.is_blocked = false
    AND p.username IS NOT NULL
  ORDER BY p.xp DESC
  LIMIT LEAST(GREATEST(p_limit, 1), 100);
$$;
