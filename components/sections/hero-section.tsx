'use client';

import React, { useState, useEffect, useRef } from 'react';
import NextImage from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, FileText, Globe, Shield, Clock } from 'lucide-react';
import { RichText } from '@/components/ui/safe-html';
import { EnhancedVideo } from '@/components/ui/enhanced-video';
import { Slider } from '@/lib/types';

interface HeroSectionProps {
  sliders: Slider[];
  siteSettings?: Record<string, any>;
}

export function HeroSection({ sliders, siteSettings = {} }: HeroSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [preloadedSlides, setPreloadedSlides] = useState<Set<number>>(new Set([0]));
  const [loadedAssets, setLoadedAssets] = useState<Set<number>>(new Set());
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [nextSlideIndex, setNextSlideIndex] = useState<number | null>(null);
  const heroRef = useRef<HTMLElement>(null);
  const preloadCacheRef = useRef<Map<string, HTMLImageElement | HTMLVideoElement>>(new Map());

  // Intersection Observer for performance
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
        });
      },
      { threshold: 0.1 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Auto-advance slides only when visible
  useEffect(() => {
    if (sliders.length > 1 && isVisible && !isTransitioning) {
      const timer = setInterval(() => {
        const nextIndex = (currentSlide + 1) % sliders.length;
        transitionToSlide(nextIndex);
      }, 6000); // Slightly longer for videos
      return () => clearInterval(timer);
    }
  }, [sliders.length, isVisible, isTransitioning, currentSlide]);

  // Advanced asset preloading system
  useEffect(() => {
    const preloadAsset = async (index: number): Promise<void> => {
      const slide = sliders[index];
      if (!slide || loadedAssets.has(index)) return;

      try {
        if (slide.media_type === 'image' && slide.image_url) {
          const cacheKey = `img-${index}-${slide.image_url}`;
          if (!preloadCacheRef.current.has(cacheKey)) {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.decoding = 'async';
            img.loading = 'eager';
            
            await new Promise<void>((resolve, reject) => {
              img.onload = () => {
                preloadCacheRef.current.set(cacheKey, img);
                resolve();
              };
              img.onerror = reject;
              img.src = slide.image_url!;
            });
          }
        } else if (slide.media_type === 'video') {
          // Preload video thumbnail
          if (slide.video_thumbnail_url) {
            const thumbCacheKey = `thumb-${index}-${slide.video_thumbnail_url}`;
            if (!preloadCacheRef.current.has(thumbCacheKey)) {
              const img = new Image();
              img.crossOrigin = 'anonymous';
              img.decoding = 'async';
              
              await new Promise<void>((resolve, reject) => {
                img.onload = () => {
                  preloadCacheRef.current.set(thumbCacheKey, img);
                  resolve();
                };
                img.onerror = reject;
                img.src = slide.video_thumbnail_url!;
              });
            }
          }

          // For direct videos, preload metadata
          if (slide.video_url && slide.video_url.includes('.mp4')) {
            const videoCacheKey = `video-${index}-${slide.video_url}`;
            if (!preloadCacheRef.current.has(videoCacheKey)) {
              const video = document.createElement('video');
              video.crossOrigin = 'anonymous';
              video.preload = 'metadata';
              video.muted = true;
              
              await new Promise<void>((resolve, reject) => {
                video.onloadedmetadata = () => {
                  preloadCacheRef.current.set(videoCacheKey, video);
                  resolve();
                };
                video.onerror = reject;
                video.src = slide.video_url!;
              });
            }
          }
        }

        setLoadedAssets(prev => new Set([...Array.from(prev), index]));
      } catch (error) {
        console.warn(`Failed to preload asset for slide ${index}:`, error);
        // Mark as loaded even if failed to prevent infinite retries
        setLoadedAssets(prev => new Set([...Array.from(prev), index]));
      }
    };

    // Aggressive preloading strategy
    const preloadStrategy = async () => {
      if (sliders.length === 0) return;

      // Priority 1: Current slide (immediate)
      if (!loadedAssets.has(currentSlide)) {
        await preloadAsset(currentSlide);
      }

      // Priority 2: Next slide (high priority)
      const nextSlide = (currentSlide + 1) % sliders.length;
      if (!loadedAssets.has(nextSlide)) {
        await preloadAsset(nextSlide);
      }

      // Priority 3: Previous slide (medium priority)
      const prevSlide = (currentSlide - 1 + sliders.length) % sliders.length;
      if (!loadedAssets.has(prevSlide)) {
        preloadAsset(prevSlide); // Don't await - background loading
      }

      // Priority 4: All remaining slides (low priority, background)
      sliders.forEach((_, index) => {
        if (!loadedAssets.has(index) && index !== currentSlide && index !== nextSlide && index !== prevSlide) {
          setTimeout(() => preloadAsset(index), 100 * index); // Staggered loading
        }
      });
    };

    preloadStrategy();
  }, [currentSlide, sliders, loadedAssets]);

  // Smooth transition functions with preload validation
  const transitionToSlide = async (newIndex: number) => {
    if (isTransitioning || newIndex === currentSlide) return;
    
    setIsTransitioning(true);
    setNextSlideIndex(newIndex);
    
    // Ensure the target slide is loaded before transitioning
    if (!loadedAssets.has(newIndex)) {
      const slide = sliders[newIndex];
      if (slide) {
        try {
          // Quick preload if not already loaded
          if (slide.media_type === 'image' && slide.image_url) {
            const img = new Image();
            await new Promise<void>((resolve, reject) => {
              img.onload = () => resolve();
              img.onerror = () => resolve(); // Continue even if failed
              img.src = slide.image_url!;
              // Timeout fallback
              setTimeout(resolve, 1000);
            });
          }
        } catch (error) {
          console.warn('Quick preload failed, continuing transition:', error);
        }
      }
    }
    
    // Small delay for smooth visual transition
    await new Promise(resolve => setTimeout(resolve, 150));
    
    setCurrentSlide(newIndex);
    setNextSlideIndex(null);
    
    // Reset transition state after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  const nextSlide = () => {
    const newIndex = (currentSlide + 1) % sliders.length;
    transitionToSlide(newIndex);
  };

  const prevSlide = () => {
    const newIndex = (currentSlide - 1 + sliders.length) % sliders.length;
    transitionToSlide(newIndex);
  };

  const goToSlide = (index: number) => {
    transitionToSlide(index);
  };

  const currentSliderData = sliders[currentSlide] || {
    title: siteSettings.hero_fallback_title || 'Professional Translation Services',
    description: siteSettings.hero_fallback_description || 'Expert translation services for legal, technical, and business documents. Certified translators, fast turnaround, and 24/7 support.',
    media_type: 'image' as const,
    image_url: null,
    video_url: null,
    video_thumbnail_url: null,
    video_autoplay: false,
    video_muted: true,
    video_loop: true,
    media_alt_text: 'Professional translation services',
    media_caption: null,
    lazy_loading: true
  };

  // Get trust indicators from settings
  const trustIndicators = siteSettings.hero_trust_indicators || [
    { icon: 'Shield', text: 'Certified Translators' },
    { icon: 'Clock', text: '24/7 Support' },
    { icon: 'Globe', text: '50+ Languages' },
    { icon: 'FileText', text: 'All Document Types' }
  ];

  // Get stats from settings
  const heroStats = siteSettings.hero_stats || [
    { value: '1000+', label: 'Projects Completed' },
    { value: '50+', label: 'Languages Supported' },
    { value: '24/7', label: 'Customer Support' }
  ];

  return (
    <section 
      ref={heroRef}
      className="relative overflow-hidden bg-gradient-to-br from-white via-orange-50 to-blue-50 py-20 sm:py-32"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>
      
      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content - Order 2 on mobile, 1 on desktop */}
          <div className="space-y-8 order-2 lg:order-1">
            <div className="space-y-4">
              <div className="inline-flex items-center rounded-full bg-brand-orange/10 px-4 py-2 text-sm font-medium text-brand-orange">
                {siteSettings.hero_badge_text || '🌟 Certified Translation Services in Dubai'}
              </div>
              
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                {currentSliderData.title}
              </h1>
              
              <div className="text-lg leading-8 text-gray-600 max-w-2xl">
                <RichText 
                  content={currentSliderData.description}
                  className="text-xl text-gray-600 mb-8 leading-relaxed"
                />
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-6 text-sm text-gray-600">
              {trustIndicators.map((indicator, index) => {
                const IconComponent = indicator.icon === 'Shield' ? Shield :
                                   indicator.icon === 'Clock' ? Clock :
                                   indicator.icon === 'Globe' ? Globe :
                                   FileText;
                return (
                  <div key={index} className="flex items-center gap-2">
                    <IconComponent className="h-5 w-5 text-brand-orange" />
                    <span>{indicator.text}</span>
                  </div>
                );
              })}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-brand-orange hover:bg-brand-orange/90 text-white px-8 py-3 text-lg"
                onClick={() => {
                  // Track conversion event
                  if (typeof window !== 'undefined' && window.gtag) {
                    window.gtag('event', 'cta_click', {
                      event_category: 'engagement',
                      event_label: 'hero_get_quote',
                      value: 1
                    });
                  }
                  // Navigate to contact page
                  window.location.href = '/contact';
                }}
              >
                {siteSettings.hero_primary_button_text || 'Get Free Quote'}
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white px-8 py-3 text-lg"
                onClick={() => {
                  document.getElementById('services-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {siteSettings.hero_secondary_button_text || 'Our Services'}
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200">
              {heroStats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-brand-blue">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Media Content - Image/Video - Order 1 on mobile, 2 on desktop */}
          <div className="relative order-1 lg:order-2">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-brand-orange/20 to-brand-blue/20">
              {/* Current Slide */}
              <div 
                className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${
                  isTransitioning ? 'opacity-0' : 'opacity-100'
                }`}
              >
                {currentSliderData.media_type === 'video' && currentSliderData.video_url ? (
                  <div className="hero-video-container">
                    <EnhancedVideo
                    src={currentSliderData.video_url}
                    poster={currentSliderData.video_thumbnail_url || undefined}
                    autoPlay={currentSliderData.video_autoplay || true}
                    muted={currentSliderData.video_muted || true}
                    loop={currentSliderData.video_loop || true}
                    platform={currentSliderData.video_platform}
                    embedId={currentSliderData.video_embed_id}
                    quality={currentSliderData.video_quality}
                    startTime={currentSliderData.video_start_time}
                    endTime={currentSliderData.video_end_time}
                    privacyMode={currentSliderData.video_privacy_mode}
                    preload={currentSliderData.lazy_loading ? 'metadata' : 'auto'}
                    className="w-full h-full object-cover"
                    controls={false}
                    priority={currentSlide === 0}
                    lazy={currentSlide !== 0}
                    ariaLabel={currentSliderData.media_alt_text || currentSliderData.title}
                    onLoadStart={() => {
                      // Track video load start
                      if (typeof window !== 'undefined' && window.gtag) {
                        window.gtag('event', 'video_load_start', {
                          event_category: 'engagement',
                          event_label: currentSliderData.title,
                          custom_parameters: {
                            video_platform: currentSliderData.video_platform,
                            video_quality: currentSliderData.video_quality
                          }
                        });
                      }
                    }}
                    onCanPlay={() => {
                      // Track video ready to play
                      if (typeof window !== 'undefined' && window.gtag) {
                        window.gtag('event', 'video_ready', {
                          event_category: 'engagement',
                          event_label: currentSliderData.title,
                          custom_parameters: {
                            video_platform: currentSliderData.video_platform
                          }
                        });
                      }
                    }}
                    onError={(error) => {
                      // Track video errors
                      console.error('Video playback error:', error);
                      if (typeof window !== 'undefined' && window.gtag) {
                        window.gtag('event', 'video_error', {
                          event_category: 'error',
                          event_label: currentSliderData.title,
                          custom_parameters: {
                            video_platform: currentSliderData.video_platform,
                            video_url: currentSliderData.video_url
                          }
                        });
                      }
                    }}
                  />
                  
                    {/* Video Caption - Hidden */}
                    {/* {currentSliderData.media_caption && (
                      <div className="absolute top-4 left-4 right-4 bg-black/70 text-white p-3 rounded-lg z-10">
                        <p className="text-sm">{currentSliderData.media_caption}</p>
                      </div>
                    )} */}
                  </div>
                ) : currentSliderData.image_url ? (
                  <div className="relative w-full h-full">
                    <NextImage
                      src={currentSliderData.image_url}
                      alt={currentSliderData.media_alt_text || currentSliderData.title}
                      fill
                      className="object-cover"
                      priority={currentSlide === 0 || loadedAssets.has(currentSlide)}
                      loading="eager"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      quality={90}
                    />
                    
                    {/* Image Caption */}
                    {currentSliderData.media_caption && (
                      <div className="absolute bottom-4 left-4 right-4 bg-black/70 text-white p-3 rounded-lg">
                        <p className="text-sm">{currentSliderData.media_caption}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full bg-gradient-to-br from-brand-orange to-brand-blue">
                    <div className="text-center text-white p-8">
                      <FileText className="h-16 w-16 mx-auto mb-4 opacity-80" />
                      <h3 className="text-2xl font-bold mb-2">Professional Translation</h3>
                      <p className="text-orange-100">Certified • Accurate • Fast</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Next Slide (for crossfade transition) */}
              {nextSlideIndex !== null && (
                <div 
                  className="absolute inset-0 transition-opacity duration-300 ease-in-out opacity-0 animate-fade-in"
                  style={{ animationDelay: '150ms' }}
                >
                  {(() => {
                    const nextSliderData = sliders[nextSlideIndex];
                    if (!nextSliderData) return null;

                    if (nextSliderData.media_type === 'video' && nextSliderData.video_url) {
                      return (
                        <div className="hero-video-container">
                          <EnhancedVideo
                            src={nextSliderData.video_url}
                            poster={nextSliderData.video_thumbnail_url || undefined}
                            autoPlay={nextSliderData.video_autoplay || true}
                            muted={nextSliderData.video_muted || true}
                            loop={nextSliderData.video_loop || true}
                            platform={nextSliderData.video_platform}
                            embedId={nextSliderData.video_embed_id}
                            quality={nextSliderData.video_quality}
                            startTime={nextSliderData.video_start_time}
                            endTime={nextSliderData.video_end_time}
                            privacyMode={nextSliderData.video_privacy_mode}
                            preload="auto"
                            className="w-full h-full object-cover"
                            controls={false}
                            priority={true}
                            lazy={false}
                            ariaLabel={nextSliderData.media_alt_text || nextSliderData.title}
                          />
                        </div>
                      );
                    } else if (nextSliderData.image_url) {
                      return (
                        <div className="relative w-full h-full">
                          <NextImage
                            src={nextSliderData.image_url}
                            alt={nextSliderData.media_alt_text || nextSliderData.title}
                            fill
                            className="object-cover"
                            priority={true}
                            loading="eager"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            quality={90}
                          />
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>
              )}
              
              {/* Slider Controls */}
              {sliders.length > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    disabled={isTransitioning}
                    className={`absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-lg transition-all ${
                      isTransitioning ? 'cursor-not-allowed opacity-50' : 'hover:bg-white'
                    }`}
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-700" />
                  </button>
                  <button
                    onClick={nextSlide}
                    disabled={isTransitioning}
                    className={`absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-lg transition-all ${
                      isTransitioning ? 'cursor-not-allowed opacity-50' : 'hover:bg-white'
                    }`}
                    aria-label="Next slide"
                  >
                    <ChevronRight className="h-5 w-5 text-gray-700" />
                  </button>
                  
                  {/* Slide Indicators */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {sliders.map((slider, index) => (
                      <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        disabled={isTransitioning}
                        className={`w-3 h-3 rounded-full transition-all flex items-center justify-center ${
                          index === currentSlide ? 'bg-white' : 'bg-white/50'
                        } ${isTransitioning ? 'cursor-not-allowed opacity-50' : 'hover:bg-white/80'}`}
                        aria-label={`Go to slide ${index + 1}: ${slider.title}`}
                        title={`${slider.media_type === 'video' ? '📹' : '🖼️'} ${slider.title}`}
                      >
                        {slider.media_type === 'video' && (
                          <div className="w-1 h-1 bg-brand-orange rounded-full" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Floating Cards */}
            <div className="absolute -bottom-6 -left-6 hidden lg:block">
              <Card className="bg-white shadow-xl">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <Shield className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">ISO Certified</div>
                      <div className="text-xs text-gray-600">Quality Assured</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="absolute -top-6 -right-6 hidden lg:block">
              <Card className="bg-white shadow-xl">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Clock className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">Fast Delivery</div>
                      <div className="text-xs text-gray-600">Same Day Available</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "JUSOR Translation Services",
            "description": currentSliderData.description,
            "url": typeof window !== 'undefined' ? window.location.origin : '',
            "logo": currentSliderData.media_type === 'image' ? currentSliderData.image_url : currentSliderData.video_thumbnail_url,
            "image": currentSliderData.media_type === 'image' ? currentSliderData.image_url : currentSliderData.video_thumbnail_url,
            "sameAs": [
              // Add social media URLs from settings
            ],
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+971-XX-XXXXXXX",
              "contactType": "customer service",
              "availableLanguage": ["en", "ar"]
            },
            "areaServed": {
              "@type": "Country",
              "name": "United Arab Emirates"
            },
            "serviceType": "Translation Services",
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Translation Services",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Legal Translation",
                    "description": "Certified legal document translation services"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Technical Translation",
                    "description": "Professional technical document translation"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Business Translation",
                    "description": "Corporate and business document translation"
                  }
                }
              ]
            }
          })
        }}
      />

      {/* Video Structured Data (if current slide is video) */}
      {currentSliderData.media_type === 'video' && currentSliderData.video_url && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "VideoObject",
              "name": currentSliderData.title,
              "description": currentSliderData.description,
              "thumbnailUrl": currentSliderData.video_thumbnail_url,
              "contentUrl": currentSliderData.video_url,
              "uploadDate": new Date().toISOString(),
              "duration": currentSliderData.video_duration ? `PT${currentSliderData.video_duration}S` : undefined,
              "publisher": {
                "@type": "Organization",
                "name": "JUSOR Translation Services",
                "logo": {
                  "@type": "ImageObject",
                  "url": currentSliderData.video_thumbnail_url
                }
              }
            })
          }}
        />
      )}
    </section>
  );
}