'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import Script from 'next/script';
import { TranslateErrorBoundary } from './TranslateErrorBoundary';
import { DebugTranslate } from './debug-translate';

interface GoogleTranslateContextType {
  isLoaded: boolean;
  currentLanguage: string;
  translatePage: (language: string) => void;
  isTranslating: boolean;
}

const GoogleTranslateContext = createContext<GoogleTranslateContextType | undefined>(undefined);

interface GoogleTranslateProviderProps {
  children: ReactNode;
}

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
  }
}

export function GoogleTranslateProvider({ children }: GoogleTranslateProviderProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const [scriptError, setScriptError] = useState(false);

  // Initialize Google Translate callback before script loads
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Define the initialization function globally before script loads
    window.googleTranslateElementInit = () => {
      if (window.google?.translate) {
        try {
          console.log('Initializing Google Translate widget...');
          new window.google.translate.TranslateElement(
            {
              pageLanguage: 'en',
              includedLanguages: 'en,ar',
              layout: window.google.translate.InlineLayout?.HORIZONTAL || 0,
              autoDisplay: false,
              multilanguagePage: true,
              gaTrack: false,
              gaId: null,
            },
            'google_translate_element'
          );
          
          // Wait for the widget to be fully rendered
          setTimeout(() => {
            const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
            if (selectElement) {
              console.log('Google Translate widget initialized successfully');
              setIsLoaded(true);
              setScriptError(false);
            } else {
              console.warn('Google Translate widget element not found after initialization');
              setScriptError(true);
              setIsLoaded(true); // Still allow fallback functionality
            }
          }, 500);
          
        } catch (error) {
          console.error('Error initializing Google Translate:', error);
          setScriptError(true);
          setIsLoaded(true); // Still allow fallback functionality
        }
      } else {
        console.error('Google Translate API not available');
        setScriptError(true);
        setIsLoaded(true);
      }
    };

    return () => {
      delete window.googleTranslateElementInit;
    };
  }, []);

  // Handle script load success
  const handleScriptLoad = () => {
    console.log('Google Translate script loaded successfully');
    // Wait for the widget to be fully initialized
    setTimeout(() => {
      const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (selectElement) {
        console.log('Google Translate widget is ready');
        // Force a small initialization to ensure it's working
        selectElement.style.display = 'none'; // Keep it hidden
      } else {
        console.warn('Google Translate widget not found after initialization');
      }
    }, 1000);
  };

  // Handle script load error
  const handleScriptError = () => {
    console.warn('Google Translate script failed to load - using fallback mode');
    setScriptError(true);
    setIsLoaded(true); // Enable fallback functionality
  };

  const translatePage = (language: string) => {
    if (!isLoaded) return;

    setIsTranslating(true);
    
    // Wait a moment for Google Translate to be fully ready
    setTimeout(() => {
      // Try to use Google Translate first (only if script loaded successfully)
      let selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      
      // If no select element, try to find the dropdown link (SIMPLE layout)
      if (!selectElement) {
        const dropdownLink = document.querySelector('.goog-te-gadget-simple a') as HTMLAnchorElement;
        if (dropdownLink) {
          console.log('Found Google Translate dropdown link, clicking to reveal options');
          dropdownLink.click();
          
          // Wait for dropdown to appear and try to find select element
          setTimeout(() => {
            selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
            performTranslation(selectElement, language);
          }, 300);
        } else {
          console.log('No Google Translate UI found, using fallback');
          performManualLanguageSwitch(language);
        }
      } else {
        performTranslation(selectElement, language);
      }
    }, 100); // Small delay to ensure Google Translate is ready
  };

  const performTranslation = (selectElement: HTMLSelectElement | null, language: string) => {
    if (selectElement && window.google?.translate && !scriptError) {
      // Google Translate is available and working
      try {
        console.log('Using Google Translate for language:', language);
        console.log('Available options:', Array.from(selectElement.options).map(opt => ({ value: opt.value, text: opt.text })));
        
        selectElement.value = language;
        
        // Trigger change event with more robust event dispatching
        const changeEvent = new Event('change', { bubbles: true, cancelable: true });
        selectElement.dispatchEvent(changeEvent);
        
        // Also try triggering input event
        const inputEvent = new Event('input', { bubbles: true, cancelable: true });
        selectElement.dispatchEvent(inputEvent);
        
        // Try click event as well
        selectElement.click();
        
        setCurrentLanguage(language);
        
        // Reset translating state after a delay
        setTimeout(() => {
          setIsTranslating(false);
        }, 1500);
      } catch (error) {
        console.error('Error using Google Translate:', error);
        // Fall back to manual switching
        performManualLanguageSwitch(language);
      }
    } else {
      console.log('Google Translate not available, using fallback');
      // Fallback: Manual language switching
      performManualLanguageSwitch(language);
    }
  };

  const performManualLanguageSwitch = (language: string) => {
    console.log('Using manual language switching for:', language);
    setCurrentLanguage(language);
    
    // Apply language attributes to document
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    
    // Add language class to body for CSS targeting
    document.body.className = document.body.className.replace(/\blang-\w+\b/g, '');
    document.body.classList.add(`lang-${language}`);
    
    // Dispatch custom event for components to listen to
    window.dispatchEvent(new CustomEvent('languageChanged', { 
      detail: { language, direction: language === 'ar' ? 'rtl' : 'ltr' } 
    }));
    
    setTimeout(() => {
      setIsTranslating(false);
    }, 300);
  };

  const value = {
    isLoaded,
    currentLanguage,
    translatePage,
    isTranslating,
  };

  return (
    <GoogleTranslateContext.Provider value={value}>
      <TranslateErrorBoundary>
        {children}
        
        {/* Load Google Translate script using Next.js Script component */}
        <Script
          id="google-translate-script"
          src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
          onLoad={handleScriptLoad}
          onError={handleScriptError}
        />
        
        {/* Hidden Google Translate element */}
        <div id="google_translate_element" style={{ display: 'none' }} />
        
        {/* Debug component for development */}
        <DebugTranslate />
      </TranslateErrorBoundary>
    </GoogleTranslateContext.Provider>
  );
}

export function useGoogleTranslate() {
  const context = useContext(GoogleTranslateContext);
  if (context === undefined) {
    throw new Error('useGoogleTranslate must be used within a GoogleTranslateProvider');
  }
  return context;
}