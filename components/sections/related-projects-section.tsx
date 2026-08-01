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
import { useLanguage } from '@/components/providers/LanguageProvider';
import { localizedPath } from '@/lib/locale';

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
  const { locale, isRtl } = useLanguage();

  const text = {
    en: {
      sectionTitle: 'Related Projects',
      sectionDesc: 'Explore other successful translation projects that showcase our expertise and commitment to delivering exceptional results.',
      cardTitle: 'Discover More Projects',
      cardDesc: 'Explore our complete portfolio of translation projects across various industries and languages. Each project represents our commitment to quality and excellence.',
      viewAll: 'View All Projects',
      startProject: 'Start Your Project'
    },
    ar: {
      sectionTitle: 'مشاريع ذات صلة',
      sectionDesc: 'استكشف مشاريع الترجمة الناجحة الأخرى التي تعرض خبرتنا والتزامنا بتقديم نتائج استثنائية.',
      cardTitle: 'اكتشف المزيد من المشاريع',
      cardDesc: 'استكشف محفظتنا الكاملة من مشاريع الترجمة عبر مختلف القطاعات واللغات. يمثل كل مشروع التزامنا بالجودة والتميز.',
      viewAll: 'عرض جميع المشاريع',
      startProject: 'ابدأ مشروعك الخاص'
    }
  }[locale] || {
    sectionTitle: 'Related Projects',
    sectionDesc: 'Explore other successful translation projects that showcase our expertise and commitment to delivering exceptional results.',
    cardTitle: 'Discover More Projects',
    cardDesc: 'Explore our complete portfolio of translation projects across various industries and languages. Each project represents our commitment to quality and excellence.',
    viewAll: 'View All Projects',
    startProject: 'Start Your Project'
  };

  // Filter out the current project and limit to 2 related projects
  const displayProjects = relatedProjects
    .filter(p => p.id !== currentProjectId)
    .slice(0, 2);

  if (displayProjects.length === 0) return null;

  const getIndustryIcon = (industry?: string) => {
    switch (industry?.toLowerCase()) {
      case 'legal':
      case 'law':
        return '⚖️';
      case 'medical':
      case 'healthcare':
        return '🩺';
      case 'technical':
      case 'engineering':
        return '⚙️';
      default:
        return '📄';
    }
  };

  const getProjectImage = (project: Project) => {
    if (project.images && project.images.length > 0) {
      return project.images[0].image_url;
    }
    return '/images/placeholder-project.jpg';
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
              {text.sectionTitle}
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
              {text.sectionDesc}
            </p>
          </div>

          {/* Related Projects Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {displayProjects.map((project, index) => (
              <Card 
                key={project.id || index} 
                className="overflow-hidden border-0 shadow-lg group hover:shadow-xl transition-all duration-300 flex flex-col h-full bg-white"
              >
                {/* Image Section */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100">
                  <Image 
                    src={getProjectImage(project)}
                    alt={getProjectAlt(project)}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  
                  {/* Category Badge */}
                  {project.category && (
                    <Badge className="absolute top-4 right-4 bg-brand-orangeText text-white border-0">
                      {project.category}
                    </Badge>
                  )}
                </div>

                {/* Content Section */}
                <CardContent className="p-6 flex flex-col flex-grow text-left rtl:text-right">
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-3 flex-wrap rtl:flex-row-reverse">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {project.project_date ? new Date(project.project_date).toLocaleDateString(locale, { year: 'numeric', month: 'short' }) : 'Completed'}
                    </span>
                    {project.industry && (
                      <span className="flex items-center gap-1 rtl:flex-row-reverse">
                        <span>{getIndustryIcon(project.industry)}</span>
                        <span>{project.industry}</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-brand-blue transition-colors">
                    {project.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                    {project.description}
                  </p>

                  <Button 
                    asChild 
                    variant="ghost" 
                    className="text-brand-blue hover:text-brand-blue/80 hover:bg-brand-blue/10 justify-start w-fit p-0 rtl:flex-row-reverse"
                  >
                    <Link href={localizedPath(`/projects/${project.slug}`, locale)}>
                      <span>{locale === 'ar' ? 'عرض دراسة الحالة' : 'View Case Study'}</span>
                      <ArrowRight className="h-4 w-4 ml-2 rtl:ml-0 rtl:mr-2 rtl:rotate-180" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Discover More CTA */}
          <div 
            className={`transition-all duration-700 delay-300 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {text.cardTitle}
                </h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto leading-relaxed">
                  {text.cardDesc}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button 
                    asChild
                    size="lg"
                    className="bg-brand-blue hover:bg-brand-blue/90 text-white"
                  >
                    <Link href={localizedPath("/projects", locale)} className="rtl:flex-row-reverse">
                      <ExternalLink className="h-5 w-5 mr-2 rtl:mr-0 rtl:ml-2" />
                      <span>{text.viewAll}</span>
                    </Link>
                  </Button>
                  
                  <Button 
                    asChild
                    variant="outline"
                    size="lg"
                    className="border-brand-orange text-brand-orangeText hover:bg-brand-orangeText hover:text-white"
                  >
                    <Link href={localizedPath("/contact#contact-form-section", locale)}>
                      {text.startProject}
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
