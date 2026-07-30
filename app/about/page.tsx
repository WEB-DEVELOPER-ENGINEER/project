import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { AboutHeroEnhanced } from '@/components/sections/about-hero-enhanced';
import { AboutMissionEnhanced } from '@/components/sections/about-mission-enhanced';
import { AboutTimelineEnhanced } from '@/components/sections/about-timeline-enhanced';
import { AboutTeam } from '@/components/sections/about-team';
import { AboutStats } from '@/components/sections/about-stats';
import { AboutValuesEnhanced } from '@/components/sections/about-values-enhanced';
import { AboutCTA } from '@/components/sections/about-cta';
import { JsonLd } from '@/components/seo/json-ld';
import { getHomepageData, getSiteSettings, getCompanyMetrics } from '@/lib/data-access';
import { fetchStaticPageData } from '@/lib/page-data-fetcher';
import { getLocale } from '@/lib/locale-server';
import { localizedPath } from '@/lib/locale';

export const revalidate = 3600; // ISR: Revalidate every hour

export async function generateMetadata(): Promise<Metadata> {
  try {
    const locale = getLocale();
    const [homepageData, siteSettings] = await Promise.all([
      getHomepageData(locale),
      getSiteSettings()
    ]);

    const aboutData = homepageData.about_us;
    const baseUrl = (siteSettings?.site_url || 'https://jusortrans.com').replace(/\/$/, '');

    const title = aboutData?.meta_title || `About ${siteSettings?.company_name || 'JUSOR'} | Professional Translation Services`;
    const description = aboutData?.meta_description || aboutData?.description ||
      `Learn about ${siteSettings?.company_name || 'JUSOR'}, a leading provider of professional translation and localization services. Discover our mission, values, and expert team.`;

    const canonicalUrl = `${baseUrl}${localizedPath('/about', locale)}`;
    const ogImage = aboutData?.image_url || `${baseUrl}/og-about.jpg`;

    return {
      title,
      description,
      keywords: [
        'about us',
        'translation company',
        'localization services',
        'professional translators',
        'language services',
        'translation team',
        siteSettings?.company_name || 'JUSOR'
      ],
      authors: [{ name: siteSettings?.company_name || 'JUSOR' }],
      creator: siteSettings?.company_name || 'JUSOR',
      publisher: siteSettings?.company_name || 'JUSOR',
      alternates: {
        canonical: canonicalUrl,
        languages: {
          en: `${baseUrl}/about`,
          ar: `${baseUrl}/ar/about`,
          'x-default': `${baseUrl}/about`,
        },
      },
      openGraph: {
        type: 'website',
        locale: locale === 'ar' ? 'ar_AE' : 'en_US',
        url: canonicalUrl,
        title: title,
        description: description,
        siteName: siteSettings?.company_name || 'JUSOR',
        images: [{
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `About ${siteSettings?.company_name || 'JUSOR'} - Professional Translation Services`,
        }],
      },
      twitter: {
        card: 'summary_large_image',
        title: title,
        description: description,
        creator: siteSettings?.twitter_creator,
        images: [ogImage],
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
    console.error('Error generating metadata for about page:', error);
    return {
      title: 'About Us | Professional Translation Services',
      description: 'Learn about our professional translation and localization services, our mission, values, and expert team.',
    };
  }
}

export default async function AboutPage() {
  try {
    const locale = getLocale();
    const [homepageData, layoutData, companyMetrics] = await Promise.all([
      getHomepageData(locale),
      fetchStaticPageData('about'),
      getCompanyMetrics(undefined, locale)
    ]);

    const teamMembers = homepageData.team_members;

    // Fall back to baseline content instead of 404ing the whole page when the
    // about_us record can't be read (e.g. a transient DB outage) — a hard
    // notFound() here would tell Google/crawlers the page doesn't exist.
    const companyName = layoutData.siteSettings.company_name || 'JUSOR Translation Services';
    const aboutData = homepageData.about_us || (locale === 'ar' ? {
      id: 0,
      title: `عن ${companyName}`,
      description: `${companyName} مكتب ترجمة معتمد في دبي، الإمارات العربية المتحدة، يقدم خدمات الترجمة القانونية والتقنية والتجارية والترجمة الفورية.`,
      is_active: true,
      created_at: '',
      updated_at: '',
    } : {
      id: 0,
      title: `About ${companyName}`,
      description: `${companyName} is a certified translation office in Dubai, UAE, providing legal, technical, and business translation and interpretation services.`,
      is_active: true,
      created_at: '',
      updated_at: '',
    });

    // Generate structured data for the about page
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "name": `About ${layoutData.siteSettings.company_name || 'JUSOR'}`,
      "description": aboutData.description,
      "url": `${layoutData.siteSettings.site_url}/about`,
      "mainEntity": {
        "@type": "Organization",
        "name": layoutData.siteSettings.company_name || "JUSOR",
        "description": aboutData.description,
        "url": layoutData.siteSettings.site_url,
        "logo": layoutData.siteSettings.company_logo,
        "foundingDate": layoutData.siteSettings.founding_date,
        "address": {
          "@type": "PostalAddress",
          "addressCountry": layoutData.siteSettings.country,
          "addressLocality": layoutData.siteSettings.city,
          "addressRegion": layoutData.siteSettings.state,
          "postalCode": layoutData.siteSettings.postal_code,
          "streetAddress": layoutData.siteSettings.address
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": layoutData.siteSettings.phone,
          "email": layoutData.siteSettings.email,
          "contactType": "customer service"
        },
        "sameAs": [
          layoutData.siteSettings.linkedin_url,
          layoutData.siteSettings.twitter_url,
          layoutData.siteSettings.facebook_url
        ].filter(Boolean),
        "employee": teamMembers.map(member => ({
          "@type": "Person",
          "name": member.name,
          "jobTitle": member.job_title,
          "description": member.bio,
          "image": member.image_url,
          "worksFor": {
            "@type": "Organization",
            "name": layoutData.siteSettings.company_name || "JUSOR"
          }
        }))
      }
    };

    return (
      <>
        <JsonLd data={structuredData} />

        <div className="min-h-screen flex flex-col">
          <Navigation 
            navigationData={layoutData.navigationData}
            siteSettings={layoutData.siteSettings}
          />

          <main id="main-content" className="flex-1" role="main">
            {/* Hero Section */}
            <AboutHeroEnhanced 
              aboutData={aboutData}
              siteSettings={layoutData.siteSettings}
              companyMetrics={companyMetrics}
            />

            {/* Mission, Vision & Purpose */}
            <AboutMissionEnhanced 
              aboutData={aboutData}
              siteSettings={layoutData.siteSettings}
            />

            {/* Values Section */}
            <AboutValuesEnhanced 
              aboutData={aboutData}
              siteSettings={layoutData.siteSettings}
            />

            {/* Company Timeline */}
            <AboutTimelineEnhanced 
              aboutData={aboutData}
              siteSettings={layoutData.siteSettings}
            />

            {/* Team Section */}
            <AboutTeam 
              teamMembers={teamMembers}
              siteSettings={layoutData.siteSettings}
            />

            {/* Stats & Achievements */}
            <AboutStats 
              companyMetrics={companyMetrics}
              siteSettings={layoutData.siteSettings}
            />

            {/* Call-to-Action */}
            <AboutCTA 
              siteSettings={layoutData.siteSettings}
            />
          </main>

          <Footer 
            footerData={layoutData.footerData}
            siteSettings={layoutData.siteSettings}
          />
        </div>
      </>
    );
  } catch (error) {
    console.error('Error rendering about page:', error);
    notFound();
  }
}