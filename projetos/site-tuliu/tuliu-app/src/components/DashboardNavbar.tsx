import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ProfileModal from './dashboard/ProfileModal';
import SettingsModal from './dashboard/SettingsModal';
import SupportModal from './dashboard/SupportModal';
import logo from '../assets/logo.svg';

interface DashboardNavbarProps {
  onNavigate: (page: 'home' | 'dashboard' | 'admin' | 'flow') => void;
  currentPage: 'dashboard' | 'admin' | 'flow';
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

  const isDarkFlow = currentPage === 'flow';
  const headerBg = isDarkFlow ? '#1a1a1a' : 'white';
  const headerBorder = isDarkFlow ? 'rgba(255, 255, 255, 0.08)' : '#E5E7EB';
  const tabsBg = isDarkFlow ? '#2a2a2a' : '#f0f0f0';
  const tabsColor = isDarkFlow ? 'rgba(255, 255, 255, 0.6)' : '#666';
  const tabsActiveColor = isDarkFlow ? 'rgba(255, 255, 255, 0.87)' : '#111';
  const tabsActiveBg = isDarkFlow ? '#333333' : 'white';
  const adminColor = isDarkFlow ? 'rgba(255, 255, 255, 0.6)' : '#666';
  const adminActiveColor = isDarkFlow ? 'rgba(255, 255, 255, 0.87)' : '#111';

  return (
    <header className="dashboard-navbar" style={{ background: headerBg, borderBottomColor: headerBorder }}>
      <div className="navbar-container">
        {/* Logo - Left */}
        <button
          onClick={() => onNavigate('dashboard')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, filter: isDarkFlow ? 'brightness(0) invert(1)' : 'none' }}
          aria-label="Tuliu Dashboard"
        >
          <img src={logo} alt="Tuliu Logo" height="40" />
        </button>

        {/* Navigation Tabs - Center */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '0',
            background: tabsBg,
            borderRadius: '8px',
            padding: '4px',
          }}
        >
          <button
            onClick={() => onNavigate('dashboard')}
            style={{
              background: currentPage === 'dashboard' ? tabsActiveBg : 'transparent',
              border: 'none',
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: 500,
              color: currentPage === 'dashboard' ? tabsActiveColor : tabsColor,
              cursor: 'pointer',
              borderRadius: '6px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              if (currentPage !== 'dashboard') {
                e.currentTarget.style.color = tabsActiveColor;
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage !== 'dashboard') {
                e.currentTarget.style.color = tabsColor;
              }
            }}
          >
            <i className="fas fa-chart-line" style={{ marginRight: '6px' }}></i>
            Dashboard
          </button>

          <button
            onClick={() => onNavigate('flow')}
            style={{
              background: currentPage === 'flow' ? tabsActiveBg : 'transparent',
              border: 'none',
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: 500,
              color: currentPage === 'flow' ? tabsActiveColor : tabsColor,
              cursor: 'pointer',
              borderRadius: '6px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              if (currentPage !== 'flow') {
                e.currentTarget.style.color = tabsActiveColor;
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage !== 'flow') {
                e.currentTarget.style.color = tabsColor;
              }
            }}
          >
            <i className="fas fa-columns" style={{ marginRight: '6px' }}></i>
            Flow
          </button>
        </div>

        {/* Admin Link - Visible when admin, positioned near tabs */}
        {client?.role === 'admin' && (
          <div style={{ position: 'absolute', right: '120px' }}>
            <button
              onClick={() => onNavigate('admin')}
              className={`dashboard-nav-link ${currentPage === 'admin' ? 'active' : ''}`}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 500,
                color: currentPage === 'admin' ? adminActiveColor : adminColor,
                textDecoration: currentPage === 'admin' ? 'underline' : 'none',
                padding: 0,
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                if (currentPage !== 'admin') {
                  e.currentTarget.style.color = adminActiveColor;
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== 'admin') {
                  e.currentTarget.style.color = adminColor;
                }
              }}
            >
              <i className="fas fa-shield" style={{ marginRight: '6px' }}></i>
              Administrador
            </button>
          </div>
        )}

        {/* User Avatar - Right */}
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
                background: isDarkFlow ? '#2a2a2a' : 'white',
                border: `1px solid ${isDarkFlow ? 'rgba(255,255,255,0.08)' : '#E5E7EB'}`,
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                minWidth: '240px',
                zIndex: 1000,
              }}
              onClick={() => setIsMenuOpen(false)}
            >
              {/* User Info */}
              <div style={{ padding: '16px', borderBottom: `1px solid ${isDarkFlow ? 'rgba(255,255,255,0.08)' : '#E5E7EB'}` }}>
                <p style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 600, color: isDarkFlow ? 'rgba(255,255,255,0.87)' : '#111' }}>
                  {client?.name || 'User'}
                </p>
                <p style={{ margin: 0, fontSize: '13px', color: isDarkFlow ? 'rgba(255,255,255,0.6)' : '#666' }}>
                  {client?.company}
                </p>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: isDarkFlow ? 'rgba(255,255,255,0.45)' : '#999' }}>
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
                    color: isDarkFlow ? 'rgba(255,255,255,0.6)' : '#666',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = isDarkFlow ? 'rgba(255,255,255,0.08)' : '#f3f4f6')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                >
                  <i className="fas fa-user" style={{ marginRight: '8px' }}></i>
                  Perfil
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
                    color: isDarkFlow ? 'rgba(255,255,255,0.6)' : '#666',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = isDarkFlow ? 'rgba(255,255,255,0.08)' : '#f3f4f6')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                >
                  <i className="fas fa-gear" style={{ marginRight: '8px' }}></i>
                  Configurações
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
                    color: isDarkFlow ? 'rgba(255,255,255,0.6)' : '#666',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = isDarkFlow ? 'rgba(255,255,255,0.08)' : '#f3f4f6')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                >
                  <i className="fas fa-comment" style={{ marginRight: '8px' }}></i>
                  Suporte
                </button>

                <div style={{ height: '1px', background: isDarkFlow ? 'rgba(255,255,255,0.08)' : '#E5E7EB', margin: '8px 0' }}></div>

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
                  <i className="fas fa-sign-out-alt" style={{ marginRight: '8px' }}></i>
                  Sair
                </button>
              </div>
            </div>
          )}
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
          border-bottom: 1px solid;
          background: inherit;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .navbar-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 100%;
          padding: 0 24px;
          position: relative;
        }

        .dashboard-nav-link {
          transition: all 0.2s;
        }

        .dashboard-nav-link:hover {
          color: #111 !important;
        }
      `}</style>
    </header>
  );
}
