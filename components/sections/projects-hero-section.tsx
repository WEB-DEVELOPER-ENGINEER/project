'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, FolderOpen } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { Project } from '@/lib/types';

interface ProjectsHeroSectionProps {
  projects: Project[];
  totalProjects: number;
  siteSettings?: Record<string, any>;
}

export function ProjectsHeroSection({ projects, totalProjects, siteSettings = {} }: ProjectsHeroSectionProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const companyName = siteSettings.company_name || 'Jusor Translation Services';
  const heroTitle = siteSettings.projects_hero_title || 'Our Portfolio of Excellence';
  const heroDescription = siteSettings.projects_hero_description || 
    'Discover our successful translation and interpretation projects that have helped businesses break language barriers and expand globally.';

  // Key highlights for projects
  const highlights = [
    'Diverse industry expertise',
    'Certified quality translations',
    'Timely project delivery',
    'Client satisfaction guaranteed'
  ];

  const handleScrollToProjects = () => {
    const projectsSection = document.getElementById('projects-grid-section');
    if (projectsSection) {
      projectsSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleContactClick = () => {
    window.location.href = '/contact#contact-form-section';
  };

  return (
    <section 
      ref={ref}
      className="relative overflow-hidden bg-gradient-to-br from-white via-gray-50 to-blue-50 pt-24 pb-16 sm:pt-32 sm:pb-24"
      aria-labelledby="projects-hero-heading"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-gray-100/50 bg-[size:20px_20px] opacity-30" />
      <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-brand-orange/20 to-brand-blue/20 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-tr from-brand-blue/20 to-brand-orange/20 blur-3xl" />
      
      <div className="container relative">
        <div className="mx-auto max-w-4xl text-center">
          {/* Breadcrumb */}
          <nav 
            aria-label="Breadcrumb"
            className={`mb-6 transition-all duration-700 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <ol className="flex items-center justify-center space-x-2 text-sm text-gray-600">
              <li>
                <a 
                  href="/" 
                  className="hover:text-brand-orange transition-colors duration-200"
                  aria-label="Go to homepage"
                >
                  Home
                </a>
              </li>
              <li className="text-gray-400">/</li>
              <li className="text-brand-orange font-medium" aria-current="page">
                Projects
              </li>
            </ol>
          </nav>

          {/* Badge */}
          <div 
            className={`inline-flex items-center rounded-full bg-brand-orange/10 px-4 py-2 text-sm font-medium text-brand-orange mb-6 transition-all duration-700 delay-100 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <FolderOpen className="mr-2 h-4 w-4" aria-hidden="true" />
            Our Portfolio
          </div>

          {/* Main heading */}
          <h1 
            id="projects-hero-heading"
            className={`text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl mb-6 transition-all duration-700 delay-200 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {heroTitle}
          </h1>

          {/* Description */}
          <p 
            className={`text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed transition-all duration-700 delay-300 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {heroDescription}
          </p>

          {/* Highlights */}
          <div 
            className={`grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 max-w-2xl mx-auto transition-all duration-700 delay-400 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {highlights.map((highlight, index) => (
              <div 
                key={index}
                className="flex items-center text-left"
              >
                <CheckCircle 
                  className="h-5 w-5 text-brand-orange mr-3 flex-shrink-0" 
                  aria-hidden="true"
                />
                <span className="text-gray-700 font-medium">{highlight}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div 
            className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-700 delay-500 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <Button 
              size="lg"
              className="bg-brand-orange hover:bg-brand-orange/90 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
              onClick={handleScrollToProjects}
              aria-describedby="explore-projects-description"
            >
              Explore Our Projects
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" aria-hidden="true" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white px-8 py-3 text-lg font-semibold transition-all duration-300"
              onClick={handleContactClick}
              aria-describedby="start-project-description"
            >
              Start Your Project
            </Button>
          </div>

          {/* Screen reader descriptions */}
          <div className="sr-only">
            <p id="explore-projects-description">
              Scroll down to view our portfolio of successful translation and interpretation projects
            </p>
            <p id="start-project-description">
              Contact us to discuss your translation project requirements
            </p>
          </div>

          {/* Stats */}
          {totalProjects > 0 && (
            <div 
              className={`mt-16 pt-8 border-t border-gray-200 transition-all duration-700 delay-600 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-lg mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold text-brand-orange mb-2">
                    {totalProjects}+
                  </div>
                  <div className="text-gray-600 font-medium">
                    Completed Projects
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-brand-blue mb-2">
                    50+
                  </div>
                  <div className="text-gray-600 font-medium">
                    Languages Covered
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-brand-orange mb-2">
                    99%
                  </div>
                  <div className="text-gray-600 font-medium">
                    Client Satisfaction
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
