import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../Toast';
import { supabase } from '../../lib/supabase';
import ChangePasswordModal from './ChangePasswordModal';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ClientSettings {
  email_notifications: boolean;
  marketing_emails: boolean;
  two_factor_enabled: boolean;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { client, user } = useAuth();
  const { show } = useToast();
  const [settings, setSettings] = useState<ClientSettings>({
    email_notifications: true,
    marketing_emails: false,
    two_factor_enabled: false,
  });
  const [loading, setLoading] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  useEffect(() => {
    if (isOpen && client?.id) {
      fetchSettings();
    }
  }, [isOpen, client]);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('client_settings')
        .select('*')
        .eq('client_id', client?.id)
        .single();

      if (!error && data) {
        setSettings(data);
      }
    } catch (err) {
      console.error('Erro ao buscar configurações:', err);
    }
  };

  const handleSettingChange = async (key: keyof ClientSettings, value: boolean) => {
    if (!client?.id) return;

    setLoading(true);
    try {
      const updatedSettings = { ...settings, [key]: value };

      const { error } = await supabase
        .from('client_settings')
        .upsert({
          client_id: client.id,
          [key]: value,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      setSettings(updatedSettings);
      show('Configuração atualizada!', 'success', 3000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao atualizar configuração';
      show(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };


  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, overflow: 'auto' }}>
      <div style={{ background: 'white', borderRadius: '12px', padding: '40px', maxWidth: '500px', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', margin: '20px' }}>
        <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: 700 }}>Configurações</h2>
        <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: '#666' }}>
          Gerencie suas preferências e segurança
        </p>

        {/* Notificações */}
        <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #E5E7EB' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: 600 }}>Notificações</h3>

          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={settings.email_notifications}
              onChange={(e) => handleSettingChange('email_notifications', e.target.checked)}
              disabled={loading}
              style={{ cursor: 'pointer' }}
            />
            <span style={{ fontSize: '14px', color: '#333' }}>
              Notificações por e-mail
            </span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={settings.marketing_emails}
              onChange={(e) => handleSettingChange('marketing_emails', e.target.checked)}
              disabled={loading}
              style={{ cursor: 'pointer' }}
            />
            <span style={{ fontSize: '14px', color: '#333' }}>
              E-mails de marketing e novidades
            </span>
          </label>
        </div>

        {/* Segurança */}
        <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #E5E7EB' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: 600 }}>Segurança</h3>

          <button
            onClick={() => setIsChangePasswordOpen(true)}
            style={{
              padding: '10px 16px',
              background: '#f3f4f6',
              color: '#111',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#e5e7eb')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#f3f4f6')}
          >
            <i className="fas fa-key" style={{ fontSize: '14px' }}></i>
            Alterar Senha
          </button>

          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '16px', cursor: 'pointer', opacity: 0.5 }}>
            <input
              type="checkbox"
              checked={settings.two_factor_enabled}
              onChange={(e) => handleSettingChange('two_factor_enabled', e.target.checked)}
              disabled={true}
              style={{ cursor: 'not-allowed' }}
            />
            <span style={{ fontSize: '14px', color: '#666' }}>
              Autenticação de dois fatores (em breve)
            </span>
          </label>
        </div>

        {/* Account Info */}
        <div>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '15px', fontWeight: 600 }}>Conta</h3>
          <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#666' }}>
            <strong>E-mail:</strong> {user?.email}
          </p>
          <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#666' }}>
            <strong>Plano:</strong> {client?.plan?.name || 'Básico'}
          </p>
          <p style={{ margin: 0, fontSize: '12px', color: '#999' }}>
            Conta criada em {new Date(client?.created_at || '').toLocaleDateString('pt-BR')}
          </p>
        </div>

        <button
          onClick={onClose}
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

      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />
    </div>
  );
}
