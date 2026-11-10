import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../Toast';
import PaymentsSection from '../dashboard/PaymentsSection';

/** Admin: uma visão por conta de pagamentos operada pela Tuliu. */
interface Account {
  id: string;
  slug: string;
  env: string;
  status: string;
  client_id: string;
  platform_fee_pct: number;
  wallet_id: string | null;
  api_key_secret_id: string | null;
  platform_wallet_id: string | null;
  clients: { company: string } | null;
}

export default function AdminPaymentsPage() {
  const { show } = useToast();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const { data } = await supabase
      .from('pay_accounts')
      .select('id, slug, env, status, client_id, platform_fee_pct, wallet_id, api_key_secret_id, platform_wallet_id, clients(company)')
      .order('created_at');
    const list = (data as unknown as Account[]) ?? [];
    setAccounts(list);
    setSelected((s) => s ?? list[0]?.id ?? null);
  };

  useEffect(() => {
    load();
  }, []);

  const account = accounts.find((a) => a.id === selected);

  const setup = async () => {
    if (!account) return;
    setBusy(true);
    const { data, error } = await supabase.functions.invoke('pay-account', { body: { action: 'setup', slug: account.slug } });
    setBusy(false);
    if (error || !data?.ok) {
      show(`Não foi possível configurar: ${data?.error ?? error?.message ?? 'erro'}`, 'error');
      return;
    }
    show(`Conta conferida e webhook ${data.webhook === 'created' ? 'cadastrado' : 'atualizado'} no Asaas`, 'success');
    load();
  };

  return (
    <div className="pn-page pn-pay">
      <div className="pn-head">
        <span className="pn-eyebrow">Tuliu Pagamentos</span>
        <h1 className="pn-title">Contas Asaas operadas pela Tuliu</h1>
        <p className="pn-sub">Vendas, repasse da Tuliu e transferências de cada cliente. A chave de cada conta fica no Vault do Supabase.</p>
      </div>

      {accounts.length === 0 ? (
        <div className="pn-empty">
          <i className="fas fa-wallet" aria-hidden="true"></i>
          <h3>Nenhuma conta ainda</h3>
          <p>Crie a conta em pay_accounts e guarde a chave com pay_set_api_key no SQL Editor.</p>
        </div>
      ) : (
        <>
          <div className="pn-pay-periods" role="tablist" aria-label="Conta">
            {accounts.map((a) => (
              <button
                key={a.id}
                type="button"
                role="tab"
                aria-selected={a.id === selected}
                className={`pn-pay-period${a.id === selected ? ' is-active' : ''}`}
                onClick={() => setSelected(a.id)}
              >
                {a.clients?.company ?? a.slug} {a.env === 'sandbox' && '· teste'}
              </button>
            ))}
          </div>

          {account && (
            <>
              <div className="pn-pay-config">
                <span className={`pn-pill ${account.status === 'active' ? 'tone-green' : 'tone-amber'}`}>
                  {account.status === 'active' ? 'Ativa' : account.status === 'paused' ? 'Pausada' : 'Em configuração'}
                </span>
                <span>Ambiente: <strong>{account.env === 'sandbox' ? 'sandbox' : 'produção'}</strong></span>
                <span>Chave: <strong>{account.api_key_secret_id ? 'guardada' : 'falta'}</strong></span>
                <span>Split Tuliu: <strong>{account.platform_wallet_id ? `${Number(account.platform_fee_pct)}%` : 'sem carteira'}</strong></span>
                <button type="button" className="pn-btn" onClick={setup} disabled={busy || !account.api_key_secret_id}>
                  <i className="fas fa-plug" aria-hidden="true"></i> {busy ? 'Conferindo...' : 'Conferir conta e webhook'}
                </button>
              </div>
              <PaymentsSection key={account.client_id} clientId={account.client_id} embedded />
            </>
          )}
        </>
      )}
    </div>
  );
}
