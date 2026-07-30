/**
 * Universal (client + server safe) locale helpers. Server-only helpers that
 * need next/headers live in lib/locale-server.ts instead, since importing
 * next/headers into a file that gets pulled into client components breaks
 * the client bundle.
 */

export type Locale = 'en' | 'ar';

export function isRtl(locale: Locale): boolean {
  return locale === 'ar';
}

/**
 * Builds the /ar-prefixed equivalent of a given unprefixed path (or strips
 * the prefix to get back to English), for use in hreflang alternates and
 * the language switcher.
 */
export function localizedPath(path: string, locale: Locale): string {
  const clean = path.startsWith('/ar/') ? path.slice(3) : path === '/ar' ? '/' : path;
  if (locale === 'en') return clean;
  return clean === '/' ? '/ar' : `/ar${clean}`;
}
