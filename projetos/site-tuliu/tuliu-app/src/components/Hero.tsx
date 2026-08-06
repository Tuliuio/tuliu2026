import { useLanguage } from '../context/LanguageContext';
import heroVisual from '../assets/hero-visual-dark.png';

export default function Hero() {
  const { t } = useLanguage();
  return (
    <section className="hero" aria-labelledby="hero-heading">
      <div className="hero-visual" aria-hidden="true">
        <img src={heroVisual} alt="" loading="eager" />
      </div>

      <div className="container">
        <div className="hero-content">
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

          <div className="hero-actions fade-in fade-in-delay-3">
            <a href="#precos" className="btn-motion btn-motion-on-dark">
              <span className="btn-motion-circle" aria-hidden="true"></span>
              <span className="btn-motion-icon" aria-hidden="true">
                <i className="fas fa-arrow-right"></i>
              </span>
              <span className="btn-motion-label">{t.hero.cta}</span>
            </a>
          </div>

          <p className="hero-microcopy fade-in fade-in-delay-3">
            {t.hero.microcopy}
          </p>
        </div>
      </div>
    </section>
  );
}
