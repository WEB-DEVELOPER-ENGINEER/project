'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Phone, Mail, MessageCircle, CheckCircle } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { Service } from '@/lib/types';
import { trackPhoneClick, trackEmailClick } from '@/lib/analytics-events';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { SERVICE_DETAIL_CONTENT, fill } from '@/lib/content/service-detail-content';

interface ServiceDetailCTAProps {
  service: Service;
  siteSettings?: Record<string, any>;
}

export function ServiceDetailCTA({ service, siteSettings = {} }: ServiceDetailCTAProps) {
  const { locale } = useLanguage();
  const sc = SERVICE_DETAIL_CONTENT[locale];
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const companyName = siteSettings.company_name || 'JUSOR Translation Services';
  const companyPhone = siteSettings.company_phone;
  const companyEmail = siteSettings.company_email;

  const handleContactClick = () => {
    window.location.href = '/contact';
  };

  const handlePhoneClick = () => {
    if (companyPhone) {
      trackPhoneClick(companyPhone, 'service_detail_cta');
      window.location.href = `tel:${companyPhone}`;
    }
  };

  const handleEmailClick = () => {
    if (companyEmail) {
      trackEmailClick(companyEmail, 'service_detail_cta');
      window.location.href = `mailto:${companyEmail}?subject=Inquiry about ${service.title}`;
    }
  };

  // Use dynamic benefits from database with safe array handling
  const benefits = Array.isArray(service.key_benefits) 
    ? service.key_benefits.slice(0, 4) // Limit to 4 for CTA section
    : (service.key_benefits ? [service.key_benefits] : sc.defaultBenefits);

  return (
    <section 
      ref={ref}
      className="section-padding bg-gradient-to-br from-brand-blue via-brand-blue/95 to-brand-orange/90 relative overflow-hidden"
      aria-labelledby="service-cta-heading"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0.6))]" />
      <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-brand-orange/20 blur-3xl" />
      
      <div className="container relative">
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div>
              <div 
                className={`transition-all duration-700 ${
                  inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                <h2 
                  id="service-cta-heading"
                  className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-6"
                >
                  {service.cta_primary_text || sc.readyToStart}
                </h2>
                <p className="text-xl text-blue-100 leading-relaxed mb-8">
                  {service.short_description || fill(sc.readyToStartBody, service.title)}
                </p>
              </div>

              {/* Benefits */}
              <div 
                className={`mb-8 transition-all duration-700 delay-200 ${
                  inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {benefits.map((benefit, index) => (
                    <div 
                      key={index}
                      className="flex items-center text-blue-100"
                    >
                      <CheckCircle 
                        className="h-5 w-5 text-white mr-3 flex-shrink-0" 
                        aria-hidden="true"
                      />
                      <span className="font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Buttons */}
              <div 
                className={`flex flex-col sm:flex-row gap-4 mb-8 transition-all duration-700 delay-400 ${
                  inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                <Button 
                  size="lg"
                  className="bg-white text-brand-blue hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 group"
                  onClick={() => {
                    if (service.cta_primary_url) {
                      window.location.href = service.cta_primary_url;
                    } else {
                      handleContactClick();
                    }
                  }}
                  aria-describedby="start-project-description"
                >
                  {service.cta_primary_text || sc.startYourProject}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" aria-hidden="true" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-white text-white hover:bg-white hover:text-brand-blue px-8 py-4 text-lg font-semibold transition-all duration-300 bg-transparent"
                  onClick={() => {
                    if (service.cta_secondary_url) {
                      window.location.href = service.cta_secondary_url;
                    } else {
                      window.location.href = '/services';
                    }
                  }}
                  aria-describedby="view-all-services-description"
                >
                  {service.cta_secondary_text || sc.viewAllServices}
                </Button>
              </div>

              {/* Contact Options */}
              <div 
                className={`transition-all duration-700 delay-600 ${
                  inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                <p className="text-blue-100 mb-4 text-lg">
                  {sc.orContactDirectly}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  {companyPhone && (
                    <button
                      onClick={handlePhoneClick}
                      className="flex items-center text-white hover:text-blue-100 transition-colors duration-300 group focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-blue rounded-lg px-4 py-2"
                      aria-label={`Call us at ${companyPhone}`}
                    >
                      <Phone className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform duration-300" aria-hidden="true" />
                      <span className="font-semibold">{companyPhone}</span>
                    </button>
                  )}
                  
                  {companyEmail && (
                    <button
                      onClick={handleEmailClick}
                      className="flex items-center text-white hover:text-blue-100 transition-colors duration-300 group focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-blue rounded-lg px-4 py-2"
                      aria-label={`Email us at ${companyEmail}`}
                    >
                      <Mail className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform duration-300" aria-hidden="true" />
                      <span className="font-semibold">{companyEmail}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Screen reader descriptions */}
              <div className="sr-only">
                <p id="start-project-description">
                  {fill(sc.srContact, service.title)}
                </p>
                <p id="view-all-services-description">
                  {sc.srViewAll}
                </p>
              </div>
            </div>

            {/* Visual Element */}
            <div 
              className={`transition-all duration-700 delay-300 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-6">
                    {sc.getStartedToday}
                  </h3>
                  <div className="space-y-4 text-blue-100">
                    {service.service_highlights && Object.entries(service.service_highlights).slice(0, 4).map(([key, value], index, array) => (
                      <div key={key} className={`flex items-center justify-between py-3 ${index < array.length - 1 ? 'border-b border-white/20' : ''}`}>
                        <span className="capitalize">{key.replace(/_/g, ' ')}</span>
                        <span className="text-white font-semibold">{value}</span>
                      </div>
                    )) || (
                      <>
                        <div className="flex items-center justify-between py-3 border-b border-white/20">
                          <span>{sc.responseTime}</span>
                          <span className="text-white font-semibold">{sc.within24Hours}</span>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-white/20">
                          <span>{sc.freeConsultation}</span>
                          <span className="text-white font-semibold">{sc.thirtyMinutes}</span>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-white/20">
                          <span>{sc.projectStart}</span>
                          <span className="text-white font-semibold">{sc.within1Week}</span>
                        </div>
                        <div className="flex items-center justify-between py-3">
                          <span>{sc.support}</span>
                          <span className="text-white font-semibold">{sc.available247}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}