import { useState } from 'react';
import { mockClients } from '../../data/dashboard';
import ClientCard from './ClientCard';
import ClientDetail from './ClientDetail';

export default function AdminPage() {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  const selectedClient = selectedClientId ? mockClients.find((c) => c.id === selectedClientId) : null;

  return (
    <div className="admin-page" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ margin: '0 0 8px 0', fontSize: '32px', fontWeight: 800 }}>
                Painel Admin
              </h1>
              <p style={{ margin: 0, fontSize: '16px', color: '#666' }}>
                Gerencie clientes e sua infraestrutura digital.
              </p>
            </div>
            <button className="btn btn-primary" style={{ height: 'fit-content' }}>
              <i className="fas fa-plus" style={{ marginRight: '8px' }}></i>
              Novo cliente
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: selectedClient ? '1fr 1fr' : '1fr', gap: '40px' }}>
          {/* Lista de clientes */}
          <div>
            <h2 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: 600 }}>Clientes ({mockClients.length})</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {mockClients.map((client) => (
                <ClientCard
                  key={client.id}
                  client={client}
                  isSelected={selectedClientId === client.id}
                  onSelect={() => setSelectedClientId(client.id)}
                />
              ))}
            </div>
          </div>

          {/* Detalhe do cliente selecionado */}
          {selectedClient && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Detalhes</h2>
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
              <ClientDetail client={selectedClient} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
