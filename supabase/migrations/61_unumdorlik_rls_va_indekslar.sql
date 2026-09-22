-- ============================================================
-- EduCode — UNUMDORLIK: RLS siyosatlarini tezlashtirish
--
-- MUAMMO
-- Siyosatlarda `auth.uid()` to'g'ridan-to'g'ri yozilgan (314 o'rinda).
-- PostgreSQL bunday chaqiruvni RLS ifodasi ichida HAR BIR QATOR uchun
-- qayta bajaradi. Masalan talabada 200 ta `topic_progress` qatori bo'lsa,
-- bitta SELECT uchun `auth.uid()` 200 marta chaqiriladi. 20 ta talaba
-- bir vaqtda ishlaganda bu minglab ortiqcha chaqiruvga aylanadi —
-- aynan shuning uchun sayt yuk ko'targanda sekinlashadi.
--
-- YECHIM
-- `auth.uid()` ni skalyar so'rovga o'rash: `(select auth.uid())`.
-- Shunda rejalashtiruvchi uni InitPlan sifatida BIR MARTA hisoblaydi.
-- Bu Supabase hujjatlarida tavsiya etilgan standart usul va siyosat
-- mantig'ini umuman o'zgartirmaydi.
--
-- Quyidagi blok `pg_policies` dan barcha siyosatlarni o'qib, ularni
-- `ALTER POLICY` bilan qayta yozadi. `ALTER POLICY` siyosat nomini,
-- buyrug'ini va rollarini saqlaydi — DROP/CREATE dan xavfsizroq.
--
-- Qayta ishga tushirish xavfsiz: o'ralgan siyosatlar tashlab ketiladi.
--
-- Supabase SQL Editor da ishga tushiring.
-- ============================================================

-- ------------------------------------------------------------
-- 1) Rolni bir marta hisoblaydigan yordamchilar
--
-- `STABLE` — bitta so'rov davomida natija o'zgarmaydi, shuning uchun
-- rejalashtiruvchi keshlay oladi. `SECURITY DEFINER` — profiles ustidagi
-- RLS ni chetlab o'tadi, aks holda siyosat ichidan siyosatga murojaat
-- qilib rekursiya paydo bo'lardi.
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.auth_role()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = (select auth.uid());
$$;

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

CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = (select auth.uid()) AND role IN ('admin', 'teacher')
  );
$$;

GRANT EXECUTE ON FUNCTION public.auth_role() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.is_staff() TO authenticated, anon;

-- ------------------------------------------------------------
-- 2) Barcha siyosatlarda auth.uid() ni InitPlan ga aylantirish
-- ------------------------------------------------------------
DO $$
DECLARE
  r RECORD;
  v_qual TEXT;
  v_check TEXT;
  v_sql TEXT;
  v_count INT := 0;
BEGIN
  FOR r IN
    SELECT schemaname, tablename, policyname, qual, with_check
    FROM pg_policies
    WHERE schemaname = 'public'
      AND (qual LIKE '%auth.uid()%' OR with_check LIKE '%auth.uid()%')
  LOOP
    v_qual := r.qual;
    v_check := r.with_check;

    -- Allaqachon o'ralgan chaqiruvlarni vaqtincha belgilab qo'yamiz,
    -- aks holda ikkinchi marta o'ralib `(select (select auth.uid()))`
    -- bo'lib ketardi.
    v_qual := replace(v_qual, '( SELECT auth.uid() AS uid)', '@@WRAPPED@@');
    v_qual := replace(v_qual, '(select auth.uid())', '@@WRAPPED@@');
    v_qual := replace(v_qual, 'auth.uid()', '(select auth.uid())');
    v_qual := replace(v_qual, '@@WRAPPED@@', '(select auth.uid())');

    v_check := replace(v_check, '( SELECT auth.uid() AS uid)', '@@WRAPPED@@');
    v_check := replace(v_check, '(select auth.uid())', '@@WRAPPED@@');
    v_check := replace(v_check, 'auth.uid()', '(select auth.uid())');
    v_check := replace(v_check, '@@WRAPPED@@', '(select auth.uid())');

    -- Hech narsa o'zgarmagan bo'lsa tegmaymiz
    IF v_qual IS NOT DISTINCT FROM r.qual
       AND v_check IS NOT DISTINCT FROM r.with_check THEN
      CONTINUE;
    END IF;

    v_sql := format('ALTER POLICY %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
    IF v_qual IS NOT NULL THEN
      v_sql := v_sql || format(' USING (%s)', v_qual);
    END IF;
    IF v_check IS NOT NULL THEN
      v_sql := v_sql || format(' WITH CHECK (%s)', v_check);
    END IF;

    BEGIN
      EXECUTE v_sql;
      v_count := v_count + 1;
    EXCEPTION WHEN OTHERS THEN
      -- Bitta siyosat qayta yozilmasa ham qolganlari optimallashsin
      RAISE WARNING 'Siyosat o''zgartirilmadi: %.% / % — %',
        r.schemaname, r.tablename, r.policyname, SQLERRM;
    END;
  END LOOP;

  RAISE NOTICE 'Optimallashtirilgan siyosatlar: %', v_count;
END $$;

-- ------------------------------------------------------------
-- 3) RLS filtrlaydigan ustunlarga yetishmayotgan indekslar
--
-- Siyosat `user_id = auth.uid()` bo'yicha filtrlaydi. Agar ustunda
-- indeks bo'lmasa, Postgres butun jadvalni ko'rib chiqadi va RLS uni
-- keyin filtrlaydi — jadval o'sgan sari sekinlashadi.
-- ------------------------------------------------------------
CREATE INDEX IF NOT EXISTS submissions_task_user_idx
  ON submissions(task_id, user_id, created_at DESC);

-- quiz_results da quiz_id yo'q — natija mavzu (topic_id) bo'yicha saqlanadi
CREATE INDEX IF NOT EXISTS quiz_results_user_topic_idx
  ON quiz_results(user_id, topic_id);

CREATE INDEX IF NOT EXISTS placement_results_user_idx
  ON placement_results(user_id);

CREATE INDEX IF NOT EXISTS profiles_role_idx
  ON profiles(role);

-- Kurs sahifasi mundarijani order_index bo'yicha oladi
CREATE INDEX IF NOT EXISTS topics_course_published_idx
  ON topics(course_id, is_published, order_index);

-- ------------------------------------------------------------
-- 4) Rejalashtiruvchi statistikasini yangilash
-- ------------------------------------------------------------
ANALYZE profiles;
ANALYZE topic_progress;
ANALYZE submissions;
ANALYZE enrollments;
ANALYZE quiz_results;
ANALYZE topics;
