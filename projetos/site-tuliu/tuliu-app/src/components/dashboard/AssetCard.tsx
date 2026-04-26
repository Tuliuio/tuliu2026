import type { Asset } from '../../types/supabase';

interface AssetCardProps {
  asset: Asset;
  onToggleStatus?: (assetId: string) => void;
  variant?: 'normal' | 'vacant' | 'upgrade';
}

const assetTypeIcons: Record<Asset['type'], string> = {
  domain: 'fa-globe',
  subdomain: 'fa-sitemap',
  website: 'fa-laptop-code',
  webapp: 'fa-browser',
  email: 'fa-envelope',
  automation: 'fa-cogs',
  agent: 'fa-robot',
};

const assetTypeLabels: Record<Asset['type'], string> = {
  domain: 'Domínio',
  subdomain: 'Subdomínio',
  website: 'Website',
  webapp: 'Web App',
  email: 'E-mail',
  automation: 'Automação',
  agent: 'Agente IA',
};

const statusColors: Record<Asset['status'], { color: string; label: string }> = {
  active: { color: '#22c55e', label: 'Ativo' },
  inactive: { color: '#ef4444', label: 'Inativo' },
  pending: { color: '#f59e0b', label: 'Em configuração' },
};

export default function AssetCard({ asset, onToggleStatus, variant = 'normal' }: AssetCardProps) {
  const status = statusColors[asset.status];
  const icon = assetTypeIcons[asset.type];

  if (variant === 'vacant') {
    return (
      <article className="asset-card asset-card-vacant" style={{ borderStyle: 'dashed', opacity: 0.6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <div
            className="asset-icon"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: '#f3f3f3',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <i className={`fas ${icon}`} style={{ fontSize: '18px', color: '#999' }}></i>
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#666' }}>
              + {assetTypeLabels[asset.type]} disponível
            </h3>
          </div>
        </div>
        <button
          className="btn btn-outline"
          style={{ fontSize: '13px', padding: '8px 16px', width: '100%' }}
        >
          Solicitar ativação
        </button>
      </article>
    );
  }

  if (variant === 'upgrade') {
    return (
      <article
        className="asset-card asset-card-upgrade"
        style={{ borderColor: '#6366f1', borderWidth: '2px' }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
            <div
              className="asset-icon"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: '#f3f3f3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <i className={`fas ${icon}`} style={{ fontSize: '18px', color: '#666' }}></i>
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: 0, marginBottom: '4px', fontSize: '16px', fontWeight: 600 }}>
                {assetTypeLabels[asset.type]}
              </h3>
              <p style={{ margin: 0, fontSize: '13px', color: '#999' }}>
                Disponível no Business ou Enterprise
              </p>
            </div>
          </div>
          <span
            className="badge"
            style={{
              background: '#ede9fe',
              color: '#6366f1',
              padding: '4px 10px',
              fontSize: '12px',
              minWidth: 'fit-content',
            }}
          >
            Upgrade
          </span>
        </div>
        <button
          className="btn btn-outline"
          style={{ fontSize: '13px', padding: '8px 16px', width: '100%' }}
        >
          Ver planos
        </button>
      </article>
    );
  }

  return (
    <article className="asset-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
          <div
            className="asset-icon"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: '#f3f3f3',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <i className={`fas ${icon}`} style={{ fontSize: '18px', color: '#666' }}></i>
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: 0, marginBottom: '4px', fontSize: '15px', fontWeight: 600 }}>
              {asset.name}
            </h3>
            {asset.description && <p style={{ margin: 0, fontSize: '13px', color: '#999' }}>{asset.description}</p>}
          </div>
        </div>
        <button
          onClick={() => onToggleStatus?.(asset.id)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px 8px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
          title={`Alternar status: ${status.label}`}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: status.color,
            }}
          ></span>
          <span style={{ fontSize: '12px', fontWeight: 500, color: '#666' }}>{status.label}</span>
        </button>
      </div>
      {asset.url && (
        <p style={{ margin: 0, fontSize: '12px', color: '#0066cc', wordBreak: 'break-all' }}>
          <i className="fas fa-link" style={{ marginRight: '4px' }}></i>
          <a href={asset.url} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>
            {asset.url}
          </a>
        </p>
      )}
    </article>
  );
}
