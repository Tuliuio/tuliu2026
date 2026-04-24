import { useState } from 'react';
import type { Asset } from '../../types/dashboard';
import { currentClient } from '../../data/dashboard';
import PlanBanner from './PlanBanner';
import AssetSection from './AssetSection';

export default function DashboardPage() {
  const [assetStatuses, setAssetStatuses] = useState<Record<string, Asset['status']>>(
    Object.fromEntries(currentClient.assets.map((a) => [a.id, a.status]))
  );

  const handleToggleStatus = (assetId: string) => {
    setAssetStatuses((prev) => {
      const current = prev[assetId];
      const next = current === 'active' ? 'inactive' : 'active';
      return { ...prev, [assetId]: next };
    });
  };

  const getAssetsByType = (type: string) => {
    return currentClient.assets
      .filter((a) => a.type === type)
      .map((a) => ({ ...a, status: assetStatuses[a.id] as Asset['status'] }));
  };

  const { company, plan } = currentClient;

  return (
    <div className="dashboard-page" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      <div className="container">
        {/* Header */}
        <div className="dashboard-header" style={{ marginBottom: '40px' }}>
          <div>
            <h1 style={{ margin: '0 0 8px 0', fontSize: '32px', fontWeight: 800 }}>
              Olá, {company.split(' ')[0]}!
            </h1>
            <p style={{ margin: 0, fontSize: '16px', color: '#666' }}>
              Aqui está toda a sua infraestrutura digital centralizada.
            </p>
          </div>
        </div>

        {/* Plan Banner */}
        <PlanBanner client={currentClient} />

        {/* Asset Sections */}
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
    </div>
  );
}
