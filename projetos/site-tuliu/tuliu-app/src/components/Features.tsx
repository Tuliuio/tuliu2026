import { useLanguage } from '../context/LanguageContext';

export default function Features() {
  const { t } = useLanguage();
  return (
    <section className="features" id="servicos" aria-labelledby="features-heading">
      <div className="container">
        <div className="section-header">
          <div className="badge fade-in">
            <i className="fas fa-circle" style={{ fontSize: '6px', marginRight: '8px', verticalAlign: 'middle' }}></i>
            {t.features.badge}
          </div>
          <h2 className="fade-in fade-in-delay-1" id="features-heading">
            {t.features.title}
          </h2>
          <p className="fade-in fade-in-delay-2">
            {t.features.subtitle}
          </p>
        </div>

        <div className="features-bento" id="solucoes">

          {/* Sites card — wide left */}
          <article className="feature-card-bento fcard-sites fade-in fade-in-delay-1">
            <div className="fcard-illustration" aria-hidden="true">
              <div className="mini-browser">
                <div className="mini-browser-bar">
                  <div className="mini-browser-dot"></div>
                  <div className="mini-browser-dot"></div>
                  <div className="mini-browser-dot"></div>
                  <div className="mini-browser-url">tuliu.io</div>
                </div>
                <div className="mini-browser-progress-wrap">
                  <div className="mini-browser-progress-bar"></div>
                </div>
                <div className="mini-browser-body">
                  <div className="mini-browser-hero-block">
                    <div className="mini-browser-hero-inner"></div>
                  </div>
                  <div className="mini-browser-line mb-line-full"></div>
                  <div className="mini-browser-line mb-line-3q"></div>
                  <div className="mini-browser-line mb-line-half"></div>
                </div>
              </div>
            </div>
            <div className="fcard-icon" aria-hidden="true">
              <i className="fas fa-globe"></i>
            </div>
            <h3>{t.features.card1Title}</h3>
            <p>{t.features.card1Desc}</p>
          </article>

          {/* AI Agents card — narrow right */}
          <article className="feature-card-bento fcard-ia fade-in fade-in-delay-2">
            <div className="fcard-illustration" aria-hidden="true">
              <div className="chat-ui">
                <div className="chat-msg chat-msg-user">Quero saber sobre os planos</div>
                <div className="chat-msg-typing">
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                </div>
                <div className="chat-msg chat-msg-agent">Olá! Posso te ajudar agora.</div>
              </div>
            </div>
            <div className="fcard-icon" aria-hidden="true">
              <i className="fas fa-robot"></i>
            </div>
            <h3>{t.features.card3Title}</h3>
            <p>{t.features.card3Desc}</p>
          </article>

          {/* Automations card — full width dark */}
          <article className="feature-card-bento fcard-auto fade-in fade-in-delay-3">
            <div className="fcard-auto-text">
              <div className="fcard-icon" aria-hidden="true">
                <i className="fas fa-bolt"></i>
              </div>
              <h3>{t.features.card2Title}</h3>
              <p>{t.features.card2Desc}</p>
            </div>
            <div className="fcard-auto-diagram" aria-hidden="true">
              <div className="flow-node"><i className="fas fa-envelope"></i></div>
              <div className="flow-connector"></div>
              <div className="flow-node active"><i className="fas fa-bolt"></i></div>
              <div className="flow-connector"></div>
              <div className="flow-node"><i className="fab fa-whatsapp"></i></div>
              <div className="flow-connector"></div>
              <div className="flow-node"><i className="fas fa-chart-bar"></i></div>
            </div>
          </article>
        </div>

        <div className="features-cta fade-in">
          <a href="#" className="btn btn-outline">{t.features.cta}</a>
        </div>
      </div>
    </section>
  );
}
