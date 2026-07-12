-- ============================================
-- EduCode — To'lov integratsiyasi (Click / Payme)
-- coin_purchase_requests'ga to'lov provayder maydonlari.
-- Provayder webhook tasdiqlaganda coinlar avtomatik qo'shiladi.
-- Supabase SQL Editor da ishga tushiring.
-- ============================================

ALTER TABLE coin_purchase_requests
  ADD COLUMN IF NOT EXISTS payment_provider TEXT CHECK (payment_provider IN ('manual','click','payme')) DEFAULT 'manual',
  ADD COLUMN IF NOT EXISTS provider_txn_id TEXT,              -- provayderdagi tranzaksiya ID
  ADD COLUMN IF NOT EXISTS payme_state INT DEFAULT 0,         -- Payme tranzaksiya holati (0/1/2/-1/-2)
  ADD COLUMN IF NOT EXISTS payme_create_time BIGINT,
  ADD COLUMN IF NOT EXISTS payme_perform_time BIGINT,
  ADD COLUMN IF NOT EXISTS payme_cancel_time BIGINT,
  ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS coin_purchase_txn_idx ON coin_purchase_requests(provider_txn_id) WHERE provider_txn_id IS NOT NULL;

-- Coin qo'shish RPC (webhook SECURITY DEFINER bilan chaqiradi)
CREATE OR REPLACE FUNCTION credit_coins_for_purchase(p_request_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_req coin_purchase_requests;
  v_new INT;
BEGIN
  SELECT * INTO v_req FROM coin_purchase_requests WHERE id = p_request_id FOR UPDATE;
  IF v_req.id IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'not_found');
  END IF;
  -- Ikki marta qo'shilmasligi uchun
  IF v_req.status = 'approved' THEN
    RETURN jsonb_build_object('ok', true, 'already', true);
  END IF;

  UPDATE coin_purchase_requests
    SET status = 'approved', paid_at = now(), reviewed_at = now()
    WHERE id = p_request_id;

  UPDATE profiles SET coins = coins + v_req.amount_coins WHERE id = v_req.parent_id
    RETURNING coins INTO v_new;

  INSERT INTO coin_transactions (user_id, amount, type, reference_id, description, balance_after)
  VALUES (v_req.parent_id, v_req.amount_coins, 'coin_purchase', v_req.id,
          format('%s coin (%s)', v_req.amount_coins, coalesce(v_req.payment_provider,'to''lov')), v_new);

  RETURN jsonb_build_object('ok', true, 'new_balance', v_new);
END;
$$;
