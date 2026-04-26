import { useEffect, useState } from 'react';
import type { Client, Asset } from '../../types/supabase';
import { supabase } from '../../lib/supabase';

interface DashboardStats {
  totalClients: number;
  totalAssets: number;
  clientsByPlan: Record<string, number>;
  assetsByType: Record<string, number>;
  activeAssetsCount: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: 0,
    totalAssets: 0,
    clientsByPlan: {},
    assetsByType: {},
    activeAssetsCount: 0,
  });
  const [loading, setLoading] = useState(true);

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
        });
      } catch (err) {
        console.error('Erro ao carregar estatísticas:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({ label, value, subtext }: { label: string; value: string | number; subtext?: string }) => (
    <div
      style={{
        padding: '24px',
        background: 'white',
        borderRadius: '12px',
        border: '1px solid #E5E7EB',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      }}
    >
      <p style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: 600, color: '#999', textTransform: 'uppercase' }}>
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

  return (
    <div>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ margin: '0 0 8px 0', fontSize: '32px', fontWeight: 800 }}>Dashboard</h1>
        <p style={{ margin: 0, fontSize: '16px', color: '#666' }}>Visão geral da infraestrutura</p>
      </div>

      {/* Main Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <StatCard label="Total de Clientes" value={stats.totalClients} />
        <StatCard label="Total de Ativos" value={stats.totalAssets} />
        <StatCard label="Ativos Ativos" value={stats.activeAssetsCount} subtext={`${stats.totalAssets > 0 ? Math.round((stats.activeAssetsCount / stats.totalAssets) * 100) : 0}% do total`} />
      </div>

      {/* Plans and Assets Distribution */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
        {/* Clients by Plan */}
        <div>
          <h2 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 600 }}>Clientes por Plano</h2>
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
          <h2 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 600 }}>Ativos por Tipo</h2>
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
                <span style={{ fontSize: '14px', fontWeight: 500 }}>{assetTypeLabels[type] || type}</span>
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
