'use client';

import { Button } from '@/components/ui/button';
import { ButtonProps } from '@/components/ui/button';

interface NavigateButtonProps extends Omit<ButtonProps, 'onClick'> {
  href: string;
  children: React.ReactNode;
  openInNewTab?: boolean;
}

export function NavigateButton({ 
  href, 
  children, 
  openInNewTab = false,
  className,
  variant = 'default',
  size = 'default',
  ...props 
}: NavigateButtonProps) {
  const handleClick = () => {
    if (openInNewTab) {
      window.open(href, '_blank');
    } else {
      window.location.href = href;
    }
  };

  return (
    <Button 
      onClick={handleClick}
      className={className}
      variant={variant}
      size={size}
      {...props}
    >
      {children}
    </Button>
  );
}
