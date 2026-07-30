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
  getCompanyMetrics,
  getServices,
  getBlogPosts,
  getBlogPostTranslation
} from '@/lib/data-access';
import { fetchStaticPageData } from '@/lib/page-data-fetcher';
import { extractFaqItems } from '@/lib/extract-faq';
import { localizedPath } from '@/lib/locale';
import { BlogPost } from '@/lib/types';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  try {
    // Use the real database slugs (getBlogPosts already falls back to the
    // static docx dataset itself if the DB is unreachable — see
    // lib/data-access.ts). Previously this read lib/blog-data.ts directly,
    // whose "en-N-..."-prefixed slugs don't match any real database row,
    // so every statically-generated blog path 404'd once the database was
    // actually reachable.
    const { data: posts } = await getBlogPosts(1, 500);
    return posts.map((post) => ({
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

    const canonicalUrl = (seoData?.canonical_url || `${cleanedBaseUrl}${localizedPath(`/blog/${post.slug}`, post.locale === 'ar' ? 'ar' : 'en')}`)
      .replace('jusor-translation.com', 'jusortrans.com');
    const ogImage = (seoData?.og_image || post.image_url || `${cleanedBaseUrl}/og-blog-default.jpg`)
      .replace('jusor-translation.com', 'jusortrans.com');

    const postTags = Array.isArray(post.tags) && post.tags.length > 0
      ? post.tags
      : ['translation', 'localization', 'language services'];

    // hreflang: only set when a real translation of this exact article
    // exists (see scripts/link-blog-translations.ts) — most articles are
    // currently single-language until translated.
    const postLocale = post.locale === 'ar' ? 'ar' : 'en';
    const otherLocale = postLocale === 'ar' ? 'en' : 'ar';
    const translation = post.translation_group
      ? await getBlogPostTranslation(post.translation_group, otherLocale)
      : null;
    const languages: Record<string, string> = { [postLocale]: canonicalUrl };
    if (translation) {
      languages[otherLocale] = `${cleanedBaseUrl}${localizedPath(`/blog/${translation.slug}`, otherLocale)}`;
      languages['x-default'] = languages['en'] || canonicalUrl;
    }

    return {
      title,
      description,
      keywords: [...postTags, siteSettings.company_name || 'JUSOR'],
      authors: [{ name: post.author }],
      creator: post.author,
      publisher: siteSettings.company_name || 'JUSOR',
      alternates: {
        canonical: canonicalUrl,
        languages,
      },
      openGraph: {
        type: 'article',
        locale: postLocale === 'ar' ? 'ar_AE' : 'en_US',
        url: canonicalUrl,
        title: seoData?.og_title || title,
        description: seoData?.og_description || description,
        siteName: siteSettings.company_name || 'JUSOR',
        publishedTime: post.published_date,
        modifiedTime: post.updated_at,
        authors: [post.author],
        section: post.blog_category?.name || 'Translation & Localization',
        tags: postTags,
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
    const post = await getBlogPostBySlug(params.slug);

    if (!post) {
      notFound();
    }

    const postLocale = post.locale === 'ar' ? 'ar' : 'en';

    const [layoutData, blogContentSections, companyMetrics, allServices] = await Promise.all([
      fetchStaticPageData('blog'),
      getBlogContentSections(),
      getCompanyMetrics(undefined, postLocale),
      getServices(undefined, undefined, postLocale)
    ]);

    // Get related posts
    const relatedPosts = await getRelatedBlogPosts(post.slug, 3);

    // Real services referenced by this article's related_services slugs
    // (see scripts/seed-articles.ts inferRelatedServices) — matched against
    // each service's shared translation_group key, which both English and
    // Arabic service rows carry (see scripts/seed-services-ar.ts), so this
    // works regardless of the post's own language.
    const relatedServiceSlugs = new Set(post.related_services || []);
    const relatedServices = allServices.filter((s) => relatedServiceSlugs.has(s.translation_group || s.slug)).slice(0, 3);

    const cleanedBaseUrl = (layoutData.siteSettings.site_url || 'https://jusortrans.com')
      .replace('jusor-translation.com', 'jusortrans.com')
      .replace(/\/$/, '');
    const postUrl = `${cleanedBaseUrl}${localizedPath(`/blog/${post.slug}`, postLocale)}`;

    // Generate structured data for the blog post
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.description,
      "inLanguage": postLocale,
      "image": post.image_url ? {
        "@type": "ImageObject",
        "url": post.image_url,
        "width": 1200,
        "height": 630
      } : undefined,
      "author": {
        "@type": /team/i.test(post.author) ? "Organization" : "Person",
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
        "@id": postUrl
      },
      "articleSection": post.blog_category?.name || "Translation & Localization",
      "keywords": Array.isArray(post.tags) && post.tags.length > 0
        ? post.tags
        : ["translation", "localization", "language services"],
      "wordCount": post.content.split(' ').length,
      "articleBody": post.content.replace(/<[^>]*>/g, '').substring(0, 500) + '...'
    };

    // Build FAQPage schema from the real Q&A content already in the article
    // body (see lib/extract-faq.ts) — a genuine AEO/GEO win, not fabricated.
    const faqItems = extractFaqItems(post.content);
    const faqSchema = faqItems.length > 0 ? {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqItems.map((item) => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.answer,
        },
      })),
    } : null;

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": `${cleanedBaseUrl}${localizedPath('/', postLocale)}` },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${cleanedBaseUrl}${localizedPath('/blog', postLocale)}` },
        ...(post.blog_category ? [{
          "@type": "ListItem",
          "position": 3,
          "name": post.blog_category.name,
          "item": `${cleanedBaseUrl}${localizedPath('/blog', postLocale)}?category=${post.blog_category.slug}`,
        }] : []),
        {
          "@type": "ListItem",
          "position": post.blog_category ? 4 : 3,
          "name": post.title,
          "item": postUrl,
        },
      ],
    };

    return (
      <>
        <JsonLd data={structuredData} />
        <JsonLd data={breadcrumbSchema} />
        {faqSchema && <JsonLd data={faqSchema} />}

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
            relatedServices={relatedServices}
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