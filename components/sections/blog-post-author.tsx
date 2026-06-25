'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Linkedin, Twitter, Globe, Award, Users } from 'lucide-react';

interface BlogPostAuthorProps {
  author: string;
  siteSettings?: Record<string, any>;
}

interface BlogPostAuthorProps {
  author: string;
  authorData?: any; // Blog author data from database
  companyMetrics?: any[]; // Company metrics from database
  siteSettings?: Record<string, any>;
}

export function BlogPostAuthor({ author, authorData: dbAuthorData, companyMetrics = [], siteSettings = {} }: BlogPostAuthorProps) {
  // Use database author data or fallback to default
  const getAuthorData = (authorName: string) => {
    // If we have database author data, use it
    if (dbAuthorData) {
      return {
        name: dbAuthorData.name,
        title: dbAuthorData.title || 'Translation Expert',
        bio: dbAuthorData.bio || 'Professional translator and localization specialist.',
        image: dbAuthorData.image_url,
        expertise: dbAuthorData.expertise || [],
        achievements: dbAuthorData.achievements || [],
        social: dbAuthorData.social_links || {}
      };
    }

    // Fallback for backward compatibility
    const authorMap: Record<string, any> = {
      'JUSOR Team': {
        name: 'JUSOR Team',
        title: siteSettings.team_title || 'Translation & Localization Experts',
        bio: siteSettings.team_bio || 'Our team of certified translators and localization specialists brings decades of combined experience in delivering high-quality language services across multiple industries.',
        image: siteSettings.team_image || '/team/jusor-team.jpg',
        expertise: siteSettings.team_expertise || ['Legal Translation', 'Technical Documentation', 'Business Localization', 'Certified Translation'],
        achievements: companyMetrics.filter(m => m.category === 'achievements').map(m => m.metric_label) || [
          'ISO 17100:2015 Certified',
          'Professional Translation Services',
          'Quality Assurance Process'
        ],
        social: {
          email: siteSettings.contact_email || 'info@jusortrans.com',
          linkedin: siteSettings.linkedin_url,
          twitter: siteSettings.twitter_url,
          website: siteSettings.site_url
        }
      },
      'Dr. Sarah Johnson': {
        name: 'Dr. Sarah Johnson',
        title: 'Senior Legal Translation Specialist',
        bio: 'Dr. Sarah Johnson is a certified legal translator with over 15 years of experience in international law and cross-border legal documentation. She holds a PhD in Comparative Law and is certified by multiple international translation associations.',
        image: '/team/sarah-johnson.jpg',
        expertise: ['Legal Translation', 'Court Interpretation', 'Contract Localization', 'Regulatory Compliance'],
        achievements: [
          'PhD in Comparative Law',
          'ATA Certified Translator',
          'Court-Certified Interpreter',
          '1000+ Legal Documents Translated'
        ],
        social: {
          email: 'sarah.johnson@jusor.com',
          linkedin: 'https://linkedin.com/in/sarahjohnson',
        }
      },
      'Michael Chen': {
        name: 'Michael Chen',
        title: 'Technical Translation Director',
        bio: 'Michael Chen specializes in technical and software localization with a background in computer science and linguistics. He leads our technical translation team and has worked with major tech companies on global product launches.',
        image: '/team/michael-chen.jpg',
        expertise: ['Software Localization', 'Technical Documentation', 'API Translation', 'UI/UX Localization'],
        achievements: [
          'MS in Computer Science',
          'Certified Localization Manager',
          '200+ Software Products Localized',
          'Agile Localization Expert'
        ],
        social: {
          email: 'michael.chen@jusor.com',
          linkedin: 'https://linkedin.com/in/michaelchen',
          twitter: 'https://twitter.com/michaelchen'
        }
      }
    };

    return authorMap[authorName] || authorMap['JUSOR Team'];
  };

  const authorInfo = getAuthorData(author);

  return (
    <section className="bg-gray-50 py-16">
      <div className="container">
        <Card className="max-w-4xl mx-auto border-0 shadow-lg bg-white">
          <CardContent className="p-8 lg:p-12">
            <div className="grid md:grid-cols-12 gap-8 items-start">
              {/* Author Image */}
              <div className="md:col-span-3">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-brand-orange/10 to-brand-blue/10 shadow-lg">
                  {authorInfo.image ? (
                    <Image
                      src={authorInfo.image}
                      alt={authorInfo.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 200px, 300px"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                          <span className="text-2xl font-bold text-brand-blue">
                            {authorInfo.name.split(' ').map((n: string) => n[0]).join('')}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-600">Author</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Author Info */}
              <div className="md:col-span-9">
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    About {authorInfo.name}
                  </h3>
                  <p className="text-lg text-brand-orange font-medium mb-4">
                    {authorInfo.title}
                  </p>
                </div>

                <p className="text-gray-600 leading-relaxed mb-6">
                  {authorInfo.bio}
                </p>

                {/* Expertise Tags */}
                {authorInfo.expertise && (
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Areas of Expertise</h4>
                    <div className="flex flex-wrap gap-2">
                      {authorInfo.expertise.map((skill: string, index: number) => (
                        <Badge 
                          key={index}
                          variant="secondary"
                          className="bg-brand-orange/10 text-brand-orange hover:bg-brand-orange/20"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Achievements */}
                {authorInfo.achievements && (
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Award className="h-4 w-4 text-brand-orange" />
                      Key Achievements
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {authorInfo.achievements.map((achievement: string, index: number) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-brand-orange rounded-full flex-shrink-0" />
                          <span>{achievement}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Social Links & Contact */}
                <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>Connect with {authorInfo.name.split(' ')[0]}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    {authorInfo.social.email && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="border-gray-300 hover:border-brand-orange hover:text-brand-orange"
                      >
                        <a 
                          href={`mailto:${authorInfo.social.email}`}
                          aria-label={`Email ${authorInfo.name}`}
                        >
                          <Mail className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    
                    {authorInfo.social.linkedin && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="border-gray-300 hover:border-blue-600 hover:text-blue-600"
                      >
                        <a 
                          href={authorInfo.social.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${authorInfo.name} on LinkedIn`}
                        >
                          <Linkedin className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    
                    {authorInfo.social.twitter && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="border-gray-300 hover:border-blue-400 hover:text-blue-400"
                      >
                        <a 
                          href={authorInfo.social.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${authorInfo.name} on Twitter`}
                        >
                          <Twitter className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    
                    {authorInfo.social.website && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="border-gray-300 hover:border-brand-orange hover:text-brand-orange"
                      >
                        <a 
                          href={authorInfo.social.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${authorInfo.name}'s website`}
                        >
                          <Globe className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="bg-gradient-to-r from-brand-orange/5 to-brand-blue/5 rounded-xl p-6 text-center">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Need Expert Translation Services?
                </h4>
                <p className="text-gray-600 mb-4">
                  Our team of certified professionals is ready to help with your translation and localization needs.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button 
                    asChild
                    className="bg-brand-orange hover:bg-brand-orange/90"
                  >
                    <Link href="/contact">
                      Get a Free Quote
                    </Link>
                  </Button>
                  <Button 
                    variant="outline"
                    asChild
                    className="border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white"
                  >
                    <Link href="/services">
                      View Our Services
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}