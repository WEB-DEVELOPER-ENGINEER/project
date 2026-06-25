'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';

interface EnhancedVideoProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  className?: string;
  width?: number;
  height?: number;
  preload?: 'none' | 'metadata' | 'auto';
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

export function EnhancedVideo({
  src,
  poster,
  autoPlay = false,
  muted = true,
  loop = false,
  controls = true,
  className = '',
  width,
  height,
  preload = 'metadata',
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
}: EnhancedVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const placeholderRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(!lazy || priority);

  // Auto-detect platform from URL if not provided
  const detectedPlatform = useMemo(() => {
    if (platform) return platform;
    
    if (src.includes('youtube.com') || src.includes('youtu.be')) return 'youtube';
    if (src.includes('vimeo.com')) return 'vimeo';
    if (src.includes('wistia.com')) return 'wistia';
    
    return 'direct';
  }, [src, platform]);

  // Extract video ID from URL
  function extractVideoId(url: string, platform: string): string | null {
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
  }

  // Generate embed URL for supported platforms
  const embedUrl = useMemo(() => {
    if (detectedPlatform === 'direct') return src;

    const videoId = embedId || extractVideoId(src, detectedPlatform);
    if (!videoId) return src;

    switch (detectedPlatform) {
      case 'youtube':
        const youtubeParams = new URLSearchParams();
        if (autoPlay) youtubeParams.set('autoplay', '1');
        if (muted) youtubeParams.set('mute', '1');
        if (loop) youtubeParams.set('loop', '1');
        if (startTime) youtubeParams.set('start', startTime.toString());
        if (endTime) youtubeParams.set('end', endTime.toString());
        if (!controls) youtubeParams.set('controls', '0');
        youtubeParams.set('rel', '0'); // Don't show related videos
        youtubeParams.set('modestbranding', '1'); // Minimal YouTube branding
        youtubeParams.set('enablejsapi', '1'); // Enable JS API for better control
        
        const baseUrl = privacyMode 
          ? 'https://www.youtube-nocookie.com/embed'
          : 'https://www.youtube.com/embed';
        
        return `${baseUrl}/${videoId}?${youtubeParams.toString()}`;
      
      case 'vimeo':
        const vimeoParams = new URLSearchParams();
        if (autoPlay) vimeoParams.set('autoplay', '1');
        if (muted) vimeoParams.set('muted', '1');
        if (loop) vimeoParams.set('loop', '1');
        if (startTime) vimeoParams.set('t', `${startTime}s`);
        vimeoParams.set('dnt', '1'); // Do not track
        vimeoParams.set('quality', quality);
        vimeoParams.set('responsive', '1');
        
        return `https://player.vimeo.com/video/${videoId}?${vimeoParams.toString()}`;
      
      case 'wistia':
        const wistiaParams = new URLSearchParams();
        if (autoPlay) wistiaParams.set('autoPlay', 'true');
        if (muted) wistiaParams.set('muted', 'true');
        wistiaParams.set('videoFoam', 'true'); // Responsive
        
        return `https://fast.wistia.net/embed/iframe/${videoId}?${wistiaParams.toString()}`;
      
      default:
        return src;
    }
  }, [src, detectedPlatform, embedId, autoPlay, muted, loop, startTime, endTime, controls, privacyMode, quality]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || priority || isInView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    const currentRef = placeholderRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => observer.disconnect();
  }, [lazy, priority, isInView, detectedPlatform]);

  const handleLoadStart = () => {
    setIsLoaded(false);
    setHasError(false);
    onLoadStart?.();
  };

  const handleCanPlay = () => {
    setIsLoaded(true);
    onCanPlay?.();
  };

  const handleError = (error: any) => {
    setHasError(true);
    setIsLoaded(false);
    onError?.(error);
  };

  const handleIframeLoad = () => {
    setIsLoaded(true);
    onCanPlay?.();
  };

  const handleIframeError = () => {
    setHasError(true);
    setIsLoaded(false);
    onError?.('Failed to load embedded video');
  };

  // Generate structured data for SEO
  const generateStructuredData = () => {
    if (detectedPlatform === 'direct') return null;

    const videoId = embedId || extractVideoId(src, detectedPlatform);
    if (!videoId) return null;

    return {
      "@context": "https://schema.org",
      "@type": "VideoObject",
      "embedUrl": embedUrl,
      "contentUrl": src,
      "uploadDate": new Date().toISOString(),
      "thumbnailUrl": poster || getThumbnailUrl(detectedPlatform, videoId),
    };
  };

  // Get thumbnail URL for platforms
  const getThumbnailUrl = (platform: string, videoId: string): string => {
    switch (platform) {
      case 'youtube':
        return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      case 'vimeo':
        return `https://vumbnail.com/${videoId}.jpg`;
      default:
        return '';
    }
  };

  // Don't render video until it's in view (for lazy loading)
  if (!isInView) {
    return (
      <div
        ref={placeholderRef}
        className={`bg-gray-200 animate-pulse ${className}`}
        style={{ 
          width, 
          height, 
          aspectRatio: width && height ? `${width}/${height}` : '16/9',
          borderRadius: '8px'
        }}
        aria-label={ariaLabel || "Loading video..."}
      />
    );
  }

  // Render embedded video for platforms
  if (detectedPlatform !== 'direct') {
    const structuredData = generateStructuredData();
    
    return (
      <div className={`relative w-full h-full ${className}`} style={{ width, height }}>
        {/* Structured Data for SEO */}
        {structuredData && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
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
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
            borderRadius: '8px',
          }}
          title={ariaLabel || "Embedded Video"}
          aria-label={ariaLabel}
        />
        
        {/* Loading placeholder - Hidden for seamless transitions */}
        {!isLoaded && !hasError && !priority && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center z-10">
            <div className="text-gray-500">Loading video...</div>
          </div>
        )}
        
        {/* Error state */}
        {hasError && (
          <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center z-10">
            <div className="text-center text-gray-600">
              <div className="text-lg mb-2">⚠️</div>
              <div>Failed to load video</div>
              <div className="text-sm mt-1">Please check the video URL</div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Render direct video element
  return (
    <div className={`relative w-full h-full ${className}`} style={{ width, height }}>
      <video
        ref={videoRef}
        src={embedUrl}
        poster={poster}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        controls={controls}
        className="absolute inset-0 w-full h-full object-cover"
        preload={preload}
        onLoadStart={handleLoadStart}
        onCanPlay={handleCanPlay}
        onError={handleError}
        playsInline
        aria-label={ariaLabel}
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out',
          borderRadius: '8px',
        }}
      >
        Your browser does not support the video tag.
      </video>
      
      {/* Loading placeholder for direct videos - Hidden for seamless transitions */}
      {!isLoaded && !hasError && !priority && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center z-10">
          <div className="text-gray-500">Loading video...</div>
        </div>
      )}
      
      {/* Error state for direct videos */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center z-10">
          <div className="text-center text-gray-600">
            <div className="text-lg mb-2">⚠️</div>
            <div>Failed to load video</div>
            <div className="text-sm mt-1">Please check the video URL</div>
          </div>
        </div>
      )}
    </div>
  );
}