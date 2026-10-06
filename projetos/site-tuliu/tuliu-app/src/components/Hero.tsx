import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import heroVisual from '../assets/hero-glass.jpg';
import LeadFormModal from './LeadFormModal';

export default function Hero() {
  const { t } = useLanguage();
  const [showLeadForm, setShowLeadForm] = useState(false);
  return (
    <section className="hero hero-v2" aria-labelledby="hero-heading">
      <div className="hero-v2-visual" aria-hidden="true">
        <img src={heroVisual} alt="" loading="eager" />
      </div>

      <div className="container">
        <div className="hero-v2-content">
          <p className="hero-v2-eyebrow fade-in">{t.hero.badge}</p>

          <h1 className="hero-v2-title fade-in fade-in-delay-1" id="hero-heading">
            {t.hero.titleLine1}{' '}
            {t.hero.titleLine2}{' '}
            <span className="hero-v2-highlight">{t.hero.titleHighlight}</span>
          </h1>

          <p className="hero-v2-sub fade-in fade-in-delay-2">{t.hero.subtitle}</p>

          <div className="hero-v2-actions fade-in fade-in-delay-3">
            <button type="button" className="pill-btn pill-light" onClick={() => setShowLeadForm(true)}>
              {t.hero.cta} <i className="fas fa-arrow-right"></i>
            </button>
            <a href="#precos" className="pill-btn pill-ghost">
              {t.hero.priceTeaserLink} <i className="fas fa-arrow-down"></i>
            </a>
          </div>

          <p className="hero-v2-micro fade-in fade-in-delay-3">
            <strong>{t.hero.priceTeaser}</strong> · {t.hero.microcopy}
          </p>
        </div>
      </div>

      <div className="hero-v2-stats" aria-label="Números da Tuliu">
        <span><strong>+100</strong> projetos entregues</span>
        <span><strong>Desde 2020</strong> no digital</span>
        <span><strong>Revisão humana</strong> em cada entrega</span>
      </div>

      <LeadFormModal
        isOpen={showLeadForm}
        onClose={() => setShowLeadForm(false)}
        source="hero"
      />
    </section>
  );
}
