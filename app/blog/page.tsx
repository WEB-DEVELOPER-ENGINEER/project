import { Metadata } from 'next';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { fetchBlogPageData } from '@/lib/page-data-fetcher';
import { getBlogPosts } from '@/lib/data-access';
import { BlogListClient } from '@/components/blog/BlogListClient';
import { getLocale } from '@/lib/locale-server';
import { siteUrl } from '@/lib/company';

export async function generateMetadata(): Promise<Metadata> {
  const locale = getLocale();
  const baseUrl = siteUrl();
  const title = locale === 'ar'
    ? 'مدونة الترجمة | خدمات جسور للترجمة'
    : 'Translation Industry Blog';
  const description = locale === 'ar'
    ? 'مقالات ترجمة معتمدة ورؤى متخصصة للقطاعات التجارية والقانونية والطيران والمالية في دبي.'
    : 'Certified translation articles and expert insights in English and Arabic for commercial, legal, aerospace, and financial sectors in Dubai.';

  return {
    title,
    description,
    alternates: {
      canonical: locale === 'ar' ? `${baseUrl}/ar/blog` : `${baseUrl}/blog`,
      languages: {
        en: `${baseUrl}/blog`,
        ar: `${baseUrl}/ar/blog`,
        'x-default': `${baseUrl}/blog`,
      },
    },
  };
}

export default async function BlogPage() {
  const locale = getLocale();
  const [pageData, blogPostsResponse] = await Promise.all([
    fetchBlogPageData(),
    getBlogPosts(1, 100, locale),
  ]);
  const { siteSettings, footerData, navigationData } = pageData;

  return (
    <>
      <Navigation siteSettings={siteSettings} navigationData={navigationData} />
      <main id="main-content" className="min-h-screen">
        <BlogListClient posts={blogPostsResponse.data} />
      </main>
      <Footer footerData={footerData} siteSettings={siteSettings} />
    </>
  );
}