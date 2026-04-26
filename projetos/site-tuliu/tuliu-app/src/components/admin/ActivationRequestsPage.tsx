import { useState, useEffect } from 'react';
import type { Asset, Client } from '../../types/supabase';
import { supabase } from '../../lib/supabase';
import { useToast } from '../Toast';

interface PendingAsset extends Asset {
  client?: Client;
}

const assetTypeIcons: Record<string, string> = {
  domain: 'fa-globe',
  subdomain: 'fa-sitemap',
  website: 'fa-laptop-code',
  webapp: 'fa-browser',
  email: 'fa-envelope',
  automation: 'fa-cogs',
  agent: 'fa-robot',
  integration: 'fa-plug',
};

const assetTypeLabels: Record<string, string> = {
  domain: 'Domínio',
  subdomain: 'Subdomínio',
  website: 'Website',
  webapp: 'Web App',
  email: 'E-mail',
  automation: 'Automação',
  agent: 'Agente IA',
  integration: 'Integração',
};

export default function ActivationRequestsPage() {
  const { show } = useToast();
  const [pendingAssets, setPendingAssets] = useState<PendingAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPendingAssets = async () => {
      try {
        const { data: assets, error } = await supabase
          .from('assets')
          .select('*, client:client_id(*)')
          .eq('status', 'pending')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPendingAssets((assets || []) as PendingAsset[]);
      } catch (err) {
        console.error('Erro ao carregar solicitações:', err);
        show('Erro ao carregar solicitações', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchPendingAssets();
  }, [show]);

  const handleApprove = async (assetId: string) => {
    setProcessingId(assetId);
    try {
      const { error } = await supabase
        .from('assets')
        .update({ status: 'active' })
        .eq('id', assetId);

      if (error) throw error;
      show('Ativo ativado com sucesso!', 'success');
      setPendingAssets((prev) => prev.filter((a) => a.id !== assetId));
    } catch (err) {
      console.error('Erro ao ativar:', err);
      show('Erro ao ativar ativo', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (assetId: string) => {
    if (!confirm('Tem certeza que deseja rejeitar esta solicitação?')) return;

    setProcessingId(assetId);
    try {
      const { error } = await supabase
        .from('assets')
        .delete()
        .eq('id', assetId);

      if (error) throw error;
      show('Solicitação rejeitada', 'success');
      setPendingAssets((prev) => prev.filter((a) => a.id !== assetId));
    } catch (err) {
      console.error('Erro ao rejeitar:', err);
      show('Erro ao rejeitar solicitação', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p>Carregando solicitações...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <i className="fas fa-bell" style={{ fontSize: '28px', color: '#d97706' }}></i>
          <h1 style={{ margin: 0, fontSize: '32px', fontWeight: 800 }}>
            Solicitações de Ativação
          </h1>
        </div>
        <p style={{ margin: 0, fontSize: '16px', color: '#666' }}>
          {pendingAssets.length} {pendingAssets.length === 1 ? 'solicitação' : 'solicitações'} aguardando processamento
        </p>
      </div>

      {/* Empty State */}
      {pendingAssets.length === 0 ? (
        <div
          style={{
            padding: '40px',
            textAlign: 'center',
            background: 'white',
            borderRadius: '12px',
            border: '1px solid #E5E7EB',
          }}
        >
          <i className="fas fa-check-circle" style={{ fontSize: '48px', color: '#10b981', marginBottom: '16px', display: 'block' }}></i>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 600, color: '#111' }}>
            Nenhuma solicitação pendente
          </h3>
          <p style={{ margin: 0, color: '#666' }}>
            Todas as solicitações foram processadas
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {pendingAssets.map((asset) => (
            <div
              key={asset.id}
              style={{
                padding: '20px',
                background: 'white',
                borderRadius: '12px',
                border: '1px solid #E5E7EB',
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: '20px',
                alignItems: 'start',
              }}
            >
              <div style={{ display: 'flex', gap: '16px' }}>
                {/* Asset Icon */}
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    background: '#f3f4f6',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <i
                    className={`fas ${assetTypeIcons[asset.type]}`}
                    style={{ fontSize: '20px', color: '#666' }}
                  ></i>
                </div>

                {/* Details */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  {/* Client and Asset Info */}
                  <div style={{ marginBottom: '12px' }}>
                    <p style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 600, color: '#111' }}>
                      {asset.client?.name || 'Cliente desconhecido'}
                    </p>
                    <p style={{ margin: '0 0 2px 0', fontSize: '13px', color: '#666' }}>
                      {asset.client?.email}
                    </p>
                    <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#999' }}>
                      Empresa: {asset.client?.company || 'N/A'}
                    </p>
                  </div>

                  {/* Asset Details */}
                  <div
                    style={{
                      padding: '12px',
                      background: '#f9f9f9',
                      borderRadius: '8px',
                      marginBottom: '12px',
                      border: '1px solid #E5E7EB',
                    }}
                  >
                    <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '12px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#666', minWidth: '100px' }}>
                        Tipo:
                      </span>
                      <span style={{ fontSize: '12px', color: '#111' }}>
                        {assetTypeLabels[asset.type] || asset.type}
                      </span>

                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#666' }}>
                        Nome:
                      </span>
                      <span style={{ fontSize: '12px', color: '#111' }}>
                        {asset.name}
                      </span>

                      {asset.url && (
                        <>
                          <span style={{ fontSize: '12px', fontWeight: 600, color: '#666' }}>
                            URL:
                          </span>
                          <span style={{ fontSize: '12px', color: '#0066cc' }}>
                            <a href={asset.url} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>
                              {asset.url}
                            </a>
                          </span>
                        </>
                      )}

                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#666' }}>
                        Data:
                      </span>
                      <span style={{ fontSize: '12px', color: '#111' }}>
                        {new Date(asset.created_at).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  {asset.description && (
                    <div
                      style={{
                        padding: '12px',
                        background: '#f0f9ff',
                        borderRadius: '8px',
                        border: '1px solid #bfdbfe',
                      }}
                    >
                      <p style={{ margin: '0 0 6px 0', fontSize: '12px', fontWeight: 600, color: '#0369a1' }}>
                        Descrição da Solicitação:
                      </p>
                      <p
                        style={{
                          margin: 0,
                          fontSize: '13px',
                          color: '#0c4a6e',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                        }}
                      >
                        {asset.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
                <button
                  onClick={() => handleApprove(asset.id)}
                  disabled={processingId === asset.id}
                  style={{
                    padding: '10px 16px',
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: processingId === asset.id ? 'not-allowed' : 'pointer',
                    opacity: processingId === asset.id ? 0.7 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease',
                    minWidth: '120px',
                  }}
                  onMouseEnter={(e) => {
                    if (processingId !== asset.id) {
                      e.currentTarget.style.background = '#059669';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (processingId !== asset.id) {
                      e.currentTarget.style.background = '#10b981';
                    }
                  }}
                >
                  <i className="fas fa-check"></i>
                  {processingId === asset.id ? 'Ativando...' : 'Aprovar'}
                </button>
                <button
                  onClick={() => handleReject(asset.id)}
                  disabled={processingId === asset.id}
                  style={{
                    padding: '10px 16px',
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: processingId === asset.id ? 'not-allowed' : 'pointer',
                    opacity: processingId === asset.id ? 0.7 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease',
                    minWidth: '120px',
                  }}
                  onMouseEnter={(e) => {
                    if (processingId !== asset.id) {
                      e.currentTarget.style.background = '#dc2626';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (processingId !== asset.id) {
                      e.currentTarget.style.background = '#ef4444';
                    }
                  }}
                >
                  <i className="fas fa-times"></i>
                  {processingId === asset.id ? 'Rejeitando...' : 'Rejeitar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
