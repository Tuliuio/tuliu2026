interface CheckoutRedirectModalProps {
  isOpen: boolean;
  onClose: () => void;
  checkoutUrl: string;
  isAnnual: boolean;
}

export default function CheckoutRedirectModal({ isOpen, onClose, checkoutUrl, isAnnual }: CheckoutRedirectModalProps) {
  if (!isOpen) return null;

  const handleProceed = () => {
    window.open(checkoutUrl, '_blank');
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 9999, padding: '24px',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: 'white', borderRadius: '20px', padding: '40px',
        maxWidth: '440px', width: '100%', position: 'relative',
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
          Checkout seguro
        </h2>

        <p style={{ color: '#666', fontSize: '15px', lineHeight: 1.7, marginBottom: '8px' }}>
          Você será redirecionado para o ambiente de pagamento seguro do <strong>ASAAS</strong>, onde seus dados de cartão são processados com total segurança e conformidade PCI.
        </p>

        {/* Resumo do plano */}
        <div style={{
          background: '#f5f5f7', borderRadius: '12px', padding: '16px',
          margin: '24px 0', textAlign: 'left',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: 0, fontWeight: 600, fontSize: '15px', color: '#111' }}>Plano Starter</p>
              <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#666' }}>Infraestrutura digital completa</p>
            </div>
            <p style={{ margin: 0, fontWeight: 700, fontSize: '18px', color: '#111' }}>
              {isAnnual ? 'R$ 997/ano' : 'R$ 97/mês'}
            </p>
          </div>
        </div>

        {/* Etapas */}
        <div style={{ textAlign: 'left', marginBottom: '28px' }}>
          {[
            { icon: 'fa-credit-card', text: 'Pague com segurança no checkout ASAAS' },
            { icon: 'fa-envelope', text: 'Receba o email de acesso à sua conta' },
            { icon: 'fa-rocket', text: 'Faça o onboarding e comece a usar' },
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

        <button
          onClick={handleProceed}
          style={{
            width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
            background: '#111', color: 'white', fontSize: '15px', fontWeight: 600,
            cursor: 'pointer', display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: '8px',
          }}
        >
          Ir para o checkout
          <i className="fas fa-arrow-up-right-from-square" style={{ fontSize: '13px' }}></i>
        </button>

        <p style={{ margin: '14px 0 0', fontSize: '12px', color: '#aaa' }}>
          <i className="fas fa-shield-halved" style={{ marginRight: '4px' }}></i>
          Dados protegidos · Certificado SSL · PCI Compliant
        </p>
      </div>
    </div>
  );
}
