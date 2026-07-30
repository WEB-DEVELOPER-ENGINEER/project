import { Metadata } from 'next';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { fetchStaticPageData } from '@/lib/page-data-fetcher';

export async function generateMetadata(): Promise<Metadata> {
  const { siteSettings } = await fetchStaticPageData('privacy');
  const companyName = siteSettings.company_name || 'JUSOR Translation Services';
  const description = `Learn how ${companyName} collects, uses, and protects your personal information. GDPR and CCPA compliant privacy policy.`;

  return {
    title: 'Privacy Policy',
    description,
    robots: { index: true, follow: true },
    alternates: {
      canonical: `${siteSettings.site_url || 'https://jusortrans.com'}/privacy`,
    },
    openGraph: {
      title: `Privacy Policy | ${companyName}`,
      description,
      url: `${siteSettings.site_url || 'https://jusortrans.com'}/privacy`,
    },
  };
}

export default async function PrivacyPage() {
  const { siteSettings, navigationData, footerData } = await fetchStaticPageData('privacy');
  const companyName = siteSettings.company_name || 'JUSOR Translation Services';
  const contactEmail = siteSettings.company_email || siteSettings.contact_email || 'info@jusortrans.com';
  const contactAddress = siteSettings.company_address || 'Abu Saif Business Center - Al-Kazim Building - Block A - M Floor - Office 40B, Abu Hail, Dubai, United Arab Emirates';

  return (
    <>
      <Navigation siteSettings={siteSettings} navigationData={navigationData} />
      <main id="main-content">
        <section className="section-padding pt-24">
          <div className="container max-w-4xl">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-8">
              Privacy Policy
            </h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-gray-600 mb-8">
                Last updated: {new Date().toLocaleDateString()}
              </p>

              <section aria-labelledby="information-collection">
                <h2 id="information-collection" className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                  Information We Collect
                </h2>
                <p>We collect information you provide directly to us, such as when you:</p>
                <ul>
                  <li>Create an account or use our services</li>
                  <li>Subscribe to our newsletter</li>
                  <li>Contact us for support</li>
                  <li>Participate in surveys or promotions</li>
                </ul>
              </section>

              <section aria-labelledby="information-use">
                <h2 id="information-use" className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                  How We Use Your Information
                </h2>
                <p>We use the information we collect to:</p>
                <ul>
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process transactions and send related information</li>
                  <li>Send technical notices and support messages</li>
                  <li>Communicate about products, services, and events</li>
                  <li>Monitor and analyze usage patterns</li>
                </ul>
              </section>

              <section aria-labelledby="cookies">
                <h2 id="cookies" className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                  Cookies and Tracking Technologies
                </h2>
                <p>
                  We use cookies and similar tracking technologies to collect and track information 
                  about your use of our service. You can control cookie settings through our 
                  cookie consent manager or your browser settings.
                </p>
                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Types of Cookies:</h3>
                <ul>
                  <li><strong>Necessary Cookies:</strong> Essential for the website to function</li>
                  <li><strong>Analytics Cookies:</strong> Help us understand website usage</li>
                  <li><strong>Marketing Cookies:</strong> Used for personalized advertising</li>
                  <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                </ul>
              </section>

              <section aria-labelledby="data-sharing">
                <h2 id="data-sharing" className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                  Information Sharing and Disclosure
                </h2>
                <p>We may share your information in the following circumstances:</p>
                <ul>
                  <li>With your consent</li>
                  <li>To comply with legal obligations</li>
                  <li>With service providers who assist our operations</li>
                  <li>In connection with a business transaction</li>
                  <li>To protect rights, property, or safety</li>
                </ul>
              </section>

              <section aria-labelledby="your-rights">
                <h2 id="your-rights" className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                  Your Rights and Choices
                </h2>
                <p>Depending on your location, you may have certain rights regarding your personal information:</p>
                
                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">GDPR Rights (EU/UK):</h3>
                <ul>
                  <li>Right to access your personal data</li>
                  <li>Right to rectification of inaccurate data</li>
                  <li>Right to erasure ("right to be forgotten")</li>
                  <li>Right to restrict processing</li>
                  <li>Right to data portability</li>
                  <li>Right to object to processing</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">CCPA Rights (California):</h3>
                <ul>
                  <li>Right to know about personal information collected</li>
                  <li>Right to delete personal information</li>
                  <li>Right to opt-out of the sale of personal information</li>
                  <li>Right to non-discrimination for exercising privacy rights</li>
                </ul>
              </section>

              <section aria-labelledby="data-security">
                <h2 id="data-security" className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                  Data Security
                </h2>
                <p>
                  We implement appropriate technical and organizational security measures to protect 
                  your personal information against unauthorized access, alteration, disclosure, or destruction.
                </p>
              </section>

              <section aria-labelledby="international-transfers">
                <h2 id="international-transfers" className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                  International Data Transfers
                </h2>
                <p>
                  Your information may be transferred to and processed in countries other than your own. 
                  We ensure appropriate safeguards are in place for such transfers.
                </p>
              </section>

              <section aria-labelledby="contact-us">
                <h2 id="contact-us" className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                  Contact Us
                </h2>
                <p>
                  If you have any questions about this Privacy Policy or wish to exercise your rights, 
                  please contact us at:
                </p>
                <div className="bg-gray-50 p-6 rounded-lg mt-4">
                  <p><strong>Company:</strong> {companyName}</p>
                  <p><strong>Email:</strong> {contactEmail}</p>
                  <p><strong>Address:</strong> {contactAddress}</p>
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