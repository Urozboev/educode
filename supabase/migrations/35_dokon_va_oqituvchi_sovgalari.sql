-- ============================================
-- EduCode — Do'kon tizimini qayta qurish + o'qituvchi sovg'alari
--
-- Nima o'zgaradi:
--  1. `store_items` va `store_orders` jadvallari rasmiy migratsiyaga oldi
--     (ilgari ular faqat Supabase panelida qo'lda yaratilgan edi).
--  2. O'qituvchi ham sovg'a qo'sha oladi. Uning sovg'asini FAQAT o'z
--     o'quvchilari (teacher_students) coinga almashtira oladi.
--  3. Buyurtma berishda o'quvchi aloqa va yetkazib berish ma'lumotlarini
--     kiritadi. Bu ma'lumotni faqat buyurtmachi, sovg'a egasi va admin ko'radi.
--  4. Buyurtma holati kengaydi: kutilmoqda → tasdiqlandi → jo'natildi →
--     yetkazildi. Rad etilsa yoki bekor qilinsa coin QAYTARILADI.
--  5. Coin yechish/qaytarish atomik RPC ichida bajariladi — mijoz kodiga
--     ishonmaydi, balans va zaxira bir tranzaksiyada o'zgaradi.
--
-- Supabase SQL Editor da ishga tushiring. Qayta ishga tushirish xavfsiz.
-- ============================================

-- ============================================
-- 1. JADVALLAR
-- ============================================
CREATE TABLE IF NOT EXISTS store_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  price_coins INTEGER NOT NULL DEFAULT 100,
  category TEXT NOT NULL DEFAULT 'accessory',
  stock INTEGER NOT NULL DEFAULT 10,
  is_active BOOLEAN NOT NULL DEFAULT true,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS store_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  item_id UUID REFERENCES store_items(id) ON DELETE SET NULL,
  item_title TEXT NOT NULL,
  price_coins INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 2. YANGI USTUNLAR
-- ============================================

-- Sovg'a egasi: NULL — platforma (admin) sovg'asi, aks holda o'qituvchi
ALTER TABLE store_items ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE;
-- Kimga ko'rinadi: hammaga yoki faqat egasining o'quvchilariga
ALTER TABLE store_items ADD COLUMN IF NOT EXISTS audience TEXT NOT NULL DEFAULT 'everyone';
-- Qanday topshiriladi: yetkazib berish / qo'lda olish / raqamli
ALTER TABLE store_items ADD COLUMN IF NOT EXISTS delivery_type TEXT NOT NULL DEFAULT 'delivery';
ALTER TABLE store_items ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

ALTER TABLE store_items DROP CONSTRAINT IF EXISTS store_items_audience_check;
ALTER TABLE store_items ADD CONSTRAINT store_items_audience_check
  CHECK (audience IN ('everyone','my_students'));

ALTER TABLE store_items DROP CONSTRAINT IF EXISTS store_items_delivery_check;
ALTER TABLE store_items ADD CONSTRAINT store_items_delivery_check
  CHECK (delivery_type IN ('delivery','pickup','digital'));

ALTER TABLE store_items DROP CONSTRAINT IF EXISTS store_items_price_check;
ALTER TABLE store_items ADD CONSTRAINT store_items_price_check CHECK (price_coins > 0);

-- Buyurtma: sotuvchi (sovg'a egasi) nusxasi — o'qituvchi o'z buyurtmalarini
-- sovg'a keyinchalik o'chirilsa ham ko'ra olishi uchun alohida saqlanadi
ALTER TABLE store_orders ADD COLUMN IF NOT EXISTS seller_id UUID REFERENCES profiles(id) ON DELETE SET NULL;
ALTER TABLE store_orders ADD COLUMN IF NOT EXISTS delivery_type TEXT NOT NULL DEFAULT 'delivery';

-- Aloqa va yetkazib berish ma'lumotlari
ALTER TABLE store_orders ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE store_orders ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE store_orders ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE store_orders ADD COLUMN IF NOT EXISTS region TEXT;
ALTER TABLE store_orders ADD COLUMN IF NOT EXISTS district TEXT;
ALTER TABLE store_orders ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE store_orders ADD COLUMN IF NOT EXISTS landmark TEXT;
ALTER TABLE store_orders ADD COLUMN IF NOT EXISTS note TEXT;

-- Jarayonni kuzatish
ALTER TABLE store_orders ADD COLUMN IF NOT EXISTS handled_by UUID REFERENCES profiles(id) ON DELETE SET NULL;
ALTER TABLE store_orders ADD COLUMN IF NOT EXISTS handled_at TIMESTAMPTZ;
ALTER TABLE store_orders ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMPTZ;
ALTER TABLE store_orders ADD COLUMN IF NOT EXISTS tracking_note TEXT;
ALTER TABLE store_orders ADD COLUMN IF NOT EXISTS reject_reason TEXT;
ALTER TABLE store_orders ADD COLUMN IF NOT EXISTS refunded BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE store_orders DROP CONSTRAINT IF EXISTS store_orders_status_check;
ALTER TABLE store_orders ADD CONSTRAINT store_orders_status_check
  CHECK (status IN ('pending','approved','shipped','delivered','rejected','cancelled'));

ALTER TABLE store_orders DROP CONSTRAINT IF EXISTS store_orders_delivery_check;
ALTER TABLE store_orders ADD CONSTRAINT store_orders_delivery_check
  CHECK (delivery_type IN ('delivery','pickup','digital'));

CREATE INDEX IF NOT EXISTS store_items_active_idx ON store_items(is_active, order_index);
CREATE INDEX IF NOT EXISTS store_items_owner_idx ON store_items(owner_id);
CREATE INDEX IF NOT EXISTS store_orders_user_idx ON store_orders(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS store_orders_seller_idx ON store_orders(seller_id, created_at DESC);
CREATE INDEX IF NOT EXISTS store_orders_status_idx ON store_orders(status, created_at DESC);

-- Coin qaytarish turi
ALTER TABLE coin_transactions DROP CONSTRAINT IF EXISTS coin_transactions_type_check;
ALTER TABLE coin_transactions ADD CONSTRAINT coin_transactions_type_check
  CHECK (type IN (
    'registration_bonus','topic_complete','course_complete',
    'challenge_solved','streak_bonus','achievement_bonus',
    'course_purchase','admin_adjustment','quiz_bonus',
    'challenge_complete','store_purchase',
    'hint_unlock',
    'gift_sent','gift_received','coin_purchase',
    -- Yangi: buyurtma rad etilganda coin qaytariladi
    'store_refund'
  ));

-- ============================================
-- 3. RLS
-- ============================================
ALTER TABLE store_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_orders ENABLE ROW LEVEL SECURITY;

-- Sovg'alar: platforma sovg'asini hamma ko'radi; o'qituvchi sovg'asini
-- faqat o'sha o'qituvchining o'quvchilari ko'radi
DROP POLICY IF EXISTS "store_items_read" ON store_items;
CREATE POLICY "store_items_read" ON store_items FOR SELECT USING (
  (
    is_active = true
    AND (
      audience = 'everyone'
      OR EXISTS (
        SELECT 1 FROM teacher_students ts
         WHERE ts.teacher_id = store_items.owner_id
           AND ts.student_id = auth.uid()
      )
    )
  )
  OR owner_id = auth.uid()
  OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

-- Admin platforma sovg'asini, o'qituvchi o'z sovg'asini yaratadi
DROP POLICY IF EXISTS "store_items_insert" ON store_items;
CREATE POLICY "store_items_insert" ON store_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  OR (
    owner_id = auth.uid()
    AND EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'teacher')
  )
);

DROP POLICY IF EXISTS "store_items_update" ON store_items;
CREATE POLICY "store_items_update" ON store_items FOR UPDATE USING (
  owner_id = auth.uid()
  OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

DROP POLICY IF EXISTS "store_items_delete" ON store_items;
CREATE POLICY "store_items_delete" ON store_items FOR DELETE USING (
  owner_id = auth.uid()
  OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

-- Buyurtmalar: shaxsiy ma'lumot bor, shuning uchun uchta tomon ko'radi —
-- buyurtmachi, sovg'a egasi va admin. Boshqa o'qituvchi ko'ra olmaydi.
DROP POLICY IF EXISTS "store_orders_read" ON store_orders;
CREATE POLICY "store_orders_read" ON store_orders FOR SELECT USING (
  user_id = auth.uid()
  OR seller_id = auth.uid()
  OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

-- Yozish faqat RPC orqali: coin yechish/qaytarish va zaxira bir joyda tursin
DROP POLICY IF EXISTS "store_orders_insert" ON store_orders;
DROP POLICY IF EXISTS "store_orders_update" ON store_orders;

-- ============================================
-- 4. BUYURTMA BERISH (atomik)
-- ============================================
CREATE OR REPLACE FUNCTION public.place_store_order(
  p_item_id UUID,
  p_full_name TEXT,
  p_phone TEXT,
  p_email TEXT DEFAULT NULL,
  p_region TEXT DEFAULT NULL,
  p_district TEXT DEFAULT NULL,
  p_address TEXT DEFAULT NULL,
  p_landmark TEXT DEFAULT NULL,
  p_note TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $fn$
DECLARE
  v_user UUID := auth.uid();
  v_item store_items%ROWTYPE;
  v_coins INT;
  v_new_balance INT;
  v_order_id UUID;
  v_eligible BOOLEAN;
BEGIN
  IF v_user IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'auth', 'message', 'Avval tizimga kiring');
  END IF;

  -- Sovg'ani qulflab olamiz: bir vaqtda ikki kishi oxirgi donani olmasin
  SELECT * INTO v_item FROM store_items WHERE id = p_item_id FOR UPDATE;

  IF NOT FOUND OR v_item.is_active = false THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'not_found', 'message', 'Sovg''a topilmadi yoki faol emas');
  END IF;

  -- Kimga tegishli ekanini tekshiramiz
  IF v_item.audience = 'my_students' THEN
    SELECT EXISTS (
      SELECT 1 FROM teacher_students ts
       WHERE ts.teacher_id = v_item.owner_id AND ts.student_id = v_user
    ) INTO v_eligible;
    IF NOT v_eligible THEN
      RETURN jsonb_build_object('ok', false, 'reason', 'not_eligible',
        'message', 'Bu sovg''a faqat o''qituvchining o''z o''quvchilari uchun');
    END IF;
  END IF;

  IF v_item.stock <= 0 THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'out_of_stock', 'message', 'Sovg''a tugagan');
  END IF;

  -- Aloqa ma'lumotlari
  IF p_full_name IS NULL OR btrim(p_full_name) = '' THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'no_name', 'message', 'To''liq ismni kiriting');
  END IF;
  IF p_phone IS NULL OR btrim(p_phone) = '' THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'no_phone', 'message', 'Telefon raqamini kiriting');
  END IF;
  IF v_item.delivery_type = 'delivery'
     AND (p_region IS NULL OR btrim(p_region) = '' OR p_address IS NULL OR btrim(p_address) = '') THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'no_address',
      'message', 'Yetkazib berish uchun viloyat va manzilni kiriting');
  END IF;

  SELECT coins INTO v_coins FROM profiles WHERE id = v_user FOR UPDATE;
  IF v_coins IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'no_profile', 'message', 'Profil topilmadi');
  END IF;
  IF v_coins < v_item.price_coins THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'no_coins',
      'message', format('Yetarli coin yo''q. Kerak: %s, sizda: %s', v_item.price_coins, v_coins));
  END IF;

  v_new_balance := v_coins - v_item.price_coins;

  UPDATE profiles SET coins = v_new_balance WHERE id = v_user;
  UPDATE store_items SET stock = stock - 1, updated_at = now() WHERE id = v_item.id;

  INSERT INTO store_orders (
    user_id, item_id, item_title, price_coins, status,
    seller_id, delivery_type,
    full_name, phone, email, region, district, address, landmark, note
  ) VALUES (
    v_user, v_item.id, v_item.title, v_item.price_coins, 'pending',
    v_item.owner_id, v_item.delivery_type,
    btrim(p_full_name), btrim(p_phone), NULLIF(btrim(COALESCE(p_email, '')), ''),
    NULLIF(btrim(COALESCE(p_region, '')), ''), NULLIF(btrim(COALESCE(p_district, '')), ''),
    NULLIF(btrim(COALESCE(p_address, '')), ''), NULLIF(btrim(COALESCE(p_landmark, '')), ''),
    NULLIF(btrim(COALESCE(p_note, '')), '')
  )
  RETURNING id INTO v_order_id;

  INSERT INTO coin_transactions (user_id, amount, type, reference_id, description, balance_after)
  VALUES (v_user, -v_item.price_coins, 'store_purchase', v_item.id,
          format('"%s" sovg''asi buyurtma qilindi', v_item.title), v_new_balance);

  RETURN jsonb_build_object(
    'ok', true, 'order_id', v_order_id,
    'balance', v_new_balance, 'stock', v_item.stock - 1,
    'message', format('"%s" buyurtma qilindi', v_item.title)
  );
END;
$fn$;

GRANT EXECUTE ON FUNCTION public.place_store_order(UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) TO authenticated;

-- ============================================
-- 5. BUYURTMA HOLATINI O'ZGARTIRISH
-- ============================================
CREATE OR REPLACE FUNCTION public.update_store_order(
  p_order_id UUID,
  p_status TEXT,
  p_note TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $fn$
DECLARE
  v_actor UUID := auth.uid();
  v_is_admin BOOLEAN;
  v_order store_orders%ROWTYPE;
  v_balance INT;
BEGIN
  IF v_actor IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'message', 'Avval tizimga kiring');
  END IF;

  SELECT EXISTS (SELECT 1 FROM profiles WHERE id = v_actor AND role = 'admin') INTO v_is_admin;

  SELECT * INTO v_order FROM store_orders WHERE id = p_order_id FOR UPDATE;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'message', 'Buyurtma topilmadi');
  END IF;

  -- Admin hammasini, o'qituvchi faqat o'z sovg'asi bo'yicha kelgan buyurtmani
  IF NOT v_is_admin AND v_order.seller_id IS DISTINCT FROM v_actor THEN
    RETURN jsonb_build_object('ok', false, 'message', 'Bu buyurtmani boshqarish huquqingiz yo''q');
  END IF;

  IF p_status NOT IN ('pending','approved','shipped','delivered','rejected','cancelled') THEN
    RETURN jsonb_build_object('ok', false, 'message', 'Noto''g''ri holat');
  END IF;

  -- Yakunlangan buyurtma qayta ochilmaydi
  IF v_order.status IN ('delivered','rejected','cancelled') THEN
    RETURN jsonb_build_object('ok', false, 'message', 'Bu buyurtma allaqachon yakunlangan');
  END IF;

  -- Rad etish yoki bekor qilish — coin qaytariladi, zaxira tiklanadi
  IF p_status IN ('rejected','cancelled') AND v_order.refunded = false THEN
    SELECT coins INTO v_balance FROM profiles WHERE id = v_order.user_id FOR UPDATE;
    v_balance := COALESCE(v_balance, 0) + v_order.price_coins;

    UPDATE profiles SET coins = v_balance WHERE id = v_order.user_id;

    INSERT INTO coin_transactions (user_id, amount, type, reference_id, description, balance_after)
    VALUES (v_order.user_id, v_order.price_coins, 'store_refund', v_order.item_id,
            format('"%s" buyurtmasi bekor qilindi — coin qaytarildi', v_order.item_title), v_balance);

    IF v_order.item_id IS NOT NULL THEN
      UPDATE store_items SET stock = stock + 1, updated_at = now() WHERE id = v_order.item_id;
    END IF;

    UPDATE store_orders SET refunded = true WHERE id = p_order_id;
  END IF;

  UPDATE store_orders SET
    status = p_status,
    handled_by = v_actor,
    handled_at = now(),
    updated_at = now(),
    delivered_at = CASE WHEN p_status = 'delivered' THEN now() ELSE delivered_at END,
    reject_reason = CASE WHEN p_status IN ('rejected','cancelled') THEN COALESCE(NULLIF(btrim(COALESCE(p_note,'')),''), reject_reason) ELSE reject_reason END,
    tracking_note = CASE WHEN p_status IN ('approved','shipped','delivered') THEN COALESCE(NULLIF(btrim(COALESCE(p_note,'')),''), tracking_note) ELSE tracking_note END
  WHERE id = p_order_id;

  RETURN jsonb_build_object('ok', true, 'status', p_status,
    'refunded', (p_status IN ('rejected','cancelled')));
END;
$fn$;

GRANT EXECUTE ON FUNCTION public.update_store_order(UUID, TEXT, TEXT) TO authenticated;

-- ============================================
-- 6. O'QUVCHI O'Z BUYURTMASINI BEKOR QILISHI
--    (faqat hali tasdiqlanmagan bo'lsa)
-- ============================================
CREATE OR REPLACE FUNCTION public.cancel_my_store_order(p_order_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $fn$
DECLARE
  v_user UUID := auth.uid();
  v_order store_orders%ROWTYPE;
  v_balance INT;
BEGIN
  SELECT * INTO v_order FROM store_orders WHERE id = p_order_id FOR UPDATE;
  IF NOT FOUND OR v_order.user_id IS DISTINCT FROM v_user THEN
    RETURN jsonb_build_object('ok', false, 'message', 'Buyurtma topilmadi');
  END IF;
  IF v_order.status <> 'pending' THEN
    RETURN jsonb_build_object('ok', false, 'message', 'Faqat tasdiqlanmagan buyurtmani bekor qilish mumkin');
  END IF;

  IF v_order.refunded = false THEN
    SELECT coins INTO v_balance FROM profiles WHERE id = v_user FOR UPDATE;
    v_balance := COALESCE(v_balance, 0) + v_order.price_coins;
    UPDATE profiles SET coins = v_balance WHERE id = v_user;

    INSERT INTO coin_transactions (user_id, amount, type, reference_id, description, balance_after)
    VALUES (v_user, v_order.price_coins, 'store_refund', v_order.item_id,
            format('"%s" buyurtmasi bekor qilindi — coin qaytarildi', v_order.item_title), v_balance);

    IF v_order.item_id IS NOT NULL THEN
      UPDATE store_items SET stock = stock + 1, updated_at = now() WHERE id = v_order.item_id;
    END IF;
  END IF;

  UPDATE store_orders SET status = 'cancelled', refunded = true, updated_at = now() WHERE id = p_order_id;

  RETURN jsonb_build_object('ok', true, 'balance', v_balance);
END;
$fn$;

GRANT EXECUTE ON FUNCTION public.cancel_my_store_order(UUID) TO authenticated;

-- ============================================
-- 7. MAVJUD YOZUVLARNI MOSLASHTIRISH
-- ============================================
-- Eski sovg'alar platforma sovg'asi hisoblanadi
UPDATE store_items SET audience = 'everyone' WHERE owner_id IS NULL AND audience IS DISTINCT FROM 'everyone';
-- Eski buyurtmalarda sotuvchi platforma (NULL) — admin boshqaradi
UPDATE store_orders o SET seller_id = i.owner_id
  FROM store_items i WHERE o.item_id = i.id AND o.seller_id IS NULL AND i.owner_id IS NOT NULL;
