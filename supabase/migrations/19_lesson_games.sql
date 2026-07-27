-- ============================================
-- EduCode — Dars o'yinlari (Kahoot / Jeopardy / Wordwall muqobili)
--
-- Mavjud /games bo'limidagi arkada o'yinlardan farqi: bu yerda kontentni
-- o'qituvchi o'zi kiritadi va dars mavzusiga bog'laydi. Uchta tur:
--   quiz_race   — tezlik viktorinasi (Kahoot uslubi)
--   jeopardy    — kategoriya × ball taxtasi
--   match_pairs — juftliklarni moslashtirish (Wordwall uslubi)
--
-- Kontent `content` JSONB ustunida saqlanadi, chunki har tur uchun
-- alohida jadval yaratish CRUD va o'qishni uch barobar murakkablashtiradi.
--
-- Supabase SQL Editor da ishga tushiring.
-- ============================================

CREATE TABLE IF NOT EXISTS lesson_games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,

  type TEXT NOT NULL CHECK (type IN ('quiz_race','jeopardy','match_pairs')),

  /**
   * Tur bo'yicha shakl:
   *  quiz_race:   { questions: [{ text, seconds, options: [{ text, correct }] }] }
   *  jeopardy:    { categories: [{ name, cells: [{ value, question, answer }] }] }
   *  match_pairs: { pairs: [{ left, right }] }
   */
  content JSONB NOT NULL DEFAULT '{}',

  category TEXT NOT NULL DEFAULT 'programming',
  difficulty TEXT DEFAULT 'beginner' CHECK (difficulty IN ('beginner','intermediate','advanced')),

  -- Dars mavzusiga bog'lash (ixtiyoriy)
  course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  topic_id UUID REFERENCES topics(id) ON DELETE SET NULL,

  coin_reward INT DEFAULT 5,
  xp_reward INT DEFAULT 15,
  plays INT NOT NULL DEFAULT 0,
  order_index INT DEFAULT 0,

  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS lesson_games_published_idx ON lesson_games(is_published, order_index, created_at DESC);
CREATE INDEX IF NOT EXISTS lesson_games_type_idx ON lesson_games(type);
CREATE INDEX IF NOT EXISTS lesson_games_topic_idx ON lesson_games(topic_id);
CREATE INDEX IF NOT EXISTS lesson_games_author_idx ON lesson_games(author_id);

ALTER TABLE lesson_games ENABLE ROW LEVEL SECURITY;

-- Nashr qilinganini hamma ko'radi (login shart emas — o'qituvchi darsda proyektorda ochadi).
-- Muallif va admin o'z qoralamalarini ham ko'radi.
DROP POLICY IF EXISTS "lesson_games_read" ON lesson_games;
CREATE POLICY "lesson_games_read" ON lesson_games FOR SELECT USING (
  is_published = true
  OR author_id = auth.uid()
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- O'qituvchi va admin yarata oladi; muallif sifatida faqat o'zini yozadi
DROP POLICY IF EXISTS "lesson_games_insert" ON lesson_games;
CREATE POLICY "lesson_games_insert" ON lesson_games FOR INSERT WITH CHECK (
  author_id = auth.uid()
  AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('teacher','admin'))
);

-- Muallif o'zinikini, admin hammasini tahrirlaydi
DROP POLICY IF EXISTS "lesson_games_update" ON lesson_games;
CREATE POLICY "lesson_games_update" ON lesson_games FOR UPDATE USING (
  author_id = auth.uid()
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS "lesson_games_delete" ON lesson_games;
CREATE POLICY "lesson_games_delete" ON lesson_games FOR DELETE USING (
  author_id = auth.uid()
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

DROP TRIGGER IF EXISTS lesson_games_updated_at ON lesson_games;
CREATE TRIGGER lesson_games_updated_at BEFORE UPDATE ON lesson_games
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- NATIJALAR
-- ============================================
CREATE TABLE IF NOT EXISTS game_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID NOT NULL REFERENCES lesson_games(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  score INT NOT NULL DEFAULT 0,
  max_score INT NOT NULL DEFAULT 0,
  correct_count INT NOT NULL DEFAULT 0,
  total_count INT NOT NULL DEFAULT 0,
  duration_seconds INT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS game_results_game_idx ON game_results(game_id, score DESC);
CREATE INDEX IF NOT EXISTS game_results_user_idx ON game_results(user_id, created_at DESC);

ALTER TABLE game_results ENABLE ROW LEVEL SECURITY;

-- O'quvchi o'z natijasini; o'qituvchi o'z o'yini natijalarini; admin hammasini
DROP POLICY IF EXISTS "game_results_read" ON game_results;
CREATE POLICY "game_results_read" ON game_results FOR SELECT USING (
  user_id = auth.uid()
  OR EXISTS (SELECT 1 FROM lesson_games g WHERE g.id = game_id AND g.author_id = auth.uid())
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS "game_results_insert_own" ON game_results;
CREATE POLICY "game_results_insert_own" ON game_results FOR INSERT WITH CHECK (
  user_id = auth.uid()
);

-- ============================================
-- O'YIN YAKUNI: natija + coin/XP (atomik)
-- ============================================
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
BEGIN
  IF v_user IS NULL THEN
    RAISE EXCEPTION 'Avtorizatsiya talab qilinadi';
  END IF;

  SELECT * INTO v_game FROM lesson_games WHERE id = p_game_id AND is_published = true;
  IF v_game.id IS NULL THEN
    RAISE EXCEPTION 'O''yin topilmadi';
  END IF;

  -- Mukofot faqat birinchi o'ynaganda beriladi (qayta o'ynash cheklanmaydi)
  SELECT EXISTS (SELECT 1 FROM game_results WHERE game_id = p_game_id AND user_id = v_user)
    INTO v_already;

  INSERT INTO game_results (game_id, user_id, score, max_score, correct_count, total_count, duration_seconds)
  VALUES (p_game_id, v_user, p_score, p_max_score, p_correct, p_total, p_duration);

  UPDATE lesson_games SET plays = plays + 1 WHERE id = p_game_id;

  -- Yarmidan ko'p to'g'ri javob bo'lsagina mukofot
  IF NOT v_already AND p_total > 0 AND p_correct * 2 >= p_total THEN
    v_coins := COALESCE(v_game.coin_reward, 0);
    v_xp := COALESCE(v_game.xp_reward, 0);

    UPDATE profiles
       SET coins = coins + v_coins,
           xp = xp + v_xp
     WHERE id = v_user
    RETURNING coins INTO v_balance;

    IF v_coins > 0 THEN
      INSERT INTO coin_transactions (user_id, amount, type, reference_id, description, balance_after)
      VALUES (v_user, v_coins, 'quiz_bonus', p_game_id,
              format('"%s" o''yini yakunlandi', v_game.title), v_balance);
    END IF;
  END IF;

  RETURN jsonb_build_object('coins', v_coins, 'xp', v_xp, 'rewarded', (v_coins > 0 OR v_xp > 0));
END;
$$;
