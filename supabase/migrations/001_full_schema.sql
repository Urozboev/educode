-- ============================================
-- EduCode Platform — To'liq ma'lumotlar bazasi
-- Supabase SQL Editor da ishga tushiring
-- ============================================

-- 1. PROFILES
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  username TEXT UNIQUE,
  avatar_url TEXT,
  bio TEXT,
  role TEXT NOT NULL CHECK (role IN ('student','teacher','admin')) DEFAULT 'student',
  level TEXT CHECK (level IN ('beginner','elementary','intermediate','advanced')) DEFAULT 'beginner',
  coins INTEGER NOT NULL DEFAULT 100,
  xp INTEGER NOT NULL DEFAULT 0,
  streak_days INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_active_date DATE,
  preferred_language TEXT DEFAULT 'uz',
  theme TEXT DEFAULT 'dark',
  ab_group TEXT CHECK (ab_group IN ('control','experiment')) DEFAULT 'experiment',
  is_blocked BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. COURSES
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  long_description TEXT,
  thumbnail_url TEXT,
  category TEXT NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('beginner','intermediate','advanced')),
  is_free BOOLEAN DEFAULT true,
  price_coins INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  author_id UUID REFERENCES profiles(id),
  coin_reward INTEGER DEFAULT 50,
  estimated_hours INTEGER,
  total_topics INTEGER DEFAULT 0,
  total_enrolled INTEGER DEFAULT 0,
  average_rating NUMERIC(3,2) DEFAULT 0,
  tags TEXT[],
  prerequisites UUID[],
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. TOPICS
CREATE TABLE IF NOT EXISTS topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  content_html TEXT,
  video_url TEXT,
  video_duration_seconds INTEGER,
  presentation_url TEXT,
  order_index INTEGER NOT NULL,
  coin_reward INTEGER DEFAULT 10,
  xp_reward INTEGER DEFAULT 25,
  estimated_minutes INTEGER DEFAULT 30,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(course_id, slug)
);

-- 4. QUIZZES
CREATE TABLE IF NOT EXISTS quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  question_type TEXT CHECK (question_type IN ('single','multiple')) DEFAULT 'single',
  options JSONB NOT NULL,
  explanation TEXT,
  points INTEGER DEFAULT 1,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. TOPIC_TASKS
CREATE TABLE IF NOT EXISTS topic_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  instruction_html TEXT,
  starter_code TEXT DEFAULT '',
  solution_code TEXT,
  language TEXT NOT NULL DEFAULT 'python',
  test_cases JSONB NOT NULL,
  hints JSONB,
  difficulty TEXT CHECK (difficulty IN ('easy','medium','hard')) DEFAULT 'easy',
  coin_reward INTEGER DEFAULT 5,
  xp_reward INTEGER DEFAULT 15,
  time_limit_ms INTEGER DEFAULT 3000,
  memory_limit_kb INTEGER DEFAULT 256000,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. CHALLENGES
CREATE TABLE IF NOT EXISTS challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  instruction_html TEXT,
  category TEXT NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('easy','medium','hard')) NOT NULL,
  languages TEXT[] NOT NULL DEFAULT ARRAY['python','javascript'],
  starter_code JSONB DEFAULT '{}',
  test_cases JSONB NOT NULL,
  hidden_test_cases JSONB DEFAULT '[]',
  time_limit_ms INTEGER DEFAULT 2000,
  memory_limit_kb INTEGER DEFAULT 256000,
  coin_reward INTEGER DEFAULT 5,
  xp_reward INTEGER DEFAULT 20,
  solved_count INTEGER DEFAULT 0,
  attempt_count INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  author_id UUID REFERENCES profiles(id),
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 7. ENROLLMENTS
CREATE TABLE IF NOT EXISTS enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  progress_percent INTEGER DEFAULT 0,
  completed_topics INTEGER DEFAULT 0,
  total_topics INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT false,
  enrolled_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  last_accessed_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- 8. TOPIC_PROGRESS
CREATE TABLE IF NOT EXISTS topic_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  content_read BOOLEAN DEFAULT false,
  video_watched BOOLEAN DEFAULT false,
  quiz_passed BOOLEAN DEFAULT false,
  quiz_score INTEGER,
  quiz_total INTEGER,
  tasks_completed BOOLEAN DEFAULT false,
  is_completed BOOLEAN DEFAULT false,
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, topic_id)
);

-- 9. QUIZ_RESULTS
CREATE TABLE IF NOT EXISTS quiz_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  total INTEGER NOT NULL,
  percentage NUMERIC(5,2) NOT NULL,
  answers JSONB NOT NULL,
  ai_feedback TEXT,
  time_spent_seconds INTEGER,
  attempt_number INTEGER DEFAULT 1,
  completed_at TIMESTAMPTZ DEFAULT now()
);

-- 10. SUBMISSIONS
CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  task_id UUID NOT NULL,
  task_type TEXT NOT NULL CHECK (task_type IN ('topic_task','challenge')),
  code TEXT NOT NULL,
  language TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN (
    'pending','running','accepted','wrong_answer',
    'compilation_error','runtime_error','time_limit','memory_limit'
  )) DEFAULT 'pending',
  test_results JSONB,
  passed_tests INTEGER DEFAULT 0,
  total_tests INTEGER DEFAULT 0,
  execution_time_ms INTEGER,
  memory_used_kb INTEGER,
  ai_feedback TEXT,
  judge0_token TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 11. COIN_TRANSACTIONS
CREATE TABLE IF NOT EXISTS coin_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN (
    'registration_bonus','topic_complete','course_complete',
    'challenge_solved','streak_bonus','achievement_bonus',
    'course_purchase','admin_adjustment','quiz_bonus'
  )),
  reference_id UUID,
  description TEXT,
  balance_after INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 12. ACHIEVEMENTS
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT NOT NULL DEFAULT 'trophy',
  color TEXT DEFAULT '#FFD600',
  category TEXT NOT NULL,
  requirement_type TEXT NOT NULL,
  requirement_count INTEGER NOT NULL,
  coin_reward INTEGER DEFAULT 10,
  xp_reward INTEGER DEFAULT 50,
  is_hidden BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 13. USER_ACHIEVEMENTS
CREATE TABLE IF NOT EXISTS user_achievements (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, achievement_id)
);

-- 14. USER_STREAKS
CREATE TABLE IF NOT EXISTS user_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  activities_count INTEGER DEFAULT 1,
  UNIQUE(user_id, date)
);

-- 15. CERTIFICATES
CREATE TABLE IF NOT EXISTS certificate_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  background_url TEXT,
  layout_config JSONB,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  template_id UUID REFERENCES certificate_templates(id),
  certificate_number TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  course_title TEXT NOT NULL,
  completion_date DATE NOT NULL,
  score_percentage NUMERIC(5,2),
  pdf_url TEXT,
  issued_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- 16-18. O'QITUVCHI JADVALLARI
CREATE TABLE IF NOT EXISTS teacher_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS teacher_students (
  teacher_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  group_id UUID REFERENCES teacher_groups(id) ON DELETE SET NULL,
  assigned_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (teacher_id, student_id)
);

CREATE TABLE IF NOT EXISTS teacher_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES profiles(id),
  challenge_id UUID NOT NULL REFERENCES challenges(id),
  group_id UUID REFERENCES teacher_groups(id),
  title TEXT,
  instructions TEXT,
  deadline TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 19-20. DARAJA ANIQLASH
CREATE TABLE IF NOT EXISTS placement_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('beginner','elementary','intermediate','advanced')),
  options JSONB NOT NULL,
  correct_option TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS placement_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  answers JSONB NOT NULL,
  score INTEGER NOT NULL,
  total INTEGER NOT NULL,
  assigned_level TEXT NOT NULL,
  ai_recommendation TEXT,
  completed_at TIMESTAMPTZ DEFAULT now()
);

-- 21. PLATFORM SETTINGS
CREATE TABLE IF NOT EXISTS platform_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

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

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER courses_updated_at BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER topics_updated_at BEFORE UPDATE ON topics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
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
CREATE POLICY "courses_admin_all" ON courses FOR ALL USING (
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
CREATE POLICY "topics_admin_all" ON topics FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- QUIZZES
CREATE POLICY "quizzes_select" ON quizzes FOR SELECT USING (true);
CREATE POLICY "quizzes_admin_all" ON quizzes FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- TOPIC_TASKS
CREATE POLICY "topic_tasks_select" ON topic_tasks FOR SELECT USING (true);
CREATE POLICY "topic_tasks_admin_all" ON topic_tasks FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- CHALLENGES
CREATE POLICY "challenges_select_published" ON challenges FOR SELECT USING (is_published = true OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','teacher')));
CREATE POLICY "challenges_admin_all" ON challenges FOR ALL USING (
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

-- ACHIEVEMENTS & USER_ACHIEVEMENTS
CREATE POLICY "achievements_select" ON achievements FOR SELECT USING (true);
CREATE POLICY "achievements_admin_all" ON achievements FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
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
CREATE POLICY "certificate_templates_select" ON certificate_templates FOR SELECT USING (true);
CREATE POLICY "certificate_templates_admin" ON certificate_templates FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- TEACHER TABLES
CREATE POLICY "teacher_groups_own" ON teacher_groups FOR ALL USING (
  teacher_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "teacher_students_own" ON teacher_students FOR ALL USING (
  teacher_id = auth.uid() OR student_id = auth.uid() OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "teacher_assignments_own" ON teacher_assignments FOR ALL USING (
  teacher_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- PLACEMENT
CREATE POLICY "placement_tests_select" ON placement_tests FOR SELECT USING (is_active = true);
CREATE POLICY "placement_tests_admin" ON placement_tests FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "placement_results_own" ON placement_results FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "placement_results_insert" ON placement_results FOR INSERT WITH CHECK (user_id = auth.uid());

-- PLATFORM SETTINGS
CREATE POLICY "settings_select" ON platform_settings FOR SELECT USING (true);
CREATE POLICY "settings_admin" ON platform_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ============================================
-- SEED DATA (Boshlang'ich ma'lumotlar)
-- ============================================

-- Platformi sozlamalari
INSERT INTO platform_settings (key, value, description) VALUES
('coin_settings', '{"registration_bonus":100,"topic_complete":10,"course_complete":50,"challenge_easy":5,"challenge_medium":10,"challenge_hard":20,"streak_3":15,"streak_7":30,"streak_30":100}', 'Coin tizimi sozlamalari'),
('xp_settings', '{"topic_complete":25,"course_complete":100,"challenge_easy":15,"challenge_medium":30,"challenge_hard":50,"quiz_pass":10}', 'XP tizimi sozlamalari'),
('level_thresholds', '{"beginner":0,"elementary":200,"intermediate":500,"advanced":1000}', 'XP darajalar chegarasi')
ON CONFLICT (key) DO NOTHING;

-- Yutuqlar
INSERT INTO achievements (title, description, icon, color, category, requirement_type, requirement_count, coin_reward, xp_reward) VALUES
('Birinchi qadam', 'Birinchi topshiriqni bajardingiz!', 'footprints', '#6C5CE7', 'learning', 'challenges_solved', 1, 5, 10),
('10 ta topshiriq', '10 ta topshiriqni yechdingiz!', 'target', '#00D2FF', 'challenge', 'challenges_solved', 10, 20, 50),
('50 ta topshiriq', '50 ta topshiriqni yechdingiz!', 'award', '#FFD600', 'challenge', 'challenges_solved', 50, 50, 100),
('Birinchi kurs', 'Birinchi kursni tugatdingiz!', 'book-check', '#00E676', 'learning', 'courses_completed', 1, 20, 50),
('3 kunlik streak', '3 kun ketma-ket faol bo''ldingiz!', 'flame', '#FF5252', 'streak', 'streak_days', 3, 15, 30),
('7 kunlik streak', '7 kun ketma-ket faol bo''ldingiz!', 'flame', '#FF5252', 'streak', 'streak_days', 7, 30, 60),
('30 kunlik streak', '30 kun ketma-ket faol bo''ldingiz!', 'crown', '#FFD600', 'streak', 'streak_days', 30, 100, 200),
('Tez yechuvchi', '5 ta oson topshiriqni yechdingiz', 'zap', '#00D2FF', 'challenge', 'challenges_solved', 5, 10, 25),
('5 ta test', '5 ta testni muvaffaqiyatli topshirdingiz', 'check-circle', '#00E676', 'learning', 'quizzes_passed', 5, 10, 25)
ON CONFLICT DO NOTHING;

-- Namuna kurslar
INSERT INTO courses (title, slug, description, category, difficulty, is_free, coin_reward, estimated_hours, total_topics, is_published, order_index) VALUES
('Python dasturlash asoslari', 'python-basics', 'Python dasturlash tilini noldan o''rganing. O''zgaruvchilar, shartlar, sikllar, funksiyalar va boshqalar.', 'python', 'beginner', true, 50, 40, 24, true, 1),
('JavaScript asoslari', 'javascript-basics', 'Veb dasturlashning asosi — JavaScript tilini o''rganing.', 'programming', 'beginner', true, 50, 35, 20, true, 2),
('Frontend (HTML, CSS, React)', 'frontend-course', 'Zamonaviy veb-saytlar yaratishni o''rganing. HTML, CSS va React.', 'frontend', 'intermediate', false, 100, 60, 32, true, 3),
('Kompyuter savodxonligi', 'computer-literacy', 'Kompyuter bilan ishlash asoslari. Office dasturlari, Internet, xavfsizlik.', 'computer_literacy', 'beginner', true, 30, 20, 15, true, 4),
('Prompt Engineering', 'prompt-engineering', 'AI bilan samarali ishlash san''ati. ChatGPT, Claude va boshqa AI vositalar.', 'prompt_engineering', 'intermediate', false, 40, 15, 12, true, 5),
('Algoritmlar va ma''lumotlar tuzilmasi', 'algorithms-ds', 'Dasturlash musobaqalari uchun algoritmlar va ma''lumotlar tuzilmalari.', 'algorithms', 'advanced', false, 150, 80, 28, true, 6)
ON CONFLICT (slug) DO NOTHING;

-- Python kursi uchun namuna mavzular
INSERT INTO topics (course_id, title, slug, content_html, order_index, coin_reward, xp_reward, estimated_minutes)
SELECT c.id, t.title, t.slug, t.content, t.idx, 10, 25, t.minutes
FROM courses c,
(VALUES
  ('Python nima va nima uchun o''rganish kerak?', 'python-intro', '<h2>Python haqida</h2><p>Python — bu sodda va kuchli dasturlash tili. Uni o''rganish oson, lekin imkoniyatlari cheksiz.</p><h3>Python qayerda ishlatiladi?</h3><ul><li>Veb dasturlash (Django, Flask)</li><li>Sun''iy intellekt va Machine Learning</li><li>Ma''lumotlar tahlili (Data Science)</li><li>Avtomatlashtirish</li><li>O''yin yaratish</li></ul><p>Keling, birinchi Python dasturimizni yozamiz!</p>', 1, 15),
  ('Python o''rnatish va muhitni sozlash', 'python-setup', '<h2>Python o''rnatish</h2><p>Python ni rasmiy saytdan yuklab oling: python.org</p><h3>Qadamlar:</h3><ol><li>python.org saytiga kiring</li><li>Downloads bo''limidan oxirgi versiyani yuklab oling</li><li>O''rnatish jarayonida "Add to PATH" ni tanlang</li></ol>', 2, 20),
  ('O''zgaruvchilar va ma''lumot turlari', 'variables', '<h2>O''zgaruvchilar</h2><p>O''zgaruvchi — bu qiymatni saqlaydigan idish. Python da o''zgaruvchi yaratish juda oson:</p><pre><code>ism = "Mirjalol"\nyosh = 25\npi = 3.14\ntalaba = True</code></pre><h3>Asosiy ma''lumot turlari:</h3><ul><li><strong>str</strong> — matn (string)</li><li><strong>int</strong> — butun son</li><li><strong>float</strong> — kasr son</li><li><strong>bool</strong> — True yoki False</li></ul>', 3, 25),
  ('Amallar va ifodalar', 'operators', '<h2>Amallar</h2><p>Python da matematik va mantiqiy amallarni bajarish mumkin.</p><h3>Matematik amallar:</h3><pre><code>a = 10\nb = 3\nprint(a + b)  # 13\nprint(a - b)  # 7\nprint(a * b)  # 30\nprint(a / b)  # 3.333\nprint(a // b) # 3\nprint(a % b)  # 1\nprint(a ** b) # 1000</code></pre>', 4, 20),
  ('Shartli operatorlar (if/elif/else)', 'conditions', '<h2>Shartli operatorlar</h2><p>Dastur oqimini boshqarish uchun shartli operatorlardan foydalanamiz.</p><pre><code>yosh = 18\n\nif yosh >= 18:\n    print("Siz voyaga yetgansiz")\nelif yosh >= 14:\n    print("Siz o''smir")\nelse:\n    print("Siz bola")</code></pre>', 5, 30),
  ('Sikllar (for va while)', 'loops', '<h2>Sikllar</h2><p>Bir xil amalni bir necha marta takrorlash uchun sikllardan foydalanamiz.</p><h3>for sikli:</h3><pre><code>for i in range(5):\n    print(i)  # 0, 1, 2, 3, 4\n\nmevalar = ["olma", "banan", "uzum"]\nfor meva in mevalar:\n    print(meva)</code></pre><h3>while sikli:</h3><pre><code>son = 0\nwhile son < 5:\n    print(son)\n    son += 1</code></pre>', 6, 35),
  ('Funksiyalar', 'functions', '<h2>Funksiyalar</h2><p>Funksiya — bu qayta ishlatiladigan kod bloki.</p><pre><code>def salomlash(ism):\n    return f"Salom, {ism}!"\n\nnatija = salomlash("Mirjalol")\nprint(natija)  # Salom, Mirjalol!</code></pre>', 7, 30),
  ('Ro''yxatlar (Lists)', 'lists', '<h2>Ro''yxatlar</h2><p>Ro''yxat — bu bir nechta qiymatlarni saqlash uchun ishlatiladigan ma''lumot turi.</p><pre><code>sonlar = [1, 2, 3, 4, 5]\nsonlar.append(6)\nprint(sonlar[0])  # 1\nprint(len(sonlar))  # 6</code></pre>', 8, 30)
) AS t(title, slug, content, idx, minutes)
WHERE c.slug = 'python-basics'
ON CONFLICT DO NOTHING;

-- Python mavzulari uchun namuna testlar
DO $$
DECLARE
  topic_id UUID;
BEGIN
  SELECT id INTO topic_id FROM topics WHERE slug = 'variables' LIMIT 1;
  IF topic_id IS NOT NULL THEN
    INSERT INTO quizzes (topic_id, question, question_type, options, explanation, points, order_index) VALUES
    (topic_id, 'Python da o''zgaruvchi yaratish uchun qaysi kalit so''z ishlatiladi?', 'single',
     '[{"id":"a","text":"var","is_correct":false},{"id":"b","text":"let","is_correct":false},{"id":"c","text":"Kalit so''z kerak emas","is_correct":true},{"id":"d","text":"define","is_correct":false}]',
     'Python da o''zgaruvchi yaratish uchun maxsus kalit so''z kerak emas. Shunchaki ism = qiymat yoziladi.', 1, 1),
    (topic_id, '`x = 10` ifodada x ning turi nima?', 'single',
     '[{"id":"a","text":"str","is_correct":false},{"id":"b","text":"int","is_correct":true},{"id":"c","text":"float","is_correct":false},{"id":"d","text":"bool","is_correct":false}]',
     '10 butun son bo''lgani uchun x ning turi int (integer) bo''ladi.', 1, 2),
    (topic_id, 'Quyidagilardan qaysilari to''g''ri o''zgaruvchi nomi? (bir nechtasini tanlang)', 'multiple',
     '[{"id":"a","text":"my_name","is_correct":true},{"id":"b","text":"2name","is_correct":false},{"id":"c","text":"_count","is_correct":true},{"id":"d","text":"for","is_correct":false}]',
     'O''zgaruvchi nomi raqam bilan boshlanmaydi va Python kalit so''zlari (for, if, while...) ishlatilmaydi.', 1, 3),
    (topic_id, '`type(3.14)` ifoda natijasi nima?', 'single',
     '[{"id":"a","text":"<class ''int''>","is_correct":false},{"id":"b","text":"<class ''float''>","is_correct":true},{"id":"c","text":"<class ''str''>","is_correct":false},{"id":"d","text":"<class ''decimal''>","is_correct":false}]',
     '3.14 kasr son bo''lgani uchun uning turi float.', 1, 4),
    (topic_id, '`ism = "Python"` — bu yerda "Python" qaysi turga mansub?', 'single',
     '[{"id":"a","text":"int","is_correct":false},{"id":"b","text":"bool","is_correct":false},{"id":"c","text":"str","is_correct":true},{"id":"d","text":"list","is_correct":false}]',
     'Qo''shtirnoq ichidagi qiymat — str (string, matn) turi.', 1, 5)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Namuna topshiriqlar (challenges)
INSERT INTO challenges (title, slug, description, category, difficulty, languages, starter_code, test_cases, hidden_test_cases, coin_reward, xp_reward) VALUES
('Ikki sonni qo''shish', 'sum-two-numbers', 'Ikkita son berilgan. Ularning yig''indisini qaytaring.', 'math', 'easy',
 ARRAY['python','javascript'],
 '{"python":"def solve(a, b):\n    # Kodingizni yozing\n    pass","javascript":"function solve(a, b) {\n    // Kodingizni yozing\n}"}',
 '[{"input":"5 3","expected_output":"8","is_hidden":false},{"input":"10 20","expected_output":"30","is_hidden":false},{"input":"-5 5","expected_output":"0","is_hidden":false}]',
 '[{"input":"1000000 999999","expected_output":"1999999","is_hidden":true},{"input":"0 0","expected_output":"0","is_hidden":true}]',
 5, 15),

('Juft yoki toq', 'even-or-odd', 'Berilgan sonning juft yoki toqligini aniqlang. Juft bo''lsa "Juft", toq bo''lsa "Toq" qaytaring.', 'math', 'easy',
 ARRAY['python','javascript'],
 '{"python":"def solve(n):\n    # Kodingizni yozing\n    pass","javascript":"function solve(n) {\n    // Kodingizni yozing\n}"}',
 '[{"input":"4","expected_output":"Juft","is_hidden":false},{"input":"7","expected_output":"Toq","is_hidden":false},{"input":"0","expected_output":"Juft","is_hidden":false}]',
 '[{"input":"999999","expected_output":"Toq","is_hidden":true},{"input":"-2","expected_output":"Juft","is_hidden":true}]',
 5, 15),

('Eng katta element', 'max-element', 'Berilgan ro''yxatdan eng katta elementni toping.', 'arrays', 'easy',
 ARRAY['python','javascript'],
 '{"python":"def solve(arr):\n    # Kodingizni yozing\n    pass","javascript":"function solve(arr) {\n    // Kodingizni yozing\n}"}',
 '[{"input":"[1, 5, 3, 9, 2]","expected_output":"9","is_hidden":false},{"input":"[-1, -5, -3]","expected_output":"-1","is_hidden":false}]',
 '[{"input":"[100]","expected_output":"100","is_hidden":true}]',
 5, 15),

('Palindrom tekshirish', 'palindrome-check', 'Berilgan so''z palindrom (teskari o''qilganda ham bir xil) ekanligini tekshiring. "Ha" yoki "Yo''q" qaytaring.', 'strings', 'medium',
 ARRAY['python','javascript'],
 '{"python":"def solve(s):\n    # Kodingizni yozing\n    pass","javascript":"function solve(s) {\n    // Kodingizni yozing\n}"}',
 '[{"input":"madam","expected_output":"Ha","is_hidden":false},{"input":"salom","expected_output":"Yo''q","is_hidden":false},{"input":"aba","expected_output":"Ha","is_hidden":false}]',
 '[{"input":"a","expected_output":"Ha","is_hidden":true},{"input":"abcba","expected_output":"Ha","is_hidden":true}]',
 10, 30),

('Fibonacci ketma-ketligi', 'fibonacci', 'n-chi Fibonacci sonini qaytaring. F(0)=0, F(1)=1, F(n)=F(n-1)+F(n-2).', 'algorithms', 'medium',
 ARRAY['python','javascript'],
 '{"python":"def solve(n):\n    # Kodingizni yozing\n    pass","javascript":"function solve(n) {\n    // Kodingizni yozing\n}"}',
 '[{"input":"0","expected_output":"0","is_hidden":false},{"input":"1","expected_output":"1","is_hidden":false},{"input":"10","expected_output":"55","is_hidden":false}]',
 '[{"input":"20","expected_output":"6765","is_hidden":true},{"input":"30","expected_output":"832040","is_hidden":true}]',
 10, 30),

('Satrni teskari aylantirish', 'reverse-string', 'Berilgan satrni teskari aylantiring. Built-in reverse funksiyadan foydalanmang.', 'strings', 'easy',
 ARRAY['python','javascript'],
 '{"python":"def solve(s):\n    # Kodingizni yozing\n    pass","javascript":"function solve(s) {\n    // Kodingizni yozing\n}"}',
 '[{"input":"salom","expected_output":"molas","is_hidden":false},{"input":"python","expected_output":"nohtyp","is_hidden":false}]',
 '[{"input":"a","expected_output":"a","is_hidden":true},{"input":"","expected_output":"","is_hidden":true}]',
 5, 15)
ON CONFLICT (slug) DO NOTHING;

-- Namuna daraja aniqlash testlari
INSERT INTO placement_tests (question, category, difficulty, options, correct_option, order_index) VALUES
('Kompyuter nima?', 'logic', 'beginner',
 '[{"id":"a","text":"Faqat o''yin o''ynash uchun qurilma"},{"id":"b","text":"Ma''lumotlarni qayta ishlovchi elektron qurilma"},{"id":"c","text":"Faqat internet uchun qurilma"},{"id":"d","text":"Televizorning bir turi"}]',
 'b', 1),
('Dasturlash tili nima vazifa bajaradi?', 'basic_programming', 'beginner',
 '[{"id":"a","text":"Kompyuterni tuzatadi"},{"id":"b","text":"Kompyuterga buyruqlar berish uchun ishlatiladi"},{"id":"c","text":"Internet tezligini oshiradi"},{"id":"d","text":"Ekranni chiroyli qiladi"}]',
 'b', 2),
('x = 5; y = 3; print(x + y) — natija nima?', 'basic_programming', 'elementary',
 '[{"id":"a","text":"53"},{"id":"b","text":"8"},{"id":"c","text":"x + y"},{"id":"d","text":"Xatolik"}]',
 'b', 3),
('for sikli nima uchun ishlatiladi?', 'basic_programming', 'elementary',
 '[{"id":"a","text":"Shart tekshirish uchun"},{"id":"b","text":"Funksiya yaratish uchun"},{"id":"c","text":"Amalni takrorlash uchun"},{"id":"d","text":"O''zgaruvchi yaratish uchun"}]',
 'c', 4),
('O(n log n) murakkablik qaysi algoritmga xos?', 'algorithms', 'advanced',
 '[{"id":"a","text":"Bubble Sort"},{"id":"b","text":"Merge Sort"},{"id":"c","text":"Linear Search"},{"id":"d","text":"Fibonacci"}]',
 'b', 5)
ON CONFLICT DO NOTHING;

-- Supabase Storage bucket yaratish (bu SQL emas, Supabase Dashboard dan yaratiladi)
-- Quyidagi bucket'lar kerak:
-- 1. course-thumbnails (public)
-- 2. topic-videos (authenticated)
-- 3. topic-presentations (authenticated)
-- 4. certificates (authenticated)
-- 5. avatars (public)
