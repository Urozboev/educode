-- ============================================
-- EduCode — Ota-ona roli
-- (1) profiles.role ga 'parent' qo'shish
-- (2) parent_links: ota-ona <-> farzand bog'lanishi (many-to-many)
-- (3) parent_link_codes: farzand yaratadigan 24-soatlik random kod
-- (4) coin_purchase_requests: admin tasdiqlaydigan coin xarid so'rovlari
-- (5) coin_gifts: ota-onadan farzandga coin sovg'alari
-- (6) RPC'lar: kod orqali bog'lash, email orqali so'rov, tasdiqlash,
--     coin sovg'a qilish (atomic), xaridni tasdiqlash
-- (7) Farzand ma'lumotlarini ota-onaga ochadigan RLS yangilanishlari
-- Supabase SQL Editor da ishga tushiring.
-- ============================================

-- ============================================
-- 1) ROLE CONSTRAINT — 'parent' qo'shish
-- ============================================
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('student','teacher','admin','parent'));

-- Yangi foydalanuvchi trigger'i: role metadata'dan olinadi
-- (faqat student yoki parent — teacher/admin faqat admin tomonidan beriladi)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role TEXT;
BEGIN
  v_role := COALESCE(NEW.raw_user_meta_data->>'role', 'student');
  IF v_role NOT IN ('student', 'parent') THEN
    v_role := 'student';
  END IF;

  INSERT INTO public.profiles (id, full_name, avatar_url, role, coins)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1)
    ),
    NEW.raw_user_meta_data->>'avatar_url',
    v_role,
    CASE WHEN v_role = 'parent' THEN 0 ELSE 100 END
  );

  IF v_role <> 'parent' THEN
    INSERT INTO public.coin_transactions (user_id, amount, type, description, balance_after)
    VALUES (NEW.id, 100, 'registration_bonus', 'Registratsiya bonusi', 100);
  END IF;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE LOG 'handle_new_user xatolik: %', SQLERRM;
  RETURN NEW;
END;
$$;

-- ============================================
-- 2) PARENT LINKS
-- ============================================
CREATE TABLE IF NOT EXISTS parent_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  child_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('pending','confirmed','rejected')) DEFAULT 'pending',
  initiated_by TEXT NOT NULL CHECK (initiated_by IN ('parent','child_code')),
  created_at TIMESTAMPTZ DEFAULT now(),
  confirmed_at TIMESTAMPTZ,
  UNIQUE(parent_id, child_id)
);

CREATE INDEX IF NOT EXISTS parent_links_parent_idx ON parent_links(parent_id, status);
CREATE INDEX IF NOT EXISTS parent_links_child_idx ON parent_links(child_id, status);

-- Bir farzandga maksimum 2 ta tasdiqlangan ota-ona
CREATE OR REPLACE FUNCTION check_max_parents()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'confirmed' THEN
    IF (SELECT COUNT(*) FROM parent_links
        WHERE child_id = NEW.child_id AND status = 'confirmed' AND id <> NEW.id) >= 2 THEN
      RAISE EXCEPTION 'Bu farzandga allaqachon 2 ta ota-ona bog''langan';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS parent_links_max_check ON parent_links;
CREATE TRIGGER parent_links_max_check
  BEFORE INSERT OR UPDATE ON parent_links
  FOR EACH ROW EXECUTE FUNCTION check_max_parents();

-- ============================================
-- 3) PARENT LINK CODES (farzand yaratadi, 24 soat)
-- ============================================
CREATE TABLE IF NOT EXISTS parent_link_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code TEXT NOT NULL UNIQUE DEFAULT upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8)),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT now() + interval '24 hours',
  used_by UUID REFERENCES auth.users(id),
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS parent_link_codes_child_idx ON parent_link_codes(child_id);
CREATE INDEX IF NOT EXISTS parent_link_codes_code_idx ON parent_link_codes(code) WHERE used_at IS NULL;

-- ============================================
-- 4) COIN PURCHASE REQUESTS
-- ============================================
CREATE TABLE IF NOT EXISTS coin_purchase_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount_coins INT NOT NULL CHECK (amount_coins > 0),
  amount_uzs INT NOT NULL CHECK (amount_uzs >= 0),
  payment_note TEXT,                              -- ota-ona izohi (o'tkazma vaqti, ism)
  status TEXT NOT NULL CHECK (status IN ('pending','approved','rejected')) DEFAULT 'pending',
  reviewed_by UUID REFERENCES auth.users(id),
  review_note TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  reviewed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS coin_purchase_requests_parent_idx ON coin_purchase_requests(parent_id, created_at DESC);
CREATE INDEX IF NOT EXISTS coin_purchase_requests_status_idx ON coin_purchase_requests(status) WHERE status = 'pending';

-- ============================================
-- 5) COIN GIFTS
-- ============================================
CREATE TABLE IF NOT EXISTS coin_gifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  child_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INT NOT NULL CHECK (amount > 0),
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS coin_gifts_parent_idx ON coin_gifts(parent_id, created_at DESC);
CREATE INDEX IF NOT EXISTS coin_gifts_child_idx ON coin_gifts(child_id, created_at DESC);

-- Coin narxi (admin sozlaydi)
INSERT INTO platform_settings (key, value, description)
VALUES ('coin_price_uzs', '{"price_per_coin": 100, "packages": [{"coins": 100, "uzs": 10000}, {"coins": 500, "uzs": 45000}, {"coins": 1000, "uzs": 80000}], "card_number": "8600 0000 0000 0000", "card_owner": "EduCode Admin"}', 'Coin narxi va to''lov kartasi')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- 6) HELPER: ota-ona ekanligini tekshirish
-- ============================================
CREATE OR REPLACE FUNCTION is_parent_of(p_child UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM parent_links
    WHERE parent_id = auth.uid() AND child_id = p_child AND status = 'confirmed'
  );
$$;

-- ============================================
-- 7) RPC'LAR
-- ============================================

-- 7.1. Farzand emaili orqali bog'lanish so'rovi (ota-ona chaqiradi)
CREATE OR REPLACE FUNCTION create_parent_link_by_email(p_email TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_parent UUID := auth.uid();
  v_child UUID;
  v_child_role TEXT;
BEGIN
  IF v_parent IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Tizimga kiring');
  END IF;

  IF (SELECT role FROM profiles WHERE id = v_parent) <> 'parent' THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Faqat ota-ona hisoblari uchun');
  END IF;

  SELECT id INTO v_child FROM auth.users WHERE lower(email) = lower(trim(p_email));
  IF v_child IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Bu email bilan foydalanuvchi topilmadi');
  END IF;

  SELECT role INTO v_child_role FROM profiles WHERE id = v_child;
  IF v_child_role <> 'student' THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Bu hisob talaba emas');
  END IF;

  IF EXISTS (SELECT 1 FROM parent_links WHERE parent_id = v_parent AND child_id = v_child) THEN
    RETURN jsonb_build_object('ok', false, 'error', 'So''rov allaqachon yuborilgan');
  END IF;

  INSERT INTO parent_links (parent_id, child_id, status, initiated_by)
  VALUES (v_parent, v_child, 'pending', 'parent');

  RETURN jsonb_build_object('ok', true, 'message', 'So''rov yuborildi. Farzandingiz profilida tasdiqlashi kerak.');
END;
$$;

-- 7.2. Kod orqali bog'lanish (ota-ona chaqiradi; kodni farzand bergan — darhol tasdiqlanadi)
CREATE OR REPLACE FUNCTION redeem_parent_link_code(p_code TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_parent UUID := auth.uid();
  v_rec parent_link_codes;
BEGIN
  IF v_parent IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Tizimga kiring');
  END IF;

  IF (SELECT role FROM profiles WHERE id = v_parent) <> 'parent' THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Faqat ota-ona hisoblari uchun');
  END IF;

  SELECT * INTO v_rec FROM parent_link_codes
  WHERE code = upper(trim(p_code)) AND used_at IS NULL AND expires_at > now();

  IF v_rec.id IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Kod noto''g''ri yoki muddati o''tgan');
  END IF;

  IF v_rec.child_id = v_parent THEN
    RETURN jsonb_build_object('ok', false, 'error', 'O''zingizni bog''lay olmaysiz');
  END IF;

  IF EXISTS (SELECT 1 FROM parent_links WHERE parent_id = v_parent AND child_id = v_rec.child_id AND status = 'confirmed') THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Bu farzand allaqachon bog''langan');
  END IF;

  -- Kodni ishlatilgan deb belgilash
  UPDATE parent_link_codes SET used_by = v_parent, used_at = now() WHERE id = v_rec.id;

  -- Link yaratish/yangilash (kod farzand tomonidan berilgani uchun darhol confirmed)
  INSERT INTO parent_links (parent_id, child_id, status, initiated_by, confirmed_at)
  VALUES (v_parent, v_rec.child_id, 'confirmed', 'child_code', now())
  ON CONFLICT (parent_id, child_id)
  DO UPDATE SET status = 'confirmed', confirmed_at = now(), initiated_by = 'child_code';

  RETURN jsonb_build_object('ok', true, 'message', 'Farzand muvaffaqiyatli bog''landi!');
END;
$$;

-- 7.3. Pending so'rovga javob (farzand chaqiradi)
CREATE OR REPLACE FUNCTION respond_parent_link(p_link_id UUID, p_accept BOOLEAN)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_child UUID := auth.uid();
  v_link parent_links;
BEGIN
  SELECT * INTO v_link FROM parent_links WHERE id = p_link_id AND child_id = v_child AND status = 'pending';
  IF v_link.id IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'So''rov topilmadi');
  END IF;

  UPDATE parent_links
  SET status = CASE WHEN p_accept THEN 'confirmed' ELSE 'rejected' END,
      confirmed_at = CASE WHEN p_accept THEN now() ELSE NULL END
  WHERE id = p_link_id;

  RETURN jsonb_build_object('ok', true, 'message',
    CASE WHEN p_accept THEN 'Ota-ona bog''landi' ELSE 'So''rov rad etildi' END);
END;
$$;

-- 7.4. Coin sovg'a qilish (ota-ona chaqiradi, ATOMIC)
CREATE OR REPLACE FUNCTION gift_coins(p_child_id UUID, p_amount INT, p_message TEXT DEFAULT NULL)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_parent UUID := auth.uid();
  v_parent_coins INT;
  v_child_coins INT;
BEGIN
  IF p_amount IS NULL OR p_amount <= 0 THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Miqdor noto''g''ri');
  END IF;

  -- Bog'lanish tekshiruvi
  IF NOT EXISTS (
    SELECT 1 FROM parent_links
    WHERE parent_id = v_parent AND child_id = p_child_id AND status = 'confirmed'
  ) THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Bu farzand siz bilan bog''lanmagan');
  END IF;

  -- Parent balansini qulflash va tekshirish
  SELECT coins INTO v_parent_coins FROM profiles WHERE id = v_parent FOR UPDATE;
  IF v_parent_coins < p_amount THEN
    RETURN jsonb_build_object('ok', false, 'error',
      format('Yetarli coin yo''q. Sizda: %s, kerak: %s', v_parent_coins, p_amount));
  END IF;

  -- Transfer
  UPDATE profiles SET coins = coins - p_amount WHERE id = v_parent;
  UPDATE profiles SET coins = coins + p_amount WHERE id = p_child_id
    RETURNING coins INTO v_child_coins;

  -- Tranzaksiya yozuvlari
  INSERT INTO coin_transactions (user_id, amount, type, reference_id, description, balance_after)
  VALUES
    (v_parent, -p_amount, 'gift_sent', p_child_id, 'Farzandga sovg''a', v_parent_coins - p_amount),
    (p_child_id, p_amount, 'gift_received', v_parent, 'Ota-onadan sovg''a', v_child_coins);

  INSERT INTO coin_gifts (parent_id, child_id, amount, message)
  VALUES (v_parent, p_child_id, p_amount, p_message);

  RETURN jsonb_build_object('ok', true, 'message', format('%s coin sovg''a qilindi!', p_amount));
END;
$$;

-- 7.5. Coin xaridini tasdiqlash (admin chaqiradi)
CREATE OR REPLACE FUNCTION approve_coin_purchase(p_request_id UUID, p_approve BOOLEAN, p_note TEXT DEFAULT NULL)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_admin UUID := auth.uid();
  v_req coin_purchase_requests;
  v_new_balance INT;
BEGIN
  IF (SELECT role FROM profiles WHERE id = v_admin) <> 'admin' THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Faqat admin');
  END IF;

  SELECT * INTO v_req FROM coin_purchase_requests WHERE id = p_request_id AND status = 'pending' FOR UPDATE;
  IF v_req.id IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'So''rov topilmadi yoki ko''rib chiqilgan');
  END IF;

  UPDATE coin_purchase_requests
  SET status = CASE WHEN p_approve THEN 'approved' ELSE 'rejected' END,
      reviewed_by = v_admin, review_note = p_note, reviewed_at = now()
  WHERE id = p_request_id;

  IF p_approve THEN
    UPDATE profiles SET coins = coins + v_req.amount_coins WHERE id = v_req.parent_id
      RETURNING coins INTO v_new_balance;
    INSERT INTO coin_transactions (user_id, amount, type, reference_id, description, balance_after)
    VALUES (v_req.parent_id, v_req.amount_coins, 'coin_purchase', v_req.id,
            format('%s coin sotib olindi', v_req.amount_coins), v_new_balance);
  END IF;

  RETURN jsonb_build_object('ok', true, 'message',
    CASE WHEN p_approve THEN 'Tasdiqlandi — coinlar qo''shildi' ELSE 'Rad etildi' END);
END;
$$;

-- ============================================
-- 8) RLS
-- ============================================
ALTER TABLE parent_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_link_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE coin_purchase_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE coin_gifts ENABLE ROW LEVEL SECURITY;

-- parent_links: ikkala taraf ham o'z linklarini ko'radi
CREATE POLICY "parent_links_select_own" ON parent_links FOR SELECT USING (
  parent_id = auth.uid() OR child_id = auth.uid()
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
-- Yozish faqat RPC orqali (SECURITY DEFINER) — to'g'ridan-to'g'ri insert/update yo'q

-- parent_link_codes: farzand o'zi yaratadi va ko'radi
CREATE POLICY "parent_link_codes_select_own" ON parent_link_codes FOR SELECT USING (child_id = auth.uid());
CREATE POLICY "parent_link_codes_insert_own" ON parent_link_codes FOR INSERT WITH CHECK (child_id = auth.uid());
CREATE POLICY "parent_link_codes_delete_own" ON parent_link_codes FOR DELETE USING (child_id = auth.uid());

-- coin_purchase_requests: parent o'ziniki, admin hammasini
CREATE POLICY "coin_purchase_select" ON coin_purchase_requests FOR SELECT USING (
  parent_id = auth.uid()
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "coin_purchase_insert_own" ON coin_purchase_requests FOR INSERT WITH CHECK (
  parent_id = auth.uid()
  AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'parent')
);

-- coin_gifts: ikkala taraf ko'radi (yozish faqat gift_coins RPC orqali)
CREATE POLICY "coin_gifts_select_own" ON coin_gifts FOR SELECT USING (
  parent_id = auth.uid() OR child_id = auth.uid()
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ============================================
-- 9) FARZAND MA'LUMOTLARINI OTA-ONAGA OCHISH
--    Mavjud select policy'larga is_parent_of() sharti qo'shiladi
-- ============================================

DROP POLICY IF EXISTS "enrollments_select_own" ON enrollments;
CREATE POLICY "enrollments_select_own" ON enrollments FOR SELECT USING (
  user_id = auth.uid()
  OR is_parent_of(user_id)
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','teacher'))
);

DROP POLICY IF EXISTS "topic_progress_select_own" ON topic_progress;
CREATE POLICY "topic_progress_select_own" ON topic_progress FOR SELECT USING (
  user_id = auth.uid()
  OR is_parent_of(user_id)
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','teacher'))
);

DROP POLICY IF EXISTS "quiz_results_select_own" ON quiz_results;
CREATE POLICY "quiz_results_select_own" ON quiz_results FOR SELECT USING (
  user_id = auth.uid()
  OR is_parent_of(user_id)
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','teacher'))
);

DROP POLICY IF EXISTS "submissions_select_own" ON submissions;
CREATE POLICY "submissions_select_own" ON submissions FOR SELECT USING (
  user_id = auth.uid()
  OR is_parent_of(user_id)
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','teacher'))
);

-- Cognitive Health: ai_usage_daily va reflection_journals (06-migration policy'lari)
DROP POLICY IF EXISTS "ai_usage_daily_select_own" ON ai_usage_daily;
CREATE POLICY "ai_usage_daily_select_own" ON ai_usage_daily FOR SELECT USING (
  user_id = auth.uid()
  OR is_parent_of(user_id)
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','teacher'))
);

DROP POLICY IF EXISTS "reflection_journals_select_own" ON reflection_journals;
CREATE POLICY "reflection_journals_select_own" ON reflection_journals FOR SELECT USING (
  user_id = auth.uid()
  OR is_parent_of(user_id)
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','teacher'))
);

-- Sertifikatlar (mavjud policy nomini tekshirib almashtiramiz)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'certificates' AND policyname = 'certificates_select_own') THEN
    DROP POLICY "certificates_select_own" ON certificates;
  END IF;
  CREATE POLICY "certificates_select_own" ON certificates FOR SELECT USING (
    user_id = auth.uid()
    OR is_parent_of(user_id)
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','teacher'))
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
