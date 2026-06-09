import { useState } from 'react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAnnual: boolean;
}

const SUPABASE_URL = 'https://dojjedejwpwzvqoomtsj.supabase.co';
const SUPABASE_ANON = 'sb_publishable_3F6KIrSQU3K6p_ho6ChqFw_Ws49Bd2v';

function formatCard(value: string) {
  return value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2);
  return digits;
}

function formatCPF(value: string) {
  const d = value.replace(/\D/g, '').slice(0, 11);
  return d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

function formatPhone(value: string) {
  const d = value.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 10) return d.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  return d.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
}

function formatCEP(value: string) {
  const d = value.replace(/\D/g, '').slice(0, 8);
  return d.replace(/(\d{5})(\d{3})/, '$1-$2');
}

export default function PaymentModal({ isOpen, onClose, isAnnual }: PaymentModalProps) {
  const [step, setStep] = useState<'personal' | 'card' | 'processing' | 'success' | 'error'>('personal');
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '', email: '', cpfCnpj: '', phone: '', postalCode: '', addressNumber: '',
    holderName: '', cardNumber: '', expiry: '', ccv: '',
  });

  if (!isOpen) return null;

  const set = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async () => {
    setStep('processing');
    setError('');
    try {
      const [expiryMonth, expiryYear] = form.expiry.split('/');
      const res = await fetch(`${SUPABASE_URL}/functions/v1/asaas-create-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON,
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          cpfCnpj: form.cpfCnpj,
          phone: form.phone,
          postalCode: form.postalCode,
          addressNumber: form.addressNumber,
          card: {
            holderName: form.holderName,
            number: form.cardNumber,
            expiryMonth: expiryMonth?.trim(),
            expiryYear: `20${expiryYear?.trim()}`,
            ccv: form.ccv,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || 'Erro ao processar pagamento.');
        setStep('error');
      } else {
        setStep('success');
      }
    } catch {
      setError('Erro de conexão. Tente novamente.');
      setStep('error');
    }
  };

  const price = isAnnual ? 'R$ 997/ano' : 'R$ 97/mês';

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999, padding: '24px',
    }} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: 'white', borderRadius: '20px', padding: '40px',
        maxWidth: '480px', width: '100%', position: 'relative',
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        fontFamily: 'Inter, sans-serif',
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: '16px', right: '16px',
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: '20px', color: '#999', lineHeight: 1,
        }}>
          <i className="fas fa-times"></i>
        </button>

        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: '#f5f5f7', borderRadius: '8px', padding: '6px 12px',
            fontSize: '13px', fontWeight: 600, color: '#444', marginBottom: '12px',
          }}>
            <i className="fas fa-lock" style={{ fontSize: '11px' }}></i>
            Pagamento seguro
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#111', margin: 0 }}>
            Plano Starter
          </h2>
          <p style={{ color: '#666', fontSize: '15px', margin: '4px 0 0' }}>{price}</p>
        </div>

        {/* Steps */}
        {(step === 'personal' || step === 'card') && (
          <div style={{ display: 'flex', gap: '8px', marginBottom: '28px' }}>
            {['Dados pessoais', 'Cartão'].map((label, i) => (
              <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                <div style={{
                  height: '3px', borderRadius: '2px', marginBottom: '6px',
                  background: i === (step === 'personal' ? 0 : 1) ? '#111' : i < (step === 'personal' ? 0 : 1) ? '#111' : '#E5E7EB',
                }} />
                <span style={{ fontSize: '12px', color: i <= (step === 'personal' ? 0 : 1) ? '#111' : '#999', fontWeight: 500 }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Step 1: Dados pessoais */}
        {step === 'personal' && (
          <>
            <div style={{ display: 'grid', gap: '14px' }}>
              <div>
                <label style={lbl}>Nome completo</label>
                <input style={inp} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="João Silva" />
              </div>
              <div>
                <label style={lbl}>E-mail</label>
                <input style={inp} type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="joao@empresa.com" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={lbl}>CPF</label>
                  <input style={inp} value={form.cpfCnpj} onChange={(e) => set('cpfCnpj', formatCPF(e.target.value))} placeholder="000.000.000-00" />
                </div>
                <div>
                  <label style={lbl}>Telefone</label>
                  <input style={inp} value={form.phone} onChange={(e) => set('phone', formatPhone(e.target.value))} placeholder="(48) 99999-9999" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={lbl}>CEP</label>
                  <input style={inp} value={form.postalCode} onChange={(e) => set('postalCode', formatCEP(e.target.value))} placeholder="00000-000" />
                </div>
                <div>
                  <label style={lbl}>Número</label>
                  <input style={inp} value={form.addressNumber} onChange={(e) => set('addressNumber', e.target.value)} placeholder="123" />
                </div>
              </div>
            </div>
            <button
              style={btn(!!form.name && !!form.email && !!form.cpfCnpj && !!form.phone && !!form.postalCode && !!form.addressNumber)}
              disabled={!form.name || !form.email || !form.cpfCnpj || !form.phone || !form.postalCode || !form.addressNumber}
              onClick={() => setStep('card')}
            >
              Continuar <i className="fas fa-arrow-right" style={{ marginLeft: '8px' }}></i>
            </button>
          </>
        )}

        {/* Step 2: Cartão */}
        {step === 'card' && (
          <>
            <div style={{ display: 'grid', gap: '14px' }}>
              <div>
                <label style={lbl}>Nome no cartão</label>
                <input style={inp} value={form.holderName} onChange={(e) => set('holderName', e.target.value.toUpperCase())} placeholder="JOAO SILVA" />
              </div>
              <div>
                <label style={lbl}>Número do cartão</label>
                <input style={inp} value={form.cardNumber} onChange={(e) => set('cardNumber', formatCard(e.target.value))} placeholder="0000 0000 0000 0000" maxLength={19} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={lbl}>Validade</label>
                  <input style={inp} value={form.expiry} onChange={(e) => set('expiry', formatExpiry(e.target.value))} placeholder="MM/AA" maxLength={5} />
                </div>
                <div>
                  <label style={lbl}>CVV</label>
                  <input style={inp} value={form.ccv} onChange={(e) => set('ccv', e.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="123" maxLength={4} />
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button onClick={() => setStep('personal')} style={backBtn}>
                <i className="fas fa-arrow-left"></i>
              </button>
              <button
                style={{ ...btn(!!form.holderName && !!form.cardNumber && !!form.expiry && !!form.ccv), flex: 1 }}
                disabled={!form.holderName || !form.cardNumber || !form.expiry || !form.ccv}
                onClick={handleSubmit}
              >
                Assinar por {price}
              </button>
            </div>
            <p style={{ textAlign: 'center', fontSize: '12px', color: '#999', marginTop: '14px' }}>
              <i className="fas fa-lock" style={{ marginRight: '4px' }}></i>
              Dados criptografados e processados com segurança
            </p>
          </>
        )}

        {/* Processing */}
        {step === 'processing' && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ fontSize: '36px', marginBottom: '16px' }}>
              <i className="fas fa-circle-notch fa-spin" style={{ color: '#111' }}></i>
            </div>
            <p style={{ color: '#444', fontSize: '16px', fontWeight: 500 }}>Processando pagamento...</p>
            <p style={{ color: '#999', fontSize: '14px', marginTop: '8px' }}>Isso pode levar alguns segundos.</p>
          </div>
        )}

        {/* Success */}
        {step === 'success' && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: '#f0fdf4', display: 'flex', alignItems: 'center',
              justifyContent: 'center', margin: '0 auto 20px',
            }}>
              <i className="fas fa-check" style={{ fontSize: '28px', color: '#16a34a' }}></i>
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#111', marginBottom: '8px' }}>
              Pagamento confirmado!
            </h3>
            <p style={{ color: '#666', fontSize: '15px', lineHeight: 1.6 }}>
              Enviamos um email para <strong>{form.email}</strong> com o link de acesso à sua conta.
            </p>
            <p style={{ color: '#999', fontSize: '13px', marginTop: '12px' }}>
              Verifique sua caixa de entrada e spam.
            </p>
            <button onClick={onClose} style={{ ...btn(true), marginTop: '24px' }}>
              Fechar
            </button>
          </div>
        )}

        {/* Error */}
        {step === 'error' && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: '#fef2f2', display: 'flex', alignItems: 'center',
              justifyContent: 'center', margin: '0 auto 20px',
            }}>
              <i className="fas fa-exclamation-triangle" style={{ fontSize: '28px', color: '#dc2626' }}></i>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111', marginBottom: '8px' }}>
              Falha no pagamento
            </h3>
            <p style={{ color: '#666', fontSize: '14px', lineHeight: 1.6 }}>{error}</p>
            <button onClick={() => setStep('card')} style={{ ...btn(true), marginTop: '24px' }}>
              Tentar novamente
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const lbl: React.CSSProperties = {
  display: 'block', fontSize: '13px', fontWeight: 600,
  color: '#444', marginBottom: '6px',
};

const inp: React.CSSProperties = {
  width: '100%', padding: '11px 13px', borderRadius: '10px',
  border: '1.5px solid #E5E7EB', fontSize: '15px', color: '#111',
  outline: 'none', boxSizing: 'border-box', fontFamily: 'Inter, sans-serif',
};

const btn = (enabled: boolean): React.CSSProperties => ({
  width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
  background: enabled ? '#111' : '#E5E7EB', color: enabled ? 'white' : '#999',
  fontSize: '15px', fontWeight: 600, cursor: enabled ? 'pointer' : 'not-allowed',
  marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
  transition: 'all 0.2s',
});

const backBtn: React.CSSProperties = {
  padding: '14px 18px', borderRadius: '12px', border: '1.5px solid #E5E7EB',
  background: 'white', color: '#444', fontSize: '15px', cursor: 'pointer',
  marginTop: '20px',
};
