'use client';

import { useState, useEffect } from 'react';
import { Cookie, X, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface ConsentSettings {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<ConsentSettings>({
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAcceptAll = () => {
    const consentData = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
      timestamp: new Date().toISOString(),
    };
    
    localStorage.setItem('cookie-consent', 'accepted');
    localStorage.setItem('cookie-settings', JSON.stringify(consentData));
    
    // Dispatch consent event for analytics initialization
    window.dispatchEvent(new CustomEvent('consentchange', { 
      detail: consentData 
    }));
    
    setShowBanner(false);
    updateGtagConsent(consentData);
  };

  const handleRejectAll = () => {
    const consentData = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
      timestamp: new Date().toISOString(),
    };
    
    localStorage.setItem('cookie-consent', 'rejected');
    localStorage.setItem('cookie-settings', JSON.stringify(consentData));
    
    setShowBanner(false);
    updateGtagConsent(consentData);
  };

  const handleSaveSettings = () => {
    const consentData = {
      ...settings,
      timestamp: new Date().toISOString(),
    };
    
    localStorage.setItem('cookie-consent', 'custom');
    localStorage.setItem('cookie-settings', JSON.stringify(consentData));
    
    // Dispatch consent event for analytics initialization
    window.dispatchEvent(new CustomEvent('consentchange', { 
      detail: consentData 
    }));
    
    setShowBanner(false);
    setShowSettings(false);
    updateGtagConsent(consentData);
  };

  const updateGtagConsent = (consent: ConsentSettings) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        'analytics_storage': consent.analytics ? 'granted' : 'denied',
        'ad_storage': consent.marketing ? 'granted' : 'denied',
        'functionality_storage': consent.preferences ? 'granted' : 'denied',
      });
    }
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Cookie Banner */}
      <div 
        className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg animate-slide-up"
        role="dialog"
        aria-labelledby="cookie-banner-title"
        aria-describedby="cookie-banner-description"
      >
        <div className="container py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <Cookie className="h-6 w-6 text-brand-orangeText flex-shrink-0 mt-1" aria-hidden="true" />
              <div>
                <h3 id="cookie-banner-title" className="font-semibold text-gray-900">
                  We use cookies
                </h3>
                <p id="cookie-banner-description" className="text-sm text-gray-600 mt-1">
                  We use cookies to enhance your experience, analyze site traffic, and provide personalized content. 
                  By clicking "Accept All", you consent to our use of cookies.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSettings(true)}
                className="w-full sm:w-auto"
              >
                <Settings className="mr-2 h-4 w-4" />
                Customize
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRejectAll}
                className="w-full sm:w-auto"
              >
                Reject All
              </Button>
              <Button
                size="sm"
                onClick={handleAcceptAll}
                className="w-full sm:w-auto"
              >
                Accept All
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          role="dialog"
          aria-labelledby="cookie-settings-title"
        >
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle id="cookie-settings-title">Cookie Preferences</CardTitle>
                <CardDescription>
                  Choose which cookies you want to allow. You can change these settings at any time.
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(false)}
                aria-label="Close settings"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Necessary Cookies */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="necessary" className="text-base font-semibold">
                    Necessary Cookies
                  </Label>
                  <Switch
                    id="necessary"
                    checked={settings.necessary}
                    disabled
                    aria-describedby="necessary-description"
                  />
                </div>
                <p id="necessary-description" className="text-sm text-gray-600">
                  Essential for the website to function properly. These cannot be disabled.
                </p>
              </div>

              {/* Analytics Cookies */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="analytics" className="text-base font-semibold">
                    Analytics Cookies
                  </Label>
                  <Switch
                    id="analytics"
                    checked={settings.analytics}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, analytics: checked }))
                    }
                    aria-describedby="analytics-description"
                  />
                </div>
                <p id="analytics-description" className="text-sm text-gray-600">
                  Help us understand how visitors interact with our website by collecting anonymous information.
                </p>
              </div>

              {/* Marketing Cookies */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="marketing" className="text-base font-semibold">
                    Marketing Cookies
                  </Label>
                  <Switch
                    id="marketing"
                    checked={settings.marketing}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, marketing: checked }))
                    }
                    aria-describedby="marketing-description"
                  />
                </div>
                <p id="marketing-description" className="text-sm text-gray-600">
                  Used to deliver personalized advertisements and measure their effectiveness.
                </p>
              </div>

              {/* Preference Cookies */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="preferences" className="text-base font-semibold">
                    Preference Cookies
                  </Label>
                  <Switch
                    id="preferences"
                    checked={settings.preferences}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, preferences: checked }))
                    }
                    aria-describedby="preferences-description"
                  />
                </div>
                <p id="preferences-description" className="text-sm text-gray-600">
                  Remember your preferences and settings to provide a personalized experience.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowSettings(false)}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveSettings}
                  className="w-full sm:w-auto"
                >
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}