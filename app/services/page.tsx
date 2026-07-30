import { Metadata } from 'next';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { ServicesHeroSection } from '@/components/sections/services-hero-section';
import { ServicesGridSection } from '@/components/sections/services-grid-section';
import { ServicesFeaturesSection } from '@/components/sections/services-features-section';
import { ServicesProcessSection } from '@/components/sections/services-process-section';
import { ServicesCTASection } from '@/components/sections/services-cta-section';
import { JsonLd } from '@/components/seo/json-ld';
import { fetchServicesPageData } from '@/lib/page-data-service';
import { getSEOMetadata } from '@/lib/data-access';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const seoData = await getSEOMetadata('services');
    const { siteSettings } = await fetchServicesPageData();

    const defaultTitle = 'Certified Translation Services in Dubai, UAE | JUSOR';
    const defaultDescription = 'Explore JUSOR\'s certified translation, legal translation, and interpretation services in Dubai, UAE — accurate, court-accepted, and government-approved translations for individuals and businesses.';

    return {
      title: seoData?.meta_title || defaultTitle,
      description: seoData?.meta_description || defaultDescription,
      keywords: (seoData as any)?.meta_keywords || [
        'certified translation dubai',
        'legal translation services uae',
        'professional translation services',
        'document translation dubai',
        'interpretation services dubai',
        'jusor translation'
      ],
      openGraph: {
        title: seoData?.og_title || seoData?.meta_title || defaultTitle,
        description: seoData?.og_description || seoData?.meta_description || defaultDescription,
        url: seoData?.canonical_url || `${process.env.NEXT_PUBLIC_SITE_URL}/services`,
        type: 'website',
        locale: siteSettings.site_locale || 'en_US',
        siteName: siteSettings.company_name || 'JUSOR Translation Services',
        images: [{
          url: seoData?.og_image || siteSettings.og_image || '/og-image-services.jpg',
          width: 1200,
          height: 630,
          alt: 'JUSOR Translation Services - Certified Translation & Interpretation',
        }],
      },
      twitter: {
        card: 'summary_large_image',
        title: seoData?.og_title || seoData?.meta_title || defaultTitle,
        description: seoData?.og_description || seoData?.meta_description || defaultDescription,
        images: [seoData?.og_image || siteSettings.og_image || '/og-image-services.jpg'],
      },
      alternates: {
        canonical: seoData?.canonical_url || `${process.env.NEXT_PUBLIC_SITE_URL}/services`,
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
    console.error('Error generating services page metadata:', error);
    return {
      title: 'Certified Translation Services in Dubai, UAE | JUSOR',
      description: 'Explore JUSOR\'s certified translation, legal translation, and interpretation services in Dubai, UAE.',
    };
  }
}

export default async function ServicesPage() {
  const { services, categories, siteSettings, footerData, navigationData, features } = await fetchServicesPageData();

  // Generate structured data for services
  const servicesSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Professional Services',
    description: 'Comprehensive range of professional services',
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/services`,
    numberOfItems: services.length,
    itemListElement: services.map((service, index) => ({
      '@type': 'Service',
      position: index + 1,
      name: service.title,
      description: service.content,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/services/${service.slug}`,
      provider: {
        '@type': 'Organization',
        name: siteSettings.company_name || 'JUSOR Translation Services',
        url: process.env.NEXT_PUBLIC_SITE_URL,
      },
    })),
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteSettings.company_name || 'JUSOR Translation Services',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    logo: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
    description: siteSettings.site_description || 'Certified translation, legal translation, and interpretation services in Dubai, UAE',
    address: siteSettings.company_address ? {
      '@type': 'PostalAddress',
      streetAddress: siteSettings.company_address,
      addressLocality: siteSettings.company_city,
      addressCountry: siteSettings.company_country,
    } : undefined,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: siteSettings.company_phone,
      contactType: 'customer service',
      email: siteSettings.company_email,
    },
    sameAs: [
      siteSettings.social_facebook,
      siteSettings.social_twitter,
      siteSettings.social_linkedin,
      siteSettings.social_instagram,
    ].filter(Boolean),
  };

  return (
    <>
      <JsonLd data={servicesSchema} />
      <JsonLd data={organizationSchema} />
      
      <Navigation siteSettings={siteSettings} navigationData={navigationData} />
      
      <main id="main-content">
        <ServicesHeroSection 
          services={services}
          siteSettings={siteSettings}
        />
        
        <ServicesGridSection 
          services={services}
          categories={categories}
          siteSettings={siteSettings}
          enableFiltering={true}
        />
        
        <ServicesFeaturesSection 
          features={features}
          siteSettings={siteSettings}
        />
        
        <ServicesProcessSection 
          siteSettings={siteSettings}
        />
        
        <ServicesCTASection 
          siteSettings={siteSettings}
        />
      </main>
      
      <Footer footerData={footerData} siteSettings={siteSettings} />
    </>
  );
}