'use client';

import React from 'react';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
  variant?: 'compact' | 'full';
  className?: string;
}

export function LanguageSwitcher({ variant = 'compact', className = '' }: LanguageSwitcherProps) {
  const { locale, toggleLocale, setLocale } = useLanguage();

  if (variant === 'full') {
    return (
      <div className={`flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg ${className}`}>
        <button
          type="button"
          onClick={() => setLocale('en')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
            locale === 'en'
              ? 'bg-white dark:bg-gray-900 text-brand-blue shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
          }`}
          aria-label="Switch to English"
        >
          <span className="text-sm">🇺🇸</span>
          <span>English</span>
        </button>
        <button
          type="button"
          onClick={() => setLocale('ar')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
            locale === 'ar'
              ? 'bg-white dark:bg-gray-900 text-brand-blue shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
          }`}
          aria-label="التحويل إلى العربية"
        >
          <span className="text-sm">🇸🇦</span>
          <span>العربية</span>
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleLocale}
      className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-gray-700 dark:text-gray-200 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full border border-gray-200 dark:border-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue ${className}`}
      title={locale === 'en' ? 'التحويل إلى العربية' : 'Switch to English'}
      aria-label="Toggle language"
    >
      <Globe className="w-3.5 h-3.5 text-brand-blue" />
      <span>{locale === 'en' ? 'العربية' : 'English'}</span>
    </button>
  );
}
