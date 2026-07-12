import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { createAdminClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Click Merchant API (Shop API) — Prepare (action=0) + Complete (action=1).
 * Click dashboard'da ikkala URL ham shu endpointga:
 *   https://malla.uz/api/payments/click
 *
 * Kerakli env:
 *   CLICK_SERVICE_ID
 *   CLICK_SECRET_KEY
 *   CLICK_MERCHANT_ID
 *
 * merchant_trans_id = coin_purchase_requests.id
 */

const ERR = {
  OK: 0,
  SIGN: -1,          // imzo xato
  AMOUNT: -2,        // summa xato
  ACTION: -3,        // amal xato
  NOT_FOUND: -5,     // buyurtma topilmadi
  ALREADY: -4,       // allaqachon to'langan
  CANCELLED: -9,
};

function md5(s: string) { return createHash('md5').update(s).digest('hex'); }

export async function POST(req: NextRequest) {
  const secret = process.env.CLICK_SECRET_KEY || '';
  const form = await req.formData();
  const p: Record<string, string> = {};
  form.forEach((v, k) => { p[k] = String(v); });

  const action = p.action;
  const isComplete = action === '1';

  // Imzo tekshiruvi
  const signBase = isComplete
    ? p.click_trans_id + p.service_id + secret + p.merchant_trans_id + p.merchant_prepare_id + p.amount + p.action + p.sign_time
    : p.click_trans_id + p.service_id + secret + p.merchant_trans_id + p.amount + p.action + p.sign_time;
  const expectSign = md5(signBase);

  const reply = (error: number, extra: Record<string, any> = {}) => NextResponse.json({
    click_trans_id: p.click_trans_id,
    merchant_trans_id: p.merchant_trans_id,
    error,
    error_note: error === 0 ? 'Success' : 'Error ' + error,
    ...extra,
  });

  if (!secret || expectSign !== p.sign_string) return reply(ERR.SIGN);
  if (p.error && Number(p.error) < 0) return reply(ERR.CANCELLED);

  const admin = createAdminClient();
  const { data: r } = await admin
    .from('coin_purchase_requests')
    .select('*')
    .eq('id', p.merchant_trans_id)
    .maybeSingle();

  if (!r) return reply(ERR.NOT_FOUND);
  if (Number(p.amount) !== Number((r as any).amount_uzs)) return reply(ERR.AMOUNT);
  if ((r as any).status === 'approved') return reply(ERR.ALREADY);

  try {
    if (!isComplete) {
      // PREPARE — tranzaksiyani band qilish
      await admin.from('coin_purchase_requests').update({
        payment_provider: 'click',
        provider_txn_id: p.click_trans_id,
      }).eq('id', r.id);
      return reply(ERR.OK, { merchant_prepare_id: r.id });
    } else {
      // COMPLETE — to'lov tasdiqlandi, coinlarni qo'shish
      await admin.rpc('credit_coins_for_purchase', { p_request_id: r.id });
      return reply(ERR.OK, { merchant_confirm_id: r.id });
    }
  } catch (e) {
    console.error('click error:', e);
    return reply(ERR.ACTION);
  }
}
