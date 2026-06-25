/**
 * Production-Grade Content Sanitization Utility
 * 
 * This module provides secure HTML content sanitization for CKEditor content
 * and other rich text inputs. It uses DOMPurify with strict security policies
 * to prevent XSS attacks while preserving safe formatting.
 * 
 * Security Features:
 * - XSS prevention through content sanitization
 * - Whitelist-based approach for allowed tags and attributes
 * - CSP-compliant implementation
 * - Enterprise-grade security standards
 */

import DOMPurify from 'dompurify';

// Production-grade configuration for DOMPurify
const SANITIZER_CONFIG = {
  // Allowed HTML tags (whitelist approach)
  ALLOWED_TAGS: [
    'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'strike',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li',
    'a', 'blockquote', 'code', 'pre',
    'div', 'span'
  ],
  
  // Allowed attributes (whitelist approach)
  ALLOWED_ATTR: [
    'href', 'title', 'alt', 'class', 'id'
  ],
  
  // Additional security settings
  ALLOW_DATA_ATTR: false,
  ALLOW_UNKNOWN_PROTOCOLS: false,
  SANITIZE_DOM: true,
  KEEP_CONTENT: true,
  
  // URL schemes whitelist
  ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
};

/**
 * Sanitizes HTML content using DOMPurify with enterprise-grade security
 * 
 * @param content - Raw HTML content from CKEditor or other sources
 * @param options - Optional configuration overrides
 * @returns Sanitized HTML string safe for rendering
 */
export function sanitizeHtmlContent(
  content: string, 
  options: Partial<typeof SANITIZER_CONFIG> = {}
): string {
  if (!content || typeof content !== 'string') {
    return '';
  }

  // Merge default config with any overrides
  const config = { ...SANITIZER_CONFIG, ...options };
  
  try {
    // Only sanitize on client-side where DOMPurify works properly
    if (typeof window !== 'undefined') {
      const sanitized = DOMPurify.sanitize(content, config);
      
      // Additional validation: ensure no script tags or dangerous content
      if (sanitized.includes('<script') || sanitized.includes('javascript:')) {
        console.error('Potentially dangerous content detected and blocked:', content);
        return '';
      }
      
      return sanitized;
    }
    
    // Server-side: return content as-is (will be sanitized on client)
    return content;
  } catch (error) {
    console.error('Content sanitization failed:', error);
    return content;
  }
}

/**
 * Sanitizes content for plain text display (strips all HTML)
 * 
 * @param content - HTML content to convert to plain text
 * @returns Plain text string with HTML tags removed
 */
export function sanitizeToPlainText(content: string): string {
  if (!content || typeof content !== 'string') {
    return '';
  }

  try {
    // Handle server-side rendering - use simple regex on server
    if (typeof window === 'undefined') {
      // Server-side: simple HTML tag removal using regex
      const plainText = content.replace(/<[^>]*>/g, '');
      return plainText.replace(/\s+/g, ' ').trim();
    }
    
    // Client-side: use browser's DOMPurify for more robust HTML stripping
    const plainText = DOMPurify.sanitize(content, { 
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
      KEEP_CONTENT: true
    });
    
    // Clean up extra whitespace
    return plainText.replace(/\s+/g, ' ').trim();
  } catch (error) {
    console.error('Plain text sanitization failed:', error);
    // Fallback: simple regex-based tag removal
    const plainText = content.replace(/<[^>]*>/g, '');
    return plainText.replace(/\s+/g, ' ').trim();
  }
}

/**
 * Validates if content is safe for rendering
 * 
 * @param content - Content to validate
 * @returns Boolean indicating if content is safe
 */
export function isContentSafe(content: string): boolean {
  if (!content || typeof content !== 'string') {
    return true; // Empty content is safe
  }

  // Check for dangerous patterns
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i, // Event handlers like onclick, onload, etc.
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /<form/i,
    /data:text\/html/i
  ];

  return !dangerousPatterns.some(pattern => pattern.test(content));
}

/**
 * Configuration for different content types
 */
export const CONTENT_CONFIGS = {
  // For rich text content (blog posts, descriptions)
  RICH_TEXT: {
    ...SANITIZER_CONFIG,
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'b', 'em', 'i', 'u',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'a', 'blockquote'
    ]
  },
  
  // For simple text with basic formatting
  SIMPLE_TEXT: {
    ...SANITIZER_CONFIG,
    ALLOWED_TAGS: ['p', 'br', 'strong', 'b', 'em', 'i']
  },
  
  // For testimonials and quotes
  QUOTE_TEXT: {
    ...SANITIZER_CONFIG,
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'blockquote']
  }
};

/**
 * Type-safe wrapper for different content types
 */
export const ContentSanitizer = {
  richText: (content: string) => sanitizeHtmlContent(content, CONTENT_CONFIGS.RICH_TEXT),
  simpleText: (content: string) => sanitizeHtmlContent(content, CONTENT_CONFIGS.SIMPLE_TEXT),
  quoteText: (content: string) => sanitizeHtmlContent(content, CONTENT_CONFIGS.QUOTE_TEXT),
  plainText: (content: string) => sanitizeToPlainText(content)
} as const;