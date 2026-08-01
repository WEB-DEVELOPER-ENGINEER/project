/**
 * Locale-aware date formatting for user-facing dates.
 *
 * date-fns `format()` defaults to English month names, so published dates
 * rendered as "Jul 20, 2026" even on /ar pages. A single English month
 * abbreviation slips past a word-count-based leak audit, so this is easy to
 * miss — always format visible dates through here.
 */

import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import type { Locale } from '@/lib/locale';

export function formatDate(date: Date | string, pattern: string, locale: Locale): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, pattern, locale === 'ar' ? { locale: ar } : undefined);
}
