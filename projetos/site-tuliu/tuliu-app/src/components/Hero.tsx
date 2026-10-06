import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import heroPoster from '../assets/hero-loop-poster.jpg';
import heroLoop from '../assets/hero-loop.mp4';
import LeadFormModal from './LeadFormModal';

export default function Hero() {
  const { t } = useLanguage();
  const [showLeadForm, setShowLeadForm] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Retoma o loop se o navegador pausou o vídeo (troca de aba, economia de energia)
  useEffect(() => {
    const resume = () => {
      if (document.visibilityState === 'visible') videoRef.current?.play().catch(() => {});
    };
    document.addEventListener('visibilitychange', resume);
    return () => document.removeEventListener('visibilitychange', resume);
  }, []);
  return (
    <section className="hero hero-v2" aria-labelledby="hero-heading">
      <div className="hero-v2-visual" aria-hidden="true">
        {/* Loop sem emenda: o último quadro se funde com o primeiro */}
        <video ref={videoRef} src={heroLoop} poster={heroPoster} autoPlay muted loop playsInline preload="auto" />
        <img className="hero-v2-still" src={heroPoster} alt="" />
      </div>

      <div className="container">
        <div className="hero-v2-content">
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
