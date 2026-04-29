import logo from '../assets/logo.svg';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          <a href="#" className="footer-logo" aria-label="Tuliu — início">
            <img src={logo} alt="Tuliu Logo" height="36" />
          </a>

          <p className="footer-contact">
            {t.footer.help} <a href="https://wa.me/5548940426597" target="_blank" rel="noopener noreferrer">WhatsApp</a>
          </p>

          <p className="footer-copy">
            &copy; {new Date().getFullYear()} {t.footer.copy}
          </p>
        </div>
      </div>
    </footer>
  );
}
