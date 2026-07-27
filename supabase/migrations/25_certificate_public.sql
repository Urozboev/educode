-- ============================================
-- EduCode — Sertifikatni ommaviy tekshirish
--
-- Sertifikat raqami — uning ochiq identifikatori. Ish beruvchi yoki
-- o'qituvchi raqam (yoki QR kod) orqali sertifikat haqiqiyligini
-- tekshira olishi kerak — buning uchun EduCode'da hisob shart emas.
--
-- `certificates` jadvali RLS bilan egasiga cheklangan, shuning uchun
-- ommaviy sahifa SECURITY DEFINER funksiya orqali ishlaydi va faqat
-- tekshirish uchun zarur maydonlarni qaytaradi (foydalanuvchi ID'si,
-- ichki havolalar va boshqa ma'lumotlar berilmaydi).
--
-- Supabase SQL Editor da ishga tushiring.
-- ============================================

CREATE OR REPLACE FUNCTION public.verify_certificate(p_number TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_c RECORD;
BEGIN
  SELECT c.*, p.username, p.is_portfolio_public
    INTO v_c
    FROM certificates c
    LEFT JOIN profiles p ON p.id = c.user_id
   WHERE upper(trim(c.certificate_number)) = upper(trim(p_number))
   LIMIT 1;

  IF v_c.id IS NULL THEN
    RETURN NULL;
  END IF;

  RETURN jsonb_build_object(
    'certificate_number', v_c.certificate_number,
    'full_name', v_c.full_name,
    'course_title', v_c.course_title,
    'completion_date', v_c.completion_date,
    'score_percentage', v_c.score_percentage,
    'issued_at', v_c.issued_at,
    -- Portfolio ochiq bo'lsagina havola beriladi
    'portfolio_username', CASE WHEN v_c.is_portfolio_public THEN v_c.username ELSE NULL END
  );
END;
$$;

-- Anonim foydalanuvchi ham chaqira olishi kerak
GRANT EXECUTE ON FUNCTION public.verify_certificate(TEXT) TO anon, authenticated;
