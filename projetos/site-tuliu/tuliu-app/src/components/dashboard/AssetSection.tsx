import type { Asset, AssetType } from '../../types/supabase';
import AssetCard from './AssetCard';

interface AssetSectionProps {
  type: AssetType;
  assets: Asset[];
  maxAllowed: number | 'unlimited';
  onToggleStatus?: (assetId: string) => void;
  onRequestActivation?: (assetType: string) => void;
}

const assetTypeConfig: Record<AssetType, { icon: string; label: string }> = {
  domain: { icon: 'fa-globe', label: 'Domínios' },
  subdomain: { icon: 'fa-sitemap', label: 'Subdomínios' },
  website: { icon: 'fa-laptop-code', label: 'Websites' },
  webapp: { icon: 'fa-mobile-alt', label: 'Web Apps' },
  email: { icon: 'fa-envelope', label: 'E-mails' },
  automation: { icon: 'fa-cogs', label: 'Automações' },
  agent: { icon: 'fa-robot', label: 'Agentes IA' },
  integration: { icon: 'fa-plug', label: 'Integrações' },
};

export default function AssetSection({
  type,
  assets,
  maxAllowed,
  onToggleStatus,
  onRequestActivation,
}: AssetSectionProps) {
  const config = assetTypeConfig[type];
  const activeAssets = assets.filter((a) => a.status === 'active' || a.status === 'pending');
  const hasVacantSlots = maxAllowed !== 'unlimited' && activeAssets.length < (maxAllowed as number);
  const vacantSlotCount = hasVacantSlots ? (maxAllowed as number) - activeAssets.length : 0;
  const showEmptyState = activeAssets.length === 0 && vacantSlotCount === 0;

  return (
    <section className="asset-section">
      <div className="asset-section-title" style={{ marginBottom: '20px' }}>
        <i className={`fas ${config.icon}`} style={{ marginRight: '8px', fontSize: '18px' }}></i>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600, display: 'inline' }}>
          {config.label}
          {maxAllowed !== 'unlimited' && (
            <span style={{ fontSize: '14px', color: '#999', marginLeft: '8px' }}>
              ({activeAssets.length}/{maxAllowed})
            </span>
          )}
        </h2>
      </div>

      <div className="asset-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
        {/* Ativos existentes */}
        {activeAssets.map((asset) => (
          <AssetCard
            key={asset.id}
            asset={asset}
            onToggleStatus={onToggleStatus}
          />
        ))}

        {/* Slots vazios */}
        {vacantSlotCount > 0 &&
          Array.from({ length: vacantSlotCount }).map((_, index) => (
            <AssetCard
              key={`vacant-${type}-${index}`}
              asset={{
                id: `vacant-${type}-${index}`,
                client_id: '',
                type,
                name: `${config.label}`,
                status: 'inactive',
                created_at: '',
                updated_at: '',
              } as Asset}
              variant="vacant"
              onRequestActivation={onRequestActivation}
            />
          ))}

        {/* Empty state when no assets and no vacant slots */}
        {showEmptyState && (
          <div
            style={{
              gridColumn: '1 / -1',
              padding: '32px',
              background: '#f9f9f9',
              borderRadius: '12px',
              border: '1px dashed #d4d4d4',
              textAlign: 'center',
            }}
          >
            <i
              className={`fas ${config.icon}`}
              style={{ fontSize: '28px', color: '#ccc', marginBottom: '12px', display: 'block' }}
            ></i>
            <p style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 600, color: '#666' }}>
              Nenhum {config.label.toLowerCase().replace(/s$/, '')} configurado ainda
            </p>
            <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: '#999' }}>
              Entre em contato com a equipe Tuliu para solicitar a configuracao.
            </p>
            <button
              onClick={() => onRequestActivation?.(type)}
              style={{
                padding: '10px 24px',
                background: '#111',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <i className="fas fa-paper-plane" style={{ marginRight: '8px' }}></i>
              Solicitar configuracao
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
