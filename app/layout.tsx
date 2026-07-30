import React from 'react';
import { initPerformanceMonitoring } from '@/lib/performance-monitor';
import './globals.css';
import { Analytics } from '@/components/analytics/analytics';
import { CookieConsent } from '@/components/compliance/cookie-consent';
import { JsonLd } from '@/components/seo/json-ld';
import { GlobalWhatsAppButton } from '@/components/ui/global-whatsapp-button';
import { ClientProvider, ErrorBoundary } from '@/components/providers';
import { cn } from '@/lib/utils';
import { generateMetadata as generateSiteMetadata } from '@/lib/metadata';
import { getSiteSettings, getServices, getCompanyMetrics } from '@/lib/data-access';
import dynamic from 'next/dynamic';
import Script from 'next/script';


import { LanguageProvider } from '@/components/providers/LanguageProvider';
import { isRtl } from '@/lib/locale';
import { getLocale } from '@/lib/locale-server';

// Fallback to system fonts due to network issues
const inter = { variable: '--font-inter', className: 'font-sans' };

export async function generateMetadata() {
  return await generateSiteMetadata();
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = getLocale();
  const [siteSettings, services, certifications] = await Promise.all([
    getSiteSettings(),
    getServices(undefined, undefined, locale),
    getCompanyMetrics('achievements', locale)
  ]);

  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <html lang={locale} dir={isRtl(locale) ? 'rtl' : 'ltr'} className={cn(inter.variable)}>
      <head>
        {/* Google Tag Manager - Initialize dataLayer before GTM loads */}
        {gtmId && (
          <>
            <Script
              id="gtm-base"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  window.gtag = gtag;
                `,
              }}
            />
            <Script
              id="gtm-script"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                  })(window,document,'script','dataLayer','${gtmId}');
                `,
              }}
            />
          </>
        )}
      </head>
      <body className={cn(
        'min-h-screen bg-background font-sans antialiased',
        inter.className
      )}>
        {/* Google Tag Manager (noscript) */}
        {gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
              title="Google Tag Manager"
            />
          </noscript>
        )}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <ErrorBoundary>
          <LanguageProvider initialLocale={locale}>
            <ClientProvider>
              <JsonLd siteSettings={siteSettings} services={services} certifications={certifications} />
              {/* Note: each page renders its own <main id="main-content">,
                  so this wrapper must not also be a <main> — nesting two
                  <main> landmarks per page is invalid HTML and confuses
                  screen readers. */}
              <div className="flex min-h-screen flex-col">
                <div className="flex-1">
                  {children}
                </div>
              </div>
              <GlobalWhatsAppButton siteSettings={siteSettings} />
              <Analytics />
              <CookieConsent />
            </ClientProvider>
          </LanguageProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
