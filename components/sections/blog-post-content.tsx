'use client';

import React, { useEffect, useState } from 'react';
import { BlogPost } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ChevronUp, BookOpen, MessageCircle } from 'lucide-react';

interface BlogPostContentProps {
  post: BlogPost;
  siteSettings?: Record<string, any>;
}

interface TableOfContentsItem {
  id: string;
  text: string;
  level: number;
}

export function BlogPostContent({ post, siteSettings = {} }: BlogPostContentProps) {
  const [tableOfContents, setTableOfContents] = useState<TableOfContentsItem[]>([]);
  const [activeHeading, setActiveHeading] = useState<string>('');
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Generate table of contents from content headings
  useEffect(() => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = post.content;
    
    const headings = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const toc: TableOfContentsItem[] = [];
    
    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1));
      const text = heading.textContent || '';
      const id = `heading-${index}`;
      
      // Add ID to heading for navigation
      heading.id = id;
      
      toc.push({ id, text, level });
    });
    
    setTableOfContents(toc);
    
    // Update the post content with IDs
    const contentWithIds = tempDiv.innerHTML;
    
    // Set up intersection observer for active heading tracking
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -80% 0px' }
    );

    // Observe headings after a short delay to ensure DOM is ready
    setTimeout(() => {
      headings.forEach((heading) => {
        if (heading.id) observer.observe(heading);
      });
    }, 100);

    return () => observer.disconnect();
  }, [post.content]);

  // Handle scroll to top visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Account for fixed header
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({ top: elementPosition, behavior: 'smooth' });
    }
  };

  // Sanitize and enhance content
  const enhanceContent = (content: string) => {
    // Add responsive classes to images
    let enhancedContent = content.replace(
      /<img([^>]*)>/g,
      '<img$1 class="w-full h-auto rounded-lg shadow-md my-6" loading="lazy">'
    );

    // Add styling to blockquotes
    enhancedContent = enhancedContent.replace(
      /<blockquote([^>]*)>/g,
      '<blockquote$1 class="border-l-4 border-brand-orange pl-6 py-4 my-6 bg-gray-50 rounded-r-lg italic text-gray-700">'
    );

    // Add styling to code blocks
    enhancedContent = enhancedContent.replace(
      /<pre([^>]*)>/g,
      '<pre$1 class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-6 text-sm">'
    );

    // Add styling to inline code
    enhancedContent = enhancedContent.replace(
      /<code([^>]*)>/g,
      '<code$1 class="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono">'
    );

    // Add styling to tables
    enhancedContent = enhancedContent.replace(
      /<table([^>]*)>/g,
      '<div class="overflow-x-auto my-6"><table$1 class="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">'
    );

    enhancedContent = enhancedContent.replace(
      /<\/table>/g,
      '</table></div>'
    );

    enhancedContent = enhancedContent.replace(
      /<th([^>]*)>/g,
      '<th$1 class="bg-gray-100 border border-gray-300 px-4 py-2 text-left font-semibold">'
    );

    enhancedContent = enhancedContent.replace(
      /<td([^>]*)>/g,
      '<td$1 class="border border-gray-300 px-4 py-2">'
    );

    return enhancedContent;
  };

  return (
    <section className="bg-white">
      <div className="container py-16">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Table of Contents Sidebar */}
          {tableOfContents.length > 0 && (
            <div className="lg:col-span-3">
              <div className="sticky top-24">
                <div className="bg-gray-50 rounded-xl p-6 border">
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="h-5 w-5 text-brand-orange" />
                    <h3 className="font-semibold text-gray-900">Table of Contents</h3>
                  </div>
                  <nav aria-label="Table of contents">
                    <ul className="space-y-2">
                      {tableOfContents.map((item) => (
                        <li key={item.id}>
                          <button
                            onClick={() => scrollToHeading(item.id)}
                            className={`
                              text-left w-full text-sm transition-colors hover:text-brand-orange
                              ${item.level === 1 ? 'font-semibold' : ''}
                              ${item.level === 2 ? 'ml-3' : ''}
                              ${item.level === 3 ? 'ml-6' : ''}
                              ${item.level >= 4 ? 'ml-9' : ''}
                              ${activeHeading === item.id ? 'text-brand-orange font-medium' : 'text-gray-600'}
                            `}
                          >
                            {item.text}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>

                {/* Reading Progress */}
                <div className="mt-6 bg-white rounded-xl p-6 border shadow-sm">
                  <h4 className="font-semibold text-gray-900 mb-3">Keep Reading</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Enjoying this article? Subscribe to our newsletter for more insights.
                  </p>
                  <Button 
                    size="sm" 
                    className="w-full bg-brand-orange hover:bg-brand-orange/90"
                    onClick={() => {
                      const element = document.getElementById('newsletter-signup');
                      element?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Subscribe Now
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className={`${tableOfContents.length > 0 ? 'lg:col-span-9' : 'lg:col-span-12 max-w-4xl mx-auto'}`}>
            <article className="prose prose-lg prose-gray max-w-none">
              {/* Article Content */}
              <div 
                className="blog-content"
                dangerouslySetInnerHTML={{ 
                  __html: enhanceContent(post.content) 
                }}
                style={{
                  // Custom CSS for better typography
                  lineHeight: '1.7',
                  fontSize: '1.125rem',
                }}
              />

              {/* Article Footer */}
              <footer className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">Share this article:</span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`;
                          window.open(url, '_blank', 'noopener,noreferrer');
                        }}
                        className="text-gray-600 hover:text-blue-500 border-gray-300"
                      >
                        Twitter
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`;
                          window.open(url, '_blank', 'noopener,noreferrer');
                        }}
                        className="text-gray-600 hover:text-blue-700 border-gray-300"
                      >
                        LinkedIn
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
                          window.open(url, '_blank', 'noopener,noreferrer');
                        }}
                        className="text-gray-600 hover:text-blue-600 border-gray-300"
                      >
                        Facebook
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MessageCircle className="h-4 w-4" />
                    <span>Have questions? Contact our team</span>
                  </div>
                </div>
              </footer>
            </article>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          size="sm"
          className="fixed bottom-8 right-8 z-50 rounded-full w-12 h-12 p-0 bg-brand-orange hover:bg-brand-orange/90 shadow-lg"
          aria-label="Scroll to top"
        >
          <ChevronUp className="h-5 w-5" />
        </Button>
      )}

      {/* Enhanced CSS for blog content */}
      <style jsx global>{`
        .blog-content h1,
        .blog-content h2,
        .blog-content h3,
        .blog-content h4,
        .blog-content h5,
        .blog-content h6 {
          margin-top: 2rem;
          margin-bottom: 1rem;
          font-weight: 600;
          line-height: 1.3;
          color: #111827;
        }

        .blog-content h1 { font-size: 2.25rem; }
        .blog-content h2 { font-size: 1.875rem; }
        .blog-content h3 { font-size: 1.5rem; }
        .blog-content h4 { font-size: 1.25rem; }
        .blog-content h5 { font-size: 1.125rem; }
        .blog-content h6 { font-size: 1rem; }

        .blog-content p {
          margin-bottom: 1.5rem;
          line-height: 1.7;
        }

        .blog-content ul,
        .blog-content ol {
          margin-bottom: 1.5rem;
          padding-left: 1.5rem;
        }

        .blog-content li {
          margin-bottom: 0.5rem;
          line-height: 1.6;
        }

        .blog-content a {
          color: #e86e2a;
          text-decoration: underline;
          text-decoration-color: rgba(232, 110, 42, 0.3);
          text-underline-offset: 2px;
          transition: all 0.2s ease;
        }

        .blog-content a:hover {
          color: #d9511c;
          text-decoration-color: #d9511c;
        }

        .blog-content strong {
          font-weight: 600;
          color: #111827;
        }

        .blog-content em {
          font-style: italic;
        }

        .blog-content hr {
          margin: 2rem 0;
          border: none;
          border-top: 1px solid #e5e7eb;
        }

        @media (max-width: 768px) {
          .blog-content h1 { font-size: 1.875rem; }
          .blog-content h2 { font-size: 1.5rem; }
          .blog-content h3 { font-size: 1.25rem; }
        }
      `}</style>
    </section>
  );
}