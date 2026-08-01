'use client';

import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { Service } from '@/lib/types';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { SERVICE_DETAIL_CONTENT, fill } from '@/lib/content/service-detail-content';

interface ServiceDetailContentProps {
  service: Service;
  siteSettings?: Record<string, any>;
}

export function ServiceDetailContent({ service, siteSettings = {} }: ServiceDetailContentProps) {
  const { locale } = useLanguage();
  const sc = SERVICE_DETAIL_CONTENT[locale];
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Use dynamic benefits from database with safe array handling
  const benefits = Array.isArray(service.key_benefits) 
    ? service.key_benefits 
    : (service.key_benefits ? [service.key_benefits] : []);

  // Use dynamic process steps from database with safe array handling
  const processSteps = Array.isArray(service.process_steps) 
    ? service.process_steps 
    : (service.process_steps ? [service.process_steps] : []);

  // Get service highlights with defaults
  const highlights = service.service_highlights || {};

  return (
    <section 
      id="service-content-section"
      ref={ref}
      className="section-padding bg-white"
      aria-labelledby="service-content-heading"
    >
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Main Content */}
          <div>
            <h2 
              id="service-content-heading"
              className={`text-3xl font-bold tracking-tight text-gray-900 mb-8 transition-all duration-700 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              About {service.title}
            </h2>
            
            <div 
              className={`prose prose-lg prose-gray max-w-none transition-all duration-700 delay-200 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <div 
                dangerouslySetInnerHTML={{ 
                  __html: service.overview || service.content || sc.overviewFallback 
                }}
                className="text-gray-600 leading-relaxed"
              />
            </div>

            {/* Key Benefits - Dynamic */}
            {benefits.length > 0 && (
              <div 
                className={`mt-12 transition-all duration-700 delay-400 ${
                  inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  {fill(sc.whyChoose, service.title)}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {benefits.map((benefit, index) => (
                    <div 
                      key={index}
                      className="flex items-start group"
                    >
                      <CheckCircle 
                        className="h-6 w-6 text-brand-orange mr-3 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300" 
                        aria-hidden="true"
                      />
                      <span className="text-gray-700 font-medium leading-relaxed">
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Process Overview - Dynamic */}
            {processSteps.length > 0 && (
              <div 
                className={`mt-12 transition-all duration-700 delay-600 ${
                  inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  {sc.ourApproach}
                </h3>
                <div className="space-y-4">
                  {processSteps.map((step, index) => (
                    <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300">
                      <div className={`w-8 h-8 ${index % 2 === 0 ? 'bg-brand-orange' : 'bg-brand-blue'} text-white rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0`}>
                        {step.step || index + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">{step.title}</h4>
                        <div 
                          className="text-gray-600 text-sm prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ __html: step.description }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:sticky lg:top-8">
            {/* Service Highlights Card */}
            <Card 
              className={`mb-8 border-0 shadow-lg transition-all duration-700 delay-300 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  {sc.serviceHighlights}
                </h3>
                <div className="space-y-4">
                  {highlights.delivery_time && (
                    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                      <span className="text-gray-600 font-medium">{sc.deliveryTime}</span>
                      <span className="text-gray-900 font-semibold">{highlights.delivery_time}</span>
                    </div>
                  )}
                  {highlights.team_size && (
                    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                      <span className="text-gray-600 font-medium">{sc.teamSize}</span>
                      <span className="text-gray-900 font-semibold">{highlights.team_size}</span>
                    </div>
                  )}
                  {highlights.support && (
                    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                      <span className="text-gray-600 font-medium">{sc.support}</span>
                      <span className="text-gray-900 font-semibold">{highlights.support}</span>
                    </div>
                  )}
                  {highlights.guarantee && (
                    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                      <span className="text-gray-600 font-medium">{sc.guarantee}</span>
                      <span className="text-gray-900 font-semibold">{highlights.guarantee}</span>
                    </div>
                  )}
                  {highlights.certification && (
                    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                      <span className="text-gray-600 font-medium">{sc.certification}</span>
                      <span className="text-gray-900 font-semibold">{highlights.certification}</span>
                    </div>
                  )}
                  {highlights.turnaround && (
                    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                      <span className="text-gray-600 font-medium">{sc.turnaround}</span>
                      <span className="text-gray-900 font-semibold">{highlights.turnaround}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* CTA Card */}
            <Card 
              className={`border-0 shadow-lg bg-gradient-to-br from-brand-orange/5 to-brand-blue/5 transition-all duration-700 delay-500 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {sc.readyToStart}
                </h3>
                <p className="text-gray-600 mb-6">
                  {fill(sc.readyToStartBody, service.title)}
                </p>
                <button 
                  className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2"
                  onClick={() => {
                    if (service.cta_primary_url) {
                      window.location.href = service.cta_primary_url;
                    } else {
                      window.location.href = '/contact';
                    }
                  }}
                  aria-label={fill(sc.contactAboutService, service.title)}
                >
                  {service.cta_primary_text || 'Contact Us Today'}
                  <ArrowRight className="ml-2 h-5 w-5 inline group-hover:translate-x-1 transition-transform duration-300" aria-hidden="true" />
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}