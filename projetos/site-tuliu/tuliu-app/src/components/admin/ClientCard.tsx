import type { Client } from '../../types/supabase';

interface ClientCardProps {
  client: Client;
  isSelected?: boolean;
  onSelect?: () => void;
  assetCount?: number;
  activeAssetCount?: number;
}

const planColors: Record<string, { bg: string; color: string }> = {
  starter: { bg: '#f3f3f3', color: '#666' },
  business: { bg: '#111111', color: '#ffffff' },
  enterprise: { bg: '#6366f1', color: '#ffffff' },
};

export default function ClientCard({ client, isSelected = false, onSelect, assetCount = 0, activeAssetCount = 0 }: ClientCardProps) {
  const planColor = planColors[client.plan?.tier || 'starter'];
  const totalAssets = assetCount;
  const activeAssets = activeAssetCount;

  return (
    <article
      onClick={onSelect}
      style={{
        padding: '16px',
        border: isSelected ? '2px solid #111111' : '1px solid #ebebeb',
        borderRadius: '12px',
        background: isSelected ? '#fafafa' : '#ffffff',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = '#d4d4d4';
          e.currentTarget.style.background = '#fafafa';
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = '#ebebeb';
          e.currentTarget.style.background = '#ffffff';
        }
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 600 }}>
            {client.company}
          </h3>
          <p style={{ margin: 0, fontSize: '12px', color: '#999' }}>
            {client.name}
          </p>
        </div>
        <span
          style={{
            padding: '4px 10px',
            borderRadius: '100px',
            fontSize: '12px',
            fontWeight: 600,
            background: planColor.bg,
            color: planColor.color,
            whiteSpace: 'nowrap',
          }}
        >
          {client.plan?.name || 'Starter'}
        </span>
      </div>

      <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#666', paddingTop: '12px', borderTop: '1px solid #e5e7eb' }}>
        <div>
          <span style={{ color: '#999' }}>E-mail:</span>
          <p style={{ margin: '2px 0 0 0', fontSize: '12px' }}>{client.email}</p>
        </div>
        <div>
          <span style={{ color: '#999' }}>Ativos:</span>
          <p style={{ margin: '2px 0 0 0', fontSize: '12px' }}>
            {activeAssets}/{totalAssets}
          </p>
        </div>
        <div>
          <span style={{ color: '#999' }}>Faturamento:</span>
          <p style={{ margin: '2px 0 0 0', fontSize: '12px' }}>
            R$ {(client.plan?.price || 0).toLocaleString('pt-BR')}
          </p>
        </div>
      </div>
    </article>
  );
}
