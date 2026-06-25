'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, ArrowRight, User, BookOpen } from 'lucide-react';
import { BlogPost } from '@/lib/types';
import { format } from 'date-fns';

interface RelatedBlogPostsProps {
  posts: BlogPost[];
  currentPost: BlogPost;
  siteSettings?: Record<string, any>;
}

export function RelatedBlogPosts({ posts, currentPost, siteSettings = {} }: RelatedBlogPostsProps) {
  if (!posts || posts.length === 0) {
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
    <section className="bg-white py-16">
      <div className="container">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center rounded-full bg-brand-orange/10 px-4 py-2 text-sm font-medium text-brand-orange mb-4">
            <BookOpen className="h-4 w-4 mr-2" />
            Continue Reading
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
            Related Articles
          </h2>
          <p className="text-lg text-gray-600">
            Explore more insights and expert advice from our translation and localization blog.
          </p>
        </div>

        {/* Related Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {posts.map((post, index) => {
            const category = getBlogCategory(post.title);
            const readingTime = getReadingTime(post.content);
            const publishedDate = new Date(post.published_date);

            return (
              <Card 
                key={post.id} 
                className="group hover:shadow-xl transition-all duration-300 border-0 bg-white overflow-hidden h-full"
              >
                <CardContent className="p-0 h-full flex flex-col">
                  {/* Post Image */}
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
                          <h4 className="font-semibold text-white text-sm">Related Article</h4>
                        </div>
                      </div>
                    )}
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <Badge className={category.color}>
                        {category.name}
                      </Badge>
                    </div>

                    {/* Reading Time Badge */}
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary" className="bg-white/90 text-gray-700">
                        {readingTime} min
                      </Badge>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    {/* Meta Information */}
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <time dateTime={post.published_date}>
                          {format(publishedDate, 'MMM dd, yyyy')}
                        </time>
                      </div>
                    </div>

                    <h3 className="font-bold text-xl text-gray-900 mb-3 line-clamp-2 group-hover:text-brand-orange transition-colors flex-shrink-0">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">
                      {post.description}
                    </p>

                    {/* Read More Link */}
                    <Link 
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center text-brand-orange hover:text-brand-orange/80 font-medium text-sm transition-colors mt-auto"
                    >
                      Read Full Article
                      <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* View All Blog Posts CTA */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-8 border shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Explore Our Complete Blog
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Discover more expert insights, industry trends, and practical tips from our team of translation and localization professionals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild
                size="lg"
                className="bg-brand-orange hover:bg-brand-orange/90"
              >
                <Link href="/blog">
                  <BookOpen className="h-5 w-5 mr-2" />
                  View All Articles
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                asChild
                className="border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white"
              >
                <Link href="/contact">
                  Get Expert Consultation
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Newsletter Signup Section */}
        <div id="newsletter-signup" className="mt-16">
          <div className="bg-gradient-to-r from-brand-orange/5 to-brand-blue/5 rounded-2xl p-8 lg:p-12 text-center">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                Stay Updated with Translation Insights
              </h3>
              <p className="text-gray-600 mb-8 text-lg">
                Subscribe to our newsletter and get the latest industry trends, expert tips, and exclusive content delivered to your inbox.
              </p>
              
              {/* Newsletter Form */}
              <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none"
                  required
                  aria-label="Email address for newsletter subscription"
                />
                <Button 
                  type="submit"
                  className="bg-brand-orange hover:bg-brand-orange/90 px-8"
                >
                  Subscribe
                </Button>
              </form>
              
              <p className="text-xs text-gray-500 mt-4">
                No spam, unsubscribe at any time. Read our{' '}
                <Link href="/privacy" className="text-brand-orange hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}