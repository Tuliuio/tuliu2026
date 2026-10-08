import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { Campaign, CampaignChannel, CampaignStage, ClientUpdate } from '../../types/supabase';
import { CHANNEL_META, STAGES, STAGE_LABEL } from '../../lib/updates';
import { CampaignCard } from '../dashboard/UpdateCards';
import { useAdminClients } from './useAdminClients';
import { ShareBox } from './AdminUpdatesPage';

const EMPTY = { name: '', channel: 'meta' as CampaignChannel, stage: 'planejamento' as CampaignStage, summary: '', link_url: '', metrics: '' };

/** "Investimento: R$ 1.200" por linha vira { Investimento: 'R$ 1.200' } */
function parseMetrics(text: string): Record<string, string> {
  return Object.fromEntries(
    text.split('\n').map((line) => line.split(':')).filter((p) => p.length >= 2 && p[0].trim())
      .map(([k, ...v]) => [k.trim(), v.join(':').trim()]),
  );
}
const metricsToText = (m?: Record<string, string | number> | null) => Object.entries(m ?? {}).map(([k, v]) => `${k}: ${v}`).join('\n');

export default function AdminCampaignsPage() {
  const { clients } = useAdminClients();
  const [clientId, setClientId] = useState('');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notify, setNotify] = useState(true);
  const [published, setPublished] = useState<ClientUpdate | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async (id: string) => {
    if (!id) { setCampaigns([]); return; }
    const { data } = await supabase.from('campaigns').select('*').eq('client_id', id).order('updated_at', { ascending: false });
    setCampaigns((data as Campaign[]) ?? []);
  }, []);

  useEffect(() => { load(clientId); setPublished(null); setEditingId(null); setForm(EMPTY); }, [clientId, load]);

  const set = (key: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  /** Card automático no painel do cliente quando a campanha nasce ou muda de etapa */
  const postUpdate = async (campaign: Pick<Campaign, 'id' | 'name' | 'stage'>, isNew: boolean) => {
    if (!notify) return;
    const title = isNew ? `Começamos: ${campaign.name}` : `${campaign.name}: agora em ${STAGE_LABEL[campaign.stage].toLowerCase()}`;
    const status = campaign.stage === 'no_ar' || campaign.stage === 'otimizando' ? 'no_ar' : campaign.stage === 'aprovacao' ? 'aguardando_voce' : campaign.stage === 'concluida' ? 'concluido' : 'em_andamento';
    const { data } = await supabase
      .from('client_updates')
      .insert({ client_id: clientId, campaign_id: campaign.id, kind: campaign.stage === 'aprovacao' ? 'aprovacao' : 'campanha', status, title, created_by: 'Tuliu' })
      .select()
      .single();
    if (data) setPublished(data as ClientUpdate);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId || !form.name.trim()) return;
    setSaving(true);
    const payload = {
      client_id: clientId,
      name: form.name.trim(),
      channel: form.channel,
      stage: form.stage,
      summary: form.summary.trim() || null,
      link_url: form.link_url.trim() || null,
      metrics: parseMetrics(form.metrics),
    };
    const previous = campaigns.find((c) => c.id === editingId);
    const { data, error } = editingId
      ? await supabase.from('campaigns').update(payload).eq('id', editingId).select().single()
      : await supabase.from('campaigns').insert({ ...payload, started_at: new Date().toISOString().slice(0, 10) }).select().single();
    setSaving(false);
    if (error || !data) { alert(`Não deu para salvar: ${error?.message}`); return; }
    const saved = data as Campaign;
    if (!editingId) await postUpdate(saved, true);
    else if (previous && previous.stage !== saved.stage) await postUpdate(saved, false);
    setForm(EMPTY);
    setEditingId(null);
    load(clientId);
  };

  const changeStage = async (campaign: Campaign, stage: CampaignStage) => {
    await supabase.from('campaigns').update({ stage }).eq('id', campaign.id);
    await postUpdate({ ...campaign, stage }, false);
    load(clientId);
  };

  const edit = (c: Campaign) => {
    setEditingId(c.id);
    setForm({ name: c.name, channel: c.channel, stage: c.stage, summary: c.summary ?? '', link_url: c.link_url ?? '', metrics: metricsToText(c.metrics) });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const remove = async (id: string) => {
    if (!confirm('Apagar esta campanha? Os cards ligados a ela continuam, sem o vínculo.')) return;
    await supabase.from('campaigns').delete().eq('id', id);
    load(clientId);
  };

  return (
    <div className="pn-page">
      <div className="pn-head">
        <span className="pn-eyebrow">Campanhas</span>
        <h1 className="pn-title">As frentes de trabalho de cada cliente.</h1>
        <p className="pn-sub">O cliente vê cada campanha com a régua de etapas. Ao mudar a etapa, ele recebe um card no painel e você sai com a mensagem do WhatsApp pronta.</p>
      </div>

      <form className="pn-compose" onSubmit={save}>
        <div className="pn-form-grid">
          <div className="pn-field">
            <label htmlFor="cp-client">Cliente</label>
            <select id="cp-client" value={clientId} onChange={(e) => setClientId(e.target.value)} required>
              <option value="">Escolha o cliente</option>
              {clients.map((c) => <option key={c.id} value={c.id}>{c.company}</option>)}
            </select>
          </div>
          <div className="pn-field span-2">
            <label htmlFor="cp-name">Nome da campanha</label>
            <input id="cp-name" value={form.name} onChange={set('name')} placeholder="Ex.: Conversas no WhatsApp · Leite A2" required maxLength={90} />
          </div>
          <div className="pn-field">
            <label htmlFor="cp-channel">Canal</label>
            <select id="cp-channel" value={form.channel} onChange={set('channel')}>
              {Object.entries(CHANNEL_META).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
          <div className="pn-field">
            <label htmlFor="cp-stage">Etapa</label>
            <select id="cp-stage" value={form.stage} onChange={set('stage')}>
              {STAGES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
              <option value="concluida">Concluída</option>
            </select>
          </div>
          <div className="pn-field">
            <label htmlFor="cp-link">Link (opcional)</label>
            <input id="cp-link" type="url" value={form.link_url} onChange={set('link_url')} placeholder="https://..." />
          </div>
          <div className="pn-field span-2">
            <label htmlFor="cp-summary">Resumo para o cliente</label>
            <textarea id="cp-summary" value={form.summary} onChange={set('summary')} placeholder="O objetivo e o que está sendo feito, em linguagem simples." />
          </div>
          <div className="pn-field">
            <label htmlFor="cp-metrics">Números (um por linha)</label>
            <textarea id="cp-metrics" value={form.metrics} onChange={set('metrics')} placeholder={'Conversas: 508\nCusto por conversa: R$ 11,51'} />
          </div>
        </div>
        <div className="pn-form-foot">
          <label className="pn-hint" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input type="checkbox" checked={notify} onChange={(e) => setNotify(e.target.checked)} />
            Avisar o cliente com um card quando a campanha começar ou mudar de etapa
          </label>
          <div className="pn-admin-row">
            {editingId && <button type="button" className="pn-btn" onClick={() => { setEditingId(null); setForm(EMPTY); }}>Cancelar</button>}
            <button type="submit" className="pn-btn primary" disabled={saving || !clientId || !form.name.trim()}>
              {saving ? 'Salvando...' : editingId ? 'Salvar campanha' : <>Criar campanha <i className="fas fa-plus" aria-hidden="true"></i></>}
            </button>
          </div>
        </div>
        {published && <ShareBox update={published} clientId={clientId} />}
      </form>

      {clientId && (
        campaigns.length === 0 ? (
          <div className="pn-empty"><i className="fas fa-bullhorn" aria-hidden="true"></i><h3>Nenhuma campanha para este cliente</h3><p>Crie a primeira acima. Ela aparece na hora no painel do cliente.</p></div>
        ) : (
          <div className="pn-campaigns">
            {campaigns.map((c) => (
              <CampaignCard
                key={c.id}
                campaign={c}
                controls={
                  <span className="pn-admin-row">
                    <select className="pn-stage-select" value={c.stage} onChange={(e) => changeStage(c, e.target.value as CampaignStage)} aria-label="Mudar etapa">
                      {STAGES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                      <option value="concluida">Concluída</option>
                    </select>
                    <button type="button" className="pn-icon-btn" title="Editar" onClick={() => edit(c)}><i className="fas fa-pen" aria-hidden="true"></i></button>
                    <button type="button" className="pn-icon-btn" title="Apagar" onClick={() => remove(c.id)}><i className="far fa-trash-can" aria-hidden="true"></i></button>
                  </span>
                }
              />
            ))}
          </div>
        )
      )}
    </div>
  );
}
