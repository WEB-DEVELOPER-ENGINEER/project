/**
 * Page Data Service - Centralized data fetching with consistent error handling
 * Follows Single Responsibility and Dependency Inversion principles
 */

import { 
  getSiteSettings, 
  getFooterData, 
  getNavigationData, 
  getSEOMetadata,
  getServices,
  getServiceCategories,
  getFeatures,
  getAllProjects,
  getProjects
} from './data-access';

// Base interface for all page data
interface BasePageData {
  siteSettings: any;
  footerData: any;
  navigationData: any;
  seoData?: any;
}

// Specific page data interfaces
export interface ContactPageData extends BasePageData {
  contactData: any;
}

export interface ServicesPageData extends BasePageData {
  services: any[];
  categories: any[];
  features: any[];
}

export interface ProjectsPageData extends BasePageData {
  projects: any[];
  totalProjects: number;
}

export interface HomepageData extends BasePageData {
  homepageData: any;
}

/**
 * Abstract base class for page data fetching
 * Implements Template Method pattern for consistent data fetching
 */
abstract class BasePageDataService<T extends BasePageData> {
  protected async fetchBaseData(pageSlug?: string): Promise<Partial<BasePageData>> {
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
      console.error(`Error fetching base data for ${pageSlug || 'page'}:`, error);
      throw error;
    }
  }

  protected async getFallbackFooterData(): Promise<any> {
    try {
      return await getFooterData();
    } catch (error) {
      console.warn('Failed to fetch footer data, using empty fallback:', error);
      return { sections: [], links: [] };
    }
  }

  protected createFallbackBaseData(): Partial<BasePageData> {
    return {
      siteSettings: {},
      footerData: { sections: [], links: [] },
      navigationData: { top_bar_items: [], header_items: [] },
      seoData: null
    };
  }

  abstract fetchPageData(): Promise<T>;
}

/**
 * Contact Page Data Service
 */
class ContactPageDataService extends BasePageDataService<ContactPageData> {
  async fetchPageData(): Promise<ContactPageData> {
    try {
      const baseData = await this.fetchBaseData('contact');
      
      // Build contact data from site settings with fallbacks
      const contactData = {
        email: baseData.siteSettings?.company_email || 'info@jusortrans.com',
        phone: baseData.siteSettings?.company_phone || '+971 50 324 4329',
        address: baseData.siteSettings?.company_address || 'Abu Saif Business Center - Al-Kazim Building - Block A - M Floor - Office 40B, Abu Hail, Dubai, United Arab Emirates',
        city: baseData.siteSettings?.company_city || 'Dubai',
        country: baseData.siteSettings?.company_country || 'United Arab Emirates',
        map_url: baseData.siteSettings?.map_url || 'https://maps.app.goo.gl/ZKmHjsSHa66CeNjC8',
        instagram_url: baseData.siteSettings?.instagram_url || 'https://www.instagram.com/Jusor_translation',
        whatsapp_number: baseData.siteSettings?.whatsapp_number || '971503244329',
        whatsapp_message: baseData.siteSettings?.whatsapp_message || 'Hello Jusor, I would like to inquire about your services.',
        business_hours: baseData.siteSettings?.business_hours || 'Sunday - Thursday: 9:00 AM - 6:00 PM',
        contact_title: baseData.siteSettings?.contact_title || 'Get in Touch',
        contact_subtitle: baseData.siteSettings?.contact_subtitle || 'Ready to break down language barriers? Contact our expert team today.',
        contact_description: baseData.siteSettings?.contact_description || 'We provide professional translation and interpretation services across multiple languages. Get your free quote today.',
      };

      return {
        ...baseData,
        contactData
      } as ContactPageData;

    } catch (error) {
      console.error('Error fetching contact page data:', error);
      
      // Fallback with footer data attempt
      const fallbackFooterData = await this.getFallbackFooterData();
      const fallbackBaseData = this.createFallbackBaseData();
      
      return {
        ...fallbackBaseData,
        footerData: fallbackFooterData,
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
        }
      } as ContactPageData;
    }
  }
}

/**
 * Services Page Data Service
 */
class ServicesPageDataService extends BasePageDataService<ServicesPageData> {
  async fetchPageData(): Promise<ServicesPageData> {
    try {
      const [baseData, services, categories, features] = await Promise.all([
        this.fetchBaseData('services'),
        getServices(),
        getServiceCategories(),
        getFeatures()
      ]);

      return {
        ...baseData,
        services,
        categories,
        features
      } as ServicesPageData;

    } catch (error) {
      console.error('Error fetching services page data:', error);
      
      // Fallback with footer data attempt and empty arrays for services data
      const fallbackFooterData = await this.getFallbackFooterData();
      const fallbackBaseData = this.createFallbackBaseData();
      
      return {
        ...fallbackBaseData,
        footerData: fallbackFooterData,
        services: [],
        categories: [],
        features: []
      } as ServicesPageData;
    }
  }
}

/**
 * Projects Page Data Service
 */
class ProjectsPageDataService extends BasePageDataService<ProjectsPageData> {
  async fetchPageData(): Promise<ProjectsPageData> {
    try {
      const [baseData, projectsResponse] = await Promise.all([
        this.fetchBaseData('projects'),
        getProjects(1, 50) // Get first 50 projects for the page
      ]);

      return {
        ...baseData,
        projects: projectsResponse.data,
        totalProjects: projectsResponse.pagination.total
      } as ProjectsPageData;

    } catch (error) {
      console.error('Error fetching projects page data:', error);
      throw new Error('Failed to fetch projects page data');
    }
  }
}

// Factory for creating page data services
export class PageDataServiceFactory {
  static createContactService(): ContactPageDataService {
    return new ContactPageDataService();
  }

  static createServicesService(): ServicesPageDataService {
    return new ServicesPageDataService();
  }

  static createProjectsService(): ProjectsPageDataService {
    return new ProjectsPageDataService();
  }
}

// Convenience functions for backward compatibility
export async function fetchContactPageData(): Promise<ContactPageData> {
  const service = PageDataServiceFactory.createContactService();
  return service.fetchPageData();
}

export async function fetchServicesPageData(): Promise<ServicesPageData> {
  const service = PageDataServiceFactory.createServicesService();
  return service.fetchPageData();
}

export async function fetchProjectsPageData(): Promise<ProjectsPageData> {
  const service = PageDataServiceFactory.createProjectsService();
  return service.fetchPageData();
}
