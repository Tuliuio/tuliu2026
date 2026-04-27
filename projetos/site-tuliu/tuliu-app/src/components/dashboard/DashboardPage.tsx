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

interface AssetTypeInfo {
  type: string;
  label: string;
}

function DashboardContent({ section }: { section: string }) {
  const { client } = useAuth();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [assetStatuses, setAssetStatuses] = useState<Record<string, Asset['status']>>({});
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [selectedAssetType, setSelectedAssetType] = useState<AssetTypeInfo | null>(null);
  const [requestDescription, setRequestDescription] = useState('');
  const [requestLoading, setRequestLoading] = useState(false);

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

  const assetTypeMap: Record<string, AssetTypeInfo> = {
    domain: { type: 'domain', label: 'Domínio' },
    subdomain: { type: 'subdomain', label: 'Subdomínio' },
    website: { type: 'website', label: 'Website' },
    webapp: { type: 'webapp', label: 'Web App' },
    email: { type: 'email', label: 'E-mail' },
    automation: { type: 'automation', label: 'Automação' },
    agent: { type: 'agent', label: 'Agente IA' },
  };

  const handleRequestActivation = (assetType: string) => {
    const typeInfo = assetTypeMap[assetType];
    if (typeInfo) {
      setSelectedAssetType(typeInfo);
      setRequestModalOpen(true);
      setRequestDescription('');
    }
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!client || !selectedAssetType || !requestDescription.trim()) {
      return;
    }

    setRequestLoading(true);
    try {
      // Create a new asset with status 'pending' and the description
      const { error: assetError } = await supabase
        .from('assets')
        .insert([
          {
            client_id: client.id,
            type: selectedAssetType.type,
            name: `${selectedAssetType.label} (Solicitado)`,
            description: requestDescription,
            status: 'pending',
          },
        ]);

      if (assetError) throw assetError;

      setRequestModalOpen(false);
      setRequestDescription('');
      setSelectedAssetType(null);

      // Refresh assets
      const { data } = await supabase
        .from('assets')
        .select('*')
        .eq('client_id', client.id);

      if (data) {
        setAssets(data);
        setAssetStatuses(Object.fromEntries(data.map((a) => [a.id, a.status])));
      }

      alert('Solicitação enviada com sucesso! Você será contactado em breve.');
    } catch (err) {
      console.error('Erro ao enviar solicitação:', err);
      alert('Erro ao enviar solicitação. Tente novamente.');
    } finally {
      setRequestLoading(false);
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

  // Request Activation Modal Component
  const requestModal = requestModalOpen && selectedAssetType && (
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
        <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: 700 }}>
          Solicitar {selectedAssetType.label}
        </h2>
        <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: '#666' }}>
          Descreva o que você precisa para ativar este serviço
        </p>

        <form onSubmit={handleSubmitRequest}>
          <label style={{ display: 'block', marginBottom: '16px' }}>
            <span style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#666', marginBottom: '6px' }}>
              Descreva suas necessidades
            </span>
            <textarea
              value={requestDescription}
              onChange={(e) => setRequestDescription(e.target.value)}
              placeholder={`Por exemplo: Preciso de um ${selectedAssetType.label.toLowerCase()} para...`}
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
              onClick={() => setRequestModalOpen(false)}
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
              disabled={requestLoading || !requestDescription.trim()}
              style={{
                flex: 1,
                padding: '12px',
                background: requestLoading || !requestDescription.trim() ? '#999' : '#111',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: requestLoading || !requestDescription.trim() ? 'not-allowed' : 'pointer',
              }}
            >
              {requestLoading ? 'Enviando...' : 'Enviar Solicitação'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Show overview by default
  if (section === 'overview') {
    return (
      <>
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
              onRequestActivation={handleRequestActivation}
            />

            {/* Subdomínios */}
            <AssetSection
              type="subdomain"
              assets={getAssetsByType('subdomain')}
              maxAllowed={'unlimited'}
              onToggleStatus={handleToggleStatus}
              onRequestActivation={handleRequestActivation}
            />

            {/* Websites/Webapps */}
            <div style={{ marginTop: '40px' }}>
              <AssetSection
                type="website"
                assets={getAssetsByType('website')}
                maxAllowed={plan.limits.sites}
                onToggleStatus={handleToggleStatus}
                onRequestActivation={handleRequestActivation}
              />
            </div>

            {/* E-mails */}
            <div style={{ marginTop: '40px' }}>
              <AssetSection
                type="email"
                assets={getAssetsByType('email')}
                maxAllowed={plan.limits.emails}
                onToggleStatus={handleToggleStatus}
                onRequestActivation={handleRequestActivation}
              />
            </div>

            {/* Integrações */}
            {(plan.limits.integrations === 'unlimited' || plan.limits.integrations > 0) && (
              <div style={{ marginTop: '40px' }}>
                <AssetSection
                  type="integration"
                  assets={getAssetsByType('integration')}
                  maxAllowed={plan.limits.integrations}
                  onToggleStatus={handleToggleStatus}
                  onRequestActivation={handleRequestActivation}
                />
              </div>
            )}

            {/* Automações */}
            {(plan.limits.automations === 'unlimited' || plan.limits.automations > 0) && (
              <div style={{ marginTop: '40px' }}>
                <AssetSection
                  type="automation"
                  assets={getAssetsByType('automation')}
                  maxAllowed={plan.limits.automations}
                  onToggleStatus={handleToggleStatus}
                  onRequestActivation={handleRequestActivation}
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
                  onRequestActivation={handleRequestActivation}
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
        {requestModal}
      </>
    );
  }

  if (section === 'automations') {
    return (
      <>
        <AutomationsSection />
        {requestModal}
      </>
    );
  }

  if (section === 'agents') {
    return (
      <>
        <AgentsSection />
        {requestModal}
      </>
    );
  }

  // For other asset sections (domains, websites, webapps, emails)
  if (['domains', 'websites', 'webapps', 'emails', 'integrations'].includes(section)) {
    const assetTypeMap: Record<string, 'domain' | 'website' | 'webapp' | 'email' | 'integration'> = {
      domains: 'domain',
      websites: 'website',
      webapps: 'webapp',
      emails: 'email',
      integrations: 'integration',
    };

    const assetType = assetTypeMap[section];
    const iconMap = { domain: '🌐', website: '💻', webapp: '📱', email: '📧', integration: '🔌' };
    const labelMap = { domain: 'Domínios', website: 'Websites', webapp: 'Web Apps', email: 'E-mails', integration: 'Integrações' };

    return (
      <>
        <div style={{ padding: '40px' }}>
          <div style={{ marginBottom: '40px' }}>
            <h1 style={{ margin: '0 0 8px 0', fontSize: '32px', fontWeight: 800 }}>
              {iconMap[assetType]} {labelMap[assetType]}
            </h1>
            <p style={{ margin: 0, fontSize: '16px', color: '#666' }}>
              Gerencie seus {labelMap[assetType].toLowerCase()}
            </p>
          </div>

          {plan && (
            <AssetSection
              type={assetType}
              assets={getAssetsByType(assetType)}
              maxAllowed={
                assetType === 'domain'
                  ? plan.limits.domains
                  : assetType === 'website'
                    ? plan.limits.sites
                    : assetType === 'webapp'
                      ? plan.limits.sites
                      : assetType === 'email'
                      ? plan.limits.emails
                      : plan.limits.integrations
              }
              onToggleStatus={handleToggleStatus}
              onRequestActivation={handleRequestActivation}
            />
          )}
        </div>
        {requestModal}
      </>
    );
  }

  return (
    <>
      <div style={{ padding: '40px' }}>
        <p>Seção não encontrada</p>
      </div>
      {requestModal}
    </>
  );
}

export default function DashboardPage() {
  return (
    <DashboardLayout>
      {(currentSection) => <DashboardContent section={currentSection} />}
    </DashboardLayout>
  );
}
