// Cria um Checkout do Asaas na conta do cliente a partir do carrinho do site dele.
//
// POST /functions/v1/pay-checkout?account=<slug>
//   { items: [{ productId, qty }], form: { name, cityUf, profile, herdSize?, note? },
//     ref?, lang?: 'pt'|'en'|'es', origin?, expectedSubtotal? }
// → 200 { url, orderId } | 4xx/5xx { error }
//
// O preço vem de pay_products, nunca do navegador. Se o site mostrar um subtotal
// diferente (catálogo desatualizado), responde 409 price_mismatch em vez de cobrar
// um valor que o comprador não viu. O split da Tuliu (platform_fee_pct sobre o
// valor líquido) vai para platform_wallet_id.
import { accountBySlug, admin, apiKey, asaas, json, round2 } from '../_shared/pay.ts';

// JPEG 64×64 neutro, usado se a imagem do produto não puder ser baixada
const PLACEHOLDER_JPEG =
  '/9j/2wBDAA0JCgsKCA0LCgsODg0PEyAVExISEyccHhcgLikxMC4pLSwzOko+MzZGNywtQFdBRkxOUlNSMj5aYVpQYEpRUk//2wBDAQ4ODhMREyYVFSZPNS01T09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0//wAARCABAAEADASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAL/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCjAIUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//Z';

const imageCache = new Map<string, string>();

async function imageBase64(url: string | null): Promise<string> {
  if (!url) return PLACEHOLDER_JPEG;
  const cached = imageCache.get(url);
  if (cached) return cached;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
    const type = res.headers.get('content-type') ?? '';
    if (!res.ok || !/image\/(jpeg|png)/.test(type)) throw new Error(`${res.status} ${type}`);
    const bytes = new Uint8Array(await res.arrayBuffer());
    if (bytes.length > 200_000) throw new Error('imagem grande demais');
    let bin = '';
    for (const b of bytes) bin += String.fromCharCode(b);
    const b64 = btoa(bin);
    imageCache.set(url, b64);
    return b64;
  } catch (e) {
    console.warn('imagem do produto indisponível, usando placeholder:', url, String(e));
    return PLACEHOLDER_JPEG;
  }
}

function discountFor(tiers: Array<{ minQty: number; discount: number }>, qty: number): number {
  let d = 0;
  for (const t of tiers ?? []) if (qty >= Number(t.minQty)) d = Number(t.discount) || 0;
  return d;
}

const str = (v: unknown, max: number) => String(v ?? '').trim().slice(0, max);

function orderNumber(slug: string): string {
  const d = new Date();
  const ymd = `${String(d.getUTCFullYear()).slice(2)}${String(d.getUTCMonth() + 1).padStart(2, '0')}${String(d.getUTCDate()).padStart(2, '0')}`;
  const rnd = crypto.getRandomValues(new Uint8Array(3));
  const hex = Array.from(rnd, (b) => b.toString(16).padStart(2, '0')).join('').toUpperCase();
  const prefix = slug.replace(/[^a-z]/g, '').slice(0, 2).toUpperCase() || 'TU';
  return `${prefix}-${ymd}-${hex}`;
}

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const db = admin();
  const account = await accountBySlug(db, url.searchParams.get('account'));
  const origin = req.headers.get('origin') ?? '';
  const originOk = !!account && (origin === '' || account.allowed_origins.includes(origin));
  const cors: Record<string, string> = originOk && origin
    ? {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'content-type',
        'Access-Control-Max-Age': '86400',
        Vary: 'Origin',
      }
    : {};

  if (req.method === 'OPTIONS') return new Response(null, { status: originOk ? 204 : 403, headers: cors });
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405, cors);
  if (!account) return json({ error: 'unknown_account' }, 404);
  if (!originOk) return json({ error: 'forbidden_origin' }, 403);
  if (account.status === 'paused') return json({ error: 'checkout_unavailable' }, 503, cors);

  const key = await apiKey(db, account);
  if (!key) return json({ error: 'checkout_unavailable' }, 503, cors);

  let input: any;
  try {
    input = await req.json();
  } catch {
    return json({ error: 'invalid_request' }, 400, cors);
  }
  if (!Array.isArray(input?.items) || typeof input?.form !== 'object' || input.items.length < 1 || input.items.length > 20) {
    return json({ error: 'invalid_request' }, 400, cors);
  }

  // ---------------------------------------------------------- itens e preço
  const ids = input.items.map((i: any) => String(i?.productId ?? ''));
  const { data: products } = await db
    .from('pay_products')
    .select('external_id, sku, name, unit_price, discount_tiers, image_url')
    .eq('account_id', account.id)
    .eq('active', true)
    .in('external_id', ids);
  const byId = new Map((products ?? []).map((p) => [p.external_id, p]));

  const asaasItems: any[] = [];
  const lines: any[] = [];
  let subtotal = 0;
  for (const raw of input.items) {
    const p = byId.get(String(raw?.productId ?? ''));
    const qty = Number(raw?.qty);
    if (!p || !Number.isInteger(qty) || qty < 1 || qty > 1000) return json({ error: 'invalid_item' }, 400, cors);
    const unit = round2(Number(p.unit_price) * (1 - discountFor(p.discount_tiers, qty)));
    asaasItems.push({
      externalReference: p.sku,
      name: p.name,
      quantity: qty,
      value: unit,
      imageBase64: await imageBase64(p.image_url),
    });
    lines.push({ sku: p.sku, productId: p.external_id, name: p.name, qty, unit });
    subtotal = round2(subtotal + unit * qty);
  }

  if (input.expectedSubtotal !== undefined && Math.abs(Number(input.expectedSubtotal) - subtotal) > 0.009) {
    console.warn(`price_mismatch ${account.slug}: site ${input.expectedSubtotal} x servidor ${subtotal}`);
    return json({ error: 'price_mismatch', subtotal }, 409, cors);
  }

  const shipping = round2(Number(account.shipping_fixed) || 0);
  if (shipping > 0) {
    asaasItems.push({ name: 'Frete', quantity: 1, value: shipping, imageBase64: asaasItems[0].imageBase64 });
  }
  const total = round2(subtotal + shipping);

  // ---------------------------------------------------------- comprador
  const f = input.form;
  const customer = {
    name: str(f.name, 120),
    cityUf: str(f.cityUf, 80),
    profile: str(f.profile, 60),
    herdSize: str(f.herdSize, 10),
    note: str(f.note, 500),
  };
  if (!customer.name || !customer.cityUf || !customer.profile) return json({ error: 'invalid_form' }, 400, cors);

  const lang = ['pt', 'en', 'es'].includes(input.lang) ? input.lang : 'pt';
  const site = account.site_url.replace(/\/$/, '');
  const successPath = account.success_paths[lang] ?? account.success_paths.pt ?? '/';
  const homePath = lang === 'pt' ? '/' : `/${lang}/`;
  const number = orderNumber(account.slug);

  // Pedido gravado antes de falar com o Asaas: o webhook sempre acha a quem pertence
  const { data: order, error: orderErr } = await db
    .from('pay_orders')
    .insert({
      account_id: account.id,
      client_id: account.client_id,
      order_number: number,
      env: account.env,
      items: lines,
      subtotal,
      shipping,
      total,
      customer,
      lang,
      ref: str(input.ref, 40),
      origin: str(input.origin, 200),
    })
    .select('id')
    .single();
  if (orderErr) {
    console.error('pay_orders insert', orderErr.message);
    return json({ error: 'internal_error' }, 500, cors);
  }

  const body: Record<string, unknown> = {
    billingTypes: account.billing_types,
    chargeTypes: account.max_installments > 1 ? ['DETACHED', 'INSTALLMENT'] : ['DETACHED'],
    minutesToExpire: account.minutes_to_expire,
    externalReference: number,
    callback: {
      successUrl: `${site}${successPath}?pedido=${number}`,
      cancelUrl: `${site}${homePath}`,
      expiredUrl: `${site}${homePath}`,
    },
    items: asaasItems,
    customerData: { name: customer.name },
  };
  if (account.max_installments > 1) body.installment = { maxInstallmentCount: account.max_installments };
  if (account.platform_wallet_id && Number(account.platform_fee_pct) > 0) {
    body.splits = [{ walletId: account.platform_wallet_id, percentageValue: Number(account.platform_fee_pct) }];
  }

  const res = await asaas(account, key, 'POST', '/checkouts', body);
  if (res.status !== 200 || !res.data?.link) {
    console.error('asaas checkout', res.status, JSON.stringify(res.data).slice(0, 800));
    await db.from('pay_orders').update({ status: 'canceled', updated_at: new Date().toISOString() }).eq('id', order.id);
    return json({ error: 'asaas_error' }, 502, cors);
  }

  await db.from('pay_orders').update({ checkout_id: res.data.id, updated_at: new Date().toISOString() }).eq('id', order.id);
  return json({ url: res.data.link, orderId: number }, 200, cors);
});
