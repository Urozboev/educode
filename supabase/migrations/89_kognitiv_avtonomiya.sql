-- ============================================================
-- MirAcademy — Kognitiv avtonomiya: uch yangi mexanizm
--
-- Dissertatsiyaning (2.1) formulasi va 2.1.5-jadvali asosida:
--
--   I = Σ wₖ·nₖ / (Σ wₖ·nₖ + Yₘ) · 100        (haftalik, 0–100)
--
--   wₖ: reja izohi 0 · o'tgan yechimga izoh 0 · mentor savoli 0,25 ·
--       1-maslahat 0,25 · 2-maslahat 0,50 · 3-maslahat 0,75 · 4-maslahat 1,00
--   Yₘ: mustaqil qabul qilingan yechimlar — barcha testlardan o'tgan,
--       3/4-darajali maslahat ochilmagan, katta hajmli kod joylashtirish
--       (paste_ratio ≥ 40) qayd etilmagan.
--   Hodisalar 3 tadan kam bo'lsa — ko'rsatkich talqin qilinmaydi.
--
-- Jadvalda yo'q bitta holat: TESTDAN O'TMAGAN kodga SI izohi. U mentor
-- savoliga teng (0,25) olindi — ikkalasi ham sokratik yo'naltirish.
--
-- 1) MOSLASHUVCHAN KO'MAK (yordamni so'ndirish, "fading")
--    Ko'rsatkich zonasiga qarab SI yordami bosqichma-bosqich kamayadi:
--      0 To'liq ko'mak     I ≤ 30 yoki ma'lumot yetarli emas
--      1 Yo'naltiruvchi    31–60: 4-maslahat faqat o'z urinishidan keyin
--      2 Ishora            61–80: maslahat ≤ 2-daraja, SI izohi faqat urinishdan keyin
--      3 Mustaqil sinov    81–100: maslahat ≤ 1-daraja, SI izohi yopiq
--    Tiklanish: daraja belgilangandan keyin topshiriqni MUSTAQIL yechgan
--    talabaning darajasi darhol bittaga pasayadi (yopiq tsikl:
--    o'lchash → boshqarish → mustaqil ishlash → yordam qaytadi).
--    Har daraja o'zgarishi `ai_support_log` ga yoziladi (tajriba tahlili uchun).
--
-- 2) MULOQOTDA FIKRLASHNI TOPSHIRISHNI ANIQLASH (o'zbek tilida)
--    Talabaning har bir mentor savoliga kod beriladi (src/lib/ai/engagement.ts):
--      CO1 tayyor yechim so'rash   CO2 topshiriqni ko'chirib berish
--      CO3 xatoni tuzatib berish   CO4 passiv davom ettirish
--      AL1 tushuncha savoli        AL2 o'z gipotezasi
--      AL3 o'z yechimini tushuntirish  AL4 tekshirish va umumlashtirish
--    `engagement_codings` — ekspertning qo'lda kodlashi: avtomatik
--    tasnifchi bilan kelishuv (Koen kappasi) shu yerdan hisoblanadi.
--
-- 3) METAKOGNITIV KALIBRLASH
--    Talaba topshiriqdan oldin "SIsiz yecha olaman" ishonchini 1–4 da
--    belgilaydi (ehtimol 0,10 / 0,35 / 0,65 / 0,90). Natija — mustaqil
--    yechildimi (Yₘ ta'rifi bilan bir xil). Ko'rsatkichlar:
--      Brier = o'rtacha (p − natija)²   (0 — mukammal)
--      Siljish = o'rtacha p − o'rtacha natija  (> 0 — o'zini ortiqcha baholash)
--
-- Supabase SQL Editor da ishga tushiring. Qayta ishga tushirish xavfsiz.
-- ============================================================

-- ------------------------------------------------------------
-- 0. JADVALLAR
-- ------------------------------------------------------------
ALTER TABLE ai_interactions ADD COLUMN IF NOT EXISTS engagement_code TEXT;
ALTER TABLE ai_interactions ADD COLUMN IF NOT EXISTS engagement_kind TEXT;
ALTER TABLE ai_interactions ADD COLUMN IF NOT EXISTS classifier_version TEXT;
ALTER TABLE ai_interactions ADD COLUMN IF NOT EXISTS support_level SMALLINT;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ai_interactions_engagement_kind_check') THEN
    ALTER TABLE ai_interactions ADD CONSTRAINT ai_interactions_engagement_kind_check
      CHECK (engagement_kind IN ('CO', 'AL', 'N'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS ai_interactions_engagement_idx
  ON ai_interactions (user_id, created_at) WHERE engagement_kind IS NOT NULL;

-- Ekspert kodlashi (kappa uchun)
CREATE TABLE IF NOT EXISTS engagement_codings (
  interaction_id UUID NOT NULL REFERENCES ai_interactions(id) ON DELETE CASCADE,
  coder_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (interaction_id, coder_id)
);
ALTER TABLE engagement_codings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "engagement_codings_staff" ON engagement_codings;
CREATE POLICY "engagement_codings_staff" ON engagement_codings
  FOR ALL USING ((select public.is_staff())) WITH CHECK ((select public.is_staff()) AND coder_id = (select auth.uid()));

-- Kalibrlash bashoratlari
CREATE TABLE IF NOT EXISTS calibration_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  task_id UUID NOT NULL,
  task_type TEXT NOT NULL CHECK (task_type IN ('topic_task', 'challenge')),
  confidence SMALLINT NOT NULL CHECK (confidence BETWEEN 1 AND 4),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, task_id, task_type)
);
CREATE INDEX IF NOT EXISTS calibration_predictions_user_idx ON calibration_predictions (user_id, created_at DESC);
ALTER TABLE calibration_predictions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "calibration_select" ON calibration_predictions;
CREATE POLICY "calibration_select" ON calibration_predictions
  FOR SELECT USING (user_id = (select auth.uid()) OR (select public.is_staff()));
-- Bashorat faqat bir marta, topshiriqni yechishdan OLDIN beriladi
DROP POLICY IF EXISTS "calibration_insert_own" ON calibration_predictions;
CREATE POLICY "calibration_insert_own" ON calibration_predictions
  FOR INSERT WITH CHECK (
    user_id = (select auth.uid())
    AND NOT EXISTS (
      SELECT 1 FROM submissions s
       WHERE s.user_id = (select auth.uid()) AND s.task_id = calibration_predictions.task_id
         AND s.task_type = calibration_predictions.task_type AND s.status = 'accepted'
    )
  );

-- Ko'mak darajasi o'zgarishlari jurnali
CREATE TABLE IF NOT EXISTS ai_support_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  level SMALLINT NOT NULL,
  index_value INT,
  weighted NUMERIC(8,2),
  autonomous INT,
  events INT,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ai_support_log_user_idx ON ai_support_log (user_id, created_at DESC);
ALTER TABLE ai_support_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "ai_support_log_select" ON ai_support_log;
CREATE POLICY "ai_support_log_select" ON ai_support_log
  FOR SELECT USING (user_id = (select auth.uid()) OR (select public.is_staff()));

-- ------------------------------------------------------------
-- 1. BOG'LIQLIK KO'RSATKICHI — (2.1) formula
-- ------------------------------------------------------------
-- Mustaqil yechimlar: har topshiriq bir marta, birinchi qabul qilingan vaqti bilan
CREATE OR REPLACE FUNCTION public._autonomous_solutions(p_user UUID)
RETURNS TABLE (task_id UUID, task_type TEXT, solved_at TIMESTAMPTZ, independent BOOLEAN)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT s.task_id, s.task_type, min(s.created_at),
         -- 3/4-maslahat ochilmagan va qabul qilingan yechimlardan biri ko'chirilmagan
         NOT EXISTS (
           SELECT 1 FROM hint_unlocks h
            WHERE h.user_id = p_user AND h.task_id = s.task_id
              AND h.task_type = s.task_type AND h.hint_level >= 3
         ) AND min(coalesce(s.paste_ratio, 0)) < 40
    FROM submissions s
   WHERE s.user_id = p_user AND s.status = 'accepted'
     AND s.task_type IN ('topic_task', 'challenge')
     AND coalesce(s.language, '') <> 'report'
   GROUP BY s.task_id, s.task_type;
$$;

CREATE OR REPLACE FUNCTION public._dependence_index(p_user UUID, p_from TIMESTAMPTZ, p_to TIMESTAMPTZ)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_chat INT; v_fb INT; v_h1 INT; v_h2 INT; v_h3 INT; v_h4 INT; v_auto INT;
  v_w NUMERIC; v_events INT; v_index INT;
BEGIN
  SELECT count(*) FILTER (WHERE interaction_type IN ('chat', 'mentor')),
         -- O'tmagan kodga izoh — 0,25; o'tgan kodga izoh (xato yo'q) — 0
         count(*) FILTER (WHERE interaction_type = 'feedback' AND error_snapshot IS NOT NULL)
    INTO v_chat, v_fb
    FROM ai_interactions
   WHERE user_id = p_user AND created_at >= p_from AND created_at < p_to;

  SELECT count(*) FILTER (WHERE hint_level = 1), count(*) FILTER (WHERE hint_level = 2),
         count(*) FILTER (WHERE hint_level = 3), count(*) FILTER (WHERE hint_level = 4)
    INTO v_h1, v_h2, v_h3, v_h4
    FROM hint_unlocks
   WHERE user_id = p_user AND created_at >= p_from AND created_at < p_to;

  SELECT count(*) INTO v_auto
    FROM public._autonomous_solutions(p_user) a
   WHERE a.independent AND a.solved_at >= p_from AND a.solved_at < p_to;

  v_w := 0.25 * (v_chat + v_fb) + 0.25 * v_h1 + 0.5 * v_h2 + 0.75 * v_h3 + 1.0 * v_h4;
  v_events := v_chat + v_fb + v_h1 + v_h2 + v_h3 + v_h4 + v_auto;
  v_index := CASE WHEN v_w + v_auto > 0 THEN round(v_w * 100.0 / (v_w + v_auto))::int END;

  RETURN jsonb_build_object(
    'index', v_index,
    'weighted', v_w,
    'autonomous', v_auto,
    'events', v_events,
    'interpretable', v_events >= 3,
    'zone', CASE WHEN v_index IS NULL OR v_events < 3 THEN NULL
                 WHEN v_index <= 30 THEN 'healthy' WHEN v_index <= 60 THEN 'moderate'
                 WHEN v_index <= 80 THEN 'high' ELSE 'very_high' END,
    'parts', jsonb_build_object('mentor', v_chat, 'feedback_failed', v_fb,
                                'hint1', v_h1, 'hint2', v_h2, 'hint3', v_h3, 'hint4', v_h4)
  );
END;
$$;

-- ------------------------------------------------------------
-- 2. KO'MAK DARAJASI (hisoblash — jurnalsiz)
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public._ai_support_compute(p_user UUID)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_idx JSONB := public._dependence_index(p_user, now() - interval '7 days', now());
  v_i INT := (v_idx->>'index')::int;
  v_base INT;
  v_last ai_support_log;
  v_recovered INT := 0;
  v_level INT;
BEGIN
  v_base := CASE
    WHEN NOT (v_idx->>'interpretable')::boolean OR v_i IS NULL OR v_i <= 30 THEN 0
    WHEN v_i <= 60 THEN 1
    WHEN v_i <= 80 THEN 2
    ELSE 3 END;

  -- Tiklanish: oxirgi daraja belgilanganidan keyin mustaqil yechilgan topshiriqlar
  SELECT * INTO v_last FROM ai_support_log WHERE user_id = p_user ORDER BY created_at DESC LIMIT 1;
  IF v_last.id IS NOT NULL AND v_last.level > 0 THEN
    SELECT count(*) INTO v_recovered
      FROM public._autonomous_solutions(p_user) a
     WHERE a.independent AND a.solved_at > v_last.created_at;
  END IF;

  v_level := greatest(0, v_base - least(v_recovered, 1));

  RETURN v_idx || jsonb_build_object('level', v_level, 'base_level', v_base, 'recovered', v_recovered);
END;
$$;

-- Ochiq funksiya: holatni qaytaradi va daraja o'zgarsa jurnalga yozadi.
-- Talaba o'zinikini, o'qituvchi/admin istalgan talabanikini oladi.
CREATE OR REPLACE FUNCTION public.ai_support_state(p_user UUID DEFAULT NULL)
RETURNS JSONB
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID := coalesce(p_user, auth.uid());
  v_role TEXT;
  v_state JSONB;
  v_prev SMALLINT;
BEGIN
  IF v_user IS NULL THEN RETURN NULL; END IF;
  IF v_user <> auth.uid() AND NOT public.is_staff() THEN
    RAISE EXCEPTION 'Ruxsat yo''q';
  END IF;

  -- O'qituvchi va admin uchun ko'mak cheklanmaydi
  SELECT role INTO v_role FROM profiles WHERE id = v_user;
  IF v_role IN ('teacher', 'admin') THEN
    RETURN jsonb_build_object('level', 0, 'staff', true);
  END IF;

  v_state := public._ai_support_compute(v_user);

  SELECT level INTO v_prev FROM ai_support_log WHERE user_id = v_user ORDER BY created_at DESC LIMIT 1;
  IF v_prev IS DISTINCT FROM (v_state->>'level')::smallint
     AND NOT (v_prev IS NULL AND (v_state->>'level')::int = 0) THEN
    INSERT INTO ai_support_log (user_id, level, index_value, weighted, autonomous, events, reason)
    VALUES (v_user, (v_state->>'level')::smallint, (v_state->>'index')::int,
            (v_state->>'weighted')::numeric, (v_state->>'autonomous')::int, (v_state->>'events')::int,
            CASE WHEN (v_state->>'recovered')::int > 0 THEN 'recovery'
                 WHEN v_prev IS NULL OR (v_state->>'level')::int > v_prev THEN 'index_up'
                 ELSE 'index_down' END);
  END IF;

  RETURN v_state;
END;
$$;

GRANT EXECUTE ON FUNCTION public.ai_support_state(UUID) TO authenticated;

-- ------------------------------------------------------------
-- 3. MASLAHAT OCHISHNI DARAJAGA BO'YSUNDIRISH
-- Maslahat brauzerdan yoziladi — cheklov bazada bo'lishi shart.
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.enforce_hint_support_level()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_level INT;
  v_attempted BOOLEAN;
BEGIN
  IF EXISTS (SELECT 1 FROM profiles WHERE id = NEW.user_id AND role IN ('teacher', 'admin')) THEN
    RETURN NEW;
  END IF;

  v_level := (public._ai_support_compute(NEW.user_id)->>'level')::int;
  SELECT EXISTS (
    SELECT 1 FROM submissions s
     WHERE s.user_id = NEW.user_id AND s.task_id = NEW.task_id AND s.task_type = NEW.task_type
  ) INTO v_attempted;

  IF v_level = 3 AND NEW.hint_level > 1 THEN
    RAISE EXCEPTION 'AI_SUPPORT_LEVEL_3' USING HINT = 'Mustaqil sinov bosqichi: bitta topshiriqni maslahatsiz yeching — ko''mak qaytadi';
  ELSIF v_level = 2 AND NEW.hint_level > 2 THEN
    RAISE EXCEPTION 'AI_SUPPORT_LEVEL_2' USING HINT = 'Ishora bosqichi: hozir faqat 1–2-darajali maslahatlar ochiq';
  ELSIF v_level = 1 AND NEW.hint_level = 4 AND NOT v_attempted THEN
    RAISE EXCEPTION 'AI_SUPPORT_LEVEL_1' USING HINT = 'Kod parchasini ochishdan oldin o''z yechimingizni bir marta yuborib ko''ring';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS hint_unlocks_support_level ON hint_unlocks;
CREATE TRIGGER hint_unlocks_support_level
  BEFORE INSERT ON hint_unlocks
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_hint_support_level();

-- ------------------------------------------------------------
-- 4. KALIBRLASH
-- ------------------------------------------------------------
-- Har bashorat natijasi: 1 — mustaqil yechildi, 0 — yordam bilan yechildi
-- yoki urinib 24 soatda yechilmadi, NULL — hali noma'lum.
CREATE OR REPLACE FUNCTION public.calibration_items(p_user UUID)
RETURNS TABLE (task_id UUID, task_type TEXT, confidence SMALLINT, p NUMERIC, outcome INT, predicted_at TIMESTAMPTZ, resolved_at TIMESTAMPTZ)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT c.task_id, c.task_type, c.confidence,
         (ARRAY[0.10, 0.35, 0.65, 0.90])[c.confidence]::numeric,
         CASE WHEN a.solved_at IS NOT NULL THEN (CASE WHEN a.independent THEN 1 ELSE 0 END)
              WHEN la.last_try IS NOT NULL AND la.last_try < now() - interval '24 hours' THEN 0
         END,
         c.created_at,
         coalesce(a.solved_at, CASE WHEN la.last_try < now() - interval '24 hours' THEN la.last_try END)
    FROM calibration_predictions c
    LEFT JOIN public._autonomous_solutions(p_user) a ON a.task_id = c.task_id AND a.task_type = c.task_type
    LEFT JOIN LATERAL (
      SELECT max(s.created_at) AS last_try FROM submissions s
       WHERE s.user_id = p_user AND s.task_id = c.task_id AND s.task_type = c.task_type
    ) la ON true
   WHERE c.user_id = p_user
     AND (p_user = auth.uid() OR public.is_staff());
$$;

GRANT EXECUTE ON FUNCTION public.calibration_items(UUID) TO authenticated;

CREATE OR REPLACE FUNCTION public.calibration_summary(p_user UUID DEFAULT NULL)
RETURNS JSONB
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT jsonb_build_object(
    'predictions', count(*),
    'resolved', count(*) FILTER (WHERE outcome IS NOT NULL),
    'brier', round(avg((p - outcome) ^ 2) FILTER (WHERE outcome IS NOT NULL), 3),
    'bias', round((avg(p) FILTER (WHERE outcome IS NOT NULL) - avg(outcome) FILTER (WHERE outcome IS NOT NULL)), 3),
    'overconfident', count(*) FILTER (WHERE outcome = 0 AND confidence >= 3),
    'underconfident', count(*) FILTER (WHERE outcome = 1 AND confidence <= 2)
  )
  FROM public.calibration_items(coalesce(p_user, auth.uid()));
$$;

GRANT EXECUTE ON FUNCTION public.calibration_summary(UUID) TO authenticated;

-- ------------------------------------------------------------
-- 5. MULOQOT KO'RSATKICHLARI
-- Tiklanish: CO navbatidan keyingi 3 navbat ichida (30 daqiqalik sessiya)
-- AL navbati kelgani — ALLEF tadqiqotida natija bilan eng kuchli bog'langan ko'rsatkich.
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.engagement_summary(p_user UUID, p_from TIMESTAMPTZ DEFAULT now() - interval '30 days')
RETURNS JSONB
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH t AS (
    SELECT engagement_kind AS k, created_at,
           lead(engagement_kind, 1) OVER w AS k1, lead(engagement_kind, 2) OVER w AS k2, lead(engagement_kind, 3) OVER w AS k3,
           lead(created_at, 3) OVER w AS t3, lead(created_at, 1) OVER w AS t1
      FROM ai_interactions
     WHERE user_id = p_user AND engagement_kind IS NOT NULL AND created_at >= p_from
       AND (p_user = auth.uid() OR public.is_staff())
    WINDOW w AS (ORDER BY created_at)
  )
  SELECT jsonb_build_object(
    'turns', count(*),
    'co', count(*) FILTER (WHERE k = 'CO'),
    'al', count(*) FILTER (WHERE k = 'AL'),
    'co_share', round(100.0 * count(*) FILTER (WHERE k = 'CO') / nullif(count(*) FILTER (WHERE k IN ('CO', 'AL')), 0)),
    'recovery', round(100.0 * count(*) FILTER (WHERE k = 'CO' AND (
                  (k1 = 'AL' AND t1 < created_at + interval '30 minutes')
                  OR ((k2 = 'AL' OR k3 = 'AL') AND coalesce(t3, t1) < created_at + interval '30 minutes')))
                / nullif(count(*) FILTER (WHERE k = 'CO'), 0))
  )
  FROM t;
$$;

GRANT EXECUTE ON FUNCTION public.engagement_summary(UUID, TIMESTAMPTZ) TO authenticated;

-- ------------------------------------------------------------
-- 6. ADMIN/O'QITUVCHI HISOBOTI — talabalar kesimida
-- ------------------------------------------------------------
DROP FUNCTION IF EXISTS public.cognitive_overview(UUID);
CREATE OR REPLACE FUNCTION public.cognitive_overview(p_user UUID DEFAULT NULL)
RETURNS TABLE (
  user_id UUID,
  full_name TEXT,
  avatar_url TEXT,
  dep_index INT,
  dep_zone TEXT,
  dep_events INT,
  support_level INT,
  level_changes INT,
  turns INT,
  co_share INT,
  recovery INT,
  cal_resolved INT,
  cal_brier NUMERIC,
  cal_bias NUMERIC
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
  WITH st AS (
    SELECT pf.id, pf.full_name, pf.avatar_url,
           public._ai_support_compute(pf.id) AS s,
           public.engagement_summary(pf.id, now() - interval '30 days') AS e,
           public.calibration_summary(pf.id) AS c
      FROM profiles pf
     WHERE pf.role = 'student' AND (p_user IS NULL OR pf.id = p_user)
  )
  SELECT st.id, st.full_name, st.avatar_url,
         CASE WHEN (st.s->>'interpretable')::boolean THEN (st.s->>'index')::int END,
         st.s->>'zone',
         (st.s->>'events')::int,
         (st.s->>'level')::int,
         (SELECT count(*)::int FROM ai_support_log l WHERE l.user_id = st.id),
         (st.e->>'turns')::int,
         (st.e->>'co_share')::int,
         (st.e->>'recovery')::int,
         (st.c->>'resolved')::int,
         (st.c->>'brier')::numeric,
         (st.c->>'bias')::numeric
    FROM st
   ORDER BY (st.s->>'level')::int DESC, (st.s->>'index')::int DESC NULLS LAST;
END;
$$;

GRANT EXECUTE ON FUNCTION public.cognitive_overview(UUID) TO authenticated;

-- Qo'lda kodlash uchun tasodifiy namuna (hali shu ekspert kodlamagan)
CREATE OR REPLACE FUNCTION public.engagement_coding_sample(p_limit INT DEFAULT 20)
RETURNS TABLE (id UUID, user_query TEXT, engagement_code TEXT, created_at TIMESTAMPTZ)
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_staff() THEN
    RAISE EXCEPTION 'Faqat admin yoki o''qituvchi';
  END IF;
  RETURN QUERY
  SELECT i.id, i.user_query, i.engagement_code, i.created_at
    FROM ai_interactions i
   WHERE i.engagement_code IS NOT NULL AND i.user_query IS NOT NULL
     AND NOT EXISTS (SELECT 1 FROM engagement_codings c WHERE c.interaction_id = i.id AND c.coder_id = auth.uid())
   ORDER BY random()
   LIMIT greatest(1, least(p_limit, 100));
END;
$$;

GRANT EXECUTE ON FUNCTION public.engagement_coding_sample(INT) TO authenticated;

-- Avtomatik va qo'lda kodlash juftliklari (kappa ilovada hisoblanadi)
CREATE OR REPLACE FUNCTION public.engagement_coding_pairs()
RETURNS TABLE (interaction_id UUID, auto_code TEXT, human_code TEXT, coder_id UUID)
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
  SELECT c.interaction_id, i.engagement_code, c.code, c.coder_id
    FROM engagement_codings c JOIN ai_interactions i ON i.id = c.interaction_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.engagement_coding_pairs() TO authenticated;

-- Ichki funksiyalarni to'g'ridan-to'g'ri chaqirib bo'lmasin
REVOKE EXECUTE ON FUNCTION public._autonomous_solutions(UUID) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public._dependence_index(UUID, TIMESTAMPTZ, TIMESTAMPTZ) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public._ai_support_compute(UUID) FROM PUBLIC, anon, authenticated;
