import { useState, useEffect } from 'react';
import type { MouseEvent } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useLinkProps } from '../context/NavContext';
import { landingGroups, landings } from '../data/landings';
import LanguageSelector from './LanguageSelector';
import logo from '../assets/logo.svg';

type NavPage = 'home' | 'cases' | 'learn' | 'dashboard' | 'admin' | 'landing';

interface NavbarProps {
  onOpenLogin: () => void;
  currentPage: string;
  onNavigate: (page: NavPage, anchor?: string) => void;
}

export default function Navbar({ onOpenLogin, currentPage, onNavigate }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useLanguage();
  const link = useLinkProps();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeAll = () => {
    setOpenMenu(null);
    setIsMobileMenuOpen(false);
  };

  // Link que navega pela SPA e fecha os menus
  const navLink = (href: string) => {
    const props = link(href);
    return {
      ...props,
      onClick: (e: MouseEvent<HTMLAnchorElement>) => {
        props.onClick(e);
        closeAll();
      },
    };
  };

  const onDark = currentPage === 'home' || currentPage === 'landing';

  return (
    <header className={`navbar${scrolled ? ' scrolled' : ''}${onDark ? ' on-hero' : ''}`} role="banner">
      <div className="container">
        <nav className="navbar-inner" aria-label="Navegação principal">
          <button
            className="navbar-logo"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('home');
            }}
            aria-label="Tuliu, início"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <img src={logo} alt="Tuliu Logo" height="53" />
          </button>

          <ul className="navbar-links" role="list" onMouseLeave={() => setOpenMenu(null)}>
            {landingGroups.map(({ group, label }) => (
              <li key={group} className="nav-dd" onMouseEnter={() => setOpenMenu(group)}>
                <button
                  className="navbar-anchor"
                  aria-expanded={openMenu === group}
                  onClick={() => setOpenMenu(openMenu === group ? null : group)}
                >
                  {label} <i className="fas fa-chevron-down nav-dd-caret" aria-hidden="true"></i>
                </button>
                {openMenu === group && (
                  <div className="nav-dd-panel">
                    {landings.filter((l) => l.group === group).map((l) => (
                      <a key={l.slug} className="nav-dd-item" {...navLink(`/${l.slug}`)}>
                        <strong>{l.navLabel}</strong>
                        <span>{l.navDesc}</span>
                      </a>
                    ))}
                  </div>
                )}
              </li>
            ))}
            <li><a className="navbar-anchor" {...navLink('/#precos')}>{t.nav.pricing}</a></li>
            <li><a className={`navbar-page-link ${currentPage === 'cases' ? 'active' : ''}`} {...navLink('/cases')}>Cases</a></li>
            <li><a className="navbar-page-link" {...navLink('/sobre')}>Sobre</a></li>
          </ul>

          <div className="navbar-cta">
            <LanguageSelector />
            <button className="navbar-login" onClick={onOpenLogin}>{t.nav.account}</button>
            <a className="btn btn-primary" {...navLink('/#precos')}>Ver planos</a>
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
        {landingGroups.map(({ group, label }) => (
          <div key={group} className="mobile-group">
            <span className="mobile-group-label">{label}</span>
            {landings.filter((l) => l.group === group).map((l) => (
              <a key={l.slug} className="mobile-menu-anchor" {...navLink(`/${l.slug}`)}>{l.navLabel}</a>
            ))}
          </div>
        ))}
        <a className="mobile-menu-anchor" {...navLink('/#precos')}>{t.nav.pricing}</a>
        <a className="mobile-menu-anchor" {...navLink('/cases')}>Cases</a>
        <a className="mobile-menu-anchor" {...navLink('/sobre')}>Sobre</a>
        <button
          className="btn btn-primary"
          style={{ marginTop: '8px', textAlign: 'center', width: '100%', border: 'none', cursor: 'pointer' }}
          onClick={() => {
            closeAll();
            onOpenLogin();
          }}
        >
          {t.nav.account}
        </button>
      </div>
    </header>
  );
}
