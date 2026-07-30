/**
 * Server-only locale detection (uses next/headers, so this file must never
 * be imported from a client component — see lib/locale.ts for the
 * client-safe helpers).
 *
 * middleware.ts rewrites /ar/* requests to their unprefixed equivalent and
 * sets an `x-locale` request header so Server Components (page files, the
 * root layout) know which language to render — without needing every route
 * to physically live under an app/[locale]/ folder. See middleware.ts for
 * the rewrite logic.
 */

import { headers } from 'next/headers';
import { Locale } from './locale';

export function getLocale(): Locale {
  const locale = headers().get('x-locale');
  return locale === 'ar' ? 'ar' : 'en';
}
