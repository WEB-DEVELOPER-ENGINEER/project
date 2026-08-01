'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar,
  CheckCircle,
  Clock,
  Users,
  FileText,
  Send,
  Award
} from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { Project } from '@/lib/types';

interface ProjectDetailTimelineProps {
  project: Project;
  siteSettings?: Record<string, any>;
}

export function ProjectDetailTimeline({ project, siteSettings = {} }: ProjectDetailTimelineProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Use dynamic data from the database
  const timelineEvents = project.timeline_phases || [
  ];

  // If no timeline data, provide a basic fallback
  const defaultTimeline = [
    {
      id: 1,
      phase: "Project Initiation",
      date: "Day 1",
      status: "completed",
      icon: "FileText",
      title: "Requirements Analysis & Planning",
      description: "Initial client consultation and project planning.",
      details: ["Requirements gathering", "Project planning"],
      duration: "1 day"
    }
  ];

  const finalTimelineEvents = timelineEvents.length > 0 ? timelineEvents : defaultTimeline;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in-progress':
        return 'bg-brand-orange';
      case 'pending':
        return 'bg-gray-300';
      default:
        return 'bg-gray-300';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>;
      case 'in-progress':
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">In Progress</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <section 
      ref={ref}
      className="py-16 bg-white"
      aria-labelledby="project-timeline-heading"
    >
      <div className="container">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div 
            className={`text-center mb-12 transition-all duration-700 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <h2 
              id="project-timeline-heading"
              className="text-3xl font-bold text-gray-900 mb-4"
            >
              Project Timeline & Process
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg">
              A detailed timeline showing our systematic approach and the key milestones 
              achieved throughout the project lifecycle.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            
            {/* Timeline Events */}
            <div className="space-y-8">
              {finalTimelineEvents.map((event, index) => {
                // Map icon names to actual icon components
                const IconComponent = event.icon === 'FileText' ? FileText : 
                                    event.icon === 'Users' ? Users :
                                    event.icon === 'Clock' ? Clock :
                                    event.icon === 'CheckCircle' ? CheckCircle :
                                    event.icon === 'Send' ? Send :
                                    event.icon === 'Award' ? Award : FileText;
                
                return (
                  <div 
                    key={event.id}
                    className={`relative transition-all duration-700 ${
                      inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                    style={{ transitionDelay: `${(index + 1) * 100}ms` }}
                  >
                    {/* Timeline Dot */}
                    <div className={`absolute left-6 w-4 h-4 rounded-full ${getStatusColor(event.status)} border-4 border-white shadow-lg z-10`}></div>
                    
                    {/* Event Card */}
                    <div className="ml-20">
                      <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex items-center">
                              <div className="bg-brand-orange/10 rounded-lg p-3 mr-4">
                                <IconComponent className="h-6 w-6 text-brand-orangeText" />
                              </div>
                              <div>
                                <div className="flex items-center gap-3 mb-2">
                                  <CardTitle className="text-lg">{event.title}</CardTitle>
                                  {getStatusBadge(event.status)}
                                </div>
                                <div className="flex items-center text-sm text-gray-500 gap-4">
                                  <div className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    {event.date}
                                  </div>
                                  <div className="flex items-center">
                                    <Clock className="h-4 w-4 mr-1" />
                                    {event.duration}
                                  </div>
                                  <Badge variant="outline" className="text-xs">
                                    {event.phase}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600 leading-relaxed mb-4">
                            {event.description}
                          </p>
                          
                          {/* Event Details */}
                          {event.details && event.details.length > 0 && (
                            <div className="bg-gray-50 rounded-lg p-4">
                              <h4 className="font-semibold text-gray-900 mb-3">Key Activities:</h4>
                              <div className="grid md:grid-cols-2 gap-2">
                                {event.details.map((detail, detailIndex) => (
                                  <div key={detailIndex} className="flex items-center text-sm text-gray-600">
                                    <CheckCircle className="h-4 w-4 text-brand-orangeText mr-2 flex-shrink-0" />
                                    {detail}
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

          {/* Project Summary */}
          <div 
            className={`mt-12 transition-all duration-700 delay-700 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <Card className="border-0 shadow-lg bg-gradient-to-r from-brand-orange/5 to-brand-blue/5">
              <CardContent className="p-8">
                <div className="text-center">
                  <Award className="h-12 w-12 text-brand-orangeText mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Project Successfully Completed
                  </h3>
                  <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
                    This project was completed 2 days ahead of schedule with exceptional quality standards. 
                    Our systematic approach and dedicated team ensured seamless delivery and 100% client satisfaction.
                  </p>
                  
                  <div className="grid md:grid-cols-3 gap-6 mt-8">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-brand-orangeText">{project.duration_days || 'N/A'} {project.duration_days ? 'Days' : ''}</div>
                      <div className="text-gray-600">Total Duration</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-brand-blue">{finalTimelineEvents.length} Phases</div>
                      <div className="text-gray-600">Process Stages</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{project.status === 'completed' ? '100%' : 'In Progress'}</div>
                      <div className="text-gray-600">{project.status === 'completed' ? 'Completed' : 'Status'}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
