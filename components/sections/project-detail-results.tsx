'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Users, 
  Clock, 
  Star,
  CheckCircle,
  Award,
  Target,
  BarChart3
} from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { Project } from '@/lib/types';

interface ProjectDetailResultsProps {
  project: Project;
  siteSettings?: Record<string, any>;
}

export function ProjectDetailResults({ project, siteSettings = {} }: ProjectDetailResultsProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Use dynamic data from the database
  const projectResults = {
    keyMetrics: [
      ...(project.key_metrics?.accuracy_rate ? [{
        icon: TrendingUp,
        label: "Accuracy Rate",
        value: project.key_metrics.accuracy_rate,
        description: "Translation accuracy verified by independent review",
        color: "text-brand-orange"
      }] : []),
      ...(project.key_metrics?.delivery_time ? [{
        icon: Clock,
        label: "Delivery Time",
        value: project.key_metrics.delivery_time,
        description: "Project completion timeline",
        color: "text-brand-blue"
      }] : []),
      ...(project.key_metrics?.client_satisfaction ? [{
        icon: Users,
        label: "Client Satisfaction",
        value: project.key_metrics.client_satisfaction,
        description: "Client satisfaction rating",
        color: "text-green-600"
      }] : []),
      ...(project.key_metrics?.quality_score ? [{
        icon: Star,
        label: "Quality Score",
        value: project.key_metrics.quality_score,
        description: "Overall quality rating",
        color: "text-purple-600"
      }] : [])
    ],
    impact: {
      title: "Project Impact & Outcomes",
      description: project.challenge || "This translation project delivered significant value to the client.",
      outcomes: project.impact_outcomes || []
    },
    clientFeedback: {
      quote: project.client_testimonial?.quote || "",
      author: project.client_testimonial?.author || "",
      company: project.client_testimonial?.company || "",
      rating: project.client_testimonial?.rating || 0
    },
    achievements: project.achievements || []
  };

  return (
    <section 
      ref={ref}
      className="py-16 bg-gradient-to-br from-gray-50 to-blue-50/30"
      aria-labelledby="project-results-heading"
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
              id="project-results-heading"
              className="text-3xl font-bold text-gray-900 mb-4"
            >
              Results & Impact
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg">
              Measurable outcomes and client satisfaction metrics that demonstrate the success 
              and impact of our professional translation services.
            </p>
          </div>

          {/* Key Metrics */}
          <div 
            className={`grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 transition-all duration-700 delay-200 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {projectResults.keyMetrics.map((metric, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6 text-center">
                  <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-md group-hover:shadow-lg transition-shadow duration-300">
                    <metric.icon className={`h-8 w-8 ${metric.color}`} />
                  </div>
                  <div className={`text-3xl font-bold ${metric.color} mb-2`}>
                    {metric.value}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {metric.label}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {metric.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Project Impact */}
            <div 
              className={`transition-all duration-700 delay-300 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <Card className="border-0 shadow-lg h-full">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <TrendingUp className="h-6 w-6 text-brand-orange mr-3" />
                    {projectResults.impact.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {projectResults.impact.description}
                  </p>
                  
                  <h4 className="font-semibold text-gray-900 mb-4">Key Outcomes:</h4>
                  <ul className="space-y-3">
                    {projectResults.impact.outcomes.map((outcome, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-brand-orange mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Client Feedback */}
            <div 
              className={`transition-all duration-700 delay-400 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <Card className="border-0 shadow-lg h-full bg-gradient-to-br from-white to-blue-50/50">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <Star className="h-6 w-6 text-brand-blue mr-3" />
                    Client Testimonial
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Rating Stars */}
                  <div className="flex items-center mb-4">
                    {[...Array(projectResults.clientFeedback.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  
                  {/* Quote */}
                  <blockquote className="text-gray-700 italic leading-relaxed mb-6">
                    "{projectResults.clientFeedback.quote}"
                  </blockquote>
                  
                  {/* Attribution */}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="font-semibold text-gray-900">
                      {projectResults.clientFeedback.author}
                    </div>
                    <div className="text-brand-blue font-medium">
                      {projectResults.clientFeedback.company}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Achievements */}
          <div 
            className={`transition-all duration-700 delay-500 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <Award className="h-6 w-6 text-brand-orange mr-3" />
                  Project Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                {projectResults.achievements.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    {projectResults.achievements.map((achievement, index) => {
                      // Map icon names to actual icon components
                      const IconComponent = achievement.icon === 'Award' ? Award : 
                                          achievement.icon === 'Target' ? Target :
                                          achievement.icon === 'CheckCircle' ? CheckCircle :
                                          achievement.icon === 'BarChart3' ? BarChart3 : Award;
                      
                      return (
                        <div key={index} className="flex items-start p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                          <div className="bg-brand-orange/10 rounded-lg p-3 mr-4">
                            <IconComponent className="h-6 w-6 text-brand-orange" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">
                              {achievement.title}
                            </h4>
                            <p className="text-gray-600 text-sm leading-relaxed">
                              {achievement.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No achievements specified for this project.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
