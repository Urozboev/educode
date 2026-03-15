-- ============================================
-- MUAMMO TUZATISH: Profiles jadvaliga yozilmayapti
-- Bu SQL ni Supabase SQL Editor da ishga tushiring
-- ============================================

-- 0. MUHIM: profiles INSERT uchun RLS siyosat qo'shish
-- (Hozir faqat SELECT va UPDATE bor, INSERT yo'q!)
DO $$
BEGIN
  -- Agar policy mavjud bo'lmasa yaratamiz
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'profiles_insert_own'
  ) THEN
    CREATE POLICY "profiles_insert_own" ON profiles
      FOR INSERT WITH CHECK (auth.uid() = id);
  END IF;
END $$;

-- Coin transactions uchun ham INSERT tekshirish
-- (allaqachon bor bo'lishi kerak, lekin ishonch hosil qilamiz)

-- 1. Eski triggerni o'chirish
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- 2. Trigger funksiyasini QAYTA yaratish
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role, coins)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1)
    ),
    NEW.raw_user_meta_data->>'avatar_url',
    'student',
    100
  );

  INSERT INTO public.coin_transactions (user_id, amount, type, description, balance_after)
  VALUES (NEW.id, 100, 'registration_bonus', 'Registratsiya bonusi', 100);

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Xatolik bo'lsa ham user yaratilishiga to'sqinlik qilmasin
  RAISE LOG 'handle_new_user xatolik: %', SQLERRM;
  RETURN NEW;
END;
$$;

-- 3. Triggerni QAYTA yaratish
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 4. MAVJUD userlarni profiles ga sinxronlash
-- (agar auth.users da bor, lekin profiles da yo'q bo'lsa)
INSERT INTO profiles (id, full_name, avatar_url, role, coins)
SELECT
  u.id,
  COALESCE(
    u.raw_user_meta_data->>'full_name',
    u.raw_user_meta_data->>'name',
    split_part(u.email, '@', 1)
  ),
  u.raw_user_meta_data->>'avatar_url',
  'student',
  100
FROM auth.users u
LEFT JOIN profiles p ON p.id = u.id
WHERE p.id IS NULL;

-- 5. Sinxronlangan userlar uchun coin tranzaksiya
INSERT INTO coin_transactions (user_id, amount, type, description, balance_after)
SELECT
  p.id, 100, 'registration_bonus', 'Registratsiya bonusi', 100
FROM profiles p
LEFT JOIN coin_transactions c ON c.user_id = p.id AND c.type = 'registration_bonus'
WHERE c.id IS NULL;

-- 6. Trigger ishlashini tekshirish
SELECT
  u.email,
  p.full_name,
  p.role,
  p.coins,
  CASE WHEN p.id IS NOT NULL THEN 'HA' ELSE 'YO''Q' END AS profil_bor
FROM auth.users u
LEFT JOIN profiles p ON p.id = u.id
ORDER BY u.created_at DESC;
