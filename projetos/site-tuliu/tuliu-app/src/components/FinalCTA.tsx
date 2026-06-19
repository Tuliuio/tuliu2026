import { useLanguage } from '../context/LanguageContext';

export default function FinalCTA() {
  const { t } = useLanguage();
  return (
    <section className="cta-final">
      <div className="container">
        <div className="cta-final-inner fade-in">
          <h2>{t.cta.title}</h2>
          <p>
            {t.cta.subtitle}
          </p>
          <a href="/enterprise/" className="btn-motion btn-motion-on-dark">
            <span className="btn-motion-circle" aria-hidden="true"></span>
            <span className="btn-motion-icon" aria-hidden="true">
              <i className="fas fa-gem"></i>
            </span>
            <span className="btn-motion-label">{t.cta.btn}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
