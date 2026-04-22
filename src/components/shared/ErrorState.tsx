'use client';

import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { CustomButton } from './CustomButton';

interface ErrorStateProps {
  /** Override the message shown. Defaults to the standardized S5 message. */
  message?: string;
  /** Callback fired when the user clicks Retry. */
  onRetry?: () => void;
  /** Additional wrapper class. */
  className?: string;
}

/**
 * S5 — Standardized error state shown when a query hook returns an error.
 * Standardized message: "No internet connection. Please check network and retry."
 * Always renders a Retry button.
 */
export function ErrorState({
  message = 'No internet connection. Please check network and retry.',
  onRetry,
  className = '',
}: ErrorStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center py-20 px-6 rounded-3xl border border-dashed border-white/10 bg-white/[0.01] ${className}`}
    >
      <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
        <WifiOff className="w-8 h-8 text-red-500" />
      </div>

      <h3 className="text-xl font-bold text-white mb-2">Something went wrong</h3>
      <p className="text-gray-500 text-sm max-w-sm leading-relaxed mb-8">{message}</p>

      {onRetry && (
        <CustomButton
          variant="outline"
          size="sm"
          leftIcon={<RefreshCw className="w-4 h-4" />}
          onClick={onRetry}
        >
          Retry
        </CustomButton>
      )}
    </div>
  );
}
