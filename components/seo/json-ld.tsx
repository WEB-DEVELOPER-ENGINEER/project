interface JsonLdProps {
  siteSettings?: Record<string, any>;
  services?: any[];
  certifications?: any[]; // Real accreditations from company_metrics (category='achievements') — see scripts/seed-company-metrics.ts
  data?: any; // Allow passing custom schema data
}

export function JsonLd({ siteSettings = {}, services = [], certifications = [], data }: JsonLdProps) {
  const socialLinks = Array.isArray(siteSettings.social_media_links)
    ? siteSettings.social_media_links.map((link: any) => typeof link === 'string' ? link : link?.url).filter(Boolean)
    : [];
  
  const finalSameAs = socialLinks.length > 0 ? socialLinks : [
    'https://www.linkedin.com/company/jusor-translation',
    'https://www.facebook.com/jusortranslation',
    'https://twitter.com/jusortranslation',
  ];

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": siteSettings.company_name || "JUSOR Translation Services",
    "description": siteSettings.company_description || "Professional translation services for legal, technical, and business documents",
    "url": siteSettings.site_url || "https://jusortrans.com",
    "logo": siteSettings.company_logo || `${siteSettings.site_url || 'https://jusortrans.com'}/logo.png`,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": siteSettings.company_phone || "+971 50 324 4329",
      "contactType": "customer service",
      "email": siteSettings.company_email || "info@jusortrans.com",
      "availableLanguage": siteSettings.primary_language || siteSettings.supported_languages || ["English", "Arabic"]
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": siteSettings.company_street_address || siteSettings.company_address || "Abu Saif Business Center - Al-Kazim Building - Block A - M Floor - Office 40B, Abu Hail",
      "addressLocality": siteSettings.company_city || "Dubai",
      "addressRegion": siteSettings.company_state || siteSettings.company_region || "Dubai",
      "postalCode": siteSettings.company_postal_code || "00000",
      "addressCountry": siteSettings.company_country || "AE"
    },
    "sameAs": finalSameAs,
    // Real accreditations only (ISO 9001:2015, MOJ, Dubai Courts/DIFC, DIAC,
    // etc. — see scripts/seed-company-metrics.ts). Omitted entirely if none
    // are seeded, rather than falling back to a placeholder claim.
    ...(certifications.length > 0 ? {
      "hasCredential": certifications.map((cert) => ({
        "@type": "EducationalOccupationalCredential",
        "credentialCategory": cert.metric_value,
        "name": cert.metric_label,
      })),
    } : {}),
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": siteSettings.company_name || "JUSOR Translation Services",
    "url": siteSettings.site_url || "https://jusortrans.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${siteSettings.site_url || "https://jusortrans.com"}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": siteSettings.company_name || "JUSOR Translation Services",
    "serviceType": siteSettings.service_type || "Translation Services",
    "provider": {
      "@type": "Organization",
      "name": siteSettings.company_name || "JUSOR Translation Services"
    },
    "areaServed": siteSettings.service_area || "Worldwide",
    "description": siteSettings.company_description || "Professional translation services for legal, technical, and business documents",
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": [
        "h1",
        ".main-content p"
      ]
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": siteSettings.service_catalog_name || "Translation Services",
      "itemListElement": services.map((service, index) => ({
        "@type": "Offer",
        "position": index + 1,
        "itemOffered": {
          "@type": "Service",
          "name": service.title,
          "description": service.content
        }
      }))
    }
  };

  return (
    <>
      {data ? (
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(data)
          }}
        />
      ) : (
        <>
          <script
            type="application/ld+json"
            suppressHydrationWarning
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(organizationSchema)
            }}
          />
          <script
            type="application/ld+json"
            suppressHydrationWarning
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(websiteSchema)
            }}
          />
          <script
            type="application/ld+json"
            suppressHydrationWarning
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(serviceSchema)
            }}
          />
        </>
      )}
    </>
  );
}