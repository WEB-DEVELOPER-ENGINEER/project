/**
 * About page section chrome (headings, badges, static copy), in English
 * and Arabic.
 *
 * The substantive About content — story, mission, vision, values,
 * certifications — lives in the `about_us` database table and is already
 * seeded per-locale (see scripts/seed-about-us.ts). This file only covers
 * the surrounding section headings and boilerplate that were hardcoded in
 * the components.
 */

import type { Locale } from '@/lib/locale';

export interface AboutContent {
  mission: {
    badge: string;
    heading: string;
    subheading: string;
    missionTitle: string;
    visionTitle: string;
    purposeTitle: string;
    certifiedTranslation: string;
    professionalTeam: string;
    qualityAssured: string;
  };
  values: {
    badge: string;
    heading: string;
    subheading: string;
    commitment: string;
    principlesCaption: string;
    livingTitle: string;
    livingBody: string;
  };
  team: {
    badge: string;
    heading: string;
    subheading: string;
    teamMember: string;
    professionalTranslator: string;
    professionalTranslators: string;
    languagePairs: string;
    countriesRepresented: string;
    yearsAverageExperience: string;
    cultureTitle: string;
    cultureBody: string;
    cultureCaption: string;
    bullets: string[];
  };
  stats: {
    badge: string;
    heading: string;
    subheading: string;
    achievementsTitle: string;
    qualityTitle: string;
    qualityBody: string;
    translationAccuracy: string;
    onTimeDelivery: string;
    clientRetention: string;
    qualityRating: string;
    averageReview: string;
    certifiedTranslation: string;
    qualityManagementProcess: string;
    recognitionTitle: string;
    recognitionBody: string;
    badges: string[];
  };
  cta: {
    freeConsultation: string;
    learnMoreTitle: string;
    learnMoreBody: string;
  };
  timeline: {
    badge: string;
    heading: string;
    subheading: string;
    keyMilestones: string;
    yearsOfExcellence: string;
    journeyTitle: string;
    journeyBody: string;
    lookingAheadTitle: string;
    lookingAheadBody: string;
  };
}

export const ABOUT_CONTENT: Record<Locale, AboutContent> = {
  en: {
    mission: {
      badge: 'Our Purpose',
      heading: 'Mission, Vision & Purpose',
      subheading: 'What drives our work and where we are headed',
      missionTitle: 'Our Mission',
      visionTitle: 'Our Vision',
      purposeTitle: 'Our Purpose',
      certifiedTranslation: 'Certified Translation',
      professionalTeam: 'Professional Team',
      qualityAssured: 'Quality Assured',
    },
    values: {
      badge: 'Core Values',
      heading: 'What Drives Us Forward',
      subheading:
        'The core principles that guide our work and define our commitment to excellence',
      commitment: 'Commitment',
      principlesCaption: 'Principles that guide everything we do',
      livingTitle: 'Living Our Values Every Day',
      livingBody:
        "These values aren't just words on a page — they're the foundation of how we operate, how we treat every document entrusted to us, and how we work with our clients.",
    },
    team: {
      badge: 'Our Team',
      heading: 'Meet the Experts Behind Our Success',
      subheading:
        'Certified translators and subject-matter experts working together on every project',
      teamMember: 'Team Member',
      professionalTranslator: 'Professional Translator',
      professionalTranslators: 'Professional Translators',
      languagePairs: 'Language Pairs',
      countriesRepresented: 'Countries Represented',
      yearsAverageExperience: 'Years Average Experience',
      cultureTitle: 'Our Culture',
      cultureBody:
        'We foster a collaborative environment where continuous learning is encouraged and quality is paramount — every translation is reviewed before it reaches the client.',
      cultureCaption: 'United by excellence, diversity in expertise',
      bullets: [
        'All translators are certified professionals',
        'Native speakers for authentic translations',
        'Collaborative approach to complex projects',
      ],
    },
    stats: {
      badge: 'Our Impact',
      heading: 'Numbers That Tell Our Story',
      subheading:
        'Measurable results that demonstrate our commitment to excellence and client success',
      achievementsTitle: 'Our Achievements',
      qualityTitle: 'Quality You Can Trust',
      qualityBody:
        'Our commitment to quality is reflected in every metric we track — from client satisfaction to on-time delivery, we maintain the highest standards.',
      translationAccuracy: 'Translation Accuracy',
      onTimeDelivery: 'On-Time Delivery',
      clientRetention: 'Client Retention',
      qualityRating: 'Quality Rating',
      averageReview: 'Average Review',
      certifiedTranslation: 'Certified Translation',
      qualityManagementProcess: 'Quality Management Process',
      recognitionTitle: 'Industry Recognition',
      recognitionBody:
        'Our commitment to excellence has been recognised by industry bodies and clients across the UAE',
      badges: [
        'Certified Translation Services',
        'Confidential & Secure',
        'Professional Translators',
        'Quality Assured',
      ],
    },
    cta: {
      freeConsultation: 'Free Consultation',
      learnMoreTitle: 'Learn More About Our Services',
      learnMoreBody:
        'Explore our comprehensive range of certified translation, interpretation, and localization services.',
    },
    timeline: {
      badge: 'Our Journey',
      heading: 'Company Timeline',
      subheading:
        'Key milestones that have shaped our growth and the way we work today',
      keyMilestones: 'Key Milestones',
      yearsOfExcellence: 'Years of Excellence',
      journeyTitle: 'Our Journey',
      journeyBody: 'Years of growth, expertise, and consistent quality',
      lookingAheadTitle: 'Looking Ahead',
      lookingAheadBody:
        'Our journey continues as we deepen our specialist expertise and maintain the standards our clients rely on.',
    },
  },

  ar: {
    mission: {
      badge: 'غايتنا',
      heading: 'الرسالة والرؤية والغاية',
      subheading: 'ما يدفع عملنا وإلى أين نتجه',
      missionTitle: 'رسالتنا',
      visionTitle: 'رؤيتنا',
      purposeTitle: 'غايتنا',
      certifiedTranslation: 'ترجمة معتمدة',
      professionalTeam: 'فريق محترف',
      qualityAssured: 'جودة مضمونة',
    },
    values: {
      badge: 'قيمنا الأساسية',
      heading: 'ما الذي يدفعنا إلى الأمام',
      subheading: 'المبادئ الأساسية التي توجّه عملنا وتحدّد التزامنا بالتميّز',
      commitment: 'التزام',
      principlesCaption: 'مبادئ توجّه كل ما نقوم به',
      livingTitle: 'نعيش قيمنا كل يوم',
      livingBody:
        'هذه القيم ليست مجرد كلمات على الورق — بل هي أساس طريقة عملنا، وكيفية تعاملنا مع كل مستند يُعهد إلينا به، وكيفية تعاوننا مع عملائنا.',
    },
    team: {
      badge: 'فريقنا',
      heading: 'تعرّف على الخبراء وراء نجاحنا',
      subheading: 'مترجمون معتمدون وخبراء متخصصون يعملون معاً في كل مشروع',
      teamMember: 'عضو الفريق',
      professionalTranslator: 'مترجم محترف',
      professionalTranslators: 'مترجم محترف',
      languagePairs: 'زوج لغوي',
      countriesRepresented: 'دولة ممثّلة',
      yearsAverageExperience: 'متوسط سنوات الخبرة',
      cultureTitle: 'ثقافتنا',
      cultureBody:
        'نحرص على بيئة عمل تعاونية نشجّع فيها التعلّم المستمر ونضع الجودة في المقام الأول — تخضع كل ترجمة للمراجعة قبل تسليمها للعميل.',
      cultureCaption: 'يجمعنا التميّز، ويثرينا تنوّع الخبرات',
      bullets: [
        'جميع مترجمينا محترفون معتمدون',
        'متحدثون أصليون لترجمات أصيلة',
        'نهج تعاوني في المشاريع المعقدة',
      ],
    },
    stats: {
      badge: 'أثرنا',
      heading: 'أرقام تحكي قصتنا',
      subheading: 'نتائج ملموسة تعكس التزامنا بالتميّز ونجاح عملائنا',
      achievementsTitle: 'إنجازاتنا',
      qualityTitle: 'جودة تستحق ثقتك',
      qualityBody:
        'ينعكس التزامنا بالجودة في كل مؤشر نتابعه — من رضا العملاء إلى الالتزام بمواعيد التسليم، نحافظ على أعلى المعايير.',
      translationAccuracy: 'دقة الترجمة',
      onTimeDelivery: 'التسليم في الموعد',
      clientRetention: 'استمرارية العملاء',
      qualityRating: 'تقييم الجودة',
      averageReview: 'متوسط التقييم',
      certifiedTranslation: 'ترجمة معتمدة',
      qualityManagementProcess: 'نظام إدارة الجودة',
      recognitionTitle: 'اعتراف القطاع',
      recognitionBody:
        'نال التزامنا بالتميّز اعتراف الجهات المتخصصة والعملاء في مختلف أنحاء دولة الإمارات',
      badges: [
        'خدمات ترجمة معتمدة',
        'سرية وأمان تام',
        'مترجمون محترفون',
        'جودة مضمونة',
      ],
    },
    cta: {
      freeConsultation: 'استشارة مجانية',
      learnMoreTitle: 'اعرف المزيد عن خدماتنا',
      learnMoreBody:
        'استكشف مجموعتنا الشاملة من خدمات الترجمة المعتمدة والترجمة الفورية والتوطين.',
    },
    timeline: {
      badge: 'مسيرتنا',
      heading: 'الجدول الزمني للشركة',
      subheading: 'أبرز المحطات التي شكّلت مسيرتنا وطريقة عملنا اليوم',
      keyMilestones: 'محطة رئيسية',
      yearsOfExcellence: 'عاماً من التميّز',
      journeyTitle: 'مسيرتنا',
      journeyBody: 'سنوات من النمو والخبرة والجودة المتّسقة',
      lookingAheadTitle: 'نتطلّع إلى الأمام',
      lookingAheadBody:
        'تستمر مسيرتنا في تعميق خبراتنا التخصصية والحفاظ على المعايير التي يعتمد عليها عملاؤنا.',
    },
  },
};
