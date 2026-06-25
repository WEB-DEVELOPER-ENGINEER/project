'use client';

import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  /** Size variant for the logo */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Whether the logo should be a clickable link to home */
  asLink?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Whether to show only the icon or include text */
  variant?: 'icon' | 'full' | 'text';
  /** Custom width override */
  width?: number;
  /** Custom height override */
  height?: number;
  /** Priority loading for above-the-fold logos */
  priority?: boolean;
  /** Company name for fallback text */
  companyName?: string;
  /** Logo text from settings */
  logoText?: string;
}

const sizeConfig = {
  sm: { width: 48, height: 35, textSize: 'text-lg' },
  md: { width: 64, height: 46, textSize: 'text-xl' },
  lg: { width: 96, height: 69, textSize: 'text-2xl' },
  xl: { width: 128, height: 93, textSize: 'text-3xl' },
};

export function Logo({
  size = 'md',
  asLink = true,
  className,
  variant = 'full',
  width,
  height,
  priority = false,
  companyName = 'Jusor',
  logoText,
}: LogoProps) {
  const config = sizeConfig[size];
  const logoWidth = width || config.width;
  const logoHeight = height || config.height;
  const displayText = logoText || companyName;

  const LogoImage = () => (
    <Image
      src="/jusor.png"
      alt={`${companyName} Logo`}
      width={logoWidth}
      height={logoHeight}
      priority={priority}
      className={cn(
        'object-contain transition-all duration-200',
        // Use height-based responsive sizing to maintain aspect ratio
        className
      )}
      sizes={`(max-width: 640px) ${Math.floor(logoWidth * 0.75)}px, (max-width: 768px) ${Math.floor(logoWidth * 0.85)}px, ${logoWidth}px`}
      style={{
        height: `${logoHeight}px`,
        width: 'auto',
        maxHeight: '100%',
        objectFit: 'contain'
      }}
    />
  );

  const LogoText = () => (
    <span className={cn(
      'font-bold text-brand-orange',
      config.textSize,
      className
    )}>
      {displayText}
    </span>
  );

  const LogoContent = () => {
    switch (variant) {
      case 'icon':
        return <LogoImage />;
      case 'text':
        return <LogoText />;
      case 'full':
      default:
        return (
          <div className="flex items-center gap-3">
            <LogoImage />
            {size !== 'sm' && <LogoText />}
          </div>
        );
    }
  };

  if (asLink) {
    return (
      <Link
        href="/"
        className={cn(
          'inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 rounded-md',
          className
        )}
        aria-label={`${companyName} - Go to homepage`}
      >
        <LogoContent />
      </Link>
    );
  }

  return (
    <div className={cn('inline-flex items-center', className)}>
      <LogoContent />
    </div>
  );
}

// Specialized logo components for common use cases
export function HeaderLogo({ 
  siteSettings, 
  className,
  priority = true 
}: { 
  siteSettings?: Record<string, any>;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Logo
      size="md"
      variant="icon"
      priority={priority}
      companyName={siteSettings?.company_name}
      logoText={siteSettings?.logo_text}
      className={cn(
        'h-8 sm:h-10 md:h-12 w-auto max-h-full',
        className
      )}
    />
  );
}

export function FooterLogo({ 
  siteSettings, 
  className 
}: { 
  siteSettings?: Record<string, any>;
  className?: string;
}) {
  return (
    <Logo
      size="sm"
      variant="full"
      companyName={siteSettings?.company_name}
      logoText={siteSettings?.logo_text}
      className={cn(
        'h-6 sm:h-8 w-auto max-h-full',
        className
      )}
    />
  );
}

export function MobileLogo({ 
  siteSettings, 
  className 
}: { 
  siteSettings?: Record<string, any>;
  className?: string;
}) {
  return (
    <Logo
      size="sm"
      variant="icon"
      companyName={siteSettings?.company_name}
      logoText={siteSettings?.logo_text}
      className={cn(
        'h-8 w-auto max-h-full',
        className
      )}
    />
  );
}