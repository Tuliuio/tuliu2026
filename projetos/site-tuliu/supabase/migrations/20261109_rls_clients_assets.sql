-- Liga a RLS em clients, assets e activation_requests.
-- Antes: as três tabelas estavam abertas para quem tivesse a chave pública do site
-- (ler e alterar nomes, e-mails, telefones, planos e ativos de todos os clientes).
--
-- Regras:
--   clients              cliente lê e edita só a própria linha, e só nome, empresa e onboarding;
--                        admin lê e edita tudo; criação só pelo trigger handle_new_user
--   assets               cliente lê os seus, pede ativo novo (status pending) e liga/desliga
--                        os que já estão ativos; admin faz tudo
--   activation_requests  admin faz tudo; cliente só lê as suas
-- As funções com service role (webhooks, pay-*) não passam pela RLS.

-- ------------------------------------------------------------------ clients
drop policy if exists "Usuários autenticados podem criar clientes" on public.clients;
drop policy if exists "Clientes podem ver seus próprios dados" on public.clients;
drop policy if exists "Clientes podem atualizar seus próprios dados" on public.clients;

create policy "Cliente lê a própria linha, admin lê todas" on public.clients
  for select to authenticated using (user_id = auth.uid() or is_admin());
create policy "Cliente edita a própria linha, admin edita todas" on public.clients
  for update to authenticated
  using (user_id = auth.uid() or is_admin())
  with check (user_id = auth.uid() or is_admin());
create policy "Admin exclui clientes" on public.clients
  for delete to authenticated using (is_admin());

-- Cliente só muda nome, empresa e onboarding. Sem isto, a policy de UPDATE deixaria
-- um cliente trocar o próprio role para 'admin', o plano ou o status.
create or replace function public.clients_guard_update()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if current_user in ('authenticated', 'anon') and not is_admin() then
    if new.id is distinct from old.id
      or new.user_id is distinct from old.user_id
      or new.role is distinct from old.role
      or new.email is distinct from old.email
      or new.plan_id is distinct from old.plan_id
      or new.status is distinct from old.status
      or new.custom_price is distinct from old.custom_price
      or new.phone is distinct from old.phone
      or new.asaas_customer_id is distinct from old.asaas_customer_id
      or new.asaas_subscription_id is distinct from old.asaas_subscription_id
      or new.created_at is distinct from old.created_at
    then
      raise exception 'Alteração não permitida' using errcode = '42501';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists clients_guard_update on public.clients;
create trigger clients_guard_update before update on public.clients
  for each row execute function public.clients_guard_update();

alter table public.clients enable row level security;

-- ------------------------------------------------------------------ assets
drop policy if exists "Clientes podem ver seus próprios ativos" on public.assets;
drop policy if exists "Clientes podem criar ativos" on public.assets;
drop policy if exists "Clientes podem atualizar seus ativos" on public.assets;

create policy "Cliente lê seus ativos, admin lê todos" on public.assets
  for select to authenticated using (client_id = my_client_id() or is_admin());
create policy "Cliente pede ativo, admin cria qualquer um" on public.assets
  for insert to authenticated
  with check (is_admin() or (client_id = my_client_id() and status = 'pending'));
create policy "Cliente edita seus ativos, admin edita todos" on public.assets
  for update to authenticated
  using (client_id = my_client_id() or is_admin())
  with check (client_id = my_client_id() or is_admin());
create policy "Admin exclui ativos" on public.assets
  for delete to authenticated using (is_admin());

-- Cliente só liga e desliga um ativo que a Tuliu já ativou; não aprova o próprio pedido.
create or replace function public.assets_guard_update()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if current_user in ('authenticated', 'anon') and not is_admin() then
    if new.id is distinct from old.id
      or new.client_id is distinct from old.client_id
      or new.type is distinct from old.type
      or new.name is distinct from old.name
      or new.url is distinct from old.url
      or new.description is distinct from old.description
      or new.created_at is distinct from old.created_at
      or old.status not in ('active', 'inactive')
      or new.status not in ('active', 'inactive')
    then
      raise exception 'Alteração não permitida' using errcode = '42501';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists assets_guard_update on public.assets;
create trigger assets_guard_update before update on public.assets
  for each row execute function public.assets_guard_update();

alter table public.assets enable row level security;

-- ------------------------------------------------------------------ activation_requests
create policy "Admin gerencia solicitações" on public.activation_requests
  for all to authenticated using (is_admin()) with check (is_admin());
create policy "Cliente lê suas solicitações" on public.activation_requests
  for select to authenticated using (client_id = my_client_id());

alter table public.activation_requests enable row level security;
