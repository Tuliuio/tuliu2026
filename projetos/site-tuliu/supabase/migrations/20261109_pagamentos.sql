-- Pagamentos como serviço da Tuliu: a Tuliu opera a conta Asaas do cliente pela API.
-- Cada cliente tem uma conta (pay_accounts), com a chave guardada no Vault.
-- O site do cliente cria o checkout pela função pay-checkout; o webhook (pay-webhook)
-- espelha pedidos, cobranças e transferências aqui, e a aba Pagamentos lê dessas tabelas.

create table public.pay_accounts (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null unique references public.clients(id) on delete cascade,
  slug text not null unique check (slug ~ '^[a-z0-9-]{3,40}$'),
  env text not null default 'sandbox' check (env in ('sandbox', 'production')),
  status text not null default 'setup' check (status in ('setup', 'active', 'paused')),
  api_key_secret_id uuid,                     -- vault.secrets.id
  wallet_id text,                             -- carteira do próprio cliente no Asaas
  webhook_token text not null default encode(extensions.gen_random_bytes(24), 'hex'),
  platform_wallet_id text,                    -- carteira da Tuliu que recebe o split
  platform_fee_pct numeric(6,4) not null default 1 check (platform_fee_pct between 0 and 100),
  billing_types text[] not null default array['PIX', 'CREDIT_CARD'],
  max_installments int not null default 1 check (max_installments between 1 and 21),
  shipping_fixed numeric(10,2) not null default 0,
  minutes_to_expire int not null default 60 check (minutes_to_expire between 10 and 1440),
  site_url text not null,
  success_paths jsonb not null default '{"pt": "/pedido-confirmado/"}',
  allowed_origins text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.pay_products (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.pay_accounts(id) on delete cascade,
  sku text not null,
  external_id text not null,                  -- id do produto no site (ex.: milktest-a2)
  name text not null check (char_length(name) <= 30),
  unit_price numeric(10,2) not null check (unit_price > 0),
  discount_tiers jsonb not null default '[]', -- [{"minQty": 3, "discount": 0.05}]
  image_base64 text not null,                 -- JPEG pequeno, o Checkout do Asaas exige
  active boolean not null default true,
  updated_at timestamptz not null default now(),
  unique (account_id, external_id)
);

create table public.pay_orders (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.pay_accounts(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  order_number text not null unique,
  checkout_id text unique,
  env text not null,
  status text not null default 'created' check (status in ('created', 'paid', 'canceled', 'expired', 'refunded')),
  items jsonb not null,
  subtotal numeric(12,2) not null,
  shipping numeric(12,2) not null default 0,
  total numeric(12,2) not null,
  customer jsonb not null default '{}',
  lang text,
  ref text,
  origin text,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.pay_orders (client_id, created_at desc);

create table public.pay_payments (
  asaas_id text primary key,
  account_id uuid not null references public.pay_accounts(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  order_id uuid references public.pay_orders(id) on delete set null,
  checkout_id text,
  env text not null,
  status text not null,
  billing_type text,
  value numeric(12,2) not null,
  net_value numeric(12,2),
  platform_fee numeric(12,2) not null default 0,
  installment_count int,
  due_date date,
  payment_date date,
  credit_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.pay_payments (client_id, payment_date desc);

create table public.pay_transfers (
  asaas_id text primary key,
  account_id uuid not null references public.pay_accounts(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  env text not null,
  status text not null,
  value numeric(12,2) not null,
  net_value numeric(12,2),
  transfer_fee numeric(12,2),
  type text,
  effective_date date,
  scheduled_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.pay_transfers (client_id, created_at desc);

-- Registro bruto dos webhooks (só admin): auditoria e reprocessamento
create table public.pay_events (
  id bigint generated always as identity primary key,
  account_id uuid references public.pay_accounts(id) on delete cascade,
  event_id text not null unique,
  event text not null,
  payload jsonb not null,
  error text,
  received_at timestamptz not null default now()
);

-- RLS: o cliente lê o que é dele; o admin da Tuliu lê tudo; escrita só pelas funções (service role)
alter table public.pay_accounts enable row level security;
alter table public.pay_products enable row level security;
alter table public.pay_orders enable row level security;
alter table public.pay_payments enable row level security;
alter table public.pay_transfers enable row level security;
alter table public.pay_events enable row level security;

create policy "Admin lê contas de pagamento" on public.pay_accounts for select to authenticated using (is_admin());
create policy "Admin lê produtos" on public.pay_products for select to authenticated using (is_admin());
create policy "Admin lê eventos" on public.pay_events for select to authenticated using (is_admin());
create policy "Admin lê pedidos" on public.pay_orders for select to authenticated using (is_admin());
create policy "Cliente lê seus pedidos" on public.pay_orders for select to authenticated using (client_id = my_client_id());
create policy "Admin lê cobranças" on public.pay_payments for select to authenticated using (is_admin());
create policy "Cliente lê suas cobranças" on public.pay_payments for select to authenticated using (client_id = my_client_id());
create policy "Admin lê transferências" on public.pay_transfers for select to authenticated using (is_admin());
create policy "Cliente lê suas transferências" on public.pay_transfers for select to authenticated using (client_id = my_client_id());

-- Chave da API no Vault. Só roda no SQL Editor (postgres) ou pelas funções (service role):
--   select public.pay_set_api_key('dairytech', '$aact_...');
create or replace function public.pay_set_api_key(p_slug text, p_key text)
returns void
language plpgsql
security definer
set search_path = public, vault
as $$
declare
  v_account public.pay_accounts;
  v_secret uuid;
begin
  select * into v_account from public.pay_accounts where slug = p_slug;
  if not found then
    raise exception 'conta % não encontrada', p_slug;
  end if;
  if p_key !~ '^\$aact_' then
    raise exception 'chave do Asaas inválida (deve começar com $aact_)';
  end if;
  if v_account.api_key_secret_id is null then
    v_secret := vault.create_secret(p_key, 'asaas_' || p_slug, 'Chave Asaas da conta ' || p_slug);
    update public.pay_accounts set api_key_secret_id = v_secret, updated_at = now() where id = v_account.id;
  else
    perform vault.update_secret(v_account.api_key_secret_id, p_key);
  end if;
end;
$$;

create or replace function public.pay_get_api_key(p_account_id uuid)
returns text
language sql
security definer
set search_path = public, vault
as $$
  select s.decrypted_secret
  from public.pay_accounts a
  join vault.decrypted_secrets s on s.id = a.api_key_secret_id
  where a.id = p_account_id;
$$;

revoke all on function public.pay_set_api_key(text, text) from public, anon, authenticated;
revoke all on function public.pay_get_api_key(uuid) from public, anon, authenticated;
grant execute on function public.pay_get_api_key(uuid) to service_role;
