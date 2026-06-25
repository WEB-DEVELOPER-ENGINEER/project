'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Globe, Users, Award, Target, CheckCircle } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { Project } from '@/lib/types';

interface ProjectDetailContentProps {
  project: Project;
  siteSettings?: Record<string, any>;
}

export function ProjectDetailContent({ project, siteSettings = {} }: ProjectDetailContentProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Use dynamic data from the database with safe array handling
  const projectDetails = {
    challenge: project.challenge || "Project challenge information not available.",
    solution: project.solution || "Project solution information not available.",
    scope: Array.isArray(project.scope) ? project.scope : (project.scope ? [project.scope] : []),
    languages: Array.isArray(project.languages) ? project.languages : (project.languages ? [project.languages] : []),
    industry: project.industry || "Not specified",
    deliverables: Array.isArray(project.deliverables) ? project.deliverables : (project.deliverables ? [project.deliverables] : [])
  };

  const keyFeatures = [
    {
      icon: Globe,
      title: "Multi-Language Expertise",
      description: "Professional translation across multiple language pairs with native speaker accuracy."
    },
    {
      icon: Award,
      title: "Certified Quality",
      description: "All translations reviewed by certified professionals and quality assured."
    },
    {
      icon: Users,
      title: "Collaborative Process",
      description: "Close collaboration with clients throughout the project lifecycle."
    },
    {
      icon: Target,
      title: "Industry Focus",
      description: "Specialized knowledge in technical and business terminology."
    }
  ];

  return (
    <section 
      ref={ref}
      className="py-16 bg-gray-50"
      aria-labelledby="project-content-heading"
    >
      <div className="container">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div 
            className={`text-center mb-12 transition-all duration-700 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <h2 
              id="project-content-heading"
              className="text-3xl font-bold text-gray-900 mb-4"
            >
              Project Details & Approach
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg">
              Discover the comprehensive approach and methodology we employed to deliver 
              exceptional translation services for this project.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Challenge & Solution */}
              <div 
                className={`transition-all duration-700 delay-200 ${
                  inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center mb-2">
                      <FileText className="h-6 w-6 text-brand-orange mr-3" />
                      <CardTitle className="text-xl">Project Challenge</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {projectDetails.challenge}
                    </p>
                    
                    <h4 className="font-semibold text-gray-900 mb-3">Our Solution</h4>
                    <p className="text-gray-600 leading-relaxed">
                      {projectDetails.solution}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Key Features */}
              <div 
                className={`transition-all duration-700 delay-300 ${
                  inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Key Project Features</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {keyFeatures.map((feature, index) => (
                    <Card 
                      key={index}
                      className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start">
                          <div className="bg-brand-orange/10 rounded-lg p-3 mr-4">
                            <feature.icon className="h-6 w-6 text-brand-orange" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">
                              {feature.title}
                            </h4>
                            <p className="text-gray-600 text-sm leading-relaxed">
                              <div 
                                className="prose prose-sm max-w-none"
                                dangerouslySetInnerHTML={{ __html: feature.description }}
                              />
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Project Scope */}
              <div 
                className={`transition-all duration-700 delay-400 ${
                  inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl">Project Scope & Deliverables</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Scope of Work</h4>
                        {projectDetails.scope.length > 0 ? (
                          <ul className="space-y-2">
                            {projectDetails.scope.map((item, index) => (
                              <li key={index} className="flex items-start">
                                <CheckCircle className="h-5 w-5 text-brand-orange mr-2 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-600">{item}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-500 italic">Project scope details will be updated soon.</p>
                        )}
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Key Deliverables</h4>
                        {projectDetails.deliverables.length > 0 ? (
                          <ul className="space-y-2">
                            {projectDetails.deliverables.map((item, index) => (
                              <li key={index} className="flex items-start">
                                <CheckCircle className="h-5 w-5 text-brand-blue mr-2 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-600">{item}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-500 italic">Project deliverables will be updated soon.</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div 
                className={`sticky top-8 transition-all duration-700 delay-500 ${
                  inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg">Project Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Languages */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Languages</h4>
                      {projectDetails.languages.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {projectDetails.languages.map((lang, index) => (
                            <Badge 
                              key={index}
                              variant="secondary"
                              className="bg-brand-orange/10 text-brand-orange hover:bg-brand-orange/20"
                            >
                              {lang}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 italic">Language information will be updated soon.</p>
                      )}
                    </div>

                    {/* Industry */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Industry</h4>
                      <Badge 
                        variant="outline"
                        className="border-brand-blue text-brand-blue"
                      >
                        {projectDetails.industry}
                      </Badge>
                    </div>

                    {/* Project Stats */}
                    <div className="pt-4 border-t border-gray-100">
                      <h4 className="font-semibold text-gray-900 mb-4">Project Stats</h4>
                      <div className="space-y-3">
                        {project.duration_days && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Duration</span>
                            <span className="font-medium">{project.duration_days} days</span>
                          </div>
                        )}
                        {project.team_size && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Team Size</span>
                            <span className="font-medium">{project.team_size} specialists</span>
                          </div>
                        )}
                        {project.word_count && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Word Count</span>
                            <span className="font-medium">{project.word_count.toLocaleString()} words</span>
                          </div>
                        )}
                        {project.quality_metrics?.client_satisfaction && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Quality Score</span>
                            <span className="font-medium text-brand-orange">{project.quality_metrics.client_satisfaction}%</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-600 mb-3">
                        Need a similar project?
                      </p>
                      <button 
                        className="w-full bg-brand-blue hover:bg-brand-blue/90 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                        onClick={() => window.location.href = '/contact#contact-form-section'}
                      >
                        Get Your Quote
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
