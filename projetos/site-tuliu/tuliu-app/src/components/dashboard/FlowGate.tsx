export default function FlowGate() {
  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        background: '#1a1a1a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: '500px' }}>
        {/* Icon */}
        <div
          style={{
            fontSize: '64px',
            color: 'rgba(255, 255, 255, 0.3)',
            marginBottom: '24px',
            opacity: 0.8,
          }}
        >
          <i className="fas fa-lock"></i>
        </div>

        {/* Title */}
        <h1
          style={{
            margin: '0 0 12px 0',
            fontSize: '32px',
            fontWeight: 800,
            color: 'rgba(255, 255, 255, 0.87)',
            letterSpacing: '-1px',
          }}
        >
          Flow é um recurso Enterprise
        </h1>

        {/* Description */}
        <p
          style={{
            margin: '0 0 32px 0',
            fontSize: '16px',
            color: 'rgba(255, 255, 255, 0.45)',
            lineHeight: 1.6,
          }}
        >
          Acesse ferramentas avançadas de gestão de projetos com kanban colaborativo, drag-and-drop intuitivo e controle total do progresso de tarefas.
        </p>

        {/* Features List */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '32px',
            textAlign: 'left',
          }}
        >
          {[
            { icon: 'fa-columns', text: 'Kanban visual com 8 estágios' },
            { icon: 'fa-hand-pointer', text: 'Arraste cards entre colunas' },
            { icon: 'fa-check-circle', text: 'Aprovação e feedback em tempo real' },
            { icon: 'fa-shield-alt', text: 'Acesso exclusivo para enterprise' },
          ].map((feature, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: idx < 3 ? '16px' : 0,
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px',
              }}
            >
              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.4)',
                  fontSize: '16px',
                  flex: '0 0 24px',
                }}
              >
                <i className={`fas ${feature.icon}`}></i>
              </div>
              {feature.text}
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
          <button
            style={{
              width: '100%',
              padding: '14px 24px',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.1) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            <i className="fas fa-rocket" style={{ marginRight: '8px' }}></i>
            Fazer upgrade para Enterprise
          </button>

          <button
            style={{
              width: '100%',
              padding: '14px 24px',
              background: 'transparent',
              border: '1.5px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '15px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
            }}
          >
            <i className="fas fa-headset" style={{ marginRight: '8px' }}></i>
            Falar com especialista
          </button>
        </div>

        {/* Footer Text */}
        <p
          style={{
            margin: '32px 0 0 0',
            fontSize: '13px',
            color: 'rgba(255, 255, 255, 0.3)',
          }}
        >
          Plano atual: <span style={{ fontWeight: 600, color: 'rgba(255, 255, 255, 0.5)' }}>Starter/Business</span>
        </p>
      </div>
    </div>
  );
}
