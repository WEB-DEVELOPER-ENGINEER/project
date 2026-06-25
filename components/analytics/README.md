# Analytics Components

This folder contains all analytics and tracking implementations for the application.

## Structure

```
analytics/
├── analytics.tsx          # Main analytics component (GA4, Facebook, LinkedIn)
├── google-ads.tsx         # Google Ads conversion tracking
├── index.ts              # Centralized exports
└── README.md             # This file
```

## Components

### Analytics (`analytics.tsx`)
Main analytics component that loads:
- Google Analytics 4 (GA4)
- Facebook Pixel
- LinkedIn Insight Tag
- Google Ads (via GoogleAds component)

### GoogleAds (`google-ads.tsx`)
Dedicated Google Ads conversion tracking component with:
- Automatic page view tracking
- Enhanced conversions support
- Route change tracking
- Conversion tracking functions

## Usage

### Import All Tracking Functions

```typescript
import {
  // Google Ads
  trackGoogleAdsConversion,
  trackFormSubmission,
  trackButtonClick,
  trackPhoneCall,
  trackWhatsAppClick,
  
  // General Analytics
  trackEvent,
  trackPageView,
  trackConversion
} from '@/components/analytics';
```

### Import Components

```typescript
import { Analytics, GoogleAds } from '@/components/analytics';
```

## Tracking Functions

### Google Ads Functions

#### trackGoogleAdsConversion
Track specific conversion actions with labels from Google Ads.

```typescript
trackGoogleAdsConversion(
  conversionLabel: string,
  value?: number,
  currency?: string = 'USD'
)
```

#### trackFormSubmission
Track form submissions (contact, quote, etc.).

```typescript
trackFormSubmission(
  formName: string,
  value?: number
)
```

#### trackButtonClick
Track button clicks and CTA interactions.

```typescript
trackButtonClick(
  buttonName: string,
  location: string
)
```

#### trackPhoneCall
Track phone number clicks.

```typescript
trackPhoneCall()
```

#### trackWhatsAppClick
Track WhatsApp button clicks.

```typescript
trackWhatsAppClick()
```

### General Analytics Functions

#### trackEvent
Track custom events in Google Analytics.

```typescript
trackEvent(
  eventName: string,
  parameters?: Record<string, any>
)
```

#### trackPageView
Manually track page views.

```typescript
trackPageView(
  url: string,
  title: string
)
```

#### trackConversion
Track conversions across multiple platforms.

```typescript
trackConversion(
  conversionId: string,
  value?: number
)
```

## Environment Variables

Required environment variables:

```bash
# Google Ads
NEXT_PUBLIC_GOOGLE_ADS_ID=AW-11329570367

# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Facebook Pixel
NEXT_PUBLIC_FB_PIXEL_ID=123456789012345

# LinkedIn
NEXT_PUBLIC_LINKEDIN_PARTNER_ID=12345
```

## Examples

### Track Contact Form Submission

```typescript
'use client';

import { trackFormSubmission } from '@/components/analytics';

export function ContactForm() {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Submit form logic...
    const response = await submitForm(formData);
    
    if (response.success) {
      // Track successful submission
      trackFormSubmission('Contact Form', 75);
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### Track CTA Button Click

```typescript
'use client';

import { trackButtonClick } from '@/components/analytics';

export function CTAButton() {
  return (
    <button
      onClick={() => {
        trackButtonClick('Get Started', 'Hero Section');
        // Navigate or perform action...
      }}
    >
      Get Started
    </button>
  );
}
```

### Track Phone Call

```typescript
'use client';

import { trackPhoneCall } from '@/components/analytics';

export function PhoneLink() {
  return (
    <a 
      href="tel:+971503244329"
      onClick={() => trackPhoneCall()}
    >
      +971 50 324 4329
    </a>
  );
}
```

## Integration

The Analytics component is integrated in the root layout (`app/layout.tsx`):

```typescript
import { Analytics } from '@/components/analytics/analytics';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

## Privacy & Consent

All analytics respect user consent preferences through the cookie consent system. Scripts are loaded but tracking is only activated after user consent.

## Testing

### Development Testing

```javascript
// Check if gtag is loaded
console.log(window.gtag);
console.log(window.dataLayer);

// Test a conversion
window.gtag('event', 'conversion', {
  send_to: 'AW-11329570367/test',
  value: 1
});
```

### Production Testing

1. Use Google Tag Assistant Chrome extension
2. Check Google Ads Tag Diagnostic tool
3. Verify conversions in Google Ads dashboard
4. Monitor real-time reports

## Documentation

- Full Setup Guide: `/docs/GOOGLE_ADS_SETUP.md`
- Quick Start: `/docs/GOOGLE_ADS_QUICK_START.md`
- Implementation Summary: `/docs/GOOGLE_ADS_IMPLEMENTATION_SUMMARY.md`

## Maintenance

When adding new tracking:

1. Add tracking function to appropriate component
2. Export from `index.ts`
3. Document in this README
4. Update relevant documentation
5. Test in development
6. Verify in production

## Support

For issues or questions:
- Check component documentation
- Review Google Ads setup guide
- Test with browser console
- Verify environment variables
- Check Google Tag Assistant
