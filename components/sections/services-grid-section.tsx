'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Scale, Cog, Building, Heart, GraduationCap, FileText, Zap, Shield, Globe } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { Service } from '@/lib/types';
import { ServiceFilter } from './service-filter';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { localizedPath } from '@/lib/locale';

interface ServicesGridSectionProps {
  services: Service[];
  categories?: any[];
  siteSettings?: Record<string, any>;
  enableFiltering?: boolean;
}

// Icon mapping for services - expanded set
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
    'zap': Zap,
    'shield': Shield,
    'globe': Globe,
    'legal': Scale,
    'technical': Cog,
    'business': Building,
    'medical': Heart,
    'academic': GraduationCap,
    'translation': FileText,
    'consulting': Zap,
    'security': Shield,
    'global': Globe,
  };

  const normalizedName = iconName?.toLowerCase().replace(/[-_\s]/g, '');
  return iconMap[normalizedName || ''] || FileText;
};

export function ServicesGridSection({ 
  services, 
  categories = [], 
  siteSettings = {}, 
  enableFiltering = false 
}: ServicesGridSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { locale } = useLanguage();
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Filter services based on active category
  const filteredServices = useMemo(() => {
    if (!activeCategory) return services;
    return services.filter(service => 
      service.category?.slug === activeCategory ||
      service.service_category?.toLowerCase().replace(/\s+/g, '-') === activeCategory
    );
  }, [services, activeCategory]);

  // Don't render if no services
  if (!services || services.length === 0) {
    return null;
  }

  const sectionTitle = siteSettings.services_grid_title || 'Our Professional Services';
  const sectionDescription = siteSettings.services_grid_description || 
    'Comprehensive solutions tailored to meet your unique business needs and drive sustainable growth.';

  const displayServices = enableFiltering ? filteredServices : services;

  return (
    <section 
      id="services-grid-section"
      ref={ref}
      className="section-padding bg-white"
      aria-labelledby="services-grid-heading"
    >
      <div className="container">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 
            id="services-grid-heading"
            className={`text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-6 transition-all duration-700 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {sectionTitle}
          </h2>
          <p 
            className={`text-xl text-gray-600 leading-relaxed transition-all duration-700 delay-100 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {sectionDescription}
          </p>
        </div>

        {/* Service Filter */}
        {enableFiltering && categories.length > 0 && (
          <ServiceFilter
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            servicesCount={displayServices.length}
            services={services}
          />
        )}

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayServices.map((service, index) => {
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
                        className="h-8 w-8 text-brand-orange group-hover:text-brand-blue transition-colors duration-300" 
                        aria-hidden="true"
                      />
                    </div>
                  </div>

                  {/* Title */}
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-brand-blue transition-colors duration-300 mb-2">
                    {service.title}
                  </CardTitle>

                  {/* Category Badge */}
                  {service.category && (
                    <div className="mb-2">
                      <span 
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: service.category.color }}
                      >
                        {service.category.name}
                      </span>
                    </div>
                  )}
                </CardHeader>

                <CardContent className="relative">
                  {/* Description */}
                  <CardDescription className="text-gray-600 leading-relaxed mb-6 line-clamp-3">
                    {service.content.replace(/<[^>]*>/g, '').substring(0, 150)}
                    {service.content.length > 150 ? '...' : ''}
                  </CardDescription>

                  {/* CTA Link */}
                  <Link 
                    href={localizedPath(`/services/${service.translation_group || service.slug}`, locale)}
                    className="inline-flex items-center text-brand-orange hover:text-brand-blue font-semibold transition-colors duration-300 group/link"
                    aria-label={`Learn more about ${service.title}`}
                  >
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4 group-hover/link:translate-x-1 transition-transform duration-300" aria-hidden="true" />
                  </Link>
                </CardContent>

                {/* Hover border effect */}
                <div className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-brand-orange/20 transition-colors duration-300 pointer-events-none" />
              </Card>
            );
          })}
        </div>

        {/* Empty State for Filtering */}
        {enableFiltering && displayServices.length === 0 && activeCategory && (
          <div className="text-center py-12">
            <div className="mx-auto max-w-md">
              <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                <FileText className="h-full w-full" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No services found
              </h3>
              <p className="text-gray-500 mb-4">
                No services match the selected category. Try selecting a different category or view all services.
              </p>
              <Button 
                variant="outline"
                onClick={() => setActiveCategory(null)}
              >
                View All Services
              </Button>
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div 
          className={`text-center mt-16 transition-all duration-700 delay-500 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Need a Custom Solution?
            </h3>
            <p className="text-gray-600 mb-6">
              Don&apos;t see exactly what you&apos;re looking for? We specialize in creating tailored solutions 
              that perfectly match your unique business requirements.
            </p>
            <Button 
              size="lg"
              className="bg-brand-blue hover:bg-brand-blue/90 text-white px-8 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => {
                window.location.href = '/contact';
              }}
            >
              Discuss Your Needs
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
