import { MetadataRoute } from 'next';
import { getServices, getAllProjects, getBlogPosts } from '@/lib/data-access';
import { localizedPath } from '@/lib/locale';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jusortrans.com';

  try {
    // Get all services (both locales), projects, and blog posts (both
    // locales) for dynamic routes.
    const [servicesEn, servicesAr, projects, blogPostsResponse] = await Promise.all([
      getServices(undefined, undefined, 'en'),
      getServices(undefined, undefined, 'ar').catch(() => []),
      getAllProjects().catch(() => []),
      getBlogPosts(1, 1000).catch(() => ({ data: [] as any[] })),
    ]);
    const blogPosts = blogPostsResponse.data;

    // Static routes — English and the real /ar equivalent (see
    // middleware.ts). Body content on about/contact/privacy/projects isn't
    // fully translated yet, but the /ar URL itself genuinely renders
    // (correct lang/dir, translated navigation), so listing it here is
    // accurate; hreflang <link> tags (a stronger "this is the same content"
    // claim) are only added on pages with real per-locale content — see
    // services and blog post pages.
    const staticPaths = ['/', '/about', '/services', '/projects', '/blog', '/contact', '/privacy'];
    const staticRoutes: MetadataRoute.Sitemap = staticPaths.flatMap((path) => [
      {
        url: `${baseUrl}${path}`,
        lastModified: new Date(),
        changeFrequency: path === '/' || path === '/blog' ? 'daily' as const : 'weekly' as const,
        priority: path === '/' ? 1 : 0.7,
      },
      {
        url: `${baseUrl}${localizedPath(path, 'ar')}`,
        lastModified: new Date(),
        changeFrequency: path === '/' || path === '/blog' ? 'daily' as const : 'weekly' as const,
        priority: path === '/' ? 0.9 : 0.6,
      },
    ]);

    // Dynamic service routes (both locales, routed via translation_group)
    const serviceRoutes: MetadataRoute.Sitemap = [
      ...servicesEn.map((service) => ({
        url: `${baseUrl}/services/${service.translation_group || service.slug}`,
        lastModified: new Date(service.updated_at),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      })),
      ...servicesAr.map((service) => ({
        url: `${baseUrl}${localizedPath(`/services/${service.translation_group || service.slug}`, 'ar')}`,
        lastModified: new Date(service.updated_at),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      })),
    ];

    // Dynamic project routes
    const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
      url: `${baseUrl}/projects/${project.slug}`,
      lastModified: new Date(project.updated_at),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

    // Dynamic blog post routes — each post at its own real URL (Arabic
    // posts keep their own real slug, prefixed with /ar for consistency).
    const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post: any) => ({
      url: `${baseUrl}${localizedPath(`/blog/${post.slug}`, post.locale === 'ar' ? 'ar' : 'en')}`,
      lastModified: new Date(post.updated_at || post.published_date || Date.now()),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

    return [...staticRoutes, ...serviceRoutes, ...projectRoutes, ...blogRoutes];
  } catch (error) {
    console.error('Error generating sitemap:', error);

    // Return basic sitemap if there's an error
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${baseUrl}/services`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      },
    ];
  }
}
