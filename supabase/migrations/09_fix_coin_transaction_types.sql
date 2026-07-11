-- ============================================
-- EduCode — coin_transactions.type CHECK constraint tuzatish
-- Yangi turlar qo'shildi: gift_sent, gift_received, coin_purchase,
-- hint_unlock, challenge_complete, store_purchase
-- (ota-ona sovg'asi, coin xaridi, hint ochish, va mavjud kod
--  ishlatgan lekin constraint'da yo'q bo'lgan turlar)
-- Supabase SQL Editor da ishga tushiring.
-- ============================================

ALTER TABLE coin_transactions DROP CONSTRAINT IF EXISTS coin_transactions_type_check;

ALTER TABLE coin_transactions ADD CONSTRAINT coin_transactions_type_check
  CHECK (type IN (
    -- Mavjud turlar
    'registration_bonus','topic_complete','course_complete',
    'challenge_solved','streak_bonus','achievement_bonus',
    'course_purchase','admin_adjustment','quiz_bonus',
    -- Kod ishlatadigan, lekin ilgari constraint'da yo'q bo'lgan turlar
    'challenge_complete','store_purchase',
    -- Yangi: hint tier (06-migration)
    'hint_unlock',
    -- Yangi: ota-ona roli (08-migration)
    'gift_sent','gift_received','coin_purchase'
  ));
