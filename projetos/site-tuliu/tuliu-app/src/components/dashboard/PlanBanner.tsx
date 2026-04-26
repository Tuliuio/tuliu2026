import type { Asset, Plan } from '../../types/supabase';

interface PlanBannerProps {
  plan: Plan;
  assets: Asset[];
}

export default function PlanBanner({ plan, assets }: PlanBannerProps) {
  const limits = plan.limits;

  const countAssetsByType = (type: string) => {
    return assets.filter((a) => a.type === type && (a.status === 'active' || a.status === 'pending')).length;
  };

  const calculateUsage = (count: number, limit: number | 'unlimited') => {
    if (limit === 'unlimited') return { percentage: 0, display: '∞' };
    const percentage = (count / limit) * 100;
    return { percentage: Math.min(percentage, 100), display: `${count}/${limit}` };
  };

  const domainCount = countAssetsByType('domain');
  const siteCount = countAssetsByType('website') + countAssetsByType('webapp');
  const emailCount = countAssetsByType('email');
  const automationCount = countAssetsByType('automation');
  const agentCount = countAssetsByType('agent');

  const domainUsage = calculateUsage(domainCount, limits.domains);
  const siteUsage = calculateUsage(siteCount, limits.sites);
  const emailUsage = calculateUsage(emailCount, limits.emails);
  const automationUsage = calculateUsage(automationCount, limits.automations);
  const agentUsage = calculateUsage(agentCount, limits.agents);

  const planBadgeColor = {
    starter: '#F3F3F3',
    business: '#111111',
    enterprise: '#6366f1',
  };

  const planTextColor = {
    starter: '#111111',
    business: '#ffffff',
    enterprise: '#ffffff',
  };

  return (
    <div className="plan-banner">
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: 700 }}>{plan.name}</h2>
          <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
            {plan.billing === 'monthly' ? 'Faturamento mensal' : 'Faturamento anual'} • R$ {plan.price.toLocaleString('pt-BR')}
          </p>
        </div>
        <span
          className="badge"
          style={{
            background: planBadgeColor[plan.tier],
            color: planTextColor[plan.tier],
            padding: '8px 16px',
            fontSize: '13px',
            fontWeight: 600,
          }}
        >
          {plan.name}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        {/* Domínios */}
        <div className="usage-item">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
              <i className="fas fa-globe" style={{ marginRight: '6px' }}></i>
              Domínios
            </label>
            <span style={{ fontSize: '12px', color: '#999' }}>{domainUsage.display}</span>
          </div>
          <div
            style={{
              height: '6px',
              background: '#e5e7eb',
              borderRadius: '3px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                background: domainUsage.percentage > 80 ? '#ef4444' : '#22c55e',
                width: `${domainUsage.percentage || 0}%`,
                transition: 'width 0.3s ease',
              }}
            ></div>
          </div>
        </div>

        {/* Websites/Webapps */}
        <div className="usage-item">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
              <i className="fas fa-laptop-code" style={{ marginRight: '6px' }}></i>
              Websites
            </label>
            <span style={{ fontSize: '12px', color: '#999' }}>{siteUsage.display}</span>
          </div>
          <div
            style={{
              height: '6px',
              background: '#e5e7eb',
              borderRadius: '3px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                background: siteUsage.percentage > 80 ? '#ef4444' : '#22c55e',
                width: `${siteUsage.percentage || 0}%`,
                transition: 'width 0.3s ease',
              }}
            ></div>
          </div>
        </div>

        {/* Emails */}
        <div className="usage-item">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
              <i className="fas fa-envelope" style={{ marginRight: '6px' }}></i>
              E-mails
            </label>
            <span style={{ fontSize: '12px', color: '#999' }}>{emailUsage.display}</span>
          </div>
          <div
            style={{
              height: '6px',
              background: '#e5e7eb',
              borderRadius: '3px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                background: emailUsage.percentage > 80 ? '#ef4444' : '#22c55e',
                width: `${emailUsage.percentage || 0}%`,
                transition: 'width 0.3s ease',
              }}
            ></div>
          </div>
        </div>

        {/* Automações */}
        {(limits.automations === 'unlimited' || limits.automations > 0) && (
          <div className="usage-item">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                <i className="fas fa-cogs" style={{ marginRight: '6px' }}></i>
                Automações
              </label>
              <span style={{ fontSize: '12px', color: '#999' }}>{automationUsage.display}</span>
            </div>
            <div
              style={{
                height: '6px',
                background: '#e5e7eb',
                borderRadius: '3px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  background: automationUsage.percentage > 80 ? '#ef4444' : '#22c55e',
                  width: `${automationUsage.percentage || 0}%`,
                  transition: 'width 0.3s ease',
                }}
              ></div>
            </div>
          </div>
        )}

        {/* Agentes */}
        {(limits.agents === 'unlimited' || limits.agents > 0) && (
          <div className="usage-item">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>
                <i className="fas fa-robot" style={{ marginRight: '6px' }}></i>
                Agentes IA
              </label>
              <span style={{ fontSize: '12px', color: '#999' }}>{agentUsage.display}</span>
            </div>
            <div
              style={{
                height: '6px',
                background: '#e5e7eb',
                borderRadius: '3px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  background: agentUsage.percentage > 80 ? '#ef4444' : '#22c55e',
                  width: `${agentUsage.percentage || 0}%`,
                  transition: 'width 0.3s ease',
                }}
              ></div>
            </div>
          </div>
        )}
      </div>

      <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '12px' }}>
        <button className="btn btn-primary">Suporte</button>
        <button className="btn btn-outline">Atualizar plano</button>
      </div>
    </div>
  );
}
