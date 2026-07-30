'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HeaderLogo, MobileLogo } from '@/components/ui/logo';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';

interface NavigationProps {
  navigationData?: any;
  siteSettings?: Record<string, any>;
}

export function Navigation({ navigationData, siteSettings = {} }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t, isRtl } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Use navigation data from database or fallback translations
  const rawNavigation = navigationData?.header_items || [];
  
  const getNavLabel = (item: any) => {
    const nameLower = (item.name || '').toLowerCase();
    if (nameLower.includes('home') || nameLower.includes('الرئيسية')) return t('nav.home');
    if (nameLower.includes('about') || nameLower.includes('عن') || nameLower.includes('من نحن')) return t('nav.about');
    if (nameLower.includes('service') || nameLower.includes('خدمات')) return t('nav.services');
    if (nameLower.includes('blog') || nameLower.includes('مدونة')) return t('nav.blog');
    if (nameLower.includes('contact') || nameLower.includes('تواصل')) return t('nav.contact');
    return item.name;
  };

  return (
    <header className={cn(
      'fixed inset-x-0 top-0 z-50 transition-all duration-200',
      scrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm dark:bg-gray-900/95' : 'bg-transparent'
    )}>
      <nav className="container flex items-center justify-between py-4" aria-label="Global navigation">
        <div className="flex lg:flex-1">
          <HeaderLogo siteSettings={siteSettings} />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:gap-x-8">
          {rawNavigation.map((item: any) => (
            <Link
              key={item.name}
              href={item.link || item.href}
              className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100 hover:text-brand-orange transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
            >
              {getNavLabel(item)}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4 lg:items-center">
          <LanguageSwitcher variant="compact" />
          <Button variant="outline" asChild>
            <Link href={siteSettings.nav_contact_url || '/contact'}>
              {t('nav.contactUs')}
            </Link>
          </Button>
          <Button asChild>
            <Link href={siteSettings.nav_cta_url || '/contact'}>
              {t('nav.getStarted')}
              <ArrowRight className={cn('ml-2 h-4 w-4', isRtl && 'rotate-180 mr-2 ml-0')} />
            </Link>
          </Button>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden items-center gap-2">
          <LanguageSwitcher variant="compact" />
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-200 hover:text-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className={cn('fixed inset-0 z-10 bg-white dark:bg-gray-900 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10', isRtl ? 'left-0' : 'right-0')}>
            <div className="flex items-center justify-between">
              <div onClick={() => setMobileMenuOpen(false)}>
                <MobileLogo siteSettings={siteSettings} />
              </div>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700 dark:text-gray-200"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {rawNavigation.map((item: any) => (
                    <Link
                      key={item.name}
                      href={item.link || item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {getNavLabel(item)}
                    </Link>
                  ))}
                </div>
                <div className="py-6 space-y-4">
                  <div className="flex justify-center pb-2">
                    <LanguageSwitcher variant="full" />
                  </div>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={siteSettings.nav_contact_url || '/contact'} onClick={() => setMobileMenuOpen(false)}>
                      {t('nav.contactUs')}
                    </Link>
                  </Button>
                  <Button className="w-full" asChild>
                    <Link href={siteSettings.nav_cta_url || '/contact'} onClick={() => setMobileMenuOpen(false)}>
                      {t('nav.getStarted')}
                      <ArrowRight className={cn('ml-2 h-4 w-4', isRtl && 'rotate-180 mr-2 ml-0')} />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}