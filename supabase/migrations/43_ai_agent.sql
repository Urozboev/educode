-- ============================================
-- EduCode — AI Agent (mustaqil o'qituvchi agent)
--
-- Agent alohida mahsulot: o'zi reja tuzadi, o'zi dars o'tadi, o'zi
-- baholaydi, o'zi progressni kuzatadi. Ovozli muloqot qiladi.
--
-- MUHIM ARXITEKTURA QARORI: bu jadvallarning hech biri `courses`,
-- `topics`, `lessons` ga MAJBURIY foreign key qo'ymaydi. Sabab —
-- agent mavjud kurs strukturasiga bo'ysunsa, "o'zi reja tuzuvchi"
-- bo'la olmaydi: reja allaqachon admin panelda qattiq yozilgan
-- bo'lar edi. Bog'lanish faqat bir tomonlama va ixtiyoriy:
-- `suggested_course_id` (nullable) orqali agent kerak bo'lsa mavjud
-- kursga havola beradi, lekin usiz ham to'liq ishlaydi.
--
-- Shu tufayli agentni o'chirib qo'ysa platforma buzilmaydi.
--
-- Supabase SQL Editor da ishga tushiring. Qayta ishga tushirish xavfsiz.
-- ============================================


-- ============================================
-- 1. OBUNA — agent pullik
-- ============================================
-- Har foydalanuvchida bitta qator (UNIQUE). Plan o'zgarsa shu qator
-- yangilanadi, tarix esa `agent_subscription_events` da qoladi —
-- shunda "hozir kim to'lagan" so'rovi bitta indeksli o'qish bo'ladi.
CREATE TABLE IF NOT EXISTS agent_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free','pro','pro_plus')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','pending','expired','cancelled')),
  payment_provider TEXT CHECK (payment_provider IN ('payme','click','manual')),
  -- Bepul demo hisobi: paywall'gacha nechta xabar ishlatildi.
  -- Kunlik emas, umriy — demo bir marta beriladi.
  free_messages_used INT NOT NULL DEFAULT 0,
  started_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS agent_subscriptions_expiry_idx
  ON agent_subscriptions(status, expires_at);

-- To'lov tarixi. `coin_purchase_requests` dan alohida: u coin uchun,
-- bu obuna uchun. Ikkalasini bir jadvalga qo'shish hisobotni chalkashtiradi.
CREATE TABLE IF NOT EXISTS agent_subscription_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  plan TEXT NOT NULL,
  amount_uzs INT,
  months INT NOT NULL DEFAULT 1,
  payment_provider TEXT,
  provider_txn_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','paid','failed','refunded')),
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS agent_subscription_events_user_idx
  ON agent_subscription_events(user_id, created_at DESC);


-- ============================================
-- 2. SUHBAT VA XOTIRA
-- ============================================
CREATE TABLE IF NOT EXISTS agent_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  track_id UUID,  -- FK pastda, agent_tracks yaratilgach qo'shiladi
  title TEXT NOT NULL DEFAULT 'Yangi suhbat',
  lang TEXT NOT NULL DEFAULT 'uz',
  is_archived BOOLEAN NOT NULL DEFAULT false,
  last_message_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS agent_conversations_user_idx
  ON agent_conversations(user_id, last_message_at DESC);

CREATE TABLE IF NOT EXISTS agent_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES agent_conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user','assistant','system')),
  content TEXT NOT NULL,
  -- Ovoz keshiga havola. Bir xil javob qayta eshitilsa TTS'ga
  -- ikkinchi marta pul ketmaydi.
  audio_url TEXT,
  model TEXT,
  tokens_in INT,
  tokens_out INT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS agent_messages_conv_idx
  ON agent_messages(conversation_id, created_at);

-- Uzoq muddatli xotira. Suhbat tarixini butunlay promptga tiqish
-- qimmat va tez limitdan oshadi; shuning uchun agent muhim
-- faktlarni ("Python biladi", "ertalab o'qiydi", "sikllarda qiynaladi")
-- shu yerga qisqa qatorlar sifatida yozadi va har suhbat boshida
-- faqat shularni yuklaydi.
CREATE TABLE IF NOT EXISTS agent_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('fact','goal','preference','weakness','strength')),
  content TEXT NOT NULL,
  -- Kam ishlatilgan xotira vaqt o'tib pasayadi; promptga eng yuqori
  -- weight'lilari kiradi. Cheksiz o'sib ketmasligi uchun.
  weight REAL NOT NULL DEFAULT 1.0,
  source_message_id UUID REFERENCES agent_messages(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, kind, content)
);

CREATE INDEX IF NOT EXISTS agent_memory_user_idx
  ON agent_memory(user_id, weight DESC);


-- ============================================
-- 3. REJA (TRACK) VA MODULLAR
-- ============================================
CREATE TABLE IF NOT EXISTS agent_tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,                      -- "Frontend dasturchi"
  goal TEXT,                                -- foydalanuvchi o'z so'zi bilan
  start_level TEXT NOT NULL DEFAULT 'zero'
    CHECK (start_level IN ('zero','beginner','intermediate','advanced')),
  target_level TEXT NOT NULL DEFAULT 'advanced'
    CHECK (target_level IN ('beginner','intermediate','advanced')),
  weekly_hours INT DEFAULT 5,
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('draft','active','paused','completed')),
  lang TEXT NOT NULL DEFAULT 'uz',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS agent_tracks_user_idx
  ON agent_tracks(user_id, status);

-- Endi conversations.track_id ga FK qo'shamiz (jadval yaratilgandan keyin)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'agent_conversations_track_fk'
  ) THEN
    ALTER TABLE agent_conversations
      ADD CONSTRAINT agent_conversations_track_fk
      FOREIGN KEY (track_id) REFERENCES agent_tracks(id) ON DELETE SET NULL;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS agent_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id UUID NOT NULL REFERENCES agent_tracks(id) ON DELETE CASCADE,
  order_index INT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT,
  -- Dars kesh kaliti uchun barqaror identifikator: "python.loops.basic".
  -- Foydalanuvchidan mustaqil — shuning uchun bir foydalanuvchi uchun
  -- generatsiya qilingan dars boshqasiga ham yaraydi.
  topic_key TEXT NOT NULL,
  level TEXT NOT NULL DEFAULT 'beginner'
    CHECK (level IN ('zero','beginner','intermediate','advanced')),
  estimated_minutes INT DEFAULT 30,
  status TEXT NOT NULL DEFAULT 'locked'
    CHECK (status IN ('locked','active','done','skipped')),
  -- Agar mavzu platformadagi mavjud kursga to'g'ri kelsa — havola.
  -- Ixtiyoriy, agentning ishlashiga ta'sir qilmaydi.
  suggested_course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (track_id, order_index)
);

CREATE INDEX IF NOT EXISTS agent_modules_track_idx
  ON agent_modules(track_id, order_index);


-- ============================================
-- 4. DARS KESHI — xarajatning asosiy tejalish nuqtasi
-- ============================================
-- Dars kontenti foydalanuvchiga bog'lanmaydi: bir xil
-- (topic_key + level + lang) uchun bir marta generatsiya qilinadi va
-- hamma foydalanuvchiga xizmat qiladi. Bu LLM xarajatining katta
-- qismini olib tashlaydi — 1000 talaba uchun 1000 marta emas,
-- 1 marta to'laymiz.
CREATE TABLE IF NOT EXISTS agent_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cache_key TEXT NOT NULL UNIQUE,           -- topic_key|level|lang|prompt_version
  topic_key TEXT NOT NULL,
  level TEXT NOT NULL,
  lang TEXT NOT NULL DEFAULT 'uz',
  title TEXT NOT NULL,
  content_html TEXT NOT NULL,
  -- Ovozli o'qish uchun alohida, sodda matn: HTML teg va kod bloklarisiz.
  -- TTS kod o'qiy olmaydi, o'qishga urinsa ma'nosiz chiqadi.
  narration TEXT,
  examples JSONB NOT NULL DEFAULT '[]'::jsonb,
  prompt_version TEXT NOT NULL DEFAULT 'agent_lesson_v1',
  model TEXT,
  -- Sifat nazorati: yomon dars haqida shikoyat kelsa keshdan chiqariladi
  is_active BOOLEAN NOT NULL DEFAULT true,
  hit_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS agent_lessons_topic_idx
  ON agent_lessons(topic_key, level, lang) WHERE is_active;

CREATE TABLE IF NOT EXISTS agent_lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES agent_lessons(id) ON DELETE CASCADE,
  module_id UUID REFERENCES agent_modules(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'started'
    CHECK (status IN ('started','read','assessed','done')),
  score SMALLINT CHECK (score BETWEEN 0 AND 100),
  seconds_spent INT NOT NULL DEFAULT 0,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, lesson_id)
);


-- ============================================
-- 5. BAHOLASH VA O'ZLASHTIRISH
-- ============================================
CREATE TABLE IF NOT EXISTS agent_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  module_id UUID REFERENCES agent_modules(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES agent_lessons(id) ON DELETE SET NULL,
  kind TEXT NOT NULL CHECK (kind IN ('placement','quiz','task','oral')),
  -- Savol/topshiriq matni. JSONB — quiz va kod topshirig'i tuzilmasi
  -- turlicha, ikkitasiga alohida jadval ochish ortiqcha.
  payload JSONB NOT NULL,
  answer JSONB,
  score SMALLINT CHECK (score BETWEEN 0 AND 100),
  feedback TEXT,
  graded_by TEXT CHECK (graded_by IN ('auto','llm','judge0')),
  created_at TIMESTAMPTZ DEFAULT now(),
  graded_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS agent_assessments_user_idx
  ON agent_assessments(user_id, created_at DESC);

-- Mavzu bo'yicha o'zlashtirish darajasi. Trackerning asosiy manbasi:
-- past ball → mavzuni takrorlash, yuqori ball → oldinga sakrash.
CREATE TABLE IF NOT EXISTS agent_mastery (
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  topic_key TEXT NOT NULL,
  score SMALLINT NOT NULL DEFAULT 0 CHECK (score BETWEEN 0 AND 100),
  attempts INT NOT NULL DEFAULT 0,
  -- Interval takrorlash uchun: bilim vaqt o'tishi bilan unutiladi,
  -- agent eski mavzuni qayta so'raydi.
  last_reviewed_at TIMESTAMPTZ DEFAULT now(),
  next_review_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, topic_key)
);

CREATE INDEX IF NOT EXISTS agent_mastery_review_idx
  ON agent_mastery(user_id, next_review_at);


-- ============================================
-- 6. OVOZ KESHI
-- ============================================
-- TTS belgilar bo'yicha pul oladi. Bir xil matn qayta eshitilganda
-- yana to'lamaslik uchun matn hash'i bo'yicha kesh.
CREATE TABLE IF NOT EXISTS agent_voice_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- sha256(text + lang + provider + voice)
  hash TEXT NOT NULL UNIQUE,
  lang TEXT NOT NULL DEFAULT 'uz',
  provider TEXT NOT NULL,
  voice TEXT,
  text_preview TEXT,          -- debug uchun birinchi 120 belgi
  char_count INT NOT NULL DEFAULT 0,
  audio_url TEXT NOT NULL,
  hit_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);


-- ============================================
-- 7. XARAJAT HISOBI
-- ============================================
-- Obuna narxi token xarajatini qoplayaptimi — buni faqat o'lchov
-- ko'rsatadi. Har chaqiruv shu yerga qo'shiladi.
CREATE TABLE IF NOT EXISTS agent_usage_daily (
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  messages INT NOT NULL DEFAULT 0,
  tokens_in INT NOT NULL DEFAULT 0,
  tokens_out INT NOT NULL DEFAULT 0,
  tts_chars INT NOT NULL DEFAULT 0,
  lessons_generated INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, date)
);


-- ============================================
-- 8. YORDAMCHI FUNKSIYALAR
-- ============================================

-- Obuna faolmi? RLS ichida ham, API ichida ham shu bitta manbadan
-- foydalaniladi — paywall ikki joyda ikki xil bo'lib qolmasin.
CREATE OR REPLACE FUNCTION agent_has_access(uid UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT s.status = 'active'
       AND s.plan <> 'free'
       AND (s.expires_at IS NULL OR s.expires_at > now())
     FROM agent_subscriptions s WHERE s.user_id = uid),
    false
  )
  -- O'qituvchi va admin uchun har doim ochiq: ular kontentni
  -- tekshirishlari kerak, buning uchun to'lash mantiqsiz.
  OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = uid AND p.role IN ('teacher','admin'));
$$;

-- Kunlik xarajat hisoblagichi (upsert)
CREATE OR REPLACE FUNCTION agent_track_usage(
  p_user_id UUID,
  p_messages INT DEFAULT 0,
  p_tokens_in INT DEFAULT 0,
  p_tokens_out INT DEFAULT 0,
  p_tts_chars INT DEFAULT 0,
  p_lessons INT DEFAULT 0
) RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO agent_usage_daily (user_id, date, messages, tokens_in, tokens_out, tts_chars, lessons_generated)
  VALUES (p_user_id, CURRENT_DATE, p_messages, p_tokens_in, p_tokens_out, p_tts_chars, p_lessons)
  ON CONFLICT (user_id, date) DO UPDATE SET
    messages          = agent_usage_daily.messages + EXCLUDED.messages,
    tokens_in         = agent_usage_daily.tokens_in + EXCLUDED.tokens_in,
    tokens_out        = agent_usage_daily.tokens_out + EXCLUDED.tokens_out,
    tts_chars         = agent_usage_daily.tts_chars + EXCLUDED.tts_chars,
    lessons_generated = agent_usage_daily.lessons_generated + EXCLUDED.lessons_generated,
    updated_at        = now();
END $$;

-- Baholash natijasi kelganda o'zlashtirishni yangilaydi.
-- Yangi ball = eski va yangining o'rtachasi (og'irlik 0.4) — bitta
-- omadli javob mastery'ni 100 ga ko'tarib yubormasligi uchun.
CREATE OR REPLACE FUNCTION agent_update_mastery(
  p_user_id UUID,
  p_topic_key TEXT,
  p_score SMALLINT
) RETURNS SMALLINT
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_new SMALLINT;
BEGIN
  INSERT INTO agent_mastery (user_id, topic_key, score, attempts, last_reviewed_at, next_review_at)
  VALUES (p_user_id, p_topic_key, p_score, 1, now(), now() + INTERVAL '3 days')
  ON CONFLICT (user_id, topic_key) DO UPDATE SET
    score    = ROUND(agent_mastery.score * 0.6 + EXCLUDED.score * 0.4),
    attempts = agent_mastery.attempts + 1,
    last_reviewed_at = now(),
    -- Yaxshi o'zlashtirilgan mavzu kechroq takrorlanadi
    next_review_at = now() + (
      CASE WHEN EXCLUDED.score >= 80 THEN INTERVAL '14 days'
           WHEN EXCLUDED.score >= 60 THEN INTERVAL '7 days'
           ELSE INTERVAL '2 days' END
    ),
    updated_at = now()
  RETURNING score INTO v_new;

  RETURN v_new;
END $$;


-- ============================================
-- 9. RLS
-- ============================================
ALTER TABLE agent_subscriptions       ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_subscription_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_conversations       ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_messages            ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_memory              ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_tracks              ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_modules             ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_lessons             ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_lesson_progress     ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_assessments         ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_mastery             ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_voice_cache         ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_usage_daily         ENABLE ROW LEVEL SECURITY;

-- Obunani foydalanuvchi faqat O'QIY oladi. Yozish — service role
-- (to'lov callback'i) orqali. Aks holda odam o'ziga 'pro' yozib qo'yardi.
DROP POLICY IF EXISTS "agent_subs_read_own" ON agent_subscriptions;
CREATE POLICY "agent_subs_read_own" ON agent_subscriptions FOR SELECT USING (
  user_id = auth.uid()
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS "agent_sub_events_read_own" ON agent_subscription_events;
CREATE POLICY "agent_sub_events_read_own" ON agent_subscription_events FOR SELECT USING (
  user_id = auth.uid()
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Suhbat, xabar, xotira, reja — egasiga to'liq
DROP POLICY IF EXISTS "agent_conversations_own" ON agent_conversations;
CREATE POLICY "agent_conversations_own" ON agent_conversations FOR ALL
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "agent_messages_own" ON agent_messages;
CREATE POLICY "agent_messages_own" ON agent_messages FOR ALL
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "agent_memory_own" ON agent_memory;
CREATE POLICY "agent_memory_own" ON agent_memory FOR ALL
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "agent_tracks_own" ON agent_tracks;
CREATE POLICY "agent_tracks_own" ON agent_tracks FOR ALL
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "agent_modules_own" ON agent_modules;
CREATE POLICY "agent_modules_own" ON agent_modules FOR ALL
  USING (EXISTS (SELECT 1 FROM agent_tracks t WHERE t.id = track_id AND t.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM agent_tracks t WHERE t.id = track_id AND t.user_id = auth.uid()));

DROP POLICY IF EXISTS "agent_lesson_progress_own" ON agent_lesson_progress;
CREATE POLICY "agent_lesson_progress_own" ON agent_lesson_progress FOR ALL
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "agent_assessments_own" ON agent_assessments;
CREATE POLICY "agent_assessments_own" ON agent_assessments FOR ALL
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "agent_mastery_own" ON agent_mastery;
CREATE POLICY "agent_mastery_own" ON agent_mastery FOR ALL
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "agent_usage_read_own" ON agent_usage_daily;
CREATE POLICY "agent_usage_read_own" ON agent_usage_daily FOR SELECT USING (
  user_id = auth.uid()
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Dars keshi va ovoz keshi umumiy resurs: obunachi o'qiydi,
-- yozish faqat server (service role) orqali — foydalanuvchi keshga
-- o'z matnini tiqib qo'ya olmasin.
DROP POLICY IF EXISTS "agent_lessons_read" ON agent_lessons;
CREATE POLICY "agent_lessons_read" ON agent_lessons FOR SELECT
  USING (is_active AND agent_has_access(auth.uid()));

DROP POLICY IF EXISTS "agent_voice_cache_read" ON agent_voice_cache;
CREATE POLICY "agent_voice_cache_read" ON agent_voice_cache FOR SELECT
  USING (auth.uid() IS NOT NULL);


-- ============================================
-- 10. TRIGGERLAR
-- ============================================
DROP TRIGGER IF EXISTS agent_subscriptions_updated_at ON agent_subscriptions;
CREATE TRIGGER agent_subscriptions_updated_at BEFORE UPDATE ON agent_subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS agent_conversations_updated_at ON agent_conversations;
CREATE TRIGGER agent_conversations_updated_at BEFORE UPDATE ON agent_conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS agent_tracks_updated_at ON agent_tracks;
CREATE TRIGGER agent_tracks_updated_at BEFORE UPDATE ON agent_tracks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS agent_modules_updated_at ON agent_modules;
CREATE TRIGGER agent_modules_updated_at BEFORE UPDATE ON agent_modules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS agent_lesson_progress_updated_at ON agent_lesson_progress;
CREATE TRIGGER agent_lesson_progress_updated_at BEFORE UPDATE ON agent_lesson_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Yangi xabar kelganda suhbat ro'yxati to'g'ri tartiblansin
CREATE OR REPLACE FUNCTION agent_touch_conversation()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  UPDATE agent_conversations
     SET last_message_at = now(), updated_at = now()
   WHERE id = NEW.conversation_id;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS agent_messages_touch ON agent_messages;
CREATE TRIGGER agent_messages_touch AFTER INSERT ON agent_messages
  FOR EACH ROW EXECUTE FUNCTION agent_touch_conversation();


-- ============================================
-- 11. STORAGE — ovoz fayllari
-- ============================================
-- TTS natijasi shu bucket'ga yoziladi. Public: audio elementi
-- imzolangan URL bilan ishlashi mumkin, lekin har eshitishda yangi
-- URL so'rash brauzer keshini buzadi va tejash yo'qoladi.
INSERT INTO storage.buckets (id, name, public)
VALUES ('agent-audio', 'agent-audio', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "agent_audio_read" ON storage.objects;
CREATE POLICY "agent_audio_read" ON storage.objects FOR SELECT
  USING (bucket_id = 'agent-audio');
