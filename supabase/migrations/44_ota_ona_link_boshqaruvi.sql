-- ============================================
-- EduCode — Ota-ona bog'lanishini boshqarish
--
-- 08_parent_role.sql da ikkita kamchilik qoldi:
--
-- (1) Ota-ona yuborgan so'rovni bekor qila olmaydi va bog'langan
--     farzandni ro'yxatdan olib tashlay olmaydi. parent_links da
--     INSERT/UPDATE/DELETE policy yo'q (yozish faqat RPC orqali),
--     shuning uchun panelda "Tasdiqlanishi kutilmoqda" yozuvi abadiy
--     osilib qoladi.
--
-- (2) create_parent_link_by_email: farzand so'rovni rad etgan bo'lsa,
--     qayta yuborish imkonsiz — "So'rov allaqachon yuborilgan" xatosi
--     chiqadi, lekin panelda rejected linklar ko'rsatilmaydi. Ya'ni
--     ota-ona nima bo'layotganini tushunmaydi.
--
-- Supabase SQL Editor da ishga tushiring.
-- ============================================

-- ============================================
-- 1) Linkni bekor qilish / farzandni uzish (ota-ona chaqiradi)
-- ============================================
CREATE OR REPLACE FUNCTION cancel_parent_link(p_link_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_parent UUID := auth.uid();
  v_link parent_links;
BEGIN
  IF v_parent IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Tizimga kiring');
  END IF;

  SELECT * INTO v_link FROM parent_links
  WHERE id = p_link_id AND parent_id = v_parent;

  IF v_link.id IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Bog''lanish topilmadi');
  END IF;

  -- Yozuv o'chiriladi (status = 'rejected' qilinmaydi): shunda ota-ona
  -- keyinchalik xohlasa qaytadan so'rov yubora oladi.
  DELETE FROM parent_links WHERE id = p_link_id;

  RETURN jsonb_build_object('ok', true, 'message',
    CASE WHEN v_link.status = 'pending'
      THEN 'So''rov bekor qilindi'
      ELSE 'Farzand ro''yxatdan olib tashlandi' END);
END;
$$;

-- ============================================
-- 2) Email orqali so'rov: rad etilgan bo'lsa qayta yuborishga ruxsat
-- ============================================
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
  v_existing parent_links;
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

  IF v_child = v_parent THEN
    RETURN jsonb_build_object('ok', false, 'error', 'O''zingizni bog''lay olmaysiz');
  END IF;

  SELECT role INTO v_child_role FROM profiles WHERE id = v_child;
  IF v_child_role <> 'student' THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Bu hisob talaba emas');
  END IF;

  SELECT * INTO v_existing FROM parent_links
  WHERE parent_id = v_parent AND child_id = v_child;

  IF v_existing.id IS NOT NULL THEN
    IF v_existing.status = 'confirmed' THEN
      RETURN jsonb_build_object('ok', false, 'error', 'Bu farzand allaqachon bog''langan');
    ELSIF v_existing.status = 'pending' THEN
      RETURN jsonb_build_object('ok', false, 'error', 'So''rov allaqachon yuborilgan');
    END IF;

    -- rejected → qayta so'rov yuborish mumkin
    UPDATE parent_links
    SET status = 'pending', initiated_by = 'parent', confirmed_at = NULL
    WHERE id = v_existing.id;

    RETURN jsonb_build_object('ok', true, 'message', 'So''rov qayta yuborildi. Farzandingiz profilida tasdiqlashi kerak.');
  END IF;

  INSERT INTO parent_links (parent_id, child_id, status, initiated_by)
  VALUES (v_parent, v_child, 'pending', 'parent');

  RETURN jsonb_build_object('ok', true, 'message', 'So''rov yuborildi. Farzandingiz profilida tasdiqlashi kerak.');
END;
$$;

GRANT EXECUTE ON FUNCTION cancel_parent_link(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION create_parent_link_by_email(TEXT) TO authenticated;
