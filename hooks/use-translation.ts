import { useGoogleTranslate } from '@/components/translate/google-translate-provider';

/**
 * Custom hook for managing translation state and utilities
 * Provides a simplified interface for components to interact with Google Translate
 */
export function useTranslation() {
  const { currentLanguage, translatePage, isLoaded, isTranslating } = useGoogleTranslate();

  const isArabic = currentLanguage === 'ar';
  const isEnglish = currentLanguage === 'en';

  /**
   * Get the text direction for the current language
   */
  const getTextDirection = () => {
    return isArabic ? 'rtl' : 'ltr';
  };

  /**
   * Get language-specific CSS classes
   */
  const getLanguageClasses = () => {
    return {
      direction: getTextDirection(),
      lang: currentLanguage,
      'text-right': isArabic,
      'text-left': isEnglish,
    };
  };

  /**
   * Switch to a specific language
   */
  const switchLanguage = (languageCode: 'en' | 'ar') => {
    if (isLoaded && languageCode !== currentLanguage) {
      translatePage(languageCode);
    }
  };

  /**
   * Toggle between English and Arabic
   */
  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'en' ? 'ar' : 'en';
    switchLanguage(newLanguage);
  };

  /**
   * Get localized text based on current language
   */
  const getLocalizedText = (englishText: string, arabicText?: string) => {
    if (isArabic && arabicText) {
      return arabicText;
    }
    return englishText;
  };

  /**
   * Format text for the current language direction
   */
  const formatTextForDirection = (text: string) => {
    if (isArabic) {
      // Add any Arabic-specific formatting if needed
      return text;
    }
    return text;
  };

  return {
    // State
    currentLanguage,
    isLoaded,
    isTranslating,
    isArabic,
    isEnglish,
    
    // Actions
    switchLanguage,
    toggleLanguage,
    translatePage,
    
    // Utilities
    getTextDirection,
    getLanguageClasses,
    getLocalizedText,
    formatTextForDirection,
  };
}