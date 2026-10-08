import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { Campaign, ClientUpdate, UpdateKind, UpdateStatus } from '../../types/supabase';
import { KIND_META, STATUS_META, whatsappLink, whatsappMessage } from '../../lib/updates';
import { UpdateCard } from '../dashboard/UpdateCards';
import { firstName, useAdminClients } from './useAdminClients';

const EMPTY = { kind: 'entrega' as UpdateKind, status: 'no_ar' as UpdateStatus, title: '', body: '', link_url: '', link_label: '', campaign_id: '' };

/** Bloco com a mensagem pronta para o WhatsApp do cliente */
export function ShareBox({ update, clientId }: { update: ClientUpdate; clientId: string }) {
  const { clients, savePhone } = useAdminClients();
  const client = clients.find((c) => c.id === clientId);
  const [phone, setPhone] = useState('');
  const [copied, setCopied] = useState(false);
  const message = whatsappMessage(update, firstName(client?.name));

  return (
    <div className="pn-share">
      <strong><i className="fab fa-whatsapp" aria-hidden="true"></i> Card publicado. Mensagem pronta para {client?.company ?? 'o cliente'}:</strong>
      <pre>{message}</pre>
      <div className="pn-admin-row" style={{ flexWrap: 'wrap' }}>
        <a className="pn-btn whatsapp" href={whatsappLink(message, client?.phone)} target="_blank" rel="noopener noreferrer">
          <i className="fab fa-whatsapp" aria-hidden="true"></i> {client?.phone ? 'Enviar no WhatsApp' : 'Abrir WhatsApp e escolher contato'}
        </a>
        <button
          type="button"
          className="pn-btn"
          onClick={async () => { await navigator.clipboard.writeText(message); setCopied(true); setTimeout(() => setCopied(false), 1800); }}
        >
          <i className={copied ? 'fas fa-check' : 'far fa-copy'} aria-hidden="true"></i> {copied ? 'Copiada' : 'Copiar mensagem'}
        </button>
        {client && !client.phone && (
          <span className="pn-admin-row">
            <input
              className="pn-stage-select"
              style={{ width: 170 }}
              placeholder="WhatsApp do cliente"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <button type="button" className="pn-link-btn" disabled={!phone.trim()} onClick={() => savePhone(client.id, phone.trim())}>
              Salvar telefone
            </button>
          </span>
        )}
      </div>
    </div>
  );
}

export default function AdminUpdatesPage() {
  const { clients } = useAdminClients();
  const [clientId, setClientId] = useState('');
  const [form, setForm] = useState(EMPTY);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [updates, setUpdates] = useState<ClientUpdate[]>([]);
  const [saving, setSaving] = useState(false);
  const [published, setPublished] = useState<ClientUpdate | null>(null);
  const [error, setError] = useState('');

  const load = useCallback(async (id: string) => {
    if (!id) { setUpdates([]); setCampaigns([]); return; }
    const [u, c] = await Promise.all([
      supabase.from('client_updates').select('*').eq('client_id', id).order('created_at', { ascending: false }).limit(50),
      supabase.from('campaigns').select('*').eq('client_id', id).order('updated_at', { ascending: false }),
    ]);
    setUpdates((u.data as ClientUpdate[]) ?? []);
    setCampaigns((c.data as Campaign[]) ?? []);
  }, []);

  useEffect(() => { load(clientId); setPublished(null); }, [clientId, load]);

  const set = (key: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const publish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId || !form.title.trim()) return;
    setSaving(true);
    setError('');
    const { data, error: err } = await supabase
      .from('client_updates')
      .insert({
        client_id: clientId,
        campaign_id: form.campaign_id || null,
        kind: form.kind,
        status: form.status,
        title: form.title.trim(),
        body: form.body.trim() || null,
        link_url: form.link_url.trim() || null,
        link_label: form.link_label.trim() || null,
        created_by: 'Tuliu',
      })
      .select()
      .single();
    setSaving(false);
    if (err) { setError(err.message); return; }
    setPublished(data as ClientUpdate);
    setForm(EMPTY);
    load(clientId);
  };

  const remove = async (id: string) => {
    if (!confirm('Apagar este card? O cliente deixa de ver.')) return;
    await supabase.from('client_updates').delete().eq('id', id);
    load(clientId);
  };

  const campaignName = (id?: string | null) => campaigns.find((c) => c.id === id)?.name;

  return (
    <div className="pn-page">
      <div className="pn-head">
        <span className="pn-eyebrow">Novidades</span>
        <h1 className="pn-title">Conte ao cliente o que foi feito.</h1>
        <p className="pn-sub">Cada novidade vira um card no painel do cliente e sai daqui com a mensagem de WhatsApp pronta, com o link direto para o card.</p>
      </div>

      <form className="pn-compose" onSubmit={publish}>
        <div className="pn-form-grid">
          <div className="pn-field">
            <label htmlFor="up-client">Cliente</label>
            <select id="up-client" value={clientId} onChange={(e) => setClientId(e.target.value)} required>
              <option value="">Escolha o cliente</option>
              {clients.map((c) => <option key={c.id} value={c.id}>{c.company}</option>)}
            </select>
          </div>
          <div className="pn-field">
            <label htmlFor="up-kind">Tipo</label>
            <select id="up-kind" value={form.kind} onChange={set('kind')}>
              {Object.entries(KIND_META).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
          <div className="pn-field">
            <label htmlFor="up-status">Etapa</label>
            <select id="up-status" value={form.status} onChange={set('status')}>
              {Object.entries(STATUS_META).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
          <div className="pn-field span-2">
            <label htmlFor="up-title">Título</label>
            <input id="up-title" value={form.title} onChange={set('title')} placeholder="Ex.: Nova página de exames no ar" required maxLength={120} />
          </div>
          <div className="pn-field">
            <label htmlFor="up-campaign">Campanha (opcional)</label>
            <select id="up-campaign" value={form.campaign_id} onChange={set('campaign_id')} disabled={!clientId}>
              <option value="">Nenhuma</option>
              {campaigns.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="pn-field span-3">
            <label htmlFor="up-body">O que foi feito</label>
            <textarea id="up-body" value={form.body} onChange={set('body')} placeholder="Duas ou três linhas, no tom de quem conversa com o cliente." />
          </div>
          <div className="pn-field span-2">
            <label htmlFor="up-link">Link (opcional)</label>
            <input id="up-link" type="url" value={form.link_url} onChange={set('link_url')} placeholder="https://..." />
          </div>
          <div className="pn-field">
            <label htmlFor="up-link-label">Texto do botão</label>
            <input id="up-link-label" value={form.link_label} onChange={set('link_label')} placeholder="Ver o site" maxLength={40} />
          </div>
        </div>
        <div className="pn-form-foot">
          <span className="pn-hint">O cliente vê o card na hora, mesmo com o painel aberto.</span>
          <button type="submit" className="pn-btn primary" disabled={saving || !clientId || !form.title.trim()}>
            {saving ? 'Publicando...' : <>Publicar card <i className="fas fa-paper-plane" aria-hidden="true"></i></>}
          </button>
        </div>
        {error && <p className="pn-hint" style={{ color: '#dc2626', marginTop: 10 }}>Não deu para publicar: {error}</p>}
        {published && <ShareBox update={published} clientId={clientId} />}
      </form>

      {clientId && (
        <section>
          <div className="pn-section-head"><h2>O que o cliente está vendo</h2></div>
          {updates.length === 0 ? (
            <div className="pn-empty"><i className="fas fa-bell" aria-hidden="true"></i><h3>Nenhum card ainda</h3><p>O primeiro card que você publicar aparece aqui e no painel do cliente.</p></div>
          ) : (
            <div className="pn-feed">
              {updates.map((u) => (
                <UpdateCard
                  key={u.id}
                  update={u}
                  campaignName={campaignName(u.campaign_id)}
                  actions={
                    <>
                      <span className="pn-hint">{u.read_at ? <><i className="fas fa-check-double" aria-hidden="true"></i> Visto pelo cliente</> : 'Ainda não visto'}</span>
                      <button type="button" className="pn-icon-btn" title="Apagar card" onClick={(e) => { e.stopPropagation(); remove(u.id); }}>
                        <i className="far fa-trash-can" aria-hidden="true"></i>
                      </button>
                    </>
                  }
                />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
