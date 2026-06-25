'use client';

import { useEffect, useState } from 'react';
import { useGoogleTranslate } from './google-translate-provider';
import { useDirectGoogleTranslate } from './google-translate-direct';

/**
 * Debug component to help troubleshoot Google Translate issues
 * Only visible in development mode
 */
export function DebugTranslate() {
  const { isLoaded, currentLanguage, isTranslating } = useGoogleTranslate();
  const { triggerGoogleTranslate } = useDirectGoogleTranslate();
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    const interval = setInterval(() => {
      const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      const translateElement = document.getElementById('google_translate_element');
      
      setDebugInfo({
        isLoaded,
        currentLanguage,
        isTranslating,
        hasGoogleAPI: !!window.google?.translate,
        hasSelectElement: !!selectElement,
        selectElementValue: selectElement?.value || 'not found',
        selectElementOptions: selectElement ? Array.from(selectElement.options).map(opt => ({ value: opt.value, text: opt.text })) : [],
        translateElementExists: !!translateElement,
        translateElementHTML: translateElement?.innerHTML || 'not found',
        bodyLang: document.body.lang || document.documentElement.lang,
        bodyDir: document.body.dir || document.documentElement.dir,
        bodyClasses: document.body.className
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isLoaded, currentLanguage, isTranslating]);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-md max-h-96 overflow-auto z-50">
      <h3 className="font-bold mb-2">Google Translate Debug</h3>
      <pre className="whitespace-pre-wrap">
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
      
      <div className="mt-4 space-y-2">
        <button
          onClick={() => triggerGoogleTranslate('ar')}
          className="block w-full bg-blue-600 text-white px-2 py-1 rounded text-xs"
        >
          Direct Arabic Translation
        </button>
        
        <button
          onClick={() => triggerGoogleTranslate('en')}
          className="block w-full bg-green-600 text-white px-2 py-1 rounded text-xs"
        >
          Direct English Translation
        </button>
        
        <button
          onClick={() => {
            // Click the Google Translate widget directly
            const gadgetLink = document.querySelector('.goog-te-gadget-simple a') as HTMLAnchorElement;
            if (gadgetLink) {
              console.log('Clicking Google Translate widget');
              gadgetLink.click();
            }
          }}
          className="block w-full bg-purple-600 text-white px-2 py-1 rounded text-xs"
        >
          Click GT Widget
        </button>
        
        <button
          onClick={() => {
            console.log('Google Translate Debug Info:', {
              google: window.google,
              translateElement: document.getElementById('google_translate_element'),
              selectElement: document.querySelector('.goog-te-combo'),
              allGoogElements: document.querySelectorAll('[class*="goog"]')
            });
          }}
          className="block w-full bg-yellow-600 text-white px-2 py-1 rounded text-xs"
        >
          Log Debug Info
        </button>
      </div>
    </div>
  );
}