'use client';

import { Button } from '@/components/ui/button';
import { ButtonProps } from '@/components/ui/button';

interface ScrollToButtonProps extends Omit<ButtonProps, 'onClick'> {
  targetId: string;
  children: React.ReactNode;
}

export function ScrollToButton({ 
  targetId, 
  children, 
  className,
  variant = 'default',
  size = 'default',
  ...props 
}: ScrollToButtonProps) {
  const handleClick = () => {
    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
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
