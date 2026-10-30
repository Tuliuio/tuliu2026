import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../context/LanguageContext';
import { trackConversion } from '../lib/ads';

const SUPABASE_URL = 'https://dojjedejwpwzvqoomtsj.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_3F6KIrSQU3K6p_ho6ChqFw_Ws49Bd2v';

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

export default function CheckoutRedirectModal({ isOpen, onClose, plan, isAnnual, currency, price, period, planDisplayName, planDisplayDesc }: CheckoutRedirectModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { t, language } = useLanguage();
  const m = t.checkoutModal;

  if (!isOpen) return null;

  const handleProceed = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/asaas-create-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({ isAnnual, plan }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || m.errorFallback);
      trackConversion('checkout');
      // Mesma aba: ao pagar, o ASAAS devolve o cliente para /obrigado
      window.location.assign(data.url);
    } catch (err: unknown) {
      setError((err as Error).message || m.errorFallback);
      setLoading(false);
    }
  };

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
        <button onClick={onClose} style={{
          position: 'absolute', top: '16px', right: '16px',
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: '20px', color: '#999',
        }}>
          <i className="fas fa-times"></i>
        </button>

        {/* Ícone */}
        <div style={{
          width: '64px', height: '64px', borderRadius: '50%',
          background: '#f5f5f7', display: 'flex', alignItems: 'center',
          justifyContent: 'center', margin: '0 auto 24px',
        }}>
          <i className="fas fa-lock" style={{ fontSize: '24px', color: '#111' }}></i>
        </div>

        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#111', marginBottom: '12px' }}>
          {m.title}
        </h2>

        <p style={{ color: '#666', fontSize: '15px', lineHeight: 1.7, marginBottom: '8px' }}>
          {m.description} <strong>ASAAS</strong>{m.descriptionSuffix}
        </p>

        {/* Resumo do plano */}
        <div style={{
          background: '#f5f5f7', borderRadius: '12px', padding: '16px',
          margin: '24px 0', textAlign: 'left',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: 0, fontWeight: 600, fontSize: '15px', color: '#111' }}>{planDisplayName}</p>
              <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#666' }}>{planDisplayDesc}</p>
            </div>
            <p style={{ margin: 0, fontWeight: 700, fontSize: '18px', color: '#111' }}>
              {currency} {price}{period}
            </p>
          </div>
        </div>

        {/* Nota BRL para clientes EN */}
        {language === 'en' && (
          <p style={{ fontSize: '12px', color: '#888', margin: '-12px 0 20px', textAlign: 'center' }}>
            <i className="fas fa-circle-info" style={{ marginRight: '5px' }}></i>
            Payment processed in BRL by ASAAS. Your bank will apply the exchange rate.
          </p>
        )}

        {/* Etapas */}
        <div style={{ textAlign: 'left', marginBottom: '28px' }}>
          {[
            { icon: 'fa-credit-card', text: m.steps[0] },
            { icon: 'fa-envelope', text: m.steps[1] },
            { icon: 'fa-rocket', text: m.steps[2] },
          ].map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: i < 2 ? '12px' : 0 }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%', background: '#111',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <i className={`fas ${step.icon}`} style={{ fontSize: '13px', color: 'white' }}></i>
              </div>
              <p style={{ margin: 0, fontSize: '14px', color: '#444' }}>{step.text}</p>
            </div>
          ))}
        </div>

        {error && (
          <p style={{ color: '#e53e3e', fontSize: '13px', marginBottom: '12px' }}>
            <i className="fas fa-circle-exclamation" style={{ marginRight: '6px' }}></i>
            {error}
          </p>
        )}

        <button
          onClick={handleProceed}
          disabled={loading}
          style={{
            width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
            background: '#111', color: 'white', fontSize: '15px', fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: '8px',
          }}
        >
          {loading ? (
            <>
              <i className="fas fa-spinner fa-spin" style={{ fontSize: '14px' }}></i>
              {m.btnLoading}
            </>
          ) : (
            <>
              {m.btnProceed}
              <i className="fas fa-arrow-right" style={{ fontSize: '13px' }}></i>
            </>
          )}
        </button>

        <p style={{ margin: '14px 0 0', fontSize: '12px', color: '#aaa' }}>
          <i className="fas fa-shield-halved" style={{ marginRight: '4px' }}></i>
          {m.footer}
        </p>
      </div>
    </div>,
    document.body,
  );
}
