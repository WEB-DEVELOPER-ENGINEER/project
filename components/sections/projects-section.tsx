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

export function ProjectsSection({ projects, siteSettings = {} }: ProjectsSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

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

  const projectCategories = [
    { name: 'Legal Translation', color: 'bg-blue-100 text-blue-800' },
    { name: 'Technical Translation', color: 'bg-green-100 text-green-800' },
    { name: 'Business Translation', color: 'bg-purple-100 text-purple-800' },
    { name: 'Medical Translation', color: 'bg-red-100 text-red-800' },
    { name: 'Academic Translation', color: 'bg-yellow-100 text-yellow-800' },
  ];

  const getCategoryStyle = (title: string) => {
    const category = projectCategories.find(cat => 
      title.toLowerCase().includes(cat.name.toLowerCase().split(' ')[0])
    );
    return category ? category.color : 'bg-gray-100 text-gray-800';
  };

  return (
    <section id="projects-section" className="section-padding bg-white">
      <div className="container">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center rounded-full bg-brand-blue/10 px-4 py-2 text-sm font-medium text-brand-blue mb-4">
            {siteSettings.projects_section_badge || 'Our Projects'}
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
            {siteSettings.projects_section_title || 'Successful Translation Projects'}
          </h2>
          <p className="text-lg text-gray-600">
            {siteSettings.projects_section_description || 'Explore our portfolio of successful translation projects across various industries and document types, showcasing our expertise and quality standards.'}
          </p>
        </div>

        {/* Projects Carousel */}
        <div className="relative">
          {/* Navigation Buttons */}
          {projects.length > itemsPerPage && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white shadow-lg rounded-full p-3 hover:shadow-xl transition-all"
                aria-label="Previous projects"
              >
                <ChevronLeft className="h-6 w-6 text-gray-600" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white shadow-lg rounded-full p-3 hover:shadow-xl transition-all"
                aria-label="Next projects"
              >
                <ChevronRight className="h-6 w-6 text-gray-600" />
              </button>
            </>
          )}

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentProjects.map((project) => (
              <Card key={project.id} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white overflow-hidden">
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
                          <h4 className="font-semibold text-gray-900">Translation Project</h4>
                        </div>
                      </div>
                    )}
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* View Project Button */}
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button 
                        size="sm" 
                        className="w-full bg-white/90 hover:bg-white text-gray-900"
                        onClick={() => {
                          // Navigate to project details or open modal
                          window.location.href = `/projects/${project.slug}`;
                        }}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Project
                      </Button>
                    </div>
                  </div>

                  {/* Project Content */}
                  <div className="p-6">
                    {/* Category Badge */}
                    <Badge 
                      variant="secondary" 
                      className={`mb-3 ${getCategoryStyle(project.title)}`}
                    >
                      {project.title.includes('Legal') ? 'Legal' :
                       project.title.includes('Technical') ? 'Technical' :
                       project.title.includes('Business') ? 'Business' :
                       project.title.includes('Medical') ? 'Medical' :
                       project.title.includes('Academic') ? 'Academic' : 'Translation'}
                    </Badge>

                    <h3 className="font-bold text-xl text-gray-900 mb-3 line-clamp-2">
                      {project.title}
                    </h3>
                    
                    <div className="text-gray-600 text-sm line-clamp-3 mb-4">
                      <SimpleText 
                        content={project.description}
                        className="text-gray-600 text-sm"
                      />
                    </div>

                    {/* Project Stats */}
                    <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
                      <span>Project #{project.id.toString().padStart(3, '0')}</span>
                      <span>{project.images?.length || 0} Images</span>
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
          <div className="bg-gradient-to-r from-brand-orange/5 to-brand-blue/5 rounded-2xl p-8 border">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {siteSettings.projects_cta_title || 'Ready to Start Your Translation Project?'}
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              {siteSettings.projects_cta_description || 'Join hundreds of satisfied clients who trust us for their translation needs. Get a free quote for your project today.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-brand-orange hover:bg-brand-orange/90"
                onClick={() => {
                  window.location.href = '/contact';
                }}
              >
                {siteSettings.projects_cta_primary_text || 'Get Free Quote'}
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white"
                onClick={() => {
                  window.location.href = siteSettings.projects_cta_secondary_url || '/projects';
                }}
              >
                {siteSettings.projects_cta_secondary_text || 'View All Projects'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}