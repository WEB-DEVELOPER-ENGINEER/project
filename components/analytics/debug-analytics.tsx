'use client';

import { useEffect, useState } from 'react';

/**
 * Debug component to verify analytics setup
 * Only use in development - remove from production
 */
export function DebugAnalytics() {
  const [status, setStatus] = useState({
    gtag: false,
    dataLayer: false,
    googleAdsId: '',
  });

  useEffect(() => {
    // Check after a delay to ensure scripts have loaded
    const checkAnalytics = () => {
      setStatus({
        gtag: typeof window.gtag !== 'undefined',
        dataLayer: Array.isArray(window.dataLayer),
        googleAdsId: process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || 'NOT SET',
      });
    };

    // Check immediately
    checkAnalytics();

    // Check again after 2 seconds
    const timer = setTimeout(checkAnalytics, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '80px',
        left: '10px',
        background: '#1a1a1a',
        color: '#fff',
        padding: '12px',
        borderRadius: '8px',
        fontSize: '12px',
        fontFamily: 'monospace',
        zIndex: 9999,
        maxWidth: '300px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
      }}
    >
      <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#4ade80' }}>
        📊 Analytics Debug
      </div>
      <div style={{ marginBottom: '4px' }}>
        <span style={{ color: status.gtag ? '#4ade80' : '#f87171' }}>
          {status.gtag ? '✓' : '✗'}
        </span>{' '}
        window.gtag: {status.gtag ? 'Loaded' : 'Not loaded'}
      </div>
      <div style={{ marginBottom: '4px' }}>
        <span style={{ color: status.dataLayer ? '#4ade80' : '#f87171' }}>
          {status.dataLayer ? '✓' : '✗'}
        </span>{' '}
        dataLayer: {status.dataLayer ? 'Ready' : 'Not ready'}
      </div>
      <div style={{ marginBottom: '8px', fontSize: '11px', color: '#9ca3af' }}>
        Google Ads ID: {status.googleAdsId}
      </div>
      <button
        onClick={() => {
          if (window.gtag) {
            window.gtag('event', 'test_event', {
              event_category: 'debug',
              event_label: 'manual_test',
            });
            alert('Test event sent! Check Network tab for requests to googleads.g.doubleclick.net');
          } else {
            alert('gtag not loaded yet. Wait a moment and try again.');
          }
        }}
        style={{
          background: '#3b82f6',
          color: '#fff',
          border: 'none',
          padding: '6px 12px',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '11px',
          width: '100%',
        }}
      >
        Send Test Event
      </button>
    </div>
  );
}
