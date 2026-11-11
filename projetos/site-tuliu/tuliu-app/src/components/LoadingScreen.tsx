// Tela de carregamento: símbolo atual da Tuliu sobre o fundo escuro da marca,
// com brilho roxo e uma barra fina em gradiente, na linguagem da home.
export default function LoadingScreen() {
  return (
    <div className="tl-loading" role="status" aria-live="polite">
      <style>{`
        .tl-loading {
          position: fixed; inset: 0; display: flex; align-items: center; justify-content: center;
          background: radial-gradient(60% 50% at 50% 45%, rgba(139, 92, 246, .22), transparent 70%), #0a071a;
        }
        .tl-loading-inner { display: flex; flex-direction: column; align-items: center; gap: 34px; }
        .tl-loading-mark { width: 72px; height: 72px; filter: brightness(0) invert(1); animation: tl-spin 1.6s cubic-bezier(.65, 0, .35, 1) infinite; }
        .tl-loading-bar { position: relative; width: 132px; height: 2px; border-radius: 2px; background: rgba(255, 255, 255, .1); overflow: hidden; }
        .tl-loading-bar::after {
          content: ''; position: absolute; inset: 0; width: 40%; border-radius: 2px;
          background: linear-gradient(90deg, #a78bfa, #c084fc, #e879f9);
          animation: tl-slide 1.4s ease-in-out infinite;
        }
        .tl-loading-label { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
        @keyframes tl-spin { to { transform: rotate(360deg); } }
        @keyframes tl-slide { 0% { transform: translateX(-100%); } 100% { transform: translateX(250%); } }
        @media (prefers-reduced-motion: reduce) {
          .tl-loading-mark { animation: none; }
          .tl-loading-bar::after { animation-duration: 3s; }
        }
      `}</style>
      <div className="tl-loading-inner">
        <img className="tl-loading-mark" src="/logo-simbolo.svg" alt="" />
        <div className="tl-loading-bar" />
        <span className="tl-loading-label">Carregando</span>
      </div>
    </div>
  );
}
