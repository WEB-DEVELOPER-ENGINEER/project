/**
 * Comprehensive CSP configuration for Google Translate
 * Based on actual domains used by Google Translate service
 */

export const GOOGLE_TRANSLATE_CSP_DOMAINS = {
  // Script sources
  scriptSrc: [
    'https://translate.google.com',
    'https://translate.googleapis.com', 
    'https://translate-pa.googleapis.com',
    'https://www.google.com',
    'https://www.gstatic.com',
    'https://www.googletagmanager.com',
    'https://tagmanager.google.com',
    'https://googleads.g.doubleclick.net',
    'https://www.googleadservices.com'
  ],
  
  // Style sources  
  styleSrc: [
    'https://translate.googleapis.com',
    'https://www.gstatic.com',
    'https://fonts.googleapis.com',
    'https://translate.google.com',
    'https://tagmanager.google.com'
  ],
  
  // Font sources
  fontSrc: [
    'https://fonts.gstatic.com',
    'https://www.gstatic.com'
  ],
  
  // Connection sources
  connectSrc: [
    'https://translate.googleapis.com',
    'https://translate.google.com',
    'https://translate-pa.googleapis.com',
    'https://www.google-analytics.com',
    'https://www.googletagmanager.com',
    'https://analytics.google.com',
    'https://www.google.com',
    'https://googleads.g.doubleclick.net',
    'https://stats.g.doubleclick.net'
  ],
  
  // Frame sources
  frameSrc: [
    'https://translate.google.com',
    'https://translate.googleapis.com',
    'https://bid.g.doubleclick.net'
  ],
  
  // Image sources
  imgSrc: [
    'https://www.gstatic.com',
    'https://translate.google.com',
    'https://ssl.gstatic.com',
    'https://www.googletagmanager.com',
    'https://googleads.g.doubleclick.net',
    'https://www.google.com'
  ]
};

/**
 * Generate production-ready CSP policy for Google Translate
 */
export function generateGoogleTranslateCSP() {
  const { scriptSrc, styleSrc, fontSrc, connectSrc, frameSrc, imgSrc } = GOOGLE_TRANSLATE_CSP_DOMAINS;
  
  return [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline' 'unsafe-eval' ${scriptSrc.join(' ')}`,
    `script-src-elem 'self' 'unsafe-inline' ${scriptSrc.join(' ')}`,
    `style-src 'self' 'unsafe-inline' ${styleSrc.join(' ')}`,
    `style-src-elem 'self' 'unsafe-inline' ${styleSrc.join(' ')}`,
    `font-src 'self' data: https: ${fontSrc.join(' ')}`,
    `img-src 'self' data: https: blob: ${imgSrc.join(' ')}`,
    `connect-src 'self' ${connectSrc.join(' ')}`,
    `frame-src 'self' ${frameSrc.join(' ')}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "worker-src 'self' blob:"
  ].join('; ');
}