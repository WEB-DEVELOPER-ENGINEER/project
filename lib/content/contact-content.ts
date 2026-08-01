/**
 * Contact page copy, in English and Arabic.
 *
 * Kept out of the components themselves so the two languages stay in sync
 * and the copy can be reviewed as a whole. Values that come from the CMS
 * (phone, email, address, opening hours) are NOT duplicated here — those
 * still come from site settings / contactData at render time.
 */

import type { Locale } from '@/lib/locale';

export interface ContactContent {
  hero: {
    breadcrumbHome: string;
    breadcrumbCurrent: string;
    title: string;
    subtitle: string;
    description: string;
    callUs: string;
    emailUs: string;
    whatsapp: string;
    availableNow: string;
    expertTeam: string;
    requestQuote: string;
  };
  info: {
    sectionTitle: string;
    sectionDescription: string;
    officeInformation: string;
    officeLocation: string;
    businessHours: string;
    serviceAreas: string;
    callUsTitle: string;
    callUsDescription: string;
    emailUsTitle: string;
    emailUsDescription: string;
    whatsappTitle: string;
    whatsappDescription: string;
    whatsappAction: string;
    followUsTitle: string;
    followUsDescription: string;
    whyChooseTitle: string;
    certifiedTitle: string;
    certifiedDescription: string;
    expertTeamTitle: string;
    expertTeamDescription: string;
    supportTitle: string;
    supportDescription: string;
    urgentTitle: string;
    urgentDescription: string;
    urgentAction: string;
    availableSupport: string;
    availableResponse: string;
    availableInstant: string;
    availableUpdates: string;
    weekendClosed: string;
    emergency247: string;
    areaPrimary: string;
    areaRegion: string;
    areaGlobal: string;
    getDirections: string;
    statProjects: string;
    statLanguages: string;
    statSatisfaction: string;
    statSupport: string;
    urgentBody: string;
    callNow: string;
    whatsappNow: string;
  };
  map: {
    sectionTitle: string;
    sectionDescription: string;
    officeAddress: string;
    gettingHere: string;
    byMetro: string;
    byMetroDetail: string;
    byCar: string;
    byCarDetail: string;
    byBus: string;
    byBusDetail: string;
    nearbyLandmarks: string;
    mainLocation: string;
    primeLocation: string;
    primeLocationDetail: string;
    flexibleHours: string;
    flexibleHoursDetail: string;
    alwaysReachable: string;
    alwaysReachableDetail: string;
    scheduleVisit: string;
    scheduleVisitDescription: string;
    getDirections: string;
    /** Nearby landmarks, paired with `landmarkDistances` by index. */
    landmarks: string[];
    landmarkDistances: string[];
    officeMapLabel: string;
    loadMap: string;
    loadMapHint: string;
    directions: string;
    openInMaps: string;
  };
  cta: {
    title: string;
    description: string;
    primaryAction: string;
    secondaryAction: string;
    reachDirectly: string;
    responseTime: string;
    sendMessage: string;
    benefits: string[];
    accreditationsTitle: string;
    accreditations: string[];
    whatsappMessage: string;
    statProjectsLabel: string;
    srQuote: string;
    srWhatsapp: string;
  };
}

export const CONTACT_CONTENT: Record<Locale, ContactContent> = {
  en: {
    hero: {
      breadcrumbHome: 'Home',
      breadcrumbCurrent: 'Contact',
      title: 'Get in Touch',
      subtitle: 'Ready to break down language barriers? Contact our expert team today.',
      description:
        'Send us your document and we will confirm scope, timeline, and a free quote before any work begins.',
      callUs: 'Call Us',
      emailUs: 'Email Us',
      whatsapp: 'WhatsApp',
      availableNow: 'Available Now',
      expertTeam: 'Expert Team',
      requestQuote: 'Request a Free Quote',
    },
    info: {
      sectionTitle: 'How to Reach Us',
      sectionDescription: 'Choose whichever channel suits you — we reply to every enquiry.',
      officeInformation: 'Office Information',
      officeLocation: 'Office Location',
      businessHours: 'Business Hours',
      serviceAreas: 'Service Areas',
      callUsTitle: 'Call Us',
      callUsDescription: 'Speak directly with our team',
      emailUsTitle: 'Email Us',
      emailUsDescription: 'Send us your project details',
      whatsappTitle: 'WhatsApp',
      whatsappDescription: 'Chat with us instantly',
      whatsappAction: 'Start Chat',
      followUsTitle: 'Follow Us',
      followUsDescription: 'Stay updated with our work',
      whyChooseTitle: 'Why Choose Jusor Translation?',
      certifiedTitle: 'Certified Professionals',
      certifiedDescription:
        'Our translations are accredited by the UAE Ministry of Justice and accepted by Dubai Courts, DIFC Courts, and DIAC.',
      expertTeamTitle: 'Expert Team',
      expertTeamDescription:
        'Licensed translators working alongside legal, technical, and financial subject-matter experts.',
      supportTitle: 'Confidential Handling',
      supportDescription:
        'Every document is handled under a signed non-disclosure agreement and transferred securely.',
      urgentTitle: 'Need Urgent Translation Services?',
      urgentDescription:
        'Tell us your deadline and we will confirm whether we can accommodate an expedited turnaround.',
      urgentAction: 'Contact Us Now',
      availableSupport: '24/7 Support Available',
      availableResponse: 'Response within 2–4 hours',
      availableInstant: 'Instant messaging',
      availableUpdates: 'Latest updates & portfolio',
      weekendClosed: 'Friday & Saturday: Closed',
      emergency247: 'Emergency services available 24/7',
      areaPrimary: 'Dubai, UAE (Primary)',
      areaRegion: 'Middle East & North Africa',
      areaGlobal: 'Global remote services',
      getDirections: 'Get Directions',
      statProjects: 'Projects Completed',
      statLanguages: 'Languages Supported',
      statSatisfaction: 'Client Satisfaction',
      statSupport: 'Support Available',
      urgentBody:
        "We understand that some projects can't wait. Tell us your deadline and we will confirm whether an expedited turnaround is possible.",
      callNow: 'Call Now',
      whatsappNow: 'WhatsApp Us',
    },
    map: {
      sectionTitle: 'Visit Our Office',
      sectionDescription: 'Located in Abu Hail, Dubai — easy to reach by metro, car, or bus.',
      officeAddress: 'Office Address',
      gettingHere: 'Getting Here',
      byMetro: 'By Metro',
      byMetroDetail: 'Abu Hail Station (Green Line) — 5 min walk',
      byCar: 'By Car',
      byCarDetail: 'Free parking available in the building',
      byBus: 'By Bus',
      byBusDetail: 'Multiple bus routes serve the area',
      nearbyLandmarks: 'Nearby Landmarks',
      mainLocation: 'Main Location',
      primeLocation: 'Prime Location',
      primeLocationDetail: 'Central Dubai, close to major government offices',
      flexibleHours: 'Flexible Hours',
      flexibleHoursDetail: 'Visit during business hours or arrange an appointment',
      alwaysReachable: 'Always Reachable',
      alwaysReachableDetail: 'Reach us by phone, email, or WhatsApp',
      scheduleVisit: 'Schedule a Visit',
      scheduleVisitDescription:
        'Prefer to hand over your documents in person? Get in touch and we will arrange a time.',
      getDirections: 'Get Directions',
      landmarks: [
        'Dubai International Airport',
        'Dubai Metro — Abu Hail Station',
        'Deira City Centre',
        'Dubai Creek',
      ],
      landmarkDistances: [
        '15 minutes drive',
        '5 minutes walk',
        '10 minutes drive',
        '8 minutes walk',
      ],
      officeMapLabel: 'Jusor Translation Office',
      loadMap: 'Load Interactive Map',
      loadMapHint: 'Click to load Google Maps',
      directions: 'Directions',
      openInMaps: 'Open in Maps',
    },
    cta: {
      title: 'Still Facing Language Barriers?',
      description:
        'Send us your document today and get a free quote from our MOJ-accredited translation team.',
      primaryAction: 'Get Started Today',
      secondaryAction: 'View All Services',
      reachDirectly: 'Or reach out to us directly:',
      responseTime: 'Average Response Time',
      sendMessage: 'Send Message',
      benefits: [
        'Free project consultation',
        'Certified, accredited translators',
        'Legal, technical, and financial expertise',
        'Confidential handling under NDA',
        'Arabic and English language pairs',
        'Quality-managed review process',
      ],
      accreditationsTitle: 'Accredited and Recognised',
      accreditations: [
        'ISO 9001:2015 certified quality management system',
        'Accredited by the UAE Ministry of Justice (MOJ)',
        'Accepted by Dubai Courts and DIFC Courts',
        'Registered with the Dubai International Arbitration Centre (DIAC)',
      ],
      whatsappMessage: 'Hello Jusor, I would like to get a quote for my translation project.',
      statProjectsLabel: 'Projects Completed',
      srQuote: 'Scroll to the contact form to get a personalised quote for your translation project',
      srWhatsapp: 'Start an instant WhatsApp conversation with our translation team',
    },
  },

  ar: {
    hero: {
      breadcrumbHome: 'الرئيسية',
      breadcrumbCurrent: 'تواصل معنا',
      title: 'تواصل معنا',
      subtitle: 'هل أنت مستعد لتجاوز حواجز اللغة؟ تواصل مع فريقنا المتخصص اليوم.',
      description:
        'أرسل إلينا مستندك وسنؤكد لك النطاق والجدول الزمني وعرض سعر مجاني قبل بدء أي عمل.',
      callUs: 'اتصل بنا',
      emailUs: 'راسلنا',
      whatsapp: 'واتساب',
      availableNow: 'متاحون الآن',
      expertTeam: 'فريق متخصص',
      requestQuote: 'اطلب عرض سعر مجاني',
    },
    info: {
      sectionTitle: 'كيف تصل إلينا',
      sectionDescription: 'اختر القناة التي تناسبك — نردّ على كل استفسار.',
      officeInformation: 'معلومات المكتب',
      officeLocation: 'موقع المكتب',
      businessHours: 'ساعات العمل',
      serviceAreas: 'نطاق الخدمة',
      callUsTitle: 'اتصل بنا',
      callUsDescription: 'تحدّث مباشرة مع فريقنا',
      emailUsTitle: 'راسلنا بالبريد',
      emailUsDescription: 'أرسل إلينا تفاصيل مشروعك',
      whatsappTitle: 'واتساب',
      whatsappDescription: 'تواصل معنا فوراً',
      whatsappAction: 'ابدأ المحادثة',
      followUsTitle: 'تابعنا',
      followUsDescription: 'اطّلع على آخر أعمالنا',
      whyChooseTitle: 'لماذا تختار جسور الكلمات؟',
      certifiedTitle: 'اعتماد رسمي',
      certifiedDescription:
        'ترجماتنا معتمدة من وزارة العدل في دولة الإمارات ومقبولة لدى محاكم دبي ومحاكم DIFC ومركز دبي للتحكيم الدولي.',
      expertTeamTitle: 'فريق متخصص',
      expertTeamDescription:
        'مترجمون معتمدون يعملون إلى جانب خبراء متخصصين في المجالات القانونية والتقنية والمالية.',
      supportTitle: 'تعامل سري',
      supportDescription:
        'يُتعامل مع كل مستند بموجب اتفاقية عدم إفشاء موقّعة ويُنقل بشكل آمن.',
      urgentTitle: 'هل تحتاج ترجمة عاجلة؟',
      urgentDescription:
        'أخبرنا بموعدك النهائي وسنؤكد لك إمكانية تنفيذ الطلب ضمن جدول زمني معجّل.',
      urgentAction: 'تواصل معنا الآن',
      availableSupport: 'دعم متاح على مدار الساعة',
      availableResponse: 'الرد خلال 2–4 ساعات',
      availableInstant: 'مراسلة فورية',
      availableUpdates: 'آخر الأخبار والأعمال',
      weekendClosed: 'الجمعة والسبت: مغلق',
      emergency247: 'خدمات الطوارئ متاحة على مدار الساعة',
      areaPrimary: 'دبي، الإمارات (المقر الرئيسي)',
      areaRegion: 'الشرق الأوسط وشمال إفريقيا',
      areaGlobal: 'خدمات عن بُعد حول العالم',
      getDirections: 'احصل على الاتجاهات',
      statProjects: 'مشروع منجز',
      statLanguages: 'لغة مدعومة',
      statSatisfaction: 'رضا العملاء',
      statSupport: 'دعم متواصل',
      urgentBody:
        'ندرك أن بعض المشاريع لا تحتمل التأجيل. أخبرنا بموعدك النهائي وسنؤكد لك إمكانية التنفيذ ضمن جدول زمني معجّل.',
      callNow: 'اتصل الآن',
      whatsappNow: 'راسلنا على واتساب',
    },
    map: {
      sectionTitle: 'زيارة مكتبنا',
      sectionDescription: 'يقع مكتبنا في أبو هيل بدبي — يسهل الوصول إليه بالمترو أو السيارة أو الحافلة.',
      officeAddress: 'عنوان المكتب',
      gettingHere: 'كيفية الوصول',
      byMetro: 'بالمترو',
      byMetroDetail: 'محطة أبو هيل (الخط الأخضر) — على بُعد 5 دقائق سيراً',
      byCar: 'بالسيارة',
      byCarDetail: 'مواقف مجانية متاحة داخل المبنى',
      byBus: 'بالحافلة',
      byBusDetail: 'عدة خطوط حافلات تخدم المنطقة',
      nearbyLandmarks: 'معالم قريبة',
      mainLocation: 'الموقع الرئيسي',
      primeLocation: 'موقع متميز',
      primeLocationDetail: 'وسط دبي، بالقرب من الدوائر الحكومية الرئيسية',
      flexibleHours: 'ساعات مرنة',
      flexibleHoursDetail: 'قم بزيارتنا خلال ساعات العمل أو حدّد موعداً مسبقاً',
      alwaysReachable: 'دائماً بالقرب منك',
      alwaysReachableDetail: 'تواصل معنا هاتفياً أو بالبريد الإلكتروني أو عبر واتساب',
      scheduleVisit: 'حدّد موعد زيارة',
      scheduleVisitDescription:
        'هل تفضّل تسليم مستنداتك شخصياً؟ تواصل معنا وسنحدد الوقت المناسب.',
      getDirections: 'احصل على الاتجاهات',
      landmarks: [
        'مطار دبي الدولي',
        'مترو دبي — محطة أبو هيل',
        'ديرة سيتي سنتر',
        'خور دبي',
      ],
      landmarkDistances: [
        '15 دقيقة بالسيارة',
        '5 دقائق سيراً',
        '10 دقائق بالسيارة',
        '8 دقائق سيراً',
      ],
      officeMapLabel: 'مكتب جسور الكلمات للترجمة',
      loadMap: 'تحميل الخريطة التفاعلية',
      loadMapHint: 'انقر لتحميل خرائط جوجل',
      directions: 'الاتجاهات',
      openInMaps: 'فتح في الخرائط',
    },
    cta: {
      title: 'هل ما زالت حواجز اللغة تعترض طريقك؟',
      description:
        'أرسل مستندك اليوم واحصل على عرض سعر مجاني من فريقنا المعتمد من وزارة العدل.',
      primaryAction: 'ابدأ الآن',
      secondaryAction: 'عرض جميع الخدمات',
      reachDirectly: 'أو تواصل معنا مباشرة:',
      responseTime: 'متوسط وقت الاستجابة',
      sendMessage: 'أرسل رسالة',
      benefits: [
        'استشارة مجانية للمشروع',
        'مترجمون معتمدون ومرخّصون',
        'خبرة قانونية وتقنية ومالية',
        'تعامل سري بموجب اتفاقية عدم إفشاء',
        'أزواج لغوية عربي-إنجليزي',
        'عملية مراجعة خاضعة لإدارة الجودة',
      ],
      accreditationsTitle: 'اعتمادات ومرجعيات رسمية',
      accreditations: [
        'نظام إدارة جودة معتمد بشهادة ISO 9001:2015',
        'معتمدون من وزارة العدل في دولة الإمارات',
        'مقبولون لدى محاكم دبي ومحاكم مركز دبي المالي العالمي',
        'مسجّلون لدى مركز دبي للتحكيم الدولي (DIAC)',
      ],
      whatsappMessage: 'مرحباً جسور، أرغب في الحصول على عرض سعر لمشروع ترجمة.',
      statProjectsLabel: 'مشروع منجز',
      srQuote: 'انتقل إلى نموذج التواصل للحصول على عرض سعر مخصّص لمشروع الترجمة الخاص بك',
      srWhatsapp: 'ابدأ محادثة واتساب فورية مع فريق الترجمة لدينا',
    },
  },
};
