
import React from 'react';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { cn } from '@/lib/utils';

interface AnimatedSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  animation?: 'fade-up' | 'fade-in' | 'slide-in-right' | 'none';
}

export default function AnimatedSection({
  children,
  delay = 0,
  className,
  animation = 'fade-up',
  ...props
}: AnimatedSectionProps) {
  const { ref, isVisible } = useScrollAnimation({
    delay: delay,
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  });

  const animationClasses = {
    'fade-up': 'transition-all duration-600 ease-out transform',
    'fade-in': 'transition-all duration-600 ease-out',
    'slide-in-right': 'transition-all duration-600 ease-out transform',
    'none': ''
  };

  const initialStyles = {
    'fade-up': !isVisible ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0',
    'fade-in': !isVisible ? 'opacity-0' : 'opacity-100',
    'slide-in-right': !isVisible ? 'opacity-0 translate-x-8' : 'opacity-100 translate-x-0',
    'none': ''
  };

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={cn(
        animationClasses[animation],
        initialStyles[animation],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
