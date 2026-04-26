import { useState, useEffect } from 'react';
import type { Asset } from '../../types/supabase';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { useToast } from '../Toast';

export default function AutomationsSection() {
  const { client } = useAuth();
  const { show } = useToast();
  const [automations, setAutomations] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAutomations();
  }, [client]);

  const fetchAutomations = async () => {
    if (!client?.id) return;

    try {
      const { data, error } = await supabase
        .from('assets')
        .select('*')
        .eq('client_id', client.id)
        .eq('type', 'automation');

      if (error) throw error;
      setAutomations(data || []);
    } catch (err) {
      show('Erro ao carregar automações', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

    try {
      const { error } = await supabase
        .from('assets')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      setAutomations((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
      );
      show(`Automação ${newStatus === 'active' ? 'ativada' : 'desativada'}`, 'success');
    } catch (err) {
      show('Erro ao atualizar automação', 'error');
    }
  };

  return (
    <div style={{ padding: '40px' }}>
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ margin: '0 0 8px 0', fontSize: '32px', fontWeight: 800 }}>
          ⚙️ Automações
        </h1>
        <p style={{ margin: 0, fontSize: '16px', color: '#666' }}>
          Crie fluxos automáticos para gerenciar seus domínios, e-mails e sites
        </p>
      </div>

      {/* Empty State or List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <p style={{ color: '#666' }}>Carregando automações...</p>
        </div>
      ) : automations.length === 0 ? (
        <div style={{
          background: '#f9f9f9',
          border: '2px dashed #E5E7EB',
          borderRadius: '12px',
          padding: '60px 40px',
          textAlign: 'center',
        }}>
          <p style={{ fontSize: '18px', fontWeight: 600, color: '#333', margin: '0 0 8px 0' }}>
            Nenhuma automação criada ainda
          </p>
          <p style={{ fontSize: '14px', color: '#666', margin: '0 0 24px 0' }}>
            Crie sua primeira automação para economizar tempo e aumentar produtividade
          </p>
          <button style={{
            padding: '12px 24px',
            background: '#111',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '14px',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#333')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#111')}
          >
            + Criar Automação
          </button>
        </div>
      ) : (
        <div>
          {automations.map((automation) => (
            <div
              key={automation.id}
              style={{
                background: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 600 }}>
                  {automation.name || 'Sem nome'}
                </h3>
                <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
                  Criada em {new Date(automation.created_at).toLocaleDateString('pt-BR')}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{
                  padding: '4px 10px',
                  background: automation.status === 'active' ? '#DCFCE7' : '#FEE2E2',
                  color: automation.status === 'active' ? '#166534' : '#991B1B',
                  fontSize: '12px',
                  fontWeight: 600,
                  borderRadius: '6px',
                }}>
                  {automation.status === 'active' ? '✓ Ativa' : '✕ Inativa'}
                </span>

                <button
                  onClick={() => handleToggleStatus(automation.id, automation.status)}
                  style={{
                    padding: '8px 12px',
                    background: '#f3f4f6',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#111',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#e5e7eb')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#f3f4f6')}
                >
                  {automation.status === 'active' ? 'Desativar' : 'Ativar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
