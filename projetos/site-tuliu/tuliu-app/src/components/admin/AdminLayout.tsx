import type { ReactNode } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
  currentSection: string;
  onNavigate: (section: string) => void;
}

const MENU_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-line' },
  { id: 'activation-requests', label: 'Solicitações', icon: 'fa-bell' },
  { id: 'clients', label: 'Clientes', icon: 'fa-users' },
];

export default function AdminLayout({ children, currentSection, onNavigate }: AdminLayoutProps) {
  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 70px)' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: '240px',
          background: '#ffffff',
          borderRight: '1px solid #E5E7EB',
          padding: '20px 0',
          position: 'sticky',
          top: '70px',
          height: 'calc(100vh - 70px)',
          overflowY: 'auto',
        }}
      >
        <div style={{ padding: '0 12px' }}>
          <p
            style={{
              margin: '0 0 12px 0',
              fontSize: '11px',
              fontWeight: 700,
              color: '#999',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              paddingLeft: '12px',
            }}
          >
            Administração
          </p>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {MENU_ITEMS.map((item) => {
              const isActive = currentSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  style={{
                    padding: '10px 12px',
                    background: isActive ? '#f3f4f6' : 'none',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? '#111' : '#666',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = '#f9f9f9';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'none';
                    }
                  }}
                >
                  <i className={`fas ${item.icon}`}></i>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Content */}
      <main style={{ flex: 1, padding: '40px', background: '#fafafa', overflowY: 'auto' }}>
        {children}
      </main>

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
    </div>
  );
}
