'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, ArrowLeft, Share2 } from 'lucide-react';
import { BlogPost } from '@/lib/types';
import { format } from 'date-fns';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { BLOG_POST_CONTENT } from '@/lib/content/blog-post-content';
import { companyName as resolveCompanyName } from '@/lib/company';
import { localizedPath } from '@/lib/locale';
import { formatDate } from '@/lib/date-locale';

interface BlogPostHeroProps {
  post: BlogPost;
  siteSettings?: Record<string, any>;
}

export function BlogPostHero({ post, siteSettings = {} }: BlogPostHeroProps) {
  const { locale } = useLanguage();
  const bc = BLOG_POST_CONTENT[locale];
  const publishedDate = new Date(post.published_date);
  // Prefer the reading time computed at seed time (which accounts for Arabic
  // reading at ~150 wpm vs ~200 wpm for English) over a flat re-estimate here,
  // which previously always assumed English reading speed for every article.
  const isArabicContent = /[؀-ۿ]/.test(post.content);
  const readingTime = post.reading_time
    ?? Math.ceil(post.content.split(/\s+/).filter(Boolean).length / (isArabicContent ? 150 : 200));

  const getBlogCategory = (title: string): { name: string; color: string } => {
    const categories = [
      { keywords: ['legal', 'law', 'court'], name: bc.categories.legal, color: 'bg-blue-100 text-blue-800' },
      { keywords: ['technical', 'technology', 'software'], name: bc.categories.technical, color: 'bg-green-100 text-green-800' },
      { keywords: ['business', 'corporate', 'company'], name: bc.categories.business, color: 'bg-purple-100 text-purple-800' },
      { keywords: ['medical', 'health', 'pharmaceutical'], name: bc.categories.medical, color: 'bg-red-100 text-red-800' },
      { keywords: ['academic', 'education', 'research'], name: bc.categories.academic, color: 'bg-yellow-100 text-yellow-800' },
      { keywords: ['translation', 'language', 'localization'], name: bc.categories.translation, color: 'bg-orange-100 text-orange-800' },
    ];

    const titleLower = title.toLowerCase();
    const category = categories.find(cat =>
      cat.keywords.some(keyword => titleLower.includes(keyword))
    );

    return category || { name: bc.categories.general, color: 'bg-gray-100 text-gray-800' };
  };

  // Prefer the real linked category from the database over the keyword
  // guess, which is only a fallback for posts without one.
  const categoryColorBySlug: Record<string, string> = {
    legal: 'bg-blue-100 text-blue-800',
    technical: 'bg-green-100 text-green-800',
    business: 'bg-purple-100 text-purple-800',
    medical: 'bg-red-100 text-red-800',
    academic: 'bg-yellow-100 text-yellow-800',
    insights: 'bg-orange-100 text-orange-800',
    general: 'bg-gray-100 text-gray-800',
  };

  const handleShare = async () => {
    const shareData = {
      title: post.title,
      text: post.description,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Error sharing:', error);
        fallbackShare();
      }
    } else {
      fallbackShare();
    }
  };

  const fallbackShare = () => {
    navigator.clipboard.writeText(window.location.href);
    // You could show a toast notification here
  };

  const category = post.blog_category
    ? {
        name: post.blog_category.name,
        color: categoryColorBySlug[post.blog_category.slug] || 'bg-gray-100 text-gray-800',
      }
    : getBlogCategory(post.title);

  return (
    <section className="relative bg-gradient-to-br from-gray-50 to-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-gray-100/50 bg-[size:20px_20px] opacity-30" />
      
      <div className="relative container section-padding">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link 
                href="/" 
                className="hover:text-brand-orange transition-colors"
                aria-label={bc.goToHomepage}
              >
                {bc.home}
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link 
                href="/blog" 
                className="hover:text-brand-orange transition-colors"
                aria-label={bc.goToBlog}
              >
                {bc.blog}
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-900 font-medium truncate max-w-xs" title={post.title}>
              {post.title}
            </li>
          </ol>
        </nav>

        {/* Back to Blog Button */}
        <div className="mb-8">
          <Link href="/blog">
            <Button 
              variant="outline" 
              size="sm"
              className="group border-gray-300 hover:border-brand-orange hover:text-brand-orange"
            >
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              {bc.backToBlog}
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Content Column */}
          <div className="lg:col-span-8">
            {/* Category Badge */}
            <div className="mb-6">
              <Badge className={category.color}>
                {category.name}
              </Badge>
            </div>

            {/* Title */}
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Description */}
            {post.description && (
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {post.description}
              </p>
            )}

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-8">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="font-medium">{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <time dateTime={post.published_date}>
                  {formatDate(publishedDate, 'MMMM dd, yyyy', locale)}
                </time>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{readingTime} {bc.minRead}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={handleShare}
                variant="outline"
                size="sm"
                className="group border-gray-300 hover:border-brand-orange hover:text-brand-orange"
              >
                <Share2 className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                {bc.shareArticle}
              </Button>
              
              {/* Newsletter CTA */}
              <Button 
                size="sm"
                className="bg-brand-orange hover:bg-brand-orange/90"
                onClick={() => {
                  const element = document.getElementById('newsletter-signup');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {bc.subscribeForMore}
              </Button>
            </div>
          </div>

          {/* Featured Image Column */}
          <div className="lg:col-span-4">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-brand-orange/10 to-brand-blue/10 shadow-xl">
              {post.image_url ? (
                <Image
                  src={post.image_url}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  priority
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center p-8">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <span className="text-3xl font-bold text-brand-blue">
                        {post.title.charAt(0)}
                      </span>
                    </div>
                    <div className="font-semibold text-gray-700 text-lg">
                      {resolveCompanyName(siteSettings, locale)} {bc.blog}
                    </div>
                    <p className="text-gray-500 text-sm mt-2">
                      {bc.insightsCaption}
                    </p>
                  </div>
                </div>
              )}
              
              {/* Overlay gradient for better text readability if needed */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Article Stats */}
            <div className="mt-6 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
              <h2 className="font-semibold text-gray-900 mb-3">{bc.articleInfo}</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">{bc.published}</span>
                  <span className="font-medium">{formatDate(publishedDate, 'MMM dd, yyyy', locale)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{bc.readingTime}</span>
                  <span className="font-medium">{readingTime} {bc.minutes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{bc.category}</span>
                  <span className="font-medium">{category.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{bc.author}</span>
                  <span className="font-medium">{post.author}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}