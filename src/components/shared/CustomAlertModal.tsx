'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { CustomButton } from './CustomButton';

interface CustomAlertModalProps {
  /** Whether the modal is visible. */
  isOpen: boolean;
  /** Title shown at the top of the modal. */
  title: string;
  /** Descriptive message explaining the consequence of the action. */
  message: string;
  /** Label for the confirm (destructive) button. Defaults to "Confirm". */
  confirmLabel?: string;
  /** Label for the cancel button. Defaults to "Cancel". */
  cancelLabel?: string;
  /** Variant drives the confirm button color. */
  variant?: 'danger' | 'warning' | 'info';
  /** Loading state for the confirm button (while async action runs). */
  loading?: boolean;
  /** Called when user confirms the action. */
  onConfirm: () => void;
  /** Called when user cancels or closes the modal. */
  onCancel: () => void;
}

const variantStyles = {
  danger: {
    iconBg: 'bg-red-500/10',
    iconColor: 'text-red-500',
    btnClass: 'bg-red-600 text-white hover:bg-red-500',
  },
  warning: {
    iconBg: 'bg-amber-500/10',
    iconColor: 'text-amber-500',
    btnClass: 'bg-amber-600 text-white hover:bg-amber-500',
  },
  info: {
    iconBg: 'bg-blue-500/10',
    iconColor: 'text-blue-500',
    btnClass: 'bg-blue-600 text-white hover:bg-blue-500',
  },
};

/**
 * S3 — Modal for all destructive / irreversible actions.
 * Never perform irreversible actions without this confirmation step.
 */
export function CustomAlertModal({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  loading = false,
  onConfirm,
  onCancel,
}: CustomAlertModalProps) {
  const styles = variantStyles[variant];

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onCancel();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onCancel]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm"
            onClick={onCancel}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 shadow-2xl pointer-events-auto">
              {/* Close */}
              <button
                onClick={onCancel}
                className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all text-gray-500"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Icon */}
              <div className={`w-14 h-14 rounded-2xl ${styles.iconBg} flex items-center justify-center mb-6`}>
                <AlertTriangle className={`w-7 h-7 ${styles.iconColor}`} />
              </div>

              {/* Content */}
              <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-8">{message}</p>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={onConfirm}
                  disabled={loading}
                  className={`flex-1 px-6 py-3 rounded-full font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed ${styles.btnClass}`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    confirmLabel
                  )}
                </button>
                <CustomButton variant="outline" className="flex-1" onClick={onCancel} disabled={loading}>
                  {cancelLabel}
                </CustomButton>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
