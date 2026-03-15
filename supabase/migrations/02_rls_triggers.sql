-- ============================================
-- PART 2: TRIGGERS, FUNCTIONS, RLS
-- Jadvallar yaratilgandan keyin ishga tushiring
-- ============================================

-- ============================================
-- TRIGGERS & FUNCTIONS
-- ============================================

-- Yangi foydalanuvchi uchun profil yaratish
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  INSERT INTO coin_transactions (user_id, amount, type, description, balance_after)
  VALUES (NEW.id, 100, 'registration_bonus', 'Registratsiya bonusi', 100);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- updated_at avtomatik yangilash
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS courses_updated_at ON courses;
CREATE TRIGGER courses_updated_at BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS topics_updated_at ON topics;
CREATE TRIGGER topics_updated_at BEFORE UPDATE ON topics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS challenges_updated_at ON challenges;
CREATE TRIGGER challenges_updated_at BEFORE UPDATE ON challenges
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE topic_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE topic_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE coin_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificate_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE placement_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE placement_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;

-- PROFILES
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);

-- COURSES
CREATE POLICY "courses_select_published" ON courses FOR SELECT USING (
  is_published = true OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','teacher'))
);
CREATE POLICY "courses_insert_admin" ON courses FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "courses_update_admin" ON courses FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "courses_delete_admin" ON courses FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- TOPICS
CREATE POLICY "topics_select" ON topics FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM courses c
    LEFT JOIN enrollments e ON e.course_id = c.id AND e.user_id = auth.uid()
    WHERE c.id = topics.course_id AND (c.is_free = true OR e.id IS NOT NULL)
  ) OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','teacher'))
);
CREATE POLICY "topics_insert_admin" ON topics FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "topics_update_admin" ON topics FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "topics_delete_admin" ON topics FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- QUIZZES
CREATE POLICY "quizzes_select" ON quizzes FOR SELECT USING (true);
CREATE POLICY "quizzes_insert_admin" ON quizzes FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "quizzes_update_admin" ON quizzes FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "quizzes_delete_admin" ON quizzes FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- TOPIC_TASKS
CREATE POLICY "topic_tasks_select" ON topic_tasks FOR SELECT USING (true);
CREATE POLICY "topic_tasks_insert_admin" ON topic_tasks FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "topic_tasks_update_admin" ON topic_tasks FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "topic_tasks_delete_admin" ON topic_tasks FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- CHALLENGES
CREATE POLICY "challenges_select_published" ON challenges FOR SELECT USING (
  is_published = true OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','teacher'))
);
CREATE POLICY "challenges_insert_admin" ON challenges FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "challenges_update_admin" ON challenges FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "challenges_delete_admin" ON challenges FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ENROLLMENTS
CREATE POLICY "enrollments_select_own" ON enrollments FOR SELECT USING (
  user_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','teacher'))
);
CREATE POLICY "enrollments_insert_own" ON enrollments FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "enrollments_update_own" ON enrollments FOR UPDATE USING (user_id = auth.uid());

-- TOPIC_PROGRESS
CREATE POLICY "topic_progress_select_own" ON topic_progress FOR SELECT USING (
  user_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','teacher'))
);
CREATE POLICY "topic_progress_insert_own" ON topic_progress FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "topic_progress_update_own" ON topic_progress FOR UPDATE USING (user_id = auth.uid());

-- QUIZ_RESULTS
CREATE POLICY "quiz_results_select_own" ON quiz_results FOR SELECT USING (
  user_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','teacher'))
);
CREATE POLICY "quiz_results_insert_own" ON quiz_results FOR INSERT WITH CHECK (user_id = auth.uid());

-- SUBMISSIONS
CREATE POLICY "submissions_select_own" ON submissions FOR SELECT USING (
  user_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','teacher'))
);
CREATE POLICY "submissions_insert_own" ON submissions FOR INSERT WITH CHECK (user_id = auth.uid());

-- COIN_TRANSACTIONS
CREATE POLICY "coins_select_own" ON coin_transactions FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "coins_insert_system" ON coin_transactions FOR INSERT WITH CHECK (true);

-- ACHIEVEMENTS
CREATE POLICY "achievements_select" ON achievements FOR SELECT USING (true);
CREATE POLICY "achievements_insert_admin" ON achievements FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "achievements_update_admin" ON achievements FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "achievements_delete_admin" ON achievements FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- USER_ACHIEVEMENTS
CREATE POLICY "user_achievements_select" ON user_achievements FOR SELECT USING (
  user_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','teacher'))
);
CREATE POLICY "user_achievements_insert" ON user_achievements FOR INSERT WITH CHECK (true);

-- USER_STREAKS
CREATE POLICY "streaks_select_own" ON user_streaks FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "streaks_insert_own" ON user_streaks FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "streaks_update_own" ON user_streaks FOR UPDATE USING (user_id = auth.uid());

-- CERTIFICATES
CREATE POLICY "certificates_select_own" ON certificates FOR SELECT USING (
  user_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','teacher'))
);
CREATE POLICY "certificates_insert" ON certificates FOR INSERT WITH CHECK (true);

-- CERTIFICATE_TEMPLATES
CREATE POLICY "certificate_templates_select" ON certificate_templates FOR SELECT USING (true);
CREATE POLICY "certificate_templates_insert_admin" ON certificate_templates FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "certificate_templates_update_admin" ON certificate_templates FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "certificate_templates_delete_admin" ON certificate_templates FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- TEACHER TABLES
CREATE POLICY "teacher_groups_own" ON teacher_groups FOR SELECT USING (
  teacher_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "teacher_groups_insert" ON teacher_groups FOR INSERT WITH CHECK (
  teacher_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "teacher_groups_update" ON teacher_groups FOR UPDATE USING (
  teacher_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "teacher_groups_delete" ON teacher_groups FOR DELETE USING (
  teacher_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "teacher_students_select" ON teacher_students FOR SELECT USING (
  teacher_id = auth.uid() OR student_id = auth.uid() OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "teacher_students_insert" ON teacher_students FOR INSERT WITH CHECK (
  teacher_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "teacher_students_delete" ON teacher_students FOR DELETE USING (
  teacher_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "teacher_assignments_select" ON teacher_assignments FOR SELECT USING (
  teacher_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "teacher_assignments_insert" ON teacher_assignments FOR INSERT WITH CHECK (
  teacher_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "teacher_assignments_update" ON teacher_assignments FOR UPDATE USING (
  teacher_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "teacher_assignments_delete" ON teacher_assignments FOR DELETE USING (
  teacher_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- PLACEMENT
CREATE POLICY "placement_tests_select" ON placement_tests FOR SELECT USING (is_active = true);
CREATE POLICY "placement_tests_insert_admin" ON placement_tests FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "placement_tests_update_admin" ON placement_tests FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "placement_results_select_own" ON placement_results FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "placement_results_insert" ON placement_results FOR INSERT WITH CHECK (user_id = auth.uid());

-- PLATFORM SETTINGS
CREATE POLICY "settings_select" ON platform_settings FOR SELECT USING (true);
CREATE POLICY "settings_insert_admin" ON platform_settings FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "settings_update_admin" ON platform_settings FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
