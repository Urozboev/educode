-- ============================================
-- EduCode — Ommaviy portfolioga progress qo'shish
--
-- Talaba havolani bergan odam (ish beruvchi, o'qituvchi, ota-ona) EduCode'da
-- ro'yxatdan o'tmasdan quyidagilarni ko'radi:
--   · tugatilgan kurslar ro'yxati (nomi va tugash sanasi bilan)
--   · davom etayotgan kurslar va ulardagi foiz
--   · qo'lga kiritilgan yutuqlar
--   · faollik: oxirgi 12 hafta bo'yicha yechilgan topshiriqlar
--
-- Bularning hammasi `get_public_portfolio` ichida qaytariladi — sahifa bitta
-- so'rov yuboradi. Funksiya SECURITY DEFINER, chunki manba jadvallar RLS
-- bilan foydalanuvchining o'ziga cheklangan.
--
-- 21_portfolio.sql dan KEYIN ishga tushiring.
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
        SELECT count(*) FROM enrollments WHERE user_id = v_p.id AND is_completed = true
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
      ),
      'achievements', (
        SELECT count(*) FROM user_achievements WHERE user_id = v_p.id
      ),
      'topics_completed', (
        SELECT count(*) FROM topic_progress
         WHERE user_id = v_p.id AND is_completed = true
      )
    ),

    -- Tugatilgan kurslar
    'completed_courses', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'id', c.id,
        'title', c.title,
        'slug', c.slug,
        'category', c.category,
        'difficulty', c.difficulty,
        'completed_at', e.completed_at
      ) ORDER BY e.completed_at DESC NULLS LAST)
      FROM enrollments e
      JOIN courses c ON c.id = e.course_id
     WHERE e.user_id = v_p.id AND e.is_completed = true AND c.is_published = true
    ), '[]'::jsonb),

    -- Davom etayotgan kurslar (0% dagilar ko'rsatilmaydi — ular shunchaki ochilgan)
    'active_courses', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'id', c.id,
        'title', c.title,
        'slug', c.slug,
        'category', c.category,
        'progress_percent', e.progress_percent,
        'completed_topics', e.completed_topics,
        'total_topics', e.total_topics
      ) ORDER BY e.progress_percent DESC)
      FROM enrollments e
      JOIN courses c ON c.id = e.course_id
     WHERE e.user_id = v_p.id
       AND e.is_completed = false
       AND e.progress_percent > 0
       AND c.is_published = true
    ), '[]'::jsonb),

    -- Yutuqlar (yashirin bo'lganlari ham ko'rsatiladi — qo'lga kiritilgan)
    'achievements', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'id', a.id,
        'title', a.title,
        'description', a.description,
        'icon', a.icon,
        'color', a.color,
        'earned_at', ua.earned_at
      ) ORDER BY ua.earned_at DESC)
      FROM user_achievements ua
      JOIN achievements a ON a.id = ua.achievement_id
     WHERE ua.user_id = v_p.id
    ), '[]'::jsonb),

    /**
     * Faollik: oxirgi 12 hafta, har hafta uchun qabul qilingan yechimlar soni.
     * Hafta boshi (dushanba) sanasi bilan qaytariladi.
     */
    'activity', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'week', to_char(w.week_start, 'YYYY-MM-DD'),
        'count', COALESCE(s.cnt, 0)
      ) ORDER BY w.week_start)
      FROM (
        SELECT date_trunc('week', now())::date - (n * 7) AS week_start
          FROM generate_series(11, 0, -1) AS n
      ) w
      LEFT JOIN (
        SELECT date_trunc('week', created_at)::date AS wk, count(*) AS cnt
          FROM submissions
         WHERE user_id = v_p.id AND status = 'accepted'
           AND created_at >= date_trunc('week', now()) - INTERVAL '11 weeks'
         GROUP BY 1
      ) s ON s.wk = w.week_start
    ), '[]'::jsonb),

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
