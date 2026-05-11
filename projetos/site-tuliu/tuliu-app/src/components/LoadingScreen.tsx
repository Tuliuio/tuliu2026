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
        @keyframes tuliu-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .tuliu-loading {
          animation: tuliu-spin 3s linear infinite;
        }
      `}</style>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',
      }}>
        {/* Tuliu Symbol */}
        <div style={{
          position: 'relative',
          width: '120px',
          height: '120px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <svg
            className="tuliu-loading"
            style={{
              width: '100%',
              height: '100%',
            }}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 114 114"
          >
            <rect x="0" y="0" width="114" height="114" rx="57" fill="#0a071a" />
            <circle cx="57" cy="57" r="50" fill="none" stroke="white" strokeWidth="28" />
            <circle cx="81" cy="57" r="19" fill="white" />
          </svg>
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
