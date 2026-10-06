import logo from '../assets/logo.svg';
import { useLanguage } from '../context/LanguageContext';
import { useLinkProps } from '../context/NavContext';
import { landingGroups, landings } from '../data/landings';
import LanguageSelector from './LanguageSelector';

export default function Footer() {
  const { t } = useLanguage();
  const link = useLinkProps();
  return (
    <footer className="footer footer-big">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <a className="footer-logo" aria-label="Tuliu, início" {...link('/')}>
              <img src={logo} alt="Tuliu Logo" height="36" />
            </a>
            <p>Seu time de marketing completo, feito com IA e aprovado por especialistas.</p>
            <a className="footer-wa" href="https://wa.me/554840426597" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-whatsapp"></i> {t.footer.help} Chama no WhatsApp
            </a>
          </div>
          {landingGroups.map(({ group, label }) => (
            <nav key={group} className="footer-col" aria-label={label}>
              <h4>{label}</h4>
              {landings.filter((l) => l.group === group).map((l) => (
                <a key={l.slug} {...link(`/${l.slug}`)}>{l.navLabel}</a>
              ))}
            </nav>
          ))}
          <nav className="footer-col" aria-label="Tuliu">
            <h4>Tuliu</h4>
            <a {...link('/#precos')}>Preços</a>
            <a {...link('/cases')}>Cases</a>
            <a {...link('/sobre')}>Sobre</a>
            <a href="/seo-ia/">SEO para IA</a>
            <a href="/enterprise/">Enterprise</a>
            <a {...link('/learn')}>Aprenda</a>
          </nav>
        </div>
        <div className="footer-bottom">
          <p className="footer-copy">
            &copy; {new Date().getFullYear()} {t.footer.copy}
          </p>
          <LanguageSelector />
        </div>
      </div>
    </footer>
  );
}
