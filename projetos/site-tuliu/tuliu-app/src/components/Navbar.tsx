import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from './LanguageSelector';
import logo from '../assets/logo.svg';

interface NavbarProps {
  onOpenLogin: () => void;
  currentPage: 'home' | 'cases' | 'learn' | 'dashboard' | 'admin';
  onNavigate: (page: 'home' | 'cases' | 'learn' | 'dashboard' | 'admin', anchor?: string) => void;
}

export default function Navbar({ onOpenLogin, currentPage, onNavigate }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  const handleAnchorClick = (anchorId: string) => {
    if (currentPage !== 'home') {
      onNavigate('home', anchorId);
    } else {
      const element = document.getElementById(anchorId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="navbar" role="banner">
      <div className="container">
        <nav className="navbar-inner" aria-label="Navegação principal">
          <button
            className="navbar-logo"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('home');
            }}
            aria-label="Tuliu — início"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <img src={logo} alt="Tuliu Logo" height="46" />
          </button>

          <ul className="navbar-links" role="list">
            <li><button className="navbar-anchor" onClick={() => handleAnchorClick('servicos')}>{t.nav.services}</button></li>
            <li><button className="navbar-anchor" onClick={() => handleAnchorClick('solucoes')}>{t.nav.solutions}</button></li>
            <li><button className="navbar-anchor" onClick={() => handleAnchorClick('precos')}>{t.nav.pricing}</button></li>
            <li>
              <button
                className={`navbar-page-link ${currentPage === 'cases' ? 'active' : ''}`}
                onClick={() => onNavigate('cases')}
              >
                Cases
              </button>
            </li>
            <li>
              <button
                className={`navbar-page-link ${currentPage === 'learn' ? 'active' : ''}`}
                onClick={() => onNavigate('learn')}
              >
                Aprenda
              </button>
            </li>
          </ul>

          <div className="navbar-cta">
            <LanguageSelector />
            <button className="btn btn-primary" onClick={onOpenLogin}>{t.nav.account}</button>
          </div>

          <button 
            className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`} 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Abrir menu" 
            aria-expanded={isMobileMenuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </nav>
      </div>

      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`} role="navigation" aria-label="Menu mobile">
        <button className="mobile-menu-anchor" onClick={() => handleAnchorClick('servicos')}>{t.nav.services}</button>
        <button className="mobile-menu-anchor" onClick={() => handleAnchorClick('solucoes')}>{t.nav.solutions}</button>
        <button className="mobile-menu-anchor" onClick={() => handleAnchorClick('precos')}>{t.nav.pricing}</button>
        <button
          className="navbar-page-link"
          onClick={() => {
            onNavigate('cases');
            setIsMobileMenuOpen(false);
          }}
          style={{ width: '100%', textAlign: 'left', display: 'block', padding: '12px 0', fontSize: '15px' }}
        >
          Cases
        </button>
        <button
          className="navbar-page-link"
          onClick={() => {
            onNavigate('learn');
            setIsMobileMenuOpen(false);
          }}
          style={{ width: '100%', textAlign: 'left', display: 'block', padding: '12px 0', fontSize: '15px' }}
        >
          Aprenda
        </button>
        <button
          className="btn btn-primary"
          style={{ marginTop: '8px', textAlign: 'center', width: '100%', border: 'none', cursor: 'pointer' }}
          onClick={() => {
            setIsMobileMenuOpen(false);
            onOpenLogin();
          }}
        >
          {t.nav.account}
        </button>
      </div>
    </header>
  );
}
