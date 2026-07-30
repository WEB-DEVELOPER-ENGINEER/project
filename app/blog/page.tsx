import { Metadata } from 'next';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { fetchBlogPageData } from '@/lib/page-data-fetcher';
import { BlogListClient } from '@/components/blog/BlogListClient';

export const metadata: Metadata = {
  title: 'Translation Industry Blog | JUSOR Translation Services',
  description: 'Certified translation articles and expert insights in English and Arabic for commercial, legal, aerospace, and financial sectors in Dubai.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/blog`,
  },
};

export default async function BlogPage() {
  const pageData = await fetchBlogPageData();
  const { siteSettings, footerData, navigationData } = pageData;

  return (
    <>
      <Navigation siteSettings={siteSettings} navigationData={navigationData} />
      <main id="main-content" className="min-h-screen">
        <BlogListClient />
      </main>
      <Footer footerData={footerData} siteSettings={siteSettings} />
    </>
  );
}