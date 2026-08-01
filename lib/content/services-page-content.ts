/**
 * Chrome for the /services listing page (grid + CTA sections), in English
 * and Arabic. Individual service titles and descriptions come from the
 * database per-locale — this file only covers the surrounding headings,
 * buttons, empty states and screen-reader text.
 *
 * The numeric trust indicators (24/7, 99%, 500+) are intentionally left as
 * literals in the component; only their labels live here.
 */

import type { Locale } from '@/lib/locale';

export interface ServicesPageContent {
  // Grid section
  learnMore: string;
  noServicesFound: string;
  noServicesBody: string;
  viewAllServices: string;
  needCustomSolution: string;
  needCustomSolutionBody: string;
  discussYourNeeds: string;

  // CTA section
  getStartedToday: string;
  orReachOut: string;
  sendMessage: string;
  supportAvailable: string;
  clientSatisfaction: string;
  projectsDelivered: string;
  srGetStarted: string;
  srViewServices: string;
  srSendMessage: string;
  callUsAt: string; // "{value}" interpolated
  emailUsAt: string;
}

export const SERVICES_PAGE_CONTENT: Record<Locale, ServicesPageContent> = {
  en: {
    learnMore: 'Learn More',
    noServicesFound: 'No services found',
    noServicesBody:
      'No services match the selected category. Try another category, or view all services.',
    viewAllServices: 'View All Services',
    needCustomSolution: 'Need a Custom Solution?',
    needCustomSolutionBody:
      "Don't see exactly what you need? Tell us about your documents and we will quote the right combination of services.",
    discussYourNeeds: 'Discuss Your Needs',

    getStartedToday: 'Get Started Today',
    orReachOut: 'Or reach out to us directly:',
    sendMessage: 'Send Message',
    supportAvailable: 'Support Available',
    clientSatisfaction: 'Client Satisfaction',
    projectsDelivered: 'Projects Delivered',
    srGetStarted: 'Contact us to begin your project and receive a free consultation',
    srViewServices: 'Scroll up to view our complete range of professional services',
    srSendMessage: 'Send us a message through our contact form',
    callUsAt: 'Call us at {value}',
    emailUsAt: 'Email us at {value}',
  },

  ar: {
    learnMore: 'اعرف المزيد',
    noServicesFound: 'لا توجد خدمات مطابقة',
    noServicesBody:
      'لا توجد خدمات ضمن الفئة المختارة. جرّب فئة أخرى، أو اعرض جميع الخدمات.',
    viewAllServices: 'عرض جميع الخدمات',
    needCustomSolution: 'تحتاج حلاً مخصصاً؟',
    needCustomSolutionBody:
      'لم تجد ما تبحث عنه بالضبط؟ أخبرنا بتفاصيل مستنداتك وسنقدّم لك عرض سعر يجمع الخدمات المناسبة لحالتك.',
    discussYourNeeds: 'ناقش احتياجاتك',

    getStartedToday: 'ابدأ الآن',
    orReachOut: 'أو تواصل معنا مباشرة:',
    sendMessage: 'أرسل رسالة',
    supportAvailable: 'دعم متاح',
    clientSatisfaction: 'رضا العملاء',
    projectsDelivered: 'مشروع منجز',
    srGetStarted: 'تواصل معنا لبدء مشروعك والحصول على استشارة مجانية',
    srViewServices: 'مرّر لأعلى لعرض مجموعة خدماتنا الاحترافية كاملة',
    srSendMessage: 'أرسل لنا رسالة عبر نموذج التواصل',
    callUsAt: 'اتصل بنا على {value}',
    emailUsAt: 'راسلنا على {value}',
  },
};

/** Interpolates `{value}` in a template string. */
export const fillValue = (template: string, value: string) =>
  template.replace(/\{value\}/g, value);
