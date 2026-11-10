// Webhook do Asaas para as contas operadas pela Tuliu (uma URL por conta):
//   https://<projeto>.supabase.co/functions/v1/pay-webhook?account=<slug>
// O token é pay_accounts.webhook_token (a função pay-account cadastra o webhook no Asaas).
//
// Grava o evento bruto em pay_events (o id do evento evita processar duas vezes),
// espelha pedidos, cobranças e transferências e, no pedido pago, posta um card no
// painel do cliente. Erros de dados respondem 200 para não travar a fila do Asaas.
import { accountBySlug, admin, brl, json, round2, safeEqual, type PayAccount } from '../_shared/pay.ts';
import type { SupabaseClient } from 'jsr:@supabase/supabase-js@2';

const now = () => new Date().toISOString();
const date = (v: unknown) => (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}/.test(v) ? v.slice(0, 10) : null);

const ORDER_STATUS: Record<string, string> = {
  CHECKOUT_PAID: 'paid',
  CHECKOUT_CANCELED: 'canceled',
  CHECKOUT_EXPIRED: 'expired',
};

async function orderPaid(db: SupabaseClient, account: PayAccount, checkoutId: string) {
  const { data: order } = await db
    .from('pay_orders')
    .update({ status: 'paid', paid_at: now(), updated_at: now() })
    .eq('account_id', account.id)
    .eq('checkout_id', checkoutId)
    .neq('status', 'paid')
    .select('id, order_number, items, total, shipping, customer')
    .maybeSingle();
  if (!order) return; // já estava pago (evento repetido com outro id) ou pedido de fora do site

  const items = (order.items as any[]).map((i) => `${i.qty} × ${i.name}`).join(', ');
  const c = order.customer as Record<string, string>;
  const sandbox = account.env === 'sandbox' ? '[Teste] ' : '';
  await db.from('client_updates').insert({
    client_id: account.client_id,
    kind: 'novidade',
    status: 'concluido',
    title: `${sandbox}Venda no site: ${brl(Number(order.total))}`,
    body: `Pedido ${order.order_number}: ${items}. Cliente: ${c.name}, ${c.cityUf}. Os dados de entrega estão na aba Pagamentos.`,
    created_by: 'Tuliu Pagamentos',
  });
}

async function upsertPayment(db: SupabaseClient, account: PayAccount, p: any, event: string) {
  const checkoutId = p.checkoutSession ?? null;
  let orderId: string | null = null;
  if (checkoutId) {
    const { data } = await db.from('pay_orders').select('id').eq('account_id', account.id).eq('checkout_id', checkoutId).maybeSingle();
    orderId = data?.id ?? null;
  }
  const net = p.netValue != null ? Number(p.netValue) : null;
  const split = Array.isArray(p.split)
    ? p.split.find((s: any) => s.walletId === account.platform_wallet_id)
    : null;
  const platformFee = split
    ? Number(split.totalValue ?? split.fixedValue ?? 0)
    : account.platform_wallet_id && net != null
      ? round2((net * Number(account.platform_fee_pct)) / 100)
      : 0;

  const { error } = await db.from('pay_payments').upsert(
    {
      asaas_id: p.id,
      account_id: account.id,
      client_id: account.client_id,
      order_id: orderId,
      checkout_id: checkoutId,
      env: account.env,
      status: p.status ?? event.replace('PAYMENT_', ''),
      billing_type: p.billingType ?? null,
      value: Number(p.value),
      net_value: net,
      platform_fee: platformFee,
      installment_count: p.installmentCount ?? null,
      due_date: date(p.dueDate),
      payment_date: date(p.paymentDate ?? p.clientPaymentDate ?? p.confirmedDate),
      credit_date: date(p.creditDate ?? p.estimatedCreditDate),
      updated_at: now(),
    },
    { onConflict: 'asaas_id' },
  );
  if (error) throw new Error(`pay_payments: ${error.message}`);

  if (orderId && (event === 'PAYMENT_REFUNDED' || event === 'PAYMENT_CHARGEBACK_REQUESTED')) {
    await db.from('pay_orders').update({ status: 'refunded', updated_at: now() }).eq('id', orderId);
  }
}

async function upsertTransfer(db: SupabaseClient, account: PayAccount, t: any) {
  const { error } = await db.from('pay_transfers').upsert(
    {
      asaas_id: t.id,
      account_id: account.id,
      client_id: account.client_id,
      env: account.env,
      status: t.status,
      value: Number(t.value),
      net_value: t.netValue != null ? Number(t.netValue) : null,
      transfer_fee: t.transferFee != null ? Number(t.transferFee) : null,
      type: t.type ?? t.operationType ?? null,
      effective_date: date(t.effectiveDate),
      scheduled_date: date(t.scheduleDate),
      updated_at: now(),
    },
    { onConflict: 'asaas_id' },
  );
  if (error) throw new Error(`pay_transfers: ${error.message}`);
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);
  const db = admin();
  const account = await accountBySlug(db, new URL(req.url).searchParams.get('account'));
  const token = req.headers.get('asaas-access-token') ?? '';
  if (!account || !safeEqual(token, account.webhook_token)) return json({ error: 'unauthorized' }, 401);

  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return json({ error: 'invalid_json' }, 400);
  }
  const event = String(payload?.event ?? '');
  const eventId = String(payload?.id ?? `${event}:${payload?.payment?.id ?? payload?.checkout?.id ?? payload?.transfer?.id ?? crypto.randomUUID()}:${payload?.dateCreated ?? ''}`);

  const { data: logged } = await db
    .from('pay_events')
    .upsert({ account_id: account.id, event_id: eventId, event, payload }, { onConflict: 'event_id', ignoreDuplicates: true })
    .select('id');
  if (!logged?.length) return json({ ok: true, duplicate: true });

  try {
    if (event in ORDER_STATUS) {
      const checkoutId = payload.checkout?.id;
      if (checkoutId) {
        if (event === 'CHECKOUT_PAID') await orderPaid(db, account, checkoutId);
        else
          await db
            .from('pay_orders')
            .update({ status: ORDER_STATUS[event], updated_at: now() })
            .eq('account_id', account.id)
            .eq('checkout_id', checkoutId)
            .eq('status', 'created');
      }
    } else if (event.startsWith('PAYMENT_') && payload.payment?.id) {
      await upsertPayment(db, account, payload.payment, event);
    } else if (event.startsWith('TRANSFER_') && payload.transfer?.id) {
      await upsertTransfer(db, account, payload.transfer);
    }
  } catch (e) {
    console.error('pay-webhook', account.slug, event, String(e));
    await db.from('pay_events').update({ error: String(e).slice(0, 500) }).eq('event_id', eventId);
  }
  return json({ ok: true });
});
