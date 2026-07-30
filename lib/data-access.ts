/**
 * Data Access Layer for JUSOR Translation Services
 * Production-ready with caching, error handling, and performance optimization
 */

import { executeQuery } from './database';
import { cacheManager, CACHE_TAGS } from './cache-manager';
import {
  HomepageData,
  Slider,
  Service,
  AboutUs,
  Client,
  Project,
  Testimonial,
  TeamMember,
  BlogPost,
  BlogAuthor,
  BlogCategory,
  BlogContentSection,
  CompanyMetric,
  ContactSubmission,
  SEOMetadata,
  PaginatedResponse,
  ApiResponse,
  NavigationData,
  TopBarItem,
  HeaderItem,
  QuoteRequest,
  DashboardStats,
  SearchResult,
  SearchFilters
} from './types';

import { englishArticles, arabicArticles } from './blog-data';

function getCacheKey(prefix: string, params?: Record<string, any>): string {
  if (!params) return prefix;
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}:${params[key]}`)
    .join('|');
  return `${prefix}:${sortedParams}`;
}

// Homepage Data Access
export async function getHomepageData(locale: string = 'en'): Promise<HomepageData> {
  const cacheKey = `homepage:data:${locale}`;
  const cached = cacheManager.get<HomepageData>(cacheKey);
  if (cached) return cached;

  try {
    // Fetch all homepage data with optimized queries
    const results = await Promise.allSettled([
      executeQuery(`
        SELECT * FROM sliders
        WHERE is_active = true
        ORDER BY sort_order ASC, created_at DESC
      `),
      executeQuery(`
        SELECT s.*, i.name as icon_name, i.icon_class, i.image_url as icon_image_url
        FROM services s
        LEFT JOIN icons i ON s.icon_id = i.id
        WHERE s.is_active = true AND s.locale = $1
        ORDER BY s.sort_order ASC, s.created_at DESC
      `, [locale]),
      executeQuery(`
        SELECT * FROM about_us
        WHERE is_active = true AND locale = $1
        ORDER BY created_at DESC
        LIMIT 1
      `, [locale]),
      executeQuery(`
        SELECT c.*, 
               json_agg(
                 json_build_object(
                   'id', ci.id,
                   'image_url', ci.image_url,
                   'alt_text', ci.alt_text,
                   'sort_order', ci.sort_order
                 ) ORDER BY ci.sort_order ASC
               ) as images
        FROM clients c
        LEFT JOIN client_images ci ON c.id = ci.client_id
        WHERE c.is_active = true
        GROUP BY c.id
        ORDER BY c.sort_order ASC, c.created_at DESC
      `),
      executeQuery(`
        SELECT p.*,
               json_agg(
                 json_build_object(
                   'id', pi.id,
                   'image_url', pi.image_url,
                   'description', pi.description,
                   'alt_text', pi.alt_text,
                   'sort_order', pi.sort_order
                 ) ORDER BY pi.sort_order ASC
               ) as images
        FROM projects p
        LEFT JOIN project_images pi ON p.id = pi.project_id
        WHERE p.is_active = true
        GROUP BY p.id
        ORDER BY p.sort_order ASC, p.created_at DESC
      `),
      executeQuery(`
        SELECT * FROM testimonials 
        WHERE is_active = true 
        ORDER BY sort_order ASC, created_at DESC
      `),
      executeQuery(`
        SELECT tm.*,
               json_agg(
                 json_build_object(
                   'id', tmsl.id,
                   'url', tmsl.url,
                   'icon_name', i.name,
                   'icon_class', i.icon_class,
                   'sort_order', tmsl.sort_order
                 ) ORDER BY tmsl.sort_order ASC
               ) FILTER (WHERE tmsl.id IS NOT NULL) as social_links
        FROM team_members tm
        LEFT JOIN team_member_social_links tmsl ON tm.id = tmsl.team_member_id
        LEFT JOIN icons i ON tmsl.icon_id = i.id
        WHERE tm.is_active = true
        GROUP BY tm.id
        ORDER BY tm.sort_order ASC, tm.created_at DESC
      `),
      executeQuery(`
        SELECT * FROM blog_posts 
        WHERE is_published = true 
        ORDER BY published_date DESC 
        LIMIT 3
      `),
      executeQuery(`
        SELECT * FROM features 
        WHERE is_active = true 
        ORDER BY category ASC, sort_order ASC
      `),
      executeQuery(`
        SELECT cs.*, 
               json_agg(
                 json_build_object(
                   'id', cb.id,
                   'benefit_text', cb.benefit_text,
                   'icon_name', cb.icon_name,
                   'sort_order', cb.sort_order
                 ) ORDER BY cb.sort_order ASC
               ) FILTER (WHERE cb.id IS NOT NULL) as benefits
        FROM cta_sections cs
        LEFT JOIN cta_benefits cb ON cs.id = cb.cta_section_id
        WHERE cs.is_active = true AND cs.section_location = 'homepage'
        GROUP BY cs.id
        ORDER BY cs.sort_order ASC
      `),
      executeQuery(`
        SELECT setting_key, setting_value, setting_type 
        FROM site_settings 
        WHERE is_active = true
      `)
    ]);

    const [
      slidersResult,
      servicesResult,
      aboutUsResult,
      clientsResult,
      projectsResult,
      testimonialsResult,
      teamMembersResult,
      recentBlogsResult,
      featuresResult,
      ctaSectionsResult,
      siteSettingsResult
    ] = results;

    const getRows = (result: PromiseSettledResult<any>, queryName: string) => {
      if (result.status === 'fulfilled') {
        return result.value.rows;
      }
      console.error(`Error fetching ${queryName}:`, result.reason);
      return [];
    };

    const sliders = getRows(slidersResult, 'sliders');
    const services = getRows(servicesResult, 'services');
    const about_us = getRows(aboutUsResult, 'about_us')[0] || null;
    const clients = getRows(clientsResult, 'clients');
    const projects = getRows(projectsResult, 'projects');
    const testimonials = getRows(testimonialsResult, 'testimonials');
    const team_members = getRows(teamMembersResult, 'team_members');
    const recent_blogs = getRows(recentBlogsResult, 'recent_blogs');
    const features = getRows(featuresResult, 'features');
    const cta_sections = getRows(ctaSectionsResult, 'cta_sections');
    const siteSettingsRows = getRows(siteSettingsResult, 'site_settings');

    // Process site settings into key-value pairs
    const siteSettings: Record<string, any> = {};
    siteSettingsRows.forEach((row: any) => {
      let value = row.setting_value;
      if (row.setting_type === 'json') {
        try {
          value = JSON.parse(row.setting_value);
        } catch (e) {
          console.warn(`Failed to parse JSON setting: ${row.setting_key}`);
        }
      } else if (row.setting_type === 'boolean') {
        value = row.setting_value === 'true';
      } else if (row.setting_type === 'number') {
        value = parseFloat(row.setting_value);
      }
      siteSettings[row.setting_key] = value;
    });

    const homepageData: HomepageData = {
      sliders,
      services: services.map((row: any) => ({
        ...row,
        icon: row.icon_name ? {
          id: row.icon_id,
          name: row.icon_name,
          icon_class: row.icon_class,
          image_url: row.icon_image_url,
          created_at: '',
          updated_at: ''
        } : undefined
      })),
      about_us,
      clients,
      projects,
      testimonials,
      team_members,
      recent_blogs,
      features,
      cta_sections,
      site_settings: siteSettings
    };

    cacheManager.set(cacheKey, homepageData, { 
      ttlSeconds: 600, 
      tags: [CACHE_TAGS.HOMEPAGE] 
    });
    return homepageData;
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    throw new Error('Failed to fetch homepage data');
  }
}

// Navigation Data Access
export async function getNavigationData(): Promise<NavigationData> {
  const cacheKey = 'navigation:data';
  const cached = cacheManager.get<NavigationData>(cacheKey);
  if (cached) return cached;

  try {
    const [topBarResult, headerResult] = await Promise.all([
      executeQuery(`
        SELECT tb.*, i.name as icon_name, i.icon_class, i.image_url as icon_image_url
        FROM top_bar_items tb
        LEFT JOIN icons i ON tb.icon_id = i.id
        WHERE tb.is_active = true
        ORDER BY tb.sort_order ASC
      `),
      executeQuery(`
        SELECT * FROM header_items 
        WHERE is_active = true 
        ORDER BY sort_order ASC
      `)
    ]);

    const navigationData: NavigationData = {
      top_bar_items: topBarResult.rows.map(row => ({
        ...row,
        icon: {
          id: row.icon_id,
          name: row.icon_name,
          icon_class: row.icon_class,
          image_url: row.icon_image_url,
          created_at: '',
          updated_at: ''
        }
      })),
      header_items: headerResult.rows
    };

    cacheManager.set(cacheKey, navigationData, { 
      ttlSeconds: 1800, 
      tags: [CACHE_TAGS.NAVIGATION] 
    });
    return navigationData;
  } catch (error) {
    console.error('Error fetching navigation data:', error);
    throw new Error('Failed to fetch navigation data');
  }
}

// Footer Data Access
export async function getFooterData(): Promise<any> {
  const cacheKey = 'footer:data';
  const cached = cacheManager.get<any>(cacheKey);
  if (cached) return cached;

  try {
    const [sectionsResult, linksResult] = await Promise.all([
      executeQuery(`
        SELECT * FROM footer_sections 
        WHERE is_active = true 
        ORDER BY sort_order ASC
      `),
      executeQuery(`
        SELECT fl.*, fs.section_type, i.name as icon_name, i.icon_class, i.image_url as icon_image_url
        FROM footer_links fl
        JOIN footer_sections fs ON fl.footer_section_id = fs.id
        LEFT JOIN icons i ON fl.icon_id = i.id
        WHERE fl.is_active = true AND fs.is_active = true
        ORDER BY fs.sort_order ASC, fl.sort_order ASC
      `)
    ]);

    const footerData = {
      sections: sectionsResult.rows,
      links: linksResult.rows.map(row => ({
        ...row,
        icon: row.icon_name ? {
          id: row.icon_id,
          name: row.icon_name,
          icon_class: row.icon_class,
          image_url: row.icon_image_url
        } : null
      }))
    };

    cacheManager.set(cacheKey, footerData, { 
      ttlSeconds: 1800, 
      tags: [CACHE_TAGS.FOOTER] 
    });
    return footerData;
  } catch (error) {
    console.error('Error fetching footer data:', error);
    throw new Error('Failed to fetch footer data');
  }
}

// Features Data Access
export async function getFeatures(category?: string): Promise<any[]> {
  const cacheKey = getCacheKey('features', { category });
  const cached = cacheManager.get<any[]>(cacheKey);
  if (cached) return cached;

  try {
    const query = category 
      ? `SELECT * FROM features WHERE is_active = true AND category = $1 ORDER BY sort_order ASC`
      : `SELECT * FROM features WHERE is_active = true ORDER BY category ASC, sort_order ASC`;
    
    const params = category ? [category] : [];
    const result = await executeQuery(query, params);

    cacheManager.set(cacheKey, result.rows, { 
      ttlSeconds: 600, 
      tags: [CACHE_TAGS.FEATURES] 
    });
    return result.rows;
  } catch (error) {
    console.error('Error fetching features:', error);
    throw new Error('Failed to fetch features');
  }
}

// CTA Sections Data Access
export async function getCTASections(location?: string): Promise<any[]> {
  const cacheKey = getCacheKey('cta_sections', { location });
  const cached = cacheManager.get<any[]>(cacheKey);
  if (cached) return cached;

  try {
    const query = location 
      ? `SELECT cs.*, 
               json_agg(
                 json_build_object(
                   'id', cb.id,
                   'benefit_text', cb.benefit_text,
                   'icon_name', cb.icon_name,
                   'sort_order', cb.sort_order
                 ) ORDER BY cb.sort_order ASC
               ) FILTER (WHERE cb.id IS NOT NULL) as benefits
        FROM cta_sections cs
        LEFT JOIN cta_benefits cb ON cs.id = cb.cta_section_id
        WHERE cs.is_active = true AND cs.section_location = $1
        GROUP BY cs.id
        ORDER BY cs.sort_order ASC`
      : `SELECT cs.*, 
               json_agg(
                 json_build_object(
                   'id', cb.id,
                   'benefit_text', cb.benefit_text,
                   'icon_name', cb.icon_name,
                   'sort_order', cb.sort_order
                 ) ORDER BY cb.sort_order ASC
               ) FILTER (WHERE cb.id IS NOT NULL) as benefits
        FROM cta_sections cs
        LEFT JOIN cta_benefits cb ON cs.id = cb.cta_section_id
        WHERE cs.is_active = true
        GROUP BY cs.id
        ORDER BY cs.sort_order ASC`;
    
    const params = location ? [location] : [];
    const result = await executeQuery(query, params);

    cacheManager.set(cacheKey, result.rows, { 
      ttlSeconds: 600, 
      tags: [CACHE_TAGS.CTA_SECTIONS] 
    });
    return result.rows;
  } catch (error) {
    console.error('Error fetching CTA sections:', error);
    throw new Error('Failed to fetch CTA sections');
  }
}

// Site Settings Data Access
export async function getSiteSettings(): Promise<Record<string, any>> {
  const cacheKey = 'site_settings';
  const cached = cacheManager.get<Record<string, any>>(cacheKey);
  if (cached) return cached;

  try {
    const result = await executeQuery(`
      SELECT setting_key, setting_value, setting_type 
      FROM site_settings 
      WHERE is_active = true
    `);

    const settings: Record<string, any> = {};
    result.rows.forEach(row => {
      let value = row.setting_value;
      if (row.setting_type === 'json') {
        try {
          value = JSON.parse(row.setting_value);
        } catch (e) {
          console.warn(`Failed to parse JSON setting: ${row.setting_key}`);
        }
      } else if (row.setting_type === 'boolean') {
        value = row.setting_value === 'true';
      } else if (row.setting_type === 'number') {
        value = parseFloat(row.setting_value);
      }
      settings[row.setting_key] = value;
    });

    cacheManager.set(cacheKey, settings, { 
      ttlSeconds: 1800, 
      tags: [CACHE_TAGS.SITE_SETTINGS] 
    });
    return settings;
  } catch (error) {
    console.error('Error fetching site settings:', error);
    // Return empty settings object if database is not initialized
    return {};
  }
}

// Services Data Access
export async function getServices(categoryId?: number, categorySlug?: string, locale: string = 'en'): Promise<Service[]> {
  let cacheKey = `services:all:${locale}`;
  if (categoryId) cacheKey = `services:category:${categoryId}:${locale}`;
  if (categorySlug) cacheKey = `services:category_slug:${categorySlug}:${locale}`;

  const cached = cacheManager.get<Service[]>(cacheKey);
  if (cached) return cached;

  try {
    let query = `
      SELECT s.*, i.name as icon_name, i.icon_class, i.image_url as icon_image_url,
             sc.name as category_name, sc.slug as category_slug, sc.color as category_color
      FROM services s
      LEFT JOIN icons i ON s.icon_id = i.id
      LEFT JOIN service_categories sc ON s.category_id = sc.id
      WHERE s.is_active = true AND s.locale = $1
    `;

    const queryParams: any[] = [locale];
    let paramIndex = 2;

    if (categoryId) {
      query += ` AND s.category_id = $${paramIndex}`;
      queryParams.push(categoryId);
      paramIndex++;
    } else if (categorySlug) {
      query += ` AND sc.slug = $${paramIndex}`;
      queryParams.push(categorySlug);
      paramIndex++;
    }

    query += ` ORDER BY s.sort_order ASC, s.created_at DESC`;
    
    const result = await executeQuery(query, queryParams);

    const services = result.rows.map(row => ({
      ...row,
      icon: row.icon_name ? {
        id: row.icon_id,
        name: row.icon_name,
        icon_class: row.icon_class,
        image_url: row.icon_image_url,
        created_at: '',
        updated_at: ''
      } : undefined,
      category: row.category_name ? {
        id: row.category_id,
        name: row.category_name,
        slug: row.category_slug,
        color: row.category_color
      } : undefined
    }));

    cacheManager.set(cacheKey, services, { 
      ttlSeconds: 600, 
      tags: [CACHE_TAGS.SERVICES] 
    });
    return services;
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
}

// Get service categories for filtering
export async function getServiceCategories(): Promise<any[]> {
  const cacheKey = 'service_categories:active';
  const cached = cacheManager.get<any[]>(cacheKey);
  if (cached) return cached;

  try {
    const result = await executeQuery(`
      SELECT * FROM service_categories 
      WHERE is_active = true 
      ORDER BY sort_order ASC, name ASC
    `);

    const categories = result.rows;
    
    cacheManager.set(cacheKey, categories, { 
      ttlSeconds: 3600, 
      tags: ['service_categories'] 
    });
    return categories;
  } catch (error) {
    console.error('Error fetching service categories:', error);
    return [];
  }
}

// `identifier` is matched against translation_group first (the shared,
// English-based routing key used so /ar/services/legal-translation and
// /services/legal-translation are distinct URLs serving the matching
// locale's row — see lib/database.ts), falling back to a literal slug match
// for services that don't have a translation_group set.
export async function getServiceBySlug(identifier: string, locale: string = 'en'): Promise<Service | null> {
  const cacheKey = `service:slug:${identifier}:${locale}`;
  const cached = cacheManager.get<Service>(cacheKey);
  if (cached) return cached;

  try {
    const result = await executeQuery(`
      SELECT s.*, i.name as icon_name, i.icon_class, i.image_url as icon_image_url
      FROM services s
      LEFT JOIN icons i ON s.icon_id = i.id
      WHERE s.is_active = true AND s.locale = $2
        AND (s.translation_group = $1 OR s.slug = $1)
      ORDER BY (s.translation_group = $1) DESC
      LIMIT 1
    `, [identifier, locale]);

    if (result.rows.length === 0) {
      return null;
    }

    const service = {
      ...result.rows[0],
      icon: result.rows[0].icon_name ? {
        id: result.rows[0].icon_id,
        name: result.rows[0].icon_name,
        icon_class: result.rows[0].icon_class,
        image_url: result.rows[0].icon_image_url,
        created_at: '',
        updated_at: ''
      } : undefined
    };

    cacheManager.set(cacheKey, service, {
      ttlSeconds: 600,
      tags: [CACHE_TAGS.SERVICES]
    });
    return service;
  } catch (error) {
    console.error('Error fetching service by slug:', error);
    return null;
  }
}

// Finds the other-locale version of a service for hreflang alternates
// (see translation_group column — see lib/database.ts).
export async function getServiceTranslation(translationGroup: string, locale: string): Promise<Service | null> {
  if (!translationGroup) return null;
  try {
    const result = await executeQuery(
      `SELECT * FROM services WHERE translation_group = $1 AND locale = $2 AND is_active = true LIMIT 1`,
      [translationGroup, locale]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error fetching service translation:', error);
    return null;
  }
}

// Blog Data Access
export async function getBlogPosts(page: number = 1, limit: number = 6, locale?: string): Promise<PaginatedResponse<BlogPost>> {
  const offset = (page - 1) * limit;
  const cacheKey = getCacheKey('blog:posts', { page, limit, locale });
  const cached = cacheManager.get<PaginatedResponse<BlogPost>>(cacheKey);
  if (cached) return cached;

  try {
    const localeFilter = locale ? 'AND locale = $3' : '';
    const localeParams = locale ? [locale] : [];
    const [postsResult, countResult] = await Promise.all([
      executeQuery(`
        SELECT * FROM blog_posts
        WHERE is_published = true ${localeFilter}
        ORDER BY published_date DESC
        LIMIT $1 OFFSET $2
      `, [limit, offset, ...localeParams]),
      executeQuery(`
        SELECT COUNT(*) as total
        FROM blog_posts
        WHERE is_published = true ${locale ? 'AND locale = $1' : ''}
      `, localeParams)
    ]);

    const total = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(total / limit);

    const response: PaginatedResponse<BlogPost> = {
      success: true,
      data: postsResult.rows,
      pagination: {
        page,
        limit,
        total,
        total_pages: totalPages,
        has_next: page < totalPages,
        has_prev: page > 1
      }
    };

    cacheManager.set(cacheKey, response, { 
      ttlSeconds: 300, 
      tags: [CACHE_TAGS.BLOG_POSTS] 
    });
    return response;
  } catch (error) {
    console.error('Error fetching blog posts, returning loaded docx dataset:', error);
    const allArticles = [...englishArticles, ...arabicArticles] as unknown as BlogPost[];
    const offset = (page - 1) * limit;
    const paginated = allArticles.slice(offset, offset + limit);
    const total = allArticles.length;
    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      data: paginated,
      pagination: {
        page,
        limit,
        total,
        total_pages: totalPages,
        has_next: page < totalPages,
        has_prev: page > 1
      }
    };
  }
}

// Finds the other-locale version of a blog post for hreflang alternates
// (only set for the article pairs that were confidently topic-matched —
// see scripts/link-blog-translations.ts). Returns null if this article has
// no counterpart in the other language yet.
export async function getBlogPostTranslation(translationGroup: string | null | undefined, locale: string): Promise<BlogPost | null> {
  if (!translationGroup) return null;
  try {
    const result = await executeQuery(
      `SELECT * FROM blog_posts WHERE translation_group = $1 AND locale = $2 AND is_published = true LIMIT 1`,
      [translationGroup, locale]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error fetching blog post translation:', error);
    return null;
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const decodedSlug = decodeURIComponent(slug);
  const cacheKey = getCacheKey('blog:post', { slug: decodedSlug });
  const cached = cacheManager.get<BlogPost>(cacheKey);
  if (cached) return cached;

  try {
    const result = await executeQuery(`
      SELECT bp.*, 
             ba.name as author_name, ba.slug as author_slug, ba.title as author_title, 
             ba.bio as author_bio, ba.image_url as author_image, ba.email as author_email,
             ba.expertise as author_expertise, ba.achievements as author_achievements, 
             ba.social_links as author_social_links,
             bc.name as category_name, bc.slug as category_slug, bc.description as category_description,
             bc.color as category_color, bc.icon_name as category_icon
      FROM blog_posts bp
      LEFT JOIN blog_authors ba ON bp.author_id = ba.id
      LEFT JOIN blog_categories bc ON bp.category_id = bc.id
      WHERE (bp.slug = $1 OR bp.slug = $2) AND bp.is_published = true
      LIMIT 1
    `, [slug, decodedSlug]);

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    const post: BlogPost = {
      ...row,
      blog_author: row.author_name ? {
        id: row.author_id,
        name: row.author_name,
        slug: row.author_slug,
        title: row.author_title,
        bio: row.author_bio,
        image_url: row.author_image,
        email: row.author_email,
        expertise: row.author_expertise || [],
        achievements: row.author_achievements || [],
        social_links: row.author_social_links || {},
        is_active: true,
        sort_order: 0,
        created_at: '',
        updated_at: ''
      } : undefined,
      blog_category: row.category_name ? {
        id: row.category_id,
        name: row.category_name,
        slug: row.category_slug,
        description: row.category_description,
        color: row.category_color,
        icon_name: row.category_icon,
        is_active: true,
        sort_order: 0,
        created_at: '',
        updated_at: ''
      } : undefined
    };

    if (post) {
      cacheManager.set(cacheKey, post, { 
        ttlSeconds: 600, 
        tags: [CACHE_TAGS.BLOG_POSTS] 
      });
    }
    return post;
  } catch (error) {
    console.error('Error fetching blog post, searching in loaded docx dataset:', error);
    const allArticles = [...englishArticles, ...arabicArticles];
    const found = allArticles.find(a => a.slug === slug || a.slug === decodedSlug || decodeURIComponent(a.slug) === decodedSlug);
    return (found as unknown as BlogPost) || null;
  }
}

export async function getRelatedBlogPosts(currentSlug: string, limit: number = 3): Promise<BlogPost[]> {
  const decodedSlug = decodeURIComponent(currentSlug);
  const cacheKey = getCacheKey('blog:related', { currentSlug: decodedSlug, limit });
  const cached = cacheManager.get<BlogPost[]>(cacheKey);
  if (cached) return cached;

  try {
    // Look up the current post's category so we can rank same-category posts first
    const currentPostResult = await executeQuery(
      `SELECT category_id, tags FROM blog_posts WHERE slug = $1 OR slug = $2 LIMIT 1`,
      [currentSlug, decodedSlug]
    );
    const currentCategoryId = currentPostResult.rows[0]?.category_id ?? null;

    const result = await executeQuery(`
      SELECT bp.*,
             ba.name as author_name, ba.slug as author_slug, ba.title as author_title,
             bc.name as category_name, bc.slug as category_slug, bc.color as category_color
      FROM blog_posts bp
      LEFT JOIN blog_authors ba ON bp.author_id = ba.id
      LEFT JOIN blog_categories bc ON bp.category_id = bc.id
      WHERE bp.slug != $1 AND bp.slug != $2 AND bp.is_published = true
      ORDER BY
        CASE WHEN $4::int IS NOT NULL AND bp.category_id = $4::int THEN 0 ELSE 1 END,
        bp.published_date DESC, bp.created_at DESC
      LIMIT $3
    `, [currentSlug, decodedSlug, limit, currentCategoryId]);

    const posts = result.rows.map(row => ({
      ...row,
      blog_author: row.author_name ? {
        id: row.author_id,
        name: row.author_name,
        slug: row.author_slug,
        title: row.author_title,
        is_active: true,
        sort_order: 0,
        created_at: '',
        updated_at: ''
      } : undefined,
      blog_category: row.category_name ? {
        id: row.category_id,
        name: row.category_name,
        slug: row.category_slug,
        color: row.category_color,
        is_active: true,
        sort_order: 0,
        created_at: '',
        updated_at: ''
      } : undefined
    }));

    cacheManager.set(cacheKey, posts, { 
      ttlSeconds: 600, 
      tags: [CACHE_TAGS.BLOG_POSTS] 
    });
    return posts;
  } catch (error) {
    console.error('Error fetching related blog posts:', error);
    return [];
  }
}

// Blog Authors Data Access
export async function getBlogAuthors(): Promise<BlogAuthor[]> {
  const cacheKey = 'blog:authors:all';
  const cached = cacheManager.get<BlogAuthor[]>(cacheKey);
  if (cached) return cached;

  try {
    const result = await executeQuery(`
      SELECT * FROM blog_authors 
      WHERE is_active = true 
      ORDER BY sort_order ASC, name ASC
    `);

    cacheManager.set(cacheKey, result.rows, { 
      ttlSeconds: 1800, 
      tags: ['blog_authors'] 
    });
    return result.rows;
  } catch (error) {
    console.error('Error fetching blog authors:', error);
    return [];
  }
}

export async function getBlogAuthorBySlug(slug: string): Promise<BlogAuthor | null> {
  const cacheKey = `blog:author:${slug}`;
  const cached = cacheManager.get<BlogAuthor>(cacheKey);
  if (cached) return cached;

  try {
    const result = await executeQuery(`
      SELECT * FROM blog_authors 
      WHERE slug = $1 AND is_active = true
    `, [slug]);

    const author = result.rows[0] || null;
    if (author) {
      cacheManager.set(cacheKey, author, { 
        ttlSeconds: 1800, 
        tags: ['blog_authors'] 
      });
    }
    return author;
  } catch (error) {
    console.error('Error fetching blog author:', error);
    return null;
  }
}

// Blog Categories Data Access
export async function getBlogCategories(): Promise<BlogCategory[]> {
  const cacheKey = 'blog:categories:all';
  const cached = cacheManager.get<BlogCategory[]>(cacheKey);
  if (cached) return cached;

  try {
    const result = await executeQuery(`
      SELECT * FROM blog_categories 
      WHERE is_active = true 
      ORDER BY sort_order ASC, name ASC
    `);

    cacheManager.set(cacheKey, result.rows, { 
      ttlSeconds: 1800, 
      tags: ['blog_categories'] 
    });
    return result.rows;
  } catch (error) {
    console.error('Error fetching blog categories:', error);
    return [];
  }
}

// Blog Content Sections Data Access
export async function getBlogContentSections(): Promise<BlogContentSection[]> {
  const cacheKey = 'blog:content_sections:all';
  const cached = cacheManager.get<BlogContentSection[]>(cacheKey);
  if (cached) return cached;

  try {
    const result = await executeQuery(`
      SELECT * FROM blog_content_sections 
      WHERE is_active = true 
      ORDER BY sort_order ASC
    `);

    cacheManager.set(cacheKey, result.rows, { 
      ttlSeconds: 600, 
      tags: ['blog_content_sections'] 
    });
    return result.rows;
  } catch (error) {
    console.error('Error fetching blog content sections:', error);
    return [];
  }
}

export async function getBlogContentSectionByKey(sectionKey: string): Promise<BlogContentSection | null> {
  const cacheKey = `blog:content_section:${sectionKey}`;
  const cached = cacheManager.get<BlogContentSection>(cacheKey);
  if (cached) return cached;

  try {
    const result = await executeQuery(`
      SELECT * FROM blog_content_sections 
      WHERE section_key = $1 AND is_active = true
    `, [sectionKey]);

    const section = result.rows[0] || null;
    if (section) {
      cacheManager.set(cacheKey, section, { 
        ttlSeconds: 600, 
        tags: ['blog_content_sections'] 
      });
    }
    return section;
  } catch (error) {
    console.error('Error fetching blog content section:', error);
    return null;
  }
}

// Company Metrics Data Access
export async function getCompanyMetrics(category?: string, locale: string = 'en'): Promise<CompanyMetric[]> {
  const cacheKey = getCacheKey('company:metrics', { category, locale });
  const cached = cacheManager.get<CompanyMetric[]>(cacheKey);
  if (cached) return cached;

  try {
    const query = category
      ? `SELECT * FROM company_metrics WHERE is_active = true AND locale = $2 AND category = $1 ORDER BY display_order ASC`
      : `SELECT * FROM company_metrics WHERE is_active = true AND locale = $1 ORDER BY display_order ASC`;

    const params = category ? [category, locale] : [locale];
    const result = await executeQuery(query, params);

    cacheManager.set(cacheKey, result.rows, { 
      ttlSeconds: 1800, 
      tags: ['company_metrics'] 
    });
    return result.rows;
  } catch (error) {
    console.error('Error fetching company metrics:', error);
    return [];
  }
}

export async function getCompanyMetricByKey(metricKey: string): Promise<CompanyMetric | null> {
  const cacheKey = `company:metric:${metricKey}`;
  const cached = cacheManager.get<CompanyMetric>(cacheKey);
  if (cached) return cached;

  try {
    const result = await executeQuery(`
      SELECT * FROM company_metrics 
      WHERE metric_key = $1 AND is_active = true
    `, [metricKey]);

    const metric = result.rows[0] || null;
    if (metric) {
      cacheManager.set(cacheKey, metric, { 
        ttlSeconds: 1800, 
        tags: ['company_metrics'] 
      });
    }
    return metric;
  } catch (error) {
    console.error('Error fetching company metric:', error);
    return null;
  }
}


// Contact Form Submission
export async function submitContactForm(data: ContactSubmission): Promise<ApiResponse<ContactSubmission>> {
  try {
    const result = await executeQuery(`
      INSERT INTO contact_submissions (
        name, email, subject, message, phone, service_type,
        utm_source, utm_medium, utm_campaign, utm_term, utm_content,
        ip_address, user_agent
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `, [
      data.name,
      data.email,
      data.subject,
      data.message,
      data.phone,
      data.service_type,
      data.utm_source,
      data.utm_medium,
      data.utm_campaign,
      data.utm_term,
      data.utm_content,
      data.ip_address,
      data.user_agent
    ]);

    return {
      success: true,
      data: result.rows[0],
      message: 'Contact form submitted successfully'
    };
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return {
      success: false,
      error: 'Failed to submit contact form'
    };
  }
}


// SEO Metadata Access
export async function getSEOMetadata(pageType: string, pageId?: number): Promise<SEOMetadata | null> {
  const cacheKey = getCacheKey('seo:metadata', { pageType, pageId });
  const cached = cacheManager.get<SEOMetadata>(cacheKey);
  if (cached) return cached;

  try {
    const result = await executeQuery(`
      SELECT * FROM seo_metadata 
      WHERE page_type = $1 AND ($2::integer IS NULL OR page_id = $2)
      ORDER BY created_at DESC
      LIMIT 1
    `, [pageType, pageId]);

    const metadata = result.rows[0] || null;
    if (metadata) {
      cacheManager.set(cacheKey, metadata, { 
        ttlSeconds: 1800, 
        tags: [CACHE_TAGS.SEO_METADATA] 
      });
    }
    return metadata;
  } catch (error) {
    console.error('Error fetching SEO metadata:', error);
    return null;
  }
}

// Search functionality
export async function searchContent(filters: SearchFilters): Promise<SearchResult<any>> {
  try {
    const { query, category, limit = 10, offset = 0 } = filters;
    
    let searchQuery = '';
    let params: any[] = [];
    let paramIndex = 1;

    if (category === 'blog' || !category) {
      searchQuery = `
        SELECT 'blog' as type, id, title, description, slug, published_date as date
        FROM blog_posts 
        WHERE is_published = true
        ${query ? `AND (title ILIKE $${paramIndex} OR description ILIKE $${paramIndex++})` : ''}
        ORDER BY published_date DESC
      `;
      if (query) params.push(`%${query}%`);
    }

    if (category === 'service' || !category) {
      if (searchQuery) searchQuery += ' UNION ALL ';
      searchQuery += `
        SELECT 'service' as type, id, title, content as description, slug, created_at as date
        FROM services 
        WHERE is_active = true
        ${query ? `AND (title ILIKE $${paramIndex} OR content ILIKE $${paramIndex++})` : ''}
        ORDER BY created_at DESC
      `;
      if (query) params.push(`%${query}%`);
    }


    searchQuery = `
      SELECT * FROM (${searchQuery}) as search_results
      ORDER BY date DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex}
    `;
    params.push(limit, offset);

    const result = await executeQuery(searchQuery, params);

    // Get total count
    let countQuery = searchQuery.replace(/LIMIT.*$/, '').replace(/SELECT \*/, 'SELECT COUNT(*)');
    const countParams = params.slice(0, -2); // Remove limit and offset
    const countResult = await executeQuery(`SELECT COUNT(*) as total FROM (${countQuery}) as count_results`, countParams);

    return {
      items: result.rows,
      total: parseInt(countResult.rows[0].total),
      query: query || '',
      filters
    };
  } catch (error) {
    console.error('Error searching content:', error);
    return {
      items: [],
      total: 0,
      query: filters.query || '',
      filters
    };
  }
}

// Analytics tracking
export async function trackEvent(eventData: {
  event_name: string;
  event_category?: string;
  event_label?: string;
  event_value?: number;
  page_url?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  user_id?: string;
  session_id?: string;
  ip_address?: string;
  user_agent?: string;
}): Promise<void> {
  try {
    await executeQuery(`
      INSERT INTO analytics_events (
        event_name, event_category, event_label, event_value,
        page_url, referrer, utm_source, utm_medium, utm_campaign,
        utm_term, utm_content, user_id, session_id, ip_address, user_agent
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
    `, [
      eventData.event_name,
      eventData.event_category,
      eventData.event_label,
      eventData.event_value,
      eventData.page_url,
      eventData.referrer,
      eventData.utm_source,
      eventData.utm_medium,
      eventData.utm_campaign,
      eventData.utm_term,
      eventData.utm_content,
      eventData.user_id,
      eventData.session_id,
      eventData.ip_address,
      eventData.user_agent
    ]);
  } catch (error) {
    console.error('Error tracking event:', error);
    // Don't throw error for analytics - fail silently
  }
}

// Dashboard statistics (for admin)
export async function getDashboardStats(): Promise<DashboardStats> {
  const cacheKey = 'dashboard:stats';
  const cached = cacheManager.get<DashboardStats>(cacheKey);
  if (cached) return cached;

  try {
    const [
      contactsResult,
      quotesResult,
      newContactsResult,
      servicesResult
    ] = await Promise.all([
      executeQuery('SELECT COUNT(*) as total FROM contact_submissions'),
      executeQuery('SELECT COUNT(*) as total FROM contact_submissions WHERE service_type IS NOT NULL'),
      executeQuery("SELECT COUNT(*) as total FROM contact_submissions WHERE status = 'new'"),
      executeQuery(`
        SELECT service_type, COUNT(*) as count 
        FROM contact_submissions 
        WHERE service_type IS NOT NULL 
        GROUP BY service_type 
        ORDER BY count DESC 
        LIMIT 5
      `)
    ]);

    const stats: DashboardStats = {
      total_contacts: parseInt(contactsResult.rows[0].total),
      total_applications: 0,
      total_quotes: parseInt(quotesResult.rows[0].total),
      pending_applications: 0,
      new_contacts: parseInt(newContactsResult.rows[0].total),
      monthly_growth: 0, // Calculate based on date ranges
      popular_services: servicesResult.rows.map(row => ({
        service: row.service_type,
        count: parseInt(row.count)
      }))
    };

    cacheManager.set(cacheKey, stats, { 
      ttlSeconds: 300, 
      tags: ['dashboard'] 
    });
    return stats;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw new Error('Failed to fetch dashboard statistics');
  }
}

// Projects Data Access
export async function getProjects(page: number = 1, limit: number = 12): Promise<PaginatedResponse<Project>> {
  const offset = (page - 1) * limit;
  const cacheKey = getCacheKey('projects:paginated', { page, limit });
  const cached = cacheManager.get<PaginatedResponse<Project>>(cacheKey);
  if (cached) return cached;

  try {
    const [projectsResult, countResult] = await Promise.all([
      executeQuery(`
        SELECT p.*,
               json_agg(
                 json_build_object(
                   'id', pi.id,
                   'image_url', pi.image_url,
                   'description', pi.description,
                   'alt_text', pi.alt_text,
                   'sort_order', pi.sort_order
                 ) ORDER BY pi.sort_order ASC
               ) FILTER (WHERE pi.id IS NOT NULL) as images
        FROM projects p
        LEFT JOIN project_images pi ON p.id = pi.project_id
        WHERE p.is_active = true
        GROUP BY p.id
        ORDER BY p.sort_order ASC, p.created_at DESC
        LIMIT $1 OFFSET $2
      `, [limit, offset]),
      executeQuery(`
        SELECT COUNT(*) as total 
        FROM projects 
        WHERE is_active = true
      `)
    ]);

    const total = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(total / limit);

    const response: PaginatedResponse<Project> = {
      success: true,
      data: projectsResult.rows,
      pagination: {
        page,
        limit,
        total,
        total_pages: totalPages,
        has_next: page < totalPages,
        has_prev: page > 1
      }
    };

    cacheManager.set(cacheKey, response, { 
      ttlSeconds: 600, 
      tags: [CACHE_TAGS.PROJECTS] 
    });
    return response;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return {
      success: false,
      data: [],
      pagination: {
        page: 1,
        limit,
        total: 0,
        total_pages: 0,
        has_next: false,
        has_prev: false
      },
      error: 'Failed to fetch projects'
    };
  }
}

export async function getAllProjects(): Promise<Project[]> {
  const cacheKey = 'projects:all';
  const cached = cacheManager.get<Project[]>(cacheKey);
  if (cached) return cached;

  try {
    const result = await executeQuery(`
      SELECT p.*,
             json_agg(
               json_build_object(
                 'id', pi.id,
                 'image_url', pi.image_url,
                 'description', pi.description,
                 'alt_text', pi.alt_text,
                 'sort_order', pi.sort_order
               ) ORDER BY pi.sort_order ASC
             ) FILTER (WHERE pi.id IS NOT NULL) as images
      FROM projects p
      LEFT JOIN project_images pi ON p.id = pi.project_id
      WHERE p.is_active = true
      GROUP BY p.id
      ORDER BY p.sort_order ASC, p.created_at DESC
    `);

    cacheManager.set(cacheKey, result.rows, { 
      ttlSeconds: 600, 
      tags: [CACHE_TAGS.PROJECTS] 
    });
    return result.rows;
  } catch (error) {
    console.error('Error fetching all projects:', error);
    return [];
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const cacheKey = `project:slug:${slug}`;
  const cached = cacheManager.get<Project>(cacheKey);
  if (cached) return cached;

  try {
    const result = await executeQuery(`
      SELECT p.*,
             json_agg(
               json_build_object(
                 'id', pi.id,
                 'image_url', pi.image_url,
                 'description', pi.description,
                 'alt_text', pi.alt_text,
                 'sort_order', pi.sort_order
               ) ORDER BY pi.sort_order ASC
             ) FILTER (WHERE pi.id IS NOT NULL) as images
      FROM projects p
      LEFT JOIN project_images pi ON p.id = pi.project_id
      WHERE p.slug = $1 AND p.is_active = true
      GROUP BY p.id
    `, [slug]);

    if (result.rows.length === 0) {
      return null;
    }

    const project = result.rows[0];
    cacheManager.set(cacheKey, project, { 
      ttlSeconds: 600, 
      tags: [CACHE_TAGS.PROJECTS] 
    });
    return project;
  } catch (error) {
    console.error('Error fetching project by slug:', error);
    return null;
  }
}

export async function getFeaturedProjects(limit: number = 6): Promise<Project[]> {
  const cacheKey = getCacheKey('projects:featured', { limit });
  const cached = cacheManager.get<Project[]>(cacheKey);
  if (cached) return cached;

  try {
    const result = await executeQuery(`
      SELECT p.*,
             json_agg(
               json_build_object(
                 'id', pi.id,
                 'image_url', pi.image_url,
                 'description', pi.description,
                 'alt_text', pi.alt_text,
                 'sort_order', pi.sort_order
               ) ORDER BY pi.sort_order ASC
             ) FILTER (WHERE pi.id IS NOT NULL) as images
      FROM projects p
      LEFT JOIN project_images pi ON p.id = pi.project_id
      WHERE p.is_active = true
      GROUP BY p.id
      ORDER BY p.sort_order ASC, p.created_at DESC
      LIMIT $1
    `, [limit]);

    cacheManager.set(cacheKey, result.rows, { 
      ttlSeconds: 600, 
      tags: [CACHE_TAGS.PROJECTS] 
    });
    return result.rows;
  } catch (error) {
    console.error('Error fetching featured projects:', error);
    return [];
  }
}

// Cache management - use cacheManager instead
export function clearCache(pattern?: string): void {
  if (pattern) {
    cacheManager.invalidateByPrefix(pattern);
  } else {
    cacheManager.clear();
  }
}

export function getCacheStats(): { size: number; tags: number } {
  return cacheManager.getStats();
}