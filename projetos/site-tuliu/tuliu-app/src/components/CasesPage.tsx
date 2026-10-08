import { useEffect } from 'react';
import type React from 'react';
import { cases } from '../data/cases';
import { useGo } from '../context/NavContext';
import { diagHref } from '../lib/diag';
import { setMeta } from '../lib/meta';
import { CtaButton, FinalBand } from './landing/blocks';

/* Somatório dos números de mídia dos cases, só no período em que a Tuliu opera cada conta */
const TOTALS = [
  { value: '1,7 mi', label: 'exibições de anúncios' },
  { value: '+40 mil', label: 'cliques de clientes em potencial' },
  { value: '-24%', label: 'no custo por conversa de venda na Scienco' },
  { value: '4', label: 'setores diferentes, uma operação só' },
];

export default function CasesPage() {
  const go = useGo();
  const openLead = () => go(diagHref('cases'));

  useEffect(() => {
    setMeta(
      'Resultados | Tuliu',
      'Cases reais da Tuliu: tráfego pago, sites, vídeo e campanhas completas para empresas de biotecnologia, saúde e construção. Números medidos, não promessas.',
    );
  }, []);

  return (
    <div className="lp cs">
      <section className="lp-hero cs-hero">
        <div className="container-wide">
          <div className="lp-hero-copy">
            <span className="lp-hero-eyebrow"><i className="fas fa-circle"></i>Resultados reais</span>
            <h1>
              Negócios reais, <span className="lp-gradient-text">resultados medidos.</span>
            </h1>
            <p className="lp-hero-sub">
              Biotecnologia, saúde e construção industrial. Setores diferentes, a mesma operação: tráfego, site, conteúdo e vídeo rodando juntos, com cada número vindo direto das contas de anúncio.
            </p>
            <div className="lp-hero-actions">
              <CtaButton label="Quero meu diagnóstico gratuito" onClick={openLead} />
            </div>
          </div>

          <ul className="cs-logos" aria-label="Clientes">
            {cases.map((c) => (
              <li key={c.id}><a href={`#${c.id}`}><img src={c.logo} alt={c.client} style={{ '--s': c.logoScale ?? 1 } as React.CSSProperties} /></a></li>
            ))}
          </ul>
        </div>
      </section>

      <section className="cs-totals" aria-label="Números somados dos cases">
        <div className="container">
          <div className="cs-totals-grid">
            {TOTALS.map((t) => (
              <div key={t.label}>
                <strong>{t.value}</strong>
                <span>{t.label}</span>
              </div>
            ))}
          </div>
          <p className="cs-note">Soma dos anúncios no Meta e no Google dos clientes abaixo, só no período em que a Tuliu opera cada conta, até outubro de 2026.</p>
        </div>
      </section>

      {cases.map((c, i) => (
        <section key={c.id} id={c.id} className={`lp-section cs-case${i % 2 ? ' lp-soft' : ''}`}>
          <div className="container">
            <div className="cs-case-grid">
              <div className="cs-case-copy">
                <div className="cs-case-head">
                  <img className="cs-case-logo" src={c.logo} alt={c.client} loading="lazy" style={{ '--s': c.logoScale ?? 1 } as React.CSSProperties} />
                  <span className="cs-case-meta"><i className={c.icon}></i> {c.sector} · {c.location}</span>
                </div>
                <h2>{c.headline}</h2>

                <div className="cs-case-text">
                  <h3>O desafio</h3>
                  <p>{c.challenge}</p>
                  <h3>O que a Tuliu fez</h3>
                  <p>{c.solution}</p>
                </div>

                <ul className="cs-chips" aria-label="O que a Tuliu entrega">
                  {c.services.map((s) => <li key={s}>{s}</li>)}
                </ul>
              </div>

              <aside className="cs-panel" aria-label={`Resultados de ${c.client}`}>
                <div className="cs-panel-main">
                  <strong>{c.metrics[0].value}</strong>
                  <span>{c.metrics[0].label}</span>
                </div>
                <ul className="cs-panel-list">
                  {c.metrics.slice(1).map((m) => (
                    <li key={m.label}>
                      <strong>{m.value}</strong>
                      <span>{m.label}</span>
                    </li>
                  ))}
                </ul>
                <p className="cs-panel-source"><i className="fas fa-chart-simple"></i> {c.source}</p>
              </aside>
            </div>

            {c.testimonial && (
              <figure className="cs-quote">
                <blockquote>"{c.testimonial.quote}"</blockquote>
                <figcaption><strong>{c.testimonial.author}</strong> · {c.testimonial.role}</figcaption>
              </figure>
            )}
          </div>
        </section>
      ))}

      <FinalBand onCta={openLead} />
    </div>
  );
}
