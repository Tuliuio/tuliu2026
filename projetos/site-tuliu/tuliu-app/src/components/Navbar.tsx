import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from './LanguageSelector';
import logo from '../assets/logo.svg';

interface NavbarProps {
  onOpenLogin: () => void;
}

export default function Navbar({ onOpenLogin }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <header className="navbar" role="banner">
      <div className="container">
        <nav className="navbar-inner" aria-label="Navegação principal">
          <a href="#" className="navbar-logo" aria-label="Tuliu — início">
            <img src={logo} alt="Tuliu Logo" height="46" />
          </a>

          <ul className="navbar-links" role="list">
            <li><a href="#servicos">{t.nav.services}</a></li>
            <li><a href="#solucoes">{t.nav.solutions}</a></li>
            <li><a href="#precos">{t.nav.pricing}</a></li>
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
        <a href="#servicos" onClick={() => setIsMobileMenuOpen(false)}>{t.nav.services}</a>
        <a href="#solucoes" onClick={() => setIsMobileMenuOpen(false)}>{t.nav.solutions}</a>
        <a href="#precos" onClick={() => setIsMobileMenuOpen(false)}>{t.nav.pricing}</a>
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
