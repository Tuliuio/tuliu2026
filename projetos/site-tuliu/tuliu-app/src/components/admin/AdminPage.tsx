import { useState, useEffect } from 'react';
import type { Client, Asset, AssetType } from '../../types/supabase';
import { supabase } from '../../lib/supabase';
import { useToast } from '../Toast';
import ClientDetail from './ClientDetail';

const ASSET_TYPES: { value: AssetType; label: string }[] = [
  { value: 'domain', label: 'Domínio' },
  { value: 'subdomain', label: 'Subdomínio' },
  { value: 'website', label: 'Website' },
  { value: 'webapp', label: 'Web App' },
  { value: 'email', label: 'E-mail' },
  { value: 'automation', label: 'Automação' },
  { value: 'agent', label: 'Agente IA' },
];

export default function AdminPage() {
  const { show } = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [isCreateClientOpen, setIsCreateClientOpen] = useState(false);
  const [isCreateAssetOpen, setIsCreateAssetOpen] = useState(false);
  const [loading, setLoading] = useState(true);
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

  if (loading) {
    return (
      <div style={{ padding: '40px' }}>
        <p>Carregando clientes...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '32px', fontWeight: 800 }}>
            Painel Admin
          </h1>
          <p style={{ margin: 0, fontSize: '16px', color: '#666' }}>
            Gerencie clientes e sua infraestrutura digital.
          </p>
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

      <div style={{ display: 'grid', gridTemplateColumns: selectedClient ? '1fr 1fr' : '1fr', gap: '40px' }}>
        {/* Lista de clientes */}
        <div>
          <h2 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: 600 }}>Clientes ({clients.length})</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {clients.map((client) => (
              <div
                key={client.id}
                onClick={() => setSelectedClientId(client.id)}
                style={{
                  padding: '16px',
                  border: selectedClientId === client.id ? '2px solid #111' : '1px solid #ebebeb',
                  borderRadius: '12px',
                  background: selectedClientId === client.id ? '#fafafa' : '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  if (selectedClientId !== client.id) {
                    e.currentTarget.style.borderColor = '#d1d5db';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedClientId !== client.id) {
                    e.currentTarget.style.borderColor = '#ebebeb';
                  }
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 600 }}>
                      {client.company}
                    </h3>
                    <p style={{ margin: 0, fontSize: '12px', color: '#999' }}>
                      {client.name}
                    </p>
                  </div>
                </div>
                <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e5e7eb', fontSize: '12px', color: '#666' }}>
                  <p style={{ margin: '2px 0' }}>📧 {client.email}</p>
                  <p style={{ margin: '2px 0' }}>💳 {client.plan?.name || 'N/A'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detalhe do cliente selecionado */}
        {selectedClient && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Detalhes & Ativos</h2>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setIsCreateAssetOpen(true)}
                  style={{
                    padding: '8px 16px',
                    background: '#111',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#333')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#111')}
                >
                  + Ativo
                </button>
                <button
                  onClick={() => setSelectedClientId(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '20px',
                    color: '#999',
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
            <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              <ClientDetail client={selectedClient} assets={assets} />
            </div>
          </div>
        )}
      </div>

      {/* Create Asset Modal */}
      {isCreateAssetOpen && selectedClient && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '40px', maxWidth: '400px', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>
              Novo Ativo para {selectedClient.company}
            </h2>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '24px' }}>
              Cadastre um novo ativo digital
            </p>

            <form onSubmit={handleCreateAsset}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#666', marginBottom: '6px' }}>
                  Tipo
                </label>
                <select
                  value={assetFormData.type}
                  onChange={(e) => setAssetFormData({ ...assetFormData, type: e.target.value as AssetType })}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '14px', fontFamily: 'Inter' }}
                >
                  {ASSET_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#666', marginBottom: '6px' }}>
                  Nome
                </label>
                <input
                  type="text"
                  value={assetFormData.name}
                  onChange={(e) => setAssetFormData({ ...assetFormData, name: e.target.value })}
                  required
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '14px', fontFamily: 'Inter' }}
                  placeholder="exemplo.com"
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#666', marginBottom: '6px' }}>
                  URL (opcional)
                </label>
                <input
                  type="url"
                  value={assetFormData.url}
                  onChange={(e) => setAssetFormData({ ...assetFormData, url: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '14px', fontFamily: 'Inter' }}
                  placeholder="https://exemplo.com"
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#666', marginBottom: '6px' }}>
                  Descrição (opcional)
                </label>
                <textarea
                  value={assetFormData.description}
                  onChange={(e) => setAssetFormData({ ...assetFormData, description: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '14px', fontFamily: 'Inter', resize: 'vertical' }}
                  placeholder="Descrição do ativo"
                  rows={3}
                />
              </div>

              {error && (
                <div style={{ padding: '12px', background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: '8px', marginBottom: '16px', fontSize: '13px', color: '#991B1B' }}>
                  {error}
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#111111',
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
                  Criar Ativo
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsCreateAssetOpen(false);
                    setAssetFormData({ type: 'domain', name: '', url: '', description: '', status: 'active' });
                    setError('');
                  }}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#f3f4f6',
                    color: '#111',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>

            <button
              onClick={() => setIsCreateAssetOpen(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
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
        </div>
      )}

      {/* Create Client Modal */}
      {isCreateClientOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '40px', maxWidth: '400px', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px', color: '#1A1A1A' }}>
              Novo Cliente
            </h2>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '24px' }}>
              Crie uma nova conta para um cliente
            </p>

            <form onSubmit={handleCreateClient}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#666', marginBottom: '6px' }}>
                  Nome
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '14px', fontFamily: 'Inter' }}
                  placeholder="João Silva"
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#666', marginBottom: '6px' }}>
                  Empresa
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  required
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '14px', fontFamily: 'Inter' }}
                  placeholder="Empresa LTDA"
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#666', marginBottom: '6px' }}>
                  E-mail
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '14px', fontFamily: 'Inter' }}
                  placeholder="cliente@empresa.com"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#666', marginBottom: '6px' }}>
                  Senha
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '14px', fontFamily: 'Inter' }}
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <div style={{ padding: '12px', background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: '8px', marginBottom: '16px', fontSize: '13px', color: '#991B1B' }}>
                  {error}
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#111111',
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
                  Criar Cliente
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsCreateClientOpen(false);
                    setFormData({ name: '', company: '', email: '', password: '' });
                    setError('');
                  }}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#f3f4f6',
                    color: '#111',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>

            <button
              onClick={() => setIsCreateClientOpen(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
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
        </div>
      )}
    </div>
  );
}
