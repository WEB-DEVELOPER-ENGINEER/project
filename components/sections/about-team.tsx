'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Linkedin, 
  Mail, 
  Globe,
  Award,
  Languages,
  ArrowRight,
  MapPin
} from 'lucide-react';

interface AboutTeamProps {
  teamMembers: any[];
  siteSettings: Record<string, any>;
}

export function AboutTeam({ teamMembers, siteSettings }: AboutTeamProps) {
  const companyName = siteSettings.company_name || 'JUSOR';

  // Show featured team members (limit to 6 for layout)
  const featuredMembers = teamMembers.slice(0, 6);

  return (
    <section className="bg-gradient-to-br from-gray-50 to-white py-20">
      <div className="container">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center rounded-full bg-brand-orange/10 px-4 py-2 text-sm font-medium text-brand-orange mb-6">
            <Users className="h-4 w-4 mr-2" />
            Our Team
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            Meet the Experts Behind Our Success
          </h2>
          <p className="text-lg text-gray-600">
            Our diverse team of certified translators and language specialists brings together decades of experience and cultural expertise
          </p>
        </div>

        {/* Team Grid */}
        {featuredMembers.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {featuredMembers.map((member, index) => (
              <Card 
                key={member.id}
                className="group hover:shadow-xl transition-all duration-300 border-0 bg-white overflow-hidden"
              >
                <CardContent className="p-0">
                  {/* Member Photo */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-brand-orange/10 to-brand-blue/10">
                    {member.image_url ? (
                      <Image
                        src={member.image_url}
                        alt={member.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                            <span className="text-2xl font-bold text-brand-blue">
                              {member.name.split(' ').map((n: string) => n[0]).join('')}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-gray-600">Team Member</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Overlay with social links */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="flex gap-3">
                        {member.linkedin_url && (
                          <a
                            href={member.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-brand-orange hover:text-white transition-colors"
                            aria-label={`${member.name} on LinkedIn`}
                          >
                            <Linkedin className="h-5 w-5" />
                          </a>
                        )}
                        {member.email && (
                          <a
                            href={`mailto:${member.email}`}
                            className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-brand-blue hover:text-white transition-colors"
                            aria-label={`Email ${member.name}`}
                          >
                            <Mail className="h-5 w-5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Member Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-brand-orange transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-brand-blue font-medium mb-3">
                      {member.job_title}
                    </p>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                      {member.bio}
                    </p>

                    {/* Specializations */}
                    {member.specializations && member.specializations.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {member.specializations.slice(0, 3).map((spec: string, specIndex: number) => (
                            <Badge 
                              key={specIndex}
                              variant="secondary"
                              className="text-xs bg-gray-100 text-gray-700"
                            >
                              {spec}
                            </Badge>
                          ))}
                          {member.specializations.length > 3 && (
                            <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                              +{member.specializations.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Languages */}
                    {member.languages && member.languages.length > 0 && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Languages className="h-4 w-4" />
                        <span>{member.languages.slice(0, 2).join(', ')}</span>
                        {member.languages.length > 2 && (
                          <span>+{member.languages.length - 2}</span>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* Placeholder team section if no team members */
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[1, 2, 3].map((index) => (
              <Card key={index} className="border-0 bg-white">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-brand-orange/20 to-brand-blue/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="h-10 w-10 text-brand-blue" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Expert Team Member
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Our certified translators bring years of experience and cultural expertise to every project.
                  </p>
                  <Badge variant="secondary">Professional Translator</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Team Stats */}
        <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-lg mb-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl lg:text-4xl font-bold text-brand-orange mb-2">100+</div>
              <div className="text-gray-600">Professional Translators</div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-bold text-brand-blue mb-2">50+</div>
              <div className="text-gray-600">Language Pairs</div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-bold text-brand-orange mb-2">25+</div>
              <div className="text-gray-600">Countries Represented</div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-bold text-brand-blue mb-2">15+</div>
              <div className="text-gray-600">Years Average Experience</div>
            </div>
          </div>
        </div>

        {/* Team Culture */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
              Our Team Culture
            </h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              At {companyName}, we believe that diversity is our strength. Our team spans continents and cultures, 
              bringing together native speakers, certified translators, and cultural experts who understand the 
              nuances of global communication.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              We foster a collaborative environment where continuous learning is encouraged, quality is paramount, 
              and every team member is empowered to deliver their best work. Our shared passion for language and 
              cultural understanding drives us to exceed client expectations consistently.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Award className="h-6 w-6 text-brand-orange" />
                <span className="text-gray-700">All translators are certified professionals</span>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="h-6 w-6 text-brand-blue" />
                <span className="text-gray-700">Native speakers for authentic translations</span>
              </div>
              <div className="flex items-center gap-3">
                <Users className="h-6 w-6 text-brand-orange" />
                <span className="text-gray-700">Collaborative approach to complex projects</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-brand-orange/10 to-brand-blue/10 p-8 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Users className="h-12 w-12 text-brand-blue" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">
                  Global Team
                </h4>
                <p className="text-gray-600">
                  United by excellence, diversity in expertise
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}