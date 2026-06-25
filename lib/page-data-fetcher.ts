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
export async function fetchHomepageData(): Promise<HomepagePageData> {
  try {
    const [homepageData, footerData, navigationData] = await Promise.all([
      getHomepageData(),
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
    console.error('Error fetching homepage data:', error);
    throw new Error('Failed to fetch homepage data');
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
    console.error('Error fetching static page data:', error);
    throw new Error('Failed to fetch page data');
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
    console.error('Error fetching layout data:', error);
    return {
      siteSettings: {},
      navigationData: { top_bar_items: [], header_items: [] }
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
      address: siteSettings.company_address || 'Dar Al Wuheida Building - Office No. 319 - Abu Hail - Dubai - United Arab Emirates',
      city: siteSettings.company_city || 'Dubai',
      country: siteSettings.company_country || 'United Arab Emirates',
      map_url: siteSettings.map_url || 'https://maps.app.goo.gl/kcy1snMZ59b8qwHdA',
      instagram_url: siteSettings.instagram_url || 'https://www.instagram.com/Jusor_translation',
      whatsapp_number: siteSettings.whatsapp_number || '971503244329',
      whatsapp_message: siteSettings.whatsapp_message || 'Hello Jusor, I would like to inquire about your services.',
      business_hours: siteSettings.business_hours || 'Sunday - Thursday: 9:00 AM - 6:00 PM',
      contact_title: siteSettings.contact_title || 'Get in Touch',
      contact_subtitle: siteSettings.contact_subtitle || 'Ready to break down language barriers? Contact our expert team today.',
      contact_description: siteSettings.contact_description || 'We provide professional translation and interpretation services across multiple languages. Get your free quote today.',
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
        address: 'Dar Al Wuheida Building - Office No. 319 - Abu Hail - Dubai - United Arab Emirates',
        city: 'Dubai',
        country: 'United Arab Emirates',
        map_url: 'https://maps.app.goo.gl/kcy1snMZ59b8qwHdA',
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