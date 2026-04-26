import { useEffect, useState } from 'react';
import type { Client, Asset } from '../../types/supabase';
import { supabase } from '../../lib/supabase';

interface ActivationRequest {
  id: string;
  asset_id: string;
  client_id: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  asset?: Asset;
  client?: Client;
}

interface DashboardStats {
  totalClients: number;
  totalAssets: number;
  clientsByPlan: Record<string, number>;
  assetsByType: Record<string, number>;
  activeAssetsCount: number;
  pendingAssets: Asset[];
  activationRequests: ActivationRequest[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: 0,
    totalAssets: 0,
    clientsByPlan: {},
    assetsByType: {},
    activeAssetsCount: 0,
    pendingAssets: [],
    activationRequests: [],
  });
  const [loading, setLoading] = useState(true);
  const [activatingAsset, setActivatingAsset] = useState<string | null>(null);
  const [processingRequest, setProcessingRequest] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch clients
        const { data: clients, error: clientsError } = await supabase
          .from('clients')
          .select('*, plan:plan_id(*)');

        if (clientsError) throw clientsError;

        const clientsList = (clients || []) as Client[];
        const totalClients = clientsList.length;

        // Fetch all assets
        const { data: assets, error: assetsError } = await supabase.from('assets').select('*');

        if (assetsError) throw assetsError;

        const assetsList = (assets || []) as Asset[];
        const totalAssets = assetsList.length;
        const activeAssets = assetsList.filter((a) => a.status === 'active').length;
        const pendingAssets = assetsList.filter((a) => a.status === 'pending');

        // Fetch activation requests
        const { data: requests, error: requestsError } = await supabase
          .from('activation_requests')
          .select('*, asset:asset_id(*), client:client_id(*)')
          .eq('status', 'pending')
          .order('created_at', { ascending: false });

        if (requestsError) throw requestsError;
        const activationRequests = (requests || []) as ActivationRequest[];

        // Count by plan
        const clientsByPlan: Record<string, number> = {};
        clientsList.forEach((client) => {
          const planName = client.plan?.name || 'Sem plano';
          clientsByPlan[planName] = (clientsByPlan[planName] || 0) + 1;
        });

        // Count by asset type
        const assetsByType: Record<string, number> = {};
        assetsList.forEach((asset) => {
          assetsByType[asset.type] = (assetsByType[asset.type] || 0) + 1;
        });

        setStats({
          totalClients,
          totalAssets,
          clientsByPlan,
          assetsByType,
          activeAssetsCount: activeAssets,
          pendingAssets,
          activationRequests,
        });
      } catch (err) {
        console.error('Erro ao carregar estatísticas:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleApproveActivation = async (assetId: string) => {
    setActivatingAsset(assetId);
    try {
      const { error } = await supabase
        .from('assets')
        .update({ status: 'active' })
        .eq('id', assetId);

      if (error) throw error;

      setStats((prev) => ({
        ...prev,
        pendingAssets: prev.pendingAssets.filter((a) => a.id !== assetId),
        activeAssetsCount: prev.activeAssetsCount + 1,
      }));
    } catch (err) {
      console.error('Erro ao ativar ativo:', err);
    } finally {
      setActivatingAsset(null);
    }
  };

  const handleApproveRequest = async (requestId: string) => {
    setProcessingRequest(requestId);
    try {
      const request = stats.activationRequests.find((r) => r.id === requestId);
      if (!request) throw new Error('Solicitação não encontrada');

      const { error: updateError } = await supabase
        .from('activation_requests')
        .update({ status: 'approved' })
        .eq('id', requestId);

      if (updateError) throw updateError;

      setStats((prev) => ({
        ...prev,
        activationRequests: prev.activationRequests.filter((r) => r.id !== requestId),
      }));
    } catch (err) {
      console.error('Erro ao processar solicitação:', err);
    } finally {
      setProcessingRequest(null);
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    setProcessingRequest(requestId);
    try {
      const { error: updateError } = await supabase
        .from('activation_requests')
        .update({ status: 'rejected' })
        .eq('id', requestId);

      if (updateError) throw updateError;

      setStats((prev) => ({
        ...prev,
        activationRequests: prev.activationRequests.filter((r) => r.id !== requestId),
      }));
    } catch (err) {
      console.error('Erro ao rejeitar solicitação:', err);
    } finally {
      setProcessingRequest(null);
    }
  };

  const StatCard = ({ label, value, subtext, icon }: { label: string; value: string | number; subtext?: string; icon?: string }) => (
    <div
      style={{
        padding: '24px',
        background: 'white',
        borderRadius: '12px',
        border: '1px solid #E5E7EB',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      }}
    >
      <p style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: 600, color: '#999', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
        {icon && <i className={`fas ${icon}`} style={{ fontSize: '14px' }}></i>}
        {label}
      </p>
      <p style={{ margin: '0 0 4px 0', fontSize: '32px', fontWeight: 800, color: '#111' }}>{value}</p>
      {subtext && <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>{subtext}</p>}
    </div>
  );

  if (loading) {
    return <p>Carregando estatísticas...</p>;
  }

  const assetTypeLabels: Record<string, string> = {
    domain: 'Domínios',
    subdomain: 'Subdomínios',
    website: 'Websites',
    webapp: 'Web Apps',
    email: 'E-mails',
    automation: 'Automações',
    agent: 'Agentes IA',
  };

  const assetTypeIcons: Record<string, string> = {
    domain: 'fa-globe',
    subdomain: 'fa-sitemap',
    website: 'fa-laptop-code',
    webapp: 'fa-browser',
    email: 'fa-envelope',
    automation: 'fa-cogs',
    agent: 'fa-robot',
  };

  return (
    <div>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ margin: '0 0 8px 0', fontSize: '32px', fontWeight: 800 }}>Dashboard</h1>
        <p style={{ margin: 0, fontSize: '16px', color: '#666' }}>Visão geral da infraestrutura</p>
      </div>

      {/* Main Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <StatCard label="Total de Clientes" value={stats.totalClients} icon="fa-users" />
        <StatCard label="Total de Ativos" value={stats.totalAssets} icon="fa-cubes" />
        <StatCard label="Ativos Ativos" value={stats.activeAssetsCount} icon="fa-check-circle" subtext={`${stats.totalAssets > 0 ? Math.round((stats.activeAssetsCount / stats.totalAssets) * 100) : 0}% do total`} />
      </div>

      {/* Service Activation Requests */}
      {stats.activationRequests.length > 0 && (
        <div style={{ marginBottom: '40px', padding: '24px', background: '#f0f9ff', borderRadius: '12px', border: '1px solid #0ea5e9', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <i className="fas fa-envelope-open" style={{ fontSize: '18px', color: '#0284c7' }}></i>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#0c4a6e' }}>Solicitações de Ativação de Serviços</h3>
            </div>
            <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#0369a1' }}>
              {stats.activationRequests.length} solicitação(ões) de cliente(s) aguardando processamento
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {stats.activationRequests.map((request) => (
                <div key={request.id} style={{ padding: '16px', background: 'white', borderRadius: '8px', border: '1px solid #0ea5e9' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 600, color: '#111' }}>
                        {request.client?.company || 'Cliente'}
                      </p>
                      <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#666' }}>
                        <i className={`fas ${request.asset?.type ? assetTypeIcons[request.asset.type] || 'fa-cube' : 'fa-cube'}`} style={{ marginRight: '6px' }}></i>
                        {request.asset?.type ? assetTypeLabels[request.asset.type] || request.asset.type : 'Serviço'} - {request.asset?.name || 'Sem nome'}
                      </p>
                      <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#999' }}>
                        Solicitado em {new Date(request.created_at).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: 600, color: '#0c4a6e', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      <i className="fas fa-message" style={{ marginRight: '6px' }}></i>Descrição da Solicitação
                    </p>
                    <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #bfdbfe', borderLeft: '4px solid #0284c7' }}>
                      <p style={{ margin: 0, fontSize: '14px', color: '#1e293b', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                        {request.description}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleApproveRequest(request.id)}
                      disabled={processingRequest === request.id}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        background: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: processingRequest === request.id ? 'not-allowed' : 'pointer',
                        opacity: processingRequest === request.id ? 0.7 : 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (processingRequest !== request.id) {
                          e.currentTarget.style.background = '#059669';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (processingRequest !== request.id) {
                          e.currentTarget.style.background = '#10b981';
                        }
                      }}
                    >
                      <i className="fas fa-check"></i>
                      {processingRequest === request.id ? 'Processando...' : 'Aprovar'}
                    </button>
                    <button
                      onClick={() => handleRejectRequest(request.id)}
                      disabled={processingRequest === request.id}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: processingRequest === request.id ? 'not-allowed' : 'pointer',
                        opacity: processingRequest === request.id ? 0.7 : 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (processingRequest !== request.id) {
                          e.currentTarget.style.background = '#dc2626';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (processingRequest !== request.id) {
                          e.currentTarget.style.background = '#ef4444';
                        }
                      }}
                    >
                      <i className="fas fa-times"></i>
                      {processingRequest === request.id ? 'Processando...' : 'Rejeitar'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Pending Activation Requests Alert */}
      {stats.pendingAssets.length > 0 && (
        <div style={{ marginBottom: '40px', padding: '24px', background: '#fffbeb', borderRadius: '12px', border: '1px solid #fcd34d', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <i className="fas fa-bell" style={{ fontSize: '18px', color: '#d97706' }}></i>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#92400e' }}>Solicitações de Ativação Pendentes</h3>
            </div>
            <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#b45309' }}>
              {stats.pendingAssets.length} ativo(s) aguardando aprovação para ativação
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {stats.pendingAssets.map((asset) => (
                <div key={asset.id} style={{ padding: '12px', background: 'white', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #fcd34d' }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: '0 0 2px 0', fontSize: '14px', fontWeight: 500 }}>{asset.name}</p>
                    <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>{assetTypeLabels[asset.type] || asset.type}</p>
                  </div>
                  <button
                    onClick={() => handleApproveActivation(asset.id)}
                    disabled={activatingAsset === asset.id}
                    style={{
                      padding: '8px 16px',
                      background: '#d97706',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: activatingAsset === asset.id ? 'not-allowed' : 'pointer',
                      opacity: activatingAsset === asset.id ? 0.7 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (activatingAsset !== asset.id) {
                        e.currentTarget.style.background = '#ca8a04';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activatingAsset !== asset.id) {
                        e.currentTarget.style.background = '#d97706';
                      }
                    }}
                  >
                    <i className="fas fa-check"></i>
                    {activatingAsset === asset.id ? 'Ativando...' : 'Aprovar'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Plans and Assets Distribution */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
        {/* Clients by Plan */}
        <div>
          <h2 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="fas fa-chart-pie"></i>
            Clientes por Plano
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {Object.entries(stats.clientsByPlan).map(([plan, count]) => (
              <div
                key={plan}
                style={{
                  padding: '16px',
                  background: 'white',
                  borderRadius: '8px',
                  border: '1px solid #E5E7EB',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: '14px', fontWeight: 500 }}>{plan}</span>
                <span
                  style={{
                    padding: '4px 12px',
                    background: '#f3f4f6',
                    borderRadius: '100px',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#666',
                  }}
                >
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Assets by Type */}
        <div>
          <h2 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="fas fa-chart-bar"></i>
            Ativos por Tipo
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {Object.entries(stats.assetsByType).map(([type, count]) => (
              <div
                key={type}
                style={{
                  padding: '16px',
                  background: 'white',
                  borderRadius: '8px',
                  border: '1px solid #E5E7EB',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: '14px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {assetTypeIcons[type] && <i className={`fas ${assetTypeIcons[type]}`}></i>}
                  {assetTypeLabels[type] || type}
                </span>
                <span
                  style={{
                    padding: '4px 12px',
                    background: '#f3f4f6',
                    borderRadius: '100px',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#666',
                  }}
                >
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
