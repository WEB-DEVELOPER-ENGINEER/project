import { Metadata } from 'next';
import { HeroSectionOptimized } from '@/components/sections/hero-section-optimized';
import { ServicesSection } from '@/components/sections/services-section';
import { AboutSection } from '@/components/sections/about-section';
import { TestimonialsSection } from '@/components/sections/testimonials-section';
import { TeamSection } from '@/components/sections/team-section';
import { ProjectsSection } from '@/components/sections/projects-section';
import { BlogSection } from '@/components/sections/blog-section';
import { CTASection } from '@/components/sections/cta-section';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { getSEOMetadata } from '@/lib/data-access';
import { fetchHomepageData } from '@/lib/page-data-fetcher';
import { JsonLd } from '@/components/seo/json-ld';
import { getLocale } from '@/lib/locale-server';

// Avoid build-time prerendering; render dynamically at request time
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  try {
    const locale = getLocale();
    const seoData = await getSEOMetadata('homepage');
    const { siteSettings } = await fetchHomepageData(locale);
    const settings = siteSettings;
    const baseUrl = (settings.site_url || process.env.NEXT_PUBLIC_SITE_URL || 'https://jusortrans.com').replace('jusor-translation.com', 'jusortrans.com').replace(/\/$/, '');

    if (settings.site_url) {
      settings.site_url = settings.site_url.replace('jusor-translation.com', 'jusortrans.com');
    }
    if (settings.og_image && typeof settings.og_image === 'string') {
      settings.og_image = settings.og_image.replace('jusor-translation.com', 'jusortrans.com');
    }
    if (settings.twitter_image && typeof settings.twitter_image === 'string') {
      settings.twitter_image = settings.twitter_image.replace('jusor-translation.com', 'jusortrans.com');
    }

    const rawUrl = seoData?.canonical_url || settings.site_url || process.env.NEXT_PUBLIC_SITE_URL || 'https://jusortrans.com';
    const canonicalUrl = rawUrl.replace('jusor-translation.com', 'jusortrans.com');

    return {
      title: seoData?.meta_title || settings.site_title || 'Professional Translation Services',
      description: seoData?.meta_description || settings.site_description || 'Expert translation services for legal, technical, and business documents.',
      keywords: settings.site_keywords || [
        'translation services',
        'certified translation',
        'legal translation',
        'technical translation',
        'business translation'
      ],
      openGraph: {
        title: seoData?.og_title || seoData?.meta_title || settings.site_title,
        description: seoData?.og_description || seoData?.meta_description || settings.site_description,
        url: canonicalUrl,
        type: 'website',
        locale: locale === 'ar' ? 'ar_AE' : 'en_US',
        siteName: settings.company_name || 'JUSOR Translation Services',
        images: [{
          url: (seoData?.og_image || settings.og_image || '/og-image-homepage.jpg').replace('jusor-translation.com', 'jusortrans.com'),
          width: 1200,
          height: 630,
          alt: settings.og_image_alt || 'Professional Translation Services',
        }],
      },
      twitter: {
        card: 'summary_large_image',
        title: seoData?.twitter_title || seoData?.meta_title || settings.site_title,
        description: seoData?.twitter_description || seoData?.meta_description || settings.site_description,
        images: [(seoData?.twitter_image || settings.twitter_image || '/twitter-image-homepage.jpg').replace('jusor-translation.com', 'jusortrans.com')],
      },
      alternates: {
        canonical: canonicalUrl,
        languages: {
          en: baseUrl,
          ar: `${baseUrl}/ar`,
          'x-default': baseUrl,
        },
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    // Fallback metadata
    return {
      title: 'Professional Translation Services',
      description: 'Expert translation services for legal, technical, and business documents.',
    };
  }
}

export default async function HomePage() {
  // Fetch homepage data server-side for better SEO and performance
  const locale = getLocale();
  const { homepageData, footerData, navigationData, siteSettings } = await fetchHomepageData(locale);
  const settings = siteSettings;

  if (settings.site_url) {
    settings.site_url = settings.site_url.replace('jusor-translation.com', 'jusortrans.com');
  }
  if (settings.company_logo && typeof settings.company_logo === 'string') {
    settings.company_logo = settings.company_logo.replace('jusor-translation.com', 'jusortrans.com');
  }

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: settings.company_name || 'JUSOR Translation Services',
    url: settings.site_url || 'https://jusortrans.com',
    logo: settings.company_logo || 'https://jusortrans.com/logo.png',
    description: settings.company_description || 'Professional translation services for legal, technical, and business documents',
    address: {
      '@type': 'PostalAddress',
      addressCountry: settings.company_country || 'AE',
      addressLocality: settings.company_city || 'Dubai',
      addressRegion: settings.company_region || 'Dubai',
      streetAddress: settings.company_address,
      postalCode: settings.company_postal_code,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: settings.company_phone || process.env.NEXT_PUBLIC_COMPANY_PHONE,
      email: settings.company_email || process.env.NEXT_PUBLIC_COMPANY_EMAIL,
      contactType: 'customer service',
      availableLanguage: settings.supported_languages || ['English', 'Arabic'],
    },
    sameAs: settings.social_media_links || [
      'https://www.linkedin.com/company/jusor-translation',
      'https://www.facebook.com/jusortranslation',
      'https://twitter.com/jusortranslation',
    ],
    serviceArea: {
      '@type': 'Place',
      name: settings.service_area || 'United Arab Emirates',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: settings.services_catalog_name || 'Translation Services',
      itemListElement: homepageData.services.map((service, index) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service.title,
          description: service.content,
        },
        position: index + 1,
      })),
    },
  };

  return (
    <>
      <JsonLd data={organizationSchema} />
      <Navigation siteSettings={settings} navigationData={navigationData} />
      <main id="main-content">
        <HeroSectionOptimized 
          sliders={homepageData.sliders} 
          siteSettings={settings}
        />
        <ServicesSection 
          services={homepageData.services} 
          siteSettings={settings}
        />
        {homepageData.about_us && (
          <AboutSection 
            aboutUs={homepageData.about_us} 
            siteSettings={settings}
          />
        )}
        <TestimonialsSection 
          testimonials={homepageData.testimonials} 
          siteSettings={settings}
        />
        <TeamSection 
          teamMembers={homepageData.team_members} 
          siteSettings={settings}
        />
        <ProjectsSection 
          projects={homepageData.projects} 
          siteSettings={settings}
        />
        <BlogSection 
          blogs={homepageData.recent_blogs} 
          siteSettings={settings}
        />
        <CTASection 
          ctaSections={homepageData.cta_sections}
          siteSettings={settings}
        />
      </main>
      <Footer footerData={footerData} siteSettings={settings} />
    </>
  );
}