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
import { BlogPost, Service } from '@/lib/types';
import { trackPhoneClick, trackEmailClick } from '@/lib/analytics-events';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { BLOG_POST_CONTENT } from '@/lib/content/blog-post-content';
import { localizedPath } from '@/lib/locale';

interface BlogPostCTAProps {
  post: BlogPost;
  companyMetrics?: any[]; // Company metrics from database
  blogContentSections?: any[]; // Blog content sections from database
  siteSettings?: Record<string, any>;
  relatedServices?: Service[]; // Real services matched to this article's topic
}

export function BlogPostCTA({ post, companyMetrics = [], blogContentSections = [], siteSettings = {}, relatedServices = [] }: BlogPostCTAProps) {
  const { locale } = useLanguage();
  const bc = BLOG_POST_CONTENT[locale];
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
        text: siteSettings.benefit_quality || bc.benefitQuality
      },
      {
        icon: Globe,
        text: siteSettings.benefit_languages || bc.benefitLanguages
      },
      {
        icon: Shield,
        text: siteSettings.benefit_security || bc.benefitSecurity
      },
      {
        icon: Clock,
        text: siteSettings.benefit_speed || bc.benefitSpeed
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
        label: siteSettings.stat_projects_label || bc.statProjects
      },
      {
        value: siteSettings.stat_languages || '50+',
        label: siteSettings.stat_languages_label || bc.statLanguages
      },
      {
        value: siteSettings.stat_satisfaction || '99.8%',
        label: siteSettings.stat_satisfaction_label || bc.statSatisfaction
      },
      {
        value: siteSettings.stat_support || '24/7',
        label: siteSettings.stat_support_label || bc.statSupport
      }
    ];
  };

  // Real services relevant to this article's topic (falls back to nothing
  // rather than fabricated services with broken links).
  const services = relatedServices.map((s) => ({
    title: s.title,
    description: s.short_description || '',
    href: `/services/${s.slug}`,
  }));

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
                    {bc.readyToStart}
                  </Badge>
                  <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                    {bc.needProfessional}
                  </h2>
                  <p className="text-xl text-white/90 max-w-2xl mx-auto">
                    {bc.needProfessionalBody}
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
                      {bc.getFreeQuote}
                    </Link>
                  </Button>
                  <Button 
                    asChild
                    variant="outline" 
                    size="lg"
                    className="border-white text-white hover:bg-white hover:text-brand-orange"
                  >
                    <Link href="/services">
                      {bc.viewAllServices}
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Services Showcase */}
        {services.length > 0 && (
        <div className="mb-16">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
              {bc.relatedServices}
            </h3>
            <p className="text-lg text-gray-600">
              {bc.relatedServicesBody}
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
                    {bc.learnMore}
                    <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        )}

        {/* Contact Options */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Phone Contact */}
          <Card className="group hover:shadow-lg transition-all duration-300 border border-gray-200">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-brand-orange/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-orange/20 transition-colors">
                <Phone className="h-8 w-8 text-brand-orange" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                {bc.callUsDirectly}
              </h4>
              <p className="text-gray-600 mb-4 text-sm">
                {bc.callUsBody}
              </p>
              <Button 
                asChild
                variant="outline"
                className="border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white"
              >
                <a
                  href={`tel:${siteSettings.phone || '+971503244329'}`}
                  onClick={() => trackPhoneClick(siteSettings.phone || '+971503244329', 'blog_post_cta')}
                >
                  {siteSettings.phone || '+971 50 324 4329'}
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
                {bc.emailUs}
              </h4>
              <p className="text-gray-600 mb-4 text-sm">
                {bc.emailUsBody}
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
                {bc.liveChat}
              </h4>
              <p className="text-gray-600 mb-4 text-sm">
                {bc.liveChatBody}
              </p>
              <Button 
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                onClick={() => {
                  // Implement live chat functionality
                  console.log('Open live chat');
                }}
              >
                {bc.startChat}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl p-8 border shadow-sm">
            <h4 className="text-lg font-semibold text-gray-900 mb-6">
              {bc.trustedBy}
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
          </div>
        </div>
      </div>
    </section>
  );
}