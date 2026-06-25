'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Zap, 
  Users, 
  Award, 
  Globe, 
  Heart,
  CheckCircle,
  Star,
  Target,
  Lightbulb
} from 'lucide-react';

interface AboutValuesProps {
  aboutData: any;
  siteSettings: Record<string, any>;
}

export function AboutValues({ aboutData, siteSettings }: AboutValuesProps) {
  const companyName = siteSettings.company_name || 'JUSOR';

  // Default values if not provided in aboutData
  const defaultValues = [
    {
      icon: Shield,
      title: 'Quality & Accuracy',
      description: 'We maintain the highest standards of translation quality through rigorous quality assurance processes and certified professional translators.',
      color: 'text-brand-orange',
      bgColor: 'bg-brand-orange/10'
    },
    {
      icon: Users,
      title: 'Client Partnership',
      description: 'We build lasting relationships with our clients, understanding their unique needs and delivering personalized solutions that exceed expectations.',
      color: 'text-brand-blue',
      bgColor: 'bg-brand-blue/10'
    },
    {
      icon: Globe,
      title: 'Cultural Sensitivity',
      description: 'We respect and understand cultural nuances, ensuring translations are not just linguistically accurate but culturally appropriate.',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'We embrace cutting-edge technology and innovative approaches to deliver faster, more efficient translation services without compromising quality.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      icon: Heart,
      title: 'Integrity',
      description: 'We operate with complete transparency, honesty, and ethical standards in all our business practices and client relationships.',
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      icon: Target,
      title: 'Excellence',
      description: 'We strive for excellence in every project, continuously improving our processes and skills to deliver outstanding results.',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    }
  ];

  const values = aboutData.values || defaultValues;

  return (
    <section className="bg-gradient-to-br from-gray-50 to-white py-20">
      <div className="container">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center rounded-full bg-brand-orange/10 px-4 py-2 text-sm font-medium text-brand-orange mb-6">
            <Star className="h-4 w-4 mr-2" />
            Our Values
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            What Drives Us Forward
          </h2>
          <p className="text-lg text-gray-600">
            The core principles that guide every decision we make and every service we deliver
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {values.map((value, index) => {
            const IconComponent = value.icon || Lightbulb;
            
            return (
              <Card 
                key={index}
                className="group hover:shadow-xl transition-all duration-300 border-0 bg-white h-full"
              >
                <CardContent className="p-8 h-full flex flex-col">
                  <div className={`w-16 h-16 ${value.bgColor || 'bg-gray-100'} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <IconComponent className={`h-8 w-8 ${value.color || 'text-gray-600'}`} />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-brand-orange transition-colors">
                    {value.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed flex-1">
                    {value.description}
                  </p>
                  
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <Badge variant="secondary" className="text-xs">
                      Core Value
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Values in Action */}
        <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-lg">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
                Values in Action
              </h3>
              <p className="text-gray-600 leading-relaxed mb-8">
                Our values aren't just words on a page—they're the foundation of how we operate every day. 
                From our rigorous quality control processes to our commitment to cultural sensitivity, 
                these principles guide every interaction and every translation we deliver.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Quality Assurance</h4>
                    <p className="text-gray-600 text-sm">Multi-step review process ensuring 99.8% accuracy</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Cultural Expertise</h4>
                    <p className="text-gray-600 text-sm">Native speakers with deep cultural understanding</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Client Focus</h4>
                    <p className="text-gray-600 text-sm">Dedicated project managers for personalized service</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Continuous Innovation</h4>
                    <p className="text-gray-600 text-sm">Latest technology integrated with human expertise</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-brand-orange/10 to-brand-blue/10 p-8 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Award className="h-12 w-12 text-brand-orange" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">
                    ISO 17100:2015 Certified
                  </h4>
                  <p className="text-gray-600">
                    Internationally recognized quality standards
                  </p>
                </div>
              </div>

              {/* Floating Stats */}
              <div className="absolute -top-4 -right-4 bg-white rounded-xl p-4 shadow-xl border">
                <div className="text-center">
                  <div className="text-2xl font-bold text-brand-orange">99.8%</div>
                  <div className="text-xs text-gray-600">Client Satisfaction</div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl p-4 shadow-xl border">
                <div className="text-center">
                  <div className="text-2xl font-bold text-brand-blue">24/7</div>
                  <div className="text-xs text-gray-600">Support Available</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Company Culture */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Our Culture
          </h3>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            At {companyName}, we've built a culture of collaboration, respect, and continuous learning. 
            Our diverse team of language professionals brings together expertise from around the world, 
            united by our shared commitment to excellence and our passion for facilitating global communication.
          </p>
        </div>
      </div>
    </section>
  );
}