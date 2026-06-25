import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, ArrowRight, Search } from 'lucide-react';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { getBlogPosts } from '@/lib/data-access';
import { fetchBlogPageData } from '@/lib/page-data-fetcher';
import { format } from 'date-fns';
import { JsonLd } from '@/components/seo/json-ld';
import { NavigateButton } from '@/components/ui/navigate-button';
import { ScrollToButton } from '@/components/ui/scroll-to-button';

export const metadata: Metadata = {
  title: 'Translation Industry Blog | JUSOR Translation Services',
  description: 'Stay updated with the latest trends, tips, and insights from the translation and localization industry. Expert advice from professional translators.',
  keywords: [
    'translation blog',
    'localization insights',
    'translation industry',
    'language services',
    'translation tips',
    'professional translation',
    'translation trends',
    'language technology'
  ],
  openGraph: {
    title: 'Translation Industry Blog | JUSOR Translation Services',
    description: 'Expert insights and tips from the translation industry. Stay updated with the latest trends in professional translation services.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/blog`,
    type: 'website',
    images: [{
      url: '/og-image-blog.jpg',
      width: 1200,
      height: 630,
      alt: 'JUSOR Translation Blog - Industry Insights',
    }],
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/blog`,
  },
};

interface BlogPageProps {
  searchParams: { page?: string; search?: string };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const page = parseInt(searchParams.page || '1');
  const searchQuery = searchParams.search || '';
  
  const [blogData, pageData] = await Promise.all([
    getBlogPosts(page, 9),
    fetchBlogPageData()
  ]);
  
  const { siteSettings, footerData, navigationData } = pageData;

  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'JUSOR Translation Blog',
    description: 'Expert insights and tips from the translation industry',
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/blog`,
    publisher: {
      '@type': 'Organization',
      name: 'JUSOR Translation Services',
      logo: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
    },
    blogPost: blogData.data.map(post => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.description,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${post.slug}`,
      datePublished: post.published_date,
      dateModified: post.updated_at,
      author: {
        '@type': 'Person',
        name: post.author,
      },
      publisher: {
        '@type': 'Organization',
        name: 'JUSOR Translation Services',
      },
      image: post.image_url ? `${process.env.NEXT_PUBLIC_SITE_URL}${post.image_url}` : undefined,
    })),
  };

  const getReadingTime = (content: string): number => {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const getBlogCategory = (title: string): { name: string; color: string } => {
    const categories = [
      { keywords: ['legal', 'law', 'court'], name: 'Legal', color: 'bg-blue-100 text-blue-800' },
      { keywords: ['technical', 'technology', 'software'], name: 'Technical', color: 'bg-green-100 text-green-800' },
      { keywords: ['business', 'corporate', 'company'], name: 'Business', color: 'bg-purple-100 text-purple-800' },
      { keywords: ['medical', 'health', 'pharmaceutical'], name: 'Medical', color: 'bg-red-100 text-red-800' },
      { keywords: ['academic', 'education', 'research'], name: 'Academic', color: 'bg-yellow-100 text-yellow-800' },
      { keywords: ['translation', 'language', 'localization'], name: 'Translation', color: 'bg-orange-100 text-orange-800' },
    ];

    const titleLower = title.toLowerCase();
    const category = categories.find(cat => 
      cat.keywords.some(keyword => titleLower.includes(keyword))
    );

    return category || { name: 'General', color: 'bg-gray-100 text-gray-800' };
  };

  return (
    <>
      <JsonLd data={blogSchema} />
      <Navigation siteSettings={siteSettings} navigationData={navigationData} />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-brand-orange/5 to-brand-blue/5 py-16 sm:py-24">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center rounded-full bg-brand-orange/10 px-4 py-2 text-sm font-medium text-brand-orange mb-4">
                Translation Industry Blog
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-6">
                Expert Insights & Industry Trends
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Stay updated with the latest trends, tips, and insights from the translation 
                and localization industry. Expert advice from our professional team.
              </p>
              
              {/* Search Bar */}
              <div className="max-w-md mx-auto">
                <form method="GET" className="relative">
                  <input
                    type="text"
                    name="search"
                    defaultValue={searchQuery}
                    placeholder="Search articles..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Button 
                    type="submit"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-brand-orange hover:bg-brand-orange/90"
                  >
                    Search
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Blog Posts */}
        <section className="section-padding">
          <div className="container">
            {blogData.data.length > 0 ? (
              <>
                {/* Results Info */}
                <div className="flex items-center justify-between mb-8">
                  <p className="text-gray-600">
                    {searchQuery ? (
                      <>Showing {blogData.data.length} results for "{searchQuery}"</>
                    ) : (
                      <>Showing {blogData.data.length} of {blogData.pagination.total} articles</>
                    )}
                  </p>
                  <div className="text-sm text-gray-500">
                    Page {blogData.pagination.page} of {blogData.pagination.total_pages}
                  </div>
                </div>

                {/* Blog Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                  {blogData.data.map((post) => {
                    const category = getBlogCategory(post.title);
                    const readingTime = getReadingTime(post.content);
                    const publishedDate = new Date(post.published_date);

                    return (
                      <Card key={post.id} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white overflow-hidden">
                        <CardContent className="p-0">
                          {/* Blog Image */}
                          <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-brand-orange/10 to-brand-blue/10">
                            {post.image_url ? (
                              <Image
                                src={post.image_url}
                                alt={post.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full bg-gradient-to-br from-brand-orange/20 to-brand-blue/20">
                                <div className="text-center p-6">
                                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3">
                                    <span className="text-2xl font-bold text-brand-blue">
                                      {post.title.charAt(0)}
                                    </span>
                                  </div>
                                  <h4 className="font-semibold text-white text-sm">Blog Post</h4>
                                </div>
                              </div>
                            )}
                            
                            {/* Category Badge */}
                            <div className="absolute top-4 left-4">
                              <Badge className={category.color}>
                                {category.name}
                              </Badge>
                            </div>
                          </div>

                          {/* Blog Content */}
                          <div className="p-6">
                            {/* Meta Information */}
                            <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                <span>{post.author}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>{format(publishedDate, 'MMM dd, yyyy')}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{readingTime} min read</span>
                              </div>
                            </div>

                            <h3 className="font-bold text-xl text-gray-900 mb-3 line-clamp-2 group-hover:text-brand-orange transition-colors">
                              {post.title}
                            </h3>
                            
                            <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                              {post.description}
                            </p>

                            {/* Read More Link */}
                            <Link 
                              href={`/blog/${post.slug}`}
                              className="inline-flex items-center text-brand-orange hover:text-brand-orange/80 font-medium text-sm transition-colors"
                            >
                              Read More
                              <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Pagination */}
                {blogData.pagination.total_pages > 1 && (
                  <div className="flex items-center justify-center gap-4">
                    {blogData.pagination.has_prev && (
                      <Link
                        href={`/blog?page=${blogData.pagination.page - 1}${searchQuery ? `&search=${searchQuery}` : ''}`}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Previous
                      </Link>
                    )}
                    
                    <span className="px-4 py-2 bg-brand-orange text-white rounded-lg">
                      {blogData.pagination.page}
                    </span>
                    
                    {blogData.pagination.has_next && (
                      <Link
                        href={`/blog?page=${blogData.pagination.page + 1}${searchQuery ? `&search=${searchQuery}` : ''}`}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Next
                      </Link>
                    )}
                  </div>
                )}
              </>
            ) : (
              /* No Results */
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {searchQuery ? 'No articles found' : 'No blog posts available'}
                </h3>
                <p className="text-gray-600 mb-8">
                  {searchQuery 
                    ? `We couldn't find any articles matching "${searchQuery}". Try different keywords.`
                    : 'We\'re working on creating valuable content for you. Check back soon!'
                  }
                </p>
                {searchQuery && (
                  <Link href="/blog">
                    <Button className="bg-brand-orange hover:bg-brand-orange/90">
                      View All Articles
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="section-padding bg-gray-50">
          <div className="container">
            <div className="bg-white rounded-2xl p-8 shadow-sm border text-center max-w-3xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Stay Updated with Translation Insights
              </h3>
              <p className="text-gray-600 mb-6">
                Subscribe to our newsletter for the latest industry trends, translation tips, 
                and expert insights delivered directly to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <NavigateButton 
                  href="/newsletter"
                  size="lg"
                  className="bg-brand-orange hover:bg-brand-orange/90"
                >
                  Subscribe to Newsletter
                </NavigateButton>
                <ScrollToButton 
                  targetId="contact-form-section"
                  variant="outline" 
                  size="lg"
                  className="border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white"
                >
                  Contact Us
                </ScrollToButton>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer footerData={footerData} siteSettings={siteSettings} />
    </>
  );
}