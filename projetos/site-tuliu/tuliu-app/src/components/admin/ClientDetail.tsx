import { useState } from 'react';
import type { Asset, Client } from '../../types/supabase';
import { supabase } from '../../lib/supabase';
import { useToast } from '../Toast';

interface ClientDetailProps {
  client: Client;
  assets: Asset[];
  onAssetDeleted?: () => void;
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

export default function ClientDetail({ client, assets, onAssetDeleted }: ClientDetailProps) {
  const { show } = useToast();
  const [assetStatuses, setAssetStatuses] = useState<Record<string, string>>(
    Object.fromEntries(assets.map((a) => [a.id, a.status]))
  );
  const [loading, setLoading] = useState(false);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [requestDescription, setRequestDescription] = useState('');
  const [deletingAssetId, setDeletingAssetId] = useState<string | null>(null);

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

  const handleRequestActivation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsset || !requestDescription.trim()) {
      show('Por favor, descreva o que necessita', 'error');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('activation_requests')
        .insert([
          {
            asset_id: selectedAsset.id,
            client_id: client.id,
            description: requestDescription,
          },
        ]);

      if (error) throw error;
      show('Solicitação enviada com sucesso!', 'success');
      setRequestModalOpen(false);
      setRequestDescription('');
      setSelectedAsset(null);
    } catch (err) {
      show('Erro ao enviar solicitação', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAsset = async (assetId: string) => {
    if (!confirm('Tem certeza que deseja remover este ativo? Esta ação não pode ser desfeita.')) return;

    setDeletingAssetId(assetId);
    try {
      const { error } = await supabase
        .from('assets')
        .delete()
        .eq('id', assetId);

      if (error) throw error;
      show('Ativo removido com sucesso!', 'success');
      onAssetDeleted?.();
    } catch (err) {
      show('Erro ao remover ativo', 'error');
    } finally {
      setDeletingAssetId(null);
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
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      {status !== 'active' && (
                        <button
                          onClick={() => {
                            setSelectedAsset(asset);
                            setRequestModalOpen(true);
                          }}
                          disabled={loading || deletingAssetId === asset.id}
                          style={{
                            background: 'none',
                            border: '1px solid #3b82f6',
                            padding: '4px 10px',
                            borderRadius: '100px',
                            fontSize: '11px',
                            fontWeight: 500,
                            cursor: loading || deletingAssetId === asset.id ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            color: '#3b82f6',
                            transition: 'all 0.2s ease',
                            opacity: loading || deletingAssetId === asset.id ? 0.6 : 1,
                          }}
                          onMouseEnter={(e) => {
                            if (!loading && deletingAssetId !== asset.id) {
                              e.currentTarget.style.borderColor = '#2563eb';
                              e.currentTarget.style.color = '#2563eb';
                              e.currentTarget.style.background = '#eff6ff';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!loading && deletingAssetId !== asset.id) {
                              e.currentTarget.style.borderColor = '#3b82f6';
                              e.currentTarget.style.color = '#3b82f6';
                              e.currentTarget.style.background = 'none';
                            }
                          }}
                        >
                          <i className="fas fa-paper-plane" style={{ fontSize: '10px' }}></i>
                          Solicitar
                        </button>
                      )}
                      <button
                        onClick={() => handleToggleStatus(asset.id)}
                        disabled={loading || deletingAssetId === asset.id}
                        style={{
                          background: 'none',
                          border: '1px solid #d4d4d4',
                          padding: '4px 10px',
                          borderRadius: '100px',
                          fontSize: '11px',
                          fontWeight: 500,
                          cursor: loading || deletingAssetId === asset.id ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          color: '#666',
                          transition: 'all 0.2s ease',
                          opacity: loading || deletingAssetId === asset.id ? 0.6 : 1,
                        }}
                        onMouseEnter={(e) => {
                          if (!loading && deletingAssetId !== asset.id) {
                            e.currentTarget.style.borderColor = '#999';
                            e.currentTarget.style.color = '#111';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!loading && deletingAssetId !== asset.id) {
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
                      <button
                        onClick={() => handleDeleteAsset(asset.id)}
                        disabled={loading || deletingAssetId === asset.id}
                        style={{
                          background: 'none',
                          border: '1px solid #ef4444',
                          padding: '4px 10px',
                          borderRadius: '100px',
                          fontSize: '11px',
                          fontWeight: 500,
                          cursor: loading || deletingAssetId === asset.id ? 'not-allowed' : 'pointer',
                          color: '#ef4444',
                          transition: 'all 0.2s ease',
                          opacity: loading || deletingAssetId === asset.id ? 0.6 : 1,
                        }}
                        onMouseEnter={(e) => {
                          if (!loading && deletingAssetId !== asset.id) {
                            e.currentTarget.style.borderColor = '#dc2626';
                            e.currentTarget.style.color = '#dc2626';
                            e.currentTarget.style.background = '#fef2f2';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!loading && deletingAssetId !== asset.id) {
                            e.currentTarget.style.borderColor = '#ef4444';
                            e.currentTarget.style.color = '#ef4444';
                            e.currentTarget.style.background = 'none';
                          }
                        }}
                      >
                        <i className="fas fa-trash" style={{ fontSize: '10px' }}></i>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}

      {/* Request Activation Modal */}
      {requestModalOpen && selectedAsset && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1001,
            padding: '20px',
          }}
          onClick={() => setRequestModalOpen(false)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '12px',
              padding: '32px',
              maxWidth: '500px',
              width: '100%',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: 700 }}>Solicitar Ativação</h2>
            <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: '#666' }}>
              {assetTypeLabels[selectedAsset.type]} - {selectedAsset.name}
            </p>

            <form onSubmit={handleRequestActivation}>
              <label style={{ display: 'block', marginBottom: '16px' }}>
                <span style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#666', marginBottom: '6px' }}>
                  Descrição do que você necessita
                </span>
                <textarea
                  value={requestDescription}
                  onChange={(e) => setRequestDescription(e.target.value)}
                  placeholder="Descreva em detalhes o que você precisa com este ativo..."
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    boxSizing: 'border-box',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    minHeight: '120px',
                    resize: 'vertical',
                  }}
                />
              </label>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setRequestModalOpen(false);
                    setRequestDescription('');
                    setSelectedAsset(null);
                  }}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#f3f4f6',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: loading ? '#999' : '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: loading ? 'not-allowed' : 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) (e.currentTarget as HTMLButtonElement).style.background = '#2563eb';
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) (e.currentTarget as HTMLButtonElement).style.background = '#3b82f6';
                  }}
                >
                  {loading ? 'Enviando...' : 'Enviar Solicitação'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
