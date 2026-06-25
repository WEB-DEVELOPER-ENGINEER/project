'use client';

import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { RichText } from '@/components/ui/safe-html';
import { Calendar, MapPin, Users, Award, Globe, Rocket, Building, Target } from 'lucide-react';
import { AboutUs, AboutTimelinePhase } from '@/lib/types';

interface AboutTimelineEnhancedProps {
  aboutData: AboutUs;
  siteSettings: Record<string, any>;
}

// Icon mapping for dynamic icon selection
const iconMap = {
  Calendar,
  MapPin,
  Users,
  Award,
  Globe,
  Rocket,
  Building,
  Target,
};

export function AboutTimelineEnhanced({ aboutData, siteSettings }: AboutTimelineEnhancedProps) {
  const companyName = siteSettings.company_name || 'JUSOR';

  // Default timeline if none provided
  const defaultTimeline: AboutTimelinePhase[] = [
    {
      year: '2008',
      title: 'Foundation',
      description: 'JUSOR was founded with a vision to break down language barriers and connect cultures through professional translation services.',
      icon: 'Building',
      sort_order: 1
    },
    {
      year: '2012',
      title: 'Team Expansion',
      description: 'Expanded our team to include specialized translators in legal, technical, and medical fields, establishing our reputation for expertise.',
      icon: 'Users',
      sort_order: 2
    },
    {
      year: '2015',
      title: 'ISO Certification',
      description: 'Achieved ISO 17100:2015 certification, demonstrating our commitment to quality and international standards in translation services.',
      icon: 'Award',
      sort_order: 3
    },
    {
      year: '2018',
      title: 'Global Reach',
      description: 'Expanded operations to serve clients across multiple continents, establishing partnerships with local experts worldwide.',
      icon: 'Globe',
      sort_order: 4
    },
    {
      year: '2020',
      title: 'Digital Innovation',
      description: 'Launched advanced digital platforms and AI-assisted tools while maintaining our commitment to human expertise and cultural sensitivity.',
      icon: 'Rocket',
      sort_order: 5
    },
    {
      year: '2024',
      title: 'Future Vision',
      description: 'Continuing to innovate and expand our services, setting new standards for quality and cultural understanding in the translation industry.',
      icon: 'Target',
      sort_order: 6
    }
  ];

  // Use provided timeline or defaults, sorted by sort_order
  const timeline = (aboutData.timeline_phases && aboutData.timeline_phases.length > 0 
    ? aboutData.timeline_phases 
    : defaultTimeline)
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

  const getIcon = (iconName?: string) => {
    if (!iconName || !iconMap[iconName as keyof typeof iconMap]) {
      return Calendar; // Default icon
    }
    return iconMap[iconName as keyof typeof iconMap];
  };

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
            Company Timeline
          </h2>
          <p className="text-lg text-gray-600">
            Discover the key milestones that have shaped our growth and success over the years
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Timeline */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-brand-orange via-brand-blue to-brand-orange"></div>
            
            <div className="space-y-8">
              {timeline.map((phase, index) => {
                const IconComponent = getIcon(phase.icon);
                const isEven = index % 2 === 0;
                
                return (
                  <div key={phase.id || index} className="relative flex items-start gap-6">
                    {/* Timeline Icon */}
                    <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
                      isEven ? 'bg-brand-orange text-white' : 'bg-brand-blue text-white'
                    }`}>
                      <IconComponent className="h-6 w-6" />
                    </div>

                    {/* Timeline Content */}
                    <Card className="flex-1 border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <span className={`text-2xl font-bold ${
                            isEven ? 'text-brand-orange' : 'text-brand-blue'
                          }`}>
                            {phase.year}
                          </span>
                          <div className="h-px flex-1 bg-gray-200"></div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                          {phase.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {phase.description}
                        </p>
                        {phase.image_url && (
                          <div className="mt-4 relative aspect-video rounded-lg overflow-hidden">
                            <Image
                              src={phase.image_url}
                              alt={`${phase.title} - ${phase.year}`}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, 50vw"
                            />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Timeline Image */}
          <div className="relative lg:sticky lg:top-8">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br from-brand-orange/10 to-brand-blue/10 shadow-xl">
              {aboutData.timeline_image_url ? (
                <Image
                  src={aboutData.timeline_image_url}
                  alt={`${companyName} Timeline and History`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center p-8">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <Calendar className="h-10 w-10 text-brand-blue" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3">
                      Our Journey
                    </h3>
                    <p className="text-gray-600">
                      Years of growth, innovation, and excellence
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Floating Stats */}
            <div className="absolute -bottom-6 -right-6 bg-white rounded-xl p-6 shadow-xl border">
              <div className="text-center">
                <div className="text-2xl font-bold text-brand-orange mb-1">
                  {new Date().getFullYear() - 2008}+
                </div>
                <div className="text-sm text-gray-600">Years of Excellence</div>
              </div>
            </div>

            <div className="absolute -top-6 -left-6 bg-white rounded-xl p-6 shadow-xl border">
              <div className="text-center">
                <div className="text-2xl font-bold text-brand-blue mb-1">{timeline.length}</div>
                <div className="text-sm text-gray-600">Key Milestones</div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Summary */}
        <div className="mt-20 bg-gradient-to-r from-gray-50 to-white rounded-2xl p-8 lg:p-12">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
              Looking Ahead
            </h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              Our journey continues as we embrace new technologies, expand our global reach, 
              and maintain our commitment to excellence. Each milestone represents not just our growth, 
              but our dedication to helping clients communicate effectively across cultures and languages.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}