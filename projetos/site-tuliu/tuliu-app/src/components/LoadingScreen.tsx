export default function LoadingScreen() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: '#ffffff',
    }}>
      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .loading-spinner {
          animation: spin 2s linear infinite;
        }
      `}</style>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',
      }}>
        {/* Spinning Circle with Icon */}
        <div style={{
          position: 'relative',
          width: '120px',
          height: '120px',
        }}>
          {/* Outer spinning ring */}
          <div className="loading-spinner" style={{
            position: 'absolute',
            width: '120px',
            height: '120px',
            border: '3px solid #f0f0f0',
            borderTop: '3px solid #111',
            borderRadius: '50%',
            top: 0,
            left: 0,
          }} />

          {/* Icon in center */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '48px',
          }}>
            <i className="fas fa-feather" style={{ color: '#111' }}></i>
          </div>
        </div>

        {/* Loading text */}
        <p style={{
          fontSize: '16px',
          color: '#666',
          fontWeight: 500,
          margin: 0,
        }}>
          Carregando...
        </p>
      </div>
    </div>
  );
}
