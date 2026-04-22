import { useEffect } from "react";
import { cases } from "../data/cases";

export default function CasesPage() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    const fadeElements = document.querySelectorAll(
      ".cases-page .fade-in:not(.visible)"
    );
    fadeElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="cases-page">
      {/* Hero Section */}
      <section className="cases-hero">
        <div className="container">
          <div className="section-header">
            <span className="badge">Resultados reais</span>
            <h1 className="cases-hero-title">
              Veja como a Tuliu transformou estes negócios
            </h1>
            <p className="cases-hero-subtitle">
              Histórias de sucesso de empresas que aumentaram produtividade e
              escalaram com automação inteligente.
            </p>
          </div>
        </div>
      </section>

      {/* Cases Grid Section */}
      <section className="cases-grid-section">
        <div className="container">
          <div className="cases-grid">
            {cases.map((caseStudy, idx) => (
              <article
                key={caseStudy.id}
                className={`case-card fade-in fade-in-delay-${(idx % 4) + 1}`}
              >
                {/* Card Header */}
                <div className="case-card-header">
                  <div className="case-card-icon">
                    <i className={caseStudy.icon}></i>
                  </div>
                  <div className="case-card-meta">
                    <h2 className="case-card-client">{caseStudy.client}</h2>
                    <span className="badge">{caseStudy.sector}</span>
                  </div>
                </div>

                {/* Challenge & Solution Blocks */}
                <div className="case-card-blocks">
                  <div className="case-card-block">
                    <h3>O Desafio</h3>
                    <p>{caseStudy.challenge}</p>
                  </div>
                  <div className="case-card-block">
                    <h3>A Solução</h3>
                    <p>{caseStudy.solution}</p>
                  </div>
                </div>

                {/* Metrics Row */}
                <div className="case-card-metrics">
                  {caseStudy.metrics.map((metric, idx) => (
                    <div key={idx} className="case-metric">
                      <strong className="case-metric-value">
                        {metric.value}
                      </strong>
                      <span className="case-metric-label">{metric.label}</span>
                    </div>
                  ))}
                </div>

                {/* Testimonial (if present) */}
                {caseStudy.testimonial && (
                  <div className="case-card-testimonial">
                    <blockquote>"{caseStudy.testimonial.quote}"</blockquote>
                    <div className="case-testimonial-author">
                      <strong>{caseStudy.testimonial.author}</strong>
                      <span>{caseStudy.testimonial.role}</span>
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-final">
        <div className="container">
          <div className="cta-final-inner">
            <h2>Próximo sucesso é seu</h2>
            <p>
              Descubra como a Tuliu pode resolver os desafios do seu negócio
              com automação inteligente e tecnologia adaptada à sua realidade.
            </p>
            <a href="#contato" className="btn btn-primary">
              Comece agora
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
