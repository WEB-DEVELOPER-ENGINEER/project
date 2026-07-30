'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar,
  Milestone,
  TrendingUp,
  Award,
  Users,
  Globe,
  Building,
  Rocket
} from 'lucide-react';

interface AboutTimelineProps {
  aboutData: any;
  siteSettings: Record<string, any>;
}

export function AboutTimeline({ aboutData, siteSettings }: AboutTimelineProps) {
  const companyName = siteSettings.company_name || 'JUSOR';
  const foundingYear = siteSettings.founding_date ? new Date(siteSettings.founding_date).getFullYear() : 2008;

  // Default timeline if not provided in aboutData
  const defaultTimeline = [
    {
      year: foundingYear.toString(),
      title: 'Company Founded',
      description: `${companyName} was established with a vision to break down language barriers and enable global communication through professional translation services.`,
      icon: Building,
      color: 'text-brand-orange',
      bgColor: 'bg-brand-orange/10'
    },
    {
      year: (foundingYear + 2).toString(),
      title: 'First Major Milestone',
      description: 'Completed our 100th translation project and established partnerships with key clients in the legal and business sectors.',
      icon: Milestone,
      color: 'text-brand-blue',
      bgColor: 'bg-brand-blue/10'
    },
    {
      year: (foundingYear + 5).toString(),
      title: 'Team Expansion',
      description: 'Grew our team to 25+ certified translators and expanded our language offerings to cover 30+ language pairs.',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      year: (foundingYear + 8).toString(),
      title: 'Quality Process Milestone',
      description: 'Formalized our quality management process, demonstrating our commitment to international quality standards.',
      icon: Award,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      year: (foundingYear + 12).toString(),
      title: 'Global Reach',
      description: 'Expanded our services globally, serving clients across 40+ countries with 50+ language pairs.',
      icon: Globe,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    },
    {
      year: new Date().getFullYear().toString(),
      title: 'Innovation & Growth',
      description: 'Integrated cutting-edge technology with human expertise, serving 500+ clients with 99.8% satisfaction rate.',
      icon: Rocket,
      color: 'text-brand-orange',
      bgColor: 'bg-brand-orange/10'
    }
  ];

  const timeline = aboutData.timeline || defaultTimeline;

  return (
    <section className="bg-white py-20">
      <div className="container">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center rounded-full bg-brand-blue/10 px-4 py-2 text-sm font-medium text-brand-blue mb-6">
            <Calendar className="h-4 w-4 mr-2" />
            Our Journey
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            Milestones & Achievements
          </h2>
          <p className="text-lg text-gray-600">
            From humble beginnings to global recognition—discover the key moments that shaped our journey
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-brand-orange via-brand-blue to-brand-orange transform md:-translate-x-1/2" />

          <div className="space-y-12">
            {timeline.map((item, index) => {
              const IconComponent = item.icon || Milestone;
              const isEven = index % 2 === 0;

              return (
                <div 
                  key={index}
                  className={`relative flex items-center ${
                    isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Timeline Node */}
                  <div className="absolute left-4 md:left-1/2 w-8 h-8 transform md:-translate-x-1/2 z-10">
                    <div className={`w-8 h-8 ${item.bgColor || 'bg-gray-100'} rounded-full flex items-center justify-center border-4 border-white shadow-lg`}>
                      <IconComponent className={`h-4 w-4 ${item.color || 'text-gray-600'}`} />
                    </div>
                  </div>

                  {/* Content Card */}
                  <div className={`w-full md:w-5/12 ml-16 md:ml-0 ${
                    isEven ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'
                  }`}>
                    <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Badge className={`${item.color || 'text-gray-600'} bg-transparent border-current`}>
                            {item.year}
                          </Badge>
                          <div className="h-px flex-1 bg-gray-200" />
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-brand-orange transition-colors">
                          {item.title}
                        </h3>
                        
                        <p className="text-gray-600 leading-relaxed">
                          {item.description}
                        </p>

                        {/* Additional metrics if available */}
                        {item.metrics && (
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <div className="flex flex-wrap gap-4 text-sm">
                              {item.metrics.map((metric, metricIndex) => (
                                <div key={metricIndex} className="flex items-center gap-1">
                                  <TrendingUp className="h-3 w-3 text-green-500" />
                                  <span className="text-gray-600">{metric}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Current Stats */}
        <div className="mt-20 bg-gradient-to-r from-brand-orange/5 to-brand-blue/5 rounded-2xl p-8 lg:p-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
              Where We Stand Today
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our journey continues as we strive to set new standards in the translation industry
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-brand-orange mb-2">
                {new Date().getFullYear() - foundingYear}+
              </div>
              <div className="text-sm text-gray-600">Years of Excellence</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-brand-blue mb-2">500+</div>
              <div className="text-sm text-gray-600">Projects Completed</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-brand-orange mb-2">50+</div>
              <div className="text-sm text-gray-600">Language Pairs</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-brand-blue mb-2">99.8%</div>
              <div className="text-sm text-gray-600">Client Satisfaction</div>
            </div>
          </div>
        </div>

        {/* Future Vision */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Looking Ahead
          </h3>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            As we continue to grow, our commitment to excellence remains unwavering. We're excited about 
            the future of translation technology and our role in shaping a more connected, multilingual world. 
            Our journey is far from over—the best is yet to come.
          </p>
        </div>
      </div>
    </section>
  );
}