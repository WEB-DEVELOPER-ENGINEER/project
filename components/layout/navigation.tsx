'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HeaderLogo, MobileLogo } from '@/components/ui/logo';
import { LanguageSelector } from '@/components/translate/language-selector';
import { cn } from '@/lib/utils';

interface NavigationProps {
  navigationData?: any;
  siteSettings?: Record<string, any>;
}

export function Navigation({ navigationData, siteSettings = {} }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Use navigation data from database
  const navigation = navigationData?.header_items || [];

  return (
    <header className={cn(
      'fixed inset-x-0 top-0 z-50 transition-all duration-200',
      scrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-transparent'
    )}>
      <nav className="container flex items-center justify-between py-4" aria-label="Global navigation">
        <div className="flex lg:flex-1">
          <HeaderLogo siteSettings={siteSettings} />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item: any) => (
            <Link
              key={item.name}
              href={item.link || item.href}
              className="text-sm font-semibold leading-6 text-gray-900 hover:text-brand-orange transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4 lg:items-center">
          <LanguageSelector variant="compact" />
          <Button variant="outline" asChild>
            <Link href={siteSettings.nav_contact_url || '/contact'}>
              {siteSettings.nav_contact_text || 'Contact Us'}
            </Link>
          </Button>
          <Button asChild>
            <Link href={siteSettings.nav_cta_url || '/get-started'}>
              {siteSettings.nav_cta_text || 'Get Started'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Mobile menu button and language selector */}
        <div className="flex lg:hidden items-center gap-2">
          <LanguageSelector variant="icon-only" />
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 hover:text-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
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
          <div className="fixed inset-0 z-10 bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <div onClick={() => setMobileMenuOpen(false)}>
                <MobileLogo siteSettings={siteSettings} />
              </div>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item: any) => (
                    <Link
                      key={item.name}
                      href={item.link || item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="py-6 space-y-4">
                  <div className="mb-4">
                    <LanguageSelector variant="default" className="w-full" />
                  </div>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={siteSettings.nav_contact_url || '/contact'} onClick={() => setMobileMenuOpen(false)}>
                      {siteSettings.nav_contact_text || 'Contact Us'}
                    </Link>
                  </Button>
                  <Button className="w-full" asChild>
                    <Link href={siteSettings.nav_cta_url || '/contact'} onClick={() => setMobileMenuOpen(false)}>
                      {siteSettings.nav_cta_text || 'Get Started'}
                      <ArrowRight className="ml-2 h-4 w-4" />
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