'use client';

import Link from 'next/link';
import { ArrowRight, Scale, Cog, Building, Heart, GraduationCap, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RichText } from '@/components/ui/safe-html';
import { useInView } from 'react-intersection-observer';
import { Service } from '@/lib/types';

interface ServicesSectionProps {
  services: Service[];
  siteSettings?: Record<string, any>;
}

// Icon mapping for services
const getServiceIcon = (iconName?: string) => {
  switch (iconName?.toLowerCase()) {
    case 'scale':
      return Scale;
    case 'cog':
      return Cog;
    case 'building':
      return Building;
    case 'heart':
      return Heart;
    case 'graduation-cap':
      return GraduationCap;
    case 'file-text':
      return FileText;
    default:
      return FileText;
  }
};

export function ServicesSection({ services, siteSettings = {} }: ServicesSectionProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Only show services if we have data from database
  if (!services || services.length === 0) {
    return null; // Don't render section if no services available
  }

  return (
    <section 
      id="services-section"
      className="section-padding bg-gray-50"
      aria-labelledby="services-heading"
    >
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center rounded-full bg-brand-orange/10 px-4 py-2 text-sm font-medium text-brand-orange mb-4">
            {siteSettings.services_section_badge || 'Our Translation Services'}
          </div>
          <h2 
            id="services-heading"
            className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4"
          >
            {siteSettings.services_section_title || 'Professional Translation Solutions'}
          </h2>
          <p className="text-lg leading-8 text-gray-600">
            {siteSettings.services_section_description || 'Comprehensive translation services across multiple industries and document types. Certified translators, quality assurance, and fast delivery guaranteed.'}
          </p>
        </div>

        <div 
          ref={ref}
          className={`mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 xl:grid-cols-3 transition-all duration-1000 ${
            inView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          {services.map((service, index) => {
            const IconComponent = getServiceIcon(service.icon?.name || service.icon?.icon_class);

            return (
              <Card 
                key={service.id}
                className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 bg-white border-0"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-brand-orange/10 group-hover:bg-brand-orange/20 transition-colors duration-300">
                      <IconComponent className="h-6 w-6 text-brand-orange" aria-hidden="true" />
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/services/${service.slug}`} className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Learn More
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900 group-hover:text-brand-orange transition-colors">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RichText 
                    content={service.content}
                    className="text-gray-600 text-base leading-7"
                  />
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-sm border">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {siteSettings.services_cta_title || 'Need a Custom Translation Solution?'}
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              {siteSettings.services_cta_description || "Don't see your specific translation needs listed? We offer customized translation solutions for specialized industries and unique document types."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-brand-orange hover:bg-brand-orange/90"
                onClick={() => {
                  window.location.href = '/contact';
                }}
              >
                {siteSettings.services_cta_primary_text || 'Get Custom Quote'}
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white"
                asChild
              >
                <Link href={siteSettings.services_cta_secondary_url || '/services'}>
                  {siteSettings.services_cta_secondary_text || 'View All Services'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}