/**
 * Performance monitoring utilities for Core Web Vitals optimization
 */

export interface PerformanceMetrics {
  lcp?: number;
  fid?: number;
  cls?: number;
  fcp?: number;
  ttfb?: number;
  videoLoadTime?: number;
  imageLoadTime?: number;
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetrics = {};
  private observers: PerformanceObserver[] = [];

  private constructor() {
    this.initializeObservers();
  }

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private initializeObservers(): void {
    if (typeof window === 'undefined') return;

    try {
      // Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformanceEntry & { renderTime?: number; loadTime?: number };
        this.metrics.lcp = lastEntry.renderTime || lastEntry.loadTime || lastEntry.startTime;
        this.reportMetric('LCP', this.metrics.lcp);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(lcpObserver);

      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry: any) => {
          this.metrics.fid = entry.processingStart - entry.startTime;
          this.reportMetric('FID', this.metrics.fid);
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.push(fidObserver);

      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        this.metrics.cls = clsValue;
        this.reportMetric('CLS', this.metrics.cls);
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(clsObserver);

      // First Contentful Paint (FCP)
      const fcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.fcp = entry.startTime;
            this.reportMetric('FCP', this.metrics.fcp);
          }
        });
      });
      fcpObserver.observe({ entryTypes: ['paint'] });
      this.observers.push(fcpObserver);

      // Time to First Byte (TTFB)
      const navigationObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry: any) => {
          this.metrics.ttfb = entry.responseStart - entry.requestStart;
          this.reportMetric('TTFB', this.metrics.ttfb);
        });
      });
      navigationObserver.observe({ entryTypes: ['navigation'] });
      this.observers.push(navigationObserver);

    } catch (error) {
      console.warn('Performance monitoring not supported:', error);
    }
  }

  public trackVideoLoad(startTime: number, endTime: number, videoUrl: string): void {
    const loadTime = endTime - startTime;
    this.metrics.videoLoadTime = loadTime;
    this.reportMetric('Video Load Time', loadTime, { videoUrl });
  }

  public trackImageLoad(startTime: number, endTime: number, imageUrl: string): void {
    const loadTime = endTime - startTime;
    this.metrics.imageLoadTime = loadTime;
    this.reportMetric('Image Load Time', loadTime, { imageUrl });
  }

  private reportMetric(name: string, value: number, additionalData?: Record<string, any>): void {
    // Report to Google Analytics if available
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'web_vitals', {
        event_category: 'performance',
        event_label: name,
        value: Math.round(value),
        custom_parameters: {
          metric_name: name,
          metric_value: value,
          ...additionalData
        }
      });
    }

    // Report to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 Performance Metric - ${name}:`, {
        value: `${Math.round(value)}ms`,
        rating: this.getRating(name, value),
        ...additionalData
      });
    }

    // Report to external monitoring service (e.g., Sentry, DataDog)
    this.reportToMonitoringService(name, value, additionalData);
  }

  private getRating(metricName: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    const thresholds = {
      'LCP': { good: 2500, poor: 4000 },
      'FID': { good: 100, poor: 300 },
      'CLS': { good: 0.1, poor: 0.25 },
      'FCP': { good: 1800, poor: 3000 },
      'TTFB': { good: 800, poor: 1800 }
    };

    const threshold = thresholds[metricName as keyof typeof thresholds];
    if (!threshold) return 'good';

    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  }

  private reportToMonitoringService(name: string, value: number, additionalData?: Record<string, any>): void {
    // Implement your monitoring service integration here
    // Examples: Sentry, DataDog, New Relic, etc.
    
    // Example for Sentry:
    // if (typeof window !== 'undefined' && window.Sentry) {
    //   window.Sentry.addBreadcrumb({
    //     category: 'performance',
    //     message: `${name}: ${value}ms`,
    //     level: 'info',
    //     data: additionalData
    //   });
    // }
  }

  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  public generateReport(): string {
    const report = Object.entries(this.metrics)
      .map(([key, value]) => `${key}: ${Math.round(value)}ms (${this.getRating(key, value)})`)
      .join('\n');
    
    return `Performance Report:\n${report}`;
  }

  public cleanup(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Utility functions for performance optimization
export const performanceUtils = {
  // Preload critical resources
  preloadResource: (href: string, as: 'image' | 'video' | 'script' | 'style', crossorigin?: boolean) => {
    if (typeof document === 'undefined') return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    if (crossorigin) link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  },

  // Prefetch resources for next navigation
  prefetchResource: (href: string) => {
    if (typeof document === 'undefined') return;

    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    document.head.appendChild(link);
  },

  // DNS prefetch for external domains
  dnsPrefetch: (domain: string) => {
    if (typeof document === 'undefined') return;

    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = domain;
    document.head.appendChild(link);
  },

  // Measure resource loading time
  measureResourceLoad: async (url: string, type: 'image' | 'video'): Promise<number> => {
    const startTime = performance.now();
    
    return new Promise((resolve, reject) => {
      if (type === 'image') {
        const img = new Image();
        img.onload = () => resolve(performance.now() - startTime);
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = url;
      } else if (type === 'video') {
        const video = document.createElement('video');
        video.onloadedmetadata = () => resolve(performance.now() - startTime);
        video.onerror = () => reject(new Error('Failed to load video'));
        video.src = url;
      }
    });
  },

  // Check if user prefers reduced motion
  prefersReducedMotion: (): boolean => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  // Check connection quality
  getConnectionQuality: (): 'slow' | 'fast' | 'unknown' => {
    if (typeof navigator === 'undefined' || !('connection' in navigator)) return 'unknown';
    
    const connection = (navigator as any).connection;
    if (!connection) return 'unknown';
    
    // Consider 2G/3G as slow, 4G+ as fast
    if (connection.effectiveType === '2g' || connection.effectiveType === '3g') {
      return 'slow';
    }
    
    return 'fast';
  },

  // Optimize video quality based on connection
  getOptimalVideoQuality: (): 'sd' | 'hd' | '4k' => {
    const connectionQuality = performanceUtils.getConnectionQuality();
    
    if (connectionQuality === 'slow') return 'sd';
    if (connectionQuality === 'fast') return 'hd';
    
    // Default to HD for unknown connections
    return 'hd';
  }
};

// Initialize performance monitoring
export const initPerformanceMonitoring = (): PerformanceMonitor => {
  return PerformanceMonitor.getInstance();
};

// Export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance();