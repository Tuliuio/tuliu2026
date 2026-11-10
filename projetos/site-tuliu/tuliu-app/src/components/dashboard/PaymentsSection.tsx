import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { relativeDate } from '../../lib/updates';

/**
 * Aba Pagamentos: vendas pelo site do cliente, operadas pela Tuliu no Asaas.
 * Lê pay_orders, pay_payments e pay_transfers (RLS: cliente vê o que é dele,
 * admin vê tudo) e o saldo pela função pay-account.
 */

interface Order {
  id: string;
  order_number: string;
  status: 'created' | 'paid' | 'canceled' | 'expired' | 'refunded';
  env: string;
  items: Array<{ name: string; qty: number; unit: number }>;
  total: number;
  shipping: number;
  customer: { name?: string; cityUf?: string; profile?: string; herdSize?: string; note?: string };
  paid_at: string | null;
  created_at: string;
}

interface Payment {
  asaas_id: string;
  status: string;
  billing_type: string | null;
  value: number;
  net_value: number | null;
  platform_fee: number;
  payment_date: string | null;
  credit_date: string | null;
}

interface Transfer {
  asaas_id: string;
  status: string;
  value: number;
  net_value: number | null;
  effective_date: string | null;
  created_at: string;
}

interface Summary {
  account: { env: string; status: string; platformFeePct: number } | null;
  balance: number | null;
}

type Period = 'today' | '7d' | '30d' | 'all';
const PERIODS: { id: Period; label: string }[] = [
  { id: 'today', label: 'Hoje' },
  { id: '7d', label: '7 dias' },
  { id: '30d', label: '30 dias' },
  { id: 'all', label: 'Tudo' },
];

const ORDER_STATUS: Record<Order['status'], { label: string; tone: string }> = {
  paid: { label: 'Pago', tone: 'tone-green' },
  created: { label: 'Aguardando pagamento', tone: 'tone-amber' },
  canceled: { label: 'Cancelado', tone: 'tone-gray' },
  expired: { label: 'Expirado', tone: 'tone-gray' },
  refunded: { label: 'Estornado', tone: 'tone-gray' },
};

const TRANSFER_STATUS: Record<string, string> = {
  DONE: 'Transferido',
  PENDING: 'Pendente',
  BANK_PROCESSING: 'No banco',
  SCHEDULED: 'Agendado',
  FAILED: 'Falhou',
  CANCELLED: 'Cancelado',
};

const RECEIVED = ['CONFIRMED', 'RECEIVED', 'RECEIVED_IN_CASH'];

const brl = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

function since(period: Period): Date | null {
  if (period === 'all') return null;
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  if (period === '7d') d.setDate(d.getDate() - 6);
  if (period === '30d') d.setDate(d.getDate() - 29);
  return d;
}

export default function PaymentsSection({ clientId, embedded = false }: { clientId: string; embedded?: boolean }) {
  const [period, setPeriod] = useState<Period>('30d');
  const [orders, setOrders] = useState<Order[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [o, p, t, s] = await Promise.all([
      supabase.from('pay_orders').select('*').eq('client_id', clientId).order('created_at', { ascending: false }).limit(200),
      supabase.from('pay_payments').select('*').eq('client_id', clientId).order('created_at', { ascending: false }).limit(500),
      supabase.from('pay_transfers').select('*').eq('client_id', clientId).order('created_at', { ascending: false }).limit(100),
      supabase.functions.invoke('pay-account', { body: { action: 'summary', clientId } }),
    ]);
    setOrders((o.data as Order[]) ?? []);
    setPayments((p.data as Payment[]) ?? []);
    setTransfers((t.data as Transfer[]) ?? []);
    setSummary((s.data as Summary) ?? null);
    setLoading(false);
  }, [clientId]);

  useEffect(() => {
    load();
  }, [load]);

  // Pedidos e cobranças novos aparecem sem recarregar a página
  useEffect(() => {
    const channel = supabase
      .channel(`pay-${clientId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pay_orders', filter: `client_id=eq.${clientId}` }, load)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pay_payments', filter: `client_id=eq.${clientId}` }, load)
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [clientId, load]);

  const stats = useMemo(() => {
    const from = since(period);
    const inPeriod = (iso: string | null) => !!iso && (!from || new Date(iso) >= from);
    const paidOrders = orders.filter((o) => o.status === 'paid' && inPeriod(o.paid_at));
    const received = payments.filter((p) => RECEIVED.includes(p.status) && inPeriod(p.payment_date ? `${p.payment_date}T12:00:00` : null));
    const gross = received.reduce((s, p) => s + Number(p.value), 0);
    const net = received.reduce((s, p) => s + Number(p.net_value ?? p.value), 0);
    const fee = received.reduce((s, p) => s + Number(p.platform_fee), 0);
    const transferred = transfers
      .filter((t) => t.status === 'DONE' && inPeriod(t.effective_date ? `${t.effective_date}T12:00:00` : t.created_at))
      .reduce((s, t) => s + Number(t.value), 0);
    return {
      orders: paidOrders.length,
      gross,
      asaasFees: gross - net,
      platformFee: fee,
      yours: net - fee,
      transferred,
    };
  }, [orders, payments, transfers, period]);

  const sandbox = summary?.account?.env === 'sandbox';
  const feePct = summary?.account?.platformFeePct ?? 1;
  const hasAccount = !!summary?.account;

  const content = (
    <>
      {sandbox && (
        <p className="pn-pay-sandbox">
          <i className="fas fa-flask" aria-hidden="true"></i> Ambiente de teste (sandbox do Asaas). Nenhum valor é real.
        </p>
      )}

      {loading ? (
        <div className="pn-empty"><p>Carregando os pagamentos...</p></div>
      ) : !hasAccount && orders.length === 0 ? (
        <div className="pn-empty">
          <i className="fas fa-wallet" aria-hidden="true"></i>
          <h3>Receba pelo seu site com a Tuliu</h3>
          <p>A Tuliu coloca Pix e cartão no seu site e acompanha cada venda aqui: quanto entrou, quanto foi transferido para a sua conta e cada pedido.</p>
        </div>
      ) : (
        <>
          <div className="pn-pay-periods" role="tablist" aria-label="Período">
            {PERIODS.map((p) => (
              <button
                key={p.id}
                type="button"
                role="tab"
                aria-selected={period === p.id}
                className={`pn-pay-period${period === p.id ? ' is-active' : ''}`}
                onClick={() => setPeriod(p.id)}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="pn-kpis">
            <div className="pn-kpi">
              <span>Vendas pagas</span>
              <strong>{stats.orders}</strong>
            </div>
            <div className="pn-kpi">
              <span>Entrou</span>
              <strong>{brl(stats.gross)}</strong>
              <small>Taxas do Asaas: {brl(stats.asaasFees)}</small>
            </div>
            <div className="pn-kpi">
              <span>Fica para você</span>
              <strong>{brl(stats.yours)}</strong>
              <small>Operação Tuliu ({feePct.toLocaleString('pt-BR')}%): {brl(stats.platformFee)}</small>
            </div>
            <div className="pn-kpi">
              <span>Transferido para o seu banco</span>
              <strong>{brl(stats.transferred)}</strong>
              <small>Saldo a transferir: {summary?.balance != null ? brl(summary.balance) : '—'}</small>
            </div>
          </div>

          <div className="pn-section-head" style={{ marginTop: 32 }}>
            <h2>Pedidos</h2>
          </div>
          {orders.length === 0 ? (
            <div className="pn-empty"><p>Nenhum pedido ainda.</p></div>
          ) : (
            <div className="pn-table-wrap">
              <table className="pn-table">
                <thead>
                  <tr>
                    <th>Pedido</th>
                    <th>Cliente</th>
                    <th>Itens</th>
                    <th className="num">Total</th>
                    <th>Situação</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <Fragment key={o.id}>
                      <tr className="is-clickable" onClick={() => setOpen(open === o.id ? null : o.id)}>
                        <td>
                          <strong>{o.order_number}</strong>
                          <small>{relativeDate(o.paid_at ?? o.created_at)}</small>
                        </td>
                        <td>
                          {o.customer.name}
                          <small>{o.customer.cityUf}</small>
                        </td>
                        <td>{o.items.map((i) => `${i.qty} × ${i.name}`).join(', ')}</td>
                        <td className="num">{brl(Number(o.total))}</td>
                        <td><span className={`pn-pill ${ORDER_STATUS[o.status].tone}`}>{ORDER_STATUS[o.status].label}</span></td>
                      </tr>
                      {open === o.id && (
                        <tr className="pn-table-detail">
                          <td colSpan={5}>
                            <dl>
                              {o.customer.profile && (<><dt>Perfil</dt><dd>{o.customer.profile}</dd></>)}
                              {o.customer.herdSize && (<><dt>Vacas em lactação</dt><dd>{o.customer.herdSize}</dd></>)}
                              {o.customer.note && (<><dt>Observação</dt><dd>{o.customer.note}</dd></>)}
                              {Number(o.shipping) > 0 && (<><dt>Frete</dt><dd>{brl(Number(o.shipping))}</dd></>)}
                              <dt>Entrega</dt>
                              <dd>Endereço, CPF/CNPJ e e-mail do comprador ficam na cobrança do Asaas. A Tuliu repassa ao time quando o pedido é pago.</dd>
                            </dl>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="pn-section-head" style={{ marginTop: 32 }}>
            <h2>Transferências</h2>
          </div>
          {transfers.length === 0 ? (
            <div className="pn-empty"><p>As transferências para a sua conta bancária vão aparecer aqui.</p></div>
          ) : (
            <div className="pn-table-wrap">
              <table className="pn-table">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th className="num">Valor</th>
                    <th>Situação</th>
                  </tr>
                </thead>
                <tbody>
                  {transfers.map((t) => (
                    <tr key={t.asaas_id}>
                      <td>{new Date(t.effective_date ? `${t.effective_date}T12:00:00` : t.created_at).toLocaleDateString('pt-BR')}</td>
                      <td className="num">{brl(Number(t.value))}</td>
                      <td>
                        <span className={`pn-pill ${t.status === 'DONE' ? 'tone-green' : t.status === 'FAILED' ? 'tone-amber' : 'tone-gray'}`}>
                          {TRANSFER_STATUS[t.status] ?? t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </>
  );

  if (embedded) return <div className="pn-pay">{content}</div>;

  return (
    <div className="pn-page pn-pay">
      <div className="pn-head">
        <span className="pn-eyebrow">Pagamentos</span>
        <h1 className="pn-title">O dinheiro das vendas do seu site.</h1>
        <p className="pn-sub">Pix e cartão operados pela Tuliu. Aqui você vê o que entrou, o que foi para a sua conta e cada pedido.</p>
      </div>
      {content}
    </div>
  );
}
