'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, Eye, ExternalLink } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { Project } from '@/lib/types';

interface ProjectsGridSectionProps {
  projects: Project[];
  siteSettings?: Record<string, any>;
}

export function ProjectsGridSection({ projects, siteSettings = {} }: ProjectsGridSectionProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Don't render if no projects
  if (!projects || projects.length === 0) {
    return (
      <section className="section-padding bg-white">
        <div className="container">
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📁</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Projects Available</h2>
            <p className="text-gray-600 mb-8">We're currently updating our portfolio. Please check back soon!</p>
            <Button 
              onClick={() => window.location.href = '/contact#contact-form-section'}
              className="bg-brand-orange hover:bg-brand-orange/90"
            >
              Contact Us for Custom Projects
            </Button>
          </div>
        </div>
      </section>
    );
  }

  const sectionTitle = siteSettings.projects_grid_title || 'Featured Projects';
  const sectionDescription = siteSettings.projects_grid_description || 
    'Explore our diverse portfolio of successful translation and interpretation projects across various industries and languages.';

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short'
      });
    } catch {
      return 'Recent';
    }
  };

  return (
    <section 
      id="projects-grid-section"
      ref={ref}
      className="section-padding bg-white"
      aria-labelledby="projects-grid-heading"
    >
      <div className="container">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 
            id="projects-grid-heading"
            className={`text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-6 transition-all duration-700 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {sectionTitle}
          </h2>
          <p 
            className={`text-xl text-gray-600 leading-relaxed transition-all duration-700 delay-100 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {sectionDescription}
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => {
            const primaryImage = project.images?.[0];
            
            return (
              <Card 
                key={project.id}
                className={`group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 bg-white ${
                  inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{
                  transitionDelay: `${200 + index * 100}ms`
                }}
              >
                {/* Project Image */}
                {primaryImage && (
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={primaryImage.image_url}
                      alt={primaryImage.alt_text || project.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Hover actions */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button
                        size="sm"
                        className="bg-white/90 text-gray-900 hover:bg-white backdrop-blur-sm"
                        asChild
                      >
                        <Link href={`/projects/${project.slug}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </div>
                )}

                {/* Project Content */}
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" aria-hidden="true" />
                      <time dateTime={project.created_at}>
                        {formatDate(project.created_at)}
                      </time>
                    </div>
                  </div>

                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-brand-blue transition-colors duration-300 mb-2 line-clamp-2">
                    {project.title}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed mb-6 line-clamp-3">
                    {project.description}
                  </CardDescription>

                  {/* Project Images Count */}
                  {project.images && project.images.length > 1 && (
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <Eye className="h-4 w-4 mr-1" aria-hidden="true" />
                      <span>{project.images.length} images</span>
                    </div>
                  )}

                  {/* CTA Link */}
                  <Link 
                    href={`/projects/${project.slug}`}
                    className="inline-flex items-center text-brand-orange hover:text-brand-blue font-semibold transition-colors duration-300 group/link"
                    aria-label={`View details of ${project.title} project`}
                  >
                    View Project
                    <ArrowRight className="ml-2 h-4 w-4 group-hover/link:translate-x-1 transition-transform duration-300" aria-hidden="true" />
                  </Link>
                </CardContent>

                {/* Hover border effect */}
                <div className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-brand-orange/20 transition-colors duration-300 pointer-events-none" />
              </Card>
            );
          })}
        </div>

        {/* Load More / View All */}
        {projects.length >= 9 && (
          <div 
            className={`text-center mt-16 transition-all duration-700 delay-500 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <Button 
              variant="outline"
              size="lg"
              className="border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white px-8 py-3 font-semibold transition-all duration-300"
              onClick={() => {
                // In a real implementation, this would load more projects
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              View All Projects
              <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        )}

        {/* Bottom CTA */}
        <div 
          className={`text-center mt-16 transition-all duration-700 delay-600 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Start Your Project?
            </h3>
            <p className="text-gray-600 mb-6">
              Join our satisfied clients and let us help you break language barriers 
              with our professional translation and interpretation services.
            </p>
            <Button 
              size="lg"
              className="bg-brand-blue hover:bg-brand-blue/90 text-white px-8 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => window.location.href = '/contact#contact-form-section'}
            >
              Get Free Quote
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
