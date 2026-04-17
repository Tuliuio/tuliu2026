import logo from '../assets/logo.svg';
import { useLanguage } from '../context/LanguageContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="login-overlay open" onClick={onClose}>
      <div className="login-card" onClick={(e) => e.stopPropagation()}>
        <button className="login-close" onClick={onClose} aria-label="Fechar">
          <i className="fas fa-times"></i>
        </button>

        <div className="login-logo">
          <img src={logo} alt="Tuliu Logo" height="40" />
        </div>

        <h3 className="login-title">{t.login.title}</h3>
        <p className="login-subtitle">{t.login.subtitle}</p>

        <button className="btn-google">
          <svg viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            <path fill="none" d="M1 1h22v22H1z"/>
          </svg>
          {t.login.google}
        </button>

        <div className="login-divider">{t.login.or}</div>

        <form onSubmit={(e) => { e.preventDefault(); alert(t.login.alert); }}>
          <div className="login-field">
            <label htmlFor="email">{t.login.emailLabel}</label>
            <input type="email" id="email" placeholder="voce@empresa.com.br" required />
          </div>

          <div className="login-field">
            <label htmlFor="password">{t.login.passwordLabel}</label>
            <input type="password" id="password" placeholder="••••••••" required />
          </div>

          <a href="#" className="login-forgot">{t.login.forgot}</a>

          <button type="submit" className="btn-login-submit">{t.login.submit}</button>
        </form>

        <p className="login-footer">
          {t.login.noAccount} <a href="#precos" onClick={onClose}>{t.login.seePlans}</a>
        </p>
      </div>
    </div>
  );
}
