import { useState, useEffect } from 'react';
import logo from '../assets/logo.svg';
import { supabase } from '../lib/supabase';

interface ResetPasswordPageProps {
  onNavigateToHome: () => void;
}

export default function ResetPasswordPage({ onNavigateToHome }: ResetPasswordPageProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Check if we have a valid session from the reset link
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError('Link expirado ou inválido. Por favor, solicite um novo email de recuperação.');
      }
    };
    checkSession();
  }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password || !confirmPassword) {
      setError('Preencha todos os campos');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não correspondem');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => {
        onNavigateToHome();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Erro ao resetar senha');
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
          <h1 style={styles.title}>Resetar Senha</h1>
          <p style={styles.subtitle}>Digite sua nova senha para recuperar acesso à sua conta</p>
        </div>

        {success ? (
          <div style={styles.successMessage}>
            <i className="fas fa-check-circle" style={{ marginRight: '12px', fontSize: '24px' }}></i>
            <div>
              <p style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 600, color: '#10b981' }}>
                Senha alterada com sucesso!
              </p>
              <p style={{ margin: 0, fontSize: '14px', color: '#059669' }}>
                Você será redirecionado em breve...
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleResetPassword} style={styles.form}>
            {error && <div style={styles.error}>{error}</div>}

            <div style={styles.field}>
              <label style={styles.label}>Nova Senha</label>
              <div style={styles.passwordWrapper}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  style={{...styles.input, opacity: loading ? 0.6 : 1}}
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

            <div style={styles.field}>
              <label style={styles.label}>Confirmar Senha</label>
              <div style={styles.passwordWrapper}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                  style={{...styles.input, opacity: loading ? 0.6 : 1}}
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
              {loading ? 'Resetando...' : 'Resetar Senha'}
            </button>
          </form>
        )}

        <p style={styles.footer}>
          Protegido pela segurança de ponta da Tuliu
        </p>
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
  successMessage: {
    padding: '24px',
    background: 'rgba(16, 185, 129, 0.1)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    borderRadius: '12px',
    color: '#10b981',
    fontSize: '14px',
    fontFamily: 'Inter, sans-serif',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
  },
  footer: {
    marginTop: '32px',
    textAlign: 'center',
    color: '#666',
    fontSize: '12px',
    fontFamily: 'Inter, sans-serif',
    margin: '32px 0 0 0',
  },
};
