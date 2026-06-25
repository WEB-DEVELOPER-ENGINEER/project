'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Phone, 
  Mail, 
  FileText, 
  CheckCircle, 
  Star,
  ArrowRight,
  Globe,
  Shield,
  Clock
} from 'lucide-react';
import { BlogPost } from '@/lib/types';
import { trackPhoneClick, trackEmailClick } from '@/lib/analytics-events';

interface BlogPostCTAProps {
  post: BlogPost;
  siteSettings?: Record<string, any>;
}

interface BlogPostCTAProps {
  post: BlogPost;
  companyMetrics?: any[]; // Company metrics from database
  blogContentSections?: any[]; // Blog content sections from database
  siteSettings?: Record<string, any>;
}

export function BlogPostCTA({ post, companyMetrics = [], blogContentSections = [], siteSettings = {} }: BlogPostCTAProps) {
  // Get benefits from database or use fallbacks
  const getBenefits = () => {
    const benefitsFromDB = companyMetrics.filter(m => m.category === 'benefits');
    if (benefitsFromDB.length > 0) {
      return benefitsFromDB.map(benefit => ({
        icon: getIconComponent(benefit.icon_name || 'CheckCircle'),
        text: benefit.metric_label
      }));
    }

    // Fallback benefits
    return [
      {
        icon: CheckCircle,
        text: siteSettings.benefit_quality || 'ISO 17100:2015 Certified Quality'
      },
      {
        icon: Globe,
        text: siteSettings.benefit_languages || 'Professional Language Services'
      },
      {
        icon: Shield,
        text: siteSettings.benefit_security || 'Confidentiality Guaranteed'
      },
      {
        icon: Clock,
        text: siteSettings.benefit_speed || 'Fast Turnaround Times'
      }
    ];
  };

  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, any> = {
      CheckCircle, Globe, Shield, Clock, Star, ArrowRight, MessageSquare, Phone, Mail, FileText
    };
    return iconMap[iconName] || CheckCircle;
  };

  const benefits = getBenefits();

  // Get trust stats from database or use fallbacks
  const getTrustStats = () => {
    const statsFromDB = companyMetrics.filter(m => m.category === 'stats');
    if (statsFromDB.length > 0) {
      return statsFromDB.map(stat => ({
        value: stat.metric_value,
        label: stat.metric_label,
        color: stat.color_class
      }));
    }

    // Fallback stats
    return [
      {
        value: siteSettings.stat_projects || '500+',
        label: siteSettings.stat_projects_label || 'Projects Completed'
      },
      {
        value: siteSettings.stat_languages || '50+',
        label: siteSettings.stat_languages_label || 'Language Pairs'
      },
      {
        value: siteSettings.stat_satisfaction || '99.8%',
        label: siteSettings.stat_satisfaction_label || 'Client Satisfaction'
      },
      {
        value: siteSettings.stat_support || '24/7',
        label: siteSettings.stat_support_label || 'Support Available'
      }
    ];
  };

  const services = [
    {
      title: 'Legal Translation',
      description: 'Certified legal document translation for courts and legal proceedings.',
      href: '/services/legal-translation'
    },
    {
      title: 'Technical Translation',
      description: 'Specialized technical documentation and software localization.',
      href: '/services/technical-translation'
    },
    {
      title: 'Business Translation',
      description: 'Professional business document and marketing material translation.',
      href: '/services/business-translation'
    }
  ];

  return (
    <section className="bg-gradient-to-br from-gray-50 via-white to-gray-50 py-16">
      <div className="container">
        {/* Main CTA Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card className="border-0 shadow-xl bg-gradient-to-r from-brand-orange to-brand-blue text-white overflow-hidden">
            <CardContent className="p-8 lg:p-12 relative">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px] opacity-30" />
              
              <div className="relative z-10">
                <div className="text-center mb-8">
                  <Badge className="bg-white/20 text-white border-white/30 mb-4">
                    Ready to Get Started?
                  </Badge>
                  <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                    Need Professional Translation Services?
                  </h2>
                  <p className="text-xl text-white/90 max-w-2xl mx-auto">
                    Our certified translation experts are ready to help you communicate effectively across languages and cultures.
                  </p>
                </div>

                {/* Benefits Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3 text-white/90">
                      <benefit.icon className="h-5 w-5 text-white flex-shrink-0" />
                      <span className="text-sm font-medium">{benefit.text}</span>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    asChild
                    size="lg"
                    className="bg-white text-brand-orange hover:bg-gray-50 font-semibold"
                  >
                    <Link href="/contact">
                      <FileText className="h-5 w-5 mr-2" />
                      Get Free Quote
                    </Link>
                  </Button>
                  <Button 
                    asChild
                    variant="outline" 
                    size="lg"
                    className="border-white text-white hover:bg-white hover:text-brand-orange"
                  >
                    <Link href="/services">
                      View All Services
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Services Showcase */}
        <div className="mb-16">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
              Our Translation Services
            </h3>
            <p className="text-lg text-gray-600">
              Discover our comprehensive range of professional translation and localization services.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border border-gray-200">
                <CardContent className="p-6">
                  <h4 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-brand-orange transition-colors">
                    {service.title}
                  </h4>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {service.description}
                  </p>
                  <Link 
                    href={service.href}
                    className="inline-flex items-center text-brand-orange hover:text-brand-orange/80 font-medium text-sm transition-colors"
                  >
                    Learn More
                    <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Options */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Phone Contact */}
          <Card className="group hover:shadow-lg transition-all duration-300 border border-gray-200">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-brand-orange/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-orange/20 transition-colors">
                <Phone className="h-8 w-8 text-brand-orange" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Call Us Directly
              </h4>
              <p className="text-gray-600 mb-4 text-sm">
                Speak with our translation experts for immediate assistance.
              </p>
              <Button 
                asChild
                variant="outline"
                className="border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white"
              >
                <a 
                  href={`tel:${siteSettings.phone || '+1-555-0123'}`}
                  onClick={() => trackPhoneClick(siteSettings.phone || '+1-555-0123', 'blog_post_cta')}
                >
                  {siteSettings.phone || '+1 (555) 012-3456'}
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Email Contact */}
          <Card className="group hover:shadow-lg transition-all duration-300 border border-gray-200">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-brand-blue/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-blue/20 transition-colors">
                <Mail className="h-8 w-8 text-brand-blue" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Email Us
              </h4>
              <p className="text-gray-600 mb-4 text-sm">
                Send us your project details for a detailed quote.
              </p>
              <Button 
                asChild
                variant="outline"
                className="border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white"
              >
                <a 
                  href={`mailto:${siteSettings.email || 'info@jusortrans.com'}`}
                  onClick={() => trackEmailClick(siteSettings.email || 'info@jusortrans.com', 'blog_post_cta')}
                >
                  {siteSettings.email || 'info@jusortrans.com'}
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Live Chat */}
          <Card className="group hover:shadow-lg transition-all duration-300 border border-gray-200">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                <MessageSquare className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Live Chat
              </h4>
              <p className="text-gray-600 mb-4 text-sm">
                Chat with our team for instant answers to your questions.
              </p>
              <Button 
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                onClick={() => {
                  // Implement live chat functionality
                  console.log('Open live chat');
                }}
              >
                Start Chat
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl p-8 border shadow-sm">
            <h4 className="text-lg font-semibold text-gray-900 mb-6">
              Trusted by Leading Organizations
            </h4>
            
            {/* Trust Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              {getTrustStats().map((stat, index) => (
                <div key={index} className="text-center">
                  <div className={`text-3xl font-bold mb-1 ${stat.color || (index % 2 === 0 ? 'text-brand-orange' : 'text-brand-blue')}`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Certifications */}
            <div className="flex flex-wrap justify-center items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>ISO 17100:2015 Certified</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-500" />
                <span>GDPR Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-blue-500" />
                <span>ATA Member</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}