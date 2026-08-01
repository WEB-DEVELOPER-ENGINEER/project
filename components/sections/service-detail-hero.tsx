'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, Star, Users, Clock, Award } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { Service } from '@/lib/types';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { localizedPath } from '@/lib/locale';
import { SERVICE_DETAIL_CONTENT, fill } from '@/lib/content/service-detail-content';

interface ServiceDetailHeroProps {
  service: Service;
  siteSettings?: Record<string, any>;
}

// Icon mapping for different service types
const serviceIcons: Record<string, any> = {
  'translation': Star,
  'interpretation': Users,
  'localization': Clock,
  'consulting': Award,
  'default': Star
};

export function ServiceDetailHero({ service, siteSettings = {} }: ServiceDetailHeroProps) {
  const { locale } = useLanguage();
  const sc = SERVICE_DETAIL_CONTENT[locale];
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Get appropriate icon for service
  const getServiceIcon = () => {
    const serviceType = service.slug.toLowerCase();
    return serviceIcons[serviceType] || serviceIcons.default;
  };

  const ServiceIcon = getServiceIcon();

  // Use dynamic benefits from database with safe array handling
  const benefits = Array.isArray(service.key_benefits) 
    ? service.key_benefits.slice(0, 4) // Limit to 4 for hero section
    : (service.key_benefits ? [service.key_benefits] : []);

  // Use dynamic stats from success metrics with safe handling
  const stats = service.success_metrics 
    ? Object.entries(service.success_metrics).slice(0, 4).map(([key, value]) => ({
        label: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        value: value
      }))
    : [];

  const companyName = siteSettings.company_name || 'JUSOR Translation Services';

  const handleContactClick = () => {
    window.location.href = '/contact';
  };

  const handleLearnMoreClick = () => {
    const contentSection = document.getElementById('service-content-section');
    if (contentSection) {
      contentSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      ref={ref}
      className="relative overflow-hidden bg-gradient-to-br from-white via-gray-50 to-blue-50 pt-24 pb-16 sm:pt-32 sm:pb-24"
      aria-labelledby="service-hero-heading"
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
                className="hover:text-brand-orange transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2 rounded"
              >
                {sc.home}
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link 
                href={localizedPath('/services', locale)}
                className="hover:text-brand-orange transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2 rounded"
              >
                {sc.services}
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-900 font-medium" aria-current="page">
              {service.title}
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            {/* Back Link */}
            <div 
              className={`mb-6 transition-all duration-700 delay-100 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <Link 
                href={localizedPath('/services', locale)}
                className="inline-flex items-center text-brand-blue hover:text-brand-orange transition-colors duration-300 font-medium group focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 rounded"
              >
                <ArrowRight className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" aria-hidden="true" />
                {sc.backToServices}
              </Link>
            </div>

            {/* Hero Content */}
            <div className="relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* Left Column - Content */}
                <div className="text-center lg:text-left">
                  {/* Service Icon or Hero Image */}
                  {service.hero_image_url ? (
                    <div 
                      className={`inline-block mb-8 transition-all duration-700 ${
                        inView ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                      }`}
                    >
                      <img 
                        src={service.hero_image_url} 
                        alt={`${service.title} hero image`}
                        className="w-20 h-20 rounded-2xl object-cover shadow-lg"
                      />
                    </div>
                  ) : (
                    <div 
                      className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-brand-orange to-brand-blue rounded-2xl mb-8 transition-all duration-700 ${
                        inView ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                      }`}
                    >
                      <ServiceIcon className="h-10 w-10 text-white" aria-hidden="true" />
                    </div>
                  )}

                  {/* Title */}
                  <h1 
                    id="service-hero-heading"
                    className={`text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight transition-all duration-700 delay-100 ${
                      inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                  >
                    {service.title}
                  </h1>

                  {/* Short Description or Content */}
                  <div 
                    className={`text-xl text-gray-600 mb-8 leading-relaxed transition-all duration-700 delay-200 ${
                      inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                    dangerouslySetInnerHTML={{ 
                      __html: service.short_description || service.content || sc.heroFallbackDescription
                    }}
                  />

                  {/* Key Benefits - Dynamic */}
                  {benefits.length > 0 && (
                    <div 
                      className={`mb-8 transition-all duration-700 delay-300 ${
                        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                      }`}
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {benefits.map((benefit, index) => (
                          <div key={index} className="flex items-center text-gray-700">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" aria-hidden="true" />
                            <span className="font-medium">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CTA Buttons - Dynamic */}
                  <div 
                    className={`flex flex-col sm:flex-row gap-4 justify-center lg:justify-start transition-all duration-700 delay-400 ${
                      inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                  >
                    <Button 
                      size="lg" 
                      className="bg-brand-orange hover:bg-brand-orange/90 text-white px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 group"
                      onClick={() => {
                        if (service.cta_primary_url) {
                          window.location.href = service.cta_primary_url;
                        } else {
                          const contactSection = document.getElementById('contact-form-section');
                          if (contactSection) {
                            contactSection.scrollIntoView({ behavior: 'smooth' });
                          } else {
                            window.location.href = '/contact';
                          }
                        }
                      }}
                    >
                      {service.cta_primary_text || sc.getStartedToday}
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" aria-hidden="true" />
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="border-2 border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white px-8 py-4 text-lg font-semibold transition-all duration-300"
                      onClick={() => {
                        if (service.cta_secondary_url) {
                          window.location.href = service.cta_secondary_url;
                        } else {
                          const featuresSection = document.getElementById('service-features-section');
                          if (featuresSection) {
                            featuresSection.scrollIntoView({ behavior: 'smooth' });
                          }
                        }
                      }}
                    >
                      {service.cta_secondary_text || sc.learnMore}
                    </Button>
                  </div>
                </div>

                {/* Right Column - Stats - Dynamic */}
                {stats.length > 0 && (
                  <div className="text-center lg:text-left">
                    <div 
                      className={`bg-white/90 backdrop-blur-md rounded-3xl p-8 border border-gray-200 shadow-lg transition-all duration-700 delay-500 ${
                        inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                      }`}
                    >
                      <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                        {sc.whyChooseUs}
                      </h2>
                      <div className="grid grid-cols-2 gap-6">
                        {stats.map((stat, index) => (
                          <div key={index} className="text-center">
                            <div className="text-3xl lg:text-4xl font-bold text-brand-orange mb-2">
                              {stat.value}
                            </div>
                            <div className="text-gray-600 font-medium text-sm lg:text-base">
                              {stat.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Visual Element */}
          <div 
            className={`relative transition-all duration-700 delay-600 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="relative">
              {/* Main card */}
              <div className="bg-white rounded-2xl shadow-2xl p-8 lg:p-12 border border-gray-100">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-brand-orange to-brand-blue mb-6">
                    <ServiceIcon className="h-12 w-12 text-white" aria-hidden="true" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {fill(sc.professionalService, service.title)}
                  </h2>
                  <p className="text-gray-600 mb-6">
                    {sc.expertSolutionsBody}
                  </p>
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                      {sc.availableNow}
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                      {sc.expertTeam}
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