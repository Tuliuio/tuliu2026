import { useState, useEffect } from 'react';
import type { Client, Asset, AssetType } from '../../types/supabase';
import { supabase } from '../../lib/supabase';
import { useToast } from '../Toast';
import ClientDetail from './ClientDetail';
import ClientEditor from './ClientEditor';

const ASSET_TYPES: { value: AssetType; label: string }[] = [
  { value: 'domain', label: 'Domínio' },
  { value: 'subdomain', label: 'Subdomínio' },
  { value: 'website', label: 'Website' },
  { value: 'webapp', label: 'Web App' },
  { value: 'email', label: 'E-mail' },
  { value: 'automation', label: 'Automação' },
  { value: 'agent', label: 'Agente IA' },
];

export default function AdminClientsPage() {
  const { show } = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [isCreateClientOpen, setIsCreateClientOpen] = useState(false);
  const [isEditClientOpen, setIsEditClientOpen] = useState(false);
  const [isCreateAssetOpen, setIsCreateAssetOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({ name: '', company: '', email: '', password: '' });
  const [assetFormData, setAssetFormData] = useState({ type: 'domain' as AssetType, name: '', url: '', description: '', status: 'active' as const });
  const [error, setError] = useState('');

  // Fetch all clients
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const { data, error: err } = await supabase
          .from('clients')
          .select('*, plan:plan_id(*)');

        if (err) throw err;
        setClients((data || []) as Client[]);
      } catch (err) {
        show('Erro ao carregar clientes', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [show]);

  // Fetch assets for selected client
  useEffect(() => {
    const fetchAssets = async () => {
      if (!selectedClientId) {
        setAssets([]);
        return;
      }

      try {
        const { data, error: err } = await supabase
          .from('assets')
          .select('*')
          .eq('client_id', selectedClientId);

        if (err) throw err;
        setAssets(data || []);
      } catch (err) {
        show('Erro ao carregar ativos', 'error');
      }
    };

    fetchAssets();
  }, [selectedClientId, show]);

  const selectedClient = selectedClientId ? clients.find((c) => c.id === selectedClientId) : null;

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.company || !formData.email || !formData.password) {
      setError('Preencha todos os campos');
      return;
    }

    try {
      const { data: authData, error: signupError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            company: formData.company,
          },
        },
      });

      if (signupError) throw signupError;
      if (!authData.user) throw new Error('Falha ao criar usuário');

      await new Promise(resolve => setTimeout(resolve, 1000));

      const { data } = await supabase
        .from('clients')
        .select('*, plan:plan_id(*)');

      setClients((data || []) as Client[]);
      setIsCreateClientOpen(false);
      setFormData({ name: '', company: '', email: '', password: '' });
      show('Cliente criado com sucesso!', 'success');
    } catch (err: any) {
      setError(err.message || 'Erro ao criar cliente');
      show(err.message || 'Erro ao criar cliente', 'error');
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    if (!confirm('Tem certeza? Esta ação não pode ser desfeita.')) return;

    try {
      // Delete assets first
      await supabase.from('assets').delete().eq('client_id', clientId);

      // Delete client
      const { error } = await supabase.from('clients').delete().eq('id', clientId);
      if (error) throw error;

      setClients((prev) => prev.filter((c) => c.id !== clientId));
      setSelectedClientId(null);
      show('Cliente deletado com sucesso!', 'success');
    } catch (err: any) {
      show(err.message || 'Erro ao deletar cliente', 'error');
    }
  };

  const handleCreateAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!assetFormData.name || !selectedClientId) {
      setError('Preencha os campos obrigatórios');
      return;
    }

    try {
      const { error: insertError } = await supabase
        .from('assets')
        .insert([
          {
            client_id: selectedClientId,
            type: assetFormData.type,
            name: assetFormData.name,
            url: assetFormData.url || null,
            description: assetFormData.description || null,
            status: assetFormData.status,
          },
        ]);

      if (insertError) throw insertError;

      // Refresh assets
      const { data } = await supabase
        .from('assets')
        .select('*')
        .eq('client_id', selectedClientId);

      setAssets(data || []);
      setIsCreateAssetOpen(false);
      setAssetFormData({ type: 'domain', name: '', url: '', description: '', status: 'active' });
      show('Ativo criado com sucesso!', 'success');
    } catch (err: any) {
      setError(err.message || 'Erro ao criar ativo');
      show(err.message || 'Erro ao criar ativo', 'error');
    }
  };

  const handleDeleteAsset = async (assetId: string) => {
    if (!confirm('Tem certeza que deseja remover este ativo?')) return;

    try {
      const { error: deleteError } = await supabase
        .from('assets')
        .delete()
        .eq('id', assetId);

      if (deleteError) throw deleteError;

      setAssets((prev) => prev.filter((a) => a.id !== assetId));
      show('Ativo removido com sucesso!', 'success');
    } catch (err: any) {
      show(err.message || 'Erro ao remover ativo', 'error');
    }
  };

  // Filter clients by search
  const filteredClients = clients.filter((client) =>
    client.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <p>Carregando clientes...</p>;
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ margin: '0 0 8px 0', fontSize: '32px', fontWeight: 800 }}>Clientes</h1>
            <p style={{ margin: 0, fontSize: '16px', color: '#666' }}>Gerencie todos os clientes e seus ativos</p>
          </div>
          <button
            onClick={() => setIsCreateClientOpen(true)}
            style={{
              padding: '12px 24px',
              background: '#111',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#333')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#111')}
          >
            ➕ Novo cliente
          </button>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Buscar por empresa, nome ou email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px',
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
            fontSize: '14px',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Clients Table */}
      <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '14px',
          }}
        >
          <thead>
            <tr style={{ background: '#f9f9f9', borderBottom: '1px solid #E5E7EB' }}>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: '#666' }}>Empresa</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: '#666' }}>Contato</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: '#666' }}>Plano</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, color: '#666' }}>Ativos</th>
              <th style={{ padding: '16px', textAlign: 'center', fontWeight: 600, color: '#666' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                  Nenhum cliente encontrado
                </td>
              </tr>
            ) : (
              filteredClients.map((client, idx) => {
                const clientAssets = assets.filter((a) => a.client_id === client.id);
                const activeAssets = clientAssets.filter((a) => a.status === 'active').length;
                return (
                  <tr
                    key={client.id}
                    style={{
                      borderBottom: idx < filteredClients.length - 1 ? '1px solid #E5E7EB' : 'none',
                      background: selectedClientId === client.id ? '#f3f4f6' : 'white',
                    }}
                  >
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontWeight: 500, marginBottom: '4px' }}>{client.company}</div>
                      <div style={{ fontSize: '12px', color: '#999' }}>{client.name}</div>
                    </td>
                    <td style={{ padding: '16px', fontSize: '13px', color: '#666' }}>{client.email}</td>
                    <td style={{ padding: '16px' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '4px 10px',
                          background: client.plan?.tier === 'starter' ? '#f3f3f3' : client.plan?.tier === 'business' ? '#111111' : '#6366f1',
                          color: client.plan?.tier === 'starter' ? '#666' : 'white',
                          borderRadius: '100px',
                          fontSize: '12px',
                          fontWeight: 600,
                        }}
                      >
                        {client.plan?.name || 'N/A'}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ color: '#666' }}>
                        {activeAssets}/{assets.filter((a) => a.client_id === client.id).length}
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <button
                        onClick={() => {
                          setSelectedClientId(client.id);
                          setIsDetailOpen(true);
                        }}
                        style={{
                          padding: '6px 12px',
                          background: '#f3f4f6',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 500,
                          cursor: 'pointer',
                          marginRight: '8px',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#e5e7eb')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = '#f3f4f6')}
                      >
                        Ver
                      </button>
                      <button
                        onClick={() => {
                          setSelectedClientId(client.id);
                          setIsEditClientOpen(true);
                        }}
                        style={{
                          padding: '6px 12px',
                          background: '#f3f4f6',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 500,
                          cursor: 'pointer',
                          marginRight: '8px',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#e5e7eb')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = '#f3f4f6')}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteClient(client.id)}
                        style={{
                          padding: '6px 12px',
                          background: '#fee2e2',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 500,
                          color: '#991B1B',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#fecaca')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = '#fee2e2')}
                      >
                        Deletar
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {isDetailOpen && selectedClient && (
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
          onClick={() => setIsDetailOpen(false)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '12px',
              padding: '32px',
              maxWidth: '600px',
              maxHeight: '80vh',
              overflowY: 'auto',
              width: '100%',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 700 }}>Detalhes do Cliente</h2>
              <button
                onClick={() => setIsDetailOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#999',
                }}
              >
                ✕
              </button>
            </div>

            <ClientDetail client={selectedClient} assets={assets} />

            {/* Add Asset Button */}
            <button
              onClick={() => setIsCreateAssetOpen(true)}
              style={{
                marginTop: '24px',
                padding: '12px 24px',
                background: '#111',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                width: '100%',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#333')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#111')}
            >
              ➕ Adicionar Ativo
            </button>
          </div>
        </div>
      )}

      {/* Create Client Modal */}
      {isCreateClientOpen && (
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
          onClick={() => setIsCreateClientOpen(false)}
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
            <h2 style={{ margin: '0 0 24px 0', fontSize: '24px', fontWeight: 700 }}>Novo Cliente</h2>

            <form onSubmit={handleCreateClient}>
              {error && <p style={{ color: '#ef4444', marginBottom: '16px' }}>{error}</p>}

              <input
                type="text"
                placeholder="Nome"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  marginBottom: '12px',
                  boxSizing: 'border-box',
                  fontSize: '14px',
                }}
              />

              <input
                type="text"
                placeholder="Empresa"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  marginBottom: '12px',
                  boxSizing: 'border-box',
                  fontSize: '14px',
                }}
              />

              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  marginBottom: '12px',
                  boxSizing: 'border-box',
                  fontSize: '14px',
                }}
              />

              <input
                type="password"
                placeholder="Senha"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  marginBottom: '24px',
                  boxSizing: 'border-box',
                  fontSize: '14px',
                }}
              />

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setIsCreateClientOpen(false)}
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
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#111',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#333')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#111')}
                >
                  Criar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Asset Modal */}
      {isCreateAssetOpen && (
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
          onClick={() => setIsCreateAssetOpen(false)}
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
            <h2 style={{ margin: '0 0 24px 0', fontSize: '24px', fontWeight: 700 }}>Novo Ativo</h2>

            <form onSubmit={handleCreateAsset}>
              {error && <p style={{ color: '#ef4444', marginBottom: '16px' }}>{error}</p>}

              <select
                value={assetFormData.type}
                onChange={(e) => setAssetFormData({ ...assetFormData, type: e.target.value as AssetType })}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  marginBottom: '12px',
                  boxSizing: 'border-box',
                  fontSize: '14px',
                }}
              >
                {ASSET_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Nome do ativo"
                value={assetFormData.name}
                onChange={(e) => setAssetFormData({ ...assetFormData, name: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  marginBottom: '12px',
                  boxSizing: 'border-box',
                  fontSize: '14px',
                }}
              />

              <input
                type="url"
                placeholder="URL (opcional)"
                value={assetFormData.url}
                onChange={(e) => setAssetFormData({ ...assetFormData, url: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  marginBottom: '12px',
                  boxSizing: 'border-box',
                  fontSize: '14px',
                }}
              />

              <textarea
                placeholder="Descrição (opcional)"
                value={assetFormData.description}
                onChange={(e) => setAssetFormData({ ...assetFormData, description: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  marginBottom: '24px',
                  boxSizing: 'border-box',
                  fontSize: '14px',
                  minHeight: '80px',
                  fontFamily: 'inherit',
                }}
              />

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setIsCreateAssetOpen(false)}
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
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#111',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#333')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#111')}
                >
                  Criar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Client Modal */}
      {isEditClientOpen && selectedClient && (
        <ClientEditor
          client={selectedClient}
          onClose={() => setIsEditClientOpen(false)}
          onUpdate={(updatedClient) => {
            setClients((prev) =>
              prev.map((c) => (c.id === updatedClient.id ? updatedClient : c))
            );
            setSelectedClientId(updatedClient.id);
            setIsEditClientOpen(false);
            show('Cliente atualizado com sucesso!', 'success');
          }}
        />
      )}
    </div>
  );
}
