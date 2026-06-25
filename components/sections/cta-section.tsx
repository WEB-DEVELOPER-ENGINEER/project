'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RichText } from '@/components/ui/safe-html';
import { useInView } from 'react-intersection-observer';

interface CTASectionProps {
  ctaSections?: any[];
  siteSettings?: Record<string, any>;
}

export function CTASection({ ctaSections = [], siteSettings = {} }: CTASectionProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Use the first CTA section or fallback to default content
  const ctaData = ctaSections[0] || {
    title: siteSettings.cta_default_title || 'Ready to Transform Your Business?',
    description: siteSettings.cta_default_description || 'Join hundreds of satisfied clients who have revolutionized their digital presence with our enterprise solutions.',
    primary_button_text: siteSettings.cta_primary_button_text || 'Start Your Project',
    primary_button_url: siteSettings.cta_primary_button_url || '/get-started',
    secondary_button_text: siteSettings.cta_secondary_button_text || 'Schedule Call',
    secondary_button_url: siteSettings.cta_secondary_button_url || '/contact',
    benefits: []
  };

  // Use benefits from CTA section or fallback to default
  const benefits = ctaData.benefits?.length > 0 ? ctaData.benefits : (
    siteSettings.cta_default_benefits || [
      { benefit_text: 'Free consultation and project assessment' },
      { benefit_text: 'Dedicated project manager and support team' },
      { benefit_text: 'Flexible engagement models and pricing' },
      { benefit_text: '30-day satisfaction guarantee' }
    ]
  );

  return (
    <section 
      className="section-padding bg-gradient-to-r from-brand-blue to-brand-orange"
      aria-labelledby="cta-heading"
    >
      <div className="container">
        <div 
          ref={ref}
          className={`mx-auto max-w-4xl text-center transition-all duration-1000 ${
            inView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <h2 
            id="cta-heading"
            className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
          >
            {ctaData.title}
          </h2>
          <RichText 
            content={ctaData.description}
            className="mt-6 text-lg leading-8 text-blue-100 sm:text-xl"
          />

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-6 mb-10">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center text-left text-blue-100">
                <CheckCircle className="h-5 w-5 text-green-300 mr-3 flex-shrink-0" aria-hidden="true" />
                <span className="text-sm sm:text-base">{benefit.benefit_text}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              variant="secondary"
              className="bg-white text-brand-blue hover:bg-gray-100 font-semibold px-8 py-3 text-lg"
              asChild
            >
              <Link href={ctaData.primary_button_url}>
                {ctaData.primary_button_text}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-brand-blue font-semibold px-8 py-3 text-lg"
              asChild
            >
              <Link href={ctaData.secondary_button_url}>
                {ctaData.secondary_button_text}
              </Link>
            </Button>
          </div>

          <p className="mt-8 text-sm text-blue-200">
            {siteSettings.cta_footer_text || 'No commitment required • Response within 24 hours • Expert consultation'}
          </p>
        </div>
      </div>
    </section>
  );
}