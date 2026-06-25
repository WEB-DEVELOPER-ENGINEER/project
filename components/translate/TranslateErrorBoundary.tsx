'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Globe, RefreshCw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  retryCount: number;
}

/**
 * Specialized Error Boundary for Google Translate functionality
 * Provides graceful fallback when translation features fail
 */
export class TranslateErrorBoundary extends Component<Props, State> {
  private maxRetries = 3;

  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      retryCount: 0 
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return { 
      hasError: true, 
      error,
      retryCount: 0
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log translation-specific errors
    console.error('Translation Error Boundary caught an error:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString()
    });

    // In production, you might want to send this to an error monitoring service
    if (process.env.NODE_ENV === 'production') {
      // Example: logToErrorService('translation-error', error, errorInfo);
    }
  }

  handleRetry = () => {
    if (this.state.retryCount < this.maxRetries) {
      this.setState(prevState => ({
        hasError: false,
        error: undefined,
        retryCount: prevState.retryCount + 1
      }));
    } else {
      // Max retries reached, reload the page
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      const canRetry = this.state.retryCount < this.maxRetries;

      return (
        <div className="flex items-center justify-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-yellow-800">
                Translation service temporarily unavailable
              </p>
              <p className="text-xs text-yellow-600 mt-1">
                {canRetry 
                  ? `Attempting to restore functionality... (${this.state.retryCount}/${this.maxRetries})`
                  : 'Please refresh the page to restore translation features'
                }
              </p>
            </div>
            {canRetry ? (
              <button
                onClick={this.handleRetry}
                className="flex items-center space-x-1 px-3 py-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 text-xs font-medium rounded transition-colors"
                aria-label="Retry translation service"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Retry</span>
              </button>
            ) : (
              <button
                onClick={() => window.location.reload()}
                className="flex items-center space-x-1 px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-xs font-medium rounded transition-colors"
                aria-label="Refresh page"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Refresh</span>
              </button>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Fallback Language Selector Component
 * Used when Google Translate fails to load
 */
export function FallbackLanguageSelector({ 
  currentLanguage, 
  onLanguageChange, 
  className = '' 
}: {
  currentLanguage: string;
  onLanguageChange: (lang: string) => void;
  className?: string;
}) {
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' }
  ];

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Globe className="h-4 w-4 text-gray-500" />
      <select
        value={currentLanguage}
        onChange={(e) => onLanguageChange(e.target.value)}
        className="text-sm border border-gray-300 rounded px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        aria-label="Select language"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
}