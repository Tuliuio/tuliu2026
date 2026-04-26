import { useState, useEffect } from 'react';
import type { Asset } from '../../types/supabase';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import DashboardLayout from './DashboardLayout';
import PlanBanner from './PlanBanner';
import AssetSection from './AssetSection';
import ClientOverview from './ClientOverview';
import AutomationsSection from './AutomationsSection';
import AgentsSection from './AgentsSection';

function DashboardContent({ section }: { section: string }) {
  const { client } = useAuth();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [assetStatuses, setAssetStatuses] = useState<Record<string, Asset['status']>>({});

  useEffect(() => {
    const fetchAssets = async () => {
      if (!client) {
        console.log('[Dashboard] No client, skipping asset fetch');
        return;
      }

      try {
        console.log('[Dashboard] Fetching assets for client:', client.id);
        const { data, error } = await supabase
          .from('assets')
          .select('*')
          .eq('client_id', client.id);

        if (error) {
          console.error('[Dashboard] Error fetching assets:', error.message, error.code);
          return;
        }

        console.log('[Dashboard] Assets fetched:', data?.length || 0);
        setAssets(data || []);
        setAssetStatuses(Object.fromEntries((data || []).map((a) => [a.id, a.status])));
      } catch (err) {
        console.error('[Dashboard] Unexpected error:', err);
      }
    };

    fetchAssets();
  }, [client]);

  const handleToggleStatus = async (assetId: string) => {
    const newStatus = assetStatuses[assetId] === 'active' ? 'inactive' : 'active';
    setAssetStatuses((prev) => ({ ...prev, [assetId]: newStatus }));

    const { error } = await supabase
      .from('assets')
      .update({ status: newStatus })
      .eq('id', assetId);

    if (error) {
      console.error('Error updating asset:', error);
      setAssetStatuses((prev) => {
        const current = prev[assetId];
        return { ...prev, [assetId]: current === 'active' ? 'inactive' : 'active' };
      });
    }
  };

  const getAssetsByType = (type: string) => {
    return assets
      .filter((a) => a.type === type)
      .map((a) => ({ ...a, status: assetStatuses[a.id] as Asset['status'] }));
  };

  if (!client) {
    return (
      <div style={{ padding: '40px' }}>
        <p>Carregando dados do cliente...</p>
      </div>
    );
  }

  const { company, plan } = client;

  // Show overview by default
  if (section === 'overview') {
    return (
      <div style={{ padding: '40px' }}>
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '32px', fontWeight: 800 }}>
            Olá, {company.split(' ')[0] || 'Usuário'}!
          </h1>
          <p style={{ margin: 0, fontSize: '16px', color: '#666' }}>
            Aqui está toda a sua infraestrutura digital centralizada.
          </p>
        </div>

        {/* Client Overview */}
        <ClientOverview />

        {/* Plan Banner */}
        {plan && <PlanBanner plan={plan} assets={assets} />}

        {/* Asset Sections */}
        {plan && (
          <div style={{ marginTop: '60px' }}>
            {/* Domínios */}
            <AssetSection
              type="domain"
              assets={getAssetsByType('domain')}
              maxAllowed={plan.limits.domains}
              onToggleStatus={handleToggleStatus}
            />

            {/* Subdomínios */}
            <AssetSection
              type="subdomain"
              assets={getAssetsByType('subdomain')}
              maxAllowed={'unlimited'}
              onToggleStatus={handleToggleStatus}
            />

            {/* Websites/Webapps */}
            <div style={{ marginTop: '40px' }}>
              <AssetSection
                type="website"
                assets={getAssetsByType('website')}
                maxAllowed={plan.limits.sites}
                onToggleStatus={handleToggleStatus}
              />
            </div>

            {/* E-mails */}
            <div style={{ marginTop: '40px' }}>
              <AssetSection
                type="email"
                assets={getAssetsByType('email')}
                maxAllowed={plan.limits.emails}
                onToggleStatus={handleToggleStatus}
              />
            </div>

            {/* Automações */}
            {(plan.limits.automations === 'unlimited' || plan.limits.automations > 0) && (
              <div style={{ marginTop: '40px' }}>
                <AssetSection
                  type="automation"
                  assets={getAssetsByType('automation')}
                  maxAllowed={plan.limits.automations}
                  onToggleStatus={handleToggleStatus}
                />
              </div>
            )}

            {/* Agentes IA */}
            {(plan.limits.agents === 'unlimited' || plan.limits.agents > 0) && (
              <div style={{ marginTop: '40px' }}>
                <AssetSection
                  type="agent"
                  assets={getAssetsByType('agent')}
                  maxAllowed={plan.limits.agents}
                  onToggleStatus={handleToggleStatus}
                />
              </div>
            )}
          </div>
        )}

        {/* Call to Action */}
        <div style={{ marginTop: '80px', padding: '40px', textAlign: 'center', background: '#f9f9f9', borderRadius: '16px' }}>
          <h2 style={{ margin: '0 0 12px 0', fontSize: '20px', fontWeight: 700 }}>
            Precisa de mais recursos?
          </h2>
          <p style={{ margin: '0 0 24px 0', color: '#666' }}>
            Suba para o plano Business ou Enterprise e desbloqueie novas possibilidades.
          </p>
          <button className="btn btn-primary">
            Ver planos
          </button>
        </div>
      </div>
    );
  }

  if (section === 'automations') {
    return <AutomationsSection />;
  }

  if (section === 'agents') {
    return <AgentsSection />;
  }

  // For other sections (domains, websites, emails, etc)
  return (
    <div style={{ padding: '40px' }}>
      <p>Seção em desenvolvimento</p>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <DashboardLayout>
      {(currentSection) => <DashboardContent section={currentSection} />}
    </DashboardLayout>
  );
}
