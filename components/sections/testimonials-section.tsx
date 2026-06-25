'use client';

import { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useInView } from 'react-intersection-observer';
import { QuoteText } from '@/components/ui/safe-html';
import { Testimonial } from '@/lib/types';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
  siteSettings?: Record<string, any>;
}

export function TestimonialsSection({ testimonials, siteSettings = {} }: TestimonialsSectionProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const [currentIndex, setCurrentIndex] = useState(0);

  // Don't render if no testimonials
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    if (testimonials.length > 1) {
      const interval = setInterval(() => {
        nextTestimonial();
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [testimonials.length]);

  return (
    <section 
      className="section-padding bg-gray-50"
      aria-labelledby="testimonials-heading"
    >
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 
            id="testimonials-heading"
            className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
          >
            {siteSettings.testimonials_section_title || 'What Our Clients Say'}
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            {siteSettings.testimonials_section_description || 'Trusted by industry leaders worldwide for exceptional results and service.'}
          </p>
        </div>

        <div 
          ref={ref}
          className={`mx-auto mt-16 max-w-4xl transition-all duration-1000 ${
            inView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <Card className="relative overflow-hidden shadow-xl">
            <CardContent className="p-8 sm:p-12">
              <div className="flex justify-between items-center mb-8">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < testimonials[currentIndex].rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={prevTestimonial}
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={nextTestimonial}
                    aria-label="Next testimonial"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <QuoteText 
                content={`"${testimonials[currentIndex].description}"`}
                className="text-xl leading-8 text-gray-900 sm:text-2xl sm:leading-9"
              />

              <div className="mt-8 flex items-center">
                <img
                  className="h-12 w-12 rounded-full object-cover"
                  src={testimonials[currentIndex].image_url}
                  alt={`${testimonials[currentIndex].name} profile`}
                  loading="lazy"
                />
                <div className="ml-4">
                  <div className="font-semibold text-gray-900">
                    {testimonials[currentIndex].name}
                  </div>
                  <div className="text-gray-600">
                    {testimonials[currentIndex].position}, {testimonials[currentIndex].company}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pagination dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`h-2 w-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-brand-orange' : 'bg-gray-300'
                }`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}