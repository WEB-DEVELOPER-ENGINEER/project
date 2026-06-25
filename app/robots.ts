import { MetadataRoute } from 'next';
import { getSiteSettings } from '@/lib/data-access';

export default async function robots(): Promise<MetadataRoute.Robots> {
  let siteUrl = 'https://jusortrans.com';
  try {
    const settings = await getSiteSettings();
    if (settings && settings.site_url) {
      siteUrl = settings.site_url;
    }
  } catch (error) {
    console.error('Error fetching site settings for robots:', error);
  }

  // Clean siteUrl and environment variables if they point to the incorrect domain
  if (siteUrl.includes('jusor-translation.com')) {
    siteUrl = siteUrl.replace('jusor-translation.com', 'jusortrans.com');
  }

  let baseUrl = siteUrl;
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
    baseUrl = envUrl.includes('jusor-translation.com') 
      ? envUrl.replace('jusor-translation.com', 'jusortrans.com') 
      : envUrl;
  }
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/_next/',
          '/private/',
        ],
      },
      // AI Crawlers - ALLOWED for AI search visibility
      {
        userAgent: 'GPTBot',
        allow: '/',
      },
      {
        userAgent: 'OAI-SearchBot',
        allow: '/',
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/',
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
      },
      {
        userAgent: 'Google-Extended',
        allow: '/',
      },
      {
        userAgent: 'GoogleOther',
        allow: '/',
      },
      {
        userAgent: 'Applebot-Extended',
        allow: '/',
      },
      {
        userAgent: 'Amazonbot',
        allow: '/',
      },
      {
        userAgent: 'FacebookBot',
        allow: '/',
      },
      {
        userAgent: 'cohere-ai',
        allow: '/',
      },
      // AI Crawlers - BLOCKED (aggressive/low value or training-only)
      {
        userAgent: 'Bytespider',
        disallow: '/',
      },
      {
        userAgent: 'CCBot',
        disallow: '/',
      },
      {
        userAgent: 'anthropic-ai',
        disallow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}