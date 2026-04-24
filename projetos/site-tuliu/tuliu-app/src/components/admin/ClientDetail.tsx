import { useState } from 'react';
import type { Asset, Client } from '../../types/dashboard';

interface ClientDetailProps {
  client: Client;
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

export default function ClientDetail({ client }: ClientDetailProps) {
  const [assetStatuses, setAssetStatuses] = useState<Record<string, Asset['status']>>(
    Object.fromEntries(client.assets.map((a) => [a.id, a.status]))
  );

  const handleToggleStatus = (assetId: string) => {
    setAssetStatuses((prev) => {
      const current = prev[assetId];
      const next = current === 'active' ? 'inactive' : 'active';
      return { ...prev, [assetId]: next };
    });
  };

  const groupedAssets = client.assets.reduce(
    (acc, asset) => {
      const type = asset.type;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(asset);
      return acc;
    },
    {} as Record<Asset['type'], Asset[]>
  );

  return (
    <div className="client-detail">
      {/* Client Info */}
      <div
        style={{
          padding: '16px',
          background: '#f9f9f9',
          borderRadius: '12px',
          marginBottom: '24px',
        }}
      >
        <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600, color: '#666' }}>
          Informações do Cliente
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
          <p style={{ margin: 0 }}>
            <strong>Nome:</strong> {client.name}
          </p>
          <p style={{ margin: 0 }}>
            <strong>Empresa:</strong> {client.company}
          </p>
          <p style={{ margin: 0 }}>
            <strong>E-mail:</strong> {client.email}
          </p>
          <p style={{ margin: 0 }}>
            <strong>Plano:</strong> {client.plan.name}
          </p>
          <p style={{ margin: 0 }}>
            <strong>Faturamento:</strong> R$ {client.plan.price.toLocaleString('pt-BR')}/{client.plan.billing === 'monthly' ? 'mês' : 'ano'}
          </p>
        </div>
      </div>

      {/* Assets by Type */}
      {Object.entries(groupedAssets).map(([type, assets]) => (
        <div key={type} style={{ marginBottom: '24px' }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            <i className={`fas ${assetTypeIcons[type as Asset['type']]}`} style={{ marginRight: '6px' }}></i>
            {assetTypeLabels[type as Asset['type']]}{' '}
            <span style={{ fontWeight: 400, color: '#999' }}>({assets.length})</span>
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {assets.map((asset) => {
              const status = assetStatuses[asset.id];
              const statusColor = {
                active: '#22c55e',
                inactive: '#ef4444',
                pending: '#f59e0b',
              }[status];

              return (
                <div
                  key={asset.id}
                  style={{
                    padding: '12px',
                    background: '#fafafa',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    border: '1px solid #ebebeb',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: '0 0 4px 0', fontSize: '13px', fontWeight: 500 }}>
                      {asset.name}
                    </p>
                    {asset.url && (
                      <p style={{ margin: 0, fontSize: '11px', color: '#0066cc' }}>
                        <a href={asset.url} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>
                          {asset.url}
                        </a>
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleToggleStatus(asset.id)}
                    style={{
                      background: 'none',
                      border: '1px solid #d4d4d4',
                      padding: '4px 10px',
                      borderRadius: '100px',
                      fontSize: '11px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: '#666',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#999';
                      e.currentTarget.style.color = '#111';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#d4d4d4';
                      e.currentTarget.style.color = '#666';
                    }}
                  >
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: statusColor,
                      }}
                    ></span>
                    {status === 'active' ? 'Ativo' : status === 'inactive' ? 'Inativo' : 'Em config'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
