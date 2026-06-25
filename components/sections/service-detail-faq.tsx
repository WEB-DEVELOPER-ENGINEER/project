'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { Service } from '@/lib/types';

interface ServiceDetailFAQProps {
  service: Service;
  siteSettings?: Record<string, any>;
}

export function ServiceDetailFAQ({ service, siteSettings = {} }: ServiceDetailFAQProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [openItems, setOpenItems] = useState<number[]>([]);

  // Use dynamic FAQ items from database with safe array handling
  const faqItems = Array.isArray(service.faq_items) 
    ? service.faq_items 
    : (service.faq_items ? [service.faq_items] : []);

  // If no FAQ items, don't render the section
  if (faqItems.length === 0) {
    return null;
  }

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <section 
      ref={ref}
      className="section-padding bg-gray-50"
      aria-labelledby="service-faq-heading"
    >
      <div className="container">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 
            id="service-faq-heading"
            className={`text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-6 transition-all duration-700 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Frequently Asked Questions
          </h2>
          <p 
            className={`text-xl text-gray-600 leading-relaxed transition-all duration-700 delay-100 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Get answers to common questions about our {service.title.toLowerCase()} service.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="mx-auto max-w-4xl">
          <div className="space-y-6">
            {faqItems.map((item, index) => (
              <Card 
                key={index}
                className={`border-0 shadow-lg transition-all duration-700 ${
                  inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{
                  transitionDelay: `${200 + index * 100}ms`
                }}
              >
                <CardContent className="p-0">
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full text-left p-8 hover:bg-gray-50 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-inset"
                    aria-expanded={openItems.includes(index)}
                    aria-controls={`faq-answer-${index}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-start">
                        <div className="w-10 h-10 bg-gradient-to-br from-brand-orange to-brand-blue rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                          <HelpCircle className="h-5 w-5 text-white" aria-hidden="true" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 pr-4">
                          {item.question}
                        </h3>
                      </div>
                      <div className="flex-shrink-0">
                        {openItems.includes(index) ? (
                          <ChevronUp className="h-6 w-6 text-gray-500" aria-hidden="true" />
                        ) : (
                          <ChevronDown className="h-6 w-6 text-gray-500" aria-hidden="true" />
                        )}
                      </div>
                    </div>
                  </button>
                  
                  {openItems.includes(index) && (
                    <div 
                      id={`faq-answer-${index}`}
                      className="px-8 pb-8 animate-in slide-in-from-top-2 duration-300"
                    >
                      <div className="ml-14">
                        <div 
                          className="text-gray-600 leading-relaxed prose prose-gray max-w-none"
                          dangerouslySetInnerHTML={{ __html: item.answer }}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div 
          className={`mt-16 text-center transition-all duration-700 delay-500 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <Card className="border-0 shadow-xl bg-gradient-to-br from-brand-orange/5 to-brand-blue/5">
            <CardContent className="p-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Still Have Questions?
              </h3>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Our team of experts is here to help you understand how our {service.title.toLowerCase()} service can benefit your business.
              </p>
              <button 
                className="bg-brand-orange hover:bg-brand-orange/90 text-white px-8 py-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2"
                onClick={() => {
                  if (service.cta_primary_url) {
                    window.location.href = service.cta_primary_url;
                  } else {
                    window.location.href = '/contact';
                  }
                }}
                aria-label={`Contact us about ${service.title} service`}
              >
                {service.cta_primary_text || 'Contact Our Experts'}
                <ChevronDown className="ml-2 h-5 w-5 inline group-hover:translate-y-1 transition-transform duration-300" aria-hidden="true" />
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
