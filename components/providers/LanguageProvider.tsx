'use client';

import React, { createContext, useContext } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Locale, translations, TranslationDictionary } from '@/lib/i18n/translations';
import { localizedPath } from '@/lib/locale';

interface LanguageContextType {
  locale: Locale;
  dir: 'ltr' | 'rtl';
  isRtl: boolean;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  t: (keyPath: string) => string;
  dictionary: TranslationDictionary;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

/**
 * The locale is real routing state now (see middleware.ts + lib/locale.ts),
 * not just a client-side preference: /ar/* URLs serve real, server-fetched
 * Arabic content, while unprefixed URLs serve English. `initialLocale` is
 * passed down from the root layout (which reads it from the `x-locale`
 * request header) so this provider always matches what was actually
 * server-rendered — switching languages navigates to the equivalent /ar (or
 * unprefixed) URL rather than only flipping client state, since the page's
 * real content differs per locale, not just its UI chrome.
 */
export function LanguageProvider({ children, initialLocale }: { children: React.ReactNode; initialLocale: Locale }) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = initialLocale;

  const setLocale = (newLocale: Locale) => {
    if (newLocale === locale) return;
    router.push(localizedPath(pathname, newLocale));
  };

  const toggleLocale = () => {
    setLocale(locale === 'en' ? 'ar' : 'en');
  };

  const dictionary = translations[locale] || translations.en;

  const t = (keyPath: string): string => {
    const keys = keyPath.split('.');
    let current: any = dictionary;

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        // Fallback to English dictionary if key is missing in active locale
        let fallback: any = translations.en;
        for (const fk of keys) {
          if (fallback && typeof fallback === 'object' && fk in fallback) {
            fallback = fallback[fk];
          } else {
            return keyPath;
          }
        }
        return typeof fallback === 'string' ? fallback : keyPath;
      }
    }

    return typeof current === 'string' ? current : keyPath;
  };

  const isRtl = locale === 'ar';
  const dir = isRtl ? 'rtl' : 'ltr';

  return (
    <LanguageContext.Provider value={{ locale, dir, isRtl, setLocale, toggleLocale, t, dictionary }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
