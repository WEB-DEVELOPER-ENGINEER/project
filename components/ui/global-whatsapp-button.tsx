'use client';

import { WhatsAppFloatingButton } from './whatsapp-floating-button';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/components/providers/LanguageProvider';

interface GlobalWhatsAppButtonProps {
  siteSettings?: Record<string, any>;
}

export function GlobalWhatsAppButton({ siteSettings }: GlobalWhatsAppButtonProps) {
  const { locale } = useLanguage();
  const [whatsappData, setWhatsappData] = useState<{
    phoneNumber: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    // Get WhatsApp data from site settings or use defaults
    const phoneNumber = siteSettings?.whatsapp_number || 
                       siteSettings?.whatsapp_phone || 
                       '971503244329';
    
    const message = siteSettings?.whatsapp_message || (locale === 'ar'
                   ? 'مرحباً جسور، أود الاستفسار عن خدماتكم.'
                   : 'Hello Jusor, I would like to inquire about your services.');

    setWhatsappData({
      phoneNumber,
      message
    });
  }, [siteSettings, locale]);

  // Don't render if no WhatsApp data
  if (!whatsappData) {
    return null;
  }

  return (
    <WhatsAppFloatingButton 
      phoneNumber={whatsappData.phoneNumber}
      message={whatsappData.message}
    />
  );
}