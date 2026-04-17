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
            {t.footer.help} <a href="mailto:contato@tuliu.com.br">contato@tuliu.com.br</a>
          </p>

          <div className="footer-socials">
            <a href="#" className="social-link" aria-label="LinkedIn">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a href="#" className="social-link" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className="social-link" aria-label="Twitter">
              <i className="fab fa-twitter"></i>
            </a>
          </div>

          <p className="footer-copy">
            &copy; {new Date().getFullYear()} {t.footer.copy}
          </p>
        </div>
      </div>
    </footer>
  );
}
