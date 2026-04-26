import { useAuth } from '../../context/AuthContext';

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

const MENU_ITEMS: MenuItem[] = [
  { id: 'overview', label: 'Dashboard', icon: '📊' },
  { id: 'domains', label: 'Domínios', icon: '🌐', count: 0 },
  { id: 'websites', label: 'Websites', icon: '💻', count: 0 },
  { id: 'webapps', label: 'Web Apps', icon: '📱', count: 0 },
  { id: 'emails', label: 'E-mails', icon: '📧', count: 0 },
  { id: 'integrations', label: 'Integrações', icon: '🔌', count: 0 },
  { id: 'automations', label: 'Automações', icon: '⚙️', badge: 'Pro', count: 0 },
  { id: 'agents', label: 'Agentes IA', icon: '🤖', badge: 'Pro', count: 0 },
];

const SUPPORT_ITEMS: MenuItem[] = [
  { id: 'support', label: 'Suporte', icon: '💬' },
  { id: 'settings', label: 'Configurações', icon: '⚙️' },
];

export default function DashboardSidebar({ currentSection, onNavigate }: DashboardSidebarProps) {
  const { client } = useAuth();

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

          return (
            <button
              key={item.id}
              onClick={() => !hasNoPerm && onNavigate(item.id)}
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
                <span style={{ fontSize: '16px' }}>{item.icon}</span>
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
