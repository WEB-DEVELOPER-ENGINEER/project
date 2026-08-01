import { Metadata } from 'next';
import { getLocale } from '@/lib/locale-server';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { ProjectsHeroSection } from '@/components/sections/projects-hero-section';
import { ProjectsGridSection } from '@/components/sections/projects-grid-section';
import { ProjectsCTASection } from '@/components/sections/projects-cta-section';
import { JsonLd } from '@/components/seo/json-ld';
import { fetchProjectsPageData } from '@/lib/page-data-service';
import { getSEOMetadata } from '@/lib/data-access';
import { siteUrl } from '@/lib/company';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const locale = getLocale();
    const [seoData, { siteSettings }] = await Promise.all([
      getSEOMetadata('projects', undefined, locale).catch(() => null),
      fetchProjectsPageData()
    ]);

    const title = seoData?.meta_title || (locale === 'ar'
      ? 'أعمالنا | نماذج من مشاريع الترجمة الاحترافية'
      : 'Our Projects | Professional Translation Portfolio');
    const description = seoData?.meta_description || (locale === 'ar'
      ? 'اطّلع على نماذج من مشاريع الترجمة التحريرية والفورية التي نفّذتها جسور الكلمات لعملائها في مختلف القطاعات.'
      : 'Explore our portfolio of successful translation and interpretation projects. See how Jusor Translation Services has helped businesses break language barriers across industries.');

    return {
      title,
      description,
      keywords: (seoData as any)?.meta_keywords || [
        'translation projects',
        'interpretation portfolio',
        'jusor translation portfolio',
        'professional translation examples',
        'language services projects',
        'translation case studies',
        'certified translation projects',
        'legal translation portfolio',
        'medical translation projects',
        'technical translation examples',
        'business translation services',
        'multilingual projects dubai',
        'translation company portfolio',
        'interpretation services examples'
      ],
      openGraph: {
        title: seoData?.og_title || title,
        description: seoData?.og_description || description,
        url: `${siteUrl(siteSettings)}/projects`,
        type: 'website',
        locale: siteSettings.site_locale || 'en_US',
        siteName: siteSettings.company_name || 'Jusor Translation Services',
        images: [{
          url: seoData?.og_image || siteSettings.og_image || '/og-image-projects.jpg',
          width: 1200,
          height: 630,
          alt: 'Jusor Translation Services - Professional Translation Projects Portfolio',
        }],
      },
      twitter: {
        card: 'summary_large_image',
        title: seoData?.og_title || title,
        description: seoData?.og_description || description,
        images: [seoData?.twitter_image || siteSettings.twitter_image || '/twitter-image-projects.jpg'],
        creator: '@jusortranslation',
        site: '@jusortranslation',
      },
      alternates: {
        canonical: seoData?.canonical_url || `${siteUrl(siteSettings)}/projects`,
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
    console.error('Error generating projects page metadata:', error);
    return {
      title: 'Our Projects | Professional Translation Portfolio',
      description: 'Explore our portfolio of successful translation and interpretation projects across various industries and languages.',
    };
  }
}

export default async function ProjectsPage() {
  try {
    const { projects, totalProjects, siteSettings, navigationData, footerData } = await fetchProjectsPageData();

    // Generate structured data for projects
    const projectsSchema = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Translation Projects Portfolio',
      description: 'Portfolio of professional translation and interpretation projects',
      url: `${siteUrl(siteSettings)}/projects`,
      numberOfItems: projects.length,
      itemListElement: projects.map((project, index) => ({
        '@type': 'CreativeWork',
        position: index + 1,
        name: project.title,
        description: project.description,
        url: `${siteUrl(siteSettings)}/projects/${project.slug}`,
        dateCreated: project.created_at,
        creator: {
          '@type': 'Organization',
          name: siteSettings.company_name || 'Jusor Translation Services',
          url: siteUrl(siteSettings),
        },
        ...(project.images?.[0] && {
          image: {
            '@type': 'ImageObject',
            url: project.images[0].image_url,
            description: project.images[0].alt_text || project.title,
          }
        })
      })),
    };

    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: siteUrl(siteSettings),
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Projects',
          item: `${siteUrl(siteSettings)}/projects`,
        },
      ],
    };

    const organizationSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': `${siteUrl(siteSettings)}/#organization`,
      name: siteSettings.company_name || 'Jusor Translation Services',
      url: siteUrl(siteSettings),
      logo: `${siteUrl(siteSettings)}/logo.png`,
      description: 'Professional translation and interpretation services with a proven track record of successful projects',
      address: siteSettings.company_address ? {
        '@type': 'PostalAddress',
        streetAddress: siteSettings.company_address,
        addressLocality: siteSettings.company_city || 'Dubai',
        addressCountry: siteSettings.company_country || 'AE',
      } : undefined,
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: siteSettings.company_phone || '+971503244329',
        contactType: 'customer service',
        email: siteSettings.company_email || 'info@jusortrans.com',
        areaServed: 'AE',
        availableLanguage: ['en', 'ar'],
      },
      sameAs: [
        siteSettings.social_facebook,
        siteSettings.social_twitter,
        siteSettings.social_linkedin,
        siteSettings.instagram_url || 'https://www.instagram.com/Jusor_translation',
      ].filter(Boolean),
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Translation Services Portfolio',
        itemListElement: projects.slice(0, 5).map(project => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: project.title,
            description: project.description,
          }
        }))
      }
    };

    return (
      <>
        <JsonLd data={projectsSchema} />
        <JsonLd data={breadcrumbSchema} />
        <JsonLd data={organizationSchema} />
        
        <Navigation siteSettings={siteSettings} navigationData={navigationData} />
        
        <main id="main-content">
          <ProjectsHeroSection 
            projects={projects}
            totalProjects={totalProjects}
            siteSettings={siteSettings}
          />
          
          <ProjectsGridSection 
            projects={projects}
            siteSettings={siteSettings}
          />
          
          <ProjectsCTASection 
            siteSettings={siteSettings}
          />
        </main>
        
        <Footer footerData={footerData} siteSettings={siteSettings} />
      </>
    );
  } catch (error) {
    console.error('Error rendering projects page:', error);
    
    // Fallback rendering with minimal data
    const fallbackData = {
      projects: [],
      totalProjects: 0,
      siteSettings: { company_name: 'Jusor Translation Services' },
      navigationData: { top_bar_items: [], header_items: [] },
      footerData: { sections: [], links: [] }
    };

    return (
      <>
        
        <Navigation siteSettings={fallbackData.siteSettings} navigationData={fallbackData.navigationData} />
        
        <main id="main-content">
          <ProjectsHeroSection 
            projects={fallbackData.projects}
            totalProjects={fallbackData.totalProjects}
            siteSettings={fallbackData.siteSettings}
          />
          
          <ProjectsGridSection 
            projects={fallbackData.projects}
            siteSettings={fallbackData.siteSettings}
          />
          
          <ProjectsCTASection 
            siteSettings={fallbackData.siteSettings}
          />
        </main>
        
        <Footer footerData={fallbackData.footerData} siteSettings={fallbackData.siteSettings} />
      </>
    );
  }
}
