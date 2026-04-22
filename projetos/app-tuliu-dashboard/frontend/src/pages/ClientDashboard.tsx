import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import './Dashboard.css'

interface Service {
  id: string
  name: string
  type: string
  status: string
  expires_at: string | null
  description?: string
  url?: string
}

export default function ClientDashboard() {
  const { user, logout } = useAuth()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchServices()
    }
  }, [user])

  const fetchServices = async () => {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('client_id', user?.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching services:', error)
    } else {
      setServices(data || [])
    }
    setLoading(false)
  }

  const handleRenewal = async (serviceId: string) => {
    const { error } = await supabase.from('renewals').insert({
      service_id: serviceId,
      client_id: user?.id,
    })

    if (error) {
      console.error('Error requesting renewal:', error)
    } else {
      alert('Pedido de renovação enviado!')
      fetchServices()
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#10b981'
      case 'inactive':
        return '#6b7280'
      case 'expiring':
        return '#f59e0b'
      default:
        return '#6b7280'
    }
  }

  const getTypeIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      domain: '🌐',
      site: '📄',
      agent: '🤖',
      automation: '⚙️',
      webapp: '💻',
      script: '📜',
    }
    return icons[type] || '📦'
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div></div>
        <button onClick={logout} className="btn-logout">
          Sair
        </button>
      </header>

      <div className="dashboard-content">
        {loading ? (
          <p>Carregando...</p>
        ) : services.length === 0 ? (
          <p className="empty-state">Você não tem serviços contratados.</p>
        ) : (
          <div className="services-grid">
            {services.map((service) => (
              <div key={service.id} className="service-card">
                <div className="service-header">
                  <span className="service-icon">{getTypeIcon(service.type)}</span>
                  <span
                    className="service-status"
                    style={{ backgroundColor: getStatusColor(service.status) }}
                  >
                    {service.status}
                  </span>
                </div>

                <h3>{service.name}</h3>
                {service.description && <p className="description">{service.description}</p>}

                <div className="service-info">
                  <p>
                    <strong>Tipo:</strong> {service.type}
                  </p>
                  {service.expires_at && (
                    <p>
                      <strong>Vence:</strong> {new Date(service.expires_at).toLocaleDateString('pt-BR')}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => handleRenewal(service.id)}
                  className="btn-renew"
                >
                  Solicitar Renovação
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
