import { useState } from 'react';
import type { Asset, Client } from '../../types/supabase';
import { supabase } from '../../lib/supabase';
import { useToast } from '../Toast';

interface ClientDetailProps {
  client: Client;
  assets: Asset[];
}

const assetTypeIcons: Record<string, string> = {
  domain: 'fa-globe',
  subdomain: 'fa-sitemap',
  website: 'fa-laptop-code',
  webapp: 'fa-browser',
  email: 'fa-envelope',
  automation: 'fa-cogs',
  agent: 'fa-robot',
};

const assetTypeLabels: Record<string, string> = {
  domain: 'Domínio',
  subdomain: 'Subdomínio',
  website: 'Website',
  webapp: 'Web App',
  email: 'E-mail',
  automation: 'Automação',
  agent: 'Agente IA',
};

export default function ClientDetail({ client, assets }: ClientDetailProps) {
  const { show } = useToast();
  const [assetStatuses, setAssetStatuses] = useState<Record<string, string>>(
    Object.fromEntries(assets.map((a) => [a.id, a.status]))
  );
  const [loading, setLoading] = useState(false);

  const handleToggleStatus = async (assetId: string) => {
    const currentStatus = assetStatuses[assetId];
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

    setAssetStatuses((prev) => ({ ...prev, [assetId]: newStatus }));
    setLoading(true);

    try {
      const { error } = await supabase
        .from('assets')
        .update({ status: newStatus })
        .eq('id', assetId);

      if (error) throw error;
      show(`Ativo ${newStatus === 'active' ? 'ativado' : 'desativado'}`, 'success');
    } catch (err) {
      setAssetStatuses((prev) => ({ ...prev, [assetId]: currentStatus }));
      show('Erro ao atualizar ativo', 'error');
    } finally {
      setLoading(false);
    }
  };

  const groupedAssets = assets.reduce(
    (acc, asset) => {
      const type = asset.type;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(asset);
      return acc;
    },
    {} as Record<string, Asset[]>
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
            <strong>Plano:</strong> {client.plan?.name || 'N/A'}
          </p>
          <p style={{ margin: 0 }}>
            <strong>Faturamento:</strong> R$ {(client.plan?.price || 0).toLocaleString('pt-BR')}/{client.plan?.billing === 'monthly' ? 'mês' : 'ano'}
          </p>
        </div>
      </div>

      {/* Assets by Type */}
      {Object.keys(groupedAssets).length === 0 ? (
        <div style={{ padding: '24px', textAlign: 'center', background: '#f9f9f9', borderRadius: '8px', color: '#666' }}>
          Nenhum ativo cadastrado para este cliente
        </div>
      ) : (
        Object.entries(groupedAssets).map(([type, typeAssets]) => (
          <div key={type} style={{ marginBottom: '24px' }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <i className={`fas ${assetTypeIcons[type]}`} style={{ marginRight: '6px' }}></i>{assetTypeLabels[type]} <span style={{ fontWeight: 400, color: '#999' }}>({typeAssets.length})</span>
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {typeAssets.map((asset) => {
                const status = assetStatuses[asset.id];
                const statusColor = {
                  active: '#22c55e',
                  inactive: '#ef4444',
                  pending: '#f59e0b',
                }[status] || '#999';

                const statusLabel = {
                  active: 'Ativo',
                  inactive: 'Inativo',
                  pending: 'Em config',
                }[status] || status;

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
                      {asset.description && (
                        <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#999' }}>
                          {asset.description}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleToggleStatus(asset.id)}
                      disabled={loading}
                      style={{
                        background: 'none',
                        border: '1px solid #d4d4d4',
                        padding: '4px 10px',
                        borderRadius: '100px',
                        fontSize: '11px',
                        fontWeight: 500,
                        cursor: loading ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: '#666',
                        transition: 'all 0.2s ease',
                        opacity: loading ? 0.6 : 1,
                      }}
                      onMouseEnter={(e) => {
                        if (!loading) {
                          e.currentTarget.style.borderColor = '#999';
                          e.currentTarget.style.color = '#111';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!loading) {
                          e.currentTarget.style.borderColor = '#d4d4d4';
                          e.currentTarget.style.color = '#666';
                        }
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
                      {statusLabel}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
