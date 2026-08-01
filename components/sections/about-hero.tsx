'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RichText } from '@/components/ui/safe-html';
import { ArrowRight, Play, Award, Globe, Users } from 'lucide-react';

interface AboutHeroProps {
  aboutData: any;
  siteSettings: Record<string, any>;
}

export function AboutHero({ aboutData, siteSettings }: AboutHeroProps) {
  const companyName = siteSettings.company_name || 'JUSOR';
  const foundingYear = siteSettings.founding_date ? new Date(siteSettings.founding_date).getFullYear() : 2008;
  const yearsInBusiness = new Date().getFullYear() - foundingYear;

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
              {yearsInBusiness}+ Years of Excellence
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                About{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-brand-blue">
                  {companyName}
                </span>
              </h1>
              <RichText 
                content={aboutData.description || `Breaking down language barriers and connecting cultures through professional translation and localization services.`}
                className="text-xl lg:text-2xl text-gray-600 leading-relaxed"
              />
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-3 gap-6 py-6">
              <div className="text-center lg:text-left">
                <div className="text-3xl lg:text-4xl font-bold text-brand-orange mb-1">500+</div>
                <div className="text-sm text-gray-600">Projects Completed</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl lg:text-4xl font-bold text-brand-blue mb-1">50+</div>
                <div className="text-sm text-gray-600">Language Pairs</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl lg:text-4xl font-bold text-brand-orange mb-1">99.8%</div>
                <div className="text-sm text-gray-600">Client Satisfaction</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                asChild
                size="lg"
                className="bg-brand-orangeText hover:bg-brand-orangeText/90 text-white group"
              >
                <Link href="/contact">
                  Get Started Today
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white group"
                asChild
              >
                <Link href="/services">
                  <Globe className="h-5 w-5 mr-2" />
                  Our Services
                </Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Award className="h-4 w-4 text-brand-orangeText" />
                <span>Certified Translation Services</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="h-4 w-4 text-brand-blue" />
                <span>100+ Professional Translators</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Globe className="h-4 w-4 text-brand-orangeText" />
                <span>Global Reach</span>
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
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center p-8">
                      <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <Globe className="h-12 w-12 text-brand-blue" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">
                        Global Translation Excellence
                      </h3>
                      <p className="text-gray-600">
                        Connecting cultures through language
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
                    <div className="text-2xl font-bold text-gray-900">{yearsInBusiness}+</div>
                    <div className="text-sm text-gray-600">Years of Excellence</div>
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
                  aria-label="Play company introduction video"
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