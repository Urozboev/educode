-- ============================================
-- PART 1: JADVALLAR YARATISH
-- Supabase SQL Editor da birinchi bo'lib ishga tushiring
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

-- 15a. CERTIFICATE_TEMPLATES (avval bu yaratiladi!)
CREATE TABLE IF NOT EXISTS certificate_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  background_url TEXT,
  layout_config JSONB,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 15b. CERTIFICATES (keyin bu yaratiladi, chunki template_id ga bog'liq)
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

-- 16. TEACHER_GROUPS
CREATE TABLE IF NOT EXISTS teacher_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 17. TEACHER_STUDENTS
CREATE TABLE IF NOT EXISTS teacher_students (
  teacher_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  group_id UUID REFERENCES teacher_groups(id) ON DELETE SET NULL,
  assigned_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (teacher_id, student_id)
);

-- 18. TEACHER_ASSIGNMENTS
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

-- 19. PLACEMENT_TESTS
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

-- 20. PLACEMENT_RESULTS
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

-- 21. PLATFORM_SETTINGS
CREATE TABLE IF NOT EXISTS platform_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);
