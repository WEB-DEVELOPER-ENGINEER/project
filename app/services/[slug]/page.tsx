import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { ServiceDetailHero } from '@/components/sections/service-detail-hero';
import { ServiceDetailContent } from '@/components/sections/service-detail-content';
import { ServiceDetailFeatures } from '@/components/sections/service-detail-features';
import { ServiceDetailSpecifications } from '@/components/sections/service-detail-specifications';
import { ServiceDetailFAQ } from '@/components/sections/service-detail-faq';
import { ServiceDetailCTA } from '@/components/sections/service-detail-cta';
import { RelatedServicesSection } from '@/components/sections/related-services-section';
import { RelatedBlogPosts } from '@/components/sections/related-blog-posts';
import { JsonLd } from '@/components/seo/json-ld';
import { getServiceBySlug, getServices, getSEOMetadata, getBlogPosts } from '@/lib/data-access';
import { fetchLayoutData } from '@/lib/page-data-fetcher';

interface ServicePageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  try {
    const services = await getServices();
    return services.map((service) => ({
      slug: service.slug,
    }));
  } catch (error) {
    console.error('Error generating static params for services:', error);
    return [];
  }
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  try {
    const service = await getServiceBySlug(params.slug);
    if (!service) {
      return {
        title: 'Service Not Found',
        description: 'The requested service could not be found.',
      };
    }

    const seoData = await getSEOMetadata(`service-${params.slug}`).catch(() => null);
    const { siteSettings } = await fetchLayoutData();

    // Clean site settings URL
    const cleanedBaseUrl = (siteSettings.site_url || process.env.NEXT_PUBLIC_SITE_URL || 'https://jusortrans.com')
      .replace('jusor-translation.com', 'jusortrans.com')
      .replace(/\/$/, '');

    const title = seoData?.meta_title || `${service.title} | Professional Services`;
    const description = seoData?.meta_description || 
      service.content.replace(/<[^>]*>/g, '').substring(0, 160) || 
      `Learn about our ${service.title} service and how it can benefit your business.`;

    const rawUrl = seoData?.canonical_url || `${cleanedBaseUrl}/services/${params.slug}`;
    const canonicalUrl = rawUrl.replace('jusor-translation.com', 'jusortrans.com');
    const ogImage = (seoData?.og_image || siteSettings.og_image || '/og-image-service.jpg')
      .replace('jusor-translation.com', 'jusortrans.com');

    return {
      title,
      description,
      keywords: seoData?.meta_keywords || [
        service.title.toLowerCase(),
        'professional services',
        'business solutions',
        'expert consulting'
      ],
      openGraph: {
        title: seoData?.og_title || title,
        description: seoData?.og_description || description,
        url: canonicalUrl,
        type: 'article',
        locale: siteSettings.site_locale || 'en_US',
        siteName: siteSettings.company_name || 'JUSOR Translation Services',
        images: [{
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${service.title} - Professional Service`,
        }],
      },
      twitter: {
        card: 'summary_large_image',
        title: seoData?.og_title || title,
        description: seoData?.og_description || description,
        images: [ogImage],
      },
      alternates: {
        canonical: canonicalUrl,
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
    };
  } catch (error) {
    console.error('Error generating service page metadata:', error);
    return {
      title: 'Professional Service',
      description: 'Learn about our professional services and how they can benefit your business.',
    };
  }
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  try {
    const [service, allServices, layoutData, blogPostsResponse] = await Promise.all([
      getServiceBySlug(params.slug),
      getServices(),
      fetchLayoutData(),
      getBlogPosts(1, 200).catch(() => ({ data: [] as any[] }))
    ]);

    if (!service) {
      notFound();
    }

    // Real blog articles whose related_services (see scripts/seed-articles.ts)
    // reference this service's slug.
    const relatedArticles = blogPostsResponse.data
      .filter((post: any) => Array.isArray(post.related_services) && post.related_services.includes(service.slug))
      .slice(0, 3);

    const { siteSettings, navigationData } = layoutData;
    const footerData = (layoutData as any).footerData || {};
    
    // Get related services (exclude current service), preferring the same
    // category first rather than an arbitrary set of other services.
    const otherServices = allServices.filter(s => s.id !== service.id);
    const sameCategory = otherServices.filter(s => s.category_id != null && s.category_id === service.category_id);
    const rest = otherServices.filter(s => !(s.category_id != null && s.category_id === service.category_id));
    const relatedServices = [...sameCategory, ...rest].slice(0, 3);

    const cleanedBaseUrl = (siteSettings.site_url || 'https://jusortrans.com')
      .replace('jusor-translation.com', 'jusortrans.com')
      .replace(/\/$/, '');

    // Generate structured data
    const serviceSchema = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: service.title,
      description: service.content.replace(/<[^>]*>/g, ''),
      url: `${cleanedBaseUrl}/services/${params.slug}`,
      provider: {
        '@type': 'Organization',
        name: siteSettings.company_name || 'JUSOR Translation Services',
        url: cleanedBaseUrl,
        logo: `${cleanedBaseUrl}/logo.png`,
      },
      areaServed: {
        '@type': 'Place',
        name: 'Worldwide',
      },
      availableChannel: {
        '@type': 'ServiceChannel',
        serviceUrl: `${cleanedBaseUrl}/contact`,
        servicePhone: siteSettings.company_phone,
        servicePostalAddress: siteSettings.company_address ? {
          '@type': 'PostalAddress',
          streetAddress: siteSettings.company_address,
          addressLocality: siteSettings.company_city,
          addressCountry: siteSettings.company_country,
        } : undefined,
      },
    };

    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${cleanedBaseUrl}/`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Services',
          item: `${cleanedBaseUrl}/services`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: service.title,
          item: `${cleanedBaseUrl}/services/${params.slug}`,
        },
      ],
    };

    const faqItems = Array.isArray(service.faq_items) ? service.faq_items : [];
    const faqSchema = faqItems.length > 0 ? {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer.replace(/<[^>]*>/g, ''),
        },
      })),
    } : null;

    return (
      <>
        <JsonLd data={serviceSchema} />
        <JsonLd data={breadcrumbSchema} />
        {faqSchema && <JsonLd data={faqSchema} />}
        <Navigation siteSettings={siteSettings} navigationData={navigationData} />
        
        <main id="main-content">
          <ServiceDetailHero 
            service={service}
            siteSettings={siteSettings}
          />
          
          <ServiceDetailContent 
            service={service}
            siteSettings={siteSettings}
          />
          
          <ServiceDetailFeatures 
            service={service}
            siteSettings={siteSettings}
          />
          
          <ServiceDetailSpecifications 
            service={service}
            siteSettings={siteSettings}
          />
          
          <ServiceDetailFAQ 
            service={service}
            siteSettings={siteSettings}
          />
          
          {relatedServices.length > 0 && (
            <RelatedServicesSection
              services={relatedServices}
              currentService={service}
              siteSettings={siteSettings}
            />
          )}

          {relatedArticles.length > 0 && (
            <RelatedBlogPosts
              posts={relatedArticles}
              siteSettings={siteSettings}
            />
          )}

          <ServiceDetailCTA
            service={service}
            siteSettings={siteSettings}
          />
        </main>
        
        <Footer footerData={footerData} siteSettings={siteSettings} />
      </>
    );
  } catch (error) {
    console.error('Error rendering service detail page:', error);
    notFound();
  }
}