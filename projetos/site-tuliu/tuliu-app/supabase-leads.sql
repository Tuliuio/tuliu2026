-- Tabela que recebe os pedidos de diagnóstico do tuliu.io/diagnostico
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  whatsapp text not null,
  business_handle text,
  email text,
  main_challenge text,
  plan_interest text,
  source text,
  language text
);

alter table public.leads enable row level security;

-- Visitantes do site só podem gravar; leitura fica para o painel/service role
create policy "site pode gravar leads" on public.leads
  for insert to anon, authenticated
  with check (true);

grant insert on public.leads to anon, authenticated;
