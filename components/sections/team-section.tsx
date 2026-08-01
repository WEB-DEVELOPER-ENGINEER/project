'use client';

import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SimpleText } from '@/components/ui/safe-html';
import { Linkedin, Twitter, Mail, ExternalLink } from 'lucide-react';
import { TeamMember } from '@/lib/types';

interface TeamSectionProps {
  teamMembers: TeamMember[];
  siteSettings?: Record<string, any>;
}

import { useLanguage } from '@/components/providers/LanguageProvider';

export function TeamSection({ teamMembers: rawTeamMembers, siteSettings = {} }: TeamSectionProps) {
  const { t, isRtl } = useLanguage();

  // Always use the real team members from the database, regardless of
  // language — do not substitute fabricated names/bios for Arabic.
  const teamMembers = rawTeamMembers || [];

  if (!teamMembers || teamMembers.length === 0) {
    return null;
  }

  const getSocialIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'linkedin':
        return Linkedin;
      case 'twitter':
        return Twitter;
      case 'email':
      case 'mail':
        return Mail;
      default:
        return ExternalLink;
    }
  };

  return (
    <section id="team-section" className="section-padding bg-gray-50 dark:bg-gray-900/50">
      <div className="container">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center rounded-full bg-brand-orange/10 px-4 py-2 text-sm font-medium text-brand-orangeText mb-4">
            {isRtl ? 'فريق عملنا' : 'Meet Our Team'}
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl mb-4">
            {isRtl ? 'خبراء الترجمة والمتخصصون اللغويون' : 'Expert Translators & Language Specialists'}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {isRtl ? 'يضم فريقنا نخبة من المترجمين المعتمدين ذوي الخبرات الطويلة في مختلف القطاعات الهندسية والقانونية والطبية.' : 'Our certified team of professional translators brings years of experience and expertise in various industries and language pairs.'}
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {teamMembers.map((member) => (
            <Card key={member.id} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white dark:bg-gray-800">
              <CardContent className="p-0">
                {/* Image */}
                <div className="relative aspect-[4/5] overflow-hidden rounded-t-lg bg-gradient-to-br from-brand-orange/10 to-brand-blue/10">
                  {member.image_url ? (
                    <Image
                      src={member.image_url}
                      alt={member.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gradient-to-br from-brand-orange/20 to-brand-blue/20">
                      <div className="w-20 h-20 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <span className="text-2xl font-bold text-brand-blue dark:text-gray-100">
                          {member.name.charAt(0)}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {/* Social Links Overlay */}
                  {member.social_links && member.social_links.length > 0 && (
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="flex gap-3">
                        {member.social_links.map((link) => {
                          const IconComponent = getSocialIcon(link.icon?.name || '');
                          return (
                            <a
                              key={link.id}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
                              aria-label={`${member.name} on ${link.icon?.name || 'social media'}`}
                            >
                              <IconComponent className="h-5 w-5 text-white" />
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-brand-orangeText font-medium mb-3">
                    {member.job_title}
                  </p>
                  
                  {member.bio && (
                    <SimpleText 
                      content={member.bio}
                      className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3"
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}