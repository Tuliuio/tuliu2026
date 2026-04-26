import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ProfileModal from './dashboard/ProfileModal';
import SettingsModal from './dashboard/SettingsModal';
import SupportModal from './dashboard/SupportModal';
import logo from '../assets/logo.svg';

interface DashboardNavbarProps {
  onNavigate: (page: 'home' | 'dashboard' | 'admin') => void;
  currentPage: 'dashboard' | 'admin';
}

export default function DashboardNavbar({ onNavigate, currentPage }: DashboardNavbarProps) {
  const { user, client, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  useEffect(() => {
    console.log('[DashboardNavbar] Client data:', client);
    console.log('[DashboardNavbar] Client role:', client?.role);
  }, [client]);

  const handleLogout = async () => {
    try {
      console.log('[DashboardNavbar] Starting logout');
      setIsMenuOpen(false);
      await logout();
      console.log('[DashboardNavbar] Logout complete, navigating home');
      // Use setTimeout to ensure state is updated before navigation
      setTimeout(() => {
        onNavigate('home');
      }, 100);
    } catch (error) {
      console.error('[DashboardNavbar] Logout error:', error);
      setIsMenuOpen(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const initials = client?.name ? getInitials(client.name) : 'U';

  return (
    <header className="dashboard-navbar">
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
        {/* Logo - Left */}
        <button
          onClick={() => onNavigate('dashboard')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          aria-label="Tuliu Dashboard"
        >
          <img src={logo} alt="Tuliu Logo" height="40" />
        </button>

        {/* Right Side - Admin Link + Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          {/* Admin Link - only show if user is admin */}
          {client?.role === 'admin' && (
            <button
              onClick={() => onNavigate('admin')}
              className={`dashboard-nav-link ${currentPage === 'admin' ? 'active' : ''}`}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: 500,
                color: currentPage === 'admin' ? '#111' : '#666',
                textDecoration: currentPage === 'admin' ? 'underline' : 'none',
                padding: 0,
              }}
            >
              Administrador
            </button>
          )}

          {/* User Avatar & Menu */}
          <div style={{ position: 'relative' }}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: '#111',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)')}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
            title={`${client?.name || user?.email || 'User'}`}
          >
            {initials}
          </button>

          {/* Dropdown Menu */}
          {isMenuOpen && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '8px',
                background: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                minWidth: '240px',
                zIndex: 1000,
              }}
              onClick={() => setIsMenuOpen(false)}
            >
              {/* User Info */}
              <div style={{ padding: '16px', borderBottom: '1px solid #E5E7EB' }}>
                <p style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 600, color: '#111' }}>
                  {client?.name || 'User'}
                </p>
                <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>
                  {client?.company}
                </p>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#999' }}>
                  {user?.email}
                </p>
              </div>

              {/* Menu Items */}
              <div style={{ padding: '8px' }}>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsProfileOpen(true);
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    fontSize: '14px',
                    color: '#666',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#f3f4f6')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                >
                  👤 Perfil
                </button>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsSettingsOpen(true);
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    fontSize: '14px',
                    color: '#666',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#f3f4f6')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                >
                  ⚙️ Configurações
                </button>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsSupportOpen(true);
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    fontSize: '14px',
                    color: '#666',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#f3f4f6')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                >
                  💬 Suporte
                </button>

                <div style={{ height: '1px', background: '#E5E7EB', margin: '8px 0' }}></div>

                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    fontSize: '14px',
                    color: '#991B1B',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#FEE2E2')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                >
                  🚪 Sair
                </button>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <SupportModal isOpen={isSupportOpen} onClose={() => setIsSupportOpen(false)} />

      {/* Styling */}
      <style>{`
        .dashboard-navbar {
          height: 70px;
          border-bottom: 1px solid #E5E7EB;
          background: white;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .dashboard-navbar .container {
          padding: 0 24px;
        }
      `}</style>
    </header>
  );
}
