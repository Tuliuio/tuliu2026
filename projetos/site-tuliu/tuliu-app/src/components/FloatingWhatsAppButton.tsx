import { useEffect, useState } from 'react';

// Botão flutuante do WhatsApp com um balão de convite. O balão aparece alguns
// segundos depois de a página abrir e some de vez quando a pessoa fecha (vale
// para a sessão). A conversa já abre com uma mensagem pronta.
const WA_NUMBER = '554840426597';
const WA_TEXT = 'Olá! Vim pelo site da Tuliu e quero implementar um marketing profissional na minha empresa.';
const WA_URL = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_TEXT)}`;
const DISMISS_KEY = 'tuliu-wa-invite-dismissed';

export default function FloatingWhatsAppButton() {
  const [showInvite, setShowInvite] = useState(false);

  useEffect(() => {
    let dismissed = false;
    try { dismissed = sessionStorage.getItem(DISMISS_KEY) === '1'; } catch { /* sem storage */ }
    if (dismissed) return;
    const t = window.setTimeout(() => setShowInvite(true), 4000);
    return () => window.clearTimeout(t);
  }, []);

  const dismiss = () => {
    setShowInvite(false);
    try { sessionStorage.setItem(DISMISS_KEY, '1'); } catch { /* sem storage */ }
  };

  return (
    <>
      {showInvite && (
        <div className="wa-invite" role="dialog" aria-label="Convite para conversar no WhatsApp">
          <button className="wa-invite-close" type="button" aria-label="Fechar convite" onClick={dismiss}>
            <i className="fas fa-xmark"></i>
          </button>
          <span className="wa-invite-tag">Online agora</span>
          <p>Vamos colocar um marketing profissional para rodar na sua empresa?</p>
          <a href={WA_URL} target="_blank" rel="noopener noreferrer" onClick={dismiss}>
            Chamar no WhatsApp <i className="fas fa-arrow-right"></i>
          </a>
        </div>
      )}
      <a
        href={WA_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="floating-whatsapp-btn"
        aria-label="Chat no WhatsApp"
        title="Chat no WhatsApp"
      >
        <i className="fab fa-whatsapp"></i>
      </a>
    </>
  );
}
