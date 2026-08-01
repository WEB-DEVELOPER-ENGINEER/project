'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, MessageSquare, Phone } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { trackPhoneClick, trackEmailClick, trackWhatsAppClick } from '@/lib/analytics-events';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { localizedPath } from '@/lib/locale';
import { PROJECTS_PAGE_CONTENT } from '@/lib/content/projects-page-content';

interface ProjectsCTASectionProps {
  siteSettings?: Record<string, any>;
}

export function ProjectsCTASection({ siteSettings = {} }: ProjectsCTASectionProps) {
  const { locale } = useLanguage();
  const pp = PROJECTS_PAGE_CONTENT[locale];
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const companyName = siteSettings.company_name || 'Jusor Translation Services';
  const ctaTitle = siteSettings.projects_cta_title || pp.ctaTitle;
  const ctaDescription = siteSettings.projects_cta_description || pp.ctaDescription;

  const benefits = pp.ctaBenefits;

  const handleGetQuote = () => {
    window.location.href = '/contact#contact-form-section';
  };

  const handleCallUs = () => {
    const phone = siteSettings.company_phone || '+971503244329';
    trackPhoneClick(phone, 'projects_cta_section');
    window.location.href = `tel:${phone}`;
  };

  return (
    <section 
      ref={ref}
      className="relative overflow-hidden bg-gradient-to-br from-brand-blue via-brand-blue/95 to-brand-blue/90 py-24"
      aria-labelledby="projects-cta-heading"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px] opacity-30" />
      <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-brand-orange/30 to-white/20 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-tr from-white/20 to-brand-orange/30 blur-3xl" />
      
      <div className="container relative">
        <div className="mx-auto max-w-4xl text-center">
          {/* Main content */}
          <div 
            className={`transition-all duration-700 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <h2 
              id="projects-cta-heading"
              className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl mb-6"
            >
              {ctaTitle}
            </h2>
            
            <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
              {ctaDescription}
            </p>
          </div>

          {/* Benefits grid */}
          <div 
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12 transition-all duration-700 delay-200 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="flex items-center text-left bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-colors duration-300"
              >
                <CheckCircle 
                  className="h-5 w-5 text-brand-orange mr-3 flex-shrink-0" 
                  aria-hidden="true"
                />
                <span className="text-white font-medium">{benefit}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div 
            className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-700 delay-400 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <Button 
              size="lg"
              className="bg-brand-orange hover:bg-brand-orange/90 text-white px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 group"
              onClick={handleGetQuote}
              aria-describedby="get-quote-description"
            >
              <MessageSquare className="mr-2 h-5 w-5" aria-hidden="true" />
              {pp.getFreeQuote}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" aria-hidden="true" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-white text-white hover:bg-white hover:text-brand-blue px-8 py-4 text-lg font-semibold backdrop-blur-sm transition-all duration-300 group"
              onClick={handleCallUs}
              aria-describedby="call-us-description"
            >
              <Phone className="mr-2 h-5 w-5" aria-hidden="true" />
              {pp.callUsNow}
            </Button>
          </div>

          {/* Screen reader descriptions */}
          <div className="sr-only">
            <p id="get-quote-description">
              {pp.srGetQuote}
            </p>
            <p id="call-us-description">
              {pp.srCallUs}
            </p>
          </div>

          {/* Contact info */}
          <div 
            className={`mt-12 pt-8 border-t border-white/20 transition-all duration-700 delay-500 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-white/80 text-sm font-medium mb-1">{pp.emailUs}</div>
                <a 
                  href={`mailto:${siteSettings.company_email || 'info@jusortrans.com'}`}
                  onClick={() => trackEmailClick(siteSettings.company_email || 'info@jusortrans.com', 'projects_cta_footer')}
                  className="text-white hover:text-brand-orange transition-colors duration-200 font-semibold"
                >
                  {siteSettings.company_email || 'info@jusortrans.com'}
                </a>
              </div>
              <div>
                <div className="text-white/80 text-sm font-medium mb-1">{pp.callUs}</div>
                <a 
                  href={`tel:${siteSettings.company_phone || '+971503244329'}`}
                  onClick={() => trackPhoneClick(siteSettings.company_phone || '+971503244329', 'projects_cta_footer')}
                  className="text-white hover:text-brand-orange transition-colors duration-200 font-semibold"
                >
                  {siteSettings.company_phone || '+971 50 324 4329'}
                </a>
              </div>
              <div>
                <div className="text-white/80 text-sm font-medium mb-1">WhatsApp</div>
                <a 
                  href={`https://wa.me/${siteSettings.whatsapp_number || '971503244329'}`}
                  onClick={() => trackWhatsAppClick(siteSettings.whatsapp_number || '971503244329', 'projects_cta_footer')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-brand-orange transition-colors duration-200 font-semibold"
                >
                  {pp.quickChat}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
