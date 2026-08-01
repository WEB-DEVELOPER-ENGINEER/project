'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowRight,
  MessageSquare,
  FileText,
  Phone,
  Mail,
  Calendar,
  CheckCircle,
  Star,
  Globe,
  Users
} from 'lucide-react';
import { trackPhoneClick, trackEmailClick } from '@/lib/analytics-events';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { ABOUT_CONTENT } from '@/lib/content/about-content';
import { companyName as resolveCompanyName } from '@/lib/company';
import { localizedPath } from '@/lib/locale';

interface AboutCTAProps {
  siteSettings: Record<string, any>;
}

export function AboutCTA({ siteSettings }: AboutCTAProps) {
  const { locale } = useLanguage();
  const ac = ABOUT_CONTENT[locale].cta;
  const companyName = resolveCompanyName(siteSettings, locale);

  return (
    <section className="bg-gradient-to-br from-brand-orange via-brand-orange/90 to-brand-blue text-white py-20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px] opacity-30" />
      
      {/* Decorative Elements */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

      <div className="relative container">
        {/* Main CTA Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">
            {ac.heading}
          </h2>
          <p className="text-xl lg:text-2xl text-white/90 mb-8 leading-relaxed">
            {ac.body.replace(/\{company\}/g, companyName)}
          </p>

          {/* Primary CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              asChild
              size="lg"
              className="bg-white text-brand-orangeText hover:bg-gray-50 font-semibold text-lg px-8 py-4"
            >
              <Link href={localizedPath("/contact", locale)}>
                <FileText className="h-6 w-6 mr-2" />
                {ac.getFreeQuote}
                <ArrowRight className="h-6 w-6 ml-2" />
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-white text-white hover:bg-white hover:text-brand-orangeText font-semibold text-lg px-8 py-4"
              asChild
            >
              <Link href={localizedPath("/services", locale)}>
                <Globe className="h-6 w-6 mr-2" />
                {ac.exploreServices}
              </Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-white/80">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              <span>{ac.freeConsultation}</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              <span>{ac.satisfactionRate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span>{ac.happyClients}</span>
            </div>
          </div>
        </div>

        {/* Contact Options Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Phone Contact */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 group">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-white/30 transition-colors">
                <Phone className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {ac.callUsToday}
              </h3>
              <p className="text-white/80 mb-6">
                {ac.callUsBody}
              </p>
              <Button 
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-brand-orangeText w-full"
                asChild
              >
                <a 
                  href={`tel:${siteSettings.company_phone || '+971 50 324 4329'}`}
                  onClick={() => trackPhoneClick(siteSettings.company_phone || '+971 50 324 4329', 'about_cta_section')}
                >
                  {siteSettings.company_phone || '+971 50 324 4329'}
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Email Contact */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 group">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-white/30 transition-colors">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {ac.emailUs}
              </h3>
              <p className="text-white/80 mb-6">
                {ac.emailUsBody}
              </p>
              <Button 
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-brand-orangeText w-full"
                asChild
              >
                <a 
                  href={`mailto:${siteSettings.company_email || 'info@jusortrans.com'}`}
                  onClick={() => trackEmailClick(siteSettings.company_email || 'info@jusortrans.com', 'about_cta_section')}
                >
                  {siteSettings.company_email || 'info@jusortrans.com'}
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Schedule Meeting */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 group">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-white/30 transition-colors">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {ac.scheduleMeeting}
              </h3>
              <p className="text-white/80 mb-6">
                {ac.scheduleMeetingBody}
              </p>
              <Button 
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-brand-orangeText w-full"
                asChild
              >
                <Link href={localizedPath("/contact", locale)}>
                  {ac.bookConsultation}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Secondary CTAs */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Learn More */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                {ac.learnMoreTitle}
              </h3>
              <p className="text-white/80 mb-6">
                {ac.learnMoreBody}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-brand-orangeText"
                  asChild
                >
                  <Link href={localizedPath("/services", locale)}>
                    {ac.viewAllServices}
                  </Link>
                </Button>
                <Button 
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-brand-orangeText"
                  asChild
                >
                  <Link href={localizedPath("/projects", locale)}>
                    {ac.seeOurWork}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Final Message */}
        <div className="text-center mt-16 pt-8 border-t border-white/20">
          <p className="text-white/80 text-lg">
            {ac.closingLine}
          </p>
        </div>
      </div>
    </section>
  );
}