'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  Clock, 
  Users, 
  Globe, 
  Shield, 
  Award,
  Zap,
  Target
} from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { Project } from '@/lib/types';

interface ProjectDetailSpecsProps {
  project: Project;
  siteSettings?: Record<string, any>;
}

export function ProjectDetailSpecs({ project, siteSettings = {} }: ProjectDetailSpecsProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Use dynamic data from the database
  const specifications = {
    technical: [
      ...(project.technical_details?.source_language ? [{ label: "Source Language", value: project.technical_details.source_language, icon: Globe }] : []),
      ...(project.technical_details?.target_language ? [{ label: "Target Language", value: project.technical_details.target_language, icon: Globe }] : []),
      ...(project.technical_details?.document_type ? [{ label: "Document Type", value: project.technical_details.document_type, icon: FileText }] : []),
      ...(project.word_count ? [{ label: "Word Count", value: `${project.word_count.toLocaleString()} words`, icon: FileText }] : []),
      ...(project.technical_details?.page_count ? [{ label: "Page Count", value: `${project.technical_details.page_count} pages`, icon: FileText }] : []),
      ...(project.technical_details?.file_format ? [{ label: "File Format", value: project.technical_details.file_format, icon: FileText }] : [])
    ],
    process: [
      ...(project.duration_days ? [{ label: "Project Duration", value: `${project.duration_days} days`, icon: Clock }] : []),
      ...(project.team_size ? [{ label: "Team Members", value: `${project.team_size} specialists`, icon: Users }] : []),
      ...(project.process_details?.review_rounds ? [{ label: "Review Rounds", value: `${project.process_details.review_rounds} iterations`, icon: Target }] : []),
      ...(project.process_details?.quality_checks ? [{ label: "Quality Checks", value: `${project.process_details.quality_checks} stages`, icon: Shield }] : []),
      ...(project.process_details?.delivery_method ? [{ label: "Delivery Method", value: project.process_details.delivery_method, icon: Zap }] : []),
      ...(project.certifications?.length ? [{ label: "Certifications", value: project.certifications.join(", "), icon: Award }] : [])
    ]
  };

  const qualityMetrics = [
    ...(project.quality_metrics?.translation_accuracy ? [{ label: "Translation Accuracy", value: project.quality_metrics.translation_accuracy, color: "bg-brand-orange" }] : []),
    ...(project.quality_metrics?.cultural_adaptation ? [{ label: "Cultural Adaptation", value: project.quality_metrics.cultural_adaptation, color: "bg-brand-blue" }] : []),
    ...(project.quality_metrics?.terminology_consistency ? [{ label: "Terminology Consistency", value: project.quality_metrics.terminology_consistency, color: "bg-green-500" }] : []),
    ...(project.quality_metrics?.client_satisfaction ? [{ label: "Client Satisfaction", value: project.quality_metrics.client_satisfaction, color: "bg-purple-500" }] : [])
  ];

  const certifications = project.certifications || [];

  return (
    <section 
      ref={ref}
      className="py-16 bg-white"
      aria-labelledby="project-specs-heading"
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
              id="project-specs-heading"
              className="text-3xl font-bold text-gray-900 mb-4"
            >
              Technical Specifications
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg">
              Detailed technical specifications and quality metrics that demonstrate our 
              professional approach and commitment to excellence.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Technical Specifications */}
            <div 
              className={`transition-all duration-700 delay-200 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <Card className="border-0 shadow-lg h-full">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <FileText className="h-6 w-6 text-brand-orangeText mr-3" />
                    Technical Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {specifications.technical.map((spec, index) => (
                      <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                        <div className="flex items-center">
                          <spec.icon className="h-4 w-4 text-gray-500 mr-3" />
                          <span className="text-gray-600">{spec.label}</span>
                        </div>
                        <span className="font-medium text-gray-900">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Process Specifications */}
            <div 
              className={`transition-all duration-700 delay-300 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <Card className="border-0 shadow-lg h-full">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <Zap className="h-6 w-6 text-brand-blue mr-3" />
                    Process & Quality
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {specifications.process.map((spec, index) => (
                      <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                        <div className="flex items-center">
                          <spec.icon className="h-4 w-4 text-gray-500 mr-3" />
                          <span className="text-gray-600">{spec.label}</span>
                        </div>
                        <span className="font-medium text-gray-900">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Quality Metrics */}
          <div 
            className={`mb-12 transition-all duration-700 delay-400 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <Target className="h-6 w-6 text-brand-orangeText mr-3" />
                  Quality Metrics & Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  {qualityMetrics.map((metric, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-medium">{metric.label}</span>
                        <span className="text-gray-900 font-bold">{metric.value}%</span>
                      </div>
                      <Progress 
                        value={metric.value} 
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Certifications & Standards */}
          <div 
            className={`transition-all duration-700 delay-500 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <Award className="h-6 w-6 text-brand-blue mr-3" />
                  Certifications & Standards
                </CardTitle>
              </CardHeader>
              <CardContent>
                {certifications.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {certifications.map((cert, index) => (
                      <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
                        <Shield className="h-5 w-5 text-brand-orangeText mr-3 flex-shrink-0" />
                        <span className="text-gray-700 font-medium">{cert}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No certifications specified for this project.</p>
                )}
                
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <p className="text-gray-600 text-sm leading-relaxed">
                    All our translation projects adhere to international standards and are delivered 
                    by certified professionals. We maintain strict quality control processes to ensure 
                    accuracy, consistency, and cultural appropriateness in every project.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
