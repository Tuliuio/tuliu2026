import { useLanguage } from '../context/LanguageContext';
import { cases } from '../data/cases';

interface ProofProps {
  onNavigate: (page: 'cases') => void;
}

export default function Proof({ onNavigate }: ProofProps) {
  const { t } = useLanguage();
  const featured = cases.find((c) => c.id === 'vital-brasil') ?? cases[0];
  const testimonial = featured.testimonial;

  if (!testimonial) return null;

  return (
    <section className="proof" aria-labelledby="proof-heading">
      <div className="container">
        <div className="proof-inner fade-in">
          <span className="badge">
            <i className="fas fa-circle" style={{ fontSize: '6px', marginRight: '8px', verticalAlign: 'middle' }}></i>
            {t.proof.badge}
          </span>

          <blockquote className="proof-quote" id="proof-heading">
            "{testimonial.quote}"
          </blockquote>

          <div className="proof-author">
            <strong>{testimonial.author}</strong>
            <span> · {testimonial.role}</span>
          </div>

          <div className="proof-metrics">
            {featured.metrics.map((metric, i) => (
              <div key={i} className="proof-metric">
                <span className="proof-metric-value">{metric.value}</span>
                <span className="proof-metric-label">{metric.label}</span>
              </div>
            ))}
          </div>

          <button type="button" className="proof-link" onClick={() => onNavigate('cases')}>
            {t.proof.linkCases}
            <i className="fas fa-arrow-right" style={{ fontSize: '12px', marginLeft: '6px' }}></i>
          </button>
        </div>
      </div>
    </section>
  );
}
