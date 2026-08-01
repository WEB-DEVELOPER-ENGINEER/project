/**
 * Chrome for the /projects listing page (hero, grid, CTA), in English and
 * Arabic. Individual project titles, summaries and industries come from the
 * database; this file only covers the surrounding headings, buttons, empty
 * states and screen-reader text.
 *
 * The numeric counters (project count, languages, satisfaction %) stay as
 * literals in the components — only their labels live here.
 */

import type { Locale } from '@/lib/locale';

export interface ProjectsPageContent {
  // Breadcrumb
  home: string;
  projects: string;
  goToHomepage: string;

  // Hero
  eyebrow: string;
  heroTitle: string;
  heroDescription: string;
  heroHighlights: string[];
  exploreProjects: string;
  startYourProject: string;
  srScrollDown: string;
  srContact: string;
  completedProjects: string;
  languagesCovered: string;
  clientSatisfaction: string;

  // Grid
  gridTitle: string;
  gridDescription: string;
  noProjects: string;
  noProjectsBody: string;
  contactForCustom: string;
  viewAllProjects: string;
  readyToStart: string;
  readyToStartBody: string;
  getFreeQuote: string;

  // CTA
  ctaTitle: string;
  ctaDescription: string;
  ctaBenefits: string[];
  callUsNow: string;
  srGetQuote: string;
  srCallUs: string;
  emailUs: string;
  callUs: string;
  quickChat: string;
}

export const PROJECTS_PAGE_CONTENT: Record<Locale, ProjectsPageContent> = {
  en: {
    home: 'Home',
    projects: 'Projects',
    goToHomepage: 'Go to homepage',

    eyebrow: 'Our Portfolio',
    heroTitle: 'Our Portfolio of Excellence',
    heroDescription:
      'A look at the translation and interpretation work we deliver for clients across legal, medical, technical and government sectors in the UAE.',
    heroHighlights: [
      'Experience across diverse industries',
      'Certified, quality-checked translations',
      'Delivery on the agreed deadline',
      'A named contact for every file',
    ],
    exploreProjects: 'Explore Our Projects',
    startYourProject: 'Start Your Project',
    srScrollDown: 'Scroll down to view our portfolio of translation and interpretation work',
    srContact: 'Contact us to discuss your translation project requirements',
    completedProjects: 'Completed Projects',
    languagesCovered: 'Languages Covered',
    clientSatisfaction: 'Client Satisfaction',

    gridTitle: 'Featured Projects',
    gridDescription:
      'A selection of translation and interpretation projects across different industries and language pairs.',
    noProjects: 'No Projects Available',
    noProjectsBody: "We're updating our portfolio. Please check back soon.",
    contactForCustom: 'Contact Us About Your Project',
    viewAllProjects: 'View All Projects',
    readyToStart: 'Ready to Start Your Project?',
    readyToStartBody:
      'Send us your documents and we will come back with a scope, a price and a delivery date.',
    getFreeQuote: 'Get Free Quote',

    ctaTitle: 'Ready to Start Your Translation Project?',
    ctaDescription:
      'Tell us what you need translated and we will send you a free, itemised quote.',
    ctaBenefits: [
      'Free consultation and quote',
      'Certified professional translators',
      'Fast turnaround times',
      'Quality guarantee on every project',
      '24/7 customer support',
      'Transparent, competitive pricing',
    ],
    callUsNow: 'Call Us Now',
    srGetQuote: 'Contact us through our quote form to discuss your translation project requirements',
    srCallUs: 'Call us directly to speak with our translation team',
    emailUs: 'Email Us',
    callUs: 'Call Us',
    quickChat: 'Quick Chat',
  },

  ar: {
    home: 'الرئيسية',
    projects: 'المشاريع',
    goToHomepage: 'الانتقال إلى الصفحة الرئيسية',

    eyebrow: 'أعمالنا',
    heroTitle: 'نماذج من أعمالنا',
    heroDescription:
      'لمحة عن أعمال الترجمة التحريرية والفورية التي ننفّذها لعملائنا في القطاعات القانونية والطبية والتقنية والحكومية في دولة الإمارات.',
    heroHighlights: [
      'خبرة في قطاعات متنوعة',
      'ترجمات معتمدة خاضعة لمراجعة الجودة',
      'تسليم في الموعد المتفق عليه',
      'مسؤول مخصّص لكل ملف',
    ],
    exploreProjects: 'استعرض أعمالنا',
    startYourProject: 'ابدأ مشروعك',
    srScrollDown: 'مرّر لأسفل لعرض نماذج من أعمال الترجمة التحريرية والفورية',
    srContact: 'تواصل معنا لمناقشة متطلبات مشروع الترجمة الخاص بك',
    completedProjects: 'مشروع منجز',
    languagesCovered: 'لغة مغطاة',
    clientSatisfaction: 'رضا العملاء',

    gridTitle: 'مشاريع مختارة',
    gridDescription:
      'مجموعة مختارة من مشاريع الترجمة التحريرية والفورية في قطاعات وأزواج لغوية مختلفة.',
    noProjects: 'لا توجد مشاريع معروضة حالياً',
    noProjectsBody: 'نعمل على تحديث معرض أعمالنا. يرجى العودة قريباً.',
    contactForCustom: 'تواصل معنا بخصوص مشروعك',
    viewAllProjects: 'عرض جميع المشاريع',
    readyToStart: 'هل أنت مستعد لبدء مشروعك؟',
    readyToStartBody:
      'أرسل لنا مستنداتك وسنعود إليك بنطاق العمل والسعر وموعد التسليم.',
    getFreeQuote: 'احصل على عرض سعر مجاني',

    ctaTitle: 'هل أنت مستعد لبدء مشروع الترجمة؟',
    ctaDescription:
      'أخبرنا بما تحتاج ترجمته وسنرسل لك عرض سعر مجاناً ومفصّلاً.',
    ctaBenefits: [
      'استشارة وعرض سعر مجاناً',
      'مترجمون محترفون معتمدون',
      'مدد إنجاز سريعة',
      'ضمان الجودة في كل مشروع',
      'دعم العملاء على مدار الساعة',
      'أسعار واضحة وتنافسية',
    ],
    callUsNow: 'اتصل بنا الآن',
    srGetQuote: 'تواصل معنا عبر نموذج طلب عرض السعر لمناقشة متطلبات مشروع الترجمة',
    srCallUs: 'اتصل بنا مباشرة للتحدث مع فريق الترجمة لدينا',
    emailUs: 'راسلنا',
    callUs: 'اتصل بنا',
    quickChat: 'محادثة سريعة',
  },
};
