import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../Toast';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SupportModal({ isOpen, onClose }: SupportModalProps) {
  const { user } = useAuth();
  const { show } = useToast();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState<'bug' | 'feature' | 'billing' | 'other'>('other');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Implement support ticket system (could use email service or database)
      // For now, we'll just show a success message
      console.log('Support ticket:', { subject, message, category, email: user?.email });

      setSent(true);
      show('Mensagem enviada! Entraremos em contato em breve.', 'success');
      setTimeout(() => {
        setSent(false);
        setSubject('');
        setMessage('');
        setCategory('other');
        onClose();
      }, 2000);
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
      show('Erro ao enviar mensagem', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
      <div style={{ background: 'white', borderRadius: '12px', padding: '40px', maxWidth: '500px', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
        <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: 700 }}>Suporte</h2>
        <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: '#666' }}>
          Nos envie uma mensagem e responderemos em breve
        </p>

        <div style={{ marginBottom: '24px', padding: '16px', background: '#E7F5EE', borderRadius: '8px', border: '1px solid #A7E8D7' }}>
          <p style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: 600, color: '#047857' }}>
            <i className="fab fa-whatsapp" style={{ marginRight: '6px' }}></i>
            Suporte rápido
          </p>
          <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#166534' }}>
            Entre em contato conosco via WhatsApp para atendimento rápido
          </p>
          <a
            href="https://wa.me/5548404266597"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              padding: '10px 16px',
              background: '#059669',
              color: 'white',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <i className="fab fa-whatsapp" style={{ marginRight: '6px' }}></i>
            +55 48 4042-6597
          </a>
        </div>

        {sent ? (
          <div style={{ padding: '24px', textAlign: 'center', background: '#DCFCE7', borderRadius: '8px' }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 600, color: '#166534' }}>
              ✓ Mensagem enviada!
            </p>
            <p style={{ margin: 0, fontSize: '13px', color: '#15803d' }}>
              Entraremos em contato em breve
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#666', marginBottom: '6px' }}>
                Categoria
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '14px', fontFamily: 'Inter' }}
              >
                <option value="bug">Relatar um problema</option>
                <option value="feature">Sugerir uma funcionalidade</option>
                <option value="billing">Questão de faturamento</option>
                <option value="other">Outro</option>
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#666', marginBottom: '6px' }}>
                Assunto
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '14px', fontFamily: 'Inter' }}
                placeholder="Descreva brevemente"
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#666', marginBottom: '6px' }}>
                Mensagem
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={5}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontFamily: 'Inter',
                  resize: 'vertical',
                }}
                placeholder="Conte-nos mais detalhes..."
              />
            </div>

            <div style={{ padding: '12px', background: '#f3f4f6', borderRadius: '8px', marginBottom: '16px', fontSize: '12px', color: '#666' }}>
              Respondendo como: <strong>{user?.email}</strong>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  flex: 1,
                  padding: '10px 16px',
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
              <button
                type="submit"
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  background: '#111',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1,
                }}
              >
                {loading ? 'Enviando...' : 'Enviar'}
              </button>
            </div>
          </form>
        )}

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
    </div>
  );
}
