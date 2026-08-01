'use client';

import Link from 'next/link';
import { localizedPath } from '@/lib/locale';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, MessageCircle, Phone, Mail, Clock, CheckCircle, Star } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { trackPhoneClick, trackEmailClick, trackWhatsAppClick } from '@/lib/analytics-events';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { CONTACT_CONTENT } from '@/lib/content/contact-content';

interface ContactCTASectionProps {
  contactData: any;
  siteSettings?: Record<string, any>;
}

export function ContactCTASection({ contactData, siteSettings = {} }: ContactCTASectionProps) {
  const { locale } = useLanguage();
  const c = CONTACT_CONTENT[locale].cta;
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const handleScrollToForm = () => {
    const formSection = document.getElementById('contact-form-section');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleWhatsAppClick = () => {
    trackWhatsAppClick(contactData.whatsapp_number, 'contact_cta_section');
    const message = encodeURIComponent(c.whatsappMessage);
    window.open(`https://api.whatsapp.com/send?phone=${contactData.whatsapp_number}&text=${message}`, '_blank');
  };

  const handlePhoneClick = () => {
    trackPhoneClick(contactData.phone, 'contact_cta_section');
    window.location.href = `tel:${contactData.phone}`;
  };

  const handleEmailClick = () => {
    trackEmailClick(contactData.email, 'contact_cta_section');
    window.location.href = `mailto:${contactData.email}`;
  };

  const benefits = c.benefits;

  return (
    <section 
      ref={ref}
      className="section-padding bg-gradient-to-br from-brand-blue via-brand-blue/95 to-brand-orange/20 relative overflow-hidden"
      aria-labelledby="contact-cta-heading"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 bg-grid-white/10 bg-[size:30px_30px] opacity-20" />
      <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-brand-orange/20 blur-3xl" />

      <div className="container relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Main CTA Content */}
          <div>
            <h2 
              id="contact-cta-heading"
              className={`text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl mb-6 transition-all duration-700 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              {c.title}
            </h2>

            <p
              className={`text-xl text-blue-100 mb-8 leading-relaxed transition-all duration-700 delay-100 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              {c.description}
            </p>

            {/* Benefits List */}
            <div 
              className={`grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 transition-all duration-700 delay-200 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              {benefits.map((benefit, index) => (
                <div key={benefit} className="flex items-center text-blue-100">
                  <CheckCircle className="w-5 h-5 text-brand-orangeText mr-3 flex-shrink-0" aria-hidden="true" />
                  <span className="text-sm font-medium">{benefit}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div 
              className={`flex flex-col sm:flex-row gap-4 mb-8 transition-all duration-700 delay-300 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <Button 
                size="lg"
                className="bg-brand-orangeText hover:bg-brand-orangeText/90 text-white px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 group border-0"
                onClick={handleScrollToForm}
                aria-describedby="get-quote-cta-description"
              >
                {c.primaryAction}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" aria-hidden="true" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-brand-blue px-8 py-4 text-lg font-semibold transition-all duration-300 bg-transparent"
                onClick={handleWhatsAppClick}
                aria-describedby="whatsapp-cta-description"
              >
                <MessageCircle className="mr-2 h-5 w-5" aria-hidden="true" />
                {c.sendMessage}
              </Button>
            </div>

            {/* Quick Contact Strip */}
            <div 
              className={`flex flex-col sm:flex-row gap-4 text-blue-100 transition-all duration-700 delay-400 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <button
                onClick={handlePhoneClick}
                className="flex items-center hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-blue rounded"
                aria-label={`Call us at ${contactData.phone}`}
              >
                <Phone className="w-4 h-4 mr-2" aria-hidden="true" />
                <span className="text-sm font-medium">{contactData.phone}</span>
              </button>
              
              <span className="hidden sm:block text-blue-300">|</span>
              
              <button
                onClick={handleEmailClick}
                className="flex items-center hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-blue rounded"
                aria-label={`Email us at ${contactData.email}`}
              >
                <Mail className="w-4 h-4 mr-2" aria-hidden="true" />
                <span className="text-sm font-medium">{contactData.email}</span>
              </button>
            </div>

            {/* Screen reader descriptions */}
            <div className="sr-only">
              <p id="get-quote-cta-description">
                {c.srQuote}
              </p>
              <p id="whatsapp-cta-description">
                {c.srWhatsapp}
              </p>
            </div>
          </div>

          {/* Testimonial & Trust Indicators */}
          <div 
            className={`transition-all duration-700 delay-500 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {/* Accreditations. This previously displayed a fabricated
                5-star testimonial from an invented client ("Sarah
                Al-Mahmoud, Legal Consultant") — removed. Replaced with the
                company's real, verifiable accreditations. Restore a
                testimonial here only when a genuine, attributable client
                quote is available. */}
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl mb-6">
              <CardContent className="p-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  {c.accreditationsTitle}
                </h3>
                <ul className="space-y-3">
                  {c.accreditations.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-700">
                      <CheckCircle className="w-5 h-5 text-brand-orangeText flex-shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-6 h-6 text-green-600" aria-hidden="true" />
                  </div>
                  <p className="font-bold text-2xl text-gray-900 mb-1">2-4 Hours</p>
                  <p className="text-sm text-gray-600">{c.responseTime}</p>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-6 h-6 text-blue-600" aria-hidden="true" />
                  </div>
                  <p className="font-bold text-2xl text-gray-900 mb-1">500+</p>
                  <p className="text-sm text-gray-600">{c.statProjectsLabel}</p>
                </CardContent>
              </Card>
            </div>

            {/* Additional Services Link */}
            <div className="mt-6 text-center">
              <Link 
                href={localizedPath("/services", locale)}
                className="inline-flex items-center text-white hover:text-brand-orangeText transition-colors duration-300 font-medium focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-blue rounded"
              >
                {c.exploreAllServices}
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div 
          className={`mt-16 text-center transition-all duration-700 delay-600 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-4">
              {c.stillQuestions}
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              {c.stillQuestionsBody}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handlePhoneClick}
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-brand-blue px-6 py-3 font-semibold bg-transparent"
              >
                <Phone className="mr-2 h-5 w-5" aria-hidden="true" />
                {c.callUsNow}
              </Button>
              <Button
                onClick={() => {
                  const formSection = document.getElementById('contact-form-section');
                  if (formSection) {
                    formSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="bg-brand-orangeText hover:bg-brand-orangeText/90 text-white px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {c.sendUsMessage}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
