'use client';

import { Button } from '@/components/ui/button';
import { ButtonProps } from '@/components/ui/button';

interface MailtoButtonProps extends Omit<ButtonProps, 'onClick'> {
  email: string;
  subject?: string;
  body?: string;
  children: React.ReactNode;
}

export function MailtoButton({ 
  email, 
  subject,
  body,
  children, 
  className,
  variant = 'default',
  size = 'default',
  ...props 
}: MailtoButtonProps) {
  const handleClick = () => {
    let mailtoUrl = `mailto:${email}`;
    const params = new URLSearchParams();
    
    if (subject) params.append('subject', subject);
    if (body) params.append('body', body);
    
    const queryString = params.toString();
    if (queryString) {
      mailtoUrl += `?${queryString}`;
    }
    
    window.location.href = mailtoUrl;
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
