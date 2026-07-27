-- ============================================
-- EduCode — O'qituvchi roli: ariza + admin tasdig'i
--
-- Yondashuv: ro'yxatdan o'tishda hech kim to'g'ridan-to'g'ri 'teacher'
-- bo'la olmaydi (buni handle_new_user trigger'i allaqachon bloklaydi).
-- Foydalanuvchi oddiy o'quvchi sifatida ro'yxatdan o'tadi va ariza
-- topshiradi. Admin tasdiqlagandan keyingina profiles.role = 'teacher'
-- bo'ladi va o'qituvchi kabineti ochiladi.
--
-- Supabase SQL Editor da ishga tushiring.
-- ============================================

CREATE TABLE IF NOT EXISTS teacher_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Har bir foydalanuvchidan bitta ariza
  user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,

  -- Ariza ma'lumotlari
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  region TEXT,
  district TEXT,
  school TEXT NOT NULL,
  subject TEXT NOT NULL DEFAULT 'informatika',
  experience_years INT DEFAULT 0,
  about TEXT,

  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','approved','rejected')),
  reject_reason TEXT,
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS teacher_apps_status_idx ON teacher_applications(status, created_at DESC);

ALTER TABLE teacher_applications ENABLE ROW LEVEL SECURITY;

-- Foydalanuvchi o'z arizasini ko'radi va yaratadi
DROP POLICY IF EXISTS "teacher_apps_own_select" ON teacher_applications;
CREATE POLICY "teacher_apps_own_select" ON teacher_applications FOR SELECT USING (
  user_id = auth.uid()
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS "teacher_apps_own_insert" ON teacher_applications;
CREATE POLICY "teacher_apps_own_insert" ON teacher_applications FOR INSERT WITH CHECK (
  user_id = auth.uid()
);

-- Rad etilgan arizani foydalanuvchi tahrirlab qayta topshira oladi.
-- Status'ni o'zi o'zgartira olmaydi — buni quyidagi trigger ta'minlaydi.
DROP POLICY IF EXISTS "teacher_apps_own_update" ON teacher_applications;
CREATE POLICY "teacher_apps_own_update" ON teacher_applications FOR UPDATE USING (
  user_id = auth.uid() AND status = 'rejected'
);

DROP POLICY IF EXISTS "teacher_apps_admin_all" ON teacher_applications;
CREATE POLICY "teacher_apps_admin_all" ON teacher_applications FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

DROP TRIGGER IF EXISTS teacher_applications_updated_at ON teacher_applications;
CREATE TRIGGER teacher_applications_updated_at BEFORE UPDATE ON teacher_applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- HIMOYA: foydalanuvchi o'z arizasini o'zi tasdiqlay olmasin
-- ============================================
CREATE OR REPLACE FUNCTION public.guard_teacher_application()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_is_admin BOOLEAN;
BEGIN
  SELECT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    INTO v_is_admin;

  IF v_is_admin THEN
    RETURN NEW;
  END IF;

  -- Admin bo'lmaganlar uchun: qayta topshirishda status doim 'pending'ga qaytadi
  NEW.status := 'pending';
  NEW.reject_reason := NULL;
  NEW.reviewed_by := NULL;
  NEW.reviewed_at := NULL;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS teacher_applications_guard ON teacher_applications;
CREATE TRIGGER teacher_applications_guard
  BEFORE INSERT OR UPDATE ON teacher_applications
  FOR EACH ROW EXECUTE FUNCTION public.guard_teacher_application();

-- ============================================
-- ADMIN AMALLARI
-- ============================================

-- Tasdiqlash: arizani approved qiladi va rolni 'teacher'ga o'tkazadi
CREATE OR REPLACE FUNCTION public.approve_teacher_application(p_application_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin') THEN
    RAISE EXCEPTION 'Faqat admin tasdiqlay oladi';
  END IF;

  SELECT user_id INTO v_user_id FROM teacher_applications WHERE id = p_application_id;
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Ariza topilmadi';
  END IF;

  UPDATE teacher_applications
     SET status = 'approved',
         reject_reason = NULL,
         reviewed_by = auth.uid(),
         reviewed_at = now()
   WHERE id = p_application_id;

  UPDATE profiles SET role = 'teacher' WHERE id = v_user_id;
END;
$$;

-- Rad etish: rolga tegilmaydi (foydalanuvchi o'quvchi bo'lib qoladi)
CREATE OR REPLACE FUNCTION public.reject_teacher_application(p_application_id UUID, p_reason TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin') THEN
    RAISE EXCEPTION 'Faqat admin rad eta oladi';
  END IF;

  UPDATE teacher_applications
     SET status = 'rejected',
         reject_reason = p_reason,
         reviewed_by = auth.uid(),
         reviewed_at = now()
   WHERE id = p_application_id;
END;
$$;

-- Rolni qaytarib olish (tasdiq xato bo'lsa)
CREATE OR REPLACE FUNCTION public.revoke_teacher_role(p_application_id UUID, p_reason TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin') THEN
    RAISE EXCEPTION 'Faqat admin bekor qila oladi';
  END IF;

  SELECT user_id INTO v_user_id FROM teacher_applications WHERE id = p_application_id;

  UPDATE teacher_applications
     SET status = 'rejected',
         reject_reason = p_reason,
         reviewed_by = auth.uid(),
         reviewed_at = now()
   WHERE id = p_application_id;

  -- Faqat teacher bo'lsa qaytaramiz — admin roli tasodifan tushib qolmasin
  UPDATE profiles SET role = 'student' WHERE id = v_user_id AND role = 'teacher';
END;
$$;
