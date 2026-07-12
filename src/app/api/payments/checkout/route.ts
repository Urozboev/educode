import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { SITE_URL } from '@/lib/seo';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Coin xarid so'rovi uchun Payme yoki Click checkout URL yaratadi.
 * Body: { amount_coins, amount_uzs, provider: 'payme' | 'click' }
 * Yangi coin_purchase_requests yozadi va provayder to'lov sahifasi URL'ini qaytaradi.
 */
export async function POST(req: NextRequest) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { amount_coins, amount_uzs, provider } = await req.json();
  if (!amount_coins || !amount_uzs || !['payme', 'click'].includes(provider)) {
    return NextResponse.json({ error: 'invalid params' }, { status: 400 });
  }

  // So'rov yaratish (pending)
  const { data: reqRow, error } = await supabase
    .from('coin_purchase_requests')
    .insert({
      parent_id: user.id,
      amount_coins,
      amount_uzs,
      payment_provider: provider,
      payment_note: `${provider} orqali`,
    })
    .select('id')
    .single();

  if (error || !reqRow) {
    return NextResponse.json({ error: error?.message || 'insert failed' }, { status: 500 });
  }

  const orderId = reqRow.id;
  const returnUrl = `${SITE_URL}/p-coins?paid=1`;

  if (provider === 'payme') {
    const merchantId = process.env.PAYME_MERCHANT_ID;
    if (!merchantId) return NextResponse.json({ error: 'Payme sozlanmagan' }, { status: 500 });
    // base64(m=...;ac.order_id=...;a=<tiyin>;c=<return>)
    const raw = `m=${merchantId};ac.order_id=${orderId};a=${amount_uzs * 100};c=${returnUrl}`;
    const url = `https://checkout.paycom.uz/${Buffer.from(raw).toString('base64')}`;
    return NextResponse.json({ url, request_id: orderId });
  }

  // click
  const serviceId = process.env.CLICK_SERVICE_ID;
  const merchantId = process.env.CLICK_MERCHANT_ID;
  if (!serviceId || !merchantId) return NextResponse.json({ error: 'Click sozlanmagan' }, { status: 500 });
  const url = `https://my.click.uz/services/pay?service_id=${serviceId}&merchant_id=${merchantId}&amount=${amount_uzs}&transaction_param=${orderId}&return_url=${encodeURIComponent(returnUrl)}`;
  return NextResponse.json({ url, request_id: orderId });
}
