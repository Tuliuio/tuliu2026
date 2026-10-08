import type { Campaign, ClientUpdate } from '../../types/supabase';
import { CHANNEL_META, KIND_META, STAGES, STATUS_META, STAGE_LABEL, relativeDate, stageIndex } from '../../lib/updates';

interface UpdateCardProps {
  update: ClientUpdate;
  campaignName?: string;
  focused?: boolean;
  onOpen?: (update: ClientUpdate) => void;
  /** Ações extras (admin) */
  actions?: React.ReactNode;
}

export function UpdateCard({ update, campaignName, focused, onOpen, actions }: UpdateCardProps) {
  const kind = KIND_META[update.kind];
  const status = STATUS_META[update.status];
  const unread = !update.read_at;

  return (
    <article
      id={`atualizacao-${update.id}`}
      className={`pn-update${unread ? ' is-unread' : ''}${focused ? ' is-focus' : ''}`}
      onClick={() => onOpen?.(update)}
    >
      <div className={`pn-update-icon tone-${status.tone}`}><i className={kind.icon} aria-hidden="true"></i></div>
      <div>
        <div className="pn-update-meta">
          <strong>{kind.label}</strong>
          {campaignName && <span>{campaignName}</span>}
          <span>{relativeDate(update.created_at)}</span>
          <span className={`pn-pill tone-${status.tone}`}>{status.label}</span>
        </div>
        <h3>{update.title}</h3>
        {update.body && <p>{update.body}</p>}
        {(update.link_url || actions) && (
          <div className="pn-update-actions">
            {update.link_url && (
              <a className="pn-btn primary" href={update.link_url} target="_blank" rel="noopener noreferrer" onClick={(e) => { e.stopPropagation(); onOpen?.(update); }}>
                {update.link_label || 'Ver'} <i className="fas fa-arrow-up-right-from-square" aria-hidden="true"></i>
              </a>
            )}
            {actions}
          </div>
        )}
      </div>
    </article>
  );
}

export function StageStepper({ stage }: { stage: Campaign['stage'] }) {
  const current = stageIndex(stage);
  return (
    <ol className="pn-stepper" aria-label={`Etapa atual: ${STAGE_LABEL[stage]}`}>
      {STAGES.map((s, i) => (
        <li key={s.id} className={i < current ? 'done' : i === current ? 'current' : ''} title={s.label}>
          <i aria-hidden="true"></i>
          <span>{s.label}</span>
        </li>
      ))}
    </ol>
  );
}

interface CampaignCardProps {
  campaign: Campaign;
  lastUpdate?: ClientUpdate;
  /** Controles extras (admin) no rodapé */
  controls?: React.ReactNode;
}

export function CampaignCard({ campaign, lastUpdate, controls }: CampaignCardProps) {
  const channel = CHANNEL_META[campaign.channel];
  const metrics = Object.entries(campaign.metrics ?? {}).filter(([, v]) => v !== '' && v !== null);

  return (
    <article className="pn-campaign">
      <div className="pn-campaign-head">
        <div className="pn-update-icon"><i className={channel.icon} aria-hidden="true"></i></div>
        <div>
          <h3>{campaign.name}</h3>
          <span>{channel.label}{campaign.stage === 'concluida' ? ' · Concluída' : ''}</span>
        </div>
      </div>

      {campaign.stage !== 'concluida' && <StageStepper stage={campaign.stage} />}

      {campaign.summary && <p>{campaign.summary}</p>}

      {metrics.length > 0 && (
        <div className="pn-metrics">
          {metrics.slice(0, 4).map(([label, value]) => (
            <div key={label}><strong>{value}</strong><span>{label}</span></div>
          ))}
        </div>
      )}

      <div className="pn-campaign-foot">
        <span>{lastUpdate ? `Última novidade ${relativeDate(lastUpdate.created_at)}` : `Atualizada ${relativeDate(campaign.updated_at)}`}</span>
        {controls ?? (campaign.link_url && (
          <a className="pn-link-btn" href={campaign.link_url} target="_blank" rel="noopener noreferrer">
            Ver <i className="fas fa-arrow-right" aria-hidden="true"></i>
          </a>
        ))}
      </div>
    </article>
  );
}
