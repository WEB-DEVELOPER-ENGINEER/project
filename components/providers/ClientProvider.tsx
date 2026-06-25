'use client';

import { useEffect } from 'react';

/**
 * Client-side provider to handle browser extension attributes
 * and other client-only initialization
 */
export function ClientProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Suppress hydration warnings for browser extension attributes
    const suppressHydrationWarning = () => {
      // Common browser extension attributes that cause hydration warnings
      const extensionAttributes = [
        'data-new-gr-c-s-check-loaded',
        'data-gr-ext-installed',
        'cz-shortcut-listen',
        'data-lt-installed',
        'data-adblock-key'
      ];

      // Remove extension attributes from body to prevent hydration warnings
      extensionAttributes.forEach(attr => {
        if (document.body.hasAttribute(attr)) {
          document.body.removeAttribute(attr);
        }
      });

      // Also check html element
      extensionAttributes.forEach(attr => {
        if (document.documentElement.hasAttribute(attr)) {
          document.documentElement.removeAttribute(attr);
        }
      });
    };

    // Run after hydration
    suppressHydrationWarning();

    // Set up mutation observer to handle dynamically added extension attributes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes') {
          const target = mutation.target as Element;
          const attributeName = mutation.attributeName;
          
          if (attributeName && (
            attributeName.startsWith('data-gr-') ||
            attributeName.startsWith('data-new-gr-') ||
            attributeName === 'cz-shortcut-listen' ||
            attributeName.startsWith('data-lt-') ||
            attributeName.startsWith('data-adblock-')
          )) {
            // Silently remove problematic attributes
            target.removeAttribute(attributeName);
          }
        }
      });
    });

    // Observe both body and html for attribute changes
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: [
        'data-new-gr-c-s-check-loaded',
        'data-gr-ext-installed',
        'cz-shortcut-listen',
        'data-lt-installed',
        'data-adblock-key'
      ]
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: [
        'data-new-gr-c-s-check-loaded',
        'data-gr-ext-installed',
        'cz-shortcut-listen',
        'data-lt-installed',
        'data-adblock-key'
      ]
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return <>{children}</>;
}