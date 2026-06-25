'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Star, Award, Shield } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { Service } from '@/lib/types';

interface ServiceDetailSpecificationsProps {
  service: Service;
  siteSettings?: Record<string, any>;
}

export function ServiceDetailSpecifications({ service, siteSettings = {} }: ServiceDetailSpecificationsProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Use dynamic specifications from database with safe handling
  const specifications = service.specifications || {};
  const hasSpecifications = Object.keys(specifications).length > 0;

  // Use dynamic certifications and industry focus with safe array handling
  const certifications = Array.isArray(service.certifications) 
    ? service.certifications 
    : (service.certifications ? [service.certifications] : []);

  const industryFocus = Array.isArray(service.industry_focus) 
    ? service.industry_focus 
    : (service.industry_focus ? [service.industry_focus] : []);

  const languagesSupported = Array.isArray(service.languages_supported) 
    ? service.languages_supported 
    : (service.languages_supported ? [service.languages_supported] : []);

  const serviceTags = Array.isArray(service.service_tags) 
    ? service.service_tags 
    : (service.service_tags ? [service.service_tags] : []);

  // If no specifications data, don't render the section
  if (!hasSpecifications && certifications.length === 0 && industryFocus.length === 0 && languagesSupported.length === 0) {
    return null;
  }

  return (
    <section 
      ref={ref}
      className="section-padding bg-white"
      aria-labelledby="service-specifications-heading"
    >
      <div className="container">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 
            id="service-specifications-heading"
            className={`text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-6 transition-all duration-700 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Service Specifications
          </h2>
          <p 
            className={`text-xl text-gray-600 leading-relaxed transition-all duration-700 delay-100 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Detailed specifications and capabilities for our {service.title.toLowerCase()} service.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Specifications */}
          <div className="space-y-8">
            {/* Technical Specifications */}
            {hasSpecifications && (
              <Card 
                className={`border-0 shadow-lg transition-all duration-700 delay-200 ${
                  inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-brand-orange to-brand-blue rounded-lg flex items-center justify-center mr-4">
                      <Shield className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Technical Specifications
                    </h3>
                  </div>
                  
                  <div className="space-y-4">
                    {Object.entries(specifications).map(([key, value]) => (
                      <div key={key}>
                        <h4 className="font-semibold text-gray-900 mb-2 capitalize">
                          {key.replace(/_/g, ' ')}
                        </h4>
                        {Array.isArray(value) ? (
                          <div className="flex flex-wrap gap-2">
                            {value.map((item, index) => (
                              <Badge key={index} variant="secondary" className="text-sm">
                                {item}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-600">{value}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Languages Supported */}
            {languagesSupported.length > 0 && (
              <Card 
                className={`border-0 shadow-lg transition-all duration-700 delay-300 ${
                  inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-brand-blue to-brand-orange rounded-lg flex items-center justify-center mr-4">
                      <Star className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Languages Supported
                    </h3>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {languagesSupported.map((language, index) => (
                      <Badge key={index} variant="outline" className="text-sm">
                        {language}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Certifications & Industry Focus */}
          <div className="space-y-8">
            {/* Certifications */}
            {certifications.length > 0 && (
              <Card 
                className={`border-0 shadow-lg transition-all duration-700 delay-400 ${
                  inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-brand-orange to-brand-blue rounded-lg flex items-center justify-center mr-4">
                      <Award className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Certifications & Standards
                    </h3>
                  </div>
                  
                  <div className="space-y-3">
                    {certifications.map((certification, index) => (
                      <div key={index} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" aria-hidden="true" />
                        <span className="text-gray-700 font-medium">{certification}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Industry Focus */}
            {industryFocus.length > 0 && (
              <Card 
                className={`border-0 shadow-lg transition-all duration-700 delay-500 ${
                  inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-brand-blue to-brand-orange rounded-lg flex items-center justify-center mr-4">
                      <CheckCircle className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Industry Focus
                    </h3>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {industryFocus.map((industry, index) => (
                      <Badge key={index} variant="default" className="bg-brand-blue text-white text-sm">
                        {industry}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Service Tags */}
            {serviceTags.length > 0 && (
              <Card 
                className={`border-0 shadow-lg transition-all duration-700 delay-600 ${
                  inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">
                    Service Tags
                  </h3>
                  
                  <div className="flex flex-wrap gap-2">
                    {serviceTags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-sm">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Service Highlights */}
        {service.service_highlights && Object.keys(service.service_highlights).length > 0 && (
          <div 
            className={`mt-16 transition-all duration-700 delay-700 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <Card className="border-0 shadow-xl bg-gradient-to-br from-gray-50 to-white">
              <CardContent className="p-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                  Service Highlights
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {Object.entries(service.service_highlights).map(([key, value], index) => (
                    <div key={key} className="text-center">
                      <div className="text-2xl font-bold text-brand-orange mb-2">
                        {value}
                      </div>
                      <div className="text-gray-600 font-medium capitalize">
                        {key.replace(/_/g, ' ')}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
}
