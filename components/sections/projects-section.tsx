'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, ExternalLink, FileText } from 'lucide-react';
import { SimpleText } from '@/components/ui/safe-html';
import { Project } from '@/lib/types';

interface ProjectsSectionProps {
  projects: Project[];
  siteSettings?: Record<string, any>;
}

import { useLanguage } from '@/components/providers/LanguageProvider';
import { cn } from '@/lib/utils';

export function ProjectsSection({ projects: rawProjects, siteSettings = {} }: ProjectsSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { t, isRtl } = useLanguage();

  // Always use the real projects from the database, regardless of language —
  // do not substitute fabricated case studies/client claims for Arabic.
  const projects = rawProjects || [];

  if (!projects || projects.length === 0) {
    return null;
  }

  const itemsPerPage = 3;
  const totalPages = Math.ceil(projects.length / itemsPerPage);
  const currentProjects = projects.slice(currentIndex, currentIndex + itemsPerPage);

  const nextSlide = () => {
    setCurrentIndex((prev) => 
      prev + itemsPerPage >= projects.length ? 0 : prev + itemsPerPage
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? Math.max(0, projects.length - itemsPerPage) : prev - itemsPerPage
    );
  };

  return (
    <section id="projects-section" className="section-padding bg-white dark:bg-gray-900">
      <div className="container">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center rounded-full bg-brand-blue/10 px-4 py-2 text-sm font-medium text-brand-blue mb-4">
            {isRtl ? 'مشاريعنا المنفذة' : 'Our Projects'}
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl mb-4">
            {t('projects.sectionTitle')}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {t('projects.sectionSubtitle')}
          </p>
        </div>

        {/* Projects Carousel */}
        <div className="relative">
          {/* Navigation Buttons */}
          {projects.length > itemsPerPage && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white dark:bg-gray-800 shadow-lg rounded-full p-3 hover:shadow-xl transition-all"
                aria-label="Previous projects"
              >
                <ChevronLeft className={cn('h-6 w-6 text-gray-600 dark:text-gray-300', isRtl && 'rotate-180')} />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white dark:bg-gray-800 shadow-lg rounded-full p-3 hover:shadow-xl transition-all"
                aria-label="Next projects"
              >
                <ChevronRight className={cn('h-6 w-6 text-gray-600 dark:text-gray-300', isRtl && 'rotate-180')} />
              </button>
            </>
          )}

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentProjects.map((project) => (
              <Card key={project.id} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white dark:bg-gray-800 overflow-hidden">
                <CardContent className="p-0">
                  {/* Project Image */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-brand-orange/10 to-brand-blue/10">
                    {project.images && project.images.length > 0 && project.images[0].image_url ? (
                      <Image
                        src={project.images[0].image_url}
                        alt={project.images[0].alt_text || project.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gradient-to-br from-brand-orange/20 to-brand-blue/20">
                        <div className="text-center p-6">
                          <FileText className="h-12 w-12 mx-auto mb-3 text-brand-blue" />
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                            {isRtl ? 'مشروع ترجمة معتمد' : 'Translation Project'}
                          </h4>
                        </div>
                      </div>
                    )}
                    
                    {/* View Project Button */}
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button 
                        size="sm" 
                        className="w-full bg-white/90 hover:bg-white text-gray-900"
                        onClick={() => {
                          window.location.href = `/projects/${project.slug}`;
                        }}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        {isRtl ? 'عرض تفاصيل المشروع' : 'View Project'}
                      </Button>
                    </div>
                  </div>

                  {/* Project Content */}
                  <div className="p-6">
                    <Badge variant="secondary" className="mb-3 bg-brand-orange/10 text-brand-orangeText">
                      {isRtl ? (project.category || 'ترجمة معتمدة') : 'Certified Translation'}
                    </Badge>

                    <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100 mb-3 line-clamp-2">
                      {project.title}
                    </h3>
                    
                    <div className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4">
                      <SimpleText 
                        content={project.description}
                        className="text-gray-600 dark:text-gray-300 text-sm"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination Dots */}
          {projects.length > itemsPerPage && (
            <div className="flex justify-center mt-8 gap-2">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index * itemsPerPage)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    Math.floor(currentIndex / itemsPerPage) === index
                      ? 'bg-brand-orange'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to page ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-brand-orange/5 to-brand-blue/5 rounded-2xl p-8 border border-gray-100 dark:border-gray-800">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {isRtl ? 'جاهز للبدء في مشروع الترجمة الخاص بك؟' : 'Ready to Start Your Translation Project?'}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              {isRtl ? 'انضم إلى مئات العملاء الواثقين في خدماتنا المعتمدة. احصل على عرض سعر مجاني لمشروعك اليوم.' : 'Join hundreds of satisfied clients who trust us for their translation needs. Get a free quote for your project today.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-brand-orangeText hover:bg-brand-orangeText/90 text-white"
                onClick={() => {
                  window.location.href = '/contact';
                }}
              >
                {t('hero.ctaQuote')}
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white"
                onClick={() => {
                  window.location.href = '/projects';
                }}
              >
                {isRtl ? 'عرض كافة المشاريع' : 'View All Projects'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}