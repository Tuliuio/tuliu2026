// Conversões do Google Ads (conta Tuliu 876-312-1335). A tag gtag é carregada no index.html.
const ADS_ID = 'AW-18517648392';

const LABELS = {
  lead: 'QtkZCMXdrZ8dEIjI8_1E',      // Lead — Diagnóstico
  checkout: 'lZQ6CMjdrZ8dEIjI8_1E',  // Checkout Starter iniciado
  whatsapp: '6HR-CMvdrZ8dEIjI8_1E',  // Clique WhatsApp
} as const;

type Gtag = (...args: unknown[]) => void;

export function trackConversion(kind: keyof typeof LABELS) {
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  if (gtag) gtag('event', 'conversion', { send_to: `${ADS_ID}/${LABELS[kind]}` });
}

// Qualquer link wa.me no site conta como clique no WhatsApp
export function trackWhatsAppClicks() {
  document.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement | null)?.closest?.('a[href*="wa.me/"]');
    if (a) trackConversion('whatsapp');
  }, { capture: true });
}
