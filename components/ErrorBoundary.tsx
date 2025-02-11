'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import Link from 'next/link';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex min-h-[400px] w-full items-center justify-center rounded-lg border border-white/10 bg-black/20 p-8 backdrop-blur-sm">
          <div className="text-center">
            <h2 className="mb-2 text-lg font-semibold text-red-400">
              Something went wrong
            </h2>
            <p className="mb-4 text-sm text-white/70">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <Link
              href="/products"
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              Return to Products
            </Link>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
} 