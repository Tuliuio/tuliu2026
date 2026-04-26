import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password, name, company);
      }
      // Add a small delay to ensure session is propagated
      await new Promise(resolve => setTimeout(resolve, 500));
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erro ao autenticar');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
      <div style={{ background: 'white', borderRadius: '12px', padding: '40px', maxWidth: '400px', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px', color: '#1A1A1A' }}>
          {isLogin ? 'Entrar' : 'Criar Conta'}
        </h2>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '24px' }}>
          {isLogin ? 'Acesse seu dashboard' : 'Crie sua conta para começar'}
        </p>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#666', marginBottom: '6px' }}>
                  Seu Nome
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '14px', fontFamily: 'Inter' }}
                  placeholder="Sua Empresa LTDA"
                />
              </div>
            </>
          )}

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#666', marginBottom: '6px' }}>
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '14px', fontFamily: 'Inter' }}
              placeholder="seu@email.com"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#666', marginBottom: '6px' }}>
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: '#111111',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.background = '#333')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#111111')}
          >
            {loading ? 'Carregando...' : isLogin ? 'Entrar' : 'Criar Conta'}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              color: '#111111',
              textDecoration: 'underline',
            }}
          >
            {isLogin ? 'Criar nova conta' : 'Já tenho conta'}
          </button>
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
    </div>
  );
}
