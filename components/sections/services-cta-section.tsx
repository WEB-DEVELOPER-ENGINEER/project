'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Phone, Mail, MessageCircle } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { trackPhoneClick, trackEmailClick } from '@/lib/analytics-events';

interface ServicesCTASectionProps {
  siteSettings?: Record<string, any>;
}

export function ServicesCTASection({ siteSettings = {} }: ServicesCTASectionProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const companyName = siteSettings.company_name || 'JUSOR Translation Services';
  const ctaTitle = siteSettings.services_cta_title || 'Ready to Transform Your Business?';
  const ctaDescription = siteSettings.services_cta_description || 
    'Join hundreds of satisfied clients who have accelerated their growth with our professional services. Let\'s discuss how we can help you achieve your goals.';
  const companyPhone = siteSettings.company_phone;
  const companyEmail = siteSettings.company_email;

  const handleContactClick = () => {
    window.location.href = '/contact';
  };

  const handlePhoneClick = () => {
    if (companyPhone) {
      trackPhoneClick(companyPhone, 'services_cta_section');
      window.location.href = `tel:${companyPhone}`;
    }
  };

  const handleEmailClick = () => {
    if (companyEmail) {
      trackEmailClick(companyEmail, 'services_cta_section');
      window.location.href = `mailto:${companyEmail}`;
    }
  };

  return (
    <section 
      ref={ref}
      className="section-padding bg-gradient-to-br from-brand-blue via-brand-blue/95 to-brand-orange/90 relative overflow-hidden"
      aria-labelledby="services-cta-heading"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0.6))]" />
      <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-brand-orange/20 blur-3xl" />
      
      <div className="container relative">
        <div className="mx-auto max-w-4xl text-center">
          {/* Main CTA Content */}
          <div 
            className={`transition-all duration-700 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <h2 
              id="services-cta-heading"
              className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl mb-6"
            >
              {ctaTitle}
            </h2>
            <p className="text-xl text-blue-100 leading-relaxed mb-10 max-w-3xl mx-auto">
              {ctaDescription}
            </p>
          </div>

          {/* CTA Buttons */}
          <div 
            className={`flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 transition-all duration-700 delay-200 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <Button 
              size="lg"
              className="bg-white text-brand-blue hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 group"
              onClick={handleContactClick}
              aria-describedby="get-started-description"
            >
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" aria-hidden="true" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-white text-white hover:bg-white hover:text-brand-blue px-8 py-4 text-lg font-semibold transition-all duration-300 bg-transparent"
              onClick={() => {
                const servicesSection = document.getElementById('services-grid-section');
                if (servicesSection) {
                  servicesSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              aria-describedby="view-services-description"
            >
              View All Services
            </Button>
          </div>

          {/* Contact Options */}
          <div 
            className={`transition-all duration-700 delay-400 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <p className="text-blue-100 mb-6 text-lg">
              Or reach out to us directly:
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
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
              
              <button
                onClick={handleContactClick}
                className="flex items-center text-white hover:text-blue-100 transition-colors duration-300 group focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-blue rounded-lg px-4 py-2"
                aria-label="Send us a message through our contact form"
              >
                <MessageCircle className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform duration-300" aria-hidden="true" />
                <span className="font-semibold">Send Message</span>
              </button>
            </div>
          </div>

          {/* Trust Indicators */}
          <div 
            className={`mt-16 pt-8 border-t border-white/20 transition-all duration-700 delay-600 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  24/7
                </div>
                <div className="text-blue-100 font-medium">
                  Support Available
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  99%
                </div>
                <div className="text-blue-100 font-medium">
                  Client Satisfaction
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  500+
                </div>
                <div className="text-blue-100 font-medium">
                  Projects Delivered
                </div>
              </div>
            </div>
          </div>

          {/* Screen reader descriptions */}
          <div className="sr-only">
            <p id="get-started-description">
              Contact us to begin your project and receive a free consultation
            </p>
            <p id="view-services-description">
              Scroll up to view our complete range of professional services
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}