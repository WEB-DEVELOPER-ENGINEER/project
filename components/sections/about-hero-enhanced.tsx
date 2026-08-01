'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RichText } from '@/components/ui/safe-html';
import { ArrowRight, Play, Award, Globe, Users } from 'lucide-react';
import { AboutUs } from '@/lib/types';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { ABOUT_CONTENT } from '@/lib/content/about-content';
import { companyName as resolveCompanyName } from '@/lib/company';

interface AboutHeroEnhancedProps {
  aboutData: AboutUs;
  siteSettings: Record<string, any>;
  companyMetrics?: any[];
}

export function AboutHeroEnhanced({ aboutData, siteSettings, companyMetrics }: AboutHeroEnhancedProps) {
  const { locale } = useLanguage();
  const ac = ABOUT_CONTENT[locale].hero;
  const companyName = resolveCompanyName(siteSettings, locale);

  // Get dynamic stats from company metrics or use defaults
  const stats = companyMetrics?.slice(0, 3) || [
    { metric_value: '500+', metric_label: ac.clientsServed },
    { metric_value: '100+', metric_label: ac.languagesSupported },
    { metric_value: '15+', metric_label: ac.yearsOfExperience }
  ];

  // "Years of Excellence" badge — pulled from the real years-of-experience
  // metric (see scripts/seed-company-metrics.ts) rather than computed from
  // a founding date, since the two can legitimately differ: the current
  // legal entity may be newer than the team's collective institutional
  // experience, and computing "years in business" from founding_date would
  // silently contradict the real, separately-tracked experience figure.
  const yearsBadge = companyMetrics?.find((m) => m.metric_key === 'years_experience')?.metric_value || '15+';

  return (
    <section className="relative bg-gradient-to-br from-gray-50 via-white to-blue-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-gray-100/50 bg-[size:20px_20px] opacity-30" />
      
      {/* Decorative Elements */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-brand-orange/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-brand-blue/5 rounded-full blur-3xl" />

      <div className="relative container section-padding">
        <div className="grid lg:grid-cols-12 gap-12 items-center min-h-[80vh]">
          {/* Content Column */}
          <div className="lg:col-span-7 space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center rounded-full bg-brand-orange/10 px-4 py-2 text-sm font-medium text-brand-orangeText">
              <Award className="h-4 w-4 mr-2" />
              {yearsBadge} {ac.yearsOfExcellence}
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                {aboutData.title || `About ${companyName}`}
              </h1>
              
              {aboutData.slogan && (
                <p className="text-xl lg:text-2xl text-brand-orangeText font-medium">
                  {aboutData.slogan}
                </p>
              )}
              
              <RichText 
                content={aboutData.description}
                className="text-xl lg:text-2xl text-gray-600 leading-relaxed"
              />
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-3 gap-6 py-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center lg:text-left">
                  <div className={`text-3xl lg:text-4xl font-bold mb-1 ${
                    index % 2 === 0 ? 'text-brand-orange' : 'text-brand-blue'
                  }`}>
                    {stat.metric_value}
                  </div>
                  <div className="text-sm text-gray-600">{stat.metric_label}</div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              {aboutData.hero_cta_primary_text && aboutData.hero_cta_primary_url && (
                <Button 
                  asChild
                  size="lg"
                  className="bg-brand-orangeText hover:bg-brand-orangeText/90 text-white group"
                >
                  <Link href={aboutData.hero_cta_primary_url}>
                    {aboutData.hero_cta_primary_text}
                    <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              )}
              
              {aboutData.hero_cta_secondary_text && aboutData.hero_cta_secondary_url && (
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white group"
                  asChild
                >
                  <Link href={aboutData.hero_cta_secondary_url}>
                    <Globe className="h-5 w-5 mr-2" />
                    {aboutData.hero_cta_secondary_text}
                  </Link>
                </Button>
              )}
            </div>

            {/* Trust Indicators — real accreditations (see
                scripts/seed-company-metrics.ts), falling back to generic
                text only if none are seeded yet. */}
            <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Award className="h-4 w-4 text-brand-orangeText" />
                <span>{companyMetrics?.find((m) => m.metric_key === 'iso_certification')?.metric_value || 'Certified Translation Services'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="h-4 w-4 text-brand-blue" />
                <span>{companyMetrics?.find((m) => m.metric_key === 'moj_accreditation')?.metric_value || 'Accredited Translation Office'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Globe className="h-4 w-4 text-brand-orangeText" />
                <span>{ac.globalReach}</span>
              </div>
            </div>
          </div>

          {/* Image Column */}
          <div className="lg:col-span-5">
            <div className="relative">
              {/* Main Image */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-brand-orange/10 to-brand-blue/10 shadow-2xl">
                {aboutData.hero_image_url ? (
                  <Image
                    src={aboutData.hero_image_url}
                    alt={`About ${companyName} - Professional Translation Team`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                ) : aboutData.image_url ? (
                  <Image
                    src={aboutData.image_url}
                    alt={`About ${companyName} - Professional Translation Team`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center p-8">
                      <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <Globe className="h-12 w-12 text-brand-blue" />
                      </div>
                      <div className="text-2xl font-bold text-gray-800 mb-2">
                        {ac.imageTitle}
                      </div>
                      <p className="text-gray-600">
                        {ac.imageCaption}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Floating Stats Card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-6 shadow-xl border">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-orange/10 rounded-full flex items-center justify-center">
                    <Award className="h-6 w-6 text-brand-orangeText" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{yearsBadge}</div>
                    <div className="text-sm text-gray-600">{ac.yearsOfExcellence}</div>
                  </div>
                </div>
              </div>

              {/* Video Play Button (if video available) */}
              {aboutData.hero_video_url && (
                <button 
                  className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors rounded-2xl group"
                  onClick={() => {
                    // Implement video modal or redirect
                    window.open(aboutData.hero_video_url, '_blank');
                  }}
                  aria-label={ac.playVideo}
                >
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="h-8 w-8 text-brand-blue ml-1" />
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-300 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}