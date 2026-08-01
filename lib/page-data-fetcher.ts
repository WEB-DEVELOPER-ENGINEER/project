/**
 * Centralized Page Data Fetcher
 * Provides consistent data fetching patterns for all pages
 */

import { 
  getHomepageData, 
  getFooterData, 
  getNavigationData, 
  getSiteSettings,
  getSEOMetadata,
  getServices,
  getFeatures
} from './data-access';

export interface PageDataBase {
  siteSettings: Record<string, any>;
  footerData: any;
  navigationData?: any;
}

export interface HomepagePageData extends PageDataBase {
  homepageData: any;
}

export interface StaticPageData extends PageDataBase {
  seoData?: any;
}

export interface ServicesPageData extends PageDataBase {
  services: any[];
  features: any[];
  seoData?: any;
}

export interface ContactPageData extends PageDataBase {
  contactData: any;
  seoData?: any;
}

/**
 * Fetch data for homepage with all required components
 */
export async function fetchHomepageData(locale: string = 'en'): Promise<HomepagePageData> {
  try {
    const [homepageData, footerData, navigationData] = await Promise.all([
      getHomepageData(locale),
      getFooterData(),
      getNavigationData()
    ]);

    return {
      homepageData,
      footerData,
      navigationData,
      siteSettings: homepageData.site_settings
    };
  } catch (error) {
    console.error('Error fetching homepage data, returning rich fallbacks:', error);
    
    const fallbackSiteSettings = {
      company_name: "JUSOR Translation Services",
      site_url: "https://jusortrans.com",
      company_logo: "/logo.png",
      company_description: "Professional translation services for legal, technical, and business documents",
      company_country: "AE",
      company_city: "Dubai",
      company_region: "Dubai",
      company_address: "Dubai, UAE",
      company_phone: "+971503244329",
      company_email: "info@jusortrans.com",
      supported_languages: ["English", "Arabic"],
      social_media_links: [
        { name: "Linkedin", icon_name: "Linkedin", url: "https://www.linkedin.com/company/jusor-translation" },
        { name: "Twitter", icon_name: "Twitter", url: "https://twitter.com/jusortranslation" },
        { name: "Facebook", icon_name: "Facebook", url: "https://www.facebook.com/jusortranslation" }
      ],
      service_area: "Dubai, UAE",
      services_catalog_name: "Translation Services",
      nav_contact_url: "/contact",
      nav_contact_text: "Contact Us",
      nav_cta_url: "/contact",
      nav_cta_text: "Get Started",
      copyright_text: "All rights reserved.",
      footer_tagline: "Certified translation you can trust."
    };

    const fallbackHomepageData = {
      sliders: [
        {
          id: 1,
          title: "Professional Certified Translation Services",
          description: "Accurate, timely, certified translations for legal, technical, and business documents.",
          image_url: "/images/hero-1.jpg",
          sort_order: 1,
          is_active: true
        }
      ],
      services: [
        {
          id: 1,
          title: "Legal Translation",
          content: "Certified legal translations recognized by courts, embassies, and ministries in the UAE and worldwide.",
          slug: "legal-translation",
          icon: { name: "Scale", icon_class: "scale" }
        },
        {
          id: 2,
          title: "Technical Translation",
          content: "Precision engineering, aerospace, and energy document translations handled by domain experts.",
          slug: "technical-translation",
          icon: { name: "Code", icon_class: "code" }
        },
        {
          id: 3,
          title: "Business Translation",
          content: "Corporate agreements, financial reports, marketing copy, and compliance documentation translations.",
          slug: "business-translation",
          icon: { name: "Briefcase", icon_class: "briefcase" }
        },
        {
          id: 4,
          title: "Medical Translation",
          content: "Accurate translation of clinical trials, medical reports, pharmaceutical guides, and patents.",
          slug: "medical-translation",
          icon: { name: "Heart", icon_class: "heart" }
        }
      ],
      about_us: {
        id: 1,
        title: "About JUSOR Translation Services",
        slogan: "Bridging languages, enabling global growth.",
        description: "JUSOR is a premier provider of certified translation, localization, and interpretation services. With over 15 years of industry experience and a network of 100+ certified translators, we deliver exceptional language solutions tailored to your industry's standards.",
        mission: "To deliver absolute linguistic precision, cultural authenticity, and secure document translation services that bridge global communication gaps.",
        vision: "To be the leading global standard for translation quality, confidentiality, and technical domain expertise.",
        values: [
          { title: "Precision", description: "Every word is verified by domain experts.", icon: "CheckCircle" },
          { title: "Security", description: "Strict ISO-compliant data protection protocols.", icon: "Shield" },
          { title: "Speed", description: "Fast turnaround times without compromising accuracy.", icon: "Zap" }
        ],
        is_active: true
      },
      clients: [
        { id: 1, title: "Client 1", description: "Leading construction group in UAE.", sort_order: 1, is_active: true },
        { id: 2, title: "Client 2", description: "Global aerospace manufacturer.", sort_order: 2, is_active: true }
      ],
      projects: [
        {
          id: 1,
          title: "Bilingual Corporate Restructuring",
          description: "Translation and localization of 500+ complex corporate contracts, employee handbooks, and compliance policies.",
          slug: "corporate-restructuring-localization",
          category: "Legal & Corporate",
          is_active: true
        },
        {
          id: 2,
          title: "Aviation Maintenance Manuals",
          description: "Technical translation of flight safety and MRO guidelines for major aviation operators in the UAE.",
          slug: "aviation-manuals-technical-translation",
          category: "Technical & Aerospace",
          is_active: true
        }
      ],
      testimonials: [
        {
          id: 1,
          name: "Sarah Al-Mansoori",
          description: "JUSOR provided exceptionally fast and accurate certified legal translation for our corporate setup in Dubai. Highly recommended!",
          company: "Al-Mansoori Legal Associates",
          position: "Senior Partner",
          rating: 5,
          is_active: true
        },
        {
          id: 2,
          name: "David H. Miller",
          description: "The technical translation of our engineering manuals was flawless. Their team understood our domain-specific jargon perfectly.",
          company: "AeroTech Solutions",
          position: "Operations Director",
          rating: 5,
          is_active: true
        }
      ],
      team_members: [
        {
          id: 1,
          name: "Michael Chen",
          job_title: "Technical Translation Director",
          bio: "Over 15 years of experience in technical and aerospace translation services.",
          is_active: true
        },
        {
          id: 2,
          name: "Dr. Sarah Johnson",
          job_title: "Senior Legal Translation Specialist",
          bio: "Expert in cross-border legal compliance and certified court translations.",
          is_active: true
        }
      ],
      recent_blogs: [
        {
          id: 1,
          title: "Understanding Certified Legal Translation in the UAE",
          excerpt: "A comprehensive guide on legal translation rules, court attestation, and regulatory guidelines for businesses in Dubai.",
          content: "This is sample content for the blog post about certified legal translation in the UAE.",
          slug: "certified-legal-translation-uae",
          published_date: "2026-07-15",
          is_published: true
        },
        {
          id: 2,
          title: "Navigating FIDIC Construction Contracts Translations",
          excerpt: "Why technical accuracy in engineering briefs and BOQ sheets is critical for dispute resolution board proceedings.",
          content: "This is sample content for the blog post about FIDIC construction contracts translations.",
          slug: "fidic-construction-contracts-translations",
          published_date: "2026-07-20",
          is_published: true
        }
      ],
      features: [
        { id: 1, title: "Certified Translation", description: "Quality-managed translation process.", icon_name: "FileText", category: "standards", sort_order: 1, is_active: true },
        { id: 2, title: "Arabic & English", description: "Certified translation between Arabic and English.", icon_name: "Globe", category: "standards", sort_order: 2, is_active: true }
      ],
      cta_sections: [
        {
          id: 1,
          title: "Ready to break linguistic barriers?",
          description: "Get in touch with our certified translation specialists today for a free quote and consulting.",
          primary_button_text: "Get a Free Quote",
          primary_button_url: "/contact",
          secondary_button_text: "Learn More",
          secondary_button_url: "/services",
          section_location: "homepage",
          is_active: true
        }
      ],
      site_settings: fallbackSiteSettings
    };

    const fallbackFooterData = {
      sections: [
        { id: 1, title: "Services" },
        { id: 2, title: "Company" }
      ],
      links: [
        { id: 1, footer_section_id: 1, name: "Legal Translation", url: "/services" },
        { id: 2, footer_section_id: 1, name: "Technical Translation", url: "/services" },
        { id: 3, footer_section_id: 1, name: "Business Translation", url: "/services" },
        { id: 4, footer_section_id: 2, name: "About Us", url: "/about" },
        { id: 5, footer_section_id: 2, name: "Contact Us", url: "/contact" },
        { id: 6, footer_section_id: 2, name: "Privacy Policy", url: "/privacy" }
      ]
    };

    const fallbackNavigationData = {
      top_bar_items: [
        { name: "Phone", link: "tel:+971503244329", icon_id: 1, icon: { name: "Phone" } },
        { name: "Email", link: "mailto:info@jusortrans.com", icon_id: 2, icon: { name: "Mail" } }
      ],
      header_items: [
        { name: "Home", link: "/" },
        { name: "About Us", link: "/about" },
        { name: "Services", link: "/services" },
        { name: "Blog", link: "/blog" },
        { name: "Contact", link: "/contact" }
      ]
    };

    return {
      homepageData: fallbackHomepageData,
      footerData: fallbackFooterData,
      navigationData: fallbackNavigationData,
      siteSettings: fallbackHomepageData.site_settings
    };
  }
}

/**
 * Fetch data for static pages (about, privacy, etc.)
 */
export async function fetchStaticPageData(pageSlug?: string): Promise<StaticPageData> {
  try {
    const [siteSettings, footerData, navigationData, seoData] = await Promise.all([
      getSiteSettings(),
      getFooterData(),
      getNavigationData(),
      pageSlug ? getSEOMetadata(pageSlug).catch(() => null) : Promise.resolve(null)
    ]);

    return {
      siteSettings,
      footerData,
      navigationData,
      seoData
    };
  } catch (error) {
    console.error('Error fetching static page data, returning fallbacks:', error);
    return {
      siteSettings: {
        company_name: "JUSOR Translation Services",
        site_url: "https://jusortrans.com",
        company_email: "info@jusortrans.com",
        company_phone: "+971503244329"
      },
      footerData: {
        sections: [{ id: 1, title: "Services" }, { id: 2, title: "Company" }],
        links: [
          { id: 1, footer_section_id: 1, name: "Legal Translation", url: "/services" },
          { id: 2, footer_section_id: 2, name: "Contact Us", url: "/contact" }
        ]
      },
      navigationData: {
        header_items: [
          { name: "Home", link: "/" },
          { name: "About Us", link: "/about" },
          { name: "Services", link: "/services" },
          { name: "Blog", link: "/blog" },
          { name: "Contact", link: "/contact" }
        ]
      },
      seoData: null
    };
  }
}

/**
 * Fetch minimal data for layout components
 */
export async function fetchLayoutData(): Promise<{
  siteSettings: Record<string, any>;
  navigationData: any;
}> {
  try {
    const [siteSettings, navigationData] = await Promise.all([
      getSiteSettings(),
      getNavigationData()
    ]);

    return {
      siteSettings,
      navigationData
    };
  } catch (error) {
    console.error('Error fetching layout data, returning fallbacks:', error);
    return {
      siteSettings: {
        company_name: "JUSOR Translation Services",
        site_url: "https://jusortrans.com",
        company_email: "info@jusortrans.com",
        company_phone: "+971503244329"
      },
      navigationData: {
        header_items: [
          { name: "Home", link: "/" },
          { name: "About Us", link: "/about" },
          { name: "Services", link: "/services" },
          { name: "Blog", link: "/blog" },
          { name: "Contact", link: "/contact" }
        ]
      }
    };
  }
}

/**
 * Fetch data for blog pages
 */
export async function fetchBlogPageData(pageSlug?: string): Promise<StaticPageData> {
  return fetchStaticPageData(pageSlug || 'blog');
}


/**
 * Fetch data for services page
 */
export async function fetchServicesPageData(): Promise<ServicesPageData> {
  try {
    const [siteSettings, footerData, navigationData, services, features, seoData] = await Promise.all([
      getSiteSettings(),
      getFooterData(),
      getNavigationData(),
      getServices(),
      getFeatures(),
      getSEOMetadata('services').catch(() => null)
    ]);

    return {
      siteSettings,
      footerData,
      navigationData,
      services,
      features,
      seoData
    };
  } catch (error) {
    console.error('Error fetching services page data:', error);
    throw new Error('Failed to fetch services page data');
  }
}

/**
 * Fetch data for contact page
 */
export async function fetchContactPageData(): Promise<ContactPageData> {
  try {
    const [siteSettings, footerData, navigationData, seoData] = await Promise.all([
      getSiteSettings(),
      getFooterData(),
      getNavigationData(),
      getSEOMetadata('contact').catch(() => null)
    ]);

    // Build contact data from site settings and fallback values
    const contactData = {
      email: siteSettings.company_email || 'info@jusortrans.com',
      phone: siteSettings.company_phone || '+971 50 324 4329',
      address: siteSettings.company_address || 'Abu Saif Business Center - Al-Kazim Building - Block A - M Floor - Office 40B, Abu Hail, Dubai, United Arab Emirates',
      city: siteSettings.company_city || 'Dubai',
      country: siteSettings.company_country || 'United Arab Emirates',
      map_url: siteSettings.map_url || 'https://maps.app.goo.gl/ZKmHjsSHa66CeNjC8',
      instagram_url: siteSettings.instagram_url || 'https://www.instagram.com/Jusor_translation',
      whatsapp_number: siteSettings.whatsapp_number || '971503244329',
      whatsapp_message: siteSettings.whatsapp_message || 'Hello Jusor, I would like to inquire about your services.',
      business_hours: siteSettings.business_hours,
      contact_title: siteSettings.contact_title,
      contact_subtitle: siteSettings.contact_subtitle,
      contact_description: siteSettings.contact_description,
    };

    return {
      siteSettings,
      footerData,
      navigationData,
      contactData,
      seoData
    };
  } catch (error) {
    console.error('Error fetching contact page data:', error);
    // Get fallback footer data
    const fallbackFooterData = await getFooterData().catch(() => ({ sections: [], links: [] }));
    
    return {
      siteSettings: {},
      footerData: fallbackFooterData,
      navigationData: { top_bar_items: [], header_items: [] },
      contactData: {
        email: 'info@jusortrans.com',
        phone: '+971 50 324 4329',
        address: 'Abu Saif Business Center - Al-Kazim Building - Block A - M Floor - Office 40B, Abu Hail, Dubai, United Arab Emirates',
        city: 'Dubai',
        country: 'United Arab Emirates',
        map_url: 'https://maps.app.goo.gl/ZKmHjsSHa66CeNjC8',
        instagram_url: 'https://www.instagram.com/Jusor_translation',
        whatsapp_number: '971503244329',
        whatsapp_message: 'Hello Jusor, I would like to inquire about your services.',
        business_hours: 'Sunday - Thursday: 9:00 AM - 6:00 PM',
        contact_title: 'Get in Touch',
        contact_subtitle: 'Ready to break down language barriers? Contact our expert team today.',
        contact_description: 'We provide professional translation and interpretation services across multiple languages. Get your free quote today.',
      },
      seoData: null
    };
  }
}

/**
 * Error boundary for data fetching
 */
export function withDataFetchingErrorBoundary<T>(
  fetchFunction: () => Promise<T>,
  fallbackData: T
): () => Promise<T> {
  return async () => {
    try {
      return await fetchFunction();
    } catch (error) {
      console.error('Data fetching error:', error);
      return fallbackData;
    }
  };
}