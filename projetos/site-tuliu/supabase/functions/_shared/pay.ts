// Comum às funções de Pagamentos (pay-checkout, pay-webhook, pay-account).
// A Tuliu opera a conta Asaas de cada cliente: a chave fica no Vault e só as
// funções (service role) leem, pela RPC pay_get_api_key.
import { createClient, type SupabaseClient } from 'jsr:@supabase/supabase-js@2';

export const ASAAS_BASE: Record<string, string> = {
  sandbox: 'https://api-sandbox.asaas.com/v3',
  production: 'https://api.asaas.com/v3',
};

export interface PayAccount {
  id: string;
  client_id: string;
  slug: string;
  env: 'sandbox' | 'production';
  status: 'setup' | 'active' | 'paused';
  api_key_secret_id: string | null;
  wallet_id: string | null;
  webhook_token: string;
  platform_wallet_id: string | null;
  platform_fee_pct: number;
  billing_types: string[];
  max_installments: number;
  shipping_fixed: number;
  minutes_to_expire: number;
  site_url: string;
  success_paths: Record<string, string>;
  allowed_origins: string[];
}

export function admin(): SupabaseClient {
  return createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
    auth: { persistSession: false },
  });
}

export async function accountBySlug(db: SupabaseClient, slug: string | null): Promise<PayAccount | null> {
  if (!slug || !/^[a-z0-9-]{3,40}$/.test(slug)) return null;
  const { data } = await db.from('pay_accounts').select('*').eq('slug', slug).maybeSingle();
  return data as PayAccount | null;
}

export async function apiKey(db: SupabaseClient, account: PayAccount): Promise<string | null> {
  if (!account.api_key_secret_id) return null;
  const { data, error } = await db.rpc('pay_get_api_key', { p_account_id: account.id });
  if (error) console.error('pay_get_api_key', error.message);
  return (data as string | null) ?? null;
}

/** Chamada à API do Asaas na conta do cliente. Nunca registra a chave em log. */
export async function asaas(
  account: PayAccount,
  key: string,
  method: string,
  path: string,
  body?: unknown,
): Promise<{ status: number; data: any }> {
  const res = await fetch(ASAAS_BASE[account.env] + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'TuliuPagamentos/1.0',
      access_token: key,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text.slice(0, 500) };
  }
  return { status: res.status, data };
}

export function json(body: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...headers },
  });
}

/** Comparação em tempo constante para tokens. */
export function safeEqual(a: string, b: string): boolean {
  const ea = new TextEncoder().encode(a);
  const eb = new TextEncoder().encode(b);
  if (ea.length !== eb.length) return false;
  let diff = 0;
  for (let i = 0; i < ea.length; i++) diff |= ea[i] ^ eb[i];
  return diff === 0;
}

export const round2 = (n: number) => Math.round(n * 100) / 100;

export const brl = (n: number) =>
  'R$ ' + n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
