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

import { useLanguage } from '@/components/providers/LanguageProvider';
import { cn } from '@/lib/utils';

export function ServicesSection({ services, siteSettings = {} }: ServicesSectionProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const { t, isRtl } = useLanguage();

  // Only show services if we have data from database
  if (!services || services.length === 0) {
    return null; // Don't render section if no services available
  }

  const getLocalizedService = (service: Service) => {
    if (isRtl) {
      if (service.slug === 'legal-translation') {
        return { title: t('services.legalTitle'), content: t('services.legalContent') };
      }
      if (service.slug === 'technical-translation') {
        return { title: t('services.technicalTitle'), content: t('services.technicalContent') };
      }
      if (service.slug === 'business-translation') {
        return { title: t('services.businessTitle'), content: t('services.businessContent') };
      }
      if (service.slug === 'medical-translation') {
        return { title: t('services.medicalTitle'), content: t('services.medicalContent') };
      }
    }
    return { title: service.title, content: service.content };
  };

  return (
    <section 
      id="services-section"
      className="section-padding bg-gray-50 dark:bg-gray-900/50"
      aria-labelledby="services-heading"
    >
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center rounded-full bg-brand-orange/10 px-4 py-2 text-sm font-medium text-brand-orange mb-4">
            {isRtl ? 'خدمات الترجمة لدينا' : 'Our Translation Services'}
          </div>
          <h2 
            id="services-heading"
            className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl mb-4"
          >
            {t('services.sectionTitle')}
          </h2>
          <p className="text-lg leading-8 text-gray-600 dark:text-gray-300">
            {t('services.sectionSubtitle')}
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
            const localized = getLocalizedService(service);

            return (
              <Card 
                key={service.id}
                className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800 border-0"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-brand-orange/10 group-hover:bg-brand-orange/20 transition-colors duration-300">
                      <IconComponent className="h-6 w-6 text-brand-orange" aria-hidden="true" />
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/services/${service.slug}`} className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {isRtl ? 'اعرف المزيد' : 'Learn More'}
                        <ArrowRight className={cn('ml-2 h-4 w-4', isRtl && 'rotate-180 mr-2 ml-0')} />
                      </Link>
                    </Button>
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100 group-hover:text-brand-orange transition-colors">
                    {localized.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RichText 
                    content={localized.content}
                    className="text-gray-600 dark:text-gray-300 text-base leading-7"
                  />
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {isRtl ? 'هل تحتاج إلى حلول ترجمة مخصصة؟' : 'Need a Custom Translation Solution?'}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              {isRtl ? 'هل لديك وثائق أو احتياجات لغوية خاصة لم تذكر أعلاه؟ نقدم خدمات ترجمة وحلول توطين مخصصة لكافة القطاعات.' : "Don't see your specific translation needs listed? We offer customized translation solutions for specialized industries and unique document types."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-brand-orange hover:bg-brand-orange/90"
                onClick={() => {
                  window.location.href = '/contact';
                }}
              >
                {isRtl ? 'طلب عرض سعر مخصص' : 'Get Custom Quote'}
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white"
                asChild
              >
                <Link href="/services">
                  {t('services.viewAll')}
                  <ArrowRight className={cn('ml-2 h-5 w-5', isRtl && 'rotate-180 mr-2 ml-0')} />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}