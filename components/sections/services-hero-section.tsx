'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { Service } from '@/lib/types';

interface ServicesHeroSectionProps {
  services: Service[];
  siteSettings?: Record<string, any>;
}

export function ServicesHeroSection({ services, siteSettings = {} }: ServicesHeroSectionProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const companyName = siteSettings.company_name || 'JUSOR Translation Services';
  const heroTitle = siteSettings.services_hero_title || 'Professional Services That Drive Results';
  const heroDescription = siteSettings.services_hero_description || 
    'Comprehensive solutions designed to accelerate your business growth and digital transformation journey.';

  // Key benefits/highlights
  const highlights = [
    'Expert consultation and strategy',
    'Proven methodologies and best practices',
    'Scalable solutions for any business size',
    'Dedicated support and ongoing partnership'
  ];

  const handleScrollToServices = () => {
    const servicesSection = document.getElementById('services-grid-section');
    if (servicesSection) {
      servicesSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleContactClick = () => {
    window.location.href = '/contact';
      // Fallback to contact page
  };

  return (
    <section 
      ref={ref}
      className="relative overflow-hidden bg-gradient-to-br from-white via-gray-50 to-blue-50 pt-24 pb-16 sm:pt-32 sm:pb-24"
      aria-labelledby="services-hero-heading"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-gray-100/50 bg-[size:20px_20px] opacity-30" />
      <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-brand-orange/20 to-brand-blue/20 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-tr from-brand-blue/20 to-brand-orange/20 blur-3xl" />
      
      <div className="container relative">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div 
            className={`inline-flex items-center rounded-full bg-brand-orange/10 px-4 py-2 text-sm font-medium text-brand-orange mb-6 transition-all duration-700 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <CheckCircle className="mr-2 h-4 w-4" aria-hidden="true" />
            Professional Services
          </div>

          {/* Main heading */}
          <h1 
            id="services-hero-heading"
            className={`text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl mb-6 transition-all duration-700 delay-100 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {heroTitle}
          </h1>

          {/* Description */}
          <p 
            className={`text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed transition-all duration-700 delay-200 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {heroDescription}
          </p>

          {/* Highlights */}
          <div 
            className={`grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 max-w-2xl mx-auto transition-all duration-700 delay-300 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {highlights.map((highlight, index) => (
              <div 
                key={index}
                className="flex items-center text-left"
              >
                <CheckCircle 
                  className="h-5 w-5 text-brand-orange mr-3 flex-shrink-0" 
                  aria-hidden="true"
                />
                <span className="text-gray-700 font-medium">{highlight}</span>
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
              className="bg-brand-orange hover:bg-brand-orange/90 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
              onClick={handleScrollToServices}
              aria-describedby="explore-services-description"
            >
              Explore Our Services
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" aria-hidden="true" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white px-8 py-3 text-lg font-semibold transition-all duration-300"
              onClick={handleContactClick}
              aria-describedby="get-consultation-description"
            >
              Get Free Consultation
            </Button>
          </div>

          {/* Screen reader descriptions */}
          <div className="sr-only">
            <p id="explore-services-description">
              Scroll down to view our comprehensive range of professional services
            </p>
            <p id="get-consultation-description">
              Contact us for a free consultation about your business needs
            </p>
          </div>

          {/* Stats */}
          {services.length > 0 && (
            <div 
              className={`mt-16 pt-8 border-t border-gray-200 transition-all duration-700 delay-500 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-lg mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold text-brand-orange mb-2">
                    {services.length}+
                  </div>
                  <div className="text-gray-600 font-medium">
                    Professional Services
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-brand-blue mb-2">
                    10+
                  </div>
                  <div className="text-gray-600 font-medium">
                    Years Experience
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-brand-orange mb-2">
                    500+
                  </div>
                  <div className="text-gray-600 font-medium">
                    Successful Projects
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}