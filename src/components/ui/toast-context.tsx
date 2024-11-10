'use client';

import React, { createContext, useContext, useCallback } from 'react';

interface Toast {
  id: number;
  title?: string;
  description: string;
  variant?: 'default' | 'destructive';
}

interface ToastContextValue {
  toast: (props: Omit<Toast, 'id'>) => void;
  removeToast: (id: number) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const toast = useCallback((props: Omit<Toast, 'id'>) => {
    const id = Date.now();
    const newToast = { ...props, id };
    setToasts(current => [...current, newToast]);

    // Auto-remove toast after 5 seconds
    setTimeout(() => {
      setToasts(current => current.filter(t => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts(current => current.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast, removeToast }}>
      {children}
      {/* Toast UI */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`rounded-md px-6 py-4 shadow-lg ${
              t.variant === 'destructive' ? 'bg-red-600 text-white' : 'bg-white text-gray-900'
            }`}
            role="alert"
          >
            {t.title && (
              <div className="font-medium">{t.title}</div>
            )}
            <div className={t.title ? 'text-sm' : ''}>
              {t.description}
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}