'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Clock, Globe, MapPin, Share2 } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { Project } from '@/lib/types';

interface ProjectDetailHeroProps {
  project: Project;
  siteSettings?: Record<string, any>;
}

export function ProjectDetailHero({ project, siteSettings = {} }: ProjectDetailHeroProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Recently';
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: project.title,
          text: project.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
      // You could show a toast notification here
    }
  };

  return (
    <section 
      ref={ref}
      className="relative overflow-hidden bg-gradient-to-br from-white via-gray-50 to-blue-50 pt-24 pb-16"
      aria-labelledby="project-hero-heading"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-gray-100/50 bg-[size:20px_20px] opacity-30" />
      <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-brand-orange/20 to-brand-blue/20 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-tr from-brand-blue/20 to-brand-orange/20 blur-3xl" />
      
      <div className="container relative">
        <div className="max-w-4xl">
          {/* Breadcrumb */}
          <nav 
            aria-label="Breadcrumb"
            className={`mb-8 transition-all duration-700 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <ol className="flex items-center space-x-2 text-sm text-gray-600">
              <li>
                <Link 
                  href="/" 
                  className="hover:text-brand-orange transition-colors duration-200"
                  aria-label="Go to homepage"
                >
                  Home
                </Link>
              </li>
              <li className="text-gray-400">/</li>
              <li>
                <Link 
                  href="/projects" 
                  className="hover:text-brand-orange transition-colors duration-200"
                  aria-label="Go to projects page"
                >
                  Projects
                </Link>
              </li>
              <li className="text-gray-400">/</li>
              <li className="text-brand-orange font-medium" aria-current="page">
                {project.title}
              </li>
            </ol>
          </nav>

          {/* Back Button */}
          <div 
            className={`mb-8 transition-all duration-700 delay-100 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <Button variant="outline" asChild>
              <Link href="/projects" className="inline-flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Projects
              </Link>
            </Button>
          </div>

          {/* Project Header */}
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              {/* Project Meta */}
              <div 
                className={`flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6 transition-all duration-700 delay-200 ${
                  inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  {project.project_date && (
                    <>
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{new Date(project.project_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</span>
                      <span className="mx-2">•</span>
                    </>
                  )}
                  {project.category && (
                    <>
                      <Badge variant="secondary" className="bg-brand-orange/10 text-brand-orange">
                        {project.category.charAt(0).toUpperCase() + project.category.slice(1)}
                      </Badge>
                      <span className="mx-2">•</span>
                    </>
                  )}
                  <Badge variant="outline" className={`${
                    project.status === 'completed' ? 'border-green-500 text-green-700' :
                    project.status === 'in_progress' ? 'border-brand-orange text-brand-orange' :
                    'border-gray-500 text-gray-700'
                  }`}>
                    {project.status ? project.status.charAt(0).toUpperCase() + project.status.slice(1).replace('_', ' ') : 'Unknown'}
                  </Badge>
                </div>
                <div className="flex items-center">
                  <Globe className="h-4 w-4 mr-2" aria-hidden="true" />
                  <span>Multi-language</span>
                </div>
              </div>

              {/* Project Title */}
              <h1 
                id="project-hero-heading"
                className={`text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl mb-6 transition-all duration-700 delay-300 ${
                  inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                {project.title}
              </h1>

              {/* Project Description */}
              <div 
                className={`prose prose-lg max-w-none text-gray-600 mb-8 transition-all duration-700 delay-400 ${
                  inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                <p className="text-xl leading-relaxed">{project.description}</p>
              </div>

              {/* Action Buttons */}
              <div 
                className={`flex flex-col sm:flex-row gap-4 transition-all duration-700 delay-500 ${
                  inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                <Button 
                  size="lg"
                  className="bg-brand-orange hover:bg-brand-orange/90 text-white px-8 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => window.location.href = '/contact#contact-form-section'}
                >
                  Start Similar Project
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  className="border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white px-8 py-3 font-semibold transition-all duration-300"
                  onClick={handleShare}
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Project
                </Button>
              </div>
            </div>

            {/* Project Quick Info Card */}
            <div 
              className={`lg:col-span-1 transition-all duration-700 delay-600 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Information</h3>
                
                <div className="space-y-3 text-sm">
                  {project.languages && project.languages.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Languages:</span>
                      <span className="font-medium">{project.languages.join(' → ')}</span>
                    </div>
                  )}
                  {project.industry && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Industry:</span>
                      <span className="font-medium">{project.industry}</span>
                    </div>
                  )}
                  {project.duration_days && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{project.duration_days} days</span>
                    </div>
                  )}
                  {project.team_size && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Team Size:</span>
                      <span className="font-medium">{project.team_size} specialists</span>
                    </div>
                  )}
                </div>

                {/* Contact CTA */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <p className="text-sm text-gray-600 mb-4">
                    Interested in a similar project?
                  </p>
                  <Button 
                    className="w-full bg-brand-blue hover:bg-brand-blue/90 text-white font-semibold"
                    onClick={() => window.location.href = '/contact#contact-form-section'}
                  >
                    Get Free Quote
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
