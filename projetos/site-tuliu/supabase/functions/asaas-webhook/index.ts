// Webhook do ASAAS (configurado no painel ASAAS > Integrações > Webhooks).
// Pagamento confirmado: cria o cliente e envia o convite do painel por e-mail,
// ou, se já for cliente e for uma assinatura nova (upgrade), atualiza o plano.
import { createClient } from 'jsr:@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const ASAAS_API_KEY = Deno.env.get('ASAAS_API_KEY')!;
// Mesmo valor do "Token de autenticação" do webhook no painel ASAAS
const ASAAS_WEBHOOK_TOKEN = Deno.env.get('ASAAS_WEBHOOK_TOKEN');

// Valores do asaas-create-checkout. Pagamentos com outros valores (links avulsos,
// propostas) caem na descrição e, sem pista, no Starter.
const PLAN_BY_VALUE: Record<number, 'starter' | 'business'> = {
  97: 'starter',
  997: 'starter',
  497: 'business',
  4970: 'business',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

function planTier(payment: Record<string, unknown>): 'starter' | 'business' {
  const byValue = PLAN_BY_VALUE[Number(payment.value)];
  if (byValue) return byValue;
  return /business/i.test(String(payment.description ?? '')) ? 'business' : 'starter';
}

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  if (ASAAS_WEBHOOK_TOKEN) {
    if (req.headers.get('asaas-access-token') !== ASAAS_WEBHOOK_TOKEN) {
      return new Response('Unauthorized', { status: 401 });
    }
  } else {
    console.warn('ASAAS_WEBHOOK_TOKEN não configurado: webhook aceitando chamadas sem token');
  }

  let payload: Record<string, unknown>;
  try {
    payload = await req.json();
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  const event = payload.event as string;
  if (event !== 'PAYMENT_CONFIRMED' && event !== 'PAYMENT_RECEIVED') {
    return json({ ok: true, skipped: true });
  }

  // Erros de dados respondem 200 para não travar a fila de webhooks do ASAAS
  const payment = payload.payment as Record<string, unknown>;
  const customerId = payment?.customer as string;
  if (!customerId) {
    console.error('No customer id', payload);
    return json({ ok: false, error: 'No customer id' });
  }

  // Buscar dados do cliente no ASAAS
  const asaasRes = await fetch(`https://api.asaas.com/v3/customers/${customerId}`, {
    headers: { 'access_token': ASAAS_API_KEY },
  });
  if (!asaasRes.ok) {
    return json({ error: 'Failed to fetch ASAAS customer' }, 500);
  }

  const customer = await asaasRes.json() as Record<string, unknown>;
  const email = (customer.email as string | undefined)?.trim().toLowerCase();
  const name = customer.name as string;
  const asaasSubscriptionId = (payment.subscription as string | undefined) ?? null;

  if (!email) {
    console.error('ASAAS customer without email:', customerId);
    return json({ ok: false, error: 'No email' });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  const tier = planTier(payment);
  const { data: plan } = await supabase
    .from('plans')
    .select('id')
    .eq('tier', tier)
    .single();

  if (!plan) {
    return json({ error: `Plan ${tier} not found` }, 500);
  }

  const { data: existing } = await supabase
    .from('clients')
    .select('id, plan_id, asaas_subscription_id')
    .ilike('email', email.replace(/[\\%_]/g, '\\$&'))
    .maybeSingle();

  if (existing) {
    // Renovação da mesma assinatura: nada muda
    if (asaasSubscriptionId && existing.asaas_subscription_id === asaasSubscriptionId) {
      return json({ ok: true, existing: true, renewal: true });
    }

    // Assinatura nova de quem já é cliente: upgrade (ou troca) de plano
    const { error: updateError } = await supabase
      .from('clients')
      .update({
        plan_id: plan.id,
        status: 'active',
        asaas_customer_id: customerId,
        asaas_subscription_id: asaasSubscriptionId,
      })
      .eq('id', existing.id);

    if (updateError) {
      console.error('Client update error:', updateError);
      return json({ error: 'Failed to update client' }, 500);
    }

    console.log(`Client plan updated to ${tier}:`, email);
    return json({ ok: true, existing: true, updated: true, plan: tier });
  }

  // Criar usuario e enviar email de convite (magic link automatico)
  const { data: inviteData, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(email, {
    data: {
      name,
      plan: tier,
      asaas_customer_id: customerId,
    },
    redirectTo: 'https://tuliu.io/dashboard',
  });

  if (inviteError || !inviteData.user) {
    console.error('Invite error:', inviteError);
    return json({ error: 'Failed to invite user' }, 500);
  }

  // Criar registro na tabela clients
  const { error: clientError } = await supabase.from('clients').insert({
    user_id: inviteData.user.id,
    name,
    company: name,
    email,
    plan_id: plan.id,
    status: 'active',
    onboarding_completed: false,
    asaas_customer_id: customerId,
    asaas_subscription_id: asaasSubscriptionId,
  });

  if (clientError) {
    console.error('Client insert error:', clientError);
    return json({ error: 'Failed to create client' }, 500);
  }

  console.log(`User invited successfully (${tier}):`, email);
  return json({ ok: true, created: true, plan: tier });
});
