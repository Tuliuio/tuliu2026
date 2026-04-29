import { useLanguage } from '../context/LanguageContext';

export default function Hero() {
  const { t } = useLanguage();
  console.log('[Hero] Rendering with translations:', !!t?.hero);
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

        <div className="hero-dashboard-image fade-in fade-in-delay-3" style={{ marginTop: '48px', marginBottom: '48px' }}>
          <img
            src="/assets/dashboard_tuliu.png"
            alt="Tuliu Dashboard"
            style={{
              width: '100%',
              maxWidth: '900px',
              height: 'auto',
              borderRadius: '12px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
              display: 'block',
              margin: '0 auto'
            }}
          />
        </div>

        <div className="hero-video-wrapper fade-in fade-in-delay-3" style={{ display: 'none' }} aria-hidden="true">
          <div className="hero-video-placeholder">
            <button className="play-button" tabIndex={-1}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>
            </button>
            <span className="video-label">{t.hero.videoLabel}</span>
          </div>
        </div>

        <div className="fade-in fade-in-delay-3">
          <a href="#precos" className="btn btn-primary" style={{ fontSize: '16px', padding: '14px 36px' }}>
            {t.hero.cta}
          </a>
        </div>
      </div>
    </section>
  );
}
