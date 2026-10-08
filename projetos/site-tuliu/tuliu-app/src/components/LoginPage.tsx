import { useState } from 'react';
import logo from '../assets/logo.svg';
import { useGo } from '../context/NavContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

interface LoginPageProps {
  onNavigateToHome: () => void;
}

export default function LoginPage({ onNavigateToHome }: LoginPageProps) {
  const go = useGo();
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
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
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (err: any) {
      setError(err.message || 'Erro ao autenticar');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setResetSuccess(true);
      setTimeout(() => {
        setResetSuccess(false);
        setIsForgotPassword(false);
        setEmail('');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Erro ao enviar email de recuperação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <button
          onClick={onNavigateToHome}
          style={styles.backButton}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#999')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#666')}
        >
          ← Voltar
        </button>

        {/* Logo */}
        <div style={styles.logoWrapper}>
          <img src={logo} alt="Tuliu" height="36" style={{ filter: 'brightness(0) invert(1)' }} />
        </div>

        <div style={styles.header}>
            <h1 style={styles.title}>
              {isLogin ? 'Bem-vindo de volta' : 'Criar sua conta'}
            </h1>
            <p style={styles.subtitle}>
              {isLogin ? 'Acesse seu dashboard e continue crescendo' : 'Junte-se à Tuliu e transforme sua estratégia'}
            </p>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            {!isLogin && (
              <>
                <div style={styles.field}>
                  <label style={styles.label}>Seu Nome</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={styles.input}
                    placeholder="João Silva"
                    onFocus={(e) => (e.currentTarget.style.borderColor = '#444')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = '#3a3a4e')}
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Empresa</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    required
                    style={styles.input}
                    placeholder="Sua Empresa LTDA"
                    onFocus={(e) => (e.currentTarget.style.borderColor = '#444')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = '#3a3a4e')}
                  />
                </div>
              </>
            )}

            <div style={styles.field}>
              <label style={styles.label}>E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.input}
                placeholder="seu@email.com"
                onFocus={(e) => (e.currentTarget.style.borderColor = '#444')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#3a3a4e')}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Senha</label>
              <div style={styles.passwordWrapper}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={styles.input}
                  placeholder="••••••••"
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#444')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = '#3a3a4e')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#888')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#666')}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {error && (
              <div style={styles.error}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.button,
                opacity: loading ? 0.6 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.background = '#333')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#111111')}
            >
              {loading ? 'Carregando...' : isLogin ? 'Entrar' : 'Criar Conta'}
            </button>
          </form>

          <div style={styles.toggle}>
            <span style={styles.toggleText}>
              {isLogin ? 'Não tem conta? ' : 'Já tem conta? '}
            </span>
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              style={styles.toggleButton}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#93c5fd')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#60a5fa')}
            >
              {isLogin ? 'Criar uma' : 'Entrar'}
            </button>
          </div>

          {isLogin && (
            <div style={{ marginTop: '16px', textAlign: 'center' }}>
              <button
                type="button"
                onClick={() => {
                  setIsForgotPassword(true);
                  setError('');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#60a5fa',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'color 0.2s',
                  fontFamily: 'Inter, sans-serif',
                  padding: 0,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#93c5fd')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#60a5fa')}
              >
                Esqueceu sua senha?
              </button>
            </div>
          )}

        {/* Atalho para quem recebeu uma proposta: circula pelo site antes de abri-la */}
        <div className="login-proposal">
          <span className="login-proposal-or">ou</span>
          <button type="button" className="login-proposal-btn" onClick={() => go('/proposta')}>
            <span className="login-proposal-icon"><i className="fas fa-file-signature"></i></span>
            <span className="login-proposal-text">
              <strong>Recebi uma proposta</strong>
              <small>Acesse a proposta criada para o seu negócio</small>
            </span>
            <i className="fas fa-arrow-right"></i>
          </button>
        </div>

        <p style={styles.footer}>
          Protegido pela segurança de ponta da Tuliu
        </p>

        {/* Forgot Password Modal */}
        {isForgotPassword && (
          <div style={styles.modalOverlay} onClick={() => setIsForgotPassword(false)}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setIsForgotPassword(false)}
                style={styles.closeButton}
              >
                ✕
              </button>

              <h2 style={styles.modalTitle}>Recuperar Senha</h2>
              <p style={styles.modalSubtitle}>
                Digite seu email para receber um link de recuperação
              </p>

              {resetSuccess ? (
                <div style={styles.successMessage}>
                  <i className="fas fa-check-circle" style={{ marginRight: '8px' }}></i>
                  Email de recuperação enviado! Verifique sua caixa de entrada.
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {error && <div style={styles.error}>{error}</div>}

                  <div style={styles.field}>
                    <label style={styles.label}>E-mail</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      style={styles.input}
                      placeholder="seu@email.com"
                      onFocus={(e) => (e.currentTarget.style.borderColor = '#444')}
                      onBlur={(e) => (e.currentTarget.style.borderColor = '#3a3a4e')}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      ...styles.button,
                      opacity: loading ? 0.6 : 1,
                      cursor: loading ? 'not-allowed' : 'pointer',
                    }}
                    onMouseEnter={(e) => !loading && (e.currentTarget.style.background = '#333')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = '#111111')}
                  >
                    {loading ? 'Enviando...' : 'Enviar Link de Recuperação'}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'fixed',
    inset: 0,
    background: '#0d0d1a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    overflow: 'auto',
    zIndex: 1000,
  },
  wrapper: {
    width: '100%',
    maxWidth: '400px',
    position: 'relative',
    zIndex: 10,
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'none',
    border: 'none',
    color: '#666',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    marginBottom: '32px',
    transition: 'color 0.2s',
    fontFamily: 'Inter, sans-serif',
  },
  logoWrapper: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '48px',
    marginTop: '60px',
  },
  header: {
    marginBottom: '48px',
    textAlign: 'center',
  },
  title: {
    fontSize: '32px',
    fontWeight: 500,
    color: '#ffffff',
    margin: 0,
    marginBottom: '8px',
    letterSpacing: '-0.5px',
    fontFamily: 'Poppins, sans-serif',
  },
  subtitle: {
    fontSize: '15px',
    color: '#999',
    margin: 0,
    lineHeight: 1.5,
    fontFamily: 'Inter, sans-serif',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#ccc',
    fontFamily: 'Inter, sans-serif',
  },
  input: {
    width: '100%',
    background: '#2a2a3e',
    border: '1px solid #3a3a4e',
    borderRadius: '12px',
    padding: '12px 16px',
    color: '#ffffff',
    fontSize: '14px',
    fontFamily: 'Inter, sans-serif',
    outline: 'none',
    transition: 'border-color 0.2s, background 0.2s',
  } as React.CSSProperties,
  passwordWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  eyeButton: {
    position: 'absolute',
    right: '12px',
    background: 'none',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer',
    color: '#666',
    transition: 'color 0.2s',
    padding: 0,
  },
  button: {
    width: '100%',
    marginTop: '16px',
    padding: '14px',
    background: '#111111',
    color: 'white',
    fontSize: '15px',
    fontWeight: 600,
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'background 0.2s, transform 0.15s',
    fontFamily: 'Inter, sans-serif',
  } as React.CSSProperties,
  error: {
    padding: '12px',
    background: 'rgba(220, 38, 38, 0.1)',
    border: '1px solid rgba(220, 38, 38, 0.3)',
    borderRadius: '8px',
    color: '#ff6b6b',
    fontSize: '13px',
    fontFamily: 'Inter, sans-serif',
  },
  toggle: {
    marginTop: '24px',
    textAlign: 'center',
    fontSize: '14px',
    fontFamily: 'Inter, sans-serif',
  },
  toggleText: {
    color: '#999',
  },
  toggleButton: {
    background: 'none',
    border: 'none',
    color: '#fff',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'color 0.2s',
    fontFamily: 'Inter, sans-serif',
    padding: 0,
    marginLeft: '4px',
  },
  footer: {
    marginTop: '32px',
    textAlign: 'center',
    color: '#666',
    fontSize: '12px',
    fontFamily: 'Inter, sans-serif',
    margin: '32px 0 0 0',
  },
  modalOverlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
  },
  modal: {
    background: '#0d0d1a',
    border: '1px solid #3a3a4e',
    borderRadius: '16px',
    padding: '32px',
    maxWidth: '400px',
    width: '100%',
    position: 'relative' as const,
  },
  closeButton: {
    position: 'absolute' as const,
    top: '16px',
    right: '16px',
    background: 'none',
    border: 'none',
    color: '#666',
    fontSize: '24px',
    cursor: 'pointer',
    padding: 0,
    transition: 'color 0.2s',
  },
  modalTitle: {
    fontSize: '24px',
    fontWeight: 600,
    color: '#ffffff',
    margin: '0 0 8px 0',
    fontFamily: 'Inter, sans-serif',
  },
  modalSubtitle: {
    fontSize: '14px',
    color: '#999',
    margin: '0 0 24px 0',
    fontFamily: 'Inter, sans-serif',
  },
  successMessage: {
    padding: '16px',
    background: 'rgba(16, 185, 129, 0.1)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    borderRadius: '8px',
    color: '#10b981',
    fontSize: '14px',
    fontFamily: 'Inter, sans-serif',
    display: 'flex',
    alignItems: 'center',
  },
};
