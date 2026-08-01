'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { trackWhatsAppClick as trackWhatsAppEvent } from '@/lib/analytics-events';
import { trackWhatsAppClick } from '@/components/analytics';
import { useLanguage } from '@/components/providers/LanguageProvider';

interface WhatsAppFloatingButtonProps {
  phoneNumber: string;
  message?: string;
  className?: string;
}

export function WhatsAppFloatingButton({ 
  phoneNumber, 
  message = 'Hello, I would like to inquire about your services.',
  className 
}: WhatsAppFloatingButtonProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const { locale, isRtl } = useLanguage();

  const text = {
    en: {
      title: 'Jusor Translation',
      status: 'Typically replies instantly',
      message: "Hi there! 👋 Need help with translation services? We're here to assist you.",
      button: 'Start Chat',
      close: 'Close WhatsApp message',
      tooltip: 'Chat with us on WhatsApp',
      ariaLabel: 'Contact us on WhatsApp'
    },
    ar: {
      title: 'جسور للترجمة',
      status: 'يجيب عادةً فوراً',
      message: 'مرحباً بك! 👋 هل تحتاج إلى مساعدة في خدمات الترجمة؟ نحن هنا لمساعدتك.',
      button: 'ابدأ المحادثة',
      close: 'إغلاق رسالة واتساب',
      tooltip: 'تحدث معنا عبر واتساب',
      ariaLabel: 'تواصل معنا عبر واتساب'
    }
  }[locale] || {
    title: 'Jusor Translation',
    status: 'Typically replies instantly',
    message: "Hi there! 👋 Need help with translation services? We're here to assist you.",
    button: 'Start Chat',
    close: 'Close WhatsApp message',
    tooltip: 'Chat with us on WhatsApp',
    ariaLabel: 'Contact us on WhatsApp'
  };

  useEffect(() => {
    // Show button after a delay to avoid being intrusive
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    // Check if user has scrolled to show the button
    const handleScroll = () => {
      const scrolled = window.scrollY > 300;
      setIsVisible(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    // Auto-expand after showing for a few seconds, but only once
    if (isVisible && !hasInteracted) {
      const expandTimer = setTimeout(() => {
        setIsExpanded(true);
        // Auto-collapse after showing the message
        setTimeout(() => {
          setIsExpanded(false);
        }, 5000);
      }, 2000);

      return () => clearTimeout(expandTimer);
    }
  }, [isVisible, hasInteracted]);

  const handleClick = () => {
    setHasInteracted(true);
    
    // Track WhatsApp click in existing analytics
    trackWhatsAppEvent(phoneNumber, 'floating_button');
    
    // Track in Google Ads
    trackWhatsAppClick();
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const handleToggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHasInteracted(true);
    setIsExpanded(!isExpanded);
  };

  if (!isVisible) return null;

  return (
    <div 
      className={cn(
        'fixed bottom-4 z-50 transition-all duration-300 ease-in-out',
        isRtl ? 'left-4 sm:left-6' : 'right-4 sm:right-6',
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0',
        className
      )}
      role="complementary"
      aria-label={text.ariaLabel}
    >
      {/* Expanded message bubble */}
      <div 
        className={cn(
          'mb-3 transition-all duration-300 ease-in-out',
          isRtl ? 'ml-2' : 'mr-2',
          'max-w-[280px] sm:max-w-xs', // Better mobile width control
          isExpanded 
            ? 'translate-y-0 opacity-100 scale-100' 
            : 'translate-y-4 opacity-0 scale-95 pointer-events-none'
        )}
      >
        <div className="relative bg-white rounded-lg shadow-lg border border-gray-200 p-3 sm:p-4">
          {/* Close button */}
          <button
            onClick={handleToggleExpand}
            className={cn(
              "absolute -top-2 w-6 h-6 bg-gray-500 hover:bg-gray-600 text-white rounded-full flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2",
              isRtl ? "-left-2" : "-right-2"
            )}
            aria-label={text.close}
          >
            <X className="w-3 h-3" />
          </button>
          
          {/* Message content */}
          <div className={isRtl ? "pl-3 sm:pl-4 text-right" : "pr-3 sm:pr-4 text-left"}>
            <div className={cn("flex items-center mb-2", isRtl && "flex-row-reverse")}>
              <div className={cn("w-8 h-8 bg-green-500 rounded-full flex items-center justify-center", isRtl ? "ml-2" : "mr-2")}>
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <div className={isRtl ? "text-right" : "text-left"}>
                <p className="font-semibold text-gray-900 text-sm">{text.title}</p>
                <p className="text-xs text-gray-600">{text.status}</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-3 leading-relaxed">
              {text.message}
            </p>
            <button
              onClick={handleClick}
              className="w-full bg-green-700 hover:bg-green-800 text-white text-sm font-medium py-2 px-3 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
            >
              {text.button}
            </button>
          </div>
          
          {/* Speech bubble tail */}
          <div className={cn("absolute bottom-0 transform translate-y-full", isRtl ? "left-6" : "right-6")}>
            <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white"></div>
          </div>
        </div>
      </div>

      {/* Main WhatsApp button */}
      <button
        onClick={handleClick}
        onMouseEnter={() => !hasInteracted && setIsExpanded(true)}
        onMouseLeave={() => !hasInteracted && setTimeout(() => setIsExpanded(false), 1000)}
        className={cn(
          'group relative w-12 h-12 sm:w-14 sm:h-14 bg-green-700 hover:bg-green-800 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-green-400 focus:ring-opacity-50',
          'flex items-center justify-center',
          'animate-gentle-bounce hover:animate-none'
        )}
        aria-label={text.ariaLabel}
        title={text.tooltip}
      >
        <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
        
        {/* Subtle glow effect */}
        <div className="absolute inset-0 rounded-full bg-green-400 opacity-0 group-hover:opacity-20 animate-gentle-glow"></div>
        
        {/* Online indicator */}
        <div className={cn("absolute -top-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full", isRtl ? "-left-1" : "-right-1")}>
          <div className="w-full h-full bg-green-400 rounded-full animate-gentle-pulse"></div>
        </div>
      </button>

      {/* Tooltip for desktop */}
      <div className={cn("absolute bottom-full mb-2 hidden lg:group-hover:block", isRtl ? "left-0" : "right-0")}>
        <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
          {text.tooltip}
          <div className={cn("absolute top-full transform -translate-x-1/2", isRtl ? "left-4" : "right-4")}>
            <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
          </div>
        </div>
      </div>
    </div>
  );
}