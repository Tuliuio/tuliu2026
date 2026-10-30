import { useEffect, useState } from 'react';
import type { CSSProperties, FormEvent, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../context/LanguageContext';
import { trackConversion } from '../lib/ads';

const SUPABASE_URL = 'https://dojjedejwpwzvqoomtsj.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_3F6KIrSQU3K6p_ho6ChqFw_Ws49Bd2v';
const WHATSAPP_URL = 'https://wa.me/554840426597?text=Oi!%20Tive%20um%20problema%20ao%20assinar%20a%20Tuliu%20pelo%20Pix%20Autom%C3%A1tico.';
const STATUS_POLL_MS = 4000;

interface CheckoutRedirectModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: 'starter' | 'business';
  isAnnual: boolean;
  currency: string;
  price: string;
  period: string;
  planDisplayName: string;
  planDisplayDesc: string;
}

type Step = 'choose' | 'card' | 'pix-form' | 'pix-qr' | 'pix-refused' | 'pix-expired';

interface PixAuthorization {
  id: string;
  payload: string;
  encodedImage: string;
}

async function callFunction(name: string, body: unknown) {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/${name}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok || data.error) throw new Error(data.error);
  return data;
}

function formatCpfCnpj(value: string) {
  const d = value.replace(/\D/g, '').slice(0, 14);
  if (d.length <= 11) {
    return d.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }
  return d.replace(/(\d{2})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1/$2').replace(/(\d{4})(\d{1,2})$/, '$1-$2');
}

function formatPhone(value: string) {
  const d = value.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 10) return d.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d)/, '$1-$2');
  return d.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2');
}

const darkBtn = (loading = false): CSSProperties => ({
  width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
  background: '#111', color: 'white', fontSize: '15px', fontWeight: 600,
  cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
});

const inputStyle: CSSProperties = {
  width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #ddd',
  fontSize: '15px', fontFamily: 'inherit', color: '#111', background: 'white', boxSizing: 'border-box',
};

const linkBtn: CSSProperties = {
  background: 'none', border: 'none', color: '#666', fontSize: '13px',
  cursor: 'pointer', marginTop: '14px', textDecoration: 'underline', fontFamily: 'inherit',
};

function Icon({ icon }: { icon: string }) {
  return (
    <div style={{
      width: '64px', height: '64px', borderRadius: '50%',
      background: '#f5f5f7', display: 'flex', alignItems: 'center',
      justifyContent: 'center', margin: '0 auto 24px',
    }}>
      <i className={icon} style={{ fontSize: '24px', color: '#111' }}></i>
    </div>
  );
}

function MethodOption({ icon, title, desc, badge, onClick }: { icon: string; title: string; desc: string; badge?: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} style={{
      width: '100%', display: 'flex', alignItems: 'center', gap: '14px', textAlign: 'left',
      padding: '16px', borderRadius: '14px', border: badge ? '2px solid #111' : '1px solid #ddd',
      background: 'white', cursor: 'pointer', marginBottom: '12px', fontFamily: 'inherit',
    }}>
      <div style={{
        width: '40px', height: '40px', borderRadius: '50%', background: badge ? '#111' : '#f5f5f7',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <i className={icon} style={{ fontSize: '16px', color: badge ? 'white' : '#111' }}></i>
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontWeight: 600, fontSize: '15px', color: '#111' }}>
          {title}
          {badge && (
            <span style={{
              marginLeft: '8px', fontSize: '11px', fontWeight: 600, color: '#6d28d9',
              background: '#f3efff', borderRadius: '999px', padding: '2px 8px', verticalAlign: 'middle',
            }}>{badge}</span>
          )}
        </p>
        <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#666', lineHeight: 1.5 }}>{desc}</p>
      </div>
      <i className="fas fa-chevron-right" style={{ fontSize: '12px', color: '#999' }}></i>
    </button>
  );
}

function ErrorText({ children }: { children: ReactNode }) {
  return (
    <p style={{ color: '#e53e3e', fontSize: '13px', margin: '0 0 12px' }}>
      <i className="fas fa-circle-exclamation" style={{ marginRight: '6px' }}></i>
      {children}
    </p>
  );
}

export default function CheckoutRedirectModal({ isOpen, onClose, plan, isAnnual, currency, price, period, planDisplayName, planDisplayDesc }: CheckoutRedirectModalProps) {
  const { t, language } = useLanguage();
  const m = t.checkoutModal;
  // Pix exige CPF/CNPJ e cobra em reais: só na versão em português
  const pixAvailable = language !== 'en';
  const [step, setStep] = useState<Step>(pixAvailable ? 'choose' : 'card');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', cpfCnpj: '', phone: '' });
  const [pix, setPix] = useState<PixAuthorization | null>(null);
  const [copied, setCopied] = useState(false);

  // Aguarda o pagamento do QR Code: a autorização fica ACTIVE quando o banco do cliente confirma
  useEffect(() => {
    if (step !== 'pix-qr' || !pix) return;
    let stopped = false;
    const check = async () => {
      try {
        const { status } = await callFunction('asaas-pix-automatico', { action: 'status', id: pix.id });
        if (stopped) return;
        if (status === 'ACTIVE') window.location.assign('/obrigado');
        else if (status === 'REFUSED') setStep('pix-refused');
        else if (status === 'EXPIRED' || status === 'CANCELLED') setStep('pix-expired');
      } catch {
        // Falha pontual de rede: tenta de novo no próximo ciclo
      }
    };
    const timer = window.setInterval(check, STATUS_POLL_MS);
    return () => {
      stopped = true;
      window.clearInterval(timer);
    };
  }, [step, pix]);

  if (!isOpen) return null;

  const handleCard = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await callFunction('asaas-create-checkout', { isAnnual, plan });
      if (!data.url) throw new Error();
      trackConversion('checkout');
      // Mesma aba: ao pagar, o ASAAS devolve o cliente para /obrigado
      window.location.assign(data.url);
    } catch (err: unknown) {
      setError((err as Error).message || m.errorFallback);
      setLoading(false);
    }
  };

  const handlePix = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await callFunction('asaas-pix-automatico', { action: 'create', plan, isAnnual, ...form });
      trackConversion('checkout');
      setPix({ id: data.id, payload: data.payload, encodedImage: data.encodedImage });
      setStep('pix-qr');
    } catch (err: unknown) {
      setError((err as Error).message || 'Não foi possível gerar o Pix Automático. Tente novamente ou pague com cartão.');
    } finally {
      setLoading(false);
    }
  };

  const copyPayload = async () => {
    if (!pix) return;
    try {
      await navigator.clipboard.writeText(pix.payload);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      // Sem permissão de clipboard: o código continua visível para copiar à mão
    }
  };

  const set = (field: keyof typeof form, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const summary = (
    <div style={{
      background: '#f5f5f7', borderRadius: '12px', padding: '16px',
      margin: '24px 0', textAlign: 'left',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
        <div>
          <p style={{ margin: 0, fontWeight: 600, fontSize: '15px', color: '#111' }}>{planDisplayName}</p>
          <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#666' }}>{planDisplayDesc}</p>
        </div>
        <p style={{ margin: 0, fontWeight: 700, fontSize: '18px', color: '#111', whiteSpace: 'nowrap' }}>
          {currency} {price}{period}
        </p>
      </div>
    </div>
  );

  const backToChoose = pixAvailable && (
    <button type="button" style={linkBtn} onClick={() => { setError(''); setStep('choose'); }}>
      Escolher outra forma de pagamento
    </button>
  );

  let content: ReactNode;

  if (step === 'choose') {
    content = (
      <>
        <Icon icon="fas fa-lock" />
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#111', marginBottom: '8px' }}>Como você prefere pagar?</h2>
        {summary}
        <div style={{ marginTop: '-8px' }}>
          <MethodOption
            icon="fas fa-bolt"
            title="Pix Automático"
            badge="Novo"
            desc={`Autorize uma vez no app do seu banco e a cobrança ${isAnnual ? 'anual' : 'mensal'} cai sozinha. Sem cartão e sem usar limite.`}
            onClick={() => setStep('pix-form')}
          />
          <MethodOption
            icon="fas fa-credit-card"
            title="Cartão de crédito"
            desc="Pagamento recorrente no ambiente seguro do ASAAS."
            onClick={() => setStep('card')}
          />
        </div>
      </>
    );
  } else if (step === 'card') {
    content = (
      <>
        <Icon icon="fas fa-lock" />
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#111', marginBottom: '12px' }}>{m.title}</h2>
        <p style={{ color: '#666', fontSize: '15px', lineHeight: 1.7, marginBottom: '8px' }}>
          {m.description} <strong>ASAAS</strong>{m.descriptionSuffix}
        </p>
        {summary}

        {/* Nota BRL para clientes EN */}
        {language === 'en' && (
          <p style={{ fontSize: '12px', color: '#888', margin: '-12px 0 20px', textAlign: 'center' }}>
            <i className="fas fa-circle-info" style={{ marginRight: '5px' }}></i>
            Payment processed in BRL by ASAAS. Your bank will apply the exchange rate.
          </p>
        )}

        <div style={{ textAlign: 'left', marginBottom: '28px' }}>
          {[
            { icon: 'fa-credit-card', text: m.steps[0] },
            { icon: 'fa-envelope', text: m.steps[1] },
            { icon: 'fa-rocket', text: m.steps[2] },
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: i < 2 ? '12px' : 0 }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%', background: '#111',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <i className={`fas ${s.icon}`} style={{ fontSize: '13px', color: 'white' }}></i>
              </div>
              <p style={{ margin: 0, fontSize: '14px', color: '#444' }}>{s.text}</p>
            </div>
          ))}
        </div>

        {error && <ErrorText>{error}</ErrorText>}

        <button onClick={handleCard} disabled={loading} style={darkBtn(loading)}>
          {loading ? (
            <><i className="fas fa-spinner fa-spin" style={{ fontSize: '14px' }}></i>{m.btnLoading}</>
          ) : (
            <>{m.btnProceed}<i className="fas fa-arrow-right" style={{ fontSize: '13px' }}></i></>
          )}
        </button>

        <p style={{ margin: '14px 0 0', fontSize: '12px', color: '#aaa' }}>
          <i className="fas fa-shield-halved" style={{ marginRight: '4px' }}></i>
          {m.footer}
        </p>
        {backToChoose}
      </>
    );
  } else if (step === 'pix-form') {
    content = (
      <form onSubmit={handlePix}>
        <Icon icon="fas fa-bolt" />
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#111', marginBottom: '8px' }}>Pix Automático</h2>
        <p style={{ color: '#666', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
          Seus dados para a assinatura. No próximo passo você paga o primeiro {isAnnual ? 'ano' : 'mês'} e autoriza as próximas cobranças no app do banco.
        </p>
        {summary}
        <div style={{ display: 'grid', gap: '10px', textAlign: 'left', marginBottom: '20px' }}>
          <input style={inputStyle} required placeholder="Nome completo ou razão social" autoComplete="name"
            value={form.name} onChange={(e) => set('name', e.target.value)} />
          <input style={inputStyle} required type="email" placeholder="E-mail (receberá o acesso ao painel)" autoComplete="email"
            value={form.email} onChange={(e) => set('email', e.target.value)} />
          <input style={inputStyle} required inputMode="numeric" placeholder="CPF ou CNPJ"
            value={form.cpfCnpj} onChange={(e) => set('cpfCnpj', formatCpfCnpj(e.target.value))} />
          <input style={inputStyle} required inputMode="tel" placeholder="WhatsApp com DDD" autoComplete="tel"
            value={form.phone} onChange={(e) => set('phone', formatPhone(e.target.value))} />
        </div>

        {error && <ErrorText>{error}</ErrorText>}

        <button type="submit" disabled={loading} style={darkBtn(loading)}>
          {loading ? (
            <><i className="fas fa-spinner fa-spin" style={{ fontSize: '14px' }}></i>Gerando o Pix...</>
          ) : (
            <>Gerar QR Code<i className="fas fa-arrow-right" style={{ fontSize: '13px' }}></i></>
          )}
        </button>
        {backToChoose}
      </form>
    );
  } else if (step === 'pix-qr' && pix) {
    content = (
      <>
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#111', marginBottom: '8px' }}>Pague e autorize no seu banco</h2>
        <p style={{ color: '#666', fontSize: '14px', lineHeight: 1.6, margin: '0 0 16px' }}>
          Abra o app do banco, escolha pagar com Pix e leia o QR Code. Ao confirmar, você paga {currency} {price} agora e autoriza a cobrança {isAnnual ? 'anual' : 'mensal'} automática.
        </p>
        <img
          src={`data:image/png;base64,${pix.encodedImage}`}
          alt="QR Code do Pix Automático"
          style={{ width: '220px', height: '220px', margin: '0 auto', display: 'block' }}
        />
        <button type="button" onClick={copyPayload} style={{ ...darkBtn(), marginTop: '16px' }}>
          <i className={copied ? 'fas fa-check' : 'fas fa-copy'} style={{ fontSize: '14px' }}></i>
          {copied ? 'Código copiado' : 'Copiar código Pix'}
        </button>
        <p style={{ margin: '16px 0 0', fontSize: '13px', color: '#666', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <i className="fas fa-spinner fa-spin"></i>
          Aguardando a confirmação do seu banco. O QR Code vale por 1 hora.
        </p>
        <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#aaa' }}>
          Você pode cancelar o Pix Automático quando quiser, direto no app do banco.
        </p>
      </>
    );
  } else if (step === 'pix-refused') {
    content = (
      <>
        <Icon icon="fas fa-circle-exclamation" />
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#111', marginBottom: '12px' }}>A autorização não foi concluída</h2>
        <p style={{ color: '#666', fontSize: '15px', lineHeight: 1.7, marginBottom: '24px' }}>
          Se o pagamento foi feito, ele está garantido. Fale com a gente no WhatsApp e acertamos as próximas cobranças.
        </p>
        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" style={{ ...darkBtn(), textDecoration: 'none' }}>
          <i className="fab fa-whatsapp"></i> Falar com a Tuliu
        </a>
      </>
    );
  } else {
    content = (
      <>
        <Icon icon="fas fa-clock" />
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#111', marginBottom: '12px' }}>O QR Code expirou</h2>
        <p style={{ color: '#666', fontSize: '15px', lineHeight: 1.7, marginBottom: '24px' }}>
          Nenhuma cobrança foi feita. Gere um novo QR Code para continuar.
        </p>
        <button type="button" style={darkBtn()} onClick={() => { setPix(null); setStep('pix-form'); }}>
          Gerar novo QR Code <i className="fas fa-arrow-right" style={{ fontSize: '13px' }}></i>
        </button>
        {backToChoose}
      </>
    );
  }

  // Portal no body: a seção de preços cria um contexto de empilhamento que prenderia o modal
  return createPortal(
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 2147483000, padding: '24px', overflowY: 'auto',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: 'white', borderRadius: '20px', padding: '40px',
        maxWidth: '440px', width: '100%', position: 'relative', margin: 'auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        fontFamily: 'Inter, sans-serif', textAlign: 'center',
      }}>
        <button onClick={onClose} aria-label="Fechar" style={{
          position: 'absolute', top: '16px', right: '16px',
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: '20px', color: '#999',
        }}>
          <i className="fas fa-times"></i>
        </button>
        {content}
      </div>
    </div>,
    document.body,
  );
}
