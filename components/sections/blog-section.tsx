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

export function BlogSection({ blogs, siteSettings = {} }: BlogSectionProps) {
  if (!blogs || blogs.length === 0) {
    return null;
  }

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
    <section id="blog-section" className="section-padding bg-gray-50">
      <div className="container">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center rounded-full bg-brand-orange/10 px-4 py-2 text-sm font-medium text-brand-orange mb-4">
            {siteSettings.blog_section_badge || 'Latest Insights'}
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
            {siteSettings.blog_section_title || 'Translation Industry Blog'}
          </h2>
          <p className="text-lg text-gray-600">
            {siteSettings.blog_section_description || 'Stay updated with the latest trends, tips, and insights from the translation and localization industry. Expert advice from our professional team.'}
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog, index) => {
            const category = getBlogCategory(blog.title);
            const readingTime = getReadingTime(blog.content);
            const publishedDate = new Date(blog.published_date);

            return (
              <Card key={blog.id} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white overflow-hidden">
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
                          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-2xl font-bold text-brand-blue">
                              {blog.title.charAt(0)}
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
                        <span>{blog.author}</span>
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
                      {blog.title}
                    </h3>
                    
                    <div 
                      className="text-gray-600 text-sm line-clamp-3 mb-4 prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: blog.description }}
                    />

                    {/* Read More Link */}
                    <Link 
                      href={`/blog/${blog.slug}`}
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

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl p-8 shadow-sm border">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {siteSettings.blog_cta_title || 'Stay Updated with Translation Insights'}
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              {siteSettings.blog_cta_description || 'Subscribe to our newsletter for the latest industry trends, translation tips, and expert insights delivered directly to your inbox.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-brand-orange hover:bg-brand-orange/90"
                onClick={() => {
                  // Open newsletter subscription modal or navigate to subscription page
                  window.location.href = siteSettings.blog_cta_primary_url || '/newsletter';
                }}
              >
                {siteSettings.blog_cta_primary_text || 'Subscribe to Newsletter'}
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white"
                onClick={() => {
                  window.location.href = siteSettings.blog_cta_secondary_url || '/blog';
                }}
              >
                {siteSettings.blog_cta_secondary_text || 'View All Articles'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}