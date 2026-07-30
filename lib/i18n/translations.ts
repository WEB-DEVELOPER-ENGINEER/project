export type Locale = 'en' | 'ar';

export interface TranslationDictionary {
  nav: {
    home: string;
    about: string;
    services: string;
    blog: string;
    contact: string;
    contactUs: string;
    getStarted: string;
    phone: string;
    email: string;
  };
  hero: {
    title: string;
    description: string;
    badgeIso: string;
    badgeLanguages: string;
    badgeSupport: string;
    ctaQuote: string;
    ctaServices: string;
  };
  services: {
    sectionTitle: string;
    sectionSubtitle: string;
    legalTitle: string;
    legalContent: string;
    technicalTitle: string;
    technicalContent: string;
    businessTitle: string;
    businessContent: string;
    medicalTitle: string;
    medicalContent: string;
    viewAll: string;
  };
  about: {
    sectionTitle: string;
    slogan: string;
    description: string;
    missionTitle: string;
    missionText: string;
    visionTitle: string;
    visionText: string;
    precisionTitle: string;
    precisionDesc: string;
    securityTitle: string;
    securityDesc: string;
    speedTitle: string;
    speedDesc: string;
  };
  testimonials: {
    sectionTitle: string;
    sectionSubtitle: string;
  };
  projects: {
    sectionTitle: string;
    sectionSubtitle: string;
  };
  blog: {
    sectionTitle: string;
    sectionSubtitle: string;
    readMore: string;
  };
  cta: {
    title: string;
    description: string;
    primaryBtn: string;
    secondaryBtn: string;
  };
  footer: {
    servicesHeader: string;
    companyHeader: string;
    newsletterTitle: string;
    newsletterDesc: string;
    newsletterPlaceholder: string;
    subscribeBtn: string;
    copyright: string;
    tagline: string;
  };
}

export const translations: Record<Locale, TranslationDictionary> = {
  en: {
    nav: {
      home: "Home",
      about: "About Us",
      services: "Services",
      blog: "Blog",
      contact: "Contact",
      contactUs: "Contact Us",
      getStarted: "Get Started",
      phone: "+971 50 324 4329",
      email: "info@jusortrans.com"
    },
    hero: {
      title: "Professional Certified Translation Services",
      description: "Accurate, timely, certified translations for legal, technical, and business documents in Dubai and globally.",
      badgeIso: "Certified Translation",
      badgeLanguages: "100+ Languages Supported",
      badgeSupport: "24/7 Customer Support",
      ctaQuote: "Get a Free Quote",
      ctaServices: "Explore Services"
    },
    services: {
      sectionTitle: "Our Services",
      sectionSubtitle: "Comprehensive translation and localization solutions tailored for your business needs.",
      legalTitle: "Legal Translation",
      legalContent: "Certified legal translations recognized by courts, embassies, and ministries in the UAE and worldwide.",
      technicalTitle: "Technical Translation",
      technicalContent: "Precision engineering, aerospace, and energy document translations handled by domain experts.",
      businessTitle: "Business Translation",
      businessContent: "Corporate agreements, financial reports, marketing copy, and compliance documentation translations.",
      medicalTitle: "Medical Translation",
      medicalContent: "Accurate translation of clinical trials, medical reports, pharmaceutical guides, and patents.",
      viewAll: "View All Services"
    },
    about: {
      sectionTitle: "About JUSOR Translation Services",
      slogan: "Bridging languages, enabling global growth.",
      description: "JUSOR is a premier provider of certified translation, localization, and interpretation services. With over 15 years of industry experience and a network of 100+ certified translators, we deliver exceptional language solutions tailored to your industry's standards.",
      missionTitle: "Our Mission",
      missionText: "To deliver absolute linguistic precision, cultural authenticity, and secure document translation services that bridge global communication gaps.",
      visionTitle: "Our Vision",
      visionText: "To be the leading global standard for translation quality, confidentiality, and technical domain expertise.",
      precisionTitle: "Precision",
      precisionDesc: "Every word is verified by domain experts.",
      securityTitle: "Security",
      securityDesc: "Strict ISO-compliant data protection protocols.",
      speedTitle: "Speed",
      speedDesc: "Fast turnaround times without compromising accuracy."
    },
    testimonials: {
      sectionTitle: "What Our Clients Say",
      sectionSubtitle: "Trusted by leading companies and legal firms across the region."
    },
    projects: {
      sectionTitle: "Featured Projects",
      sectionSubtitle: "Delivering excellence across diverse technical and corporate industries."
    },
    blog: {
      sectionTitle: "Latest Articles & Insights",
      sectionSubtitle: "Expert analysis, translation guides, and regulatory updates.",
      readMore: "Read More"
    },
    cta: {
      title: "Ready to break linguistic barriers?",
      description: "Get in touch with our certified translation specialists today for a free quote and consulting.",
      primaryBtn: "Get a Free Quote",
      secondaryBtn: "Learn More"
    },
    footer: {
      servicesHeader: "Services",
      companyHeader: "Company",
      newsletterTitle: "Subscribe to our newsletter",
      newsletterDesc: "Get the latest updates and insights delivered to your inbox.",
      newsletterPlaceholder: "Enter your email",
      subscribeBtn: "Subscribe",
      copyright: "All rights reserved.",
      tagline: "Certified translation you can trust."
    }
  },
  ar: {
    nav: {
      home: "الرئيسية",
      about: "من نحن",
      services: "خدماتنا",
      blog: "المدونة",
      contact: "تواصل معنا",
      contactUs: "اتصل بنا",
      getStarted: "ابدأ الآن",
      phone: "+971 50 324 4329",
      email: "info@jusortrans.com"
    },
    hero: {
      title: "خدمات الترجمة المعتمدة والاحترافية",
      description: "ترجمة دقيقة وموثوقة ومعتمدة للمستندات القانونية والتقنية والتجارية في دبي وحول العالم.",
      badgeIso: "ترجمة معتمدة",
      badgeLanguages: "دعم أكثر من 100 لغة",
      badgeSupport: "دعم على مدار 24/7",
      ctaQuote: "احصل على عرض سعر مجاني",
      ctaServices: "استكشف خدماتنا"
    },
    services: {
      sectionTitle: "خدماتنا المتميزة",
      sectionSubtitle: "حلول ترجمة وتوطين شاملة مصممة خصيصاً لتلبية متطلبات أعمالك.",
      legalTitle: "الترجمة القانونية",
      legalContent: "ترجمات قانونية معتمدة ومقبولة رسمياً لدى المحاكم والسفارات والوزارات في الإمارات والدول كافة.",
      technicalTitle: "الترجمة التقنية والهندسية",
      technicalContent: "ترجمة دقيقة لمستندات الهندسة والطيران والطاقة من قِبَل خبراء متمرسين في القطاع.",
      businessTitle: "الترجمة التجارية والشركات",
      businessContent: "ترجمة العقود التجارية، والتقارير المالية، والسياسات، والمواد التسويقية للشركات.",
      medicalTitle: "الترجمة الطبية والدوائية",
      medicalContent: "ترجمة معتمدة للتقارير الطبية والتجارب السريرية والأدلة الدوائية وبراءات الاختراع.",
      viewAll: "عرض جميع الخدمات"
    },
    about: {
      sectionTitle: "عن شركة جسور لخدمات الترجمة",
      slogan: "نجسر اللغات، وندعم النمو العالمي.",
      description: "تُعد شركة جسور المزود الرائد لخدمات الترجمة المعتمدة والتوطين والترجمة الفورية. مع أكثر من 15 عاماً من الخبرة وشبكة تضم أكثر من 100 مترجم معتمد، نقدم حلولاً لغوية رفيعة المستوى.",
      missionTitle: "رسالتنا",
      missionText: "تقديم دقة لغوية مطلقة وأصالة ثقافية وخدمات ترجمة آمنة تماماً تزيل كافة عوائق التواصل العالمي.",
      visionTitle: "رؤيتنا",
      visionText: "أن نكون المعيار العالمي الأول في جودة الترجمة والسرية التامة والخبرة المتخصصة.",
      precisionTitle: "الدقة الفائقة",
      precisionDesc: "يتم فحص وتدقيق كل كلمة بواسطة خبراء متخصصين.",
      securityTitle: "السرية والأمان",
      securityDesc: "بروتوكولات حماية بيانات صارمة متوافقة مع أحدث معايير ISO.",
      speedTitle: "السرعة والإنجاز",
      speedDesc: "سرعة تسليم استثنائية مع الحفاظ التام على أعلى مستويات الجودة."
    },
    testimonials: {
      sectionTitle: "آراء ورسائل عملائنا",
      sectionSubtitle: "محل ثقة كبرى الشركات والمكاتب القانونية والمؤسسات في المنطقة."
    },
    projects: {
      sectionTitle: "أبرز مشاريعنا المنفذة",
      sectionSubtitle: "سجل حافل بالتميز والانجاز في مختلف القطاعات التقنية والقانونية."
    },
    blog: {
      sectionTitle: "أحدث المقالات والرؤى",
      sectionSubtitle: "تحليلات متخصصة، أدلة الترجمة، وأحدث المستجدات التنظيمية والقانونية.",
      readMore: "اقرأ المزيد"
    },
    cta: {
      title: "جاهز لإزالة العوائق اللغوية وتوسيع أعمالك؟",
      description: "تواصل مع أخصائيي الترجمة المعتمدين لدينا اليوم للحصول على عرض سعر مجاني واستشارة فورية.",
      primaryBtn: "احصل على عرض سعر مجاني",
      secondaryBtn: "اعرف المزيد"
    },
    footer: {
      servicesHeader: "الخدمات",
      companyHeader: "الشركة",
      newsletterTitle: "اشترك في نشرتنا الإخبارية",
      newsletterDesc: "احصل على أحدث التحديثات والرؤى المتخصصة مباشرة في صندوق بريدك.",
      newsletterPlaceholder: "أدخل بريدك الإلكتروني",
      subscribeBtn: "اشتراك",
      copyright: "جميع الحقوق محفوظة.",
      tagline: "ترجمة معتمدة تصنع الثقة والتميز."
    }
  }
};
