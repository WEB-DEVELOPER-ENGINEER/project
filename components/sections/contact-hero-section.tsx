'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { trackPhoneClick, trackEmailClick, trackWhatsAppClick } from '@/lib/analytics-events';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { localizedPath } from '@/lib/locale';
import { CONTACT_CONTENT } from '@/lib/content/contact-content';
import { companyName as resolveCompanyName } from '@/lib/company';

interface ContactHeroSectionProps {
  contactData: any;
  siteSettings?: Record<string, any>;
}

export function ContactHeroSection({ contactData, siteSettings = {} }: ContactHeroSectionProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const { locale } = useLanguage();
  const c = CONTACT_CONTENT[locale].hero;
  const cm = CONTACT_CONTENT[locale].common;

  const companyName = resolveCompanyName(siteSettings, locale);
  const heroTitle = contactData.contact_title || c.title;
  const heroSubtitle = contactData.contact_subtitle || c.subtitle;
  const heroDescription = contactData.contact_description || c.description;

  const handleScrollToForm = () => {
    const formSection = document.getElementById('contact-form-section');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePhoneClick = () => {
    if (contactData.phone) {
      trackPhoneClick(contactData.phone, 'contact_hero_section');
      window.location.href = `tel:${contactData.phone}`;
    }
  };

  const handleEmailClick = () => {
    if (contactData.email) {
      trackEmailClick(contactData.email, 'contact_hero_section');
      window.location.href = `mailto:${contactData.email}`;
    }
  };

  const handleWhatsAppClick = () => {
    trackWhatsAppClick(contactData.whatsapp_number, 'contact_hero_section');
    const message = encodeURIComponent(contactData.whatsapp_message || 'Hello Jusor, I would like to inquire about your services.');
    window.open(`https://api.whatsapp.com/send?phone=${contactData.whatsapp_number}&text=${message}`, '_blank');
  };

  return (
    <section 
      ref={ref}
      className="relative overflow-hidden bg-gradient-to-br from-white via-gray-50 to-blue-50 pt-24 pb-16 sm:pt-32 sm:pb-24"
      aria-labelledby="contact-hero-heading"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-gray-100/50 bg-[size:20px_20px] opacity-30" />
      <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-brand-orange/20 to-brand-blue/20 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-tr from-brand-blue/20 to-brand-orange/20 blur-3xl" />
      
      <div className="container relative">
        {/* Breadcrumb */}
        <nav 
          aria-label="Breadcrumb"
          className={`mb-8 transition-all duration-700 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link
                href={localizedPath('/', locale)}
                className="hover:text-brand-orangeText transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2 rounded"
              >
                {c.breadcrumbHome}
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-900 font-medium" aria-current="page">
              {c.breadcrumbCurrent}
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            {/* Title */}
            <h1 
              id="contact-hero-heading"
              className={`text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl mb-6 transition-all duration-700 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              {heroTitle}
            </h1>

            {/* Subtitle */}
            <p 
              className={`text-xl text-brand-blue font-semibold mb-4 transition-all duration-700 delay-100 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              {heroSubtitle}
            </p>

            {/* Description */}
            <p 
              className={`text-lg text-gray-600 mb-8 leading-relaxed transition-all duration-700 delay-200 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              {heroDescription}
            </p>

            {/* Quick Contact Options */}
            <div 
              className={`grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 transition-all duration-700 delay-300 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              {/* Phone */}
              <button
                onClick={handlePhoneClick}
                className="flex items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 group border border-gray-100 hover:border-brand-orange/20 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2"
              >
                <div className="w-12 h-12 bg-brand-orange/10 rounded-lg flex items-center justify-center mr-4 group-hover:bg-brand-orange/20 transition-colors duration-300">
                  <Phone className="w-6 h-6 text-brand-orangeText" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900 group-hover:text-brand-orangeText transition-colors duration-300">{c.callUs}</p>
                  <p className="text-sm text-gray-600">{contactData.phone}</p>
                </div>
              </button>

              {/* Email */}
              <button
                onClick={handleEmailClick}
                className="flex items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 group border border-gray-100 hover:border-brand-blue/20 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2"
              >
                <div className="w-12 h-12 bg-brand-blue/10 rounded-lg flex items-center justify-center mr-4 group-hover:bg-brand-blue/20 transition-colors duration-300">
                  <Mail className="w-6 h-6 text-brand-blue" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900 group-hover:text-brand-blue transition-colors duration-300">{c.emailUs}</p>
                  <p className="text-sm text-gray-600">{contactData.email}</p>
                </div>
              </button>
            </div>

            {/* CTA Buttons */}
            <div 
              className={`flex flex-col sm:flex-row gap-4 transition-all duration-700 delay-400 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <Button 
                size="lg"
                className="bg-brand-orangeText hover:bg-brand-orangeText/90 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
                onClick={handleScrollToForm}
                aria-describedby="get-quote-description"
              >
                {c.requestQuote}
                <ArrowRight className={`h-5 w-5 group-hover:translate-x-1 transition-transform duration-300 ${locale === 'ar' ? 'mr-2 rotate-180' : 'ml-2'}`} aria-hidden="true" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white px-8 py-3 text-lg font-semibold transition-all duration-300"
                onClick={handleWhatsAppClick}
                aria-describedby="whatsapp-description"
              >
                <MessageCircle className={`h-5 w-5 ${locale === 'ar' ? 'ml-2' : 'mr-2'}`} aria-hidden="true" />
                {c.whatsapp}
              </Button>
            </div>

            {/* Screen reader descriptions */}
            <div className="sr-only">
              <p id="get-quote-description">
                {locale === 'ar'
                  ? 'مرّر لأسفل لتعبئة نموذج التواصل والحصول على عرض سعر مجاني'
                  : 'Scroll down to fill out our contact form and get a free quote'}
              </p>
              <p id="whatsapp-description">
                {locale === 'ar'
                  ? 'ابدأ محادثة واتساب مع فريقنا للحصول على دعم فوري'
                  : 'Start a WhatsApp conversation with our team for instant support'}
              </p>
            </div>
          </div>

          {/* Visual Element */}
          <div 
            className={`relative transition-all duration-700 delay-500 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="relative">
              {/* Main contact card */}
              <div className="bg-white rounded-2xl shadow-2xl p-8 lg:p-10 border border-gray-100">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-brand-orange to-brand-blue mb-6">
                    <MessageCircle className="h-10 w-10 text-white" aria-hidden="true" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-2">
                    {companyName}
                  </div>
                  <p className="text-gray-600 mb-6">
                    {c.tagline}
                  </p>
                </div>

                {/* Contact details */}
                <div className="space-y-4">
                  <div className="flex items-center text-gray-700">
                    <MapPin className="h-5 w-5 text-brand-orangeText mr-3 flex-shrink-0" aria-hidden="true" />
                    <span className="text-sm">{(locale === 'ar' ? cm.address : contactData.address || cm.address)}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Clock className="h-5 w-5 text-brand-blue mr-3 flex-shrink-0" aria-hidden="true" />
                    <span className="text-sm">{(locale === 'ar' ? cm.businessHours : contactData.business_hours || cm.businessHours)}</span>
                  </div>
                  <div className="flex items-center justify-center space-x-4 pt-4">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                      <span className="text-sm text-gray-600">{c.availableNow}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                      <span className="text-sm text-gray-600">{c.expertTeam}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-brand-orange rounded-full opacity-80" />
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-brand-blue rounded-full opacity-60" />
              <div className="absolute top-1/2 -left-2 w-4 h-4 bg-brand-orange/60 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}