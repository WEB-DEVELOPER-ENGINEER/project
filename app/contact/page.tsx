import { Metadata } from 'next';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { ContactHeroSection } from '@/components/sections/contact-hero-section';
import { ContactFormSection } from '@/components/sections/contact-form-section';
import { ContactInfoSection } from '@/components/sections/contact-info-section';
import { ContactMapSection } from '@/components/sections/contact-map-section';
import { ContactCTASection } from '@/components/sections/contact-cta-section';
import { JsonLd } from '@/components/seo/json-ld';
import { fetchContactPageData } from '@/lib/page-data-service';
import { getSEOMetadata } from '@/lib/data-access';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const [seoData, { siteSettings, contactData }] = await Promise.all([
      getSEOMetadata('contact').catch(() => null),
      fetchContactPageData()
    ]);

    const title = seoData?.meta_title || 'Contact Us | Get in Touch with Our Expert Team';
    const description = seoData?.meta_description || 
      'Contact Jusor Translation Services for professional translation, interpretation, and language solutions. Get a free quote today. Available 24/7 in Dubai, UAE.';

    return {
      title,
      description,
      keywords: (seoData as any)?.meta_keywords || [
        'contact jusor translation',
        'translation services dubai',
        'professional translation contact',
        'language services uae',
        'translation quote',
        'interpretation services',
        'document translation',
        'certified translation dubai',
        'legal translation dubai',
        'medical translation uae',
        'technical translation services',
        'urgent translation dubai',
        'translation company abu hail',
        'multilingual services dubai'
      ],
      openGraph: {
        title: seoData?.og_title || title,
        description: seoData?.og_description || description,
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/contact`,
        type: 'website',
        locale: siteSettings.site_locale || 'en_US',
        siteName: siteSettings.company_name || 'Jusor Translation Services',
        images: [{
          url: seoData?.og_image || siteSettings.og_image || '/og-image-contact.jpg',
          width: 1200,
          height: 630,
          alt: 'Contact Jusor Translation Services - Professional Language Solutions',
        }],
      },
      twitter: {
        card: 'summary_large_image',
        title: seoData?.og_title || title,
        description: seoData?.og_description || description,
        images: [seoData?.twitter_image || siteSettings.twitter_image || '/twitter-image-contact.jpg'],
        creator: '@jusortranslation',
        site: '@jusortranslation',
      },
      alternates: {
        canonical: seoData?.canonical_url || `${process.env.NEXT_PUBLIC_SITE_URL}/contact`,
        languages: {
          'en': `${process.env.NEXT_PUBLIC_SITE_URL}/contact`,
          'ar': `${process.env.NEXT_PUBLIC_SITE_URL}/ar/contact`,
        },
      },
      other: {
        'contact:phone_number': contactData?.phone || '+971 50 324 4329',
        'contact:email': contactData?.email || 'info@jusortrans.com',
        'contact:street_address': contactData?.address || 'Dar Al Wuheida Building - Office No. 319 - Abu Hail - Dubai - UAE',
        'contact:locality': 'Dubai',
        'contact:region': 'Dubai',
        'contact:country_name': 'United Arab Emirates',
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
    console.error('Error generating contact page metadata:', error);
    return {
      title: 'Contact Us | Professional Translation Services',
      description: 'Get in touch with our expert translation team for professional language solutions.',
    };
  }
}

export default async function ContactPage() {
  try {
    const { siteSettings, navigationData, contactData, footerData } = await fetchContactPageData();

    // Generate structured data for contact page
    const contactSchema = {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: 'Contact Us',
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/contact`,
      mainEntity: {
        '@type': 'Organization',
        name: siteSettings.company_name || 'Jusor Translation Services',
        url: process.env.NEXT_PUBLIC_SITE_URL,
        logo: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: contactData.phone || '+971 50 324 4329',
          email: contactData.email || 'info@jusortrans.com',
          contactType: 'customer service',
          areaServed: 'AE',
          availableLanguage: ['en', 'ar'],
        },
        address: {
          '@type': 'PostalAddress',
          streetAddress: contactData.address || 'Dar Al Wuheida Building - Office No. 319 - Abu Hail',
          addressLocality: 'Dubai',
          addressCountry: 'AE',
        },
        sameAs: [
          contactData.instagram_url || 'https://www.instagram.com/Jusor_translation',
          'https://www.linkedin.com/company/jusor-translation',
          'https://www.facebook.com/jusortranslation',
          `${process.env.NEXT_PUBLIC_SITE_URL}/services`,
          `${process.env.NEXT_PUBLIC_SITE_URL}/about`,
          `${process.env.NEXT_PUBLIC_SITE_URL}/blog`
        ],
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
          item: process.env.NEXT_PUBLIC_SITE_URL,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Contact',
          item: `${process.env.NEXT_PUBLIC_SITE_URL}/contact`,
        },
      ],
    };

    // Enhanced JSON-LD for better SEO
    const localBusinessSchema = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': `${process.env.NEXT_PUBLIC_SITE_URL}/#localbusiness`,
      name: siteSettings.company_name || 'Jusor Translation Services',
      alternateName: 'Jusor Translation',
      description: 'Professional translation and interpretation services in Dubai, UAE. Certified translators for legal, medical, technical, and business documents.',
      url: process.env.NEXT_PUBLIC_SITE_URL,
      telephone: contactData.phone || '+971 50 324 4329',
      email: contactData.email || 'info@jusortrans.com',
      priceRange: '$$',
      currenciesAccepted: 'AED, USD, EUR',
      paymentAccepted: 'Cash, Credit Card, Bank Transfer',
      address: {
        '@type': 'PostalAddress',
        streetAddress: contactData.address || 'Dar Al Wuheida Building - Office No. 319 - Abu Hail',
        addressLocality: 'Dubai',
        addressRegion: 'Dubai',
        postalCode: '00000',
        addressCountry: 'AE'
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 25.2854,
        longitude: 55.3397
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
          opens: '09:00',
          closes: '18:00'
        }
      ],
      serviceArea: {
        '@type': 'Place',
        name: 'Dubai, UAE and surrounding areas'
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Translation Services',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Document Translation',
              description: 'Professional translation of legal, medical, technical, and business documents'
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Certified Translation',
              description: 'Official certified translations for government and legal purposes'
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Interpretation Services',
              description: 'Professional interpretation for meetings, conferences, and events'
            }
          }
        ]
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: '127',
        bestRating: '5',
        worstRating: '1'
      }
    };

    return (
      <>
        <JsonLd data={contactSchema} />
        <JsonLd data={breadcrumbSchema} />
        <JsonLd data={localBusinessSchema} />
        <Navigation siteSettings={siteSettings} navigationData={navigationData} />
        
        <main id="main-content">
          <ContactHeroSection 
            contactData={contactData}
            siteSettings={siteSettings}
          />
          
          <ContactFormSection 
            contactData={contactData}
            siteSettings={siteSettings}
          />
          
          <ContactInfoSection 
            contactData={contactData}
            siteSettings={siteSettings}
          />
          
          <ContactMapSection 
            contactData={contactData}
            siteSettings={siteSettings}
          />
          
          <ContactCTASection 
            contactData={contactData}
            siteSettings={siteSettings}
          />
        </main>
        
        <Footer footerData={footerData} siteSettings={siteSettings} />
      </>
    );
  } catch (error) {
    console.error('Error rendering contact page:', error);
    
    // Fallback rendering with minimal data
    const fallbackData = {
      siteSettings: { company_name: 'Jusor Translation Services' },
      navigationData: {},
      footerData: { sections: [], links: [] }, // Proper footer structure
      contactData: {
        email: 'info@jusortrans.com',
        phone: '+971 50 324 4329',
        address: 'Dar Al Wuheida Building - Office No. 319 - Abu Hail - Dubai - United Arab Emirates',
        map_url: 'https://maps.app.goo.gl/kcy1snMZ59b8qwHdA',
        instagram_url: 'https://www.instagram.com/Jusor_translation',
        whatsapp_number: '971503244329',
        whatsapp_message: 'Hello Jusor, I would like to inquire about your services.'
      }
    };

    return (
      <>
        
        <Navigation siteSettings={fallbackData.siteSettings} navigationData={fallbackData.navigationData} />
        
        <main id="main-content">
          <ContactHeroSection 
            contactData={fallbackData.contactData}
            siteSettings={fallbackData.siteSettings}
          />
          
          <ContactFormSection 
            contactData={fallbackData.contactData}
            siteSettings={fallbackData.siteSettings}
          />
          
          <ContactInfoSection 
            contactData={fallbackData.contactData}
            siteSettings={fallbackData.siteSettings}
          />
          
          <ContactMapSection 
            contactData={fallbackData.contactData}
            siteSettings={fallbackData.siteSettings}
          />
          
          <ContactCTASection 
            contactData={fallbackData.contactData}
            siteSettings={fallbackData.siteSettings}
          />
        </main>
        
        <Footer footerData={fallbackData.footerData} siteSettings={fallbackData.siteSettings} />
      </>
    );
  }
}