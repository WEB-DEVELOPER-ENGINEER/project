/**
 * Analytics Event Tracking Utilities
 * Centralized event tracking for Google Tag Manager and other analytics platforms
 */

// Event types for better type safety
export type ContactMethod = 'phone' | 'email' | 'whatsapp' | 'form';
export type EventCategory = 'contact' | 'engagement' | 'conversion' | 'navigation';

interface EventParams {
  event_category?: string;
  event_label?: string;
  value?: number;
  [key: string]: any;
}

/**
 * Send event to Google Tag Manager dataLayer
 */
export const pushToDataLayer = (eventName: string, params?: EventParams) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...params,
    });
  }
};

/**
 * Track contact interactions (phone, email, WhatsApp)
 */
export const trackContactClick = (
  method: ContactMethod,
  destination: string,
  location?: string
) => {
  const eventName = `contact_${method}`;
  
  pushToDataLayer(eventName, {
    event_category: 'contact',
    event_label: location || 'unknown',
    contact_method: method,
    contact_destination: destination,
    timestamp: new Date().toISOString(),
  });

  // Also track with gtag if available
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      event_category: 'contact',
      event_label: location || 'unknown',
      contact_method: method,
    });
  }
};

/**
 * Track WhatsApp button clicks
 */
export const trackWhatsAppClick = (phoneNumber: string, location?: string) => {
  trackContactClick('whatsapp', phoneNumber, location);
};

/**
 * Track phone call clicks
 */
export const trackPhoneClick = (phoneNumber: string, location?: string) => {
  trackContactClick('phone', phoneNumber, location);
};

/**
 * Track email clicks
 */
export const trackEmailClick = (email: string, location?: string) => {
  trackContactClick('email', email, location);
};

/**
 * Track form submissions
 */
export const trackFormSubmission = (formName: string, formData?: Record<string, any>) => {
  pushToDataLayer('form_submission', {
    event_category: 'contact',
    event_label: formName,
    form_name: formName,
    ...formData,
  });

  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'generate_lead', {
      event_category: 'contact',
      event_label: formName,
    });
  }
};

/**
 * Track CTA button clicks
 */
export const trackCTAClick = (ctaName: string, location?: string) => {
  pushToDataLayer('cta_click', {
    event_category: 'engagement',
    event_label: location || 'unknown',
    cta_name: ctaName,
  });

  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'cta_click', {
      event_category: 'engagement',
      event_label: location || 'unknown',
    });
  }
};

/**
 * Track conversions
 */
export const trackConversion = (conversionType: string, value?: number) => {
  pushToDataLayer('conversion', {
    event_category: 'conversion',
    event_label: conversionType,
    value: value,
    conversion_type: conversionType,
  });

  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      event_category: 'conversion',
      event_label: conversionType,
      value: value,
    });
  }
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}
