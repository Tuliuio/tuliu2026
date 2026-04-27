import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

interface DashboardSidebarProps {
  currentSection: string;
  onNavigate: (section: string) => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  count?: number;
  badge?: string;
}

export default function DashboardSidebar({ currentSection, onNavigate }: DashboardSidebarProps) {
  const { client } = useAuth();
  const [assetCounts, setAssetCounts] = useState<Record<string, number>>({});
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssetCounts = async () => {
      if (!client) return;
      try {
        const { data: assets } = await supabase
          .from('assets')
          .select('type')
          .eq('client_id', client.id)
          .in('status', ['active', 'pending']);

        const counts: Record<string, number> = {
          domains: 0,
          websites: 0,
          webapps: 0,
          emails: 0,
          integrations: 0,
          automations: 0,
          agents: 0,
        };

        (assets || []).forEach((a: any) => {
          if (a.type === 'domain') counts.domains++;
          else if (a.type === 'website') counts.websites++;
          else if (a.type === 'webapp') counts.webapps++;
          else if (a.type === 'email') counts.emails++;
          else if (a.type === 'integration') counts.integrations++;
          else if (a.type === 'automation') counts.automations++;
          else if (a.type === 'agent') counts.agents++;
        });

        setAssetCounts(counts);
      } catch (err) {
        console.error('Erro ao contar ativos:', err);
      }
    };

    fetchAssetCounts();
  }, [client]);

  const MENU_ITEMS: MenuItem[] = [
    { id: 'overview', label: 'Dashboard', icon: 'fa-chart-line' },
    { id: 'domains', label: 'Domínios', icon: 'fa-globe', count: assetCounts.domains || 0 },
    { id: 'websites', label: 'Websites', icon: 'fa-laptop-code', count: assetCounts.websites || 0 },
    { id: 'webapps', label: 'Web Apps', icon: 'fa-mobile-alt', count: assetCounts.webapps || 0 },
    { id: 'emails', label: 'E-mails', icon: 'fa-envelope', count: assetCounts.emails || 0 },
    { id: 'integrations', label: 'Integrações', icon: 'fa-plug', badge: 'Pro', count: assetCounts.integrations || 0 },
    { id: 'automations', label: 'Automações', icon: 'fa-cogs', badge: 'Pro', count: assetCounts.automations || 0 },
    { id: 'agents', label: 'Agentes IA', icon: 'fa-robot', badge: 'Pro', count: assetCounts.agents || 0 },
  ];

  const SUPPORT_ITEMS: MenuItem[] = [
    { id: 'support', label: 'Suporte', icon: 'fa-comment' },
    { id: 'settings', label: 'Configurações', icon: 'fa-gear' },
  ];

  const isProPlan = ['business', 'enterprise'].includes(client?.plan?.tier?.toLowerCase() || '');

  const MenuGroup = ({ items, label }: { items: typeof MENU_ITEMS; label: string }) => (
    <div style={{ marginBottom: '32px' }}>
      {label && (
        <p style={{
          margin: '0 0 12px 0',
          fontSize: '11px',
          fontWeight: 700,
          color: '#999',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          paddingLeft: '12px',
        }}>
          {label}
        </p>
      )}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {items.map((item) => {
          const isActive = currentSection === item.id;
          const hasNoPerm = item.badge && !isProPlan;

          const handleClick = () => {
            if (hasNoPerm) {
              setSelectedFeature(item.label);
              setUpgradeModalOpen(true);
            } else {
              onNavigate(item.id);
            }
          };

          return (
            <button
              key={item.id}
              onClick={handleClick}
              style={{
                padding: '10px 12px',
                background: isActive ? '#f3f4f6' : 'none',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#111' : '#666',
                cursor: hasNoPerm ? 'not-allowed' : 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                opacity: hasNoPerm ? 0.5 : 1,
              }}
              onMouseEnter={(e) => {
                if (!hasNoPerm && !isActive) {
                  e.currentTarget.style.background = '#f9f9f9';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'none';
                }
              }}
              title={hasNoPerm ? `Disponível no plano ${item.badge}` : ''}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <i className={`fas ${item.icon}`}></i>
                <span>{item.label}</span>
              </span>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {item.count && item.count > 0 && (
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '20px',
                    height: '20px',
                    background: isActive ? '#e5e7eb' : '#f3f4f6',
                    borderRadius: '10px',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#666',
                  }}>
                    {item.count}
                  </span>
                )}

                {item.badge && (
                  <span style={{
                    display: 'inline-block',
                    padding: '2px 6px',
                    background: '#fef3c7',
                    color: '#92400e',
                    fontSize: '9px',
                    fontWeight: 700,
                    borderRadius: '3px',
                    textTransform: 'uppercase',
                  }}>
                    {item.badge}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );

  return (
    <aside style={{
      width: '240px',
      background: '#ffffff',
      borderRight: '1px solid #E5E7EB',
      padding: '20px 0',
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 70px)',
      overflowY: 'auto',
      position: 'sticky',
      top: '70px',
    }}>
      {/* Main Menu */}
      <div style={{ padding: '0 12px' }}>
        <MenuGroup items={MENU_ITEMS} label="Menu" />
      </div>

      {/* Support Menu */}
      <div style={{ padding: '0 12px', marginTop: 'auto', borderTop: '1px solid #E5E7EB', paddingTop: '20px' }}>
        <MenuGroup items={SUPPORT_ITEMS} label="" />
      </div>

      {/* Plan Info */}
      <div style={{
        padding: '16px 12px',
        margin: '20px 12px 0 12px',
        background: '#f3f4f6',
        borderRadius: '8px',
        fontSize: '12px',
        borderTop: '1px solid #E5E7EB',
      }}>
        <p style={{ margin: '0 0 6px 0', fontWeight: 600, color: '#111' }}>
          Plano {client?.plan?.name}
        </p>
        <p style={{ margin: 0, color: '#666', fontSize: '11px' }}>
          {isProPlan ? '✓ Automações e IA desbloqueadas' : 'Upgrade para desbloquear automações e IA'}
        </p>
      </div>

      {/* Upgrade Modal */}
      {upgradeModalOpen && selectedFeature && (
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
          onClick={() => setUpgradeModalOpen(false)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '12px',
              padding: '40px',
              maxWidth: '500px',
              width: '100%',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ margin: '0 0 16px 0', fontSize: '28px', fontWeight: 700 }}>
              🚀 {selectedFeature}
            </h2>
            <p style={{ margin: '0 0 24px 0', fontSize: '16px', color: '#666', lineHeight: '1.6' }}>
              A funcionalidade de <strong>{selectedFeature.toLowerCase()}</strong> está disponível apenas nos planos <strong>Business</strong> e <strong>Enterprise</strong>.
            </p>

            <div style={{
              marginBottom: '24px',
              padding: '16px',
              background: '#f9f9f9',
              borderRadius: '8px',
              borderLeft: '4px solid #6366f1'
            }}>
              <p style={{ margin: 0, fontSize: '14px', color: '#333', lineHeight: '1.6' }}>
                Desbloqueia automações, agentes IA, integrações avançadas e muito mais. Entre em contato conosco para conhecer os planos disponíveis e fazer um upgrade!
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setUpgradeModalOpen(false)}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  background: '#f3f4f6',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#e5e7eb')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#f3f4f6')}
              >
                Voltar
              </button>
              <a
                href="https://wa.me/5548404266597?text=Gostaria%20de%20fazer%20upgrade%20do%20meu%20plano"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  background: '#111',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                  textDecoration: 'none',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#333')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#111')}
              >
                <i className="fab fa-whatsapp" style={{ fontSize: '16px' }}></i>
                Fazer Upgrade
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Styling */}
      <style>{`
        aside::-webkit-scrollbar {
          width: 6px;
        }
        aside::-webkit-scrollbar-track {
          background: transparent;
        }
        aside::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }
        aside::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </aside>
  );
}
