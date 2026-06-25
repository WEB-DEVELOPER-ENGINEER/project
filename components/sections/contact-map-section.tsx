'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Navigation, ExternalLink, Phone, Clock } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { trackPhoneClick } from '@/lib/analytics-events';

interface ContactMapSectionProps {
  contactData: any;
  siteSettings?: Record<string, any>;
}

export function ContactMapSection({ contactData, siteSettings = {} }: ContactMapSectionProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [mapLoaded, setMapLoaded] = useState(false);

  const handleLoadMap = () => {
    setMapLoaded(true);
  };

  const handleDirectionsClick = () => {
    window.open(contactData.map_url, '_blank');
  };

  const handlePhoneClick = () => {
    trackPhoneClick(contactData.phone, 'contact_map_section');
    window.location.href = `tel:${contactData.phone}`;
  };

  // Extract coordinates from Google Maps URL if possible
  const getEmbedUrl = (mapUrl: string) => {
    // Convert Google Maps share URL to embed URL
    if (mapUrl.includes('maps.app.goo.gl') || mapUrl.includes('goo.gl')) {
      // For shortened URLs, we'll use a generic embed with the address
      const address = encodeURIComponent(contactData.address);
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      if (apiKey && apiKey !== 'demo') {
        return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${address}&zoom=16`;
      } else {
        // Fallback to basic Google Maps embed without API key
        return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3608.1234567890!2d55.3397!3d25.2854!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDE3JzA3LjQiTiA1NcKwMjAnMjMuMCJF!5e0!3m2!1sen!2sae!4v1234567890123!5m2!1sen!2sae`;
      }
    }
    return mapUrl;
  };

  const landmarks = [
    {
      name: 'Dubai International Airport',
      distance: '15 minutes drive',
      icon: '✈️'
    },
    {
      name: 'Dubai Metro - Abu Hail Station',
      distance: '5 minutes walk',
      icon: '🚇'
    },
    {
      name: 'Deira City Centre',
      distance: '10 minutes drive',
      icon: '🏬'
    },
    {
      name: 'Dubai Creek',
      distance: '8 minutes walk',
      icon: '🌊'
    }
  ];

  return (
    <section 
      ref={ref}
      className="section-padding bg-white"
      aria-labelledby="contact-map-heading"
    >
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 
            id="contact-map-heading"
            className={`text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4 transition-all duration-700 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Visit Our Office
          </h2>
          <p 
            className={`text-xl text-gray-600 max-w-3xl mx-auto transition-all duration-700 delay-100 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Located in the heart of Dubai, our office is easily accessible by public transport and car. Schedule a visit to discuss your translation needs in person.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map */}
          <div className="lg:col-span-2">
            <Card 
              className={`overflow-hidden shadow-lg border-0 transition-all duration-700 delay-200 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <CardContent className="p-0">
                <div className="relative h-96 lg:h-[500px] bg-gray-100">
                  {!mapLoaded ? (
                    // Map placeholder with load button
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                      <div className="text-center mb-6">
                        <div className="w-20 h-20 bg-brand-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <MapPin className="w-10 h-10 text-brand-orange" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          Jusor Translation Office
                        </h3>
                        <p className="text-gray-600 text-sm max-w-xs">
                          {contactData.address}
                        </p>
                      </div>
                      <Button
                        onClick={handleLoadMap}
                        className="bg-brand-orange hover:bg-brand-orange/90 text-white px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <MapPin className="mr-2 h-5 w-5" />
                        Load Interactive Map
                      </Button>
                      <p className="text-xs text-gray-500 mt-3">
                        Click to load Google Maps
                      </p>
                    </div>
                  ) : (
                    // Actual embedded map
                    <iframe
                      src={getEmbedUrl(contactData.map_url)}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Jusor Translation Office Location - Dar Al Wuheida Building, Office 319, Abu Hail, Dubai"
                      className="absolute inset-0"
                      aria-label="Interactive map showing Jusor Translation office location in Dubai"
                    />
                  )}
                  
                  {/* Map overlay buttons */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <Button
                      onClick={handleDirectionsClick}
                      size="sm"
                      className="bg-white hover:bg-gray-50 text-gray-900 shadow-lg border border-gray-200"
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      Directions
                    </Button>
                    <Button
                      onClick={() => window.open(contactData.map_url, '_blank')}
                      size="sm"
                      variant="outline"
                      className="bg-white hover:bg-gray-50 text-gray-900 shadow-lg border border-gray-200"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open in Maps
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Location Information */}
          <div className="lg:col-span-1">
            <div 
              className={`space-y-6 transition-all duration-700 delay-400 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              {/* Office Details Card */}
              <Card className="shadow-lg border-0">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-brand-orange/10 rounded-lg flex items-center justify-center mr-4">
                      <MapPin className="w-6 h-6 text-brand-orange" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Office Address</h3>
                      <p className="text-sm text-gray-600">Main Location</p>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {contactData.address}
                  </p>
                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <Clock className="w-4 h-4 mr-2" />
                    {contactData.business_hours}
                  </div>
                  <Button
                    onClick={handlePhoneClick}
                    className="w-full bg-brand-blue hover:bg-brand-blue/90 text-white font-semibold"
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    Call Before Visiting
                  </Button>
                </CardContent>
              </Card>

              {/* Nearby Landmarks */}
              <Card className="shadow-lg border-0">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Nearby Landmarks</h3>
                  <div className="space-y-3">
                    {landmarks.map((landmark, index) => (
                      <div key={landmark.name} className="flex items-center">
                        <span className="text-lg mr-3">{landmark.icon}</span>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 text-sm">{landmark.name}</p>
                          <p className="text-xs text-gray-600">{landmark.distance}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Transportation */}
              <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-blue-50">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Getting Here</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start">
                      <span className="text-green-600 mr-2">🚗</span>
                      <div>
                        <p className="font-medium text-gray-900">By Car</p>
                        <p className="text-gray-600">Free parking available in the building</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className="text-blue-600 mr-2">🚇</span>
                      <div>
                        <p className="font-medium text-gray-900">By Metro</p>
                        <p className="text-gray-600">Abu Hail Station (Green Line) - 5 min walk</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className="text-orange-600 mr-2">🚌</span>
                      <div>
                        <p className="font-medium text-gray-900">By Bus</p>
                        <p className="text-gray-600">Multiple bus routes serve the area</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Visit Appointment */}
              <Card className="shadow-lg border-0 border-brand-orange/20 bg-brand-orange/5">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-brand-orange mb-2">Schedule a Visit</h3>
                  <p className="text-sm text-gray-700 mb-4">
                    We recommend scheduling an appointment to ensure our team is available to assist you with your translation needs.
                  </p>
                  <Button
                    onClick={() => {
                      const formSection = document.getElementById('contact-form-section');
                      if (formSection) {
                        formSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    variant="outline"
                    className="w-full border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white"
                  >
                    Schedule Appointment
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div 
          className={`mt-12 bg-gray-50 rounded-2xl p-8 transition-all duration-700 delay-600 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-16 h-16 bg-brand-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-brand-orange" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Prime Location</h3>
              <p className="text-gray-600 text-sm">
                Strategically located in Dubai's business district with easy access to major landmarks and transportation.
              </p>
            </div>
            <div>
              <div className="w-16 h-16 bg-brand-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-brand-blue" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Flexible Hours</h3>
              <p className="text-gray-600 text-sm">
                Extended business hours and emergency services available to accommodate your schedule and urgent needs.
              </p>
            </div>
            <div>
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Always Reachable</h3>
              <p className="text-gray-600 text-sm">
                Multiple communication channels ensure you can always reach us when you need translation services.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}