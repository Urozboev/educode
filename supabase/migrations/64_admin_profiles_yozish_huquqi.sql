-- ============================================================
-- MirAcademy — Admin panelidagi "rol o'zgarmayapti" muammosi
--
-- MUAMMO
-- `profiles` jadvalida faqat ikkita siyosat bor edi:
--   profiles_select      FOR SELECT USING (true)
--   profiles_update_own  FOR UPDATE USING (auth.uid() = id)
--
-- Ya'ni har kim FAQAT O'Z profilini o'zgartira olardi. Admin boshqa
-- foydalanuvchining rolini, blok holatini yoki coinini o'zgartirmoqchi
-- bo'lganda RLS qatorni ko'rsatmas, UPDATE esa 0 ta qatorga tegardi.
--
-- Eng yomoni — bu XATO HISOBLANMAYDI: PostgREST 204 qaytaradi, dastur
-- esa "o'zgartirildi" deb xabar berardi. O'zgarish bazaga umuman
-- yetib bormasdi. Supabase jadvalidan qo'lda o'zgartirish ishlagani
-- ham shundan: u yerda RLS qo'llanmaydi.
--
-- O'qituvchi arizasini tasdiqlash ishlayotgani ham shu bilan izohlanadi
-- — u `SECURITY DEFINER` funksiya orqali bajariladi va RLS ni chetlab
-- o'tadi (18_teacher_applications.sql).
--
-- YECHIM
-- Adminga har qanday profilni o'zgartirish huquqini beruvchi alohida
-- siyosat. Tekshiruv `is_admin()` funksiyasi orqali: u SECURITY DEFINER,
-- shuning uchun `profiles` ni o'qiyotganda RLS qayta ishga tushmaydi
-- va rekursiya bo'lmaydi.
--
-- Qayta ishga tushirish xavfsiz.
-- Supabase SQL Editor da ishga tushiring.
-- ============================================================

-- 61-migratsiya ishga tushirilmagan bo'lsa ham ishlashi uchun
-- funksiyani shu yerda ham yaratamiz (CREATE OR REPLACE).
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = (select auth.uid()) AND role = 'admin'
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon;

-- Admin — har qanday profilni o'zgartira oladi
DROP POLICY IF EXISTS "profiles_update_admin" ON profiles;
CREATE POLICY "profiles_update_admin" ON profiles
  FOR UPDATE
  USING ((select public.is_admin()))
  WITH CHECK ((select public.is_admin()));

-- ------------------------------------------------------------
-- Tekshirish: quyidagi so'rov ikkala siyosatni ham ko'rsatishi kerak
--   profiles_update_own   va  profiles_update_admin
-- ------------------------------------------------------------
DO $$
DECLARE
  v_count INT;
BEGIN
  SELECT count(*) INTO v_count
  FROM pg_policies
  WHERE schemaname = 'public' AND tablename = 'profiles' AND cmd = 'UPDATE';

  RAISE NOTICE 'profiles jadvalidagi UPDATE siyosatlari: %', v_count;
  IF v_count < 2 THEN
    RAISE WARNING 'Kutilgani 2 ta edi (own + admin). Siyosatlarni tekshiring.';
  END IF;
END $$;
