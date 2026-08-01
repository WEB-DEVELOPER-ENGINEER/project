'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Scale, Cog, Building, Heart, GraduationCap, FileText } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { Service } from '@/lib/types';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { localizedPath } from '@/lib/locale';
import { SERVICE_DETAIL_CONTENT, fill } from '@/lib/content/service-detail-content';

interface RelatedServicesSectionProps {
  services: Service[];
  currentService: Service;
  siteSettings?: Record<string, any>;
}

// Icon mapping for services
const getServiceIcon = (iconName?: string) => {
  const iconMap: Record<string, any> = {
    'scale': Scale,
    'cog': Cog,
    'building': Building,
    'heart': Heart,
    'graduation-cap': GraduationCap,
    'graduationcap': GraduationCap,
    'file-text': FileText,
    'filetext': FileText,
    'legal': Scale,
    'technical': Cog,
    'business': Building,
    'medical': Heart,
    'academic': GraduationCap,
    'translation': FileText,
  };

  const normalizedName = iconName?.toLowerCase().replace(/[-_\s]/g, '');
  return iconMap[normalizedName || ''] || FileText;
};

export function RelatedServicesSection({ services, currentService, siteSettings = {} }: RelatedServicesSectionProps) {
  const { locale } = useLanguage();
  const sc = SERVICE_DETAIL_CONTENT[locale];
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  if (!services || services.length === 0) {
    return null;
  }

  return (
    <section 
      ref={ref}
      className="section-padding bg-gray-50"
      aria-labelledby="related-services-heading"
    >
      <div className="container">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 
            id="related-services-heading"
            className={`text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-6 transition-all duration-700 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {sc.relatedServices}
          </h2>
          <p 
            className={`text-xl text-gray-600 leading-relaxed transition-all duration-700 delay-100 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {fill(sc.relatedServicesBody, currentService.title)}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = getServiceIcon(service.icon?.name || service.icon?.icon_class);
            
            return (
              <Card 
                key={service.id}
                className={`group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 bg-white ${
                  inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{
                  transitionDelay: `${200 + index * 100}ms`
                }}
              >
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/5 to-brand-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <CardHeader className="relative pb-4">
                  {/* Icon */}
                  <div className="mb-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-orange/10 to-brand-blue/10 group-hover:from-brand-orange/20 group-hover:to-brand-blue/20 transition-all duration-300">
                      <IconComponent 
                        className="h-8 w-8 text-brand-orangeText group-hover:text-brand-blue transition-colors duration-300" 
                        aria-hidden="true"
                      />
                    </div>
                  </div>

                  {/* Title */}
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-brand-blue transition-colors duration-300 mb-2">
                    {service.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="relative">
                  {/* Description */}
                  <CardDescription className="text-gray-600 leading-relaxed mb-6 line-clamp-3">
                    {service.content.replace(/<[^>]*>/g, '').substring(0, 120)}
                    {service.content.length > 120 ? '...' : ''}
                  </CardDescription>

                  {/* CTA Link */}
                  <Link 
                    href={localizedPath(`/services/${service.translation_group || service.slug}`, locale)}
                    className="inline-flex items-center text-brand-orangeText hover:text-brand-blue font-semibold transition-colors duration-300 group/link"
                    aria-label={`${sc.learnMore} — ${service.title}`}
                  >
                    {sc.learnMore}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover/link:translate-x-1 transition-transform duration-300" aria-hidden="true" />
                  </Link>
                </CardContent>

                {/* Hover border effect */}
                <div className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-brand-orange/20 transition-colors duration-300 pointer-events-none" />
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div 
          className={`text-center mt-16 transition-all duration-700 delay-500 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {sc.needMultiple}
            </h3>
            <p className="text-gray-600 mb-6">
              {sc.needMultipleBody}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href={localizedPath('/services', locale)}
                className="inline-flex items-center justify-center bg-brand-orangeText hover:bg-brand-orangeText/90 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2"
              >
                {sc.viewAllServices}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" aria-hidden="true" />
              </Link>
              <button 
                className="border-2 border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2"
                onClick={() => {
                  window.location.href = '/contact';
                }}
              >
                {sc.contactUs}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}