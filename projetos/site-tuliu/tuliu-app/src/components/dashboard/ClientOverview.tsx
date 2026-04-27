import { useAuth } from '../../context/AuthContext';

export default function ClientOverview() {
  const { client } = useAuth();

  if (!client?.plan) return null;

  const limits = client.plan.limits;
  const domains = 0; // TODO: fetch from database
  const sites = 0;
  const emails = 0;
  const automations = 0;
  const agents = 0;

  const getUsagePercent = (current: number, limit: string | number) => {
    if (limit === 'unlimited') return 0;
    return Math.round((current / (limit as number)) * 100);
  };

  const UsageBar = ({ label, current, limit, icon }: any) => {
    const isUnlimited = limit === 'unlimited';
    const percent = isUnlimited ? 0 : getUsagePercent(current, limit);

    return (
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#333' }}>
            {icon} {label}
          </span>
          <span style={{ fontSize: '12px', color: '#666' }}>
            {current} {isUnlimited ? '/ ∞' : `/ ${limit}`}
          </span>
        </div>
        {!isUnlimited && (
          <div style={{ height: '4px', background: '#E5E7EB', borderRadius: '2px', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                background: percent > 80 ? '#EF4444' : percent > 50 ? '#F59E0B' : '#10B981',
                width: `${percent}%`,
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{
      background: 'white',
      border: '1px solid #E5E7EB',
      borderRadius: '12px',
      padding: '24px',
      marginBottom: '40px',
    }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 700 }}>
          Seu Plano: <span style={{ color: '#111' }}>{client.plan.name}</span>
        </h2>
        <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>
          Você está usando {Object.values([domains, sites, emails, automations, agents]).filter(Boolean).length} dos {Object.values(limits).filter(l => typeof l === 'number').length} recursos disponíveis
        </p>
      </div>

      {/* Usage Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px',
      }}>
        {/* Domínios */}
        <div>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: 600 }}>Infraestrutura</h3>
          <UsageBar label="Domínios" current={domains} limit={limits.domains} icon="🌐" />
          <UsageBar label="Sites/Apps" current={sites} limit={limits.sites} icon="💻" />
        </div>

        {/* Comunicação */}
        <div>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: 600 }}>Comunicação</h3>
          <UsageBar label="E-mails" current={emails} limit={limits.emails} icon="📧" />
        </div>

        {/* Automação */}
        {(limits.automations === 'unlimited' || limits.automations > 0) && (
          <div>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: 600 }}>Automação & IA</h3>
            <UsageBar label="Automações" current={automations} limit={limits.automations} icon="⚙️" />
            <UsageBar label="Agentes IA" current={agents} limit={limits.agents} icon="🤖" />
          </div>
        )}
      </div>

      {/* Plan Details */}
      <div style={{
        marginTop: '24px',
        paddingTop: '24px',
        borderTop: '1px solid #E5E7EB',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '16px',
      }}>
        <div>
          <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>
            Status
          </p>
          <p style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', background: '#10B981', borderRadius: '50%', marginRight: '6px' }}></span>
            Ativo
          </p>
        </div>

        <div>
          <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>
            Suporte
          </p>
          <p style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>
            E-mail
          </p>
        </div>

        <div>
          <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>
            Preço
          </p>
          <p style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>
            R$ {(client.plan.price / 100).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
        <button style={{
          flex: 1,
          padding: '12px 16px',
          background: '#f3f4f6',
          color: '#111',
          border: 'none',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'background 0.2s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = '#e5e7eb')}
        onMouseLeave={(e) => (e.currentTarget.style.background = '#f3f4f6')}
        >
          Visualizar Invoices
        </button>
        <button style={{
          flex: 1,
          padding: '12px 16px',
          background: '#111',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'background 0.2s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = '#333')}
        onMouseLeave={(e) => (e.currentTarget.style.background = '#111')}
        >
          Fazer upgrade
        </button>
      </div>
    </div>
  );
}
