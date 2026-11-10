-- Ajustes aplicados logo depois de 20261109_pagamentos.sql

-- Foto do produto por URL (a função pay-checkout baixa e manda em base64 ao Asaas)
alter table public.pay_products drop column image_base64;
alter table public.pay_products add column image_url text;

-- Aba Pagamentos atualiza sozinha quando chega pedido ou cobrança
alter publication supabase_realtime add table public.pay_orders, public.pay_payments, public.pay_transfers;
