'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight,
  Calendar,
  Globe,
  ExternalLink
} from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { Project } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';

interface RelatedProjectsSectionProps {
  relatedProjects: Project[];
  currentProjectId: number;
  siteSettings?: Record<string, any>;
}

export function RelatedProjectsSection({ 
  relatedProjects, 
  currentProjectId, 
  siteSettings = {} 
}: RelatedProjectsSectionProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Filter out current project and limit to 3 related projects
  const filteredProjects = relatedProjects
    .filter(project => project.id !== currentProjectId)
    .slice(0, 3);

  if (filteredProjects.length === 0) {
    return null;
  }

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

  const getProjectImage = (project: Project) => {
    if (project.images && project.images.length > 0) {
      return project.images[0].image_url;
    }
    return '/images/placeholder-project.jpg'; // Fallback image
  };

  const getProjectAlt = (project: Project) => {
    if (project.images && project.images.length > 0 && project.images[0].alt_text) {
      return project.images[0].alt_text;
    }
    return `${project.title} project image`;
  };

  return (
    <section 
      ref={ref}
      className="py-16 bg-gray-50"
      aria-labelledby="related-projects-heading"
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
              id="related-projects-heading"
              className="text-3xl font-bold text-gray-900 mb-4"
            >
              Related Projects
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg">
              Explore other successful translation projects that showcase our expertise 
              and commitment to delivering exceptional results.
            </p>
          </div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {filteredProjects.map((project, index) => (
              <div
                key={project.id}
                className={`transition-all duration-700 ${
                  inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: `${(index + 1) * 150}ms` }}
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group h-full overflow-hidden">
                  {/* Project Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={getProjectImage(project)}
                      alt={getProjectAlt(project)}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Project Badge */}
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-white/90 text-gray-900 hover:bg-white/90">
                        <Globe className="h-3 w-3 mr-1" />
                        Translation
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-6 flex flex-col flex-grow">
                    {/* Project Meta */}
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(project.created_at)}
                    </div>

                    {/* Project Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-brand-orangeText transition-colors duration-200">
                      {project.title}
                    </h3>

                    {/* Project Description */}
                    <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3 flex-grow">
                      <div 
                        className="prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: project.description }}
                      />
                    </p>

                    {/* Project Tags/Categories */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="secondary" className="text-xs">
                        Professional
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        Technical
                      </Badge>
                    </div>

                    {/* View Project Link */}
                    <Link 
                      href={`/projects/${project.slug}`}
                      className="inline-flex items-center text-brand-blue hover:text-brand-blue/80 font-semibold transition-colors duration-200 group/link"
                    >
                      View Project Details
                      <ArrowRight className="h-4 w-4 ml-2 group-hover/link:translate-x-1 transition-transform duration-200" />
                    </Link>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* View All Projects CTA */}
          <div 
            className={`text-center transition-all duration-700 delay-500 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <Card className="border-0 shadow-lg bg-gradient-to-r from-brand-orange/5 to-brand-blue/5">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Discover More Projects
                </h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Explore our complete portfolio of translation projects across various industries 
                  and languages. Each project represents our commitment to quality and excellence.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button 
                    asChild
                    size="lg"
                    className="bg-brand-blue hover:bg-brand-blue/90 text-white"
                  >
                    <Link href="/projects">
                      <ExternalLink className="h-5 w-5 mr-2" />
                      View All Projects
                    </Link>
                  </Button>
                  
                  <Button 
                    asChild
                    variant="outline"
                    size="lg"
                    className="border-brand-orange text-brand-orangeText hover:bg-brand-orangeText hover:text-white"
                  >
                    <Link href="/contact#contact-form-section">
                      Start Your Project
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
