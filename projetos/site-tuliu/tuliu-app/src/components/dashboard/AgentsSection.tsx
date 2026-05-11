import { useState, useEffect } from 'react';
import type { Asset } from '../../types/supabase';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { useToast } from '../Toast';

export default function AgentsSection() {
  const { client } = useAuth();
  const { show } = useToast();
  const [agents, setAgents] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgents();
  }, [client]);

  const fetchAgents = async () => {
    if (!client?.id) return;

    try {
      const { data, error } = await supabase
        .from('assets')
        .select('*')
        .eq('client_id', client.id)
        .eq('type', 'agent');

      if (error) throw error;
      setAgents(data || []);
    } catch (err) {
      show('Erro ao carregar agentes', 'error');
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

      setAgents((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
      );
      show(`Agente ${newStatus === 'active' ? 'ativado' : 'desativado'}`, 'success');
    } catch (err) {
      show('Erro ao atualizar agente', 'error');
    }
  };

  return (
    <div style={{ padding: '40px' }}>
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ margin: '0 0 8px 0', fontSize: '32px', fontWeight: 800 }}>
          🤖 Agentes de IA
        </h1>
        <p style={{ margin: 0, fontSize: '16px', color: '#666' }}>
          Implante agentes inteligentes para atender clientes, responder perguntas e automatizar processos
        </p>
      </div>

      {/* Empty State or List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <p style={{ color: '#666' }}>Carregando agentes...</p>
        </div>
      ) : agents.length === 0 ? (
        <div style={{
          background: '#f9f9f9',
          border: '1px dashed #d4d4d4',
          borderRadius: '12px',
          padding: '48px 40px',
          textAlign: 'center',
        }}>
          <i className="fas fa-robot" style={{ fontSize: '28px', color: '#ccc', marginBottom: '12px', display: 'block' }}></i>
          <p style={{ fontSize: '15px', fontWeight: 600, color: '#666', margin: '0 0 4px 0' }}>
            Nenhum agente de IA configurado ainda
          </p>
          <p style={{ fontSize: '13px', color: '#999', margin: '0 0 20px 0' }}>
            Entre em contato com a equipe Tuliu para solicitar a configuração.
          </p>
          <button style={{
            padding: '10px 24px',
            background: '#111',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '13px',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#333')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#111')}
          >
            <i className="fas fa-paper-plane" style={{ marginRight: '8px' }}></i>
            Solicitar configuração
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {agents.map((agent) => (
            <div
              key={agent.id}
              style={{
                background: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '12px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 700 }}>
                  {agent.name || 'Agente sem nome'}
                </h3>
                <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
                  {agent.description || 'Sem descrição'}
                </p>
              </div>

              <div style={{
                padding: '12px',
                background: '#f9f9f9',
                borderRadius: '8px',
                marginBottom: '16px',
                fontSize: '12px',
                color: '#666',
              }}>
                <p style={{ margin: '0 0 4px 0' }}>
                  <strong>Tipo:</strong> Assistente
                </p>
                <p style={{ margin: '0 0 4px 0' }}>
                  <strong>Criado:</strong> {new Date(agent.created_at).toLocaleDateString('pt-BR')}
                </p>
                <p style={{ margin: 0 }}>
                  <strong>Status:</strong>{' '}
                  <span style={{
                    color: agent.status === 'active' ? '#10B981' : '#EF4444',
                    fontWeight: 600,
                  }}>
                    {agent.status === 'active' ? '● Ativo' : '● Inativo'}
                  </span>
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                <button style={{
                  flex: 1,
                  padding: '10px 12px',
                  background: '#f3f4f6',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#111',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#e5e7eb')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#f3f4f6')}
                >
                  Editar
                </button>

                <button
                  onClick={() => handleToggleStatus(agent.id, agent.status)}
                  style={{
                    flex: 1,
                    padding: '10px 12px',
                    background: agent.status === 'active' ? '#FEE2E2' : '#DCFCE7',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: agent.status === 'active' ? '#991B1B' : '#166534',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                >
                  {agent.status === 'active' ? 'Desativar' : 'Ativar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
