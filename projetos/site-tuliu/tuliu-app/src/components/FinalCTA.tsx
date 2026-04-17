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
          <a href="#precos" className="btn btn-white" style={{ fontSize: '16px', padding: '14px 36px' }}>
            {t.cta.btn}
          </a>
        </div>
      </div>
    </section>
  );
}
