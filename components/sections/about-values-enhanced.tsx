'use client';

import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { RichText } from '@/components/ui/safe-html';
import { Heart, Target, Users, Globe, Award, Shield, Lightbulb, Handshake } from 'lucide-react';
import { AboutUs, AboutValue } from '@/lib/types';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { ABOUT_CONTENT } from '@/lib/content/about-content';
import { companyName as resolveCompanyName } from '@/lib/company';

interface AboutValuesEnhancedProps {
  aboutData: AboutUs;
  siteSettings: Record<string, any>;
}

// Icon mapping for dynamic icon selection
const iconMap = {
  Heart,
  Target,
  Users,
  Globe,
  Award,
  Shield,
  Lightbulb,
  Handshake,
};

// Color mapping for dynamic color selection
const colorMap = {
  orange: 'text-brand-orange bg-brand-orange/10 border-brand-orange/20',
  blue: 'text-brand-blue bg-brand-blue/10 border-brand-blue/20',
  green: 'text-green-600 bg-green-100 border-green-200',
  purple: 'text-purple-600 bg-purple-100 border-purple-200',
  red: 'text-red-600 bg-red-100 border-red-200',
};

export function AboutValuesEnhanced({ aboutData, siteSettings }: AboutValuesEnhancedProps) {
  const { locale } = useLanguage();
  const ac = ABOUT_CONTENT[locale].values;
  const companyName = resolveCompanyName(siteSettings, locale);

  // Default values if none provided
  const defaultValues: AboutValue[] = ac.items.map((v, i) => ({
    ...v,
    color: (['orange', 'blue', 'green', 'purple', 'red'] as const)[i % 5],
    sort_order: i + 1,
  }));

  // Use provided values or defaults, sorted by sort_order
  const values = (aboutData.values && aboutData.values.length > 0 ? aboutData.values : defaultValues)
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

  const getIcon = (iconName?: string) => {
    if (!iconName || !iconMap[iconName as keyof typeof iconMap]) {
      return Heart; // Default icon
    }
    return iconMap[iconName as keyof typeof iconMap];
  };

  const getColorClasses = (color?: string) => {
    if (!color || !colorMap[color as keyof typeof colorMap]) {
      return colorMap.orange; // Default color
    }
    return colorMap[color as keyof typeof colorMap];
  };

  return (
    <section className="bg-gray-50 py-20">
      <div className="container">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center rounded-full bg-brand-orange/10 px-4 py-2 text-sm font-medium text-brand-orangeText mb-6">
            <Heart className="h-4 w-4 mr-2" />
            {ac.badge}
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            {ac.heading}
          </h2>
          <p className="text-lg text-gray-600">
            {ac.subheading}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Values Grid */}
          <div className="grid gap-6">
            {values.map((value, index) => {
              const IconComponent = getIcon(value.icon);
              const colorClasses = getColorClasses(value.color);
              
              return (
                <Card key={value.id || index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${colorClasses}`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                          {value.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Values Image */}
          <div className="relative lg:sticky lg:top-8">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br from-brand-orange/10 to-brand-blue/10 shadow-xl">
              {aboutData.values_image_url ? (
                <Image
                  src={aboutData.values_image_url}
                  alt={`${companyName} Values and Culture`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center p-8">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <Heart className="h-10 w-10 text-brand-orangeText" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3">
                      {ac.coreValuesTitle}
                    </h3>
                    <p className="text-gray-600">
                      {ac.principlesCaption}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Floating Stats */}
            <div className="absolute -bottom-6 -right-6 bg-white rounded-xl p-6 shadow-xl border">
              <div className="text-center">
                <div className="text-2xl font-bold text-brand-orangeText mb-1">100%</div>
                <div className="text-sm text-gray-600">{ac.commitment}</div>
              </div>
            </div>

            <div className="absolute -top-6 -left-6 bg-white rounded-xl p-6 shadow-xl border">
              <div className="text-center">
                <div className="text-2xl font-bold text-brand-blue mb-1">{values.length}</div>
                <div className="text-sm text-gray-600">{ac.badge}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Values Summary */}
        <div className="mt-20 bg-white rounded-2xl p-8 lg:p-12 shadow-lg">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
              {ac.livingTitle}
            </h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              {ac.livingBody}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}