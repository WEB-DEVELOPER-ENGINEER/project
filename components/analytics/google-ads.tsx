'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';

// Google Ads Conversion ID
const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || 'AW-11329570367';

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export function GoogleAds() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Track page views on route changes
    const handleRouteChange = () => {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('config', GOOGLE_ADS_ID, {
          page_path: pathname,
        });
      }
    };

    handleRouteChange();
  }, [pathname, searchParams]);

  return (
    <>
      {/* Initialize dataLayer and gtag function if not already present */}
      <Script
        id="google-ads-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            if (typeof window.gtag === 'undefined') {
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
            }
            window.gtag('js', new Date());
            window.gtag('config', '${GOOGLE_ADS_ID}', {
              'allow_enhanced_conversions': true,
              'send_page_view': true
            });
          `,
        }}
      />
      {/* Load Google Ads script */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
        strategy="afterInteractive"
      />
    </>
  );
}

// Google Ads conversion tracking functions
export const trackGoogleAdsConversion = (
  conversionLabel: string,
  value?: number,
  currency: string = 'USD'
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      send_to: `${GOOGLE_ADS_ID}/${conversionLabel}`,
      value: value,
      currency: currency,
    });
  }
};

// Track form submissions
export const trackFormSubmission = (formName: string, value?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'generate_lead', {
      event_category: 'engagement',
      event_label: formName,
      value: value,
    });
  }
};

// Track button clicks
export const trackButtonClick = (buttonName: string, location: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'click', {
      event_category: 'engagement',
      event_label: buttonName,
      event_location: location,
    });
  }
};

// Track phone calls
export const trackPhoneCall = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      send_to: `${GOOGLE_ADS_ID}/phone_call`,
      event_category: 'contact',
      event_label: 'phone_call',
    });
  }
};

// Track WhatsApp clicks
export const trackWhatsAppClick = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      send_to: `${GOOGLE_ADS_ID}/whatsapp_click`,
      event_category: 'contact',
      event_label: 'whatsapp',
    });
  }
};
