import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, X } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  type?: 'success' | 'error';
  title: string;
  message?: string;
  onClose: () => void;
  actionLabel?: string;
  onAction?: () => void;
  referenceId?: string;
  children?: React.ReactNode;
}

const SuccessModal = ({
  isOpen,
  type = 'success',
  title,
  message,
  onClose,
  actionLabel,
  onAction,
  referenceId,
  children,
}: SuccessModalProps) => {
  if (!isOpen) return null;

  const isSuccess = type === 'success';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-overlay" onClick={onClose}>
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ duration: 0.28, ease: [0.34, 1.56, 0.64, 1] }}
            className="modal-box max-w-sm p-8 text-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5"
              aria-label="Close"
            >
              <X size={16} />
            </button>

            {/* Icon */}
            <div className={`w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center ${
              isSuccess ? 'bg-green-500/15' : 'bg-red-500/15'
            }`}>
              {isSuccess ? (
                <CheckCircle size={36} className="text-green-400" />
              ) : (
                <XCircle size={36} className="text-red-400" />
              )}
            </div>

            {/* Text */}
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            {referenceId && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 my-4 inline-block w-full">
                <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1">Booking Reference</p>
                <p className="text-lg font-mono font-bold text-tan">{referenceId}</p>
              </div>
            )}
            {message && <p className="text-gray-400 text-sm leading-relaxed mb-4">{message}</p>}
            
            {children && <div className="text-left mt-2 mb-4">{children}</div>}

            {/* Actions */}
            <div className="flex flex-col gap-3 mt-6">
              {actionLabel && onAction && (
                <button
                  onClick={onAction}
                  className="w-full py-3 rounded-xl font-bold bg-tan text-richBlack hover:bg-tan/90 transition-all"
                >
                  {actionLabel}
                </button>
              )}
              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl font-semibold text-sm bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition-all"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SuccessModal;
