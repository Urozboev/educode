-- ============================================
-- EduCode — O'qituvchi sinfi va jonli o'yin sessiyalari
--
-- Uch qism:
--   1) Dars o'yinlari barcha o'qituvchilarga ko'rinadi (avval faqat
--      nashr qilingani yoki o'ziniki ko'rinardi)
--   2) Guruh kodi — o'quvchi kod kiritib o'qituvchi guruhiga qo'shiladi
--   3) Jonli sessiya (Kahoot rejimi) — PIN, ishtirokchilar, javoblar
--
-- Supabase SQL Editor da ishga tushiring.
-- ============================================

-- ============================================
-- 1) O'YINLAR BARCHA O'QITUVCHILARGA KO'RINSIN
-- ============================================
DROP POLICY IF EXISTS "lesson_games_read" ON lesson_games;
CREATE POLICY "lesson_games_read" ON lesson_games FOR SELECT USING (
  is_published = true
  OR author_id = auth.uid()
  -- O'qituvchilar bir-birining ishini ko'radi va qayta ishlatadi
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('teacher','admin'))
);

/**
 * O'yin yakuni: sabab qo'shildi.
 *
 * Avval funksiya faqat {coins, xp, rewarded} qaytarardi. Mukofot berilmasa
 * o'quvchi nima uchun ekanini bilmasdi — ekranda hech narsa chiqmasdi va
 * bu "natija saqlanmayapti" degan taassurot qoldirardi. Endi sabab ham
 * qaytariladi va interfeys uni ko'rsatadi.
 */
CREATE OR REPLACE FUNCTION public.finish_lesson_game(
  p_game_id UUID,
  p_score INT,
  p_max_score INT,
  p_correct INT,
  p_total INT,
  p_duration INT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID := auth.uid();
  v_game RECORD;
  v_already BOOLEAN;
  v_coins INT := 0;
  v_xp INT := 0;
  v_balance INT;
  v_reason TEXT;
BEGIN
  IF v_user IS NULL THEN
    RAISE EXCEPTION 'Avtorizatsiya talab qilinadi';
  END IF;

  -- Muallif o'z qoralamasini sinab ko'ra olsin
  SELECT * INTO v_game FROM lesson_games
   WHERE id = p_game_id
     AND (is_published = true OR author_id = v_user);
  IF v_game.id IS NULL THEN
    RAISE EXCEPTION 'O''yin topilmadi';
  END IF;

  SELECT EXISTS (SELECT 1 FROM game_results WHERE game_id = p_game_id AND user_id = v_user)
    INTO v_already;

  INSERT INTO game_results (game_id, user_id, score, max_score, correct_count, total_count, duration_seconds)
  VALUES (p_game_id, v_user, p_score, p_max_score, p_correct, p_total, p_duration);

  UPDATE lesson_games SET plays = plays + 1 WHERE id = p_game_id;

  IF v_already THEN
    v_reason := 'already_played';
  ELSIF p_total > 0 AND p_correct * 2 < p_total THEN
    v_reason := 'low_score';
  ELSIF v_game.is_published = false THEN
    v_reason := 'draft';
  ELSE
    v_reason := 'ok';
    v_coins := COALESCE(v_game.coin_reward, 0);
    v_xp := COALESCE(v_game.xp_reward, 0);

    UPDATE profiles
       SET coins = coins + v_coins, xp = xp + v_xp
     WHERE id = v_user
    RETURNING coins INTO v_balance;

    IF v_coins > 0 THEN
      INSERT INTO coin_transactions (user_id, amount, type, reference_id, description, balance_after)
      VALUES (v_user, v_coins, 'quiz_bonus', p_game_id,
              format('"%s" o''yini yakunlandi', v_game.title), v_balance);
    END IF;
  END IF;

  RETURN jsonb_build_object(
    'coins', v_coins,
    'xp', v_xp,
    'rewarded', (v_coins > 0 OR v_xp > 0),
    'reason', v_reason,
    'saved', true
  );
END;
$$;

-- ============================================
-- 2) GURUH KODI
-- ============================================
ALTER TABLE teacher_groups ADD COLUMN IF NOT EXISTS join_code TEXT;
ALTER TABLE teacher_groups ADD COLUMN IF NOT EXISTS is_open BOOLEAN DEFAULT true;

-- Kod takrorlanmasin
CREATE UNIQUE INDEX IF NOT EXISTS teacher_groups_join_code_idx
  ON teacher_groups(join_code) WHERE join_code IS NOT NULL;

/** Chalkashtirmaydigan alifbo: 0/O va 1/I/L olib tashlangan */
CREATE OR REPLACE FUNCTION public.generate_join_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  v_chars TEXT := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  v_code TEXT;
  v_try INT := 0;
BEGIN
  LOOP
    v_code := '';
    FOR i IN 1..6 LOOP
      v_code := v_code || substr(v_chars, floor(random() * length(v_chars) + 1)::int, 1);
    END LOOP;
    EXIT WHEN NOT EXISTS (SELECT 1 FROM teacher_groups WHERE join_code = v_code);
    v_try := v_try + 1;
    IF v_try > 50 THEN RAISE EXCEPTION 'Kod yaratib bo''lmadi'; END IF;
  END LOOP;
  RETURN v_code;
END;
$$;

-- Yangi guruhga kod avtomatik beriladi
CREATE OR REPLACE FUNCTION public.set_group_join_code()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.join_code IS NULL THEN
    NEW.join_code := public.generate_join_code();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS teacher_groups_join_code ON teacher_groups;
CREATE TRIGGER teacher_groups_join_code
  BEFORE INSERT ON teacher_groups
  FOR EACH ROW EXECUTE FUNCTION public.set_group_join_code();

-- Mavjud guruhlarga kod berish
UPDATE teacher_groups SET join_code = public.generate_join_code() WHERE join_code IS NULL;

/**
 * O'quvchi kod orqali guruhga qo'shiladi.
 * SECURITY DEFINER — o'quvchi teacher_groups jadvalini o'qiy olmaydi,
 * faqat kod to'g'ri bo'lsa qo'shiladi.
 */
CREATE OR REPLACE FUNCTION public.join_group_by_code(p_code TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID := auth.uid();
  v_group RECORD;
BEGIN
  IF v_user IS NULL THEN
    RAISE EXCEPTION 'Avtorizatsiya talab qilinadi';
  END IF;

  SELECT * INTO v_group
    FROM teacher_groups
   WHERE join_code = upper(trim(p_code))
     AND COALESCE(is_open, true) = true;

  IF v_group.id IS NULL THEN
    RAISE EXCEPTION 'Bunday kod topilmadi yoki guruh yopiq';
  END IF;

  IF v_group.teacher_id = v_user THEN
    RAISE EXCEPTION 'O''z guruhingizga qo''shila olmaysiz';
  END IF;

  INSERT INTO teacher_students (teacher_id, student_id, group_id)
  VALUES (v_group.teacher_id, v_user, v_group.id)
  ON CONFLICT (teacher_id, student_id)
  DO UPDATE SET group_id = EXCLUDED.group_id;

  RETURN jsonb_build_object(
    'group_id', v_group.id,
    'group_name', v_group.name,
    'teacher_name', (SELECT full_name FROM profiles WHERE id = v_group.teacher_id)
  );
END;
$$;

-- O'quvchi o'zi qaysi guruhlarda ekanini ko'rsin
DROP POLICY IF EXISTS "teacher_students_student_read" ON teacher_students;
CREATE POLICY "teacher_students_student_read" ON teacher_students FOR SELECT USING (
  student_id = auth.uid() OR teacher_id = auth.uid()
);

-- ============================================
-- 3) JONLI SESSIYA (Kahoot rejimi)
-- ============================================
CREATE TABLE IF NOT EXISTS game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID NOT NULL REFERENCES lesson_games(id) ON DELETE CASCADE,
  host_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  -- Ekranga chiqariladigan 6 xonali PIN
  pin TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'lobby' CHECK (status IN ('lobby','running','ended')),
  -- Hozir ko'rsatilayotgan savol (0 dan)
  current_index INT NOT NULL DEFAULT 0,
  -- Savol qachon ochilgani — ball tezlikka qarab hisoblanadi
  question_started_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  ended_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS game_sessions_pin_idx ON game_sessions(pin) WHERE status <> 'ended';

ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;

-- Sessiyani hamma ko'radi (PIN bilan qo'shilish uchun kerak)
DROP POLICY IF EXISTS "game_sessions_read" ON game_sessions;
CREATE POLICY "game_sessions_read" ON game_sessions FOR SELECT USING (true);

DROP POLICY IF EXISTS "game_sessions_host_write" ON game_sessions;
CREATE POLICY "game_sessions_host_write" ON game_sessions FOR ALL USING (
  host_id = auth.uid()
) WITH CHECK (
  host_id = auth.uid()
);

CREATE TABLE IF NOT EXISTS game_session_players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
  -- Ro'yxatdan o'tmagan o'quvchi ham qo'shila oladi — darsda hammaning
  -- akkaunti bo'lmasligi mumkin
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  nickname TEXT NOT NULL,
  score INT NOT NULL DEFAULT 0,
  correct_count INT NOT NULL DEFAULT 0,
  joined_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(session_id, nickname)
);

CREATE INDEX IF NOT EXISTS game_session_players_session_idx
  ON game_session_players(session_id, score DESC);

ALTER TABLE game_session_players ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "session_players_read" ON game_session_players;
CREATE POLICY "session_players_read" ON game_session_players FOR SELECT USING (true);

-- Qo'shilish RPC orqali (quyida), to'g'ridan-to'g'ri yozishga ruxsat yo'q
DROP POLICY IF EXISTS "session_players_host_manage" ON game_session_players;
CREATE POLICY "session_players_host_manage" ON game_session_players FOR ALL USING (
  EXISTS (SELECT 1 FROM game_sessions s WHERE s.id = session_id AND s.host_id = auth.uid())
);

CREATE TABLE IF NOT EXISTS game_session_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES game_session_players(id) ON DELETE CASCADE,
  question_index INT NOT NULL,
  option_index INT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  points INT NOT NULL DEFAULT 0,
  answered_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(player_id, question_index)
);

ALTER TABLE game_session_answers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "session_answers_read" ON game_session_answers;
CREATE POLICY "session_answers_read" ON game_session_answers FOR SELECT USING (true);

-- ============================================
-- SESSIYA RPC'LARI
-- ============================================

/** O'qituvchi sessiya ochadi va PIN oladi */
CREATE OR REPLACE FUNCTION public.create_game_session(p_game_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID := auth.uid();
  v_pin TEXT;
  v_try INT := 0;
  v_id UUID;
BEGIN
  IF v_user IS NULL THEN
    RAISE EXCEPTION 'Avtorizatsiya talab qilinadi';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = v_user AND role IN ('teacher','admin')) THEN
    RAISE EXCEPTION 'Faqat o''qituvchi sessiya ocha oladi';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM lesson_games WHERE id = p_game_id) THEN
    RAISE EXCEPTION 'O''yin topilmadi';
  END IF;

  LOOP
    v_pin := lpad(floor(random() * 1000000)::text, 6, '0');
    EXIT WHEN NOT EXISTS (
      SELECT 1 FROM game_sessions WHERE pin = v_pin AND status <> 'ended'
    );
    v_try := v_try + 1;
    IF v_try > 50 THEN RAISE EXCEPTION 'PIN yaratib bo''lmadi'; END IF;
  END LOOP;

  INSERT INTO game_sessions (game_id, host_id, pin)
  VALUES (p_game_id, v_user, v_pin)
  RETURNING id INTO v_id;

  RETURN jsonb_build_object('session_id', v_id, 'pin', v_pin);
END;
$$;

/** O'quvchi PIN bilan qo'shiladi — akkaunt shart emas */
CREATE OR REPLACE FUNCTION public.join_game_session(p_pin TEXT, p_nickname TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_session RECORD;
  v_name TEXT := trim(p_nickname);
  v_player UUID;
BEGIN
  IF length(v_name) < 2 THEN
    RAISE EXCEPTION 'Ism kamida 2 ta belgidan iborat bo''lsin';
  END IF;

  SELECT * INTO v_session
    FROM game_sessions
   WHERE pin = trim(p_pin) AND status = 'lobby';

  IF v_session.id IS NULL THEN
    RAISE EXCEPTION 'Bunday PIN topilmadi yoki o''yin allaqachon boshlangan';
  END IF;

  IF EXISTS (SELECT 1 FROM game_session_players
              WHERE session_id = v_session.id AND lower(nickname) = lower(v_name)) THEN
    RAISE EXCEPTION 'Bu ism band, boshqasini tanlang';
  END IF;

  INSERT INTO game_session_players (session_id, user_id, nickname)
  VALUES (v_session.id, auth.uid(), v_name)
  RETURNING id INTO v_player;

  RETURN jsonb_build_object(
    'session_id', v_session.id,
    'player_id', v_player,
    'nickname', v_name
  );
END;
$$;

/** Javob berish — ball tezlikka qarab hisoblanadi (server hisoblaydi) */
CREATE OR REPLACE FUNCTION public.answer_game_session(
  p_player_id UUID,
  p_question_index INT,
  p_option_index INT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_player RECORD;
  v_session RECORD;
  v_game RECORD;
  v_q JSONB;
  v_correct BOOLEAN;
  v_seconds INT;
  v_elapsed NUMERIC;
  v_points INT := 0;
BEGIN
  SELECT * INTO v_player FROM game_session_players WHERE id = p_player_id;
  IF v_player.id IS NULL THEN RAISE EXCEPTION 'Ishtirokchi topilmadi'; END IF;

  SELECT * INTO v_session FROM game_sessions WHERE id = v_player.session_id;
  IF v_session.status <> 'running' THEN RAISE EXCEPTION 'O''yin faol emas'; END IF;
  IF v_session.current_index <> p_question_index THEN
    RAISE EXCEPTION 'Bu savol allaqachon yopilgan';
  END IF;

  -- Bir savolga bir marta javob
  IF EXISTS (SELECT 1 FROM game_session_answers
              WHERE player_id = p_player_id AND question_index = p_question_index) THEN
    RAISE EXCEPTION 'Javob allaqachon berilgan';
  END IF;

  SELECT * INTO v_game FROM lesson_games WHERE id = v_session.game_id;
  v_q := v_game.content -> 'questions' -> p_question_index;
  IF v_q IS NULL THEN RAISE EXCEPTION 'Savol topilmadi'; END IF;

  v_correct := COALESCE((v_q -> 'options' -> p_option_index ->> 'correct')::boolean, false);
  v_seconds := COALESCE((v_q ->> 'seconds')::int, 20);
  v_elapsed := EXTRACT(EPOCH FROM (now() - COALESCE(v_session.question_started_at, now())));

  -- 500 asosiy + qolgan vaqtga mutanosib 500 gacha bonus
  IF v_correct THEN
    v_points := 500 + GREATEST(0, round(500 * (1 - LEAST(v_elapsed / NULLIF(v_seconds, 0), 1))))::int;
  END IF;

  INSERT INTO game_session_answers
    (session_id, player_id, question_index, option_index, is_correct, points)
  VALUES (v_session.id, p_player_id, p_question_index, p_option_index, v_correct, v_points);

  UPDATE game_session_players
     SET score = score + v_points,
         correct_count = correct_count + CASE WHEN v_correct THEN 1 ELSE 0 END
   WHERE id = p_player_id;

  RETURN jsonb_build_object('correct', v_correct, 'points', v_points);
END;
$$;

/** Reyting — sessiya davomida va oxirida */
CREATE OR REPLACE FUNCTION public.game_session_standings(p_session_id UUID)
RETURNS TABLE (rank BIGINT, nickname TEXT, score INT, correct_count INT)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT ROW_NUMBER() OVER (ORDER BY p.score DESC, p.joined_at),
         p.nickname, p.score, p.correct_count
    FROM game_session_players p
   WHERE p.session_id = p_session_id
   ORDER BY p.score DESC, p.joined_at;
$$;

-- Realtime uchun jadvallarni publication'ga qo'shamiz
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE game_sessions;
    ALTER PUBLICATION supabase_realtime ADD TABLE game_session_players;
  END IF;
EXCEPTION WHEN duplicate_object THEN
  NULL;
END $$;
