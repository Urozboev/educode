/**
 * EduCode AI Agent — obuna to'lovini boshlash.
 *
 * POST { plan, months, provider } → provayder to'lov sahifasi URL'i
 * GET                             → hozirgi obuna holati
 *
 * Obunani BU ROUTE yoqmaydi. U faqat "pending" yozuv yaratadi va
 * to'lov havolasini qaytaradi. Obuna Payme/Click webhook'i to'lovni
 * tasdiqlagandan keyin `activate_agent_subscription()` orqali
 * yoqiladi.
 *
 * Aks holda "to'lov sahifasini ochdim" degan narsa obuna berardi —
 * ya'ni pul to'lamasdan ham.
 */

import { NextRequest } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { SITE_URL } from '@/lib/seo';
import { getAgentAccess, subscriptionAmount, MONTH_OPTIONS } from '@/lib/agent/access';
import type { AgentPlan } from '@/lib/agent/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const PAID_PLANS: Exclude<AgentPlan, 'free'>[] = ['pro', 'pro_plus'];

export async function GET() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Tizimga kiring' }, { status: 401 });

  const access = await getAgentAccess(supabase, user.id);

  const { data: history } = await supabase
    .from('agent_subscription_events')
    .select('plan, months, amount_uzs, status, payment_provider, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10);

  return Response.json({ access, history: history || [] });
}

export async function POST(req: NextRequest) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Tizimga kiring' }, { status: 401 });

  const body = await req.json().catch(() => ({} as any));
  const plan = body.plan as Exclude<AgentPlan, 'free'>;
  const months = Number(body.months) || 1;
  const provider = body.provider as 'payme' | 'click';

  if (!PAID_PLANS.includes(plan)) {
    return Response.json({ error: "Noto'g'ri tarif" }, { status: 400 });
  }
  if (!(MONTH_OPTIONS as readonly number[]).includes(months)) {
    return Response.json({ error: "Noto'g'ri muddat" }, { status: 400 });
  }
  if (!['payme', 'click'].includes(provider)) {
    return Response.json({ error: "Noto'g'ri to'lov usuli" }, { status: 400 });
  }

  // Summani server hisoblaydi — mijozdan kelgan qiymat ishlatilmaydi
  const amountUzs = subscriptionAmount(plan, months);

  const { data: event, error } = await supabase
    .from('agent_subscription_events')
    .insert({
      user_id: user.id,
      plan,
      months,
      amount_uzs: amountUzs,
      payment_provider: provider,
      status: 'pending',
      note: `${plan} · ${months} oy`,
    })
    .select('id')
    .single();

  if (error || !event) {
    return Response.json({ error: error?.message || 'Buyurtma yaratilmadi' }, { status: 500 });
  }

  const returnUrl = `${SITE_URL}/agent/obuna?paid=1`;

  if (provider === 'payme') {
    const merchantId = process.env.PAYME_MERCHANT_ID;
    if (!merchantId) return Response.json({ error: 'Payme sozlanmagan' }, { status: 500 });

    // base64(m=...;ac.order_id=...;a=<tiyin>;c=<return>)
    const raw = `m=${merchantId};ac.order_id=${event.id};a=${amountUzs * 100};c=${returnUrl}`;
    const url = `https://checkout.paycom.uz/${Buffer.from(raw).toString('base64')}`;
    return Response.json({ url, orderId: event.id, amountUzs });
  }

  const serviceId = process.env.CLICK_SERVICE_ID;
  const clickMerchant = process.env.CLICK_MERCHANT_ID;
  if (!serviceId || !clickMerchant) {
    return Response.json({ error: 'Click sozlanmagan' }, { status: 500 });
  }

  const url =
    `https://my.click.uz/services/pay?service_id=${serviceId}` +
    `&merchant_id=${clickMerchant}&amount=${amountUzs}` +
    `&transaction_param=${event.id}&return_url=${encodeURIComponent(returnUrl)}`;

  return Response.json({ url, orderId: event.id, amountUzs });
}
