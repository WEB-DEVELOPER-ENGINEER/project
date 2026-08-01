/**
 * Locale-aware company identity.
 *
 * `site_settings.company_name` / `company_address` hold the English values,
 * so reading them directly leaks English onto every /ar page — in the title
 * suffix, the footer copyright line, and the privacy contact block. These
 * helpers prefer the `*_ar` setting when it exists and otherwise fall back
 * to the real Arabic trading name and address.
 *
 * Client-safe: no `next/headers` import, so components pass `locale` in
 * from `useLanguage()` and server code from `getLocale()`.
 */

import type { Locale } from '@/lib/locale';

/** Registered trading name: "Jusor Al Kalimate" / جسور الكلمات. */
export const COMPANY_NAME_EN = 'JUSOR Translation Services';
export const COMPANY_NAME_AR = 'جسور الكلمات لخدمات الترجمة';

export const COMPANY_ADDRESS_EN =
  'Abu Saif Business Center - Al-Kazim Building - Block A - M Floor - Office 40B, Abu Hail, Dubai, United Arab Emirates';
export const COMPANY_ADDRESS_AR =
  'مركز أبو سيف للأعمال - بناية الكاظم - بلوك A - الطابق الميزانين - مكتب 40B، أبو هيل، دبي، الإمارات العربية المتحدة';

type Settings = Record<string, any> | null | undefined;

/** Canonical production origin, used when NEXT_PUBLIC_SITE_URL is unset. */
export const DEFAULT_SITE_URL = 'https://jusortrans.com';

/**
 * Resolves the site origin for canonical/OG URLs, with no trailing slash.
 *
 * `NEXT_PUBLIC_SITE_URL` is not set in this project's env files, so pages
 * that interpolated it directly emitted URLs like
 * `https://jusortrans.com/undefined/contact` — a broken canonical on every
 * affected page. Always go through this helper instead.
 */
export function siteUrl(siteSettings?: Settings): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL || siteSettings?.site_url || DEFAULT_SITE_URL;
  return raw.replace(/\/$/, '');
}

export function companyName(siteSettings: Settings, locale: Locale): string {
  return locale === 'ar'
    ? siteSettings?.company_name_ar || COMPANY_NAME_AR
    : siteSettings?.company_name || COMPANY_NAME_EN;
}

export function companyAddress(siteSettings: Settings, locale: Locale): string {
  return locale === 'ar'
    ? siteSettings?.company_address_ar || COMPANY_ADDRESS_AR
    : siteSettings?.company_address || COMPANY_ADDRESS_EN;
}
