'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Globe, Shield, Clock, Users, Award, Zap, Star, CheckCircle, Target, Lightbulb, Settings, TrendingUp } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { Service } from '@/lib/types';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { SERVICE_DETAIL_CONTENT, fill } from '@/lib/content/service-detail-content';

interface ServiceDetailFeaturesProps {
  service: Service;
  siteSettings?: Record<string, any>;
}

// Icon mapping for dynamic features
const iconMap: Record<string, any> = {
  globe: Globe,
  shield: Shield,
  clock: Clock,
  users: Users,
  award: Award,
  zap: Zap,
  star: Star,
  'check-circle': CheckCircle,
  target: Target,
  lightbulb: Lightbulb,
  settings: Settings,
  'trending-up': TrendingUp,
};

export function ServiceDetailFeatures({ service, siteSettings = {} }: ServiceDetailFeaturesProps) {
  const { locale } = useLanguage();
  const sc = SERVICE_DETAIL_CONTENT[locale];
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Use dynamic features from database with safe array handling
  const features = Array.isArray(service.service_features) 
    ? service.service_features 
    : (service.service_features ? [service.service_features] : []);

  // If no features in database, don't render the section
  if (features.length === 0) {
    return null;
  }

  return (
    <section 
      ref={ref}
      className="section-padding bg-gray-50"
      aria-labelledby="service-features-heading"
    >
      <div className="container">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 
            id="service-features-heading"
            className={`text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-6 transition-all duration-700 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {fill(sc.whatMakesSpecial, service.title)}
          </h2>
          <p 
            className={`text-xl text-gray-600 leading-relaxed transition-all duration-700 delay-100 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {sc.whatMakesSpecialBody}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = iconMap[feature.icon || 'star'] || Star;
            
            return (
              <Card 
                key={index}
                className={`group border-0 shadow-md hover:shadow-xl transition-all duration-500 bg-white hover:bg-gradient-to-br hover:from-brand-orange/5 hover:to-brand-blue/5 ${
                  inView 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
                style={{
                  transitionDelay: `${300 + index * 100}ms`
                }}
              >
                <CardContent className="p-8 text-center">
                  {/* Icon */}
                  <div className="mb-6 flex justify-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-brand-orange to-brand-blue rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <IconComponent 
                        className="h-8 w-8 text-white" 
                        aria-hidden="true"
                      />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-brand-blue transition-colors duration-300">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom Stats - Dynamic Success Metrics */}
        {service.success_metrics && Object.keys(service.success_metrics).length > 0 && (
          <div 
            className={`mt-20 transition-all duration-700 delay-500 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Proven Track Record
                </h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Our {service.title.toLowerCase()} service has helped hundreds of businesses achieve their goals with measurable results.
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {Object.entries(service.success_metrics).slice(0, 4).map(([key, value], index) => (
                  <div key={key} className="text-center">
                    <div className={`text-3xl lg:text-4xl font-bold mb-2 ${
                      index % 2 === 0 ? 'text-brand-orange' : 'text-brand-blue'
                    }`}>
                      {value}
                    </div>
                    <div className="text-gray-600 font-medium">
                      {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}