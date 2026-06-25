'use client';

import { useState } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGoogleTranslate } from './google-translate-provider';
import { cn } from '@/lib/utils';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const SUPPORTED_LANGUAGES: Language[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
  },
];

interface LanguageSelectorProps {
  variant?: 'default' | 'compact' | 'icon-only';
  className?: string;
}

export function LanguageSelector({ variant = 'default', className }: LanguageSelectorProps) {
  const { currentLanguage, translatePage, isLoaded, isTranslating } = useGoogleTranslate();
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = SUPPORTED_LANGUAGES.find(lang => lang.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  const handleLanguageChange = (languageCode: string) => {
    if (languageCode !== currentLanguage) {
      translatePage(languageCode);
    }
    setIsOpen(false);
  };

  if (!isLoaded) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <Globe className="h-4 w-4 text-gray-400 animate-pulse" />
        {variant !== 'icon-only' && (
          <span className="text-sm text-gray-400">Loading translator...</span>
        )}
      </div>
    );
  }

  if (variant === 'icon-only') {
    return (
      <div className={cn('relative', className)}>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          disabled={isTranslating}
          className="relative"
          aria-label="Select language"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
        </Button>
        
        {isOpen && (
          <div className="absolute right-0 top-full mt-2 z-50 min-w-[160px] rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
            {SUPPORTED_LANGUAGES.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-sm px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none',
                  currentLanguage === language.code && 'bg-accent text-accent-foreground'
                )}
                role="option"
                aria-selected={currentLanguage === language.code}
              >
                <div className="flex flex-col items-start">
                  <span className="font-medium">{language.name}</span>
                  <span className="text-xs text-muted-foreground">{language.nativeName}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <Select
        value={currentLanguage}
        onValueChange={handleLanguageChange}
        disabled={isTranslating}
      >
        <SelectTrigger className={cn('w-auto min-w-[120px] h-9', className)}>
          <div className="flex items-center gap-2">
            
            <SelectValue />
          </div>
        </SelectTrigger>
        <SelectContent>
          {SUPPORTED_LANGUAGES.map((language) => (
            <SelectItem key={language.code} value={language.code}>
              <div className="flex items-center gap-2">
                <span role="img" aria-label={language.name}>
                  {language.flag}
                </span>
                <span>{language.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return (
    <Select
      value={currentLanguage}
      onValueChange={handleLanguageChange}
      disabled={isTranslating}
    >
      <SelectTrigger className={cn('w-auto min-w-[160px]', className)}>
        <div className="flex items-center gap-2">
          {isTranslating ? (
            <Globe className="h-4 w-4 animate-spin" />
          ) : (
            <span role="img" aria-label={currentLang.name}>
              {currentLang.flag}
            </span>
          )}
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium">{currentLang.name}</span>
            <span className="text-xs text-muted-foreground">{currentLang.nativeName}</span>
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </div>
      </SelectTrigger>
      <SelectContent>
        {SUPPORTED_LANGUAGES.map((language) => (
          <SelectItem key={language.code} value={language.code}>
            <div className="flex items-center gap-3">
              <span className="text-lg" role="img" aria-label={language.name}>
                {language.flag}
              </span>
              <div className="flex flex-col items-start">
                <span className="font-medium">{language.name}</span>
                <span className="text-xs text-muted-foreground">{language.nativeName}</span>
              </div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}