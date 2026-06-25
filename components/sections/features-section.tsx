'use client';

import { Shield, Zap, Globe, Users, BarChart3, Lock, FileText, Clock, Heart, Scale, Cog, Building } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RichText } from '@/components/ui/safe-html';

interface FeaturesSectionProps {
  features?: any[];
  siteSettings?: Record<string, any>;
}

export function FeaturesSection({ features = [], siteSettings = {} }: FeaturesSectionProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Icon mapping
  const getIcon = (iconName: string) => {
    const iconMap: Record<string, any> = {
      Shield, Zap, Globe, Users, BarChart3, Lock, FileText, Clock, Heart, Scale, Cog, Building
    };
    return iconMap[iconName] || FileText;
  };

  // Use database features or fallback to default
  const featuresData = features.length > 0 ? features : (siteSettings.default_features || [
    {
      title: 'Enterprise Security',
      description: 'Bank-level security with advanced encryption, threat detection, and compliance standards.',
      icon_name: 'Shield',
      icon_color: 'text-green-600 bg-green-100',
    },
    {
      title: 'Lightning Performance',
      description: 'Optimized for speed with global CDN, edge computing, and intelligent caching.',
      icon_name: 'Zap',
      icon_color: 'text-yellow-600 bg-yellow-100',
    },
    {
      title: 'Global Scale',
      description: 'Worldwide infrastructure with 99.9% uptime and automatic failover protection.',
      icon_name: 'Globe',
      icon_color: 'text-blue-600 bg-blue-100',
    }
  ]);

  return (
    <section 
      className="section-padding bg-gray-50"
      aria-labelledby="features-heading"
    >
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 
            id="features-heading"
            className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
          >
            {siteSettings.features_section_title || 'Built for Enterprise Excellence'}
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            {siteSettings.features_section_description || 'Every feature engineered for reliability, security, and performance at scale.'}
          </p>
        </div>

        <div 
          ref={ref}
          className={`mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 transition-all duration-1000 ${
            inView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          {featuresData.map((feature, index) => {
            const IconComponent = getIcon(feature.icon_name);
            return (
              <Card 
                key={feature.title || feature.name} 
                className="group hover:shadow-lg transition-all duration-300 animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-lg ${feature.icon_color || 'text-blue-600 bg-blue-100'} group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900 group-hover:text-brand-orange transition-colors">
                    {feature.title || feature.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RichText 
                    content={feature.description}
                    className="text-gray-600 text-base leading-7"
                  />
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}