import { useLanguage } from '../context/LanguageContext';

export default function Hero() {
  const { t } = useLanguage();
  return (
    <section className="hero" aria-labelledby="hero-heading">
      <div className="container">
        <div className="hero-badge fade-in">
          <span className="badge">
            <i className="fas fa-circle" style={{ fontSize: '6px', marginRight: '8px', verticalAlign: 'middle' }}></i>
            {t.hero.badge}
          </span>
        </div>

        <h1 className="hero-title fade-in fade-in-delay-1" id="hero-heading">
          <span className="line1">{t.hero.titleLine1}</span>
          <span className="line2">{t.hero.titleLine2}</span>
        </h1>

        <p className="hero-subtitle fade-in fade-in-delay-2">
          {t.hero.subtitle}
        </p>

        <div className="fade-in fade-in-delay-3" style={{ marginBottom: '56px' }}>
          <a href="#precos" className="btn-motion">
            <span className="btn-motion-circle" aria-hidden="true"></span>
            <span className="btn-motion-icon" aria-hidden="true">
              <i className="fas fa-arrow-right"></i>
            </span>
            <span className="btn-motion-label">{t.hero.cta}</span>
          </a>
        </div>
      </div>

      <div className="hero-dashboard-image fade-in fade-in-delay-4">
        <img
          src="/dashboard_tuliu.png"
          alt="Tuliu Dashboard"
        />
      </div>
    </section>
  );
}
