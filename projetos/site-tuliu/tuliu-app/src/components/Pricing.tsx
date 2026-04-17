import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);
  const { t } = useLanguage();

  return (
    <section className="pricing" id="precos" aria-labelledby="pricing-heading">
      <div className="container">
        <div className="section-header">
          <div className="badge fade-in">
            <i className="fas fa-circle" style={{ fontSize: '6px', marginRight: '8px', verticalAlign: 'middle' }}></i>
            {t.pricing.badge}
          </div>
          <h2 className="fade-in fade-in-delay-1" id="pricing-heading">
            {t.pricing.title}
          </h2>
        </div>

        <div className="pricing-toggle">
          <span className="pricing-toggle-label">{t.pricing.monthly}</span>
          <div 
            className={`toggle-switch ${isAnnual ? 'active' : ''}`} 
            role="switch" 
            aria-checked={isAnnual} 
            aria-label="Trocar entre faturamento mensal e anual"
            onClick={() => setIsAnnual(!isAnnual)}
          >
            <span className={`toggle-option ${!isAnnual ? 'active' : ''}`}>{t.pricing.monthly}</span>
            <span className={`toggle-option ${isAnnual ? 'active' : ''}`}>{t.pricing.annual}</span>
          </div>
          <span className="pricing-toggle-label">
            {t.pricing.annual} <strong style={{ color: '#111', marginLeft: '4px' }}>{t.pricing.save}</strong>
          </span>
        </div>

        <div className="pricing-grid">
          {/* Card Starter */}
          <article className="pricing-card fade-in fade-in-delay-1">
            <p className="plan-name">Starter</p>
            <div className="plan-price">
              <span className="currency">R$</span>
              <span className="amount">{isAnnual ? '997' : '97'}</span>
              <span className="period">{isAnnual ? t.pricing.perYear : t.pricing.perMonth}</span>
            </div>
            <p className="plan-subtitle">{t.pricing.starterSubtitle}</p>
            <hr className="plan-divider" />
            <ul className="plan-features" role="list">
              {t.pricing.starterFeatures.map((feature, i) => (
                <li key={i}><i className="fas fa-check" style={{ fontSize: '14px', color: 'currentColor' }}></i> {feature}</li>
              ))}
            </ul>
            <a 
              href={isAnnual ? "https://www.asaas.com/c/gtx6degtgke5m743" : "https://www.asaas.com/c/6tiddzmu54tk8ls4"} 
              className="btn btn-outline plan-btn" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              {t.pricing.starterBtn}
            </a>
          </article>

          {/* Card Business (Destaque) */}
          <article className="pricing-card featured fade-in fade-in-delay-2">
            <span className="popular-badge" aria-label="Plano mais popular">{t.pricing.popularBadge}</span>
            <p className="plan-name">Business</p>
            <div className="plan-price">
              <span className="currency">R$</span>
              <span className="amount">{isAnnual ? '4.970' : '497'}</span>
              <span className="period">{isAnnual ? t.pricing.perYear : t.pricing.perMonth}</span>
            </div>
            <p className="plan-subtitle">{t.pricing.businessSubtitle}</p>
            <hr className="plan-divider" />
            <ul className="plan-features" role="list">
              {t.pricing.businessFeatures.map((feature, i) => (
                <li key={i}><i className="fas fa-check" style={{ fontSize: '14px', color: 'currentColor' }}></i> {feature}</li>
              ))}
            </ul>
            <a href="https://wa.me/554840426597" className="btn btn-white plan-btn" target="_blank" rel="noopener noreferrer">
              {t.pricing.businessBtn}
            </a>
          </article>

          {/* Card Enterprise */}
          <article className="pricing-card enterprise fade-in fade-in-delay-3">
            <span className="enterprise-badge" aria-label="Plano Enterprise">{t.pricing.enterpriseBadge}</span>
            <p className="plan-name">Enterprise</p>
            <div className="plan-price-consult">
              {t.pricing.consult}
              <span>{t.pricing.consultDesc}</span>
            </div>
            <hr className="plan-divider" />
            <ul className="plan-features" role="list">
              {t.pricing.enterpriseFeatures.map((feature, i) => (
                <li key={i}><i className="fas fa-check" style={{ fontSize: '14px', color: 'currentColor' }}></i> {feature}</li>
              ))}
            </ul>
            <a href="https://wa.me/554840426597" className="btn btn-enterprise plan-btn" target="_blank" rel="noopener noreferrer">
              {t.pricing.enterpriseBtn}
            </a>
          </article>
        </div>
      </div>
    </section>
  );
}
