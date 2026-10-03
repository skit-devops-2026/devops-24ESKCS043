import React from 'react';
import { useVault } from '../context/VaultContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useVault();

  if (!toasts.length) return null;

  return (
    <div className="wv-toast-container" aria-live="polite">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';

        return (
          <div key={toast.id} className="wv-toast" role="alert">
            {isSuccess && <CheckCircle2 size={20} color="var(--accent-emerald)" />}
            {isError && <AlertCircle size={20} color="var(--accent-rose)" />}
            {isWarning && <AlertCircle size={20} color="var(--accent-amber)" />}
            {!isSuccess && !isError && !isWarning && <Info size={20} color="var(--primary)" />}
            
            <span style={{ flex: 1 }}>{toast.message}</span>

            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-tertiary)',
                display: 'flex',
                alignItems: 'center',
                padding: '2px',
              }}
              aria-label="Dismiss toast"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
