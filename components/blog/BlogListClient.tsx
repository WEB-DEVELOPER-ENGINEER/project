'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, ArrowRight, Search } from 'lucide-react';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { BlogPost } from '@/lib/types';
import { localizedPath } from '@/lib/locale';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface BlogListClientProps {
  posts: BlogPost[];
}

export function BlogListClient({ posts }: BlogListClientProps) {
  const { t, isRtl, locale } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredArticles = posts.filter(article =>
    searchQuery.trim() === '' ||
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (article.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const limit = 9;
  const totalPages = Math.ceil(filteredArticles.length / limit) || 1;
  const currentArticles = filteredArticles.slice((currentPage - 1) * limit, currentPage * limit);

  const getReadingTime = (content?: string): number => {
    if (!content) return 3;
    const wordsPerMinute = isRtl ? 150 : 200;
    const wordCount = content.split(' ').length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  };

  return (
    <>
      {/* Hero Header */}
      <section className="bg-gradient-to-br from-brand-orange/5 to-brand-blue/5 py-16 sm:py-24">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center rounded-full bg-brand-orange/10 px-4 py-2 text-sm font-medium text-brand-orange mb-4">
              {isRtl ? 'مدونة الترجمة المتخصصة' : 'Translation Industry Blog'}
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl mb-6">
              {isRtl ? 'رؤى وخبرات صناعة الترجمة' : 'Expert Insights & Industry Trends'}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              {isRtl
                ? 'اقرأ مقالاتنا التخصصية المكتوبة بأيدي خبراء الترجمة القانونية والفنية والمالية في دبي والإمارات.'
                : 'Stay updated with the latest trends, tips, and insights from the translation and localization industry.'}
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder={isRtl ? 'ابحث في المقالات...' : 'Search articles...'}
                  className={cn(
                    'w-full py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-transparent',
                    isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'
                  )}
                />
                <Search className={cn('absolute top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400', isRtl ? 'right-3' : 'left-3')} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Grid Section */}
      <section className="section-padding bg-white dark:bg-gray-900">
        <div className="container">
          {filteredArticles.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-8">
                <p className="text-gray-600 dark:text-gray-300">
                  {isRtl
                    ? `عرض ${filteredArticles.length} مقالاً مخصصاً باللغة العربية`
                    : `Showing ${filteredArticles.length} English articles`}
                </p>
                <div className="text-sm text-gray-500">
                  {isRtl ? `صفحة ${currentPage} من ${totalPages}` : `Page ${currentPage} of ${totalPages}`}
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {currentArticles.map((article) => {
                  const readingTime = getReadingTime(article.content);

                  return (
                    <Card key={article.id} className="group hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 overflow-hidden">
                      <CardContent className="p-0">
                        {/* Article Header Background */}
                        <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-brand-orange/20 to-brand-blue/20 flex items-center justify-center p-6 text-center">
                          <div>
                            <div className="w-14 h-14 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                              <span className="text-2xl font-bold text-brand-orange">
                                {article.title.charAt(0)}
                              </span>
                            </div>
                            <Badge className="bg-brand-blue/10 text-brand-blue dark:bg-brand-blue/30 dark:text-brand-blue-foreground border-0">
                              {isRtl ? 'ترجمة معتمدة' : 'Certified Article'}
                            </Badge>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-3">
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              <span>{article.author}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{article.published_date ? format(new Date(article.published_date), 'MMM d, yyyy') : ''}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{readingTime} {isRtl ? 'دقائق' : 'min read'}</span>
                            </div>
                          </div>

                          <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-3 line-clamp-2 group-hover:text-brand-orange transition-colors">
                            {article.title}
                          </h3>
                          
                          <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4">
                            {article.description}
                          </p>

                          <Link 
                            href={localizedPath(`/blog/${article.slug}`, locale)}
                            className="inline-flex items-center text-brand-orange hover:text-brand-orange/80 font-medium text-sm transition-colors"
                          >
                            {isRtl ? 'قراءة المقال الكامل' : 'Read Full Article'}
                            <ArrowRight className={cn('h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform', isRtl && 'rotate-180 mr-1 ml-0')} />
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3">
                  <Button
                    variant="outline"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  >
                    {isRtl ? 'السابق' : 'Previous'}
                  </Button>
                  <span className="px-4 py-2 bg-brand-orange text-white rounded-lg text-sm font-medium">
                    {currentPage} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  >
                    {isRtl ? 'التالي' : 'Next'}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                {isRtl ? 'لم يتم العثور على مقالات مطابقة' : 'No articles found'}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {isRtl ? 'جرب البحث باستخدام كلمات أخرى.' : 'Try searching with different keywords.'}
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
