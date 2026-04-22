'use client';

import React, { Component, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * W11 — React error boundary. Wrap pages and high-risk components.
 *
 * Usage:
 *   <ErrorBoundary>
 *     <SomeComponent />
 *   </ErrorBoundary>
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // In production you'd send this to an error reporting service
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-6 py-20 rounded-3xl border border-dashed border-white/10 bg-white/[0.01]">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mb-6">
            <AlertTriangle className="w-8 h-8 text-amber-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">An unexpected error occurred</h3>
          <p className="text-gray-500 text-sm max-w-sm leading-relaxed mb-8">
            Something crashed unexpectedly. Please try refreshing the page.
          </p>
          <button
            onClick={this.handleReset}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-gray-800 text-white hover:bg-gray-900 transition-all font-semibold text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
