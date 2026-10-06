import { useState, useEffect } from 'react';
import type { MouseEvent } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useLinkProps } from '../context/NavContext';
import { landingGroups, landings, navIcons } from '../data/landings';
import LeadFormModal from './LeadFormModal';
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
  const [leadOpen, setLeadOpen] = useState(false);
  const { t } = useLanguage();
  const link = useLinkProps();

  // Detecta se o header está sobre um fundo escuro ou claro, para trocar a cor do logo e do menu
  const [overDark, setOverDark] = useState(true);
  useEffect(() => {
    const luminance = (rgb: string) => {
      const m = rgb.match(/rgba?\(([^)]+)\)/);
      if (!m) return null;
      const [r, g, b, a = '1'] = m[1].split(',').map((v) => v.trim());
      if (parseFloat(a) < 0.5) return null;
      return (0.299 * +r + 0.587 * +g + 0.114 * +b) / 255;
    };
    const detect = () => {
      setScrolled(window.scrollY > 20);
      const stack = document.elementsFromPoint(window.innerWidth / 2, 42);
      for (const el of stack) {
        if (el.closest('header')) continue;
        let node: Element | null = el;
        while (node && node !== document.documentElement) {
          const style = getComputedStyle(node);
          const lum = luminance(style.backgroundColor) ?? (style.backgroundImage.includes('gradient') ? luminance(style.backgroundImage) : null);
          if (lum !== null) {
            setOverDark(lum < 0.5);
            return;
          }
          node = node.parentElement;
        }
        break;
      }
    };
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(detect);
    };
    detect();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [currentPage]);

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

  const onDark = overDark && !isMobileMenuOpen;
  const activeGroup = landingGroups.find((g) => g.group === openMenu);

  return (
    <header
      className={`navbar${scrolled ? ' scrolled' : ''}${onDark ? ' on-hero' : ''}${openMenu ? ' menu-open' : ''}`}
      role="banner"
      onMouseLeave={() => setOpenMenu(null)}
    >
      <div className="container">
        <nav className="navbar-inner" aria-label="Navegação principal">
          <button
            className="navbar-logo"
            onClick={(e) => {
              e.preventDefault();
              closeAll();
              onNavigate('home');
            }}
            aria-label="Tuliu, início"
          >
            <img src={logo} alt="Tuliu Logo" height="40" />
          </button>

          <ul className="navbar-links nav-pill" role="list">
            {landingGroups.map(({ group, label }) => (
              <li key={group} onMouseEnter={() => setOpenMenu(group)}>
                <button
                  className={`nav-item${openMenu === group ? ' active' : ''}`}
                  aria-expanded={openMenu === group}
                  onClick={() => setOpenMenu(openMenu === group ? null : group)}
                >
                  {label} <i className="fas fa-chevron-down nav-caret" aria-hidden="true"></i>
                </button>
              </li>
            ))}
            <li onMouseEnter={() => setOpenMenu(null)}><a className={`nav-item${currentPage === 'cases' ? ' active' : ''}`} {...navLink('/cases')}>Resultados</a></li>
            <li onMouseEnter={() => setOpenMenu(null)}><a className="nav-item" {...navLink('/#precos')}>Preços</a></li>
            <li onMouseEnter={() => setOpenMenu(null)}><a className="nav-item" {...navLink('/sobre')}>Sobre</a></li>
          </ul>

          <div className="navbar-cta" onMouseEnter={() => setOpenMenu(null)}>
            <button className="nav-login" onClick={onOpenLogin}>Entrar</button>
            <button className="nav-cta" onClick={() => setLeadOpen(true)}>
              Diagnóstico grátis <i className="fas fa-chevron-right"></i>
            </button>
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

      {activeGroup && (
        <div className="mega" role="region" aria-label={activeGroup.label}>
          <div className="mega-card">
            <div className="mega-grid">
              {landings.filter((l) => l.group === activeGroup.group).map((l) => (
                <a key={l.slug} className="mega-item" {...navLink(`/${l.slug}`)}>
                  <i className={navIcons[l.slug] ?? 'fas fa-circle'} aria-hidden="true"></i>
                  <span>
                    <strong>{l.navLabel}</strong>
                    <small>{l.navDesc}</small>
                  </span>
                </a>
              ))}
            </div>
            <div className="mega-foot">
              <span><strong>{activeGroup.title}</strong> {activeGroup.desc}</span>
              <a className="mega-link" {...navLink(activeGroup.link.href)}>
                {activeGroup.link.label} <i className="fas fa-arrow-right"></i>
              </a>
            </div>
          </div>
        </div>
      )}

      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`} role="navigation" aria-label="Menu mobile">
        {landingGroups.map(({ group, label }) => (
          <div key={group} className="mobile-group">
            <span className="mobile-group-label">{label}</span>
            {landings.filter((l) => l.group === group).map((l) => (
              <a key={l.slug} className="mobile-menu-anchor" {...navLink(`/${l.slug}`)}>
                <i className={navIcons[l.slug]} aria-hidden="true"></i> {l.navLabel}
              </a>
            ))}
          </div>
        ))}
        <a className="mobile-menu-anchor" {...navLink('/cases')}>Resultados</a>
        <a className="mobile-menu-anchor" {...navLink('/#precos')}>Preços</a>
        <a className="mobile-menu-anchor" {...navLink('/sobre')}>Sobre</a>
        <div className="mobile-actions">
          <button className="nav-cta" onClick={() => { closeAll(); setLeadOpen(true); }}>
            Diagnóstico grátis <i className="fas fa-arrow-right"></i>
          </button>
          <button className="mobile-login" onClick={() => { closeAll(); onOpenLogin(); }}>
            <i className="far fa-user"></i> {t.nav.account}
          </button>
        </div>
      </div>

      <LeadFormModal isOpen={leadOpen} onClose={() => setLeadOpen(false)} source="navbar" />
    </header>
  );
}
