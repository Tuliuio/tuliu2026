// Pix Automático (Jornada 3 do ASAAS) para os planos do site.
// action "create": cria/acha o cliente no ASAAS e a autorização recorrente; devolve o
//   QR Code do primeiro pagamento. Ao pagar, o cliente autoriza as próximas cobranças,
//   que o ASAAS gera sozinho por uma assinatura (paymentCreationMode SUBSCRIPTION).
// action "status": o site consulta até a autorização ficar ACTIVE.
// O primeiro pagamento dispara PAYMENT_RECEIVED, que o asaas-webhook usa para criar o cliente.
const ASAAS_API_KEY = Deno.env.get('ASAAS_API_KEY')!;
const ASAAS_BASE = 'https://api.asaas.com/v3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Mesmos valores do asaas-create-checkout e do PLAN_BY_VALUE no asaas-webhook
const PLANS = {
  starter: { monthly: 97.00, yearly: 997.00, label: 'Starter' },
  business: { monthly: 497.00, yearly: 4970.00, label: 'Business' },
};

const QR_EXPIRATION_SECONDS = 60 * 60;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

async function asaas(path: string, method: string, body?: unknown) {
  const res = await fetch(`${ASAAS_BASE}${path}`, {
    method,
    headers: {
      'access_token': ASAAS_API_KEY,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw { status: res.status, data };
  return data;
}

// Primeira cobrança automática: um ciclo depois do pagamento do QR Code
function nextCycleDate(isAnnual: boolean) {
  const d = new Date();
  if (isAnnual) d.setFullYear(d.getFullYear() + 1);
  else d.setMonth(d.getMonth() + 1);
  return d.toISOString().split('T')[0];
}

async function create(body: Record<string, unknown>) {
  const { plan, isAnnual } = body;
  const planConfig = PLANS[plan as keyof typeof PLANS];
  if (!planConfig) return json({ error: 'Plano inválido.' }, 400);

  const name = String(body.name ?? '').trim();
  const email = String(body.email ?? '').trim().toLowerCase();
  const cpfCnpj = String(body.cpfCnpj ?? '').replace(/\D/g, '');
  const phone = String(body.phone ?? '').replace(/\D/g, '');

  if (name.length < 3) return json({ error: 'Informe seu nome completo.' }, 400);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: 'Informe um e-mail válido.' }, 400);
  if (cpfCnpj.length !== 11 && cpfCnpj.length !== 14) return json({ error: 'Informe um CPF ou CNPJ válido.' }, 400);
  if (phone.length < 10) return json({ error: 'Informe um WhatsApp com DDD.' }, 400);

  // 1. Cliente no ASAAS (reaproveita pelo CPF/CNPJ)
  let customerId: string;
  const found = await asaas(`/customers?cpfCnpj=${cpfCnpj}`, 'GET');
  if (found.data?.length > 0) {
    customerId = found.data[0].id;
  } else {
    const customer = await asaas('/customers', 'POST', {
      name,
      email,
      cpfCnpj,
      mobilePhone: phone,
      notificationDisabled: false,
    });
    customerId = customer.id;
  }

  // 2. Autorização do Pix Automático com o primeiro pagamento no QR Code
  const value = isAnnual ? planConfig.yearly : planConfig.monthly;
  const description = `Tuliu ${planConfig.label} ${isAnnual ? 'Anual' : 'Mensal'}`;

  const authorization = await asaas('/pix/automatic/authorizations', 'POST', {
    customerId,
    frequency: isAnnual ? 'ANNUALLY' : 'MONTHLY',
    contractId: `TULIU-${String(plan).toUpperCase()}-${Date.now()}`,
    startDate: nextCycleDate(!!isAnnual),
    value,
    description,
    paymentCreationMode: 'SUBSCRIPTION',
    retryPolicy: 'ALLOW_THREE_IN_SEVEN_DAYS',
    immediateQrCode: {
      expirationSeconds: QR_EXPIRATION_SECONDS,
      originalValue: value,
      description,
    },
  });

  return json({
    id: authorization.id,
    status: authorization.status,
    payload: authorization.payload,
    encodedImage: authorization.encodedImage,
    expirationDate: authorization.immediateQrCode?.expirationDate ?? null,
  });
}

async function status(body: Record<string, unknown>) {
  const id = String(body.id ?? '');
  if (!/^[\w-]{6,64}$/.test(id)) return json({ error: 'Autorização inválida.' }, 400);
  const authorization = await asaas(`/pix/automatic/authorizations/${id}`, 'GET');
  return json({ status: authorization.status });
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    if (body.action === 'create') return await create(body);
    if (body.action === 'status') return await status(body);
    return json({ error: 'Ação inválida.' }, 400);
  } catch (err: unknown) {
    console.error('Error:', JSON.stringify(err));
    const message =
      (err as { data?: { errors?: { description: string }[] } })?.data?.errors?.[0]?.description
      || 'Não foi possível gerar o Pix Automático. Tente novamente ou pague com cartão.';
    return json({ error: message }, 400);
  }
});
