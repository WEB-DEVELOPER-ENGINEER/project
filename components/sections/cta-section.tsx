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

import { useLanguage } from '@/components/providers/LanguageProvider';
import { cn } from '@/lib/utils';
import { localizedPath } from '@/lib/locale';

export function CTASection({ ctaSections = [], siteSettings = {} }: CTASectionProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const { t, isRtl, locale } = useLanguage();

  const title = isRtl ? t('cta.title') : (ctaSections[0]?.title || 'Ready to break linguistic barriers?');
  const description = isRtl ? t('cta.description') : (ctaSections[0]?.description || 'Get in touch with our certified translation specialists today for a free quote and consulting.');
  const primaryBtn = isRtl ? t('cta.primaryBtn') : (ctaSections[0]?.primary_button_text || 'Get a Free Quote');
  const secondaryBtn = isRtl ? t('cta.secondaryBtn') : (ctaSections[0]?.secondary_button_text || 'Learn More');

  const benefits = isRtl ? [
    { benefit_text: 'استشارة وتدقيق للمستندات مجاناً' },
    { benefit_text: 'مدير مشروع متخصص وفريق دعم على مدار الساعة' },
    { benefit_text: 'خطط ترجمة مرنة وأسعار تنافسية' },
    { benefit_text: 'ضمان الدقة وتصديق الجهات الرسمية' }
  ] : [
    { benefit_text: 'Free consultation and document assessment' },
    { benefit_text: 'Dedicated project manager and 24/7 support' },
    { benefit_text: 'Flexible translation plans and competitive pricing' },
    { benefit_text: 'Guaranteed accuracy and certified attestation' }
  ];

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
            {title}
          </h2>
          <RichText 
            content={description}
            className="mt-6 text-lg leading-8 text-blue-100 sm:text-xl"
          />

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-6 mb-10">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center text-left text-blue-100">
                <CheckCircle className="h-5 w-5 text-green-300 mr-3 flex-shrink-0" aria-hidden="true" />
                <span className="text-sm sm:text-base font-medium">{benefit.benefit_text}</span>
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
              <Link href={localizedPath("/contact", locale)}>
                {primaryBtn}
                <ArrowRight className={cn('ml-2 h-5 w-5', isRtl && 'rotate-180 mr-2 ml-0')} />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-brand-blue font-semibold px-8 py-3 text-lg"
              asChild
            >
              <Link href={localizedPath("/services", locale)}>
                {secondaryBtn}
              </Link>
            </Button>
          </div>

          <p className="mt-8 text-sm text-blue-200">
            {isRtl ? 'بدون التزامات مسبقة • رد خلال أقل من 24 ساعة • استشارة متخصصين' : 'No commitment required • Response within 24 hours • Expert consultation'}
          </p>
        </div>
      </div>
    </section>
  );
}