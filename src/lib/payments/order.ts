/**
 * EduCode — to'lov buyurtmasi abstraksiyasi.
 *
 * Platformada ikki xil to'lov bor:
 *   - coin xaridi        → `coin_purchase_requests`
 *   - agent obunasi      → `agent_subscription_events`
 *
 * Payme va Click webhook'lari ikkalasiga ham bitta endpoint orqali
 * keladi (Payme'da bitta kassaga bitta URL beriladi — obuna uchun
 * alohida endpoint alohida kassa ochishni talab qilardi).
 *
 * Shu sababli webhook kodi jadval nomini bilmasligi kerak: u shu
 * yerdagi funksiyalar bilan ishlaydi, buyurtma qaysi jadvaldan
 * kelgani `kind` da qoladi.
 */

import type { SupabaseClient } from '@supabase/supabase-js';

export type OrderKind = 'coins' | 'agent_subscription';

export interface PaymentOrder {
  kind: OrderKind;
  id: string;
  amount_uzs: number;
  /** To'lov yakunlanganmi — har jadvalda o'z belgisi bor */
  isPaid: boolean;
  provider_txn_id: string | null;
  payme_state: number | null;
  payme_create_time: number | null;
  payme_perform_time: number | null;
  payme_cancel_time: number | null;
}

const TABLE: Record<OrderKind, string> = {
  coins: 'coin_purchase_requests',
  agent_subscription: 'agent_subscription_events',
};

/** Har jadvalda "to'landi" boshqacha ifodalanadi */
const PAID_STATUS: Record<OrderKind, string> = {
  coins: 'approved',
  agent_subscription: 'paid',
};

function toOrder(kind: OrderKind, row: any): PaymentOrder {
  return {
    kind,
    id: row.id,
    amount_uzs: Number(row.amount_uzs),
    isPaid: row.status === PAID_STATUS[kind],
    provider_txn_id: row.provider_txn_id ?? null,
    payme_state: row.payme_state ?? null,
    payme_create_time: row.payme_create_time ?? null,
    payme_perform_time: row.payme_perform_time ?? null,
    payme_cancel_time: row.payme_cancel_time ?? null,
  };
}

/**
 * Buyurtmani id bo'yicha topadi. Ikkala jadval ham UUID kalitdan
 * foydalanadi, shuning uchun to'qnashuv bo'lmaydi.
 */
export async function findOrderById(
  admin: SupabaseClient,
  id: string,
): Promise<PaymentOrder | null> {
  if (!id) return null;

  const { data: coin } = await admin
    .from(TABLE.coins).select('*').eq('id', id).maybeSingle();
  if (coin) return toOrder('coins', coin);

  const { data: sub } = await admin
    .from(TABLE.agent_subscription).select('*').eq('id', id).maybeSingle();
  if (sub) return toOrder('agent_subscription', sub);

  return null;
}

/** Payme `PerformTransaction`/`CheckTransaction` da faqat o'z tranzaksiya id si keladi */
export async function findOrderByTxn(
  admin: SupabaseClient,
  txnId: string,
): Promise<PaymentOrder | null> {
  if (!txnId) return null;

  const { data: coin } = await admin
    .from(TABLE.coins).select('*').eq('provider_txn_id', txnId).maybeSingle();
  if (coin) return toOrder('coins', coin);

  const { data: sub } = await admin
    .from(TABLE.agent_subscription).select('*').eq('provider_txn_id', txnId).maybeSingle();
  if (sub) return toOrder('agent_subscription', sub);

  return null;
}

export async function updateOrder(
  admin: SupabaseClient,
  order: PaymentOrder,
  patch: Record<string, unknown>,
): Promise<void> {
  await admin.from(TABLE[order.kind]).update(patch).eq('id', order.id);
}

/**
 * To'lov tasdiqlangandan keyingi amal. Ikkala RPC ham idempotent:
 * provayder callback'ni takrorlasa, coin ikki marta qo'shilmaydi va
 * obuna ikki marta uzaytirilmaydi.
 */
export async function fulfillOrder(
  admin: SupabaseClient,
  order: PaymentOrder,
): Promise<void> {
  if (order.kind === 'coins') {
    await admin.rpc('credit_coins_for_purchase', { p_request_id: order.id });
  } else {
    await admin.rpc('activate_agent_subscription', { p_event_id: order.id });
  }
}

/** Bekor qilinganda buyurtma holati. To'langan buyurtma holati o'zgarmaydi. */
export function cancelledStatus(order: PaymentOrder): string {
  if (order.isPaid) return PAID_STATUS[order.kind];
  return order.kind === 'coins' ? 'rejected' : 'failed';
}
