// Cria a sessão do Checkout ASAAS para os planos do site (botões de /#precos).
// Ao pagar, o ASAAS devolve o cliente para tuliu.io/obrigado e dispara o asaas-webhook.
const ASAAS_API_KEY = Deno.env.get('ASAAS_API_KEY')!;
const ASAAS_BASE = 'https://api.asaas.com/v3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Mantenha em sincronia com src/translations.ts (pricing) e com PLAN_BY_VALUE no asaas-webhook
const PLANS = {
  starter: { monthly: 97.00, yearly: 997.00, label: 'Plano Starter Tuliu' },
  business: { monthly: 497.00, yearly: 4970.00, label: 'Plano Business Tuliu' },
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { isAnnual, plan = 'starter' } = await req.json();

    const planConfig = PLANS[plan as keyof typeof PLANS];
    if (!planConfig) throw { data: { errors: [{ description: 'Plano inválido.' }] } };

    const value = isAnnual ? planConfig.yearly : planConfig.monthly;
    const cycle = isAnnual ? 'YEARLY' : 'MONTHLY';
    const planLabel = `${planConfig.label} (${isAnnual ? 'Anual' : 'Mensal'})`;
    const today = new Date().toISOString().split('T')[0];

    const body = {
      billingTypes: ['CREDIT_CARD'],
      chargeTypes: ['RECURRENT'],
      callback: {
        successUrl: 'https://tuliu.io/obrigado',
        cancelUrl: 'https://tuliu.io/#precos',
      },
      items: [
        {
          name: planLabel,
          quantity: 1,
          value,
        },
      ],
      subscription: {
        cycle,
        nextDueDate: today,
      },
    };

    const res = await fetch(`${ASAAS_BASE}/checkouts`, {
      method: 'POST',
      headers: {
        'access_token': ASAAS_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('ASAAS error:', data);
      throw { status: res.status, data };
    }

    return new Response(JSON.stringify({ url: data.link }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err: unknown) {
    console.error('Error:', err);
    const message =
      (err as { data?: { errors?: { description: string }[] } })?.data?.errors?.[0]?.description
      || 'Erro ao criar sessão de checkout. Tente novamente.';
    return new Response(JSON.stringify({ error: message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
