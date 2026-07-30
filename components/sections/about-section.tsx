'use client';

import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Award, Users, Globe } from 'lucide-react';
import { AboutUs } from '@/lib/types';

interface AboutSectionProps {
  aboutUs: AboutUs;
  siteSettings?: Record<string, any>;
}

import { useLanguage } from '@/components/providers/LanguageProvider';
import { cn } from '@/lib/utils';

export function AboutSection({ aboutUs, siteSettings = {} }: AboutSectionProps) {
  const { t, isRtl } = useLanguage();

  // Get achievements from site settings or use defaults
  const achievements = isRtl ? [
    {
      icon: 'Award',
      title: 'خدمات ترجمة معتمدة',
      description: 'نظام إدارة جودة للترجمة'
    },
    {
      icon: 'Users',
      title: '500+ عميل واثق',
      description: 'محل ثقة كبرى الشركات والمؤسسات'
    },
    {
      icon: 'Globe',
      title: '50+ زوج لغوي',
      description: 'تغطية شاملة لجميع اللغات العالمية'
    }
  ] : [
    {
      icon: 'Award',
      title: 'Certified Translation Services',
      description: 'Quality management system certification'
    },
    {
      icon: 'Users',
      title: '500+ Satisfied Clients',
      description: 'Trusted by businesses worldwide'
    },
    {
      icon: 'Globe',
      title: '50+ Language Pairs',
      description: 'Comprehensive language coverage'
    }
  ];

  // Get features
  const features = isRtl ? [
    'مترجمون احترافيون معتمدون',
    'إجراءات تدقيق وضمان الجودة',
    'دعم متواصل على مدار الساعة',
    'تسليم سريع في المواعيد',
    'أسعار تنافسية مدروسة',
    'سرية تامة للمعلومات والمستندات'
  ] : [
    'Certified professional translators',
    'Quality assurance process',
    '24/7 customer support',
    'Fast turnaround times',
    'Competitive pricing',
    'Confidentiality guaranteed'
  ];

  const displayTitle = isRtl ? t('about.sectionTitle') : aboutUs.title;
  const displaySlogan = isRtl ? t('about.slogan') : aboutUs.slogan;
  const displayDescription = isRtl ? t('about.description') : aboutUs.description;

  // Icon mapping
  const getIcon = (iconName: string) => {
    const iconMap: Record<string, any> = { Award, Users, Globe };
    return iconMap[iconName] || Award;
  };

  return (
    <section id="about-section" className="section-padding bg-white dark:bg-gray-900">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center rounded-full bg-brand-blue/10 px-4 py-2 text-sm font-medium text-brand-blue">
                {isRtl ? 'عن شركة جسور للترجمة' : `About ${siteSettings.company_name || 'JUSOR'} Translation`}
              </div>
              
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
                {displayTitle}
              </h2>
              
              {displaySlogan && (
                <p className="text-xl text-brand-orange font-medium">
                  {displaySlogan}
                </p>
              )}
              
              <div 
                className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: displayDescription }}
              />
            </div>

            {/* Features List */}
            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature: string, index: number) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300 font-medium">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg"
                className="bg-brand-orange hover:bg-brand-orange/90"
                onClick={() => {
                  window.location.href = '/contact';
                }}
              >
                {isRtl ? 'ابدأ الآن' : 'Get Started Today'}
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white"
                onClick={() => {
                  window.location.href = '/services';
                }}
              >
                {t('services.viewAll')}
              </Button>
            </div>
          </div>

          {/* Image and Stats */}
          <div className="space-y-8">
            {/* Main Image */}
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-brand-orange/10 to-brand-blue/10">
                {aboutUs.image_url ? (
                  <Image
                    src={aboutUs.image_url}
                    alt={displayTitle}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gradient-to-br from-brand-orange/20 to-brand-blue/20">
                    <div className="text-center p-8">
                      <Globe className="h-16 w-16 mx-auto mb-4 text-brand-blue" />
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        {isRtl ? 'خدمات ترجمة عالمية معتمدة' : 'Global Translation Services'}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {isRtl ? 'نربط مؤسستك بالعالم عبر لغة متقنة وترجمة معتمدة' : 'Connecting businesses worldwide through language'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Floating Achievement Card */}
              <div className={cn('absolute -bottom-6 hidden lg:block', isRtl ? '-left-6' : '-right-6')}>
                <Card className="bg-white dark:bg-gray-800 shadow-xl border-0">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-brand-orange mb-1">
                        15+
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {isRtl ? 'عاماً من الخبرة' : 'Years Experience'}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Achievement Cards */}
            <div className="grid gap-4">
              {achievements.map((achievement: any, index: number) => (
                <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-brand-orange/10 p-3 rounded-lg">
                        {(() => {
                          const IconComponent = getIcon(achievement.icon);
                          return <IconComponent className="h-6 w-6 text-brand-orange" />;
                        })()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                          {achievement.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}