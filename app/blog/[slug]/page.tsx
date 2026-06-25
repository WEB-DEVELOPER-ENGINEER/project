import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { BlogPostHero } from '@/components/sections/blog-post-hero';
import { BlogPostContent } from '@/components/sections/blog-post-content';
import { BlogPostAuthor } from '@/components/sections/blog-post-author';
import { RelatedBlogPosts } from '@/components/sections/related-blog-posts';
import { BlogPostCTA } from '@/components/sections/blog-post-cta';
import { JsonLd } from '@/components/seo/json-ld';
import { 
  getBlogPostBySlug, 
  getRelatedBlogPosts, 
  getSEOMetadata,
  getBlogContentSections,
  getCompanyMetrics
} from '@/lib/data-access';
import { fetchStaticPageData } from '@/lib/page-data-fetcher';
import { BlogPost } from '@/lib/types';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  try {
    // We'll generate paths for published blog posts only
    const { executeQuery } = await import('@/lib/database');
    const result = await executeQuery(`
      SELECT slug FROM blog_posts 
      WHERE is_published = true 
      ORDER BY published_date DESC
    `);
    
    return result.rows.map((post: any) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Error generating static params for blog posts:', error);
    return [];
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  try {
    const post = await getBlogPostBySlug(params.slug);
    if (!post) {
      return {
        title: 'Blog Post Not Found',
        description: 'The requested blog post could not be found.',
      };
    }

    const seoData = await getSEOMetadata('blog', post.id).catch(() => null);
    const { siteSettings } = await fetchStaticPageData('blog');

    const cleanedBaseUrl = (siteSettings.site_url || 'https://jusortrans.com')
      .replace('jusor-translation.com', 'jusortrans.com')
      .replace(/\/$/, '');

    const title = seoData?.meta_title || post.meta_title || `${post.title} | ${siteSettings.company_name || 'JUSOR'} Blog`;
    const description = seoData?.meta_description || post.meta_description || 
      post.description || 
      `Read about ${post.title} on the ${siteSettings.company_name || 'JUSOR'} blog.`;

    const canonicalUrl = (seoData?.canonical_url || `${cleanedBaseUrl}/blog/${post.slug}`)
      .replace('jusor-translation.com', 'jusortrans.com');
    const ogImage = (seoData?.og_image || post.image_url || `${cleanedBaseUrl}/og-blog-default.jpg`)
      .replace('jusor-translation.com', 'jusortrans.com');

    return {
      title,
      description,
      keywords: [
        'translation',
        'localization',
        'language services',
        'blog',
        post.title.split(' ').slice(0, 3).join(' '),
        siteSettings.company_name || 'JUSOR'
      ],
      authors: [{ name: post.author }],
      creator: post.author,
      publisher: siteSettings.company_name || 'JUSOR',
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        type: 'article',
        locale: 'en_US',
        url: canonicalUrl,
        title: seoData?.og_title || title,
        description: seoData?.og_description || description,
        siteName: siteSettings.company_name || 'JUSOR',
        publishedTime: post.published_date,
        modifiedTime: post.updated_at,
        authors: [post.author],
        section: 'Translation & Localization',
        tags: ['translation', 'localization', 'language services'],
        images: [{
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${post.title} - ${siteSettings.company_name || 'JUSOR'} Blog`,
        }],
      },
      twitter: {
        card: 'summary_large_image',
        title: seoData?.twitter_title || title,
        description: seoData?.twitter_description || description,
        creator: siteSettings.twitter_creator,
        images: [seoData?.twitter_image || ogImage],
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
    console.error('Error generating metadata for blog post:', error);
    return {
      title: 'Blog Post',
      description: 'Read our latest blog post about translation and localization services.',
    };
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  try {
    const [post, layoutData, blogContentSections, companyMetrics] = await Promise.all([
      getBlogPostBySlug(params.slug),
      fetchStaticPageData('blog'),
      getBlogContentSections(),
      getCompanyMetrics()
    ]);

    if (!post) {
      notFound();
    }

    // Get related posts
    const relatedPosts = await getRelatedBlogPosts(post.slug, 3);

    const cleanedBaseUrl = (layoutData.siteSettings.site_url || 'https://jusortrans.com')
      .replace('jusor-translation.com', 'jusortrans.com')
      .replace(/\/$/, '');

    // Generate structured data for the blog post
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.description,
      "image": post.image_url ? {
        "@type": "ImageObject",
        "url": post.image_url,
        "width": 1200,
        "height": 630
      } : undefined,
      "author": {
        "@type": "Person",
        "name": post.author,
        "url": `${cleanedBaseUrl}/about#team`
      },
      "publisher": {
        "@type": "Organization",
        "name": layoutData.siteSettings.company_name || "JUSOR",
        "logo": {
          "@type": "ImageObject",
          "url": (layoutData.siteSettings.company_logo || `${cleanedBaseUrl}/logo.png`).replace('jusor-translation.com', 'jusortrans.com')
        }
      },
      "datePublished": post.published_date,
      "dateModified": post.updated_at,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `${cleanedBaseUrl}/blog/${post.slug}`
      },
      "articleSection": "Translation & Localization",
      "keywords": ["translation", "localization", "language services"],
      "wordCount": post.content.split(' ').length,
      "articleBody": post.content.replace(/<[^>]*>/g, '').substring(0, 500) + '...'
    };

    return (
      <>
        <JsonLd data={structuredData} />

        <Navigation 
          navigationData={layoutData.navigationData}
          siteSettings={layoutData.siteSettings}
        />

        <main id="main-content" className="flex-1">
          {/* Blog Post Hero Section */}
          <BlogPostHero 
            post={post}
            siteSettings={layoutData.siteSettings}
          />

          {/* Blog Post Content */}
          <BlogPostContent 
            post={post}
            siteSettings={layoutData.siteSettings}
          />

          {/* Author Bio Section */}
          <BlogPostAuthor 
            author={post.author}
            authorData={post.blog_author}
            companyMetrics={companyMetrics}
            siteSettings={layoutData.siteSettings}
          />

          {/* Related Posts Section */}
          {relatedPosts.length > 0 && (
            <RelatedBlogPosts 
              posts={relatedPosts}
              currentPost={post}
              siteSettings={layoutData.siteSettings}
            />
          )}

          {/* Call-to-Action Section */}
          <BlogPostCTA 
            post={post}
            companyMetrics={companyMetrics}
            blogContentSections={blogContentSections}
            siteSettings={layoutData.siteSettings}
          />
        </main>

        <Footer 
          footerData={layoutData.footerData}
          siteSettings={layoutData.siteSettings}
        />
      </>
    );
  } catch (error) {
    console.error('Error rendering blog post page:', error);
    notFound();
  }
}