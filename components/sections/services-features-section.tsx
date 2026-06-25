'use client';

import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Award, Users, Clock, Shield, Zap, Globe } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

interface ServicesFeaturesSectionProps {
  features: any[];
  siteSettings?: Record<string, any>;
}

// Icon mapping for features
const getFeatureIcon = (iconName?: string) => {
  const iconMap: Record<string, any> = {
    'award': Award,
    'users': Users,
    'clock': Clock,
    'shield': Shield,
    'zap': Zap,
    'globe': Globe,
    'check-circle': CheckCircle,
    'checkcircle': CheckCircle,
    'quality': Award,
    'team': Users,
    'speed': Clock,
    'security': Shield,
    'performance': Zap,
    'global': Globe,
  };

  const normalizedName = iconName?.toLowerCase().replace(/[-_\s]/g, '');
  return iconMap[normalizedName || ''] || CheckCircle;
};

export function ServicesFeaturesSection({ features, siteSettings = {} }: ServicesFeaturesSectionProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Default features if none provided from database
  const defaultFeatures = [
    {
      id: 1,
      title: 'Expert Team',
      description: 'Certified professionals with years of industry experience and proven track records.',
      icon_name: 'award'
    },
    {
      id: 2,
      title: 'Collaborative Approach',
      description: 'We work closely with your team to ensure seamless integration and knowledge transfer.',
      icon_name: 'users'
    },
    {
      id: 3,
      title: 'Fast Delivery',
      description: 'Efficient processes and agile methodologies ensure timely project completion.',
      icon_name: 'clock'
    },
    {
      id: 4,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security measures and robust infrastructure for peace of mind.',
      icon_name: 'shield'
    },
    {
      id: 5,
      title: 'Scalable Solutions',
      description: 'Future-proof architectures that grow with your business needs and requirements.',
      icon_name: 'zap'
    },
    {
      id: 6,
      title: 'Global Reach',
      description: 'Worldwide service delivery with local expertise and cultural understanding.',
      icon_name: 'globe'
    }
  ];

  const displayFeatures = features && features.length > 0 ? features : defaultFeatures;
  const sectionTitle = siteSettings.services_features_title || 'Why Choose Our Services';
  const sectionDescription = siteSettings.services_features_description || 
    'We combine industry expertise with innovative approaches to deliver exceptional results for your business.';

  return (
    <section 
      ref={ref}
      className="section-padding bg-gray-50"
      aria-labelledby="services-features-heading"
    >
      <div className="container">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 
            id="services-features-heading"
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

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayFeatures.map((feature, index) => {
            const IconComponent = getFeatureIcon(feature.icon?.name || feature.icon_name);
            
            return (
              <Card 
                key={feature.id}
                className={`group border-0 shadow-md hover:shadow-lg transition-all duration-500 bg-white hover:-translate-y-1 ${
                  inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{
                  transitionDelay: `${200 + index * 100}ms`
                }}
              >
                <CardContent className="p-8 text-center">
                  {/* Icon */}
                  <div className="mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-brand-orange/10 to-brand-blue/10 group-hover:from-brand-orange/20 group-hover:to-brand-blue/20 transition-all duration-300">
                      <IconComponent 
                        className="h-8 w-8 text-brand-orange group-hover:text-brand-blue transition-colors duration-300" 
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
                    {feature.description || feature.content}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom Stats */}
        <div 
          className={`mt-20 transition-all duration-700 delay-500 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Trusted by Businesses Worldwide
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our commitment to excellence has earned us the trust of companies across industries and continents.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-brand-orange mb-2">
                  99%
                </div>
                <div className="text-gray-600 font-medium">
                  Client Satisfaction
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-brand-blue mb-2">
                  500+
                </div>
                <div className="text-gray-600 font-medium">
                  Projects Delivered
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-brand-orange mb-2">
                  50+
                </div>
                <div className="text-gray-600 font-medium">
                  Expert Team Members
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-brand-blue mb-2">
                  24/7
                </div>
                <div className="text-gray-600 font-medium">
                  Support Available
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}