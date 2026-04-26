import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import type { ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastContextType {
  show: (message: string, type: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = useCallback((message: string, type: ToastType = 'info', duration = 4000) => {
    const id = Math.random().toString(36).substr(2, 9);
    const toast = { id, type, message, duration };

    setToasts((prev) => [...prev, toast]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 10000, maxWidth: '400px' }}>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast }: { toast: Toast }) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        setIsExiting(true);
      }, toast.duration - 300);

      return () => clearTimeout(timer);
    }
  }, [toast.duration]);

  const getStyles = () => {
    const bgColors: Record<ToastType, string> = {
      success: '#DCFCE7',
      error: '#FEE2E2',
      info: '#DBEAFE',
      warning: '#FEF3C7',
    };

    const borderColors: Record<ToastType, string> = {
      success: '#86EFAC',
      error: '#FECACA',
      info: '#93C5FD',
      warning: '#FCD34D',
    };

    const textColors: Record<ToastType, string> = {
      success: '#166534',
      error: '#991B1B',
      info: '#0C4A6E',
      warning: '#92400E',
    };

    const icons: Record<ToastType, string> = {
      success: '✓',
      error: '✕',
      info: 'ℹ',
      warning: '⚠',
    };

    return {
      bg: bgColors[toast.type],
      border: borderColors[toast.type],
      text: textColors[toast.type],
      icon: icons[toast.type],
    };
  };

  const styles = getStyles();

  return (
    <div
      style={{
        padding: '12px 16px',
        background: styles.bg,
        border: `1px solid ${styles.border}`,
        borderRadius: '8px',
        color: styles.text,
        fontSize: '14px',
        marginBottom: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        animation: isExiting ? 'slideOut 0.3s ease' : 'slideIn 0.3s ease',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      }}
    >
      <span style={{ fontWeight: 700, fontSize: '16px' }}>{styles.icon}</span>
      <span style={{ flex: 1 }}>{toast.message}</span>
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}
