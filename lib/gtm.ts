/**
 * Google Tag Manager Helper
 * Type-safe dataLayer event tracking
 */

// Extend Window interface to include dataLayer
declare global {
  interface Window {
    dataLayer: any[];
  }
}

/**
 * GTM Event Types
 */
export interface GTMEvent {
  event: string;
  [key: string]: any;
}

export interface GTMPageView {
  event: 'page_view';
  page_path: string;
  page_title: string;
  page_location?: string;
}

export interface GTMButtonClick {
  event: 'button_click';
  button_name: string;
  button_location: string;
  button_type?: string;
}

export interface GTMFormSubmission {
  event: 'form_submission';
  form_name: string;
  form_location: string;
  form_type?: string;
}

export interface GTMLanguageChange {
  event: 'language_change';
  language: string;
  previous_language?: string;
}

export interface GTMVideoEvent {
  event: 'video_start' | 'video_progress' | 'video_complete';
  video_title: string;
  video_provider: string;
  video_url?: string;
  video_percent?: number;
}

export interface GTMCustomEvent {
  event: string;
  category?: string;
  action?: string;
  label?: string;
  value?: number;
}

/**
 * Push event to GTM dataLayer
 */
export const pushToDataLayer = (data: GTMEvent): void => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push(data);
  } else if (process.env.NODE_ENV === 'development') {
    console.log('[GTM] Event:', data);
  }
};

/**
 * Track page view
 */
export const trackPageView = (path?: string, title?: string): void => {
  if (typeof window === 'undefined') return;

  pushToDataLayer({
    event: 'page_view',
    page_path: path || window.location.pathname,
    page_title: title || document.title,
    page_location: window.location.href,
  });
};

/**
 * Track button click
 */
export const trackButtonClick = (
  buttonName: string,
  buttonLocation: string,
  buttonType?: string
): void => {
  pushToDataLayer({
    event: 'button_click',
    button_name: buttonName,
    button_location: buttonLocation,
    button_type: buttonType,
  });
};

/**
 * Track form submission
 */
export const trackFormSubmission = (
  formName: string,
  formLocation: string,
  formType?: string
): void => {
  pushToDataLayer({
    event: 'form_submission',
    form_name: formName,
    form_location: formLocation,
    form_type: formType,
  });
};

/**
 * Track language change
 */
export const trackLanguageChange = (
  language: string,
  previousLanguage?: string
): void => {
  pushToDataLayer({
    event: 'language_change',
    language,
    previous_language: previousLanguage,
  });
};

/**
 * Track video events
 */
export const trackVideoEvent = (
  eventType: 'video_start' | 'video_progress' | 'video_complete',
  videoTitle: string,
  videoProvider: string,
  videoUrl?: string,
  videoPercent?: number
): void => {
  pushToDataLayer({
    event: eventType,
    video_title: videoTitle,
    video_provider: videoProvider,
    video_url: videoUrl,
    video_percent: videoPercent,
  });
};

/**
 * Track custom event
 */
export const trackCustomEvent = (
  eventName: string,
  category?: string,
  action?: string,
  label?: string,
  value?: number
): void => {
  pushToDataLayer({
    event: eventName,
    category,
    action,
    label,
    value,
  });
};

/**
 * Track outbound link click
 */
export const trackOutboundLink = (url: string, linkText?: string): void => {
  pushToDataLayer({
    event: 'outbound_link_click',
    link_url: url,
    link_text: linkText,
    link_domain: new URL(url).hostname,
  });
};

/**
 * Track scroll depth
 */
export const trackScrollDepth = (percent: number): void => {
  pushToDataLayer({
    event: 'scroll_depth',
    scroll_percent: percent,
  });
};

/**
 * Track search
 */
export const trackSearch = (searchTerm: string, resultsCount?: number): void => {
  pushToDataLayer({
    event: 'search',
    search_term: searchTerm,
    results_count: resultsCount,
  });
};

/**
 * Track file download
 */
export const trackFileDownload = (
  fileName: string,
  fileType: string,
  fileUrl?: string
): void => {
  pushToDataLayer({
    event: 'file_download',
    file_name: fileName,
    file_type: fileType,
    file_url: fileUrl,
  });
};

/**
 * Track error
 */
export const trackError = (
  errorMessage: string,
  errorType?: string,
  errorLocation?: string
): void => {
  pushToDataLayer({
    event: 'error',
    error_message: errorMessage,
    error_type: errorType,
    error_location: errorLocation,
  });
};

/**
 * Initialize GTM with custom configuration
 */
export const initGTM = (gtmId: string): void => {
  if (typeof window === 'undefined') return;

  // Initialize dataLayer if not exists
  window.dataLayer = window.dataLayer || [];

  // Push GTM initialization
  window.dataLayer.push({
    'gtm.start': new Date().getTime(),
    event: 'gtm.js',
  });

  // Load GTM script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;
  document.head.appendChild(script);
};

/**
 * Check if GTM is loaded
 */
export const isGTMLoaded = (): boolean => {
  return typeof window !== 'undefined' && Array.isArray(window.dataLayer);
};

/**
 * Get GTM container ID from environment
 */
export const getGTMId = (): string | undefined => {
  return process.env.NEXT_PUBLIC_GTM_ID;
};
