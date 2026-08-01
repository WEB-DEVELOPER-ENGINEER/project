'use client';

import { Card, CardContent } from '@/components/ui/card';
import { FileText, MessageSquare, ShieldCheck, PackageCheck, CheckCircle } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { useLanguage } from '@/components/providers/LanguageProvider';

interface ServicesProcessSectionProps {
  siteSettings?: Record<string, any>;
}

export function ServicesProcessSection({ siteSettings = {} }: ServicesProcessSectionProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const { isRtl } = useLanguage();

  const sectionTitle = siteSettings.services_process_title || (isRtl ? 'كيف نعمل' : 'Our Translation Process');
  const sectionDescription = siteSettings.services_process_description || (isRtl
    ? 'منظومة تدقيق ثلاثية معتمدة بشهادة ISO 9001:2015 تضمن دقة كل ترجمة من الاستلام حتى التسليم.'
    : 'A three-tier, ISO 9001:2015-managed quality process ensures accuracy from submission through delivery.');

  // Matches the same real process steps used per-service (see
  // scripts/seed-services.ts PROCESS_STEPS) — not generic software-agency
  // boilerplate.
  const processSteps = isRtl ? [
    { id: 1, title: 'أرسل مستندك', description: 'أرسل لنا مستندك عبر نموذج التواصل أو البريد الإلكتروني أو واتساب — نقبل ملفات PDF وWord والمستندات الممسوحة ضوئياً.', icon: FileText, color: 'from-blue-500 to-blue-600' },
    { id: 2, title: 'عرض السعر والتأكيد', description: 'نراجع المستند وزوج اللغات ونؤكد النطاق والجدول الزمني للتسليم معك قبل البدء.', icon: MessageSquare, color: 'from-green-500 to-green-600' },
    { id: 3, title: 'الترجمة والمراجعة', description: 'يقوم مترجم مؤهل بإعداد الترجمة، تليها مراجعة فنية وقانونية وتدقيق نهائي مطابق لمعايير الآيزو.', icon: ShieldCheck, color: 'from-orange-500 to-orange-600' },
    { id: 4, title: 'التسليم', description: 'تستلم الترجمة المكتملة، مع التصديق والختم إذا كانت الخدمة تتطلب ذلك.', icon: PackageCheck, color: 'from-purple-500 to-purple-600' },
  ] : [
    { id: 1, title: 'Submit Your Document', description: 'Send us your document via our contact form, email, or WhatsApp — we accept PDF, Word, and scanned image formats.', icon: FileText, color: 'from-blue-500 to-blue-600' },
    { id: 2, title: 'Quote & Confirmation', description: 'We review the document and language pair and confirm scope and delivery timeline with you before starting.', icon: MessageSquare, color: 'from-green-500 to-green-600' },
    { id: 3, title: 'Translation & Review', description: 'A qualified translator prepares the translation, followed by technical/legal verification and a final ISO compliance check.', icon: ShieldCheck, color: 'from-orange-500 to-orange-600' },
    { id: 4, title: 'Delivery', description: 'You receive the completed translation, with certification/stamping included where the service requires it.', icon: PackageCheck, color: 'from-purple-500 to-purple-600' },
  ];

  return (
    <section 
      ref={ref}
      className="section-padding bg-white"
      aria-labelledby="services-process-heading"
    >
      <div className="container">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 
            id="services-process-heading"
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

        {/* Process Steps */}
        <div className="relative">
          {/* Connection Line - Hidden on mobile */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-orange via-brand-blue to-brand-orange transform -translate-y-1/2 z-0" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {processSteps.map((step, index) => {
              const IconComponent = step.icon;
              
              return (
                <div 
                  key={step.id}
                  className={`relative transition-all duration-700 ${
                    inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{
                    transitionDelay: `${200 + index * 150}ms`
                  }}
                >
                  {/* Step Number */}
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
                        <IconComponent className="h-8 w-8 text-white" aria-hidden="true" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center">
                        <span className="text-sm font-bold text-gray-700">{step.id}</span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-white group hover:-translate-y-1">
                    <CardContent className="p-6 text-center">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-brand-blue transition-colors duration-300">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {step.description}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Arrow for mobile */}
                  {index < processSteps.length - 1 && (
                    <div className="lg:hidden flex justify-center mt-6 mb-2">
                      <div className="w-0.5 h-8 bg-gradient-to-b from-brand-orange to-brand-blue" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div 
          className={`text-center mt-20 transition-all duration-700 delay-600 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="bg-gradient-to-r from-gray-50 via-blue-50 to-gray-50 rounded-2xl p-8 lg:p-12 max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <CheckCircle className="h-12 w-12 text-brand-orangeText mr-4" aria-hidden="true" />
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">
                {isRtl ? 'هل أنت مستعد للبدء؟' : 'Ready to Get Started?'}
              </h3>
            </div>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              {isRtl
                ? 'أرسل مستندك اليوم واحصل على عرض سعر مجاني لاحتياجات الترجمة المعتمدة الخاصة بك.'
                : "Send us your document today and get a free quote for your certified translation needs."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                className="bg-brand-orangeText hover:bg-brand-orangeText/90 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2"
                onClick={() => {
                  window.location.href = '/contact';
                }}
                aria-label="Start your project consultation"
              >
                {isRtl ? 'ابدأ مشروعك' : 'Start Your Project'}
              </button>
              <button
                className="border-2 border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2"
                onClick={() => {
                  const servicesSection = document.getElementById('services-grid-section');
                  if (servicesSection) {
                    servicesSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                aria-label="View all available services"
              >
                {isRtl ? 'عرض جميع الخدمات' : 'View All Services'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}