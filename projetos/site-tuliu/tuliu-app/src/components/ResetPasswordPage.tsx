import { useState, useEffect } from 'react';
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
          <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="140" height="70" viewBox="0 0 1350.75 662.249984" preserveAspectRatio="xMidYMid meet">
            <defs>
              <clipPath id="clip1"><path d="M 130.769531 302.832031 L 243.363281 302.832031 L 243.363281 415.425781 L 130.769531 415.425781 Z M 130.769531 302.832031 " clipRule="nonzero"/></clipPath>
              <clipPath id="clip2"><path d="M 130.769531 359.128906 C 130.769531 390.21875 155.976562 415.425781 187.066406 415.425781 C 218.160156 415.425781 243.363281 390.21875 243.363281 359.128906 C 243.363281 328.035156 218.160156 302.832031 187.066406 302.832031 C 155.976562 302.832031 130.769531 328.035156 130.769531 359.128906 Z M 130.769531 359.128906 " clipRule="nonzero"/></clipPath>
              <clipPath id="clip3"><path d="M 0.769531 0.832031 L 113.363281 0.832031 L 113.363281 113.425781 L 0.769531 113.425781 Z M 0.769531 0.832031 " clipRule="nonzero"/></clipPath>
              <clipPath id="clip4"><path d="M 0.769531 57.128906 C 0.769531 88.21875 25.976562 113.425781 57.066406 113.425781 C 88.160156 113.425781 113.363281 88.21875 113.363281 57.128906 C 113.363281 26.035156 88.160156 0.832031 57.066406 0.832031 C 25.976562 0.832031 0.769531 26.035156 0.769531 57.128906 Z M 0.769531 57.128906 " clipRule="nonzero"/></clipPath>
              <clipPath id="clip5"><rect x="0" width="114" y="0" height="114"/></clipPath>
              <clipPath id="clip6"><path d="M 0.640625 237.777344 L 243.363281 237.777344 L 243.363281 480.5 L 0.640625 480.5 Z M 0.640625 237.777344 " clipRule="nonzero"/></clipPath>
              <clipPath id="clip7"><path d="M 0.640625 359.136719 C 0.640625 426.164062 54.976562 480.5 122 480.5 C 189.027344 480.5 243.363281 426.164062 243.363281 359.136719 C 243.363281 292.113281 189.027344 237.777344 122 237.777344 C 54.976562 237.777344 0.640625 292.113281 0.640625 359.136719 Z M 0.640625 359.136719 " clipRule="nonzero"/></clipPath>
            </defs>
            <g fill="#ffffff" fillOpacity="1"><g transform="translate(269.81416, 468.198927)"><g><path d="M 115.03125 -73.921875 L 115.03125 -122.203125 L 160.671875 -122.203125 L 160.671875 -69.40625 C 160.671875 -56.320312 158.03125 -44.125 152.75 -32.8125 C 147.46875 -21.5 139.359375 -12.382812 128.421875 -5.46875 C 117.484375 1.445312 103.21875 4.90625 85.625 4.90625 C 67.519531 4.90625 52.929688 1.445312 41.859375 -5.46875 C 30.796875 -12.382812 22.6875 -21.5 17.53125 -32.8125 C 12.382812 -44.125 9.8125 -56.445312 9.8125 -69.78125 L 9.8125 -235.734375 L 58.078125 -235.734375 L 58.078125 -185.5625 L 160.671875 -185.5625 L 160.671875 -150.875 L 58.078125 -150.875 L 58.078125 -74.6875 C 58.078125 -63.113281 60.273438 -54.054688 64.671875 -47.515625 C 69.078125 -40.984375 76.3125 -37.71875 86.375 -37.71875 C 96.175781 -37.71875 103.398438 -40.859375 108.046875 -47.140625 C 112.703125 -53.429688 115.03125 -62.359375 115.03125 -73.921875 Z M 115.03125 -73.921875 "/></g></g></g>
            <g fill="#ffffff" fillOpacity="1"><g transform="translate(444.442573, 468.198927)"><g><path d="M 176.890625 0 L 130.5 0 L 130.5 -26.03125 C 117.925781 -5.40625 98.691406 4.90625 72.796875 4.90625 C 60.472656 4.90625 49.597656 2.015625 40.171875 -3.765625 C 30.742188 -9.554688 23.328125 -17.539062 17.921875 -27.71875 C 12.515625 -37.90625 9.8125 -49.785156 9.8125 -63.359375 L 9.8125 -185.5625 L 58.84375 -185.5625 L 58.84375 -70.90625 C 58.84375 -47.769531 69.273438 -36.203125 90.140625 -36.203125 C 102.710938 -36.203125 112.203125 -40.160156 118.609375 -48.078125 C 125.023438 -56.003906 128.234375 -66.128906 128.234375 -78.453125 L 128.234375 -185.5625 L 176.890625 -185.5625 Z M 176.890625 0 "/></g></g></g>
            <g fill="#ffffff" fillOpacity="1"><g transform="translate(636.79786, 468.198927)"><g><path d="M 58.84375 0 L 9.8125 0 L 9.8125 -253.453125 L 58.84375 -253.453125 Z M 58.84375 0 "/></g></g></g>
            <g fill="#ffffff" fillOpacity="1"><g transform="translate(710.345529, 468.198927)"><g><path d="M 59.96875 0 L 10.9375 0 L 10.9375 -185.5625 L 59.96875 -185.5625 Z M 59.96875 -207.828125 L 10.9375 -207.828125 L 10.9375 -253.453125 L 59.96875 -253.453125 Z M 59.96875 -207.828125 "/></g></g></g>
            <g fill="#ffffff" fillOpacity="1"><g transform="translate(786.533335, 468.198927)"><g><path d="M 176.890625 0 L 130.5 0 L 130.5 -26.03125 C 117.925781 -5.40625 98.691406 4.90625 72.796875 4.90625 C 60.472656 4.90625 49.597656 2.015625 40.171875 -3.765625 C 30.742188 -9.554688 23.328125 -17.539062 17.921875 -27.71875 C 12.515625 -37.90625 9.8125 -49.785156 9.8125 -63.359375 L 9.8125 -185.5625 L 58.84375 -185.5625 L 58.84375 -70.90625 C 58.84375 -47.769531 69.273438 -36.203125 90.140625 -36.203125 C 102.710938 -36.203125 112.203125 -40.160156 118.609375 -48.078125 C 125.023438 -56.003906 128.234375 -66.128906 128.234375 -78.453125 L 128.234375 -185.5625 L 176.890625 -185.5625 Z M 176.890625 0 "/></g></g></g>
            <g clipPath="url(#clip1)"><g clipPath="url(#clip2)"><g transform="matrix(1, 0, 0, 1, 130, 302)"><g clipPath="url(#clip5)"><g clipPath="url(#clip3)"><g clipPath="url(#clip4)"><path fill="#ffffff" d="M 0.769531 113.425781 L 0.769531 0.832031 L 113.363281 0.832031 L 113.363281 113.425781 Z M 0.769531 113.425781 " fillOpacity="1" fillRule="nonzero"/></g></g></g></g></g></g>
            <g clipPath="url(#clip6)"><g clipPath="url(#clip7)"><path stroke="#ffffff" strokeWidth="114" strokeLinecap="butt" strokeLinejoin="miter" strokeOpacity="1" strokeMiterlimit="4" d="M 162.002025 0.00196066 C 72.531016 0.00196066 0.00104669 72.53193 0.00104669 161.997724 C 0.00104669 251.468733 72.531016 323.998702 162.002025 323.998702 C 251.467819 323.998702 323.997788 251.468733 323.997788 161.997724 C 323.997788 72.53193 251.467819 0.00196066 162.002025 0.00196066 Z M 162.002025 0.00196066 " fill="none" transform="matrix(0, -0.749152, 0.749152, 0, 0.639156, 480.500784)"/>
            </g></g>
          </svg>
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
