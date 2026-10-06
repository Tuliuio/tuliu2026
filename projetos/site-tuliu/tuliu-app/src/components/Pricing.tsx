import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useGo } from '../context/NavContext';
import { diagHref } from '../lib/diag';

const WHATSAPP_ENTERPRISE = 'https://wa.me/554840426597?text=Oi!%20Quero%20conhecer%20o%20plano%20Enterprise%20da%20Tuliu.';

function Features({ items }: { items: string[] }) {
  const [first, ...rest] = items;
  const hasLead = first.endsWith(':');
  return (
    <ul className="pl-features" role="list">
      {hasLead && <li className="pl-features-lead">{first}</li>}
      {(hasLead ? rest : items).map((f) => (
        <li key={f}><i className="fas fa-check" aria-hidden="true"></i>{f}</li>
      ))}
    </ul>
  );
}

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);
  const { t } = useLanguage();
  const p = t.pricing;
  const go = useGo();
  const choose = (plan: 'starter' | 'business') => go(diagHref('pricing', plan));

  return (
    <section className="pl" id="precos" aria-labelledby="pricing-heading">
      <div className="container-wide">
        <div className="lp-header">
          <span className="lp-eyebrow">{p.badge}</span>
          <h2 id="pricing-heading">{p.title}</h2>
          <p>{p.subtitle}</p>
        </div>

        <div className="pl-toggle" role="group" aria-label="Período de cobrança">
          <button type="button" className={!isAnnual ? 'on' : ''} aria-pressed={!isAnnual} onClick={() => setIsAnnual(false)}>{p.monthly}</button>
          <button type="button" className={isAnnual ? 'on' : ''} aria-pressed={isAnnual} onClick={() => setIsAnnual(true)}>
            {p.annual} <em>{p.save}</em>
          </button>
        </div>

        <div className="pl-grid">
          <article className="pl-card">
            <span className="pl-tag">{p.starterTag}</span>
            <h3>Starter</h3>
            <p className="pl-sub">{p.starterSubtitle}</p>
            <div className="pl-price">
              <small>{p.currency}</small>
              <strong>{isAnnual ? p.starterAnnual : p.starterMonthly}</strong>
              <span>{isAnnual ? p.perYear : p.perMonth}</span>
            </div>
            <p className="pl-agency">{p.agencyCostLabel}: <s>{p.starterAgencyCost}</s></p>
            <button type="button" className="pill-btn pl-btn pl-btn-outline" onClick={() => choose('starter')}>
              {p.starterBtn} <i className="fas fa-arrow-right"></i>
            </button>
            <Features items={p.starterFeatures} />
          </article>

          <article className="pl-card pl-featured">
            <span className="pl-popular">{p.popularBadge}</span>
            <span className="pl-tag">{p.businessTag}</span>
            <h3>Business</h3>
            <p className="pl-sub">{p.businessSubtitle}</p>
            <div className="pl-price">
              <small>{p.currency}</small>
              <strong>{isAnnual ? p.businessAnnual : p.businessMonthly}</strong>
              <span>{isAnnual ? p.perYear : p.perMonth}</span>
            </div>
            <p className="pl-agency">{p.agencyCostLabel}: <s>{p.businessAgencyCost}</s></p>
            <button type="button" className="pill-btn pl-btn pill-light" onClick={() => choose('business')}>
              {p.businessBtn} <i className="fas fa-arrow-right"></i>
            </button>
            <Features items={p.businessFeatures} />
          </article>

          <article className="pl-card pl-enterprise">
            <span className="pl-tag">{p.enterpriseTag}</span>
            <h3>Enterprise</h3>
            <p className="pl-sub">{p.consultDesc}</p>
            <div className="pl-price pl-price-from">
              <em>{p.fromLabel}</em>
              <small>{p.currency}</small>
              <strong>{p.enterpriseMonthly}</strong>
              <span>{p.perMonth}</span>
            </div>
            <p className="pl-agency">{p.enterpriseAgencyCost}</p>
            <a className="pill-btn pl-btn pl-btn-outline" href="/enterprise/">
              {p.enterpriseBtn} <i className="fas fa-arrow-right"></i>
            </a>
            <Features items={p.enterpriseFeatures} />
            <a className="pl-talk" href={WHATSAPP_ENTERPRISE} target="_blank" rel="noopener noreferrer">
              <i className="fab fa-whatsapp"></i> {p.enterpriseTalk}
            </a>
          </article>
        </div>

        <p className="pl-disclaimer">{p.disclaimer}</p>
      </div>
    </section>
  );
}
