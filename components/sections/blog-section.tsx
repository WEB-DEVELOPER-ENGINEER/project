'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, ArrowRight, User } from 'lucide-react';
import { BlogPost } from '@/lib/types';
import { format } from 'date-fns';

interface BlogSectionProps {
  blogs: BlogPost[];
  siteSettings?: Record<string, any>;
}

import { useLanguage } from '@/components/providers/LanguageProvider';
import { cn } from '@/lib/utils';
import { englishArticles, arabicArticles } from '@/lib/blog-data';

export function BlogSection({ blogs: rawBlogs, siteSettings = {} }: BlogSectionProps) {
  const { t, isRtl } = useLanguage();

  const loadedArticles = isRtl ? arabicArticles : englishArticles;
  const blogs = loadedArticles.slice(0, 6) as unknown as BlogPost[];

  if (!blogs || blogs.length === 0) {
    return null;
  }

  const getReadingTime = (content?: string): number => {
    if (!content) return 3;
    const wordsPerMinute = isRtl ? 150 : 200;
    const wordCount = content.split(' ').length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  };

  return (
    <section id="blog-section" className="section-padding bg-gray-50 dark:bg-gray-900/50">
      <div className="container">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center rounded-full bg-brand-orange/10 px-4 py-2 text-sm font-medium text-brand-orange mb-4">
            {isRtl ? 'أحدث المقالات' : 'Latest Insights'}
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl mb-4">
            {t('blog.sectionTitle')}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {t('blog.sectionSubtitle')}
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => {
            const readingTime = getReadingTime(blog.content);

            return (
              <Card key={blog.id} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white dark:bg-gray-800 overflow-hidden">
                <CardContent className="p-0">
                  {/* Blog Image */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-brand-orange/10 to-brand-blue/10">
                    {blog.image_url ? (
                      <Image
                        src={blog.image_url}
                        alt={blog.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gradient-to-br from-brand-orange/20 to-brand-blue/20">
                        <div className="text-center p-6">
                          <div className="w-16 h-16 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-2xl font-bold text-brand-blue dark:text-gray-100">
                              {blog.title.charAt(0)}
                            </span>
                          </div>
                          <h4 className="font-semibold text-white text-sm">
                            {isRtl ? 'مقال متألق' : 'Blog Post'}
                          </h4>
                        </div>
                      </div>
                    )}
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-brand-orange/10 text-brand-orange border-0">
                        {isRtl ? 'رؤى الترجمة' : 'Insights'}
                      </Badge>
                    </div>
                  </div>

                  {/* Blog Content */}
                  <div className="p-6">
                    {/* Meta Information */}
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-3">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{isRtl ? 'فريق جسور' : (blog.author || 'JUSOR Team')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{blog.published_date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{readingTime} {isRtl ? 'دقائق قراءة' : 'min read'}</span>
                      </div>
                    </div>

                    <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100 mb-3 line-clamp-2 group-hover:text-brand-orange transition-colors">
                      {blog.title}
                    </h3>
                    
                    <div className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4">
                      {blog.description}
                    </div>

                    {/* Read More Link */}
                    <Link 
                      href={`/blog/${blog.slug}`}
                      className="inline-flex items-center text-brand-orange hover:text-brand-orange/80 font-medium text-sm transition-colors"
                    >
                      {t('blog.readMore')}
                      <ArrowRight className={cn('h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform', isRtl && 'rotate-180 mr-1 ml-0')} />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {isRtl ? 'اشترك للحصول على أحدث المقالات والرؤى' : 'Stay Updated with Translation Insights'}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              {isRtl ? 'اشترك في نشرتنا الإخبارية ليصلك جديد اتجاهات الترجمة والنصائح المتخصصة مباشرة في صندوق بريدك.' : 'Subscribe to our newsletter for the latest industry trends, translation tips, and expert insights delivered directly to your inbox.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-brand-orange hover:bg-brand-orange/90 text-white"
                onClick={() => {
                  window.location.href = '/contact';
                }}
              >
                {t('footer.subscribeBtn')}
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white"
                onClick={() => {
                  window.location.href = '/blog';
                }}
              >
                {isRtl ? 'عرض كافة المقالات' : 'View All Articles'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}