-- ============================================
-- EduCode — AI Mentor & Cognitive Safeguards
-- Sokratik AI, AI-foydalanish limiti, akademik halollik,
-- refleksiv jurnal, kod snapshot va paste-tahlil uchun
-- yangi jadvallar.
-- Supabase SQL Editor da ishga tushiring.
-- ============================================

-- 1) profiles ga AI sozlamalari
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS ai_daily_limit INT NOT NULL DEFAULT 10,
  ADD COLUMN IF NOT EXISTS ai_dependency_score NUMERIC(5,2);

-- ============================================
-- 2) ai_interactions — har bir AI muloqotini log qilish
-- ============================================
CREATE TABLE IF NOT EXISTS ai_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_id UUID REFERENCES topics(id) ON DELETE SET NULL,
  task_id UUID,                                   -- topic_tasks.id yoki challenges.id
  task_type TEXT CHECK (task_type IN ('topic_task','challenge','free_chat','plan_first','hint')),
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('chat','feedback','mentor','hint','plan_review')),
  model_used TEXT,                                -- masalan 'claude-sonnet-4', 'gemini-2.0-flash'
  prompt_template TEXT,                           -- 'socratic_v1', 'feedback_v1', ...
  user_query TEXT,
  ai_response TEXT,
  tokens_input INT,
  tokens_output INT,
  user_satisfaction INT CHECK (user_satisfaction BETWEEN 1 AND 5),
  user_critique TEXT,                             -- "Bu javob to'g'rimi?" javobi
  code_snapshot TEXT,                             -- AI chaqirilgan paytdagi kod
  error_snapshot TEXT,                            -- shu paytdagi xato matni
  ai_confidence TEXT CHECK (ai_confidence IN ('low','medium','high')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ai_interactions_user_idx ON ai_interactions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS ai_interactions_task_idx ON ai_interactions(task_id);

-- ============================================
-- 3) ai_usage_daily — kunlik AI murojaatlar hisobi
-- ============================================
CREATE TABLE IF NOT EXISTS ai_usage_daily (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_queries INT NOT NULL DEFAULT 0,
  successful_queries INT NOT NULL DEFAULT 0,
  unsatisfactory_queries INT NOT NULL DEFAULT 0,
  cooldown_active BOOLEAN NOT NULL DEFAULT false,
  cooldown_until TIMESTAMPTZ,
  ai_dependency_score NUMERIC(5,2),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, date)
);

CREATE INDEX IF NOT EXISTS ai_usage_daily_user_idx ON ai_usage_daily(user_id, date DESC);

-- Increment helper (atomic upsert)
CREATE OR REPLACE FUNCTION increment_ai_usage(p_user_id UUID)
RETURNS ai_usage_daily AS $$
DECLARE
  rec ai_usage_daily;
BEGIN
  INSERT INTO ai_usage_daily (user_id, date, total_queries)
  VALUES (p_user_id, CURRENT_DATE, 1)
  ON CONFLICT (user_id, date)
  DO UPDATE SET
    total_queries = ai_usage_daily.total_queries + 1,
    updated_at = now()
  RETURNING * INTO rec;
  RETURN rec;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 4) code_snapshots — har 30s va paste hodisalari
-- ============================================
CREATE TABLE IF NOT EXISTS code_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  task_id UUID,
  task_type TEXT CHECK (task_type IN ('topic_task','challenge','playground')),
  language TEXT,
  code_content TEXT,
  code_length INT,
  paste_detected BOOLEAN NOT NULL DEFAULT false,
  paste_size INT DEFAULT 0,                       -- bir paste'da nechta belgi qo'shildi
  trigger_type TEXT CHECK (trigger_type IN ('auto','paste','submit','manual')) DEFAULT 'auto',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS code_snapshots_user_idx ON code_snapshots(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS code_snapshots_task_idx ON code_snapshots(task_id, user_id);
CREATE INDEX IF NOT EXISTS code_snapshots_paste_idx ON code_snapshots(paste_detected) WHERE paste_detected = true;

-- ============================================
-- 5) reflection_journals — refleksiv kundalik
-- ============================================
CREATE TABLE IF NOT EXISTS reflection_journals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_id UUID REFERENCES topics(id) ON DELETE SET NULL,
  course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  what_learned TEXT,                              -- "Bugun nimani o'rgandim?"
  ai_usage_reflection TEXT,                       -- "AI yordamidan qanday foydalandim?"
  difficulties TEXT,                              -- "Mustaqil tafakkurda qiyinchilik bormidi?"
  next_steps TEXT,                                -- "Ertaga nimaga e'tibor beraman?"
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS reflection_journals_user_idx ON reflection_journals(user_id, entry_date DESC);
CREATE INDEX IF NOT EXISTS reflection_journals_topic_idx ON reflection_journals(topic_id);

-- ============================================
-- 6) ai_declarations — topshirishdan oldin akademik halollik
-- ============================================
CREATE TABLE IF NOT EXISTS ai_declarations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  submission_id UUID REFERENCES submissions(id) ON DELETE CASCADE,
  task_id UUID,                                   -- topic_tasks.id yoki challenges.id (submission_id null bo'lsa ham ishlaydi)
  task_type TEXT CHECK (task_type IN ('topic_task','challenge','quiz')),
  used_ai TEXT NOT NULL CHECK (used_ai IN ('yes','no','partial')),
  ai_used_for TEXT[] DEFAULT '{}',                -- ["algorithm","syntax","debugging","other"]
  ai_used_for_other TEXT,
  could_solve_alone TEXT NOT NULL CHECK (could_solve_alone IN ('yes','no','partial')),
  honesty_pledge BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ai_declarations_user_idx ON ai_declarations(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS ai_declarations_submission_idx ON ai_declarations(submission_id);

-- ============================================
-- 7) hint_unlocks — har talaba qaysi hint darajasini ochganini hisoblash
--    (topic_tasks.hints JSONB shaklida saqlanadi: [{level:1..4, text, unlock_cost}])
-- ============================================
CREATE TABLE IF NOT EXISTS hint_unlocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  task_id UUID NOT NULL,
  task_type TEXT NOT NULL CHECK (task_type IN ('topic_task','challenge')),
  hint_level INT NOT NULL CHECK (hint_level BETWEEN 1 AND 4),
  reasoning TEXT,                                 -- talabaning "nima uchun bu yondashuv" javobi
  coins_spent INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, task_id, task_type, hint_level)
);

CREATE INDEX IF NOT EXISTS hint_unlocks_user_idx ON hint_unlocks(user_id, task_id);

-- ============================================
-- 8) plan_first_submissions — Plan-First flow bosqichlari
-- ============================================
CREATE TABLE IF NOT EXISTS plan_first_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  task_id UUID NOT NULL,
  task_type TEXT NOT NULL CHECK (task_type IN ('topic_task','challenge')),
  understanding TEXT,                             -- 1-bosqich: "Nimani topish kerak?"
  algorithm_words TEXT,                           -- 2-bosqich: yechimni so'z bilan
  pseudocode TEXT,                                -- 3-bosqich: pseudo-kod
  code_unlocked BOOLEAN DEFAULT false,            -- 4-bosqichga o'tish ruxsati
  ai_review_understanding TEXT,                   -- AI baholashi
  ai_review_algorithm TEXT,
  ai_review_pseudocode TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, task_id, task_type)
);

CREATE INDEX IF NOT EXISTS plan_first_user_idx ON plan_first_submissions(user_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE ai_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE code_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE reflection_journals ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_declarations ENABLE ROW LEVEL SECURITY;
ALTER TABLE hint_unlocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_first_submissions ENABLE ROW LEVEL SECURITY;

-- Helper: foydalanuvchi yoki teacher/admin
-- (mavjud sxemada xuddi shu pattern ishlatilgan)

-- ai_interactions
CREATE POLICY "ai_interactions_select_own" ON ai_interactions FOR SELECT USING (
  user_id = auth.uid()
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','teacher'))
);
CREATE POLICY "ai_interactions_insert_own" ON ai_interactions FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "ai_interactions_update_own" ON ai_interactions FOR UPDATE USING (user_id = auth.uid());

-- ai_usage_daily
CREATE POLICY "ai_usage_daily_select_own" ON ai_usage_daily FOR SELECT USING (
  user_id = auth.uid()
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','teacher'))
);
CREATE POLICY "ai_usage_daily_insert_own" ON ai_usage_daily FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "ai_usage_daily_update_own" ON ai_usage_daily FOR UPDATE USING (user_id = auth.uid());

-- code_snapshots
CREATE POLICY "code_snapshots_select_own" ON code_snapshots FOR SELECT USING (
  user_id = auth.uid()
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','teacher'))
);
CREATE POLICY "code_snapshots_insert_own" ON code_snapshots FOR INSERT WITH CHECK (user_id = auth.uid());

-- reflection_journals
CREATE POLICY "reflection_journals_select_own" ON reflection_journals FOR SELECT USING (
  user_id = auth.uid()
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','teacher'))
);
CREATE POLICY "reflection_journals_insert_own" ON reflection_journals FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "reflection_journals_update_own" ON reflection_journals FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "reflection_journals_delete_own" ON reflection_journals FOR DELETE USING (user_id = auth.uid());

-- ai_declarations
CREATE POLICY "ai_declarations_select_own" ON ai_declarations FOR SELECT USING (
  user_id = auth.uid()
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','teacher'))
);
CREATE POLICY "ai_declarations_insert_own" ON ai_declarations FOR INSERT WITH CHECK (user_id = auth.uid());

-- hint_unlocks
CREATE POLICY "hint_unlocks_select_own" ON hint_unlocks FOR SELECT USING (
  user_id = auth.uid()
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','teacher'))
);
CREATE POLICY "hint_unlocks_insert_own" ON hint_unlocks FOR INSERT WITH CHECK (user_id = auth.uid());

-- plan_first_submissions
CREATE POLICY "plan_first_select_own" ON plan_first_submissions FOR SELECT USING (
  user_id = auth.uid()
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','teacher'))
);
CREATE POLICY "plan_first_insert_own" ON plan_first_submissions FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "plan_first_update_own" ON plan_first_submissions FOR UPDATE USING (user_id = auth.uid());

-- ============================================
-- updated_at triggerlari
-- ============================================
CREATE TRIGGER ai_usage_daily_updated_at BEFORE UPDATE ON ai_usage_daily
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER plan_first_submissions_updated_at BEFORE UPDATE ON plan_first_submissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
