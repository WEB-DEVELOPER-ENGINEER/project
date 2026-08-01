import type { Metadata } from 'next';
import { getSiteSettings } from './data-access';
import { getLocale } from './locale-server';
import { companyName } from './company';

export async function generateMetadata(
  pageTitle?: string,
  pageDescription?: string,
  pageKeywords?: string[]
): Promise<Metadata> {
  const settings = await getSiteSettings();
  const locale = getLocale();
  // The site name is appended to every page title, so reading settings.company_name
  // directly (English-only in the DB) put 'JUSOR Translation Services' in the
  // <title> of every /ar page.
  const siteName = companyName(settings, locale);
  
  // Enforce correct production domain
  if (settings.site_url) {
    settings.site_url = settings.site_url.replace('jusor-translation.com', 'jusortrans.com');
  } else {
    settings.site_url = 'https://jusortrans.com';
  }
  
  if (settings.og_image && typeof settings.og_image === 'string') {
    settings.og_image = settings.og_image.replace('jusor-translation.com', 'jusortrans.com');
  }
  if (settings.twitter_image && typeof settings.twitter_image === 'string') {
    settings.twitter_image = settings.twitter_image.replace('jusor-translation.com', 'jusortrans.com');
  }
  
  // These site_settings values are English-only, so on /ar they have to be
  // ignored in favour of the locale-aware siteName rather than used as a
  // fallback — otherwise every Arabic page title ends in an English suffix.
  const titleTemplate = locale === 'ar'
    ? settings.meta_title_template_ar || `%s | ${siteName}`
    : settings.meta_title_template || `%s | ${siteName}`;
  const defaultTitle = locale === 'ar'
    ? settings.meta_default_title_ar || siteName
    : settings.meta_default_title || siteName;

  const title = pageTitle
    ? titleTemplate.replace('%s', pageTitle)
    : defaultTitle;
    
  const description = pageDescription || (locale === 'ar'
    ? settings.meta_description_ar || settings.company_description_ar
    : settings.meta_description || settings.company_description);
  const keywords = pageKeywords || settings.meta_keywords || [];
  
  return {
    metadataBase: new URL(settings.site_url),
    title: {
      default: title,
      template: titleTemplate
    },
    description,
    keywords,
    authors: [{ name: (locale === 'ar' ? settings.meta_author_ar : settings.meta_author) || siteName }],
    creator: (locale === 'ar' ? settings.meta_creator_ar : settings.meta_creator) || siteName,
    publisher: (locale === 'ar' ? settings.meta_publisher_ar : settings.meta_publisher) || siteName,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' }
      ],
      apple: '/apple-touch-icon.png',
      other: [
        { rel: 'mask-icon', url: '/jusor.png', color: '#e86e2a' }
      ]
    },
    manifest: '/manifest.json',
    themeColor: settings.theme_color || '#e86e2a',
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: settings.site_url,
      title: settings.og_title || title,
      description: settings.og_description || description,
      siteName,
      images: [{
        url: settings.og_image || '/jusor.png',
        width: 1200,
        height: 630,
        alt: settings.og_image_alt || `${siteName} Logo`,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: settings.twitter_title || title,
      description: settings.twitter_description || description,
      creator: settings.twitter_creator,
      images: [settings.twitter_image || '/jusor.png'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: settings.google_site_verification,
      yandex: settings.yandex_verification,
      yahoo: settings.yahoo_verification,
    },
    other: {
      'mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'default',
    },
  };
}