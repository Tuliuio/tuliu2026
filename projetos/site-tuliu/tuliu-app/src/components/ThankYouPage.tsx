import { useEffect } from 'react';
import { useLinkProps } from '../context/NavContext';
import { setMeta } from '../lib/meta';

const WHATSAPP_URL = 'https://wa.me/554840426597?text=Oi!%20Acabei%20de%20assinar%20um%20plano%20da%20Tuliu.';

// Retorno do checkout ASAAS (callback.successUrl). O acesso ao painel chega por
// e-mail, enviado pelo webhook asaas-webhook quando o pagamento é confirmado.
export default function ThankYouPage() {
  const link = useLinkProps();

  useEffect(() => {
    setMeta('Pagamento confirmado | Tuliu', 'Obrigado por assinar a Tuliu. Seu acesso ao painel chega por e-mail.');
  }, []);

  return (
    <section className="diag prop">
      <div className="container-wide diag-grid">
        <div className="diag-intro">
          <span className="lp-eyebrow">Assinatura confirmada</span>
          <h1>Obrigado por escolher a Tuliu.</h1>
          <p className="diag-lead">Seu pagamento foi recebido. A partir de agora o nosso time começa a trabalhar com você.</p>

          <ul className="prop-points">
            <li><i className="fas fa-envelope"></i><div><strong>Confira seu e-mail</strong><p>Em alguns minutos chega o convite para criar sua senha e entrar no painel. Se não aparecer, olhe o spam.</p></div></li>
            <li><i className="fas fa-list-check"></i><div><strong>Faça o onboarding</strong><p>No primeiro acesso você conta sobre a sua marca. É com isso que montamos o plano de trabalho.</p></div></li>
            <li><i className="fas fa-rocket"></i><div><strong>Acompanhe tudo no painel</strong><p>Entregas, campanhas e novidades ficam no painel, e avisamos você no WhatsApp.</p></div></li>
          </ul>
        </div>

        <div className="diag-card">
          <div className="diag-success">
            <div className="diag-success-icon"><i className="fas fa-check"></i></div>
            <h2>Pagamento confirmado</h2>
            <p>O recibo da assinatura foi enviado pelo ASAAS para o seu e-mail.</p>
            <a className="pill-btn pill-dark" {...link('/login')}>
              Entrar no painel <i className="fas fa-arrow-right"></i>
            </a>
            <a className="pill-btn pill-dark" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              <i className="fab fa-whatsapp"></i> Falar com a Tuliu
            </a>
            <a className="diag-back" {...link('/')}>Voltar para o site</a>
          </div>
        </div>
      </div>
    </section>
  );
}
