-- ============================================================
-- MirAcademy — Reytingda boshqa talabaning kartasini ochish
--
-- MAQSAD
-- Reyting jadvalidagi qatorga bosilganda o'sha talabaning o'quv
-- natijalari ko'rinadi: darajasi, tugatgan kurslari, yechgan
-- topshiriqlari, sertifikatlari, yutuqlari va so'nggi 12 haftalik
-- faolligi.
--
-- NIMA KO'RINADI, NIMA KO'RINMAYDI
-- Reyting jadvali allaqachon ism, XP, streak va darajani hammaga
-- ko'rsatadi — bular o'zgarmaydi. Qo'shimcha ravishda o'quv
-- ko'rsatkichlari ochiladi.
--
-- Ko'rinmaydi: elektron pochta, telefon, coin balansi, guruhi,
-- yoshi. Coin — pulga yaqin tushuncha, boshqalarga ko'rsatilmaydi.
--
-- Tavsif (bio), havolalar va foydalanuvchi nomi faqat talaba o'z
-- portfoliosini ochiq qilgan bo'lsa qaytariladi. Portfolio yopiq
-- bo'lsa, karta ko'rinadi-yu, lekin shaxsiy havolalar berilmaydi.
--
-- Funksiya faqat tizimga kirgan foydalanuvchiga javob beradi —
-- tashqaridan ma'lumot yig'ib olishning oldini oladi.
--
-- Supabase SQL Editor da ishga tushiring. Qayta ishga tushirish xavfsiz.
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_student_card(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_p      RECORD;
  v_ochiq  BOOLEAN;
  v_result JSONB;
BEGIN
  -- Faqat ro'yxatdan o'tganlar uchun
  IF (select auth.uid()) IS NULL THEN
    RETURN NULL;
  END IF;

  SELECT * INTO v_p
    FROM profiles
   WHERE id = p_user_id
     AND role = 'student'
     AND is_blocked = false
   LIMIT 1;

  IF v_p.id IS NULL THEN
    RETURN NULL;
  END IF;

  v_ochiq := COALESCE(v_p.is_portfolio_public, false) AND v_p.username IS NOT NULL;

  SELECT jsonb_build_object(
    'profile', jsonb_build_object(
      'id',             v_p.id,
      'full_name',      v_p.full_name,
      'avatar_url',     v_p.avatar_url,
      'level',          v_p.level,
      'xp',             v_p.xp,
      'streak_days',    v_p.streak_days,
      'longest_streak', v_p.longest_streak,
      'created_at',     v_p.created_at,
      -- Portfolio ochiq bo'lgandagina
      'username',       CASE WHEN v_ochiq THEN v_p.username END,
      'headline',       CASE WHEN v_ochiq THEN v_p.headline END,
      'bio',            CASE WHEN v_ochiq THEN v_p.bio END,
      'skills',         CASE WHEN v_ochiq THEN COALESCE(v_p.skills, '{}') END,
      'has_portfolio',  v_ochiq
    ),

    'rank', (
      SELECT count(*) + 1
        FROM profiles o
       WHERE o.role = 'student'
         AND o.is_blocked = false
         AND o.xp > v_p.xp
    ),

    'stats', jsonb_build_object(
      'courses_completed', (
        SELECT count(*) FROM enrollments
         WHERE user_id = v_p.id AND is_completed = true
      ),
      'topics_completed', (
        SELECT count(*) FROM topic_progress
         WHERE user_id = v_p.id AND is_completed = true
      ),
      'challenges_solved', (
        SELECT count(DISTINCT task_id) FROM submissions
         WHERE user_id = v_p.id AND task_type = 'challenge' AND status = 'accepted'
      ),
      'tasks_solved', (
        SELECT count(DISTINCT task_id) FROM submissions
         WHERE user_id = v_p.id AND task_type = 'topic_task' AND status = 'accepted'
      ),
      'quizzes_passed', (
        SELECT count(*) FROM quiz_results
         WHERE user_id = v_p.id AND percentage >= 60
      ),
      'certificates', (
        SELECT count(*) FROM certificates WHERE user_id = v_p.id
      ),
      'achievements', (
        SELECT count(*) FROM user_achievements WHERE user_id = v_p.id
      ),
      'games_played', (
        SELECT count(*) FROM game_results WHERE user_id = v_p.id
      )
    ),

    -- Tugatilgan kurslar (eng so'nggi 6 tasi)
    'courses', COALESCE((
      SELECT jsonb_agg(x) FROM (
        SELECT jsonb_build_object(
                 'title',        c.title,
                 'slug',         c.slug,
                 'category',     c.category,
                 'completed_at', e.completed_at
               ) AS x
          FROM enrollments e
          JOIN courses c ON c.id = e.course_id
         WHERE e.user_id = v_p.id
           AND e.is_completed = true
           AND c.is_published = true
         ORDER BY e.completed_at DESC NULLS LAST
         LIMIT 6
      ) s
    ), '[]'::jsonb),

    -- Yutuqlar (eng so'nggi 8 tasi)
    'achievements', COALESCE((
      SELECT jsonb_agg(x) FROM (
        SELECT jsonb_build_object(
                 'title',     a.title,
                 'icon',      a.icon,
                 'color',     a.color,
                 'earned_at', ua.earned_at
               ) AS x
          FROM user_achievements ua
          JOIN achievements a ON a.id = ua.achievement_id
         WHERE ua.user_id = v_p.id
         ORDER BY ua.earned_at DESC
         LIMIT 8
      ) s
    ), '[]'::jsonb),

    /**
     * Faollik: oxirgi 12 hafta. Portfolio sahifasidagi bilan bir xil
     * usulda hisoblanadi, shunda ikki joyda bir xil raqam ko'rinadi.
     */
    'activity', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
               'week',  to_char(w.week_start, 'YYYY-MM-DD'),
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
    ), '[]'::jsonb)
  ) INTO v_result;

  RETURN v_result;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_student_card(UUID) TO authenticated;
REVOKE EXECUTE ON FUNCTION public.get_student_card(UUID) FROM anon;

-- Reyting bo'yicha o'rinni topish uchun
CREATE INDEX IF NOT EXISTS profiles_student_xp_idx
  ON profiles(xp DESC)
  WHERE role = 'student' AND is_blocked = false;
