-- ============================================================
-- MirAcademy — Talabalar statistikasi (admin / o'qituvchi)
--
-- MUAMMOLAR
-- 1. Kursdagi "N talaba" (`courses.total_enrolled`) o'zgarmay turibdi.
--    Uni talabaning brauzeri yozilganda +1 qilmoqchi bo'lardi, lekin
--    `courses` jadvalini faqat admin o'zgartira oladi (RLS) — so'rov
--    jimgina rad etilardi.
-- 2. Bepul kursni "Yozilish" tugmasini bosmasdan ham o'qish mumkin.
--    Bunday talaba `enrollments` da yo'q — admin uni kurs ro'yxatida
--    ko'rmaydi, garchi mavzularni bajarayotgan bo'lsa ham.
-- 3. Admin talaba bo'yicha to'liq ma'lumotni (kurs progressi, joriy
--    mavzu, test va topshiriq natijalari, bugungi/haftalik faollik,
--    baho) bir joyda ko'ra olmaydi. Coin tarixini esa umuman ko'rmaydi.
--
-- YECHIM
-- 1. `enrollments` ga trigger — kursdagi talabalar soni bazaning
--    o'zida qayta sanaladi; mavjud kurslar uchun bir marta tiklanadi.
-- 2. `topic_progress` ga trigger — talaba mavzuni ochishi bilan
--    yozilish (enrollment) avtomatik yaratiladi; ilgari shunday
--    o'qiganlar uchun yozilishlar bir marta tiklanadi.
-- 3. Statistika funksiyalari (faqat admin va o'qituvchi):
--      student_course_stats(user, course)  — talaba × kurs kesimi,
--      admin_students_overview(course)     — talabalar ro'yxati,
--      admin_courses_overview()            — kurslar kesimi.
-- 4. Admin barcha coin tranzaksiyalarini o'qiy oladi.
--
-- BAHO
-- Joriy reyting bali (0–100):
--   mavzular progressi 40% + testlar o'rtachasi 30% + topshiriqlar 30%.
-- Kursda topshiriq bo'lmasa: progress 55% + testlar 45%.
-- Test bali — har mavzudagi ENG YAXSHI urinish (qayta topshirish
-- jazolanmaydi), o'rtacha faqat topshirilgan testlar bo'yicha.
-- 5 ballik baho OTM shkalasida: 86+ → 5, 71–85 → 4, 56–70 → 3, aks holda 2.
--
-- "Bugun" va "hafta" — Toshkent vaqti bo'yicha.
--
-- Supabase SQL Editor da ishga tushiring. Qayta ishga tushirish xavfsiz.
-- ============================================================

-- ------------------------------------------------------------
-- 1. KURSDAGI TALABALAR SONI
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.sync_course_enrolled_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_kurs UUID := coalesce(NEW.course_id, OLD.course_id);
BEGIN
  UPDATE courses c
     SET total_enrolled = (SELECT count(*) FROM enrollments e WHERE e.course_id = c.id)
   WHERE c.id = v_kurs;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS enrollments_sync_course_count ON enrollments;
CREATE TRIGGER enrollments_sync_course_count
  AFTER INSERT OR DELETE ON enrollments
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_course_enrolled_count();

-- ------------------------------------------------------------
-- 2. MAVZUNI OCHGAN TALABA — KURSGA YOZILGAN HISOBLANADI
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.ensure_enrollment_from_progress()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO enrollments (user_id, course_id, total_topics, enrolled_at, last_accessed_at)
  SELECT NEW.user_id, NEW.course_id, c.total_topics, now(), now()
    FROM courses c
   WHERE c.id = NEW.course_id
  ON CONFLICT (user_id, course_id) DO UPDATE SET last_accessed_at = now();
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS topic_progress_ensure_enrollment ON topic_progress;
CREATE TRIGGER topic_progress_ensure_enrollment
  AFTER INSERT ON topic_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.ensure_enrollment_from_progress();

-- Ilgari yozilmasdan o'qiganlar uchun yozilishlarni tiklash
INSERT INTO enrollments (user_id, course_id, total_topics, completed_topics, progress_percent, enrolled_at, last_accessed_at)
SELECT p.user_id,
       p.course_id,
       c.total_topics,
       count(*) FILTER (WHERE p.is_completed AND t.is_published)::int,
       CASE WHEN c.total_topics > 0
            THEN round(count(*) FILTER (WHERE p.is_completed AND t.is_published) * 100.0 / c.total_topics)::int
            ELSE 0 END,
       min(p.started_at),
       max(greatest(p.started_at, coalesce(p.completed_at, p.started_at)))
  FROM topic_progress p
  JOIN courses c ON c.id = p.course_id
  JOIN topics t  ON t.id = p.topic_id
 GROUP BY p.user_id, p.course_id, c.total_topics
ON CONFLICT (user_id, course_id) DO NOTHING;

-- Barcha kurslar sonini tiklash
UPDATE courses c
   SET total_enrolled = s.soni
  FROM (
    SELECT k.id, count(e.id)::int AS soni
      FROM courses k
      LEFT JOIN enrollments e ON e.course_id = k.id
     GROUP BY k.id
  ) s
 WHERE c.id = s.id
   AND c.total_enrolled IS DISTINCT FROM s.soni;

-- ------------------------------------------------------------
-- 3. ADMIN COIN TARIXINI KO'RADI
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "coins_select_admin" ON coin_transactions;
CREATE POLICY "coins_select_admin" ON coin_transactions
  FOR SELECT USING ((select public.is_admin()));

-- ------------------------------------------------------------
-- 4. TALABA × KURS STATISTIKASI
-- p_user / p_course NULL bo'lsa — hammasi bo'yicha.
-- ------------------------------------------------------------
DROP FUNCTION IF EXISTS public.student_course_stats(UUID, UUID);
CREATE OR REPLACE FUNCTION public.student_course_stats(
  p_user UUID DEFAULT NULL,
  p_course UUID DEFAULT NULL
)
RETURNS TABLE (
  user_id UUID,
  course_id UUID,
  course_title TEXT,
  course_slug TEXT,
  enrolled_at TIMESTAMPTZ,
  is_completed BOOLEAN,
  total_topics INT,
  topics_done INT,
  progress INT,
  current_order INT,
  current_title TEXT,
  current_slug TEXT,
  quiz_avg INT,
  quizzes_taken INT,
  tasks_total INT,
  tasks_solved INT,
  last_activity_at TIMESTAMPTZ,
  score INT,
  grade INT
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_staff() THEN
    RAISE EXCEPTION 'Faqat admin yoki o''qituvchi';
  END IF;

  RETURN QUERY
  WITH en AS (
    SELECT e.user_id, e.course_id, e.enrolled_at, e.is_completed
      FROM enrollments e
     WHERE (p_user IS NULL OR e.user_id = p_user)
       AND (p_course IS NULL OR e.course_id = p_course)
  ),
  pub AS (
    SELECT t.id, t.course_id, t.order_index, t.title, t.slug
      FROM topics t
     WHERE t.is_published = true
       AND t.course_id IN (SELECT DISTINCT en.course_id FROM en)
  ),
  -- Mavzu tartib raqami 1 dan (order_index bo'shliqlari bo'lishi mumkin)
  num AS (
    SELECT pub.*, row_number() OVER (PARTITION BY pub.course_id ORDER BY pub.order_index, pub.title)::int AS n
      FROM pub
  ),
  prog AS (
    SELECT tp.user_id, tp.topic_id, tp.is_completed,
           greatest(tp.started_at, coalesce(tp.completed_at, tp.started_at)) AS ts
      FROM topic_progress tp
     WHERE tp.user_id IN (SELECT en.user_id FROM en)
       AND tp.topic_id IN (SELECT pub.id FROM pub)
  ),
  quiz AS (
    SELECT q.user_id, q.topic_id, max(q.percentage) AS best, max(q.completed_at) AS ts
      FROM quiz_results q
     WHERE q.user_id IN (SELECT en.user_id FROM en)
       AND q.topic_id IN (SELECT pub.id FROM pub)
     GROUP BY q.user_id, q.topic_id
  ),
  tasks AS (
    SELECT tt.id, pub.course_id
      FROM topic_tasks tt
      JOIN pub ON pub.id = tt.topic_id
  ),
  subs AS (
    SELECT s.user_id, s.task_id,
           bool_or(s.status = 'accepted') AS ok,
           max(s.created_at) AS ts
      FROM submissions s
     WHERE s.task_type = 'topic_task'
       AND s.user_id IN (SELECT en.user_id FROM en)
       AND s.task_id IN (SELECT tasks.id FROM tasks)
     GROUP BY s.user_id, s.task_id
  ),
  agg AS (
    SELECT en.user_id, en.course_id, en.enrolled_at, en.is_completed,
           (SELECT count(*) FROM pub WHERE pub.course_id = en.course_id)::int AS total,
           (SELECT count(*) FROM prog JOIN pub ON pub.id = prog.topic_id
             WHERE prog.user_id = en.user_id AND pub.course_id = en.course_id AND prog.is_completed)::int AS done,
           (SELECT round(avg(quiz.best))::int FROM quiz JOIN pub ON pub.id = quiz.topic_id
             WHERE quiz.user_id = en.user_id AND pub.course_id = en.course_id) AS qavg,
           (SELECT count(*) FROM quiz JOIN pub ON pub.id = quiz.topic_id
             WHERE quiz.user_id = en.user_id AND pub.course_id = en.course_id)::int AS qn,
           (SELECT count(*) FROM tasks WHERE tasks.course_id = en.course_id)::int AS ttotal,
           (SELECT count(*) FROM subs JOIN tasks ON tasks.id = subs.task_id
             WHERE subs.user_id = en.user_id AND tasks.course_id = en.course_id AND subs.ok)::int AS tsolved,
           (SELECT max(x.ts) FROM (
              SELECT prog.ts FROM prog JOIN pub ON pub.id = prog.topic_id
               WHERE prog.user_id = en.user_id AND pub.course_id = en.course_id
              UNION ALL
              SELECT quiz.ts FROM quiz JOIN pub ON pub.id = quiz.topic_id
               WHERE quiz.user_id = en.user_id AND pub.course_id = en.course_id
              UNION ALL
              SELECT subs.ts FROM subs JOIN tasks ON tasks.id = subs.task_id
               WHERE subs.user_id = en.user_id AND tasks.course_id = en.course_id
           ) x) AS last_ts
      FROM en
  ),
  cur AS (
    -- Joriy mavzu: tartib bo'yicha birinchi tugatilmagan mavzu
    SELECT DISTINCT ON (agg.user_id, agg.course_id)
           agg.user_id, agg.course_id, num.n, num.title, num.slug
      FROM agg
      JOIN num ON num.course_id = agg.course_id
     WHERE NOT EXISTS (
       SELECT 1 FROM prog
        WHERE prog.user_id = agg.user_id AND prog.topic_id = num.id AND prog.is_completed
     )
     ORDER BY agg.user_id, agg.course_id, num.n
  ),
  sc AS (
    SELECT agg.*,
           CASE WHEN agg.total > 0 THEN round(agg.done * 100.0 / agg.total)::int ELSE 0 END AS pr
      FROM agg
  ),
  sc2 AS (
    SELECT sc.*,
           CASE WHEN sc.ttotal > 0
                THEN round(0.4 * sc.pr + 0.3 * coalesce(sc.qavg, 0) + 0.3 * (sc.tsolved * 100.0 / sc.ttotal))::int
                ELSE round(0.55 * sc.pr + 0.45 * coalesce(sc.qavg, 0))::int
           END AS sco
      FROM sc
  )
  SELECT sc2.user_id, sc2.course_id, c.title, c.slug, sc2.enrolled_at, coalesce(sc2.is_completed, false),
         sc2.total, sc2.done, sc2.pr,
         cur.n, cur.title, cur.slug,
         sc2.qavg, sc2.qn, sc2.ttotal, sc2.tsolved,
         sc2.last_ts,
         sc2.sco,
         CASE WHEN sc2.sco >= 86 THEN 5 WHEN sc2.sco >= 71 THEN 4 WHEN sc2.sco >= 56 THEN 3 ELSE 2 END
    FROM sc2
    JOIN courses c ON c.id = sc2.course_id
    LEFT JOIN cur ON cur.user_id = sc2.user_id AND cur.course_id = sc2.course_id
   ORDER BY sc2.last_ts DESC NULLS LAST;
END;
$$;

GRANT EXECUTE ON FUNCTION public.student_course_stats(UUID, UUID) TO authenticated;

-- ------------------------------------------------------------
-- 5. TALABALAR RO'YXATI
-- p_course berilsa — faqat shu kursdagilar va kurs ko'rsatkichlari.
-- ------------------------------------------------------------
DROP FUNCTION IF EXISTS public.admin_students_overview(UUID);
CREATE OR REPLACE FUNCTION public.admin_students_overview(p_course UUID DEFAULT NULL)
RETURNS TABLE (
  id UUID,
  full_name TEXT,
  username TEXT,
  avatar_url TEXT,
  xp INT,
  coins INT,
  streak_days INT,
  is_blocked BOOLEAN,
  created_at TIMESTAMPTZ,
  courses_count INT,
  avg_progress INT,
  avg_score INT,
  grade INT,
  quiz_avg INT,
  tasks_solved INT,
  current_order INT,
  current_title TEXT,
  total_topics INT,
  topics_today INT,
  topics_week INT,
  actions_today INT,
  actions_week INT,
  last_activity_at TIMESTAMPTZ
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_bugun TIMESTAMPTZ := date_trunc('day', now() AT TIME ZONE 'Asia/Tashkent') AT TIME ZONE 'Asia/Tashkent';
  v_hafta TIMESTAMPTZ := v_bugun - interval '6 days';
BEGIN
  IF NOT public.is_staff() THEN
    RAISE EXCEPTION 'Faqat admin yoki o''qituvchi';
  END IF;

  RETURN QUERY
  WITH st AS (SELECT * FROM public.student_course_stats(NULL, p_course)),
  pr AS (
    SELECT pf.* FROM profiles pf
     WHERE pf.role = 'student'
       AND (p_course IS NULL OR pf.id IN (SELECT st.user_id FROM st))
  ),
  topics_in AS (
    SELECT t.id FROM topics t WHERE p_course IS NULL OR t.course_id = p_course
  ),
  tasks_in AS (
    SELECT tt.id FROM topic_tasks tt WHERE tt.topic_id IN (SELECT topics_in.id FROM topics_in)
  ),
  ev AS (
    -- Faollik hodisalari: mavzu tugatish, test, topshiriq yuborish
    SELECT tp.user_id, tp.completed_at AS ts, 1 AS is_topic
      FROM topic_progress tp
     WHERE tp.is_completed AND tp.completed_at >= v_hafta
       AND tp.topic_id IN (SELECT topics_in.id FROM topics_in)
    UNION ALL
    SELECT q.user_id, q.completed_at, 0 FROM quiz_results q
     WHERE q.completed_at >= v_hafta AND q.topic_id IN (SELECT topics_in.id FROM topics_in)
    UNION ALL
    SELECT s.user_id, s.created_at, 0 FROM submissions s
     WHERE s.created_at >= v_hafta
       AND (p_course IS NULL OR (s.task_type = 'topic_task' AND s.task_id IN (SELECT tasks_in.id FROM tasks_in)))
  ),
  evs AS (
    SELECT ev.user_id,
           count(*) FILTER (WHERE ev.is_topic = 1 AND ev.ts >= v_bugun)::int AS tt,
           count(*) FILTER (WHERE ev.is_topic = 1)::int AS tw,
           count(*) FILTER (WHERE ev.ts >= v_bugun)::int AS dt,
           count(*)::int AS dw
      FROM ev GROUP BY ev.user_id
  ),
  sta AS (
    SELECT st.user_id,
           count(*)::int AS cn,
           round(avg(st.progress))::int AS ap,
           round(avg(st.score))::int AS asc_,
           round(avg(st.quiz_avg))::int AS qa,
           sum(st.tasks_solved)::int AS ts,
           max(st.last_activity_at) AS la,
           -- Bitta kurs tanlanganda joriy mavzu ham ko'rsatiladi
           max(st.current_order) AS co,
           max(st.current_title) AS ct,
           max(st.total_topics) AS tot
      FROM st GROUP BY st.user_id
  ),
  last_any AS (
    -- Kurs tanlanmaganda umumiy oxirgi faollik (masalalar, olimpiada ham)
    SELECT s.user_id, max(s.created_at) AS ts FROM submissions s
     WHERE p_course IS NULL GROUP BY s.user_id
  )
  SELECT pr.id, pr.full_name, pr.username, pr.avatar_url, pr.xp, pr.coins, pr.streak_days,
         coalesce(pr.is_blocked, false), pr.created_at,
         coalesce(sta.cn, 0), coalesce(sta.ap, 0), sta.asc_,
         CASE WHEN sta.asc_ IS NULL THEN NULL
              WHEN sta.asc_ >= 86 THEN 5 WHEN sta.asc_ >= 71 THEN 4 WHEN sta.asc_ >= 56 THEN 3 ELSE 2 END,
         sta.qa, coalesce(sta.ts, 0),
         CASE WHEN p_course IS NOT NULL THEN sta.co END,
         CASE WHEN p_course IS NOT NULL THEN sta.ct END,
         CASE WHEN p_course IS NOT NULL THEN sta.tot END,
         coalesce(evs.tt, 0), coalesce(evs.tw, 0), coalesce(evs.dt, 0), coalesce(evs.dw, 0),
         nullif(greatest(coalesce(sta.la, '-infinity'), coalesce(last_any.ts, '-infinity'),
                         coalesce(pr.last_active_date::timestamptz, '-infinity')), '-infinity')
    FROM pr
    LEFT JOIN sta ON sta.user_id = pr.id
    LEFT JOIN evs ON evs.user_id = pr.id
    LEFT JOIN last_any ON last_any.user_id = pr.id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_students_overview(UUID) TO authenticated;

-- ------------------------------------------------------------
-- 6. KURSLAR KESIMI
-- ------------------------------------------------------------
DROP FUNCTION IF EXISTS public.admin_courses_overview();
CREATE OR REPLACE FUNCTION public.admin_courses_overview()
RETURNS TABLE (
  id UUID,
  title TEXT,
  slug TEXT,
  is_published BOOLEAN,
  total_topics INT,
  enrolled INT,
  active_today INT,
  active_week INT,
  completed INT,
  avg_progress INT,
  avg_score INT,
  avg_quiz INT
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_bugun TIMESTAMPTZ := date_trunc('day', now() AT TIME ZONE 'Asia/Tashkent') AT TIME ZONE 'Asia/Tashkent';
  v_hafta TIMESTAMPTZ := v_bugun - interval '6 days';
BEGIN
  IF NOT public.is_staff() THEN
    RAISE EXCEPTION 'Faqat admin yoki o''qituvchi';
  END IF;

  RETURN QUERY
  WITH st AS (
    SELECT s.* FROM public.student_course_stats(NULL, NULL) s
      JOIN profiles pf ON pf.id = s.user_id AND pf.role = 'student'
  )
  SELECT c.id, c.title, c.slug, c.is_published, c.total_topics,
         count(st.user_id)::int,
         count(st.user_id) FILTER (WHERE st.last_activity_at >= v_bugun)::int,
         count(st.user_id) FILTER (WHERE st.last_activity_at >= v_hafta)::int,
         count(st.user_id) FILTER (WHERE st.is_completed OR st.progress >= 100)::int,
         coalesce(round(avg(st.progress))::int, 0),
         round(avg(st.score))::int,
         round(avg(st.quiz_avg))::int
    FROM courses c
    LEFT JOIN st ON st.course_id = c.id
   GROUP BY c.id
   ORDER BY count(st.user_id) DESC, c.order_index;
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_courses_overview() TO authenticated;

-- ------------------------------------------------------------
-- Natija: kurslardagi talabalar soni
-- ------------------------------------------------------------
SELECT title AS kurs, total_enrolled AS talabalar FROM courses ORDER BY total_enrolled DESC, title;
