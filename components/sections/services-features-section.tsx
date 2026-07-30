'use client';

import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Award, Users, Clock, Shield, Zap, Globe } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { useLanguage } from '@/components/providers/LanguageProvider';

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
  const { isRtl } = useLanguage();

  // Default features if none provided from database — JUSOR's real
  // differentiators (see the company's corporate profile), not generic
  // software-agency boilerplate.
  const defaultFeatures = isRtl ? [
    { id: 1, title: 'الخبرة المزدوجة', description: 'مترجمون قانونيون معتمدون إلى جانب خبراء متخصصين — محامون تجاريون، مهندسون، ومحللون ماليون.', icon_name: 'users' },
    { id: 2, title: 'منظومة تدقيق ثلاثية', description: 'ترجمة تخصصية، مراجعة فنية وقانونية، ثم تدقيق نهائي مطابق لمعايير ISO 9001:2015.', icon_name: 'award' },
    { id: 3, title: 'اعتماد تنظيمي حقيقي', description: 'معتمدة من وزارة العدل، محاكم دبي، DIFC، ومركز دبي للتحكيم الدولي (DIAC).', icon_name: 'shield' },
    { id: 4, title: 'الحفاظ على التنسيق', description: 'قفل الأرقام والمعادلات والرموز الهندسية أثناء التنسيق لمطابقة هيكلية بنسبة 100%.', icon_name: 'checkcircle' },
    { id: 5, title: 'سرية تامة', description: 'اتفاقيات عدم إفشاء صارمة وتشفير لنقل الملفات لحماية بياناتكم الحساسة.', icon_name: 'shield' },
    { id: 6, title: 'خبرة بالعربية والإنجليزية', description: 'تغطية شاملة للغتين العربية والإنجليزية عبر القطاعات القانونية والتقنية والمالية.', icon_name: 'globe' },
  ] : [
    { id: 1, title: 'Dual-Discipline Mastery', description: 'Licensed legal translators working alongside domain experts — corporate lawyers, engineers, and financial analysts.', icon_name: 'users' },
    { id: 2, title: 'Three-Tier QA Process', description: 'SME drafting, technical and legal verification, then a final ISO 9001:2015 compliance check.', icon_name: 'award' },
    { id: 3, title: 'Real Regulatory Accreditation', description: 'Accredited by the UAE Ministry of Justice, Dubai Courts, DIFC Courts, and DIAC.', icon_name: 'shield' },
    { id: 4, title: 'Structural Preservation', description: 'Numbers, formulas, and engineering symbols are locked during layout for 100% structural accuracy.', icon_name: 'checkcircle' },
    { id: 5, title: 'Ironclad Confidentiality', description: 'Strict NDAs and encrypted file transfer protocols protect your sensitive documents.', icon_name: 'shield' },
    { id: 6, title: 'Arabic & English Expertise', description: 'Full coverage across legal, technical, and financial sectors in both languages.', icon_name: 'globe' },
  ];

  const displayFeatures = features && features.length > 0 ? features : defaultFeatures;
  const sectionTitle = siteSettings.services_features_title || (isRtl ? 'لماذا تختار خدماتنا' : 'Why Choose Our Services');
  const sectionDescription = siteSettings.services_features_description || (isRtl
    ? 'نجمع بين الخبرة القانونية والتقنية ونظام إدارة جودة معتمد لتقديم نتائج دقيقة يمكن الاعتماد عليها.'
    : 'We combine legal, technical, and industry expertise with a certified quality management process to deliver results you can rely on.');

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
                {isRtl ? 'موثوقون من قبل الشركات' : 'Trusted by Businesses Worldwide'}
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {isRtl
                  ? 'التزامنا بالتميز نال ثقة الشركات عبر مختلف القطاعات.'
                  : 'Our commitment to excellence has earned us the trust of companies across industries.'}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-brand-orange mb-2">
                  99%
                </div>
                <div className="text-gray-600 font-medium">
                  {isRtl ? 'رضا العملاء' : 'Client Satisfaction'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-brand-blue mb-2">
                  500+
                </div>
                <div className="text-gray-600 font-medium">
                  {isRtl ? 'مشروع منجز' : 'Projects Delivered'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-brand-orange mb-2">
                  50+
                </div>
                <div className="text-gray-600 font-medium">
                  {isRtl ? 'عضو فريق خبير' : 'Expert Team Members'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-brand-blue mb-2">
                  24/7
                </div>
                <div className="text-gray-600 font-medium">
                  {isRtl ? 'دعم متواصل' : 'Support Available'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}