'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  MessageCircle,
  Phone,
  Mail,
  ArrowRight,
  Star,
  Users,
  Award
} from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { Project } from '@/lib/types';
import Link from 'next/link';
import { trackPhoneClick, trackEmailClick, trackWhatsAppClick } from '@/lib/analytics-events';

interface ProjectDetailCTAProps {
  project: Project;
  siteSettings?: Record<string, any>;
}

export function ProjectDetailCTA({ project, siteSettings = {} }: ProjectDetailCTAProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Contact information from memory
  const contactInfo = {
    phone: '+971 50 324 4329',
    whatsapp: '971503244329',
    email: 'info@jusortrans.com'
  };

  const trustIndicators = [
    {
      icon: Star,
      value: '500+',
      label: 'Projects Completed',
      color: 'text-brand-orange'
    },
    {
      icon: Users,
      value: '200+',
      label: 'Happy Clients',
      color: 'text-brand-blue'
    },
    {
      icon: Award,
      value: '99.8%',
      label: 'Quality Score',
      color: 'text-green-600'
    }
  ];

  const handleWhatsAppClick = () => {
    trackWhatsAppClick(contactInfo.whatsapp, 'project_detail_cta');
    const message = encodeURIComponent(`Hi! I'm interested in translation services similar to the "${project.title}" project. Could you provide more information?`);
    window.open(`https://wa.me/${contactInfo.whatsapp}?text=${message}`, '_blank');
  };

  const handlePhoneClick = () => {
    trackPhoneClick(contactInfo.phone, 'project_detail_cta');
    window.open(`tel:${contactInfo.phone}`, '_self');
  };

  const handleEmailClick = () => {
    trackEmailClick(contactInfo.email, 'project_detail_cta');
    const subject = encodeURIComponent(`Inquiry about Translation Services - ${project.title}`);
    const body = encodeURIComponent(`Hello,\n\nI'm interested in translation services similar to your "${project.title}" project. Could you please provide more information about your services and pricing?\n\nThank you!`);
    window.open(`mailto:${contactInfo.email}?subject=${subject}&body=${body}`, '_self');
  };

  return (
    <section 
      ref={ref}
      className="py-16 bg-gradient-to-br from-brand-blue to-brand-blue/90 text-white relative overflow-hidden"
      aria-labelledby="project-cta-heading"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      </div>

      <div className="container relative">
        <div className="max-w-4xl mx-auto">
          {/* Main CTA Content */}
          <div 
            className={`text-center mb-12 transition-all duration-700 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <h2 
              id="project-cta-heading"
              className="text-3xl md:text-4xl font-bold mb-6"
            >
              Ready to Start Your Translation Project?
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed mb-8">
              Get the same professional quality and attention to detail that made this project successful. 
              Our expert team is ready to help you achieve your translation goals.
            </p>

            {/* Trust Indicators */}
            <div 
              className={`grid md:grid-cols-3 gap-6 mb-12 transition-all duration-700 delay-200 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              {trustIndicators.map((indicator, index) => (
                <div key={index} className="text-center">
                  <div className="bg-white/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <indicator.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">
                    {indicator.value}
                  </div>
                  <div className="text-blue-100 text-sm">
                    {indicator.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Cards */}
          <div 
            className={`grid md:grid-cols-2 gap-8 mb-12 transition-all duration-700 delay-300 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {/* Quick Contact Card */}
            <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Get Instant Quote
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Contact us directly for immediate assistance and personalized consultation 
                  about your translation needs.
                </p>
                
                <div className="space-y-4">
                  <Button 
                    onClick={handleWhatsAppClick}
                    className="w-full bg-green-600 hover:bg-green-700 text-white justify-start"
                    size="lg"
                  >
                    <MessageCircle className="h-5 w-5 mr-3" />
                    WhatsApp: {contactInfo.phone}
                  </Button>
                  
                  <Button 
                    onClick={handlePhoneClick}
                    variant="outline"
                    className="w-full border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white justify-start"
                    size="lg"
                  >
                    <Phone className="h-5 w-5 mr-3" />
                    Call: {contactInfo.phone}
                  </Button>
                  
                  <Button 
                    onClick={handleEmailClick}
                    variant="outline"
                    className="w-full border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white justify-start"
                    size="lg"
                  >
                    <Mail className="h-5 w-5 mr-3" />
                    Email: {contactInfo.email}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Formal Quote Card */}
            <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Request Detailed Quote
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Submit your project details through our contact form for a comprehensive 
                  quote and project timeline.
                </p>
                
                <div className="space-y-4">
                  <Button 
                    asChild
                    className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white"
                    size="lg"
                  >
                    <Link href="/contact#contact-form-section">
                      Get Detailed Quote
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Link>
                  </Button>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-2">
                      Or explore our services
                    </p>
                    <Button 
                      asChild
                      variant="ghost"
                      className="text-brand-blue hover:text-brand-blue/80 hover:bg-brand-blue/10"
                    >
                      <Link href="/services">
                        View All Services
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Message */}
          <div 
            className={`text-center transition-all duration-700 delay-400 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <p className="text-lg text-blue-100 mb-4">
                <strong className="text-white">Free Consultation:</strong> We offer complimentary project 
                assessment and consultation to ensure we understand your specific requirements.
              </p>
              <p className="text-blue-200">
                Response time: Within 2 hours during business hours | 24/7 WhatsApp support available
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
