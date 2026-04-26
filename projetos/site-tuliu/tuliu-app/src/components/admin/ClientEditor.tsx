import { useState, useEffect } from 'react';
import type { Client, Plan } from '../../types/supabase';
import { supabase } from '../../lib/supabase';

interface ClientEditorProps {
  client: Client;
  onClose: () => void;
  onUpdate: (client: Client) => void;
}

export default function ClientEditor({ client, onClose, onUpdate }: ClientEditorProps) {
  const [formData, setFormData] = useState({
    name: client.name,
    company: client.company,
    email: client.email,
    plan_id: client.plan_id,
  });
  const [plans, setPlans] = useState<Plan[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch available plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const { data, error: err } = await supabase.from('plans').select('*');
        if (err) throw err;
        setPlans((data || []) as Plan[]);
      } catch (err) {
        console.error('Erro ao carregar planos:', err);
      }
    };

    fetchPlans();
  }, []);

  const selectedPlan = plans.find((p) => p.id === formData.plan_id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: updateError } = await supabase
        .from('clients')
        .update({
          name: formData.name,
          company: formData.company,
          email: formData.email,
          plan_id: formData.plan_id,
        })
        .eq('id', client.id);

      if (updateError) throw updateError;

      onUpdate({
        ...client,
        name: formData.name,
        company: formData.company,
        email: formData.email,
        plan_id: formData.plan_id,
        plan: selectedPlan,
      });
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar cliente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '12px',
          padding: '32px',
          maxWidth: '500px',
          width: '100%',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ margin: '0 0 24px 0', fontSize: '24px', fontWeight: 700 }}>Editar Cliente</h2>

        <form onSubmit={handleSubmit}>
          {error && <p style={{ color: '#ef4444', marginBottom: '16px' }}>{error}</p>}

          <label style={{ display: 'block', marginBottom: '16px' }}>
            <span style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#666', marginBottom: '6px' }}>Nome</span>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                boxSizing: 'border-box',
                fontSize: '14px',
              }}
            />
          </label>

          <label style={{ display: 'block', marginBottom: '16px' }}>
            <span style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#666', marginBottom: '6px' }}>Empresa</span>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                boxSizing: 'border-box',
                fontSize: '14px',
              }}
            />
          </label>

          <label style={{ display: 'block', marginBottom: '16px' }}>
            <span style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#666', marginBottom: '6px' }}>Email</span>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                boxSizing: 'border-box',
                fontSize: '14px',
              }}
            />
          </label>

          <label style={{ display: 'block', marginBottom: '24px' }}>
            <span style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#666', marginBottom: '6px' }}>Plano</span>
            <select
              value={formData.plan_id}
              onChange={(e) => setFormData({ ...formData, plan_id: e.target.value })}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                boxSizing: 'border-box',
                fontSize: '14px',
                background: 'white',
              }}
            >
              <option value="">Selecione um plano</option>
              {plans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name} - R$ {plan.price.toLocaleString('pt-BR')}/{plan.billing === 'monthly' ? 'mês' : 'ano'}
                </option>
              ))}
            </select>
          </label>

          {selectedPlan && (
            <div style={{ marginBottom: '24px', padding: '16px', background: '#f3f4f6', borderRadius: '8px' }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600 }}>Detalhes do Plano</h4>
              <div style={{ fontSize: '13px', color: '#666', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <span style={{ display: 'block', color: '#999', marginBottom: '2px' }}>Plano</span>
                  <span style={{ fontWeight: 600 }}>{selectedPlan.name}</span>
                </div>
                <div>
                  <span style={{ display: 'block', color: '#999', marginBottom: '2px' }}>Faturamento</span>
                  <span style={{ fontWeight: 600 }}>R$ {selectedPlan.price.toLocaleString('pt-BR')}/{selectedPlan.billing === 'monthly' ? 'mês' : 'ano'}</span>
                </div>
                <div>
                  <span style={{ display: 'block', color: '#999', marginBottom: '2px' }}>Domínios</span>
                  <span style={{ fontWeight: 600 }}>{selectedPlan.limits.domains === 'unlimited' ? 'Ilimitado' : selectedPlan.limits.domains}</span>
                </div>
                <div>
                  <span style={{ display: 'block', color: '#999', marginBottom: '2px' }}>Websites</span>
                  <span style={{ fontWeight: 600 }}>{selectedPlan.limits.sites === 'unlimited' ? 'Ilimitado' : selectedPlan.limits.sites}</span>
                </div>
                <div>
                  <span style={{ display: 'block', color: '#999', marginBottom: '2px' }}>E-mails</span>
                  <span style={{ fontWeight: 600 }}>{selectedPlan.limits.emails === 'unlimited' ? 'Ilimitado' : selectedPlan.limits.emails}</span>
                </div>
                <div>
                  <span style={{ display: 'block', color: '#999', marginBottom: '2px' }}>Automações</span>
                  <span style={{ fontWeight: 600 }}>{selectedPlan.limits.automations === 'unlimited' ? 'Ilimitado' : selectedPlan.limits.automations}</span>
                </div>
                <div>
                  <span style={{ display: 'block', color: '#999', marginBottom: '2px' }}>Agentes IA</span>
                  <span style={{ fontWeight: 600 }}>{selectedPlan.limits.agents === 'unlimited' ? 'Ilimitado' : selectedPlan.limits.agents}</span>
                </div>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '12px',
                background: '#f3f4f6',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                padding: '12px',
                background: loading ? '#999' : '#111',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={(e) => {
                if (!loading) (e.currentTarget as HTMLButtonElement).style.background = '#333';
              }}
              onMouseLeave={(e) => {
                if (!loading) (e.currentTarget as HTMLButtonElement).style.background = '#111';
              }}
            >
              {loading ? 'Atualizando...' : 'Atualizar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
