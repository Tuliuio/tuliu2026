// Conta de pagamentos do cliente (painel da Tuliu).
//
// POST /functions/v1/pay-account   Authorization: Bearer <sessão do painel>
//   { action: 'summary', clientId? }  → saldo no Asaas + dados da conta
//       Cliente: só a própria conta. Admin da Tuliu: qualquer clientId.
//   { action: 'setup', slug }         → só admin (ou header x-setup-token = webhook_token)
//       Confere a chave, guarda a carteira (walletId) e cadastra/atualiza o webhook no Asaas.
import { admin, apiKey, asaas, json, safeEqual, type PayAccount } from '../_shared/pay.ts';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-setup-token',
};

const WEBHOOK_EVENTS = [
  'CHECKOUT_PAID',
  'CHECKOUT_CANCELED',
  'CHECKOUT_EXPIRED',
  'PAYMENT_CREATED',
  'PAYMENT_CONFIRMED',
  'PAYMENT_RECEIVED',
  'PAYMENT_OVERDUE',
  'PAYMENT_REFUNDED',
  'PAYMENT_DELETED',
  'PAYMENT_CHARGEBACK_REQUESTED',
  'TRANSFER_CREATED',
  'TRANSFER_PENDING',
  'TRANSFER_IN_BANK_PROCESSING',
  'TRANSFER_DONE',
  'TRANSFER_FAILED',
  'TRANSFER_CANCELLED',
];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405, CORS);
  const db = admin();

  let input: any;
  try {
    input = await req.json();
  } catch {
    return json({ error: 'invalid_request' }, 400, CORS);
  }

  // ------------------------------------------------------------ quem chama
  const jwt = (req.headers.get('authorization') ?? '').replace(/^Bearer\s+/i, '');
  let caller: { id: string; role: string; email: string | null } | null = null;
  if (jwt) {
    const { data } = await db.auth.getUser(jwt);
    if (data?.user) {
      const { data: c } = await db.from('clients').select('id, role').eq('user_id', data.user.id).maybeSingle();
      if (c) caller = { id: c.id, role: c.role, email: data.user.email ?? null };
    }
  }

  // ------------------------------------------------------------ setup
  if (input.action === 'setup') {
    const { data: account } = await db.from('pay_accounts').select('*').eq('slug', String(input.slug ?? '')).maybeSingle();
    if (!account) return json({ error: 'unknown_account' }, 404, CORS);
    const setupToken = req.headers.get('x-setup-token') ?? '';
    const allowed = caller?.role === 'admin' || (setupToken !== '' && safeEqual(setupToken, account.webhook_token));
    if (!allowed) return json({ error: 'forbidden' }, 403, CORS);

    const acc = account as PayAccount;
    const key = await apiKey(db, acc);
    if (!key) return json({ error: 'missing_api_key', hint: `select public.pay_set_api_key('${acc.slug}', '<chave>');` }, 400, CORS);

    const wallets = await asaas(acc, key, 'GET', '/wallets');
    if (wallets.status !== 200) return json({ error: 'invalid_api_key', status: wallets.status }, 400, CORS);
    const walletId = wallets.data?.data?.[0]?.id ?? null;

    const hookUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/pay-webhook?account=${acc.slug}`;
    const hook = {
      name: 'Tuliu Pagamentos',
      url: hookUrl,
      email: String(input.email ?? caller?.email ?? ''),
      enabled: true,
      interrupted: false,
      apiVersion: 3,
      authToken: acc.webhook_token,
      sendType: 'SEQUENTIALLY',
      events: WEBHOOK_EVENTS,
    };
    if (!hook.email) return json({ error: 'missing_email' }, 400, CORS);

    const list = await asaas(acc, key, 'GET', '/webhooks?limit=100');
    const existing = (list.data?.data ?? []).find((w: any) => w.url === hookUrl);
    const saved = existing
      ? await asaas(acc, key, 'PUT', `/webhooks/${existing.id}`, hook)
      : await asaas(acc, key, 'POST', '/webhooks', hook);
    if (saved.status !== 200) {
      return json({ error: 'webhook_error', status: saved.status, detail: saved.data?.errors ?? saved.data }, 502, CORS);
    }

    await db
      .from('pay_accounts')
      .update({ wallet_id: walletId, status: acc.status === 'paused' ? 'paused' : 'active', updated_at: new Date().toISOString() })
      .eq('id', acc.id);
    return json({ ok: true, env: acc.env, walletId, webhookId: saved.data?.id, webhook: existing ? 'updated' : 'created' }, 200, CORS);
  }

  // ------------------------------------------------------------ resumo
  if (input.action === 'summary') {
    if (!caller) return json({ error: 'unauthorized' }, 401, CORS);
    const clientId = caller.role === 'admin' && input.clientId ? String(input.clientId) : caller.id;
    const { data: account } = await db.from('pay_accounts').select('*').eq('client_id', clientId).maybeSingle();
    if (!account) return json({ account: null }, 200, CORS);
    const acc = account as PayAccount;
    const key = await apiKey(db, acc);
    let balance: number | null = null;
    if (key) {
      const res = await asaas(acc, key, 'GET', '/finance/balance');
      if (res.status === 200) balance = Number(res.data?.balance ?? 0);
    }
    return json(
      {
        account: {
          slug: acc.slug,
          env: acc.env,
          status: acc.status,
          platformFeePct: Number(acc.platform_fee_pct),
          billingTypes: acc.billing_types,
          maxInstallments: acc.max_installments,
        },
        balance,
      },
      200,
      CORS,
    );
  }

  return json({ error: 'unknown_action' }, 400, CORS);
});
