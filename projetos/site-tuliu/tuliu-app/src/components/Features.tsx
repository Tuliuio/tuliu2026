import { useLanguage } from '../context/LanguageContext';

export default function Features() {
  const { t } = useLanguage();
  return (
    <section className="features" id="servicos" aria-labelledby="features-heading">
      <div className="container">
        <div className="section-header">
          <div className="badge fade-in">
            <i className="fas fa-circle" style={{ fontSize: '6px', marginRight: '8px', verticalAlign: 'middle' }}></i>
            {t.features.badge}
          </div>
          <h2 className="fade-in fade-in-delay-1" id="features-heading">
            {t.features.title}
          </h2>
          <p className="fade-in fade-in-delay-2">
            {t.features.subtitle}
          </p>
        </div>

        <div className="features-grid" id="solucoes">
          <article className="feature-card fade-in fade-in-delay-1">
            <div className="feature-icon" aria-hidden="true">
              <i className="fas fa-globe"></i>
            </div>
            <h3>{t.features.card1Title}</h3>
            <p>{t.features.card1Desc}</p>
          </article>

          <article className="feature-card fade-in fade-in-delay-2">
            <div className="feature-icon" aria-hidden="true">
              <i className="fas fa-robot"></i>
            </div>
            <h3>{t.features.card2Title}</h3>
            <p>{t.features.card2Desc}</p>
          </article>

          <article className="feature-card fade-in fade-in-delay-3">
            <div className="feature-icon" aria-hidden="true">
              <i className="fas fa-cogs"></i>
            </div>
            <h3>{t.features.card3Title}</h3>
            <p>{t.features.card3Desc}</p>
          </article>
        </div>

        <div className="features-cta fade-in">
          <a href="#" className="btn btn-outline">{t.features.cta}</a>
        </div>
      </div>
    </section>
  );
}
