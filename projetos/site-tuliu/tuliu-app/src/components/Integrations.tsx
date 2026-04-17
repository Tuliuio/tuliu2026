import { useLanguage } from '../context/LanguageContext';

export default function Integrations() {
  const { t } = useLanguage();
  const logosRow1 = [
    { name: 'Slack', icon: 'S', color: '#4A154B' },
    { name: 'HubSpot', icon: 'H', color: '#FF7A59' },
    { name: 'Stripe', icon: '$', color: '#6772E5' },
    { name: 'WhatsApp', icon: 'W', color: '#25D366' },
    { name: 'Notion', icon: 'N', color: '#000' },
    { name: 'Zapier', icon: 'Z', color: '#FF4A00' },
    { name: 'GitHub', icon: 'G', color: '#24292E' },
    { name: 'Google', icon: 'G', color: '#4285F4' },
  ];

  const logosRow2 = [
    { name: 'AWS', icon: 'A', color: '#232F3E' },
    { name: 'Vercel', icon: 'V', color: '#000' },
    { name: 'Cloudflare', icon: 'C', color: '#F48120' },
    { name: 'Twilio', icon: 'T', color: '#F22F46' },
    { name: 'Jira', icon: 'J', color: '#0052CC' },
    { name: 'Airtable', icon: 'A', color: '#EB5757' },
    { name: 'Google Sheets', icon: 'G', color: '#0F9D58' },
    { name: 'Make', icon: 'M', color: '#2F80ED' },
  ];

  return (
    <section className="integrations" aria-labelledby="integrations-heading">
      <div className="container">
        <div className="integrations-header">
          <h2 className="fade-in" id="integrations-heading">
            {t.integrations.title}
          </h2>
          <p className="fade-in fade-in-delay-1">
            {t.integrations.subtitle}
          </p>
          <a href="#precos" className="btn btn-primary fade-in fade-in-delay-2">
            {t.integrations.cta}
          </a>
        </div>
      </div>

      <div className="marquee-wrapper" aria-hidden="true">
        {/* Fileira 1 (esquerda) */}
        <div className="marquee-row marquee-row-1">
          {[...logosRow1, ...logosRow1].map((logo, idx) => (
            <span key={`r1-${idx}`} className="logo-chip">
              <span className="logo-chip-icon" style={{ background: logo.color, color: '#fff' }}>
                {logo.icon}
              </span>
              {logo.name}
            </span>
          ))}
        </div>

        {/* Fileira 2 (direita) */}
        <div className="marquee-row marquee-row-2">
          {[...logosRow2, ...logosRow2].map((logo, idx) => (
            <span key={`r2-${idx}`} className="logo-chip">
              <span className="logo-chip-icon" style={{ background: logo.color, color: '#fff' }}>
                {logo.icon}
              </span>
              {logo.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
