'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp,
  Award,
  Users,
  Globe,
  CheckCircle,
  Star,
  BarChart3,
  Target,
  Clock,
  Shield
} from 'lucide-react';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { ABOUT_CONTENT } from '@/lib/content/about-content';

interface AboutStatsProps {
  companyMetrics: any[];
  siteSettings: Record<string, any>;
}

export function AboutStats({ companyMetrics, siteSettings }: AboutStatsProps) {
  const { locale } = useLanguage();
  const ac = ABOUT_CONTENT[locale].stats;
  const companyName = siteSettings.company_name || 'JUSOR';

  // Filter metrics by category
  const statsMetrics = companyMetrics.filter(m => m.category === 'stats');
  const achievementMetrics = companyMetrics.filter(m => m.category === 'achievements');
  const benefitMetrics = companyMetrics.filter(m => m.category === 'benefits');

  // Default stats if no metrics available
  const defaultStats = [
    { metric_value: '500+', metric_label: 'Projects Completed', icon: Target, color: 'text-brand-orange' },
    { metric_value: '50+', metric_label: 'Language Pairs', icon: Globe, color: 'text-brand-blue' },
    { metric_value: '99.8%', metric_label: 'Client Satisfaction', icon: Star, color: 'text-brand-orange' },
    { metric_value: '24/7', metric_label: 'Support Available', icon: Clock, color: 'text-brand-blue' }
  ];

  const displayStats = statsMetrics.length > 0 ? statsMetrics : defaultStats;

  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, any> = {
      Target, Globe, Star, Clock, Award, Users, CheckCircle, Shield, BarChart3, TrendingUp
    };
    return iconMap[iconName] || BarChart3;
  };

  return (
    <section className="bg-white py-20">
      <div className="container">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center rounded-full bg-brand-blue/10 px-4 py-2 text-sm font-medium text-brand-blue mb-6">
            <BarChart3 className="h-4 w-4 mr-2" />
            {ac.badge}
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            {ac.heading}
          </h2>
          <p className="text-lg text-gray-600">
            {ac.subheading}
          </p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {displayStats.map((stat, index) => {
            const IconComponent = getIconComponent(stat.icon_name || 'BarChart3');
            const colorClass = stat.color_class || (index % 2 === 0 ? 'text-brand-orange' : 'text-brand-blue');
            
            return (
              <Card 
                key={index}
                className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50 text-center"
              >
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-brand-orange/10 transition-colors">
                    <IconComponent className={`h-8 w-8 ${colorClass} group-hover:text-brand-orange transition-colors`} />
                  </div>
                  <div className={`text-3xl lg:text-4xl font-bold mb-2 ${colorClass} group-hover:text-brand-orange transition-colors`}>
                    {stat.metric_value}
                  </div>
                  <div className="text-gray-600 font-medium">
                    {stat.metric_label}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Achievements Section */}
        {achievementMetrics.length > 0 && (
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
              {ac.achievementsTitle}
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievementMetrics.map((achievement, index) => {
                const IconComponent = getIconComponent(achievement.icon_name || 'Award');
                
                return (
                  <Card 
                    key={index}
                    className="group hover:shadow-lg transition-all duration-300 border-0 bg-white"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-brand-orange/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <IconComponent className="h-6 w-6 text-brand-orange" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 mb-2">
                            {achievement.metric_value}
                          </h4>
                          <p className="text-gray-600 text-sm">
                            {achievement.metric_label}
                          </p>
                          {achievement.metric_description && (
                            <p className="text-gray-500 text-xs mt-2">
                              {achievement.metric_description}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Quality Metrics */}
        <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-8 lg:p-12 mb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
                {ac.qualityTitle}
              </h3>
              <p className="text-gray-600 leading-relaxed mb-8">
                Our commitment to quality is reflected in every metric we track. From client satisfaction 
                to project completion rates, we maintain the highest standards in the industry.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                    <span className="font-medium text-gray-900">{ac.translationAccuracy}</span>
                  </div>
                  <div className="text-2xl font-bold text-brand-orange">99.8%</div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                  <div className="flex items-center gap-3">
                    <Clock className="h-6 w-6 text-blue-500" />
                    <span className="font-medium text-gray-900">{ac.onTimeDelivery}</span>
                  </div>
                  <div className="text-2xl font-bold text-brand-blue">99.5%</div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                  <div className="flex items-center gap-3">
                    <Star className="h-6 w-6 text-yellow-500" />
                    <span className="font-medium text-gray-900">{ac.clientRetention}</span>
                  </div>
                  <div className="text-2xl font-bold text-brand-orange">95%</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-brand-orange/10 to-brand-blue/10 p-8 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Award className="h-12 w-12 text-brand-orange" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">
                    {ac.certifiedTranslation}
                  </h4>
                  <p className="text-gray-600">
                    {ac.qualityManagementProcess}
                  </p>
                </div>
              </div>

              {/* Floating metric cards */}
              <div className="absolute -top-4 -right-4 bg-white rounded-xl p-4 shadow-xl border">
                <div className="text-center">
                  <div className="text-2xl font-bold text-brand-blue">A+</div>
                  <div className="text-xs text-gray-600">{ac.qualityRating}</div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl p-4 shadow-xl border">
                <div className="text-center">
                  <div className="text-2xl font-bold text-brand-orange">5★</div>
                  <div className="text-xs text-gray-600">{ac.averageReview}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits/Guarantees */}
        {benefitMetrics.length > 0 && (
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">
              What We Guarantee
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefitMetrics.map((benefit, index) => {
                const IconComponent = getIconComponent(benefit.icon_name || 'CheckCircle');
                
                return (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-brand-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-8 w-8 text-brand-orange" />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">
                      {benefit.metric_value}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {benefit.metric_label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Industry Recognition */}
        <div className="mt-16 bg-gradient-to-r from-brand-orange/5 to-brand-blue/5 rounded-2xl p-8 lg:p-12 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            {ac.recognitionTitle}
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            {ac.recognitionBody}
          </p>
          
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-brand-orange" />
              <span>{ac.badges[0]}</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-brand-blue" />
              <span>{ac.badges[1]}</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-brand-orange" />
              <span>{ac.badges[2]}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-brand-blue" />
              <span>{ac.badges[3]}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}