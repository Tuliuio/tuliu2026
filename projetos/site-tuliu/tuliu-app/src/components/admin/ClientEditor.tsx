import { useState } from 'react';
import type { Client } from '../../types/supabase';
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
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
        })
        .eq('id', client.id);

      if (updateError) throw updateError;

      onUpdate({
        ...client,
        name: formData.name,
        company: formData.company,
        email: formData.email,
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

          <label style={{ display: 'block', marginBottom: '24px' }}>
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
