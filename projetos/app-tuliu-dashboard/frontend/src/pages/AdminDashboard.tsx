import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import './Dashboard.css'

interface Client {
  id: string
  name: string
  email: string
  created_at: string
}

interface Service {
  id: string
  client_id: string
  type: string
  name: string
  description?: string
  status: string
  expires_at?: string
  url?: string
}

interface Renewal {
  id: string
  service_id: string
  client_id: string
  status: string
  requested_at: string
  services?: { name: string; type: string }
  profiles?: { name: string; email: string }
}

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('clients')
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const getToken = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session) {
        setToken(session.access_token)
      }
    }
    getToken()
  }, [])

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <button onClick={logout} className="btn-logout">
          Sair
        </button>
      </header>

      <div className="dashboard-layout">
        <aside className="sidebar">
          <nav>
            <button
              className={`sidebar-link ${activeTab === 'clients' ? 'active' : ''}`}
              onClick={() => setActiveTab('clients')}
            >
              Clientes
            </button>
            <button
              className={`sidebar-link ${activeTab === 'services' ? 'active' : ''}`}
              onClick={() => setActiveTab('services')}
            >
              Serviços
            </button>
            <button
              className={`sidebar-link ${activeTab === 'renewals' ? 'active' : ''}`}
              onClick={() => setActiveTab('renewals')}
            >
              Renovações
            </button>
          </nav>
        </aside>

        <main className="admin-content">
          {token && (
            <>
              {activeTab === 'clients' && <AdminClientsTab token={token} />}
              {activeTab === 'services' && <AdminServicesTab token={token} />}
              {activeTab === 'renewals' && <AdminRenewalsTab token={token} />}
            </>
          )}
        </main>
      </div>
    </div>
  )
}

function AdminClientsTab({ token }: { token: string }) {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ email: '', name: '', password: '' })
  const [error, setError] = useState('')

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/clients', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setClients(data)
    } catch (err) {
      setError('Erro ao carregar clientes')
    }
    setLoading(false)
  }

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const res = await fetch('http://localhost:3001/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error('Erro ao criar cliente')
      setFormData({ email: '', name: '', password: '' })
      setShowForm(false)
      fetchClients()
    } catch (err) {
      setError('Falha ao criar cliente')
    }
  }

  return (
    <div>
      <div className="tab-header">
        <h2>Clientes</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancelar' : 'Novo Cliente'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreateClient} className="form-card">
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Nome"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="btn-primary">
            Criar Cliente
          </button>
        </form>
      )}

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Data de Criação</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id}>
                <td>{client.name}</td>
                <td>{client.email}</td>
                <td>{new Date(client.created_at).toLocaleDateString('pt-BR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

function AdminServicesTab({ token }: { token: string }) {
  const [services, setServices] = useState<Service[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedClient, setSelectedClient] = useState('')
  const [formData, setFormData] = useState({
    type: 'domain',
    name: '',
    description: '',
    expires_at: '',
    url: '',
  })
  const [error, setError] = useState('')

  useEffect(() => {
    fetchClients()
    fetchServices()
  }, [])

  const fetchClients = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/clients', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setClients(data)
    } catch (err) {
      console.error(err)
    }
  }

  const fetchServices = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/services', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setServices(data || [])
    } catch (err) {
      setError('Erro ao carregar serviços')
    }
    setLoading(false)
  }

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!selectedClient) {
      setError('Selecione um cliente')
      return
    }

    try {
      const res = await fetch('http://localhost:3001/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ client_id: selectedClient, ...formData }),
      })

      if (!res.ok) throw new Error('Erro ao criar serviço')
      setFormData({ type: 'domain', name: '', description: '', expires_at: '', url: '' })
      setSelectedClient('')
      setShowForm(false)
      fetchServices()
    } catch (err) {
      setError('Falha ao criar serviço')
    }
  }

  const filteredServices = selectedClient
    ? services.filter((s) => s.client_id === selectedClient)
    : services

  return (
    <div>
      <div className="tab-header">
        <h2>Serviços</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancelar' : 'Novo Serviço'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreateService} className="form-card">
          <select
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            required
          >
            <option value="">Selecione um cliente</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.email})
              </option>
            ))}
          </select>

          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <option value="domain">Domínio</option>
            <option value="site">Site</option>
            <option value="agent">Agente</option>
            <option value="automation">Automação</option>
            <option value="webapp">Web App</option>
            <option value="script">Script</option>
          </select>

          <input
            type="text"
            placeholder="Nome do serviço"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <input
            type="text"
            placeholder="Descrição (opcional)"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <input
            type="date"
            value={formData.expires_at}
            onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
          />

          <input
            type="url"
            placeholder="URL (opcional)"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
          />

          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="btn-primary">
            Criar Serviço
          </button>
        </form>
      )}

      <div className="filter-section">
        <select value={selectedClient} onChange={(e) => setSelectedClient(e.target.value)}>
          <option value="">Todos os clientes</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Tipo</th>
              <th>Status</th>
              <th>Vencimento</th>
            </tr>
          </thead>
          <tbody>
            {filteredServices.map((service) => (
              <tr key={service.id}>
                <td>{service.name}</td>
                <td>{service.type}</td>
                <td>{service.status}</td>
                <td>
                  {service.expires_at
                    ? new Date(service.expires_at).toLocaleDateString('pt-BR')
                    : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

function AdminRenewalsTab({ token }: { token: string }) {
  const [renewals, setRenewals] = useState<Renewal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchRenewals()
  }, [])

  const fetchRenewals = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/renewals', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setRenewals(data || [])
    } catch (err) {
      setError('Erro ao carregar renovações')
    }
    setLoading(false)
  }

  const handleMarkProcessed = async (renewalId: string) => {
    try {
      const res = await fetch(`http://localhost:3001/api/renewals/${renewalId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) throw new Error('Erro ao atualizar')
      fetchRenewals()
    } catch (err) {
      setError('Falha ao marcar como processada')
    }
  }

  return (
    <div>
      <h2>Pedidos de Renovação</h2>

      {error && <p className="error-message">{error}</p>}

      {loading ? (
        <p>Carregando...</p>
      ) : renewals.length === 0 ? (
        <p>Nenhum pedido pendente</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Serviço</th>
              <th>Data do Pedido</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {renewals.map((renewal) => (
              <tr key={renewal.id}>
                <td>{renewal.profiles?.name || '—'}</td>
                <td>{renewal.services?.name || '—'}</td>
                <td>{new Date(renewal.requested_at).toLocaleDateString('pt-BR')}</td>
                <td>
                  <button
                    onClick={() => handleMarkProcessed(renewal.id)}
                    className="btn-small"
                  >
                    Processar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
