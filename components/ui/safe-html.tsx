/**
 * Safe HTML Rendering Component
 * 
 * This component provides a secure way to render HTML content from CKEditor
 * and other rich text sources. It uses DOMPurify for sanitization and follows
 * enterprise-grade security practices.
 */

'use client';

import React from 'react';
import { sanitizeHtmlContent, ContentSanitizer, CONTENT_CONFIGS } from '@/lib/content-sanitizer';
import { cn } from '@/lib/utils';

interface SafeHtmlProps {
  content: string;
  className?: string;
  contentType?: 'richText' | 'simpleText' | 'quoteText';
  fallback?: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
}

/**
 * SafeHtml Component - Secure HTML content renderer
 * 
 * @param content - HTML content to render (will be sanitized)
 * @param className - CSS classes to apply
 * @param contentType - Type of content for appropriate sanitization
 * @param fallback - Fallback content if sanitization fails
 * @param as - HTML element to render as (default: div)
 */
export function SafeHtml({ 
  content, 
  className, 
  contentType = 'richText',
  fallback = null,
  as: Component = 'div'
}: SafeHtmlProps) {
  const [sanitizedContent, setSanitizedContent] = React.useState<string>('');
  const [isClient, setIsClient] = React.useState(false);

  // Early return for empty content
  if (!content || typeof content !== 'string') {
    return fallback ? <>{fallback}</> : null;
  }

  // Handle client-side hydration
  React.useEffect(() => {
    setIsClient(true);
    try {
      const sanitized = ContentSanitizer[contentType](content);
      setSanitizedContent(sanitized);
    } catch (error) {
      console.error('Content sanitization failed:', error);
      setSanitizedContent('');
    }
  }, [content, contentType]);

  // During SSR and initial client render, show unsanitized content
  // This prevents hydration mismatches
  if (!isClient) {
    return (
      <Component 
        className={cn('prose prose-gray max-w-none', className)}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  // Return fallback if sanitization resulted in empty content
  if (!sanitizedContent) {
    return fallback ? <>{fallback}</> : null;
  }

  return (
    <Component 
      className={cn('prose prose-gray max-w-none', className)}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
}

/**
 * Specialized components for different content types
 */

interface RichTextProps extends Omit<SafeHtmlProps, 'contentType'> {}

export function RichText({ content, className, as = 'div', ...props }: RichTextProps) {
  return (
    <SafeHtml 
      content={content}
      contentType="richText"
      className={cn('prose prose-lg', className)}
      as={as}
      {...props}
    />
  );
}

export function SimpleText({ content, className, as = 'div', ...props }: RichTextProps) {
  return (
    <SafeHtml 
      content={content}
      contentType="simpleText"
      className={cn('prose prose-sm', className)}
      as={as}
      {...props}
    />
  );
}

export function QuoteText({ content, className, as = 'div', ...props }: RichTextProps) {
  return (
    <SafeHtml 
      content={content}
      contentType="quoteText"
      className={cn('prose prose-xl', className)}
      as={as}
      {...props}
    />
  );
}

/**
 * Plain text component that strips all HTML
 */
interface PlainTextProps {
  content: string;
  className?: string;
  maxLength?: number;
  as?: keyof JSX.IntrinsicElements;
}

export function PlainText({ 
  content, 
  className, 
  maxLength,
  as: Component = 'p'
}: PlainTextProps) {
  const plainText = React.useMemo(() => {
    const sanitized = ContentSanitizer.plainText(content);
    return maxLength && sanitized.length > maxLength 
      ? `${sanitized.substring(0, maxLength)}...`
      : sanitized;
  }, [content, maxLength]);

  if (!plainText) {
    return null;
  }

  return (
    <Component className={className}>
      {plainText}
    </Component>
  );
}