import { Metadata } from 'next';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { fetchStaticPageData } from '@/lib/page-data-fetcher';
import { getLocale } from '@/lib/locale-server';
import { localizedPath } from '@/lib/locale';
import { PRIVACY_CONTENT, PRIVACY_LAST_UPDATED } from '@/lib/content/privacy-content';
import { companyName as resolveCompanyName, companyAddress } from '@/lib/company';

export async function generateMetadata(): Promise<Metadata> {
  const locale = getLocale();
  const { siteSettings } = await fetchStaticPageData('privacy');
  const companyName = resolveCompanyName(siteSettings, locale);
  const baseUrl = (siteSettings.site_url || 'https://jusortrans.com').replace(/\/$/, '');

  const title = locale === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy';
  const description = locale === 'ar'
    ? `تعرّف على كيفية تعامل ${companyName} مع مستنداتك ومعلوماتك الشخصية، وسياسة السرية وحماية البيانات لدينا.`
    : `Learn how ${companyName} handles your documents and personal information, including our confidentiality and data protection practices.`;

  return {
    title,
    description,
    robots: { index: true, follow: true },
    alternates: {
      canonical: `${baseUrl}${localizedPath('/privacy', locale)}`,
      languages: {
        en: `${baseUrl}/privacy`,
        ar: `${baseUrl}/ar/privacy`,
        'x-default': `${baseUrl}/privacy`,
      },
    },
    openGraph: {
      title: `${title} | ${companyName}`,
      description,
      url: `${baseUrl}${localizedPath('/privacy', locale)}`,
      locale: locale === 'ar' ? 'ar_AE' : 'en_US',
    },
  };
}

export default async function PrivacyPage() {
  const locale = getLocale();
  const { siteSettings, navigationData, footerData } = await fetchStaticPageData('privacy');
  const content = PRIVACY_CONTENT[locale];

  const companyName = resolveCompanyName(siteSettings, locale);
  const contactEmail = siteSettings.company_email || siteSettings.contact_email || 'info@jusortrans.com';
  const contactAddress = companyAddress(siteSettings, locale);

  const formattedDate = new Date(PRIVACY_LAST_UPDATED).toLocaleDateString(
    locale === 'ar' ? 'ar-AE' : 'en-GB',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );

  return (
    <>
      <Navigation siteSettings={siteSettings} navigationData={navigationData} />
      <main id="main-content">
        <section className="section-padding pt-24">
          <div className="container max-w-4xl">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-8">
              {content.title}
            </h1>

            <div className="prose prose-lg max-w-none">
              <p className="text-sm text-gray-500 mb-2">
                {content.lastUpdatedLabel}: {formattedDate}
              </p>
              <p className="text-lg text-gray-600 mb-8">
                {content.intro}
              </p>

              {content.sections.map((section) => (
                <section key={section.id} aria-labelledby={section.id}>
                  <h2 id={section.id} className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                    {section.heading}
                  </h2>

                  {section.paragraphs?.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}

                  {/* Order is fixed by the PrivacySection contract:
                      paragraphs → subheading → items → extraSubheading → extraItems */}
                  {section.subheading && (
                    <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">{section.subheading}</h3>
                  )}

                  {section.items && section.items.length > 0 && (
                    <ul>
                      {section.items.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  )}

                  {section.extraSubheading && (
                    <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">{section.extraSubheading}</h3>
                  )}

                  {section.extraItems && section.extraItems.length > 0 && (
                    section.extraItemsAsProse ? (
                      section.extraItems.map((paragraph, i) => <p key={i}>{paragraph}</p>)
                    ) : (
                      <ul>
                        {section.extraItems.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    )
                  )}
                </section>
              ))}

              <section aria-labelledby="contact-us">
                <h2 id="contact-us" className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                  {content.contactHeading}
                </h2>
                <p>{content.contactIntro}</p>
                <div className="bg-gray-50 p-6 rounded-lg mt-4">
                  <p><strong>{content.labels.company}:</strong> {companyName}</p>
                  <p><strong>{content.labels.email}:</strong> {contactEmail}</p>
                  <p><strong>{content.labels.address}:</strong> {contactAddress}</p>
                </div>
              </section>
            </div>
          </div>
        </section>
      </main>
      <Footer footerData={footerData} siteSettings={siteSettings} />
    </>
  );
}
