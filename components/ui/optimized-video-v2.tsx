'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';

interface OptimizedVideoProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  className?: string;
  width?: number;
  height?: number;
  onLoadStart?: () => void;
  onCanPlay?: () => void;
  onError?: (error: any) => void;
  priority?: boolean;
  lazy?: boolean;
  
  // Enhanced props for URL-based videos
  platform?: 'youtube' | 'vimeo' | 'direct' | 'wistia' | 'brightcove' | 'jwplayer';
  embedId?: string;
  quality?: 'sd' | 'hd' | '4k' | 'auto';
  startTime?: number;
  endTime?: number;
  privacyMode?: boolean;
  allowFullscreen?: boolean;
  ariaLabel?: string;
}

// Optimized video component with advanced performance features
export default function OptimizedVideoV2({
  src,
  poster,
  autoPlay = false,
  muted = true,
  loop = false,
  controls = false,
  className = '',
  width,
  height,
  onLoadStart,
  onCanPlay,
  onError,
  priority = false,
  lazy = true,
  platform,
  embedId,
  quality = 'hd',
  startTime = 0,
  endTime,
  privacyMode = true,
  allowFullscreen = true,
  ariaLabel,
}: OptimizedVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(!lazy || priority);
  const [shouldLoad, setShouldLoad] = useState(priority);
  const [loadAttempted, setLoadAttempted] = useState(false);

  // Auto-detect platform from URL if not provided
  const detectedPlatform = useMemo(() => {
    if (platform) return platform;
    
    if (src.includes('youtube.com') || src.includes('youtu.be')) return 'youtube';
    if (src.includes('vimeo.com')) return 'vimeo';
    if (src.includes('wistia.com')) return 'wistia';
    
    return 'direct';
  }, [src, platform]);

  // Extract video ID from URL with improved regex
  const extractVideoId = useCallback((url: string, platform: string): string | null => {
    switch (platform) {
      case 'youtube':
        const youtubeMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
        return youtubeMatch ? youtubeMatch[1] : null;
      
      case 'vimeo':
        const vimeoMatch = url.match(/(?:vimeo\.com\/)([0-9]+)/);
        return vimeoMatch ? vimeoMatch[1] : null;
      
      case 'wistia':
        const wistiaMatch = url.match(/(?:wistia\.com\/.*\/|wi\.st\/)([a-z0-9]+)/i);
        return wistiaMatch ? wistiaMatch[1] : null;
      
      default:
        return null;
    }
  }, []);

  // Generate optimized embed URL with performance parameters
  const embedUrl = useMemo(() => {
    if (detectedPlatform === 'direct') return src;

    const videoId = embedId || extractVideoId(src, detectedPlatform);
    if (!videoId) return src;

    switch (detectedPlatform) {
      case 'youtube':
        const youtubeParams = new URLSearchParams();
        
        // Performance optimizations
        youtubeParams.set('rel', '0'); // Don't show related videos
        youtubeParams.set('modestbranding', '1'); // Minimal YouTube branding
        youtubeParams.set('enablejsapi', '1'); // Enable JS API
        youtubeParams.set('origin', typeof window !== 'undefined' ? window.location.origin : '');
        youtubeParams.set('widget_referrer', typeof window !== 'undefined' ? window.location.origin : '');
        
        // Playback settings
        if (autoPlay) youtubeParams.set('autoplay', '1');
        if (muted) youtubeParams.set('mute', '1');
        if (loop) youtubeParams.set('loop', '1');
        if (startTime) youtubeParams.set('start', startTime.toString());
        if (endTime) youtubeParams.set('end', endTime.toString());
        if (!controls) youtubeParams.set('controls', '0');
        
        // Quality settings
        if (quality === 'hd') youtubeParams.set('vq', 'hd720');
        if (quality === '4k') youtubeParams.set('vq', 'hd1080');
        
        const baseUrl = privacyMode 
          ? 'https://www.youtube-nocookie.com/embed'
          : 'https://www.youtube.com/embed';
        
        return `${baseUrl}/${videoId}?${youtubeParams.toString()}`;
      
      case 'vimeo':
        const vimeoParams = new URLSearchParams();
        
        // Performance optimizations
        vimeoParams.set('dnt', '1'); // Do not track
        vimeoParams.set('responsive', '1');
        vimeoParams.set('background', autoPlay && !controls ? '1' : '0');
        
        // Playback settings
        if (autoPlay) vimeoParams.set('autoplay', '1');
        if (muted) vimeoParams.set('muted', '1');
        if (loop) vimeoParams.set('loop', '1');
        if (startTime) vimeoParams.set('t', `${startTime}s`);
        if (quality !== 'auto') vimeoParams.set('quality', quality);
        
        return `https://player.vimeo.com/video/${videoId}?${vimeoParams.toString()}`;
      
      case 'wistia':
        const wistiaParams = new URLSearchParams();
        
        // Performance optimizations
        wistiaParams.set('videoFoam', 'true'); // Responsive
        wistiaParams.set('playerColor', 'ff6b35'); // Brand color
        
        // Playback settings
        if (autoPlay) wistiaParams.set('autoPlay', 'true');
        if (muted) wistiaParams.set('muted', 'true');
        
        return `https://fast.wistia.net/embed/iframe/${videoId}?${wistiaParams.toString()}`;
      
      default:
        return src;
    }
  }, [src, detectedPlatform, embedId, extractVideoId, autoPlay, muted, loop, startTime, endTime, controls, privacyMode, quality]);

  // Advanced Intersection Observer with performance optimizations
  useEffect(() => {
    if (!lazy || priority || isInView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            // Delay loading slightly to avoid loading during scroll
            setTimeout(() => setShouldLoad(true), 100);
            observer.disconnect();
          }
        });
      },
      { 
        threshold: 0.1,
        rootMargin: '50px 0px' // Start loading before fully visible
      }
    );

    const currentRef = containerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => observer.disconnect();
  }, [lazy, priority, isInView]);

  // Optimized loading strategy
  useEffect(() => {
    if (shouldLoad && !loadAttempted) {
      setLoadAttempted(true);
    }
  }, [shouldLoad, loadAttempted]);

  // Event handlers with performance tracking
  const handleLoadStart = useCallback(() => {
    setIsLoaded(false);
    setHasError(false);
    onLoadStart?.();
  }, [onLoadStart]);

  const handleCanPlay = useCallback(() => {
    setIsLoaded(true);
    onCanPlay?.();
    
    // Track video performance
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'video_ready', {
        event_category: 'performance',
        event_label: detectedPlatform,
        custom_parameters: {
          video_platform: detectedPlatform,
          video_quality: quality,
          load_time: performance.now()
        }
      });
    }
  }, [onCanPlay, detectedPlatform, quality]);

  const handleError = useCallback((error: any) => {
    setHasError(true);
    setIsLoaded(false);
    onError?.(error);
    
    // Track video errors
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'video_error', {
        event_category: 'error',
        event_label: detectedPlatform,
        custom_parameters: {
          video_platform: detectedPlatform,
          video_url: src,
          error_message: error?.message || 'Unknown error'
        }
      });
    }
  }, [onError, detectedPlatform, src]);

  const handleIframeLoad = useCallback(() => {
    setIsLoaded(true);
    onCanPlay?.();
  }, [onCanPlay]);

  const handleIframeError = useCallback(() => {
    handleError('Failed to load embedded video');
  }, [handleError]);

  // Generate optimized thumbnail URL
  const getThumbnailUrl = useCallback((platform: string, videoId: string): string => {
    switch (platform) {
      case 'youtube':
        // Try different thumbnail qualities
        return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      case 'vimeo':
        return `https://vumbnail.com/${videoId}.jpg`;
      default:
        return poster || '';
    }
  }, [poster]);

  // Don't render anything until we should load
  if (!isInView && !priority) {
    return (
      <div
        ref={containerRef}
        className={`bg-gray-200 animate-pulse rounded-lg ${className}`}
        style={{ 
          width, 
          height, 
          aspectRatio: width && height ? `${width}/${height}` : '16/9',
          contain: 'layout style paint'
        }}
        aria-label={ariaLabel || "Loading video..."}
      />
    );
  }

  // Render embedded video for platforms
  if (detectedPlatform !== 'direct' && loadAttempted) {
    const videoId = embedId || extractVideoId(src, detectedPlatform);
    const thumbnailUrl = videoId ? getThumbnailUrl(detectedPlatform, videoId) : poster;
    
    return (
      <div 
        ref={containerRef}
        className={`relative w-full h-full ${className}`} 
        style={{ 
          width, 
          height,
          contain: 'layout style paint'
        }}
      >
        {/* Optimized poster image for faster perceived loading */}
        {thumbnailUrl && !isLoaded && (
          <img
            src={thumbnailUrl}
            alt={ariaLabel || "Video thumbnail"}
            className="absolute inset-0 w-full h-full object-cover rounded-lg"
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            style={{ 
              filter: 'blur(0.5px)',
              transition: 'opacity 0.3s ease-out'
            }}
          />
        )}
        
        <iframe
          ref={iframeRef}
          src={embedUrl}
          width="100%"
          height="100%"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen={allowFullscreen}
          loading={lazy && !priority ? 'lazy' : 'eager'}
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          className="absolute inset-0 w-full h-full object-cover rounded-lg"
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-out',
            contain: 'layout style paint'
          }}
          title={ariaLabel || "Embedded Video"}
          aria-label={ariaLabel}
        />
        
        {/* Error state */}
        {hasError && (
          <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-600">
              <div className="text-lg mb-2">⚠️</div>
              <div className="font-medium">Failed to load video</div>
              <div className="text-sm mt-1 text-gray-500">Please check your connection</div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Render direct video element with optimizations
  if (detectedPlatform === 'direct' && loadAttempted) {
    return (
      <div 
        ref={containerRef}
        className={`relative w-full h-full ${className}`} 
        style={{ 
          width, 
          height,
          contain: 'layout style paint'
        }}
      >
        {/* Optimized poster image */}
        {poster && !isLoaded && (
          <img
            src={poster}
            alt={ariaLabel || "Video poster"}
            className="absolute inset-0 w-full h-full object-cover rounded-lg"
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            style={{ 
              filter: 'blur(0.5px)',
              transition: 'opacity 0.3s ease-out'
            }}
          />
        )}
        
        <video
          ref={videoRef}
          src={embedUrl}
          poster={poster}
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          controls={controls}
          className="absolute inset-0 w-full h-full object-cover rounded-lg"
          preload={priority ? 'metadata' : 'none'}
          onLoadStart={handleLoadStart}
          onCanPlay={handleCanPlay}
          onError={handleError}
          playsInline
          aria-label={ariaLabel}
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-out',
            contain: 'layout style paint'
          }}
        >
          <source src={embedUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Error state for direct videos */}
        {hasError && (
          <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-600">
              <div className="text-lg mb-2">⚠️</div>
              <div className="font-medium">Failed to load video</div>
              <div className="text-sm mt-1 text-gray-500">Please check the video URL</div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Loading placeholder
  return (
    <div
      ref={containerRef}
      className={`bg-gray-200 animate-pulse rounded-lg ${className}`}
      style={{ 
        width, 
        height, 
        aspectRatio: width && height ? `${width}/${height}` : '16/9',
        contain: 'layout style paint'
      }}
      aria-label={ariaLabel || "Loading video..."}
    />
  );
}