import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function FAQ() {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="faq" aria-labelledby="faq-heading">
      <div className="container">
        <div className="section-header">
          <div className="badge fade-in">
            <i className="fas fa-circle" style={{ fontSize: '6px', marginRight: '8px', verticalAlign: 'middle' }}></i>
            {t.faq.badge}
          </div>
          <h2 className="fade-in fade-in-delay-1" id="faq-heading">
            {t.faq.title}
          </h2>
        </div>

        <div className="faq-list">
          {t.faq.items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={item.q} className={`faq-item ${isOpen ? 'open' : ''}`}>
                <button
                  type="button"
                  className="faq-question"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                >
                  <span>{item.q}</span>
                  <i className={`fas ${isOpen ? 'fa-minus' : 'fa-plus'}`} aria-hidden="true"></i>
                </button>
                {isOpen && <p className="faq-answer">{item.a}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
