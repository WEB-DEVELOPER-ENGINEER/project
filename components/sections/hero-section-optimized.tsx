'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import NextImage from 'next/image';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, FileText, Globe, Shield, Clock } from 'lucide-react';
import { RichText } from '@/components/ui/safe-html';
import { Slider } from '@/lib/types';

// Dynamically import video component to reduce initial bundle size
const OptimizedVideo = dynamic(() => import('@/components/ui/optimized-video-v2'), {
  loading: () => <div className="w-full h-full bg-gray-200 animate-pulse rounded-lg" />,
  ssr: false
});

interface HeroSectionProps {
  sliders: Slider[];
  siteSettings?: Record<string, any>;
}

// Performance-optimized preloading strategy
const useSmartPreloader = (sliders: Slider[], currentSlide: number, isVisible: boolean) => {
  const [loadedAssets, setLoadedAssets] = useState<Set<number>>(new Set([0]));
  const preloadCacheRef = useRef<Map<string, HTMLImageElement>>(new Map());
  const abortControllerRef = useRef<AbortController | null>(null);

  const preloadImage = useCallback(async (url: string, priority: boolean = false): Promise<HTMLImageElement> => {
    const cacheKey = `img-${url}`;
    
    if (preloadCacheRef.current.has(cacheKey)) {
      return preloadCacheRef.current.get(cacheKey)!;
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      
      // Optimize image loading attributes
      img.decoding = 'async';
      img.loading = priority ? 'eager' : 'lazy';
      
      // Set fetch priority (with TypeScript compatibility)
      if ('fetchPriority' in img) {
        (img as any).fetchPriority = priority ? 'high' : 'low';
      }
      
      // Add responsive image hints
      img.sizes = '(max-width: 768px) 100vw, 50vw';
      
      img.onload = () => {
        preloadCacheRef.current.set(cacheKey, img);
        resolve(img);
      };
      
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
      
      // Add abort signal for cleanup
      if (abortControllerRef.current?.signal.aborted) {
        reject(new Error('Preload aborted'));
        return;
      }
      
      img.src = url;
    });
  }, []);

  const preloadAsset = useCallback(async (index: number, priority: boolean = false) => {
    if (loadedAssets.has(index) || !sliders[index]) return;

    const slide = sliders[index];
    
    try {
      if (slide.media_type === 'image' && slide.image_url) {
        await preloadImage(slide.image_url, priority);
      } else if (slide.media_type === 'video' && slide.video_thumbnail_url) {
        // Only preload video thumbnails, not the actual videos
        await preloadImage(slide.video_thumbnail_url, priority);
      }
      
      setLoadedAssets(prev => new Set(Array.from(prev).concat(index)));
    } catch (error) {
      console.warn(`Failed to preload asset for slide ${index}:`, error);
      // Mark as loaded to prevent infinite retries
      setLoadedAssets(prev => new Set(Array.from(prev).concat(index)));
    }
  }, [sliders, loadedAssets, preloadImage]);

  // Smart preloading strategy with priority queue
  useEffect(() => {
    if (!isVisible || sliders.length === 0) return;

    // Cancel any ongoing preloads
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    const preloadStrategy = async () => {
      // Priority 1: Current slide (immediate, high priority)
      if (!loadedAssets.has(currentSlide)) {
        await preloadAsset(currentSlide, true);
      }

      // Priority 2: Next slide (high priority, but async)
      const nextSlide = (currentSlide + 1) % sliders.length;
      if (!loadedAssets.has(nextSlide)) {
        preloadAsset(nextSlide, true);
      }

      // Priority 3: Previous slide (medium priority, background)
      const prevSlide = (currentSlide - 1 + sliders.length) % sliders.length;
      if (!loadedAssets.has(prevSlide)) {
        setTimeout(() => preloadAsset(prevSlide, false), 100);
      }

      // Priority 4: Remaining slides (low priority, heavily throttled)
      sliders.forEach((_, index) => {
        if (index !== currentSlide && index !== nextSlide && index !== prevSlide) {
          setTimeout(() => preloadAsset(index, false), 1000 + (index * 500));
        }
      });
    };

    preloadStrategy();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [currentSlide, sliders, isVisible, loadedAssets, preloadAsset]);

  return { loadedAssets, preloadedImages: preloadCacheRef.current };
};

// Optimized transition hook with reduced layout shift
const useOptimizedTransitions = (slidersLength: number) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [nextSlideIndex, setNextSlideIndex] = useState<number | null>(null);
  const transitionTimeoutRef = useRef<NodeJS.Timeout>();

  const transitionToSlide = useCallback(async (newIndex: number) => {
    if (isTransitioning || newIndex === currentSlide || newIndex >= slidersLength) return;
    
    // Clear any pending transitions
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }
    
    setIsTransitioning(true);
    setNextSlideIndex(newIndex);
    
    // Use requestAnimationFrame for smooth transitions
    await new Promise(resolve => requestAnimationFrame(resolve));
    
    // Minimal delay for crossfade effect
    transitionTimeoutRef.current = setTimeout(() => {
      setCurrentSlide(newIndex);
      setNextSlideIndex(null);
      
      // Reset transition state after animation
      setTimeout(() => setIsTransitioning(false), 150);
    }, 100);
  }, [isTransitioning, currentSlide, slidersLength]);

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  return {
    currentSlide,
    isTransitioning,
    nextSlideIndex,
    transitionToSlide,
    nextSlide: useCallback(() => {
      const newIndex = (currentSlide + 1) % slidersLength;
      transitionToSlide(newIndex);
    }, [currentSlide, slidersLength, transitionToSlide]),
    prevSlide: useCallback(() => {
      const newIndex = (currentSlide - 1 + slidersLength) % slidersLength;
      transitionToSlide(newIndex);
    }, [currentSlide, slidersLength, transitionToSlide]),
    goToSlide: transitionToSlide
  };
};

import { useLanguage } from '@/components/providers/LanguageProvider';
import { localizedPath } from '@/lib/locale';

export function HeroSectionOptimized({ sliders, siteSettings = {} }: HeroSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const autoplayTimerRef = useRef<NodeJS.Timeout>();
  const { t, isRtl, locale } = useLanguage();

  // Use optimized hooks
  const { currentSlide, isTransitioning, nextSlideIndex, transitionToSlide, nextSlide, prevSlide, goToSlide } = 
    useOptimizedTransitions(sliders.length);
  const { loadedAssets } = useSmartPreloader(sliders, currentSlide, isVisible);

  // Intersection Observer with optimized thresholds
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
        });
      },
      { 
        threshold: [0, 0.1, 0.5],
        rootMargin: '50px 0px'
      }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isVisible || isTransitioning || sliders.length <= 1) return;
      
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          prevSlide();
          break;
        case 'ArrowRight':
          event.preventDefault();
          nextSlide();
          break;
        case 'Home':
          event.preventDefault();
          goToSlide(0);
          break;
        case 'End':
          event.preventDefault();
          goToSlide(sliders.length - 1);
          break;
        case ' ':
        case 'Enter':
          // Allow space/enter to pause/resume autoplay
          event.preventDefault();
          break;
      }
    };

    const heroElement = heroRef.current;
    if (heroElement) {
      heroElement.addEventListener('keydown', handleKeyDown);
      return () => heroElement.removeEventListener('keydown', handleKeyDown);
    }
  }, [isVisible, isTransitioning, sliders.length, prevSlide, nextSlide, goToSlide]);

  // Optimized auto-advance with visibility and user interaction awareness
  useEffect(() => {
    if (sliders.length <= 1 || !isVisible || isTransitioning) return;

    const startAutoplay = () => {
      autoplayTimerRef.current = setTimeout(() => {
        nextSlide();
      }, 7000); // Longer interval for better UX
    };

    const stopAutoplay = () => {
      if (autoplayTimerRef.current) {
        clearTimeout(autoplayTimerRef.current);
      }
    };

    // Start autoplay
    startAutoplay();

    // Pause on user interaction
    const handleUserInteraction = () => {
      stopAutoplay();
      setTimeout(startAutoplay, 10000); // Resume after 10s of inactivity
    };

    const heroElement = heroRef.current;
    if (heroElement) {
      heroElement.addEventListener('mouseenter', stopAutoplay);
      heroElement.addEventListener('mouseleave', startAutoplay);
      heroElement.addEventListener('touchstart', handleUserInteraction);
      heroElement.addEventListener('click', handleUserInteraction);
    }

    return () => {
      stopAutoplay();
      if (heroElement) {
        heroElement.removeEventListener('mouseenter', stopAutoplay);
        heroElement.removeEventListener('mouseleave', startAutoplay);
        heroElement.removeEventListener('touchstart', handleUserInteraction);
        heroElement.removeEventListener('click', handleUserInteraction);
      }
    };
  }, [sliders.length, isVisible, isTransitioning, nextSlide]);

  // Memoize current slider data to prevent unnecessary re-renders
  const currentSliderData = useMemo(() => {
    const defaultData = sliders[currentSlide];
    if (isRtl) {
      return {
        title: t('hero.title'),
        description: t('hero.description'),
        media_type: (defaultData?.media_type || 'image') as 'image' | 'video',
        image_url: defaultData?.image_url || null,
        video_url: defaultData?.video_url || null,
        video_thumbnail_url: defaultData?.video_thumbnail_url || null,
        video_platform: defaultData?.video_platform,
        video_embed_id: defaultData?.video_embed_id,
        video_quality: defaultData?.video_quality,
        video_start_time: defaultData?.video_start_time,
        video_end_time: defaultData?.video_end_time,
        video_privacy_mode: defaultData?.video_privacy_mode,
        video_autoplay: defaultData?.video_autoplay || false,
        video_muted: defaultData?.video_muted ?? true,
        video_loop: defaultData?.video_loop ?? true,
        media_alt_text: t('hero.title'),
        media_caption: null,
        lazy_loading: true
      };
    }
    return defaultData || {
      title: t('hero.title'),
      description: t('hero.description'),
      media_type: 'image' as 'image' | 'video',
      image_url: null,
      video_url: null,
      video_thumbnail_url: null,
      video_platform: undefined,
      video_embed_id: undefined,
      video_quality: undefined,
      video_start_time: undefined,
      video_end_time: undefined,
      video_privacy_mode: undefined,
      video_autoplay: false,
      video_muted: true,
      video_loop: true,
      media_alt_text: 'Professional translation services',
      media_caption: null,
      lazy_loading: true
    };
  }, [sliders, currentSlide, isRtl, t]);

  // Memoize trust indicators and stats
  const trustIndicators = useMemo(() => [
    { icon: 'Shield', text: t('hero.badgeIso') },
    { icon: 'Clock', text: t('hero.badgeSupport') },
    { icon: 'Globe', text: t('hero.badgeLanguages') },
    { icon: 'FileText', text: isRtl ? 'كافة أنواع المستندات' : 'All Document Types' }
  ], [isRtl, t]);

  const heroStats = useMemo(() => [
    { value: '1000+', label: isRtl ? 'مشروع مكتمل' : 'Projects Completed' },
    { value: '50+', label: isRtl ? 'لغة مدعومة' : 'Languages Supported' },
    { value: '24/7', label: isRtl ? 'دعم متواصل' : 'Customer Support' }
  ], [isRtl]);

  // Optimized click handlers with analytics
  const handlePrimaryClick = useCallback(() => {
    // Track conversion event
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'cta_click', {
        event_category: 'engagement',
        event_label: 'hero_get_quote',
        value: 1
      });
    }
    window.location.href = localizedPath('/contact', locale);
  }, [locale]);

  const handleSecondaryClick = useCallback(() => {
    document.getElementById('services-section')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  }, []);

  return (
    <>
      {/* Resource hints for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://img.youtube.com" />
      <link rel="dns-prefetch" href="https://www.youtube.com" />
      
      <section 
        ref={heroRef}
        className="relative overflow-hidden bg-gradient-to-br from-white via-orange-50 to-blue-50 py-20 sm:py-32"
        style={{ contain: 'layout style paint' }}
        aria-label="Hero slider with company information and services"
        role="region"
        tabIndex={0}
      >
        {/* Optimized background pattern with CSS containment */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{ 
            backgroundImage: 'url(/grid-pattern.svg)',
            backgroundSize: '40px 40px',
            willChange: 'auto'
          }}
        />
        
        <div className="container relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content Section */}
            <div className="space-y-8 order-2 lg:order-1">
              <div className="space-y-4">
                <div className="inline-flex items-center rounded-full bg-brand-orange/10 px-4 py-2 text-sm font-medium text-brand-orangeText">
                  {isRtl ? '🌟 خدمات الترجمة المعتمدة في دبي' : '🌟 Certified Translation Services in Dubai'}
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
                      <IconComponent className="h-5 w-5 text-brand-orangeText" />
                      <span>{indicator.text}</span>
                    </div>
                  );
                })}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-brand-orangeText hover:bg-brand-orangeText/90 text-white px-8 py-3 text-lg"
                  onClick={handlePrimaryClick}
                >
                  {t('hero.ctaQuote')}
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white px-8 py-3 text-lg"
                  onClick={handleSecondaryClick}
                >
                  {t('hero.ctaServices')}
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

            {/* Media Content - Optimized */}
            <div className="relative order-1 lg:order-2">
              <div 
                className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-brand-orange/20 to-brand-blue/20"
                style={{ contain: 'layout style paint' }}
              >
                {/* Current Slide with optimized rendering */}
                <div 
                  className={`absolute inset-0 transition-opacity duration-200 ease-out ${
                    isTransitioning ? 'opacity-0' : 'opacity-100'
                  }`}
                  style={{ willChange: isTransitioning ? 'opacity' : 'auto' }}
                >
                  {currentSliderData.media_type === 'video' && currentSliderData.video_url ? (
                    <OptimizedVideo
                      src={currentSliderData.video_url}
                      poster={currentSliderData.video_thumbnail_url}
                      autoPlay={currentSliderData.video_autoplay && isVisible}
                      muted={currentSliderData.video_muted}
                      loop={currentSliderData.video_loop}
                      platform={currentSliderData.video_platform}
                      embedId={currentSliderData.video_embed_id}
                      quality={currentSliderData.video_quality}
                      startTime={currentSliderData.video_start_time}
                      endTime={currentSliderData.video_end_time}
                      privacyMode={currentSliderData.video_privacy_mode}
                      className="w-full h-full object-cover rounded-2xl"
                      priority={currentSlide === 0}
                      lazy={!isVisible}
                      ariaLabel={currentSliderData.media_alt_text || currentSliderData.title}
                    />
                  ) : currentSliderData.image_url ? (
                    <NextImage
                      src={currentSliderData.image_url}
                      alt={currentSliderData.media_alt_text || currentSliderData.title}
                      fill
                      className="object-cover rounded-2xl"
                      priority={currentSlide === 0}
                      loading={currentSlide === 0 ? undefined : 'lazy'}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      quality={85}
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gradient-to-br from-brand-orange to-brand-blue rounded-2xl">
                      <div className="text-center text-white p-8">
                        <FileText className="h-16 w-16 mx-auto mb-4 opacity-80" />
                        <div className="text-2xl font-bold mb-2">{isRtl ? 'ترجمة احترافية' : 'Professional Translation'}</div>
                        <p className="text-orange-100">{isRtl ? 'معتمدة • دقيقة • سريعة' : 'Certified • Accurate • Fast'}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Next Slide for crossfade (only render when transitioning) */}
                {nextSlideIndex !== null && (
                  <div 
                    className="absolute inset-0 opacity-0 animate-fade-in-fast"
                    style={{ animationDelay: '50ms' }}
                  >
                    {(() => {
                      const nextSliderData = sliders[nextSlideIndex];
                      if (!nextSliderData) return null;

                      if (nextSliderData.media_type === 'video' && nextSliderData.video_url) {
                        return (
                          <OptimizedVideo
                            src={nextSliderData.video_url}
                            poster={nextSliderData.video_thumbnail_url}
                            autoPlay={nextSliderData.video_autoplay && isVisible}
                            muted={nextSliderData.video_muted}
                            loop={nextSliderData.video_loop}
                            platform={nextSliderData.video_platform}
                            embedId={nextSliderData.video_embed_id}
                            quality={nextSliderData.video_quality}
                            className="w-full h-full object-cover rounded-2xl"
                            priority={true}
                            lazy={false}
                            ariaLabel={nextSliderData.media_alt_text || nextSliderData.title}
                          />
                        );
                      } else if (nextSliderData.image_url) {
                        return (
                          <NextImage
                            src={nextSliderData.image_url}
                            alt={nextSliderData.media_alt_text || nextSliderData.title}
                            fill
                            className="object-cover rounded-2xl"
                            priority={true}
                            loading={undefined}
                            sizes="(max-width: 768px) 100vw, 50vw"
                            quality={85}
                          />
                        );
                      }
                      return null;
                    })()}
                  </div>
                )}
                
                {/* Slider Controls - Only show when multiple slides */}
                {sliders.length > 1 && (
                  <>
                    <button
                      onClick={prevSlide}
                      disabled={isTransitioning}
                      className={`absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg transition-all duration-200 ${
                        isTransitioning ? 'cursor-not-allowed opacity-50' : 'hover:bg-white hover:scale-110'
                      }`}
                      aria-label={isRtl 
                        ? `الشريحة السابقة. معروض حالياً الشريحة ${currentSlide + 1} من ${sliders.length}: ${currentSliderData.title}`
                        : `Previous slide. Currently showing slide ${currentSlide + 1} of ${sliders.length}: ${currentSliderData.title}`
                      }
                      tabIndex={0}
                      role="button"
                    >
                      <ChevronLeft className="h-5 w-5 text-gray-700" />
                    </button>
                    <button
                      onClick={nextSlide}
                      disabled={isTransitioning}
                      className={`absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg transition-all duration-200 ${
                        isTransitioning ? 'cursor-not-allowed opacity-50' : 'hover:bg-white hover:scale-110'
                      }`}
                      aria-label={isRtl 
                        ? `الشريحة التالية. معروض حالياً الشريحة ${currentSlide + 1} من ${sliders.length}: ${currentSliderData.title}`
                        : `Next slide. Currently showing slide ${currentSlide + 1} of ${sliders.length}: ${currentSliderData.title}`
                      }
                      tabIndex={0}
                      role="button"
                    >
                      <ChevronRight className="h-5 w-5 text-gray-700" />
                    </button>
                    
                    {/* Optimized Slide Indicators */}
                    <div 
                      className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2"
                      role="tablist"
                      aria-label={isRtl ? "التنقل بين الشرائح" : "Slide navigation"}
                    >
                      {sliders.map((slider, index) => (
                        <button
                          key={index}
                          onClick={() => goToSlide(index)}
                          disabled={isTransitioning}
                          className={`w-3 h-3 rounded-full transition-all duration-200 flex items-center justify-center ${
                            index === currentSlide ? 'bg-white scale-125' : 'bg-white/60 hover:bg-white/80'
                          } ${isTransitioning ? 'cursor-not-allowed opacity-50' : ''}`}
                          aria-label={isRtl
                            ? `الذهاب إلى الشريحة ${index + 1}: ${slider.title}. ${index === currentSlide ? 'نشطة حالياً' : ''}`
                            : `Go to slide ${index + 1}: ${slider.title}. ${index === currentSlide ? 'Currently active' : ''}`
                          }
                          aria-current={index === currentSlide ? 'true' : 'false'}
                          tabIndex={0}
                          role="tab"
                          title={`${slider.media_type === 'video' ? '📹' : '🖼️'} ${slider.title}`}
                        >
                          {slider.media_type === 'video' && index === currentSlide && (
                            <div className="w-1 h-1 bg-brand-orange rounded-full" />
                          )}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Floating Cards - Optimized positioning */}
              <div className="absolute -bottom-6 -left-6 hidden lg:block">
                <Card className="bg-white shadow-xl backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 p-2 rounded-full">
                        <Shield className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm">{isRtl ? 'ترجمة معتمدة' : 'Certified Translation'}</div>
                        <div className="text-xs text-gray-600">{isRtl ? 'جودة مضمونة' : 'Quality Assured'}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="absolute -top-6 -right-6 hidden lg:block">
                <Card className="bg-white shadow-xl backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Clock className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm">{isRtl ? 'تسليم سريع' : 'Fast Delivery'}</div>
                        <div className="text-xs text-gray-600">{isRtl ? 'خدمة في نفس اليوم' : 'Same Day Available'}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Screen reader live region for slide changes */}
        <div
          className="sr-only"
          aria-live="polite"
          aria-atomic="true"
          role="status"
        >
          {isRtl 
            ? `الشريحة ${currentSlide + 1} من ${sliders.length}: ${currentSliderData.title}`
            : `Slide ${currentSlide + 1} of ${sliders.length}: ${currentSliderData.title}`
          }
        </div>

        {/* Note: Organization schema is already rendered once, correctly,
            with real data from site_settings in components/seo/json-ld.tsx
            (root layout). A second Organization schema was previously
            duplicated here with a `window.location.origin` value that
            differed between server and client render (a guaranteed
            hydration mismatch) and a literal placeholder phone number
            ("+971-XX-XXXXXXX") that was never replaced with a real one. */}

        {/* Video Structured Data (only when needed) */}
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
                "publisher": {
                  "@type": "Organization",
                  "name": "JUSOR Translation Services"
                }
              })
            }}
          />
        )}
      </section>
    </>
  );
}