import type { Metadata } from 'next';
import { getSiteSettings } from './data-access';

export async function generateMetadata(
  pageTitle?: string,
  pageDescription?: string,
  pageKeywords?: string[]
): Promise<Metadata> {
  const settings = await getSiteSettings();
  
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
  
  const title = pageTitle 
    ? settings.meta_title_template?.replace('%s', pageTitle) || `${pageTitle} | ${settings.company_name}`
    : settings.meta_default_title || settings.company_name;
    
  const description = pageDescription || settings.meta_description || settings.company_description;
  const keywords = pageKeywords || settings.meta_keywords || [];
  
  return {
    metadataBase: new URL(settings.site_url),
    title: {
      default: title,
      template: settings.meta_title_template || '%s | ' + settings.company_name
    },
    description,
    keywords,
    authors: [{ name: settings.meta_author || settings.company_name }],
    creator: settings.meta_creator || settings.company_name,
    publisher: settings.meta_publisher || settings.company_name,
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
      siteName: settings.company_name,
      images: [{
        url: settings.og_image || '/jusor.png',
        width: 1200,
        height: 630,
        alt: settings.og_image_alt || `${settings.company_name} Logo`,
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