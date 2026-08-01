/**
 * Service detail page + related-content section chrome, in English and
 * Arabic. The service's own title/overview/FAQ text comes from the
 * database per-locale (see scripts/seed-services.ts and
 * scripts/seed-services-ar.ts); this file only covers the surrounding
 * headings and boilerplate.
 *
 * Strings containing `{service}` are interpolated with the service title
 * at render time via `fill()`.
 */

import type { Locale } from '@/lib/locale';

export interface ServiceDetailContent {
  backToServices: string;
  learnMore: string;
  availableNow: string;
  expertTeam: string;
  heroFallbackDescription: string;

  home: string;
  services: string;
  contactUs: string;

  ourApproach: string;
  serviceHighlights: string;
  whyChoose: string; // "Why Choose Our {service}"
  whyChooseUs: string;
  whatMakesSpecial: string; // "What Makes Our {service} Special"
  whatMakesSpecialBody: string;
  overviewFallback: string;
  contactAboutService: string; // aria-label, "... about {service}"
  professionalService: string; // "Professional {service}"
  expertSolutionsBody: string;

  specificationsTitle: string;
  specificationsSubtitle: string; // "... for our {service}"
  languagesSupported: string;

  faqTitle: string;
  faqSubtitle: string; // "... about our {service}"
  stillQuestions: string;
  stillQuestionsBody: string; // "... how our {service} ..."

  relatedServices: string;
  relatedServicesBody: string; // "... complement {service} ..."
  needMultiple: string;
  needMultipleBody: string;
  viewAllServices: string;

  continueReading: string;
  relatedArticles: string;
  relatedArticlesBody: string;
  relatedArticle: string;
  readFullArticle: string;
  exploreBlog: string;
  exploreBlogBody: string;
  viewAllArticles: string;
  getConsultation: string;

  newsletterTitle: string;
  newsletterBody: string;
  newsletterNoSpam: string;
  newsletterEmailPlaceholder: string;
  subscribe: string;
  privacyPolicy: string;
  orContactDirectly: string;

  readyToStart: string;
  readyToStartBody: string; // "Let's discuss your {service} needs..."
  getStartedToday: string;
  responseTime: string;
  within24Hours: string;
  freeConsultation: string;
  projectStart: string;
  within1Week: string;
  startYourProject: string;
  thirtyMinutes: string;
  available247: string;
  /** Fallback bullet list shown when a service has no key_benefits in the DB. */
  defaultBenefits: string[];
  srContact: string; // "Contact us to start your {service} project..."
  srViewAll: string;

  // service-detail-content highlight labels
  deliveryTime: string;
  teamSize: string;
  support: string;
  guarantee: string;
  turnaround: string;
  certification: string;
}

/** Interpolates `{service}` in a template string. */
export const fill = (template: string, service: string) =>
  template.replace(/\{service\}/g, service);

export const SERVICE_DETAIL_CONTENT: Record<Locale, ServiceDetailContent> = {
  en: {
    backToServices: 'Back to Services',
    learnMore: 'Learn More',
    availableNow: 'Available Now',
    expertTeam: 'Expert Team',
    heroFallbackDescription:
      'Certified translation delivered by qualified specialists, with a quality-managed review process.',

    home: 'Home',
    services: 'Services',
    contactUs: 'Contact Us',

    ourApproach: 'Our Approach',
    serviceHighlights: 'Service Highlights',
    whyChoose: 'Why Choose Our {service}',
    whyChooseUs: 'Why Choose Us?',
    whatMakesSpecial: 'What Makes Our {service} Different',
    whatMakesSpecialBody:
      'Qualified linguists, a documented review step, and formats accepted by UAE government and legal bodies.',
    overviewFallback: 'Service details are being updated. Contact us for the current scope and pricing.',
    contactAboutService: 'Contact us about {service}',
    professionalService: 'Professional {service}',
    expertSolutionsBody:
      'Certified translation handled by qualified specialists, with a documented quality review before delivery.',

    specificationsTitle: 'Service Specifications',
    specificationsSubtitle: 'Detailed specifications and capabilities for our {service} service.',
    languagesSupported: 'Languages Supported',

    faqTitle: 'Frequently Asked Questions',
    faqSubtitle: 'Answers to common questions about our {service} service.',
    stillQuestions: 'Still Have Questions?',
    stillQuestionsBody:
      'Our team is here to help you understand how our {service} service can support you.',

    relatedServices: 'Related Services',
    relatedServicesBody: 'Explore our other services that complement {service}.',
    needMultiple: 'Need Multiple Services?',
    needMultipleBody:
      'We can combine several services into a single engagement — tell us what you need and we will quote it together.',
    viewAllServices: 'View All Services',

    continueReading: 'Continue Reading',
    relatedArticles: 'Related Articles',
    relatedArticlesBody: 'More insights and practical guidance from our translation blog.',
    relatedArticle: 'Related Article',
    readFullArticle: 'Read Full Article',
    exploreBlog: 'Explore Our Complete Blog',
    exploreBlogBody:
      'Discover more expert insights, industry guidance, and practical tips from our team.',
    viewAllArticles: 'View All Articles',
    getConsultation: 'Get Expert Consultation',

    newsletterTitle: 'Stay Updated with Translation Insights',
    newsletterBody:
      'Subscribe to our newsletter for practical guidance on certified translation and UAE document requirements.',
    newsletterNoSpam: 'No spam, unsubscribe at any time. Read our',
    newsletterEmailPlaceholder: 'Enter your email address',
    subscribe: 'Subscribe',
    privacyPolicy: 'Privacy Policy',
    orContactDirectly: 'Or contact us directly:',

    readyToStart: 'Ready to Get Started?',
    readyToStartBody: "Tell us about your {service} requirements and we'll send you a free quote.",
    getStartedToday: 'Get Started Today',
    responseTime: 'Response Time',
    within24Hours: 'Within 24 hours',
    freeConsultation: 'Free Consultation',
    projectStart: 'Project Start',
    within1Week: 'Within 1 week',
    startYourProject: 'Start Your Project',
    thirtyMinutes: '30 minutes',
    available247: 'Available 24/7',
    defaultBenefits: [
      'Free initial consultation',
      'Certified, court-accepted translations',
      'Transparent per-page pricing',
      'A named contact for your file',
    ],
    srContact: 'Contact us to start your {service} project with a free consultation',
    srViewAll: 'View all our translation services',

    deliveryTime: 'Delivery Time',
    teamSize: 'Team Size',
    support: 'Support',
    guarantee: 'Guarantee',
    turnaround: 'Turnaround',
    certification: 'Certification',
  },

  ar: {
    backToServices: 'العودة إلى الخدمات',
    learnMore: 'اعرف المزيد',
    availableNow: 'متاحون الآن',
    expertTeam: 'فريق متخصص',
    heroFallbackDescription:
      'ترجمة معتمدة ينفّذها مختصون مؤهلون، ضمن عملية مراجعة خاضعة لإدارة الجودة.',

    home: 'الرئيسية',
    services: 'الخدمات',
    contactUs: 'تواصل معنا',

    ourApproach: 'منهجنا',
    serviceHighlights: 'أبرز ما يميّز الخدمة',
    whyChoose: 'لماذا تختار خدمة {service} لدينا',
    whyChooseUs: 'لماذا تختارنا؟',
    whatMakesSpecial: 'ما الذي يميّز خدمة {service} لدينا',
    whatMakesSpecialBody:
      'مترجمون مؤهلون، وخطوة مراجعة موثّقة، وصيغ معتمدة لدى الجهات الحكومية والقانونية في دولة الإمارات.',
    overviewFallback: 'يجري تحديث تفاصيل هذه الخدمة. تواصل معنا لمعرفة النطاق والأسعار الحالية.',
    contactAboutService: 'تواصل معنا بخصوص {service}',
    professionalService: '{service} احترافية',
    expertSolutionsBody:
      'ترجمة معتمدة ينفّذها مختصون مؤهلون، مع مراجعة جودة موثّقة قبل التسليم.',

    specificationsTitle: 'مواصفات الخدمة',
    specificationsSubtitle: 'المواصفات والإمكانات التفصيلية لخدمة {service}.',
    languagesSupported: 'اللغات المدعومة',

    faqTitle: 'الأسئلة الشائعة',
    faqSubtitle: 'إجابات عن الأسئلة الشائعة حول خدمة {service}.',
    stillQuestions: 'هل لديك أسئلة أخرى؟',
    stillQuestionsBody: 'فريقنا مستعد لمساعدتك على فهم كيف تخدمك {service}.',

    relatedServices: 'خدمات ذات صلة',
    relatedServicesBody: 'استكشف خدماتنا الأخرى المكمّلة لخدمة {service}.',
    needMultiple: 'تحتاج أكثر من خدمة؟',
    needMultipleBody:
      'يمكننا دمج عدة خدمات في طلب واحد — أخبرنا باحتياجك وسنقدّم لك عرض سعر شاملاً.',
    viewAllServices: 'عرض جميع الخدمات',

    continueReading: 'تابع القراءة',
    relatedArticles: 'مقالات ذات صلة',
    relatedArticlesBody: 'المزيد من الرؤى والإرشادات العملية من مدونة الترجمة لدينا.',
    relatedArticle: 'مقال ذو صلة',
    readFullArticle: 'اقرأ المقال كاملاً',
    exploreBlog: 'استكشف مدونتنا كاملة',
    exploreBlogBody: 'اكتشف المزيد من الرؤى المتخصصة والإرشادات العملية من فريقنا.',
    viewAllArticles: 'عرض جميع المقالات',
    getConsultation: 'احصل على استشارة متخصصة',

    newsletterTitle: 'ابقَ على اطلاع بأحدث رؤى الترجمة',
    newsletterBody:
      'اشترك في نشرتنا البريدية للحصول على إرشادات عملية حول الترجمة المعتمدة ومتطلبات المستندات في دولة الإمارات.',
    newsletterNoSpam: 'بدون رسائل مزعجة، ويمكنك إلغاء الاشتراك في أي وقت. اطّلع على',
    newsletterEmailPlaceholder: 'أدخل بريدك الإلكتروني',
    subscribe: 'اشترك',
    privacyPolicy: 'سياسة الخصوصية',
    orContactDirectly: 'أو تواصل معنا مباشرة:',

    readyToStart: 'هل أنت مستعد للبدء؟',
    readyToStartBody: 'أخبرنا بمتطلباتك من خدمة {service} وسنرسل لك عرض سعر مجاني.',
    getStartedToday: 'ابدأ الآن',
    responseTime: 'وقت الاستجابة',
    within24Hours: 'خلال 24 ساعة',
    freeConsultation: 'استشارة مجانية',
    projectStart: 'بدء المشروع',
    within1Week: 'خلال أسبوع',
    startYourProject: 'ابدأ مشروعك',
    thirtyMinutes: '30 دقيقة',
    available247: 'متاح على مدار الساعة',
    defaultBenefits: [
      'استشارة أولية مجانية',
      'ترجمة معتمدة مقبولة لدى الجهات الرسمية',
      'تسعير واضح لكل صفحة',
      'مسؤول مخصّص لمتابعة ملفك',
    ],
    srContact: 'تواصل معنا لبدء مشروع {service} مع استشارة مجانية',
    srViewAll: 'عرض جميع خدمات الترجمة لدينا',

    deliveryTime: 'مدة التسليم',
    teamSize: 'حجم الفريق',
    support: 'الدعم',
    guarantee: 'الضمان',
    turnaround: 'مدة الإنجاز',
    certification: 'الاعتماد',
  },
};
