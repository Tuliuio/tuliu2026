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
  webapp: { icon: 'fa-browser', label: 'Web Apps' },
  email: { icon: 'fa-envelope', label: 'E-mails' },
  automation: { icon: 'fa-cogs', label: 'Automações' },
  agent: { icon: 'fa-robot', label: 'Agentes IA' },
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
  const canRequest = maxAllowed === 'unlimited' || (maxAllowed as number) > 0;

  if (activeAssets.length === 0 && !hasVacantSlots && !canRequest) {
    return null;
  }

  const vacantSlotCount = hasVacantSlots ? (maxAllowed as number) - activeAssets.length : 0;
  const showRequestSlot = activeAssets.length === 0 && maxAllowed === 0;

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

        {/* Request slot when limit is 0 */}
        {showRequestSlot && (
          <AssetCard
            key={`request-${type}`}
            asset={{
              id: `request-${type}`,
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
        )}
      </div>
    </section>
  );
}
