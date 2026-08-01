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
    globalImpact: string;
    globalImpactCaption: string;
    ourStory: string;
  };
  hero: {
    imageTitle: string;
    imageCaption: string;
    playVideo: string;
    clientsServed: string;
    languagesSupported: string;
    yearsOfExperience: string;
    yearsOfExcellence: string;
    globalReach: string;
  };
  values: {
    badge: string;
    heading: string;
    subheading: string;
    commitment: string;
    principlesCaption: string;
    livingTitle: string;
    livingBody: string;
    coreValuesTitle: string;
    /** Fallback value cards used when the DB has no core_values rows. */
    items: { title: string; description: string; icon: string }[];
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
    cultureIntro: string; // "{company}" interpolated
    cultureCaption: string;
    expertTeamMember: string;
    expertTeamMemberBody: string;
    globalTeam: string;
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
    whatWeGuarantee: string;
    projectsCompleted: string;
    languagePairs: string;
    clientSatisfaction: string;
    supportAvailable: string;
    badges: string[];
  };
  cta: {
    freeConsultation: string;
    heading: string;
    body: string; // "{company}" interpolated
    getFreeQuote: string;
    exploreServices: string;
    callUsToday: string;
    callUsBody: string;
    emailUs: string;
    emailUsBody: string;
    scheduleMeeting: string;
    scheduleMeetingBody: string;
    bookConsultation: string;
    viewAllServices: string;
    seeOurWork: string;
    closingLine: string;
    satisfactionRate: string;
    happyClients: string;
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
    lookingAheadDetail: string;
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
      globalImpact: 'Global Impact',
      globalImpactCaption: 'Connecting cultures through professional translation',
      ourStory: 'Our Story',
    },
    hero: {
      imageTitle: 'Certified Translation, Done Properly',
      imageCaption: 'Bridging languages for clients across the UAE',
      playVideo: 'Play company introduction video',
      clientsServed: 'Clients Served',
      languagesSupported: 'Languages Supported',
      yearsOfExperience: 'Years of Experience',
      yearsOfExcellence: 'Years of Excellence',
      globalReach: 'Global Reach',
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
      coreValuesTitle: 'Our Core Values',
      items: [
        {
          title: 'Quality Excellence',
          description:
            'We hold every translation to the same standard: accurate, consistent, and appropriate for its audience and purpose.',
          icon: 'Award',
        },
        {
          title: 'Cultural Sensitivity',
          description:
            'Translation is more than swapping words. We carry meaning, context and cultural nuance across languages.',
          icon: 'Globe',
        },
        {
          title: 'Client Partnership',
          description:
            'We work as a long-term partner, not a one-off vendor — learning your terminology and your requirements.',
          icon: 'Handshake',
        },
        {
          title: 'Innovation',
          description:
            'We adopt tools that improve consistency and turnaround, while keeping human expertise at the centre.',
          icon: 'Lightbulb',
        },
        {
          title: 'Integrity',
          description:
            'We are transparent about scope, price and timing, and we handle every document in confidence.',
          icon: 'Shield',
        },
        {
          title: 'Team Excellence',
          description:
            'Our work rests on the expertise and care of qualified translators and reviewers.',
          icon: 'Users',
        },
      ],
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
      cultureIntro: 'At {company}, every document is handled by a translator qualified in its subject area — legal, medical, technical or financial — not by a generalist.',
      cultureBody:
        'We foster a collaborative environment where continuous learning is encouraged and quality is paramount — every translation is reviewed before it reaches the client.',
      cultureCaption: 'United by excellence, diversity in expertise',
      expertTeamMember: 'Expert Team Member',
      expertTeamMemberBody:
        'Our certified translators bring years of experience and subject-matter expertise to every project.',
      globalTeam: 'Global Team',
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
      whatWeGuarantee: 'What We Guarantee',
      projectsCompleted: 'Projects Completed',
      languagePairs: 'Language Pairs',
      clientSatisfaction: 'Client Satisfaction',
      supportAvailable: 'Support Available',
      badges: [
        'Certified Translation Services',
        'Confidential & Secure',
        'Professional Translators',
        'Quality Assured',
      ],
    },
    cta: {
      freeConsultation: 'Free Consultation',
      heading: 'Ready to Break Down Language Barriers?',
      body:
        'Talk to {company} about your documents — we will tell you what is needed, what it costs, and when you will have it.',
      getFreeQuote: 'Get Free Quote',
      exploreServices: 'Explore Services',
      callUsToday: 'Call Us Today',
      callUsBody: 'Speak directly with our team for immediate assistance.',
      emailUs: 'Email Us',
      emailUsBody: 'Send us your documents and requirements for a detailed quote and timeline.',
      scheduleMeeting: 'Schedule a Meeting',
      scheduleMeetingBody: 'Book a consultation to discuss your translation requirements in detail.',
      bookConsultation: 'Book Consultation',
      viewAllServices: 'View All Services',
      seeOurWork: 'See Our Work',
      closingLine: 'Ready to get started? Send us your documents today.',
      satisfactionRate: '99.8% Satisfaction Rate',
      happyClients: '500+ Happy Clients',
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
      lookingAheadDetail:
        'Each milestone reflects not just growth, but our commitment to helping clients communicate accurately across languages.',
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
      globalImpact: 'أثر عالمي',
      globalImpactCaption: 'نصل بين الثقافات عبر ترجمة احترافية',
      ourStory: 'قصتنا',
    },
    hero: {
      imageTitle: 'ترجمة معتمدة، تُنجز كما ينبغي',
      imageCaption: 'نصل بين اللغات لعملائنا في دولة الإمارات',
      playVideo: 'تشغيل فيديو التعريف بالشركة',
      clientsServed: 'عميل',
      languagesSupported: 'لغة مدعومة',
      yearsOfExperience: 'سنة خبرة',
      yearsOfExcellence: 'سنة من التميّز',
      globalReach: 'حضور عالمي',
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
      coreValuesTitle: 'قيمنا الأساسية',
      items: [
        {
          title: 'التميّز في الجودة',
          description:
            'نلتزم في كل ترجمة بالمعيار نفسه: الدقة والاتساق والملاءمة للجمهور والغرض المقصود.',
          icon: 'Award',
        },
        {
          title: 'الحساسية الثقافية',
          description:
            'الترجمة أكثر من استبدال الكلمات؛ فنحن ننقل المعنى والسياق والفروق الثقافية بين اللغات.',
          icon: 'Globe',
        },
        {
          title: 'الشراكة مع العميل',
          description:
            'نعمل كشريك طويل الأمد لا كمورّد لمرة واحدة، فنتعرّف على مصطلحاتك ومتطلباتك.',
          icon: 'Handshake',
        },
        {
          title: 'الابتكار',
          description:
            'نعتمد أدوات تحسّن الاتساق وسرعة الإنجاز، مع إبقاء الخبرة البشرية في صميم العمل.',
          icon: 'Lightbulb',
        },
        {
          title: 'النزاهة',
          description:
            'نوضّح نطاق العمل والسعر والمدة بشفافية، ونتعامل مع كل مستند بسرية تامة.',
          icon: 'Shield',
        },
        {
          title: 'تميّز الفريق',
          description:
            'يقوم عملنا على خبرة وعناية مترجمين ومراجعين مؤهلين.',
          icon: 'Users',
        },
      ],
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
      cultureIntro: 'في {company}، يتولّى كل مستند مترجمٌ مؤهل في مجاله — القانوني أو الطبي أو التقني أو المالي — لا مترجم عام.',
      cultureBody:
        'نحرص على بيئة عمل تعاونية نشجّع فيها التعلّم المستمر ونضع الجودة في المقام الأول — تخضع كل ترجمة للمراجعة قبل تسليمها للعميل.',
      cultureCaption: 'يجمعنا التميّز، ويثرينا تنوّع الخبرات',
      expertTeamMember: 'عضو فريق متخصص',
      expertTeamMemberBody:
        'يجمع مترجمونا المعتمدون بين سنوات الخبرة والتخصص الدقيق في كل مشروع.',
      globalTeam: 'فريق متعدد الخبرات',
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
      whatWeGuarantee: 'ما نضمنه لك',
      projectsCompleted: 'مشروع منجز',
      languagePairs: 'زوج لغوي',
      clientSatisfaction: 'رضا العملاء',
      supportAvailable: 'دعم متاح',
    },
    cta: {
      freeConsultation: 'استشارة مجانية',
      heading: 'هل أنت مستعد لتجاوز حاجز اللغة؟',
      body:
        'تحدّث إلى {company} بشأن مستنداتك — سنوضّح لك المطلوب والتكلفة وموعد التسليم.',
      getFreeQuote: 'احصل على عرض سعر مجاني',
      exploreServices: 'استكشف خدماتنا',
      callUsToday: 'اتصل بنا اليوم',
      callUsBody: 'تحدّث مباشرة مع فريقنا للحصول على مساعدة فورية.',
      emailUs: 'راسلنا عبر البريد',
      emailUsBody: 'أرسل لنا مستنداتك ومتطلباتك لتحصل على عرض سعر مفصّل وجدول زمني.',
      scheduleMeeting: 'حدّد موعد اجتماع',
      scheduleMeetingBody: 'احجز استشارة لمناقشة متطلبات الترجمة لديك بالتفصيل.',
      bookConsultation: 'احجز استشارة',
      viewAllServices: 'عرض جميع الخدمات',
      seeOurWork: 'اطّلع على أعمالنا',
      closingLine: 'مستعد للبدء؟ أرسل لنا مستنداتك اليوم.',
      satisfactionRate: 'نسبة رضا 99.8%',
      happyClients: '+500 عميل',
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
      lookingAheadDetail:
        'كل محطة لا تعكس النمو فحسب، بل تعكس التزامنا بمساعدة عملائنا على التواصل بدقة عبر اللغات.',
    },
  },
};
