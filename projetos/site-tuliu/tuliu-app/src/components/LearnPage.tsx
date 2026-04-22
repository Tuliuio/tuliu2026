import { useEffect } from "react";
import { courses } from "../data/learn";

export default function LearnPage() {
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
      ".learn-page .fade-in:not(.visible)"
    );
    fadeElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="learn-page">
      {/* Hero Section */}
      <section className="learn-hero">
        <div className="container">
          <div className="section-header">
            <span className="badge">Fundamentos, Branding e Marketing</span>
            <h1 className="learn-hero-title">
              Aprenda com quem faz.
            </h1>
            <p className="learn-hero-subtitle">
              Cursos criados pela Tuliu para empreendedores e empresários que querem evoluir sua marca, dominar o marketing digital e desenvolver a mentalidade de quem realiza.
            </p>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="learn-courses">
        <div className="container">
          {courses.map((course, idx) => (
            <article
              key={course.id}
              className={`learn-card-full fade-in fade-in-delay-${(idx % 4) + 1}`}
            >
              {/* Card Icon */}
              <div className="learn-card-icon">
                <i className={course.icon}></i>
              </div>

              {/* Card Body */}
              <div className="learn-card-body">
                <h2 className="learn-card-title">{course.title}</h2>
                <p className="learn-card-desc">{course.description}</p>
              </div>

              {/* Card Footer */}
              <div className="learn-card-footer">
                <span className="learn-platform-badge">
                  {course.platform}
                </span>
                <a
                  href={course.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                >
                  Acessar curso
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-final">
        <div className="container">
          <div className="cta-final-inner">
            <h2>Pronto para começar?</h2>
            <p>
              Escolha um curso, comece hoje mesmo e transforme seu negócio com
              automação inteligente.
            </p>
            <a href="#contato" className="btn btn-primary">
              Fale com um especialista
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
