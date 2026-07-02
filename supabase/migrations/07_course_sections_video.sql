-- ============================================
-- EduCode — Kurs bo'limlari, video himoya va performance
-- (1) course_sections: kurs ichidagi bo'limlar (modullar)
-- (2) topics: section_id, is_free_preview, video provider maydonlari
-- (3) topics_toc: public mundarija VIEW (kontent ustunlarisiz)
-- (4) topics RLS'ni qattiqlashtirish (pullik kurs kontenti himoyasi)
-- (5) Performance INDEX'lar
-- Supabase SQL Editor da ishga tushiring.
-- ============================================

-- ============================================
-- 1) COURSE SECTIONS (bo'limlar)
-- ============================================
CREATE TABLE IF NOT EXISTS course_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  estimated_minutes INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS course_sections_course_idx ON course_sections(course_id, order_index);

ALTER TABLE course_sections ENABLE ROW LEVEL SECURITY;

-- Bo'lim nomlari hammaga ko'rinadi (mundarija — marketing)
CREATE POLICY "course_sections_select" ON course_sections FOR SELECT USING (true);
CREATE POLICY "course_sections_admin_all" ON course_sections FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE TRIGGER course_sections_updated_at BEFORE UPDATE ON course_sections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- 2) TOPICS — bo'lim, free preview va video provider
-- ============================================
ALTER TABLE topics
  ADD COLUMN IF NOT EXISTS section_id UUID REFERENCES course_sections(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS is_free_preview BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS video_provider TEXT CHECK (video_provider IN ('youtube','bunny','cloudflare','vimeo','direct')) DEFAULT 'youtube',
  ADD COLUMN IF NOT EXISTS video_id TEXT;

-- video_url eski maydon sifatida qoladi (YouTube havolalari).
-- Yangi yuklamalar video_provider + video_id bilan ishlaydi (himoyalangan).

CREATE INDEX IF NOT EXISTS topics_section_idx ON topics(section_id, order_index);

-- ============================================
-- 3) PUBLIC MUNDARIJA VIEW
--    Kontent ustunlari YO'Q (content_html, video_url, video_id,
--    presentation_url himoyada qoladi). View default'da RLS'ni
--    bypass qiladi (definer huquqi) — shuning uchun faqat
--    xavfsiz ustunlar kiritilgan.
-- ============================================
CREATE OR REPLACE VIEW topics_toc AS
SELECT
  t.id,
  t.course_id,
  t.section_id,
  t.title,
  t.slug,
  t.order_index,
  t.estimated_minutes,
  t.coin_reward,
  t.xp_reward,
  t.is_free_preview,
  t.is_published,
  t.video_duration_seconds,
  (t.video_url IS NOT NULL OR t.video_id IS NOT NULL) AS has_video
FROM topics t
WHERE t.is_published = true;

GRANT SELECT ON topics_toc TO anon, authenticated;

-- ============================================
-- 4) TOPICS RLS'NI QATTIQLASHTIRISH
--    To'liq qator (content_html, video maydonlari bilan) faqat:
--    - kurs bepul bo'lsa, YOKI
--    - foydalanuvchi kursga yozilgan bo'lsa, YOKI
--    - dars is_free_preview bo'lsa, YOKI
--    - admin/teacher bo'lsa
-- ============================================
DROP POLICY IF EXISTS "topics_select" ON topics;
CREATE POLICY "topics_select" ON topics FOR SELECT USING (
  is_free_preview = true
  OR EXISTS (
    SELECT 1 FROM courses c
    LEFT JOIN enrollments e ON e.course_id = c.id AND e.user_id = auth.uid()
    WHERE c.id = topics.course_id AND (c.is_free = true OR e.id IS NOT NULL)
  )
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','teacher'))
);

-- ============================================
-- 5) PERFORMANCE INDEX'LAR
--    FK ustunlarda index bo'lmasa har so'rov seq-scan bo'ladi
-- ============================================
CREATE INDEX IF NOT EXISTS topics_course_idx ON topics(course_id, order_index);
CREATE INDEX IF NOT EXISTS quizzes_topic_idx ON quizzes(topic_id);
CREATE INDEX IF NOT EXISTS topic_tasks_topic_idx ON topic_tasks(topic_id, order_index);

CREATE INDEX IF NOT EXISTS enrollments_user_idx ON enrollments(user_id, is_completed);
CREATE INDEX IF NOT EXISTS enrollments_course_idx ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS enrollments_user_course_idx ON enrollments(user_id, course_id);

CREATE INDEX IF NOT EXISTS topic_progress_user_topic_idx ON topic_progress(user_id, topic_id);
CREATE INDEX IF NOT EXISTS topic_progress_user_course_idx ON topic_progress(user_id, course_id);

CREATE INDEX IF NOT EXISTS submissions_user_idx ON submissions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS submissions_user_task_idx ON submissions(user_id, task_id, status);

CREATE INDEX IF NOT EXISTS quiz_results_user_idx ON quiz_results(user_id);
CREATE INDEX IF NOT EXISTS coin_transactions_user_idx ON coin_transactions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS certificates_user_idx ON certificates(user_id);
CREATE INDEX IF NOT EXISTS user_achievements_user_idx ON user_achievements(user_id);

-- Leaderboard so'rovlari uchun
CREATE INDEX IF NOT EXISTS profiles_xp_idx ON profiles(xp DESC) WHERE is_blocked = false;
