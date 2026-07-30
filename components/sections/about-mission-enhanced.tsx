'use client';

import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { RichText } from '@/components/ui/safe-html';
import { Target, Eye, Heart, Globe, Users, Award } from 'lucide-react';
import { AboutUs } from '@/lib/types';

interface AboutMissionEnhancedProps {
  aboutData: AboutUs;
  siteSettings: Record<string, any>;
}

export function AboutMissionEnhanced({ aboutData, siteSettings }: AboutMissionEnhancedProps) {
  const companyName = siteSettings.company_name || 'JUSOR';

  // Default content if not provided
  const defaultMission = `To break down language barriers and enable seamless global communication through accurate, culturally-sensitive translation and localization services that empower businesses to reach new markets and connect with diverse audiences worldwide.`;
  const defaultVision = `To be the world's most trusted translation partner, recognized for our commitment to quality, innovation, and cultural understanding. We envision a world where language is never a barrier to human connection, business growth, or knowledge sharing.`;
  const defaultPurpose = `We exist to connect cultures, facilitate understanding, and enable global collaboration. Every translation we deliver is a bridge between communities, helping ideas flow freely across linguistic boundaries and fostering meaningful connections worldwide.`;

  return (
    <section className="bg-white py-20">
      <div className="container">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center rounded-full bg-brand-blue/10 px-4 py-2 text-sm font-medium text-brand-blue mb-6">
            <Target className="h-4 w-4 mr-2" />
            Our Purpose
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            Mission, Vision & Purpose
          </h2>
          <p className="text-lg text-gray-600">
            Discover what drives us to deliver exceptional translation and localization services
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Mission Content */}
          <div className="space-y-8">
            {/* Mission */}
            {(aboutData.mission || defaultMission) && (
              <Card className="border-l-4 border-l-brand-orange bg-gradient-to-r from-brand-orange/5 to-transparent">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-brand-orange/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Target className="h-6 w-6 text-brand-orange" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">Our Mission</h3>
                      <RichText 
                        content={aboutData.mission || defaultMission}
                        className="text-gray-600 leading-relaxed"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Vision */}
            {(aboutData.vision || defaultVision) && (
              <Card className="border-l-4 border-l-brand-blue bg-gradient-to-r from-brand-blue/5 to-transparent">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-brand-blue/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Eye className="h-6 w-6 text-brand-blue" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">Our Vision</h3>
                      <RichText 
                        content={aboutData.vision || defaultVision}
                        className="text-gray-600 leading-relaxed"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Purpose */}
            {(aboutData.purpose || defaultPurpose) && (
              <Card className="border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-transparent">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Heart className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">Our Purpose</h3>
                      <RichText 
                        content={aboutData.purpose || defaultPurpose}
                        className="text-gray-600 leading-relaxed"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br from-brand-orange/10 to-brand-blue/10 shadow-xl">
              {aboutData.mission_image_url ? (
                <Image
                  src={aboutData.mission_image_url}
                  alt={`${companyName} Mission and Values`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center p-8">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <Globe className="h-10 w-10 text-brand-blue" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3">
                      Global Impact
                    </h3>
                    <p className="text-gray-600">
                      Connecting cultures through professional translation services
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Floating Achievement Cards */}
            <div className="absolute -top-6 -right-6 bg-white rounded-xl p-4 shadow-xl border">
              <div className="flex items-center gap-3">
                <Award className="h-8 w-8 text-brand-orange" />
                <div>
                  <div className="font-bold text-gray-900">Certified Translation</div>
                  <div className="text-xs text-gray-600">Quality Assured</div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-xl border">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-brand-blue" />
                <div>
                  <div className="font-bold text-gray-900">100+ Experts</div>
                  <div className="text-xs text-gray-600">Professional Team</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Company Story */}
        {(aboutData.story || aboutData.story_continuation) && (
          <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-8 lg:p-12">
            <div className="max-w-4xl mx-auto text-center">
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
                Our Story
              </h3>
              <div className="prose prose-lg prose-gray max-w-none">
                {aboutData.story && (
                  <RichText 
                    content={aboutData.story}
                    className="text-gray-600 leading-relaxed mb-6"
                  />
                )}
                {aboutData.story_continuation && (
                  <RichText 
                    content={aboutData.story_continuation}
                    className="text-gray-600 leading-relaxed"
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}