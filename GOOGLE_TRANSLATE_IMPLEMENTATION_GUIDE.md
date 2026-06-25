# Google Translate Implementation Guide

A comprehensive guide for integrating Google Translate functionality into your React/Next.js application.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [File Structure](#file-structure)
4. [Step-by-Step Implementation](#step-by-step-implementation)
5. [Configuration](#configuration)
6. [Usage Examples](#usage-examples)
7. [Troubleshooting](#troubleshooting)
8. [Security Considerations](#security-considerations)

## Overview

This implementation provides a robust Google Translate integration with:
- Custom language selector UI
- Error handling and fallback mechanisms
- CSP (Content Security Policy) compatibility
- RTL (Right-to-Left) language support
- TypeScript support
- Accessibility features

## Prerequisites

Before implementing Google Translate, ensure you have:

- React 18+ or Next.js 13+ application
- TypeScript configured (recommended)
- CSS/Tailwind CSS for styling
- `lucide-react` for icons (or replace with your preferred icon library)

### Important: No API Keys Required! 🎉

This implementation uses **Google Translate's free public widget** that doesn't require:
- ❌ API keys
- ❌ Google Cloud account 
- ❌ Authentication
- ❌ Billing setup
- ❌ Rate limiting concerns

The widget loads directly from `https://translate.google.com/translate_a/element.js` and provides translation functionality without any credentials.

### Required Dependencies

```bash
npm install lucide-react
# or
yarn add lucide-react
```

### Limitations of Free Widget vs Paid API

**Free Widget (what this guide implements):**
- ✅ No cost, no setup
- ✅ Automatic translation of entire page
- ✅ 100+ supported languages
- ❌ Limited customization
- ❌ Google branding (hidden in this implementation)
- ❌ No usage analytics
- ❌ Dependent on Google's public service availability

**Paid Google Translate API (alternative):**
- ❌ Requires API key and billing
- ❌ Costs per character translated
- ✅ Full customization control
- ✅ Translation of specific text segments
- ✅ Usage analytics and quotas
- ✅ Enterprise support

## File Structure

Create the following file structure in your project:

```
components/
├── translate/
│   ├── index.ts
│   ├── google-translate-provider.tsx
│   ├── language-selector.tsx
│   ├── TranslateErrorBoundary.tsx
│   ├── google-translate-csp.ts
│   ├── google-translate-direct.tsx
│   └── google-translate-styles.css
├── ui/
│   ├── button.tsx
│   └── select.tsx (shadcn/ui components)
hooks/
├── use-translation.ts
types/
├── google-translate.d.ts
```

## Step-by-Step Implementation

### Step 1: Create Type Definitions

Create `types/google-translate.d.ts`:

```typescript
// Global type declarations for Google Translate
declare global {
  interface Window {
    google?: {
      translate?: {
        TranslateElement: new (options: any, elementId: string) => void;
        InlineLayout?: {
          SIMPLE: number;
          HORIZONTAL: number;
          VERTICAL: number;
        };
        [key: string]: any;
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

export {};
```

### Step 2: Create CSP Configuration

Create `components/translate/google-translate-csp.ts`:

```typescript
/**
 * Comprehensive CSP configuration for Google Translate
 * Based on actual domains used by Google Translate service
 */

export const GOOGLE_TRANSLATE_CSP_DOMAINS = {
  // Script sources
  scriptSrc: [
    'https://translate.google.com',
    'https://translate.googleapis.com', 
    'https://translate-pa.googleapis.com',
    'https://www.google.com',
    'https://www.gstatic.com'
  ],
  
  // Style sources  
  styleSrc: [
    'https://translate.googleapis.com',
    'https://www.gstatic.com',
    'https://fonts.googleapis.com',
    'https://translate.google.com'
  ],
  
  // Font sources
  fontSrc: [
    'https://fonts.gstatic.com',
    'https://www.gstatic.com'
  ],
  
  // Connection sources
  connectSrc: [
    'https://translate.googleapis.com',
    'https://translate.google.com',
    'https://translate-pa.googleapis.com'
  ],
  
  // Frame sources
  frameSrc: [
    'https://translate.google.com',
    'https://translate.googleapis.com'
  ],
  
  // Image sources
  imgSrc: [
    'https://www.gstatic.com',
    'https://translate.google.com',
    'https://ssl.gstatic.com'
  ]
};

/**
 * Generate production-ready CSP policy for Google Translate
 */
export function generateGoogleTranslateCSP() {
  const { scriptSrc, styleSrc, fontSrc, connectSrc, frameSrc, imgSrc } = GOOGLE_TRANSLATE_CSP_DOMAINS;
  
  return [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline' 'unsafe-eval' ${scriptSrc.join(' ')}`,
    `script-src-elem 'self' 'unsafe-inline' ${scriptSrc.join(' ')}`,
    `style-src 'self' 'unsafe-inline' ${styleSrc.join(' ')}`,
    `style-src-elem 'self' 'unsafe-inline' ${styleSrc.join(' ')}`,
    `font-src 'self' data: https: ${fontSrc.join(' ')}`,
    `img-src 'self' data: https: blob: ${imgSrc.join(' ')}`,
    `connect-src 'self' ${connectSrc.join(' ')}`,
    `frame-src 'self' ${frameSrc.join(' ')}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "worker-src 'self' blob:"
  ].join('; ');
}
```

### Step 3: Create Error Boundary

Create `components/translate/TranslateErrorBoundary.tsx`:

```tsx
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
    console.error('Translation Error Boundary caught an error:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString()
    });

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
```

### Step 4: Create CSS Styles

Create `components/translate/google-translate-styles.css`:

```css
/* Hide Google Translate default UI elements */
.goog-te-banner-frame,
.goog-te-gadget,
.goog-te-combo,
.goog-te-menu-frame,
.skiptranslate {
  display: none !important;
}

/* Hide the Google Translate top banner */
body {
  top: 0 !important;
}

/* Remove Google Translate iframe styling */
.goog-te-menu-value {
  display: none !important;
}

/* Hide Google Translate attribution */
.goog-logo-link {
  display: none !important;
}

/* Ensure proper RTL support for Arabic */
[dir="rtl"] {
  text-align: right;
}

[dir="rtl"] .container {
  direction: rtl;
}

/* Prevent layout shifts during translation */
.notranslate {
  white-space: nowrap;
}

/* Custom styles for translated content */
.translated-content {
  transition: opacity 0.3s ease-in-out;
}

.translating {
  opacity: 0.7;
}

/* Ensure Google Translate doesn't interfere with our styling */
.goog-te-spinner-pos {
  display: none !important;
}

/* Hide Google Translate error messages */
.goog-te-error {
  display: none !important;
}

/* Fix for Google Translate widget positioning */
#google_translate_element {
  position: absolute !important;
  left: -9999px !important;
  top: -9999px !important;
  visibility: hidden !important;
  opacity: 0 !important;
  pointer-events: none !important;
}

/* Ensure proper font rendering for Arabic text */
[lang="ar"],
.lang-ar {
  font-family: 'Noto Sans Arabic', 'Arial Unicode MS', sans-serif;
  direction: rtl;
  text-align: right;
}

/* Language-specific styles */
.lang-ar * {
  direction: rtl;
  text-align: right;
}

.lang-en * {
  direction: ltr;
  text-align: left;
}

/* Smooth transition for language changes */
body {
  transition: direction 0.3s ease;
}
```
