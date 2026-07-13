-- ============================================
-- 15) Sertifikat egasiga full_name'ni yangilash ruxsati
-- ============================================
-- Gmail'dan kelgan ism ba'zan noto'g'ri/boshqacha bo'ladi. Foydalanuvchi
-- o'z sertifikatidagi ism-familiyani to'g'irlashi mumkin bo'lsin.
-- Supabase SQL Editor'da ishga tushiring.
-- ============================================

DROP POLICY IF EXISTS "certificates_update_own" ON certificates;
CREATE POLICY "certificates_update_own" ON certificates
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
