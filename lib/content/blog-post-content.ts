/**
 * Blog post detail page chrome (hero, article body furniture, author box,
 * closing CTA), in English and Arabic.
 *
 * The article title, body and FAQ come from `blog_posts` per-locale; this
 * file only covers the surrounding template. The blog *listing* was already
 * locale-aware, but the post template was not — every Arabic article page
 * rendered its navigation, share controls, author box and CTA in English.
 */

import type { Locale } from '@/lib/locale';

export interface BlogPostContent {
  // Hero / breadcrumb
  home: string;
  blog: string;
  goToHomepage: string;
  goToBlog: string;
  backToBlog: string;
  minRead: string;
  shareArticle: string;
  subscribeForMore: string;
  insightsCaption: string;

  // Category labels (matched from article tags)
  categories: {
    legal: string;
    technical: string;
    business: string;
    medical: string;
    academic: string;
    translation: string;
    general: string;
  };

  // Article body furniture
  tableOfContents: string;
  articleInfo: string;
  readingTime: string;
  published: string;
  minutes: string;
  category: string;
  author: string;
  shareThisArticle: string;
  haveQuestions: string;
  enjoyingArticle: string;
  subscribeNow: string;
  scrollToTop: string;

  // Author box
  authorFallbackTitle: string;
  authorFallbackBio: string;
  teamTitle: string;
  teamBio: string;
  areasOfExpertise: string;
  expertise: string[];
  keyAchievements: string;
  achievements: string[];
  connectWith: string;
  needExpertServices: string;
  needExpertServicesBody: string;
  getFreeQuote: string;
  viewOurServices: string;

  // Closing CTA
  readyToStart: string;
  needProfessional: string;
  needProfessionalBody: string;
  viewAllServices: string;
  relatedServices: string;
  relatedServicesBody: string;
  learnMore: string;
  callUsDirectly: string;
  callUsBody: string;
  emailUs: string;
  emailUsBody: string;
  liveChat: string;
  liveChatBody: string;
  startChat: string;
  trustedBy: string;

  // CTA benefit + stat labels
  benefitQuality: string;
  benefitLanguages: string;
  benefitSecurity: string;
  benefitSpeed: string;
  statProjects: string;
  statLanguages: string;
  statSatisfaction: string;
  statSupport: string;
}

export const BLOG_POST_CONTENT: Record<Locale, BlogPostContent> = {
  en: {
    home: 'Home',
    blog: 'Blog',
    goToHomepage: 'Go to homepage',
    goToBlog: 'Go to blog',
    backToBlog: 'Back to Blog',
    minRead: 'min read',
    shareArticle: 'Share Article',
    subscribeForMore: 'Subscribe for More',
    insightsCaption: 'Translation & Localization Insights',

    categories: {
      legal: 'Legal',
      technical: 'Technical',
      business: 'Business',
      medical: 'Medical',
      academic: 'Academic',
      translation: 'Translation',
      general: 'General',
    },

    tableOfContents: 'Table of contents',
    articleInfo: 'Article Info',
    readingTime: 'Reading Time',
    published: 'Published',
    minutes: 'minutes',
    category: 'Category',
    author: 'Author',
    shareThisArticle: 'Share this article:',
    haveQuestions: 'Have questions? Contact our team',
    enjoyingArticle: 'Enjoying this article? Subscribe to our newsletter for more insights.',
    subscribeNow: 'Subscribe Now',
    scrollToTop: 'Scroll to top',

    authorFallbackTitle: 'Translation Expert',
    authorFallbackBio: 'Professional translator and localization specialist.',
    teamTitle: 'Translation & Localization Experts',
    teamBio:
      'Our certified translators and subject-matter reviewers work together on every file, across legal, medical, technical and financial documents.',
    areasOfExpertise: 'Areas of Expertise',
    expertise: [
      'Legal Translation',
      'Technical Documentation',
      'Business Localization',
      'Certified Translation',
    ],
    keyAchievements: 'Key Achievements',
    achievements: [
      'Certified Translation Services',
      'Professional Translation Services',
      'Quality Assurance Process',
    ],
    connectWith: 'Connect with',
    needExpertServices: 'Need Expert Translation Services?',
    needExpertServicesBody:
      'Tell us about your documents and we will come back with scope, price and a delivery date.',
    getFreeQuote: 'Get a Free Quote',
    viewOurServices: 'View Our Services',

    readyToStart: 'Ready to Get Started?',
    needProfessional: 'Need Professional Translation Services?',
    needProfessionalBody:
      'Our certified translators are ready to help you communicate accurately across languages.',
    viewAllServices: 'View All Services',
    relatedServices: 'Related Services',
    relatedServicesBody: 'Explore the services related to the topic of this article.',
    learnMore: 'Learn More',
    callUsDirectly: 'Call Us Directly',
    callUsBody: 'Speak with our team for immediate assistance.',
    emailUs: 'Email Us',
    emailUsBody: 'Send us your documents for a detailed quote.',
    liveChat: 'Live Chat',
    liveChatBody: 'Chat with our team for quick answers to your questions.',
    startChat: 'Start Chat',
    trustedBy: 'Trusted by Leading Organizations',

    benefitQuality: 'Certified Translation Quality',
    benefitLanguages: 'Professional Language Services',
    benefitSecurity: 'Confidentiality Guaranteed',
    benefitSpeed: 'Fast Turnaround Times',
    statProjects: 'Projects Completed',
    statLanguages: 'Language Pairs',
    statSatisfaction: 'Client Satisfaction',
    statSupport: 'Support Available',
  },

  ar: {
    home: 'الرئيسية',
    blog: 'المدونة',
    goToHomepage: 'الانتقال إلى الصفحة الرئيسية',
    goToBlog: 'الانتقال إلى المدونة',
    backToBlog: 'العودة إلى المدونة',
    minRead: 'دقيقة قراءة',
    shareArticle: 'شارك المقال',
    subscribeForMore: 'اشترك للمزيد',
    insightsCaption: 'رؤى في الترجمة والتوطين',

    categories: {
      legal: 'قانوني',
      technical: 'تقني',
      business: 'أعمال',
      medical: 'طبي',
      academic: 'أكاديمي',
      translation: 'ترجمة',
      general: 'عام',
    },

    tableOfContents: 'محتويات المقال',
    articleInfo: 'معلومات المقال',
    readingTime: 'مدة القراءة',
    published: 'تاريخ النشر',
    minutes: 'دقيقة',
    category: 'التصنيف',
    author: 'الكاتب',
    shareThisArticle: 'شارك هذا المقال:',
    haveQuestions: 'لديك أسئلة؟ تواصل مع فريقنا',
    enjoyingArticle: 'أعجبك المقال؟ اشترك في نشرتنا البريدية لمزيد من الرؤى.',
    subscribeNow: 'اشترك الآن',
    scrollToTop: 'العودة إلى الأعلى',

    authorFallbackTitle: 'مختص ترجمة',
    authorFallbackBio: 'مترجم محترف ومختص في التوطين.',
    teamTitle: 'مختصون في الترجمة والتوطين',
    teamBio:
      'يعمل مترجمونا المعتمدون ومراجعو التخصص معاً على كل ملف، في المستندات القانونية والطبية والتقنية والمالية.',
    areasOfExpertise: 'مجالات التخصص',
    expertise: [
      'الترجمة القانونية',
      'التوثيق التقني',
      'توطين الأعمال',
      'الترجمة المعتمدة',
    ],
    keyAchievements: 'أبرز الاعتمادات',
    achievements: [
      'خدمات ترجمة معتمدة',
      'خدمات ترجمة احترافية',
      'نظام لضمان الجودة',
    ],
    connectWith: 'تواصل مع',
    needExpertServices: 'تحتاج خدمات ترجمة متخصصة؟',
    needExpertServicesBody:
      'أخبرنا بتفاصيل مستنداتك وسنعود إليك بنطاق العمل والسعر وموعد التسليم.',
    getFreeQuote: 'احصل على عرض سعر مجاني',
    viewOurServices: 'استعرض خدماتنا',

    readyToStart: 'هل أنت مستعد للبدء؟',
    needProfessional: 'تحتاج خدمات ترجمة احترافية؟',
    needProfessionalBody:
      'مترجمونا المعتمدون مستعدون لمساعدتك على التواصل بدقة عبر اللغات.',
    viewAllServices: 'عرض جميع الخدمات',
    relatedServices: 'خدمات ذات صلة',
    relatedServicesBody: 'استكشف الخدمات المرتبطة بموضوع هذا المقال.',
    learnMore: 'اعرف المزيد',
    callUsDirectly: 'اتصل بنا مباشرة',
    callUsBody: 'تحدّث مع فريقنا للحصول على مساعدة فورية.',
    emailUs: 'راسلنا عبر البريد',
    emailUsBody: 'أرسل لنا مستنداتك للحصول على عرض سعر مفصّل.',
    liveChat: 'الدردشة المباشرة',
    liveChatBody: 'تحدّث مع فريقنا للحصول على إجابات سريعة.',
    startChat: 'ابدأ المحادثة',
    trustedBy: 'موضع ثقة كبرى المؤسسات',

    benefitQuality: 'جودة ترجمة معتمدة',
    benefitLanguages: 'خدمات لغوية احترافية',
    benefitSecurity: 'سرية مضمونة',
    benefitSpeed: 'مدد إنجاز سريعة',
    statProjects: 'مشروع منجز',
    statLanguages: 'زوج لغوي',
    statSatisfaction: 'رضا العملاء',
    statSupport: 'دعم متاح',
  },
};
