'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageCircle, 
  Instagram,
  Globe,
  Users,
  Award,
  Headphones,
  ArrowRight
} from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { trackPhoneClick, trackEmailClick, trackWhatsAppClick } from '@/lib/analytics-events';

interface ContactInfoSectionProps {
  contactData: any;
  siteSettings?: Record<string, any>;
}

export function ContactInfoSection({ contactData, siteSettings = {} }: ContactInfoSectionProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const handlePhoneClick = () => {
    trackPhoneClick(contactData.phone, 'contact_info_section');
    window.location.href = `tel:${contactData.phone}`;
  };

  const handleEmailClick = () => {
    trackEmailClick(contactData.email, 'contact_info_section');
    window.location.href = `mailto:${contactData.email}`;
  };

  const handleWhatsAppClick = () => {
    trackWhatsAppClick(contactData.whatsapp_number, 'contact_info_section');
    const message = encodeURIComponent(contactData.whatsapp_message || 'Hello Jusor, I would like to inquire about your services.');
    window.open(`https://api.whatsapp.com/send?phone=${contactData.whatsapp_number}&text=${message}`, '_blank');
  };

  const handleInstagramClick = () => {
    window.open(contactData.instagram_url, '_blank');
  };

  const handleDirectionsClick = () => {
    window.open(contactData.map_url, '_blank');
  };

  const contactMethods = [
    {
      icon: Phone,
      title: 'Call Us',
      description: 'Speak directly with our team',
      value: contactData.phone,
      action: handlePhoneClick,
      color: 'from-green-500 to-green-600',
      available: '24/7 Support Available'
    },
    {
      icon: Mail,
      title: 'Email Us',
      description: 'Send us your project details',
      value: contactData.email,
      action: handleEmailClick,
      color: 'from-blue-500 to-blue-600',
      available: 'Response within 2-4 hours'
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      description: 'Chat with us instantly',
      value: 'Start Chat',
      action: handleWhatsAppClick,
      color: 'from-green-400 to-green-500',
      available: 'Instant messaging'
    },
    {
      icon: Instagram,
      title: 'Follow Us',
      description: 'Stay updated with our work',
      value: '@Jusor_translation',
      action: handleInstagramClick,
      color: 'from-pink-500 to-purple-600',
      available: 'Latest updates & portfolio'
    }
  ];

  const officeInfo = [
    {
      icon: MapPin,
      title: 'Office Location',
      details: [
        contactData.address,
        `${contactData.city}, ${contactData.country}`
      ]
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: [
        contactData.business_hours,
        'Friday & Saturday: Closed',
        'Emergency services available 24/7'
      ]
    },
    {
      icon: Globe,
      title: 'Service Areas',
      details: [
        'Dubai, UAE (Primary)',
        'Middle East & North Africa',
        'Global remote services',
        '50+ languages supported'
      ]
    }
  ];

  const whyChooseUs = [
    {
      icon: Award,
      title: 'Certified Professionals',
      description: 'All our translators are certified and experienced in their respective fields.'
    },
    {
      icon: Users,
      title: 'Expert Team',
      description: 'Native speakers and subject matter experts for accurate translations.'
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Round-the-clock customer support for urgent projects and inquiries.'
    }
  ];

  return (
    <section 
      ref={ref}
      className="section-padding bg-gray-50"
      aria-labelledby="contact-info-heading"
    >
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 
            id="contact-info-heading"
            className={`text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4 transition-all duration-700 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Multiple Ways to Reach Us
          </h2>
          <p 
            className={`text-xl text-gray-600 max-w-3xl mx-auto transition-all duration-700 delay-100 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Choose the communication method that works best for you. We're here to help with all your translation needs.
          </p>
        </div>

        {/* Contact Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactMethods.map((method, index) => {
            const IconComponent = method.icon;
            
            return (
              <Card 
                key={method.title}
                className={`group cursor-pointer border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 bg-white ${
                  inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{
                  transitionDelay: `${200 + index * 100}ms`
                }}
                onClick={method.action}
              >
                <CardContent className="p-6 text-center">
                  {/* Icon */}
                  <div className="mb-4">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${method.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent 
                        className="h-8 w-8 text-white" 
                        aria-hidden="true"
                      />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-brand-blue transition-colors duration-300">
                    {method.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-3">
                    {method.description}
                  </p>

                  {/* Value */}
                  <p className="font-semibold text-gray-900 mb-2 break-all">
                    {method.value}
                  </p>

                  {/* Availability */}
                  <p className="text-xs text-green-600 font-medium">
                    {method.available}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Office Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Office Details */}
          <div 
            className={`transition-all duration-700 delay-300 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Office Information</h3>
            <div className="space-y-6">
              {officeInfo.map((info, index) => {
                const IconComponent = info.icon;
                
                return (
                  <div key={info.title} className="flex items-start">
                    <div className="w-12 h-12 bg-brand-orange/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <IconComponent className="w-6 h-6 text-brand-orange" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">{info.title}</h4>
                      <div className="space-y-1">
                        {info.details.map((detail, detailIndex) => (
                          <p key={detailIndex} className="text-gray-600 text-sm">
                            {detail}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Get Directions Button */}
            <div className="mt-8">
              <Button
                onClick={handleDirectionsClick}
                className="bg-brand-blue hover:bg-brand-blue/90 text-white px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <MapPin className="mr-2 h-5 w-5" />
                Get Directions
              </Button>
            </div>

            {/* Internal Links */}
            <div className="mt-6 text-center space-y-3">
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <Link 
                  href="/services"
                  className="inline-flex items-center text-white hover:text-brand-orange transition-colors duration-300 font-medium focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-blue rounded px-3 py-1"
                >
                  Our Services
                  <ArrowRight className="ml-1 h-3 w-3" aria-hidden="true" />
                </Link>
                <Link 
                  href="/about"
                  className="inline-flex items-center text-white hover:text-brand-orange transition-colors duration-300 font-medium focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-blue rounded px-3 py-1"
                >
                  About Us
                  <ArrowRight className="ml-1 h-3 w-3" aria-hidden="true" />
                </Link>
                <Link 
                  href="/blog"
                  className="inline-flex items-center text-white hover:text-brand-orange transition-colors duration-300 font-medium focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-blue rounded px-3 py-1"
                >
                  Blog & Resources
                  <ArrowRight className="ml-1 h-3 w-3" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>

          {/* Why Choose Us */}
          <div 
            className={`transition-all duration-700 delay-500 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Why Choose Jusor Translation?</h3>
            <div className="space-y-6">
              {whyChooseUs.map((item, index) => {
                const IconComponent = item.icon;
                
                return (
                  <div key={item.title} className="flex items-start">
                    <div className="w-12 h-12 bg-brand-blue/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <IconComponent className="w-6 h-6 text-brand-blue" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Stats */}
            <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-brand-orange mb-1">500+</div>
                  <div className="text-sm text-gray-600">Projects Completed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-brand-blue mb-1">50+</div>
                  <div className="text-sm text-gray-600">Languages Supported</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-brand-orange mb-1">98%</div>
                  <div className="text-sm text-gray-600">Client Satisfaction</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-brand-blue mb-1">24/7</div>
                  <div className="text-sm text-gray-600">Support Available</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contact Banner */}
        <div 
          className={`bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-8 text-center text-white transition-all duration-700 delay-700 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <h3 className="text-2xl font-bold mb-4">Need Urgent Translation Services?</h3>
          <p className="text-red-100 mb-6 max-w-2xl mx-auto">
            We understand that some projects can't wait. Our emergency translation service is available 24/7 for urgent documents and time-sensitive projects.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handlePhoneClick}
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-red-600 px-6 py-3 font-semibold"
            >
              <Phone className="mr-2 h-5 w-5" />
              Call Now: {contactData.phone}
            </Button>
            <Button
              onClick={handleWhatsAppClick}
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-red-600 px-6 py-3 font-semibold"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              WhatsApp Emergency
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}