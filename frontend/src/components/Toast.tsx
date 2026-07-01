import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

// Simple event dispatcher for toast
export const toastEvent = {
  listeners: new Set<(toast: ToastMessage) => void>(),
  subscribe(callback: (toast: ToastMessage) => void) {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  },
  show(message: string, type: 'success' | 'error' | 'info' = 'success') {
    const id = Math.random().toString(36).substring(2, 9);
    this.listeners.forEach(cb => cb({ id, type, message }));
  }
};

export const toast = {
  success: (msg: string) => toastEvent.show(msg, 'success'),
  error: (msg: string) => toastEvent.show(msg, 'error'),
  info: (msg: string) => toastEvent.show(msg, 'info'),
};

export const ToastContainer = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    return toastEvent.subscribe((newToast) => {
      setToasts(prev => [...prev, newToast]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== newToast.id));
      }, 4000);
    });
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 max-w-sm w-full">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.15 } }}
            className="flex items-center gap-3 p-4 rounded-xl border bg-[#2D0000] border-white/10 shadow-2xl"
          >
            {t.type === 'success' && <CheckCircle className="text-green-400 shrink-0" size={18} />}
            {t.type === 'error' && <XCircle className="text-red-400 shrink-0" size={18} />}
            {t.type === 'info' && <Info className="text-tan shrink-0" size={18} />}
            <span className="text-sm font-medium text-white flex-1">{t.message}</span>
            <button
              onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}
              className="text-gray-500 hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
