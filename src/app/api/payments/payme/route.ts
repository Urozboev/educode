import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import {
  findOrderById, findOrderByTxn, updateOrder, fulfillOrder, cancelledStatus,
} from '@/lib/payments/order';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Payme Merchant API (JSON-RPC 2.0) webhook.
 * Payme dashboard'da "Endpoint URL" sifatida ko'rsatiladi:
 *   https://malla.uz/api/payments/payme
 * Auth: Basic base64("Paycom:" + PAYME_KEY)
 *
 * Kerakli env:
 *   PAYME_MERCHANT_ID  — kabinetdan (majburiy emas, tekshiruv uchun)
 *   PAYME_KEY          — kassa kaliti (Test yoki Prod)
 *
 * "account" parametri: { order_id: <buyurtma UUID> }
 * amount — tiyin (so'm * 100)
 *
 * Buyurtma ikki xil bo'lishi mumkin — coin xaridi yoki agent obunasi.
 * Qaysi jadvaldan ekanini `@/lib/payments/order` hal qiladi: Payme'da
 * bitta kassaga bitta endpoint URL beriladi, shuning uchun ikkalasi
 * ham shu yerdan o'tadi.
 */

const ERR = {
  auth: { code: -32504, message: { uz: "Ruxsat yo'q", ru: "Нет доступа", en: "Auth failed" } },
  method: { code: -32601, message: { uz: "Metod topilmadi", ru: "Метод не найден", en: "Method not found" } },
  order: { code: -31050, message: { uz: "Buyurtma topilmadi", ru: "Заказ не найден", en: "Order not found" } },
  amount: { code: -31001, message: { uz: "Noto'g'ri summa", ru: "Неверная сумма", en: "Wrong amount" } },
  txnNotFound: { code: -31003, message: { uz: "Tranzaksiya topilmadi", ru: "Транзакция не найдена", en: "Transaction not found" } },
  cannotPerform: { code: -31008, message: { uz: "Amalni bajarib bo'lmaydi", ru: "Невозможно", en: "Cannot perform" } },
};

function rpc(id: any, result?: any, error?: any) {
  return NextResponse.json(error ? { jsonrpc: '2.0', id, error } : { jsonrpc: '2.0', id, result });
}

function checkAuth(req: NextRequest): boolean {
  const key = process.env.PAYME_KEY;
  if (!key) return false;
  const auth = req.headers.get('authorization') || '';
  if (!auth.startsWith('Basic ')) return false;
  try {
    const decoded = Buffer.from(auth.slice(6), 'base64').toString('utf8'); // "Paycom:KEY"
    return decoded === `Paycom:${key}`;
  } catch { return false; }
}

export async function POST(req: NextRequest) {
  let body: any;
  try { body = await req.json(); } catch { return rpc(null, undefined, ERR.method); }
  const { method, params, id } = body || {};

  if (!checkAuth(req)) return rpc(id, undefined, ERR.auth);

  const admin = createAdminClient();
  const orderId = params?.account?.order_id;

  try {
    switch (method) {
      case 'CheckPerformTransaction': {
        const r = await findOrderById(admin, orderId);
        if (!r) return rpc(id, undefined, ERR.order);
        if (Number(params.amount) !== r.amount_uzs * 100) return rpc(id, undefined, ERR.amount);
        if (r.isPaid) return rpc(id, undefined, ERR.cannotPerform);
        return rpc(id, { allow: true });
      }

      case 'CreateTransaction': {
        const r = await findOrderById(admin, orderId);
        if (!r) return rpc(id, undefined, ERR.order);
        if (Number(params.amount) !== r.amount_uzs * 100) return rpc(id, undefined, ERR.amount);

        // Allaqachon shu Payme tranzaksiyasi bormi?
        if (r.provider_txn_id && r.provider_txn_id === params.id) {
          return rpc(id, { create_time: r.payme_create_time, transaction: r.id, state: r.payme_state || 1 });
        }
        if (r.provider_txn_id && r.provider_txn_id !== params.id) {
          return rpc(id, undefined, ERR.cannotPerform); // boshqa tranzaksiya band qilgan
        }

        const now = Date.now();
        await updateOrder(admin, r, {
          payment_provider: 'payme', provider_txn_id: params.id,
          payme_state: 1, payme_create_time: now,
        });
        return rpc(id, { create_time: now, transaction: r.id, state: 1 });
      }

      case 'PerformTransaction': {
        const r = await findOrderByTxn(admin, params?.id);
        if (!r) return rpc(id, undefined, ERR.txnNotFound);
        if (r.payme_state === 2) {
          return rpc(id, { transaction: r.id, perform_time: r.payme_perform_time, state: 2 });
        }
        if (r.payme_state !== 1) return rpc(id, undefined, ERR.cannotPerform);

        const now = Date.now();
        await updateOrder(admin, r, { payme_state: 2, payme_perform_time: now });
        // Coin qo'shish yoki obunani yoqish — ikkalasi ham idempotent
        await fulfillOrder(admin, r);
        return rpc(id, { transaction: r.id, perform_time: now, state: 2 });
      }

      case 'CancelTransaction': {
        const r = await findOrderByTxn(admin, params?.id);
        if (!r) return rpc(id, undefined, ERR.txnNotFound);
        const now = Date.now();
        const newState = r.payme_state === 2 ? -2 : -1;
        await updateOrder(admin, r, {
          payme_state: newState, payme_cancel_time: now,
          status: cancelledStatus(r),
        });
        return rpc(id, { transaction: r.id, cancel_time: now, state: newState });
      }

      case 'CheckTransaction': {
        const r = await findOrderByTxn(admin, params?.id);
        if (!r) return rpc(id, undefined, ERR.txnNotFound);
        return rpc(id, {
          create_time: r.payme_create_time || 0,
          perform_time: r.payme_perform_time || 0,
          cancel_time: r.payme_cancel_time || 0,
          transaction: r.id, state: r.payme_state || 0, reason: null,
        });
      }

      case 'GetStatement':
        return rpc(id, { transactions: [] });

      default:
        return rpc(id, undefined, ERR.method);
    }
  } catch (e: any) {
    console.error('payme error:', e);
    return rpc(id, undefined, ERR.cannotPerform);
  }
}
