import { useLanguage } from '../context/LanguageContext';

export default function Included() {
  const { t } = useLanguage();
  return (
    <section className="included" aria-labelledby="included-heading">
      <div className="container">
        <div className="section-header">
          <div className="badge fade-in">
            <i className="fas fa-circle" style={{ fontSize: '6px', marginRight: '8px', verticalAlign: 'middle' }}></i>
            {t.included.badge}
          </div>
          <h2 className="fade-in fade-in-delay-1" id="included-heading">
            {t.included.title}
          </h2>
          <p className="fade-in fade-in-delay-2">
            {t.included.subtitle}
          </p>
        </div>

        <div className="included-grid">
          {t.included.items.map((item, i) => (
            <div key={item.title} className={`included-item fade-in fade-in-delay-${(i % 4) + 1}`}>
              <div className="included-icon" aria-hidden="true">
                <i className={item.icon}></i>
              </div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
