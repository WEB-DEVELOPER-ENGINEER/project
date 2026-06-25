import Link from 'next/link';
import { Github, Twitter, Linkedin, Mail, Facebook, Instagram, Youtube } from 'lucide-react';
import { FooterLogo } from '@/components/ui/logo';

interface FooterProps {
  footerData?: any;
  siteSettings?: Record<string, any>;
}

export function Footer({ footerData, siteSettings = {} }: FooterProps) {
  // Icon mapping for social media
  const getIcon = (iconName: string) => {
    const iconMap: Record<string, any> = {
      Github, Twitter, Linkedin, Mail, Facebook, Instagram, Youtube
    };
    return iconMap[iconName] || Mail;
  };

  // Group footer links by section
  const linksBySection = footerData?.links?.reduce((acc: any, link: any) => {
    const sectionId = link.footer_section_id;
    if (!acc[sectionId]) {
      acc[sectionId] = [];
    }
    acc[sectionId].push(link);
    return acc;
  }, {}) || {};

  // Get sections from database
  const sections = footerData?.sections || [];

  return (
    <footer className="bg-gray-900" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="container section-padding">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-2">
            <FooterLogo siteSettings={siteSettings} />
            <div className="grid grid-cols-2 gap-8">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              {sections.slice(0, 2).map((section: any) => {
                const sectionLinks = linksBySection[section.id] || [];
                
                return (
                  <div key={section.id} className={section.id > 1 ? "mt-10 md:mt-0" : ""}>
                    <h3 className="text-sm font-semibold leading-6 text-white">
                      {section.title}
                    </h3>
                    <ul role="list" className="mt-6 space-y-4">
                      {sectionLinks.map((item: any, index: number) => (
                        <li key={item.id || index}>
                          <Link
                            href={item.url || item.href}
                            className="text-sm leading-6 text-gray-300 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
                          >
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
            </div>
          </div>
          
          <div className="mt-10 xl:mt-0">
            <h3 className="text-sm font-semibold leading-6 text-white">
              {siteSettings.newsletter_title || 'Subscribe to our newsletter'}
            </h3>
            <p className="mt-2 text-sm leading-6 text-gray-300">
              {siteSettings.newsletter_description || 'Get the latest updates and insights delivered to your inbox.'}
            </p>
            <div className="mt-6 sm:flex sm:max-w-md">
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                type="email"
                name="email-address"
                id="email-address"
                autoComplete="email"
                required
                className="w-full min-w-0 appearance-none rounded-md border-0 bg-white/5 px-3 py-1.5 text-base text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-brand-orange sm:w-64 sm:text-sm sm:leading-6"
                placeholder={siteSettings.newsletter_placeholder || 'Enter your email'}
                aria-describedby="newsletter-description"
              />
              <div className="mt-4 sm:ml-4 sm:mt-0 sm:flex-shrink-0">
                <button
                  type="submit"
                  className="flex w-full items-center justify-center rounded-md bg-brand-orange px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-orange/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
                >
                  {siteSettings.newsletter_button_text || 'Subscribe'}
                </button>
              </div>
            </div>
            <div className="mt-6 flex space-x-6">
              {(siteSettings.social_media_links || []).map((item: any, index: number) => {
                const IconComponent = getIcon(item.icon_name);
                return (
                  <Link
                    key={item.name || index}
                    href={item.url || item.href}
                    className="text-gray-500 hover:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
                  >
                    <span className="sr-only">{item.name}</span>
                    <IconComponent className="h-6 w-6" aria-hidden="true" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
        
        <div className="mt-16 border-t border-white/10 pt-8 sm:mt-20 md:flex md:items-center md:justify-between lg:mt-24">
          <p className="text-xs leading-5 text-gray-400">
            &copy; {new Date().getFullYear()} {siteSettings.company_name}. {siteSettings.copyright_text}
          </p>
          <p className="mt-4 text-xs leading-5 text-gray-400 md:mt-0">
            {siteSettings.footer_tagline}
          </p>
        </div>
      </div>
    </footer>
  );
}