import { useEffect } from 'react';
import { useActivity } from './ActivityContext';
import { CampaignCard, UpdateCard } from './UpdateCards';

interface ActivityFeedProps {
  /** Mostra só as N mais recentes (visão geral) */
  limit?: number;
  focusId?: string | null;
  onSeeAll?: () => void;
}

export function ActivityFeed({ limit, focusId, onSeeAll }: ActivityFeedProps) {
  const { updates, campaigns, loading, unreadCount, markRead } = useActivity();
  const list = limit ? updates.slice(0, limit) : updates;
  const campaignName = (id?: string | null) => campaigns.find((c) => c.id === id)?.name;

  // Card aberto pelo link do WhatsApp: rola até ele e marca como lido
  useEffect(() => {
    if (!focusId || loading) return;
    const el = document.getElementById(`atualizacao-${focusId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      markRead([focusId]);
    }
  }, [focusId, loading, markRead]);

  return (
    <section aria-labelledby="pn-feed-title">
      <div className="pn-section-head">
        <h2 id="pn-feed-title">
          Acontecendo agora
          {unreadCount > 0 && <span className="pn-count">{unreadCount} {unreadCount === 1 ? 'nova' : 'novas'}</span>}
        </h2>
        {unreadCount > 0 && !limit && (
          <button type="button" className="pn-link-btn" onClick={() => markRead(updates.map((u) => u.id))}>
            Marcar tudo como lido
          </button>
        )}
        {limit && updates.length > limit && onSeeAll && (
          <button type="button" className="pn-link-btn" onClick={onSeeAll}>
            Ver tudo <i className="fas fa-arrow-right" aria-hidden="true"></i>
          </button>
        )}
      </div>

      {loading ? (
        <div className="pn-empty"><p>Carregando as novidades...</p></div>
      ) : list.length === 0 ? (
        <div className="pn-empty">
          <i className="fas fa-bell" aria-hidden="true"></i>
          <h3>As novidades vão aparecer aqui</h3>
          <p>Cada entrega, campanha e relatório que a Tuliu fizer por você vira um card nesta área. A gente também te avisa pelo WhatsApp.</p>
        </div>
      ) : (
        <div className="pn-feed">
          {list.map((u) => (
            <UpdateCard
              key={u.id}
              update={u}
              campaignName={campaignName(u.campaign_id)}
              focused={u.id === focusId}
              onOpen={(upd) => markRead([upd.id])}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export function CampaignsSection() {
  const { campaigns, updates, loading } = useActivity();
  const active = campaigns.filter((c) => c.stage !== 'concluida');
  const done = campaigns.filter((c) => c.stage === 'concluida');
  const lastUpdate = (id: string) => updates.find((u) => u.campaign_id === id);

  return (
    <div className="pn-page">
      <div className="pn-head">
        <span className="pn-eyebrow">Campanhas</span>
        <h1 className="pn-title">Tudo o que está rodando para você.</h1>
        <p className="pn-sub">Cada frente de trabalho em um card, com a etapa em que ela está agora. Quando algo avança, você vê aqui e recebe um aviso no WhatsApp.</p>
      </div>

      {loading ? (
        <div className="pn-empty"><p>Carregando campanhas...</p></div>
      ) : campaigns.length === 0 ? (
        <div className="pn-empty">
          <i className="fas fa-bullhorn" aria-hidden="true"></i>
          <h3>Nenhuma campanha por aqui ainda</h3>
          <p>Assim que a gente começar uma campanha, um site ou uma frente de conteúdo, ela aparece aqui com cada etapa até ir ao ar.</p>
        </div>
      ) : (
        <>
          <div className="pn-campaigns">
            {active.map((c) => <CampaignCard key={c.id} campaign={c} lastUpdate={lastUpdate(c.id)} />)}
          </div>
          {done.length > 0 && (
            <>
              <div className="pn-section-head" style={{ marginTop: 40 }}><h2>Concluídas</h2></div>
              <div className="pn-campaigns">
                {done.map((c) => <CampaignCard key={c.id} campaign={c} lastUpdate={lastUpdate(c.id)} />)}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
