import { useEffect, useRef, useState } from 'react';
import LeadFormModal from './LeadFormModal';

// Barra flutuante de conversão: aparece ao rolar para baixo depois da hero
// e se esconde quando o visitante rola para cima.
export default function FloatingCta({ source }: { source: string }) {
  const [visible, setVisible] = useState(false);
  const [leadOpen, setLeadOpen] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;
      if (Math.abs(delta) < 6) return;
      setVisible(delta > 0 && y > 640);
      lastY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Sinaliza para o resto da página (ex.: botão do WhatsApp sobe para não ficar por baixo)
  useEffect(() => {
    document.body.classList.toggle('cta-visible', visible);
    return () => document.body.classList.remove('cta-visible');
  }, [visible]);

  return (
    <>
      <div className={`floating-cta${visible ? ' show' : ''}`} aria-hidden={!visible}>
        <div className="floating-cta-text">
          <strong>Tuliu</strong>
          <span><em>A partir de R$97/mês</em> · sem fidelidade</span>
        </div>
        <button type="button" tabIndex={visible ? 0 : -1} onClick={() => setLeadOpen(true)}>
          <span className="fc-long">Quero meu diagnóstico</span><span className="fc-short">Diagnóstico grátis</span> <i className="fas fa-arrow-right"></i>
        </button>
      </div>
      <LeadFormModal isOpen={leadOpen} onClose={() => setLeadOpen(false)} source={`floating-${source}`} />
    </>
  );
}
