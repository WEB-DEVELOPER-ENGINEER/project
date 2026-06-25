/**
 * Centralized Cache Management System
 * Production-ready cache invalidation and management
 */

// Cache implementation (in production, use Redis)
const cache = new Map<string, { data: any; expires: number }>();

export interface CacheConfig {
  ttlSeconds?: number;
  tags?: string[];
}

export class CacheManager {
  private static instance: CacheManager;
  private cache = cache;
  private tagMap = new Map<string, Set<string>>(); // tag -> set of cache keys

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  private getCacheKey(prefix: string, params?: Record<string, any>): string {
    if (!params) return prefix;
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}:${params[key]}`)
      .join('|');
    return `${prefix}:${sortedParams}`;
  }

  set<T>(key: string, data: T, config: CacheConfig = {}): void {
    const { ttlSeconds = 300, tags = [] } = config;
    
    this.cache.set(key, {
      data,
      expires: Date.now() + (ttlSeconds * 1000)
    });

    // Associate with tags
    tags.forEach(tag => {
      if (!this.tagMap.has(tag)) {
        this.tagMap.set(tag, new Set());
      }
      this.tagMap.get(tag)!.add(key);
    });
  }

  get<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    if (Date.now() > cached.expires) {
      this.delete(key);
      return null;
    }
    
    return cached.data as T;
  }

  delete(key: string): void {
    this.cache.delete(key);
    
    // Remove from tag associations
    Array.from(this.tagMap.entries()).forEach(([tag, keys]) => {
      keys.delete(key);
      if (keys.size === 0) {
        this.tagMap.delete(tag);
      }
    });
  }

  invalidateByPrefix(prefix: string): void {
    const keys = Array.from(this.cache.keys());
    for (const key of keys) {
      if (key.startsWith(prefix)) {
        this.delete(key);
      }
    }
  }

  invalidateByTag(tag: string): void {
    const keys = this.tagMap.get(tag);
    if (keys) {
      Array.from(keys).forEach(key => {
        this.cache.delete(key);
      });
      this.tagMap.delete(tag);
    }
  }

  invalidateByTags(tags: string[]): void {
    tags.forEach(tag => this.invalidateByTag(tag));
  }

  clear(): void {
    this.cache.clear();
    this.tagMap.clear();
  }

  getStats(): { size: number; tags: number } {
    return {
      size: this.cache.size,
      tags: this.tagMap.size
    };
  }
}

// Cache invalidation mappings for different resources
export const CACHE_TAGS = {
  // Homepage data
  HOMEPAGE: 'homepage',
  SLIDERS: 'sliders',
  SERVICES: 'services',
  ABOUT_US: 'about_us',
  CLIENTS: 'clients',
  PROJECTS: 'projects',
  TESTIMONIALS: 'testimonials',
  TEAM_MEMBERS: 'team_members',
  BLOG_POSTS: 'blog_posts',
  FEATURES: 'features',
  CTA_SECTIONS: 'cta_sections',
  
  // Navigation
  NAVIGATION: 'navigation',
  TOP_BAR_ITEMS: 'top_bar_items',
  HEADER_ITEMS: 'header_items',
  
  // Footer
  FOOTER: 'footer',
  FOOTER_SECTIONS: 'footer_sections',
  FOOTER_LINKS: 'footer_links',
  
  // Settings
  SITE_SETTINGS: 'site_settings',
  SEO_METADATA: 'seo_metadata',
  
  // Icons (affects multiple resources)
  ICONS: 'icons',
  
  // Child resources
  CLIENT_IMAGES: 'client_images',
  PROJECT_IMAGES: 'project_images',
  TEAM_SOCIAL_LINKS: 'team_social_links',
  CTA_BENEFITS: 'cta_benefits',
} as const;

// Resource to cache tags mapping
export const RESOURCE_CACHE_TAGS: Record<string, string[]> = {
  // Core resources
  sliders: [CACHE_TAGS.SLIDERS, CACHE_TAGS.HOMEPAGE],
  services: [CACHE_TAGS.SERVICES, CACHE_TAGS.HOMEPAGE],
  about_us: [CACHE_TAGS.ABOUT_US, CACHE_TAGS.HOMEPAGE],
  clients: [CACHE_TAGS.CLIENTS, CACHE_TAGS.HOMEPAGE],
  projects: [CACHE_TAGS.PROJECTS, CACHE_TAGS.HOMEPAGE],
  testimonials: [CACHE_TAGS.TESTIMONIALS, CACHE_TAGS.HOMEPAGE],
  team_members: [CACHE_TAGS.TEAM_MEMBERS, CACHE_TAGS.HOMEPAGE],
  blog_posts: [CACHE_TAGS.BLOG_POSTS, CACHE_TAGS.HOMEPAGE],
  features: [CACHE_TAGS.FEATURES, CACHE_TAGS.HOMEPAGE],
  cta_sections: [CACHE_TAGS.CTA_SECTIONS, CACHE_TAGS.HOMEPAGE],
  
  // Navigation
  top_bar_items: [CACHE_TAGS.TOP_BAR_ITEMS, CACHE_TAGS.NAVIGATION],
  header_items: [CACHE_TAGS.HEADER_ITEMS, CACHE_TAGS.NAVIGATION],
  
  // Footer
  footer_sections: [CACHE_TAGS.FOOTER_SECTIONS, CACHE_TAGS.FOOTER],
  footer_links: [CACHE_TAGS.FOOTER_LINKS, CACHE_TAGS.FOOTER],
  
  // Settings
  site_settings: [CACHE_TAGS.SITE_SETTINGS, CACHE_TAGS.HOMEPAGE, CACHE_TAGS.NAVIGATION, CACHE_TAGS.FOOTER],
  seo_metadata: [CACHE_TAGS.SEO_METADATA],
  
  // Icons (affects multiple resources)
  icons: [CACHE_TAGS.ICONS, CACHE_TAGS.SERVICES, CACHE_TAGS.FOOTER_LINKS, CACHE_TAGS.TOP_BAR_ITEMS, CACHE_TAGS.TEAM_SOCIAL_LINKS],
  
  // Child resources
  client_images: [CACHE_TAGS.CLIENT_IMAGES, CACHE_TAGS.CLIENTS, CACHE_TAGS.HOMEPAGE],
  project_images: [CACHE_TAGS.PROJECT_IMAGES, CACHE_TAGS.PROJECTS, CACHE_TAGS.HOMEPAGE],
  team_member_social_links: [CACHE_TAGS.TEAM_SOCIAL_LINKS, CACHE_TAGS.TEAM_MEMBERS, CACHE_TAGS.HOMEPAGE],
  cta_benefits: [CACHE_TAGS.CTA_BENEFITS, CACHE_TAGS.CTA_SECTIONS, CACHE_TAGS.HOMEPAGE],
};

// Helper function to invalidate cache for a resource
export function invalidateCacheForResource(resourceName: string): void {
  const cacheManager = CacheManager.getInstance();
  const tags = RESOURCE_CACHE_TAGS[resourceName] || [];
  
  if (tags.length > 0) {
    cacheManager.invalidateByTags(tags);
    console.log(`Cache invalidated for resource: ${resourceName}, tags: ${tags.join(', ')}`);
  }
}

// Export singleton instance
export const cacheManager = CacheManager.getInstance();